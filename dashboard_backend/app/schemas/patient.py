from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date
from typing import Optional, List


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None


class PatientResponse(BaseModel):
    id: UUID
    clinic_id: UUID
    first_name: str
    last_name: str
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    date_of_birth: Optional[date]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PatientList(BaseModel):
    items: List[PatientResponse]
    total: int

