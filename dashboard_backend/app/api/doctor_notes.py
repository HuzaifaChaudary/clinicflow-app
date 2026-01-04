"""
Doctor Notes API Routes

CRUD operations for private doctor notes.
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
    DoctorNote,
    Patient,
    Appointment,
    Doctor,
    User,
)
from app.schemas import (
    DoctorNoteCreate,
    DoctorNoteUpdate,
    DoctorNoteResponse,
    DoctorNoteListResponse,
)
from app.api.deps import (
    get_current_user,
    get_current_doctor,
    require_permission,
    PaginationParams,
)
from app.core.permissions import Permission


router = APIRouter(prefix="/doctor-notes", tags=["Doctor Notes"])


@router.get("", response_model=DoctorNoteListResponse)
async def list_doctor_notes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    patient_id: Optional[UUID] = Query(None, description="Filter by patient"),
    appointment_id: Optional[UUID] = Query(None, description="Filter by appointment"),
) -> DoctorNoteListResponse:
    """
    List doctor notes.
    
    Doctors see only their own notes.
    Admins/owners can see all notes in the clinic.
    """
    # Build base query
    query = select(DoctorNote).where(
        DoctorNote.clinic_id == current_user.clinic_id
    ).options(
        selectinload(DoctorNote.patient),
    )
    
    # Doctors see only their notes
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if doctor:
            query = query.where(DoctorNote.doctor_id == doctor.id)
    
    # Apply filters
    if patient_id:
        query = query.where(DoctorNote.patient_id == patient_id)
    if appointment_id:
        query = query.where(DoctorNote.appointment_id == appointment_id)
    
    # Count
    count_query = select(func.count(DoctorNote.id)).where(
        DoctorNote.clinic_id == current_user.clinic_id
    )
    count_result = await db.execute(count_query)
    total_count = count_result.scalar() or 0
    
    # Order and paginate
    query = query.order_by(DoctorNote.created_at.desc())
    query = query.offset(pagination.offset).limit(pagination.page_size)
    
    result = await db.execute(query)
    notes = result.scalars().all()
    
    return DoctorNoteListResponse(
        notes=[DoctorNoteResponse.model_validate(n) for n in notes],
        total_count=total_count,
        page=pagination.page,
        page_size=pagination.page_size,
    )


@router.get("/{note_id}", response_model=DoctorNoteResponse)
async def get_doctor_note(
    note_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DoctorNoteResponse:
    """Get a specific doctor note."""
    query = select(DoctorNote).where(
        DoctorNote.id == note_id,
        DoctorNote.clinic_id == current_user.clinic_id,
    ).options(
        selectinload(DoctorNote.patient),
    )
    
    result = await db.execute(query)
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor note not found",
        )
    
    # Doctors can only see their own notes
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if not doctor or note.doctor_id != doctor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied",
            )
    
    return DoctorNoteResponse.model_validate(note)


@router.post("", response_model=DoctorNoteResponse, status_code=status.HTTP_201_CREATED)
async def create_doctor_note(
    data: DoctorNoteCreate,
    current_user: User = Depends(require_permission(Permission.CREATE_NOTES)),
    db: AsyncSession = Depends(get_db),
) -> DoctorNoteResponse:
    """Create a new doctor note."""
    # Get doctor (must be a doctor to create notes)
    doctor_result = await db.execute(
        select(Doctor).where(Doctor.user_id == current_user.id)
    )
    doctor = doctor_result.scalar_one_or_none()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can create clinical notes",
        )
    
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
    
    # Verify appointment if provided
    if data.appointment_id:
        appt_result = await db.execute(
            select(Appointment).where(
                Appointment.id == data.appointment_id,
                Appointment.clinic_id == current_user.clinic_id,
            )
        )
        appointment = appt_result.scalar_one_or_none()
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found",
            )
    
    # Create note
    note = DoctorNote(
        clinic_id=current_user.clinic_id,
        doctor_id=doctor.id,
        patient_id=data.patient_id,
        appointment_id=data.appointment_id,
        note_type=data.note_type,
        content=data.content,
        is_private=data.is_private,
    )
    
    db.add(note)
    await db.commit()
    await db.refresh(note)
    
    return DoctorNoteResponse.model_validate(note)


@router.put("/{note_id}", response_model=DoctorNoteResponse)
async def update_doctor_note(
    note_id: UUID,
    data: DoctorNoteUpdate,
    current_user: User = Depends(require_permission(Permission.EDIT_NOTES)),
    db: AsyncSession = Depends(get_db),
) -> DoctorNoteResponse:
    """Update a doctor note."""
    query = select(DoctorNote).where(
        DoctorNote.id == note_id,
        DoctorNote.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor note not found",
        )
    
    # Doctors can only edit their own notes
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if not doctor or note.doctor_id != doctor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only edit your own notes",
            )
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(note, field, value)
    
    await db.commit()
    await db.refresh(note)
    
    return DoctorNoteResponse.model_validate(note)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_doctor_note(
    note_id: UUID,
    current_user: User = Depends(require_permission(Permission.DELETE_NOTES)),
    db: AsyncSession = Depends(get_db),
):
    """Delete a doctor note."""
    query = select(DoctorNote).where(
        DoctorNote.id == note_id,
        DoctorNote.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor note not found",
        )
    
    # Doctors can only delete their own notes
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if not doctor or note.doctor_id != doctor.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own notes",
            )
    
    await db.delete(note)
    await db.commit()


@router.get("/patient/{patient_id}/history", response_model=DoctorNoteListResponse)
async def get_patient_notes_history(
    patient_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
) -> DoctorNoteListResponse:
    """Get all notes for a specific patient."""
    # Verify patient access
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
    
    # Build query
    query = select(DoctorNote).where(
        DoctorNote.patient_id == patient_id,
        DoctorNote.clinic_id == current_user.clinic_id,
    )
    
    # Doctors only see their own notes for the patient
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if doctor:
            query = query.where(DoctorNote.doctor_id == doctor.id)
    
    # Count
    count_query = select(func.count(DoctorNote.id)).where(
        DoctorNote.patient_id == patient_id,
        DoctorNote.clinic_id == current_user.clinic_id,
    )
    count_result = await db.execute(count_query)
    total_count = count_result.scalar() or 0
    
    # Order and paginate
    query = query.order_by(DoctorNote.created_at.desc())
    query = query.offset(pagination.offset).limit(pagination.page_size)
    
    result = await db.execute(query)
    notes = result.scalars().all()
    
    return DoctorNoteListResponse(
        notes=[DoctorNoteResponse.model_validate(n) for n in notes],
        total_count=total_count,
        page=pagination.page,
        page_size=pagination.page_size,
    )
