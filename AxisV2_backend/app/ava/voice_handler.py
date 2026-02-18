"""
Voice Handler — Retell AI Webhooks & Custom Tool Handlers

Replaces the old Twilio Media Streams <-> OpenAI Realtime API bridge.
Now Retell manages all orchestration (STT, LLM, TTS, turn-taking, interruptions).

Endpoints handled:
  POST /api/retell/inbound      — Inbound call webhook (returns dynamic variables)
  POST /api/retell/webhook      — Call lifecycle events (started, ended, analyzed)
  POST /api/retell/tools/submit-waitlist — Custom tool for data submission
"""

from __future__ import annotations

import os
import json
import logging
from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import Request, Response
from fastapi.responses import JSONResponse

from app.ava.prompts import get_dynamic_variables
from app.ava.waitlist_submit import submit_to_waitlist, get_booked_slots, save_transcript

logger = logging.getLogger("ava.voice")


def _verify_retell_signature(request: Request, body: bytes) -> bool:
    """
    Verify the Retell webhook signature using the API key.
    Returns True if valid, False otherwise.
    """
    api_key = os.getenv("RETELL_API_KEY", "")
    signature = request.headers.get("x-retell-signature", "")

    if not api_key or not signature:
        logger.warning("Missing API key or signature for webhook verification")
        return False

    try:
        from retell import Retell
        return Retell.verify(
            body.decode("utf-8"),
            api_key=api_key,
            signature=signature,
        )
    except ImportError:
        logger.warning("retell-sdk not installed, skipping signature verification")
        return True
    except Exception as e:
        logger.error(f"Signature verification failed: {e}")
        return False


# ──────────────────────────────────────────────
# INBOUND CALL WEBHOOK
# ──────────────────────────────────────────────
async def handle_inbound_webhook(request: Request) -> JSONResponse:
    """
    Called by Retell when an inbound call arrives on the imported Twilio number.
    Returns dynamic variables that get injected into the prompt template.

    This is where we inject:
    - Current date/time
    - Available time slots
    - Already-booked time slots
    - Caller's phone number
    """
    try:
        data = await request.json()
    except Exception:
        data = {}

    caller_phone = data.get("from_number", "unknown")
    logger.info(f"Inbound call webhook: caller={caller_phone}")

    # Build dynamic variables FAST — no blocking API calls here.
    # Booked slots are fetched later when the submit_waitlist tool is called,
    # not on every inbound call. This keeps the webhook response instant
    # so Retell connects the call and plays the greeting immediately.
    dynamic_vars = get_dynamic_variables(
        caller_phone=caller_phone,
        booked_slots=None,
    )

    logger.info(f"Dynamic variables set: {list(dynamic_vars.keys())}")

    return JSONResponse(
        content={"dynamic_variables": dynamic_vars},
        status_code=200,
    )


# ──────────────────────────────────────────────
# CUSTOM TOOL: submit_waitlist
# ──────────────────────────────────────────────
async def handle_submit_waitlist_tool(request: Request) -> JSONResponse:
    """
    Custom tool endpoint called by Retell when the LLM invokes submit_waitlist.
    Receives the collected data and writes to Google Sheets + sends email.

    Retell sends POST with JSON body containing the tool arguments.
    """
    try:
        data = await request.json()
    except Exception as e:
        logger.error(f"Failed to parse submit_waitlist request: {e}")
        return JSONResponse(
            content={"success": False, "error": "Invalid request format"},
            status_code=400,
        )

    # Extract arguments — Retell may nest under "args" or send at root
    args = data.get("args", data)

    full_name = args.get("fullName", "")
    email = args.get("email", "")
    role = args.get("role", "")
    clinic_name = args.get("clinicName", "")
    preferred_time = args.get("preferredTime", "")
    best_phone = args.get("bestPhone", "")

    logger.info(
        f"submit_waitlist tool called: name={full_name}, email={email}, "
        f"role={role}, clinic={clinic_name}, time={preferred_time}"
    )

    if not full_name or not email:
        return JSONResponse(
            content={
                "success": False,
                "message": "Missing required fields. Ask the caller for their full name and email before submitting.",
            },
            status_code=200,
        )

    # Check for time conflicts with booked slots
    booked_slots = get_booked_slots()
    if preferred_time and _is_time_conflict(preferred_time, booked_slots):
        logger.warning(f"Time conflict detected: {preferred_time} is already booked")
        return JSONResponse(
            content={
                "success": False,
                "message": (
                    f"The time '{preferred_time}' is already booked. "
                    "Ask the caller to pick a different time."
                ),
            },
            status_code=200,
        )

    # Submit to Google Sheets + send confirmation email
    waitlist_data = {
        "fullName": full_name,
        "email": email,
        "role": role,
        "clinicName": clinic_name,
        "preferredTime": preferred_time,
        "bestPhone": best_phone,
    }

    success = await submit_to_waitlist(waitlist_data, phone=best_phone)

    if success:
        logger.info(f"Waitlist submission successful for {email}")
        return JSONResponse(
            content={
                "success": True,
                "message": (
                    "Waitlist submission successful. Tell the caller they're all set "
                    "and the Axis founders will reach out to confirm their demo."
                ),
            },
            status_code=200,
        )
    else:
        logger.error(f"Waitlist submission failed for {email}")
        return JSONResponse(
            content={
                "success": False,
                "message": "Submission had an issue but we captured the info. Reassure the caller that the team will follow up.",
            },
            status_code=200,
        )


# ──────────────────────────────────────────────
# RETELL WEBHOOK — Call Lifecycle Events
# ──────────────────────────────────────────────
async def handle_retell_webhook(request: Request) -> Response:
    """
    Receives Retell webhook events for call lifecycle.

    Events:
    - call_started: Log the call
    - call_ended: Log duration, check for partial data recovery
    - call_analyzed: Post-call analysis with extracted data
    """
    body = await request.body()

    # Verify webhook signature in production
    if os.getenv("VERIFY_RETELL_WEBHOOK", "false").lower() == "true":
        if not _verify_retell_signature(request, body):
            logger.warning("Invalid webhook signature — rejecting")
            return Response(status_code=401)

    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        logger.error("Invalid JSON in webhook request")
        return Response(status_code=400)

    event = data.get("event", "")

    if event == "call_started":
        _handle_call_started(data)
    elif event == "call_ended":
        await _handle_call_ended(data)
    elif event == "call_analyzed":
        await _handle_call_analyzed(data)
    else:
        logger.info(f"Unhandled webhook event: {event}")

    return Response(status_code=204)


def _handle_call_started(data: dict):
    """Log when a call starts."""
    call = data.get("call", data.get("data", {}))
    call_id = call.get("call_id", "unknown")
    from_number = call.get("from_number", "unknown")
    agent_id = call.get("agent_id", "unknown")

    logger.info(
        f"Call started: id={call_id}, from={from_number}, agent={agent_id}"
    )


async def _handle_call_ended(data: dict):
    """
    Log when a call ends. If the call was short or dropped,
    attempt partial data recovery from the transcript.
    """
    call = data.get("call", data.get("data", {}))
    call_id = call.get("call_id", "unknown")
    from_number = call.get("from_number", "unknown")
    duration_ms = call.get("call_duration_ms", 0)
    end_reason = call.get("disconnection_reason", "unknown")
    call_status = call.get("call_status", "unknown")

    duration_s = duration_ms / 1000 if duration_ms else 0

    logger.info(
        f"Call ended: id={call_id}, from={from_number}, "
        f"duration={duration_s:.1f}s, reason={end_reason}, status={call_status}"
    )

    # Save transcript to Google Sheets
    transcript = call.get("transcript", "")
    if transcript and from_number and from_number != "unknown":
        logger.info(f"Saving transcript for call {call_id} ({len(transcript)} chars)")
        try:
            save_transcript(from_number, transcript)
        except Exception as e:
            logger.error(f"Failed to save transcript: {e}")
    elif transcript:
        logger.info(f"Call transcript (id={call_id}): {transcript[:500]}...")


async def _handle_call_analyzed(data: dict):
    """
    Handle post-call analysis results.
    If a demo was NOT booked but we have partial data (name + phone),
    submit for follow-up.
    """
    call = data.get("call", data.get("data", {}))
    call_id = call.get("call_id", "unknown")
    from_number = call.get("from_number", "unknown")

    analysis = call.get("call_analysis", {})
    custom_data = analysis.get("custom_analysis_data", {})

    caller_name = custom_data.get("caller_name", "")
    caller_email = custom_data.get("caller_email", "")
    caller_role = custom_data.get("caller_role", "")
    clinic_name = custom_data.get("clinic_name", "")
    demo_booked = custom_data.get("demo_booked", False)
    call_outcome = custom_data.get("call_outcome", "")

    summary = analysis.get("call_summary", "")
    successful = analysis.get("call_successful", False)

    logger.info(
        f"Call analyzed: id={call_id}, outcome={call_outcome}, "
        f"demo_booked={demo_booked}, successful={successful}"
    )
    if summary:
        logger.info(f"Call summary: {summary}")

    # If demo was NOT booked and we have at least a name,
    # submit partial data for follow-up
    if not demo_booked and caller_name and from_number:
        logger.info(
            f"Partial data recovery for call {call_id}: "
            f"name={caller_name}, phone={from_number}"
        )
        partial_data = {
            "fullName": caller_name,
            "email": caller_email or "",
            "role": caller_role or "unknown",
            "clinicName": clinic_name or "not provided",
            "preferredTime": f"call dropped - {call_outcome or 'follow up needed'}",
            "bestPhone": "",
        }
        try:
            await submit_to_waitlist(partial_data, phone=from_number)
            logger.info(f"Partial data submitted for follow-up: {caller_name}")
        except Exception as e:
            logger.error(f"Failed to submit partial data: {e}")


# ──────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────
def _is_time_conflict(preferred_time: str, booked_slots: list[str]) -> bool:
    """Check if the preferred time conflicts with any already-booked slot."""
    if not preferred_time or not booked_slots:
        return False

    import re

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
