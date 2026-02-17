from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

from app.config import settings
from app.schemas import WaitlistSubmission, WaitlistResponse, ContactSubmission, ContactResponse
from app.services import get_google_sheets_service
from app.services.google_sheets import send_waitlist_welcome_email

# Create FastAPI app (lifespan disabled for serverless via Mangum)
app = FastAPI(
    title="Clinicflow Waitlist API",
    description="API for managing Clinicflow waitlist submissions",
    version="1.0.0"
)

# CORS middleware - allows all Vercel deployments and custom domains
# For local development, use permissive regex; for production use specific regex
is_production = os.getenv("ENVIRONMENT") == "production"

if is_production:
    # Production: Use regex for Vercel deployments
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app|https://(useaxis|www\.useaxis)\.app",
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE", "HEAD"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=3600,
    )
else:
    # Development: Use permissive regex to allow any localhost origin
    # This handles any port number for local development
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE", "HEAD"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=3600,
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
        # Initialize service on each request for serverless compatibility
        sheets_service = get_google_sheets_service()
        
        # Check if Google Sheets is configured
        if sheets_service.client is None or sheets_service.spreadsheet is None:
            # Return success but log that Google Sheets is not configured
            print(f"Warning: Waitlist submission received but Google Sheets not configured. Submission: {submission.email}")
            return WaitlistResponse(
                success=True,
                message="Successfully received submission (Google Sheets not configured)"
            )
        
        await sheets_service.add_waitlist_submission(submission)

        # Send waitlist welcome email
        if submission.email:
            try:
                send_waitlist_welcome_email(
                    full_name=submission.fullName,
                    email=submission.email,
                    clinic_name=submission.clinicName,
                )
            except Exception as e:
                print(f"Warning: Failed to send waitlist welcome email: {e}")

        return WaitlistResponse(
            success=True,
            message="Successfully added to waitlist"
        )
    except Exception as e:
        print(f"Error processing waitlist submission: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process submission: {str(e)}"
        )


@app.post("/api/contact", response_model=ContactResponse)
async def submit_contact(submission: ContactSubmission):
    """
    Submit a contact form entry.
    Saves the submission to Google Sheets with timestamp.
    """
    try:
        # Initialize service on each request for serverless compatibility
        sheets_service = get_google_sheets_service()
        
        # Check if Google Sheets is configured
        if sheets_service.client is None or sheets_service.spreadsheet is None:
            print(f"Warning: Contact submission received but Google Sheets not configured. Submission: {submission.email}")
            return ContactResponse(
                success=True,
                message="Successfully received contact submission (Google Sheets not configured)"
            )
        
        await sheets_service.add_contact_submission(submission)
        
        return ContactResponse(
            success=True,
            message="Successfully submitted contact form"
        )
    except Exception as e:
        print(f"Error processing contact submission: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process submission: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
