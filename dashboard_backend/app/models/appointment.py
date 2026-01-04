from sqlalchemy import Column, String, Date, Time, Integer, Boolean, DateTime, ForeignKey, CheckConstraint, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    
    # Scheduling
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    duration = Column(Integer, default=30)  # minutes
    
    # Type & Status
    visit_type = Column(String(20))
    visit_category = Column(String(20))
    status = Column(String(20), default="unconfirmed")
    
    # Intake
    intake_status = Column(String(20), default="missing")
    
    # Flags
    arrived = Column(Boolean, default=False)
    arrived_at = Column(DateTime(timezone=True), nullable=True)
    meeting_link = Column(String(500), nullable=True)  # For virtual visits
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="appointments")
    doctor = relationship("Doctor", backref="appointments")
    patient = relationship("Patient", backref="appointments")

    __table_args__ = (
        CheckConstraint("visit_type IN ('in-clinic', 'virtual')", name="check_visit_type"),
        CheckConstraint("visit_category IN ('new-patient', 'follow-up')", name="check_visit_category"),
        CheckConstraint("status IN ('confirmed', 'unconfirmed', 'cancelled', 'completed', 'no-show')", name="check_status"),
        CheckConstraint("intake_status IN ('missing', 'sent', 'completed')", name="check_intake_status"),
        Index("idx_appointments_clinic_date", "clinic_id", "date"),
        Index("idx_appointments_doctor_date", "doctor_id", "date"),
        Index("idx_appointments_patient", "patient_id"),
    )

