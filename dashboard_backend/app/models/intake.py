"""
Intake Models

Intake form templates, submissions, tokens, and AI summaries.
"""

import uuid
import secrets
from datetime import datetime, timedelta
from sqlalchemy import Column, String, Text, Boolean, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base
from app.config import settings


class IntakeFormTemplate(Base):
    """Intake form templates that can be sent to patients."""
    
    __tablename__ = "intake_form_templates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    
    # Template info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Form fields (JSON array of field definitions)
    # Example: [{"id": "chief_complaint", "type": "textarea", "label": "...", "required": true}]
    fields = Column(JSONB, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    clinic = relationship("Clinic", back_populates="intake_form_templates")
    submissions = relationship("IntakeSubmission", back_populates="template", lazy="selectin")
    tokens = relationship("IntakeToken", back_populates="template", lazy="selectin")
    
    def __repr__(self):
        return f"<IntakeFormTemplate {self.name}>"


class IntakeSubmission(Base):
    """Submitted intake forms from patients."""
    
    __tablename__ = "intake_submissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(UUID(as_uuid=True), ForeignKey("intake_form_templates.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    
    # Form data (JSON object with responses)
    responses = Column(JSONB, nullable=False)
    
    # AI Summary
    ai_summary = Column(Text, nullable=True)
    ai_summary_generated_at = Column(TIMESTAMP, nullable=True)
    
    # Metadata
    submitted_at = Column(TIMESTAMP, default=datetime.utcnow)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    # Relationships
    template = relationship("IntakeFormTemplate", back_populates="submissions")
    patient = relationship("Patient", back_populates="intake_submissions")
    
    def __repr__(self):
        return f"<IntakeSubmission {self.id}>"


class IntakeToken(Base):
    """Tokens for public (unauthenticated) patient intake form access."""
    
    __tablename__ = "intake_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    template_id = Column(UUID(as_uuid=True), ForeignKey("intake_form_templates.id"), nullable=False)
    
    # Token
    token = Column(String(100), unique=True, nullable=False, index=True)
    
    # Expiration
    expires_at = Column(TIMESTAMP, nullable=False)
    
    # Usage tracking
    used_at = Column(TIMESTAMP, nullable=True)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    # Relationships
    appointment = relationship("Appointment", back_populates="intake_token")
    patient = relationship("Patient")
    template = relationship("IntakeFormTemplate", back_populates="tokens")
    
    @classmethod
    def generate_token(cls) -> str:
        """Generate a cryptographically secure token."""
        return secrets.token_urlsafe(32)
    
    @classmethod
    def default_expiry(cls) -> datetime:
        """Get default expiration time."""
        return datetime.utcnow() + timedelta(days=settings.INTAKE_TOKEN_EXPIRE_DAYS)
    
    @property
    def is_expired(self) -> bool:
        """Check if token is expired."""
        return datetime.utcnow() > self.expires_at
    
    @property
    def is_used(self) -> bool:
        """Check if token has been used."""
        return self.used_at is not None
    
    @property
    def is_valid(self) -> bool:
        """Check if token is valid (not expired and not used)."""
        return not self.is_expired and not self.is_used
    
    def __repr__(self):
        return f"<IntakeToken {self.token[:8]}... for appointment {self.appointment_id}>"
