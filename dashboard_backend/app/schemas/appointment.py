from pydantic import BaseModel
from uuid import UUID
from datetime import date, time, datetime
from typing import Optional, List
from app.schemas.doctor import DoctorResponse
from app.schemas.patient import PatientResponse


class AppointmentCreate(BaseModel):
    doctor_id: UUID
    patient_id: UUID
    date: date
    start_time: time
    end_time: time
    duration: int = 30
    visit_type: str  # "in-clinic" or "virtual"
    visit_category: Optional[str] = None  # "new-patient" or "follow-up"


class AppointmentUpdate(BaseModel):
    doctor_id: Optional[UUID] = None
    patient_id: Optional[UUID] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    duration: Optional[int] = None
    visit_type: Optional[str] = None
    visit_category: Optional[str] = None
    status: Optional[str] = None
    intake_status: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: UUID
    clinic_id: UUID
    doctor_id: UUID
    patient_id: UUID
    date: date
    start_time: time
    end_time: time
    duration: int
    visit_type: Optional[str]
    visit_category: Optional[str]
    status: str
    intake_status: str
    arrived: bool
    arrived_at: Optional[datetime]
    meeting_link: Optional[str]
    created_at: datetime
    updated_at: datetime
    doctor: Optional[DoctorResponse] = None
    patient: Optional[PatientResponse] = None

    class Config:
        from_attributes = True


class AppointmentList(BaseModel):
    items: List[AppointmentResponse]
    total: int


class AppointmentConfirm(BaseModel):
    pass  # No body needed


class AppointmentCancel(BaseModel):
    cancellation_type: str
    reason_note: Optional[str] = None


class AppointmentArrive(BaseModel):
    pass  # No body needed

