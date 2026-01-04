"""Seed script for initial data"""
import sys
from pathlib import Path

# Add parent directory to path so imports work when running directly
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Clinic, User, Doctor, Patient, Appointment
from app.core.security import hash_password
from datetime import date, time, timedelta
import random

# Create all tables
Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()


def clear_data():
    """Clear existing data"""
    print("Clearing existing data...")
    # Delete in order to respect foreign key constraints
    db.query(Appointment).delete()
    db.query(Patient).delete()
    
    # Handle circular dependency: set foreign keys to NULL first
    db.query(Doctor).update({Doctor.user_id: None}, synchronize_session=False)
    db.query(User).update({User.doctor_id: None}, synchronize_session=False)
    
    # Now delete users and doctors
    db.query(User).delete()
    db.query(Doctor).delete()
    db.query(Clinic).delete()
    db.commit()


def create_clinic():
    """Create clinic"""
    print("Creating clinic...")
    clinic = Clinic(
        name="Downtown Medical Center",
        timezone="America/New_York"
    )
    db.add(clinic)
    db.commit()
    db.refresh(clinic)
    return clinic


def create_admin(clinic_id):
    """Create admin user"""
    print("Creating admin user...")
    admin = User(
        email="admin@clinic.com",
        password_hash=hash_password("admin123"),
        name="Admin User",
        role="admin",
        clinic_id=clinic_id,
        status="active"
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def create_doctors(clinic_id):
    """Create doctors and their user accounts"""
    print("Creating doctors...")
    
    doctors_data = [
        {
            "name": "Dr. Sarah Chen",
            "initials": "SC",
            "specialty": "Family Medicine",
            "color": "#4A90A4",
            "email": "sarah.chen@clinic.com"
        },
        {
            "name": "Dr. Michael Park",
            "initials": "MP",
            "specialty": "Internal Medicine",
            "color": "#6B8E23",
            "email": "michael.park@clinic.com"
        },
        {
            "name": "Dr. Jennifer Williams",
            "initials": "JW",
            "specialty": "Pediatrics",
            "color": "#8B4513",
            "email": "jennifer.williams@clinic.com"
        },
        {
            "name": "Dr. David Rodriguez",
            "initials": "DR",
            "specialty": "Cardiology",
            "color": "#DC143C",
            "email": "david.rodriguez@clinic.com"
        },
        {
            "name": "Dr. Emily Thompson",
            "initials": "ET",
            "specialty": "Dermatology",
            "color": "#9370DB",
            "email": "emily.thompson@clinic.com"
        }
    ]
    
    doctors = []
    for doc_data in doctors_data:
        # Create doctor
        doctor = Doctor(
            clinic_id=clinic_id,
            name=doc_data["name"],
            initials=doc_data["initials"],
            specialty=doc_data["specialty"],
            color=doc_data["color"]
        )
        db.add(doctor)
        db.flush()
        
        # Create user account for doctor
        user = User(
            email=doc_data["email"],
            password_hash=hash_password("doctor123"),
            name=doc_data["name"],
            role="doctor",
            clinic_id=clinic_id,
            doctor_id=doctor.id,
            status="active"
        )
        db.add(user)
        db.flush()
        
        # Link user to doctor
        doctor.user_id = user.id
        doctors.append(doctor)
    
    db.commit()
    return doctors


def create_patients(clinic_id):
    """Create sample patients"""
    print("Creating patients...")
    
    first_names = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Jessica", "William", "Amanda"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
    
    patients = []
    for i in range(10):
        patient = Patient(
            clinic_id=clinic_id,
            first_name=first_names[i],
            last_name=last_names[i],
            email=f"{first_names[i].lower()}.{last_names[i].lower()}@email.com",
            phone=f"555-{1000 + i}"
        )
        db.add(patient)
        patients.append(patient)
    
    db.commit()
    return patients


def create_appointments(clinic_id, doctors, patients):
    """Create sample appointments"""
    print("Creating appointments...")
    
    today = date.today()
    statuses = ["confirmed", "unconfirmed", "confirmed", "confirmed", "unconfirmed"]
    visit_types = ["in-clinic", "virtual"]
    visit_categories = ["new-patient", "follow-up"]
    intake_statuses = ["completed", "missing", "sent", "completed", "missing"]
    
    appointments = []
    for i in range(20):
        doctor = random.choice(doctors)
        patient = random.choice(patients)
        appt_date = today + timedelta(days=random.randint(0, 7))
        
        # Generate time slots (9 AM to 4:30 PM in 30-minute intervals)
        hour = random.randint(9, 16)
        minute = random.choice([0, 30])
        start_time = time(hour, minute)
        end_time = time(hour, minute + 30 if minute == 0 else hour + 1, 0)
        
        appointment = Appointment(
            clinic_id=clinic_id,
            doctor_id=doctor.id,
            patient_id=patient.id,
            date=appt_date,
            start_time=start_time,
            end_time=end_time,
            duration=30,
            visit_type=random.choice(visit_types),
            visit_category=random.choice(visit_categories),
            status=random.choice(statuses),
            intake_status=random.choice(intake_statuses)
        )
        db.add(appointment)
        appointments.append(appointment)
    
    db.commit()
    return appointments


def main():
    """Main seed function"""
    print("Starting seed script...")
    
    # Clear existing data
    clear_data()
    
    # Create clinic
    clinic = create_clinic()
    
    # Create admin
    admin = create_admin(clinic.id)
    print(f"Admin created: {admin.email}")
    
    # Create doctors
    doctors = create_doctors(clinic.id)
    print(f"Created {len(doctors)} doctors")
    
    # Create patients
    patients = create_patients(clinic.id)
    print(f"Created {len(patients)} patients")
    
    # Create appointments
    appointments = create_appointments(clinic.id, doctors, patients)
    print(f"Created {len(appointments)} appointments")
    
    print("\nSeed completed successfully!")
    print("\nLogin credentials:")
    print("Admin: admin@clinic.com / admin123")
    print("Doctors: sarah.chen@clinic.com / doctor123 (and others)")


if __name__ == "__main__":
    main()

