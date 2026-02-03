"""Seed script for initial data"""
import sys
from pathlib import Path

# Add parent directory to path so imports work when running directly
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import (
    Clinic, User, Doctor, Patient, Appointment, IntakeForm, AIIntakeSummary,
    VoiceAILog, AutomationRule, AutomationExecution, ClinicSettings, DoctorCapacity, OwnerMetrics, Invite
)
from app.core.security import hash_password
from datetime import date, time, timedelta, datetime
import random

# Create all tables
Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()


def clear_data():
    """Clear existing data"""
    print("Clearing existing data...")
    # Delete in order to respect foreign key constraints
    # Owner/automation related tables first
    db.query(AutomationExecution).delete()
    db.query(AutomationRule).delete()
    db.query(VoiceAILog).delete()
    db.query(OwnerMetrics).delete()
    db.query(DoctorCapacity).delete()
    db.query(ClinicSettings).delete()
    db.query(Invite).delete()
    
    # Then intake and appointments
    db.query(AIIntakeSummary).delete()
    db.query(IntakeForm).delete()
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


def create_owner(clinic_id):
    """Create owner user"""
    print("Creating owner user...")
    owner = User(
        email="owner@clinic.com",
        password_hash=hash_password("owner123"),
        name="Clinic Owner",
        role="owner",
        clinic_id=clinic_id,
        status="active"
    )
    db.add(owner)
    db.commit()
    db.refresh(owner)
    return owner


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
        },
        {
            "name": "Dr. James Anderson",
            "initials": "JA",
            "specialty": "Orthopedics",
            "color": "#FF6B35",
            "email": "james.anderson@clinic.com"
        },
        {
            "name": "Dr. Maria Garcia",
            "initials": "MG",
            "specialty": "Neurology",
            "color": "#2E86AB",
            "email": "maria.garcia@clinic.com"
        },
        {
            "name": "Dr. Robert Kim",
            "initials": "RK",
            "specialty": "Oncology",
            "color": "#A23B72",
            "email": "robert.kim@clinic.com"
        },
        {
            "name": "Dr. Lisa Johnson",
            "initials": "LJ",
            "specialty": "Psychiatry",
            "color": "#F18F01",
            "email": "lisa.johnson@clinic.com"
        },
        {
            "name": "Dr. Thomas Brown",
            "initials": "TB",
            "specialty": "Endocrinology",
            "color": "#06A77D",
            "email": "thomas.brown@clinic.com"
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
    """Create diverse sample patients"""
    print("Creating patients...")
    
    first_names = [
        "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Jessica", "William", "Amanda",
        "Christopher", "Ashley", "Daniel", "Michelle", "Matthew", "Melissa", "Anthony", "Stephanie", "Mark", "Nicole",
        "James", "Elizabeth", "Joseph", "Lauren", "Andrew", "Kimberly", "Ryan", "Samantha", "Joshua", "Amanda",
        "Kevin", "Rachel", "Brian", "Lisa", "George", "Nancy", "Edward", "Karen", "Ronald", "Betty"
    ]
    last_names = [
        "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
        "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee",
        "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
        "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams"
    ]
    
    patients = []
    for i in range(40):
        first = random.choice(first_names)
        last = random.choice(last_names)
        patient = Patient(
            clinic_id=clinic_id,
            first_name=first,
            last_name=last,
            email=f"{first.lower()}.{last.lower()}{i}@email.com",
            phone=f"555-{1000 + i:04d}"
        )
        db.add(patient)
        patients.append(patient)
    
    db.commit()
    return patients


def create_appointments(clinic_id, doctors, patients):
    """Create diverse appointments across last 30 days and next 30 days for admin dashboard analytics"""
    print("Creating appointments...")
    
    today = date.today()
    visit_types = ["in-clinic", "virtual"]
    visit_categories = ["new-patient", "follow-up"]  # Only valid values per database constraint
    intake_statuses = ["completed", "missing", "sent"]  # Only valid values per database constraint
    
    appointments = []
    
    # Create appointments matching the user's requirements:
    # - Dr. Sarah Chen: 6 appointments, 0% no-show
    # - Dr. Michael Park: 2 appointments, 0% no-show
    # - Dr. Jennifer Williams: 2 appointments, 0% no-show
    # - Dr. David Rodriguez: 3 appointments, 0% no-show
    # - Dr. Emily Thompson: 5 appointments, 20% no-show (1 no-show)
    # - In-Clinic: 6 appointments, 16.7% no-show (1 no-show)
    # - Video Call: 12 appointments, 0% no-show
    # - Wednesday: 50% no-show (1 out of 2)
    
    # Map doctors by name
    doctor_map = {}
    for doctor in doctors:
        doctor_map[doctor.name] = doctor
    
    # Dr. Sarah Chen: 6 appointments (all confirmed/completed, no no-shows)
    sarah = doctor_map.get("Dr. Sarah Chen")
    if sarah:
        for i in range(6):
            days_offset = random.randint(-7, 7)
            appt_date = today + timedelta(days=days_offset)
            hour = random.randint(8, 17)
            minute = random.choice([0, 30])
            start_time = time(hour, minute)
            duration = 30
            # Calculate end time properly handling minute overflow
            end_minute = minute + duration
            end_hour = hour
            if end_minute >= 60:
                end_hour += 1
                end_minute -= 60
            end_time = time(end_hour, end_minute)
            
            appointment = Appointment(
                clinic_id=clinic_id,
                doctor_id=sarah.id,
                patient_id=random.choice(patients).id,
                date=appt_date,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                visit_type=random.choice(visit_types),
                visit_category=random.choice(visit_categories),
                # Diverse statuses: 4 confirmed, 1 unconfirmed, 1 completed
                status="confirmed" if i < 4 else ("unconfirmed" if i == 4 else "completed"),
                intake_status=random.choice(intake_statuses)
            )
            db.add(appointment)
            appointments.append(appointment)
    
    # Dr. Michael Park: 2 appointments
    michael = doctor_map.get("Dr. Michael Park")
    if michael:
        for i in range(2):
            days_offset = random.randint(-7, 7)
            appt_date = today + timedelta(days=days_offset)
            hour = random.randint(8, 17)
            minute = random.choice([0, 30])
            start_time = time(hour, minute)
            duration = 30
            # Calculate end time properly handling minute overflow
            end_minute = minute + duration
            end_hour = hour
            if end_minute >= 60:
                end_hour += 1
                end_minute -= 60
            end_time = time(end_hour, end_minute)
            
            appointment = Appointment(
                clinic_id=clinic_id,
                doctor_id=michael.id,
                patient_id=random.choice(patients).id,
                date=appt_date,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                visit_type=random.choice(visit_types),
                visit_category=random.choice(visit_categories),
                status="confirmed",
                intake_status=random.choice(intake_statuses)
            )
            db.add(appointment)
            appointments.append(appointment)
    
    # Dr. Jennifer Williams: 2 appointments with diverse statuses
    # 1 confirmed, 1 unconfirmed
    jennifer = doctor_map.get("Dr. Jennifer Williams")
    if jennifer:
        for i in range(2):
            days_offset = random.randint(-7, 7)
            appt_date = today + timedelta(days=days_offset)
            hour = random.randint(8, 17)
            minute = random.choice([0, 30])
            start_time = time(hour, minute)
            duration = 30
            # Calculate end time properly handling minute overflow
            end_minute = minute + duration
            end_hour = hour
            if end_minute >= 60:
                end_hour += 1
                end_minute -= 60
            end_time = time(end_hour, end_minute)
            
            appointment = Appointment(
                clinic_id=clinic_id,
                doctor_id=jennifer.id,
                patient_id=random.choice(patients).id,
                date=appt_date,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                visit_type=random.choice(visit_types),
                visit_category=random.choice(visit_categories),
                status="confirmed" if i == 0 else "unconfirmed",
                intake_status=random.choice(intake_statuses)
            )
            db.add(appointment)
            appointments.append(appointment)
    
    # Dr. David Rodriguez: 3 appointments with diverse statuses
    # 2 confirmed, 1 unconfirmed
    david = doctor_map.get("Dr. David Rodriguez")
    if david:
        for i in range(3):
            days_offset = random.randint(-7, 7)
            appt_date = today + timedelta(days=days_offset)
            hour = random.randint(8, 17)
            minute = random.choice([0, 30])
            start_time = time(hour, minute)
            duration = 30
            # Calculate end time properly handling minute overflow
            end_minute = minute + duration
            end_hour = hour
            if end_minute >= 60:
                end_hour += 1
                end_minute -= 60
            end_time = time(end_hour, end_minute)
            
            appointment = Appointment(
                clinic_id=clinic_id,
                doctor_id=david.id,
                patient_id=random.choice(patients).id,
                date=appt_date,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                visit_type=random.choice(visit_types),
                visit_category=random.choice(visit_categories),
                status="confirmed" if i < 2 else "unconfirmed",
                intake_status=random.choice(intake_statuses)
            )
            db.add(appointment)
            appointments.append(appointment)
    
    # Dr. Emily Thompson: 5 appointments with diverse statuses
    # 1 no-show, 2 confirmed, 1 unconfirmed, 1 completed
    emily = doctor_map.get("Dr. Emily Thompson")
    if emily:
        for i in range(5):
            days_offset = random.randint(-7, 7)
            appt_date = today + timedelta(days=days_offset)
            hour = random.randint(8, 17)
            minute = random.choice([0, 30])
            start_time = time(hour, minute)
            duration = 30
            # Calculate end time properly handling minute overflow
            end_minute = minute + duration
            end_hour = hour
            if end_minute >= 60:
                end_hour += 1
                end_minute -= 60
            end_time = time(end_hour, end_minute)
            
            # Make the first one a no-show on Wednesday
            if i == 0:
                # Find next Wednesday
                days_until_wednesday = (2 - today.weekday()) % 7
                if days_until_wednesday == 0:
                    days_until_wednesday = 7
                appt_date = today + timedelta(days=days_until_wednesday)
                status = "no-show"
            elif i < 3:
                status = "confirmed"
            elif i == 3:
                status = "unconfirmed"
            else:
                status = "completed"
            
            appointment = Appointment(
                clinic_id=clinic_id,
                doctor_id=emily.id,
                patient_id=random.choice(patients).id,
                date=appt_date,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                visit_type="in-clinic",  # The no-show should be in-clinic to match 16.7% rate
                visit_category=random.choice(visit_categories),
                status=status,
                intake_status=random.choice(intake_statuses)
            )
            db.add(appointment)
            appointments.append(appointment)
    
    # Add more appointments to reach totals:
    # - In-Clinic: 6 total (1 no-show = 16.7%)
    # - Video Call: 12 total (0 no-shows = 0%)
    # So we need 5 more in-clinic (already have 1 from Emily) and 12 video call
    
    # Add 5 more in-clinic appointments with diverse statuses
    # 3 confirmed, 1 unconfirmed, 1 cancelled
    for i in range(5):
        doctor = random.choice(doctors)
        days_offset = random.randint(-7, 7)
        appt_date = today + timedelta(days=days_offset)
        hour = random.randint(8, 17)
        minute = random.choice([0, 30])
        start_time = time(hour, minute)
        duration = 30
        # Calculate end time properly handling minute overflow
        end_minute = minute + duration
        end_hour = hour
        if end_minute >= 60:
            end_hour += 1
            end_minute -= 60
        end_time = time(end_hour, end_minute)
        
        # Diverse statuses: 3 confirmed, 1 unconfirmed, 1 cancelled
        if i < 3:
            status = "confirmed"
        elif i == 3:
            status = "unconfirmed"
        else:
            status = "cancelled"
        
        appointment = Appointment(
            clinic_id=clinic_id,
            doctor_id=doctor.id,
            patient_id=random.choice(patients).id,
            date=appt_date,
            start_time=start_time,
            end_time=end_time,
            duration=duration,
            visit_type="in-clinic",
            visit_category=random.choice(visit_categories),
            status=status,
            intake_status=random.choice(intake_statuses)
        )
        db.add(appointment)
        appointments.append(appointment)
    
    # Add 12 video call appointments with diverse statuses
    # 8 confirmed, 3 unconfirmed, 1 cancelled
    for i in range(12):
        doctor = random.choice(doctors)
        days_offset = random.randint(-7, 7)
        appt_date = today + timedelta(days=days_offset)
        hour = random.randint(8, 17)
        minute = random.choice([0, 30])
        start_time = time(hour, minute)
        duration = 30
        # Calculate end time properly handling minute overflow
        end_minute = minute + duration
        end_hour = hour
        if end_minute >= 60:
            end_hour += 1
            end_minute -= 60
        end_time = time(end_hour, end_minute)
        
        # Diverse statuses: 8 confirmed, 3 unconfirmed, 1 cancelled
        if i < 8:
            status = "confirmed"
        elif i < 11:
            status = "unconfirmed"
        else:
            status = "cancelled"
        
        appointment = Appointment(
            clinic_id=clinic_id,
            doctor_id=doctor.id,
            patient_id=random.choice(patients).id,
            date=appt_date,
            start_time=start_time,
            end_time=end_time,
            duration=duration,
            visit_type="virtual",
            visit_category=random.choice(visit_categories),
            status=status,
            intake_status=random.choice(intake_statuses)
        )
        db.add(appointment)
        appointments.append(appointment)
    
    # Add 14 follow-up appointments with diverse statuses
    # 10 confirmed, 3 unconfirmed, 1 completed
    for i in range(14):
        doctor = random.choice(doctors)
        days_offset = random.randint(-7, 7)
        appt_date = today + timedelta(days=days_offset)
        hour = random.randint(8, 17)
        minute = random.choice([0, 30])
        start_time = time(hour, minute)
        duration = 30
        # Calculate end time properly handling minute overflow
        end_minute = minute + duration
        end_hour = hour
        if end_minute >= 60:
            end_hour += 1
            end_minute -= 60
        end_time = time(end_hour, end_minute)
        
        # Diverse statuses: 10 confirmed, 3 unconfirmed, 1 completed
        if i < 10:
            status = "confirmed"
        elif i < 13:
            status = "unconfirmed"
        else:
            status = "completed"
        
        appointment = Appointment(
            clinic_id=clinic_id,
            doctor_id=doctor.id,
            patient_id=random.choice(patients).id,
            date=appt_date,
            start_time=start_time,
            end_time=end_time,
            duration=duration,
            visit_type=random.choice(visit_types),
            visit_category="follow-up",
            status=status,
            intake_status=random.choice(intake_statuses)
        )
        db.add(appointment)
        appointments.append(appointment)
    
    # Create exactly 10 appointments for TODAY's schedule (for admin dashboard)
    print("Creating 10 appointments for today's schedule...")
    today_appointments = []
    # Use different time slots throughout the day (9 AM to 5 PM)
    time_slots = [
        (9, 0), (9, 30), (10, 0), (10, 30), (11, 0),
        (13, 0), (13, 30), (14, 0), (14, 30), (15, 0)
    ]
    
    for i, (hour, minute) in enumerate(time_slots):
        doctor = random.choice(doctors)
        patient = random.choice(patients)
        start_time = time(hour, minute)
        duration = 30
        end_minute = minute + duration
        end_hour = hour
        if end_minute >= 60:
            end_hour += 1
            end_minute -= 60
        end_time = time(end_hour, end_minute)
        
        # Diverse statuses: 6 confirmed, 2 unconfirmed, 1 completed, 1 with missing intake
        if i < 6:
            status = "confirmed"
            intake_status = "completed" if i < 4 else random.choice(["completed", "sent"])
        elif i < 8:
            status = "unconfirmed"
            intake_status = "missing" if i == 6 else random.choice(["missing", "sent"])
        elif i == 8:
            status = "completed"
            intake_status = "completed"
        else:
            status = "confirmed"
            intake_status = "missing"  # This one needs attention
        
        # Mix of visit types
        visit_type = "in-clinic" if i % 2 == 0 else "virtual"
        
        appointment = Appointment(
            clinic_id=clinic_id,
            doctor_id=doctor.id,
            patient_id=patient.id,
            date=today,  # Today's date
            start_time=start_time,
            end_time=end_time,
            duration=duration,
            visit_type=visit_type,
            visit_category=random.choice(visit_categories),
            status=status,
            intake_status=intake_status
        )
        db.add(appointment)
        appointments.append(appointment)
        today_appointments.append(appointment)
    
    # Add appointments across last 7 days for weekly confirmation rate chart
    # Create diverse appointments with varying confirmation rates per day
    for day_offset in range(1, 8):  # Start from 1 to skip today (already created 10)
        target_date = today - timedelta(days=day_offset)
        # Create 5-15 appointments per day with varying confirmation rates
        num_appts = random.randint(5, 15)
        for i in range(num_appts):
            doctor = random.choice(doctors)
            hour = random.randint(8, 17)
            minute = random.choice([0, 15, 30, 45])
            start_time = time(hour, minute)
            duration = 30
            end_minute = minute + duration
            end_hour = hour
            if end_minute >= 60:
                end_hour += 1
                end_minute -= 60
            end_time = time(end_hour, end_minute)
            
            # Vary confirmation rates: earlier days have higher rates
            confirmation_rate = 0.85 - (day_offset * 0.02)  # 85% down to 73%
            status = "confirmed" if random.random() < confirmation_rate else "unconfirmed"
            
            appointment = Appointment(
                clinic_id=clinic_id,
                doctor_id=doctor.id,
                patient_id=random.choice(patients).id,
                date=target_date,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                visit_type=random.choice(visit_types),
                visit_category=random.choice(visit_categories),
                status=status,
                intake_status=random.choice(intake_statuses)
            )
            db.add(appointment)
            appointments.append(appointment)
    
    # Add appointments across last 4 weeks for no-show trend chart
    # Create some no-shows distributed across weeks
    for week_offset in range(4):
        week_start = today - timedelta(weeks=4-week_offset, days=today.weekday())
        week_end = week_start + timedelta(days=6)
        
        # Create 10-20 appointments per week
        num_appts = random.randint(10, 20)
        # Add 1-3 no-shows per week
        no_show_count = random.randint(1, 3)
        
        for i in range(num_appts):
            target_date = week_start + timedelta(days=random.randint(0, 6))
            doctor = random.choice(doctors)
            hour = random.randint(8, 17)
            minute = random.choice([0, 15, 30, 45])
            start_time = time(hour, minute)
            duration = 30
            end_minute = minute + duration
            end_hour = hour
            if end_minute >= 60:
                end_hour += 1
                end_minute -= 60
            end_time = time(end_hour, end_minute)
            
            # Make some appointments no-shows
            if i < no_show_count:
                status = "no-show"
            else:
                status = random.choice(["confirmed", "completed", "unconfirmed"])
            
            appointment = Appointment(
                clinic_id=clinic_id,
                doctor_id=doctor.id,
                patient_id=random.choice(patients).id,
                date=target_date,
                start_time=start_time,
                end_time=end_time,
                duration=duration,
                visit_type=random.choice(visit_types),
                visit_category=random.choice(visit_categories),
                status=status,
                intake_status=random.choice(intake_statuses)
            )
            db.add(appointment)
            appointments.append(appointment)
    
    db.commit()
    return appointments


def create_voice_ai_logs(clinic_id, appointments):
    """Create Voice AI logs matching user requirements"""
    print("Creating Voice AI logs...")
    
    logs = []
    
    # We need logs for two purposes:
    # 1. Recovery sources breakdown:
    #    - Same-Day Cancellations Filled: 48
    #    - Waitlist Outreach Success: 52
    #    - Unconfirmed Appointments Converted: 27
    # 2. AI Performance metrics:
    #    - Total: 60 interactions
    #    - 8 confirmations (for 13.3% success rate)
    #    - 12 escalations
    #    - 40 other (failed, no_answer, voicemail)
    
    # Create recovery source logs first
    # Same-Day Cancellations Filled: 48
    for i in range(48):
        appointment = random.choice(appointments) if appointments else None
        days_ago = random.randint(0, 7)
        hours_ago = random.randint(0, 23)
        initiated_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
        answered_at = initiated_at + timedelta(seconds=random.randint(5, 30))
        duration = random.randint(30, 120)
        ended_at = answered_at + timedelta(seconds=duration)
        
        log = VoiceAILog(
            clinic_id=clinic_id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            call_type="cancellation_fill",
            direction="outbound",
            status="completed",
            outcome=random.choice(["confirmed", "rescheduled"]),
            initiated_at=initiated_at,
            answered_at=answered_at,
            ended_at=ended_at,
            duration_seconds=duration,
            escalated=False,
            from_number="+15551234567",
            to_number=f"+1555{random.randint(1000000, 9999999)}"
        )
        db.add(log)
        logs.append(log)
    
    # Waitlist Outreach Success: 52
    for i in range(52):
        appointment = random.choice(appointments) if appointments else None
        days_ago = random.randint(0, 7)
        hours_ago = random.randint(0, 23)
        initiated_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
        answered_at = initiated_at + timedelta(seconds=random.randint(5, 30))
        duration = random.randint(30, 120)
        ended_at = answered_at + timedelta(seconds=duration)
        
        log = VoiceAILog(
            clinic_id=clinic_id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            call_type="waitlist_outreach",
            direction="outbound",
            status="completed",
            outcome=random.choice(["confirmed", "rescheduled"]),
            initiated_at=initiated_at,
            answered_at=answered_at,
            ended_at=ended_at,
            duration_seconds=duration,
            escalated=False,
            from_number="+15551234567",
            to_number=f"+1555{random.randint(1000000, 9999999)}"
        )
        db.add(log)
        logs.append(log)
    
    # Unconfirmed Appointments Converted: 27
    for i in range(27):
        appointment = random.choice(appointments) if appointments else None
        days_ago = random.randint(0, 7)
        hours_ago = random.randint(0, 23)
        initiated_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
        answered_at = initiated_at + timedelta(seconds=random.randint(5, 30))
        duration = random.randint(30, 120)
        ended_at = answered_at + timedelta(seconds=duration)
        
        log = VoiceAILog(
            clinic_id=clinic_id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            call_type="confirmation",
            direction="outbound",
            status="completed",
            outcome="confirmed",
            initiated_at=initiated_at,
            answered_at=answered_at,
            ended_at=ended_at,
            duration_seconds=duration,
            escalated=False,
            from_number="+15551234567",
            to_number=f"+1555{random.randint(1000000, 9999999)}"
        )
        db.add(log)
        logs.append(log)
    
    # Now create logs for AI Performance metrics (60 total interactions)
    # These will overlap with recovery sources but ensure we have the right totals
    
    # 8 confirmation calls that succeeded (some recent for activity feed)
    for i in range(8):
        appointment = random.choice(appointments) if appointments else None
        # Make some recent (last 24 hours) for activity feed
        if i < 3:
            hours_ago = random.randint(0, 24)
            initiated_at = datetime.now() - timedelta(hours=hours_ago)
        else:
            days_ago = random.randint(1, 7)
            hours_ago = random.randint(0, 23)
            initiated_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
        answered_at = initiated_at + timedelta(seconds=random.randint(5, 30))
        duration = random.randint(30, 120)
        ended_at = answered_at + timedelta(seconds=duration)
        
        log = VoiceAILog(
            clinic_id=clinic_id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            call_type="confirmation",
            direction="outbound",
            status="completed",
            outcome="confirmed",
            initiated_at=initiated_at,
            answered_at=answered_at,
            ended_at=ended_at,
            duration_seconds=duration,
            escalated=False,
            from_number="+15551234567",
            to_number=f"+1555{random.randint(1000000, 9999999)}"
        )
        db.add(log)
        logs.append(log)
    
    # 12 escalated calls (some recent for alerts)
    for i in range(12):
        appointment = random.choice(appointments) if appointments else None
        # Make some recent (last 24 hours) for alerts
        if i < 3:
            hours_ago = random.randint(0, 24)
            initiated_at = datetime.now() - timedelta(hours=hours_ago)
        else:
            days_ago = random.randint(1, 7)
            hours_ago = random.randint(0, 23)
            initiated_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
        answered_at = initiated_at + timedelta(seconds=random.randint(5, 30))
        duration = random.randint(30, 120)
        ended_at = answered_at + timedelta(seconds=duration)
        
        log = VoiceAILog(
            clinic_id=clinic_id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            call_type=random.choice(["confirmation", "reminder", "follow_up"]),
            direction="outbound",
            status="escalated",
            outcome="escalated",
            initiated_at=initiated_at,
            answered_at=answered_at,
            ended_at=ended_at,
            duration_seconds=duration,
            escalated=True,
            escalation_reason="Patient requested human assistance",
            from_number="+15551234567",
            to_number=f"+1555{random.randint(1000000, 9999999)}"
        )
        db.add(log)
        logs.append(log)
    
    # Add 5 recent failed calls (last 24 hours) for alerts
    for i in range(5):
        appointment = random.choice(appointments) if appointments else None
        hours_ago = random.randint(0, 24)
        initiated_at = datetime.now() - timedelta(hours=hours_ago)
        
        log = VoiceAILog(
            clinic_id=clinic_id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            call_type=random.choice(["confirmation", "reminder", "follow_up"]),
            direction="outbound",
            status="failed",
            outcome=None,
            initiated_at=initiated_at,
            answered_at=None,
            ended_at=initiated_at + timedelta(seconds=random.randint(5, 30)),
            duration_seconds=random.randint(5, 30),
            escalated=False,
            from_number="+15551234567",
            to_number=f"+1555{random.randint(1000000, 9999999)}"
        )
        db.add(log)
        logs.append(log)
    
    # 40 other calls (failed, no_answer, voicemail)
    for i in range(40):
        appointment = random.choice(appointments) if appointments else None
        days_ago = random.randint(0, 7)
        hours_ago = random.randint(0, 23)
        initiated_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
        status = random.choice(["failed", "no_answer", "voicemail"])
        answered_at = None if status != "voicemail" else initiated_at + timedelta(seconds=random.randint(5, 30))
        duration = random.randint(0, 60)
        ended_at = initiated_at + timedelta(seconds=duration)
        
        log = VoiceAILog(
            clinic_id=clinic_id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            call_type=random.choice(["confirmation", "reminder", "follow_up", "intake_request"]),
            direction="outbound",
            status=status,
            outcome=None,
            initiated_at=initiated_at,
            answered_at=answered_at,
            ended_at=ended_at,
            duration_seconds=duration,
            escalated=False,
            from_number="+15551234567",
            to_number=f"+1555{random.randint(1000000, 9999999)}"
        )
        db.add(log)
        logs.append(log)
    
    db.commit()
    return logs


def create_automation_rules(clinic_id):
    """Create diverse automation rules"""
    print("Creating automation rules...")
    
    rules_data = [
        {
            "name": "Auto-confirm appointments 24h before",
            "description": "Automatically call patients 24 hours before their appointment to confirm",
            "rule_type": "confirmation",
            "trigger_event": "appointment_24h_before",
            "action_type": "make_call",
            "enabled": True,
            "priority": 1
        },
        {
            "name": "Send intake form 48h before",
            "description": "Send intake form reminder 48 hours before appointment",
            "rule_type": "intake",
            "trigger_event": "appointment_48h_before",
            "action_type": "send_sms",
            "enabled": True,
            "priority": 2
        },
        {
            "name": "Follow-up call 7 days after",
            "description": "Call patients 7 days after appointment for follow-up",
            "rule_type": "follow_up",
            "trigger_event": "appointment_7d_after",
            "action_type": "make_call",
            "enabled": True,
            "priority": 3
        },
        {
            "name": "Reminder for unconfirmed appointments",
            "description": "Send SMS reminder for unconfirmed appointments 12h before",
            "rule_type": "reminder",
            "trigger_event": "appointment_12h_before_unconfirmed",
            "action_type": "send_sms",
            "enabled": True,
            "priority": 1
        },
        {
            "name": "Waitlist auto-fill",
            "description": "Automatically fill cancelled slots from waitlist",
            "rule_type": "waitlist",
            "trigger_event": "appointment_cancelled",
            "action_type": "send_sms",
            "enabled": True,
            "priority": 1
        }
    ]
    
    rules = []
    for rule_data in rules_data:
        rule = AutomationRule(
            clinic_id=clinic_id,
            name=rule_data["name"],
            description=rule_data["description"],
            rule_type=rule_data["rule_type"],
            trigger_event=rule_data["trigger_event"],
            action_type=rule_data["action_type"],
            enabled=rule_data["enabled"],
            priority=rule_data["priority"],
            times_triggered=random.randint(10, 500),
            success_count=random.randint(8, 450),
            failure_count=random.randint(0, 50),
            last_triggered_at=datetime.now() - timedelta(hours=random.randint(1, 48))
        )
        db.add(rule)
        rules.append(rule)
    
    db.commit()
    return rules


def create_automation_executions(clinic_id, rules, appointments):
    """Create automation execution logs with diverse recent activity"""
    print("Creating automation executions...")
    
    statuses = ["success", "failed", "pending", "skipped"]
    
    executions = []
    
    # Create 150 historical executions (older data)
    for i in range(150):
        rule = random.choice(rules)
        appointment = random.choice(appointments) if appointments else None
        
        status = random.choice(statuses)
        triggered_at = datetime.now() - timedelta(hours=random.randint(24, 720))
        completed_at = triggered_at + timedelta(minutes=random.randint(1, 10)) if status != "pending" else None
        
        execution = AutomationExecution(
            clinic_id=clinic_id,
            rule_id=rule.id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            status=status,
            triggered_at=triggered_at,
            completed_at=completed_at,
            result={"action": rule.action_type, "outcome": status}
        )
        db.add(execution)
        executions.append(execution)
    
    # Create 50 recent executions (last 24 hours) for recent activity feed
    for i in range(50):
        rule = random.choice(rules)
        appointment = random.choice(appointments) if appointments else None
        
        # Most recent should be successful for activity feed
        status = "success" if random.random() > 0.2 else random.choice(["failed", "pending"])
        triggered_at = datetime.now() - timedelta(hours=random.randint(0, 24), minutes=random.randint(0, 59))
        completed_at = triggered_at + timedelta(minutes=random.randint(1, 10)) if status != "pending" else None
        
        execution = AutomationExecution(
            clinic_id=clinic_id,
            rule_id=rule.id,
            appointment_id=appointment.id if appointment else None,
            patient_id=appointment.patient_id if appointment else None,
            status=status,
            triggered_at=triggered_at,
            completed_at=completed_at,
            result={"action": rule.action_type, "outcome": status}
        )
        db.add(execution)
        executions.append(execution)
    
    db.commit()
    return executions


def create_owner_metrics(clinic_id):
    """Create diverse owner metrics for past 30 days"""
    print("Creating owner metrics...")
    
    metrics = []
    today = date.today()
    
    for i in range(30):
        metric_date = today - timedelta(days=i)
        
        # Vary metrics over time
        base_no_show_rate = 4.5
        no_show_rate = base_no_show_rate + random.uniform(-1.5, 1.5)
        total_appointments = random.randint(80, 150)
        no_show_count = int(total_appointments * (no_show_rate / 100))
        
        metric = OwnerMetrics(
            clinic_id=clinic_id,
            date=metric_date,
            no_show_rate=round(no_show_rate, 2),
            no_show_count=no_show_count,
            total_appointments=total_appointments,
            appointments_recovered=random.randint(10, 30),
            admin_hours_saved=round(random.uniform(35, 50), 1),
            calls_automated=random.randint(20, 50),
            forms_auto_completed=random.randint(15, 40),
            manual_tasks_avoided=random.randint(10, 30),
            clinic_utilization=round(random.uniform(75, 95), 1),
            estimated_savings=round(random.uniform(1500, 3000), 2)
        )
        db.add(metric)
        metrics.append(metric)
    
    db.commit()
    return metrics


def create_doctor_capacity(clinic_id, doctors):
    """Create doctor capacity data"""
    print("Creating doctor capacity data...")
    
    capacities = []
    today = date.today()
    
    for doctor in doctors:
        for i in range(7):  # Next 7 days
            capacity_date = today + timedelta(days=i)
            booked_slots = random.randint(8, 20)
            total_slots = random.randint(20, 25)
            utilization = round((booked_slots / total_slots) * 100, 1)
            
            capacity = DoctorCapacity(
                clinic_id=clinic_id,
                doctor_id=doctor.id,
                date=capacity_date,
                total_slots=total_slots,
                booked_slots=booked_slots,
                utilization_rate=utilization,
                confirmed_count=random.randint(5, booked_slots),
                unconfirmed_count=random.randint(0, booked_slots - 5),
                completed_count=random.randint(0, booked_slots) if i < 0 else 0,
                cancelled_count=random.randint(0, 3),
                no_show_count=random.randint(0, 2)
            )
            db.add(capacity)
            capacities.append(capacity)
    
    db.commit()
    return capacities


def create_clinic_settings(clinic_id):
    """Create clinic settings"""
    print("Creating clinic settings...")
    
    settings = ClinicSettings(
        clinic_id=clinic_id,
        working_hours={
            "monday": {"start": "09:00", "end": "17:00", "enabled": True},
            "tuesday": {"start": "09:00", "end": "17:00", "enabled": True},
            "wednesday": {"start": "09:00", "end": "17:00", "enabled": True},
            "thursday": {"start": "09:00", "end": "17:00", "enabled": True},
            "friday": {"start": "09:00", "end": "17:00", "enabled": True},
            "saturday": {"start": "09:00", "end": "13:00", "enabled": False},
            "sunday": {"start": "09:00", "end": "13:00", "enabled": False}
        },
        default_appointment_duration=30,
        buffer_between_appointments=15,
        max_appointments_per_day=50,
        confirmation_reminder_hours=24,
        intake_reminder_hours=48,
        follow_up_reminder_days=7,
        voice_ai_enabled=True,
        voice_ai_auto_confirm=True,
        voice_ai_escalation_enabled=True,
        sms_enabled=True,
        sms_confirmation_enabled=True,
        sms_reminder_enabled=True,
        email_enabled=True,
        email_confirmation_enabled=True,
        email_reminder_enabled=True,
        waitlist_enabled=True,
        auto_fill_cancellations=True,
        timezone="America/New_York",
        date_format="MM/DD/YYYY",
        time_format="12h"
    )
    db.add(settings)
    db.commit()
    return settings


def main():
    """Main seed function"""
    print("Starting seed script...")
    
    # Clear existing data
    clear_data()
    
    # Create clinic
    clinic = create_clinic()
    
    # Create owner
    owner = create_owner(clinic.id)
    print(f"Owner created: {owner.email}")
    
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
    
    # Create Voice AI logs
    voice_logs = create_voice_ai_logs(clinic.id, appointments)
    print(f"Created {len(voice_logs)} Voice AI logs")
    
    # Create automation rules
    automation_rules = create_automation_rules(clinic.id)
    print(f"Created {len(automation_rules)} automation rules")
    
    # Create automation executions
    executions = create_automation_executions(clinic.id, automation_rules, appointments)
    print(f"Created {len(executions)} automation executions")
    
    # Create owner metrics
    metrics = create_owner_metrics(clinic.id)
    print(f"Created {len(metrics)} owner metrics")
    
    # Create doctor capacity
    capacities = create_doctor_capacity(clinic.id, doctors)
    print(f"Created {len(capacities)} doctor capacity records")
    
    # Create clinic settings
    settings = create_clinic_settings(clinic.id)
    print(f"Created clinic settings")
    
    print("\nSeed completed successfully!")
    print("\nLogin credentials:")
    print("Owner: owner@clinic.com / owner123")
    print("Admin: admin@clinic.com / admin123")
    print("Doctors: sarah.chen@clinic.com / doctor123 (and others)")


if __name__ == "__main__":
    main()

