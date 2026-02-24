#!/usr/bin/env python3
"""
Configure the existing ElevenLabs Conversational AI agent (Ava) via API.

- Fetches voices and existing agent from ElevenLabs
- Updates the agent with: system prompt, Flash v2.5 TTS, Scribe Realtime STT,
  submit_waitlist webhook tool, first message
- Writes ELEVENLABS_AGENT_ID and ELEVENLABS_VOICE_ID to .env

Run from AxisV2_backend: python scripts/setup_elevenlabs_agent.py
Requires: ELEVENLABS_API_KEY in .env
"""

import os
import sys
import json

# Add parent so we can import app.ava.prompts
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load .env manually if dotenv not available
_env_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_env_path = os.path.join(_env_dir, ".env")
if os.path.exists(_env_path):
    with open(_env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

import httpx

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: Set ELEVENLABS_API_KEY in .env")
    sys.exit(1)

BASE = "https://api.elevenlabs.io/v1"
HEADERS = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
WEBHOOK_BASE = "https://ava.useaxis.app"

# Voice: Jessica - Playful, Bright, Warm (female, conversational, American)
DEFAULT_VOICE_ID = "cgSgspJ2msm6clMCkdW9"


def get_system_prompt() -> str:
    from app.ava.prompts import build_elevenlabs_system_prompt
    return build_elevenlabs_system_prompt()


def get_first_message() -> str:
    from app.ava.prompts import BEGIN_MESSAGE
    return BEGIN_MESSAGE


def list_agents():
    r = httpx.get(f"{BASE}/convai/agents", headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json()


def get_agent(agent_id: str):
    r = httpx.get(f"{BASE}/convai/agents/{agent_id}", headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json()


def update_agent(agent_id: str, conversation_config: dict, platform_settings: dict = None):
    body = {"conversation_config": conversation_config}
    if platform_settings:
        body["platform_settings"] = platform_settings
    r = httpx.patch(
        f"{BASE}/convai/agents/{agent_id}",
        headers=HEADERS,
        json=body,
        timeout=30,
    )
    r.raise_for_status()
    return r.json()


SUBMIT_WAITLIST_TOOL_ID = os.getenv("ELEVENLABS_SUBMIT_TOOL_ID", "tool_8901kj60yj79f9rvbe81z86bmw8k")


def ensure_submit_waitlist_tool() -> str:
    """Create or find the submit_waitlist webhook tool. Returns tool_id."""
    r = httpx.get(f"{BASE}/convai/tools", headers=HEADERS, timeout=15)
    r.raise_for_status()
    for tool in r.json().get("tools", []):
        cfg = tool.get("tool_config", {})
        if cfg.get("name") == "submit_waitlist":
            return tool["id"]

    body = {
        "name": "submit_waitlist",
        "description": "Submit caller details to book a demo.",
        "tool_config": {
            "type": "webhook",
            "name": "submit_waitlist",
            "description": (
                "Submit the collected caller details and preferred demo time to the waitlist. "
                "Call this ONLY after collecting full name, confirmed email, role, clinic name, "
                "and a preferred meeting time."
            ),
            "api_schema": {
                "url": f"{WEBHOOK_BASE}/api/elevenlabs/tools/submit-waitlist",
                "method": "POST",
                "content_type": "application/json",
                "request_body_schema": {
                    "type": "object",
                    "properties": {
                        "fullName": {"type": "string", "description": "Caller full name"},
                        "email": {"type": "string", "description": "Confirmed email address"},
                        "role": {"type": "string", "description": "Role at the clinic"},
                        "clinicName": {"type": "string", "description": "Name of the practice"},
                        "preferredTime": {"type": "string", "description": "Preferred demo date/time"},
                        "bestPhone": {"type": "string", "description": "Alternative phone if given"},
                    },
                    "required": ["fullName", "email", "role", "clinicName", "preferredTime"],
                },
            },
        },
    }
    r = httpx.post(f"{BASE}/convai/tools", headers=HEADERS, json=body, timeout=15)
    r.raise_for_status()
    return r.json()["id"]


def build_conversation_config(voice_id: str, tool_ids: list[str]) -> dict:
    """Build the conversation_config for PATCH (only fields we want to set)."""
    prompt = get_system_prompt()
    first_message = get_first_message()

    return {
        "asr": {
            "quality": "high",
            "provider": "scribe_realtime",
            "user_input_audio_format": "pcm_16000",
            "keywords": [],
        },
        "turn": {
            "turn_timeout": 15.0,
            "initial_wait_time": -1,
            "turn_eagerness": "patient",
            "spelling_patience": "auto",
            "speculative_turn": False,
        },
        "tts": {
            "model_id": "eleven_flash_v2",
            "voice_id": voice_id,
            "stability": 0.3,
            "similarity_boost": 0.8,
            "speed": 1.0,
            "agent_output_audio_format": "pcm_16000",
            "optimize_streaming_latency": 3,
        },
        "conversation": {
            "max_duration_seconds": 900,
        },
        "agent": {
            "first_message": first_message,
            "language": "en",
            "disable_first_message_interruptions": True,
            "prompt": {
                "prompt": prompt,
                "llm": "gpt-4.1",
                "temperature": 0.3,
                "tool_ids": tool_ids,
                "built_in_tools": {
                    "end_call": {
                        "type": "system",
                        "name": "end_call",
                        "description": "End the phone call after saying goodbye.",
                        "params": {"system_tool_type": "end_call"},
                    },
                    "skip_turn": {
                        "type": "system",
                        "name": "skip_turn",
                        "description": (
                            "Stay silent and wait for the caller to speak. "
                            "Use this after the greeting or whenever you have nothing meaningful to add."
                        ),
                        "params": {"system_tool_type": "skip_turn"},
                    },
                },
            },
        },
    }


def main():
    print("Fetching existing agents...")
    data = list_agents()
    agents = data.get("agents", [])
    if not agents:
        print("No agents found. Create one in the ElevenLabs dashboard first, then re-run.")
        sys.exit(1)

    agent = agents[0]
    agent_id = agent["agent_id"]
    name = agent.get("name", "?")
    print(f"Using agent: {name} ({agent_id})")

    voice_id = os.getenv("ELEVENLABS_VOICE_ID") or DEFAULT_VOICE_ID
    print(f"Using voice_id: {voice_id}")

    print("Ensuring submit_waitlist webhook tool exists...")
    try:
        tool_id = ensure_submit_waitlist_tool()
        print(f"submit_waitlist tool: {tool_id}")
    except httpx.HTTPStatusError as e:
        print(f"Warning: could not create/find tool: {e.response.status_code} {e.response.text}")
        tool_id = SUBMIT_WAITLIST_TOOL_ID
        print(f"Falling back to: {tool_id}")

    print("Building conversation config (prompt, Flash v2 TTS, Scribe Realtime STT, tools)...")
    config = build_conversation_config(voice_id, tool_ids=[tool_id])

    print("Patching agent...")
    try:
        update_agent(agent_id, config)
        print("Agent updated successfully.")
    except httpx.HTTPStatusError as e:
        print(f"API error: {e.response.status_code}")
        print(e.response.text)
        if e.response.status_code == 401:
            try:
                detail = e.response.json().get("detail", {})
                if "convai_write" in str(detail.get("message", "")):
                    print("\nYour API key needs 'convai_write' permission.")
                    print("In ElevenLabs: Profile → API Keys → edit key → enable ConvAI / Agent write.")
                    print("Then re-run this script. Or configure the agent manually in the dashboard.")
            except Exception:
                pass
        # Continue to write .env with IDs so the server can run

    # Update .env
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            lines = f.readlines()
        new_lines = []
        seen_agent = seen_voice = False
        for line in lines:
            if line.startswith("ELEVENLABS_AGENT_ID="):
                new_lines.append(f"ELEVENLABS_AGENT_ID={agent_id}\n")
                seen_agent = True
            elif line.startswith("ELEVENLABS_VOICE_ID="):
                new_lines.append(f"ELEVENLABS_VOICE_ID={voice_id}\n")
                seen_voice = True
            else:
                new_lines.append(line)
        if not seen_agent:
            new_lines.append(f"ELEVENLABS_AGENT_ID={agent_id}\n")
        if not seen_voice:
            new_lines.append(f"ELEVENLABS_VOICE_ID={voice_id}\n")
        with open(env_path, "w") as f:
            f.writelines(new_lines)
        print(f"Updated {env_path} with ELEVENLABS_AGENT_ID and ELEVENLABS_VOICE_ID")
    else:
        print(f"Add to .env:\nELEVENLABS_AGENT_ID={agent_id}\nELEVENLABS_VOICE_ID={voice_id}")

    print("\nPost-call webhook: add in ElevenLabs dashboard → Agent → Webhooks:")
    print(f"  URL: {WEBHOOK_BASE}/api/elevenlabs/webhook")
    print("  Events: transcript, call_initiation_failure")
    print("\nDone.")


if __name__ == "__main__":
    main()
