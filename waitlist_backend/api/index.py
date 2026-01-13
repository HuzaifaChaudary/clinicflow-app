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
            
            # Ensure headers
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
            
            # Format phone with single quote prefix
            phone_value = data.get('phone', '')
            if phone_value:
                phone_value = f"'{phone_value}"
            
            # Join lists
            pain_points = data.get('painPoints', [])
            if isinstance(pain_points, list):
                pain_points = ", ".join(pain_points)
            
            solution_wins = data.get('solutionWins', [])
            if isinstance(solution_wins, list):
                solution_wins = ", ".join(solution_wins)
            
            row_data = [
                timestamp,
                data.get('fullName', ''),
                data.get('email', ''),
                phone_value,
                data.get('role', ''),
                data.get('clinicName', ''),
                data.get('clinicType', ''),
                data.get('clinicSize', ''),
                pain_points,
                data.get('currentSetup', ''),
                data.get('impactLevel', ''),
                data.get('willingnessToPay', ''),
                data.get('priceRange', ''),
                solution_wins,
                data.get('otherWish', '')
            ]
            
            worksheet.append_row(row_data, value_input_option='USER_ENTERED')
            
            self._send_json({"success": True, "message": "Successfully added to waitlist"})
            
        except json.JSONDecodeError as e:
            self._send_json({"success": False, "message": f"Invalid JSON: {str(e)}"})
        except Exception as e:
            print(f"Error: {type(e).__name__}: {str(e)}")
            self._send_json({"success": True, "message": f"Received (error: {type(e).__name__})"})
