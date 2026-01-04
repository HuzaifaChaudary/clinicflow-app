# ClinicFlow Backend Implementation Plan

## Overview

This document defines the **FastAPI + PostgreSQL backend architecture** for ClinicFlow, aligned with the frontend dashboard analysis and the provided product notes. It identifies gaps between the backend specification and frontend requirements, providing a complete implementation roadmap.

---

## Tech Stack (Backend)

| Component | Technology |
|-----------|------------|
| **Framework** | FastAPI (Python 3.11+) |
| **Database** | PostgreSQL 15+ |
| **ORM** | SQLAlchemy 2.0 + Alembic (migrations) |
| **Cache/Queue** | Redis |
| **Real-time** | WebSockets (FastAPI native) |
| **Auth** | JWT (python-jose) + refresh tokens |
| **AI** | OpenAI API (GPT-4) |
| **Validation** | Pydantic v2 |
| **Task Queue** | Celery + Redis (for async AI tasks) |

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry
│   ├── config.py               # Settings & env vars
│   ├── database.py             # DB connection
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── clinic.py
│   │   ├── doctor.py
│   │   ├── patient.py
│   │   ├── appointment.py
│   │   ├── intake.py
│   │   ├── ai_summary.py
│   │   ├── ai_interaction.py
│   │   ├── settings.py
│   │   └── audit_log.py
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── appointment.py
│   │   ├── patient.py
│   │   ├── intake.py
│   │   ├── ai.py
│   │   └── dashboard.py
│   │
│   ├── api/                    # Route handlers
│   │   ├── __init__.py
│   │   ├── deps.py             # Dependencies (auth, db)
│   │   ├── auth.py
│   │   ├── appointments.py
│   │   ├── patients.py
│   │   ├── intake.py
│   │   ├── ai.py
│   │   ├── dashboard/
│   │   │   ├── admin.py
│   │   │   ├── doctor.py
│   │   │   └── owner.py
│   │   ├── settings.py
│   │   └── websocket.py
│   │
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── appointment_service.py
│   │   ├── patient_service.py
│   │   ├── intake_service.py
│   │   ├── ai_service.py
│   │   ├── metrics_service.py
│   │   └── notification_service.py
│   │
│   ├── core/                   # Core utilities
│   │   ├── security.py         # JWT, hashing
│   │   ├── permissions.py      # Role-based access
│   │   └── exceptions.py
│   │
│   └── tasks/                  # Celery tasks
│       ├── __init__.py
│       └── ai_tasks.py
│
├── alembic/                    # DB migrations
├── tests/
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

---

## Database Schema (PostgreSQL)

### Core Tables

```sql
-- ==========================================
-- USERS & AUTH
-- ==========================================

CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'doctor', 'owner')),
    clinic_id UUID REFERENCES clinics(id),
    doctor_id UUID NULL,  -- Links to doctors table if role='doctor'
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(10),
    specialty VARCHAR(100),
    color VARCHAR(20),  -- For calendar UI
    working_hours JSONB DEFAULT '{}',
    default_visit_length INTEGER DEFAULT 30,
    voice_ai_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- PATIENTS
-- ==========================================

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    primary_doctor_id UUID REFERENCES doctors(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    first_visit_date DATE,
    contact_preferences JSONB DEFAULT '{"sms": true, "email": true, "voice": true}',
    flags JSONB DEFAULT '{}',  -- VIP, needs_interpreter, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- APPOINTMENTS
-- ==========================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    doctor_id UUID REFERENCES doctors(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    
    -- Scheduling
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER DEFAULT 30,  -- minutes
    
    -- Type & Status
    visit_type VARCHAR(20) CHECK (visit_type IN ('in-clinic', 'virtual')),
    visit_category VARCHAR(20) CHECK (visit_category IN ('new-patient', 'follow-up')),
    status VARCHAR(20) DEFAULT 'unconfirmed' 
        CHECK (status IN ('confirmed', 'unconfirmed', 'cancelled', 'completed', 'no-show')),
    
    -- Intake
    intake_status VARCHAR(20) DEFAULT 'missing'
        CHECK (intake_status IN ('missing', 'sent', 'completed')),
    
    -- Flags
    arrived BOOLEAN DEFAULT false,
    arrived_at TIMESTAMP,
    needs_attention BOOLEAN DEFAULT false,
    attention_reason VARCHAR(100),
    
    -- Video visits
    meeting_link VARCHAR(500),
    
    -- Rescheduling
    rescheduled BOOLEAN DEFAULT false,
    rescheduled_from UUID REFERENCES appointments(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_clinic_date ON appointments(clinic_id, date);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ==========================================
-- CANCELLATIONS (Frontend requires detailed tracking)
-- ==========================================

CREATE TABLE cancellations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES appointments(id) NOT NULL,
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    
    cancellation_type VARCHAR(30) NOT NULL
        CHECK (cancellation_type IN ('patient-cancelled', 'no-show', 'rescheduled-externally', 'clinic-cancelled', 'other')),
    reason_note TEXT,
    cancelled_by UUID REFERENCES users(id),
    cancelled_by_name VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- INTAKE FORMS
-- ==========================================

CREATE TABLE intake_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    appointment_id UUID REFERENCES appointments(id),
    
    raw_answers JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'submitted', 'reviewed')),
    
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- AI INTAKE SUMMARY (MVP Critical)
-- ==========================================

CREATE TABLE ai_intake_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    appointment_id UUID REFERENCES appointments(id) NOT NULL,
    intake_form_id UUID REFERENCES intake_forms(id) NOT NULL,
    
    summary_text TEXT NOT NULL,
    patient_concerns TEXT[],  -- Array of concerns extracted
    medications TEXT[],
    allergies TEXT[],
    key_notes TEXT,
    
    model_version VARCHAR(50) DEFAULT 'gpt-4',
    status VARCHAR(20) DEFAULT 'generated'
        CHECK (status IN ('generating', 'generated', 'failed', 'edited')),
    
    generated_at TIMESTAMP DEFAULT NOW(),
    edited_at TIMESTAMP,
    edited_by UUID REFERENCES users(id)
);

-- ==========================================
-- AI INTERACTIONS (Voice, SMS, Email placeholder)
-- ==========================================

CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    appointment_id UUID REFERENCES appointments(id),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES doctors(id),
    
    channel VARCHAR(20) NOT NULL
        CHECK (channel IN ('voice', 'sms', 'email')),
    direction VARCHAR(20) NOT NULL
        CHECK (direction IN ('outbound', 'inbound')),
    
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'in-progress', 'completed', 'failed', 'escalated', 'no-answer')),
    
    -- Content
    content JSONB NOT NULL,  -- transcript, message body, etc.
    duration VARCHAR(20),    -- For voice calls: "1m 23s"
    
    -- Attention flags
    needs_attention BOOLEAN DEFAULT false,
    attention_reason VARCHAR(50)
        CHECK (attention_reason IN ('complex-question', 'requested-human', 'paused-interaction', 'ambiguous-reply', NULL)),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_interactions_appointment ON ai_interactions(appointment_id);
CREATE INDEX idx_ai_interactions_needs_attention ON ai_interactions(needs_attention) WHERE needs_attention = true;

-- ==========================================
-- DOCTOR NOTES (Frontend requirement - NOT in original notes)
-- ==========================================

CREATE TABLE doctor_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    doctor_id UUID REFERENCES doctors(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    appointment_id UUID REFERENCES appointments(id),
    
    content TEXT NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- FOLLOW-UP SCHEDULING (Frontend requirement - NOT in original notes)
-- ==========================================

CREATE TABLE follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) NOT NULL,
    appointment_id UUID REFERENCES appointments(id),  -- Source appointment
    doctor_id UUID REFERENCES doctors(id) NOT NULL,
    
    scheduled_date DATE NOT NULL,
    note TEXT,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
    
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ==========================================
-- SETTINGS (Expanded from frontend analysis)
-- ==========================================

CREATE TABLE clinic_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) UNIQUE NOT NULL,
    
    -- Working days/hours
    working_days JSONB DEFAULT '{"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": false, "sunday": false}',
    clinic_hours JSONB DEFAULT '{"start": "09:00", "end": "17:00"}',
    slot_size INTEGER DEFAULT 30,  -- 15, 30, or 45 minutes
    
    -- Scheduling rules
    allow_overlapping BOOLEAN DEFAULT false,
    allow_walk_ins BOOLEAN DEFAULT true,
    require_provider BOOLEAN DEFAULT true,
    allow_admin_override BOOLEAN DEFAULT true,
    minimum_cancellation_notice INTEGER DEFAULT 60,  -- minutes
    auto_no_show_threshold INTEGER DEFAULT 15,       -- minutes
    cancellation_reason_required BOOLEAN DEFAULT true,
    
    -- Intake logic
    intake_required BOOLEAN DEFAULT true,
    lock_appointment_if_missing BOOLEAN DEFAULT false,
    allow_manual_completion BOOLEAN DEFAULT true,
    intake_delivery_path VARCHAR(20) DEFAULT 'automatic'
        CHECK (intake_delivery_path IN ('automatic', 'manual', 'ask-every-time')),
    
    -- Voice AI controls
    voice_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    max_call_attempts INTEGER DEFAULT 3,
    call_window_start TIME DEFAULT '09:00',
    call_window_end TIME DEFAULT '18:00',
    retry_delay INTEGER DEFAULT 30,  -- minutes
    
    -- Escalation triggers
    escalate_on_unrecognized BOOLEAN DEFAULT true,
    escalate_on_human_request BOOLEAN DEFAULT true,
    escalate_on_no_response BOOLEAN DEFAULT true,
    escalate_on_ambiguous BOOLEAN DEFAULT false,
    
    -- Notifications
    notify_unconfirmed BOOLEAN DEFAULT true,
    notify_missing_intake BOOLEAN DEFAULT true,
    notify_ai_attention BOOLEAN DEFAULT true,
    notify_cancellations BOOLEAN DEFAULT true,
    notify_no_shows BOOLEAN DEFAULT true,
    notify_via_app BOOLEAN DEFAULT true,
    notify_via_email BOOLEAN DEFAULT false,
    
    -- Data preferences
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    time_format VARCHAR(10) DEFAULT '12h',
    default_dashboard_view VARCHAR(20) DEFAULT 'dashboard',
    auto_refresh_interval INTEGER DEFAULT 30,  -- seconds, 0 = disabled
    
    -- Security
    session_timeout INTEGER DEFAULT 480,  -- minutes
    
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doctor_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctors(id) UNIQUE NOT NULL,
    
    -- Override working hours
    working_hours_override JSONB,
    
    -- Supported visit types
    supported_visit_types TEXT[] DEFAULT ARRAY['in-clinic', 'virtual'],
    video_visits_enabled BOOLEAN DEFAULT true,
    allow_walk_ins BOOLEAN DEFAULT true,
    allow_forced_booking BOOLEAN DEFAULT true,
    
    -- Voice AI per doctor
    voice_ai_enabled BOOLEAN DEFAULT true,
    
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- AUDIT LOG (HIPAA compliance)
-- ==========================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id),
    user_id UUID REFERENCES users(id),
    
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_clinic ON audit_logs(clinic_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
```

---

## Gap Analysis: Frontend vs Backend Notes

### ❌ Missing from Original Notes (Must Add)

| Feature | Frontend Has | Backend Notes | Action Required |
|---------|--------------|---------------|-----------------|
| **Cancellation History** | Full history per patient with reasons | Only mentioned briefly | ✅ Added `cancellations` table |
| **Doctor Notes** | `doctorNotes` array on appointments | Not mentioned | ✅ Added `doctor_notes` table |
| **Follow-up Scheduling** | `nextFollowUp` object | Not mentioned | ✅ Added `follow_ups` table |
| **Voice Call Attempts** | Detailed attempts with timestamps, duration, transcript | Only placeholder `AIInteraction` | ✅ Enhanced `ai_interactions` with duration, detailed status |
| **Message Threading** | SMS/Email with `needsResponse` flag | Basic placeholder | ✅ `content` JSONB in `ai_interactions` stores threads |
| **Patient Contact Preferences** | Phone, email, contact rules | Basic `contact_info` | ✅ Added `contact_preferences` JSONB |
| **Appointment Duration** | Variable duration (15-60 min) | Not explicit | ✅ Added `duration` field |
| **Arrived Status** | `arrived` boolean + timestamp | Not mentioned | ✅ Added both fields |
| **Detailed Settings** | 8 settings tabs with many options | Minimal settings | ✅ Comprehensive `clinic_settings` + `doctor_settings` |
| **Doctor Colors** | For calendar UI | Not mentioned | ✅ Added to `doctors` table |

### ✅ Already Aligned

| Feature | Status |
|---------|--------|
| Role-based access (Admin/Doctor/Owner) | ✅ Aligned |
| AI Intake Summary | ✅ Aligned |
| Basic appointment model | ✅ Aligned |
| Clinic & User models | ✅ Aligned |
| WebSocket events | ✅ Aligned |
| JWT Auth | ✅ Aligned |

---

## API Endpoints

### Authentication

```
POST   /api/auth/login              # Login, returns JWT
POST   /api/auth/refresh            # Refresh token
POST   /api/auth/logout             # Invalidate token
GET    /api/auth/me                 # Current user info
POST   /api/auth/switch-role        # Switch role (same user)
```

### Appointments

```
GET    /api/appointments            # List (role-filtered)
GET    /api/appointments/:id        # Single appointment
POST   /api/appointments            # Create
PUT    /api/appointments/:id        # Update
DELETE /api/appointments/:id        # Soft delete

POST   /api/appointments/:id/confirm      # Confirm appointment
POST   /api/appointments/:id/cancel       # Cancel with reason
POST   /api/appointments/:id/reschedule   # Reschedule
POST   /api/appointments/:id/arrive       # Mark arrived
POST   /api/appointments/:id/complete     # Mark completed
```

### Patients

```
GET    /api/patients                # List (role-filtered)
GET    /api/patients/:id            # Single patient (role-aware serialization)
POST   /api/patients                # Create
PUT    /api/patients/:id            # Update
GET    /api/patients/:id/appointments     # Patient's appointments
GET    /api/patients/:id/cancellations    # Cancellation history
```

### Intake

```
GET    /api/intake/forms            # List intake forms
GET    /api/intake/forms/:id        # Single form
POST   /api/intake/forms            # Submit intake
PUT    /api/intake/forms/:id        # Update form

GET    /api/intake/summaries/:appointment_id   # AI summary for appointment
POST   /api/intake/summaries/:id/regenerate    # Regenerate summary
```

### AI Interactions

```
GET    /api/ai/interactions                    # List (role-filtered)
GET    /api/ai/interactions/:id                # Single interaction
GET    /api/ai/interactions/needs-attention    # Escalated items
POST   /api/ai/interactions/:id/resolve        # Mark resolved
```

### Doctor Notes

```
GET    /api/doctor-notes/patient/:patient_id   # Notes for patient
POST   /api/doctor-notes                       # Create note
PUT    /api/doctor-notes/:id                   # Update note
```

### Follow-ups

```
GET    /api/follow-ups                         # List pending
POST   /api/follow-ups                         # Schedule follow-up
PUT    /api/follow-ups/:id                     # Update
DELETE /api/follow-ups/:id                     # Cancel
```

### Dashboards

```
# Admin Dashboard
GET    /api/dashboard/admin/summary            # Hero card stats
GET    /api/dashboard/admin/schedule/:date     # Day's schedule
GET    /api/dashboard/admin/needs-attention    # Unconfirmed + missing intake
GET    /api/dashboard/admin/cancellations      # Recent cancellations

# Doctor Dashboard
GET    /api/dashboard/doctor/summary           # Doctor's stats
GET    /api/dashboard/doctor/today             # Today's appointments
GET    /api/dashboard/doctor/alerts            # Voice AI alerts

# Owner Dashboard
GET    /api/dashboard/owner/metrics            # Aggregated metrics
GET    /api/dashboard/owner/no-show-rate       # No-show trends
GET    /api/dashboard/owner/ai-impact          # AI effectiveness
GET    /api/dashboard/owner/efficiency         # Admin time saved
```

### Settings

```
GET    /api/settings/clinic                    # Clinic settings
PUT    /api/settings/clinic                    # Update clinic settings
GET    /api/settings/doctor/:id                # Doctor settings
PUT    /api/settings/doctor/:id                # Update doctor settings
GET    /api/settings/users                     # List users (admin only)
POST   /api/settings/users                     # Create user
PUT    /api/settings/users/:id                 # Update user
```

### WebSocket Events

```
ws://api/ws/clinic/:clinic_id

Events:
- appointment_created
- appointment_updated
- appointment_cancelled
- appointment_confirmed
- intake_completed
- ai_interaction_created
- ai_needs_attention
```

---

## Role-Based Query Scoping (FastAPI)

```python
# app/core/permissions.py

from enum import Enum
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Query

class Role(str, Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    OWNER = "owner"

def scope_appointments_query(query: Query, user) -> Query:
    """Apply role-based filtering to appointments query."""
    if user.role == Role.ADMIN:
        return query.filter_by(clinic_id=user.clinic_id)
    
    elif user.role == Role.DOCTOR:
        return query.filter_by(
            clinic_id=user.clinic_id,
            doctor_id=user.doctor_id
        )
    
    elif user.role == Role.OWNER:
        raise HTTPException(403, "Owners cannot access appointments directly")
    
    return query

def scope_patients_query(query: Query, user) -> Query:
    """Apply role-based filtering to patients query."""
    if user.role == Role.ADMIN:
        return query.filter_by(clinic_id=user.clinic_id)
    
    elif user.role == Role.DOCTOR:
        # Doctor sees only patients with appointments to them
        return query.join(Appointment).filter(
            Appointment.doctor_id == user.doctor_id
        ).distinct()
    
    elif user.role == Role.OWNER:
        raise HTTPException(403, "Owners cannot access patient data")
    
    return query
```

---

## AI Service (MVP Implementation)

```python
# app/services/ai_service.py

from openai import OpenAI
from app.models import IntakeForm, AIIntakeSummary
from app.database import get_db

client = OpenAI()

INTAKE_SUMMARY_PROMPT = """
Analyze this patient intake form and provide a concise clinical summary.

Patient Intake Data:
{intake_data}

Provide:
1. Summary (2-3 sentences of key points)
2. Patient concerns (bullet list)
3. Current medications (list)
4. Known allergies (list)
5. Key notes for the doctor

Format as JSON with keys: summary_text, patient_concerns, medications, allergies, key_notes
"""

async def generate_intake_summary(intake_form_id: str, db) -> AIIntakeSummary:
    """Generate AI summary from intake form."""
    
    intake = db.query(IntakeForm).filter_by(id=intake_form_id).first()
    if not intake:
        raise ValueError("Intake form not found")
    
    # Call OpenAI
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": INTAKE_SUMMARY_PROMPT.format(
                intake_data=json.dumps(intake.raw_answers)
            )
        }],
        response_format={"type": "json_object"}
    )
    
    result = json.loads(response.choices[0].message.content)
    
    # Create summary record
    summary = AIIntakeSummary(
        clinic_id=intake.clinic_id,
        patient_id=intake.patient_id,
        appointment_id=intake.appointment_id,
        intake_form_id=intake.id,
        summary_text=result["summary_text"],
        patient_concerns=result.get("patient_concerns", []),
        medications=result.get("medications", []),
        allergies=result.get("allergies", []),
        key_notes=result.get("key_notes"),
        model_version="gpt-4",
        status="generated"
    )
    
    db.add(summary)
    db.commit()
    
    return summary
```

---

## Implementation Order (Cursor Build Sequence)

### Phase 1: Foundation (Week 1)
```
1. [ ] Project setup (FastAPI, PostgreSQL, Docker)
2. [ ] Database models + migrations (Alembic)
3. [ ] Auth system (JWT, role enforcement)
4. [ ] Basic CRUD for clinics, users, doctors
```

### Phase 2: Core Features (Week 2)
```
5. [ ] Patients CRUD with role scoping
6. [ ] Appointments CRUD with status management
7. [ ] Cancellation tracking
8. [ ] Scheduling endpoints
```

### Phase 3: Intake & AI (Week 3)
```
9. [ ] Intake forms CRUD
10. [ ] OpenAI integration
11. [ ] AI intake summary generation
12. [ ] AI interactions placeholder
```

### Phase 4: Dashboards (Week 4)
```
13. [ ] Admin dashboard endpoints
14. [ ] Doctor dashboard endpoints
15. [ ] Owner metrics endpoints
16. [ ] WebSocket real-time sync
```

### Phase 5: Settings & Polish (Week 5)
```
17. [ ] Clinic settings CRUD
18. [ ] Doctor settings CRUD
19. [ ] Doctor notes
20. [ ] Follow-up scheduling
21. [ ] Audit logging
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/clinicflow
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# OpenAI
OPENAI_API_KEY=sk-...

# App
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=["http://localhost:5173"]
```

---

## Docker Compose (Development)

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://clinicflow:clinicflow@db:5432/clinicflow
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./app:/app/app

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: clinicflow
      POSTGRES_PASSWORD: clinicflow
      POSTGRES_DB: clinicflow
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## Summary

### What Was Missing (Now Added)
1. ✅ Detailed cancellation tracking with history
2. ✅ Doctor notes system
3. ✅ Follow-up scheduling
4. ✅ Enhanced AI interactions with duration/transcripts
5. ✅ Comprehensive settings (8 categories from frontend)
6. ✅ Patient contact preferences
7. ✅ Appointment duration & arrived status
8. ✅ Doctor colors for UI

### MVP Scope Confirmed
- ✅ Auth + Role enforcement
- ✅ Full CRUD for all entities
- ✅ AI Intake Summary (OpenAI)
- ✅ Placeholder AI interactions
- ✅ All three dashboards
- ✅ WebSocket sync
- ❌ No billing/insurance
- ❌ No EHR integration
- ❌ No autonomous Voice AI (deferred)

### Ready for Cursor
Hand this document + the frontend `understanding.md` to Cursor and begin implementation in the order specified above.
