"""
Appointment Schemas

Pydantic schemas for appointment-related data.
"""

from datetime import datetime, date, time
from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import UUID


# Enums as strings for API
class AppointmentCreate(BaseModel):
    """Schema for creating an appointment."""
    doctor_id: UUID
    patient_id: UUID
    scheduled_date: date
    start_time: time
    duration: int = 30
    visit_type: str = "in_clinic"  # in_clinic, virtual
    visit_category: str = "follow_up"  # new_patient, follow_up
    visit_reason: Optional[str] = None
    intake_path: str = "send_later"  # send_now, send_later, skip


class AppointmentUpdate(BaseModel):
    """Schema for updating an appointment."""
    scheduled_date: Optional[date] = None
    start_time: Optional[time] = None
    duration: Optional[int] = None
    visit_type: Optional[str] = None
    visit_reason: Optional[str] = None
    meeting_link: Optional[str] = None


class AppointmentResponse(BaseModel):
    """Appointment response schema."""
    id: UUID
    clinic_id: UUID
    doctor_id: UUID
    patient_id: UUID
    scheduled_date: date
    start_time: time
    end_time: time
    duration: int
    visit_type: str
    visit_category: str
    status: str
    arrived: bool
    arrived_at: Optional[datetime] = None
    visit_reason: Optional[str] = None
    intake_status: str
    needs_attention: bool
    attention_reason: Optional[str] = None
    meeting_link: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AppointmentWithPatient(AppointmentResponse):
    """Appointment with patient info."""
    patient_name: str
    patient_phone: Optional[str] = None
    patient_email: Optional[str] = None


class AppointmentWithDoctor(AppointmentResponse):
    """Appointment with doctor info."""
    doctor_name: str
    doctor_initials: Optional[str] = None
    doctor_color: Optional[str] = None


class AppointmentFull(AppointmentResponse):
    """Full appointment with all related data."""
    patient_name: str
    patient_phone: Optional[str] = None
    patient_email: Optional[str] = None
    doctor_name: str
    doctor_initials: Optional[str] = None
    doctor_color: Optional[str] = None
    intake_summary: Optional[str] = None


# Action schemas
class ConfirmAppointmentRequest(BaseModel):
    """Request to confirm an appointment."""
    pass  # No additional data needed


class RescheduleAppointmentRequest(BaseModel):
    """Request to reschedule an appointment."""
    new_date: date
    new_time: time
    new_doctor_id: Optional[UUID] = None


class CancelAppointmentRequest(BaseModel):
    """Request to cancel an appointment."""
    reason: str  # patient_cancelled, no_show, rescheduled_externally, clinic_cancelled, other
    note: Optional[str] = None


class MarkArrivedRequest(BaseModel):
    """Request to mark patient as arrived."""
    pass  # No additional data needed


# Schedule view schemas
class DoctorScheduleSlot(BaseModel):
    """A time slot in a doctor's schedule."""
    id: UUID
    start_time: time
    end_time: time
    duration: int
    patient_name: str
    patient_id: UUID
    status: str
    visit_type: str
    intake_status: str
    needs_attention: bool


class DoctorSchedule(BaseModel):
    """Doctor's schedule for a day."""
    doctor_id: UUID
    doctor_name: str
    doctor_initials: Optional[str] = None
    doctor_color: Optional[str] = None
    appointments: List[DoctorScheduleSlot]


class ScheduleGridResponse(BaseModel):
    """Multi-doctor schedule grid response."""
    date: date
    doctors: List[DoctorSchedule]


class AvailableSlot(BaseModel):
    """An available time slot."""
    start_time: time
    end_time: time


class AvailableSlotsResponse(BaseModel):
    """Available slots for a doctor on a date."""
    doctor_id: UUID
    date: date
    slots: List[AvailableSlot]
