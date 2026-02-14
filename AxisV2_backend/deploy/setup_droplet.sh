#!/bin/bash
# DigitalOcean Droplet Setup for Ava Server
# Run as root on a fresh Ubuntu 22.04+ droplet
# Usage: ssh root@YOUR_DROPLET_IP 'bash -s' < setup_droplet.sh

set -e

echo "=== Ava Server — DigitalOcean Setup ==="

# ── System updates ──
apt-get update && apt-get upgrade -y

# ── Install Python 3.11+, pip, nginx, certbot ──
apt-get install -y python3 python3-pip python3-venv nginx certbot python3-certbot-nginx git ufw

# ── Firewall ──
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ── Create app user ──
if ! id "ava" &>/dev/null; then
    useradd -m -s /bin/bash ava
    echo "Created user: ava"
fi

# ── App directory ──
APP_DIR=/home/ava/ava_server
mkdir -p $APP_DIR
chown ava:ava $APP_DIR

echo ""
echo "=== Base setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Copy your AxisV2_backend code to $APP_DIR"
echo "     scp -r ./* root@YOUR_DROPLET_IP:$APP_DIR/"
echo ""
echo "  2. Run deploy_app.sh on the droplet"
echo "     ssh root@YOUR_DROPLET_IP 'bash $APP_DIR/deploy/deploy_app.sh'"
echo ""
