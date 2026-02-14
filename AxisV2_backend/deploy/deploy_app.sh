#!/bin/bash
# Deploy Ava Server app on the droplet
# Run as root after setup_droplet.sh and copying code
# Usage: bash /home/ava/ava_server/deploy/deploy_app.sh ava.useaxis.app

set -e

DOMAIN=${1:-"ava.useaxis.app"}
APP_DIR=/home/ava/ava_server

echo "=== Deploying Ava Server (domain: $DOMAIN) ==="

# ── Python venv + deps ──
cd $APP_DIR
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# ── Ensure .env exists ──
if [ ! -f "$APP_DIR/.env" ]; then
    echo "ERROR: No .env file found at $APP_DIR/.env"
    echo "Copy .env.example to .env and fill in your keys first."
    exit 1
fi

# ── Systemd service ──
cat > /etc/systemd/system/ava-server.service << EOF
[Unit]
Description=Ava AI Voice & SMS Server
After=network.target

[Service]
User=ava
Group=ava
WorkingDirectory=$APP_DIR
Environment="PATH=$APP_DIR/venv/bin:/usr/bin"
EnvironmentFile=$APP_DIR/.env
ExecStart=$APP_DIR/venv/bin/uvicorn ava_server:app --host 127.0.0.1 --port 8002 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ava-server
systemctl restart ava-server

echo "✓ ava-server systemd service started"

# ── Nginx reverse proxy ──
cat > /etc/nginx/sites-available/ava-server << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:8002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
EOF

ln -sf /etc/nginx/sites-available/ava-server /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "✓ Nginx configured for $DOMAIN"

# ── SSL with Let's Encrypt ──
echo ""
echo "Setting up SSL..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@useaxis.app --redirect

echo ""
echo "=== Deployment complete! ==="
echo ""
echo "Ava server is live at: https://$DOMAIN"
echo ""
echo "Twilio webhook URLs:"
echo "  Voice: https://$DOMAIN/api/voice   (POST)"
echo "  SMS:   https://$DOMAIN/api/sms     (POST)"
echo ""
echo "Useful commands:"
echo "  systemctl status ava-server      — check status"
echo "  journalctl -u ava-server -f      — view logs"
echo "  systemctl restart ava-server     — restart after code changes"
echo ""
