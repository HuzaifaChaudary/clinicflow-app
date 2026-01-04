"""
Settings API Routes

Endpoints for clinic and doctor settings management.
"""

from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    Clinic,
    ClinicSettings,
    Doctor,
    DoctorSettings,
    User,
    UserRole,
)
from app.schemas import (
    ClinicSettingsUpdate,
    ClinicSettingsResponse,
    DoctorSettingsUpdate,
    DoctorSettingsResponse,
    ClinicProfileUpdate,
    ClinicProfileResponse,
    DoctorProfileUpdate,
    DoctorProfileResponse,
    UserManagementCreate,
    UserManagementUpdate,
    UserManagementResponse,
    UserManagementListResponse,
)
from app.api.deps import (
    get_current_user,
    require_permission,
    require_role,
    PaginationParams,
)
from app.core.permissions import Permission


router = APIRouter(prefix="/settings", tags=["Settings"])


# ============== Clinic Profile ==============


@router.get("/clinic/profile", response_model=ClinicProfileResponse)
async def get_clinic_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ClinicProfileResponse:
    """Get clinic profile information."""
    result = await db.execute(
        select(Clinic).where(Clinic.id == current_user.clinic_id)
    )
    clinic = result.scalar_one_or_none()
    
    if not clinic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )
    
    return ClinicProfileResponse.model_validate(clinic)


@router.put("/clinic/profile", response_model=ClinicProfileResponse)
async def update_clinic_profile(
    data: ClinicProfileUpdate,
    current_user: User = Depends(require_permission(Permission.MANAGE_CLINIC_SETTINGS)),
    db: AsyncSession = Depends(get_db),
) -> ClinicProfileResponse:
    """Update clinic profile information."""
    result = await db.execute(
        select(Clinic).where(Clinic.id == current_user.clinic_id)
    )
    clinic = result.scalar_one_or_none()
    
    if not clinic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(clinic, field, value)
    
    await db.commit()
    await db.refresh(clinic)
    
    return ClinicProfileResponse.model_validate(clinic)


# ============== Clinic Settings ==============


@router.get("/clinic", response_model=ClinicSettingsResponse)
async def get_clinic_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ClinicSettingsResponse:
    """Get clinic settings."""
    result = await db.execute(
        select(ClinicSettings).where(ClinicSettings.clinic_id == current_user.clinic_id)
    )
    settings = result.scalar_one_or_none()
    
    if not settings:
        # Create default settings if not exist
        settings = ClinicSettings(clinic_id=current_user.clinic_id)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    
    return ClinicSettingsResponse.model_validate(settings)


@router.put("/clinic", response_model=ClinicSettingsResponse)
async def update_clinic_settings(
    data: ClinicSettingsUpdate,
    current_user: User = Depends(require_permission(Permission.MANAGE_CLINIC_SETTINGS)),
    db: AsyncSession = Depends(get_db),
) -> ClinicSettingsResponse:
    """Update clinic settings."""
    result = await db.execute(
        select(ClinicSettings).where(ClinicSettings.clinic_id == current_user.clinic_id)
    )
    settings = result.scalar_one_or_none()
    
    if not settings:
        settings = ClinicSettings(clinic_id=current_user.clinic_id)
        db.add(settings)
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    await db.commit()
    await db.refresh(settings)
    
    return ClinicSettingsResponse.model_validate(settings)


# ============== Doctor Profile ==============


@router.get("/doctors", response_model=List[DoctorProfileResponse])
async def list_doctors(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
) -> List[DoctorProfileResponse]:
    """List all doctors in the clinic."""
    query = select(Doctor).where(Doctor.clinic_id == current_user.clinic_id)
    
    if is_active is not None:
        query = query.where(Doctor.is_active == is_active)
    
    query = query.order_by(Doctor.name)
    
    result = await db.execute(query)
    doctors = result.scalars().all()
    
    return [DoctorProfileResponse.model_validate(d) for d in doctors]


@router.get("/doctors/{doctor_id}", response_model=DoctorProfileResponse)
async def get_doctor_profile(
    doctor_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DoctorProfileResponse:
    """Get a specific doctor's profile."""
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
    
    return DoctorProfileResponse.model_validate(doctor)


@router.put("/doctors/{doctor_id}", response_model=DoctorProfileResponse)
async def update_doctor_profile(
    doctor_id: UUID,
    data: DoctorProfileUpdate,
    current_user: User = Depends(require_permission(Permission.MANAGE_DOCTORS)),
    db: AsyncSession = Depends(get_db),
) -> DoctorProfileResponse:
    """Update a doctor's profile."""
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
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(doctor, field, value)
    
    await db.commit()
    await db.refresh(doctor)
    
    return DoctorProfileResponse.model_validate(doctor)


# ============== Doctor Settings ==============


@router.get("/doctors/{doctor_id}/settings", response_model=DoctorSettingsResponse)
async def get_doctor_settings(
    doctor_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DoctorSettingsResponse:
    """Get a doctor's settings."""
    # Verify doctor exists in clinic
    doctor_result = await db.execute(
        select(Doctor).where(
            Doctor.id == doctor_id,
            Doctor.clinic_id == current_user.clinic_id,
        )
    )
    doctor = doctor_result.scalar_one_or_none()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )
    
    # Get settings
    result = await db.execute(
        select(DoctorSettings).where(DoctorSettings.doctor_id == doctor_id)
    )
    settings = result.scalar_one_or_none()
    
    if not settings:
        # Create default settings
        settings = DoctorSettings(doctor_id=doctor_id)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    
    return DoctorSettingsResponse.model_validate(settings)


@router.put("/doctors/{doctor_id}/settings", response_model=DoctorSettingsResponse)
async def update_doctor_settings(
    doctor_id: UUID,
    data: DoctorSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DoctorSettingsResponse:
    """Update a doctor's settings."""
    # Verify doctor exists and access
    doctor_result = await db.execute(
        select(Doctor).where(
            Doctor.id == doctor_id,
            Doctor.clinic_id == current_user.clinic_id,
        )
    )
    doctor = doctor_result.scalar_one_or_none()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )
    
    # Only the doctor themselves or admin can update settings
    if current_user.role.value == "doctor":
        if doctor.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own settings",
            )
    
    # Get or create settings
    result = await db.execute(
        select(DoctorSettings).where(DoctorSettings.doctor_id == doctor_id)
    )
    settings = result.scalar_one_or_none()
    
    if not settings:
        settings = DoctorSettings(doctor_id=doctor_id)
        db.add(settings)
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    await db.commit()
    await db.refresh(settings)
    
    return DoctorSettingsResponse.model_validate(settings)


# ============== User Management ==============


@router.get("/users", response_model=UserManagementListResponse)
async def list_users(
    current_user: User = Depends(require_permission(Permission.MANAGE_USERS)),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    role: Optional[str] = Query(None, description="Filter by role"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
) -> UserManagementListResponse:
    """List all users in the clinic."""
    query = select(User).where(User.clinic_id == current_user.clinic_id)
    
    if role:
        query = query.where(User.role == UserRole(role))
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    
    # Count
    from sqlalchemy import func
    count_query = select(func.count(User.id)).where(
        User.clinic_id == current_user.clinic_id
    )
    count_result = await db.execute(count_query)
    total_count = count_result.scalar() or 0
    
    # Order and paginate
    query = query.order_by(User.created_at.desc())
    query = query.offset(pagination.offset).limit(pagination.page_size)
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Get doctor info for users
    user_responses = []
    for user in users:
        response_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role.value,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "last_login_at": user.last_login_at,
            "doctor_id": None,
            "doctor_name": None,
        }
        
        # If user is a doctor, get their doctor profile
        if user.role == UserRole.DOCTOR:
            doctor_result = await db.execute(
                select(Doctor).where(Doctor.user_id == user.id)
            )
            doctor = doctor_result.scalar_one_or_none()
            if doctor:
                response_data["doctor_id"] = doctor.id
                response_data["doctor_name"] = doctor.name
        
        user_responses.append(UserManagementResponse(**response_data))
    
    return UserManagementListResponse(
        users=user_responses,
        total_count=total_count,
    )


@router.get("/users/{user_id}", response_model=UserManagementResponse)
async def get_user(
    user_id: UUID,
    current_user: User = Depends(require_permission(Permission.MANAGE_USERS)),
    db: AsyncSession = Depends(get_db),
) -> UserManagementResponse:
    """Get a specific user."""
    result = await db.execute(
        select(User).where(
            User.id == user_id,
            User.clinic_id == current_user.clinic_id,
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    response_data = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "last_login_at": user.last_login_at,
        "doctor_id": None,
        "doctor_name": None,
    }
    
    if user.role == UserRole.DOCTOR:
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if doctor:
            response_data["doctor_id"] = doctor.id
            response_data["doctor_name"] = doctor.name
    
    return UserManagementResponse(**response_data)


@router.put("/users/{user_id}", response_model=UserManagementResponse)
async def update_user(
    user_id: UUID,
    data: UserManagementUpdate,
    current_user: User = Depends(require_permission(Permission.MANAGE_USERS)),
    db: AsyncSession = Depends(get_db),
) -> UserManagementResponse:
    """Update a user."""
    result = await db.execute(
        select(User).where(
            User.id == user_id,
            User.clinic_id == current_user.clinic_id,
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Prevent deactivating yourself
    if user.id == current_user.id and data.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account",
        )
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    response_data = {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": user.role.value,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "last_login_at": user.last_login_at,
        "doctor_id": None,
        "doctor_name": None,
    }
    
    return UserManagementResponse(**response_data)


@router.post("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: UUID,
    current_user: User = Depends(require_permission(Permission.MANAGE_USERS)),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Deactivate a user."""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account",
        )
    
    result = await db.execute(
        select(User).where(
            User.id == user_id,
            User.clinic_id == current_user.clinic_id,
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    user.is_active = False
    await db.commit()
    
    return {"message": "User deactivated successfully"}


@router.post("/users/{user_id}/activate")
async def activate_user(
    user_id: UUID,
    current_user: User = Depends(require_permission(Permission.MANAGE_USERS)),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Reactivate a deactivated user."""
    result = await db.execute(
        select(User).where(
            User.id == user_id,
            User.clinic_id == current_user.clinic_id,
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    user.is_active = True
    await db.commit()
    
    return {"message": "User activated successfully"}
