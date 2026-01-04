"""
User Schemas

Pydantic schemas for user-related data.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a user."""
    role: str = "admin"
    clinic_id: Optional[UUID] = None


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """User response schema."""
    id: UUID
    role: str
    clinic_id: Optional[UUID] = None
    picture: Optional[str] = None
    is_active: bool
    email_verified: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserWithClinic(UserResponse):
    """User response with clinic info."""
    clinic_name: Optional[str] = None
    doctor_id: Optional[UUID] = None
    
    class Config:
        from_attributes = True


# Auth Schemas
class GoogleAuthRequest(BaseModel):
    """Request for Google OAuth callback."""
    code: str
    state: Optional[str] = None
    redirect_uri: Optional[str] = None


class GoogleAuthCallback(BaseModel):
    """Google OAuth callback data."""
    code: str
    redirect_uri: str
    state: Optional[str] = None


class SignupRequest(BaseModel):
    """
    Request for new user signup from web.
    
    When a user signs up from the web:
    1. They fill out the signup form (clinic name, name, etc.)
    2. They click "Sign up with Google"
    3. After Google OAuth, frontend receives code
    4. Frontend sends code + signup data to this endpoint
    """
    google_code: str  # The authorization code from Google OAuth
    redirect_uri: str  # The redirect URI used for OAuth
    clinic_name: str  # Name of the clinic to create
    first_name: Optional[str] = None  # User's first name (optional, can get from Google)
    last_name: Optional[str] = None  # User's last name (optional, can get from Google)
    state: Optional[str] = None  # OAuth state for CSRF protection


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: Optional[int] = None
    user: Optional[dict] = None  # User info, optional for refresh


class RefreshTokenRequest(BaseModel):
    """Refresh token request."""
    refresh_token: str


class AuthUrlResponse(BaseModel):
    """Auth URL response."""
    auth_url: str
    state: str


class SessionResponse(BaseModel):
    """Session response schema."""
    id: UUID
    user_id: UUID
    expires_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True
