"""
Patient API Routes

CRUD operations and search for patients.
"""

from datetime import date, datetime
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    Patient,
    Appointment,
    Cancellation,
    User,
    Doctor,
    DoctorPatientRelationship,
    AppointmentStatus,
)
from app.schemas import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PatientDetailResponse,
    PatientListResponse,
    PatientSearchParams,
    PatientAppointmentHistory,
    PatientCancellationHistory,
)
from app.api.deps import (
    get_current_user,
    require_permission,
    PaginationParams,
)
from app.core.permissions import Permission


router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("", response_model=PatientListResponse)
async def list_patients(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    search: Optional[str] = Query(None, description="Search by name, phone, or email"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
) -> PatientListResponse:
    """
    List patients with optional search and filters.
    
    Doctors see only their assigned patients.
    Admins and owners see all patients in their clinic.
    """
    # Build base query
    query = select(Patient).where(
        Patient.clinic_id == current_user.clinic_id
    )
    
    # Doctor sees only their patients
    if current_user.role.value == "doctor":
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.user_id == current_user.id)
        )
        doctor = doctor_result.scalar_one_or_none()
        if doctor:
            # Get patient IDs assigned to this doctor
            rel_query = select(DoctorPatientRelationship.patient_id).where(
                DoctorPatientRelationship.doctor_id == doctor.id
            )
            rel_result = await db.execute(rel_query)
            patient_ids = [r[0] for r in rel_result.all()]
            query = query.where(Patient.id.in_(patient_ids))
    
    # Search filter
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Patient.first_name.ilike(search_pattern),
                Patient.last_name.ilike(search_pattern),
                Patient.phone.ilike(search_pattern),
                Patient.email.ilike(search_pattern),
            )
        )
    
    # Active status filter
    if is_active is not None:
        query = query.where(Patient.is_active == is_active)
    
    # Count total
    count_query = select(func.count(Patient.id)).where(
        Patient.clinic_id == current_user.clinic_id
    )
    if search:
        search_pattern = f"%{search}%"
        count_query = count_query.where(
            or_(
                Patient.first_name.ilike(search_pattern),
                Patient.last_name.ilike(search_pattern),
                Patient.phone.ilike(search_pattern),
                Patient.email.ilike(search_pattern),
            )
        )
    count_result = await db.execute(count_query)
    total_count = count_result.scalar() or 0
    
    # Apply pagination and ordering
    query = query.order_by(Patient.last_name, Patient.first_name)
    query = query.offset(pagination.offset).limit(pagination.page_size)
    
    result = await db.execute(query)
    patients = result.scalars().all()
    
    return PatientListResponse(
        patients=[PatientResponse.model_validate(p) for p in patients],
        total_count=total_count,
        page=pagination.page,
        page_size=pagination.page_size,
    )


@router.get("/search")
async def search_patients(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(10, le=50, description="Max results"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """
    Quick search for patients (used in autocomplete).
    
    Returns minimal patient info for dropdown selection.
    """
    search_pattern = f"%{q}%"
    
    query = select(Patient).where(
        Patient.clinic_id == current_user.clinic_id,
        Patient.is_active == True,
        or_(
            Patient.first_name.ilike(search_pattern),
            Patient.last_name.ilike(search_pattern),
            Patient.phone.ilike(search_pattern),
            Patient.email.ilike(search_pattern),
        )
    ).limit(limit)
    
    result = await db.execute(query)
    patients = result.scalars().all()
    
    return [
        {
            "id": str(p.id),
            "name": f"{p.first_name} {p.last_name}",
            "phone": p.phone,
            "email": p.email,
            "date_of_birth": p.date_of_birth.isoformat() if p.date_of_birth else None,
        }
        for p in patients
    ]


@router.get("/{patient_id}", response_model=PatientDetailResponse)
async def get_patient(
    patient_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PatientDetailResponse:
    """Get a specific patient by ID with full details."""
    query = select(Patient).where(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Get upcoming appointments
    upcoming_query = select(Appointment).where(
        Appointment.patient_id == patient_id,
        Appointment.date >= date.today(),
        Appointment.status.not_in([AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED]),
    ).options(
        selectinload(Appointment.doctor)
    ).order_by(Appointment.date, Appointment.start_time).limit(5)
    
    upcoming_result = await db.execute(upcoming_query)
    upcoming_appointments = upcoming_result.scalars().all()
    
    # Get past appointments count
    past_count_query = select(func.count(Appointment.id)).where(
        Appointment.patient_id == patient_id,
        Appointment.status == AppointmentStatus.COMPLETED,
    )
    past_count_result = await db.execute(past_count_query)
    past_appointments_count = past_count_result.scalar() or 0
    
    return PatientDetailResponse(
        **PatientResponse.model_validate(patient).model_dump(),
        upcoming_appointments=[
            {
                "id": str(a.id),
                "date": a.date,
                "start_time": a.start_time,
                "doctor_name": a.doctor.name if a.doctor else None,
                "status": a.status.value,
            }
            for a in upcoming_appointments
        ],
        past_appointments_count=past_appointments_count,
    )


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    data: PatientCreate,
    current_user: User = Depends(require_permission(Permission.CREATE_PATIENT)),
    db: AsyncSession = Depends(get_db),
) -> PatientResponse:
    """Create a new patient."""
    # Check for duplicate phone/email
    existing_query = select(Patient).where(
        Patient.clinic_id == current_user.clinic_id,
        or_(
            Patient.phone == data.phone if data.phone else False,
            Patient.email == data.email if data.email else False,
        )
    )
    existing_result = await db.execute(existing_query)
    existing = existing_result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Patient with this phone or email already exists",
        )
    
    # Create patient
    patient = Patient(
        clinic_id=current_user.clinic_id,
        first_name=data.first_name,
        last_name=data.last_name,
        date_of_birth=data.date_of_birth,
        phone=data.phone,
        email=data.email,
        address=data.address,
        insurance_provider=data.insurance_provider,
        insurance_id=data.insurance_id,
        emergency_contact_name=data.emergency_contact_name,
        emergency_contact_phone=data.emergency_contact_phone,
        notes=data.notes,
        preferred_language=data.preferred_language,
        preferred_contact_method=data.preferred_contact_method,
    )
    
    db.add(patient)
    await db.commit()
    await db.refresh(patient)
    
    return PatientResponse.model_validate(patient)


@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: UUID,
    data: PatientUpdate,
    current_user: User = Depends(require_permission(Permission.UPDATE_PATIENT)),
    db: AsyncSession = Depends(get_db),
) -> PatientResponse:
    """Update a patient."""
    query = select(Patient).where(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Update fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    await db.commit()
    await db.refresh(patient)
    
    return PatientResponse.model_validate(patient)


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: UUID,
    current_user: User = Depends(require_permission(Permission.DELETE_PATIENT)),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate a patient (soft delete)."""
    query = select(Patient).where(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id,
    )
    
    result = await db.execute(query)
    patient = result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Soft delete
    patient.is_active = False
    await db.commit()


@router.get("/{patient_id}/appointments", response_model=PatientAppointmentHistory)
async def get_patient_appointments(
    patient_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    pagination: PaginationParams = Depends(),
    include_cancelled: bool = Query(False, description="Include cancelled appointments"),
) -> PatientAppointmentHistory:
    """Get appointment history for a patient."""
    # Verify patient access
    patient_query = select(Patient).where(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id,
    )
    patient_result = await db.execute(patient_query)
    patient = patient_result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Build query
    query = select(Appointment).where(
        Appointment.patient_id == patient_id,
    ).options(
        selectinload(Appointment.doctor)
    )
    
    if not include_cancelled:
        query = query.where(Appointment.status != AppointmentStatus.CANCELLED)
    
    # Count total
    count_query = select(func.count(Appointment.id)).where(
        Appointment.patient_id == patient_id
    )
    count_result = await db.execute(count_query)
    total_count = count_result.scalar() or 0
    
    # Order and paginate
    query = query.order_by(Appointment.date.desc(), Appointment.start_time.desc())
    query = query.offset(pagination.offset).limit(pagination.page_size)
    
    result = await db.execute(query)
    appointments = result.scalars().all()
    
    return PatientAppointmentHistory(
        patient_id=patient_id,
        patient_name=f"{patient.first_name} {patient.last_name}",
        appointments=[
            {
                "id": str(a.id),
                "date": a.date,
                "start_time": a.start_time,
                "end_time": a.end_time,
                "doctor_name": a.doctor.name if a.doctor else None,
                "visit_type": a.visit_type.value,
                "status": a.status.value,
                "reason_for_visit": a.reason_for_visit,
            }
            for a in appointments
        ],
        total_count=total_count,
    )


@router.get("/{patient_id}/cancellations", response_model=PatientCancellationHistory)
async def get_patient_cancellations(
    patient_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PatientCancellationHistory:
    """Get cancellation history for a patient."""
    # Verify patient access
    patient_query = select(Patient).where(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id,
    )
    patient_result = await db.execute(patient_query)
    patient = patient_result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Get cancellations
    query = select(Cancellation).where(
        Cancellation.patient_id == patient_id,
    ).order_by(Cancellation.cancelled_at.desc())
    
    result = await db.execute(query)
    cancellations = result.scalars().all()
    
    late_cancel_count = sum(1 for c in cancellations if c.is_late_cancel)
    
    return PatientCancellationHistory(
        patient_id=patient_id,
        patient_name=f"{patient.first_name} {patient.last_name}",
        total_cancellations=len(cancellations),
        late_cancellations=late_cancel_count,
        no_shows=patient.no_show_count,
        cancellations=[
            {
                "id": str(c.id),
                "appointment_id": str(c.appointment_id),
                "reason": c.reason,
                "cancelled_by": c.cancelled_by,
                "cancelled_at": c.cancelled_at,
                "is_late_cancel": c.is_late_cancel,
                "notice_hours": c.notice_hours,
            }
            for c in cancellations
        ],
    )


@router.post("/{patient_id}/assign-doctor")
async def assign_doctor_to_patient(
    patient_id: UUID,
    doctor_id: UUID,
    is_primary: bool = False,
    current_user: User = Depends(require_permission(Permission.UPDATE_PATIENT)),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Assign a doctor to a patient."""
    # Verify patient
    patient_query = select(Patient).where(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id,
    )
    patient_result = await db.execute(patient_query)
    patient = patient_result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )
    
    # Verify doctor
    doctor_query = select(Doctor).where(
        Doctor.id == doctor_id,
        Doctor.clinic_id == current_user.clinic_id,
    )
    doctor_result = await db.execute(doctor_query)
    doctor = doctor_result.scalar_one_or_none()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found",
        )
    
    # Check if relationship already exists
    existing_query = select(DoctorPatientRelationship).where(
        DoctorPatientRelationship.doctor_id == doctor_id,
        DoctorPatientRelationship.patient_id == patient_id,
    )
    existing_result = await db.execute(existing_query)
    existing = existing_result.scalar_one_or_none()
    
    if existing:
        existing.is_primary = is_primary
    else:
        # If setting as primary, unset other primaries
        if is_primary:
            primary_query = select(DoctorPatientRelationship).where(
                DoctorPatientRelationship.patient_id == patient_id,
                DoctorPatientRelationship.is_primary == True,
            )
            primary_result = await db.execute(primary_query)
            for rel in primary_result.scalars().all():
                rel.is_primary = False
        
        # Create new relationship
        relationship = DoctorPatientRelationship(
            doctor_id=doctor_id,
            patient_id=patient_id,
            is_primary=is_primary,
        )
        db.add(relationship)
    
    await db.commit()
    
    return {
        "message": "Doctor assigned to patient",
        "doctor_id": str(doctor_id),
        "patient_id": str(patient_id),
        "is_primary": is_primary,
    }
