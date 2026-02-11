"""
FastAPI server for AxisV2 Backend
Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8001
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import json
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="AxisV2 Waitlist API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Clinicflow Waitlist API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/debug/env")
async def debug_env():
    private_key_raw = os.getenv("GOOGLE_PRIVATE_KEY", "")
    # Process key the same way as in waitlist endpoint
    processed_key = private_key_raw.strip('"').strip("'").replace("\\n", "\n")
    return {
        "spreadsheet_id_set": bool(os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")),
        "spreadsheet_id": os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")[:10] + "..." if os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "") else "",
        "service_email_set": bool(os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "")),
        "service_email": os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL", ""),
        "private_key_set": bool(private_key_raw),
        "private_key_length": len(private_key_raw),
        "private_key_valid_format": processed_key.startswith("-----BEGIN PRIVATE KEY-----"),
        "private_key_starts_with": processed_key[:50] if processed_key else "",
        "project_id_set": bool(os.getenv("GOOGLE_PROJECT_ID", "")),
        "project_id": os.getenv("GOOGLE_PROJECT_ID", ""),
    }


@app.post("/api/waitlist")
async def waitlist(request: Request):
    try:
        data = await request.json()
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": f"Invalid JSON: {str(e)}"}
        )

    try:
        # Get environment variables
        spreadsheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")
        service_email = os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "")
        private_key_raw = os.getenv("GOOGLE_PRIVATE_KEY", "")
        project_id = os.getenv("GOOGLE_PROJECT_ID", "")

        if not all([spreadsheet_id, service_email, private_key_raw, project_id]):
            return {"success": False, "message": "Received (config missing)"}

        # Strip surrounding quotes if present (from .env file format)
        private_key_raw = private_key_raw.strip('"').strip("'")
        
        # Convert \n to actual newlines
        private_key = private_key_raw.replace("\\n", "\n")

        if not private_key.startswith("-----BEGIN PRIVATE KEY-----"):
            return {"success": False, "message": f"Received (invalid key format, starts with: {private_key[:30]}...)"}

        # Import Google libraries
        import gspread
        from google.oauth2.service_account import Credentials

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

        # Ensure headers
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
        try:
            existing = worksheet.row_values(1)
            if not existing or existing != headers:
                worksheet.update('A1', [headers])
        except Exception as e:
            print(f"Warning: Could not update headers: {e}")
            worksheet.update('A1', [headers])

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Format phone with single quote prefix to force text format
        phone_value = data.get('phone', '')
        if phone_value:
            phone_value = f"'{phone_value}"

        # Convert lists to readable strings
        pain_points = data.get('painPoints', [])
        if isinstance(pain_points, list):
            pain_labels = {
                'no-shows': 'No-shows or last-minute cancellations',
                'phone-calls': 'Too many phone calls',
                'manual-scheduling': 'Manual scheduling or rescheduling',
                'intake-forms': 'Chasing intake forms',
                'admin-burnout': 'Admin burnout',
                'doctor-admin': 'Doctors spending time on admin work',
                'follow-ups': 'Follow-ups slipping through the cracks'
            }
            pain_points = ", ".join([pain_labels.get(p, p) for p in pain_points])

        solution_wins = data.get('solutionWins', [])
        if isinstance(solution_wins, list):
            solution_labels = {
                'fewer-no-shows': 'Fewer no-shows',
                'less-admin': 'Less admin work for staff',
                'prepared-visits': 'Doctors starting visits more prepared',
                'better-followups': 'Better follow-ups',
                'fewer-missed-calls': 'Fewer missed calls',
                'visibility': 'Clear visibility into clinic performance'
            }
            solution_wins = ", ".join([solution_labels.get(s, s) for s in solution_wins])

        # Convert clinic type to label
        clinic_type = data.get('clinicType', '')
        clinic_type_labels = {
            'primary-care': 'Primary care',
            'specialty': 'Specialty clinic',
            'dental': 'Dental',
            'physical-therapy': 'Physical therapy',
            'mental-health': 'Mental health',
            'other': 'Other'
        }
        clinic_type_label = clinic_type_labels.get(clinic_type, clinic_type)

        # Convert clinic size to label
        clinic_size = data.get('clinicSize', '')
        clinic_size_labels = {
            'solo': 'Solo provider',
            '2-5': '2 to 5',
            '6-10': '6 to 10',
            '10plus': '10+'
        }
        clinic_size_label = clinic_size_labels.get(clinic_size, clinic_size)

        # Convert role to label
        role = data.get('role', '')
        role_labels = {
            'owner': 'Clinic Owner',
            'admin': 'Administrative Assistant',
            'practice-manager': 'Practice Manager',
            'operations-manager': 'Operations Manager',
            'cto': 'CTO / IT Director'
        }
        role_label = role_labels.get(role, role)

        # Convert other fields to labels
        current_setup_labels = {
            'front-desk': 'Front desk + phone calls',
            'simple-tool': 'Simple scheduling tool',
            'ehr': 'EHR scheduling',
            'mix': 'Mix of tools',
            'messy': 'Not sure / messy setup'
        }
        current_setup_label = current_setup_labels.get(data.get('currentSetup', ''), data.get('currentSetup', ''))

        impact_level_labels = {
            'not-big': 'Not a big issue',
            'somewhat': 'Somewhat painful',
            'frustrating': 'Actively frustrating',
            'hurting': 'Hurting revenue or staff morale'
        }
        impact_level_label = impact_level_labels.get(data.get('impactLevel', ''), data.get('impactLevel', ''))

        willingness_labels = {
            'yes': 'Yes, definitely',
            'possibly': 'Possibly, depending on price',
            'not-now': 'Not right now',
            'exploring': 'Just exploring'
        }
        willingness_label = willingness_labels.get(data.get('willingnessToPay', ''), data.get('willingnessToPay', ''))

        row_data = [
            timestamp,
            data.get('fullName', ''),
            data.get('email', ''),
            phone_value,
            role_label,
            data.get('ownerEmail', ''),
            data.get('clinicName', ''),
            clinic_type_label,
            data.get('otherClinicType', ''),
            clinic_size_label,
            data.get('numberOfDoctors', ''),
            data.get('numberOfLocations', ''),
            data.get('doctorEmails', ''),
            data.get('locationAddresses', ''),
            pain_points,
            current_setup_label,
            impact_level_label,
            willingness_label,
            data.get('priceRange', ''),
            solution_wins,
            data.get('otherWish', '')
        ]

        worksheet.append_row(row_data, value_input_option='USER_ENTERED')

        print(f"Successfully added waitlist submission for: {data.get('email', 'unknown')}")
        return {"success": True, "message": "Successfully added to waitlist"}

    except Exception as e:
        error_msg = f"Error saving to Google Sheets: {type(e).__name__}: {str(e)}"
        print(error_msg)
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": error_msg}
        )
