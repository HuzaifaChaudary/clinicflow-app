"""
Follow-up Model

Scheduled follow-up visits set by doctors.
"""

import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Text, Date, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class FollowUpStatus(str, enum.Enum):
    """Status of a follow-up."""
    PENDING = "pending"
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class FollowUp(Base):
    """Scheduled follow-up visits."""
    
    __tablename__ = "follow_ups"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)  # Source appointment
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    
    # Follow-up details
    scheduled_date = Column(Date, nullable=False)
    note = Column(Text, nullable=True)
    status = Column(Enum(FollowUpStatus), default=FollowUpStatus.PENDING)
    
    # When follow-up appointment is created
    follow_up_appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Relationships
    clinic = relationship("Clinic")
    patient = relationship("Patient", back_populates="follow_ups")
    doctor = relationship("Doctor", back_populates="follow_ups")
    source_appointment = relationship("Appointment", foreign_keys=[appointment_id])
    follow_up_appointment = relationship("Appointment", foreign_keys=[follow_up_appointment_id])
    creator = relationship("User")
    
    def __repr__(self):
        return f"<FollowUp {self.id} for patient {self.patient_id} on {self.scheduled_date}>"
