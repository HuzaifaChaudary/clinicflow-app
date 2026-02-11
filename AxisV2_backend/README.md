# Clinicflow Waitlist Backend

Backend service for handling waitlist submissions and storing them in Google Sheets.

## Setup

### 1. Install Dependencies

```bash
cd waitlist_backend
pip install -r requirements.txt
```

### 2. Google Sheets Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API and Google Drive API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name and description
   - Click "Create and Continue"
   - Skip the optional steps and click "Done"
5. Create a key for the service account:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the JSON file

### 3. Create Google Sheet

1. Create a new Google Sheet
2. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. Share the spreadsheet with your service account email (found in the JSON file as `client_email`)
   - Give it "Editor" access

### 4. Configure Environment Variables

Edit the `.env` file with your credentials:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your_project_id
```

Or use the JSON file directly:
```env
GOOGLE_SERVICE_ACCOUNT_FILE=path/to/service-account.json
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
```

### 5. Run the Server

```bash
cd waitlist_backend
python -m uvicorn app.main:app --reload --port 8001
```

## API Endpoints

### POST /api/waitlist

Submit a new waitlist entry.

**Request Body:**
```json
{
  "clinicType": "dental",
  "otherClinicType": "",
  "clinicSize": "2-5",
  "painPoints": ["no-shows", "phone-calls"],
  "currentSetup": "front-desk",
  "impactLevel": "frustrating",
  "willingnessToPay": "yes",
  "priceRange": "100-250",
  "solutionWins": ["fewer-no-shows", "less-admin"],
  "otherWish": "",
  "role": "owner",
  "fullName": "John Doe",
  "clinicName": "Smile Dental",
  "email": "john@smiledental.com",
  "phone": "123-456-7890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully added to waitlist"
}
```

## Google Sheet Columns

The data will be saved with the following columns:
- Timestamp
- Full Name
- Email
- Phone
- Role
- Clinic Name
- Clinic Type
- Other Clinic Type
- Clinic Size
- Pain Points
- Current Setup
- Impact Level
- Willingness to Pay
- Price Range
- Solution Wins
- Other Wish
