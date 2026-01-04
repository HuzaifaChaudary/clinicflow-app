from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: UUID
    email: str
    name: str
    role: str
    clinic_id: UUID
    doctor_id: Optional[UUID] = None

    class Config:
        from_attributes = True


class GoogleSignupRequest(BaseModel):
    id_token: str  # Google ID token from Google OAuth
    full_name: str  # User's full name (can be overridden from Google)
    clinic_name: str  # Clinic name (required)
    clinic_type: Optional[str] = None  # primary-care, specialty, dental, physical-therapy, mental-health, other
    clinic_size: Optional[str] = None  # solo, 2-5, 6-10, 10plus
    email: Optional[str] = None  # Email from form (will verify with Google)
    phone: Optional[str] = None  # Phone number
    timezone: str = "America/New_York"  # Clinic timezone
    role: str = "owner"  # Default role for signups (owner for first user)


class GoogleLoginRequest(BaseModel):
    id_token: str  # Google ID token

