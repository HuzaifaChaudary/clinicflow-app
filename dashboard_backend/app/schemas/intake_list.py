from pydantic import BaseModel
from typing import List
from app.schemas.intake import IntakeFormResponse


class IntakeFormList(BaseModel):
    """Paginated intake form response"""
    items: List[IntakeFormResponse]
    total: int
    skip: int
    limit: int

    class Config:
        from_attributes = True
