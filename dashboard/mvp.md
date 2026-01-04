# ClinicFlow MVP Backend Implementation Roadmap

## Pre-Seed Build Scope - Complete Execution Guide

**Purpose:** This document is your complete, line-by-line execution guide for building the MVP backend. Follow each section in order. Check off items as you complete them. No guessing required.

**Timeline:** 3-4 weeks
**Goal:** Working backend that powers Admin + Doctor dashboards with real data

---

## Table of Contents

1. [What We Are Building](#what-we-are-building)
2. [What We Are NOT Building](#what-we-are-not-building)
3. [Tech Stack Decision](#tech-stack-decision)
4. [Phase 1: Project Setup](#phase-1-project-setup-days-1-2)
5. [Phase 2: Database Schema](#phase-2-database-schema-days-3-4)
6. [Phase 3: Authentication System](#phase-3-authentication-system-days-5-7)
7. [Phase 4: Core CRUD APIs](#phase-4-core-crud-apis-days-8-12)
8. [Phase 5: Scheduling Engine](#phase-5-scheduling-engine-days-13-15)
9. [Phase 6: Intake System](#phase-6-intake-system-days-16-18)
10. [Phase 7: AI Intake Summary](#phase-7-ai-intake-summary-days-19-20)
11. [Phase 8: Dashboard APIs](#phase-8-dashboard-apis-days-21-23)
12. [Phase 9: Frontend Integration](#phase-9-frontend-integration-days-24-26)
13. [Phase 10: Demo Preparation](#phase-10-demo-preparation-days-27-28)
14. [API Endpoint Reference](#api-endpoint-reference)
15. [Database Schema Reference](#database-schema-reference)
16. [Environment Variables Reference](#environment-variables-reference)
17. [Demo Script](#demo-script)

---

## What We Are Building

### ✅ MUST BUILD (MVP Scope)

| Feature | Why Required | Backend Work |
|---------|--------------|--------------|
| **Authentication** | Proves product is real, not Figma | JWT login, role enforcement |
| **Role-based Access** | Core product differentiator | Middleware for admin/doctor/owner |
| **Clinics** | Multi-tenant foundation | CRUD + association |
| **Doctors** | Scheduling requires doctors | CRUD + clinic association |
| **Patients** | Core entity | CRUD + role-scoped queries |
| **Appointments** | Heart of the product | Full CRUD + status management |
| **Basic Intake** | Pre-visit workflow proof | Form model + completion status |
| **AI Intake Summary** | "We use AI in production" | OpenAI integration |
| **Admin Dashboard API** | Real data for admin | Aggregated stats endpoint |
| **Doctor Dashboard API** | Real data for doctor | Filtered stats endpoint |

### ❌ Owner Dashboard

**Decision:** Keep hardcoded/mocked in frontend. No backend work.

**Reason:** Owner analytics require historical data pipelines. Not needed for pre-seed. Show structure, not accuracy.

---

## What We Are NOT Building

### ❌ EXPLICITLY EXCLUDED FROM MVP

| Feature | Why Excluded | What To Do Instead |
|---------|--------------|-------------------|
| **Voice AI Calling** | High infra cost, compliance complexity | Keep UI, use mock data |
| **SMS Automation** | Requires Twilio integration, compliance | Keep UI, use mock data |
| **Email Automation** | Not core to demo | Keep UI, use mock data |
| **Automation Rules Engine** | Complex, not needed for demo | Show settings UI only |
| **Owner Analytics Pipeline** | Heavy infra, no ROI for pre-seed | Hardcode metrics in frontend |
| **Escalation Logic** | Voice AI dependent | Keep UI, placeholder responses |
| **Form Builder** | Full builder not needed | Use predefined form templates |
| **Audit Logging** | Nice-to-have, not MVP | Skip entirely |
| **Multi-location Support** | Post-funding feature | Single clinic for MVP |
| **Video Visit Integration** | Zoom/Meet API complexity | Just store meeting_link field |

### Designed But Dormant Features

These features should:
- Exist in the UI (already built in frontend)
- Return placeholder/mock responses from backend
- Not break any flows

| Feature | Backend Response |
|---------|-----------------|
| Voice AI page | Return mock call history |
| Automation settings | Return saved settings, no execution |
| Owner metrics | Frontend uses hardcoded data |

---

## Tech Stack Decision

### Backend Stack (Final)

| Component | Choice | Reason |
|-----------|--------|--------|
| **Framework** | FastAPI (Python 3.11+) | Fast, async, auto-docs |
| **Database** | PostgreSQL 15+ | Reliable, JSONB support |
| **ORM** | SQLAlchemy 2.0 | Industry standard |
| **Migrations** | Alembic | SQLAlchemy compatible |
| **Auth** | JWT (python-jose) | Stateless, simple |
| **Validation** | Pydantic v2 | FastAPI native |
| **AI** | OpenAI API (GPT-4) | Intake summaries |
| **Deployment** | Docker + Docker Compose | Easy local dev |

### NOT Using (MVP)

| Component | Why Excluded |
|-----------|--------------|
| Redis | No caching needed for MVP |
| Celery | No async tasks for MVP |
| WebSockets | Polling is fine for demo |

---

## Phase 1: Project Setup (Days 1-2)

### Day 1: Environment Setup

#### Task 1.1: Create Backend Directory Structure

Create the following folder structure inside `dashboard_backend/`:

```
dashboard_backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   └── __init__.py
│   ├── schemas/
│   │   └── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── deps.py
│   ├── services/
│   │   └── __init__.py
│   └── core/
│       ├── __init__.py
│       ├── security.py
│       └── permissions.py
├── alembic/
├── tests/
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── alembic.ini
├── .env.example
└── README.md
```

**Checklist:**
- [ ] Create `dashboard_backend/` folder
- [ ] Create all subdirectories listed above
- [ ] Create empty `__init__.py` files in each Python directory

#### Task 1.2: Create requirements.txt

Create `dashboard_backend/requirements.txt` with these dependencies:

```
# Core
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1

# Auth
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Validation
pydantic==2.5.3
pydantic-settings==2.1.0
email-validator==2.1.0

# AI
openai==1.10.0

# Utilities
python-dotenv==1.0.0

# Development
pytest==7.4.4
httpx==0.26.0
```

**Checklist:**
- [ ] Create requirements.txt with exact versions
- [ ] Verify no typos in package names

#### Task 1.3: Create Docker Configuration

Create `dashboard_backend/docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://clinicflow:clinicflow@db:5432/clinicflow
    depends_on:
      - db
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

volumes:
  postgres_data:
```

Create `dashboard_backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

**Checklist:**
- [ ] Create docker-compose.yml
- [ ] Create Dockerfile
- [ ] Test with `docker-compose up db` to verify PostgreSQL starts

#### Task 1.4: Create Environment Configuration

Create `dashboard_backend/.env.example`:

```env
# Database
DATABASE_URL=postgresql://clinicflow:clinicflow@localhost:5432/clinicflow

# Auth
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# OpenAI
OPENAI_API_KEY=sk-your-api-key-here

# App
ENVIRONMENT=development
DEBUG=true
```

Create `dashboard_backend/.env` (copy from .env.example and fill in real values)

**Checklist:**
- [ ] Create .env.example
- [ ] Create .env with real values
- [ ] Add .env to .gitignore

### Day 2: FastAPI App Skeleton

#### Task 1.5: Create Main Application Entry

Create `dashboard_backend/app/main.py`:

Purpose: FastAPI application entry point with CORS and router mounting

Contents should:
- Initialize FastAPI app with title "ClinicFlow API"
- Add CORS middleware allowing frontend origin (http://localhost:5173)
- Include health check endpoint at /health
- Mount API routers (will add later)

**Checklist:**
- [ ] Create main.py with FastAPI app
- [ ] Add CORS middleware
- [ ] Add /health endpoint that returns {"status": "ok"}
- [ ] Test by running `uvicorn app.main:app --reload`
- [ ] Verify http://localhost:8000/health returns {"status": "ok"}
- [ ] Verify http://localhost:8000/docs shows Swagger UI

#### Task 1.6: Create Configuration Module

Create `dashboard_backend/app/config.py`:

Purpose: Load environment variables using Pydantic Settings

Settings to include:
- DATABASE_URL: str
- JWT_SECRET_KEY: str
- JWT_ALGORITHM: str (default "HS256")
- ACCESS_TOKEN_EXPIRE_MINUTES: int (default 480)
- OPENAI_API_KEY: str
- ENVIRONMENT: str (default "development")
- DEBUG: bool (default True)

**Checklist:**
- [ ] Create config.py with Settings class
- [ ] Use pydantic_settings.BaseSettings
- [ ] Load from .env file
- [ ] Create settings = Settings() instance

#### Task 1.7: Create Database Connection

Create `dashboard_backend/app/database.py`:

Purpose: SQLAlchemy database connection and session management

Contents should:
- Create SQLAlchemy engine from DATABASE_URL
- Create SessionLocal for database sessions
- Create Base declarative base for models
- Create get_db dependency function

**Checklist:**
- [ ] Create database.py
- [ ] Create engine with config.DATABASE_URL
- [ ] Create SessionLocal sessionmaker
- [ ] Create Base = declarative_base()
- [ ] Create get_db() generator function

#### Task 1.8: Initialize Alembic

Run alembic init to set up migrations:

```bash
cd dashboard_backend
alembic init alembic
```

Update `alembic.ini`:
- Set sqlalchemy.url to use environment variable

Update `alembic/env.py`:
- Import Base from app.database
- Import all models
- Set target_metadata = Base.metadata

**Checklist:**
- [ ] Run alembic init alembic
- [ ] Update alembic.ini
- [ ] Update alembic/env.py to use Base.metadata
- [ ] Test with `alembic current` (should show no migrations yet)

---

## Phase 2: Database Schema (Days 3-4)

### Day 3: Core Models

#### Task 2.1: Create Clinic Model

Create `dashboard_backend/app/models/clinic.py`:

Table: clinics
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key, default gen_random_uuid() |
| name | VARCHAR(255) | NOT NULL |
| timezone | VARCHAR(50) | Default 'America/New_York' |
| created_at | TIMESTAMP | Default NOW() |
| updated_at | TIMESTAMP | Default NOW() |

**Checklist:**
- [ ] Create clinic.py with Clinic model
- [ ] Use SQLAlchemy UUID type
- [ ] Add created_at, updated_at with defaults

#### Task 2.2: Create User Model

Create `dashboard_backend/app/models/user.py`:

Table: users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| role | VARCHAR(20) | NOT NULL, CHECK (admin, doctor, owner) |
| clinic_id | UUID | Foreign Key → clinics.id |
| doctor_id | UUID | Nullable, Foreign Key → doctors.id |
| status | VARCHAR(20) | Default 'active' |
| created_at | TIMESTAMP | Default NOW() |

**Checklist:**
- [ ] Create user.py with User model
- [ ] Add relationship to Clinic
- [ ] Add role enum constraint

#### Task 2.3: Create Doctor Model

Create `dashboard_backend/app/models/doctor.py`:

Table: doctors
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| clinic_id | UUID | Foreign Key → clinics.id, NOT NULL |
| user_id | UUID | Foreign Key → users.id, Nullable |
| name | VARCHAR(255) | NOT NULL |
| initials | VARCHAR(10) | |
| specialty | VARCHAR(100) | |
| color | VARCHAR(20) | For calendar UI |
| created_at | TIMESTAMP | Default NOW() |

**Checklist:**
- [ ] Create doctor.py with Doctor model
- [ ] Add relationship to Clinic
- [ ] Add relationship to User (nullable)

#### Task 2.4: Create Patient Model

Create `dashboard_backend/app/models/patient.py`:

Table: patients
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| clinic_id | UUID | Foreign Key → clinics.id, NOT NULL |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | |
| phone | VARCHAR(20) | |
| date_of_birth | DATE | |
| created_at | TIMESTAMP | Default NOW() |
| updated_at | TIMESTAMP | Default NOW() |

**Checklist:**
- [ ] Create patient.py with Patient model
- [ ] Add relationship to Clinic
- [ ] Add full_name property (computed)

### Day 4: Appointment & Intake Models

#### Task 2.5: Create Appointment Model

Create `dashboard_backend/app/models/appointment.py`:

Table: appointments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| clinic_id | UUID | Foreign Key → clinics.id, NOT NULL |
| doctor_id | UUID | Foreign Key → doctors.id, NOT NULL |
| patient_id | UUID | Foreign Key → patients.id, NOT NULL |
| date | DATE | NOT NULL |
| start_time | TIME | NOT NULL |
| end_time | TIME | NOT NULL |
| duration | INTEGER | Default 30 (minutes) |
| visit_type | VARCHAR(20) | CHECK (in-clinic, virtual) |
| visit_category | VARCHAR(20) | CHECK (new-patient, follow-up) |
| status | VARCHAR(20) | Default 'unconfirmed', CHECK (confirmed, unconfirmed, cancelled, completed, no-show) |
| intake_status | VARCHAR(20) | Default 'missing', CHECK (missing, sent, completed) |
| arrived | BOOLEAN | Default false |
| arrived_at | TIMESTAMP | Nullable |
| meeting_link | VARCHAR(500) | Nullable (for virtual) |
| created_at | TIMESTAMP | Default NOW() |
| updated_at | TIMESTAMP | Default NOW() |

Indexes:
- idx_appointments_clinic_date ON (clinic_id, date)
- idx_appointments_doctor_date ON (doctor_id, date)

**Checklist:**
- [ ] Create appointment.py with Appointment model
- [ ] Add all relationships (clinic, doctor, patient)
- [ ] Add status enum constraints
- [ ] Add indexes for common queries

#### Task 2.6: Create Cancellation Model

Create `dashboard_backend/app/models/cancellation.py`:

Table: cancellations
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| appointment_id | UUID | Foreign Key → appointments.id, NOT NULL |
| clinic_id | UUID | Foreign Key → clinics.id, NOT NULL |
| patient_id | UUID | Foreign Key → patients.id, NOT NULL |
| cancellation_type | VARCHAR(30) | NOT NULL, CHECK (patient-cancelled, no-show, rescheduled, clinic-cancelled, other) |
| reason_note | TEXT | |
| cancelled_by_id | UUID | Foreign Key → users.id |
| created_at | TIMESTAMP | Default NOW() |

**Checklist:**
- [ ] Create cancellation.py with Cancellation model
- [ ] Add relationships

#### Task 2.7: Create Intake Form Model

Create `dashboard_backend/app/models/intake.py`:

Table: intake_forms
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| clinic_id | UUID | Foreign Key → clinics.id, NOT NULL |
| patient_id | UUID | Foreign Key → patients.id, NOT NULL |
| appointment_id | UUID | Foreign Key → appointments.id |
| raw_answers | JSONB | NOT NULL |
| status | VARCHAR(20) | Default 'pending', CHECK (pending, submitted, reviewed) |
| submitted_at | TIMESTAMP | |
| created_at | TIMESTAMP | Default NOW() |

**Checklist:**
- [ ] Create intake.py with IntakeForm model
- [ ] Use JSONB for raw_answers

#### Task 2.8: Create AI Intake Summary Model

Add to `dashboard_backend/app/models/intake.py`:

Table: ai_intake_summaries
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| clinic_id | UUID | Foreign Key → clinics.id, NOT NULL |
| patient_id | UUID | Foreign Key → patients.id, NOT NULL |
| appointment_id | UUID | Foreign Key → appointments.id, NOT NULL |
| intake_form_id | UUID | Foreign Key → intake_forms.id, NOT NULL |
| summary_text | TEXT | NOT NULL |
| patient_concerns | TEXT[] | Array |
| medications | TEXT[] | Array |
| allergies | TEXT[] | Array |
| key_notes | TEXT | |
| model_version | VARCHAR(50) | Default 'gpt-4' |
| status | VARCHAR(20) | Default 'generated' |
| generated_at | TIMESTAMP | Default NOW() |

**Checklist:**
- [ ] Add AIIntakeSummary model to intake.py
- [ ] Use ARRAY type for concerns, medications, allergies

#### Task 2.9: Create Models __init__.py

Update `dashboard_backend/app/models/__init__.py`:

Import all models so Alembic can find them:
- Clinic
- User
- Doctor
- Patient
- Appointment
- Cancellation
- IntakeForm
- AIIntakeSummary

**Checklist:**
- [ ] Update __init__.py with all model imports
- [ ] Verify no circular import issues

#### Task 2.10: Run Initial Migration

Generate and run the first migration:

```bash
alembic revision --autogenerate -m "initial_schema"
alembic upgrade head
```

**Checklist:**
- [ ] Run alembic revision --autogenerate
- [ ] Review generated migration file
- [ ] Run alembic upgrade head
- [ ] Verify tables exist in PostgreSQL
- [ ] Check all constraints and indexes created

---

## Phase 3: Authentication System (Days 5-7)

### Day 5: Security Utilities

#### Task 3.1: Create Password Hashing

Create `dashboard_backend/app/core/security.py`:

Functions to implement:
1. `hash_password(password: str) -> str`
   - Use passlib with bcrypt
   
2. `verify_password(plain: str, hashed: str) -> bool`
   - Verify password against hash

3. `create_access_token(data: dict) -> str`
   - Create JWT with expiration
   - Include user_id, role, clinic_id, doctor_id in payload

4. `decode_access_token(token: str) -> dict`
   - Decode and verify JWT
   - Return payload or raise exception

**Checklist:**
- [ ] Create security.py
- [ ] Implement hash_password
- [ ] Implement verify_password
- [ ] Implement create_access_token
- [ ] Implement decode_access_token
- [ ] Test each function manually

#### Task 3.2: Create Auth Dependencies

Create `dashboard_backend/app/api/deps.py`:

Dependencies to implement:

1. `get_db()`
   - Yield database session
   - Already created in database.py, import here

2. `get_current_user(token: str, db: Session)`
   - Extract token from Authorization header
   - Decode token
   - Query user from database
   - Return user object or raise 401

3. `require_admin(user: User)`
   - Check user.role == "admin"
   - Raise 403 if not

4. `require_doctor(user: User)`
   - Check user.role == "doctor"
   - Raise 403 if not

5. `require_admin_or_doctor(user: User)`
   - Check user.role in ["admin", "doctor"]
   - Raise 403 if not

**Checklist:**
- [ ] Create deps.py
- [ ] Implement get_current_user using OAuth2PasswordBearer
- [ ] Implement role check dependencies
- [ ] Test dependencies can be used in routes

### Day 6: Auth Endpoints

#### Task 3.3: Create Auth Schemas

Create `dashboard_backend/app/schemas/auth.py`:

Schemas to define:

1. `LoginRequest`
   - email: EmailStr
   - password: str

2. `TokenResponse`
   - access_token: str
   - token_type: str = "bearer"

3. `UserResponse`
   - id: UUID
   - email: str
   - name: str
   - role: str
   - clinic_id: UUID
   - doctor_id: UUID | None

**Checklist:**
- [ ] Create auth.py schemas
- [ ] Use Pydantic v2 syntax
- [ ] Add Config for ORM mode

#### Task 3.4: Create Auth Router

Create `dashboard_backend/app/api/auth.py`:

Endpoints to implement:

1. `POST /api/auth/login`
   - Accept email + password
   - Verify credentials
   - Return JWT token
   - Response: TokenResponse

2. `GET /api/auth/me`
   - Requires authentication
   - Return current user info
   - Response: UserResponse

**Checklist:**
- [ ] Create auth.py router
- [ ] Implement login endpoint
- [ ] Implement me endpoint
- [ ] Add router to main.py
- [ ] Test login with Swagger UI

### Day 7: Seed Data

#### Task 3.5: Create Seed Script

Create `dashboard_backend/app/seed.py`:

Purpose: Create initial data for testing

Data to create:

1. **Clinic**
   - Name: "Downtown Medical Center"
   - Timezone: "America/New_York"

2. **Admin User**
   - Email: admin@clinic.com
   - Password: admin123
   - Role: admin

3. **Doctors** (5 doctors matching frontend mock data)
   - Dr. Sarah Chen (Family Medicine)
   - Dr. Michael Park (Internal Medicine)
   - Dr. Jennifer Williams (Pediatrics)
   - Dr. David Rodriguez (Cardiology)
   - Dr. Emily Thompson (Dermatology)

4. **Doctor Users** (for each doctor)
   - Email: sarah.chen@clinic.com, etc.
   - Password: doctor123
   - Role: doctor

5. **Sample Patients** (10 patients)
   - Mix of names
   - Include phone and email

6. **Sample Appointments** (20 appointments)
   - Various dates (today and next 7 days)
   - Various statuses
   - Spread across doctors

**Checklist:**
- [ ] Create seed.py script
- [ ] Add function to clear existing data (for re-running)
- [ ] Add function to create clinic
- [ ] Add function to create users
- [ ] Add function to create doctors
- [ ] Add function to create patients
- [ ] Add function to create appointments
- [ ] Run seed script
- [ ] Verify data in database
- [ ] Test login with seeded users

---

## Phase 4: Core CRUD APIs (Days 8-12)

### Day 8: Pydantic Schemas

#### Task 4.1: Create Clinic Schemas

Create `dashboard_backend/app/schemas/clinic.py`:

Schemas:
- ClinicCreate (name, timezone)
- ClinicUpdate (name?, timezone?)
- ClinicResponse (all fields)

**Checklist:**
- [ ] Create clinic.py schemas

#### Task 4.2: Create Doctor Schemas

Create `dashboard_backend/app/schemas/doctor.py`:

Schemas:
- DoctorCreate (name, initials, specialty, color)
- DoctorUpdate (all optional)
- DoctorResponse (all fields)
- DoctorList (list of DoctorResponse)

**Checklist:**
- [ ] Create doctor.py schemas

#### Task 4.3: Create Patient Schemas

Create `dashboard_backend/app/schemas/patient.py`:

Schemas:
- PatientCreate (first_name, last_name, email, phone, date_of_birth)
- PatientUpdate (all optional)
- PatientResponse (all fields + full_name computed)
- PatientList (list with total count)

**Checklist:**
- [ ] Create patient.py schemas

#### Task 4.4: Create Appointment Schemas

Create `dashboard_backend/app/schemas/appointment.py`:

Schemas:
- AppointmentCreate (doctor_id, patient_id, date, start_time, end_time, duration, visit_type, visit_category)
- AppointmentUpdate (all optional)
- AppointmentResponse (all fields + nested doctor, patient)
- AppointmentList (list with total count)
- AppointmentConfirm (no body needed)
- AppointmentCancel (cancellation_type, reason_note)
- AppointmentArrive (no body needed)

**Checklist:**
- [ ] Create appointment.py schemas
- [ ] Include nested schemas for relationships

### Day 9-10: CRUD Routers

#### Task 4.5: Create Doctors Router

Create `dashboard_backend/app/api/doctors.py`:

Endpoints:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/doctors | List all doctors in clinic | Admin, Doctor |
| GET | /api/doctors/{id} | Get single doctor | Admin, Doctor |
| POST | /api/doctors | Create doctor | Admin only |
| PUT | /api/doctors/{id} | Update doctor | Admin only |
| DELETE | /api/doctors/{id} | Delete doctor | Admin only |

**Checklist:**
- [ ] Create doctors.py router
- [ ] Implement list endpoint (filter by clinic_id)
- [ ] Implement get by id
- [ ] Implement create
- [ ] Implement update
- [ ] Implement delete
- [ ] Add router to main.py
- [ ] Test all endpoints

#### Task 4.6: Create Patients Router

Create `dashboard_backend/app/api/patients.py`:

Endpoints:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/patients | List patients | Admin (all), Doctor (own) |
| GET | /api/patients/{id} | Get single patient | Admin, Doctor (if own) |
| POST | /api/patients | Create patient | Admin only |
| PUT | /api/patients/{id} | Update patient | Admin only |
| GET | /api/patients/{id}/appointments | Patient's appointments | Admin, Doctor |

Role-based filtering:
- Admin: See all patients in clinic
- Doctor: See only patients with appointments to this doctor

**Checklist:**
- [ ] Create patients.py router
- [ ] Implement list with role-based filtering
- [ ] Implement get by id with role check
- [ ] Implement create
- [ ] Implement update
- [ ] Implement patient appointments endpoint
- [ ] Add router to main.py
- [ ] Test as admin
- [ ] Test as doctor (should only see own patients)

### Day 11-12: Appointments Router

#### Task 4.7: Create Appointments Router

Create `dashboard_backend/app/api/appointments.py`:

Endpoints:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/appointments | List appointments | Admin (all), Doctor (own) |
| GET | /api/appointments/{id} | Get single appointment | Admin, Doctor (if own) |
| POST | /api/appointments | Create appointment | Admin only |
| PUT | /api/appointments/{id} | Update appointment | Admin only |
| POST | /api/appointments/{id}/confirm | Confirm appointment | Admin only |
| POST | /api/appointments/{id}/cancel | Cancel appointment | Admin only |
| POST | /api/appointments/{id}/arrive | Mark arrived | Admin only |

Query parameters for GET /api/appointments:
- date: filter by date
- doctor_id: filter by doctor
- status: filter by status
- intake_status: filter by intake status

Role-based filtering:
- Admin: See all appointments in clinic
- Doctor: See only own appointments

**Checklist:**
- [ ] Create appointments.py router
- [ ] Implement list with filters and role-based access
- [ ] Implement get by id with role check
- [ ] Implement create (validate doctor_id, patient_id exist)
- [ ] Implement update
- [ ] Implement confirm (change status to 'confirmed')
- [ ] Implement cancel (create Cancellation record, change status)
- [ ] Implement arrive (set arrived=true, arrived_at=now)
- [ ] Add router to main.py
- [ ] Test all endpoints as admin
- [ ] Test as doctor (should only see own appointments)

---

## Phase 5: Scheduling Engine (Days 13-15)

### Day 13: Schedule Query Endpoint

#### Task 5.1: Create Schedule Router

Create `dashboard_backend/app/api/schedule.py`:

Purpose: Provide schedule-specific endpoints for the calendar views

Endpoints:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/schedule/day | Get day schedule for all doctors | Admin |
| GET | /api/schedule/day/{doctor_id} | Get day schedule for one doctor | Admin, Doctor |
| GET | /api/schedule/week | Get week schedule | Admin |

Query parameters:
- date: The date to get schedule for (default: today)

Response format should match frontend expectations:
```json
{
  "date": "2026-01-05",
  "doctors": [
    {
      "id": "uuid",
      "name": "Dr. Sarah Chen",
      "color": "#4A90A4",
      "appointments": [
        {
          "id": "uuid",
          "time": "09:00",
          "duration": 30,
          "patient": { "id": "uuid", "name": "John Smith" },
          "visitType": "in-clinic",
          "status": { "confirmed": true, "intakeComplete": false }
        }
      ]
    }
  ]
}
```

**Checklist:**
- [ ] Create schedule.py router
- [ ] Implement day schedule endpoint
- [ ] Implement single doctor day schedule
- [ ] Format response to match frontend expectations
- [ ] Add router to main.py
- [ ] Test endpoints

### Day 14: Time Slot Logic

#### Task 5.2: Create Scheduling Service

Create `dashboard_backend/app/services/scheduling_service.py`:

Functions to implement:

1. `get_available_slots(doctor_id: UUID, date: date) -> list[str]`
   - Get working hours (9 AM - 5 PM default)
   - Get existing appointments for doctor on date
   - Calculate available 30-minute slots
   - Return list of available times

2. `check_slot_available(doctor_id: UUID, date: date, start_time: time, end_time: time) -> bool`
   - Check if slot is within working hours
   - Check if slot conflicts with existing appointments
   - Return true if available

3. `validate_appointment_creation(doctor_id, date, start_time, end_time) -> None`
   - Call check_slot_available
   - Raise HTTPException 409 if conflict

**Checklist:**
- [ ] Create scheduling_service.py
- [ ] Implement get_available_slots
- [ ] Implement check_slot_available
- [ ] Implement validate_appointment_creation
- [ ] Integrate validation into appointment creation endpoint

### Day 15: Available Slots Endpoint

#### Task 5.3: Add Available Slots Endpoint

Add to `dashboard_backend/app/api/schedule.py`:

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/schedule/available-slots | Get available slots for booking | Admin |

Query parameters:
- doctor_id: required
- date: required

Response:
```json
{
  "date": "2026-01-05",
  "doctor_id": "uuid",
  "available_slots": ["09:00", "09:30", "10:00", "11:30", "14:00", "15:30"]
}
```

**Checklist:**
- [ ] Add available-slots endpoint
- [ ] Test with different dates
- [ ] Verify slots don't include booked times

---

## Phase 6: Intake System (Days 16-18)

### Day 16: Intake Schemas

#### Task 6.1: Create Intake Schemas

Create `dashboard_backend/app/schemas/intake.py`:

Schemas:

1. `IntakeFormCreate`
   - appointment_id: UUID
   - raw_answers: dict (flexible JSON)

2. `IntakeFormResponse`
   - id, clinic_id, patient_id, appointment_id
   - raw_answers
   - status
   - submitted_at
   - ai_summary: AIIntakeSummaryResponse | None

3. `AIIntakeSummaryResponse`
   - id
   - summary_text
   - patient_concerns: list[str]
   - medications: list[str]
   - allergies: list[str]
   - key_notes
   - generated_at

4. `IntakeMarkComplete`
   - (empty body - just marks as complete)

**Checklist:**
- [ ] Create intake.py schemas
- [ ] Include nested AI summary schema

### Day 17: Intake Router

#### Task 6.2: Create Intake Router

Create `dashboard_backend/app/api/intake.py`:

Endpoints:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/intake/forms | List intake forms | Admin, Doctor (own) |
| GET | /api/intake/forms/{id} | Get single form | Admin, Doctor (own) |
| POST | /api/intake/forms | Submit intake form | Admin |
| PUT | /api/intake/forms/{id}/complete | Mark as complete | Admin |
| GET | /api/intake/summary/{appointment_id} | Get AI summary for appointment | Admin, Doctor |

**Checklist:**
- [ ] Create intake.py router
- [ ] Implement list with role filtering
- [ ] Implement get by id
- [ ] Implement submit (creates form, updates appointment.intake_status)
- [ ] Implement mark complete
- [ ] Add router to main.py
- [ ] Test endpoints

### Day 18: Intake Status Flow

#### Task 6.3: Update Appointment on Intake Submission

When intake form is submitted:
1. Create IntakeForm record
2. Update Appointment.intake_status to 'completed'
3. Trigger AI summary generation (next phase)

When intake is marked complete manually:
1. Update IntakeForm.status to 'submitted'
2. Update Appointment.intake_status to 'completed'

**Checklist:**
- [ ] Update intake form submission to update appointment
- [ ] Update mark complete to update appointment
- [ ] Verify status flows correctly
- [ ] Test full flow

---

## Phase 7: AI Intake Summary (Days 19-20)

### Day 19: OpenAI Service

#### Task 7.1: Create AI Service

Create `dashboard_backend/app/services/ai_service.py`:

Purpose: Generate AI intake summaries using OpenAI

Functions:

1. `generate_intake_summary(intake_form: IntakeForm, db: Session) -> AIIntakeSummary`

   Prompt template:
   ```
   Analyze this patient intake form and provide a concise clinical summary.

   Patient Intake Data:
   {intake_data}

   Provide:
   1. Summary (2-3 sentences of key points for the doctor)
   2. Patient concerns (bullet list of main complaints)
   3. Current medications (list)
   4. Known allergies (list)
   5. Key notes for the doctor (anything important to flag)

   Format as JSON with keys: summary_text, patient_concerns, medications, allergies, key_notes
   ```

   Implementation:
   - Call OpenAI chat completion with GPT-4
   - Parse JSON response
   - Create AIIntakeSummary record
   - Return summary

**Checklist:**
- [ ] Create ai_service.py
- [ ] Implement generate_intake_summary
- [ ] Use openai client with gpt-4
- [ ] Handle API errors gracefully
- [ ] Test with sample intake data

### Day 20: Integrate AI Summary

#### Task 7.2: Add AI Summary to Intake Flow

Update intake form submission flow:

1. When intake form is submitted
2. Call generate_intake_summary
3. Store AI summary linked to intake form and appointment
4. Return summary in response

Add endpoint:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/intake/summary/{appointment_id}/regenerate | Regenerate AI summary | Admin |

**Checklist:**
- [ ] Update intake submission to generate summary
- [ ] Add regenerate endpoint
- [ ] Test full flow: submit intake → see AI summary
- [ ] Verify summary appears in doctor's view

---

## Phase 8: Dashboard APIs (Days 21-23)

### Day 21: Admin Dashboard API

#### Task 8.1: Create Admin Dashboard Endpoint

Create `dashboard_backend/app/api/dashboard.py`:

Endpoint:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/dashboard/admin | Get admin dashboard stats | Admin |

Response format (match frontend HeroCard expectations):
```json
{
  "date": "2026-01-05",
  "stats": {
    "total_appointments": 24,
    "confirmed": 18,
    "unconfirmed": 6,
    "missing_intake": 4,
    "voice_ai_alerts": 2
  },
  "needs_attention": [
    {
      "id": "uuid",
      "patient_name": "John Smith",
      "time": "10:00 AM",
      "doctor": "Dr. Sarah Chen",
      "issue": "unconfirmed"
    }
  ],
  "todays_schedule": [
    {
      "id": "uuid",
      "time": "09:00 AM",
      "patient_name": "Jane Doe",
      "doctor": "Dr. Sarah Chen",
      "visit_type": "in-clinic",
      "status": {
        "confirmed": true,
        "intake_complete": true
      }
    }
  ]
}
```

**Checklist:**
- [ ] Create dashboard.py router
- [ ] Implement admin dashboard endpoint
- [ ] Calculate all stats from database
- [ ] Include needs_attention items (unconfirmed + missing intake)
- [ ] Include today's schedule
- [ ] Add router to main.py
- [ ] Test endpoint returns correct data

### Day 22: Doctor Dashboard API

#### Task 8.2: Create Doctor Dashboard Endpoint

Add to `dashboard_backend/app/api/dashboard.py`:

Endpoint:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/dashboard/doctor | Get doctor dashboard stats | Doctor |

Response format:
```json
{
  "date": "2026-01-05",
  "doctor": {
    "id": "uuid",
    "name": "Dr. Sarah Chen"
  },
  "stats": {
    "total_appointments": 8,
    "confirmed": 6,
    "unconfirmed": 2,
    "missing_intake": 1,
    "voice_ai_alerts": 0
  },
  "todays_patients": [
    {
      "id": "uuid",
      "appointment_id": "uuid",
      "time": "09:00 AM",
      "patient_name": "John Smith",
      "visit_type": "in-clinic",
      "visit_category": "follow-up",
      "status": {
        "confirmed": true,
        "intake_complete": true,
        "arrived": false
      },
      "intake_summary": {
        "summary_text": "Patient presents with...",
        "patient_concerns": ["Headache", "Fatigue"],
        "medications": ["Lisinopril 10mg"],
        "allergies": ["Penicillin"]
      }
    }
  ]
}
```

Key differences from admin:
- Filtered to current doctor only
- Includes intake_summary for each patient
- No multi-doctor view

**Checklist:**
- [ ] Implement doctor dashboard endpoint
- [ ] Filter all data by current doctor
- [ ] Include AI intake summaries for each appointment
- [ ] Test as doctor user
- [ ] Verify only own patients appear

### Day 23: Needs Attention API

#### Task 8.3: Create Attention Items Endpoint

Add to `dashboard_backend/app/api/dashboard.py`:

Endpoint:
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/dashboard/needs-attention | Get items needing attention | Admin |

Query parameters:
- filter: "all" | "unconfirmed" | "missing-intake"

Response:
```json
{
  "total": 6,
  "items": [
    {
      "id": "uuid",
      "type": "unconfirmed",
      "patient_name": "John Smith",
      "patient_phone": "555-1234",
      "time": "10:00 AM",
      "doctor": "Dr. Sarah Chen",
      "appointment_id": "uuid"
    }
  ]
}
```

**Checklist:**
- [ ] Implement needs-attention endpoint
- [ ] Support filter parameter
- [ ] Include all relevant info for admin action
- [ ] Test with filters

---

## Phase 9: Frontend Integration (Days 24-26)

### Day 24: API Client Setup

#### Task 9.1: Create Frontend API Service

Location: `dashboard/src/app/services/api.ts`

Create API client with:
- Base URL configuration (http://localhost:8000/api)
- Auth token storage (localStorage)
- Request interceptor to add token
- Response interceptor for 401 handling

Functions to create:
- `login(email, password)` → store token
- `logout()` → clear token
- `getCurrentUser()` → get user info
- `isAuthenticated()` → check if token exists

**Checklist:**
- [ ] Create api.ts service file
- [ ] Implement auth functions
- [ ] Add to frontend project
- [ ] Test login flow

### Day 25: Connect Dashboard Pages

#### Task 9.2: Update Admin Dashboard

Location: `dashboard/src/app/pages/ConnectedAdminDashboard.tsx`

Changes:
1. Replace mock data with API calls
2. Fetch dashboard stats on mount
3. Fetch needs attention items
4. Fetch today's schedule
5. Handle loading states
6. Handle errors

Keep owner dashboard untouched (hardcoded data).

**Checklist:**
- [ ] Add API fetch calls
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test with real data
- [ ] Verify stats match database

#### Task 9.3: Update Doctor Dashboard

Location: `dashboard/src/app/pages/DoctorDashboard.tsx`

Changes:
1. Fetch doctor dashboard stats on mount
2. Fetch today's patients with intake summaries
3. Display AI intake summaries in patient view
4. Handle loading and error states

**Checklist:**
- [ ] Add API fetch calls
- [ ] Display AI intake summaries
- [ ] Test with doctor login
- [ ] Verify only own patients shown

### Day 26: Connect Schedule & Actions

#### Task 9.4: Update Schedule Page

Location: `dashboard/src/app/pages/EnhancedSchedulePage.tsx`

Changes:
1. Fetch schedule data from API
2. Connect appointment creation flow to API
3. Connect confirm/cancel actions to API
4. Connect mark arrived to API

**Checklist:**
- [ ] Fetch schedule from API
- [ ] Connect create appointment to API
- [ ] Connect confirm to API
- [ ] Connect cancel to API
- [ ] Connect arrive to API
- [ ] Test all actions

#### Task 9.5: Update Add Patient Flow

Location: `dashboard/src/app/components/add-patient-flow/`

Changes:
1. Fetch doctors from API for step 2
2. Fetch available slots from API
3. Create patient via API (if new)
4. Create appointment via API
5. Submit intake form via API

**Checklist:**
- [ ] Connect doctor list to API
- [ ] Connect available slots to API
- [ ] Connect patient creation to API
- [ ] Connect appointment creation to API
- [ ] Test full flow end-to-end

---

## Phase 10: Demo Preparation (Days 27-28)

### Day 27: Testing & Bug Fixes

#### Task 10.1: End-to-End Testing

Test each user flow completely:

**Admin Flow:**
1. [ ] Login as admin
2. [ ] View dashboard with real stats
3. [ ] Click hero cards and filter
4. [ ] View schedule page
5. [ ] Create new appointment
6. [ ] Confirm an appointment
7. [ ] Cancel an appointment
8. [ ] Mark patient as arrived
9. [ ] View patient list
10. [ ] Submit intake form
11. [ ] See AI summary generated

**Doctor Flow:**
1. [ ] Login as doctor
2. [ ] View dashboard (own patients only)
3. [ ] See today's patient list
4. [ ] Click patient to see AI intake summary
5. [ ] View own schedule
6. [ ] Cannot see other doctors' patients

**Checklist:**
- [ ] Complete all admin flow tests
- [ ] Complete all doctor flow tests
- [ ] Document any bugs found
- [ ] Fix critical bugs

### Day 28: Demo Script & Polish

#### Task 10.2: Create Demo Script

Create a step-by-step demo script showing:

1. **Problem Setup** (30 seconds)
   - "Clinic has appointments today"
   - "Some are unconfirmed, some missing intake"

2. **Admin Experience** (2 minutes)
   - Login as admin
   - Show dashboard stats
   - Filter to unconfirmed
   - Confirm an appointment
   - Create new appointment
   - Show scheduling workflow

3. **Intake Flow** (1 minute)
   - Patient submits intake
   - AI generates summary
   - Doctor sees summary

4. **Doctor Experience** (1 minute)
   - Login as doctor
   - See filtered view
   - See AI intake summary
   - "Ready to see patient"

5. **Future Vision** (30 seconds)
   - Show Voice AI page
   - "Post-funding: automated calls"
   - Show automation settings
   - "Full automation reduces no-shows"

#### Task 10.3: Final Polish

**Checklist:**
- [ ] Test demo script end-to-end
- [ ] Ensure no console errors
- [ ] Ensure no loading delays > 2 seconds
- [ ] Clear test data, reseed with demo data
- [ ] Practice demo 3 times

---

## API Endpoint Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Get current user |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/doctors | List doctors |
| GET | /api/doctors/{id} | Get doctor |
| POST | /api/doctors | Create doctor |
| PUT | /api/doctors/{id} | Update doctor |
| DELETE | /api/doctors/{id} | Delete doctor |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/patients | List patients |
| GET | /api/patients/{id} | Get patient |
| POST | /api/patients | Create patient |
| PUT | /api/patients/{id} | Update patient |
| GET | /api/patients/{id}/appointments | Patient appointments |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/appointments | List appointments |
| GET | /api/appointments/{id} | Get appointment |
| POST | /api/appointments | Create appointment |
| PUT | /api/appointments/{id} | Update appointment |
| POST | /api/appointments/{id}/confirm | Confirm |
| POST | /api/appointments/{id}/cancel | Cancel |
| POST | /api/appointments/{id}/arrive | Mark arrived |

### Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/schedule/day | Day schedule (all doctors) |
| GET | /api/schedule/day/{doctor_id} | Day schedule (one doctor) |
| GET | /api/schedule/available-slots | Available booking slots |

### Intake
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/intake/forms | List forms |
| GET | /api/intake/forms/{id} | Get form |
| POST | /api/intake/forms | Submit form |
| PUT | /api/intake/forms/{id}/complete | Mark complete |
| GET | /api/intake/summary/{appointment_id} | Get AI summary |
| POST | /api/intake/summary/{appointment_id}/regenerate | Regenerate |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/admin | Admin stats |
| GET | /api/dashboard/doctor | Doctor stats |
| GET | /api/dashboard/needs-attention | Attention items |

---

## Database Schema Reference

### Tables (8 tables for MVP)

1. **clinics** - Clinic accounts
2. **users** - User accounts with roles
3. **doctors** - Doctor profiles
4. **patients** - Patient records
5. **appointments** - Appointment scheduling
6. **cancellations** - Cancellation history
7. **intake_forms** - Intake submissions
8. **ai_intake_summaries** - AI-generated summaries

### NOT building (deferred)
- audit_logs (post-funding)
- clinic_settings (hardcode defaults)
- doctor_settings (hardcode defaults)

---

## Environment Variables Reference

```env
# Required for MVP
DATABASE_URL=postgresql://clinicflow:clinicflow@localhost:5432/clinicflow
JWT_SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-key

# Optional
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
ENVIRONMENT=development
DEBUG=true
```

---

## Demo Script

### Setup Before Demo
1. Run fresh seed script
2. Clear browser localStorage
3. Have two browser windows ready (admin + doctor)

### Demo Flow (5 minutes)

**Opening (30 sec)**
> "ClinicFlow is an AI-powered clinic management system that reduces no-shows and automates pre-visit workflows."

**Admin Dashboard (1 min)**
1. Login as admin@clinic.com
2. Show dashboard: "24 appointments today, 6 unconfirmed"
3. Click unconfirmed hero card
4. Show filtered list

**Scheduling (1 min)**
1. Click +Add Patient
2. Walk through booking flow
3. "Admin books in 30 seconds"
4. Show appointment in schedule

**Intake + AI (1.5 min)**
1. "Patient completes intake before visit"
2. Show intake form submission
3. "AI analyzes and summarizes"
4. Show AI summary

**Doctor View (1 min)**
1. Switch to doctor browser
2. Login as sarah.chen@clinic.com
3. "Doctor sees only their patients"
4. Click patient, show AI summary
5. "Doctor prepared in 30 seconds instead of reading 5-page form"

**Future Vision (30 sec)**
1. Show Voice AI page
2. "Post-funding: automated calls confirm appointments"
3. "Reduces no-shows by 50%+"

**Close**
> "We have paying design partners ready. Raising pre-seed to build Voice AI and scale."

---

## Success Criteria

### MVP is complete when:

- [ ] Admin can log in and see real dashboard stats
- [ ] Admin can create appointments
- [ ] Admin can confirm/cancel appointments
- [ ] Admin can mark patients as arrived
- [ ] Intake forms can be submitted
- [ ] AI generates intake summaries
- [ ] Doctor can log in and see own patients only
- [ ] Doctor can see AI intake summaries
- [ ] Demo runs smoothly for 5 minutes
- [ ] No critical bugs

### Owner Dashboard

- [ ] Kept hardcoded in frontend
- [ ] Shows structure (what metrics we will track)
- [ ] No backend work required

---

## Post-MVP (After Pre-Seed)

These features are designed and visible in UI but not functional:

1. **Voice AI System** - Inbound/outbound calls
2. **SMS Automation** - Appointment reminders
3. **Email Automation** - Confirmations
4. **Owner Analytics** - Real historical trends
5. **Automation Rules** - Configurable workflows
6. **Settings System** - Full configuration
7. **Audit Logging** - HIPAA compliance
8. **Multi-location** - Multiple clinics

In pitch: "Designed, specced, and ready for post-funding development."

