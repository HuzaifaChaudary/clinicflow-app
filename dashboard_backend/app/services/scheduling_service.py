from datetime import time, timedelta
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.appointment import Appointment
from app.models.doctor import Doctor


def get_available_slots(doctor_id: UUID, date, db: Session) -> list[str]:
    """Get available time slots for a doctor on a given date"""
    # Default working hours: 9 AM to 5 PM
    start_hour = 9
    end_hour = 17
    
    # Get doctor's appointments for the date
    appointments = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.date == date,
        Appointment.status != "cancelled"
    ).all()
    
    # Create set of booked times
    booked_times = set()
    for apt in appointments:
        booked_times.add(apt.start_time)
        # Also block the end time
        booked_times.add(apt.end_time)
    
    # Generate all possible 30-minute slots
    available_slots = []
    current_time = time(start_hour, 0)
    end_time = time(end_hour, 0)
    
    while current_time < end_time:
        # Check if slot is available
        if current_time not in booked_times:
            available_slots.append(current_time.strftime("%H:%M"))
        
        # Move to next 30-minute slot
        hour = current_time.hour
        minute = current_time.minute
        if minute == 0:
            minute = 30
        else:
            hour += 1
            minute = 0
        current_time = time(hour, minute)
    
    return available_slots


def check_slot_available(
    doctor_id: UUID,
    date,
    start_time: time,
    end_time: time,
    db: Session,
    exclude_appointment_id: UUID = None
) -> bool:
    """Check if a time slot is available for booking"""
    # Check if within working hours (9 AM - 5 PM)
    if start_time < time(9, 0) or end_time > time(17, 0):
        return False
    
    # Check for conflicting appointments
    query = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.date == date,
        Appointment.status != "cancelled"
    )
    
    if exclude_appointment_id:
        query = query.filter(Appointment.id != exclude_appointment_id)
    
    conflicting = query.filter(
        # Appointment starts during requested slot
        (Appointment.start_time >= start_time) & (Appointment.start_time < end_time) |
        # Appointment ends during requested slot
        (Appointment.end_time > start_time) & (Appointment.end_time <= end_time) |
        # Appointment spans the entire requested slot
        (Appointment.start_time <= start_time) & (Appointment.end_time >= end_time)
    ).first()
    
    return conflicting is None


def validate_appointment_creation(
    doctor_id: UUID,
    date,
    start_time: time,
    end_time: time,
    db: Session
) -> None:
    """Validate appointment slot availability and raise exception if invalid"""
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Check slot availability
    if not check_slot_available(doctor_id, date, start_time, end_time, db):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Time slot is not available"
        )

