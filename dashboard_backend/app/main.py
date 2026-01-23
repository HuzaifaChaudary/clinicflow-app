from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="ClinicFlow API",
    description="Backend API for ClinicFlow medical clinic management system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


# Import and mount routers
from app.api import auth, doctors, patients, appointments, schedule, intake, dashboard, owner

app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(schedule.router)
app.include_router(intake.router)
app.include_router(dashboard.router)
app.include_router(owner.router)

