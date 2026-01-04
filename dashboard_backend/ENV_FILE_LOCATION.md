# .env File Location and Setup

## 📍 Where to Create .env File

Create the `.env` file in the **`dashboard_backend/`** directory:

```
clinicflow/
└── dashboard_backend/
    ├── .env              ← Create here!
    ├── app/
    ├── alembic/
    ├── requirements.txt
    └── ...
```

**Full Path:** `dashboard_backend/.env`

## 📝 Complete .env Template

Copy this template to `dashboard_backend/.env` and fill in your values:

```env
# Database
DATABASE_URL=postgresql://clinicflow:clinicflow@localhost:5432/clinicflow

# Auth
JWT_SECRET_KEY=clinicflow-super-secret-key-change-in-production-min-32-chars-please
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# OpenAI (for AI intake summaries - optional)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Google OAuth (for Google sign-in - required for Google auth)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# App
ENVIRONMENT=development
DEBUG=true
```

## 🔑 Where to Get API Keys

### Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. See `GOOGLE_OAUTH_SETUP.md` for detailed instructions

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/login
3. Go to API Keys section
4. Create new secret key
5. Copy and paste into `.env`

### JWT Secret Key
- Generate a random string (minimum 32 characters)
- Use a password generator or: `openssl rand -hex 32`
- Keep this secret!

## ⚠️ Important Notes

1. **Never commit .env to git** - It's already in `.gitignore`
2. **Create .env from .env.example** if you want a template:
   ```bash
   cp .env.example .env
   ```
3. **Restart server** after changing .env values
4. **Use different keys** for development and production

## ✅ Verify Setup

After creating `.env`, verify it's loaded:
```bash
cd dashboard_backend
python -c "from app.config import settings; print('✅ Config loaded!')"
```

