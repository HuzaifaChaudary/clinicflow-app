from typing import Optional, Dict, Any, List
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from app.config import settings

logger = logging.getLogger(__name__)


def send_email(
    to_email: str,
    subject: str,
    body_html: str,
    body_text: Optional[str] = None,
    from_email: Optional[str] = None,
    from_name: Optional[str] = None
) -> Dict[str, Any]:
    """Send an email via SMTP"""
    
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.warning("SMTP credentials not configured")
        return {
            "success": False,
            "error": "SMTP not configured",
            "mock": True,
            "message_id": f"MOCK_{datetime.now().timestamp()}"
        }
    
    try:
        from_email = from_email or settings.SMTP_FROM_EMAIL or settings.SMTP_USERNAME
        from_name = from_name or settings.SMTP_FROM_NAME
        
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{from_name} <{from_email}>"
        msg["To"] = to_email
        
        # Add plain text and HTML parts
        if body_text:
            part1 = MIMEText(body_text, "plain")
            msg.attach(part1)
        
        part2 = MIMEText(body_html, "html")
        msg.attach(part2)
        
        # Connect and send
        if settings.SMTP_USE_TLS:
            server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
            server.starttls()
        else:
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT)
        
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        
        return {
            "success": True,
            "to": to_email,
            "subject": subject
        }
    
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return {
            "success": False,
            "error": str(e),
            "to": to_email
        }


def send_appointment_confirmation_email(
    patient_name: str,
    patient_email: str,
    doctor_name: str,
    appointment_date: str,
    appointment_time: str,
    clinic_name: str = "ClinicFlow",
    clinic_address: str = ""
) -> Dict[str, Any]:
    """Send appointment confirmation email"""
    
    subject = f"Appointment Confirmation - {appointment_date}"
    
    body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4A90A4; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
            .details {{ background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
            .button {{ display: inline-block; background-color: #4A90A4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Appointment Confirmed</h1>
            </div>
            <div class="content">
                <p>Hi {patient_name},</p>
                <p>Your appointment has been confirmed. Here are the details:</p>
                
                <div class="details">
                    <p><strong>Doctor:</strong> {doctor_name}</p>
                    <p><strong>Date:</strong> {appointment_date}</p>
                    <p><strong>Time:</strong> {appointment_time}</p>
                    {f'<p><strong>Location:</strong> {clinic_address}</p>' if clinic_address else ''}
                </div>
                
                <p>Please arrive 10-15 minutes before your scheduled time.</p>
                
                <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
                
                <div class="footer">
                    <p>This email was sent by {clinic_name}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    body_text = f"""
    Hi {patient_name},
    
    Your appointment has been confirmed.
    
    Doctor: {doctor_name}
    Date: {appointment_date}
    Time: {appointment_time}
    {f'Location: {clinic_address}' if clinic_address else ''}
    
    Please arrive 10-15 minutes before your scheduled time.
    
    If you need to reschedule or cancel, please contact us as soon as possible.
    
    - {clinic_name}
    """
    
    return send_email(patient_email, subject, body_html, body_text)


def send_appointment_reminder_email(
    patient_name: str,
    patient_email: str,
    doctor_name: str,
    appointment_date: str,
    appointment_time: str,
    hours_until: int = 24,
    clinic_name: str = "ClinicFlow"
) -> Dict[str, Any]:
    """Send appointment reminder email"""
    
    subject = f"Reminder: Appointment Tomorrow - {appointment_date}"
    
    body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #FF9500; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
            .details {{ background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Appointment Reminder</h1>
            </div>
            <div class="content">
                <p>Hi {patient_name},</p>
                <p>This is a friendly reminder about your upcoming appointment:</p>
                
                <div class="details">
                    <p><strong>Doctor:</strong> {doctor_name}</p>
                    <p><strong>Date:</strong> {appointment_date}</p>
                    <p><strong>Time:</strong> {appointment_time}</p>
                </div>
                
                <p>Please remember to arrive 10-15 minutes early.</p>
                
                <p>If you cannot make it, please let us know as soon as possible so we can offer the slot to another patient.</p>
                
                <div class="footer">
                    <p>This email was sent by {clinic_name}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    body_text = f"""
    Hi {patient_name},
    
    This is a reminder about your upcoming appointment:
    
    Doctor: {doctor_name}
    Date: {appointment_date}
    Time: {appointment_time}
    
    Please arrive 10-15 minutes early.
    
    If you cannot make it, please let us know as soon as possible.
    
    - {clinic_name}
    """
    
    return send_email(patient_email, subject, body_html, body_text)


def send_intake_reminder_email(
    patient_name: str,
    patient_email: str,
    intake_url: str,
    appointment_date: str,
    clinic_name: str = "ClinicFlow"
) -> Dict[str, Any]:
    """Send intake form reminder email"""
    
    subject = f"Please Complete Your Intake Form - {clinic_name}"
    
    body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #5B8DEF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
            .button {{ display: inline-block; background-color: #5B8DEF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Complete Your Intake Form</h1>
            </div>
            <div class="content">
                <p>Hi {patient_name},</p>
                <p>Please complete your intake form before your upcoming appointment on <strong>{appointment_date}</strong>.</p>
                
                <p>Completing this form ahead of time helps us provide you with better care and reduces wait times.</p>
                
                <p style="text-align: center;">
                    <a href="{intake_url}" class="button">Complete Intake Form</a>
                </p>
                
                <p>Or copy this link: {intake_url}</p>
                
                <div class="footer">
                    <p>This email was sent by {clinic_name}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    body_text = f"""
    Hi {patient_name},
    
    Please complete your intake form before your upcoming appointment on {appointment_date}.
    
    Complete it here: {intake_url}
    
    Completing this form ahead of time helps us provide you with better care.
    
    - {clinic_name}
    """
    
    return send_email(patient_email, subject, body_html, body_text)


def send_cancellation_email(
    patient_name: str,
    patient_email: str,
    doctor_name: str,
    appointment_date: str,
    appointment_time: str,
    clinic_name: str = "ClinicFlow",
    clinic_phone: str = ""
) -> Dict[str, Any]:
    """Send appointment cancellation email"""
    
    subject = f"Appointment Cancelled - {appointment_date}"
    
    body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #FF3B30; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
            .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
            .details {{ background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Appointment Cancelled</h1>
            </div>
            <div class="content">
                <p>Hi {patient_name},</p>
                <p>Your appointment has been cancelled:</p>
                
                <div class="details">
                    <p><strong>Doctor:</strong> {doctor_name}</p>
                    <p><strong>Date:</strong> {appointment_date}</p>
                    <p><strong>Time:</strong> {appointment_time}</p>
                </div>
                
                <p>If you would like to reschedule, please contact us{f' at {clinic_phone}' if clinic_phone else ''}.</p>
                
                <div class="footer">
                    <p>This email was sent by {clinic_name}</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    body_text = f"""
    Hi {patient_name},
    
    Your appointment has been cancelled:
    
    Doctor: {doctor_name}
    Date: {appointment_date}
    Time: {appointment_time}
    
    If you would like to reschedule, please contact us{f' at {clinic_phone}' if clinic_phone else ''}.
    
    - {clinic_name}
    """
    
    return send_email(patient_email, subject, body_html, body_text)
