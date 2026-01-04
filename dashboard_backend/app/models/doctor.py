"""
Doctor Model

Represents medical providers/doctors in a clinic.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class Doctor(Base):
    """Doctor entity - medical providers."""
    
    __tablename__ = "doctors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Link to user account (if doctor has login)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, unique=True)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    
    # Profile
    name = Column(String(255), nullable=False)
    initials = Column(String(10), nullable=True)
    specialty = Column(String(100), nullable=True)
    color = Column(String(20), nullable=True)  # For calendar UI (e.g., "#3B82F6")
    
    # Schedule settings
    working_hours = Column(JSONB, default=dict)  # Override clinic defaults
    default_visit_length = Column(Integer, default=30)  # minutes
    
    # Capabilities
    allows_virtual_visits = Column(Boolean, default=True)
    allows_walkins = Column(Boolean, default=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    clinic = relationship("Clinic", back_populates="doctors")
    appointments = relationship("Appointment", back_populates="doctor", lazy="selectin")
    doctor_notes = relationship("DoctorNote", back_populates="doctor", lazy="selectin")
    follow_ups = relationship("FollowUp", back_populates="doctor", lazy="selectin")
    doctor_settings = relationship("DoctorSettings", back_populates="doctor", uselist=False, lazy="selectin")
    
    # Many-to-many with patients
    patient_relationships = relationship("DoctorPatientRelationship", back_populates="doctor", lazy="selectin")
    
    def __repr__(self):
        return f"<Doctor {self.name}>"


class DoctorPatientRelationship(Base):
    """Track which doctors have seen which patients."""
    
    __tablename__ = "doctor_patient_relationships"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    
    first_visit_date = Column(TIMESTAMP, nullable=True)
    last_visit_date = Column(TIMESTAMP, nullable=True)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="patient_relationships")
    patient = relationship("Patient", back_populates="doctor_relationships")
    
    def __repr__(self):
        return f"<DoctorPatientRelationship doctor={self.doctor_id} patient={self.patient_id}>"
