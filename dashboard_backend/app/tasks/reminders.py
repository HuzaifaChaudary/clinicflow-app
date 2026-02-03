"""
Celery tasks for sending appointment reminders
"""
from datetime import datetime, date, timedelta
from typing import List
import logging
from sqlalchemy.orm import Session, joinedload

from app.celery_app import celery_app
from app.database import SessionLocal
from app.models.appointment import Appointment
from app.models.owner import ClinicSettings
from app.services.email_service import (
    send_appointment_reminder_email,
    send_intake_reminder_email,
    send_appointment_confirmation_email
)
from app.services.twilio_service import (
    send_appointment_reminder_sms,
    send_intake_reminder_sms,
    send_appointment_confirmation_sms
)
from app.config import settings
from app.utils.date_format import format_date, format_time

logger = logging.getLogger(__name__)




@celery_app.task(name="app.tasks.reminders.send_confirmation_reminders")
def send_confirmation_reminders():
    """Send confirmation reminders for all clinics"""
    db = SessionLocal()
    try:
        # Get all clinics
        from app.models.clinic import Clinic
        clinics = db.query(Clinic).all()
        
        total_sent = 0
        total_errors = 0
        
        for clinic in clinics:
            try:
                # Get clinic settings
                clinic_settings = db.query(ClinicSettings).filter(
                    ClinicSettings.clinic_id == clinic.id
                ).first()
                
                if not clinic_settings:
                    continue
                
                # Skip if SMS and email are both disabled
                if not clinic_settings.sms_enabled and not clinic_settings.email_enabled:
                    continue
                
                if not clinic_settings.sms_reminder_enabled and not clinic_settings.email_reminder_enabled:
                    continue
                
                # Get reminder hours from settings (not hardcoded)
                reminder_hours = clinic_settings.confirmation_reminder_hours
                
                # Calculate target datetime
                now = datetime.now()
                target_datetime = now + timedelta(hours=reminder_hours)
                target_date = target_datetime.date()
                
                # Get appointments that need reminders
                appointments = db.query(Appointment).options(
                    joinedload(Appointment.patient),
                    joinedload(Appointment.doctor)
                ).filter(
                    Appointment.clinic_id == clinic.id,
                    Appointment.date == target_date,
                    Appointment.status.in_(["unconfirmed", "confirmed"]),
                    Appointment.status != "cancelled"
                ).all()
                
                for appointment in appointments:
                    try:
                        # Check if already sent (prevent duplicates)
                        # This would require a tracking table, but for now we'll send
                        
                        patient = appointment.patient
                        doctor = appointment.doctor
                        
                        if not patient:
                            continue
                        
                        apt_date = format_date(appointment.date, clinic_settings.date_format, clinic_settings.timezone)
                        apt_time = format_time(appointment.start_time, clinic_settings.time_format)
                        
                        # Send SMS if enabled
                        if (clinic_settings.sms_enabled and 
                            clinic_settings.sms_reminder_enabled and 
                            patient.phone):
                            try:
                                result = send_appointment_reminder_sms(
                                    patient_name=patient.first_name or "Patient",
                                    patient_phone=patient.phone,
                                    doctor_name=doctor.name if doctor else "Your doctor",
                                    appointment_date=apt_date,
                                    appointment_time=apt_time,
                                    hours_until=reminder_hours,
                                    clinic_name=clinic.name
                                )
                                if result.get("success"):
                                    total_sent += 1
                                    logger.info(f"Sent SMS reminder to {patient.phone} for appointment {appointment.id}")
                                else:
                                    logger.warning(f"Failed to send SMS reminder: {result.get('error')}")
                                    total_errors += 1
                            except Exception as e:
                                logger.error(f"Error sending SMS reminder: {e}")
                                total_errors += 1
                        
                        # Send email if enabled
                        if (clinic_settings.email_enabled and 
                            clinic_settings.email_reminder_enabled and 
                            patient.email):
                            try:
                                result = send_appointment_reminder_email(
                                    patient_name=patient.first_name or "Patient",
                                    patient_email=patient.email,
                                    doctor_name=doctor.name if doctor else "Your doctor",
                                    appointment_date=apt_date,
                                    appointment_time=apt_time,
                                    hours_until=reminder_hours,
                                    clinic_name=clinic.name
                                )
                                if result.get("success"):
                                    total_sent += 1
                                    logger.info(f"Sent email reminder to {patient.email} for appointment {appointment.id}")
                                else:
                                    logger.warning(f"Failed to send email reminder: {result.get('error')}")
                                    total_errors += 1
                            except Exception as e:
                                logger.error(f"Error sending email reminder: {e}")
                                total_errors += 1
                                
                    except Exception as e:
                        logger.error(f"Error processing appointment {appointment.id}: {e}")
                        total_errors += 1
                        
            except Exception as e:
                logger.error(f"Error processing clinic {clinic.id}: {e}")
                total_errors += 1
        
        logger.info(f"Confirmation reminders sent: {total_sent}, errors: {total_errors}")
        return {"sent": total_sent, "errors": total_errors}
        
    except Exception as e:
        logger.error(f"Error in send_confirmation_reminders task: {e}")
        return {"sent": 0, "errors": 1, "error": str(e)}
    finally:
        db.close()


@celery_app.task(name="app.tasks.reminders.send_intake_reminders")
def send_intake_reminders():
    """Send intake form reminders for all clinics"""
    db = SessionLocal()
    try:
        # Get all clinics
        from app.models.clinic import Clinic
        clinics = db.query(Clinic).all()
        
        total_sent = 0
        total_errors = 0
        
        for clinic in clinics:
            try:
                # Get clinic settings
                clinic_settings = db.query(ClinicSettings).filter(
                    ClinicSettings.clinic_id == clinic.id
                ).first()
                
                if not clinic_settings:
                    continue
                
                # Skip if SMS and email are both disabled
                if not clinic_settings.sms_enabled and not clinic_settings.email_enabled:
                    continue
                
                # Get reminder hours from settings (not hardcoded)
                reminder_hours = clinic_settings.intake_reminder_hours
                
                # Calculate target date range
                now = datetime.now()
                target_datetime = now + timedelta(hours=reminder_hours)
                target_date = target_datetime.date()
                today = date.today()
                
                # Get appointments that need intake reminders
                appointments = db.query(Appointment).options(
                    joinedload(Appointment.patient),
                    joinedload(Appointment.doctor)
                ).filter(
                    Appointment.clinic_id == clinic.id,
                    Appointment.date >= today,
                    Appointment.date <= target_date,
                    Appointment.intake_status == "missing",
                    Appointment.status != "cancelled"
                ).all()
                
                for appointment in appointments:
                    try:
                        patient = appointment.patient
                        doctor = appointment.doctor
                        
                        if not patient:
                            continue
                        
                        apt_date = format_date(appointment.date, clinic_settings.date_format, clinic_settings.timezone)
                        intake_url = f"{settings.FRONTEND_URL}/intake/{appointment.id}"
                        
                        # Send SMS if enabled
                        if (clinic_settings.sms_enabled and 
                            patient.phone):
                            try:
                                result = send_intake_reminder_sms(
                                    patient_name=patient.first_name or "Patient",
                                    patient_phone=patient.phone,
                                    intake_url=intake_url,
                                    appointment_date=apt_date,
                                    clinic_name=clinic.name
                                )
                                if result.get("success"):
                                    total_sent += 1
                                    logger.info(f"Sent intake SMS reminder to {patient.phone} for appointment {appointment.id}")
                                else:
                                    logger.warning(f"Failed to send intake SMS reminder: {result.get('error')}")
                                    total_errors += 1
                            except Exception as e:
                                logger.error(f"Error sending intake SMS reminder: {e}")
                                total_errors += 1
                        
                        # Send email if enabled
                        if (clinic_settings.email_enabled and 
                            patient.email):
                            try:
                                result = send_intake_reminder_email(
                                    patient_name=patient.first_name or "Patient",
                                    patient_email=patient.email,
                                    intake_url=intake_url,
                                    appointment_date=apt_date,
                                    clinic_name=clinic.name
                                )
                                if result.get("success"):
                                    total_sent += 1
                                    logger.info(f"Sent intake email reminder to {patient.email} for appointment {appointment.id}")
                                else:
                                    logger.warning(f"Failed to send intake email reminder: {result.get('error')}")
                                    total_errors += 1
                            except Exception as e:
                                logger.error(f"Error sending intake email reminder: {e}")
                                total_errors += 1
                                
                    except Exception as e:
                        logger.error(f"Error processing appointment {appointment.id}: {e}")
                        total_errors += 1
                        
            except Exception as e:
                logger.error(f"Error processing clinic {clinic.id}: {e}")
                total_errors += 1
        
        logger.info(f"Intake reminders sent: {total_sent}, errors: {total_errors}")
        return {"sent": total_sent, "errors": total_errors}
        
    except Exception as e:
        logger.error(f"Error in send_intake_reminders task: {e}")
        return {"sent": 0, "errors": 1, "error": str(e)}
    finally:
        db.close()

