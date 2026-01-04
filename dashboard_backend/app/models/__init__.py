"""
Models Package

Export all SQLAlchemy models.
"""

from app.models.clinic import Clinic
from app.models.user import User, UserRole, Session
from app.models.doctor import Doctor, DoctorPatientRelationship
from app.models.patient import Patient
from app.models.appointment import (
    Appointment, 
    VisitType, 
    VisitCategory, 
    AppointmentStatus, 
    IntakeStatus
)
from app.models.cancellation import Cancellation, CancellationType
from app.models.intake import IntakeFormTemplate, IntakeSubmission, IntakeToken
from app.models.doctor_note import DoctorNote
from app.models.follow_up import FollowUp, FollowUpStatus
from app.models.settings import ClinicSettings, DoctorSettings, IntakeDeliveryPath

__all__ = [
    # Clinic
    "Clinic",
    
    # User
    "User",
    "UserRole",
    "Session",
    
    # Doctor
    "Doctor",
    "DoctorPatientRelationship",
    
    # Patient
    "Patient",
    
    # Appointment
    "Appointment",
    "VisitType",
    "VisitCategory",
    "AppointmentStatus",
    "IntakeStatus",
    
    # Cancellation
    "Cancellation",
    "CancellationType",
    
    # Intake
    "IntakeFormTemplate",
    "IntakeSubmission",
    "IntakeToken",
    
    # Doctor Note
    "DoctorNote",
    
    # Follow Up
    "FollowUp",
    "FollowUpStatus",
    
    # Settings
    "ClinicSettings",
    "DoctorSettings",
    "IntakeDeliveryPath",
]
