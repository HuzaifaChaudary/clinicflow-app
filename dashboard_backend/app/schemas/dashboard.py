"""
Dashboard Schemas

Pydantic schemas for dashboard and metrics endpoints.
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from uuid import UUID


# Admin Dashboard Schemas
class AdminDashboardSummary(BaseModel):
    """Admin dashboard hero card data."""
    total_appointments: int
    confirmed: int
    unconfirmed: int
    missing_intake: int
    arrived: int
    completed: int
    cancelled_today: int
    no_shows_today: int


class NeedsAttentionItem(BaseModel):
    """An item requiring attention."""
    id: UUID
    type: str  # appointment, intake, follow_up
    patient_name: str
    patient_id: UUID
    reason: str
    appointment_id: Optional[UUID] = None
    appointment_time: Optional[str] = None
    appointment_date: Optional[date] = None
    doctor_name: Optional[str] = None


class NeedsAttentionResponse(BaseModel):
    """Needs attention queue response."""
    unconfirmed_appointments: List[NeedsAttentionItem]
    missing_intake: List[NeedsAttentionItem]
    pending_follow_ups: List[NeedsAttentionItem]
    total_count: int


class RecentCancellationItem(BaseModel):
    """Recent cancellation item."""
    id: UUID
    patient_name: str
    doctor_name: str
    original_date: date
    original_time: str
    cancellation_type: str
    reason_note: Optional[str] = None
    cancelled_at: datetime


class RecentCancellationsResponse(BaseModel):
    """Recent cancellations response."""
    cancellations: List[RecentCancellationItem]
    total_count: int


# Doctor Dashboard Schemas
class DoctorDashboardSummary(BaseModel):
    """Doctor dashboard hero card data."""
    my_appointments: int
    confirmed: int
    unconfirmed: int
    missing_intake: int
    arrived: int
    completed: int


class DoctorTodayPatient(BaseModel):
    """Patient info for doctor's today view."""
    appointment_id: UUID
    patient_id: UUID
    patient_name: str
    time: str
    status: str
    intake_complete: bool
    intake_summary_preview: Optional[str] = None  # First 100 chars
    visit_type: str
    visit_reason: Optional[str] = None


class DoctorTodayResponse(BaseModel):
    """Doctor's today view response."""
    date: date
    patients: List[DoctorTodayPatient]
    total_count: int


# Appointment Detail Schemas
class AppointmentDetailPatient(BaseModel):
    """Patient info for appointment detail."""
    id: UUID
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    flags: Dict[str, Any]
    contact_preferences: Dict[str, bool]


class AppointmentDetailDoctor(BaseModel):
    """Doctor info for appointment detail."""
    id: UUID
    name: str
    specialty: Optional[str] = None


class AppointmentDetailIntake(BaseModel):
    """Intake info for appointment detail."""
    status: str
    submission_id: Optional[UUID] = None
    ai_summary: Optional[str] = None


class AppointmentDetailHistory(BaseModel):
    """History info for appointment detail."""
    previous_visits: List[Dict[str, Any]]
    cancellation_count: int
    no_show_count: int


class AppointmentDetailResponse(BaseModel):
    """Full appointment detail for drawer/modal."""
    appointment: Dict[str, Any]
    patient: AppointmentDetailPatient
    doctor: AppointmentDetailDoctor
    intake: AppointmentDetailIntake
    history: AppointmentDetailHistory


# Patient Preparation View (Doctor)
class PatientPreparationResponse(BaseModel):
    """Patient preparation view for doctors."""
    patient: Dict[str, Any]
    appointment: Dict[str, Any]
    intake_summary: Optional[str] = None
    intake_complete: bool
    previous_visits: List[Dict[str, Any]]
