#!/usr/bin/env python3
"""
Retell Agent Setup Script
=========================
One-time setup script to create the Retell LLM, Agent, and import Twilio phone number.
Run this ONCE to configure your Retell AI infrastructure.

Prerequisites:
  1. pip install retell-sdk
  2. Set environment variables in .env (see .env.example)
  3. Set up Twilio Elastic SIP Trunking (see RETELL_SETUP.md)

Usage:
  python setup_retell_agent.py

What it does:
  1. Creates a Retell LLM with Ava's system prompt (states-based architecture)
  2. Creates a Retell Agent with ElevenLabs voice
  3. Imports your Twilio phone number via SIP trunk
  4. Prints all IDs for your .env file

After running, update your .env with the printed IDs:
  RETELL_AGENT_ID=<printed agent_id>
  RETELL_LLM_ID=<printed llm_id>
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv()


def main():
    # ── Check dependencies ────────────────────
    try:
        from retell import Retell
    except ImportError:
        print("ERROR: retell-sdk not installed. Run: pip install retell-sdk")
        sys.exit(1)

    # ── Check required env vars ───────────────
    retell_api_key = os.getenv("RETELL_API_KEY", "")
    webhook_base_url = os.getenv("RETELL_WEBHOOK_BASE_URL", "")
    voice_id = os.getenv("RETELL_VOICE_ID", "11labs-Amy")
    twilio_phone = os.getenv("TWILIO_VOICE_NUMBER", "")
    twilio_sip_uri = os.getenv("TWILIO_SIP_TERMINATION_URI", "")
    twilio_sip_user = os.getenv("TWILIO_SIP_AUTH_USERNAME", "")
    twilio_sip_pass = os.getenv("TWILIO_SIP_AUTH_PASSWORD", "")

    if not retell_api_key:
        print("ERROR: RETELL_API_KEY not set in .env")
        sys.exit(1)

    if not webhook_base_url:
        print("ERROR: RETELL_WEBHOOK_BASE_URL not set in .env")
        print("  This should be your public server URL, e.g. https://ava.useaxis.app")
        sys.exit(1)

    print("=" * 60)
    print("  Retell Agent Setup for Ava (Axis Voice Assistant)")
    print("=" * 60)
    print()
    print(f"  Retell API Key: {retell_api_key[:12]}...")
    print(f"  Webhook Base URL: {webhook_base_url}")
    print(f"  Voice ID: {voice_id}")
    print(f"  Twilio Number: {twilio_phone or '(not set)'}")
    print(f"  SIP URI: {twilio_sip_uri or '(not set)'}")
    print()

    client = Retell(api_key=retell_api_key)

    # ── Step 1: Create Retell LLM ─────────────
    existing_llm_id = os.getenv("RETELL_LLM_ID", "")
    if existing_llm_id:
        print(f"[1/3] Using existing LLM: {existing_llm_id}")
        llm_id = existing_llm_id
    else:
        print("[1/3] Creating Retell LLM with states-based prompt architecture...")

        from app.ava.prompts import build_retell_llm_config
        llm_config = build_retell_llm_config(webhook_base_url)

        try:
            llm = client.llm.create(**llm_config)
            llm_id = llm.llm_id
            print(f"  ✓ LLM created: {llm_id}")
        except Exception as e:
            print(f"  ✗ Failed to create LLM: {e}")
            sys.exit(1)

    # ── Step 2: Create Retell Agent ───────────
    print("[2/3] Creating Retell Agent with ElevenLabs voice...")

    from app.ava.prompts import build_retell_agent_config
    webhook_url = f"{webhook_base_url}/api/retell/webhook"
    agent_config = build_retell_agent_config(llm_id, voice_id, webhook_url)

    try:
        agent = client.agent.create(**agent_config)
        agent_id = agent.agent_id
        print(f"  ✓ Agent created: {agent_id}")
    except TypeError as e:
        # SDK version may not support all params — retry with core params only
        print(f"  ⚠ Full config failed ({e}), retrying with core params...")
        core_config = {
            "response_engine": agent_config["response_engine"],
            "agent_name": agent_config["agent_name"],
            "voice_id": agent_config["voice_id"],
            "language": agent_config.get("language", "en-US"),
            "webhook_url": agent_config.get("webhook_url"),
        }
        try:
            agent = client.agent.create(**core_config)
            agent_id = agent.agent_id
            print(f"  ✓ Agent created (core config): {agent_id}")
            print("    Note: Fine-tune voice/responsiveness settings in the Retell dashboard.")
        except Exception as e2:
            print(f"  ✗ Failed to create Agent: {e2}")
            print(f"    LLM ID: {llm_id} — create agent manually in Retell dashboard.")
            sys.exit(1)
    except Exception as e:
        print(f"  ✗ Failed to create Agent: {e}")
        print(f"    LLM ID: {llm_id} — create agent manually in Retell dashboard.")
        sys.exit(1)

    # ── Step 3: Import Twilio Phone Number ────
    if twilio_phone and twilio_sip_uri:
        print("[3/3] Importing Twilio phone number via SIP trunk...")

        import_config = {
            "phone_number": twilio_phone,
            "termination_uri": twilio_sip_uri,
            "inbound_agent_id": agent_id,
            "outbound_agent_id": agent_id,
            "nickname": "Ava - Axis Voice Line",
            "inbound_webhook_url": f"{webhook_base_url}/api/retell/inbound",
        }

        if twilio_sip_user and twilio_sip_pass:
            import_config["sip_trunk_auth_username"] = twilio_sip_user
            import_config["sip_trunk_auth_password"] = twilio_sip_pass

        try:
            phone = client.phone_number.import_(**import_config)
            print(f"  ✓ Phone number imported: {phone.phone_number}")
        except Exception as e:
            print(f"  ✗ Failed to import phone number: {e}")
            print("    You can import it manually from the Retell dashboard.")
            print(f"    Agent ID to use: {agent_id}")
    else:
        print("[3/3] Skipping phone number import (TWILIO_VOICE_NUMBER or TWILIO_SIP_TERMINATION_URI not set)")
        print("    You can import your Twilio number from the Retell dashboard later.")

    # ── Summary ───────────────────────────────
    print()
    print("=" * 60)
    print("  Setup Complete!")
    print("=" * 60)
    print()
    print("  Add these to your .env file:")
    print()
    print(f"  RETELL_AGENT_ID={agent_id}")
    print(f"  RETELL_LLM_ID={llm_id}")
    print()
    print("  Architecture:")
    print("  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐")
    print("  │   Twilio     │───▶│  Retell AI   │───▶│ ElevenLabs   │")
    print("  │ (SIP Trunk)  │    │  (Brain)     │    │ (Voice)      │")
    print("  └─────────────┘    └──────┬───────┘    └──────────────┘")
    print("                           │")
    print("                    ┌──────▼───────┐")
    print("                    │ Your Server  │")
    print("                    │ (Webhooks)   │")
    print("                    └──────────────┘")
    print()
    print("  Endpoints your server must expose:")
    print(f"    POST {webhook_base_url}/api/retell/inbound")
    print(f"    POST {webhook_base_url}/api/retell/webhook")
    print(f"    POST {webhook_base_url}/api/retell/tools/submit-waitlist")
    print()
    print("  Next steps:")
    print("  1. Set up Twilio Elastic SIP Trunking (see RETELL_SETUP.md)")
    print("  2. Deploy your ava_server.py")
    print("  3. Test by calling your Twilio number")
    print()


if __name__ == "__main__":
    main()
