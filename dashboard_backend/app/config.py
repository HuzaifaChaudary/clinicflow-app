from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://clinicflow:clinicflow@localhost:5432/clinicflow"
    
    # Auth
    JWT_SECRET_KEY: str = "clinicflow-super-secret-key-change-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    
    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: Optional[str] = "http://localhost:5173/auth/google/callback"
    
    # Twilio Configuration
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_PHONE_NUMBER: Optional[str] = None
    TWILIO_MESSAGING_SERVICE_SID: Optional[str] = None
    TWILIO_VOICE_URL: Optional[str] = None  # Webhook URL for voice calls
    
    # SMTP Email Configuration (Free)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None
    SMTP_FROM_NAME: str = "ClinicFlow"
    SMTP_USE_TLS: bool = True
    
    # Voice AI Configuration
    VOICE_AI_ENABLED: bool = True
    VOICE_AI_MODEL: str = "gpt-4"
    VOICE_AI_VOICE: str = "alloy"  # OpenAI TTS voice
    
    # Automation Configuration
    AUTOMATION_ENABLED: bool = True
    CONFIRMATION_REMINDER_HOURS: int = 24
    INTAKE_REMINDER_HOURS: int = 48
    FOLLOW_UP_REMINDER_DAYS: int = 7
    
    # App
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Frontend URL (for email links)
    FRONTEND_URL: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

