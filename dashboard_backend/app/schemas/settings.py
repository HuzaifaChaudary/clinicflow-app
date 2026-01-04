"""
Settings Schemas

Pydantic schemas for clinic and doctor settings.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from uuid import UUID


# Clinic Settings
class ClinicSettingsUpdate(BaseModel):
    """Schema for updating clinic settings."""
    # Working days/hours
    working_days: Optional[Dict[str, bool]] = None
    clinic_hours: Optional[Dict[str, str]] = None
    slot_size: Optional[int] = None
    
    # Scheduling rules
    allow_overlapping: Optional[bool] = None
    allow_walk_ins: Optional[bool] = None
    require_provider: Optional[bool] = None
    allow_admin_override: Optional[bool] = None
    minimum_cancellation_notice: Optional[int] = None
    auto_no_show_threshold: Optional[int] = None
    cancellation_reason_required: Optional[bool] = None
    
    # Intake logic
    intake_required: Optional[bool] = None
    lock_appointment_if_missing: Optional[bool] = None
    allow_manual_completion: Optional[bool] = None
    intake_delivery_path: Optional[str] = None
    
    # Notifications
    notify_unconfirmed: Optional[bool] = None
    notify_missing_intake: Optional[bool] = None
    notify_cancellations: Optional[bool] = None
    notify_no_shows: Optional[bool] = None
    notify_via_app: Optional[bool] = None
    notify_via_email: Optional[bool] = None
    
    # Data preferences
    date_format: Optional[str] = None
    time_format: Optional[str] = None
    default_dashboard_view: Optional[str] = None
    auto_refresh_interval: Optional[int] = None
    
    # Security
    session_timeout: Optional[int] = None


class ClinicSettingsResponse(BaseModel):
    """Clinic settings response."""
    id: UUID
    clinic_id: UUID
    working_days: Dict[str, bool]
    clinic_hours: Dict[str, str]
    slot_size: int
    allow_overlapping: bool
    allow_walk_ins: bool
    require_provider: bool
    allow_admin_override: bool
    minimum_cancellation_notice: int
    auto_no_show_threshold: int
    cancellation_reason_required: bool
    intake_required: bool
    lock_appointment_if_missing: bool
    allow_manual_completion: bool
    intake_delivery_path: str
    notify_unconfirmed: bool
    notify_missing_intake: bool
    notify_cancellations: bool
    notify_no_shows: bool
    notify_via_app: bool
    notify_via_email: bool
    date_format: str
    time_format: str
    default_dashboard_view: str
    auto_refresh_interval: int
    session_timeout: int
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Doctor Settings
class DoctorSettingsUpdate(BaseModel):
    """Schema for updating doctor settings."""
    working_hours_override: Optional[Dict[str, Any]] = None
    supported_visit_types: Optional[List[str]] = None
    video_visits_enabled: Optional[bool] = None
    allow_walk_ins: Optional[bool] = None
    allow_forced_booking: Optional[bool] = None


class DoctorSettingsResponse(BaseModel):
    """Doctor settings response."""
    id: UUID
    doctor_id: UUID
    working_hours_override: Optional[Dict[str, Any]] = None
    supported_visit_types: List[str]
    video_visits_enabled: bool
    allow_walk_ins: bool
    allow_forced_booking: bool
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Clinic Profile
class ClinicProfileUpdate(BaseModel):
    """Schema for updating clinic profile."""
    name: Optional[str] = None
    timezone: Optional[str] = None
    working_days: Optional[List[int]] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    slot_duration_minutes: Optional[int] = None


class ClinicProfileResponse(BaseModel):
    """Clinic profile response."""
    id: UUID
    name: str
    timezone: str
    working_days: List[int]
    opening_time: str
    closing_time: str
    slot_duration_minutes: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Doctor Profile
class DoctorProfileUpdate(BaseModel):
    """Schema for updating doctor profile."""
    name: Optional[str] = None
    specialty: Optional[str] = None
    color: Optional[str] = None
    working_hours: Optional[Dict[str, Any]] = None
    default_visit_length: Optional[int] = None
    allows_virtual_visits: Optional[bool] = None
    allows_walkins: Optional[bool] = None


class DoctorProfileResponse(BaseModel):
    """Doctor profile response."""
    id: UUID
    user_id: Optional[UUID] = None
    clinic_id: UUID
    name: str
    initials: Optional[str] = None
    specialty: Optional[str] = None
    color: Optional[str] = None
    working_hours: Dict[str, Any]
    default_visit_length: int
    allows_virtual_visits: bool
    allows_walkins: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# User Management
class UserManagementCreate(BaseModel):
    """Schema for creating a user (admin)."""
    email: str
    first_name: str
    last_name: str
    role: str  # admin, doctor, owner
    # Doctor-specific fields
    doctor_name: Optional[str] = None
    doctor_specialty: Optional[str] = None
    doctor_color: Optional[str] = None


class UserManagementUpdate(BaseModel):
    """Schema for updating a user (admin)."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserManagementResponse(BaseModel):
    """User management response."""
    id: UUID
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str
    is_active: bool
    doctor_id: Optional[UUID] = None
    doctor_name: Optional[str] = None
    created_at: datetime
    last_login_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserManagementListResponse(BaseModel):
    """List of users."""
    users: List[UserManagementResponse]
    total_count: int
