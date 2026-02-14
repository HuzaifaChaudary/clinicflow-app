"""
Voice Handler — Twilio Media Streams <-> OpenAI Realtime API
Bridges inbound Twilio calls to OpenAI's Realtime API for ultra-fast (~170ms) voice responses.

Flow:
1. Twilio receives call -> hits /api/voice -> returns TwiML with <Connect><Stream>
2. Twilio opens WebSocket to /api/voice/ws
3. This handler opens a parallel WebSocket to OpenAI Realtime API
4. Audio is bridged bidirectionally: Twilio (g711_ulaw) <-> OpenAI Realtime (g711_ulaw)
5. When Ava collects all intake answers, she calls submit_waitlist function -> Google Sheets
"""

import os
import json
import asyncio
import logging
import websockets
from fastapi import WebSocket, WebSocketDisconnect

from app.ava.prompts import VOICE_SYSTEM_PROMPT, SUBMIT_WAITLIST_TOOL_REALTIME
from app.ava.waitlist_submit import submit_to_waitlist

logger = logging.getLogger("ava.voice")

OPENAI_REALTIME_URL = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17"


class _SessionState:
    """Mutable state shared between the two async tasks."""
    def __init__(self):
        self.stream_sid: str = ""
        self.caller_phone: str = ""


async def handle_voice_websocket(ws: WebSocket, caller_phone: str = ""):
    """
    Main WebSocket handler. Called when Twilio opens a Media Stream connection.
    Bridges audio between Twilio and OpenAI Realtime API.
    """
    await ws.accept()
    logger.info("Twilio Media Stream connected")

    openai_api_key = os.getenv("OPENAI_API_KEY", "")
    if not openai_api_key:
        logger.error("OPENAI_API_KEY not set")
        await ws.close(code=1011, reason="Server misconfigured")
        return

    state = _SessionState()
    state.caller_phone = caller_phone
    openai_ws = None

    try:
        # Connect to OpenAI Realtime API
        openai_ws = await websockets.connect(
            OPENAI_REALTIME_URL,
            extra_headers={
                "Authorization": f"Bearer {openai_api_key}",
                "OpenAI-Beta": "realtime=v1",
            },
            ping_interval=20,
            ping_timeout=20,
        )
        logger.info("Connected to OpenAI Realtime API")

        # Configure session: g711_ulaw audio, voice, system prompt, and tools
        session_config = {
            "type": "session.update",
            "session": {
                "modalities": ["text", "audio"],
                "instructions": VOICE_SYSTEM_PROMPT,
                "voice": "alloy",
                "input_audio_format": "g711_ulaw",
                "output_audio_format": "g711_ulaw",
                "input_audio_transcription": {
                    "model": "whisper-1",
                },
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "prefix_padding_ms": 300,
                    "silence_duration_ms": 500,
                },
                "temperature": 0.7,
                "max_response_output_tokens": 512,
                "tools": [SUBMIT_WAITLIST_TOOL_REALTIME],
                "tool_choice": "auto",
            },
        }
        await openai_ws.send(json.dumps(session_config))
        logger.info("OpenAI session configured with submit_waitlist tool")

        # Wait for session.updated before triggering initial greeting
        while True:
            init_msg = await openai_ws.recv()
            init_data = json.loads(init_msg)
            init_type = init_data.get("type", "")
            logger.info(f"OpenAI init event: {init_type}")
            if init_type == "session.updated":
                break
            if init_type == "error":
                logger.error(f"OpenAI session error: {init_data}")
                await ws.close(code=1011, reason="OpenAI session error")
                return

        # Trigger Ava's initial greeting
        await openai_ws.send(json.dumps({"type": "response.create"}))
        logger.info("Triggered initial Ava greeting via response.create")

        # Run both directions concurrently
        await asyncio.gather(
            _twilio_to_openai(ws, openai_ws, state),
            _openai_to_twilio(ws, openai_ws, state),
        )

    except WebSocketDisconnect:
        logger.info("Twilio Media Stream disconnected")
    except websockets.exceptions.ConnectionClosed as e:
        logger.warning(f"OpenAI WebSocket closed: {e}")
    except Exception as e:
        logger.error(f"Voice handler error: {e}", exc_info=True)
    finally:
        if openai_ws and not openai_ws.closed:
            await openai_ws.close()
            logger.info("OpenAI WebSocket closed")
        try:
            await ws.close()
        except Exception:
            pass


async def _twilio_to_openai(twilio_ws: WebSocket, openai_ws, state: _SessionState):
    """
    Receives audio from Twilio Media Stream and forwards to OpenAI Realtime API.
    Twilio sends JSON messages with base64-encoded g711_ulaw audio chunks.
    """
    try:
        while True:
            message = await twilio_ws.receive_text()
            data = json.loads(message)
            event_type = data.get("event")

            if event_type == "start":
                state.stream_sid = data["start"]["streamSid"]
                # Try to capture caller phone from custom parameters
                params = data["start"].get("customParameters", {})
                if params.get("caller"):
                    state.caller_phone = params["caller"]
                logger.info(f"Twilio stream started: {state.stream_sid}, caller: {state.caller_phone}")

            elif event_type == "media":
                # Forward audio to OpenAI Realtime API
                audio_payload = data["media"]["payload"]  # base64 g711_ulaw
                audio_event = {
                    "type": "input_audio_buffer.append",
                    "audio": audio_payload,
                }
                if not openai_ws.closed:
                    await openai_ws.send(json.dumps(audio_event))

            elif event_type == "stop":
                logger.info("Twilio stream stopped")
                break

    except WebSocketDisconnect:
        logger.info("Twilio disconnected in twilio_to_openai")
    except Exception as e:
        logger.error(f"Error in twilio_to_openai: {e}", exc_info=True)


async def _openai_to_twilio(twilio_ws: WebSocket, openai_ws, state: _SessionState):
    """
    Receives audio and events from OpenAI Realtime API and forwards audio to Twilio.
    Also handles function calls (submit_waitlist) and sends results back to OpenAI.
    """
    try:
        async for message in openai_ws:
            data = json.loads(message)
            event_type = data.get("type", "")

            if event_type == "session.created":
                logger.info("OpenAI Realtime session created")

            elif event_type == "session.updated":
                logger.info("OpenAI Realtime session updated")

            elif event_type == "response.created":
                logger.info("OpenAI response started generating")

            elif event_type == "response.done":
                logger.info("OpenAI response complete")

            elif event_type == "response.audio.delta":
                # Forward audio chunk to Twilio
                audio_delta = data.get("delta", "")
                if audio_delta:
                    twilio_message = {
                        "event": "media",
                        "streamSid": state.stream_sid,
                        "media": {
                            "payload": audio_delta,
                        },
                    }
                    try:
                        await twilio_ws.send_json(twilio_message)
                    except Exception:
                        break

            elif event_type == "response.audio.done":
                logger.debug("OpenAI audio response complete")

            elif event_type == "response.audio_transcript.done":
                transcript = data.get("transcript", "")
                logger.info(f"Ava said: {transcript}")

            elif event_type == "input_audio_buffer.speech_started":
                logger.debug("Caller started speaking")
                # Send clear message to Twilio to stop current playback (barge-in)
                clear_message = {
                    "event": "clear",
                    "streamSid": state.stream_sid,
                }
                try:
                    await twilio_ws.send_json(clear_message)
                except Exception:
                    pass

            elif event_type == "conversation.item.input_audio_transcription.completed":
                transcript = data.get("transcript", "")
                logger.info(f"Caller said: {transcript}")

            elif event_type == "response.function_call_arguments.done":
                # OpenAI wants to call submit_waitlist
                call_id = data.get("call_id", "")
                fn_name = data.get("name", "")
                fn_args_str = data.get("arguments", "{}")

                logger.info(f"Function call: {fn_name} (call_id={call_id})")

                if fn_name == "submit_waitlist":
                    await _handle_submit_waitlist(
                        openai_ws, call_id, fn_args_str, state.caller_phone
                    )
                else:
                    # Unknown function — return error
                    await _send_function_result(
                        openai_ws, call_id,
                        json.dumps({"success": False, "error": f"Unknown function: {fn_name}"})
                    )

            elif event_type == "error":
                error_info = data.get("error", {})
                logger.error(f"OpenAI Realtime error: {error_info}")

    except websockets.exceptions.ConnectionClosed:
        logger.info("OpenAI WebSocket closed in openai_to_twilio")
    except Exception as e:
        logger.error(f"Error in openai_to_twilio: {e}", exc_info=True)


async def _handle_submit_waitlist(openai_ws, call_id: str, args_str: str, phone: str):
    """Handle the submit_waitlist function call from OpenAI."""
    try:
        args = json.loads(args_str)
        logger.info(f"Submitting waitlist: {args.get('fullName')} / {args.get('email')}")

        success = await submit_to_waitlist(args, phone=phone)

        if success:
            result = {"success": True, "message": "Waitlist submission successful. Tell the caller they're all set."}
        else:
            result = {"success": False, "message": "Submission had an issue but we captured the info. Reassure the caller."}

        await _send_function_result(openai_ws, call_id, json.dumps(result))

    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in function args: {e}")
        await _send_function_result(
            openai_ws, call_id,
            json.dumps({"success": False, "error": "Invalid data format"})
        )
    except Exception as e:
        logger.error(f"Error handling submit_waitlist: {e}", exc_info=True)
        await _send_function_result(
            openai_ws, call_id,
            json.dumps({"success": False, "error": str(e)})
        )


async def _send_function_result(openai_ws, call_id: str, output: str):
    """Send function call result back to OpenAI Realtime API and trigger a response."""
    # Send the function output
    result_event = {
        "type": "conversation.item.create",
        "item": {
            "type": "function_call_output",
            "call_id": call_id,
            "output": output,
        },
    }
    await openai_ws.send(json.dumps(result_event))

    # Ask OpenAI to generate a response based on the function result
    response_event = {
        "type": "response.create",
    }
    await openai_ws.send(json.dumps(response_event))
