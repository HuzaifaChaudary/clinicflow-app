from celery import Celery
import sys
from app.config import settings

# Create Celery app
celery_app = Celery(
    "clinicflow",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.reminders"]
)

# Determine pool type based on OS
# Windows doesn't support prefork, use solo or threads instead
if sys.platform == "win32":
    worker_pool = "solo"  # Single-threaded pool for Windows
else:
    worker_pool = "prefork"  # Multi-process pool for Linux/Mac

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_pool=worker_pool,
    worker_concurrency=1 if worker_pool == "solo" else 4,  # Solo is single-threaded
    broker_connection_retry_on_startup=True,  # Fix deprecation warning
    beat_schedule={
        "send-confirmation-reminders": {
            "task": "app.tasks.reminders.send_confirmation_reminders",
            "schedule": 3600.0,  # Run every hour
        },
        "send-intake-reminders": {
            "task": "app.tasks.reminders.send_intake_reminders",
            "schedule": 3600.0,  # Run every hour
        },
    },
)

