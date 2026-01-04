from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List, Dict, Any
from datetime import date
from app.database import get_db
from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.intake import AIIntakeSummary
from app.api.deps import get_current_user, require_admin, require_doctor
from app.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


# Response Models
class Stats(BaseModel):
    total_appointments: int
    confirmed: int
    unconfirmed: int
    missing_intake: int
    voice_ai_alerts: int = 0  # Mocked for MVP


class AttentionItem(BaseModel):
    id: str
    patient_name: str
    time: str
    doctor: str
    issue: str


class ScheduleItem(BaseModel):
    id: str
    time: str
    patient_name: str
    doctor: str
    visit_type: str
    status: Dict[str, Any]


class AdminDashboardResponse(BaseModel):
    date: str
    stats: Stats
    needs_attention: List[AttentionItem]
    todays_schedule: List[ScheduleItem]


class DoctorInfo(BaseModel):
    id: str
    name: str


class PatientStatus(BaseModel):
    confirmed: bool
    intake_complete: bool
    arrived: bool = False


class IntakeSummaryInfo(BaseModel):
    summary_text: str
    patient_concerns: List[str]
    medications: List[str]
    allergies: List[str]


class TodaysPatient(BaseModel):
    id: str
    appointment_id: str
    time: str
    patient_name: str
    visit_type: str
    visit_category: Optional[str]
    status: PatientStatus
    intake_summary: Optional[IntakeSummaryInfo] = None


class DoctorDashboardResponse(BaseModel):
    date: str
    doctor: DoctorInfo
    stats: Stats
    todays_patients: List[TodaysPatient]


class AttentionItemDetail(BaseModel):
    id: str
    type: str
    patient_name: str
    patient_phone: Optional[str]
    time: str
    doctor: str
    appointment_id: str


class NeedsAttentionResponse(BaseModel):
    total: int
    items: List[AttentionItemDetail]


@router.get("/admin", response_model=AdminDashboardResponse)
def get_admin_dashboard(
    date_param: Optional[date] = Query(None, alias="date"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get admin dashboard stats"""
    if date_param is None:
        date_param = date.today()
    
    # Get all appointments for today
    appointments = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date == date_param,
        Appointment.status != "cancelled"
    ).all()
    
    # Calculate stats
    total = len(appointments)
    confirmed = sum(1 for apt in appointments if apt.status == "confirmed")
    unconfirmed = sum(1 for apt in appointments if apt.status == "unconfirmed")
    missing_intake = sum(1 for apt in appointments if apt.intake_status == "missing")
    
    stats = Stats(
        total_appointments=total,
        confirmed=confirmed,
        unconfirmed=unconfirmed,
        missing_intake=missing_intake,
        voice_ai_alerts=0  # Mocked
    )
    
    # Build needs_attention list
    needs_attention = []
    for apt in appointments:
        if apt.status == "unconfirmed":
            needs_attention.append(AttentionItem(
                id=str(apt.id),
                patient_name=apt.patient.full_name,
                time=apt.start_time.strftime("%I:%M %p"),
                doctor=apt.doctor.name,
                issue="unconfirmed"
            ))
        elif apt.intake_status == "missing":
            needs_attention.append(AttentionItem(
                id=str(apt.id),
                patient_name=apt.patient.full_name,
                time=apt.start_time.strftime("%I:%M %p"),
                doctor=apt.doctor.name,
                issue="missing_intake"
            ))
    
    # Build today's schedule
    todays_schedule = []
    for apt in appointments:
        todays_schedule.append(ScheduleItem(
            id=str(apt.id),
            time=apt.start_time.strftime("%I:%M %p"),
            patient_name=apt.patient.full_name,
            doctor=apt.doctor.name,
            visit_type=apt.visit_type or "in-clinic",
            status={
                "confirmed": apt.status == "confirmed",
                "intake_complete": apt.intake_status == "completed"
            }
        ))
    
    # Sort by time
    todays_schedule.sort(key=lambda x: x.time)
    
    return AdminDashboardResponse(
        date=date_param.isoformat(),
        stats=stats,
        needs_attention=needs_attention,
        todays_schedule=todays_schedule
    )


@router.get("/doctor", response_model=DoctorDashboardResponse)
def get_doctor_dashboard(
    date_param: Optional[date] = Query(None, alias="date"),
    current_user: User = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """Get doctor dashboard stats"""
    if date_param is None:
        date_param = date.today()
    
    # Get doctor info
    doctor = db.query(Doctor).filter(Doctor.id == current_user.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    # Get today's appointments for this doctor
    appointments = db.query(Appointment).options(
        joinedload(Appointment.patient)
    ).filter(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.doctor_id == current_user.doctor_id,
        Appointment.date == date_param,
        Appointment.status != "cancelled"
    ).all()
    
    # Calculate stats
    total = len(appointments)
    confirmed = sum(1 for apt in appointments if apt.status == "confirmed")
    unconfirmed = sum(1 for apt in appointments if apt.status == "unconfirmed")
    missing_intake = sum(1 for apt in appointments if apt.intake_status == "missing")
    
    stats = Stats(
        total_appointments=total,
        confirmed=confirmed,
        unconfirmed=unconfirmed,
        missing_intake=missing_intake,
        voice_ai_alerts=0  # Mocked
    )
    
    # Build today's patients with intake summaries
    todays_patients = []
    for apt in appointments:
        # Get AI intake summary if exists
        intake_summary = db.query(AIIntakeSummary).filter(
            AIIntakeSummary.appointment_id == apt.id
        ).first()
        
        intake_summary_info = None
        if intake_summary:
            intake_summary_info = IntakeSummaryInfo(
                summary_text=intake_summary.summary_text,
                patient_concerns=intake_summary.patient_concerns or [],
                medications=intake_summary.medications or [],
                allergies=intake_summary.allergies or []
            )
        
        todays_patients.append(TodaysPatient(
            id=str(apt.patient.id),
            appointment_id=str(apt.id),
            time=apt.start_time.strftime("%I:%M %p"),
            patient_name=apt.patient.full_name,
            visit_type=apt.visit_type or "in-clinic",
            visit_category=apt.visit_category,
            status=PatientStatus(
                confirmed=apt.status == "confirmed",
                intake_complete=apt.intake_status == "completed",
                arrived=apt.arrived
            ),
            intake_summary=intake_summary_info
        ))
    
    # Sort by time
    todays_patients.sort(key=lambda x: x.time)
    
    return DoctorDashboardResponse(
        date=date_param.isoformat(),
        doctor=DoctorInfo(id=str(doctor.id), name=doctor.name),
        stats=stats,
        todays_patients=todays_patients
    )


@router.get("/needs-attention", response_model=NeedsAttentionResponse)
def get_needs_attention(
    filter_type: Optional[str] = Query("all", alias="filter"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get items needing attention"""
    today = date.today()
    
    # Get appointments needing attention
    query = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(
        Appointment.clinic_id == current_user.clinic_id,
        Appointment.date == today,
        Appointment.status != "cancelled"
    )
    
    items = []
    
    # Filter by type
    if filter_type == "unconfirmed":
        query = query.filter(Appointment.status == "unconfirmed")
    elif filter_type == "missing-intake":
        query = query.filter(Appointment.intake_status == "missing")
    # else "all" - no additional filter
    
    appointments = query.all()
    
    for apt in appointments:
        # Add unconfirmed items
        if apt.status == "unconfirmed" and (filter_type == "all" or filter_type == "unconfirmed"):
            items.append(AttentionItemDetail(
                id=str(apt.id),
                type="unconfirmed",
                patient_name=apt.patient.full_name,
                patient_phone=apt.patient.phone,
                time=apt.start_time.strftime("%I:%M %p"),
                doctor=apt.doctor.name,
                appointment_id=str(apt.id)
            ))
        
        # Add missing intake items
        if apt.intake_status == "missing" and (filter_type == "all" or filter_type == "missing-intake"):
            items.append(AttentionItemDetail(
                id=str(apt.id),
                type="missing-intake",
                patient_name=apt.patient.full_name,
                patient_phone=apt.patient.phone,
                time=apt.start_time.strftime("%I:%M %p"),
                doctor=apt.doctor.name,
                appointment_id=str(apt.id)
            ))
    
    # Remove duplicates (appointment can be both unconfirmed and missing intake)
    seen_ids = set()
    unique_items = []
    for item in items:
        if item.appointment_id not in seen_ids:
            unique_items.append(item)
            seen_ids.add(item.appointment_id)
    
    return NeedsAttentionResponse(
        total=len(unique_items),
        items=unique_items
    )

