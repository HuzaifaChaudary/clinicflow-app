# Retell AI + ElevenLabs + Twilio Setup Guide

## Architecture

```
Caller → Twilio (SIP Trunk) → Retell AI (Brain) → ElevenLabs (Voice)
                                    ↓
                              Your Server (Webhooks)
                              - Dynamic variables
                              - submit_waitlist tool
                              - Call event logging
```

**Retell AI** = Orchestration brain (conversation flow, state management, interruptions, STT, turn-taking)
**ElevenLabs** = Voice synthesis (warm, professional voice via Retell's integration)
**Twilio** = Phone infrastructure (the actual phone number, SIP trunking)
**Your Server** = Business logic (waitlist submission, Google Sheets, email)

---

## Step 1: Get API Keys

### Retell AI
1. Sign up at [retellai.com](https://www.retellai.com/)
2. Go to **Dashboard → Settings → API Keys**
3. Copy your API key → set as `RETELL_API_KEY` in `.env`

### Twilio (you already have this)
Keep your existing `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`.

### ElevenLabs (optional — Retell has built-in voices)
ElevenLabs voices are available directly through Retell. No separate API key needed.
If you want to use a custom voice clone, add it via Retell dashboard.

---

## Step 2: Set Up Twilio Elastic SIP Trunking

This connects your existing Twilio phone number to Retell.

### A) Create Elastic SIP Trunk in Twilio
1. Go to [Twilio Console → Elastic SIP Trunking](https://console.twilio.com/us1/develop/sip-trunking/trunks)
2. Click **Create new SIP Trunk**
3. Name it: `Retell-Ava`

### B) Configure Termination (Outbound)
1. In the trunk, go to **Termination** tab
2. Add a **Termination URI** (e.g., `ava-axis.pstn.twilio.com`)
3. Note this URI → set as `TWILIO_SIP_TERMINATION_URI` in `.env`
4. For authentication, either:
   - Use **IP Access Control List**: Add Retell's IP `100.20.5.228`
   - Or use **Credential List**: Create username/password
     → set as `TWILIO_SIP_AUTH_USERNAME` and `TWILIO_SIP_AUTH_PASSWORD`

### C) Configure Origination (Inbound)
1. Go to **Origination** tab
2. Add origination URI: `sip:sip.retellai.com:5060;transport=tcp`
3. Priority: 10, Weight: 10

### D) Move Your Phone Number
1. Go to **Numbers** tab in the trunk
2. Click **Add a Number**
3. Select your Twilio voice number (the one in `TWILIO_VOICE_NUMBER`)

---

## Step 3: Choose a Voice

Browse voices in the [Retell Dashboard → Voices](https://dashboard.retellai.com/voices).

Recommended ElevenLabs voices for Ava (warm, professional, female):
- `11labs-Amy` — Warm, professional female
- `11labs-Aria` — Clear, confident female
- `11labs-Sarah` — Friendly, natural female

Set your choice as `RETELL_VOICE_ID` in `.env`. Default is `11labs-Amy`.

Voice model options (set in agent config):
- `eleven_turbo_v2_5` — Best quality/speed balance (recommended)
- `eleven_flash_v2_5` — Fastest, slightly lower quality
- `eleven_multilingual_v2` — Best for multilingual

---

## Step 4: Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Required for Retell
RETELL_API_KEY=your-retell-api-key
RETELL_WEBHOOK_BASE_URL=https://ava.useaxis.app  # your public server URL
RETELL_VOICE_ID=11labs-Amy

# Required for Twilio SIP Trunking
TWILIO_SIP_TERMINATION_URI=your-trunk-name.pstn.twilio.com
# If using credential auth (not IP whitelisting):
TWILIO_SIP_AUTH_USERNAME=your-sip-username
TWILIO_SIP_AUTH_PASSWORD=your-sip-password

# Keep existing Twilio, Google Sheets, SMTP settings
```

---

## Step 5: Run the Setup Script

```bash
cd AxisV2_backend
pip install -r requirements.txt
python setup_retell_agent.py
```

This creates:
1. A **Retell LLM** with Ava's states-based prompt architecture
2. A **Retell Agent** with ElevenLabs voice config
3. **Imports your Twilio number** into Retell

The script prints `RETELL_AGENT_ID` and `RETELL_LLM_ID` — add these to your `.env`.

---

## Step 6: Deploy Your Server

Your server only needs to expose three webhook endpoints:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/retell/inbound` | Returns dynamic variables per-call (time slots, booked slots) |
| `POST /api/retell/webhook` | Receives call lifecycle events (logging, analytics) |
| `POST /api/retell/tools/submit-waitlist` | Custom tool for data submission |

```bash
uvicorn ava_server:app --host 0.0.0.0 --port 8002
```

Make sure your server is publicly accessible at the `RETELL_WEBHOOK_BASE_URL`.

---

## Step 7: Test

1. Call your Twilio number
2. You should hear Ava greet you with the ElevenLabs voice
3. Go through the conversation flow
4. Check Google Sheets for the submitted data
5. Check Retell dashboard for call logs and analytics

---

## How It Works (Technical Flow)

```
1. Caller dials your Twilio number
2. Twilio routes via SIP trunk → Retell AI
3. Retell calls your inbound webhook (POST /api/retell/inbound)
   → You return dynamic variables (date, time slots, booked slots, caller phone)
4. Retell injects variables into the prompt template
5. Retell manages the conversation:
   - STT: Transcribes caller's speech
   - LLM: Generates responses (with states to reduce hallucination)
   - TTS: ElevenLabs synthesizes voice
   - Turn-taking: Handles interruptions, silences, backchanneling
6. When Ava collects all data, Retell calls your tool endpoint
   (POST /api/retell/tools/submit-waitlist)
   → You write to Google Sheets + send email
   → Return result to Retell
7. Retell speaks the confirmation to the caller
8. After call ends, Retell sends webhook events
   → You log analytics, recover partial data if needed
```

---

## Updating the Agent

To update prompts or agent config after initial setup:

```python
from retell import Retell
import os

client = Retell(api_key=os.getenv("RETELL_API_KEY"))

# Update LLM prompts
client.llm.update(
    llm_id=os.getenv("RETELL_LLM_ID"),
    general_prompt="updated prompt...",
)

# Update agent settings
client.agent.update(
    agent_id=os.getenv("RETELL_AGENT_ID"),
    voice_speed=1.1,
)
```

Or use the [Retell Dashboard](https://dashboard.retellai.com) for visual editing.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No audio on calls | Check SIP trunk origination URI is `sip:sip.retellai.com:5060;transport=tcp` |
| Calls not routing | Verify phone number is moved to the SIP trunk in Twilio |
| Webhook not receiving | Check `RETELL_WEBHOOK_BASE_URL` is publicly accessible |
| Tool timeouts | Ensure `/api/retell/tools/submit-waitlist` responds within 15s |
| Voice sounds robotic | Try a different voice_id or voice_model in Retell dashboard |
| Hallucination issues | The states architecture should help; if not, tighten state prompts |
