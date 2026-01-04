from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorUpdate, DoctorResponse, DoctorList
from app.api.deps import get_current_user, require_admin_or_doctor, require_admin
from app.models.user import User

router = APIRouter(prefix="/api/doctors", tags=["doctors"])


@router.get("", response_model=DoctorList)
def list_doctors(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """List all doctors in clinic"""
    doctors = db.query(Doctor).filter(Doctor.clinic_id == current_user.clinic_id).offset(skip).limit(limit).all()
    total = db.query(Doctor).filter(Doctor.clinic_id == current_user.clinic_id).count()
    
    return DoctorList(
        items=[DoctorResponse.model_validate(doctor) for doctor in doctors],
        total=total
    )


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(
    doctor_id: UUID,
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get single doctor"""
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id,
        Doctor.clinic_id == current_user.clinic_id
    ).first()
    
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    return DoctorResponse.model_validate(doctor)


@router.post("", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
def create_doctor(
    doctor_data: DoctorCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create new doctor"""
    doctor = Doctor(
        clinic_id=current_user.clinic_id,
        name=doctor_data.name,
        initials=doctor_data.initials,
        specialty=doctor_data.specialty,
        color=doctor_data.color
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    
    return DoctorResponse.model_validate(doctor)


@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(
    doctor_id: UUID,
    doctor_data: DoctorUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update doctor"""
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id,
        Doctor.clinic_id == current_user.clinic_id
    ).first()
    
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    update_data = doctor_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(doctor, field, value)
    
    db.commit()
    db.refresh(doctor)
    
    return DoctorResponse.model_validate(doctor)


@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(
    doctor_id: UUID,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete doctor"""
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id,
        Doctor.clinic_id == current_user.clinic_id
    ).first()
    
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    db.delete(doctor)
    db.commit()
    
    return None

