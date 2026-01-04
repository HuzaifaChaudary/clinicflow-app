"""
Schedule API Routes

Endpoints for schedule grid and time slot management.
"""

from datetime import date, time, datetime, timedelta
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    Appointment,
    Doctor,
    User,
    Clinic,
    ClinicSettings,
    DoctorSettings,
    AppointmentStatus,
)
from app.schemas import (
    ScheduleGridRequest,
    ScheduleGridResponse,
    TimeSlotResponse,
    AppointmentResponse,
)
from app.api.deps import get_current_user


router = APIRouter(prefix="/schedule", tags=["Schedule"])


@router.get("/grid", response_model=ScheduleGridResponse)
async def get_schedule_grid(
    view_date: date = Query(..., description="Date to view schedule for"),
    doctor_ids: Optional[List[UUID]] = Query(None, description="Filter by specific doctors"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ScheduleGridResponse:
    """
    Get the schedule grid for a specific date.
    
    Returns a grid with time slots and appointments organized by doctor columns.
    """
    # Get clinic settings for slot duration
    settings_result = await db.execute(
        select(ClinicSettings).where(ClinicSettings.clinic_id == current_user.clinic_id)
    )
    settings = settings_result.scalar_one_or_none()
    slot_duration = settings.slot_size if settings else 15
    
    # Get clinic for working hours
    clinic_result = await db.execute(
        select(Clinic).where(Clinic.id == current_user.clinic_id)
    )
    clinic = clinic_result.scalar_one_or_none()
    
    if not clinic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found",
        )
    
    # Get doctors
    doctors_query = select(Doctor).where(
        Doctor.clinic_id == current_user.clinic_id,
        Doctor.is_active == True,
    )
    if doctor_ids:
        doctors_query = doctors_query.where(Doctor.id.in_(doctor_ids))
    
    doctors_result = await db.execute(doctors_query)
    doctors = doctors_result.scalars().all()
    
    # Get appointments for the date
    appts_query = select(Appointment).where(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date == view_date,
        Appointment.status != AppointmentStatus.CANCELLED,
    ).options(
        selectinload(Appointment.patient),
        selectinload(Appointment.doctor),
    )
    
    if doctor_ids:
        appts_query = appts_query.where(Appointment.doctor_id.in_(doctor_ids))
    
    appts_result = await db.execute(appts_query)
    appointments = appts_result.scalars().all()
    
    # Build appointments by doctor
    appointments_by_doctor = {}
    for appt in appointments:
        doctor_id_str = str(appt.doctor_id)
        if doctor_id_str not in appointments_by_doctor:
            appointments_by_doctor[doctor_id_str] = []
        appointments_by_doctor[doctor_id_str].append(
            AppointmentResponse.model_validate(appt)
        )
    
    # Generate time slots
    opening_time = datetime.strptime(clinic.opening_time, "%H:%M").time()
    closing_time = datetime.strptime(clinic.closing_time, "%H:%M").time()
    
    time_slots = []
    current_time = datetime.combine(view_date, opening_time)
    end_datetime = datetime.combine(view_date, closing_time)
    
    while current_time < end_datetime:
        slot_end = current_time + timedelta(minutes=slot_duration)
        time_slots.append(TimeSlotResponse(
            start_time=current_time.time().strftime("%H:%M"),
            end_time=slot_end.time().strftime("%H:%M"),
            is_available=True,  # Simplified - real implementation would check conflicts
        ))
        current_time = slot_end
    
    # Build doctor columns
    doctor_columns = []
    for doctor in doctors:
        doctor_columns.append({
            "doctor_id": str(doctor.id),
            "doctor_name": doctor.name,
            "doctor_color": doctor.color,
            "appointments": appointments_by_doctor.get(str(doctor.id), []),
        })
    
    return ScheduleGridResponse(
        date=view_date,
        slot_duration_minutes=slot_duration,
        time_slots=time_slots,
        doctor_columns=doctor_columns,
        total_appointments=len(appointments),
    )


@router.get("/available-slots")
async def get_available_slots(
    doctor_id: UUID,
    view_date: date = Query(..., description="Date to check availability"),
    duration_minutes: int = Query(30, description="Required appointment duration"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """
    Get available time slots for a specific doctor on a given date.
    
    Used for booking new appointments.
    """
    # Verify doctor
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
    
    # Get clinic settings
    clinic_result = await db.execute(
        select(Clinic).where(Clinic.id == current_user.clinic_id)
    )
    clinic = clinic_result.scalar_one_or_none()
    
    settings_result = await db.execute(
        select(ClinicSettings).where(ClinicSettings.clinic_id == current_user.clinic_id)
    )
    settings = settings_result.scalar_one_or_none()
    slot_duration = settings.slot_size if settings else 15
    
    # Get existing appointments
    appts_result = await db.execute(
        select(Appointment).where(
            Appointment.doctor_id == doctor_id,
            Appointment.date == view_date,
            Appointment.status != AppointmentStatus.CANCELLED,
        )
    )
    existing_appointments = appts_result.scalars().all()
    
    # Build list of busy times
    busy_times = []
    for appt in existing_appointments:
        busy_times.append((
            datetime.strptime(appt.start_time, "%H:%M").time(),
            datetime.strptime(appt.end_time, "%H:%M").time(),
        ))
    
    # Generate available slots
    opening_time = datetime.strptime(clinic.opening_time, "%H:%M").time()
    closing_time = datetime.strptime(clinic.closing_time, "%H:%M").time()
    
    available_slots = []
    current_time = datetime.combine(view_date, opening_time)
    end_datetime = datetime.combine(view_date, closing_time)
    
    while current_time + timedelta(minutes=duration_minutes) <= end_datetime:
        slot_start = current_time.time()
        slot_end = (current_time + timedelta(minutes=duration_minutes)).time()
        
        # Check if slot conflicts with existing appointments
        is_available = True
        for busy_start, busy_end in busy_times:
            # Check for overlap
            if not (slot_end <= busy_start or slot_start >= busy_end):
                is_available = False
                break
        
        if is_available:
            available_slots.append({
                "start_time": slot_start.strftime("%H:%M"),
                "end_time": slot_end.strftime("%H:%M"),
            })
        
        current_time += timedelta(minutes=slot_duration)
    
    return available_slots


@router.get("/week")
async def get_week_schedule(
    start_date: date = Query(..., description="Start of week"),
    doctor_ids: Optional[List[UUID]] = Query(None, description="Filter by doctors"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Get schedule overview for a week.
    
    Returns appointment counts per day per doctor.
    """
    end_date = start_date + timedelta(days=6)
    
    # Get appointments for the week
    query = select(Appointment).where(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date >= start_date,
        Appointment.date <= end_date,
        Appointment.status != AppointmentStatus.CANCELLED,
    )
    
    if doctor_ids:
        query = query.where(Appointment.doctor_id.in_(doctor_ids))
    
    result = await db.execute(query)
    appointments = result.scalars().all()
    
    # Organize by date
    by_date = {}
    for appt in appointments:
        date_str = appt.date.isoformat()
        if date_str not in by_date:
            by_date[date_str] = {"total": 0, "by_doctor": {}, "by_status": {}}
        
        by_date[date_str]["total"] += 1
        
        doctor_id_str = str(appt.doctor_id)
        if doctor_id_str not in by_date[date_str]["by_doctor"]:
            by_date[date_str]["by_doctor"][doctor_id_str] = 0
        by_date[date_str]["by_doctor"][doctor_id_str] += 1
        
        status_str = appt.status.value
        if status_str not in by_date[date_str]["by_status"]:
            by_date[date_str]["by_status"][status_str] = 0
        by_date[date_str]["by_status"][status_str] += 1
    
    return {
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "days": by_date,
    }


@router.get("/doctors")
async def get_schedule_doctors(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """
    Get list of doctors for schedule filtering.
    """
    result = await db.execute(
        select(Doctor).where(
            Doctor.clinic_id == current_user.clinic_id,
            Doctor.is_active == True,
        ).order_by(Doctor.name)
    )
    doctors = result.scalars().all()
    
    return [
        {
            "id": str(d.id),
            "name": d.name,
            "initials": d.initials,
            "color": d.color,
            "specialty": d.specialty,
        }
        for d in doctors
    ]
