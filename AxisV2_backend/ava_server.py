"""
Ava Server — Separate FastAPI server for Ava AI Voice & Text
Run with: uvicorn ava_server:app --reload --host 0.0.0.0 --port 8002

Endpoints:
  GET  /                  — Health check
  POST /api/voice         — Twilio voice webhook (returns TwiML to start Media Stream)
  WS   /api/voice/ws      — WebSocket for Twilio Media Streams <-> OpenAI Realtime API
  POST /api/sms           — Twilio SMS webhook (returns TwiML with Ava's reply)
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
            "voice_websocket": "/api/voice/ws",
            "sms_webhook": "/api/sms",
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
    # Build the WebSocket URL from the request
    host = request.headers.get("x-forwarded-host", request.headers.get("host", "localhost:8002"))
    scheme = request.headers.get("x-forwarded-proto", "http")
    ws_scheme = "wss" if scheme == "https" else "ws"
    ws_url = f"{ws_scheme}://{host}/api/voice/ws"

    logger.info(f"Voice webhook hit. Media Stream URL: {ws_url}")

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Please hold for a moment while I connect you to Ava.</Say>
    <Connect>
        <Stream url="{ws_url}">
            <Parameter name="caller" value="{{{{From}}}}" />
        </Stream>
    </Connect>
</Response>"""

    return Response(content=twiml, media_type="application/xml")


# ── Voice: WebSocket (Twilio <-> OpenAI Realtime) ──
@app.websocket("/api/voice/ws")
async def voice_websocket(ws: WebSocket):
    """
    WebSocket endpoint for Twilio Media Streams.
    Bridges audio to/from OpenAI Realtime API.
    """
    from app.ava.voice_handler import handle_voice_websocket
    await handle_voice_websocket(ws)


# ── SMS: Twilio Webhook ─────────────────────
@app.post("/api/sms")
async def sms_webhook(request: Request):
    """
    Twilio hits this when someone texts the Ava number.
    Parses the message, gets Ava's reply from OpenAI, returns TwiML.
    """
    from app.ava.sms_handler import handle_incoming_sms, build_twiml_response

    # Twilio sends form-encoded data
    form = await request.form()
    from_number = form.get("From", "")
    body = form.get("Body", "").strip()

    logger.info(f"SMS received from {from_number}: {body}")

    if not body:
        twiml = build_twiml_response("Hi! This is Ava from Axis Health. How can I help you today?")
    else:
        ava_reply = await handle_incoming_sms(from_number, body)
        twiml = build_twiml_response(ava_reply)

    return Response(content=twiml, media_type="application/xml")


# ── Run ──────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ava_server:app", host="0.0.0.0", port=8002, reload=True)
