from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class ClinicCreate(BaseModel):
    name: str
    timezone: str = "America/New_York"


class ClinicUpdate(BaseModel):
    name: Optional[str] = None
    timezone: Optional[str] = None


class ClinicResponse(BaseModel):
    id: UUID
    name: str
    timezone: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

