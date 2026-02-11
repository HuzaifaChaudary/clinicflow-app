# How to Run Waitlist Backend

## Quick Start

### Option 1: Using the Run Script (Easiest)

```bash
cd waitlist_backend
python run_local.py
```

### Option 2: Using Uvicorn Directly

```bash
cd waitlist_backend
python -m uvicorn app.main:app --reload --port 8000
```

### Option 3: Using Python Directly

```bash
cd waitlist_backend
python -m app.main
```

## Prerequisites

### 1. Install Dependencies

```bash
cd waitlist_backend
pip install -r requirements.txt
```

### 2. Setup Environment Variables

Make sure you have a `.env` file with your Google Sheets credentials:

```bash
# If you haven't set up .env yet, run:
python setup_env.py
```

Or manually create `.env` with:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=clinicflow-waitlist@clinicflows-483507.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_PROJECT_ID=clinicflows-483507
GOOGLE_SHEETS_SPREADSHEET_ID=1BJzP0HSVfTv6DbLcqrTIRzmcVRSjKVaEtBubp963gHc
```

## Server Endpoints

Once running, the server will be available at:

- **Base URL**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/health`
- **Root**: `http://localhost:8000/`
- **Waitlist Submission**: `POST http://localhost:8000/api/waitlist`

## Testing the API

### Test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Submit waitlist entry
curl -X POST http://localhost:8000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "clinicType": "dental",
    "clinicSize": "2-5",
    "painPoints": ["no-shows"],
    "currentSetup": "front-desk",
    "impactLevel": "frustrating",
    "willingnessToPay": "yes",
    "priceRange": "100-250",
    "solutionWins": ["fewer-no-shows"],
    "role": "owner",
    "fullName": "Test User",
    "clinicName": "Test Clinic",
    "email": "test@example.com"
  }'
```

### Or use the test script:

```bash
python test_api.py
```

## Troubleshooting

### Port Already in Use

If port 8000 is already in use, change the port:

```bash
python -m uvicorn app.main:app --reload --port 8002
```

### Missing Dependencies

```bash
pip install -r requirements.txt
```

### Google Sheets Not Working

1. Check that `.env` file exists and has correct values
2. Verify the service account has access to the Google Sheet
3. Check that Google Sheets API and Drive API are enabled in Google Cloud Console

## Production Deployment

For production, deploy to Vercel:

```bash
vercel deploy
```

Make sure to set environment variables in Vercel dashboard:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY` (with `\n` as literal characters)
- `GOOGLE_PROJECT_ID`
- `GOOGLE_SHEETS_SPREADSHEET_ID`

