"""
Patient Schemas

Pydantic schemas for patient-related data.
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from uuid import UUID


class PatientBase(BaseModel):
    """Base patient schema."""
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None


class PatientCreate(PatientBase):
    """Schema for creating a patient."""
    primary_doctor_id: Optional[UUID] = None
    contact_preferences: Optional[Dict[str, bool]] = {"sms": True, "email": True}
    flags: Optional[Dict[str, Any]] = {}


class PatientUpdate(BaseModel):
    """Schema for updating a patient."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    primary_doctor_id: Optional[UUID] = None
    contact_preferences: Optional[Dict[str, bool]] = None
    flags: Optional[Dict[str, Any]] = None


class PatientResponse(PatientBase):
    """Patient response schema."""
    id: UUID
    clinic_id: UUID
    primary_doctor_id: Optional[UUID] = None
    first_visit_date: Optional[date] = None
    contact_preferences: Dict[str, bool]
    flags: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PatientListItem(BaseModel):
    """Patient item for list views."""
    id: UUID
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    primary_doctor_name: Optional[str] = None
    last_visit_date: Optional[date] = None
    needs_attention: bool = False
    attention_reason: Optional[str] = None
    
    class Config:
        from_attributes = True


class PatientWithHistory(PatientResponse):
    """Patient with visit history."""
    total_visits: int = 0
    cancellation_count: int = 0
    no_show_count: int = 0
    recent_appointments: List[Dict[str, Any]] = []


class PatientSearchParams(BaseModel):
    """Search parameters for patients."""
    search: Optional[str] = None
    needs_attention: Optional[bool] = None
    doctor_id: Optional[UUID] = None
    limit: int = 50
    offset: int = 0


# Cancellation history
class CancellationHistoryItem(BaseModel):
    """Cancellation history item."""
    id: UUID
    appointment_id: UUID
    cancellation_type: str
    reason_note: Optional[str] = None
    cancelled_by_name: Optional[str] = None
    original_date: Optional[date] = None
    original_time: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class PatientCancellationHistory(BaseModel):
    """Patient cancellation history response."""
    patient_id: UUID
    total_cancellations: int
    cancellations: List[CancellationHistoryItem]
