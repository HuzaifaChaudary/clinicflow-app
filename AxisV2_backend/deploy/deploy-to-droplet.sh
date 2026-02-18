#!/usr/bin/env bash
# Deploy the WHOLE Ava backend to DigitalOcean droplet.
# Syncs entire project (ava_server.py, app/, api/, deploy/, requirements.txt, etc.).
# Only excludes: .env (keep server secrets), venv/ (rebuilt on server), __pycache__/, .git/
# Run from AxisV2_backend: ./deploy/deploy-to-droplet.sh

set -e

DROPLET_IP="${DROPLET_IP:-147.182.208.147}"
REMOTE_DIR="/home/ava/ava_server"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$BACKEND_ROOT"

echo "=== Deploying WHOLE backend to $DROPLET_IP ==="
echo "Local:  $BACKEND_ROOT"
echo "Remote: $REMOTE_DIR"
echo "Syncing: entire project (all Python, config, deploy scripts). Excluding: .env, venv/, __pycache__/, .git/"
echo ""

# Sync entire backend; only exclude secrets and generated/runtime paths
rsync -avz --delete \
  --exclude '.env' \
  --exclude 'venv/' \
  --exclude '__pycache__/' \
  --exclude '*.pyc' \
  --exclude '.git/' \
  ./ "root@${DROPLET_IP}:${REMOTE_DIR}/"

echo ""
echo "Installing dependencies and restarting ava-server..."
ssh "root@${DROPLET_IP}" <<'REMOTE_CMDS'
cd /home/ava/ava_server
chown -R ava:ava /home/ava/ava_server
source venv/bin/activate
pip install -r requirements.txt --quiet
systemctl restart ava-server
sleep 2
systemctl status ava-server --no-pager
REMOTE_CMDS

echo ""
echo "=== Deploy complete ==="
echo "Ava server: https://ava.useaxis.app"
echo "Logs: ssh root@${DROPLET_IP} 'journalctl -u ava-server -f'"
