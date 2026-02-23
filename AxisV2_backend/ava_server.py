"""
Ava Server — FastAPI server for Ava AI Voice Assistant (ElevenLabs Edition)
Run with: uvicorn ava_server:app --reload --host 0.0.0.0 --port 8002

Architecture:
  Twilio (phone) → POST /api/voice/inbound (this server)
  → ElevenLabs register-call API (returns TwiML to Twilio)
  → ElevenLabs orchestrates: Scribe v2 Realtime STT + LLM + Flash v2.5 TTS
  → Tool calls hit this server: POST /api/elevenlabs/tools/submit-waitlist
  → Post-call webhook: POST /api/elevenlabs/webhook

Endpoints:
  GET  /                                        — Health check
  GET  /health                                  — Detailed health check
  POST /api/voice/inbound                       — Twilio inbound call → ElevenLabs TwiML
  POST /api/elevenlabs/tools/submit-waitlist    — Server tool: submit waitlist data
  POST /api/elevenlabs/webhook                  — Post-call transcript & analysis
  POST /api/sms                                 — Twilio SMS webhook (unchanged)
"""

import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# ── Logging ──────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("ava_server")

# ── App ──────────────────────────────────────
app = FastAPI(title="Ava AI Server (ElevenLabs)", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ───────────────────────────────────
@app.get("/")
async def root():
    return {
        "service": "Ava AI Server (ElevenLabs Edition)",
        "status": "running",
        "architecture": {
            "stt": "ElevenLabs Scribe v2 Realtime (~150ms)",
            "tts": "ElevenLabs Flash v2.5 (~75ms)",
            "orchestration": "ElevenLabs Conversational AI",
            "telephony": "Twilio → ElevenLabs register-call",
        },
        "endpoints": {
            "voice_inbound": "/api/voice/inbound",
            "voice_fallback": "/api/voice/fallback",
            "voice_status": "/api/voice/status",
            "tool_submit_waitlist": "/api/elevenlabs/tools/submit-waitlist",
            "post_call_webhook": "/api/elevenlabs/webhook",
            "sms": "/api/sms",
        },
    }


@app.get("/health")
async def health():
    has_elevenlabs_key = bool(os.getenv("ELEVENLABS_API_KEY"))
    has_elevenlabs_agent = bool(os.getenv("ELEVENLABS_AGENT_ID"))
    has_twilio_sid = bool(os.getenv("TWILIO_ACCOUNT_SID"))
    has_twilio_token = bool(os.getenv("TWILIO_AUTH_TOKEN"))
    has_google_sheets = bool(os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID"))
    has_smtp = bool(os.getenv("SMTP_EMAIL") and os.getenv("SMTP_PASSWORD"))

    return {
        "status": "healthy",
        "elevenlabs_configured": has_elevenlabs_key and has_elevenlabs_agent,
        "twilio_configured": has_twilio_sid and has_twilio_token,
        "google_sheets_configured": has_google_sheets,
        "smtp_configured": has_smtp,
    }


# ── Voice: Twilio Inbound → ElevenLabs ──────
@app.post("/api/voice/inbound")
async def voice_inbound(request: Request):
    """
    Twilio hits this when an inbound call arrives.
    We register the call with ElevenLabs and return TwiML.
    ElevenLabs takes over the call (STT + LLM + TTS).
    """
    from app.ava.voice_handler import handle_twilio_voice_inbound
    return await handle_twilio_voice_inbound(request)


@app.post("/api/voice/fallback")
async def voice_fallback(request: Request):
    """
    Twilio calls this when the primary voice webhook fails.
    Returns TwiML to play a short message and hang up.
    """
    from fastapi.responses import Response
    twiml = (
        "<Response>"
        "<Say>We're sorry, we couldn't connect you right now. Please try again in a moment.</Say>"
        "<Hangup/>"
        "</Response>"
    )
    return Response(content=twiml, media_type="application/xml")


@app.post("/api/voice/status")
async def voice_status(request: Request):
    """
    Twilio status callback — called when call status changes.
    Return 200 so Twilio doesn't retry.
    """
    return {}


# ── ElevenLabs: Server Tool — Submit Waitlist
@app.post("/api/elevenlabs/tools/submit-waitlist")
async def elevenlabs_submit_waitlist(request: Request):
    """
    ElevenLabs calls this when the LLM invokes the submit_waitlist tool.
    Writes to Google Sheets and sends confirmation email.
    Returns result string that the LLM uses for its response.
    """
    from app.ava.voice_handler import handle_submit_waitlist_tool
    return await handle_submit_waitlist_tool(request)


# ── ElevenLabs: Post-Call Webhook ────────────
@app.post("/api/elevenlabs/webhook")
async def elevenlabs_webhook(request: Request):
    """
    ElevenLabs post-call webhook — transcript, analysis, and call events.
    Used for logging, transcript storage, and partial data recovery.
    """
    from app.ava.voice_handler import handle_elevenlabs_webhook
    return await handle_elevenlabs_webhook(request)


# ── SMS (unchanged — still Twilio + OpenAI) ──
@app.post("/api/sms")
async def sms_webhook(request: Request):
    """
    Twilio SMS webhook — uses OpenAI for text-based conversations.
    """
    from app.ava.sms_handler import handle_incoming_sms, build_twiml_response
    from fastapi.responses import Response

    form = await request.form()
    from_number = form.get("From", "")
    body = form.get("Body", "")

    ava_reply = await handle_incoming_sms(from_number, body)
    twiml = build_twiml_response(ava_reply)
    return Response(content=twiml, media_type="application/xml")


# ── Run ──────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ava_server:app", host="0.0.0.0", port=8002, reload=True)
