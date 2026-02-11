import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
from typing import Dict, Any
import json

from app.config import settings
from app.schemas import WaitlistSubmission, ContactSubmission


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


# Singleton instance
google_sheets_service = None

def get_google_sheets_service() -> GoogleSheetsService:
    global google_sheets_service
    if google_sheets_service is None:
        google_sheets_service = GoogleSheetsService()
    return google_sheets_service
