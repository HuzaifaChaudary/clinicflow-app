# ClinicFlow Backend Implementation Documentation - Part 2

**Status: Phase 3 Complete & Phase 4 Started (Days 5-8)**

This document details **everything** that was built in the second 20% of the MVP backend implementation, covering Phase 3 (Authentication System) and the beginning of Phase 4 (Core CRUD APIs - Pydantic Schemas).

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 3: Authentication System (Days 5-7)](#phase-3-authentication-system-days-5-7)
3. [Phase 4: Core CRUD APIs - Day 8 (Pydantic Schemas)](#phase-4-core-crud-apis-day-8-pydantic-schemas)
4. [Summary](#summary)

---

## Overview

### What This Document Covers

This is **backend2.md** covering the second 20% of implementation work (21-40%):
- **Phase 3: Authentication System** (Days 5-7) - Complete authentication infrastructure with JWT, password hashing, Google OAuth, role-based access control, and seed data
- **Phase 4: Core CRUD APIs - Day 8** (Pydantic Schemas) - Request/response validation schemas for Clinic, Doctor, Patient, and Appointment entities

### What's Not Covered Here

The remaining 60% of work will be documented in subsequent files:
- Phase 4: Core CRUD APIs - Days 9-12 (Routers implementation)
- Phase 5: Scheduling Engine
- Phase 6: Intake System
- Phase 7: AI Intake Summary
- Phase 8: Dashboard APIs
- Phase 9: Frontend Integration
- Phase 10: Demo Preparation

### Implementation Approach

Every single task from MVP.md was implemented line-by-line without skipping. All authentication flows, security utilities, dependencies, and schemas were built exactly as specified.

---

## Phase 3: Authentication System (Days 5-7)

### Day 5: Security Utilities

#### Task 3.1: Create Password Hashing

**Purpose:** Implement secure password storage and verification using bcrypt hashing.

**File Created:** `app/core/security.py` (42 lines)

**Functions Implemented:**

1. **`hash_password(password: str) -> str`**
   - **Purpose:** Hash a plain text password using bcrypt
   - **Implementation:** Uses passlib's CryptContext with bcrypt scheme
   - **Security:** Bcrypt automatically handles salting and rounds
   - **Returns:** Hashed password string (storable in database)

2. **`verify_password(plain_password: str, hashed_password: str) -> bool`**
   - **Purpose:** Verify a plain text password against a stored hash
   - **Implementation:** Uses passlib's verify method
   - **Returns:** True if password matches, False otherwise
   - **Security:** Timing-safe comparison prevents timing attacks

3. **`create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str`**
   - **Purpose:** Create JWT access token for authenticated users
   - **Implementation:** Uses python-jose library with HS256 algorithm
   - **Token Payload Contains:**
     - `sub`: User ID (subject)
     - `role`: User role (admin, doctor, owner)
     - `clinic_id`: User's clinic ID
     - `doctor_id`: Doctor ID if user is a doctor (optional)
     - `exp`: Expiration timestamp (default 480 minutes from settings)
     - `iat`: Issued at timestamp
   - **Configuration:** Uses JWT_SECRET_KEY and JWT_ALGORITHM from settings
   - **Returns:** Encoded JWT token string

4. **`decode_access_token(token: str) -> dict`**
   - **Purpose:** Decode and verify JWT token
   - **Implementation:** Verifies token signature and expiration
   - **Error Handling:** Raises ValueError if token is invalid or expired
   - **Returns:** Decoded token payload (dict) or raises exception

**Configuration:**
- Uses `CryptContext` with bcrypt scheme
- Default password hashing rounds: 12 (bcrypt default)
- Token expiration: Configurable via `ACCESS_TOKEN_EXPIRE_MINUTES` setting (default: 480 minutes = 8 hours)

**Security Features:**
- Bcrypt password hashing (industry standard)
- JWT token-based authentication (stateless)
- Token expiration prevents indefinite access
- Signature verification prevents token tampering

#### Task 3.2: Create Auth Dependencies

**Purpose:** FastAPI dependencies for authentication and authorization.

**File Created:** `app/api/deps.py` (65 lines)

**Dependencies Implemented:**

1. **`get_current_user(token: str, db: Session) -> User`**
   - **Purpose:** Extract and validate current authenticated user from JWT token
   - **Implementation Details:**
     - Uses `OAuth2PasswordBearer` to extract token from Authorization header
     - Token format: `Bearer <token>`
     - Decodes token using `decode_access_token`
     - Extracts user ID from token payload (`sub` claim)
     - Queries database for user by ID
     - Returns User model instance
   - **Error Handling:**
     - Raises HTTP 401 if token is missing or invalid
     - Raises HTTP 401 if user ID not found in token
     - Raises HTTP 401 if user not found in database
   - **Returns:** User SQLAlchemy model object

2. **`require_admin(current_user: User) -> User`**
   - **Purpose:** Dependency to restrict endpoint to admin role only
   - **Implementation:** Checks `current_user.role == "admin"`
   - **Error Handling:** Raises HTTP 403 if user is not admin
   - **Usage:** Used as dependency in admin-only endpoints
   - **Returns:** User object if admin, otherwise raises exception

3. **`require_doctor(current_user: User) -> User`**
   - **Purpose:** Dependency to restrict endpoint to doctor role only
   - **Implementation:** Checks `current_user.role == "doctor"`
   - **Error Handling:** Raises HTTP 403 if user is not doctor
   - **Usage:** Used as dependency in doctor-only endpoints
   - **Returns:** User object if doctor, otherwise raises exception

4. **`require_admin_or_doctor(current_user: User) -> User`**
   - **Purpose:** Dependency to allow both admin and doctor roles
   - **Implementation:** Checks `current_user.role in ["admin", "doctor"]`
   - **Error Handling:** Raises HTTP 403 if user is not admin or doctor
   - **Usage:** Used in endpoints accessible to both admin and doctor (most CRUD operations)
   - **Returns:** User object if admin or doctor, otherwise raises exception

**OAuth2 Configuration:**
- Token URL: `api/auth/login`
- Token extraction from Authorization header automatically
- Bearer token scheme required

**Database Integration:**
- Uses `get_db` dependency for database session
- Queries User model using SQLAlchemy
- Returns full User object with all relationships loaded

**Security Features:**
- Token validation before database query
- Role-based access control at dependency level
- Reusable dependencies prevent code duplication
- Clear error messages for unauthorized access

### Day 6: Auth Endpoints

#### Task 3.3: Create Auth Schemas

**Purpose:** Pydantic schemas for authentication request/response validation.

**File Created:** `app/schemas/auth.py` (43 lines)

**Schemas Defined:**

1. **`LoginRequest`**
   - **Fields:**
     - `email: EmailStr` - User email (validated email format)
     - `password: str` - Plain text password
   - **Purpose:** Request body for login endpoint
   - **Validation:** Email format automatically validated by Pydantic

2. **`TokenResponse`**
   - **Fields:**
     - `access_token: str` - JWT token string
     - `token_type: str` - Always "bearer" (default value)
   - **Purpose:** Response from login/signup endpoints
   - **Standard:** Follows OAuth2 token response format

3. **`UserResponse`**
   - **Fields:**
     - `id: UUID` - User ID
     - `email: str` - User email
     - `name: str` - User full name
     - `role: str` - User role (admin, doctor, owner)
     - `clinic_id: UUID` - Associated clinic ID
     - `doctor_id: Optional[UUID]` - Associated doctor ID (if user is doctor)
   - **Purpose:** Response for current user info endpoint
   - **Configuration:** Uses `from_attributes = True` for SQLAlchemy ORM mode

4. **`GoogleSignupRequest`**
   - **Fields:**
     - `id_token: str` - Google ID token from OAuth flow
     - `full_name: str` - User's full name (can override Google name)
     - `clinic_name: str` - Clinic name (required for signup)
     - `clinic_type: Optional[str]` - Clinic type (primary-care, specialty, dental, physical-therapy, mental-health, other)
     - `clinic_size: Optional[str]` - Clinic size (solo, 2-5, 6-10, 10plus)
     - `email: Optional[str]` - Email from form (verified against Google)
     - `phone: Optional[str]` - Phone number
     - `timezone: str` - Clinic timezone (default: "America/New_York")
     - `role: str` - User role (default: "owner" for signups)
   - **Purpose:** Request body for Google OAuth signup
   - **Validation:** All clinic fields validated against allowed values

5. **`GoogleLoginRequest`**
   - **Fields:**
     - `id_token: str` - Google ID token from OAuth flow
   - **Purpose:** Request body for Google OAuth login
   - **Validation:** Token validated against Google's API

**Pydantic v2 Features:**
- Email validation using `EmailStr`
- UUID type validation
- Optional fields with defaults
- Type hints for all fields

#### Task 3.4: Create Auth Router

**Purpose:** FastAPI router with authentication endpoints.

**File Created:** `app/api/auth.py` (255 lines)

**Endpoints Implemented:**

1. **`POST /api/auth/login`**
   - **Purpose:** Authenticate user with email and password, return JWT token
   - **Request Body:** `LoginRequest` (email, password)
   - **Response:** `TokenResponse` (access_token, token_type)
   - **Implementation Flow:**
     1. Query user by email from database
     2. Return HTTP 401 if user not found
     3. Verify password using `verify_password` function
     4. Return HTTP 401 if password incorrect
     5. Check if user is Google OAuth only (no password_hash) - return appropriate error
     6. Check user status is "active" - return HTTP 403 if inactive
     7. Create JWT token with user info in payload
     8. Return token response
   - **Security:** Password never returned, only token
   - **Error Messages:** Generic "Incorrect email or password" to prevent user enumeration
   - **Status Codes:**
     - 200: Success
     - 401: Invalid credentials
     - 403: User inactive

2. **`GET /api/auth/me`**
   - **Purpose:** Get current authenticated user information
   - **Authentication:** Required (uses `get_current_user` dependency)
   - **Response:** `UserResponse` (id, email, name, role, clinic_id, doctor_id)
   - **Implementation Flow:**
     1. Extract current user from JWT token (via dependency)
     2. Convert User model to UserResponse schema
     3. Return user information
   - **Security:** Token must be valid and user must exist
   - **Status Codes:**
     - 200: Success
     - 401: Invalid or missing token
     - 403: User inactive

3. **`POST /api/auth/google/signup`** (Bonus - Not in original MVP, added for Google OAuth)
   - **Purpose:** Sign up new user with Google OAuth, create clinic
   - **Request Body:** `GoogleSignupRequest` (id_token, full_name, clinic_name, etc.)
   - **Response:** `TokenResponse` (access_token, token_type)
   - **Implementation Flow:**
     1. Verify Google ID token using `verify_google_token` service
     2. Return HTTP 401 if token invalid or email not verified
     3. Extract email, name, google_id from verified token
     4. Validate email matches form email if provided
     5. Use form name if provided, otherwise use Google name
     6. Check if user already exists (by email or google_id) - return HTTP 400 if exists
     7. Validate role is one of: admin, doctor, owner
     8. Validate clinic_type if provided (must be in allowed list)
     9. Validate clinic_size if provided (must be in allowed list)
     10. Create new Clinic record with provided information
     11. Store phone in clinic_metadata JSONB field if provided
     12. Create new User record with Google OAuth (no password_hash)
     13. Create JWT token with user info
     14. Return token response
   - **Status Codes:**
     - 200: Success (user and clinic created)
     - 400: User exists, invalid role, invalid clinic fields
     - 401: Invalid Google token

4. **`POST /api/auth/google/login`** (Bonus - Not in original MVP, added for Google OAuth)
   - **Purpose:** Login existing user with Google OAuth
   - **Request Body:** `GoogleLoginRequest` (id_token)
   - **Response:** `TokenResponse` (access_token, token_type)
   - **Implementation Flow:**
     1. Verify Google ID token using `verify_google_token` service
     2. Return HTTP 401 if token invalid or email not verified
     3. Extract email and google_id from verified token
     4. Query user by email or google_id
     5. Return HTTP 404 if user not found (must signup first)
     6. Update user.google_id if not set (migration from email-only to Google)
     7. Update user.name if Google name changed
     8. Check user status is "active" - return HTTP 403 if inactive
     9. Create JWT token with user info
     10. Return token response
   - **Status Codes:**
     - 200: Success
     - 401: Invalid Google token
     - 403: User inactive
     - 404: User not found

**Router Configuration:**
- Prefix: `/api/auth`
- Tags: `["auth"]` for Swagger UI grouping
- All endpoints properly documented with docstrings

**Google OAuth Service Integration:**
- Uses `app/services/google_auth.py` for token verification
- Verifies token against Google's tokeninfo endpoint
- Validates audience matches configured CLIENT_ID
- Handles errors gracefully with appropriate HTTP status codes

### Day 7: Seed Data

#### Task 3.5: Create Seed Script

**Purpose:** Create initial test data for development and demos.

**File Created:** `app/seed.py` (245 lines)

**Functions Implemented:**

1. **`clear_data()`**
   - **Purpose:** Clear all existing data to allow re-running seed script
   - **Implementation Details:**
     - Deletes in correct order to respect foreign key constraints
     - Order: Appointments → Patients → (Null FK) → Users → Doctors → Clinics
     - Handles circular dependency between Users and Doctors by setting FKs to NULL first
     - Uses SQLAlchemy bulk operations for efficiency
     - Commits transaction after all deletions
   - **Error Handling:** Handles foreign key violations gracefully

2. **`create_clinic()`**
   - **Purpose:** Create a sample clinic
   - **Data Created:**
     - Name: "Downtown Medical Center"
     - Timezone: "America/New_York"
   - **Returns:** Clinic object
   - **Database:** Inserts and commits clinic record

3. **`create_admin(clinic_id)`**
   - **Purpose:** Create admin user for testing
   - **Data Created:**
     - Email: "admin@clinic.com"
     - Password: "admin123" (hashed using bcrypt)
     - Name: "Admin User"
     - Role: "admin"
     - Status: "active"
     - Clinic ID: Provided clinic_id
   - **Returns:** User object
   - **Security:** Password properly hashed before storage

4. **`create_doctors(clinic_id)`**
   - **Purpose:** Create 5 doctors matching frontend mock data
   - **Doctors Created:**
     1. Dr. Sarah Chen - Family Medicine - Color: #4A90A4
     2. Dr. Michael Park - Internal Medicine - Color: #6B8E23
     3. Dr. Jennifer Williams - Pediatrics - Color: #8B4513
     4. Dr. David Rodriguez - Cardiology - Color: #DC143C
     5. Dr. Emily Thompson - Dermatology - Color: #9370DB
   - **For Each Doctor:**
     - Creates Doctor record (name, initials, specialty, color)
     - Creates User account (email, password, role="doctor")
     - Links User to Doctor via doctor_id foreign key
     - Links Doctor to User via user_id foreign key
     - Sets initial password: "doctor123" (hashed)
   - **Implementation:** Uses db.flush() to get IDs before committing
   - **Returns:** List of Doctor objects

5. **`create_patients(clinic_id)`**
   - **Purpose:** Create 10 sample patients
   - **Data Pattern:**
     - First names: John, Jane, Michael, Sarah, David, Emily, Robert, Jessica, William, Amanda
     - Last names: Smith, Johnson, Williams, Brown, Jones, Garcia, Miller, Davis, Rodriguez, Martinez
     - Emails: firstname.lastname@email.com
     - Phones: 555-1000 through 555-1009
   - **Returns:** List of Patient objects
   - **Database:** Bulk inserts all patients in single transaction

6. **`create_appointments(clinic_id, doctors, patients)`**
   - **Purpose:** Create 20 sample appointments
   - **Data Distribution:**
     - Dates: Today through next 7 days (random)
     - Times: 9 AM to 4:30 PM in 30-minute intervals (random)
     - Statuses: Mix of confirmed and unconfirmed
     - Visit types: Mix of in-clinic and virtual
     - Visit categories: Mix of new-patient and follow-up
     - Intake statuses: Mix of completed, missing, and sent
     - Randomly assigned to doctors and patients
   - **Implementation:** Generates realistic appointment data using random selection
   - **Returns:** List of Appointment objects

7. **`main()`**
   - **Purpose:** Main seed script entry point
   - **Execution Flow:**
     1. Print "Starting seed script..."
     2. Clear existing data
     3. Create clinic
     4. Create admin user
     5. Create 5 doctors with user accounts
     6. Create 10 patients
     7. Create 20 appointments
     8. Print completion message with login credentials
   - **Error Handling:** Database errors handled by SQLAlchemy
   - **Usage:** Can be run as `python app/seed.py` or `python -m app.seed`

**Path Handling:**
- Includes sys.path modification to allow running directly
- Works from any directory when run correctly

**Output:**
- Prints progress for each step
- Shows created counts (doctors, patients, appointments)
- Displays login credentials at end:
  - Admin: admin@clinic.com / admin123
  - Doctors: sarah.chen@clinic.com / doctor123 (and others)

**Database Integrity:**
- All foreign keys properly set
- Circular dependencies handled correctly
- Data relationships maintained (doctors linked to users, appointments to doctors/patients)

**Test Credentials Created:**
- 1 Admin user
- 5 Doctor users (each with linked doctor profile)
- Total: 6 users for testing different roles

---

## Phase 4: Core CRUD APIs - Day 8 (Pydantic Schemas)

### Day 8: Pydantic Schemas

#### Task 4.1: Create Clinic Schemas

**Purpose:** Request/response validation schemas for Clinic entity.

**File Created:** `app/schemas/clinic.py` (27 lines)

**Schemas Defined:**

1. **`ClinicCreate`**
   - **Fields:**
     - `name: str` - Clinic name (required)
     - `timezone: str` - Timezone (default: "America/New_York")
   - **Purpose:** Request body for creating new clinic
   - **Validation:** Name must be non-empty string
   - **Usage:** POST /api/clinics endpoint

2. **`ClinicUpdate`**
   - **Fields:**
     - `name: Optional[str]` - Clinic name (optional)
     - `timezone: Optional[str]` - Timezone (optional)
   - **Purpose:** Request body for updating clinic
   - **Validation:** All fields optional for partial updates
   - **Usage:** PUT /api/clinics/{id} endpoint

3. **`ClinicResponse`**
   - **Fields:**
     - `id: UUID` - Clinic ID
     - `name: str` - Clinic name
     - `timezone: str` - Clinic timezone
     - `created_at: datetime` - Creation timestamp
     - `updated_at: datetime` - Last update timestamp
   - **Purpose:** Response schema for clinic data
   - **Configuration:** Uses `from_attributes = True` for SQLAlchemy ORM mode
   - **Usage:** All GET endpoints returning clinic data

**Pydantic Features:**
- Automatic UUID validation
- DateTime parsing from database
- ORM mode for SQLAlchemy model conversion

#### Task 4.2: Create Doctor Schemas

**Purpose:** Request/response validation schemas for Doctor entity.

**File Created:** `app/schemas/doctor.py` (38 lines)

**Schemas Defined:**

1. **`DoctorCreate`**
   - **Fields:**
     - `name: str` - Doctor full name (required)
     - `initials: Optional[str]` - Doctor initials (for calendar display)
     - `specialty: Optional[str]` - Medical specialty
     - `color: Optional[str]` - Color code for calendar UI (hex format)
   - **Purpose:** Request body for creating new doctor
   - **Validation:** Name required, other fields optional
   - **Usage:** POST /api/doctors endpoint

2. **`DoctorUpdate`**
   - **Fields:**
     - `name: Optional[str]` - Doctor name (optional)
     - `initials: Optional[str]` - Doctor initials (optional)
     - `specialty: Optional[str]` - Medical specialty (optional)
     - `color: Optional[str]` - Color code (optional)
   - **Purpose:** Request body for updating doctor
   - **Validation:** All fields optional for partial updates
   - **Usage:** PUT /api/doctors/{id} endpoint

3. **`DoctorResponse`**
   - **Fields:**
     - `id: UUID` - Doctor ID
     - `clinic_id: UUID` - Associated clinic ID
     - `name: str` - Doctor name
     - `initials: Optional[str]` - Doctor initials
     - `specialty: Optional[str]` - Medical specialty
     - `color: Optional[str]` - Calendar color
     - `created_at: datetime` - Creation timestamp
   - **Purpose:** Response schema for doctor data
   - **Configuration:** Uses `from_attributes = True`
   - **Usage:** All GET endpoints returning doctor data

4. **`DoctorList`**
   - **Fields:**
     - `items: List[DoctorResponse]` - List of doctor responses
     - `total: int` - Total count of doctors
   - **Purpose:** Response schema for paginated doctor list
   - **Usage:** GET /api/doctors endpoint

**Design Decisions:**
- Color field stored as string (hex format like "#4A90A4")
- Initials field for calendar/UI display
- Specialty stored as free text (not enum) for flexibility

#### Task 4.3: Create Patient Schemas

**Purpose:** Request/response validation schemas for Patient entity.

**File Created:** `app/schemas/patient.py` (43 lines)

**Schemas Defined:**

1. **`PatientCreate`**
   - **Fields:**
     - `first_name: str` - Patient first name (required)
     - `last_name: str` - Patient last name (required)
     - `email: Optional[str]` - Patient email (optional)
     - `phone: Optional[str]` - Patient phone (optional)
     - `date_of_birth: Optional[date]` - Date of birth (optional)
   - **Purpose:** Request body for creating new patient
   - **Validation:** First and last name required, other fields optional
   - **Usage:** POST /api/patients endpoint

2. **`PatientUpdate`**
   - **Fields:**
     - `first_name: Optional[str]` - First name (optional)
     - `last_name: Optional[str]` - Last name (optional)
     - `email: Optional[str]` - Email (optional)
     - `phone: Optional[str]` - Phone (optional)
     - `date_of_birth: Optional[date]` - Date of birth (optional)
   - **Purpose:** Request body for updating patient
   - **Validation:** All fields optional for partial updates
   - **Usage:** PUT /api/patients/{id} endpoint

3. **`PatientResponse`**
   - **Fields:**
     - `id: UUID` - Patient ID
     - `clinic_id: UUID` - Associated clinic ID
     - `first_name: str` - First name
     - `last_name: str` - Last name
     - `full_name: str` - Computed full name (from model property)
     - `email: Optional[str]` - Email
     - `phone: Optional[str]` - Phone
     - `date_of_birth: Optional[date]` - Date of birth
     - `created_at: datetime` - Creation timestamp
     - `updated_at: datetime` - Last update timestamp
   - **Purpose:** Response schema for patient data
   - **Configuration:** Uses `from_attributes = True`
   - **Computed Field:** `full_name` extracted from Patient model's `@property` method
   - **Usage:** All GET endpoints returning patient data

4. **`PatientList`**
   - **Fields:**
     - `items: List[PatientResponse]` - List of patient responses
     - `total: int` - Total count of patients
   - **Purpose:** Response schema for paginated patient list
   - **Usage:** GET /api/patients endpoint (with role-based filtering)

**Date Handling:**
- Uses Python `date` type for date_of_birth
- Pydantic automatically validates date format
- Stores as DATE type in PostgreSQL

#### Task 4.4: Create Appointment Schemas

**Purpose:** Request/response validation schemas for Appointment entity.

**File Created:** `app/schemas/appointment.py` (75 lines)

**Schemas Defined:**

1. **`AppointmentCreate`**
   - **Fields:**
     - `doctor_id: UUID` - Doctor ID (required)
     - `patient_id: UUID` - Patient ID (required)
     - `date: date` - Appointment date (required)
     - `start_time: time` - Start time (required)
     - `end_time: time` - End time (required)
     - `duration: int` - Duration in minutes (default: 30)
     - `visit_type: str` - Visit type: "in-clinic" or "virtual" (required)
     - `visit_category: Optional[str]` - Visit category: "new-patient" or "follow-up" (optional)
   - **Purpose:** Request body for creating new appointment
   - **Validation:** All required fields must be provided
   - **Usage:** POST /api/appointments endpoint

2. **`AppointmentUpdate`**
   - **Fields:**
     - `doctor_id: Optional[UUID]` - Doctor ID (optional)
     - `patient_id: Optional[UUID]` - Patient ID (optional)
     - `date: Optional[date]` - Appointment date (optional)
     - `start_time: Optional[time]` - Start time (optional)
     - `end_time: Optional[time]` - End time (optional)
     - `duration: Optional[int]` - Duration (optional)
     - `visit_type: Optional[str]` - Visit type (optional)
     - `visit_category: Optional[str]` - Visit category (optional)
     - `status: Optional[str]` - Appointment status (optional)
     - `intake_status: Optional[str]` - Intake status (optional)
   - **Purpose:** Request body for updating appointment
   - **Validation:** All fields optional for partial updates
   - **Usage:** PUT /api/appointments/{id} endpoint

3. **`AppointmentResponse`**
   - **Fields:**
     - `id: UUID` - Appointment ID
     - `clinic_id: UUID` - Clinic ID
     - `doctor_id: UUID` - Doctor ID
     - `patient_id: UUID` - Patient ID
     - `date: date` - Appointment date
     - `start_time: time` - Start time
     - `end_time: time` - End time
     - `duration: int` - Duration in minutes
     - `visit_type: Optional[str]` - Visit type
     - `visit_category: Optional[str]` - Visit category
     - `status: str` - Appointment status
     - `intake_status: str` - Intake status
     - `arrived: bool` - Arrival flag
     - `arrived_at: Optional[datetime]` - Arrival timestamp
     - `meeting_link: Optional[str]` - Virtual visit link
     - `created_at: datetime` - Creation timestamp
     - `updated_at: datetime` - Last update timestamp
     - `doctor: Optional[DoctorResponse]` - Nested doctor object
     - `patient: Optional[PatientResponse]` - Nested patient object
   - **Purpose:** Response schema for appointment data
   - **Configuration:** Uses `from_attributes = True`
   - **Nested Objects:** Includes full doctor and patient data (loaded via SQLAlchemy relationships)
   - **Usage:** All GET endpoints returning appointment data

4. **`AppointmentList`**
   - **Fields:**
     - `items: List[AppointmentResponse]` - List of appointment responses
     - `total: int` - Total count of appointments
   - **Purpose:** Response schema for paginated appointment list
   - **Usage:** GET /api/appointments endpoint (with filters and role-based access)

5. **`AppointmentConfirm`**
   - **Fields:** None (empty body)
   - **Purpose:** Request body for confirming appointment
   - **Usage:** POST /api/appointments/{id}/confirm endpoint

6. **`AppointmentCancel`**
   - **Fields:**
     - `cancellation_type: str` - Type of cancellation (required)
     - `reason_note: Optional[str]` - Cancellation reason note (optional)
   - **Purpose:** Request body for cancelling appointment
   - **Validation:** Cancellation type must match database constraint values
   - **Usage:** POST /api/appointments/{id}/cancel endpoint

7. **`AppointmentArrive`**
   - **Fields:** None (empty body)
   - **Purpose:** Request body for marking patient as arrived
   - **Usage:** POST /api/appointments/{id}/arrive endpoint

**Nested Schemas:**
- AppointmentResponse includes DoctorResponse and PatientResponse
- Allows frontend to display full appointment details without additional API calls
- Relationships loaded via SQLAlchemy `relationship()` definitions

**Time Handling:**
- Uses Python `time` type for start_time and end_time
- Pydantic automatically validates time format (HH:MM:SS)
- Stores as TIME type in PostgreSQL

**Status Values:**
- Visit type: "in-clinic", "virtual"
- Visit category: "new-patient", "follow-up"
- Status: "confirmed", "unconfirmed", "cancelled", "completed", "no-show"
- Intake status: "missing", "sent", "completed"

---

## Summary

### What Was Accomplished

**Phase 3 (Days 5-7) - Authentication System:**
1. ✅ Password hashing utilities implemented (bcrypt)
2. ✅ JWT token creation and verification implemented
3. ✅ Auth dependencies created (get_current_user, role checks)
4. ✅ Auth schemas defined (LoginRequest, TokenResponse, UserResponse, Google OAuth schemas)
5. ✅ Auth router implemented with login and /me endpoints
6. ✅ Google OAuth signup and login endpoints added (bonus feature)
7. ✅ Google OAuth service created for token verification
8. ✅ Seed script created with comprehensive test data
9. ✅ All authentication flows tested and working

**Phase 4 - Day 8 (Pydantic Schemas):**
1. ✅ Clinic schemas created (Create, Update, Response)
2. ✅ Doctor schemas created (Create, Update, Response, List)
3. ✅ Patient schemas created (Create, Update, Response, List)
4. ✅ Appointment schemas created (Create, Update, Response, List, Confirm, Cancel, Arrive)
5. ✅ All schemas use Pydantic v2 syntax
6. ✅ Nested relationships properly defined
7. ✅ Validation rules implemented

### Key Technical Decisions

**Authentication:**
- JWT-based stateless authentication (scalable)
- Bcrypt password hashing (industry standard, secure)
- Dual authentication support (password + Google OAuth)
- Role-based access control at dependency level
- Token expiration for security (8 hours default)

**Google OAuth Integration:**
- Token verification via Google's tokeninfo endpoint
- Audience validation prevents token reuse
- Automatic user name/email sync from Google
- Support for first-time signup with clinic creation
- Backward compatible with password-based users

**Data Validation:**
- Pydantic schemas for all request/response validation
- Automatic type conversion (UUID, datetime, date, time)
- Email validation built-in
- Optional fields for flexible updates
- Nested objects for relationships

**Seed Data:**
- Realistic test data matching frontend mock data
- Re-runnable (clears existing data first)
- Handles circular dependencies correctly
- Provides ready-to-use test credentials

### Files Created in This Phase

**Total: 8 files created**
- `app/core/security.py` - Password hashing and JWT (42 lines)
- `app/api/deps.py` - Auth dependencies (65 lines)
- `app/schemas/auth.py` - Auth schemas (43 lines)
- `app/api/auth.py` - Auth router (255 lines)
- `app/services/google_auth.py` - Google OAuth service (80 lines)
- `app/seed.py` - Seed script (245 lines)
- `app/schemas/clinic.py` - Clinic schemas (27 lines)
- `app/schemas/doctor.py` - Doctor schemas (38 lines)
- `app/schemas/patient.py` - Patient schemas (43 lines)
- `app/schemas/appointment.py` - Appointment schemas (75 lines)

**Total Lines of Code: ~912 lines**

### Security Features Implemented

1. **Password Security:**
   - Bcrypt hashing with salt
   - Password never returned in responses
   - Timing-safe password comparison

2. **Token Security:**
   - JWT tokens with expiration
   - Signature verification
   - User ID and role in token payload

3. **Access Control:**
   - Role-based dependencies
   - Clear error messages (403 Forbidden)
   - Token validation before database queries

4. **Google OAuth Security:**
   - Token verification against Google API
   - Audience validation
   - Email verification check

### What's Ready for Next Phase

✅ Authentication system complete and tested
✅ All schemas defined for CRUD operations
✅ Test data available via seed script
✅ Role-based access control ready
✅ Ready to implement CRUD routers in Phase 4 - Days 9-12

### API Endpoints Available

**Authentication Endpoints:**
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google/signup` - Google OAuth signup
- `POST /api/auth/google/login` - Google OAuth login

**Test Credentials (after seed):**
- Admin: admin@clinic.com / admin123
- Doctors: sarah.chen@clinic.com / doctor123 (and 4 others)

---

**End of backend2.md - Phase 3 Complete & Phase 4 Started (21-40% of MVP)**
