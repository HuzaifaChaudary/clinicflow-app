from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date
from app.database import get_db
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.schemas.patient import PatientCreate, PatientUpdate, PatientResponse, PatientList
from app.schemas.appointment import AppointmentResponse
from app.api.deps import get_current_user, require_admin_or_doctor, require_admin
from app.models.user import User

router = APIRouter(prefix="/api/patients", tags=["patients"])


@router.get("", response_model=PatientList)
def list_patients(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search by name, email, or phone"),
    created_after: Optional[date] = Query(None, description="Filter by creation date (after)"),
    created_before: Optional[date] = Query(None, description="Filter by creation date (before)"),
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """List patients - role-based filtering with search and date filters"""
    # Build base query based on role
    if current_user.role == "admin":
        # Admin sees all patients in clinic
        query = db.query(Patient).filter(Patient.clinic_id == current_user.clinic_id)
    else:
        # Doctor sees only patients with appointments to them
        query = db.query(Patient).join(
            Appointment, Appointment.patient_id == Patient.id
        ).filter(
            Appointment.doctor_id == current_user.doctor_id,
            Patient.clinic_id == current_user.clinic_id
        ).distinct()
    
    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Patient.first_name.ilike(search_term)) |
            (Patient.last_name.ilike(search_term)) |
            (Patient.email.ilike(search_term)) |
            (Patient.phone.ilike(search_term))
        )
    
    # Apply date filters
    if created_after:
        query = query.filter(Patient.created_at >= created_after)
    if created_before:
        query = query.filter(Patient.created_at <= created_before)
    
    # Get total and paginated results
    total = query.count()
    patients = query.offset(skip).limit(limit).all()
    
    return PatientList(
        items=[PatientResponse(
            id=p.id,
            clinic_id=p.clinic_id,
            first_name=p.first_name,
            last_name=p.last_name,
            full_name=p.full_name,
            email=p.email,
            phone=p.phone,
            date_of_birth=p.date_of_birth,
            created_at=p.created_at,
            updated_at=p.updated_at
        ) for p in patients],
        total=total
    )


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: UUID,
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get single patient - role-based access"""
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()
    
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    # Doctor can only see their own patients
    if current_user.role == "doctor":
        has_appointment = db.query(Appointment).filter(
            Appointment.patient_id == patient_id,
            Appointment.doctor_id == current_user.doctor_id
        ).first()
        if not has_appointment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You can only view your own patients"
            )
    
    return PatientResponse(
        id=patient.id,
        clinic_id=patient.clinic_id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        full_name=patient.full_name,
        email=patient.email,
        phone=patient.phone,
        date_of_birth=patient.date_of_birth,
        created_at=patient.created_at,
        updated_at=patient.updated_at
    )


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient_data: PatientCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create new patient - admin only"""
    patient = Patient(
        clinic_id=current_user.clinic_id,
        first_name=patient_data.first_name,
        last_name=patient_data.last_name,
        email=patient_data.email,
        phone=patient_data.phone,
        date_of_birth=patient_data.date_of_birth
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    
    return PatientResponse(
        id=patient.id,
        clinic_id=patient.clinic_id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        full_name=patient.full_name,
        email=patient.email,
        phone=patient.phone,
        date_of_birth=patient.date_of_birth,
        created_at=patient.created_at,
        updated_at=patient.updated_at
    )


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: UUID,
    patient_data: PatientUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update patient - admin only"""
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()
    
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    update_data = patient_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    db.commit()
    db.refresh(patient)
    
    return PatientResponse(
        id=patient.id,
        clinic_id=patient.clinic_id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        full_name=patient.full_name,
        email=patient.email,
        phone=patient.phone,
        date_of_birth=patient.date_of_birth,
        created_at=patient.created_at,
        updated_at=patient.updated_at
    )


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: UUID,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete patient (admin only) - checks for existing appointments"""
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()
    
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    # Check if patient has any appointments
    appointment_count = db.query(Appointment).filter(
        Appointment.patient_id == patient_id
    ).count()
    
    if appointment_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete patient with {appointment_count} existing appointments"
        )
    
    db.delete(patient)
    db.commit()
    return None


@router.get("/{patient_id}/appointments", response_model=List[AppointmentResponse])
def get_patient_appointments(
    patient_id: UUID,
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get patient's appointments"""
    # Verify patient exists and is accessible
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()
    
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    # Doctor can only see their own appointments for this patient
    query = db.query(Appointment).filter(
        Appointment.patient_id == patient_id,
        Appointment.clinic_id == current_user.clinic_id
    )
    
    if current_user.role == "doctor":
        query = query.filter(Appointment.doctor_id == current_user.doctor_id)
    
    appointments = query.all()
    
    return [AppointmentResponse.model_validate(apt) for apt in appointments]

