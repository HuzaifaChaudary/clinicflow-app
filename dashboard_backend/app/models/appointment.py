"""
Appointment Model

Represents scheduled appointments between patients and doctors.
"""

import uuid
from datetime import datetime, date, time
from sqlalchemy import Column, String, Integer, Boolean, Date, Time, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class VisitType(str, enum.Enum):
    """Type of visit."""
    IN_CLINIC = "in_clinic"
    VIRTUAL = "virtual"


class VisitCategory(str, enum.Enum):
    """Category of visit."""
    NEW_PATIENT = "new_patient"
    FOLLOW_UP = "follow_up"


class AppointmentStatus(str, enum.Enum):
    """Status of an appointment."""
    UNCONFIRMED = "unconfirmed"
    CONFIRMED = "confirmed"
    ARRIVED = "arrived"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class IntakeStatus(str, enum.Enum):
    """Status of intake form."""
    NOT_SENT = "not_sent"
    SENT = "sent"
    COMPLETED = "completed"
    SKIPPED = "skipped"


class Appointment(Base):
    """Appointment entity."""
    
    __tablename__ = "appointments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    
    # Scheduling
    scheduled_date = Column(Date, nullable=False, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    duration = Column(Integer, default=30)  # minutes
    
    # Type & Status
    visit_type = Column(Enum(VisitType), nullable=False, default=VisitType.IN_CLINIC)
    visit_category = Column(Enum(VisitCategory), default=VisitCategory.FOLLOW_UP)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.UNCONFIRMED, index=True)
    
    # Arrived tracking
    arrived = Column(Boolean, default=False)
    arrived_at = Column(TIMESTAMP, nullable=True)
    
    # Visit details
    visit_reason = Column(String(500), nullable=True)
    
    # Intake
    intake_status = Column(Enum(IntakeStatus), default=IntakeStatus.NOT_SENT)
    intake_form_id = Column(UUID(as_uuid=True), ForeignKey("intake_submissions.id"), nullable=True)
    
    # Attention flags
    needs_attention = Column(Boolean, default=False)
    attention_reason = Column(String(100), nullable=True)
    
    # Video visits
    meeting_link = Column(String(500), nullable=True)
    
    # Metadata
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    clinic = relationship("Clinic", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments")
    creator = relationship("User", foreign_keys=[created_by])
    intake_submission = relationship("IntakeSubmission", foreign_keys=[intake_form_id], post_update=True)
    cancellation = relationship("Cancellation", back_populates="appointment", uselist=False)
    intake_token = relationship("IntakeToken", back_populates="appointment", uselist=False)
    
    def __repr__(self):
        return f"<Appointment {self.id} on {self.scheduled_date} at {self.start_time}>"
