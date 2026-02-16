# Deploy Ava Server on DigitalOcean

## Prerequisites
- DigitalOcean account
- Domain `ava.useaxis.app` (or your chosen subdomain)
- Twilio account with phone number `(888) 464-5649`

---

## Step 1: Create a Droplet

1. Go to [DigitalOcean → Create Droplet](https://cloud.digitalocean.com/droplets/new)
2. Choose **Ubuntu 22.04 LTS**
3. Plan: **Basic → $6/mo** (1 vCPU, 1GB RAM) is enough to start
4. Region: **New York** or closest to your users
5. Auth: Add your **SSH key**
6. Click **Create Droplet**
7. Note the droplet's **IP address**

---

## Step 2: Point DNS

Add an **A record** for `ava.useaxis.app` pointing to your droplet IP:

| Type | Name | Value |
|------|------|-------|
| A    | ava  | YOUR_DROPLET_IP |

If your domain is on Vercel/Cloudflare/Namecheap, add this in their DNS settings.

---

## Step 3: Setup the Droplet

```bash
# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Run the setup script (installs Python, nginx, certbot, firewall)
bash -s < deploy/setup_droplet.sh
```

Or copy and run manually:
```bash
apt-get update && apt-get upgrade -y
apt-get install -y python3 python3-pip python3-venv nginx certbot python3-certbot-nginx git ufw
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
useradd -m -s /bin/bash ava
mkdir -p /home/ava/ava_server
chown ava:ava /home/ava/ava_server
```

---

## Step 4: Upload Code

From your local machine (in the AxisV2_backend folder):
```bash
scp -r ./* root@YOUR_DROPLET_IP:/home/ava/ava_server/
```

---

## Step 5: Create .env on the Droplet

```bash
ssh root@YOUR_DROPLET_IP
nano /home/ava/ava_server/.env
```

Paste your env vars (copy from your local .env and update):
```
OPENAI_API_KEY=sk-your-key
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=your-token
TWILIO_VOICE_NUMBER=+18884645649
TWILIO_SMS_NUMBER=+18884645649
WAITLIST_API_URL=https://your-vercel-backend.vercel.app/api/waitlist
CAL_BOOKING_URL=https://calendly.com/axis-founders/15min
```

Make sure `ava` user owns everything:
```bash
chown -R ava:ava /home/ava/ava_server
```

---

## Step 6: Deploy

```bash
bash /home/ava/ava_server/deploy/deploy_app.sh ava.useaxis.app
```

This will:
- Create Python venv and install dependencies
- Create a systemd service (auto-restarts on crash/reboot)
- Configure nginx as reverse proxy
- Get SSL certificate via Let's Encrypt

---

## Step 7: Configure Twilio

Go to [Twilio Console → Phone Numbers → (888) 464-5649](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)

**Voice Configuration:**
- A call comes in → **Webhook**
- URL: `https://ava.useaxis.app/api/voice`
- Method: **HTTP POST**

**Messaging Configuration:**
- A message comes in → **Webhook**
- URL: `https://ava.useaxis.app/api/sms`
- Method: **HTTP POST**

Click **Save**.

---

## Step 8: Test

```bash
# Check server health
curl https://ava.useaxis.app/health

# Call the number
# (888) 464-5649 — should hear Ava's greeting
```

---

## Useful Commands

```bash
# Check status
systemctl status ava-server

# View live logs
journalctl -u ava-server -f

# Restart after code changes
systemctl restart ava-server

# Re-deploy after uploading new code
cd /home/ava/ava_server
source venv/bin/activate
pip install -r requirements.txt
systemctl restart ava-server
```

---

## Updating Code

From your local machine:
```bash
scp -r ./* root@YOUR_DROPLET_IP:/home/ava/ava_server/
ssh root@YOUR_DROPLET_IP 'systemctl restart ava-server'
```
