from sqlalchemy import Column, String, DateTime, ForeignKey, CheckConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for Google OAuth users
    google_id = Column(String(255), unique=True, nullable=True, index=True)  # Google OAuth ID
    name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=True)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="users")
    doctor = relationship("Doctor", foreign_keys=[doctor_id], backref="user_accounts")

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'doctor', 'owner')", name="check_role"),
    )

