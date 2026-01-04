from sqlalchemy import Column, String, Text, DateTime, ForeignKey, CheckConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class Cancellation(Base):
    __tablename__ = "cancellations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    
    cancellation_type = Column(String(30), nullable=False)
    reason_note = Column(Text)
    cancelled_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    appointment = relationship("Appointment", backref="cancellation_history")
    clinic = relationship("Clinic", backref="cancellations")
    patient = relationship("Patient", backref="cancellations")
    cancelled_by = relationship("User", backref="cancellations_made")

    __table_args__ = (
        CheckConstraint(
            "cancellation_type IN ('patient-cancelled', 'no-show', 'rescheduled-externally', 'clinic-cancelled', 'other')",
            name="check_cancellation_type"
        ),
    )

