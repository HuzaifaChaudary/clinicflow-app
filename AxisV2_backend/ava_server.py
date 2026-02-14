"""
Ava Server — Separate FastAPI server for Ava AI Voice Assistant
Run with: uvicorn ava_server:app --reload --host 0.0.0.0 --port 8002

Endpoints:
  GET  /                       — Health check
  POST /api/voice              — Twilio voice webhook (returns TwiML to start Media Stream)
  POST /api/voice/fallback     — Twilio fallback if primary handler fails
  POST /api/voice/status       — Twilio call status change callback
  WS   /api/voice/ws           — WebSocket for Twilio Media Streams <-> OpenAI Realtime API
"""

import os
import logging
from fastapi import FastAPI, WebSocket, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from dotenv import load_dotenv

load_dotenv()

# ── Logging ──────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("ava_server")

# ── App ──────────────────────────────────────
app = FastAPI(title="Ava AI Server", version="1.0.0")

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
        "service": "Ava AI Server",
        "status": "running",
        "endpoints": {
            "voice_webhook": "/api/voice",
            "voice_fallback": "/api/voice/fallback",
            "voice_status": "/api/voice/status",
            "voice_websocket": "/api/voice/ws",
        },
    }


@app.get("/health")
async def health():
    has_openai = bool(os.getenv("OPENAI_API_KEY"))
    has_twilio_sid = bool(os.getenv("TWILIO_ACCOUNT_SID"))
    has_twilio_token = bool(os.getenv("TWILIO_AUTH_TOKEN"))
    return {
        "status": "healthy",
        "openai_configured": has_openai,
        "twilio_configured": has_twilio_sid and has_twilio_token,
    }


# ── Voice: TwiML Webhook ────────────────────
@app.post("/api/voice")
async def voice_webhook(request: Request):
    """
    Twilio hits this when someone calls. Returns TwiML that:
    1. Plays a brief greeting while the stream connects
    2. Opens a Media Stream WebSocket to our /api/voice/ws
    """
    # Parse Twilio form data to get caller number
    form = await request.form()
    caller = form.get("From", "unknown")

    # Build the WebSocket URL from the request
    host = request.headers.get("x-forwarded-host", request.headers.get("host", "localhost:8002"))
    scheme = request.headers.get("x-forwarded-proto", "http")
    ws_scheme = "wss" if scheme == "https" else "ws"
    ws_url = f"{ws_scheme}://{host}/api/voice/ws"

    logger.info(f"Voice webhook hit. Caller: {caller}, Media Stream URL: {ws_url}")

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Connect>
        <Stream url="{ws_url}">
            <Parameter name="caller" value="{caller}" />
        </Stream>
    </Connect>
</Response>"""

    return Response(content=twiml, media_type="application/xml")


# ── Voice: Fallback Handler ────────────────
@app.post("/api/voice/fallback")
async def voice_fallback(request: Request):
    """
    Twilio hits this if the primary voice handler fails.
    Returns a simple TwiML apology message.
    """
    form = await request.form()
    error_code = form.get("ErrorCode", "unknown")
    error_url = form.get("ErrorUrl", "")
    logger.error(f"Voice fallback triggered. ErrorCode={error_code}, ErrorUrl={error_url}")

    twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">We're sorry, Ava is temporarily unavailable. Please try again shortly.</Say>
    <Hangup/>
</Response>"""
    return Response(content=twiml, media_type="application/xml")


# ── Voice: Status Callback ─────────────────
@app.post("/api/voice/status")
async def voice_status(request: Request):
    """
    Twilio posts call status changes here (ringing, in-progress, completed, etc.).
    Used for logging/analytics.
    """
    form = await request.form()
    call_sid = form.get("CallSid", "")
    call_status = form.get("CallStatus", "")
    from_number = form.get("From", "")
    duration = form.get("CallDuration", "0")

    logger.info(f"Call status: {call_status} | SID={call_sid} | From={from_number} | Duration={duration}s")

    return Response(content="<Response/>", media_type="application/xml")


# ── Voice: WebSocket (Twilio <-> OpenAI Realtime) ──
@app.websocket("/api/voice/ws")
async def voice_websocket(ws: WebSocket):
    """
    WebSocket endpoint for Twilio Media Streams.
    Bridges audio to/from OpenAI Realtime API.
    """
    from app.ava.voice_handler import handle_voice_websocket
    await handle_voice_websocket(ws)


# ── Run ──────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ava_server:app", host="0.0.0.0", port=8002, reload=True)
