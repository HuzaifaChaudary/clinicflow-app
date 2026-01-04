from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models.user import User
from app.models.clinic import Clinic
from app.schemas.auth import (
    LoginRequest, TokenResponse, UserResponse,
    GoogleSignupRequest, GoogleLoginRequest
)
from app.core.security import verify_password, create_access_token
from app.api.deps import get_current_user
from app.services.google_auth import verify_google_token
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login endpoint - returns JWT token"""
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password (skip if user is Google OAuth only)
    if user.password_hash:
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
    else:
        # User has no password (Google OAuth only)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account uses Google sign-in. Please use Google login."
        )
    
    # Check if user is active
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
            "clinic_id": str(user.clinic_id),
            "doctor_id": str(user.doctor_id) if user.doctor_id else None
        },
        expires_delta=access_token_expires
    )
    
    return TokenResponse(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        clinic_id=current_user.clinic_id,
        doctor_id=current_user.doctor_id
    )


@router.post("/google/signup", response_model=TokenResponse)
async def google_signup(
    signup_data: GoogleSignupRequest,
    db: Session = Depends(get_db)
):
    """Sign up with Google OAuth - creates new user and clinic if needed"""
    # Verify Google token
    google_user = await verify_google_token(signup_data.id_token)
    
    if not google_user or not google_user.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or unverified Google token"
        )
    
    # Get email from Google (must match form email if provided)
    google_email = google_user["email"]
    google_name = google_user["name"]
    google_id = google_user["google_id"]
    
    # Verify email matches if provided in form
    if signup_data.email and signup_data.email.lower() != google_email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email in form does not match Google account email"
        )
    
    email = google_email
    # Use form name if provided, otherwise use Google name
    name = signup_data.full_name.strip() if signup_data.full_name.strip() else google_name
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == email) | (User.google_id == google_id)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists. Please use login instead."
        )
    
    # Validate role
    if signup_data.role not in ["admin", "doctor", "owner"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be admin, doctor, or owner"
        )
    
    # Validate clinic_type if provided
    valid_clinic_types = ["primary-care", "specialty", "dental", "physical-therapy", "mental-health", "other"]
    if signup_data.clinic_type and signup_data.clinic_type not in valid_clinic_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid clinic_type. Must be one of: {', '.join(valid_clinic_types)}"
        )
    
    # Validate clinic_size if provided
    valid_clinic_sizes = ["solo", "2-5", "6-10", "10plus"]
    if signup_data.clinic_size and signup_data.clinic_size not in valid_clinic_sizes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid clinic_size. Must be one of: {', '.join(valid_clinic_sizes)}"
        )
    
    # Create clinic (first user always creates a clinic)
    clinic_metadata_dict = {}
    if signup_data.phone:
        clinic_metadata_dict["signup_phone"] = signup_data.phone
    
    clinic = Clinic(
        name=signup_data.clinic_name.strip(),
        timezone=signup_data.timezone,
        clinic_type=signup_data.clinic_type,
        clinic_size=signup_data.clinic_size,
        clinic_metadata=clinic_metadata_dict
    )
    db.add(clinic)
    db.flush()
    clinic_id = clinic.id
    
    # Create user (first user is owner by default)
    user = User(
        email=email,
        name=name,
        google_id=google_id,
        password_hash=None,  # No password for Google OAuth users
        role=signup_data.role or "owner",  # Default to owner for signups
        clinic_id=clinic_id,
        status="active"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
            "clinic_id": str(user.clinic_id),
            "doctor_id": str(user.doctor_id) if user.doctor_id else None
        },
        expires_delta=access_token_expires
    )
    
    return TokenResponse(access_token=access_token, token_type="bearer")


@router.post("/google/login", response_model=TokenResponse)
async def google_login(
    login_data: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    """Login with Google OAuth"""
    # Verify Google token
    google_user = await verify_google_token(login_data.id_token)
    
    if not google_user or not google_user.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or unverified Google token"
        )
    
    email = google_user["email"]
    google_id = google_user["google_id"]
    
    # Find user by email or google_id
    user = db.query(User).filter(
        (User.email == email) | (User.google_id == google_id)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please sign up first."
        )
    
    # Update google_id if not set
    if not user.google_id:
        user.google_id = google_id
        db.commit()
    
    # Update name if changed
    if google_user.get("name") and google_user["name"] != user.name:
        user.name = google_user["name"]
        db.commit()
    
    # Check if user is active
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
            "clinic_id": str(user.clinic_id),
            "doctor_id": str(user.doctor_id) if user.doctor_id else None
        },
        expires_delta=access_token_expires
    )
    
    return TokenResponse(access_token=access_token, token_type="bearer")

