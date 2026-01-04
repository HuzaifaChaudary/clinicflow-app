"""
User Model

Represents authenticated users in the system.
Uses Google OAuth for authentication.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    """User roles in the system."""
    ADMIN = "admin"
    DOCTOR = "doctor"
    OWNER = "owner"


class User(Base):
    """User entity - authenticated users."""
    
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    
    # Google OAuth fields
    google_id = Column(String(255), unique=True, nullable=True)
    picture = Column(String(500), nullable=True)
    
    # Profile
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    
    # Role & Clinic
    role = Column(Enum(UserRole), nullable=False, default=UserRole.ADMIN)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(TIMESTAMP, nullable=True)
    
    # Relationships
    clinic = relationship("Clinic", back_populates="users")
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    
    @property
    def full_name(self) -> str:
        """Get user's full name."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.email
    
    def __repr__(self):
        return f"<User {self.email} ({self.role.value})>"


class Session(Base):
    """User sessions for token management."""
    
    __tablename__ = "sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Token info
    refresh_token = Column(String(500), nullable=False, unique=True, index=True)
    
    # Expiration
    expires_at = Column(TIMESTAMP, nullable=False)
    
    # Metadata
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(50), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    
    def __repr__(self):
        return f"<Session {self.id} for user {self.user_id}>"
