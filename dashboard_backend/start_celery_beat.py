#!/usr/bin/env python
"""
Start Celery beat scheduler for periodic tasks
Run: celery -A app.celery_app beat --loglevel=info
Or: python start_celery_beat.py
"""
import subprocess
import sys

if __name__ == "__main__":
    subprocess.run([
        sys.executable, "-m", "celery",
        "-A", "app.celery_app",
        "beat",
        "--loglevel=info"
    ])

