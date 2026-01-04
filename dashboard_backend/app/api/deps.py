"""
API Dependencies

FastAPI dependencies for authentication, authorization, and database access.
"""

from typing import Optional
from uuid import UUID
from fastapi import Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User, Doctor, Session
from app.core.security import verify_access_token
from app.core.permissions import (
    has_permission,
    has_any_permission,
    check_permission,
    Permission,
)
from app.core.exceptions import (
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
)


# Security scheme
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Get the current authenticated user from the JWT token.
    
    Raises:
        HTTPException: If token is missing, invalid, or user not found.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    
    # Verify token and extract payload
    try:
        payload = verify_access_token(token)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    result = await db.execute(
        select(User).where(User.id == UUID(user_id))
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )
    
    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Get the current user if authenticated, otherwise return None.
    Used for endpoints that work for both authenticated and anonymous users.
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Ensure current user is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )
    return current_user


def require_permission(permission: Permission):
    """
    Dependency factory that requires a specific permission.
    
    Usage:
        @router.get("/admin-only", dependencies=[Depends(require_permission(Permission.MANAGE_USERS))])
    """
    async def permission_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        if not has_permission(current_user.role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission.value} required",
            )
        return current_user
    
    return permission_checker


def require_any_permission(*permissions: Permission):
    """
    Dependency factory that requires at least one of the specified permissions.
    """
    async def permission_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        if not has_any_permission(current_user.role, list(permissions)):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied",
            )
        return current_user
    
    return permission_checker


def require_role(*roles: str):
    """
    Dependency factory that requires one of the specified roles.
    
    Usage:
        @router.get("/owner-only", dependencies=[Depends(require_role("owner"))])
    """
    async def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        if current_user.role.value not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role required: one of {roles}",
            )
        return current_user
    
    return role_checker


async def get_current_doctor(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Doctor:
    """
    Get the doctor profile associated with the current user.
    
    Raises:
        HTTPException: If user is not a doctor or has no doctor profile.
    """
    if current_user.role.value != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Doctor role required",
        )
    
    result = await db.execute(
        select(Doctor).where(Doctor.user_id == current_user.id)
    )
    doctor = result.scalar_one_or_none()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found",
        )
    
    return doctor


async def get_current_doctor_optional(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Optional[Doctor]:
    """
    Get the doctor profile if the current user is a doctor.
    Returns None for non-doctor users.
    """
    if current_user.role.value != "doctor":
        return None
    
    result = await db.execute(
        select(Doctor).where(Doctor.user_id == current_user.id)
    )
    return result.scalar_one_or_none()


# Pagination dependencies
class PaginationParams:
    """Common pagination parameters."""
    
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number"),
        page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    ):
        self.page = page
        self.page_size = page_size
        self.offset = (page - 1) * page_size


class DateRangeParams:
    """Common date range parameters."""
    
    def __init__(
        self,
        start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
        end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    ):
        self.start_date = start_date
        self.end_date = end_date


# Clinic scope helpers
def get_clinic_id(current_user: User = Depends(get_current_user)) -> UUID:
    """Get the clinic ID for the current user."""
    return current_user.clinic_id


async def verify_clinic_access(
    resource_clinic_id: UUID,
    current_user: User = Depends(get_current_user),
) -> bool:
    """
    Verify that the current user has access to the specified clinic.
    
    Raises:
        HTTPException: If user doesn't have access to the clinic.
    """
    if current_user.clinic_id != resource_clinic_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: resource belongs to different clinic",
        )
    return True


# Resource ownership helpers
async def verify_doctor_ownership(
    doctor_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Doctor:
    """
    Verify that the specified doctor belongs to the user's clinic.
    Returns the doctor if valid.
    """
    result = await db.execute(
        select(Doctor).where(
            Doctor.id == doctor_id,
            Doctor.clinic_id == current_user.clinic_id,
        )
    )
    doctor = result.scalar_one_or_none()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )
    
    return doctor


# Session validation
async def validate_refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db),
) -> Session:
    """
    Validate a refresh token and return the associated session.
    """
    from datetime import datetime, timezone
    
    result = await db.execute(
        select(Session).where(
            Session.refresh_token == refresh_token,
            Session.is_valid == True,
            Session.expires_at > datetime.now(timezone.utc),
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    
    return session
