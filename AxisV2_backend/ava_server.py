"""
Ava Server — FastAPI server for Ava AI Voice Assistant (Retell AI Edition)
Run with: uvicorn ava_server:app --reload --host 0.0.0.0 --port 8002

Architecture:
  Twilio (phone infrastructure) → SIP Trunk → Retell AI (orchestration brain)
  → ElevenLabs (voice synthesis) → Your backend (webhooks below)

Endpoints:
  GET  /                                  — Health check
  GET  /health                            — Detailed health check
  POST /api/retell/inbound                — Inbound call webhook (returns dynamic variables)
  POST /api/retell/webhook                — Retell call lifecycle events
  POST /api/retell/tools/submit-waitlist  — Custom tool: submit waitlist data
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
app = FastAPI(title="Ava AI Server (Retell)", version="2.0.0")

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
        "service": "Ava AI Server (Retell Edition)",
        "status": "running",
        "architecture": {
            "orchestration": "Retell AI",
            "voice": "ElevenLabs (via Retell)",
            "telephony": "Twilio (SIP Trunk → Retell)",
        },
        "endpoints": {
            "inbound_webhook": "/api/retell/inbound",
            "call_webhook": "/api/retell/webhook",
            "submit_waitlist_tool": "/api/retell/tools/submit-waitlist",
        },
    }


@app.get("/health")
async def health():
    has_retell = bool(os.getenv("RETELL_API_KEY"))
    has_twilio_sid = bool(os.getenv("TWILIO_ACCOUNT_SID"))
    has_twilio_token = bool(os.getenv("TWILIO_AUTH_TOKEN"))
    has_google_sheets = bool(os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID"))
    has_smtp = bool(os.getenv("SMTP_EMAIL") and os.getenv("SMTP_PASSWORD"))

    return {
        "status": "healthy",
        "retell_configured": has_retell,
        "twilio_configured": has_twilio_sid and has_twilio_token,
        "google_sheets_configured": has_google_sheets,
        "smtp_configured": has_smtp,
    }


# ── Retell: Inbound Call Webhook ─────────────
@app.post("/api/retell/inbound")
async def retell_inbound(request: Request):
    """
    Retell calls this when an inbound call arrives on the imported Twilio number.
    Returns dynamic variables injected into the prompt template per-call:
    - current_date, current_time
    - available_slots (generated time options)
    - booked_slots_info (already-taken times)
    - caller_phone
    """
    from app.ava.voice_handler import handle_inbound_webhook
    return await handle_inbound_webhook(request)


# ── Retell: Call Lifecycle Webhook ───────────
@app.post("/api/retell/webhook")
async def retell_webhook(request: Request):
    """
    Retell posts call lifecycle events here:
    - call_started: when a call begins
    - call_ended: when a call completes (includes transcript)
    - call_analyzed: post-call analysis with extracted data

    Used for logging, analytics, and partial data recovery
    when callers drop before completing the flow.
    """
    from app.ava.voice_handler import handle_retell_webhook
    return await handle_retell_webhook(request)


# ── Retell: Custom Tool — Submit Waitlist ────
@app.post("/api/retell/tools/submit-waitlist")
async def retell_submit_waitlist(request: Request):
    """
    Custom tool endpoint called by Retell's LLM when Ava has collected
    all required data (name, email, role, clinic, preferred time).

    Writes to Google Sheets and sends confirmation email.
    Returns result to Retell which the LLM uses for its response.
    """
    from app.ava.voice_handler import handle_submit_waitlist_tool
    return await handle_submit_waitlist_tool(request)


# ── Run ──────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ava_server:app", host="0.0.0.0", port=8002, reload=True)
