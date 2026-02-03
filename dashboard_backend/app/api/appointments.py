from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime
from app.database import get_db
from app.config import settings
from app.models.appointment import Appointment
from app.models.cancellation import Cancellation
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.schemas.appointment import (
    AppointmentCreate, AppointmentUpdate, AppointmentResponse, AppointmentList,
    AppointmentConfirm, AppointmentCancel, AppointmentArrive
)
from app.api.deps import get_current_user, require_admin, require_admin_or_doctor, require_owner_or_admin
from app.models.user import User
from app.services.scheduling_service import validate_appointment_creation

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


@router.get("", response_model=AppointmentList)
def list_appointments(
    skip: int = 0,
    limit: int = 100,
    date: Optional[date] = None,
    doctor_id: Optional[UUID] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    intake_status: Optional[str] = None,
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """List appointments with filters and role-based access"""
    query = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(
        Appointment.clinic_id == current_user.clinic_id
    )
    
    # Role-based filtering
    if current_user.role == "doctor":
        query = query.filter(Appointment.doctor_id == current_user.doctor_id)
    
    # Apply filters
    if date:
        query = query.filter(Appointment.date == date)
    if doctor_id:
        query = query.filter(Appointment.doctor_id == doctor_id)
    if status_filter:
        query = query.filter(Appointment.status == status_filter)
    if intake_status:
        query = query.filter(Appointment.intake_status == intake_status)
    
    appointments = query.order_by(Appointment.date, Appointment.start_time).offset(skip).limit(limit).all()
    total = query.count()
    
    return AppointmentList(
        items=[AppointmentResponse.model_validate(apt) for apt in appointments],
        total=total
    )


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: UUID,
    current_user: User = Depends(require_admin_or_doctor),
    db: Session = Depends(get_db)
):
    """Get single appointment with role check"""
    appointment = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    # Doctor can only see their own appointments
    if current_user.role == "doctor" and appointment.doctor_id != current_user.doctor_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only view your own appointments"
        )
    
    return AppointmentResponse.model_validate(appointment)


@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create new appointment - admin only"""
    # Validate doctor exists in clinic
    doctor = db.query(Doctor).filter(
        Doctor.id == appointment_data.doctor_id,
        Doctor.clinic_id == current_user.clinic_id
    ).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    # Validate patient exists in clinic
    patient = db.query(Patient).filter(
        Patient.id == appointment_data.patient_id,
        Patient.clinic_id == current_user.clinic_id
    ).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    # Validate slot availability
    validate_appointment_creation(
        appointment_data.doctor_id,
        appointment_data.date,
        appointment_data.start_time,
        appointment_data.end_time,
        db
    )
    
    appointment = Appointment(
        clinic_id=current_user.clinic_id,
        doctor_id=appointment_data.doctor_id,
        patient_id=appointment_data.patient_id,
        date=appointment_data.date,
        start_time=appointment_data.start_time,
        end_time=appointment_data.end_time,
        duration=appointment_data.duration,
        visit_type=appointment_data.visit_type,
        visit_category=appointment_data.visit_category,
        status="unconfirmed",
        intake_status="missing"
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    # Load relationships
    appointment = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient),
        joinedload(Appointment.clinic)
    ).filter(Appointment.id == appointment.id).first()
    
    # Trigger automation rules for appointment_created (respects clinic settings)
    if settings.AUTOMATION_ENABLED:
        from app.services.automation_service import AutomationService
        automation_service = AutomationService(db, current_user.clinic_id)
        automation_service.process_appointment_created(appointment)
    
    return AppointmentResponse.model_validate(appointment)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    appointment_id: UUID,
    appointment_data: AppointmentUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update appointment - admin only"""
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    update_data = appointment_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appointment, field, value)
    
    db.commit()
    db.refresh(appointment)
    
    # Load relationships
    appointment = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(Appointment.id == appointment.id).first()
    
    return AppointmentResponse.model_validate(appointment)


@router.post("/{appointment_id}/confirm", response_model=AppointmentResponse)
def confirm_appointment(
    appointment_id: UUID,
    current_user: User = Depends(require_owner_or_admin),
    db: Session = Depends(get_db)
):
    """Confirm appointment - owner or admin"""
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    appointment.status = "confirmed"
    db.commit()
    db.refresh(appointment)
    
    # Load relationships
    appointment = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(Appointment.id == appointment.id).first()
    
    return AppointmentResponse.model_validate(appointment)


@router.post("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(
    appointment_id: UUID,
    cancel_data: AppointmentCancel,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Cancel appointment - admin only"""
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    # Create cancellation record
    cancellation = Cancellation(
        appointment_id=appointment.id,
        clinic_id=appointment.clinic_id,
        patient_id=appointment.patient_id,
        cancellation_type=cancel_data.cancellation_type,
        reason_note=cancel_data.reason_note,
        cancelled_by_id=current_user.id
    )
    db.add(cancellation)
    
    # Update appointment status
    appointment.status = "cancelled"
    db.commit()
    db.refresh(appointment)
    
    # Load relationships
    appointment = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(Appointment.id == appointment.id).first()
    
    return AppointmentResponse.model_validate(appointment)


@router.post("/{appointment_id}/arrive", response_model=AppointmentResponse)
def mark_arrived(
    appointment_id: UUID,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Mark patient as arrived - admin only"""
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.clinic_id == current_user.clinic_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    appointment.arrived = True
    appointment.arrived_at = datetime.utcnow()
    db.commit()
    db.refresh(appointment)
    
    # Load relationships
    appointment = db.query(Appointment).options(
        joinedload(Appointment.doctor),
        joinedload(Appointment.patient)
    ).filter(Appointment.id == appointment.id).first()
    
    return AppointmentResponse.model_validate(appointment)

