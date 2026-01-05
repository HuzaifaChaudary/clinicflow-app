# ClinicFlow Backend API Endpoints

## Test Environment Status
- **Server:** Not tested (Docker/Database unavailable during testing)
- **Documentation:** Based on source code analysis
- **Expected Behavior:** All endpoints should work when server is running with database

---

## 1. Health Check

### GET `/health`
**Status:** ✓ Expected to work  
**Auth Required:** No  
**Description:** Health check endpoint  
**Payload:** None  
**Response:**
```json
{
  "status": "ok"
}
```

---

## 2. Authentication Endpoints

### POST `/api/auth/login`
**Status:** ✓ Expected to work  
**Auth Required:** No  
**Description:** Login with email and password  
**Payload:**
```json
{
  "email": "admin@clinic.com",
  "password": "admin123"
}
```
**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Admin Credentials:**
- Email: `admin@clinic.com`
- Password: `admin123`

**Doctor Credentials:**
- Email: `sarah.chen@clinic.com`
- Password: `doctor123`

---

### GET `/api/auth/me`
**Status:** ✓ Expected to work  
**Auth Required:** Yes (Bearer token)  
**Description:** Get current authenticated user information  
**Payload:** None  
**Response:**
```json
{
  "id": "uuid",
  "email": "admin@clinic.com",
  "name": "Admin User",
  "role": "admin",
  "clinic_id": "uuid",
  "status": "active",
  "created_at": "2026-01-05T10:00:00Z"
}
```

---

### POST `/api/auth/google/signup`
**Status:** ✓ Expected to work  
**Auth Required:** No  
**Description:** Sign up new user with Google OAuth and create clinic  
**Payload:**
```json
{
  "google_token": "google_oauth_token_here",
  "clinic_name": "My Clinic",
  "clinic_type": "primary-care",
  "clinic_size": "2-5",
  "clinic_timezone": "America/New_York"
}
```

---

### POST `/api/auth/google/login`
**Status:** ✓ Expected to work  
**Auth Required:** No  
**Description:** Login existing user with Google OAuth  
**Payload:**
```json
{
  "google_token": "google_oauth_token_here"
}
```

---

## 3. Doctors Endpoints

### GET `/api/doctors`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** List all doctors in the clinic  
**Payload:** None  
**Query Params:** `skip=0`, `limit=100`  
**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Dr. Sarah Chen",
    "specialty": "Family Medicine",
    "initials": "SC",
    "color": "#4A90A4",
    "clinic_id": "uuid",
    "created_at": "2026-01-05T10:00:00Z"
  }
]
```

---

### GET `/api/doctors/{doctor_id}`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Get specific doctor details  
**Payload:** None  
**Response:**
```json
{
  "id": "uuid",
  "name": "Dr. Sarah Chen",
  "specialty": "Family Medicine",
  "initials": "SC",
  "color": "#4A90A4",
  "clinic_id": "uuid",
  "created_at": "2026-01-05T10:00:00Z"
}
```

---

### POST `/api/doctors`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✗ Expected to fail (403 Forbidden)  
**Auth Required:** Yes (Admin only)  
**Description:** Create a new doctor  
**Payload:**
```json
{
  "name": "Dr. John Smith",
  "specialty": "Cardiology",
  "initials": "JS",
  "color": "#FF5733"
}
```
**Response:**
```json
{
  "id": "uuid",
  "name": "Dr. John Smith",
  "specialty": "Cardiology",
  "initials": "JS",
  "color": "#FF5733",
  "clinic_id": "uuid",
  "created_at": "2026-01-05T10:00:00Z"
}
```

---

### PUT `/api/doctors/{doctor_id}`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✗ Expected to fail (403 Forbidden)  
**Auth Required:** Yes (Admin only)  
**Description:** Update doctor information  
**Payload:**
```json
{
  "name": "Dr. John Smith Jr.",
  "specialty": "Cardiology"
}
```

---

### DELETE `/api/doctors/{doctor_id}`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✗ Expected to fail (403 Forbidden)  
**Auth Required:** Yes (Admin only)  
**Description:** Delete a doctor  
**Payload:** None  
**Response:** 204 No Content

---

## 4. Patients Endpoints

### GET `/api/patients`
**Admin Status:** ✓ Expected to work (sees all patients)  
**Doctor Status:** ✓ Expected to work (sees only their patients)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** List patients (role-based filtering with search and date filters)  
**Payload:** None  
**Query Params:** 
- `skip=0` - Pagination offset
- `limit=100` - Maximum results
- `search=john` - Search by name, email, or phone (optional)
- `created_after=2024-01-01` - Filter by creation date (optional)
- `created_before=2024-12-31` - Filter by creation date (optional)
**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "555-1234",
      "date_of_birth": "1990-01-15",
      "clinic_id": "uuid",
      "created_at": "2026-01-05T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

### GET `/api/patients/{patient_id}`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work (if patient is theirs)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Get specific patient details  
**Payload:** None

---

### POST `/api/patients`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Create a new patient  
**Payload:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "phone": "555-5678",
  "date_of_birth": "1985-05-20"
}
```
**Response:**
```json
{
  "id": "uuid",
  "first_name": "Jane",
  "last_name": "Smith",
  "full_name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "555-5678",
  "date_of_birth": "1985-05-20",
  "clinic_id": "uuid",
  "created_at": "2026-01-05T10:00:00Z"
}
```

---

### PUT `/api/patients/{patient_id}`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Update patient information  
**Payload:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith-Johnson",
  "phone": "555-9999"
}
```

---

### DELETE `/api/patients/{patient_id}`
**Admin Status:** ✓ Expected to work (if no appointments)  
**Doctor Status:** ✗ Expected to fail (403 Forbidden)  
**Auth Required:** Yes (Admin only)  
**Description:** Delete a patient (validates no existing appointments)  
**Payload:** None  
**Response:** 
- 204 No Content (success)
- 400 Bad Request (if appointments exist)
```json
{
  "detail": "Cannot delete patient with 3 existing appointments"
}
```

---

### GET `/api/patients/{patient_id}/appointments`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work (if patient is theirs)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Get all appointments for a patient  
**Payload:** None  
**Response:**
```json
[
  {
    "id": "uuid",
    "date": "2026-01-10",
    "start_time": "09:00:00",
    "end_time": "09:30:00",
    "status": "confirmed",
    "doctor": {
      "id": "uuid",
      "name": "Dr. Sarah Chen"
    }
  }
]
```

---

## 5. Appointments Endpoints

### GET `/api/appointments`
**Admin Status:** ✓ Expected to work (sees all appointments)  
**Doctor Status:** ✓ Expected to work (sees only their appointments)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** List appointments with filters  
**Payload:** None  
**Query Params:**
- `skip=0`
- `limit=100`
- `date=2026-01-10` (optional)
- `doctor_id=uuid` (optional)
- `patient_id=uuid` (optional)
- `status=confirmed` (optional)

**Response:**
```json
[
  {
    "id": "uuid",
    "doctor_id": "uuid",
    "patient_id": "uuid",
    "date": "2026-01-10",
    "start_time": "09:00:00",
    "end_time": "09:30:00",
    "duration": 30,
    "visit_type": "in-clinic",
    "visit_category": "new-patient",
    "status": "confirmed",
    "intake_status": "missing",
    "arrived": false,
    "doctor": {
      "id": "uuid",
      "name": "Dr. Sarah Chen",
      "specialty": "Family Medicine"
    },
    "patient": {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe"
    }
  }
]
```

---

### GET `/api/appointments/{appointment_id}`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work (if appointment is theirs)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Get specific appointment details  
**Payload:** None

---

### POST `/api/appointments`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Create a new appointment  
**Payload:**
```json
{
  "doctor_id": "uuid",
  "patient_id": "uuid",
  "date": "2026-01-10",
  "start_time": "14:00:00",
  "end_time": "14:30:00",
  "duration": 30,
  "visit_type": "in-clinic",
  "visit_category": "new-patient"
}
```
**Response:** 201 Created with appointment object

---

### PUT `/api/appointments/{appointment_id}`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work (if appointment is theirs)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Update appointment information  
**Payload:**
```json
{
  "visit_type": "virtual",
  "meeting_link": "https://zoom.us/j/123456789"
}
```

---

### POST `/api/appointments/{appointment_id}/confirm`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work (if appointment is theirs)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Confirm an appointment (changes status to "confirmed")  
**Payload:**
```json
{}
```

---

### POST `/api/appointments/{appointment_id}/arrive`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work (if appointment is theirs)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Mark patient as arrived  
**Payload:**
```json
{}
```

---

### POST `/api/appointments/{appointment_id}/cancel`
**Admin Status:** ✓ Expected to work  
**Doctor Status:** ✓ Expected to work (if appointment is theirs)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** Cancel an appointment  
**Payload:**
```json
{
  "cancellation_type": "clinic-cancelled",
  "reason_note": "Patient called to cancel"
}
```

**Cancellation Types:**
- `patient-cancelled`
- `no-show`
- `rescheduled-externally`
- `clinic-cancelled`
- `other`

---

## 6. Intake Forms Endpoints

### GET `/api/intake/forms`
**Admin Status:** ✓ Expected to work (sees all forms)  
**Doctor Status:** ✓ Expected to work (sees only their patients' forms)  
**Auth Required:** Yes (Admin or Doctor)  
**Description:** List intake forms (role-based filtering with pagination, status, and date filters)  
**Payload:** None  
**Query Params:** 
- `skip=0` - Pagination offset
- `limit=100` - Maximum results
- `status=pending` - Filter by status: "pending", "completed", "reviewed" (optional)
- `submitted_after=2024-01-01` - Filter by submission date (optional)
- `submitted_before=2024-12-31` - Filter by submission date (optional)
**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "clinic_id": "uuid",
      "patient_id": "uuid",
      "appointment_id": "uuid",
      "raw_answers": {"question1": "answer1"},
      "status": "pending",
      "submitted_at": "2026-01-05T10:00:00Z",
      "created_at": "2026-01-05T10:00:00Z",
      "ai_summary": {
        "id": "uuid",
        "summary_text": "Patient summary...",
        "patient_concerns": ["headache", "fatigue"],
        "medications": ["aspirin"],
        "allergies": ["penicillin"],
        "key_notes": "Important notes",
        "generated_at": "2026-01-05T10:05:00Z"
      }
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 100
}
```

---

## Summary

### Endpoints by Section
- **Health:** 1 endpoint
- **Authentication:** 4 endpoints
- **Doctors:** 5 endpoints
- **Patients:** 6 endpoints (added DELETE)
- **Appointments:** 8 endpoints
- **Intake Forms:** 1 endpoint (with pagination and filters)
- **Total:** 25 endpoints

### Role-Based Access Control

**Admin Role:**
- ✓ Full access to all endpoints
- ✓ Can create/update/delete doctors
- ✓ Can see all patients and appointments

**Doctor Role:**
- ✓ Can view all doctors
- ✗ Cannot create/update/delete doctors
- ✓ Can view only their own patients
- ✓ Can view only their own appointments
- ✓ Can create patients and appointments

### Authentication
All endpoints except `/health` and `/api/auth/login` require Bearer token authentication:
```
Authorization: Bearer <token>
```

### Test Credentials (After Seed Script)
**Admin:**
- Email: `admin@clinic.com`
- Password: `admin123`

**Doctors:**
- Email: `sarah.chen@clinic.com`
- Password: `doctor123`
- Email: `james.wilson@clinic.com`
- Password: `doctor123`
- (3 more doctors with pattern: `firstname.lastname@clinic.com`)

---

## Notes

1. **Database Required:** All endpoints require PostgreSQL database to be running
2. **Seed Data:** Run `python app/seed.py` to populate test data
3. **CORS:** Frontend origins `localhost:5173` and `localhost:3000` are allowed
4. **Pagination:** List endpoints support `skip` and `limit` query parameters
5. **Role Filtering:** Doctor role automatically filters results to show only their data
6. **Status Codes:**
   - 200: Success
   - 201: Created
   - 204: No Content (Delete)
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 422: Validation Error

---

**Generated:** January 5, 2026  
**Backend Version:** 1.0.0  
**Test Status:** Documented from source code (server not tested due to Docker unavailability)
