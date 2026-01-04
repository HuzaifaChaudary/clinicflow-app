"""
Seed Data Script

Creates initial demo data for development and testing.
"""

import asyncio
from datetime import date, datetime, timedelta
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.models import (
    Base,
    Clinic,
    User,
    UserRole,
    Doctor,
    Patient,
    Appointment,
    AppointmentStatus,
    IntakeStatus,
    VisitType,
    IntakeFormTemplate,
    ClinicSettings,
    DoctorSettings,
    DoctorPatientRelationship,
)


async def seed_database():
    """Seed the database with demo data."""
    
    # Create async engine
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # ============== Create Clinic ==============
        clinic = Clinic(
            id=uuid4(),
            name="ClinicFlow Demo Clinic",
            timezone="America/New_York",
            working_days=[0, 1, 2, 3, 4],  # Monday to Friday
            opening_time="08:00",
            closing_time="17:00",
            slot_duration_minutes=30,
        )
        session.add(clinic)
        
        # ============== Create Clinic Settings ==============
        clinic_settings = ClinicSettings(
            clinic_id=clinic.id,
            working_days={"monday": True, "tuesday": True, "wednesday": True, "thursday": True, "friday": True, "saturday": False, "sunday": False},
            clinic_hours={"open": "08:00", "close": "17:00"},
            slot_size=30,
        )
        session.add(clinic_settings)
        
        # ============== Create Users ==============
        
        # Owner
        owner = User(
            id=uuid4(),
            clinic_id=clinic.id,
            email="owner@clinicflow.demo",
            first_name="John",
            last_name="Owner",
            role=UserRole.OWNER,
            google_id="demo_owner_google_id",
            is_active=True,
        )
        session.add(owner)
        
        # Admin
        admin = User(
            id=uuid4(),
            clinic_id=clinic.id,
            email="admin@clinicflow.demo",
            first_name="Sarah",
            last_name="Admin",
            role=UserRole.ADMIN,
            google_id="demo_admin_google_id",
            is_active=True,
        )
        session.add(admin)
        
        # Doctor Users
        doctor_user_1 = User(
            id=uuid4(),
            clinic_id=clinic.id,
            email="dr.smith@clinicflow.demo",
            first_name="Michael",
            last_name="Smith",
            role=UserRole.DOCTOR,
            google_id="demo_doctor1_google_id",
            is_active=True,
        )
        session.add(doctor_user_1)
        
        doctor_user_2 = User(
            id=uuid4(),
            clinic_id=clinic.id,
            email="dr.johnson@clinicflow.demo",
            first_name="Emily",
            last_name="Johnson",
            role=UserRole.DOCTOR,
            google_id="demo_doctor2_google_id",
            is_active=True,
        )
        session.add(doctor_user_2)
        
        # ============== Create Doctors ==============
        
        doctor_1 = Doctor(
            id=uuid4(),
            clinic_id=clinic.id,
            user_id=doctor_user_1.id,
            name="Dr. Michael Smith",
            initials="MS",
            specialty="General Practice",
            color="#3B82F6",  # Blue
            working_hours={
                "monday": {"start": "08:00", "end": "17:00"},
                "tuesday": {"start": "08:00", "end": "17:00"},
                "wednesday": {"start": "08:00", "end": "17:00"},
                "thursday": {"start": "08:00", "end": "17:00"},
                "friday": {"start": "08:00", "end": "14:00"},
            },
            default_visit_length=30,
            allows_virtual_visits=True,
            allows_walkins=True,
            is_active=True,
        )
        session.add(doctor_1)
        
        doctor_2 = Doctor(
            id=uuid4(),
            clinic_id=clinic.id,
            user_id=doctor_user_2.id,
            name="Dr. Emily Johnson",
            initials="EJ",
            specialty="Internal Medicine",
            color="#10B981",  # Green
            working_hours={
                "monday": {"start": "09:00", "end": "18:00"},
                "tuesday": {"start": "09:00", "end": "18:00"},
                "wednesday": {"start": "09:00", "end": "18:00"},
                "thursday": {"start": "09:00", "end": "18:00"},
                "friday": {"start": "09:00", "end": "15:00"},
            },
            default_visit_length=30,
            allows_virtual_visits=True,
            allows_walkins=False,
            is_active=True,
        )
        session.add(doctor_2)
        
        # Create doctor settings
        session.add(DoctorSettings(doctor_id=doctor_1.id))
        session.add(DoctorSettings(doctor_id=doctor_2.id))
        
        # ============== Create Patients ==============
        
        patients = []
        patient_data = [
            ("Alice", "Williams", "1985-03-15", "555-0101", "alice.williams@email.com"),
            ("Bob", "Brown", "1972-07-22", "555-0102", "bob.brown@email.com"),
            ("Carol", "Davis", "1990-11-08", "555-0103", "carol.davis@email.com"),
            ("David", "Miller", "1968-01-30", "555-0104", "david.miller@email.com"),
            ("Eve", "Wilson", "1995-05-12", "555-0105", "eve.wilson@email.com"),
            ("Frank", "Moore", "1982-09-25", "555-0106", "frank.moore@email.com"),
            ("Grace", "Taylor", "1978-04-18", "555-0107", "grace.taylor@email.com"),
            ("Henry", "Anderson", "1988-12-03", "555-0108", "henry.anderson@email.com"),
            ("Ivy", "Thomas", "1992-06-28", "555-0109", "ivy.thomas@email.com"),
            ("Jack", "Jackson", "1975-02-14", "555-0110", "jack.jackson@email.com"),
        ]
        
        for first, last, dob, phone, email in patient_data:
            patient = Patient(
                id=uuid4(),
                clinic_id=clinic.id,
                first_name=first,
                last_name=last,
                date_of_birth=datetime.strptime(dob, "%Y-%m-%d").date(),
                phone=phone,
                email=email,
                is_active=True,
            )
            session.add(patient)
            patients.append(patient)
        
        # Assign primary doctors to patients
        for i, patient in enumerate(patients):
            doctor = doctor_1 if i % 2 == 0 else doctor_2
            session.add(DoctorPatientRelationship(
                doctor_id=doctor.id,
                patient_id=patient.id,
                is_primary=True,
            ))
        
        # ============== Create Intake Form Template ==============
        
        intake_template = IntakeFormTemplate(
            id=uuid4(),
            clinic_id=clinic.id,
            name="Standard Patient Intake",
            description="General patient intake form",
            sections=[
                {
                    "title": "Personal Information",
                    "fields": [
                        {"name": "full_name", "label": "Full Name", "type": "text", "required": True},
                        {"name": "date_of_birth", "label": "Date of Birth", "type": "date", "required": True},
                        {"name": "phone", "label": "Phone Number", "type": "tel", "required": True},
                        {"name": "email", "label": "Email", "type": "email", "required": False},
                    ]
                },
                {
                    "title": "Medical History",
                    "fields": [
                        {"name": "allergies", "label": "Known Allergies", "type": "textarea", "required": False},
                        {"name": "current_medications", "label": "Current Medications", "type": "textarea", "required": False},
                        {"name": "medical_conditions", "label": "Existing Medical Conditions", "type": "textarea", "required": False},
                    ]
                },
                {
                    "title": "Visit Information",
                    "fields": [
                        {"name": "chief_complaint", "label": "Reason for Visit", "type": "textarea", "required": True},
                        {"name": "symptoms", "label": "Current Symptoms", "type": "textarea", "required": False},
                        {"name": "symptom_duration", "label": "How long have you had these symptoms?", "type": "text", "required": False},
                    ]
                },
                {
                    "title": "Emergency Contact",
                    "fields": [
                        {"name": "emergency_contact_name", "label": "Emergency Contact Name", "type": "text", "required": False},
                        {"name": "emergency_contact_phone", "label": "Emergency Contact Phone", "type": "tel", "required": False},
                    ]
                },
            ],
            is_active=True,
            is_default=True,
            created_by=owner.id,
        )
        session.add(intake_template)
        
        # ============== Create Appointments ==============
        
        today = date.today()
        appointments_data = [
            # Today's appointments
            (patients[0], doctor_1, today, "09:00", "09:30", AppointmentStatus.CONFIRMED, IntakeStatus.COMPLETE, VisitType.IN_PERSON),
            (patients[1], doctor_1, today, "09:30", "10:00", AppointmentStatus.CHECKED_IN, IntakeStatus.COMPLETE, VisitType.IN_PERSON),
            (patients[2], doctor_1, today, "10:00", "10:30", AppointmentStatus.CONFIRMED, IntakeStatus.NOT_STARTED, VisitType.IN_PERSON),
            (patients[3], doctor_2, today, "10:30", "11:00", AppointmentStatus.UNCONFIRMED, IntakeStatus.SENT, VisitType.IN_PERSON),
            (patients[4], doctor_2, today, "11:00", "11:30", AppointmentStatus.CONFIRMED, IntakeStatus.IN_PROGRESS, VisitType.VIDEO),
            (patients[5], doctor_1, today, "14:00", "14:30", AppointmentStatus.CONFIRMED, IntakeStatus.COMPLETE, VisitType.IN_PERSON),
            (patients[6], doctor_2, today, "14:30", "15:00", AppointmentStatus.UNCONFIRMED, IntakeStatus.NOT_STARTED, VisitType.IN_PERSON),
            
            # Tomorrow
            (patients[7], doctor_1, today + timedelta(days=1), "09:00", "09:30", AppointmentStatus.UNCONFIRMED, IntakeStatus.SENT, VisitType.IN_PERSON),
            (patients[8], doctor_2, today + timedelta(days=1), "10:00", "10:30", AppointmentStatus.CONFIRMED, IntakeStatus.NOT_STARTED, VisitType.IN_PERSON),
            (patients[9], doctor_1, today + timedelta(days=1), "11:00", "11:30", AppointmentStatus.UNCONFIRMED, IntakeStatus.NOT_STARTED, VisitType.VIDEO),
            
            # Next week
            (patients[0], doctor_2, today + timedelta(days=7), "09:00", "09:30", AppointmentStatus.UNCONFIRMED, IntakeStatus.NOT_STARTED, VisitType.IN_PERSON),
            (patients[1], doctor_1, today + timedelta(days=7), "10:00", "10:30", AppointmentStatus.UNCONFIRMED, IntakeStatus.NOT_STARTED, VisitType.IN_PERSON),
        ]
        
        for patient, doctor, appt_date, start, end, status, intake, visit_type in appointments_data:
            appointment = Appointment(
                id=uuid4(),
                clinic_id=clinic.id,
                patient_id=patient.id,
                doctor_id=doctor.id,
                date=appt_date,
                start_time=start,
                end_time=end,
                status=status,
                intake_status=intake,
                visit_type=visit_type,
                reason_for_visit="General checkup",
                created_by=admin.id,
            )
            
            if status == AppointmentStatus.CONFIRMED:
                appointment.confirmed_at = datetime.utcnow()
            if status == AppointmentStatus.CHECKED_IN:
                appointment.confirmed_at = datetime.utcnow()
                appointment.checked_in_at = datetime.utcnow()
            
            session.add(appointment)
        
        # Commit all data
        await session.commit()
        
        print("\n" + "="*50)
        print("✅ Database seeded successfully!")
        print("="*50)
        print("\nDemo accounts created:")
        print(f"  Owner:  owner@clinicflow.demo")
        print(f"  Admin:  admin@clinicflow.demo")
        print(f"  Doctor: dr.smith@clinicflow.demo")
        print(f"  Doctor: dr.johnson@clinicflow.demo")
        print("\nNote: These accounts use Google OAuth.")
        print("For development, update the google_id fields or")
        print("configure test Google OAuth credentials.")
        print("="*50 + "\n")
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_database())
