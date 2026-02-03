from typing import Optional, List, Dict, Any
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
import logging
import uuid

from app.config import settings
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.owner import AutomationRule, AutomationExecution, VoiceAILog
from app.services.twilio_service import (
    send_appointment_confirmation_sms,
    send_appointment_reminder_sms,
    send_intake_reminder_sms,
    make_voice_call
)

logger = logging.getLogger(__name__)


class AutomationService:
    """Service for handling automation rules and executions"""
    
    def __init__(self, db: Session, clinic_id: uuid.UUID):
        self.db = db
        self.clinic_id = clinic_id
    
    def get_active_rules(self, trigger_event: str) -> List[AutomationRule]:
        """Get all active rules for a specific trigger event"""
        return self.db.query(AutomationRule).filter(
            AutomationRule.clinic_id == self.clinic_id,
            AutomationRule.enabled == True,
            AutomationRule.trigger_event == trigger_event
        ).order_by(AutomationRule.priority.desc()).all()
    
    def execute_rule(
        self,
        rule: AutomationRule,
        appointment: Optional[Appointment] = None,
        patient: Optional[Patient] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> AutomationExecution:
        """Execute an automation rule and log the result"""
        execution = AutomationExecution(
            clinic_id=self.clinic_id,
            rule_id=rule.id,
            appointment_id=appointment.id if appointment else None,
            patient_id=patient.id if patient else None,
            status="pending"
        )
        self.db.add(execution)
        self.db.commit()
        
        try:
            result = self._perform_action(rule, appointment, patient, context)
            
            execution.status = "success" if result.get("success") else "failed"
            execution.result = result
            execution.completed_at = datetime.utcnow()
            
            # Update rule statistics
            rule.times_triggered += 1
            rule.last_triggered_at = datetime.utcnow()
            if result.get("success"):
                rule.success_count += 1
            else:
                rule.failure_count += 1
            
            self.db.commit()
            
        except Exception as e:
            logger.error(f"Failed to execute rule {rule.id}: {e}")
            execution.status = "failed"
            execution.error_message = str(e)
            execution.completed_at = datetime.utcnow()
            rule.failure_count += 1
            self.db.commit()
        
        return execution
    
    def _perform_action(
        self,
        rule: AutomationRule,
        appointment: Optional[Appointment],
        patient: Optional[Patient],
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Perform the action defined in the rule"""
        action_type = rule.action_type
        action_config = rule.action_config or {}
        
        if action_type == "send_sms":
            return self._send_sms_action(rule, appointment, patient, action_config)
        elif action_type == "make_call":
            return self._make_call_action(rule, appointment, patient, action_config)
        elif action_type == "send_email":
            return self._send_email_action(rule, appointment, patient, action_config)
        else:
            return {"success": False, "error": f"Unknown action type: {action_type}"}
    
    def _send_sms_action(
        self,
        rule: AutomationRule,
        appointment: Optional[Appointment],
        patient: Optional[Patient],
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Send SMS based on rule configuration"""
        # Check clinic settings for SMS
        from app.models.owner import ClinicSettings
        clinic_settings = self.db.query(ClinicSettings).filter(
            ClinicSettings.clinic_id == self.clinic_id
        ).first()
        
        if not clinic_settings or not clinic_settings.sms_enabled:
            return {"success": False, "error": "SMS is disabled in clinic settings"}
        
        if not patient or not patient.phone:
            return {"success": False, "error": "Patient phone not available"}
        
        template = config.get("template", "confirmation")
        
        # Check specific SMS settings based on template
        if template == "confirmation" and not clinic_settings.sms_confirmation_enabled:
            return {"success": False, "error": "SMS confirmations are disabled in clinic settings"}
        elif template == "reminder" and not clinic_settings.sms_reminder_enabled:
            return {"success": False, "error": "SMS reminders are disabled in clinic settings"}
        
        if appointment:
            doctor = appointment.doctor
            apt_date = appointment.date.strftime("%B %d, %Y")
            apt_time = appointment.start_time.strftime("%I:%M %p")
            
            # Get clinic name
            clinic_name = "ClinicFlow"  # Fallback only
            if hasattr(appointment, 'clinic') and appointment.clinic:
                clinic_name = appointment.clinic.name
            
            if template == "confirmation":
                return send_appointment_confirmation_sms(
                    patient_name=patient.first_name or "Patient",
                    patient_phone=patient.phone,
                    doctor_name=doctor.name if doctor else "Your doctor",
                    appointment_date=apt_date,
                    appointment_time=apt_time,
                    clinic_name=clinic_name
                )
            elif template == "reminder":
                return send_appointment_reminder_sms(
                    patient_name=patient.first_name or "Patient",
                    patient_phone=patient.phone,
                    doctor_name=doctor.name if doctor else "Your doctor",
                    appointment_date=apt_date,
                    appointment_time=apt_time,
                    clinic_name=clinic_name
                )
            elif template == "intake":
                intake_url = f"{settings.FRONTEND_URL}/intake/{appointment.id}"
                return send_intake_reminder_sms(
                    patient_name=patient.first_name or "Patient",
                    patient_phone=patient.phone,
                    intake_url=intake_url,
                    appointment_date=apt_date,
                    clinic_name=clinic_name
                )
        
        return {"success": False, "error": "No appointment context for SMS"}
    
    def _make_call_action(
        self,
        rule: AutomationRule,
        appointment: Optional[Appointment],
        patient: Optional[Patient],
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Make voice call based on rule configuration"""
        # Check if Voice AI is enabled in clinic settings
        from app.models.owner import ClinicSettings
        clinic_settings = self.db.query(ClinicSettings).filter(
            ClinicSettings.clinic_id == self.clinic_id
        ).first()
        
        if not clinic_settings or not clinic_settings.voice_ai_enabled:
            return {"success": False, "error": "Voice AI is disabled in clinic settings"}
        
        if not patient or not patient.phone:
            return {"success": False, "error": "Patient phone not available"}
        
        # Create Voice AI log
        voice_log = VoiceAILog(
            clinic_id=self.clinic_id,
            appointment_id=appointment.id if appointment else None,
            patient_id=patient.id,
            call_type=config.get("call_type", "confirmation"),
            direction="outbound",
            status="pending",
            to_number=patient.phone
        )
        self.db.add(voice_log)
        self.db.commit()
        
        # Make the call
        result = make_voice_call(
            to_number=patient.phone,
            twiml_url=config.get("twiml_url"),
            status_callback=f"{settings.FRONTEND_URL}/api/voice/status/{voice_log.id}"
        )
        
        # Update voice log
        if result.get("success"):
            voice_log.call_sid = result.get("call_sid")
            voice_log.status = "in_progress"
            voice_log.initiated_at = datetime.utcnow()
        else:
            voice_log.status = "failed"
        
        self.db.commit()
        
        return result
    
    def _send_email_action(
        self,
        rule: AutomationRule,
        appointment: Optional[Appointment],
        patient: Optional[Patient],
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Send email based on rule configuration"""
        # Check clinic settings for Email
        from app.models.owner import ClinicSettings
        clinic_settings = self.db.query(ClinicSettings).filter(
            ClinicSettings.clinic_id == self.clinic_id
        ).first()
        
        if not clinic_settings or not clinic_settings.email_enabled:
            return {"success": False, "error": "Email is disabled in clinic settings"}
        
        if not patient or not patient.email:
            return {"success": False, "error": "Patient email not available"}
        
        template = config.get("template", "confirmation")
        
        # Check specific Email settings based on template
        if template == "confirmation" and not clinic_settings.email_confirmation_enabled:
            return {"success": False, "error": "Email confirmations are disabled in clinic settings"}
        elif template == "reminder" and not clinic_settings.email_reminder_enabled:
            return {"success": False, "error": "Email reminders are disabled in clinic settings"}
        
        if appointment:
            # Get clinic settings for formatting
            from app.models.owner import ClinicSettings
            clinic_settings = self.db.query(ClinicSettings).filter(
                ClinicSettings.clinic_id == self.clinic_id
            ).first()
            
            date_format = clinic_settings.date_format if clinic_settings else "MM/DD/YYYY"
            time_format = clinic_settings.time_format if clinic_settings else "12h"
            timezone = clinic_settings.timezone if clinic_settings else "America/New_York"
            
            from app.utils.date_format import format_date, format_time
            
            doctor = appointment.doctor
            apt_date = format_date(appointment.date, date_format, timezone)
            apt_time = format_time(appointment.start_time, time_format)
            
            # Get clinic name from relationship
            clinic_name = "ClinicFlow"  # Fallback only
            if hasattr(appointment, 'clinic') and appointment.clinic:
                clinic_name = appointment.clinic.name
            
            if template == "confirmation":
                from app.services.email_service import send_appointment_confirmation_email
                return send_appointment_confirmation_email(
                    patient_name=patient.first_name or "Patient",
                    patient_email=patient.email,
                    doctor_name=doctor.name if doctor else "Your doctor",
                    appointment_date=apt_date,
                    appointment_time=apt_time,
                    clinic_name=clinic_name
                )
            elif template == "reminder":
                from app.services.email_service import send_appointment_reminder_email
                return send_appointment_reminder_email(
                    patient_name=patient.first_name or "Patient",
                    patient_email=patient.email,
                    doctor_name=doctor.name if doctor else "Your doctor",
                    appointment_date=apt_date,
                    appointment_time=apt_time,
                    hours_until=24,  # Will be overridden by settings in scheduled tasks
                    clinic_name=clinic_name
                )
            elif template == "intake":
                from app.services.email_service import send_intake_reminder_email
                intake_url = f"{settings.FRONTEND_URL}/intake/{appointment.id}"
                return send_intake_reminder_email(
                    patient_name=patient.first_name or "Patient",
                    patient_email=patient.email,
                    intake_url=intake_url,
                    appointment_date=apt_date,
                    clinic_name=clinic_name
                )
        
        return {"success": False, "error": "No appointment context for email"}
    
    def process_appointment_created(self, appointment: Appointment) -> List[AutomationExecution]:
        """Process automations when an appointment is created"""
        if not settings.AUTOMATION_ENABLED:
            return []
        
        rules = self.get_active_rules("appointment_created")
        executions = []
        
        for rule in rules:
            if self._check_conditions(rule, appointment):
                execution = self.execute_rule(
                    rule=rule,
                    appointment=appointment,
                    patient=appointment.patient
                )
                executions.append(execution)
        
        return executions
    
    def process_appointment_reminder(self, appointment: Appointment) -> List[AutomationExecution]:
        """Process reminder automations for an appointment"""
        if not settings.AUTOMATION_ENABLED:
            return []
        
        # Check clinic settings for Voice AI
        from app.models.owner import ClinicSettings
        clinic_settings = self.db.query(ClinicSettings).filter(
            ClinicSettings.clinic_id == self.clinic_id
        ).first()
        
        rules = self.get_active_rules("appointment_reminder")
        executions = []
        
        for rule in rules:
            # Skip voice AI rules if Voice AI is disabled
            if rule.action_type == "make_call" and (not clinic_settings or not clinic_settings.voice_ai_enabled):
                continue
            
            if self._check_conditions(rule, appointment):
                execution = self.execute_rule(
                    rule=rule,
                    appointment=appointment,
                    patient=appointment.patient
                )
                executions.append(execution)
        
        return executions
    
    def process_intake_reminder(self, appointment: Appointment) -> List[AutomationExecution]:
        """Process intake form reminder automations"""
        if not settings.AUTOMATION_ENABLED:
            return []
        
        # Only send if intake is missing
        if appointment.intake_status != "missing":
            return []
        
        rules = self.get_active_rules("intake_reminder")
        executions = []
        
        for rule in rules:
            if self._check_conditions(rule, appointment):
                execution = self.execute_rule(
                    rule=rule,
                    appointment=appointment,
                    patient=appointment.patient
                )
                executions.append(execution)
        
        return executions
    
    def _check_conditions(self, rule: AutomationRule, appointment: Appointment) -> bool:
        """Check if rule conditions are met"""
        conditions = rule.trigger_conditions or {}
        
        # Check visit type condition
        if "visit_type" in conditions:
            if appointment.visit_type != conditions["visit_type"]:
                return False
        
        # Check visit category condition
        if "visit_category" in conditions:
            if appointment.visit_category != conditions["visit_category"]:
                return False
        
        # Check status condition
        if "status" in conditions:
            if appointment.status != conditions["status"]:
                return False
        
        return True


def get_appointments_needing_reminders(
    db: Session,
    clinic_id: uuid.UUID,
    hours_before: Optional[int] = None
) -> List[Appointment]:
    """Get appointments that need reminders sent - uses database settings if hours_before not provided"""
    from app.models.owner import ClinicSettings
    
    # Get reminder hours from settings if not provided
    if hours_before is None:
        clinic_settings = db.query(ClinicSettings).filter(
            ClinicSettings.clinic_id == clinic_id
        ).first()
        hours_before = clinic_settings.confirmation_reminder_hours if clinic_settings else 24
    
    # Calculate target datetime based on hours before
    now = datetime.now()
    target_datetime = now + timedelta(hours=hours_before)
    target_date = target_datetime.date()
    
    return db.query(Appointment).filter(
        Appointment.clinic_id == clinic_id,
        Appointment.date == target_date,
        Appointment.status.in_(["unconfirmed", "confirmed"]),
        Appointment.status != "cancelled"
    ).all()


def get_appointments_needing_intake_reminders(
    db: Session,
    clinic_id: uuid.UUID,
    hours_before: Optional[int] = None
) -> List[Appointment]:
    """Get appointments that need intake reminders - uses database settings if hours_before not provided"""
    from app.models.owner import ClinicSettings
    
    # Get reminder hours from settings if not provided
    if hours_before is None:
        clinic_settings = db.query(ClinicSettings).filter(
            ClinicSettings.clinic_id == clinic_id
        ).first()
        hours_before = clinic_settings.intake_reminder_hours if clinic_settings else 48
    
    # Calculate target date range based on hours before
    now = datetime.now()
    target_datetime = now + timedelta(hours=hours_before)
    target_date = target_datetime.date()
    today = date.today()
    
    return db.query(Appointment).filter(
        Appointment.clinic_id == clinic_id,
        Appointment.date >= today,
        Appointment.date <= target_date,
        Appointment.intake_status == "missing",
        Appointment.status != "cancelled"
    ).all()


def create_default_automation_rules(db: Session, clinic_id: uuid.UUID) -> List[AutomationRule]:
    """Create default automation rules for a new clinic"""
    default_rules = [
        {
            "name": "Appointment Confirmation SMS",
            "description": "Send SMS confirmation when appointment is created",
            "rule_type": "confirmation",
            "trigger_event": "appointment_created",
            "action_type": "send_sms",
            "action_config": {"template": "confirmation"},
            "priority": 10
        },
        {
            "name": "24-Hour Reminder SMS",
            "description": "Send SMS reminder 24 hours before appointment",
            "rule_type": "reminder",
            "trigger_event": "appointment_reminder",
            "action_type": "send_sms",
            "action_config": {"template": "reminder"},
            "priority": 10
        },
        {
            "name": "Intake Form Reminder SMS",
            "description": "Send SMS reminder to complete intake form",
            "rule_type": "intake",
            "trigger_event": "intake_reminder",
            "action_type": "send_sms",
            "action_config": {"template": "intake"},
            "priority": 5
        },
        {
            "name": "Voice AI Confirmation Call",
            "description": "Make voice call to confirm unconfirmed appointments",
            "rule_type": "confirmation",
            "trigger_event": "appointment_reminder",
            "trigger_conditions": {"status": "unconfirmed"},
            "action_type": "make_call",
            "action_config": {"call_type": "confirmation"},
            "priority": 5
        }
    ]
    
    created_rules = []
    for rule_data in default_rules:
        rule = AutomationRule(
            clinic_id=clinic_id,
            **rule_data
        )
        db.add(rule)
        created_rules.append(rule)
    
    db.commit()
    return created_rules
