import gspread
import os
import ssl
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from google.oauth2.service_account import Credentials
from datetime import datetime
from typing import Dict, Any
import json

from app.config import settings
from app.schemas import WaitlistSubmission, ContactSubmission

logger = logging.getLogger("waitlist.email")


class GoogleSheetsService:
    def __init__(self):
        self.client = None
        self.spreadsheet = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Google Sheets client"""
        # Check if required credentials are available
        if not settings.GOOGLE_SHEETS_SPREADSHEET_ID:
            print("Warning: GOOGLE_SHEETS_SPREADSHEET_ID not set. Google Sheets functionality disabled.")
            self.client = None
            self.spreadsheet = None
            return
        
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        try:
            # Try using service account file first
            if settings.GOOGLE_SERVICE_ACCOUNT_FILE:
                credentials = Credentials.from_service_account_file(
                    settings.GOOGLE_SERVICE_ACCOUNT_FILE,
                    scopes=scopes
                )
            elif settings.GOOGLE_PRIVATE_KEY and settings.GOOGLE_SERVICE_ACCOUNT_EMAIL:
                # Use environment variables
                service_account_info = {
                    "type": "service_account",
                    "project_id": settings.GOOGLE_PROJECT_ID,
                    "private_key": settings.GOOGLE_PRIVATE_KEY,
                    "client_email": settings.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
                credentials = Credentials.from_service_account_info(
                    service_account_info,
                    scopes=scopes
                )
            else:
                print("Warning: Google Sheets credentials not configured. Google Sheets functionality disabled.")
                self.client = None
                self.spreadsheet = None
                return
            
            self.client = gspread.authorize(credentials)
            self.spreadsheet = self.client.open_by_key(settings.GOOGLE_SHEETS_SPREADSHEET_ID)
            print("Google Sheets connected successfully")
        except Exception as e:
            print(f"Warning: Failed to initialize Google Sheets: {e}. Google Sheets functionality disabled.")
            self.client = None
            self.spreadsheet = None
    
    def _ensure_headers(self, worksheet):
        """Ensure the worksheet has the correct headers"""
        headers = [
            "Timestamp",
            "Full Name",
            "Email",
            "Phone",
            "Role",
            "Owner Email",
            "Clinic Name",
            "Clinic Type",
            "Other Clinic Type",
            "Clinic Size",
            "Number of Doctors",
            "Number of Locations",
            "Doctor Emails",
            "Location Addresses",
            "Pain Points",
            "Current Setup",
            "Impact Level",
            "Willingness to Pay",
            "Price Range",
            "Solution Wins",
            "Other Wish"
        ]
        
        # Check if first row is empty or doesn't have headers
        try:
            existing_headers = worksheet.row_values(1)
            if not existing_headers or existing_headers != headers:
                worksheet.update('A1', [headers])
        except Exception:
            worksheet.update('A1', [headers])
        
        # Always format phone column (column D) as text to prevent number conversion
        try:
            worksheet.format('D:D', {'numberFormat': {'type': 'TEXT'}})
        except Exception as e:
            print(f"Warning: Could not format phone column: {e}")
    
    def _get_clinic_type_label(self, value: str) -> str:
        """Convert clinic type value to readable label"""
        labels = {
            'primary-care': 'Primary care',
            'specialty': 'Specialty clinic',
            'dental': 'Dental',
            'physical-therapy': 'Physical therapy',
            'mental-health': 'Mental health',
            'other': 'Other'
        }
        return labels.get(value, value)
    
    def _get_clinic_size_label(self, value: str) -> str:
        """Convert clinic size value to readable label"""
        labels = {
            'solo': 'Solo provider',
            '2-5': '2 to 5',
            '6-10': '6 to 10',
            '10plus': '10+'
        }
        return labels.get(value, value)
    
    def _get_pain_points_labels(self, values: list) -> str:
        """Convert pain point values to readable labels"""
        labels = {
            'no-shows': 'No-shows or last-minute cancellations',
            'phone-calls': 'Too many phone calls',
            'manual-scheduling': 'Manual scheduling or rescheduling',
            'intake-forms': 'Chasing intake forms',
            'admin-burnout': 'Admin burnout',
            'doctor-admin': 'Doctors spending time on admin work',
            'follow-ups': 'Follow-ups slipping through the cracks'
        }
        return ', '.join([labels.get(v, v) for v in values])
    
    def _get_current_setup_label(self, value: str) -> str:
        """Convert current setup value to readable label"""
        labels = {
            'front-desk': 'Front desk + phone calls',
            'simple-tool': 'Simple scheduling tool',
            'ehr': 'EHR scheduling',
            'mix': 'Mix of tools',
            'messy': 'Not sure / messy setup'
        }
        return labels.get(value, value)
    
    def _get_impact_level_label(self, value: str) -> str:
        """Convert impact level value to readable label"""
        labels = {
            'not-big': 'Not a big issue',
            'somewhat': 'Somewhat painful',
            'frustrating': 'Actively frustrating',
            'hurting': 'Hurting revenue or staff morale'
        }
        return labels.get(value, value)
    
    def _get_willingness_label(self, value: str) -> str:
        """Convert willingness to pay value to readable label"""
        labels = {
            'yes': 'Yes, definitely',
            'possibly': 'Possibly, depending on price',
            'not-now': 'Not right now',
            'exploring': 'Just exploring'
        }
        return labels.get(value, value)
    
    def _get_solution_wins_labels(self, values: list) -> str:
        """Convert solution wins values to readable labels"""
        labels = {
            'fewer-no-shows': 'Fewer no-shows',
            'less-admin': 'Less admin work for staff',
            'prepared-visits': 'Doctors starting visits more prepared',
            'better-followups': 'Better follow-ups',
            'fewer-missed-calls': 'Fewer missed calls',
            'visibility': 'Clear visibility into clinic performance'
        }
        return ', '.join([labels.get(v, v) for v in values])
    
    def _get_role_label(self, value: str) -> str:
        """Convert role value to readable label"""
        labels = {
            'owner': 'Clinic Owner',
            'admin': 'Administrative Assistant',
            'practice-manager': 'Practice Manager',
            'operations-manager': 'Operations Manager',
            'cto': 'CTO / IT Director'
        }
        return labels.get(value, value)
    
    async def add_waitlist_submission(self, submission: WaitlistSubmission) -> bool:
        """Add a new waitlist submission to Google Sheets"""
        if not self.client or not self.spreadsheet:
            raise Exception("Google Sheets is not configured. Please set up Google Sheets credentials.")
        
        try:
            # Get or create the waitlist worksheet
            try:
                worksheet = self.spreadsheet.worksheet("Waitlist")
            except gspread.WorksheetNotFound:
                worksheet = self.spreadsheet.add_worksheet(title="Waitlist", rows=1000, cols=20)
            
            # Ensure headers exist
            self._ensure_headers(worksheet)
            
            # Format the data
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Store phone number exactly as entered, but prefix with ' to force text format
            # The single quote forces Google Sheets to treat it as text (won't show in cell)
            phone_value = submission.phone or ""
            if phone_value:
                # Prefix with single quote to force text format (prevents number conversion)
                # The quote is invisible in the cell display, only in formula bar
                phone_value = f"'{phone_value}"
            
            row_data = [
                timestamp,
                submission.fullName,
                submission.email,
                phone_value,
                self._get_role_label(submission.role),
                submission.ownerEmail or "",
                submission.clinicName,
                self._get_clinic_type_label(submission.clinicType),
                submission.otherClinicType or "",
                self._get_clinic_size_label(submission.clinicSize),
                submission.numberOfDoctors or "",
                submission.numberOfLocations or "",
                submission.doctorEmails or "",
                submission.locationAddresses or "",
                self._get_pain_points_labels(submission.painPoints),
                self._get_current_setup_label(submission.currentSetup),
                self._get_impact_level_label(submission.impactLevel),
                self._get_willingness_label(submission.willingnessToPay),
                submission.priceRange or "",
                self._get_solution_wins_labels(submission.solutionWins),
                submission.otherWish or ""
            ]
            
            # Append the row
            worksheet.append_row(row_data, value_input_option='USER_ENTERED')
            
            print(f"Waitlist submission added for: {submission.email}")
            return True
            
        except Exception as e:
            print(f"Error adding waitlist submission: {e}")
            raise

    def _ensure_contact_headers(self, worksheet):
        """Ensure the contact worksheet has the correct headers"""
        headers = [
            "Timestamp",
            "Name",
            "Email",
            "Clinic Name",
            "Role",
            "Message"
        ]
        
        try:
            existing_headers = worksheet.row_values(1)
            if not existing_headers or existing_headers != headers:
                worksheet.update('A1', [headers])
        except Exception:
            worksheet.update('A1', [headers])

    async def add_contact_submission(self, submission: ContactSubmission) -> bool:
        """Add a new contact submission to Google Sheets"""
        if not self.client or not self.spreadsheet:
            raise Exception("Google Sheets is not configured. Please set up Google Sheets credentials.")
        
        try:
            # Get or create the contact worksheet
            try:
                worksheet = self.spreadsheet.worksheet("Contact")
            except gspread.WorksheetNotFound:
                worksheet = self.spreadsheet.add_worksheet(title="Contact", rows=1000, cols=10)
            
            # Ensure headers exist
            self._ensure_contact_headers(worksheet)
            
            # Format the data
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            row_data = [
                timestamp,
                submission.name,
                submission.email,
                submission.clinicName,
                self._get_role_label(submission.role),
                submission.message or ""
            ]
            
            # Append the row
            worksheet.append_row(row_data, value_input_option='USER_ENTERED')
            
            print(f"Contact submission added for: {submission.email}")
            return True
            
        except Exception as e:
            print(f"Error adding contact submission: {e}")
            raise


def send_waitlist_welcome_email(full_name: str, email: str, clinic_name: str):
    """Send a welcome email after web waitlist submission."""
    smtp_email = os.getenv("SMTP_EMAIL", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))

    if not all([smtp_email, smtp_password]):
        logger.warning("SMTP not configured — skipping waitlist welcome email")
        return

    first_name = full_name.split()[0] if full_name else "there"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"You're on the Axis waitlist!"
    msg["From"] = f"Axis <{smtp_email}>"
    msg["To"] = email
    msg["Reply-To"] = "sales@useaxis.app"

    text = f"""Hi {first_name},

Thanks for joining the Axis waitlist!

We've received your submission for {clinic_name}. Our team will review your details and reach out to you shortly to get things started.

Early access is prioritized based on clinic size and operational needs — we're talking to a small group of clinics first to build this right.

If you have any questions in the meantime, just reply to this email.

Talk soon,
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
                You're on the waitlist!
              </h1>
              <p style="margin:0 0 28px 0; font-size:15px; color:#6b7280; line-height:1.5;">
                Hi {first_name}, thanks for signing up. We've received your details.
              </p>

              <!-- Details Card -->
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
                        <td>
                          <p style="margin:0 0 4px 0; font-size:12px; color:#2563EB; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Clinic</p>
                          <p style="margin:0; font-size:16px; color:#1e40af; font-weight:500;">{clinic_name}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0 0 24px 0;">

              <!-- What happens next -->
              <p style="margin:0 0 12px 0; font-size:13px; color:#6b7280; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">What happens next</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#374151;">&#10003;&nbsp;&nbsp;Our team reviews your submission</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#374151;">&#10003;&nbsp;&nbsp;We'll reach out to schedule onboarding</td>
                </tr>
                <tr>
                  <td style="padding:6px 0; font-size:14px; color:#374151;">&#10003;&nbsp;&nbsp;Early adopters get 3 months free</td>
                </tr>
              </table>

              <p style="margin:0; font-size:14px; color:#6b7280; line-height:1.5;">
                Questions? Just reply to this email.
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
            server.sendmail(smtp_email, email, msg.as_string())
        logger.info(f"Waitlist welcome email sent to {email}")
    except Exception as e:
        logger.error(f"Failed to send waitlist welcome email to {email}: {e}", exc_info=True)


# Singleton instance
google_sheets_service = None

def get_google_sheets_service() -> GoogleSheetsService:
    global google_sheets_service
    if google_sheets_service is None:
        google_sheets_service = GoogleSheetsService()
    return google_sheets_service
