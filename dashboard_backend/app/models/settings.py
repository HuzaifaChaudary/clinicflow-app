"""
Settings Models

Clinic and Doctor settings for configuration.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Enum, ForeignKey, TIMESTAMP, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class IntakeDeliveryPath(str, enum.Enum):
    """How intake forms are delivered."""
    AUTOMATIC = "automatic"
    MANUAL = "manual"
    ASK_EVERY_TIME = "ask_every_time"


class ClinicSettings(Base):
    """Comprehensive clinic settings."""
    
    __tablename__ = "clinic_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), unique=True, nullable=False)
    
    # Working days/hours
    working_days = Column(JSONB, default={
        "monday": True, "tuesday": True, "wednesday": True,
        "thursday": True, "friday": True, "saturday": False, "sunday": False
    })
    clinic_hours = Column(JSONB, default={"start": "09:00", "end": "17:00"})
    slot_size = Column(Integer, default=30)  # 15, 30, or 45 minutes
    
    # Scheduling rules
    allow_overlapping = Column(Boolean, default=False)
    allow_walk_ins = Column(Boolean, default=True)
    require_provider = Column(Boolean, default=True)
    allow_admin_override = Column(Boolean, default=True)
    minimum_cancellation_notice = Column(Integer, default=60)  # minutes
    auto_no_show_threshold = Column(Integer, default=15)  # minutes after appointment time
    cancellation_reason_required = Column(Boolean, default=True)
    
    # Intake logic
    intake_required = Column(Boolean, default=True)
    lock_appointment_if_missing = Column(Boolean, default=False)
    allow_manual_completion = Column(Boolean, default=True)
    intake_delivery_path = Column(Enum(IntakeDeliveryPath), default=IntakeDeliveryPath.AUTOMATIC)
    
    # Notifications
    notify_unconfirmed = Column(Boolean, default=True)
    notify_missing_intake = Column(Boolean, default=True)
    notify_cancellations = Column(Boolean, default=True)
    notify_no_shows = Column(Boolean, default=True)
    notify_via_app = Column(Boolean, default=True)
    notify_via_email = Column(Boolean, default=False)
    
    # Data preferences
    date_format = Column(String(20), default="MM/DD/YYYY")
    time_format = Column(String(10), default="12h")
    default_dashboard_view = Column(String(20), default="dashboard")
    auto_refresh_interval = Column(Integer, default=30)  # seconds, 0 = disabled
    
    # Security
    session_timeout = Column(Integer, default=480)  # minutes (8 hours)
    
    # Metadata
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    clinic = relationship("Clinic", back_populates="clinic_settings")
    
    def __repr__(self):
        return f"<ClinicSettings for clinic {self.clinic_id}>"


class DoctorSettings(Base):
    """Doctor-specific settings."""
    
    __tablename__ = "doctor_settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), unique=True, nullable=False)
    
    # Working hours override
    working_hours_override = Column(JSONB, nullable=True)
    
    # Visit types
    supported_visit_types = Column(ARRAY(String), default=["in_clinic", "virtual"])
    video_visits_enabled = Column(Boolean, default=True)
    allow_walk_ins = Column(Boolean, default=True)
    allow_forced_booking = Column(Boolean, default=True)
    
    # Metadata
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="doctor_settings")
    
    def __repr__(self):
        return f"<DoctorSettings for doctor {self.doctor_id}>"
