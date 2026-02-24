"""
Voice Handler — ElevenLabs Conversational AI + Twilio

Architecture:
  Twilio (phone) → POST /api/voice/inbound (our server)
  → ElevenLabs register-call API (returns TwiML to Twilio)
  → ElevenLabs takes over: Scribe v2 Realtime STT (~150ms) + GPT-4.1 LLM + Flash v2.5 TTS (~75ms)
  → Tool calls hit: POST /api/elevenlabs/tools/submit-waitlist
  → Post-call analysis hits: POST /api/elevenlabs/webhook

Endpoints handled:
  POST /api/voice/inbound                     — Twilio inbound call → returns TwiML
  POST /api/elevenlabs/tools/submit-waitlist  — ElevenLabs server tool call
  POST /api/elevenlabs/webhook                — Post-call transcript & analysis
"""

from __future__ import annotations

import os
import re
import json
import hmac
import hashlib
import logging

import httpx
from fastapi import Request, Response
from fastapi.responses import JSONResponse

from app.ava.prompts import get_dynamic_variables
from app.ava.waitlist_submit import submit_to_waitlist, get_booked_slots, save_transcript

logger = logging.getLogger("ava.voice")

ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

# Track which conversations have already had a successful submission to prevent duplicates
_successful_submissions: dict[str, str] = {}


def _verify_elevenlabs_signature(request: Request, body: bytes) -> bool:
    """
    Verify ElevenLabs webhook HMAC-SHA256 signature.
    Header format: 'elevenlabs-signature: t=<timestamp>,v0=<hex_sig>'
    Signed message: '<timestamp>.<raw_body>'
    """
    secret = os.getenv("ELEVENLABS_WEBHOOK_SECRET", "")
    if not secret:
        return True  # Skip verification if no secret configured

    signature_header = request.headers.get("elevenlabs-signature", "")
    if not signature_header:
        logger.warning("Missing ElevenLabs webhook signature header")
        return False

    try:
        parts = dict(p.split("=", 1) for p in signature_header.split(","))
        timestamp = parts.get("t", "")
        provided_sig = parts.get("v0", "")
        message = f"{timestamp}.{body.decode('utf-8')}"
        expected = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected, provided_sig)
    except Exception as e:
        logger.error(f"ElevenLabs signature verification error: {e}")
        return False


# ──────────────────────────────────────────────
# TWILIO INBOUND CALL WEBHOOK
# ──────────────────────────────────────────────
async def handle_twilio_voice_inbound(request: Request) -> Response:
    """
    Twilio calls this endpoint when an inbound call arrives on our number.

    Flow:
    1. Extract caller phone from Twilio's form POST
    2. Build dynamic variables (date/time/slots) for this call
    3. Register the call with ElevenLabs (which returns TwiML)
    4. Return TwiML to Twilio — ElevenLabs takes over the call
    """
    try:
        form = await request.form()
        caller_phone = form.get("From", "unknown")
        called_number = form.get("To", "")
        call_sid = form.get("CallSid", "")
    except Exception:
        caller_phone = "unknown"
        called_number = ""
        call_sid = ""

    logger.info(f"Inbound call: from={caller_phone}, to={called_number}, sid={call_sid}")

    agent_id = os.getenv("ELEVENLABS_AGENT_ID", "")
    api_key = os.getenv("ELEVENLABS_API_KEY", "")

    if not agent_id or not api_key:
        logger.error("ELEVENLABS_AGENT_ID or ELEVENLABS_API_KEY not set")
        twiml = "<Response><Say>We're experiencing technical difficulties. Please try again later.</Say></Response>"
        return Response(content=twiml, media_type="application/xml")

    try:
        booked_slots = get_booked_slots()
        logger.info(f"Loaded {len(booked_slots)} booked slots for call context")
    except Exception as e:
        logger.warning(f"Could not load booked slots: {e}")
        booked_slots = []

    dynamic_vars = get_dynamic_variables(
        caller_phone=caller_phone,
        booked_slots=booked_slots,
    )

    payload = {
        "agent_id": agent_id,
        "from_number": caller_phone,
        "to_number": called_number,
        "direction": "inbound",
        "conversation_initiation_client_data": {
            "dynamic_variables": dynamic_vars,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{ELEVENLABS_API_URL}/convai/twilio/register-call",
                json=payload,
                headers={
                    "xi-api-key": api_key,
                    "Content-Type": "application/json",
                },
            )
            resp.raise_for_status()
            twiml = resp.text
            logger.info(f"ElevenLabs registered call for {caller_phone}")
    except httpx.HTTPStatusError as e:
        logger.error(f"ElevenLabs register-call HTTP error {e.response.status_code}: {e.response.text}")
        twiml = "<Response><Say>We're having trouble connecting. Please try again shortly.</Say></Response>"
    except Exception as e:
        logger.error(f"ElevenLabs register-call failed: {e}")
        twiml = "<Response><Say>We're having trouble connecting. Please try again shortly.</Say></Response>"

    return Response(content=twiml, media_type="application/xml")


# ──────────────────────────────────────────────
# ELEVENLABS TOOL: submit_waitlist
# ──────────────────────────────────────────────
async def handle_submit_waitlist_tool(request: Request) -> JSONResponse:
    """
    ElevenLabs calls this endpoint when the LLM invokes the submit_waitlist tool.

    ElevenLabs POST body:
    {
      "tool_name": "submit_waitlist",
      "tool_call_id": "...",
      "parameters": { "fullName": "...", "email": "...", ... },
      "conversation_id": "...",
      "caller_id": "+1..."
    }

    Response must be:
    { "result": "<string message fed back to the LLM>" }
    """
    try:
        data = await request.json()
    except Exception as e:
        logger.error(f"Failed to parse submit_waitlist request: {e}")
        return JSONResponse(
            content={"result": "Error processing request. Please try again."},
            status_code=400,
        )

    params = data.get("parameters", data)
    conversation_id = data.get("conversation_id", "")
    caller_phone = data.get("caller_id", "")

    full_name = params.get("fullName", "")
    email = params.get("email", "")
    role = params.get("role", "")
    clinic_name = params.get("clinicName", "")
    preferred_time = params.get("preferredTime", "")
    best_phone = params.get("bestPhone", "")

    logger.info(
        f"submit_waitlist: name={full_name}, email={email}, "
        f"role={role}, clinic={clinic_name}, time={preferred_time}"
    )

    # Prevent duplicate submissions for the same conversation
    if conversation_id and conversation_id in _successful_submissions:
        prev_time = _successful_submissions[conversation_id]
        logger.info(f"Duplicate submit for conversation {conversation_id} (already booked: {prev_time})")
        return JSONResponse(content={
            "result": (
                f"This caller is already booked for {prev_time}. "
                "No need to submit again — just confirm and end the call."
            )
        })

    if not full_name or not email:
        return JSONResponse(content={
            "result": "Missing required fields. Ask the caller for their full name and email before submitting."
        })

    # Check for time conflicts with already-booked slots
    booked_slots = get_booked_slots()
    if preferred_time and _is_time_conflict(preferred_time, booked_slots):
        logger.warning(f"Time conflict: {preferred_time} is already booked")
        from app.ava.prompts import _get_available_slots
        available = _get_available_slots()
        return JSONResponse(content={
            "result": (
                f"TIME CONFLICT: '{preferred_time}' is already booked. "
                f"Do NOT retry this same time. Suggest one of these open slots instead:\n{available}\n"
                "Ask the caller which of these works for them, then call submit_waitlist with the NEW time."
            )
        })

    waitlist_data = {
        "fullName": full_name,
        "email": email,
        "role": role,
        "clinicName": clinic_name,
        "preferredTime": preferred_time,
        "bestPhone": best_phone,
    }

    success = await submit_to_waitlist(waitlist_data, phone=caller_phone)

    if success:
        if conversation_id:
            _successful_submissions[conversation_id] = preferred_time
        logger.info(f"Waitlist submission successful for {email}")
        return JSONResponse(content={
            "result": (
                "Waitlist submission successful. Tell the caller they're all set "
                "and the Axis founders will reach out to confirm their demo."
            )
        })
    else:
        logger.error(f"Waitlist submission failed for {email}")
        return JSONResponse(content={
            "result": "Submission had an issue but we captured the info. Reassure the caller the team will follow up."
        })


# ──────────────────────────────────────────────
# ELEVENLABS POST-CALL WEBHOOK
# ──────────────────────────────────────────────
async def handle_elevenlabs_webhook(request: Request) -> Response:
    """
    ElevenLabs post-call webhook — fires after call ends and analysis completes.

    Event types we handle:
    - post_call_transcription: Full transcript + analysis data
    - call_initiation_failure: Failed call attempt
    - post_call_audio: Raw audio blob (ignored)
    """
    body = await request.body()

    if os.getenv("VERIFY_ELEVENLABS_WEBHOOK", "false").lower() == "true":
        if not _verify_elevenlabs_signature(request, body):
            logger.warning("Invalid ElevenLabs webhook signature — rejecting")
            return Response(status_code=401)

    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        logger.error("Invalid JSON in ElevenLabs webhook body")
        return Response(status_code=400)

    event_type = data.get("type", data.get("event_type", ""))
    logger.info(f"ElevenLabs webhook: event_type={event_type}")

    if event_type == "post_call_transcription":
        await _handle_post_call_transcription(data)
    elif event_type == "call_initiation_failure":
        _handle_call_initiation_failure(data)
    elif event_type == "post_call_audio":
        pass  # Audio blob — not needed
    else:
        logger.info(f"Unhandled ElevenLabs webhook event: {event_type}")

    return Response(status_code=200)


async def _handle_post_call_transcription(data: dict):
    """Process transcript, save to Sheets, and attempt partial data recovery."""
    payload = data.get("data", data)
    conversation_id = payload.get("conversation_id", "unknown")
    metadata = payload.get("metadata", {})
    caller_phone = metadata.get("caller_id", metadata.get("from_number", "unknown"))

    analysis = payload.get("analysis", {})
    summary = analysis.get("transcript_summary", analysis.get("call_summary", ""))
    call_successful = analysis.get("call_successful", False)

    # ElevenLabs data_collection_results wraps values as {"value": ..., "rationale": ...}
    custom_data = analysis.get("data_collection_results", analysis.get("custom_analysis_data", {}))

    def _extract(field) -> str:
        if isinstance(field, dict):
            return str(field.get("value", ""))
        return str(field) if field else ""

    caller_name = _extract(custom_data.get("caller_name", ""))
    caller_email = _extract(custom_data.get("caller_email", ""))
    caller_role = _extract(custom_data.get("caller_role", ""))
    clinic_name = _extract(custom_data.get("clinic_name", ""))
    demo_booked_raw = _extract(custom_data.get("demo_booked", "false"))

    logger.info(
        f"Post-call: id={conversation_id}, successful={call_successful}, "
        f"demo_booked={demo_booked_raw}, caller={caller_phone}"
    )
    if summary:
        logger.info(f"Call summary: {summary}")

    # Save transcript to Google Sheets
    transcript_data = payload.get("transcript", [])
    if isinstance(transcript_data, list):
        transcript_text = "\n".join(
            f"{t.get('role', 'unknown').upper()}: {t.get('message', '')}"
            for t in transcript_data
        )
    else:
        transcript_text = str(transcript_data)

    if transcript_text and caller_phone and caller_phone != "unknown":
        logger.info(f"Saving transcript for {caller_phone} ({len(transcript_text)} chars)")
        try:
            save_transcript(caller_phone, transcript_text)
        except Exception as e:
            logger.error(f"Failed to save transcript: {e}")

    # Partial data recovery if demo was NOT booked but we have a name
    demo_booked = demo_booked_raw.lower() in ("true", "yes", "1")
    if not demo_booked and caller_name and caller_phone and caller_phone != "unknown":
        logger.info(f"Partial data recovery: name={caller_name}, phone={caller_phone}")
        partial_data = {
            "fullName": caller_name,
            "email": caller_email or "",
            "role": caller_role or "unknown",
            "clinicName": clinic_name or "not provided",
            "preferredTime": "call dropped - follow up needed",
            "bestPhone": "",
        }
        try:
            await submit_to_waitlist(partial_data, phone=caller_phone)
            logger.info(f"Partial data submitted for: {caller_name}")
        except Exception as e:
            logger.error(f"Failed to submit partial data: {e}")

    # Clean up submission tracking for this conversation
    _successful_submissions.pop(conversation_id, None)


def _handle_call_initiation_failure(data: dict):
    payload = data.get("data", data)
    logger.warning(
        f"Call initiation failure: agent={payload.get('agent_id')}, "
        f"reason={payload.get('failure_reason', 'unknown')}"
    )


# ──────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────
def _is_time_conflict(preferred_time: str, booked_slots: list[str]) -> bool:
    """Check if the preferred time conflicts with any already-booked slot."""
    if not preferred_time or not booked_slots:
        return False

    norm = preferred_time.lower().strip()
    for slot in booked_slots:
        slot_norm = slot.lower().strip()
        if norm == slot_norm:
            return True
        norm_nums = re.findall(r'\d+:\d+\s*[ap]m', norm)
        slot_nums = re.findall(r'\d+:\d+\s*[ap]m', slot_norm)
        if norm_nums and slot_nums and norm_nums[0] == slot_nums[0]:
            norm_dates = re.findall(
                r'(?:january|february|march|april|may|june|july|august|'
                r'september|october|november|december)\s+\d+',
                norm,
            )
            slot_dates = re.findall(
                r'(?:january|february|march|april|may|june|july|august|'
                r'september|october|november|december)\s+\d+',
                slot_norm,
            )
            if norm_dates and slot_dates and norm_dates[0] == slot_dates[0]:
                return True
    return False
