"""
Authentication Service

Google OAuth authentication and user management.
"""

from datetime import datetime, timedelta
from typing import Optional, Tuple, Dict, Any
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.config import settings
from app.models import User, UserRole, Session, Clinic, Doctor, ClinicSettings
from app.core.security import create_access_token, create_refresh_token, verify_refresh_token
from app.core.exceptions import AuthenticationError, NotFoundError


# Google OAuth endpoints
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


class AuthService:
    """
    Authentication service handling Google OAuth and user management.
    """
    
    def __init__(self, db: AsyncSession = None):
        self.db = db
    
    def get_google_auth_url(self, redirect_uri: str, state: Optional[str] = None) -> str:
        """Generate Google OAuth authorization URL."""
        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "state": state or "state",
            "prompt": "consent",
        }
        query_string = "&".join(f"{k}={v}" for k, v in params.items())
        return f"{GOOGLE_AUTH_URL}?{query_string}"
    
    async def _exchange_google_code(self, code: str, redirect_uri: str) -> dict:
        """Exchange authorization code for tokens."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GOOGLE_TOKEN_URL,
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri,
                },
            )
            
            if response.status_code != 200:
                raise AuthenticationError("Failed to exchange Google code")
            
            return response.json()
    
    async def _get_google_user_info(self, access_token: str) -> dict:
        """Get user info from Google."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            
            if response.status_code != 200:
                raise AuthenticationError("Failed to get Google user info")
            
            return response.json()
    
    async def authenticate_with_google(
        self,
        code: str,
        redirect_uri: str,
    ) -> Dict[str, Any]:
        """
        Authenticate user with Google OAuth.
        
        For existing users - logs them in.
        For new users without signup data - creates basic account.
        
        Returns: dict with access_token, refresh_token, user info
        """
        # Exchange code for tokens
        token_data = await self._exchange_google_code(code, redirect_uri)
        google_access_token = token_data.get("access_token")
        
        # Get user info from Google
        google_user = await self._get_google_user_info(google_access_token)
        google_id = google_user.get("id")
        email = google_user.get("email")
        
        if not email:
            raise AuthenticationError("Email not provided by Google")
        
        # Check if user exists by Google ID
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.clinic))
            .where(User.google_id == google_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            # Check by email
            result = await self.db.execute(
                select(User)
                .options(selectinload(User.clinic))
                .where(User.email == email)
            )
            user = result.scalar_one_or_none()
            
            if user:
                # Link Google account to existing user
                user.google_id = google_id
                user.picture = google_user.get("picture")
                user.email_verified = google_user.get("verified_email", False)
            else:
                # User doesn't exist - they need to sign up first
                raise AuthenticationError("No account found. Please sign up first.")
        
        if not user.is_active:
            raise AuthenticationError("Account is deactivated")
        
        # Update last login
        user.last_login_at = datetime.utcnow()
        user.picture = google_user.get("picture")
        
        await self.db.commit()
        await self.db.refresh(user)
        
        # Create tokens
        access_token, refresh_token = await self._create_tokens_and_session(user)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role.value,
                "clinic_id": str(user.clinic_id) if user.clinic_id else None,
            }
        }
    
    async def signup_with_google(
        self,
        code: str,
        redirect_uri: str,
        clinic_name: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Sign up a new user with Google OAuth.
        
        Creates a new clinic and owner user.
        
        Args:
            code: Google authorization code
            redirect_uri: OAuth redirect URI
            clinic_name: Name of the clinic to create
            first_name: User's first name (optional, from Google if not provided)
            last_name: User's last name (optional, from Google if not provided)
        
        Returns: dict with access_token, refresh_token, user info
        """
        # Exchange code for tokens
        token_data = await self._exchange_google_code(code, redirect_uri)
        google_access_token = token_data.get("access_token")
        
        # Get user info from Google
        google_user = await self._get_google_user_info(google_access_token)
        google_id = google_user.get("id")
        email = google_user.get("email")
        
        if not email:
            raise AuthenticationError("Email not provided by Google")
        
        # Check if user already exists
        result = await self.db.execute(
            select(User).where(
                (User.google_id == google_id) | (User.email == email)
            )
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise AuthenticationError("Account already exists. Please sign in instead.")
        
        # Create new clinic
        clinic = Clinic(name=clinic_name)
        self.db.add(clinic)
        await self.db.flush()
        
        # Create clinic settings
        clinic_settings = ClinicSettings(clinic_id=clinic.id)
        self.db.add(clinic_settings)
        
        # Create user as owner
        user = User(
            email=email,
            google_id=google_id,
            first_name=first_name or google_user.get("given_name", ""),
            last_name=last_name or google_user.get("family_name", ""),
            picture=google_user.get("picture"),
            role=UserRole.OWNER,
            clinic_id=clinic.id,
            email_verified=google_user.get("verified_email", False),
            is_active=True,
        )
        self.db.add(user)
        await self.db.flush()
        
        # Create tokens and session
        access_token, refresh_token = await self._create_tokens_and_session(user)
        
        await self.db.commit()
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role.value,
                "clinic_id": str(user.clinic_id),
                "clinic_name": clinic.name,
            }
        }
    
    async def _create_tokens_and_session(self, user: User) -> Tuple[str, str]:
        """Create JWT tokens and store session."""
        access_token = create_access_token({
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "clinic_id": str(user.clinic_id) if user.clinic_id else None,
        })
        
        refresh_token = create_refresh_token({
            "sub": str(user.id),
        })
        
        # Store session
        session = Session(
            user_id=user.id,
            refresh_token=refresh_token,
            expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        self.db.add(session)
        
        return access_token, refresh_token
    
    async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """Refresh the access token using a refresh token."""
        # Verify refresh token
        payload = verify_refresh_token(refresh_token)
        if not payload:
            raise AuthenticationError("Invalid refresh token")
        
        user_id = payload.get("sub")
        
        # Check session exists
        result = await self.db.execute(
            select(Session).where(Session.refresh_token == refresh_token)
        )
        session = result.scalar_one_or_none()
        
        if not session:
            raise AuthenticationError("Session not found")
        
        if session.expires_at < datetime.utcnow():
            await self.db.delete(session)
            await self.db.commit()
            raise AuthenticationError("Session expired")
        
        # Get user
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user or not user.is_active:
            raise AuthenticationError("User not found or inactive")
        
        # Create new tokens
        new_access_token = create_access_token({
            "sub": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "clinic_id": str(user.clinic_id) if user.clinic_id else None,
        })
        
        new_refresh_token = create_refresh_token({
            "sub": str(user.id),
        })
        
        # Update session
        session.refresh_token = new_refresh_token
        session.expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        await self.db.commit()
        
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }
    
    async def logout(self, refresh_token: str) -> bool:
        """Logout by invalidating the session."""
        result = await self.db.execute(
            select(Session).where(Session.refresh_token == refresh_token)
        )
        session = result.scalar_one_or_none()
        
        if session:
            await self.db.delete(session)
            await self.db.commit()
            return True
        
        return False


# Legacy functions for backward compatibility
def get_google_auth_url(state: str, redirect_uri: Optional[str] = None) -> str:
    """Generate Google OAuth authorization URL."""
    service = AuthService()
    return service.get_google_auth_url(redirect_uri or settings.GOOGLE_REDIRECT_URI, state)


async def exchange_google_code(code: str, redirect_uri: Optional[str] = None) -> dict:
    """Exchange authorization code for tokens."""
    service = AuthService()
    return await service._exchange_google_code(code, redirect_uri or settings.GOOGLE_REDIRECT_URI)


async def get_google_user_info(access_token: str) -> dict:
    """Get user info from Google."""
    service = AuthService()
    return await service._get_google_user_info(access_token)


async def authenticate_with_google(
    db: AsyncSession,
    google_code: str,
    redirect_uri: Optional[str] = None,
    signup_data: Optional[dict] = None,
) -> Tuple[User, str, str]:
    """
    Authenticate user with Google OAuth (legacy function).
    """
    service = AuthService(db)
    
    if signup_data:
        result = await service.signup_with_google(
            code=google_code,
            redirect_uri=redirect_uri or settings.GOOGLE_REDIRECT_URI,
            clinic_name=signup_data.get("clinic_name", "My Clinic"),
        )
    else:
        result = await service.authenticate_with_google(
            code=google_code,
            redirect_uri=redirect_uri or settings.GOOGLE_REDIRECT_URI,
        )
    
    # Get user for legacy return type
    user_result = await db.execute(
        select(User).where(User.id == result["user"]["id"])
    )
    user = user_result.scalar_one()
    
    return user, result["access_token"], result["refresh_token"]


async def create_new_user_from_google(
    db: AsyncSession,
    google_user: dict,
    signup_data: Optional[dict] = None,
) -> User:
    """Create a new user from Google OAuth data (legacy function)."""
    email = google_user.get("email")
    google_id = google_user.get("id")
    first_name = google_user.get("given_name", "")
    last_name = google_user.get("family_name", "")
    picture = google_user.get("picture")
    
    # Determine role and clinic
    clinic_id = None
    role = UserRole.ADMIN  # Default
    
    if signup_data:
        # This is a new signup from the web
        clinic_name = signup_data.get("clinic_name", f"{first_name}'s Clinic")
        role_str = signup_data.get("role", "owner")
        
        # Create new clinic
        clinic = Clinic(name=clinic_name)
        db.add(clinic)
        await db.flush()
        
        # Create clinic settings
        clinic_settings = ClinicSettings(clinic_id=clinic.id)
        db.add(clinic_settings)
        
        clinic_id = clinic.id
        role = UserRole(role_str) if role_str in ["admin", "doctor", "owner"] else UserRole.OWNER
    
    # Create user
    user = User(
        email=email,
        google_id=google_id,
        first_name=first_name,
        last_name=last_name,
        picture=picture,
        role=role,
        clinic_id=clinic_id,
        email_verified=google_user.get("verified_email", False),
    )
    db.add(user)
    await db.flush()
    
    return user


async def refresh_access_token(db: AsyncSession, refresh_token: str) -> Tuple[str, str]:
    """Refresh the access token using a refresh token (legacy function)."""
    service = AuthService(db)
    result = await service.refresh_access_token(refresh_token)
    return result["access_token"], result["refresh_token"]


async def logout(db: AsyncSession, refresh_token: str) -> bool:
    """Logout by invalidating the session (legacy function)."""
    service = AuthService(db)
    return await service.logout(refresh_token)


async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
    """Get user by ID with related data."""
    result = await db.execute(
        select(User)
        .options(
            selectinload(User.clinic),
            selectinload(User.doctor_profile),
        )
        .where(User.id == user_id)
    )
    return result.scalar_one_or_none()
