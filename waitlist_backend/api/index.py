"""
Vercel serverless function entry point for FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

app = FastAPI()

# CORS middleware for production (Vercel)
# Allows Vercel deployments, custom domains, and localhost for testing
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app|https://(useaxis|www\.useaxis)\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

class WaitlistSubmission(BaseModel):
    clinicType: str
    otherClinicType: Optional[str] = ""
    clinicSize: str
    painPoints: List[str]
    currentSetup: str
    impactLevel: str
    willingnessToPay: str
    priceRange: Optional[str] = ""
    solutionWins: List[str]
    otherWish: Optional[str] = ""
    role: str
    fullName: str
    clinicName: str
    email: str
    phone: Optional[str] = ""

class WaitlistResponse(BaseModel):
    success: bool
    message: str

@app.get("/")
async def root():
    return {"message": "Clinicflow Waitlist API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/waitlist", response_model=WaitlistResponse)
async def submit_waitlist(submission: WaitlistSubmission):
    """Submit a new waitlist entry."""
    import os
    import gspread
    from google.oauth2.service_account import Credentials
    from datetime import datetime
    
    try:
        spreadsheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")
        service_email = os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "")
        private_key = os.getenv("GOOGLE_PRIVATE_KEY", "").replace("\\n", "\n")
        project_id = os.getenv("GOOGLE_PROJECT_ID", "")
        
        if not spreadsheet_id or not service_email or not private_key:
            print(f"Warning: Google Sheets not configured. Submission from: {submission.email}")
            return WaitlistResponse(success=True, message="Received (Google Sheets not configured)")
        
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        service_account_info = {
            "type": "service_account",
            "project_id": project_id,
            "private_key": private_key,
            "client_email": service_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        
        credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
        client = gspread.authorize(credentials)
        spreadsheet = client.open_by_key(spreadsheet_id)
        
        try:
            worksheet = spreadsheet.worksheet("Waitlist")
        except gspread.WorksheetNotFound:
            worksheet = spreadsheet.add_worksheet(title="Waitlist", rows=1000, cols=20)
        
        # Add headers if needed
        headers = ["Timestamp", "Full Name", "Email", "Phone", "Role", "Clinic Name", 
                   "Clinic Type", "Clinic Size", "Pain Points", "Current Setup",
                   "Impact Level", "Willingness to Pay", "Price Range", "Solution Wins", "Other Wish"]
        try:
            existing = worksheet.row_values(1)
            if not existing:
                worksheet.update('A1', [headers])
        except:
            worksheet.update('A1', [headers])
        
        # Always format phone column (column D) as text to prevent number conversion
        try:
            worksheet.format('D:D', {'numberFormat': {'type': 'TEXT'}})
        except Exception as e:
            print(f"Warning: Could not format phone column: {e}")
        
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
            submission.role,
            submission.clinicName,
            submission.clinicType,
            submission.clinicSize,
            ", ".join(submission.painPoints),
            submission.currentSetup,
            submission.impactLevel,
            submission.willingnessToPay,
            submission.priceRange or "",
            ", ".join(submission.solutionWins),
            submission.otherWish or ""
        ]
        
        # Append the row - phone will be treated as text due to column formatting
        worksheet.append_row(row_data, value_input_option='USER_ENTERED')
        
        print(f"Waitlist submission added: {submission.email}")
        
        return WaitlistResponse(success=True, message="Successfully added to waitlist")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return WaitlistResponse(success=True, message="Received (error saving to sheets)")

