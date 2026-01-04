"""
Cancellation Model

Tracks appointment cancellations with detailed history.
"""

import uuid
from datetime import datetime, date, time
from sqlalchemy import Column, String, Text, Date, Time, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class CancellationType(str, enum.Enum):
    """Type of cancellation."""
    PATIENT_CANCELLED = "patient_cancelled"
    NO_SHOW = "no_show"
    RESCHEDULED_EXTERNALLY = "rescheduled_externally"
    CLINIC_CANCELLED = "clinic_cancelled"
    OTHER = "other"


class Cancellation(Base):
    """Cancellation record for appointments."""
    
    __tablename__ = "cancellations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=True)
    
    # Cancellation details
    cancellation_type = Column(Enum(CancellationType), nullable=False)
    reason_note = Column(Text, nullable=True)
    
    # Who cancelled
    cancelled_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    cancelled_by_name = Column(String(255), nullable=True)
    
    # Original appointment details (for history)
    original_date = Column(Date, nullable=True)
    original_time = Column(Time, nullable=True)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    # Relationships
    appointment = relationship("Appointment", back_populates="cancellation")
    clinic = relationship("Clinic")
    patient = relationship("Patient", back_populates="cancellations")
    doctor = relationship("Doctor")
    cancelled_by_user = relationship("User", foreign_keys=[cancelled_by])
    
    def __repr__(self):
        return f"<Cancellation {self.id} type={self.cancellation_type.value}>"
