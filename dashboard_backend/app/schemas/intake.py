"""
Intake Schemas

Pydantic schemas for intake forms, submissions, and tokens.
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from uuid import UUID


# Intake Form Template Schemas
class IntakeFieldDefinition(BaseModel):
    """Definition of a form field."""
    id: str
    type: str  # text, textarea, checkbox, checkbox_group, radio, select, date
    label: str
    required: bool = False
    options: Optional[List[str]] = None  # For checkbox_group, radio, select
    placeholder: Optional[str] = None


class IntakeTemplateCreate(BaseModel):
    """Schema for creating an intake form template."""
    name: str
    description: Optional[str] = None
    fields: List[IntakeFieldDefinition]


class IntakeTemplateUpdate(BaseModel):
    """Schema for updating an intake form template."""
    name: Optional[str] = None
    description: Optional[str] = None
    fields: Optional[List[IntakeFieldDefinition]] = None
    is_active: Optional[bool] = None


class IntakeTemplateResponse(BaseModel):
    """Intake form template response."""
    id: UUID
    clinic_id: UUID
    name: str
    description: Optional[str] = None
    fields: List[Dict[str, Any]]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Intake Submission Schemas
class IntakeSubmissionCreate(BaseModel):
    """Schema for submitting an intake form (internal)."""
    template_id: UUID
    appointment_id: Optional[UUID] = None
    patient_id: UUID
    responses: Dict[str, Any]


class IntakeSubmissionResponse(BaseModel):
    """Intake submission response."""
    id: UUID
    template_id: UUID
    appointment_id: Optional[UUID] = None
    patient_id: UUID
    responses: Dict[str, Any]
    ai_summary: Optional[str] = None
    ai_summary_generated_at: Optional[datetime] = None
    submitted_at: datetime
    
    class Config:
        from_attributes = True


class IntakeSubmissionListItem(BaseModel):
    """Intake submission for list views."""
    id: UUID
    patient_name: str
    appointment_date: Optional[date] = None
    template_name: str
    has_ai_summary: bool
    submitted_at: datetime


# Send Intake Schemas
class SendIntakeRequest(BaseModel):
    """Request to send intake form to patient."""
    template_id: UUID


class SendIntakeResponse(BaseModel):
    """Response after sending intake form."""
    success: bool
    intake_url: str
    token_expires_at: datetime


class MarkIntakeCompleteRequest(BaseModel):
    """Request to mark intake as manually completed."""
    pass  # No additional data needed


# Public Intake Schemas (for patient-facing endpoints)
class PublicIntakeFormResponse(BaseModel):
    """Public intake form for patient to fill."""
    patient_name: str  # First name only for greeting
    appointment_date: date
    appointment_time: str
    doctor_name: str
    form: Dict[str, Any]  # {name, fields}


class PublicIntakeSubmitRequest(BaseModel):
    """Request from patient submitting intake form."""
    responses: Dict[str, Any]


class PublicIntakeSubmitResponse(BaseModel):
    """Response after patient submits intake form."""
    success: bool
    message: str


# AI Summary Schemas
class AISummaryResponse(BaseModel):
    """AI-generated intake summary."""
    appointment_id: UUID
    patient_id: UUID
    summary: str
    generated_at: datetime
