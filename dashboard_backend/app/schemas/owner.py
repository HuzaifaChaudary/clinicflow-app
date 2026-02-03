from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from uuid import UUID


# Owner Metrics Schemas
class OwnerMetricsBase(BaseModel):
    no_show_rate: float = 0.0
    no_show_count: int = 0
    total_appointments: int = 0
    appointments_recovered: int = 0
    admin_hours_saved: float = 0.0
    calls_automated: int = 0
    forms_auto_completed: int = 0
    manual_tasks_avoided: int = 0
    clinic_utilization: float = 0.0
    estimated_savings: float = 0.0


class OwnerMetricsResponse(OwnerMetricsBase):
    id: str
    clinic_id: str
    date: date
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Voice AI Log Schemas
class VoiceAILogBase(BaseModel):
    call_type: str
    direction: str = "outbound"
    status: str = "pending"
    outcome: Optional[str] = None


class VoiceAILogCreate(VoiceAILogBase):
    appointment_id: Optional[str] = None
    patient_id: Optional[str] = None
    to_number: Optional[str] = None


class VoiceAILogUpdate(BaseModel):
    status: Optional[str] = None
    outcome: Optional[str] = None
    duration_seconds: Optional[int] = None
    transcript: Optional[str] = None
    escalated: Optional[bool] = None
    escalation_reason: Optional[str] = None


class VoiceAILogResponse(BaseModel):
    id: str
    clinic_id: str
    appointment_id: Optional[str] = None
    patient_id: Optional[str] = None
    call_sid: Optional[str] = None
    call_type: str
    direction: str
    status: str
    outcome: Optional[str] = None
    initiated_at: Optional[datetime] = None
    answered_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    duration_seconds: int = 0
    transcript: Optional[str] = None
    escalated: bool = False
    escalation_reason: Optional[str] = None
    from_number: Optional[str] = None
    to_number: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Automation Rule Schemas
class AutomationRuleBase(BaseModel):
    name: str
    description: Optional[str] = None
    rule_type: str
    trigger_event: str
    trigger_conditions: Dict[str, Any] = {}
    action_type: str
    action_config: Dict[str, Any] = {}
    enabled: bool = True
    priority: int = 0


class AutomationRuleCreate(AutomationRuleBase):
    pass


class AutomationRuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    trigger_conditions: Optional[Dict[str, Any]] = None
    action_config: Optional[Dict[str, Any]] = None
    enabled: Optional[bool] = None
    priority: Optional[int] = None


class AutomationRuleResponse(AutomationRuleBase):
    id: str
    clinic_id: str
    times_triggered: int = 0
    last_triggered_at: Optional[datetime] = None
    success_count: int = 0
    failure_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Automation Execution Schemas
class AutomationExecutionResponse(BaseModel):
    id: str
    clinic_id: str
    rule_id: str
    appointment_id: Optional[str] = None
    patient_id: Optional[str] = None
    status: str
    result: Dict[str, Any] = {}
    error_message: Optional[str] = None
    triggered_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Clinic Settings Schemas
class WorkingHoursConfig(BaseModel):
    start: str = "09:00"
    end: str = "17:00"
    enabled: bool = True


class ClinicSettingsBase(BaseModel):
    working_hours: Optional[Dict[str, WorkingHoursConfig]] = None
    default_appointment_duration: int = 30
    buffer_between_appointments: int = 0
    max_appointments_per_day: int = 50
    confirmation_reminder_hours: int = 24
    intake_reminder_hours: int = 48
    follow_up_reminder_days: int = 7
    voice_ai_enabled: bool = True
    voice_ai_auto_confirm: bool = True
    voice_ai_escalation_enabled: bool = True
    sms_enabled: bool = True
    sms_confirmation_enabled: bool = True
    sms_reminder_enabled: bool = True
    email_enabled: bool = True
    email_confirmation_enabled: bool = True
    email_reminder_enabled: bool = True
    waitlist_enabled: bool = True
    auto_fill_cancellations: bool = True
    timezone: str = "America/New_York"
    date_format: str = "MM/DD/YYYY"
    time_format: str = "12h"


class ClinicSettingsUpdate(BaseModel):
    working_hours: Optional[Dict[str, Any]] = None
    default_appointment_duration: Optional[int] = None
    buffer_between_appointments: Optional[int] = None
    max_appointments_per_day: Optional[int] = None
    confirmation_reminder_hours: Optional[int] = None
    intake_reminder_hours: Optional[int] = None
    follow_up_reminder_days: Optional[int] = None
    voice_ai_enabled: Optional[bool] = None
    voice_ai_auto_confirm: Optional[bool] = None
    voice_ai_escalation_enabled: Optional[bool] = None
    sms_enabled: Optional[bool] = None
    sms_confirmation_enabled: Optional[bool] = None
    sms_reminder_enabled: Optional[bool] = None
    email_enabled: Optional[bool] = None
    email_confirmation_enabled: Optional[bool] = None
    email_reminder_enabled: Optional[bool] = None
    waitlist_enabled: Optional[bool] = None
    auto_fill_cancellations: Optional[bool] = None
    timezone: Optional[str] = None
    date_format: Optional[str] = None
    time_format: Optional[str] = None


class ClinicSettingsResponse(ClinicSettingsBase):
    id: str
    clinic_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Doctor Capacity Schemas
class DoctorCapacityResponse(BaseModel):
    id: str
    clinic_id: str
    doctor_id: str
    doctor_name: Optional[str] = None
    specialty: Optional[str] = None
    date: date
    total_slots: int
    booked_slots: int
    utilization_rate: float
    confirmed_count: int
    unconfirmed_count: int
    completed_count: int
    cancelled_count: int
    no_show_count: int

    class Config:
        from_attributes = True


# Owner Dashboard Response Schemas
class HeroMetric(BaseModel):
    id: str
    label: str
    value: str
    change: float
    change_label: str
    trend: str  # up, down
    good_direction: str  # up, down


class NoShowByDoctor(BaseModel):
    doctor_id: str
    doctor: str
    rate: float
    appointments: int


class NoShowByVisitType(BaseModel):
    type: str
    rate: float
    appointments: int


class NoShowByDayOfWeek(BaseModel):
    day: str
    rate: float


class FollowUpData(BaseModel):
    scheduled: int
    completed: int
    missed: int
    completion_rate: float
    retention_impact: str


class AdminEfficiency(BaseModel):
    calls_automated: int
    forms_auto_completed: int
    manual_tasks_avoided: int
    hours_per_week: float
    cost_savings: str
    cost_savings_monthly: str


class DoctorCapacitySummary(BaseModel):
    doctor_id: str
    doctor: str
    appointments: int
    utilization: float
    specialty: str


class AIPerformance(BaseModel):
    total_interactions: int
    confirmations_achieved: int
    escalations_to_humans: int
    success_rate: float
    avg_resolution_time: str


class TrendDataPoint(BaseModel):
    label: str
    value: float


class OwnerDashboardResponse(BaseModel):
    date: str
    hero_metrics: List[HeroMetric]
    no_show_by_doctor: List[NoShowByDoctor]
    no_show_by_visit_type: List[NoShowByVisitType]
    no_show_by_day_of_week: List[NoShowByDayOfWeek]
    follow_up_data: FollowUpData
    admin_efficiency: AdminEfficiency
    doctor_capacity: List[DoctorCapacitySummary]
    ai_performance: AIPerformance
    roi_summary: Dict[str, Any]
    # Historical trend data
    no_show_trend: Optional[List[TrendDataPoint]] = None
    appointments_recovered_trend: Optional[List[TrendDataPoint]] = None
    admin_hours_trend: Optional[List[TrendDataPoint]] = None
    clinic_utilization_trend: Optional[List[TrendDataPoint]] = None
    # Recovery sources breakdown
    recovery_sources: Optional[Dict[str, int]] = None
    # Pre-clinicflow baseline
    pre_clinicflow_no_show_rate: Optional[float] = None


# Voice AI Stats Response
class VoiceAIStats(BaseModel):
    total_calls: int
    successful_calls: int
    failed_calls: int
    escalated_calls: int
    avg_duration_seconds: float
    confirmations_achieved: int
    success_rate: float


class VoiceAIStatsResponse(BaseModel):
    date_range: Dict[str, str]
    stats: VoiceAIStats
    recent_calls: List[VoiceAILogResponse]
