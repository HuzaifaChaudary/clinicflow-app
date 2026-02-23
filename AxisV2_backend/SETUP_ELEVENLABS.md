# ElevenLabs Ava agent – setup

Your `.env` already has:
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_AGENT_ID=agent_3601kj5rwsngfypbw03cqba6sdfa`
- `ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL` (Sarah)

The server can run. To have the script apply all agent config (prompt, TTS, STT, tool, webhook) or to do it manually, read below.

---

## Option A: Let the script do it (recommended)

1. **Give your API key ConvAI write**
   - Go to [ElevenLabs → Profile / API Keys](https://elevenlabs.io/app/settings/api-keys)
   - Edit your key and enable **ConvAI** / **Agent write** (or “convai_write”).
2. **Run the setup script** (from `AxisV2_backend`, with venv):
   ```bash
   ./venv/bin/python scripts/setup_elevenlabs_agent.py
   ```
   This updates your existing “Ava” agent with:
   - Full system prompt from `app/ava/prompts.py`
   - TTS: **Eleven Flash v2.5**
   - STT: **Scribe Realtime**
   - Server tool: `submit_waitlist` → `https://ava.useaxis.app/api/elevenlabs/tools/submit-waitlist`
   - First message: “Hello — thanks for calling Axis. This is Ava, what brought you in today?”

3. **Post-call webhook (manual once)**
   - In [ElevenLabs → Agents → Ava → Webhooks](https://elevenlabs.io/app/agents), add:
   - **URL:** `https://ava.useaxis.app/api/elevenlabs/webhook`
   - **Events:** transcript, call_initiation_failure

---

## Option B: Configure everything in the dashboard

If you don’t want to enable `convai_write`, configure the same in the UI:

1. **Agents:** [elevenlabs.io/app/agents](https://elevenlabs.io/app/agents) → open **Ava**.
2. **Prompt:** Paste the full system prompt (from `build_elevenlabs_system_prompt()` in `app/ava/prompts.py` – it’s GENERAL + STATE_CONVERSATION + STATE_MOCK_CALL + STATE_BOOKING).
3. **First message:** `Hello — thanks for calling Axis. This is Ava, what brought you in today?`
4. **Voice / TTS:** Model **Eleven Flash v2.5**, voice **Sarah** (or keep current voice).
5. **STT / Input:** **Scribe Realtime** (or “Scribe v2”) in Advanced/Input.
6. **Tools:** Add a **Server tool** / **Webhook**:
   - Name: `submit_waitlist`
   - URL: `https://ava.useaxis.app/api/elevenlabs/tools/submit-waitlist`
   - Method: POST  
   - Body params: fullName, email, role, clinicName, preferredTime, bestPhone (see `get_elevenlabs_submit_waitlist_tool` in `prompts.py`).
7. **Webhooks:** Add post-call webhook URL `https://ava.useaxis.app/api/elevenlabs/webhook`, events: transcript, call_initiation_failure.

---

## Twilio

Point your Twilio number’s **Voice** webhook to:
`https://ava.useaxis.app/api/voice/inbound` (HTTP POST).

No SIP trunk needed; your server calls ElevenLabs `register-call` and returns TwiML.
