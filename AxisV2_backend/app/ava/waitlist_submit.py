"""
Waitlist Submission Helper
Writes collected caller data to Google Sheets and sends a booking email with Calendly link.
Used by the voice handler after Ava collects name, email, role, clinic name, and preferred time.
"""

import os
import ssl
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

logger = logging.getLogger("ava.waitlist")

# Google Sheets config
_sheets_client = None


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
]


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

        # Column 7 = "Preferred Call Time" (1-indexed)
        all_values = worksheet.col_values(7)
        # Skip header row, filter empty and "declined" entries
        slots = [
            v for v in all_values[1:]
            if v and "declined" not in v.lower()
        ]
        logger.info(f"Found {len(slots)} booked slots in Google Sheets")
        return slots

    except Exception as e:
        logger.error(f"Error reading booked slots: {e}", exc_info=True)
        return []


async def submit_to_waitlist(data: dict, phone: str = "") -> bool:
    """
    Write caller data to Google Sheets and send booking email with Calendly link.

    Args:
        data: Dict with keys: fullName, email, role, clinicName, preferredTime
        phone: Caller's phone number (from Twilio)

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

    # 1) Write to Google Sheets
    sheets_ok = _write_to_sheets(full_name, email, phone, role, clinic_name, preferred_time, best_phone)

    # 2) Send confirmation email
    if email:
        _send_confirmation_email(full_name, email, preferred_time, clinic_name)

    return sheets_ok


def _write_to_sheets(full_name, email, phone, role, clinic_name, preferred_time, best_phone="") -> bool:
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
            worksheet = spreadsheet.add_worksheet(title="Ava Calls", rows=1000, cols=10)

        # Ensure headers
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
        ]

        worksheet.append_row(row, value_input_option="USER_ENTERED")
        logger.info(f"Waitlist submission saved for {email}")
        return True

    except Exception as e:
        logger.error(f"Error writing to Google Sheets: {e}", exc_info=True)
        return False


def _send_confirmation_email(full_name: str, to_email: str, preferred_time: str, clinic_name: str):
    """Send a simple confirmation email — no links, just name + clinic + date/time."""
    smtp_email = os.getenv("SMTP_EMAIL", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))

    if not all([smtp_email, smtp_password]):
        logger.warning("SMTP not configured — skipping confirmation email")
        return

    first_name = full_name.split()[0] if full_name else "there"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Confirmed: Your Axis Demo — {preferred_time}"
    msg["From"] = f"Axis <{smtp_email}>"
    msg["To"] = to_email
    msg["Reply-To"] = "sales@useaxis.app"

    # Plain text fallback
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

Need to reschedule? Just reply to this email.

See you soon,
The Axis Team
"""

    # HTML email template
    html = f"""\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header with Logo -->
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

              <!-- Appointment Details Card -->
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

              <!-- Divider -->
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
                Need to reschedule? Just reply to this email.
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
