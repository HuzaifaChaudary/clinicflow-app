"""
Waitlist Submission Helper
Writes collected caller data to Google Sheets, creates a Cal.com booking,
and sends a confirmation email with the Cal.com link.
Used by the voice handler after Ava collects name, email, role, clinic name, and preferred time.
"""
from __future__ import annotations

import os
import ssl
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Optional
from zoneinfo import ZoneInfo

import httpx

logger = logging.getLogger("ava.waitlist")

# Google Sheets config
_sheets_client = None

CAL_BOOKING_URL = "https://cal.com/axis-founders/15min"


def _get_sheets_client():
    """Lazy-init Google Sheets client. Returns (client, spreadsheet) or (None, None)."""
    global _sheets_client
    if _sheets_client is not None:
        return _sheets_client

    spreadsheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")
    service_email = os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "")
    private_key_raw = os.getenv("GOOGLE_PRIVATE_KEY", "")
    project_id = os.getenv("GOOGLE_PROJECT_ID", "")

    if not all([spreadsheet_id, service_email, private_key_raw, project_id]):
        logger.warning("Google Sheets credentials not fully configured")
        _sheets_client = (None, None)
        return _sheets_client

    try:
        import gspread
        from google.oauth2.service_account import Credentials

        private_key = private_key_raw.replace("\\n", "\n")
        scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive",
        ]
        creds = Credentials.from_service_account_info(
            {
                "type": "service_account",
                "project_id": project_id,
                "private_key": private_key,
                "client_email": service_email,
                "token_uri": "https://oauth2.googleapis.com/token",
            },
            scopes=scopes,
        )
        client = gspread.authorize(creds)
        spreadsheet = client.open_by_key(spreadsheet_id)
        _sheets_client = (client, spreadsheet)
        logger.info("Google Sheets connected successfully")
    except Exception as e:
        logger.error(f"Failed to init Google Sheets: {e}", exc_info=True)
        _sheets_client = (None, None)

    return _sheets_client


WAITLIST_HEADERS = [
    "Timestamp",
    "Full Name",
    "Email",
    "Phone",
    "Role",
    "Clinic Name",
    "Preferred Call Time",
    "Best Phone To Reach",
    "Source",
    "Cal.com Booking",
    "Transcript",
]


def save_transcript(phone: str, transcript: str) -> bool:
    """
    Find the most recent row matching this phone number and write the transcript.
    Called from the call_ended webhook after the full transcript is available.
    """
    _, spreadsheet = _get_sheets_client()
    if spreadsheet is None:
        logger.warning("Google Sheets not available — cannot save transcript")
        return False

    if not transcript:
        return False

    try:
        import gspread

        try:
            worksheet = spreadsheet.worksheet("Ava Calls")
        except gspread.WorksheetNotFound:
            return False

        # Find the row by phone number (column 4) — search from bottom up for most recent
        phone_col = worksheet.col_values(4)
        target_row = None
        clean_phone = phone.replace("'", "")
        for i in range(len(phone_col) - 1, 0, -1):
            cell_val = phone_col[i].replace("'", "")
            if cell_val == clean_phone:
                target_row = i + 1  # 1-indexed
                break

        if target_row is None:
            logger.warning(f"No row found for phone {phone} — cannot save transcript")
            return False

        # Transcript column is 11 (K) — expand sheet if needed
        if worksheet.col_count < 11:
            worksheet.resize(cols=12)
            worksheet.update_cell(1, 11, "Transcript")
        worksheet.update_cell(target_row, 11, transcript)
        logger.info(f"Transcript saved for phone {phone} (row {target_row})")
        return True

    except Exception as e:
        logger.error(f"Error saving transcript: {e}", exc_info=True)
        return False


def get_booked_slots() -> list[str]:
    """Read the 'Preferred Call Time' column from Google Sheets to find already-booked slots."""
    _, spreadsheet = _get_sheets_client()
    if spreadsheet is None:
        logger.warning("Google Sheets not available — cannot read booked slots")
        return []

    try:
        import gspread

        try:
            worksheet = spreadsheet.worksheet("Ava Calls")
        except gspread.WorksheetNotFound:
            return []

        all_values = worksheet.col_values(7)
        slots = [
            v for v in all_values[1:]
            if v and "declined" not in v.lower()
        ]
        logger.info(f"Found {len(slots)} booked slots in Google Sheets")
        return slots

    except Exception as e:
        logger.error(f"Error reading booked slots: {e}", exc_info=True)
        return []


# ──────────────────────────────────────────────
# CAL.COM API INTEGRATION
# ──────────────────────────────────────────────
def _parse_preferred_time(preferred_time: str) -> Optional[datetime]:
    """
    Attempt to parse the preferred_time string into a datetime.
    Handles formats like:
      - "Wednesday, February 19 at 10:00 AM Eastern"
      - "February 19, 2026 at 2:30 PM"
      - "Thursday at 3:00 PM"
    Returns None if parsing fails.
    """
    import re

    if not preferred_time or "declined" in preferred_time.lower():
        return None

    eastern = ZoneInfo("America/New_York")
    now = datetime.now(tz=eastern)
    clean = preferred_time.strip()

    # Try common formats
    formats = [
        "%A, %B %d at %I:%M %p",       # Wednesday, February 19 at 10:00 AM
        "%B %d at %I:%M %p",           # February 19 at 10:00 AM
        "%A, %B %d, %Y at %I:%M %p",   # Wednesday, February 19, 2026 at 10:00 AM
        "%B %d, %Y at %I:%M %p",       # February 19, 2026 at 10:00 AM
    ]

    # Strip timezone suffix
    clean_no_tz = re.sub(r'\s*(Eastern|EST|EDT|ET)\s*$', '', clean, flags=re.IGNORECASE)

    for fmt in formats:
        try:
            parsed = datetime.strptime(clean_no_tz, fmt)
            if parsed.year == 1900:
                parsed = parsed.replace(year=now.year)
            return parsed.replace(tzinfo=eastern)
        except ValueError:
            continue

    logger.warning(f"Could not parse preferred_time: '{preferred_time}'")
    return None


async def _create_cal_booking(
    full_name: str,
    email: str,
    preferred_time: str,
    clinic_name: str = "",
) -> Optional[str]:
    """
    Create a booking on Cal.com via their API.
    Returns the booking URL if successful, None otherwise.
    """
    cal_api_key = os.getenv("CAL_API_KEY", "")
    cal_event_type_id = os.getenv("CAL_EVENT_TYPE_ID", "")

    if not cal_api_key or not cal_event_type_id:
        logger.warning("Cal.com API not configured (CAL_API_KEY or CAL_EVENT_TYPE_ID missing)")
        return None

    parsed_time = _parse_preferred_time(preferred_time)
    if not parsed_time:
        logger.warning(f"Cannot create Cal.com booking — could not parse time: {preferred_time}")
        return None

    # Convert to ISO format for Cal.com API
    start_iso = parsed_time.isoformat()

    try:
        event_type_id = int(cal_event_type_id)
    except ValueError:
        logger.error(f"CAL_EVENT_TYPE_ID is not a valid integer: {cal_event_type_id}")
        return None

    payload = {
        "eventTypeId": event_type_id,
        "start": start_iso,
        "responses": {
            "name": full_name,
            "email": email,
            "notes": f"Clinic: {clinic_name}" if clinic_name else "",
        },
        "metadata": {
            "source": "ava-voice-call",
            "clinic": clinic_name,
        },
        "timeZone": "America/New_York",
        "language": "en",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                f"https://api.cal.com/v1/bookings?apiKey={cal_api_key}",
                json=payload,
                headers={"Content-Type": "application/json"},
            )

            if resp.status_code in (200, 201):
                data = resp.json()
                booking_uid = data.get("uid", "")
                booking_id = data.get("id", "")
                logger.info(
                    f"Cal.com booking created: id={booking_id}, uid={booking_uid}, "
                    f"time={preferred_time}, email={email}"
                )
                return f"https://cal.com/booking/{booking_uid}" if booking_uid else CAL_BOOKING_URL
            else:
                logger.error(
                    f"Cal.com booking failed: status={resp.status_code}, "
                    f"body={resp.text[:500]}"
                )
                return None

    except Exception as e:
        logger.error(f"Cal.com API error: {e}", exc_info=True)
        return None


async def submit_to_waitlist(data: dict, phone: str = "") -> bool:
    """
    Write caller data to Google Sheets, create Cal.com booking,
    and send confirmation email.

    Args:
        data: Dict with keys: fullName, email, role, clinicName, preferredTime
        phone: Caller's phone number

    Returns:
        True if write succeeded, False otherwise.
    """
    full_name = data.get("fullName", "")
    email = data.get("email", "")
    role = data.get("role", "")
    clinic_name = data.get("clinicName", "")
    preferred_time = data.get("preferredTime", "")
    best_phone = data.get("bestPhone", "")

    logger.info(f"Submitting waitlist: {full_name} ({email}), clinic={clinic_name}, time={preferred_time}")

    # 1) Try to create Cal.com booking
    cal_booking_url = await _create_cal_booking(full_name, email, preferred_time, clinic_name)
    if cal_booking_url:
        logger.info(f"Cal.com booking created: {cal_booking_url}")
    else:
        logger.info("Cal.com booking skipped or failed — continuing with sheet + email")
        cal_booking_url = ""

    # 2) Write to Google Sheets
    sheets_ok = _write_to_sheets(
        full_name, email, phone, role, clinic_name,
        preferred_time, best_phone, cal_booking_url,
    )

    # 3) Send confirmation email
    if email:
        _send_confirmation_email(full_name, email, preferred_time, clinic_name, cal_booking_url)

    return sheets_ok


def _write_to_sheets(
    full_name, email, phone, role, clinic_name,
    preferred_time, best_phone="", cal_booking_url="",
) -> bool:
    """Write a row to the Ava Calls sheet."""
    _, spreadsheet = _get_sheets_client()
    if spreadsheet is None:
        logger.error("Google Sheets not available — cannot save submission")
        return False

    try:
        import gspread

        try:
            worksheet = spreadsheet.worksheet("Ava Calls")
        except gspread.WorksheetNotFound:
            worksheet = spreadsheet.add_worksheet(title="Ava Calls", rows=1000, cols=11)

        try:
            existing = worksheet.row_values(1)
            if not existing or existing != WAITLIST_HEADERS:
                worksheet.update("A1", [WAITLIST_HEADERS])
        except Exception:
            worksheet.update("A1", [WAITLIST_HEADERS])

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        phone_value = f"'{phone}" if phone else ""
        best_phone_value = f"'{best_phone}" if best_phone else ""

        row = [
            timestamp,
            full_name,
            email,
            phone_value,
            role,
            clinic_name,
            preferred_time,
            best_phone_value,
            "voice-call",
            cal_booking_url,
        ]

        worksheet.append_row(row, value_input_option="USER_ENTERED")
        logger.info(f"Waitlist submission saved for {email}")
        return True

    except Exception as e:
        logger.error(f"Error writing to Google Sheets: {e}", exc_info=True)
        return False


def _send_confirmation_email(
    full_name: str,
    to_email: str,
    preferred_time: str,
    clinic_name: str,
    cal_booking_url: str = "",
):
    """Send a confirmation email with Cal.com booking link."""
    smtp_email = os.getenv("SMTP_EMAIL", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))

    if not all([smtp_email, smtp_password]):
        logger.warning("SMTP not configured — skipping confirmation email")
        return

    first_name = full_name.split()[0] if full_name else "there"

    reschedule_url = cal_booking_url or CAL_BOOKING_URL

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Confirmed: Your Axis Demo — {preferred_time}"
    msg["From"] = f"Axis <{smtp_email}>"
    msg["To"] = to_email
    msg["Reply-To"] = "sales@useaxis.app"

    text = f"""Hi {first_name},

Your demo with the Axis founders is confirmed!

Name: {full_name}
Clinic: {clinic_name}
Date & Time: {preferred_time}
Duration: 15 minutes

What to expect:
- Live walkthrough tailored to your role
- Q&A — pricing, integrations, anything you need
- No commitment, no pressure

Need to reschedule? Use this link: {reschedule_url}
Or reply to this email.

See you soon,
The Axis Team
"""

    html = f"""\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#2563EB; padding: 32px 40px; text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding-right: 10px; vertical-align: middle;">
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 22 L46 22" stroke="#ffffff" stroke-width="2.5" stroke-linecap="square"/>
                      <path d="M28 6 L28 38" stroke="#ffffff" stroke-width="2.5" stroke-linecap="square"/>
                      <path d="M12 32 L36 14" stroke="#ffffff" stroke-width="2" stroke-linecap="square"/>
                      <rect x="26" y="20" width="4" height="4" fill="#ffffff"/>
                    </svg>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="color:#ffffff; font-size:24px; font-weight:700; letter-spacing:1px;">AXIS</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin:0 0 8px 0; font-size:22px; color:#111827; font-weight:600;">
                Your demo is confirmed
              </h1>
              <p style="margin:0 0 28px 0; font-size:15px; color:#6b7280; line-height:1.5;">
                Hi {first_name}, you're all set! Here are your details.
              </p>

              <!-- Appointment Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff; border-radius:8px; margin-bottom:28px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="margin:0 0 4px 0; font-size:12px; color:#2563EB; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Name</p>
                          <p style="margin:0; font-size:16px; color:#1e40af; font-weight:600;">{full_name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="margin:0 0 4px 0; font-size:12px; color:#2563EB; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Clinic</p>
                          <p style="margin:0; font-size:16px; color:#1e40af; font-weight:500;">{clinic_name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="margin:0 0 4px 0; font-size:12px; color:#2563EB; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Date & Time</p>
                          <p style="margin:0; font-size:18px; color:#1e40af; font-weight:600;">{preferred_time}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin:0 0 4px 0; font-size:12px; color:#2563EB; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Duration</p>
                          <p style="margin:0; font-size:16px; color:#1e40af; font-weight:500;">15 minutes</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Reschedule Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="{reschedule_url}" style="display:inline-block; padding:12px 28px; background-color:#2563EB; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; border-radius:8px;">
                      Reschedule or Cancel
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0 0 24px 0;">

              <!-- What to expect -->
              <p style="margin:0 0 12px 0; font-size:13px; color:#6b7280; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">What to expect</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#374151;">&#10003;&nbsp;&nbsp;Live walkthrough tailored to your role</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#374151;">&#10003;&nbsp;&nbsp;Q&A — pricing, integrations, anything</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#374151;">&#10003;&nbsp;&nbsp;No commitment, no pressure</td>
                </tr>
              </table>

              <p style="margin:0; font-size:14px; color:#6b7280; line-height:1.5;">
                Questions? Reply to this email or call us at (628) 200-4122.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding: 24px 40px; text-align:center; border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 4px 0; font-size:13px; color:#9ca3af;">
                Axis — The clinic operating system
              </p>
              <p style="margin:0; font-size:13px;">
                <a href="https://useaxis.app" style="color:#2563EB; text-decoration:none;">useaxis.app</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:sales@useaxis.app" style="color:#2563EB; text-decoration:none;">sales@useaxis.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, to_email, msg.as_string())
        logger.info(f"Confirmation email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send confirmation email to {to_email}: {e}", exc_info=True)
