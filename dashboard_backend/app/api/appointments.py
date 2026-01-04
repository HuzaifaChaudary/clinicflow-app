"""
Appointment API Routes

CRUD operations and actions for appointments.
"""

from datetime import date, datetime
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    Appointment,
    Patient,
    Doctor,
    User,
    AppointmentStatus,
    IntakeStatus,
    VisitType,
    Cancellation,
)
from app.schemas import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
    AppointmentDetailResponse,
    AppointmentListResponse,
    AppointmentConfirm,
    AppointmentCancel,
    AppointmentNoShow,
    AppointmentCheckIn,
    AppointmentReschedule,
    ScheduleGridRequest,
    ScheduleGridResponse,
    TimeSlotResponse,
)
from app.api.deps import (
    get_current_user,
    get_current_doctor,
    get_current_doctor_optional,
    require_permission,
    PaginationParams,
    DateRangeParams,
)
from app.core.permissions import Permission


router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get("", response_model=AppointmentListResponse)
async def list_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    date_filter: Optional[date] = Query(None, description="Filter by specific date"),
    start_date: Optional[date] = Query(None, description="Start of date range"),
    end_date: Optional[date] = Query(None, description="End of date range"),
    doctor_id: Optional[UUID] = Query(None, description="Filter by doctor"),
    status: Optional[AppointmentStatus] = Query(None, description="Filter by status"),
    intake_status: Optional[IntakeStatus] = Query(None, description="Filter by intake status"),
) -> AppointmentListResponse:
    """
    List appointments with optional filters.
    
    Doctors see only their own appointments.
    Admins and owners see all appointments in their clinic.
    """
    # Build base query
    query = select(Appointment).where(
        Appointment.clinic_id == current_user.clinic_id
    ).options(
        selectinload(Appointment.patient),
        selectinload(Appointment.doctor),
    )
    
    # Doctor sees only their appointments
    doctor = await get_current_doctor_optional_impl(current_user, db)
    if doctor:
        query = query.where(Appointment.doctor_id == doctor.id)
    elif doctor_id:
        query = query.where(Appointment.doctor_id == doctor_id)
    
    # Date filters
    if date_filter:
        query = query.where(Appointment.date == date_filter)
    elif start_date and end_date:
        query = query.where(
            Appointment.date >= start_date,
            Appointment.date <= end_date,
        )
    
    # Status filters
    if status:
        query = query.where(Appointment.status == status)
    if intake_status:
        query = query.where(Appointment.intake_status == intake_status)
    
    # Order by date and time
    query = query.order_by(Appointment.date, Appointment.start_time)
    
    # Count total
    count_query = select(Appointment.id).where(
        Appointment.clinic_id == current_user.clinic_id
    )
    result = await db.execute(count_query)
    total_count = len(result.all())
    
    # Apply pagination
    query = query.offset(pagination.offset).limit(pagination.page_size)
    
    result = await db.execute(query)
    appointments = result.scalars().all()
    
    return AppointmentListResponse(
        appointments=[AppointmentResponse.model_validate(a) for a in appointments],
        total_count=total_count,
        page=pagination.page,
        page_size=pagination.page_size,
    )


@router.get("/today", response_model=AppointmentListResponse)
async def get_todays_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    doctor_id: Optional[UUID] = Query(None, description="Filter by doctor"),
) -> AppointmentListResponse:
    """Get all appointments for today."""
    today = date.today()
    
    query = select(Appointment).where(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date == today,
    ).options(
        selectinload(Appointment.patient),
        selectinload(Appointment.doctor),
    ).order_by(Appointment.start_time)
    
    # Doctor filter
    doctor = await get_current_doctor_optional_impl(current_user, db)
    if doctor:
        query = query.where(Appointment.doctor_id == doctor.id)
    elif doctor_id:
        query = query.where(Appointment.doctor_id == doctor_id)
    
    result = await db.execute(query)
    appointments = result.scalars().all()
    
    return AppointmentListResponse(
        appointments=[AppointmentResponse.model_validate(a) for a in appointments],
        total_count=len(appointments),
        page=1,
        page_size=len(appointments),
    )


@router.get("/unconfirmed", response_model=AppointmentListResponse)
async def get_unconfirmed_appointments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    days_ahead: int = Query(7, description="Number of days to look ahead"),
) -> AppointmentListResponse:
    """Get unconfirmed appointments for the next N days."""
    today = date.today()
    from datetime import timedelta
    end_date = today + timedelta(days=days_ahead)
    
    query = select(Appointment).where(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.status == AppointmentStatus.UNCONFIRMED,
        Appointment.date >= today,
        Appointment.date <= end_date,
    ).options(
        selectinload(Appointment.patient),
        selectinload(Appointment.doctor),
    ).order_by(Appointment.date, Appointment.start_time)
    
    result = await db.execute(query)
    appointments = result.scalars().all()
    
    return AppointmentListResponse(
        appointments=[AppointmentResponse.model_validate(a) for a in appointments],
        total_count=len(appointments),
        page=1,
        page_size=len(appointments),
    )


@router.get("/needs-intake", response_model=AppointmentListResponse)
async def get_appointments_needing_intake(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AppointmentListResponse:
    """Get appointments that are missing intake forms."""
    today = date.today()
    
    query = select(Appointment).where(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date >= today,
        Appointment.intake_status.in_([IntakeStatus.NOT_STARTED, IntakeStatus.IN_PROGRESS]),
        Appointment.status.not_in([AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]),
    ).options(
        selectinload(Appointment.patient),
        selectinload(Appointment.doctor),
    ).order_by(Appointment.date, Appointment.start_time)
    
    result = await db.execute(query)
    appointments = result.scalars().all()
    
    return AppointmentListResponse(
        appointments=[AppointmentResponse.model_validate(a) for a in appointments],
        total_count=len(appointments),
        page=1,
        page_size=len(appointments),
    )


@router.get("/{appointment_id}", response_model=AppointmentDetailResponse)
async def get_appointment(
    appointment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AppointmentDetailResponse:
    """Get a specific appointment by ID."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    ).options(
        selectinload(Appointment.patient),
        selectinload(Appointment.doctor),
        selectinload(Appointment.intake_submissions),
        selectinload(Appointment.cancellation),
    )
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    # Check doctor access
    doctor = await get_current_doctor_optional_impl(current_user, db)
    if doctor and appointment.doctor_id != doctor.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied",
        )
    
    return AppointmentDetailResponse.model_validate(appointment)


@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    data: AppointmentCreate,
    current_user: User = Depends(require_permission(Permission.CREATE_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
) -> AppointmentResponse:
    """Create a new appointment."""
    # Verify patient exists in clinic
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
    
    # Verify doctor exists in clinic
    doctor_result = await db.execute(
        select(Doctor).where(
            Doctor.id == data.doctor_id,
            Doctor.clinic_id == current_user.clinic_id,
        )
    )
    doctor = doctor_result.scalar_one_or_none()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )
    
    # Create appointment
    appointment = Appointment(
        clinic_id=current_user.clinic_id,
        patient_id=data.patient_id,
        doctor_id=data.doctor_id,
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        visit_type=data.visit_type,
        status=AppointmentStatus.UNCONFIRMED,
        intake_status=IntakeStatus.NOT_STARTED,
        reason_for_visit=data.reason_for_visit,
        notes=data.notes,
        created_by=current_user.id,
    )
    
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    
    # Load relationships
    await db.refresh(appointment, ["patient", "doctor"])
    
    return AppointmentResponse.model_validate(appointment)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: UUID,
    data: AppointmentUpdate,
    current_user: User = Depends(require_permission(Permission.UPDATE_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
) -> AppointmentResponse:
    """Update an appointment."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)
    
    await db.commit()
    await db.refresh(appointment, ["patient", "doctor"])
    
    return AppointmentResponse.model_validate(appointment)


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(
    appointment_id: UUID,
    current_user: User = Depends(require_permission(Permission.DELETE_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
):
    """Delete an appointment (soft delete by cancelling)."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    # Soft delete by setting status to cancelled
    appointment.status = AppointmentStatus.CANCELLED
    await db.commit()


# Appointment Actions


@router.post("/{appointment_id}/confirm", response_model=AppointmentResponse)
async def confirm_appointment(
    appointment_id: UUID,
    data: AppointmentConfirm,
    current_user: User = Depends(require_permission(Permission.UPDATE_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
) -> AppointmentResponse:
    """Confirm an appointment."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    if appointment.status != AppointmentStatus.UNCONFIRMED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment is not in unconfirmed status",
        )
    
    appointment.status = AppointmentStatus.CONFIRMED
    appointment.confirmed_at = datetime.utcnow()
    appointment.confirmed_by = data.confirmed_by
    
    await db.commit()
    await db.refresh(appointment, ["patient", "doctor"])
    
    return AppointmentResponse.model_validate(appointment)


@router.post("/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel_appointment(
    appointment_id: UUID,
    data: AppointmentCancel,
    current_user: User = Depends(require_permission(Permission.CANCEL_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
) -> AppointmentResponse:
    """Cancel an appointment."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    ).options(selectinload(Appointment.patient))
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    if appointment.status == AppointmentStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment is already cancelled",
        )
    
    # Update appointment status
    appointment.status = AppointmentStatus.CANCELLED
    appointment.cancelled_at = datetime.utcnow()
    
    # Create cancellation record
    cancellation = Cancellation(
        appointment_id=appointment.id,
        patient_id=appointment.patient_id,
        clinic_id=current_user.clinic_id,
        reason=data.reason,
        cancelled_by=data.cancelled_by or "staff",
        notice_hours=data.notice_hours,
        is_late_cancel=data.notice_hours is not None and data.notice_hours < 24,
    )
    db.add(cancellation)
    
    # Update patient cancellation count
    if appointment.patient:
        appointment.patient.cancellation_count += 1
        if cancellation.is_late_cancel:
            appointment.patient.late_cancel_count += 1
    
    await db.commit()
    await db.refresh(appointment, ["patient", "doctor"])
    
    return AppointmentResponse.model_validate(appointment)


@router.post("/{appointment_id}/no-show", response_model=AppointmentResponse)
async def mark_no_show(
    appointment_id: UUID,
    data: AppointmentNoShow,
    current_user: User = Depends(require_permission(Permission.UPDATE_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
) -> AppointmentResponse:
    """Mark an appointment as no-show."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    ).options(selectinload(Appointment.patient))
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    appointment.status = AppointmentStatus.NO_SHOW
    appointment.notes = data.notes if data.notes else appointment.notes
    
    # Update patient no-show count
    if appointment.patient:
        appointment.patient.no_show_count += 1
    
    await db.commit()
    await db.refresh(appointment, ["patient", "doctor"])
    
    return AppointmentResponse.model_validate(appointment)


@router.post("/{appointment_id}/check-in", response_model=AppointmentResponse)
async def check_in_appointment(
    appointment_id: UUID,
    data: AppointmentCheckIn,
    current_user: User = Depends(require_permission(Permission.UPDATE_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
) -> AppointmentResponse:
    """Check in a patient for their appointment."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    if appointment.status not in [AppointmentStatus.UNCONFIRMED, AppointmentStatus.CONFIRMED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot check in this appointment",
        )
    
    appointment.status = AppointmentStatus.CHECKED_IN
    appointment.checked_in_at = data.checked_in_at or datetime.utcnow()
    
    await db.commit()
    await db.refresh(appointment, ["patient", "doctor"])
    
    return AppointmentResponse.model_validate(appointment)


@router.post("/{appointment_id}/reschedule", response_model=AppointmentResponse)
async def reschedule_appointment(
    appointment_id: UUID,
    data: AppointmentReschedule,
    current_user: User = Depends(require_permission(Permission.RESCHEDULE_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
) -> AppointmentResponse:
    """Reschedule an appointment to a new date/time."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    if appointment.status in [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot reschedule this appointment",
        )
    
    # Update appointment with new date/time
    appointment.date = data.new_date
    appointment.start_time = data.new_start_time
    appointment.end_time = data.new_end_time
    appointment.status = AppointmentStatus.UNCONFIRMED  # Reset to unconfirmed
    appointment.rescheduled_at = datetime.utcnow()
    appointment.reschedule_reason = data.reason
    
    if data.new_doctor_id:
        # Verify new doctor
        doctor_result = await db.execute(
            select(Doctor).where(
                Doctor.id == data.new_doctor_id,
                Doctor.clinic_id == current_user.clinic_id,
            )
        )
        if not doctor_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="New doctor not found",
            )
        appointment.doctor_id = data.new_doctor_id
    
    await db.commit()
    await db.refresh(appointment, ["patient", "doctor"])
    
    return AppointmentResponse.model_validate(appointment)


@router.post("/{appointment_id}/complete", response_model=AppointmentResponse)
async def complete_appointment(
    appointment_id: UUID,
    current_user: User = Depends(require_permission(Permission.UPDATE_APPOINTMENT)),
    db: AsyncSession = Depends(get_db),
) -> AppointmentResponse:
    """Mark an appointment as completed."""
    query = select(Appointment).where(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    appointment.status = AppointmentStatus.COMPLETED
    appointment.completed_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(appointment, ["patient", "doctor"])
    
    return AppointmentResponse.model_validate(appointment)


# Helper function
async def get_current_doctor_optional_impl(user: User, db: AsyncSession) -> Optional[Doctor]:
    """Get doctor for user if they are a doctor."""
    if user.role.value != "doctor":
        return None
    result = await db.execute(
        select(Doctor).where(Doctor.user_id == user.id)
    )
    return result.scalar_one_or_none()
