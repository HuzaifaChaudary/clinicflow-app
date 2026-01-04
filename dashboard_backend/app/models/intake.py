from sqlalchemy import Column, String, DateTime, ForeignKey, CheckConstraint, func, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class IntakeForm(Base):
    __tablename__ = "intake_forms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    
    raw_answers = Column(JSONB, nullable=False)
    status = Column(String(20), default="pending")
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="intake_forms")
    patient = relationship("Patient", backref="intake_forms")
    appointment = relationship("Appointment", backref="intake_form")

    __table_args__ = (
        CheckConstraint("status IN ('pending', 'submitted', 'reviewed')", name="check_intake_status"),
    )


class AIIntakeSummary(Base):
    __tablename__ = "ai_intake_summaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    intake_form_id = Column(UUID(as_uuid=True), ForeignKey("intake_forms.id"), nullable=False)
    
    summary_text = Column(Text, nullable=False)
    patient_concerns = Column(ARRAY(Text))
    medications = Column(ARRAY(Text))
    allergies = Column(ARRAY(Text))
    key_notes = Column(Text)
    
    model_version = Column(String(50), default="gpt-4")
    status = Column(String(20), default="generated")
    
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="ai_intake_summaries")
    patient = relationship("Patient", backref="ai_intake_summaries")
    appointment = relationship("Appointment", backref="ai_intake_summary")
    intake_form = relationship("IntakeForm", backref="ai_summary")

    __table_args__ = (
        CheckConstraint("status IN ('generating', 'generated', 'failed', 'edited')", name="check_ai_summary_status"),
    )

