# Vercel Environment Variables Setup

## Frontend (waitlist2) - Required Environment Variable

You need to set the following environment variable in your Vercel project dashboard:

### 1. Go to Vercel Dashboard
- Navigate to: https://vercel.com/huzaifachaudarys-projects/axis/settings/environment-variables

### 2. Add Environment Variable

**Variable Name:** `VITE_API_URL`  
**Value:** `https://axisbackend.vercel.app`  
**Environment:** Production, Preview, Development (all)

### 3. Redeploy
After adding the environment variable, you need to redeploy:
```bash
cd waitlist2
npx vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

## Backend (waitlist_backend) - Required Environment Variables

Make sure these are set in your backend Vercel project:
- Navigate to: https://vercel.com/huzaifachaudarys-projects/axis_backend/settings/environment-variables

### Required Variables:

1. **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - Value: `clinicflow-waitlist@clinicflows-483507.iam.gserviceaccount.com`

2. **GOOGLE_PRIVATE_KEY**
   - Value: (The full private key with `\n` as literal characters)
   - Format: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDKNiXo0eexwH12\n...`

3. **GOOGLE_PROJECT_ID**
   - Value: `clinicflows-483507`

4. **GOOGLE_SHEETS_SPREADSHEET_ID**
   - Value: `1BJzP0HSVfTv6DbLcqrTIRzmcVRSjKVaEtBubp963gHc`

## Testing

After setting environment variables:

1. **Test Backend:**
   ```bash
   curl https://axisbackend.vercel.app/health
   ```
   Should return: `{"status":"healthy"}`

2. **Test Frontend:**
   - Open browser console on https://useaxis.app
   - Submit the waitlist form
   - Check console for: `Submitting to: https://axisbackend.vercel.app/api/waitlist`
   - If it shows `http://localhost:8001`, the environment variable is not set correctly

## Troubleshooting

- If submissions aren't appearing in Google Sheets, check:
  1. Backend environment variables are set correctly
  2. Service account has access to the Google Sheet
  3. Google Sheets API is enabled in Google Cloud Console
  4. Check Vercel function logs: `vercel logs axis_backend`

