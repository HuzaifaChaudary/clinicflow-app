# Google OAuth Setup Guide

## 📍 .env File Location

The `.env` file should be created in the `dashboard_backend/` directory (same level as `app/` folder).

**Path:** `dashboard_backend/.env`

## 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity Toolkit"
   - Click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `http://localhost:3000` (if using different port)
   - Add Authorized redirect URIs:
     - `http://localhost:5173/auth/google/callback`
   - Click "Create"
5. Copy your credentials:
   - **Client ID**: Looks like `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: A long string

## 📝 .env File Configuration

Create or update `dashboard_backend/.env` with your Google OAuth credentials:

```env
# Database
DATABASE_URL=postgresql://clinicflow:clinicflow@localhost:5432/clinicflow

# Auth
JWT_SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# OpenAI (optional)
OPENAI_API_KEY=sk-your-api-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# App
ENVIRONMENT=development
DEBUG=true
```

## 🔄 Database Migration

After adding the `google_id` field to the User model, run a migration:

```bash
cd dashboard_backend
alembic revision --autogenerate -m "add_google_oauth_support"
alembic upgrade head
```

## 🚀 API Endpoints

### Google Signup
```
POST /api/auth/google/signup
Body: {
  "id_token": "google-id-token-from-frontend",
  "role": "admin",
  "clinic_name": "My Clinic"  // Optional, required for first user
}
Response: {
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

### Google Login
```
POST /api/auth/google/login
Body: {
  "id_token": "google-id-token-from-frontend"
}
Response: {
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

## 📱 Frontend Integration

On the frontend, you'll need to:

1. Install Google Sign-In SDK:
```bash
npm install @react-oauth/google
```

2. Get Google ID token from the frontend and send to backend
3. Store the JWT token returned from the backend
4. Use the token for authenticated requests

Example frontend flow:
- User clicks "Sign up with Google"
- Google OAuth flow completes
- Frontend receives Google ID token
- Frontend sends ID token to `/api/auth/google/signup` or `/api/auth/google/login`
- Backend verifies token and returns JWT
- Frontend stores JWT and redirects to dashboard

## ✅ Testing

1. Make sure `.env` has correct Google credentials
2. Start the backend: `uvicorn app.main:app --reload`
3. Test with Postman or frontend:
   - Get Google ID token from frontend
   - Send to `/api/auth/google/signup` or `/api/auth/google/login`
   - Verify JWT token is returned

## 🔒 Security Notes

- Never commit `.env` file to git (already in `.gitignore`)
- Use different Client IDs for development and production
- Ensure HTTPS in production
- Validate email verification on backend
- Store JWT securely on frontend (httpOnly cookies recommended for production)

