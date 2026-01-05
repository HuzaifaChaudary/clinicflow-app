from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from uuid import UUID
from datetime import datetime, date
from app.database import get_db
from app.models.intake import IntakeForm, AIIntakeSummary
from app.models.appointment import Appointment
from app.schemas.intake import (
    IntakeFormCreate, IntakeFormResponse, AIIntakeSummaryResponse, IntakeMarkComplete
)
from app.schemas.intake_list import IntakeFormList
from app.api.deps import get_current_user, require_admin_or_doctor, require_admin
from app.models.user import User
from app.services.ai_service import generate_intake_summary

router = APIRouter(prefix="/api/intake", tags=["intake"])


@router.get("/forms", response_model=IntakeFormList)
def list_intake_forms(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (pending, completed, reviewed)"),
    submitted_after: Optional[date] = Query(None, description="Filter by submission date (after)"),
    submitted_before: Optional[date] = Query(None, description="Filter by submission date (before)"),
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """List intake forms with role-based filtering, status, and date filters"""
    query = db.query(IntakeForm).options(
        joinedload(IntakeForm.ai_summary)
    ).filter(
        IntakeForm.clinic_id == current_user.clinic_id
    )
    
    # Doctor can only see intake forms for their own patients
    if current_user.role == "doctor":
        query = query.join(Appointment).filter(
            Appointment.doctor_id == current_user.doctor_id
        )
    
    # Apply status filter
    if status_filter:
        query = query.filter(IntakeForm.status == status_filter)
    
    # Apply date filters
    if submitted_after:
        query = query.filter(IntakeForm.submitted_at >= submitted_after)
    if submitted_before:
        query = query.filter(IntakeForm.submitted_at <= submitted_before)
    
    # Get total and paginated results
    total = query.count()
    intake_forms = query.offset(skip).limit(limit).all()
    
    # Get total and paginated results
    total = query.count()
    intake_forms = query.offset(skip).limit(limit).all()
    
    result = []
    for form in intake_forms:
        form_data = IntakeFormResponse(
            id=form.id,
            clinic_id=form.clinic_id,
            patient_id=form.patient_id,
            appointment_id=form.appointment_id,
            raw_answers=form.raw_answers,
            status=form.status,
            submitted_at=form.submitted_at,
            created_at=form.created_at
        )
        # Add AI summary if exists
        if form.ai_summary:
            form_data.ai_summary = AIIntakeSummaryResponse.model_validate(form.ai_summary)
        result.append(form_data)
    
    return IntakeFormList(
        items=result,
        total=total,
        skip=skip,
        limit=limit
    )


@router.get("/forms/{form_id}", response_model=IntakeFormResponse)
def get_intake_form(
    form_id: UUID,
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get single intake form"""
    query = db.query(IntakeForm).options(
        joinedload(IntakeForm.ai_summary)
    ).filter(
        IntakeForm.id == form_id,
        IntakeForm.clinic_id == current_user.clinic_id
    )
    
    # Doctor can only see their own patients' forms
    if current_user.role == "doctor":
        query = query.join(Appointment).filter(
            Appointment.doctor_id == current_user.doctor_id
        )
    
    form = query.first()
    
    if not form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intake form not found")
    
    form_data = IntakeFormResponse(
        id=form.id,
        clinic_id=form.clinic_id,
        patient_id=form.patient_id,
        appointment_id=form.appointment_id,
        raw_answers=form.raw_answers,
        status=form.status,
        submitted_at=form.submitted_at,
        created_at=form.created_at
    )
    
    if form.ai_summary:
        form_data.ai_summary = AIIntakeSummaryResponse.model_validate(form.ai_summary)
    
    return form_data


@router.post("/forms", response_model=IntakeFormResponse, status_code=status.HTTP_201_CREATED)
def submit_intake_form(
    form_data: IntakeFormCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Submit intake form - admin only"""
    # Verify appointment exists
    appointment = db.query(Appointment).filter(
        Appointment.id == form_data.appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    # Create intake form
    intake_form = IntakeForm(
        clinic_id=current_user.clinic_id,
        patient_id=appointment.patient_id,
        appointment_id=form_data.appointment_id,
        raw_answers=form_data.raw_answers,
        status="submitted",
        submitted_at=datetime.utcnow()
    )
    db.add(intake_form)
    
    # Update appointment intake status
    appointment.intake_status = "completed"
    
    db.commit()
    db.refresh(intake_form)
    
    # Generate AI summary
    try:
        generate_intake_summary(intake_form.id, db)
    except Exception as e:
        # Log error but don't fail the request
        print(f"Failed to generate AI summary: {e}")
    
    # Load AI summary if exists
    ai_summary = db.query(AIIntakeSummary).filter(
        AIIntakeSummary.intake_form_id == intake_form.id
    ).first()
    
    form_response = IntakeFormResponse(
        id=intake_form.id,
        clinic_id=intake_form.clinic_id,
        patient_id=intake_form.patient_id,
        appointment_id=intake_form.appointment_id,
        raw_answers=intake_form.raw_answers,
        status=intake_form.status,
        submitted_at=intake_form.submitted_at,
        created_at=intake_form.created_at
    )
    
    if ai_summary:
        form_response.ai_summary = AIIntakeSummaryResponse.model_validate(ai_summary)
    
    return form_response


@router.put("/forms/{form_id}/complete", response_model=IntakeFormResponse)
def mark_intake_complete(
    form_id: UUID,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Mark intake form as complete manually - admin only"""
    intake_form = db.query(IntakeForm).filter(
        IntakeForm.id == form_id,
        IntakeForm.clinic_id == current_user.clinic_id
    ).first()
    
    if not intake_form:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intake form not found")
    
    # Update form status
    intake_form.status = "submitted"
    if not intake_form.submitted_at:
        intake_form.submitted_at = datetime.utcnow()
    
    # Update appointment if exists
    if intake_form.appointment_id:
        appointment = db.query(Appointment).filter(
            Appointment.id == intake_form.appointment_id
        ).first()
        if appointment:
            appointment.intake_status = "completed"
    
    db.commit()
    db.refresh(intake_form)
    
    # Load AI summary
    ai_summary = db.query(AIIntakeSummary).filter(
        AIIntakeSummary.intake_form_id == intake_form.id
    ).first()
    
    form_response = IntakeFormResponse(
        id=intake_form.id,
        clinic_id=intake_form.clinic_id,
        patient_id=intake_form.patient_id,
        appointment_id=intake_form.appointment_id,
        raw_answers=intake_form.raw_answers,
        status=intake_form.status,
        submitted_at=intake_form.submitted_at,
        created_at=intake_form.created_at
    )
    
    if ai_summary:
        form_response.ai_summary = AIIntakeSummaryResponse.model_validate(ai_summary)
    
    return form_response


@router.get("/summary/{appointment_id}", response_model=AIIntakeSummaryResponse)
def get_intake_summary(
    appointment_id: UUID,
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get AI intake summary for appointment"""
    # Verify appointment exists and user has access
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    # Doctor can only see their own appointments
    if current_user.role == "doctor" and appointment.doctor_id != current_user.doctor_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get AI summary
    ai_summary = db.query(AIIntakeSummary).filter(
        AIIntakeSummary.appointment_id == appointment_id
    ).first()
    
    if not ai_summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI summary not found for this appointment"
        )
    
    return AIIntakeSummaryResponse.model_validate(ai_summary)


@router.post("/summary/{appointment_id}/regenerate", response_model=AIIntakeSummaryResponse)
def regenerate_intake_summary(
    appointment_id: UUID,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Regenerate AI summary for appointment - admin only"""
    # Get appointment
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    # Get intake form
    intake_form = db.query(IntakeForm).filter(
        IntakeForm.appointment_id == appointment_id
    ).first()
    
    if not intake_form:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Intake form not found for this appointment"
        )
    
    # Regenerate summary
    try:
        ai_summary = generate_intake_summary(intake_form.id, db)
        return AIIntakeSummaryResponse.model_validate(ai_summary)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate summary: {str(e)}"
        )

