"""
Waitlist Submission Helper
Writes collected caller data directly to Google Sheets.
Used by the voice handler after Ava collects name, email, role, clinic name, and preferred time.
"""

import os
import logging
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
    "Source",
]


async def submit_to_waitlist(data: dict, phone: str = "") -> bool:
    """
    Write caller data directly to the 'Ava Calls' sheet in Google Sheets.

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

    logger.info(f"Submitting waitlist: {full_name} ({email}), clinic={clinic_name}, time={preferred_time}")

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

        row = [
            timestamp,
            full_name,
            email,
            phone_value,
            role,
            clinic_name,
            preferred_time,
            "voice-call",
        ]

        worksheet.append_row(row, value_input_option="USER_ENTERED")
        logger.info(f"Waitlist submission saved for {email}")
        return True

    except Exception as e:
        logger.error(f"Error writing to Google Sheets: {e}", exc_info=True)
        return False
