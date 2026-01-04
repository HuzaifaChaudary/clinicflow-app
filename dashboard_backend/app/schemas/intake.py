from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List, Dict, Any


class IntakeFormCreate(BaseModel):
    appointment_id: UUID
    raw_answers: Dict[str, Any]


class IntakeFormResponse(BaseModel):
    id: UUID
    clinic_id: UUID
    patient_id: UUID
    appointment_id: Optional[UUID]
    raw_answers: Dict[str, Any]
    status: str
    submitted_at: Optional[datetime]
    created_at: datetime
    ai_summary: Optional["AIIntakeSummaryResponse"] = None

    class Config:
        from_attributes = True


class AIIntakeSummaryResponse(BaseModel):
    id: UUID
    summary_text: str
    patient_concerns: List[str]
    medications: List[str]
    allergies: List[str]
    key_notes: Optional[str]
    generated_at: datetime

    class Config:
        from_attributes = True


class IntakeMarkComplete(BaseModel):
    pass  # Empty body


# Update forward reference
IntakeFormResponse.model_rebuild()

