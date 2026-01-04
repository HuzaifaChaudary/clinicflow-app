from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class Clinic(Base):
    __tablename__ = "clinics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    timezone = Column(String(50), default="America/New_York")
    clinic_type = Column(String(50), nullable=True)  # primary-care, specialty, dental, etc.
    clinic_size = Column(String(20), nullable=True)  # solo, 2-5, 6-10, 10plus
    clinic_metadata = Column(JSONB, default=dict, server_default="{}")  # Store additional signup data (phone, etc.)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

