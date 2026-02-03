from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class InviteCreate(BaseModel):
    email: EmailStr
    role: str  # 'admin' or 'doctor'


class InviteResponse(BaseModel):
    id: UUID
    email: str
    role: str
    status: str
    expires_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class InviteListResponse(BaseModel):
    items: List[InviteResponse]
    total: int
    pending_count: int
    accepted_count: int


class InviteAccept(BaseModel):
    token: str
    name: str
    password: str


class InviteLimitResponse(BaseModel):
    current_doctors: int
    max_doctors: int
    remaining_slots: int
    can_invite: bool


class BulkInviteCreate(BaseModel):
    emails: List[EmailStr]
    role: str  # 'admin' or 'doctor'


class BulkInviteResponse(BaseModel):
    successful: List[str]
    failed: List[dict]  # {email: str, reason: str}
    total_sent: int
