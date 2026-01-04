"""
Intake API Routes

CRUD operations for intake form templates and submissions.
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    IntakeFormTemplate,
    IntakeSubmission,
    IntakeToken,
    Appointment,
    Patient,
    User,
    IntakeStatus,
)
from app.schemas import (
    IntakeFormTemplateCreate,
    IntakeFormTemplateUpdate,
    IntakeFormTemplateResponse,
    IntakeFormTemplateListResponse,
    IntakeSubmissionCreate,
    IntakeSubmissionResponse,
    IntakeSubmissionListResponse,
    IntakeTokenResponse,
    IntakeSummaryResponse,
)
from app.api.deps import (
    get_current_user,
    require_permission,
    PaginationParams,
)
from app.core.permissions import Permission


router = APIRouter(prefix="/intake", tags=["Intake Forms"])


# ============== Template Endpoints ==============


@router.get("/templates", response_model=IntakeFormTemplateListResponse)
async def list_intake_templates(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
) -> IntakeFormTemplateListResponse:
    """List all intake form templates for the clinic."""
    query = select(IntakeFormTemplate).where(
        IntakeFormTemplate.clinic_id == current_user.clinic_id
    )
    
    if is_active is not None:
        query = query.where(IntakeFormTemplate.is_active == is_active)
    
    query = query.order_by(IntakeFormTemplate.name)
    
    result = await db.execute(query)
    templates = result.scalars().all()
    
    return IntakeFormTemplateListResponse(
        templates=[IntakeFormTemplateResponse.model_validate(t) for t in templates],
        total_count=len(templates),
    )


@router.get("/templates/{template_id}", response_model=IntakeFormTemplateResponse)
async def get_intake_template(
    template_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> IntakeFormTemplateResponse:
    """Get a specific intake form template."""
    query = select(IntakeFormTemplate).where(
        IntakeFormTemplate.id == template_id,
        IntakeFormTemplate.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intake template not found",
        )
    
    return IntakeFormTemplateResponse.model_validate(template)


@router.post("/templates", response_model=IntakeFormTemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_intake_template(
    data: IntakeFormTemplateCreate,
    current_user: User = Depends(require_permission(Permission.MANAGE_INTAKE_FORMS)),
    db: AsyncSession = Depends(get_db),
) -> IntakeFormTemplateResponse:
    """Create a new intake form template."""
    # If setting as default, unset other defaults
    if data.is_default:
        existing_defaults = await db.execute(
            select(IntakeFormTemplate).where(
                IntakeFormTemplate.clinic_id == current_user.clinic_id,
                IntakeFormTemplate.is_default == True,
            )
        )
        for template in existing_defaults.scalars().all():
            template.is_default = False
    
    template = IntakeFormTemplate(
        clinic_id=current_user.clinic_id,
        name=data.name,
        description=data.description,
        sections=data.sections,
        is_active=data.is_active,
        is_default=data.is_default,
        created_by=current_user.id,
    )
    
    db.add(template)
    await db.commit()
    await db.refresh(template)
    
    return IntakeFormTemplateResponse.model_validate(template)


@router.put("/templates/{template_id}", response_model=IntakeFormTemplateResponse)
async def update_intake_template(
    template_id: UUID,
    data: IntakeFormTemplateUpdate,
    current_user: User = Depends(require_permission(Permission.MANAGE_INTAKE_FORMS)),
    db: AsyncSession = Depends(get_db),
) -> IntakeFormTemplateResponse:
    """Update an intake form template."""
    query = select(IntakeFormTemplate).where(
        IntakeFormTemplate.id == template_id,
        IntakeFormTemplate.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intake template not found",
        )
    
    # If setting as default, unset other defaults
    if data.is_default:
        existing_defaults = await db.execute(
            select(IntakeFormTemplate).where(
                IntakeFormTemplate.clinic_id == current_user.clinic_id,
                IntakeFormTemplate.is_default == True,
                IntakeFormTemplate.id != template_id,
            )
        )
        for t in existing_defaults.scalars().all():
            t.is_default = False
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(template, field, value)
    
    await db.commit()
    await db.refresh(template)
    
    return IntakeFormTemplateResponse.model_validate(template)


@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_intake_template(
    template_id: UUID,
    current_user: User = Depends(require_permission(Permission.MANAGE_INTAKE_FORMS)),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate an intake form template (soft delete)."""
    query = select(IntakeFormTemplate).where(
        IntakeFormTemplate.id == template_id,
        IntakeFormTemplate.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    template = result.scalar_one_or_none()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intake template not found",
        )
    
    template.is_active = False
    await db.commit()


# ============== Submission Endpoints ==============


@router.get("/submissions", response_model=IntakeSubmissionListResponse)
async def list_intake_submissions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient"),
    appointment_id: Optional[UUID] = Query(None, description="Filter by appointment"),
) -> IntakeSubmissionListResponse:
    """List intake submissions with optional filters."""
    query = select(IntakeSubmission).where(
        IntakeSubmission.clinic_id == current_user.clinic_id
    ).options(
        selectinload(IntakeSubmission.patient),
        selectinload(IntakeSubmission.template),
    )
    
    if patient_id:
        query = query.where(IntakeSubmission.patient_id == patient_id)
    if appointment_id:
        query = query.where(IntakeSubmission.appointment_id == appointment_id)
    
    # Count
    count_query = select(func.count(IntakeSubmission.id)).where(
        IntakeSubmission.clinic_id == current_user.clinic_id
    )
    count_result = await db.execute(count_query)
    total_count = count_result.scalar() or 0
    
    # Order and paginate
    query = query.order_by(IntakeSubmission.submitted_at.desc())
    query = query.offset(pagination.offset).limit(pagination.page_size)
    
    result = await db.execute(query)
    submissions = result.scalars().all()
    
    return IntakeSubmissionListResponse(
        submissions=[IntakeSubmissionResponse.model_validate(s) for s in submissions],
        total_count=total_count,
        page=pagination.page,
        page_size=pagination.page_size,
    )


@router.get("/submissions/{submission_id}", response_model=IntakeSubmissionResponse)
async def get_intake_submission(
    submission_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> IntakeSubmissionResponse:
    """Get a specific intake submission."""
    query = select(IntakeSubmission).where(
        IntakeSubmission.id == submission_id,
        IntakeSubmission.clinic_id == current_user.clinic_id,
    ).options(
        selectinload(IntakeSubmission.patient),
        selectinload(IntakeSubmission.template),
    )
    
    result = await db.execute(query)
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intake submission not found",
        )
    
    return IntakeSubmissionResponse.model_validate(submission)


@router.post("/submissions", response_model=IntakeSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_intake_submission(
    data: IntakeSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> IntakeSubmissionResponse:
    """Create a new intake submission (for staff completing on behalf of patient)."""
    # Verify patient exists
    patient_result = await db.execute(
        select(Patient).where(
            Patient.id == data.patient_id,
            Patient.clinic_id == current_user.clinic_id,
        )
    )
    patient = patient_result.scalar_one_or_none()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Verify template exists
    template_result = await db.execute(
        select(IntakeFormTemplate).where(
            IntakeFormTemplate.id == data.template_id,
            IntakeFormTemplate.clinic_id == current_user.clinic_id,
        )
    )
    template = template_result.scalar_one_or_none()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intake template not found",
        )
    
    # Create submission
    submission = IntakeSubmission(
        clinic_id=current_user.clinic_id,
        patient_id=data.patient_id,
        appointment_id=data.appointment_id,
        template_id=data.template_id,
        form_data=data.form_data,
        submitted_at=datetime.utcnow(),
        submitted_by_staff=True,
        staff_user_id=current_user.id,
    )
    
    db.add(submission)
    
    # Update appointment intake status if linked
    if data.appointment_id:
        appt_result = await db.execute(
            select(Appointment).where(Appointment.id == data.appointment_id)
        )
        appointment = appt_result.scalar_one_or_none()
        if appointment:
            appointment.intake_status = IntakeStatus.COMPLETE
    
    await db.commit()
    await db.refresh(submission)
    
    return IntakeSubmissionResponse.model_validate(submission)


# ============== Token Endpoints ==============


@router.post("/tokens/generate", response_model=IntakeTokenResponse)
async def generate_intake_token(
    patient_id: UUID,
    appointment_id: Optional[UUID] = None,
    current_user: User = Depends(require_permission(Permission.MANAGE_INTAKE_FORMS)),
    db: AsyncSession = Depends(get_db),
) -> IntakeTokenResponse:
    """Generate a unique token for patient intake form submission."""
    # Verify patient
    patient_result = await db.execute(
        select(Patient).where(
            Patient.id == patient_id,
            Patient.clinic_id == current_user.clinic_id,
        )
    )
    patient = patient_result.scalar_one_or_none()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Verify appointment if provided
    if appointment_id:
        appt_result = await db.execute(
            select(Appointment).where(
                Appointment.id == appointment_id,
                Appointment.clinic_id == current_user.clinic_id,
            )
        )
        appointment = appt_result.scalar_one_or_none()
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found",
            )
        # Update intake status
        appointment.intake_status = IntakeStatus.SENT
    
    # Get default template
    template_result = await db.execute(
        select(IntakeFormTemplate).where(
            IntakeFormTemplate.clinic_id == current_user.clinic_id,
            IntakeFormTemplate.is_default == True,
            IntakeFormTemplate.is_active == True,
        )
    )
    template = template_result.scalar_one_or_none()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No default intake template configured",
        )
    
    # Generate token
    token = IntakeToken.generate_token()
    
    intake_token = IntakeToken(
        clinic_id=current_user.clinic_id,
        patient_id=patient_id,
        appointment_id=appointment_id,
        template_id=template.id,
        token=token,
    )
    
    db.add(intake_token)
    await db.commit()
    await db.refresh(intake_token)
    
    # Generate the public URL
    from app.config import settings
    public_url = f"{settings.FRONTEND_URL}/intake/{token}"
    
    return IntakeTokenResponse(
        token=token,
        public_url=public_url,
        expires_at=intake_token.expires_at,
        patient_id=patient_id,
        appointment_id=appointment_id,
    )


@router.get("/tokens/{token}/validate")
async def validate_intake_token(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Validate an intake token (used by staff to verify token status)."""
    result = await db.execute(
        select(IntakeToken).where(IntakeToken.token == token)
    )
    intake_token = result.scalar_one_or_none()
    
    if not intake_token:
        return {"valid": False, "reason": "Token not found"}
    
    if intake_token.is_used:
        return {"valid": False, "reason": "Token already used"}
    
    if intake_token.is_expired:
        return {"valid": False, "reason": "Token expired"}
    
    return {
        "valid": True,
        "patient_id": str(intake_token.patient_id),
        "appointment_id": str(intake_token.appointment_id) if intake_token.appointment_id else None,
        "expires_at": intake_token.expires_at.isoformat(),
    }


# ============== Summary Endpoints ==============


@router.get("/appointments/{appointment_id}/summary", response_model=IntakeSummaryResponse)
async def get_intake_summary_for_appointment(
    appointment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> IntakeSummaryResponse:
    """
    Get AI-generated summary of intake forms for an appointment.
    
    Uses OpenAI to summarize the intake data for the doctor.
    """
    # Verify appointment
    appt_result = await db.execute(
        select(Appointment).where(
            Appointment.id == appointment_id,
            Appointment.clinic_id == current_user.clinic_id,
        ).options(
            selectinload(Appointment.patient),
            selectinload(Appointment.intake_submissions),
        )
    )
    appointment = appt_result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )
    
    # Check if intake is complete
    if appointment.intake_status != IntakeStatus.COMPLETE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Intake form not completed",
        )
    
    # Get submissions
    submissions = appointment.intake_submissions
    if not submissions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No intake submissions found",
        )
    
    # Get AI summary (simplified - real implementation would call OpenAI)
    # For now, return structured data
    form_data = submissions[0].form_data if submissions else {}
    
    return IntakeSummaryResponse(
        appointment_id=appointment_id,
        patient_name=f"{appointment.patient.first_name} {appointment.patient.last_name}",
        submission_count=len(submissions),
        last_submission_at=submissions[0].submitted_at if submissions else None,
        summary={
            "chief_complaint": form_data.get("chief_complaint", "Not provided"),
            "symptoms": form_data.get("symptoms", []),
            "medications": form_data.get("current_medications", []),
            "allergies": form_data.get("allergies", []),
            "medical_history": form_data.get("medical_history", "Not provided"),
        },
        ai_summary=None,  # Would be generated by OpenAI in full implementation
    )
