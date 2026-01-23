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
        if not patient or not patient.phone:
            return {"success": False, "error": "Patient phone not available"}
        
        template = config.get("template", "confirmation")
        
        if appointment:
            doctor = appointment.doctor
            apt_date = appointment.date.strftime("%B %d, %Y")
            apt_time = appointment.start_time.strftime("%I:%M %p")
            
            if template == "confirmation":
                return send_appointment_confirmation_sms(
                    patient_name=patient.first_name,
                    patient_phone=patient.phone,
                    doctor_name=doctor.name,
                    appointment_date=apt_date,
                    appointment_time=apt_time
                )
            elif template == "reminder":
                return send_appointment_reminder_sms(
                    patient_name=patient.first_name,
                    patient_phone=patient.phone,
                    doctor_name=doctor.name,
                    appointment_date=apt_date,
                    appointment_time=apt_time
                )
            elif template == "intake":
                intake_url = f"{settings.FRONTEND_URL}/intake/{appointment.id}"
                return send_intake_reminder_sms(
                    patient_name=patient.first_name,
                    patient_phone=patient.phone,
                    intake_url=intake_url,
                    appointment_date=apt_date
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
        # Email sending would be implemented here with SendGrid
        # For now, return a mock success
        return {
            "success": True,
            "mock": True,
            "message": "Email would be sent (not implemented)"
        }
    
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
        
        rules = self.get_active_rules("appointment_reminder")
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
    hours_before: int = 24
) -> List[Appointment]:
    """Get appointments that need reminders sent"""
    target_date = date.today() + timedelta(days=1)
    
    return db.query(Appointment).filter(
        Appointment.clinic_id == clinic_id,
        Appointment.date == target_date,
        Appointment.status == "unconfirmed"
    ).all()


def get_appointments_needing_intake_reminders(
    db: Session,
    clinic_id: uuid.UUID,
    hours_before: int = 48
) -> List[Appointment]:
    """Get appointments that need intake reminders"""
    target_date = date.today() + timedelta(days=2)
    
    return db.query(Appointment).filter(
        Appointment.clinic_id == clinic_id,
        Appointment.date <= target_date,
        Appointment.date >= date.today(),
        Appointment.intake_status == "missing"
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
