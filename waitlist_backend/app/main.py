from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.schemas import WaitlistSubmission, WaitlistResponse
from app.services.google_sheets import get_google_sheets_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Google Sheets connection
    try:
        get_google_sheets_service()
        print("Google Sheets service initialized")
    except Exception as e:
        print(f"Warning: Could not initialize Google Sheets: {e}")
    yield
    # Shutdown
    print("Shutting down...")


app = FastAPI(
    title="Clinicflow Waitlist API",
    description="API for managing Clinicflow waitlist submissions",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Clinicflow Waitlist API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/waitlist", response_model=WaitlistResponse)
async def submit_waitlist(submission: WaitlistSubmission):
    """
    Submit a new waitlist entry.
    Saves the submission to Google Sheets with timestamp.
    """
    try:
        sheets_service = get_google_sheets_service()
        await sheets_service.add_waitlist_submission(submission)
        
        return WaitlistResponse(
            success=True,
            message="Successfully added to waitlist"
        )
    except Exception as e:
        print(f"Error processing waitlist submission: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process submission: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
