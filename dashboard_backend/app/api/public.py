"""
Public Intake API Routes

Public endpoints for patient intake form submission via token.
No authentication required - accessed via unique token.
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    IntakeToken,
    IntakeFormTemplate,
    IntakeSubmission,
    Appointment,
    Patient,
    Clinic,
    IntakeStatus,
)
from app.schemas import (
    PublicIntakeFormResponse,
    PublicIntakeSubmission,
)


router = APIRouter(prefix="/public/intake", tags=["Public Intake"])


@router.get("/{token}", response_model=PublicIntakeFormResponse)
async def get_public_intake_form(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> PublicIntakeFormResponse:
    """
    Get the intake form for public submission.
    
    This endpoint is accessed by patients via a unique token link.
    No authentication required.
    """
    # Find token
    result = await db.execute(
        select(IntakeToken).where(IntakeToken.token == token).options(
            selectinload(IntakeToken.template),
            selectinload(IntakeToken.patient),
            selectinload(IntakeToken.appointment),
        )
    )
    intake_token = result.scalar_one_or_none()
    
    if not intake_token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid intake link. Please contact the clinic.",
        )
    
    if intake_token.is_used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This intake form has already been submitted.",
        )
    
    if intake_token.is_expired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This intake link has expired. Please contact the clinic for a new link.",
        )
    
    # Get clinic info
    clinic_result = await db.execute(
        select(Clinic).where(Clinic.id == intake_token.clinic_id)
    )
    clinic = clinic_result.scalar_one_or_none()
    
    # Build response
    template = intake_token.template
    patient = intake_token.patient
    appointment = intake_token.appointment
    
    # Pre-fill patient info if available
    prefilled_data = {}
    if patient:
        prefilled_data = {
            "first_name": patient.first_name,
            "last_name": patient.last_name,
            "date_of_birth": patient.date_of_birth.isoformat() if patient.date_of_birth else None,
            "phone": patient.phone,
            "email": patient.email,
            "address": patient.address,
        }
    
    return PublicIntakeFormResponse(
        token=token,
        clinic_name=clinic.name if clinic else "Clinic",
        patient_name=f"{patient.first_name} {patient.last_name}" if patient else None,
        appointment_date=appointment.date if appointment else None,
        appointment_time=appointment.start_time if appointment else None,
        form_name=template.name,
        form_description=template.description,
        sections=template.sections,
        prefilled_data=prefilled_data,
        expires_at=intake_token.expires_at,
    )


@router.post("/{token}", status_code=status.HTTP_201_CREATED)
async def submit_public_intake_form(
    token: str,
    data: PublicIntakeSubmission,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Submit a public intake form.
    
    This endpoint is accessed by patients via a unique token link.
    No authentication required.
    """
    # Find and validate token
    result = await db.execute(
        select(IntakeToken).where(IntakeToken.token == token)
    )
    intake_token = result.scalar_one_or_none()
    
    if not intake_token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid intake link.",
        )
    
    if intake_token.is_used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This intake form has already been submitted.",
        )
    
    if intake_token.is_expired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This intake link has expired.",
        )
    
    # Create submission
    submission = IntakeSubmission(
        clinic_id=intake_token.clinic_id,
        patient_id=intake_token.patient_id,
        appointment_id=intake_token.appointment_id,
        template_id=intake_token.template_id,
        form_data=data.form_data,
        submitted_at=datetime.utcnow(),
        submitted_by_staff=False,
        ip_address=data.ip_address,
        user_agent=data.user_agent,
    )
    
    db.add(submission)
    
    # Mark token as used
    intake_token.is_used = True
    intake_token.used_at = datetime.utcnow()
    
    # Update appointment intake status if linked
    if intake_token.appointment_id:
        appt_result = await db.execute(
            select(Appointment).where(Appointment.id == intake_token.appointment_id)
        )
        appointment = appt_result.scalar_one_or_none()
        if appointment:
            appointment.intake_status = IntakeStatus.COMPLETE
    
    # Update patient info if provided in form
    if data.update_patient_info and intake_token.patient_id:
        patient_result = await db.execute(
            select(Patient).where(Patient.id == intake_token.patient_id)
        )
        patient = patient_result.scalar_one_or_none()
        if patient:
            # Update patient fields from form data if present
            if "email" in data.form_data:
                patient.email = data.form_data["email"]
            if "phone" in data.form_data:
                patient.phone = data.form_data["phone"]
            if "address" in data.form_data:
                patient.address = data.form_data["address"]
            if "emergency_contact_name" in data.form_data:
                patient.emergency_contact_name = data.form_data["emergency_contact_name"]
            if "emergency_contact_phone" in data.form_data:
                patient.emergency_contact_phone = data.form_data["emergency_contact_phone"]
    
    await db.commit()
    
    return {
        "success": True,
        "message": "Thank you! Your intake form has been submitted successfully.",
    }


@router.get("/{token}/status")
async def get_intake_status(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Check the status of an intake token.
    
    Useful for showing status to patients without full form details.
    """
    result = await db.execute(
        select(IntakeToken).where(IntakeToken.token == token)
    )
    intake_token = result.scalar_one_or_none()
    
    if not intake_token:
        return {
            "valid": False,
            "status": "not_found",
            "message": "Invalid intake link.",
        }
    
    if intake_token.is_used:
        return {
            "valid": False,
            "status": "used",
            "message": "This form has already been submitted.",
            "submitted_at": intake_token.used_at.isoformat() if intake_token.used_at else None,
        }
    
    if intake_token.is_expired:
        return {
            "valid": False,
            "status": "expired",
            "message": "This link has expired.",
            "expired_at": intake_token.expires_at.isoformat(),
        }
    
    return {
        "valid": True,
        "status": "pending",
        "message": "Ready for submission.",
        "expires_at": intake_token.expires_at.isoformat(),
    }
