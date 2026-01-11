# Deploying Backend to Vercel

## Steps to Deploy

1. **Navigate to backend directory:**
   ```bash
   cd waitlist_backend
   ```

2. **Deploy to Vercel:**
   ```bash
   npx vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   After deployment, go to your Vercel project settings and add these environment variables:
   - `GOOGLE_SHEETS_SPREADSHEET_ID` - Your Google Sheets ID
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Service account email
   - `GOOGLE_PRIVATE_KEY` - Private key (with \n for newlines)
   - `GOOGLE_PROJECT_ID` - Google Cloud project ID

4. **Get your backend URL:**
   After deployment, Vercel will give you a URL like: `https://your-project.vercel.app`

5. **Update Frontend:**
   In Vercel dashboard for waitlist2 project, add environment variable:
   - `VITE_API_URL` = `https://your-backend-project.vercel.app`

## API Endpoints

Once deployed, your API will be available at:
- `https://your-backend.vercel.app/api/waitlist` (POST)
- `https://your-backend.vercel.app/health` (GET)
- `https://your-backend.vercel.app/` (GET)

