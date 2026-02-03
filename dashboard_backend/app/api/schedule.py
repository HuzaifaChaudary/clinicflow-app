from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from uuid import UUID
from datetime import date, timedelta
from app.database import get_db
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.owner import ClinicSettings
from app.api.deps import get_current_user, require_admin, require_admin_or_doctor, require_owner_or_admin, require_owner_admin_or_doctor
from app.models.user import User
from app.services.scheduling_service import get_available_slots
from app.utils.date_format import format_time
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/api/schedule", tags=["schedule"])


class PatientInfo(BaseModel):
    id: str
    name: str


class AppointmentInfo(BaseModel):
    id: str
    time: str
    duration: int
    patient: PatientInfo
    visitType: str
    status: Dict[str, Any]


class DoctorSchedule(BaseModel):
    id: str
    name: str
    color: Optional[str]
    appointments: List[AppointmentInfo]


class DayScheduleResponse(BaseModel):
    date: str
    doctors: List[DoctorSchedule]


class AvailableSlotsResponse(BaseModel):
    date: str
    doctor_id: str
    available_slots: List[str]


@router.get("/day", response_model=DayScheduleResponse)
def get_day_schedule(
    date_param: Optional[date] = Query(None, alias="date"),
    current_user: User = Depends(require_owner_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get day schedule - doctors see only their own, admin/owner see all"""
    if date_param is None:
        date_param = date.today()
    
    # Get clinic settings for formatting
    clinic_settings = db.query(ClinicSettings).filter(
        ClinicSettings.clinic_id == current_user.clinic_id
    ).first()
    time_format = clinic_settings.time_format if clinic_settings else "12h"
    
    # If doctor, only show their own schedule
    if current_user.role == "doctor":
        if not current_user.doctor_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Doctor profile not found"
            )
        doctors = db.query(Doctor).filter(Doctor.id == current_user.doctor_id).all()
    else:
        # Admin or owner can see all doctors
        doctors = db.query(Doctor).filter(Doctor.clinic_id == current_user.clinic_id).all()
    
    doctor_schedules = []
    for doctor in doctors:
        # Get appointments for this doctor on this date
        appointments = db.query(Appointment).options(
            joinedload(Appointment.patient)
        ).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.date == date_param,
            Appointment.status != "cancelled"
        ).order_by(Appointment.start_time).all()
        
        appointment_infos = []
        for apt in appointments:
            appointment_infos.append(AppointmentInfo(
                id=str(apt.id),
                time=format_time(apt.start_time, time_format),
                duration=apt.duration or 30,
                patient=PatientInfo(
                    id=str(apt.patient.id),
                    name=apt.patient.full_name
                ),
                visitType=apt.visit_type or "in-clinic",
                status={
                    "confirmed": apt.status == "confirmed",
                    "intakeComplete": apt.intake_status == "completed"
                }
            ))
        
        doctor_schedules.append(DoctorSchedule(
            id=str(doctor.id),
            name=doctor.name,
            color=doctor.color,
            appointments=appointment_infos
        ))
    
    return DayScheduleResponse(
        date=date_param.isoformat(),
        doctors=doctor_schedules
    )


@router.get("/day/{doctor_id}", response_model=DayScheduleResponse)
def get_doctor_day_schedule(
    doctor_id: UUID,
    date_param: Optional[date] = Query(None, alias="date"),
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get day schedule for one doctor"""
    if date_param is None:
        date_param = date.today()
    
    # Verify doctor exists and user has access
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id,
        Doctor.clinic_id == current_user.clinic_id
    ).first()
    
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    # Doctor can only see their own schedule
    if current_user.role == "doctor" and doctor_id != current_user.doctor_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only view your own schedule"
        )
    
    # Get clinic settings for formatting
    clinic_settings = db.query(ClinicSettings).filter(
        ClinicSettings.clinic_id == current_user.clinic_id
    ).first()
    time_format = clinic_settings.time_format if clinic_settings else "12h"
    
    # Get appointments
    appointments = db.query(Appointment).options(
        joinedload(Appointment.patient)
    ).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.date == date_param,
        Appointment.status != "cancelled"
    ).order_by(Appointment.start_time).all()
    
    appointment_infos = []
    for apt in appointments:
        appointment_infos.append(AppointmentInfo(
            id=str(apt.id),
            time=format_time(apt.start_time, time_format),
            duration=apt.duration or 30,
            patient=PatientInfo(
                id=str(apt.patient.id),
                name=apt.patient.full_name
            ),
            visitType=apt.visit_type or "in-clinic",
            status={
                "confirmed": apt.status == "confirmed",
                "intakeComplete": apt.intake_status == "completed"
            }
        ))
    
    return DayScheduleResponse(
        date=date_param.isoformat(),
        doctors=[DoctorSchedule(
            id=str(doctor.id),
            name=doctor.name,
            color=doctor.color,
            appointments=appointment_infos
        )]
    )


@router.get("/available-slots", response_model=AvailableSlotsResponse)
def get_available_slots_endpoint(
    doctor_id: UUID = Query(...),
    date_param: date = Query(..., alias="date"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get available time slots for booking - admin only"""
    # Verify doctor exists
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id,
        Doctor.clinic_id == current_user.clinic_id
    ).first()
    
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    slots = get_available_slots(doctor_id, date_param, db)
    
    return AvailableSlotsResponse(
        date=date_param.isoformat(),
        doctor_id=str(doctor_id),
        available_slots=slots
    )

