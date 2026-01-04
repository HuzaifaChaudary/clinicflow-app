"""
Follow-up Schemas

Pydantic schemas for follow-up scheduling.
"""

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID


class FollowUpCreate(BaseModel):
    """Schema for creating a follow-up."""
    patient_id: UUID
    appointment_id: Optional[UUID] = None
    scheduled_date: date
    note: Optional[str] = None


class FollowUpUpdate(BaseModel):
    """Schema for updating a follow-up."""
    scheduled_date: Optional[date] = None
    note: Optional[str] = None
    status: Optional[str] = None  # pending, scheduled, completed, cancelled


class FollowUpResponse(BaseModel):
    """Follow-up response."""
    id: UUID
    clinic_id: UUID
    patient_id: UUID
    doctor_id: UUID
    appointment_id: Optional[UUID] = None
    scheduled_date: date
    note: Optional[str] = None
    status: str
    follow_up_appointment_id: Optional[UUID] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class FollowUpWithPatient(FollowUpResponse):
    """Follow-up with patient info."""
    patient_name: str


class FollowUpListResponse(BaseModel):
    """List of follow-ups."""
    follow_ups: List[FollowUpWithPatient]
    total_count: int
