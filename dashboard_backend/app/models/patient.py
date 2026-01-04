"""
Patient Model

Represents patients in a clinic.
"""

import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Date, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class Patient(Base):
    """Patient entity."""
    
    __tablename__ = "patients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    primary_doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=True)
    
    # Personal info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    
    # Visit history
    first_visit_date = Column(Date, nullable=True)
    
    # Preferences
    contact_preferences = Column(JSONB, default={"sms": True, "email": True})
    
    # Flags (VIP, needs_interpreter, etc.)
    flags = Column(JSONB, default=dict)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    clinic = relationship("Clinic", back_populates="patients")
    primary_doctor = relationship("Doctor", foreign_keys=[primary_doctor_id])
    appointments = relationship("Appointment", back_populates="patient", lazy="selectin")
    cancellations = relationship("Cancellation", back_populates="patient", lazy="selectin")
    intake_submissions = relationship("IntakeSubmission", back_populates="patient", lazy="selectin")
    doctor_notes = relationship("DoctorNote", back_populates="patient", lazy="selectin")
    follow_ups = relationship("FollowUp", back_populates="patient", lazy="selectin")
    
    # Many-to-many with doctors
    doctor_relationships = relationship("DoctorPatientRelationship", back_populates="patient", lazy="selectin")
    
    @property
    def full_name(self) -> str:
        """Get patient's full name."""
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self):
        return f"<Patient {self.full_name}>"
