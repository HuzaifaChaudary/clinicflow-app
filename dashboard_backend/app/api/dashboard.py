"""
Dashboard API Routes

Endpoints for dashboard summaries and statistics.
"""

from datetime import date, datetime, timedelta
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    Appointment,
    Patient,
    Doctor,
    User,
    Cancellation,
    IntakeSubmission,
    AppointmentStatus,
    IntakeStatus,
)
from app.schemas import (
    AdminDashboardSummary,
    DoctorDashboardSummary,
    NeedsAttentionItem,
    NeedsAttentionResponse,
    DailyStatsResponse,
    AppointmentsByStatusResponse,
    AppointmentsByProviderResponse,
)
from app.api.deps import (
    get_current_user,
    get_current_doctor,
    require_permission,
)
from app.core.permissions import Permission


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/admin/summary", response_model=AdminDashboardSummary)
async def get_admin_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AdminDashboardSummary:
    """
    Get admin dashboard summary.
    
    Shows aggregate statistics across all doctors in the clinic.
    """
    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    
    # Today's appointments
    today_count = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.date == today,
            Appointment.status != AppointmentStatus.CANCELLED,
        )
    ) or 0
    
    # Confirmed today
    confirmed_today = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.date == today,
            Appointment.status == AppointmentStatus.CONFIRMED,
        )
    ) or 0
    
    # Unconfirmed (next 7 days)
    unconfirmed_count = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.date >= today,
            Appointment.date <= today + timedelta(days=7),
            Appointment.status == AppointmentStatus.UNCONFIRMED,
        )
    ) or 0
    
    # Missing intake (upcoming)
    missing_intake_count = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.date >= today,
            Appointment.intake_status.in_([IntakeStatus.NOT_STARTED, IntakeStatus.SENT]),
            Appointment.status.not_in([AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]),
        )
    ) or 0
    
    # Checked in today
    checked_in_today = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.date == today,
            Appointment.status == AppointmentStatus.CHECKED_IN,
        )
    ) or 0
    
    # Completed today
    completed_today = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.date == today,
            Appointment.status == AppointmentStatus.COMPLETED,
        )
    ) or 0
    
    # Cancellations this week
    cancellations_week = await db.scalar(
        select(func.count(Cancellation.id)).where(
            Cancellation.clinic_id == current_user.clinic_id,
            Cancellation.cancelled_at >= week_start,
        )
    ) or 0
    
    # No shows this week
    no_shows_week = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.date >= week_start,
            Appointment.status == AppointmentStatus.NO_SHOW,
        )
    ) or 0
    
    # Active patients count
    active_patients = await db.scalar(
        select(func.count(Patient.id)).where(
            Patient.clinic_id == current_user.clinic_id,
            Patient.is_active == True,
        )
    ) or 0
    
    # Active doctors count
    active_doctors = await db.scalar(
        select(func.count(Doctor.id)).where(
            Doctor.clinic_id == current_user.clinic_id,
            Doctor.is_active == True,
        )
    ) or 0
    
    return AdminDashboardSummary(
        today_appointments=today_count,
        confirmed_today=confirmed_today,
        unconfirmed_upcoming=unconfirmed_count,
        missing_intake=missing_intake_count,
        checked_in_today=checked_in_today,
        completed_today=completed_today,
        cancellations_this_week=cancellations_week,
        no_shows_this_week=no_shows_week,
        active_patients=active_patients,
        active_doctors=active_doctors,
    )


@router.get("/doctor/summary", response_model=DoctorDashboardSummary)
async def get_doctor_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    doctor_id: Optional[UUID] = Query(None, description="Doctor ID (admin can view any doctor)"),
) -> DoctorDashboardSummary:
    """
    Get doctor-specific dashboard summary.
    
    Doctors see their own stats. Admins can view any doctor's stats.
    """
    today = date.today()
    
    # Determine which doctor
    if current_user.role.value == "doctor":
        # Get doctor for current user
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if not doctor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Doctor profile not found",
            )
        target_doctor_id = doctor.id
    elif doctor_id:
        target_doctor_id = doctor_id
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor ID required for non-doctor users",
        )
    
    # Today's appointments
    today_appointments = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.doctor_id == target_doctor_id,
            Appointment.date == today,
            Appointment.status != AppointmentStatus.CANCELLED,
        )
    ) or 0
    
    # Next appointment
    next_appt_result = await db.execute(
        select(Appointment).where(
            Appointment.doctor_id == target_doctor_id,
            Appointment.date == today,
            Appointment.status.in_([AppointmentStatus.CONFIRMED, AppointmentStatus.CHECKED_IN]),
        ).options(
            selectinload(Appointment.patient)
        ).order_by(Appointment.start_time).limit(1)
    )
    next_appointment = next_appt_result.scalar_one_or_none()
    
    # Completed today
    completed_today = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.doctor_id == target_doctor_id,
            Appointment.date == today,
            Appointment.status == AppointmentStatus.COMPLETED,
        )
    ) or 0
    
    # Remaining today
    remaining_today = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.doctor_id == target_doctor_id,
            Appointment.date == today,
            Appointment.status.in_([
                AppointmentStatus.UNCONFIRMED,
                AppointmentStatus.CONFIRMED,
                AppointmentStatus.CHECKED_IN,
            ]),
        )
    ) or 0
    
    # Patients needing intake
    needing_intake = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.doctor_id == target_doctor_id,
            Appointment.date == today,
            Appointment.intake_status.in_([IntakeStatus.NOT_STARTED, IntakeStatus.SENT]),
            Appointment.status.not_in([AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]),
        )
    ) or 0
    
    return DoctorDashboardSummary(
        doctor_id=target_doctor_id,
        today_appointments=today_appointments,
        completed_today=completed_today,
        remaining_today=remaining_today,
        needing_intake=needing_intake,
        next_appointment={
            "id": str(next_appointment.id),
            "patient_name": f"{next_appointment.patient.first_name} {next_appointment.patient.last_name}",
            "start_time": next_appointment.start_time,
            "status": next_appointment.status.value,
        } if next_appointment else None,
    )


@router.get("/needs-attention", response_model=NeedsAttentionResponse)
async def get_needs_attention_items(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = Query(20, le=50, description="Max items to return"),
) -> NeedsAttentionResponse:
    """
    Get items requiring attention.
    
    Returns unconfirmed appointments, missing intake, etc.
    """
    today = date.today()
    items: List[NeedsAttentionItem] = []
    
    # Get doctor if user is a doctor
    doctor_filter = None
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if doctor:
            doctor_filter = doctor.id
    
    # Unconfirmed appointments
    unconfirmed_query = select(Appointment).where(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date >= today,
        Appointment.date <= today + timedelta(days=3),
        Appointment.status == AppointmentStatus.UNCONFIRMED,
    ).options(
        selectinload(Appointment.patient),
        selectinload(Appointment.doctor),
    ).order_by(Appointment.date, Appointment.start_time).limit(limit // 2)
    
    if doctor_filter:
        unconfirmed_query = unconfirmed_query.where(Appointment.doctor_id == doctor_filter)
    
    unconfirmed_result = await db.execute(unconfirmed_query)
    for appt in unconfirmed_result.scalars().all():
        items.append(NeedsAttentionItem(
            id=str(appt.id),
            type="unconfirmed",
            title=f"Unconfirmed: {appt.patient.first_name} {appt.patient.last_name}",
            description=f"{appt.date.isoformat()} at {appt.start_time} with Dr. {appt.doctor.name}",
            priority="high" if appt.date == today else "medium",
            created_at=appt.created_at,
            resource_type="appointment",
            resource_id=str(appt.id),
        ))
    
    # Missing intake
    missing_intake_query = select(Appointment).where(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date >= today,
        Appointment.date <= today + timedelta(days=2),
        Appointment.intake_status.in_([IntakeStatus.NOT_STARTED, IntakeStatus.SENT]),
        Appointment.status.not_in([AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]),
    ).options(
        selectinload(Appointment.patient),
        selectinload(Appointment.doctor),
    ).order_by(Appointment.date, Appointment.start_time).limit(limit // 2)
    
    if doctor_filter:
        missing_intake_query = missing_intake_query.where(Appointment.doctor_id == doctor_filter)
    
    missing_intake_result = await db.execute(missing_intake_query)
    for appt in missing_intake_result.scalars().all():
        items.append(NeedsAttentionItem(
            id=str(appt.id),
            type="missing_intake",
            title=f"Missing Intake: {appt.patient.first_name} {appt.patient.last_name}",
            description=f"{appt.date.isoformat()} at {appt.start_time}",
            priority="high" if appt.date == today else "medium",
            created_at=appt.created_at,
            resource_type="appointment",
            resource_id=str(appt.id),
        ))
    
    # Sort by priority and date
    items.sort(key=lambda x: (0 if x.priority == "high" else 1, x.created_at))
    
    return NeedsAttentionResponse(
        items=items[:limit],
        total_count=len(items),
    )


@router.get("/stats/daily", response_model=DailyStatsResponse)
async def get_daily_stats(
    view_date: date = Query(default_factory=date.today, description="Date to get stats for"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DailyStatsResponse:
    """Get detailed statistics for a specific day."""
    # Total appointments
    total = await db.scalar(
        select(func.count(Appointment.id)).where(
            Appointment.clinic_id == current_user.clinic_id,
            Appointment.date == view_date,
        )
    ) or 0
    
    # By status
    status_counts = {}
    for status in AppointmentStatus:
        count = await db.scalar(
            select(func.count(Appointment.id)).where(
                Appointment.clinic_id == current_user.clinic_id,
                Appointment.date == view_date,
                Appointment.status == status,
            )
        ) or 0
        status_counts[status.value] = count
    
    # By intake status
    intake_counts = {}
    for intake_status in IntakeStatus:
        count = await db.scalar(
            select(func.count(Appointment.id)).where(
                Appointment.clinic_id == current_user.clinic_id,
                Appointment.date == view_date,
                Appointment.intake_status == intake_status,
            )
        ) or 0
        intake_counts[intake_status.value] = count
    
    return DailyStatsResponse(
        date=view_date,
        total_appointments=total,
        by_status=status_counts,
        by_intake_status=intake_counts,
    )


@router.get("/stats/by-status", response_model=AppointmentsByStatusResponse)
async def get_appointments_by_status(
    start_date: date = Query(..., description="Start of date range"),
    end_date: date = Query(..., description="End of date range"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AppointmentsByStatusResponse:
    """Get appointment counts grouped by status for a date range."""
    counts = {}
    
    for status in AppointmentStatus:
        count = await db.scalar(
            select(func.count(Appointment.id)).where(
                Appointment.clinic_id == current_user.clinic_id,
                Appointment.date >= start_date,
                Appointment.date <= end_date,
                Appointment.status == status,
            )
        ) or 0
        counts[status.value] = count
    
    total = sum(counts.values())
    
    return AppointmentsByStatusResponse(
        start_date=start_date,
        end_date=end_date,
        total=total,
        by_status=counts,
    )


@router.get("/stats/by-provider", response_model=AppointmentsByProviderResponse)
async def get_appointments_by_provider(
    start_date: date = Query(..., description="Start of date range"),
    end_date: date = Query(..., description="End of date range"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AppointmentsByProviderResponse:
    """Get appointment counts grouped by doctor for a date range."""
    # Get all doctors
    doctors_result = await db.execute(
        select(Doctor).where(
            Doctor.clinic_id == current_user.clinic_id,
            Doctor.is_active == True,
        )
    )
    doctors = doctors_result.scalars().all()
    
    by_provider = []
    for doctor in doctors:
        count = await db.scalar(
            select(func.count(Appointment.id)).where(
                Appointment.doctor_id == doctor.id,
                Appointment.date >= start_date,
                Appointment.date <= end_date,
                Appointment.status != AppointmentStatus.CANCELLED,
            )
        ) or 0
        
        by_provider.append({
            "doctor_id": str(doctor.id),
            "doctor_name": doctor.name,
            "appointment_count": count,
        })
    
    # Sort by count descending
    by_provider.sort(key=lambda x: x["appointment_count"], reverse=True)
    
    total = sum(p["appointment_count"] for p in by_provider)
    
    return AppointmentsByProviderResponse(
        start_date=start_date,
        end_date=end_date,
        total=total,
        by_provider=by_provider,
    )
