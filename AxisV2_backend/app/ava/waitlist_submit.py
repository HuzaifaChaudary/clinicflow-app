"""
Waitlist Submission Helper
Posts collected intake data to the existing /api/waitlist endpoint on the main backend.
After successful submission, sends a follow-up SMS via Twilio with a Calendly booking link.
Used by both voice and SMS handlers after Ava collects all 9 questions.
"""

import os
import logging
import httpx
from twilio.rest import Client as TwilioClient

logger = logging.getLogger("ava.waitlist")

# Default: main backend on port 8000. Override via env var if deployed elsewhere.
WAITLIST_API_URL = os.getenv("WAITLIST_API_URL", "http://localhost:8000/api/waitlist")

# Calendly booking link
CALENDLY_URL = os.getenv("CALENDLY_URL", "https://calendly.com/axis-founders/15min")


def _get_twilio_client():
    """Get Twilio client. Returns None if not configured."""
    sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    token = os.getenv("TWILIO_AUTH_TOKEN", "")
    if sid and token:
        return TwilioClient(sid, token)
    return None


def _get_twilio_sms_number() -> str:
    """Get the Twilio number used for outbound SMS."""
    return os.getenv("TWILIO_SMS_NUMBER", "")


async def send_calendly_sms(phone: str, full_name: str = ""):
    """
    Send a follow-up SMS with Calendly link after intake is complete.

    Args:
        phone: Recipient phone number (E.164 format)
        full_name: User's name for personalization
    """
    if not phone:
        logger.warning("No phone number provided, skipping Calendly SMS")
        return

    twilio_client = _get_twilio_client()
    from_number = _get_twilio_sms_number()

    if not twilio_client or not from_number:
        logger.warning("Twilio not configured, skipping Calendly SMS")
        return

    first_name = full_name.split()[0] if full_name else "there"

    sms_body = (
        f"Hi {first_name}! This is Axis Health.\n\n"
        f"Thanks for sharing your clinic details with Ava. "
        f"As an early adopter, you'll get 3 months free access to the Axis dashboard.\n\n"
        f"Book your walkthrough here — our team will show you how the dashboard solves your specific pain points:\n"
        f"{CALENDLY_URL}\n\n"
        f"Talk soon!"
    )

    try:
        twilio_client.messages.create(
            body=sms_body,
            from_=from_number,
            to=phone,
        )
        logger.info(f"Calendly SMS sent to {phone}")
    except Exception as e:
        logger.error(f"Failed to send Calendly SMS to {phone}: {e}", exc_info=True)


async def submit_to_waitlist(data: dict, phone: str = "") -> bool:
    """
    Submit intake data to the waitlist API, then send a follow-up SMS with Calendly link.

    Args:
        data: Dict with keys matching the waitlist API schema:
              fullName, role, clinicName, email, clinicType, otherClinicType,
              numberOfDoctors, numberOfLocations, painPoints, currentSetup
        phone: Caller's phone number (from Twilio)

    Returns:
        True if submission succeeded, False otherwise.
    """
    # Map the data to the waitlist API's expected format
    payload = {
        "fullName": data.get("fullName", ""),
        "email": data.get("email", ""),
        "phone": phone,
        "role": data.get("role", ""),
        "ownerEmail": data.get("email", ""),
        "clinicName": data.get("clinicName", ""),
        "clinicType": data.get("clinicType", ""),
        "otherClinicType": data.get("otherClinicType", ""),
        "clinicSize": "",
        "numberOfDoctors": data.get("numberOfDoctors", ""),
        "numberOfLocations": data.get("numberOfLocations", ""),
        "doctorEmails": "",
        "locationAddresses": "",
        "painPoints": data.get("painPoints", []),
        "currentSetup": data.get("currentSetup", ""),
        "impactLevel": "",
        "willingnessToPay": "",
        "priceRange": "",
        "solutionWins": [],
        "otherWish": "",
    }

    logger.info(f"Submitting waitlist data for {payload['fullName']} ({payload['email']})")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(WAITLIST_API_URL, json=payload)
            result = resp.json()

            if result.get("success"):
                logger.info(f"Waitlist submission successful for {payload['email']}")

                # Send follow-up SMS with Calendly link
                await send_calendly_sms(phone, data.get("fullName", ""))

                return True
            else:
                logger.error(f"Waitlist submission failed: {result.get('message', 'unknown error')}")
                return False

    except Exception as e:
        logger.error(f"Error submitting to waitlist API: {e}", exc_info=True)
        return False
