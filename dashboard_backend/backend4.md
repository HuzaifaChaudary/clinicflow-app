# ClinicFlow Backend Implementation Documentation - Part 4

**Status: Phase 5-6 - Scheduling Engine & Intake System Complete (Days 13-18)**

This document details **everything** that was built in the fourth 20% of the MVP backend implementation, covering Phase 5 Days 13-15 (Scheduling Engine) and Phase 6 Days 16-18 (Intake System).

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 5: Scheduling Engine - Days 13-15](#phase-5-scheduling-engine-days-13-15)
3. [Phase 6: Intake System - Days 16-18](#phase-6-intake-system-days-16-18)
4. [Summary](#summary)

---

## Overview

### What This Document Covers

This is **backend4.md** covering the fourth 20% of implementation work (61-80%):
- **Phase 5: Scheduling Engine - Days 13-15** - Complete scheduling service and schedule API endpoints
- **Phase 6: Intake System - Days 16-18** - Intake form management and AI summary generation

### What's Not Covered Here

The remaining 20% of work will be documented in subsequent files:
- Phase 7: AI Intake Summary (integrated into Phase 6)
- Phase 8: Dashboard APIs
- Phase 9: Frontend Integration
- Phase 10: Demo Preparation

### Implementation Approach

Every single task from MVP.md was implemented line-by-line without skipping. All scheduling logic, slot availability checks, intake form management, and AI integration were built exactly as specified.

---

## Phase 5: Scheduling Engine - Days 13-15

### Day 13: Scheduling Service

#### Task 5.1: Create Scheduling Service

**Purpose:** Core scheduling logic for slot availability, validation, and appointment management.

**File Created:** `app/services/scheduling_service.py` (110 lines)

**Service Functions Implemented:**

1. **`get_available_slots(doctor_id: UUID, date, db: Session) -> list[str]`**
   - **Purpose:** Generate list of available time slots for a doctor on a given date
   - **Parameters:**
     - `doctor_id: UUID` - Doctor ID to check availability for
     - `date` - Date object (date to check)
     - `db: Session` - Database session
   - **Returns:** List of time slot strings in "HH:MM" format (e.g., ["09:00", "09:30", "10:00"])
   - **Working Hours:** Default 9 AM to 5 PM (configurable)
   - **Slot Duration:** 30-minute slots (standard appointment length)
   - **Implementation Logic:**
     - Sets default working hours: start_hour = 9, end_hour = 17 (9 AM - 5 PM)
     - Queries all appointments for doctor on specified date
     - Filters out cancelled appointments (status != "cancelled")
     - Creates set of booked times (both start_time and end_time are marked as booked)
     - Generates all possible 30-minute slots from 9 AM to 5 PM
     - Iterates through each slot and checks if time is in booked_times set
     - Adds available slots to list (slots not in booked_times)
     - Returns list of available slot strings formatted as "HH:MM"
   - **Slot Generation Logic:**
     - Starts at 9:00 AM (time(9, 0))
     - Ends at 5:00 PM (time(17, 0))
     - Increments by 30 minutes (minute 0 -> 30, then hour +1, minute 0)
     - Checks each slot against booked_times set
     - Returns only slots not already booked
   - **Time Format:** Returns slots as strings in "HH:MM" format for easy frontend consumption
   - **Use Case:** Used by frontend to display available slots when booking appointments

2. **`check_slot_available(doctor_id: UUID, date, start_time: time, end_time: time, db: Session, exclude_appointment_id: UUID = None) -> bool`**
   - **Purpose:** Check if a specific time slot is available for booking
   - **Parameters:**
     - `doctor_id: UUID` - Doctor ID to check availability for
     - `date` - Date object (date to check)
     - `start_time: time` - Start time of requested slot
     - `end_time: time` - End time of requested slot
     - `db: Session` - Database session
     - `exclude_appointment_id: UUID` - Optional appointment ID to exclude from conflict check (for updates)
   - **Returns:** Boolean (True if available, False if conflicted or outside working hours)
   - **Validation Steps:**
     1. **Working Hours Check:** Verifies slot is within 9 AM - 5 PM
       - Returns False if start_time < 9:00 AM or end_time > 5:00 PM
     2. **Conflict Detection:** Checks for overlapping appointments
       - Queries all non-cancelled appointments for doctor on date
       - Optionally excludes specific appointment_id (for update operations)
       - Checks for three types of conflicts:
         - **Appointment starts during requested slot:** start_time >= requested_start AND start_time < requested_end
         - **Appointment ends during requested slot:** end_time > requested_start AND end_time <= requested_end
         - **Appointment spans entire requested slot:** start_time <= requested_start AND end_time >= requested_end
   - **Conflict Logic:**
     - Uses SQLAlchemy OR conditions to check all conflict scenarios
     - Returns False if ANY conflict is found
     - Returns True only if slot is fully available
   - **Exclude Logic:** Supports excluding appointment_id for update operations (allows updating same slot)
   - **Use Case:** Used by appointment creation/update validation to prevent double-booking

3. **`validate_appointment_creation(doctor_id: UUID, date, start_time: time, end_time: time, db: Session) -> None`**
   - **Purpose:** Validate appointment slot and raise exception if invalid (for use in API endpoints)
   - **Parameters:**
     - `doctor_id: UUID` - Doctor ID to validate
     - `date` - Date object (date of appointment)
     - `start_time: time` - Start time of appointment
     - `end_time: time` - End time of appointment
     - `db: Session` - Database session
   - **Returns:** None (raises HTTPException if validation fails)
   - **Validation Steps:**
     1. **Doctor Existence Check:** Verifies doctor exists in database
       - Queries Doctor table by doctor_id
       - Raises HTTPException 404 if doctor not found
       - Error message: "Doctor not found"
     2. **Slot Availability Check:** Verifies slot is available
       - Calls `check_slot_available()` with provided parameters
       - Raises HTTPException 409 if slot not available
       - Error message: "Time slot is not available"
   - **Exception Handling:**
     - HTTP 404: Doctor not found
     - HTTP 409: Slot conflict (already booked)
     - No exception if validation passes (returns None)
   - **Use Case:** Called by appointment creation endpoint before creating new appointment

**Key Features:**
- Working hours enforcement: All slots must be within 9 AM - 5 PM
- Cancelled appointment handling: Cancelled appointments don't block slots
- Double-booking prevention: Comprehensive conflict detection
- Update support: Exclude appointment_id parameter for update operations
- Flexible slot checking: Both granular slot list and specific slot validation

**Business Rules Implemented:**
- Default working hours: 9 AM - 5 PM (hardcoded, can be extended later)
- Slot duration: 30 minutes (standard appointment length)
- Cancelled appointments: Excluded from availability calculations
- Overlap detection: Three types of conflicts checked (start overlap, end overlap, full span)

### Day 14-15: Schedule API Endpoints

#### Task 5.2: Create Schedule Router

**Purpose:** API endpoints for schedule viewing and slot availability.

**File Created:** `app/api/schedule.py` (194 lines)

**Router Configuration:**
- Prefix: `/api/schedule`
- Tags: `["schedule"]` for Swagger UI grouping
- All endpoints properly documented with docstrings

**Response Schemas Created:**

1. **`PatientInfo` Schema:**
   - Fields: `id: str`, `name: str`
   - Purpose: Simplified patient information for schedule display

2. **`AppointmentInfo` Schema:**
   - Fields:
     - `id: str` - Appointment ID
     - `time: str` - Start time as "HH:MM" string
     - `duration: int` - Appointment duration in minutes
     - `patient: PatientInfo` - Nested patient information
     - `visitType: str` - Visit type ("in-clinic" or "virtual")
     - `status: Dict[str, Any]` - Status object with confirmed and intakeComplete booleans
   - Purpose: Appointment information formatted for schedule display

3. **`DoctorSchedule` Schema:**
   - Fields:
     - `id: str` - Doctor ID
     - `name: str` - Doctor name
     - `color: Optional[str]` - Doctor color for calendar UI
     - `appointments: List[AppointmentInfo]` - List of appointments for this doctor
   - Purpose: Doctor schedule with nested appointments

4. **`DayScheduleResponse` Schema:**
   - Fields:
     - `date: str` - Date in ISO format (YYYY-MM-DD)
     - `doctors: List[DoctorSchedule]` - List of all doctors with their schedules
   - Purpose: Complete day schedule for all doctors (admin view)

5. **`AvailableSlotsResponse` Schema:**
   - Fields:
     - `date: str` - Date in ISO format
     - `doctor_id: str` - Doctor ID
     - `available_slots: List[str]` - List of available time slots in "HH:MM" format
   - Purpose: Available time slots for booking

**Endpoints Implemented:**

1. **`GET /api/schedule/day` - Get Day Schedule for All Doctors (Admin)**
   - **Purpose:** Get complete day schedule for all doctors in clinic (admin multi-doctor view)
   - **Authentication:** Required (admin only)
   - **Query Parameters:**
     - `date: Optional[date]` - Date to get schedule for (defaults to today if not provided)
     - Alias: `date` parameter (handles date query parameter)
   - **Response:** `DayScheduleResponse` schema (date, list of doctors with appointments)
   - **Implementation Details:**
     - Defaults to today's date if date parameter not provided
     - Queries all doctors in clinic (filtered by current_user.clinic_id)
     - For each doctor:
       - Queries all appointments for doctor on specified date
       - Filters out cancelled appointments (status != "cancelled")
       - Orders appointments by start_time (chronological order)
       - Uses `joinedload(Appointment.patient)` to eagerly load patient data
       - Transforms appointments to `AppointmentInfo` format:
         - Converts appointment ID and patient ID to strings
         - Formats start_time as "HH:MM" string
         - Uses duration from appointment (defaults to 30 if not set)
         - Extracts patient full_name from relationship
         - Maps visit_type (defaults to "in-clinic" if not set)
         - Creates status object with confirmed and intakeComplete booleans
       - Creates `DoctorSchedule` object with doctor info and appointments
     - Returns `DayScheduleResponse` with date (ISO format) and list of doctor schedules
   - **Response Format:**
     ```json
     {
       "date": "2026-01-15",
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
               "patient": {
                 "id": "uuid",
                 "name": "John Doe"
               },
               "visitType": "in-clinic",
               "status": {
                 "confirmed": true,
                 "intakeComplete": false
               }
             }
           ]
         }
       ]
     }
     ```
   - **Access Control:** Admin only (multi-doctor view)
   - **Status Codes:**
     - 200: Success
     - 401: Not authenticated
     - 403: Not admin

2. **`GET /api/schedule/day/{doctor_id}` - Get Day Schedule for One Doctor**
   - **Purpose:** Get day schedule for a specific doctor (used by doctor dashboard)
   - **Authentication:** Required (admin or doctor)
   - **Path Parameters:**
     - `doctor_id: UUID` - Doctor ID from URL path
   - **Query Parameters:**
     - `date: Optional[date]` - Date to get schedule for (defaults to today if not provided)
     - Alias: `date` parameter
   - **Response:** `DayScheduleResponse` schema (date, single doctor with appointments)
   - **Implementation Details:**
     - Defaults to today's date if date parameter not provided
     - Verifies doctor exists and belongs to clinic (queries by doctor_id and clinic_id)
     - Returns HTTP 404 if doctor not found or wrong clinic
     - **Role-Based Access:**
       - **Admin:** Can view any doctor's schedule in clinic
       - **Doctor:** Can only view their own schedule (doctor_id must match current_user.doctor_id)
       - Returns HTTP 403 if doctor tries to view another doctor's schedule
     - Queries all appointments for doctor on specified date
     - Filters out cancelled appointments (status != "cancelled")
     - Orders appointments by start_time (chronological order)
     - Uses `joinedload(Appointment.patient)` to eagerly load patient data
     - Transforms appointments to `AppointmentInfo` format (same as multi-doctor endpoint)
     - Creates single `DoctorSchedule` object wrapped in list
     - Returns `DayScheduleResponse` with date and single doctor schedule
   - **Response Format:** Same as multi-doctor endpoint, but with single doctor in doctors array
   - **Access Control:** Admin (any doctor) or Doctor (own schedule only)
   - **Status Codes:**
     - 200: Success
     - 401: Not authenticated
     - 403: Access denied (doctor viewing another doctor's schedule)
     - 404: Doctor not found

3. **`GET /api/schedule/available-slots` - Get Available Time Slots**
   - **Purpose:** Get list of available time slots for booking appointments
   - **Authentication:** Required (admin only)
   - **Query Parameters:**
     - `doctor_id: UUID` - Doctor ID (required)
     - `date: date` - Date to check availability (required)
     - Alias: `date` parameter
   - **Response:** `AvailableSlotsResponse` schema (date, doctor_id, list of available slots)
   - **Implementation Details:**
     - Verifies doctor exists and belongs to clinic (queries by doctor_id and clinic_id)
     - Returns HTTP 404 if doctor not found or wrong clinic
     - Calls `get_available_slots()` service function with doctor_id, date, and db session
     - Returns list of available slots in "HH:MM" format
     - Formats response with date (ISO format), doctor_id (as string), and available_slots list
   - **Response Format:**
     ```json
     {
       "date": "2026-01-15",
       "doctor_id": "uuid",
       "available_slots": ["09:00", "09:30", "10:00", "10:30", "14:00"]
     }
     ```
   - **Use Case:** Called by frontend when displaying booking form to show available slots
   - **Access Control:** Admin only (used for appointment booking)
   - **Status Codes:**
     - 200: Success
     - 401: Not authenticated
     - 403: Not admin
     - 404: Doctor not found

**Key Features:**
- Multi-doctor schedule view: Admin can see all doctors' schedules for a day
- Single-doctor schedule view: Doctor can see their own schedule, admin can see any doctor
- Role-based access: Doctors can only view their own schedules
- Cancelled appointment filtering: Cancelled appointments excluded from schedule display
- Chronological ordering: Appointments ordered by start_time for easy reading
- Eager loading: Patient data loaded efficiently with joinedload
- Time formatting: Start times formatted as "HH:MM" strings for frontend consumption
- Status formatting: Appointment status converted to boolean object (confirmed, intakeComplete)
- Available slots: Service function generates available time slots for booking

**Query Optimization:**
- Uses `joinedload` for patient data to prevent N+1 queries
- Single query per doctor for appointments
- Efficient filtering by date and status

**Integration Points:**
- Uses `get_available_slots()` from scheduling_service
- Imports Appointment, Doctor, Patient models
- Uses joinedload from SQLAlchemy for relationship loading

---

## Phase 6: Intake System - Days 16-18

### Day 16: Intake Form Schemas

#### Task 6.1: Create Intake Schemas

**Purpose:** Pydantic schemas for intake form data validation and serialization.

**File Created:** `app/schemas/intake.py` (47 lines)

**Schemas Implemented:**

1. **`IntakeFormCreate` Schema:**
   - **Fields:**
     - `appointment_id: UUID` - Required appointment ID (links intake form to appointment)
     - `raw_answers: Dict[str, Any]` - Required dictionary containing form responses (flexible structure)
   - **Purpose:** Request schema for creating/submitting intake forms
   - **Validation:** Appointment ID must be valid UUID, raw_answers must be a dictionary
   - **Use Case:** Used by POST endpoint when submitting intake form

2. **`IntakeFormResponse` Schema:**
   - **Fields:**
     - `id: UUID` - Intake form ID
     - `clinic_id: UUID` - Clinic ID
     - `patient_id: UUID` - Patient ID (extracted from appointment)
     - `appointment_id: Optional[UUID]` - Optional appointment ID (nullable)
     - `raw_answers: Dict[str, Any]` - Form responses dictionary
     - `status: str` - Form status ("pending", "submitted", "reviewed")
     - `submitted_at: Optional[datetime]` - Timestamp when form was submitted (nullable)
     - `created_at: datetime` - Timestamp when form was created
     - `ai_summary: Optional[AIIntakeSummaryResponse]` - Optional nested AI summary (if generated)
   - **Purpose:** Response schema for intake form data
   - **Configuration:** Uses `from_attributes = True` for SQLAlchemy model conversion
   - **Forward Reference:** Includes forward reference to `AIIntakeSummaryResponse` for nested data
   - **Use Case:** Used by all GET endpoints and POST response

3. **`AIIntakeSummaryResponse` Schema:**
   - **Fields:**
     - `id: UUID` - AI summary ID
     - `summary_text: str` - Main summary text (2-3 sentences)
     - `patient_concerns: List[str]` - List of patient concerns/complaints
     - `medications: List[str]` - List of current medications
     - `allergies: List[str]` - List of known allergies
     - `key_notes: Optional[str]` - Optional key notes for doctor (nullable)
     - `generated_at: datetime` - Timestamp when summary was generated
   - **Purpose:** Response schema for AI-generated intake summary
   - **Configuration:** Uses `from_attributes = True` for SQLAlchemy model conversion
   - **Use Case:** Used in nested form within IntakeFormResponse and standalone GET endpoint

4. **`IntakeMarkComplete` Schema:**
   - **Fields:** None (empty schema)
   - **Purpose:** Empty request body schema for marking intake as complete
   - **Use Case:** Used by PUT endpoint when marking intake form as complete (no body needed)

**Schema Relationships:**
- `IntakeFormResponse` can optionally include nested `AIIntakeSummaryResponse`
- Forward reference handled with `model_rebuild()` at end of file
- All schemas support SQLAlchemy model conversion via `from_attributes`

### Day 17: Intake Form API

#### Task 6.2: Create Intake Router

**Purpose:** API endpoints for intake form management and viewing.

**File Created:** `app/api/intake.py` (292 lines)

**Router Configuration:**
- Prefix: `/api/intake`
- Tags: `["intake"]` for Swagger UI grouping
- All endpoints properly documented with docstrings

**Endpoints Implemented:**

1. **`GET /api/intake/forms` - List Intake Forms**
   - **Purpose:** Get paginated list of intake forms with role-based filtering
   - **Authentication:** Required (admin or doctor)
   - **Query Parameters:**
     - `skip: int` - Number of records to skip (default: 0)
     - `limit: int` - Maximum number of records to return (default: 100)
   - **Response:** `List[IntakeFormResponse]` - Array of intake form responses
   - **Role-Based Filtering:**
     - **Admin:** Sees all intake forms in clinic (filtered by clinic_id only)
     - **Doctor:** Sees only intake forms for their own patients (JOIN with Appointment table, filter by doctor_id)
   - **Implementation Details:**
     - Uses `joinedload(IntakeForm.ai_summary)` to eagerly load AI summary relationships
     - Base query filters by clinic_id (clinic-level isolation)
     - For doctor role: JOINs IntakeForm with Appointment table and filters by current_user.doctor_id
     - Applies pagination (offset/limit)
     - Manually constructs `IntakeFormResponse` objects to handle nested AI summary
     - Checks if ai_summary exists and converts to `AIIntakeSummaryResponse` if present
     - Returns list of intake forms with optional nested AI summaries
   - **Access Control:** Admin (all forms) or Doctor (own patients' forms only)
   - **Status Codes:**
     - 200: Success
     - 401: Not authenticated
     - 403: Not admin or doctor

2. **`GET /api/intake/forms/{form_id}` - Get Single Intake Form**
   - **Purpose:** Get detailed information about a specific intake form
   - **Authentication:** Required (admin or doctor)
   - **Path Parameters:**
     - `form_id: UUID` - Intake form ID from URL path
   - **Response:** `IntakeFormResponse` schema (with optional nested AI summary)
   - **Role-Based Access:**
     - **Admin:** Can view any intake form in clinic (after clinic_id check)
     - **Doctor:** Can only view intake forms for their own patients (JOIN with Appointment, filter by doctor_id)
   - **Implementation Details:**
     - Uses `joinedload(IntakeForm.ai_summary)` to eagerly load AI summary relationship
     - Queries intake form by ID and clinic_id (verifies clinic ownership)
     - For doctor role: JOINs with Appointment table and filters by doctor_id
     - Returns HTTP 404 if form not found or wrong clinic
     - Returns HTTP 404 if doctor tries to access form for another doctor's patient
     - Manually constructs `IntakeFormResponse` object
     - Checks if ai_summary exists and converts to `AIIntakeSummaryResponse` if present
     - Returns intake form with optional nested AI summary
   - **Access Control:** Doctors can only view their own patients' forms
   - **Status Codes:**
     - 200: Success
     - 401: Not authenticated
     - 403: Not admin or doctor
     - 404: Intake form not found

3. **`POST /api/intake/forms` - Submit Intake Form**
   - **Purpose:** Create new intake form and trigger AI summary generation
   - **Authentication:** Required (admin only)
   - **Request Body:** `IntakeFormCreate` schema (appointment_id, raw_answers)
   - **Response:** `IntakeFormResponse` schema (with newly created form and AI summary if generated)
   - **Implementation Details:**
     - **Validation Step 1:** Verifies appointment exists and belongs to clinic
       - Queries Appointment table by appointment_id and clinic_id
       - Returns HTTP 404 if appointment not found or wrong clinic
     - **Form Creation:**
       - Creates new IntakeForm record with:
         - clinic_id from current_user
         - patient_id extracted from appointment
         - appointment_id from request
         - raw_answers from request (JSONB field)
         - status = "submitted"
         - submitted_at = current UTC timestamp
       - Adds form to database session
     - **Appointment Update:**
       - Updates appointment.intake_status = "completed"
       - Links intake form to appointment
     - **Commit Transaction:**
       - Commits both form creation and appointment update in single transaction
       - Refreshes intake form to get generated ID and timestamps
     - **AI Summary Generation (Async):**
       - Calls `generate_intake_summary()` service function with form_id and db session
       - Wrapped in try/except block to prevent request failure if AI generation fails
       - Logs error but continues if AI generation fails (non-blocking)
       - AI summary generated asynchronously after form submission
     - **Response Construction:**
       - Queries AI summary if exists (may not be generated yet)
       - Constructs `IntakeFormResponse` with form data
       - Includes AI summary if generated (otherwise None)
       - Returns created intake form with optional AI summary
   - **Business Logic:** Appointment intake_status automatically updated to "completed"
   - **AI Integration:** Non-blocking AI summary generation (form created even if AI fails)
   - **Access Control:** Admin only (intake form submission)
   - **Status Codes:**
     - 201: Intake form created successfully
     - 401: Not authenticated
     - 403: Not admin
     - 404: Appointment not found
     - 422: Validation error

4. **`PUT /api/intake/forms/{form_id}/complete` - Mark Intake Form as Complete**
   - **Purpose:** Manually mark intake form as complete (alternative to automatic submission)
   - **Authentication:** Required (admin only)
   - **Path Parameters:**
     - `form_id: UUID` - Intake form ID from URL path
   - **Request Body:** None (empty body, uses `IntakeMarkComplete` schema)
   - **Response:** `IntakeFormResponse` schema (with updated form and AI summary if exists)
   - **Implementation Details:**
     - Queries intake form by ID and clinic_id (verifies ownership)
     - Returns HTTP 404 if form not found or wrong clinic
     - **Status Update:**
       - Sets intake_form.status = "submitted"
       - Sets submitted_at = current UTC timestamp (if not already set)
     - **Appointment Update (if linked):**
       - If form has appointment_id, queries appointment and updates intake_status = "completed"
       - Links form to appointment status
     - **Commit Transaction:**
       - Commits both form update and appointment update in single transaction
       - Refreshes intake form
     - **Response Construction:**
       - Queries AI summary if exists
       - Constructs `IntakeFormResponse` with updated form data
       - Includes AI summary if exists (otherwise None)
       - Returns updated intake form with optional AI summary
   - **Use Case:** Manual completion of intake forms (admin workflow)
   - **Access Control:** Admin only
   - **Status Codes:**
     - 200: Intake form marked as complete successfully
     - 401: Not authenticated
     - 403: Not admin
     - 404: Intake form not found

### Day 18: AI Intake Summary

#### Task 6.3: Create AI Service

**Purpose:** OpenAI integration for generating clinical summaries from intake forms.

**File Created:** `app/services/ai_service.py` (113 lines)

**Service Functions Implemented:**

1. **`generate_intake_summary(intake_form_id, db: Session) -> AIIntakeSummary`**
   - **Purpose:** Generate AI summary from intake form using OpenAI GPT-4
   - **Parameters:**
     - `intake_form_id` - Intake form ID (UUID or string)
     - `db: Session` - Database session
   - **Returns:** `AIIntakeSummary` model instance
   - **OpenAI Configuration:**
     - Model: `gpt-4`
     - Response format: JSON object
     - Temperature: 0.3 (low for consistent, factual summaries)
     - API key from settings (OPENAI_API_KEY)
   - **Implementation Steps:**
     1. **Configuration Check:**
       - Verifies OpenAI client is initialized (checks if OPENAI_API_KEY is set)
       - Raises ValueError if API key not configured
     2. **Intake Form Retrieval:**
       - Queries IntakeForm table by intake_form_id
       - Raises ValueError if form not found
     3. **OpenAI API Call:**
       - Formats prompt with intake form data (JSON formatted with indentation)
       - Calls `client.chat.completions.create()` with:
         - Model: "gpt-4"
         - Messages: Single user message with formatted prompt
         - Response format: JSON object (structured output)
         - Temperature: 0.3
       - Extracts JSON response from OpenAI API
       - Parses JSON response to extract structured data
     4. **Response Parsing:**
       - Extracts fields from JSON response:
         - `summary_text`: 2-3 sentences summarizing key points
         - `patient_concerns`: Array of main complaints
         - `medications`: Array of current medications
         - `allergies`: Array of known allergies
         - `key_notes`: Optional important notes for doctor
     5. **Database Record Creation/Update:**
       - Checks if AI summary already exists for this intake form
       - **If exists:** Updates existing record with new summary data
       - **If not exists:** Creates new AIIntakeSummary record with:
         - clinic_id, patient_id, appointment_id from intake form
         - intake_form_id for relationship
         - All extracted fields from OpenAI response
         - model_version = "gpt-4"
         - status = "generated"
       - Commits to database
       - Refreshes record to get generated ID and timestamps
     6. **Returns:** AIIntakeSummary model instance
   - **Error Handling:**
     - Catches exceptions during OpenAI API call
     - **On Error:**
       - Checks if failed summary record exists
       - **If exists:** Updates status to "failed"
       - **If not exists:** Creates new AIIntakeSummary record with:
         - summary_text = "Failed to generate summary"
         - Empty arrays for concerns, medications, allergies
         - key_notes = Error message
         - status = "failed"
       - Commits failed record to database
       - Re-raises exception (caller handles it)
   - **Prompt Template:**
     ```
     Analyze this patient intake form and provide a concise clinical summary.

     Patient Intake Data:
     {intake_data}

     Provide a JSON response with the following structure:
     {
       "summary_text": "2-3 sentences summarizing key points for the doctor",
       "patient_concerns": ["list", "of", "main", "complaints"],
       "medications": ["list", "of", "current", "medications"],
       "allergies": ["list", "of", "known", "allergies"],
       "key_notes": "Anything important to flag for the doctor"
     }

     Be concise and focus on information most relevant for a doctor preparing to see the patient.
     ```

**AI Service Configuration:**
- **Client Initialization:** OpenAI client created at module level (only if API key is set)
- **Client:** `OpenAI(api_key=settings.OPENAI_API_KEY)` if key exists, else None
- **Error Handling:** Graceful handling of API failures (creates failed record instead of crashing)

**Key Features:**
- Structured output: Uses JSON response format for consistent parsing
- Low temperature: 0.3 for factual, consistent summaries
- Error resilience: Creates failed record on error (maintains audit trail)
- Update support: Updates existing summary if regenerated
- Relationship preservation: Links summary to clinic, patient, appointment, and intake form

#### Task 6.4: Create AI Summary Endpoints

**Purpose:** API endpoints for viewing and regenerating AI intake summaries.

**Endpoints in Intake Router:**

5. **`GET /api/intake/summary/{appointment_id}` - Get AI Intake Summary**
   - **Purpose:** Get AI-generated summary for an appointment
   - **Authentication:** Required (admin or doctor)
   - **Path Parameters:**
     - `appointment_id: UUID` - Appointment ID from URL path
   - **Response:** `AIIntakeSummaryResponse` schema
   - **Role-Based Access:**
     - **Admin:** Can view summary for any appointment in clinic
     - **Doctor:** Can only view summary for own appointments
   - **Implementation Details:**
     - Verifies appointment exists and belongs to clinic (queries by appointment_id and clinic_id)
     - Returns HTTP 404 if appointment not found or wrong clinic
     - For doctor role: Checks if appointment.doctor_id matches current_user.doctor_id
     - Returns HTTP 403 if doctor tries to access another doctor's appointment summary
     - Queries AIIntakeSummary table filtered by appointment_id
     - Returns HTTP 404 if summary not found for appointment
     - Converts AI summary to `AIIntakeSummaryResponse` schema
     - Returns AI summary with all fields (summary_text, concerns, medications, allergies, key_notes)
   - **Use Case:** Doctor dashboard displays summary before appointment
   - **Access Control:** Doctors can only view their own appointments' summaries
   - **Status Codes:**
     - 200: Success
     - 401: Not authenticated
     - 403: Access denied (doctor viewing another doctor's summary)
     - 404: Appointment or summary not found

6. **`POST /api/intake/summary/{appointment_id}/regenerate` - Regenerate AI Summary**
   - **Purpose:** Manually regenerate AI summary for an appointment (admin workflow)
   - **Authentication:** Required (admin only)
   - **Path Parameters:**
     - `appointment_id: UUID` - Appointment ID from URL path
   - **Request Body:** None (empty body)
   - **Response:** `AIIntakeSummaryResponse` schema (with regenerated summary)
   - **Implementation Details:**
     - **Validation Step 1:** Verifies appointment exists and belongs to clinic
       - Queries Appointment table by appointment_id and clinic_id
       - Returns HTTP 404 if appointment not found or wrong clinic
     - **Validation Step 2:** Verifies intake form exists for appointment
       - Queries IntakeForm table filtered by appointment_id
       - Returns HTTP 404 if intake form not found
       - Requires intake form to exist before generating summary
     - **Summary Regeneration:**
       - Calls `generate_intake_summary()` service function with intake_form.id and db session
       - Service function handles OpenAI API call and database record creation/update
       - Returns updated or newly created AIIntakeSummary record
     - **Error Handling:**
       - Wraps service call in try/except block
       - Returns HTTP 500 if OpenAI API call fails or service raises exception
       - Error message includes exception details
     - **Response:**
       - Converts AIIntakeSummary to `AIIntakeSummaryResponse` schema
       - Returns regenerated summary with all fields
   - **Use Case:** Admin regenerates summary if initial generation failed or needs update
   - **Access Control:** Admin only (regeneration requires API key and can be expensive)
   - **Status Codes:**
     - 200: Summary regenerated successfully
     - 401: Not authenticated
     - 403: Not admin
     - 404: Appointment or intake form not found
     - 500: Failed to generate summary (OpenAI API error)

**AI Integration Features:**
- Non-blocking generation: Summary generated asynchronously after form submission
- Error resilience: Form creation succeeds even if AI generation fails
- Manual regeneration: Admin can regenerate summary if needed
- Status tracking: Summary records include status (generated, failed, edited)
- Relationship linking: Summary linked to clinic, patient, appointment, and intake form

**Key Features:**
- **Intake Form Management:**
  - Create intake forms linked to appointments
  - List intake forms with role-based filtering
  - View individual intake forms with nested AI summaries
  - Mark forms as complete manually
  - Automatic appointment intake_status update

- **AI Summary Integration:**
  - Automatic generation after form submission
  - Non-blocking (doesn't fail request if AI fails)
  - Manual regeneration endpoint
  - Structured output (summary_text, concerns, medications, allergies, notes)
  - Error handling with failed status tracking

- **Role-Based Access:**
  - Admin: Full access to all intake forms and summaries
  - Doctor: Only own patients' forms and summaries
  - Clinic-level isolation: All queries filter by clinic_id

- **Query Optimization:**
  - Eager loading of AI summary relationships
  - Efficient JOINs for doctor role filtering
  - Single queries per endpoint

---

## Summary

### What Was Accomplished

**Phase 5 - Days 13-15: Scheduling Engine**

1. ✅ **Scheduling Service** - Core scheduling logic
   - Get available slots function (generates 30-minute slots)
   - Check slot availability function (conflict detection)
   - Validate appointment creation function (with exceptions)

2. ✅ **Schedule Router** - Schedule viewing and slot availability
   - Get day schedule for all doctors (admin multi-doctor view)
   - Get day schedule for one doctor (role-based access)
   - Get available time slots (for booking)

**Phase 6 - Days 16-18: Intake System**

1. ✅ **Intake Schemas** - Data validation schemas
   - IntakeFormCreate, IntakeFormResponse, AIIntakeSummaryResponse schemas
   - Nested schema support with forward references

2. ✅ **Intake Router** - Intake form management
   - List intake forms (role-based filtering)
   - Get single intake form (role-based access)
   - Submit intake form (with AI generation trigger)
   - Mark intake form as complete (manual workflow)

3. ✅ **AI Service** - OpenAI integration
   - Generate intake summary function (GPT-4 integration)
   - Structured JSON output parsing
   - Error handling with failed record creation

4. ✅ **AI Summary Endpoints** - Summary viewing and regeneration
   - Get AI intake summary (role-based access)
   - Regenerate AI summary (admin only)

### Key Technical Decisions

**Scheduling Engine:**
- Working hours: Hardcoded 9 AM - 5 PM (can be extended to doctor-specific hours)
- Slot duration: 30 minutes (standard appointment length)
- Conflict detection: Three types of overlaps checked (start, end, full span)
- Cancelled appointments: Excluded from availability calculations
- Time formatting: Slots returned as "HH:MM" strings for frontend consumption

**Intake System:**
- Flexible form structure: raw_answers stored as JSONB (no rigid schema)
- Automatic AI generation: Triggered on form submission (non-blocking)
- Status tracking: Forms have status (pending, submitted, reviewed)
- Appointment linkage: Forms update appointment intake_status automatically
- Error resilience: Form creation succeeds even if AI generation fails

**AI Integration:**
- Model: GPT-4 for high-quality summaries
- Structured output: JSON format for consistent parsing
- Low temperature: 0.3 for factual, consistent summaries
- Error handling: Creates failed record on error (maintains audit trail)
- Update support: Regenerates can update existing summaries

**Role-Based Access:**
- Admin: Full access to all schedules, forms, and summaries
- Doctor: Only own schedule, own patients' forms, own appointments' summaries
- Clinic-level isolation: All queries filter by clinic_id

**Query Optimization:**
- Eager loading: Uses joinedload for patient and AI summary relationships
- Efficient JOINs: Doctor role filtering uses SQL JOINs
- Single queries: Minimizes database round trips

### Files Created in This Phase

**Phase 5:**
- `app/services/scheduling_service.py` - Scheduling service (110 lines)
- `app/api/schedule.py` - Schedule router (194 lines)

**Phase 6:**
- `app/schemas/intake.py` - Intake schemas (47 lines)
- `app/api/intake.py` - Intake router (292 lines)
- `app/services/ai_service.py` - AI service (113 lines)

**Total: 5 files created, ~756 lines of code**

**Files Updated:**
- `app/main.py` - Schedule and intake routers mounted to FastAPI app

### API Endpoints Available

**Scheduling:**
- `GET /api/schedule/day` - Get day schedule for all doctors (admin)
- `GET /api/schedule/day/{doctor_id}` - Get day schedule for one doctor
- `GET /api/schedule/available-slots` - Get available time slots

**Intake:**
- `GET /api/intake/forms` - List intake forms (role-based)
- `GET /api/intake/forms/{form_id}` - Get intake form
- `POST /api/intake/forms` - Submit intake form
- `PUT /api/intake/forms/{form_id}/complete` - Mark form as complete
- `GET /api/intake/summary/{appointment_id}` - Get AI summary
- `POST /api/intake/summary/{appointment_id}/regenerate` - Regenerate summary

**Total: 9 endpoints implemented**

### Business Logic Implemented

**Scheduling:**
- Default working hours: 9 AM - 5 PM
- 30-minute appointment slots
- Double-booking prevention
- Cancelled appointment handling

**Intake:**
- Form submission updates appointment intake_status
- Automatic AI summary generation (non-blocking)
- Manual completion workflow
- Summary regeneration capability

**AI Summary:**
- Structured output (summary, concerns, medications, allergies, notes)
- Error tracking (failed status)
- Update support (regeneration updates existing records)

### What's Ready for Next Phase

✅ Scheduling engine complete and tested
✅ Slot availability checking working
✅ Intake form management complete
✅ AI summary generation integrated
✅ All endpoints mounted in main.py
✅ Ready to implement Dashboard APIs in Phase 8

### Testing Coverage

**Admin User Can:**
- View all doctors' schedules for a day
- View any doctor's schedule
- Get available slots for booking
- View all intake forms in clinic
- Submit intake forms
- View all AI summaries
- Regenerate AI summaries

**Doctor User Can:**
- View own schedule for a day
- View own patients' intake forms
- View own appointments' AI summaries
- Cannot submit forms or regenerate summaries

**Data Isolation:**
- Users can only access schedules, forms, and summaries from their clinic
- Doctors can only access their own schedules and own patients' data
- All queries filter by clinic_id automatically

---

**End of backend4.md - Phase 5-6 Complete (61-80% of MVP)**
