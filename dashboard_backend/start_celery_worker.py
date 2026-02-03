#!/usr/bin/env python
"""
Start Celery worker for background tasks
Run: celery -A app.celery_app worker --loglevel=info --pool=solo
Or: python start_celery_worker.py
"""
import subprocess
import sys
import platform

if __name__ == "__main__":
    # Windows requires --pool=solo, Linux/Mac can use prefork
    pool_type = "solo" if platform.system() == "Windows" else "prefork"
    
    cmd = [
        sys.executable, "-m", "celery",
        "-A", "app.celery_app",
        "worker",
        f"--pool={pool_type}",
        "--loglevel=info"
    ]
    
    subprocess.run(cmd)

