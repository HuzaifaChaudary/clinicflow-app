#!/usr/bin/env bash
# Deploy AxisV2_backend to Vercel (includes app/ava/prompts.py and app/ava/voice_handler.py)
set -e
cd "$(dirname "$0")"
echo "Deploying backend to Vercel (prompts + voice_handler included)..."
vercel --prod
