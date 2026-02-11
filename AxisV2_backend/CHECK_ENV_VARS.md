# Check Backend Environment Variables in Vercel

## Issue
Backend is receiving requests but returning "Received (error saving to sheets)" which means Google Sheets is not configured correctly.

## Steps to Fix

### 1. Verify Environment Variables in Vercel

Go to: https://vercel.com/huzaifachaudarys-projects/axis_backend/settings/environment-variables

Make sure these are set for **Production** environment:

1. **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - Should be: `clinicflow-waitlist@clinicflows-483507.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**
   - Should start with: `-----BEGIN PRIVATE KEY-----\n`
   - Must have `\n` as literal characters (not actual newlines)
   - Full key from the JSON file

3. **GOOGLE_PROJECT_ID**
   - Should be: `clinicflows-483507`

4. **GOOGLE_SHEETS_SPREADSHEET_ID**
   - Should be: `1BJzP0HSVfTv6DbLcqrTIRzmcVRSjKVaEtBubp963gHc`

### 2. Verify Service Account Access

1. Open Google Sheet: https://docs.google.com/spreadsheets/d/1BJzP0HSVfTv6DbLcqrTIRzmcVRSjKVaEtBubp963gHc/edit
2. Click "Share" button
3. Add email: `clinicflow-waitlist@clinicflows-483507.iam.gserviceaccount.com`
4. Give it "Editor" access
5. Click "Send"

### 3. Verify Google APIs are Enabled

Go to: https://console.cloud.google.com/apis/library

Make sure these are enabled:
- Google Sheets API
- Google Drive API

### 4. Redeploy Backend

After fixing environment variables:
```bash
cd waitlist_backend
npx vercel --prod
```

### 5. Test

```bash
curl -X POST https://axisbackend.vercel.app/api/waitlist \
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

Should return: `{"success":true,"message":"Successfully added to waitlist"}`

### 6. Check Logs

```bash
npx vercel logs axis_backend --follow
```

Look for any error messages related to Google Sheets authentication or API calls.

