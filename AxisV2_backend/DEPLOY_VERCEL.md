# Deploy Backend to Vercel

This deploys the **AxisV2_backend** project to your existing Vercel project. The deployment includes the latest `app/ava/prompts.py` and `app/ava/voice_handler.py` (Jerry-style Ava voice + turn-detection updates).

**No frontend or DigitalOcean steps needed** — this is backend-only to Vercel.

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed: `npm i -g vercel`
- Logged in: `vercel login`
- Project linked (if first time): from this folder run `vercel link` and choose your existing backend project

## Deploy (backend only)

From the **AxisV2_backend** directory:

```bash
cd /path/to/clinicflow-app/AxisV2_backend
vercel --prod
```

Or, if you use a specific Vercel org/project:

```bash
vercel --prod --yes
```

After deploy, your Vercel backend will have the latest:

- **api/index.py** — Waitlist API (unchanged)
- **app/ava/prompts.py** — Updated Ava voice prompt (confident, affirmations, role-ack, no hallucination)
- **app/ava/voice_handler.py** — Shimmer voice, VAD threshold 0.6

## Note

The **Ava voice/SMS server** (Twilio webhooks, WebSockets) runs on **DigitalOcean** at **ava.useaxis.app**. The Vercel deployment does not run that server. To get the new prompts and voice handler live on **calls and SMS**, update the code on the droplet and restart the service:

```bash
ssh root@147.182.208.147
cd /home/ava/ava_server/
git pull   # or copy the updated prompts.py and voice_handler.py
systemctl restart ava-server
```
