"""
API Router Package

Registers all API routers for the application.
"""

from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.appointments import router as appointments_router
from app.api.schedule import router as schedule_router
from app.api.patients import router as patients_router
from app.api.intake import router as intake_router
from app.api.public import router as public_router
from app.api.dashboard import router as dashboard_router
from app.api.doctor_notes import router as doctor_notes_router
from app.api.follow_ups import router as follow_ups_router
from app.api.settings import router as settings_router
from app.api.websocket import router as websocket_router


# Create main API router
api_router = APIRouter()

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(appointments_router)
api_router.include_router(schedule_router)
api_router.include_router(patients_router)
api_router.include_router(intake_router)
api_router.include_router(public_router)
api_router.include_router(dashboard_router)
api_router.include_router(doctor_notes_router)
api_router.include_router(follow_ups_router)
api_router.include_router(settings_router)
api_router.include_router(websocket_router)


__all__ = ["api_router"]
