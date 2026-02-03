"""
API endpoints for testing and manually triggering reminders
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
import logging

from app.database import get_db
from app.api.deps import get_current_user, require_owner_or_admin
from app.models.user import User
from app.tasks.reminders import send_confirmation_reminders, send_intake_reminders

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/reminders", tags=["reminders"])


@router.post("/send-confirmation", response_model=Dict[str, Any])
def trigger_confirmation_reminders(
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """
    Manually trigger confirmation reminders (for testing)
    This will send reminders based on clinic settings
    """
    try:
        # Trigger the Celery task
        task = send_confirmation_reminders.delay()
        return {
            "success": True,
            "message": "Confirmation reminders task queued",
            "task_id": task.id
        }
    except Exception as e:
        logger.error(f"Error triggering confirmation reminders: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger reminders: {str(e)}"
        )


@router.post("/send-intake", response_model=Dict[str, Any])
def trigger_intake_reminders(
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """
    Manually trigger intake reminders (for testing)
    This will send reminders based on clinic settings
    """
    try:
        # Trigger the Celery task
        task = send_intake_reminders.delay()
        return {
            "success": True,
            "message": "Intake reminders task queued",
            "task_id": task.id
        }
    except Exception as e:
        logger.error(f"Error triggering intake reminders: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to trigger reminders: {str(e)}"
        )


@router.get("/status/{task_id}", response_model=Dict[str, Any])
def get_task_status(
    task_id: str,
    current_user: User = Depends(require_owner_or_admin)
):
    """
    Get the status of a reminder task
    """
    try:
        from app.celery_app import celery_app
        task = celery_app.AsyncResult(task_id)
        
        if task.state == "PENDING":
            response = {
                "state": task.state,
                "status": "Task is waiting to be processed"
            }
        elif task.state == "PROGRESS":
            response = {
                "state": task.state,
                "current": task.info.get("current", 0),
                "total": task.info.get("total", 1),
                "status": task.info.get("status", "")
            }
        elif task.state == "SUCCESS":
            response = {
                "state": task.state,
                "result": task.result,
                "status": "Task completed successfully"
            }
        else:
            response = {
                "state": task.state,
                "status": str(task.info)
            }
        
        return response
    except Exception as e:
        logger.error(f"Error getting task status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get task status: {str(e)}"
        )

