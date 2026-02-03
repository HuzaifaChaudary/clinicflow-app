"""
Vercel serverless function for Waitlist API
"""
from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_GET(self):
        path = self.path.split('?')[0]  # Remove query string
        
        if path in ['/', '/api/index']:
            self._send_json({"message": "Clinicflow Waitlist API", "status": "running"})
        elif path in ['/health', '/api/health']:
            self._send_json({"status": "healthy"})
        elif path in ['/debug/env', '/api/debug/env']:
            private_key_raw = os.getenv("GOOGLE_PRIVATE_KEY", "")
            self._send_json({
                "spreadsheet_id_set": bool(os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")),
                "service_email_set": bool(os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "")),
                "private_key_set": bool(private_key_raw),
                "private_key_length": len(private_key_raw),
                "project_id_set": bool(os.getenv("GOOGLE_PROJECT_ID", "")),
            })
        else:
            self._send_json({"error": "Not found", "path": path}, 404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
    
    def do_POST(self):
        path = self.path.split('?')[0]
        
        if path != '/api/waitlist':
            self._send_json({"error": "Not found", "path": path}, 404)
            return
        
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self._send_json({"success": False, "message": "No data received"})
                return
            
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Get environment variables
            spreadsheet_id = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")
            service_email = os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "")
            private_key_raw = os.getenv("GOOGLE_PRIVATE_KEY", "")
            project_id = os.getenv("GOOGLE_PROJECT_ID", "")
            
            if not all([spreadsheet_id, service_email, private_key_raw, project_id]):
                self._send_json({"success": True, "message": "Received (config missing)"})
                return
            
            # Convert \n to actual newlines
            private_key = private_key_raw.replace("\\n", "\n")
            
            if not private_key.startswith("-----BEGIN PRIVATE KEY-----"):
                self._send_json({"success": True, "message": "Received (invalid key format)"})
                return
            
            # Import Google libraries
            import gspread
            from google.oauth2.service_account import Credentials
            from datetime import datetime
            
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
            
            # Ensure headers - match the full schema from google_sheets.py
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
                # Convert pain point values to labels
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
            self._send_json({"success": True, "message": "Successfully added to waitlist"})
            
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            self._send_json({"success": False, "message": f"Invalid JSON: {str(e)}"}, 400)
        except Exception as e:
            error_msg = f"Error saving to Google Sheets: {type(e).__name__}: {str(e)}"
            print(error_msg)
            import traceback
            traceback.print_exc()
            # Return error instead of success
            self._send_json({"success": False, "message": error_msg}, 500)
