from typing import Optional, Dict, Any
from datetime import datetime
import logging
from app.config import settings

logger = logging.getLogger(__name__)

# Twilio client will be initialized lazily
_twilio_client = None


def get_twilio_client():
    """Get or create Twilio client"""
    global _twilio_client
    
    if _twilio_client is None:
        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
            logger.warning("Twilio credentials not configured")
            return None
        
        try:
            from twilio.rest import Client
            _twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        except ImportError:
            logger.error("Twilio package not installed. Run: pip install twilio")
            return None
        except Exception as e:
            logger.error(f"Failed to initialize Twilio client: {e}")
            return None
    
    return _twilio_client


def send_sms(
    to_number: str,
    message: str,
    from_number: Optional[str] = None
) -> Dict[str, Any]:
    """Send an SMS message via Twilio"""
    client = get_twilio_client()
    
    if not client:
        return {
            "success": False,
            "error": "Twilio not configured",
            "mock": True,
            "message_sid": f"MOCK_{datetime.now().timestamp()}"
        }
    
    try:
        from_number = from_number or settings.TWILIO_PHONE_NUMBER
        
        # Use messaging service if available
        if settings.TWILIO_MESSAGING_SERVICE_SID:
            message_obj = client.messages.create(
                messaging_service_sid=settings.TWILIO_MESSAGING_SERVICE_SID,
                to=to_number,
                body=message
            )
        else:
            message_obj = client.messages.create(
                from_=from_number,
                to=to_number,
                body=message
            )
        
        return {
            "success": True,
            "message_sid": message_obj.sid,
            "status": message_obj.status,
            "to": to_number
        }
    
    except Exception as e:
        logger.error(f"Failed to send SMS to {to_number}: {e}")
        return {
            "success": False,
            "error": str(e),
            "to": to_number
        }


def make_voice_call(
    to_number: str,
    twiml_url: Optional[str] = None,
    from_number: Optional[str] = None,
    status_callback: Optional[str] = None
) -> Dict[str, Any]:
    """Initiate a voice call via Twilio"""
    client = get_twilio_client()
    
    if not client:
        return {
            "success": False,
            "error": "Twilio not configured",
            "mock": True,
            "call_sid": f"MOCK_CALL_{datetime.now().timestamp()}"
        }
    
    try:
        from_number = from_number or settings.TWILIO_PHONE_NUMBER
        twiml_url = twiml_url or settings.TWILIO_VOICE_URL
        
        call_params = {
            "from_": from_number,
            "to": to_number,
            "url": twiml_url
        }
        
        if status_callback:
            call_params["status_callback"] = status_callback
            call_params["status_callback_event"] = ["initiated", "ringing", "answered", "completed"]
        
        call = client.calls.create(**call_params)
        
        return {
            "success": True,
            "call_sid": call.sid,
            "status": call.status,
            "to": to_number
        }
    
    except Exception as e:
        logger.error(f"Failed to make call to {to_number}: {e}")
        return {
            "success": False,
            "error": str(e),
            "to": to_number
        }


def get_call_status(call_sid: str) -> Dict[str, Any]:
    """Get the status of a call"""
    client = get_twilio_client()
    
    if not client:
        return {
            "success": False,
            "error": "Twilio not configured"
        }
    
    try:
        call = client.calls(call_sid).fetch()
        
        return {
            "success": True,
            "call_sid": call.sid,
            "status": call.status,
            "duration": call.duration,
            "direction": call.direction,
            "answered_by": call.answered_by,
            "start_time": call.start_time.isoformat() if call.start_time else None,
            "end_time": call.end_time.isoformat() if call.end_time else None
        }
    
    except Exception as e:
        logger.error(f"Failed to get call status for {call_sid}: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def send_appointment_confirmation_sms(
    patient_name: str,
    patient_phone: str,
    doctor_name: str,
    appointment_date: str,
    appointment_time: str,
    clinic_name: str = "the clinic"
) -> Dict[str, Any]:
    """Send appointment confirmation SMS"""
    message = f"""Hi {patient_name}! Your appointment with {doctor_name} is confirmed for {appointment_date} at {appointment_time}. 

Reply YES to confirm, or call us to reschedule.

- {clinic_name}"""
    
    return send_sms(patient_phone, message)


def send_appointment_reminder_sms(
    patient_name: str,
    patient_phone: str,
    doctor_name: str,
    appointment_date: str,
    appointment_time: str,
    hours_until: int = 24,
    clinic_name: str = "the clinic"
) -> Dict[str, Any]:
    """Send appointment reminder SMS"""
    message = f"""Reminder: Hi {patient_name}, you have an appointment with {doctor_name} tomorrow ({appointment_date}) at {appointment_time}.

Reply YES to confirm, or call us if you need to reschedule.

- {clinic_name}"""
    
    return send_sms(patient_phone, message)


def send_intake_reminder_sms(
    patient_name: str,
    patient_phone: str,
    intake_url: str,
    appointment_date: str,
    clinic_name: str = "the clinic"
) -> Dict[str, Any]:
    """Send intake form reminder SMS"""
    message = f"""Hi {patient_name}! Please complete your intake form before your upcoming appointment on {appointment_date}.

Complete it here: {intake_url}

- {clinic_name}"""
    
    return send_sms(patient_phone, message)


def send_cancellation_sms(
    patient_name: str,
    patient_phone: str,
    doctor_name: str,
    appointment_date: str,
    appointment_time: str,
    clinic_name: str = "the clinic"
) -> Dict[str, Any]:
    """Send appointment cancellation SMS"""
    message = f"""Hi {patient_name}, your appointment with {doctor_name} on {appointment_date} at {appointment_time} has been cancelled.

Please call us to reschedule.

- {clinic_name}"""
    
    return send_sms(patient_phone, message)


def generate_twiml_confirmation_script(
    patient_name: str,
    doctor_name: str,
    appointment_date: str,
    appointment_time: str
) -> str:
    """Generate TwiML for appointment confirmation call"""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">
        Hello {patient_name}. This is an automated call from your healthcare provider to confirm your appointment.
    </Say>
    <Pause length="1"/>
    <Say voice="alice">
        You have an appointment with {doctor_name} on {appointment_date} at {appointment_time}.
    </Say>
    <Pause length="1"/>
    <Gather numDigits="1" timeout="10" action="/api/voice/confirmation-response">
        <Say voice="alice">
            Press 1 to confirm this appointment.
            Press 2 if you need to reschedule.
            Press 3 to cancel this appointment.
        </Say>
    </Gather>
    <Say voice="alice">
        We didn't receive your response. Please call us back to confirm your appointment. Goodbye.
    </Say>
</Response>"""
