from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, List


class DoctorCreate(BaseModel):
    name: str
    initials: Optional[str] = None
    specialty: Optional[str] = None
    color: Optional[str] = None


class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    initials: Optional[str] = None
    specialty: Optional[str] = None
    color: Optional[str] = None


class DoctorResponse(BaseModel):
    id: UUID
    clinic_id: UUID
    name: str
    initials: Optional[str]
    specialty: Optional[str]
    color: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class DoctorList(BaseModel):
    items: List[DoctorResponse]
    total: int

