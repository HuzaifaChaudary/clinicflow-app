"""
Doctor Note Model

Private notes created by doctors for patients.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, Text, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class DoctorNote(Base):
    """Private clinical notes from doctors."""
    
    __tablename__ = "doctor_notes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    
    # Note content
    content = Column(Text, nullable=False)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    clinic = relationship("Clinic")
    doctor = relationship("Doctor", back_populates="doctor_notes")
    patient = relationship("Patient", back_populates="doctor_notes")
    appointment = relationship("Appointment")
    
    def __repr__(self):
        return f"<DoctorNote {self.id} by doctor {self.doctor_id}>"
