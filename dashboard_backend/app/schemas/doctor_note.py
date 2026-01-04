"""
Doctor Note Schemas

Pydantic schemas for doctor notes.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID


class DoctorNoteCreate(BaseModel):
    """Schema for creating a doctor note."""
    patient_id: UUID
    appointment_id: Optional[UUID] = None
    content: str


class DoctorNoteUpdate(BaseModel):
    """Schema for updating a doctor note."""
    content: str


class DoctorNoteResponse(BaseModel):
    """Doctor note response."""
    id: UUID
    doctor_id: UUID
    patient_id: UUID
    appointment_id: Optional[UUID] = None
    content: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DoctorNoteListResponse(BaseModel):
    """List of doctor notes."""
    notes: List[DoctorNoteResponse]
    total_count: int
