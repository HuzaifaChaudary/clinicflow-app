"""
Clinic Model

Represents a medical clinic in the system.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Time, Boolean, ARRAY, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base


class Clinic(Base):
    """Clinic entity - the top-level organization."""
    
    __tablename__ = "clinics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    timezone = Column(String(50), nullable=False, default="America/New_York")
    working_days = Column(ARRAY(Integer), default=[1, 2, 3, 4, 5])  # Mon-Fri
    opening_time = Column(Time, default=datetime.strptime("09:00", "%H:%M").time())
    closing_time = Column(Time, default=datetime.strptime("17:00", "%H:%M").time())
    slot_duration_minutes = Column(Integer, default=15)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="clinic", lazy="selectin")
    doctors = relationship("Doctor", back_populates="clinic", lazy="selectin")
    patients = relationship("Patient", back_populates="clinic", lazy="selectin")
    appointments = relationship("Appointment", back_populates="clinic", lazy="selectin")
    clinic_settings = relationship("ClinicSettings", back_populates="clinic", uselist=False, lazy="selectin")
    intake_form_templates = relationship("IntakeFormTemplate", back_populates="clinic", lazy="selectin")
    
    def __repr__(self):
        return f"<Clinic {self.name}>"
