"""
Follow-up API Routes

CRUD operations for patient follow-ups.
"""

from datetime import date, datetime
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    FollowUp,
    Patient,
    Doctor,
    User,
    FollowUpStatus,
)
from app.schemas import (
    FollowUpCreate,
    FollowUpUpdate,
    FollowUpResponse,
    FollowUpWithPatient,
    FollowUpListResponse,
)
from app.api.deps import (
    get_current_user,
    get_current_doctor,
    require_permission,
    PaginationParams,
)
from app.core.permissions import Permission


router = APIRouter(prefix="/follow-ups", tags=["Follow-ups"])


@router.get("", response_model=FollowUpListResponse)
async def list_follow_ups(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    status_filter: Optional[FollowUpStatus] = Query(None, description="Filter by status"),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient"),
    due_before: Optional[date] = Query(None, description="Filter by due date before"),
    due_after: Optional[date] = Query(None, description="Filter by due date after"),
) -> FollowUpListResponse:
    """
    List follow-ups.
    
    Doctors see only their follow-ups.
    Admins/owners see all follow-ups in the clinic.
    """
    # Build base query
    query = select(FollowUp).where(
        FollowUp.clinic_id == current_user.clinic_id
    ).options(
        selectinload(FollowUp.patient),
        selectinload(FollowUp.doctor),
    )
    
    # Doctors see only their follow-ups
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if doctor:
            query = query.where(FollowUp.doctor_id == doctor.id)
    
    # Apply filters
    if status_filter:
        query = query.where(FollowUp.status == status_filter)
    if patient_id:
        query = query.where(FollowUp.patient_id == patient_id)
    if due_before:
        query = query.where(FollowUp.due_date <= due_before)
    if due_after:
        query = query.where(FollowUp.due_date >= due_after)
    
    # Count
    count_query = select(func.count(FollowUp.id)).where(
        FollowUp.clinic_id == current_user.clinic_id
    )
    count_result = await db.execute(count_query)
    total_count = count_result.scalar() or 0
    
    # Order by due date
    query = query.order_by(FollowUp.due_date)
    query = query.offset(pagination.offset).limit(pagination.page_size)
    
    result = await db.execute(query)
    follow_ups = result.scalars().all()
    
    return FollowUpListResponse(
        follow_ups=[FollowUpWithPatient.model_validate(f) for f in follow_ups],
        total_count=total_count,
        page=pagination.page,
        page_size=pagination.page_size,
    )


@router.get("/due-soon", response_model=FollowUpListResponse)
async def get_follow_ups_due_soon(
    days: int = Query(7, description="Days to look ahead"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FollowUpListResponse:
    """Get follow-ups due within the specified number of days."""
    today = date.today()
    from datetime import timedelta
    due_date = today + timedelta(days=days)
    
    query = select(FollowUp).where(
        FollowUp.clinic_id == current_user.clinic_id,
        FollowUp.status == FollowUpStatus.PENDING,
        FollowUp.due_date >= today,
        FollowUp.due_date <= due_date,
    ).options(
        selectinload(FollowUp.patient),
        selectinload(FollowUp.doctor),
    ).order_by(FollowUp.due_date)
    
    # Doctors see only their follow-ups
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if doctor:
            query = query.where(FollowUp.doctor_id == doctor.id)
    
    result = await db.execute(query)
    follow_ups = result.scalars().all()
    
    return FollowUpListResponse(
        follow_ups=[FollowUpWithPatient.model_validate(f) for f in follow_ups],
        total_count=len(follow_ups),
        page=1,
        page_size=len(follow_ups),
    )


@router.get("/overdue", response_model=FollowUpListResponse)
async def get_overdue_follow_ups(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FollowUpListResponse:
    """Get overdue follow-ups."""
    today = date.today()
    
    query = select(FollowUp).where(
        FollowUp.clinic_id == current_user.clinic_id,
        FollowUp.status == FollowUpStatus.PENDING,
        FollowUp.due_date < today,
    ).options(
        selectinload(FollowUp.patient),
        selectinload(FollowUp.doctor),
    ).order_by(FollowUp.due_date)
    
    # Doctors see only their follow-ups
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if doctor:
            query = query.where(FollowUp.doctor_id == doctor.id)
    
    result = await db.execute(query)
    follow_ups = result.scalars().all()
    
    return FollowUpListResponse(
        follow_ups=[FollowUpWithPatient.model_validate(f) for f in follow_ups],
        total_count=len(follow_ups),
        page=1,
        page_size=len(follow_ups),
    )


@router.get("/{follow_up_id}", response_model=FollowUpWithPatient)
async def get_follow_up(
    follow_up_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FollowUpWithPatient:
    """Get a specific follow-up."""
    query = select(FollowUp).where(
        FollowUp.id == follow_up_id,
        FollowUp.clinic_id == current_user.clinic_id,
    ).options(
        selectinload(FollowUp.patient),
        selectinload(FollowUp.doctor),
    )
    
    result = await db.execute(query)
    follow_up = result.scalar_one_or_none()
    
    if not follow_up:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow-up not found",
        )
    
    # Doctors can only see their own follow-ups
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if not doctor or follow_up.doctor_id != doctor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied",
            )
    
    return FollowUpWithPatient.model_validate(follow_up)


@router.post("", response_model=FollowUpResponse, status_code=status.HTTP_201_CREATED)
async def create_follow_up(
    data: FollowUpCreate,
    current_user: User = Depends(require_permission(Permission.CREATE_FOLLOW_UPS)),
    db: AsyncSession = Depends(get_db),
) -> FollowUpResponse:
    """Create a new follow-up."""
    # Get doctor (required for follow-up)
    doctor_result = await db.execute(
        select(Doctor).where(Doctor.user_id == current_user.id)
    )
    doctor = doctor_result.scalar_one_or_none()
    
    if not doctor:
        # If not a doctor, doctor_id must be provided
        if not data.doctor_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Doctor ID required for non-doctor users",
            )
        doctor_id = data.doctor_id
    else:
        doctor_id = doctor.id
    
    # Verify patient exists
    patient_result = await db.execute(
        select(Patient).where(
            Patient.id == data.patient_id,
            Patient.clinic_id == current_user.clinic_id,
        )
    )
    patient = patient_result.scalar_one_or_none()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Create follow-up
    follow_up = FollowUp(
        clinic_id=current_user.clinic_id,
        doctor_id=doctor_id,
        patient_id=data.patient_id,
        due_date=data.due_date,
        reason=data.reason,
        notes=data.notes,
        priority=data.priority,
        status=FollowUpStatus.PENDING,
        created_by=current_user.id,
    )
    
    db.add(follow_up)
    await db.commit()
    await db.refresh(follow_up)
    
    return FollowUpResponse.model_validate(follow_up)


@router.put("/{follow_up_id}", response_model=FollowUpResponse)
async def update_follow_up(
    follow_up_id: UUID,
    data: FollowUpUpdate,
    current_user: User = Depends(require_permission(Permission.MANAGE_FOLLOW_UPS)),
    db: AsyncSession = Depends(get_db),
) -> FollowUpResponse:
    """Update a follow-up."""
    query = select(FollowUp).where(
        FollowUp.id == follow_up_id,
        FollowUp.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    follow_up = result.scalar_one_or_none()
    
    if not follow_up:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow-up not found",
        )
    
    # Doctors can only update their own follow-ups
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if not doctor or follow_up.doctor_id != doctor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own follow-ups",
            )
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(follow_up, field, value)
    
    await db.commit()
    await db.refresh(follow_up)
    
    return FollowUpResponse.model_validate(follow_up)


@router.post("/{follow_up_id}/complete", response_model=FollowUpResponse)
async def complete_follow_up(
    follow_up_id: UUID,
    notes: Optional[str] = None,
    current_user: User = Depends(require_permission(Permission.MANAGE_FOLLOW_UPS)),
    db: AsyncSession = Depends(get_db),
) -> FollowUpResponse:
    """Mark a follow-up as completed."""
    query = select(FollowUp).where(
        FollowUp.id == follow_up_id,
        FollowUp.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    follow_up = result.scalar_one_or_none()
    
    if not follow_up:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow-up not found",
        )
    
    follow_up.status = FollowUpStatus.COMPLETED
    follow_up.completed_at = datetime.utcnow()
    if notes:
        follow_up.notes = notes
    
    await db.commit()
    await db.refresh(follow_up)
    
    return FollowUpResponse.model_validate(follow_up)


@router.post("/{follow_up_id}/cancel", response_model=FollowUpResponse)
async def cancel_follow_up(
    follow_up_id: UUID,
    reason: Optional[str] = None,
    current_user: User = Depends(require_permission(Permission.MANAGE_FOLLOW_UPS)),
    db: AsyncSession = Depends(get_db),
) -> FollowUpResponse:
    """Cancel a follow-up."""
    query = select(FollowUp).where(
        FollowUp.id == follow_up_id,
        FollowUp.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    follow_up = result.scalar_one_or_none()
    
    if not follow_up:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow-up not found",
        )
    
    follow_up.status = FollowUpStatus.CANCELLED
    if reason:
        follow_up.notes = f"{follow_up.notes}\n\nCancellation reason: {reason}" if follow_up.notes else f"Cancellation reason: {reason}"
    
    await db.commit()
    await db.refresh(follow_up)
    
    return FollowUpResponse.model_validate(follow_up)


@router.delete("/{follow_up_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_follow_up(
    follow_up_id: UUID,
    current_user: User = Depends(require_permission(Permission.MANAGE_FOLLOW_UPS)),
    db: AsyncSession = Depends(get_db),
):
    """Delete a follow-up."""
    query = select(FollowUp).where(
        FollowUp.id == follow_up_id,
        FollowUp.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    follow_up = result.scalar_one_or_none()
    
    if not follow_up:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow-up not found",
        )
    
    # Doctors can only delete their own follow-ups
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if not doctor or follow_up.doctor_id != doctor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own follow-ups",
            )
    
    await db.delete(follow_up)
    await db.commit()
