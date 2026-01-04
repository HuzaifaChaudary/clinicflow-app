from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False)
    initials = Column(String(10))
    specialty = Column(String(100))
    color = Column(String(20))  # For calendar UI
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="doctors")
    user = relationship("User", foreign_keys=[user_id], backref="doctor_profile")

