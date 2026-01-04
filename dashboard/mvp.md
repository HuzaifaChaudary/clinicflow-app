# ClinicFlow MVP Backend Implementation Guide

**Pre-Seed Build Scope â€” Admin & Doctor Backend**

Based on: `flows.md`, `understandingDashboard.md`, `work.md` (preferred backend architecture), pre-seed scope requirements

---

## Build Priority

| Priority | Component | Status |
|----------|-----------|--------|
| P0 | Auth + Role System | Must Build |
| P0 | Core Entities (Clinic, Doctor, Patient, Appointment) | Must Build |
| P0 | Scheduling Engine | Must Build |
| P0 | Dashboard Stats (Hero Cards) | Must Build |
| P1 | Intake Forms (Basic) | Must Build |
| P1 | Public Intake Token System (Patient-facing) | Must Build |
| P1 | AI Intake Summary | Must Build |
| P1 | Doctor Notes | Must Build |
| P1 | Follow-up Scheduling | Must Build |
| P1 | Cancellation History | Must Build |
| P1 | Patient Search & Filters | Must Build |
| P1 | Needs Attention Queue | Must Build |
| P1 | Appointment Detail View | Must Build |
| P1 | Settings (Clinic, Doctor, Users) | Must Build |
| P1 | Patient AI Interactions View | Must Build (mock data) |
| SKIP | Voice AI | NO BACKEND - Frontend uses existing mock data |
| SKIP | Owner Analytics | NO BACKEND - Frontend uses existing mock data |
| SKIP | Automation Rules | NO BACKEND - Frontend uses existing mock data |

---

## Week 1-2: Core Backend

### 1. Authentication & Authorization

#### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'owner') NOT NULL,
  clinic_id UUID REFERENCES clinics(id),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Sessions / refresh tokens
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### API Endpoints

```
POST   /api/auth/login          â†’ { email, password } â†’ { token, user, role }
POST   /api/auth/logout         â†’ Invalidate session
GET    /api/auth/me             â†’ Current user + role
POST   /api/auth/refresh        â†’ Refresh token
```

#### Role Middleware

```typescript
// Middleware that enforces role-based access
// From flows.md permissions:

const rolePermissions = {
  admin: {
    canViewAllAppointments: true,
    canCreateAppointments: true,
    canEditAppointments: true,
    canCancelAppointments: true,
    canViewAllPatients: true,
    canManageIntakeForms: true,
    canConfigureSettings: true,
    canManageUsers: true,
    canViewVoiceAI: true,
    canHandleEscalations: true,
  },
  doctor: {
    canViewAllAppointments: false,      // Own only
    canCreateAppointments: false,
    canEditAppointments: false,
    canCancelAppointments: false,
    canViewAllPatients: false,          // Own only
    canManageIntakeForms: false,
    canConfigureSettings: false,        // Own preferences only
    canManageUsers: false,
    canViewVoiceAI: true,               // Own patients only
    canHandleEscalations: false,
    canAddDoctorNotes: true,
    canSetFollowUp: true,
  },
  owner: {
    canViewMetricsOnly: true,
    canViewPatientPII: false,
    canViewAppointmentDetails: false,
    canViewAggregatedData: true,
  }
};
```

---

### 2. Core Entities

#### Clinics

```sql
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  timezone VARCHAR(50) NOT NULL DEFAULT 'America/New_York',
  working_days INTEGER[] DEFAULT '{1,2,3,4,5}',  -- Mon-Fri
  opening_time TIME DEFAULT '09:00',
  closing_time TIME DEFAULT '17:00',
  slot_duration_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

```
GET    /api/clinics/:id              â†’ Clinic details (Admin, Doctor, Owner)
PUT    /api/clinics/:id              â†’ Update clinic (Admin only)
```

#### Doctors

```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  clinic_id UUID REFERENCES clinics(id),
  name VARCHAR(255) NOT NULL,
  initials VARCHAR(10),
  specialty VARCHAR(100),
  color VARCHAR(20),                  -- For calendar UI
  working_hours JSONB,                -- Override clinic defaults
  default_visit_length INTEGER DEFAULT 30,
  allows_virtual_visits BOOLEAN DEFAULT TRUE,
  allows_walkins BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

```
GET    /api/doctors                  â†’ List doctors (Admin: all, Doctor: self only)
GET    /api/doctors/:id              â†’ Doctor details
POST   /api/doctors                  â†’ Create doctor (Admin only)
PUT    /api/doctors/:id              â†’ Update doctor (Admin or self)
PUT    /api/doctors/:id/preferences  â†’ Update own preferences (Doctor)
```

#### Patients

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  primary_doctor_id UUID REFERENCES doctors(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  first_visit_date DATE,
  contact_preferences JSONB DEFAULT '{"sms": true, "email": true}',
  flags JSONB DEFAULT '{}',           -- VIP, needs_interpreter, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Track which doctors have seen which patients
CREATE TABLE doctor_patient_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id),
  patient_id UUID REFERENCES patients(id),
  first_visit_date TIMESTAMP,
  last_visit_date TIMESTAMP,
  UNIQUE(doctor_id, patient_id)
);
```

```
# List patients with search and filters
GET    /api/patients
       Query params: ?search=john&needs_attention=true&doctor_id=xxx
       Admin: all clinic patients
       Doctor: own patients only (via relationship)
       Owner: FORBIDDEN
       
       Filters:
       - search: searches name, email, phone
       - needs_attention: true = unconfirmed appts or missing intake
       - doctor_id: filter by primary doctor (Admin only)
       
GET    /api/patients/:id             â†’ Patient details (Admin, or Doctor if own patient)
POST   /api/patients                 â†’ Create patient (Admin only)
PUT    /api/patients/:id             â†’ Update patient (Admin only)

# Patient cancellation history
GET    /api/patients/:id/cancellations
       â†’ Returns all cancellations for this patient
       Admin: full history
       Doctor: only cancellations for their appointments

# Patient AI interactions (from flows.md: "Admin sees full history: all AI interactions")
GET    /api/patients/:id/ai-interactions
       â†’ Returns all AI calls/messages for this patient
       Admin: full list with transcripts
       Doctor: only interactions for their appointments
       Owner: FORBIDDEN
       Note: Returns mock/seeded data for MVP (Voice AI not built)

GET    /api/patients/:id/history     â†’ Patient history
                                       Admin: full history
                                       Doctor: visits with this doctor only
```

---

### 3. Appointments (Scheduling Engine)

#### Database Schema

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  doctor_id UUID REFERENCES doctors(id),
  patient_id UUID REFERENCES patients(id),
  
  -- Scheduling
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER DEFAULT 30,        -- minutes (15, 30, 45, 60)
  
  -- Type & Status
  visit_type ENUM('in_clinic', 'virtual') NOT NULL,
  visit_category ENUM('new_patient', 'follow_up') DEFAULT 'follow_up',
  status ENUM('unconfirmed', 'confirmed', 'arrived', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'unconfirmed',
  
  -- Arrived tracking
  arrived BOOLEAN DEFAULT FALSE,
  arrived_at TIMESTAMP,
  
  -- Visit details
  visit_reason VARCHAR(500),
  
  -- Intake
  intake_status ENUM('not_sent', 'sent', 'completed', 'skipped') DEFAULT 'not_sent',
  intake_form_id UUID REFERENCES intake_forms(id),
  
  -- Attention flags
  needs_attention BOOLEAN DEFAULT FALSE,
  attention_reason VARCHAR(100),
  
  -- Video visits
  meeting_link VARCHAR(500),
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for schedule queries
CREATE INDEX idx_appointments_schedule ON appointments(clinic_id, doctor_id, scheduled_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);

-- Cancellation history (separate table for detailed tracking)
CREATE TABLE cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) NOT NULL,
  clinic_id UUID REFERENCES clinics(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id),
  
  cancellation_type ENUM('patient_cancelled', 'no_show', 'rescheduled_externally', 'clinic_cancelled', 'other') NOT NULL,
  reason_note TEXT,
  cancelled_by UUID REFERENCES users(id),
  cancelled_by_name VARCHAR(255),
  
  -- Original appointment details (for history)
  original_date DATE,
  original_time TIME,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cancellations_patient ON cancellations(patient_id);
CREATE INDEX idx_cancellations_clinic ON cancellations(clinic_id, created_at DESC);
```

#### API Endpoints

```
# List appointments
GET    /api/appointments
       Query params: ?date=2026-01-04&doctor_id=xxx&status=unconfirmed
       Admin: all appointments, can filter by any doctor
       Doctor: own appointments only (doctor_id filter forced to self)
       Owner: FORBIDDEN (use /api/metrics/appointments for counts)

# Single appointment
GET    /api/appointments/:id
       Admin: any appointment
       Doctor: only if assigned to them
       Owner: FORBIDDEN

# Create appointment (Admin only)
POST   /api/appointments
       Body: {
         doctor_id,
         patient_id,
         scheduled_date,
         start_time,
         visit_type,
         visit_reason,
         intake_path: 'send_now' | 'send_later' | 'skip'
       }
       â†’ Creates appointment
       â†’ If intake_path is 'send_now', triggers intake form send
       â†’ Creates doctor_patient_relationship if new

# Update appointment (Admin only)
PUT    /api/appointments/:id
       Body: { status, visit_reason, ... }

# Confirm appointment (Admin only)
POST   /api/appointments/:id/confirm
       â†’ Sets status to 'confirmed'

# Reschedule appointment (Admin only)  
POST   /api/appointments/:id/reschedule
       Body: { new_date, new_time, new_doctor_id? }
       â†’ Updates appointment
       â†’ If doctor changed, updates relationships

# Cancel appointment (Admin only)
POST   /api/appointments/:id/cancel
       Body: { reason: 'patient_cancelled' | 'no_show' | 'rescheduled_externally' | 'other', note? }
       â†’ Sets status to 'cancelled'
       â†’ Creates record in cancellations table
       â†’ Patient history shows cancellation

# Mark arrived (Admin only)
POST   /api/appointments/:id/arrived
       â†’ Sets status to 'arrived'
       â†’ Sets arrived = true, arrived_at = NOW()
```

#### Schedule View Endpoints

```
# Multi-doctor grid view (Admin)
GET    /api/schedule/grid?date=2026-01-04
       â†’ Returns all doctors with their appointments for the day
       Response: {
         doctors: [
           {
             id, name,
             appointments: [{ id, time, patient_name, status, ... }]
           }
         ]
       }

# Single doctor expanded view (Doctor)
GET    /api/schedule/my?date=2026-01-04
       â†’ Returns only requesting doctor's schedule
       Response: {
         appointments: [{ id, time, patient, status, intake_status, ... }]
       }

# Available slots
GET    /api/schedule/available?doctor_id=xxx&date=2026-01-04
       â†’ Returns available time slots for booking
       Admin: can query any doctor
       Doctor: FORBIDDEN
```

#### Dashboard Endpoints (Hero Cards & Stats)

```
# Admin Dashboard Summary
GET    /api/dashboard/admin/summary?date=2026-01-04
       â†’ Returns hero card data:
       {
         total_appointments: 24,
         confirmed: 18,
         unconfirmed: 4,
         missing_intake: 3,
         arrived: 2,
         completed: 5,
         cancelled_today: 1,
         no_shows_today: 0
       }

# Needs Attention Queue (Admin)
GET    /api/dashboard/admin/needs-attention
       â†’ Returns items requiring admin action:
       {
         unconfirmed_appointments: [...],
         missing_intake: [...],
         pending_follow_ups: [...]
       }

# Recent Cancellations (Admin)
GET    /api/dashboard/admin/cancellations?days=7
       â†’ Returns recent cancellations with reasons

# Doctor Dashboard Summary
GET    /api/dashboard/doctor/summary?date=2026-01-04
       â†’ Returns doctor's own stats only:
       {
         my_appointments: 8,
         confirmed: 6,
         unconfirmed: 2,
         missing_intake: 1,
         arrived: 1
       }

# Doctor's Today View
GET    /api/dashboard/doctor/today
       â†’ Returns today's patient list with preparation data:
       [
         {
           appointment_id,
           patient: { name, ... },
           time,
           status,
           intake_complete,
           intake_summary_preview,   // First 100 chars
           visit_type,
           visit_reason
         }
       ]
```

#### Appointment Detail View

```
# Single appointment with all related data
GET    /api/appointments/:id/detail
       â†’ Returns complete appointment data for drawer/modal:
       {
         appointment: { ... },
         patient: {
           id, name, email, phone, date_of_birth,
           flags,
           contact_preferences
         },
         doctor: { id, name, specialty },
         intake: {
           status,
           submission_id,
           ai_summary
         },
         history: {
           previous_visits: [...],       // Admin: all, Doctor: own
           cancellation_count: 2,
           no_show_count: 1
         }
       }
```

---

## Week 3: Intake Forms & AI Summary

### 4. Intake Forms (Basic)

#### Database Schema

```sql
-- Form templates (Admin creates these)
CREATE TABLE intake_form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,           -- Array of field definitions
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Submitted forms
CREATE TABLE intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES intake_form_templates(id),
  appointment_id UUID REFERENCES appointments(id),
  patient_id UUID REFERENCES patients(id),
  
  -- Form data
  responses JSONB NOT NULL,
  
  -- AI Summary (generated after submission)
  ai_summary TEXT,
  ai_summary_generated_at TIMESTAMP,
  
  -- Status
  submitted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Intake tokens for public (unauthenticated) patient form submission
CREATE TABLE intake_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  template_id UUID REFERENCES intake_form_templates(id) NOT NULL,
  token VARCHAR(100) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_intake_tokens_token ON intake_tokens(token);
CREATE INDEX idx_intake_tokens_appointment ON intake_tokens(appointment_id);
```

#### API Endpoints

```
# Templates (Admin only)
GET    /api/intake/templates              â†’ List templates
POST   /api/intake/templates              â†’ Create template
PUT    /api/intake/templates/:id          â†’ Update template

# Submissions
GET    /api/intake/submissions            â†’ List submissions
       Admin: all
       Doctor: own patients only
POST   /api/intake/submissions            â†’ Submit form (public, token-based)
GET    /api/intake/submissions/:id        â†’ Get submission + AI summary

# Send intake form to patient (Admin only)
POST   /api/appointments/:id/send-intake
       Body: { template_id }
       â†’ Generates unique link
       â†’ Sends via email/SMS (stub for now)
       â†’ Updates appointment.intake_status to 'sent'

# Mark intake as manually completed (Admin only)
POST   /api/appointments/:id/intake-complete
       â†’ Sets intake_status to 'completed' without submission
```

### 5. AI Intake Summary

#### Implementation

```typescript
// POST /api/intake/submissions
// After saving submission, generate AI summary

async function generateIntakeSummary(submission: IntakeSubmission): Promise<string> {
  const prompt = `
You are a medical intake assistant. Summarize the following patient intake form responses for a doctor's pre-visit review.

Focus on:
- Chief complaint / reason for visit
- Current medications
- Allergies
- Relevant medical history
- Key concerns the patient mentioned

Keep the summary concise (3-5 bullet points).

Patient responses:
${JSON.stringify(submission.responses, null, 2)}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
  });

  return response.choices[0].message.content;
}
```

#### API for Doctor View

```
# Get patient preparation view (Doctor)
GET    /api/appointments/:id/preparation
       â†’ Returns:
       {
         patient: { name, ... },
         appointment: { time, visit_type, reason },
         intake_summary: "â€¢ Chief complaint: ...\nâ€¢ Medications: ...",
         intake_complete: true,
         previous_visits: [...] // with this doctor only
       }
```

---


---

### 5b. Public Intake Form Submission (Patient-Facing, No Auth Required)

This is the patient-facing flow when they click the intake link from email/SMS. **Critical for MVP demo.**

#### Public Intake API Endpoints

```
# Get intake form for patient (PUBLIC - no auth required)
GET    /api/public/intake/:token
       -> Validates token exists and not expired
       -> Validates token not already used
       -> Returns:
       {
         patient_name: "John",
         appointment_date: "2026-01-06",
         appointment_time: "10:00 AM",
         doctor_name: "Dr. Chen",
         form: {
           name: "New Patient Intake",
           fields: [...]
         }
       }
       
       Error responses:
       - 404: Token not found
       - 410: Token expired
       - 409: Form already submitted

# Submit intake form (PUBLIC - no auth required)
POST   /api/public/intake/:token
       Body: { responses: {...} }
       
       -> Validates token exists, not expired, not used
       -> Creates intake_submissions record
       -> Marks token as used (used_at = NOW())
       -> Updates appointment.intake_status to 'completed'
       -> Triggers async AI summary generation (Celery task)
       -> Returns: { success: true, message: "Thank you!" }
       
       Error responses:
       - 404: Token not found
       - 410: Token expired  
       - 409: Form already submitted
       - 422: Validation errors
```

---
### 6. Doctor Notes (from flows.md)

Doctors can add clinical notes to patient records. Only the doctor who created the note can see it.

#### Database Schema

```sql
CREATE TABLE doctor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) NOT NULL,
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  appointment_id UUID REFERENCES appointments(id),  -- Optional link to appointment
  
  content TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_doctor_notes_patient ON doctor_notes(patient_id, doctor_id);
```

#### API Endpoints

```
# Get notes for patient (Doctor only - sees own notes only)
GET    /api/doctor-notes/patient/:patient_id
       Doctor: returns only notes created by this doctor
       Admin: FORBIDDEN (these are doctor-private)

# Create note
POST   /api/doctor-notes
       Body: { patient_id, appointment_id?, content }
       Doctor only

# Update note
PUT    /api/doctor-notes/:id
       Only the doctor who created it can edit
       
# Delete note  
DELETE /api/doctor-notes/:id
       Only the doctor who created it can delete
```

---

### 7. Follow-up Scheduling (from flows.md)

Doctors can set follow-up dates for patients. Admin can see these for scheduling purposes.

#### Database Schema

```sql
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) NOT NULL,
  patient_id UUID REFERENCES patients(id) NOT NULL,
  appointment_id UUID REFERENCES appointments(id),  -- Source appointment
  doctor_id UUID REFERENCES doctors(id) NOT NULL,
  
  scheduled_date DATE NOT NULL,
  note TEXT,
  status ENUM('pending', 'scheduled', 'completed', 'cancelled') DEFAULT 'pending',
  
  -- When follow-up appointment is created
  follow_up_appointment_id UUID REFERENCES appointments(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_follow_ups_pending ON follow_ups(clinic_id, status) WHERE status = 'pending';
```

#### API Endpoints

```
# List pending follow-ups
GET    /api/follow-ups
       Admin: all pending follow-ups for clinic
       Doctor: only their patients' follow-ups

# Create follow-up
POST   /api/follow-ups
       Body: { patient_id, appointment_id?, scheduled_date, note? }
       Doctor only

# Update follow-up
PUT    /api/follow-ups/:id
       Doctor: can update their own
       Admin: can update status to 'scheduled' when creating appointment

# Cancel follow-up
DELETE /api/follow-ups/:id
       Doctor only (their own)
```

---

## âŒ DO NOT BUILD (Frontend Already Has Mock Data)

The following features have **complete frontend UI that already works with mock/hardcoded data**.

**DO NOT CREATE:**
- âŒ No database tables
- âŒ No API endpoints  
- âŒ No backend services
- âŒ No modifications to frontend

### Voice AI
- Frontend pages exist and display mock data
- Leave as-is â€” no backend needed

### Owner Analytics  
- Frontend dashboard exists and displays mock metrics
- Leave as-is â€” no backend needed

### Automation Rules
- Frontend settings UI exists
- Leave as-is â€” no backend needed

**Reason:** These are post-funding features. Frontend demonstrates the vision. Backend implementation comes after raise.

---

## Settings (Comprehensive from work.md + flows.md)

### Clinic Settings Schema

```sql
CREATE TABLE clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) UNIQUE NOT NULL,
  
  -- Working days/hours (from flows.md: "Admin sets clinic name, timezone, working days, hours, slot size")
  working_days JSONB DEFAULT '{"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": false, "sunday": false}',
  clinic_hours JSONB DEFAULT '{"start": "09:00", "end": "17:00"}',
  slot_size INTEGER DEFAULT 30,  -- 15, 30, or 45 minutes
  
  -- Scheduling rules (from flows.md: "Admin sets rules for overlapping, walk-ins, cancellation notice, no-show threshold")
  allow_overlapping BOOLEAN DEFAULT FALSE,
  allow_walk_ins BOOLEAN DEFAULT TRUE,
  require_provider BOOLEAN DEFAULT TRUE,
  allow_admin_override BOOLEAN DEFAULT TRUE,
  minimum_cancellation_notice INTEGER DEFAULT 60,  -- minutes
  auto_no_show_threshold INTEGER DEFAULT 15,       -- minutes after appointment time
  cancellation_reason_required BOOLEAN DEFAULT TRUE,
  
  -- Intake logic (from flows.md: "Admin sets whether intake is required, what happens if missing")
  intake_required BOOLEAN DEFAULT TRUE,
  lock_appointment_if_missing BOOLEAN DEFAULT FALSE,
  allow_manual_completion BOOLEAN DEFAULT TRUE,
  intake_delivery_path ENUM('automatic', 'manual', 'ask_every_time') DEFAULT 'automatic',
  
  -- Notifications (from flows.md: "Admin sets what triggers notifications and how they are delivered")
  notify_unconfirmed BOOLEAN DEFAULT TRUE,
  notify_missing_intake BOOLEAN DEFAULT TRUE,
  notify_cancellations BOOLEAN DEFAULT TRUE,
  notify_no_shows BOOLEAN DEFAULT TRUE,
  notify_via_app BOOLEAN DEFAULT TRUE,
  notify_via_email BOOLEAN DEFAULT FALSE,
  
  -- Data preferences
  date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
  time_format VARCHAR(10) DEFAULT '12h',
  default_dashboard_view VARCHAR(20) DEFAULT 'dashboard',
  auto_refresh_interval INTEGER DEFAULT 30,  -- seconds, 0 = disabled
  
  -- Security
  session_timeout INTEGER DEFAULT 480,  -- minutes (8 hours)
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Doctor Settings Schema

```sql
CREATE TABLE doctor_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id) UNIQUE NOT NULL,
  
  -- Working hours override (from flows.md: "Doctor can set their own working hours")
  working_hours_override JSONB,
  
  -- Visit types (from flows.md: "Doctor can enable or disable virtual visits")
  supported_visit_types TEXT[] DEFAULT ARRAY['in_clinic', 'virtual'],
  video_visits_enabled BOOLEAN DEFAULT TRUE,
  allow_walk_ins BOOLEAN DEFAULT TRUE,
  allow_forced_booking BOOLEAN DEFAULT TRUE,
  
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Settings API Endpoints
- Leave as-is â€” no backend needed

**Reason:** These are post-funding features. Frontend demonstrates the vision. Backend implementation comes after raise.

---

## Settings Endpoints

```
# Clinic Profile (Admin)
GET    /api/settings/clinic
PUT    /api/settings/clinic

# Users & Permissions (Admin only)
GET    /api/settings/users
       â†’ List all users in clinic (admins, doctors, owners)
POST   /api/settings/users
       Body: { email, password, role, first_name, last_name, doctor_details? }
       â†’ Creates user account
       â†’ If role='doctor', also creates doctors table entry
PUT    /api/settings/users/:id
       Body: { first_name, last_name, email, ... }
       â†’ Update user details
POST   /api/settings/users/:id/disable
       â†’ Sets is_active = false (soft delete)
       â†’ User can no longer log in
POST   /api/settings/users/:id/enable
       â†’ Sets is_active = true
       â†’ Re-enables account

# Scheduling Rules (Admin)
GET    /api/settings/scheduling
PUT    /api/settings/scheduling
       â†’ { allow_overlapping, allow_walkins, cancellation_notice_hours, ... }

# Intake Settings (Admin)
GET    /api/settings/intake
PUT    /api/settings/intake
       â†’ { intake_required, remind_if_missing, ... }

# Notifications (Admin)
GET    /api/settings/notifications
PUT    /api/settings/notifications

# Doctor Preferences (Doctor - self only)
GET    /api/settings/my-preferences
PUT    /api/settings/my-preferences
       â†’ { working_hours, allows_virtual, allows_walkins, ai_calls_enabled }
```

---

## Real-Time Updates (WebSocket)

Basic WebSocket for live dashboard updates:

```typescript
// Events to emit (filtered by role)
interface WebSocketEvents {
  // Admin receives all
  'appointment:created': { appointment: Appointment }
  'appointment:updated': { appointment: Appointment }
  'appointment:cancelled': { appointment_id: string }
  'intake:completed': { appointment_id: string, has_summary: boolean }
  
  // Doctor receives only if their patient
  // Owner receives count updates only (no PII)
}

// Connection includes role, filters events accordingly
wss.on('connection', (ws, req) => {
  const user = authenticateWebSocket(req);
  
  ws.role = user.role;
  ws.doctor_id = user.doctor_id;  // For doctor filtering
  ws.clinic_id = user.clinic_id;
});
```

---

## Database Seeding for Demo

Create seed script with realistic demo data:

```typescript
// seeds/demo.ts
async function seedDemo() {
  // 1. Create clinic
  const clinic = await createClinic({
    name: 'Downtown Family Medicine',
    timezone: 'America/New_York'
  });

  // 2. Create users
  const admin = await createUser({ role: 'admin', email: 'admin@demo.com' });
  const doctor1 = await createUser({ role: 'doctor', email: 'dr.chen@demo.com' });
  const doctor2 = await createUser({ role: 'doctor', email: 'dr.patel@demo.com' });
  const owner = await createUser({ role: 'owner', email: 'owner@demo.com' });

  // 3. Create patients (15-20)
  const patients = await createPatients(20);

  // 4. Create today's appointments (mix of statuses)
  await createAppointments({
    date: new Date(),
    mix: {
      confirmed: 8,
      unconfirmed: 4,
      arrived: 2,
      completed: 3
    }
  });

  // 5. Create intake submissions with AI summaries
  await createIntakeSubmissions(/* for confirmed appointments */);
}
```

---

## Week 4: Demo Checklist

### Demo Flow 1: Admin Schedules Patient
- [ ] Admin logs in â†’ sees dashboard with today's stats
- [ ] Admin clicks +Add Patient â†’ completes flow
- [ ] Appointment appears in schedule
- [ ] Intake form sent (stub - just status change)

### Demo Flow 2: Patient Completes Intake
- [ ] Intake submission created (can be manual/seeded)
- [ ] AI summary generated via OpenAI
- [ ] Appointment shows "Intake Complete"

### Demo Flow 3: Doctor Prepares for Visit
- [ ] Doctor logs in â†’ sees only their appointments
- [ ] Doctor clicks patient â†’ sees AI intake summary
- [ ] Doctor adds note â†’ note saved

### Demo Flow 4: Owner Views Metrics
- [ ] Owner logs in â†’ sees metrics dashboard
- [ ] Owner sees no patient names anywhere
- [ ] Owner can filter by date range

---

## Tech Stack (from work.md)

| Component | Technology |
|-----------|------------|
| Framework | FastAPI (Python 3.11+) |
| Database | PostgreSQL 15+ |
| ORM | SQLAlchemy 2.0 + Alembic (migrations) |
| Cache/Queue | Redis |
| Real-time | WebSockets (FastAPI native) |
| Auth | JWT (python-jose) + refresh tokens |
| AI | OpenAI API (GPT-4) |
| Validation | Pydantic v2 |
| Task Queue | Celery + Redis (for async AI tasks) |

---

## File Structure (from work.md)

```
backend/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ main.py                 # FastAPI app entry
â”‚   â”œâ”€â”€ config.py               # Settings & env vars
â”‚   â”œâ”€â”€ database.py             # DB connection
â”‚   â”‚
â”‚   â”œâ”€â”€ models/                 # SQLAlchemy models
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ user.py
â”‚   â”‚   â”œâ”€â”€ clinic.py
â”‚   â”‚   â”œâ”€â”€ doctor.py
â”‚   â”‚   â”œâ”€â”€ patient.py
â”‚   â”‚   â”œâ”€â”€ appointment.py
â”‚   â”‚   â”œâ”€â”€ cancellation.py
â”‚   â”‚   â”œâ”€â”€ intake.py
â”‚   â”‚   â”œâ”€â”€ ai_summary.py
â”‚   â”‚   â”œâ”€â”€ doctor_note.py
â”‚   â”‚   â””â”€â”€ follow_up.py
â”‚   â”‚
â”‚   â”œâ”€â”€ schemas/                # Pydantic schemas
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ user.py
â”‚   â”‚   â”œâ”€â”€ appointment.py
â”‚   â”‚   â”œâ”€â”€ patient.py
â”‚   â”‚   â”œâ”€â”€ intake.py
â”‚   â”‚   â””â”€â”€ dashboard.py
â”‚   â”‚
â”‚   â”œâ”€â”€ api/                    # Route handlers
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ deps.py             # Dependencies (auth, db)
â”‚   â”‚   â”œâ”€â”€ auth.py
â”‚   â”‚   â”œâ”€â”€ appointments.py
â”‚   â”‚   â”œâ”€â”€ patients.py
â”‚   â”‚   â”œâ”€â”€ intake.py
â”‚   â”‚   â”œâ”€â”€ schedule.py
â”‚   â”‚   â”œâ”€â”€ dashboard.py        # Admin/Doctor dashboard endpoints
â”‚   â”‚   â”œâ”€â”€ doctor_notes.py
â”‚   â”‚   â”œâ”€â”€ follow_ups.py
â”‚   â”‚   â”œâ”€â”€ settings.py
â”‚   â”‚   â””â”€â”€ websocket.py
â”‚   â”‚
â”‚   â”œâ”€â”€ services/               # Business logic
â”‚   â”‚   â”œâ”€â”€ __init__.py
â”‚   â”‚   â”œâ”€â”€ auth_service.py
â”‚   â”‚   â”œâ”€â”€ appointment_service.py
â”‚   â”‚   â”œâ”€â”€ patient_service.py
â”‚   â”‚   â”œâ”€â”€ intake_service.py
â”‚   â”‚   â”œâ”€â”€ dashboard_service.py  # Stats, needs-attention queries
â”‚   â”‚   â””â”€â”€ ai_service.py
â”‚   â”‚
â”‚   â”œâ”€â”€ core/                   # Core utilities
â”‚   â”‚   â”œâ”€â”€ security.py         # JWT, hashing
â”‚   â”‚   â”œâ”€â”€ permissions.py      # Role-based access
â”‚   â”‚   â””â”€â”€ exceptions.py
â”‚   â”‚
â”‚   â””â”€â”€ tasks/                  # Celery tasks
â”‚       â”œâ”€â”€ __init__.py
â”‚       â””â”€â”€ ai_tasks.py
â”‚
â”œâ”€â”€ alembic/                    # DB migrations
â”œâ”€â”€ tests/
â”œâ”€â”€ requirements.txt
â”œâ”€â”€ Dockerfile
â””â”€â”€ docker-compose.yml
```

---

## Summary: What Ships vs What Waits

| Ships Now (Backend) | Waits for Post-Funding (No Backend Now) |
|---------------------|----------------------------------------|
| Auth + Roles | Voice AI (frontend already done, uses mock data) |
| Clinic/Doctor/Patient CRUD | Owner Analytics (frontend already done, uses mock data) |
| Appointment scheduling | Automation Rules (frontend already done, uses mock data) |
| Dashboard stats (hero cards) | SMS/Email automation |
| Needs Attention queue | Complex analytics pipelines |
| Patient search & filters | Full form builder |
| Appointment detail view | Medical AI features |
| Cancellation history | Multi-location support |
| Basic intake forms | Audit logging |
| **Public intake token system** | |
| AI intake summary | |
| Doctor Notes | |
| Follow-up scheduling | |
| Role-filtered data access | |
| WebSocket updates | |
| Demo seeding | |

---

**This is your MVP backend scope. Build exactly this. Nothing more.**

