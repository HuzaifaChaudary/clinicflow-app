from sqlalchemy import Column, String, Date, DateTime, Integer, Float, Boolean, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid
from app.database import Base


class OwnerMetrics(Base):
    """Daily aggregated metrics for owner dashboard"""
    __tablename__ = "owner_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    date = Column(Date, nullable=False)
    
    # No-show metrics
    no_show_rate = Column(Float, default=0.0)
    no_show_count = Column(Integer, default=0)
    total_appointments = Column(Integer, default=0)
    
    # AI recovery metrics
    appointments_recovered = Column(Integer, default=0)
    
    # Efficiency metrics
    admin_hours_saved = Column(Float, default=0.0)
    calls_automated = Column(Integer, default=0)
    forms_auto_completed = Column(Integer, default=0)
    manual_tasks_avoided = Column(Integer, default=0)
    
    # Utilization
    clinic_utilization = Column(Float, default=0.0)
    
    # Cost metrics
    estimated_savings = Column(Float, default=0.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="owner_metrics")


class VoiceAILog(Base):
    """Voice AI call logs and interactions"""
    __tablename__ = "voice_ai_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=True)
    
    # Call details
    call_sid = Column(String(100), nullable=True)  # Twilio Call SID
    call_type = Column(String(50), nullable=False)  # confirmation, reminder, follow_up, intake_request
    direction = Column(String(20), default="outbound")  # inbound, outbound
    
    # Status
    status = Column(String(50), default="pending")  # pending, in_progress, completed, failed, escalated
    outcome = Column(String(50), nullable=True)  # confirmed, rescheduled, cancelled, no_answer, voicemail, escalated
    
    # Timing
    initiated_at = Column(DateTime(timezone=True), nullable=True)
    answered_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, default=0)
    
    # Content
    transcript = Column(Text, nullable=True)
    ai_response = Column(Text, nullable=True)
    patient_response = Column(Text, nullable=True)
    
    # Escalation
    escalated = Column(Boolean, default=False)
    escalation_reason = Column(String(255), nullable=True)
    
    # Phone numbers
    from_number = Column(String(20), nullable=True)
    to_number = Column(String(20), nullable=True)
    
    # Call Metadata
    call_metadata = Column(JSONB, default=dict)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="voice_ai_logs")
    appointment = relationship("Appointment", backref="voice_ai_logs")
    patient = relationship("Patient", backref="voice_ai_logs")


class AutomationRule(Base):
    """Automation rules for the clinic"""
    __tablename__ = "automation_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    
    # Rule info
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    rule_type = Column(String(50), nullable=False)  # confirmation, reminder, intake, follow_up, waitlist
    
    # Trigger configuration
    trigger_event = Column(String(100), nullable=False)  # appointment_created, appointment_24h_before, etc.
    trigger_conditions = Column(JSONB, default=dict)  # Additional conditions
    
    # Action configuration
    action_type = Column(String(100), nullable=False)  # send_sms, make_call, send_email
    action_config = Column(JSONB, default=dict)  # Template, timing, etc.
    
    # Status
    enabled = Column(Boolean, default=True)
    priority = Column(Integer, default=0)
    
    # Statistics
    times_triggered = Column(Integer, default=0)
    last_triggered_at = Column(DateTime(timezone=True), nullable=True)
    success_count = Column(Integer, default=0)
    failure_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="automation_rules")


class AutomationExecution(Base):
    """Log of automation rule executions"""
    __tablename__ = "automation_executions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    rule_id = Column(UUID(as_uuid=True), ForeignKey("automation_rules.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=True)
    
    # Execution details
    status = Column(String(50), default="pending")  # pending, success, failed, skipped
    result = Column(JSONB, default=dict)
    error_message = Column(Text, nullable=True)
    
    # Timing
    triggered_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="automation_executions")
    rule = relationship("AutomationRule", backref="executions")
    appointment = relationship("Appointment", backref="automation_executions")
    patient = relationship("Patient", backref="automation_executions")


class ClinicSettings(Base):
    """Clinic settings and configuration"""
    __tablename__ = "clinic_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False, unique=True)
    
    # Working hours
    working_hours = Column(JSONB, default={
        "monday": {"start": "09:00", "end": "17:00", "enabled": True},
        "tuesday": {"start": "09:00", "end": "17:00", "enabled": True},
        "wednesday": {"start": "09:00", "end": "17:00", "enabled": True},
        "thursday": {"start": "09:00", "end": "17:00", "enabled": True},
        "friday": {"start": "09:00", "end": "17:00", "enabled": True},
        "saturday": {"start": "09:00", "end": "13:00", "enabled": False},
        "sunday": {"start": "09:00", "end": "13:00", "enabled": False}
    })
    
    # Appointment settings
    default_appointment_duration = Column(Integer, default=30)
    buffer_between_appointments = Column(Integer, default=0)
    max_appointments_per_day = Column(Integer, default=50)
    
    # Notification settings
    confirmation_reminder_hours = Column(Integer, default=24)
    intake_reminder_hours = Column(Integer, default=48)
    follow_up_reminder_days = Column(Integer, default=7)
    
    # Voice AI settings
    voice_ai_enabled = Column(Boolean, default=True)
    voice_ai_auto_confirm = Column(Boolean, default=True)
    voice_ai_escalation_enabled = Column(Boolean, default=True)
    
    # SMS settings
    sms_enabled = Column(Boolean, default=True)
    sms_confirmation_enabled = Column(Boolean, default=True)
    sms_reminder_enabled = Column(Boolean, default=True)
    
    # Email settings
    email_enabled = Column(Boolean, default=True)
    email_confirmation_enabled = Column(Boolean, default=True)
    email_reminder_enabled = Column(Boolean, default=True)
    
    # Waitlist settings
    waitlist_enabled = Column(Boolean, default=True)
    auto_fill_cancellations = Column(Boolean, default=True)
    
    # General settings
    timezone = Column(String(50), default="America/New_York")
    date_format = Column(String(20), default="MM/DD/YYYY")
    time_format = Column(String(10), default="12h")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="settings")


class DoctorCapacity(Base):
    """Doctor capacity and utilization tracking"""
    __tablename__ = "doctor_capacity"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clinic_id = Column(UUID(as_uuid=True), ForeignKey("clinics.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    date = Column(Date, nullable=False)
    
    # Capacity metrics
    total_slots = Column(Integer, default=16)  # Available slots
    booked_slots = Column(Integer, default=0)
    utilization_rate = Column(Float, default=0.0)
    
    # Appointment breakdown
    confirmed_count = Column(Integer, default=0)
    unconfirmed_count = Column(Integer, default=0)
    completed_count = Column(Integer, default=0)
    cancelled_count = Column(Integer, default=0)
    no_show_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    clinic = relationship("Clinic", backref="doctor_capacity")
    doctor = relationship("Doctor", backref="capacity_records")
