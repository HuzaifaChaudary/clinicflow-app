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

            # Send waitlist welcome email
            user_email = data.get('email', '')
            if user_email:
                try:
                    _send_waitlist_welcome_email(
                        full_name=data.get('fullName', ''),
                        email=user_email,
                        clinic_name=data.get('clinicName', ''),
                    )
                except Exception as email_err:
                    print(f"Warning: Failed to send waitlist welcome email: {email_err}")

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


def _send_waitlist_welcome_email(full_name: str, email: str, clinic_name: str):
    """Send a welcome email after web waitlist submission."""
    import ssl
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    smtp_email = os.getenv("SMTP_EMAIL", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))

    if not all([smtp_email, smtp_password]):
        print("SMTP not configured — skipping waitlist welcome email")
        return

    first_name = full_name.split()[0] if full_name else "there"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "You're on the Axis waitlist!"
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

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as server:
        server.login(smtp_email, smtp_password)
        server.sendmail(smtp_email, email, msg.as_string())
    print(f"Waitlist welcome email sent to {email}")
