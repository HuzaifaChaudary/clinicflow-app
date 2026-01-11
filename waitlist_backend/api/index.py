"""
Vercel serverless function entry point for FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        row_data = [
            timestamp,
            submission.fullName,
            submission.email,
            submission.phone or "",
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
        
        worksheet.append_row(row_data, value_input_option='USER_ENTERED')
        print(f"Waitlist submission added: {submission.email}")
        
        return WaitlistResponse(success=True, message="Successfully added to waitlist")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return WaitlistResponse(success=True, message="Received (error saving to sheets)")

