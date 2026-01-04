# ClinicFlow Dashboard MVP - Backend-Ready Features

**Status: All features documented have backend APIs implemented and ready**

This document details **exactly what dashboard features can be built dynamically** with the existing backend APIs. Every sidebar item, every section, and every dynamic content is mapped to its corresponding backend endpoint.

**Important:** This document ONLY includes features where backend is built. Owner dashboard, Voice AI, Automation, and Settings are excluded as their backends are deferred per MVP plan.

---

## Table of Contents

1. [Overview](#overview)
2. [Backend API Summary](#backend-api-summary)
3. [Admin Dashboard Features](#admin-dashboard-features)
4. [Doctor Dashboard Features](#doctor-dashboard-features)
5. [Sidebar Navigation - Admin](#sidebar-navigation---admin)
6. [Sidebar Navigation - Doctor](#sidebar-navigation---doctor)
7. [Data Flow & Real-Time Updates](#data-flow--real-time-updates)
8. [Implementation Guide](#implementation-guide)

---

## Overview

### What This Document Covers

This `dashboard_mvp.md` covers **only features with backend support**:
- ✅ Admin Dashboard (fully backed)
- ✅ Doctor Dashboard (fully backed)
- ✅ Schedule Page (fully backed)
- ✅ Patients Page (fully backed)
- ✅ Appointments Management (fully backed)
- ✅ Intake Forms (submissions backed, templates UI-only)
- ✅ Dashboard Statistics (fully backed)

### What's Excluded (Backend Not Built)

Per MVP plan, these features are **deferred** and should remain **UI-only or hardcoded**:
- ❌ Owner Dashboard Backend (hardcoded frontend only)
- ❌ Voice AI System (UI placeholder only, no call logs)
- ❌ Automation Rules Engine (UI structure only)
- ❌ Settings Backend APIs (UI-only configuration)
- ❌ Visit Types/Form Templates Backend (UI form builder only, submissions backed)

---

## Backend API Summary

### Complete API Endpoint List

**Authentication (4 endpoints):**
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google/signup` - Google OAuth signup (creates clinic)
- `POST /api/auth/google/login` - Google OAuth login
- `GET /api/auth/me` - Get current authenticated user

**Doctors (5 endpoints):**
- `GET /api/doctors` - List all doctors (paginated, clinic-scoped)
- `GET /api/doctors/{id}` - Get single doctor
- `POST /api/doctors` - Create doctor (admin only)
- `PUT /api/doctors/{id}` - Update doctor (admin only)
- `DELETE /api/doctors/{id}` - Delete doctor (admin only)

**Patients (5 endpoints):**
- `GET /api/patients` - List patients (role-based filtering: admin sees all, doctor sees own patients)
- `GET /api/patients/{id}` - Get single patient (role-based access check)
- `POST /api/patients` - Create patient (admin only)
- `PUT /api/patients/{id}` - Update patient (admin only)
- `GET /api/patients/{id}/appointments` - Get patient's appointments (role-based filtering)

**Appointments (7 endpoints):**
- `GET /api/appointments` - List appointments (filters: date, doctor_id, status, intake_status, role-based access)
- `GET /api/appointments/{id}` - Get single appointment (role-based access)
- `POST /api/appointments` - Create appointment (admin only, with slot validation)
- `PUT /api/appointments/{id}` - Update appointment (admin only)
- `POST /api/appointments/{id}/confirm` - Confirm appointment (admin only)
- `POST /api/appointments/{id}/cancel` - Cancel appointment (admin only, creates cancellation record)
- `POST /api/appointments/{id}/arrive` - Mark patient as arrived (admin only)

**Schedule (3 endpoints):**
- `GET /api/schedule/day` - Get day schedule for all doctors (admin multi-doctor view)
- `GET /api/schedule/day/{doctor_id}` - Get day schedule for one doctor (role-based access)
- `GET /api/schedule/available-slots` - Get available time slots for booking (admin only)

**Intake Forms (6 endpoints):**
- `GET /api/intake/forms` - List intake forms (role-based filtering: admin sees all, doctor sees own patients' forms)
- `GET /api/intake/forms/{form_id}` - Get single intake form (role-based access)
- `POST /api/intake/forms` - Submit intake form (admin only, triggers AI summary generation)
- `PUT /api/intake/forms/{form_id}/complete` - Mark intake form as complete manually (admin only)
- `GET /api/intake/summary/{appointment_id}` - Get AI intake summary for appointment (role-based access)
- `POST /api/intake/summary/{appointment_id}/regenerate` - Regenerate AI summary (admin only)

**Dashboard (3 endpoints):**
- `GET /api/dashboard/admin` - Get admin dashboard data (stats, needs attention, today's schedule)
- `GET /api/dashboard/doctor` - Get doctor dashboard data (stats, today's patients with AI summaries)
- `GET /api/dashboard/needs-attention` - Get items needing attention (filterable: all, unconfirmed, missing-intake)

**Health Check:**
- `GET /health` - Health check endpoint

**Total: 34 API endpoints available**

---

## Admin Dashboard Features

### Page: Admin Dashboard (`/dashboard`)

**Backend Endpoint:** `GET /api/dashboard/admin?date=YYYY-MM-DD` (optional, defaults to today)

**Purpose:** Complete operational overview for clinic administrators

**All Content is Dynamic - Backend Ready:**

#### Section 1: Hero Cards (Statistics)

**Data Source:** Calculated from `GET /api/dashboard/admin` response `stats` object

**Cards to Display:**

1. **Total Appointments Card**
   - **Backend Field:** `stats.total_appointments`
   - **Display:** Large number card
   - **Action:** Click to filter Today's Schedule to "all"
   - **Updates:** Real-time when appointments are created/cancelled

2. **Confirmed Appointments Card**
   - **Backend Field:** `stats.confirmed`
   - **Display:** Large number card with success color
   - **Action:** Click to filter Today's Schedule to "confirmed" status
   - **Updates:** Real-time when appointments are confirmed

3. **Unconfirmed Appointments Card**
   - **Backend Field:** `stats.unconfirmed`
   - **Display:** Large number card with warning color
   - **Action:** Click to filter Needs Attention to "unconfirmed" filter
   - **Updates:** Real-time when appointments are created or confirmed

4. **Missing Intake Card**
   - **Backend Field:** `stats.missing_intake`
   - **Display:** Large number card with error color
   - **Action:** Click to filter Needs Attention to "missing-intake" filter
   - **Updates:** Real-time when intake forms are submitted

5. **Voice AI Alerts Card** (Mocked)
   - **Backend Field:** `stats.voice_ai_alerts` (always returns 0 in MVP)
   - **Display:** Large number card (disabled/grayed out in MVP)
   - **Note:** This is mocked - Voice AI backend not built yet
   - **Action:** None (disabled in MVP)

**Implementation Notes:**
- All cards fetch data from single `/api/dashboard/admin` endpoint
- Cards are clickable and update filter state for sections below
- Use `useState` for active filter: `'all' | 'confirmed' | 'unconfirmed' | 'missing-intake'`

#### Section 2: Needs Attention

**Data Source:** `GET /api/dashboard/admin` response `needs_attention` array

**Backend Data Structure:**
```json
{
  "needs_attention": [
    {
      "id": "appointment-uuid",
      "patient_name": "John Doe",
      "time": "09:00 AM",
      "doctor": "Dr. Sarah Chen",
      "issue": "unconfirmed" | "missing_intake"
    }
  ]
}
```

**Display Requirements:**
- Show list of attention items
- Each item shows: patient name, time, doctor name, issue type badge
- Issue badge color: "unconfirmed" = warning (orange), "missing_intake" = error (red)
- Click item → Opens patient detail modal/sidebar
- Empty state if no items need attention

**Filtering:**
- Filter by active hero card selection
- If "Unconfirmed" card clicked → Show only `issue === "unconfirmed"` items
- If "Missing Intake" card clicked → Show only `issue === "missing_intake"` items
- If "All" or "Total" clicked → Show all items (default)

**Alternative Data Source:** Can also use `GET /api/dashboard/needs-attention?filter=all|unconfirmed|missing-intake`
- This endpoint provides more detailed data (includes patient phone number)
- Use this endpoint when user clicks into detailed needs attention view

**Implementation Notes:**
- Fetch on component mount and when date changes
- Re-fetch when appointments are created/updated/cancelled
- Use `useEffect` with date dependency

#### Section 3: Today's Schedule

**Data Source:** `GET /api/dashboard/admin` response `todays_schedule` array

**Backend Data Structure:**
```json
{
  "todays_schedule": [
    {
      "id": "appointment-uuid",
      "time": "09:00 AM",
      "patient_name": "John Doe",
      "doctor": "Dr. Sarah Chen",
      "visit_type": "in-clinic" | "virtual",
      "status": {
        "confirmed": true | false,
        "intake_complete": true | false
      }
    }
  ]
}
```

**Display Requirements:**
- Timeline view showing appointments chronologically
- Each appointment card shows:
  - Time (formatted as "I:M AM/PM")
  - Patient name
  - Doctor name
  - Visit type badge (in-clinic = green, virtual = blue)
  - Status indicators:
    - Confirmed badge (green checkmark if confirmed, warning icon if unconfirmed)
    - Intake complete badge (green if complete, warning if missing)
- Click appointment card → Opens appointment detail modal/drawer
- Empty state if no appointments for the day

**Filtering:**
- Filter by active hero card selection
- If "Confirmed" card clicked → Show only `status.confirmed === true` appointments
- If "Unconfirmed" card clicked → Show only `status.confirmed === false` appointments
- If "Missing Intake" card clicked → Show only `status.intake_complete === false` appointments
- If "All" or "Total" clicked → Show all appointments (default)

**Sorting:**
- Backend returns appointments sorted by time (already sorted)
- Display in chronological order

**Date Navigation:**
- Date picker allows selecting different date
- Fetch new data when date changes: `GET /api/dashboard/admin?date=YYYY-MM-DD`
- Default to today if no date selected

**Implementation Notes:**
- Schedule already sorted by backend (no client-side sorting needed)
- Re-fetch when date changes or appointments are modified
- Show loading state while fetching

**Quick Actions Available:**
- Click appointment → View details
- In detail modal: Confirm, Cancel, Reschedule, Mark Arrived buttons (calls respective appointment endpoints)

---

## Doctor Dashboard Features

### Page: Doctor Dashboard (`/dashboard`)

**Backend Endpoint:** `GET /api/dashboard/doctor?date=YYYY-MM-DD` (optional, defaults to today)

**Purpose:** Personal dashboard for doctors showing only their own appointments and patients

**All Content is Dynamic - Backend Ready:**

#### Section 1: Hero Cards (Doctor Statistics)

**Data Source:** Calculated from `GET /api/dashboard/doctor` response `stats` object

**Cards to Display:**

1. **Total Appointments Card**
   - **Backend Field:** `stats.total_appointments` (doctor's own appointments only)
   - **Display:** Large number card
   - **Action:** None (display only)
   - **Updates:** Real-time when appointments are created/cancelled for this doctor

2. **Confirmed Appointments Card**
   - **Backend Field:** `stats.confirmed` (doctor's confirmed appointments only)
   - **Display:** Large number card with success color
   - **Action:** None (display only)
   - **Updates:** Real-time when appointments are confirmed

3. **Unconfirmed Appointments Card**
   - **Backend Field:** `stats.unconfirmed` (doctor's unconfirmed appointments only)
   - **Display:** Large number card with warning color
   - **Action:** None (display only)
   - **Updates:** Real-time when appointments are created or confirmed

4. **Missing Intake Card**
   - **Backend Field:** `stats.missing_intake` (doctor's appointments with missing intake)
   - **Display:** Large number card with error color
   - **Action:** None (display only)
   - **Updates:** Real-time when intake forms are submitted for doctor's patients

5. **Voice AI Alerts Card** (Mocked)
   - **Backend Field:** `stats.voice_ai_alerts` (always returns 0 in MVP)
   - **Display:** Large number card (disabled/grayed out in MVP)
   - **Note:** This is mocked - Voice AI backend not built yet
   - **Action:** None (disabled in MVP)

**Implementation Notes:**
- All cards fetch data from single `/api/dashboard/doctor` endpoint
- Cards are display-only (no filtering actions)
- Doctor can only see their own statistics

#### Section 2: Doctor Information Header

**Data Source:** `GET /api/dashboard/doctor` response `doctor` object

**Backend Data Structure:**
```json
{
  "doctor": {
    "id": "doctor-uuid",
    "name": "Dr. Sarah Chen"
  }
}
```

**Display Requirements:**
- Show doctor name as page header/title
- Optional: Show doctor initials or specialty if available (requires `GET /api/doctors/{id}` call)
- Display date selector for viewing different days

#### Section 3: Today's Patients List

**Data Source:** `GET /api/dashboard/doctor` response `todays_patients` array

**Backend Data Structure:**
```json
{
  "todays_patients": [
    {
      "id": "patient-uuid",
      "appointment_id": "appointment-uuid",
      "time": "09:00 AM",
      "patient_name": "John Doe",
      "visit_type": "in-clinic" | "virtual",
      "visit_category": "new-patient" | "follow-up" | null,
      "status": {
        "confirmed": true | false,
        "intake_complete": true | false,
        "arrived": true | false
      },
      "intake_summary": {
        "summary_text": "2-3 sentence summary...",
        "patient_concerns": ["Concern 1", "Concern 2"],
        "medications": ["Medication 1", "Medication 2"],
        "allergies": ["Allergy 1", "Allergy 2"]
      } | null
    }
  ]
}
```

**Display Requirements:**
- List of patient cards for today's appointments
- Each patient card shows:
  - Time (formatted as "I:M AM/PM")
  - Patient name (large, prominent)
  - Visit type badge (in-clinic = green, virtual = blue)
  - Visit category badge (new-patient = blue, follow-up = gray, optional)
  - Status indicators:
    - Confirmed status (icon + badge)
    - Intake complete status (icon + badge)
    - Arrived status (icon + badge, only if arrived)
  - Expandable intake summary section (if available):
    - "View Summary" button/accordion
    - When expanded, shows:
      - Summary text (2-3 sentences)
      - Patient concerns list (bullet points)
      - Current medications list (bullet points)
      - Known allergies list (bullet points with warning styling)
- Click patient card → Expands to show full details and intake summary
- Empty state if no patients for the day

**Intake Summary Display:**
- If `intake_summary` is `null` or not present:
  - Show "Intake Summary: Not Available" or hide section
- If `intake_summary` is present:
  - Show "Intake Summary: Available" button
  - Expandable section with all summary details
  - Format concerns, medications, allergies as readable lists
  - Highlight allergies with warning/error styling

**Sorting:**
- Backend returns patients sorted by time (already sorted)
- Display in chronological order

**Date Navigation:**
- Date picker allows selecting different date
- Fetch new data when date changes: `GET /api/dashboard/doctor?date=YYYY-MM-DD`
- Default to today if no date selected

**Implementation Notes:**
- Patients already sorted by backend (no client-side sorting needed)
- Re-fetch when date changes
- Show loading state while fetching
- Handle null intake_summary gracefully

**Quick Actions Available:**
- Click patient → View full details
- Expand intake summary for preparation
- (Note: Doctor cannot confirm/cancel appointments - that's admin only)

---

## Sidebar Navigation - Admin

### Navigation Items and Their Backend APIs

**Sidebar Structure:**
```
Dashboard
Schedule
Patients
Intake Forms (submissions only - templates UI-only)
Settings (UI-only - no backend APIs)
```

### 1. Dashboard (`/dashboard`)

**Backend Endpoint:** `GET /api/dashboard/admin?date=YYYY-MM-DD`

**Purpose:** Main admin dashboard with statistics and today's overview

**All Content Dynamic:**
- Hero cards → `stats` object
- Needs Attention → `needs_attention` array
- Today's Schedule → `todays_schedule` array

**See "Admin Dashboard Features" section above for complete details**

### 2. Schedule (`/schedule`)

**Backend Endpoint:** `GET /api/schedule/day?date=YYYY-MM-DD`

**Purpose:** Multi-doctor calendar grid view for scheduling appointments

**All Content Dynamic - Backend Ready:**

#### Multi-Doctor Grid View

**Data Source:** `GET /api/schedule/day?date=YYYY-MM-DD`

**Backend Data Structure:**
```json
{
  "date": "2026-01-15",
  "doctors": [
    {
      "id": "doctor-uuid",
      "name": "Dr. Sarah Chen",
      "color": "#4A90A4",
      "appointments": [
        {
          "id": "appointment-uuid",
          "time": "09:00",
          "duration": 30,
          "patient": {
            "id": "patient-uuid",
            "name": "John Doe"
          },
          "visitType": "in-clinic" | "virtual",
          "status": {
            "confirmed": true | false,
            "intakeComplete": true | false
          }
        }
      ]
    }
  ]
}
```

**Display Requirements:**
- Multi-column grid layout
- One column per doctor
- Column header shows:
  - Doctor name
  - Doctor color (use as column border/background accent)
- Time slots: 9 AM to 5 PM in 15-minute or 30-minute intervals
- Each appointment card shows:
  - Time (formatted as "HH:MM" from backend)
  - Patient name
  - Duration (if available, else default to 30 minutes)
  - Visit type indicator (in-clinic = solid card, virtual = dashed border or icon)
  - Status indicators:
    - Confirmed (green checkmark) or Unconfirmed (warning icon)
    - Intake Complete (green badge) or Missing (red badge)
- Click appointment card → Opens appointment detail drawer/modal

**Time Slot Grid:**
- Generate time slots from 9:00 AM to 5:00 PM
- Show appointments at their scheduled times
- Handle overlapping appointments (same doctor, same time)
- Show empty slots as available time

**Date Navigation:**
- Date picker at top
- Fetch new schedule when date changes: `GET /api/schedule/day?date=YYYY-MM-DD`
- Default to today

**Actions Available:**
- Click appointment → View/edit details
- Click empty slot → Open "Add Appointment" flow
- In appointment detail: Confirm, Cancel, Reschedule, Mark Arrived buttons

#### Add Appointment Flow

**When User Clicks "+ Add Patient" or Empty Slot:**

**Step 1: Visit Type Selection**
- UI-only selection (in-clinic or virtual)
- Store selection in component state
- No backend call needed

**Step 2: Provider & Scheduling**
- **Backend Endpoint:** `GET /api/schedule/available-slots?doctor_id={uuid}&date=YYYY-MM-DD`
- **Purpose:** Get available time slots for selected doctor and date
- **Backend Response:**
  ```json
  {
    "date": "2026-01-15",
    "doctor_id": "doctor-uuid",
    "available_slots": ["09:00", "09:30", "10:00", "10:30", "14:00"]
  }
  ```
- **Display:**
  - Provider dropdown: Fetch doctors from `GET /api/doctors`
  - Date picker: Select date (today through 30 days forward)
  - Time slot grid: Display available slots from backend response
  - Show selected slot highlighted
  - Disable already-booked slots (not in available_slots array)
- **User Selection:**
  - Select doctor from dropdown
  - Select date from date picker
  - Select time slot from available slots
  - On doctor/date change → Re-fetch available slots

**Step 3: Patient Information**
- **Option A: Create New Patient**
  - Form fields: first_name, last_name, email (optional), phone (optional), date_of_birth (optional)
  - On submit → `POST /api/patients` (creates patient first)
  - Get patient ID from response
  - Proceed to appointment creation
  
- **Option B: Select Existing Patient**
  - Search/filter patients: Use `GET /api/patients?skip=0&limit=100`
  - Search by name: Filter client-side from fetched list (or add search param if backend supports)
  - Select patient from list
  - Use patient ID for appointment creation

**Step 4: Appointment Details**
- Pre-fill from previous steps:
  - Doctor ID (from step 2)
  - Patient ID (from step 3)
  - Date (from step 2)
  - Start time (from step 2)
  - Visit type (from step 1)
- Additional fields:
  - Visit category: "new-patient" or "follow-up" (optional)
  - Duration: Default 30 minutes, allow override
  - Calculate end_time: start_time + duration
- **Backend Validation:**
  - Slot availability checked automatically by `POST /api/appointments`
  - Backend returns 409 if slot conflict
  - Handle error gracefully

**Step 5: Submit Appointment**
- **Backend Endpoint:** `POST /api/appointments`
- **Request Body:**
  ```json
  {
    "doctor_id": "uuid",
    "patient_id": "uuid",
    "date": "2026-01-15",
    "start_time": "09:00:00",
    "end_time": "09:30:00",
    "duration": 30,
    "visit_type": "in-clinic" | "virtual",
    "visit_category": "new-patient" | "follow-up" | null
  }
  ```
- **Backend Response:** Full appointment object with nested doctor and patient data
- **After Success:**
  - Refresh schedule data: `GET /api/schedule/day?date={selected_date}`
  - Refresh dashboard stats: `GET /api/dashboard/admin?date={selected_date}`
  - Show success message
  - Close modal

**Step 6: Intake Path (Optional - UI Only)**
- **Note:** Intake form templates are UI-only (backend not built)
- **For MVP:** Skip intake form template selection
- **If Intake Form Submitted Later:**
  - Use `POST /api/intake/forms` to submit intake form
  - Link to appointment via `appointment_id`

**Implementation Notes:**
- Multi-step wizard with progress indicator
- Validate each step before proceeding
- Show loading states during API calls
- Handle errors at each step
- Re-fetch schedule after appointment creation

#### Appointment Detail Drawer/Modal

**When User Clicks Appointment Card:**

**Data Source:** 
- Use appointment data from schedule response
- OR fetch fresh: `GET /api/appointments/{appointment_id}`

**Display Requirements:**
- Patient information:
  - Patient name
  - Patient phone (from patient data)
  - Patient email (from patient data)
- Appointment details:
  - Date and time
  - Doctor name
  - Visit type
  - Visit category
  - Duration
  - Status badges (confirmed, intake complete, arrived)
- Intake summary (if available):
  - Fetch: `GET /api/intake/summary/{appointment_id}`
  - Display summary text, concerns, medications, allergies

**Actions Available (Admin Only):**
- **Confirm Appointment Button:**
  - **Backend Endpoint:** `POST /api/appointments/{appointment_id}/confirm`
  - Updates status to "confirmed"
  - Refresh appointment data after success
  
- **Cancel Appointment Button:**
  - Opens cancel modal
  - Fields: cancellation_type (required), reason_note (optional)
  - **Backend Endpoint:** `POST /api/appointments/{appointment_id}/cancel`
  - **Request Body:**
    ```json
    {
      "cancellation_type": "patient-cancelled" | "no-show" | "rescheduled-externally" | "clinic-cancelled" | "other",
      "reason_note": "Optional note text"
    }
    ```
  - Refresh schedule after success
  
- **Reschedule Appointment Button:**
  - Opens reschedule modal
  - Fields: new date, new time (show available slots), optionally new doctor
  - **Backend Endpoint:** `PUT /api/appointments/{appointment_id}`
  - **Request Body:**
    ```json
    {
      "date": "2026-01-16",
      "start_time": "10:00:00",
      "end_time": "10:30:00",
      "doctor_id": "uuid" // Optional, if changing doctor
    }
    ```
  - Refresh schedule after success
  
- **Mark Arrived Button:**
  - **Backend Endpoint:** `POST /api/appointments/{appointment_id}/arrive`
  - Updates arrived status and timestamp
  - Refresh appointment data after success

**Implementation Notes:**
- All actions require admin authentication
- Show loading states during API calls
- Refresh parent view after successful actions
- Handle errors gracefully with user-friendly messages

### 3. Patients (`/patients`)

**Backend Endpoint:** `GET /api/patients?skip=0&limit=100` (paginated)

**Purpose:** Patient list with search, filters, and management

**All Content Dynamic - Backend Ready:**

#### Patient List Table/Grid

**Data Source:** `GET /api/patients?skip={skip}&limit={limit}`

**Backend Response Structure:**
```json
{
  "items": [
    {
      "id": "patient-uuid",
      "clinic_id": "clinic-uuid",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe",
      "email": "john@email.com" | null,
      "phone": "+1234567890" | null,
      "date_of_birth": "1990-01-01" | null,
      "created_at": "2026-01-01T...",
      "updated_at": "2026-01-01T..."
    }
  ],
  "total": 50
}
```

**Display Requirements:**
- Table or card grid layout
- Each patient row/card shows:
  - Patient name (full_name from backend)
  - Phone number (if available, else "N/A")
  - Email (if available, else "N/A")
  - Date of birth (if available, formatted, else "N/A")
  - Quick actions: View Details, Edit, View Appointments
- Pagination:
  - Show total count: `total` from response
  - Pagination controls: Previous, Next, Page numbers
  - Use `skip` and `limit` query parameters

**Search Functionality:**
- Search input field
- **Note:** Backend doesn't have search parameter yet (MVP)
- **Client-Side Search (MVP):**
  - Fetch all patients: `GET /api/patients?skip=0&limit=1000`
  - Filter client-side by:
    - Patient name (first_name, last_name, full_name)
    - Email (if search term contains "@")
    - Phone (if search term is numeric)
- **Future Enhancement:** Add `?search={term}` parameter to backend

**Filters:**

1. **Time-Based Filter (UI Only):**
   - Filter buttons: "Last 7 days", "Last 14 days", "Last 30 days", "All"
   - **Client-Side Filtering:**
     - Calculate date range from today
     - Filter by `created_at` date
   - Shows count: "X patients in selected period"
   - **Note:** Backend doesn't support date filtering yet (MVP)

2. **Needs Attention Filter:**
   - Filter button: "X patients need attention"
   - **Backend Endpoint:** `GET /api/dashboard/needs-attention?filter=all`
   - **Alternative:** `GET /api/appointments?status=unconfirmed&intake_status=missing`
   - Shows patients with:
     - Unconfirmed appointments
     - Missing intake forms
   - Active filter indicator with clear button

**Patient Detail Side Panel:**
- **Trigger:** Click patient row/card
- **Data Source:** 
  - Patient data from list (already fetched)
  - Patient appointments: `GET /api/patients/{patient_id}/appointments`
- **Display:**
  - Patient full information:
    - Name, phone, email, date of birth
    - Created date, last updated date
  - Appointment history:
    - List of all appointments (from `/api/patients/{id}/appointments`)
    - Each appointment shows: date, time, doctor, status, visit type
    - Click appointment → Navigate to schedule view
  - Quick actions:
    - Edit patient (opens edit modal)
    - Create appointment (opens add appointment flow pre-filled with patient)
    - View all appointments

**Add Patient Button:**
- Opens "Add Patient" modal
- Form fields: first_name, last_name, email (optional), phone (optional), date_of_birth (optional)
- **Backend Endpoint:** `POST /api/patients`
- **Request Body:**
  ```json
  {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@email.com",
    "phone": "+1234567890",
    "date_of_birth": "1985-05-15"
  }
  ```
- **After Success:**
  - Refresh patient list
  - Show success message
  - Close modal

**Edit Patient:**
- **Backend Endpoint:** `PUT /api/patients/{patient_id}`
- Opens edit modal pre-filled with patient data
- Allow editing: first_name, last_name, email, phone, date_of_birth
- **Request Body:** Same as create, all fields optional (partial update)
- **After Success:**
  - Refresh patient list
  - Update patient detail side panel if open

**Implementation Notes:**
- Implement pagination for large patient lists
- Search is client-side in MVP (consider backend search for production)
- Filters combine backend and client-side logic
- Patient detail panel should be sidebar/drawer for better UX
- Re-fetch patient list after create/edit operations

**Role-Based Access:**
- Admin: Sees all patients in clinic
- Doctor: Sees only own patients (patients with appointments to this doctor)
- Backend automatically filters by role - no frontend logic needed

### 4. Intake Forms (`/intake`)

**Backend Endpoint:** `GET /api/intake/forms?skip=0&limit=100`

**Purpose:** View and manage submitted intake forms

**IMPORTANT:** Intake form templates/visit types are UI-only (backend not built). Only form submissions are backed by backend.

**All Submissions Content Dynamic - Backend Ready:**

#### Submitted Intake Forms List

**Data Source:** `GET /api/intake/forms?skip={skip}&limit={limit}`

**Backend Response Structure:**
```json
[
  {
    "id": "form-uuid",
    "clinic_id": "clinic-uuid",
    "patient_id": "patient-uuid",
    "appointment_id": "appointment-uuid" | null,
    "raw_answers": {
      "question1": "answer1",
      "medications": ["drug1", "drug2"],
      "allergies": ["allergy1"]
    },
    "status": "pending" | "submitted" | "reviewed",
    "submitted_at": "2026-01-15T..." | null,
    "created_at": "2026-01-15T...",
    "ai_summary": {
      "id": "summary-uuid",
      "summary_text": "2-3 sentence summary...",
      "patient_concerns": ["concern1", "concern2"],
      "medications": ["med1", "med2"],
      "allergies": ["allergy1"],
      "key_notes": "Important notes...",
      "generated_at": "2026-01-15T..."
    } | null
  }
]
```

**Display Requirements:**
- Table or card list showing submitted intake forms
- Each form row/card shows:
  - Patient name (fetch from patient_id using `GET /api/patients/{patient_id}` or use patient data from appointment)
  - Appointment date/time (fetch from appointment_id using `GET /api/appointments/{appointment_id}` if available)
  - Status badge (pending = gray, submitted = blue, reviewed = green)
  - Submitted date (if available, formatted)
  - AI summary indicator (badge if ai_summary exists)
- Click form row/card → Opens intake form detail view
- Pagination:
  - Show total count (manual count from array length or add pagination to backend)
  - Pagination controls: Previous, Next, Page numbers
  - Use `skip` and `limit` query parameters

**Intake Form Detail View:**
- **Trigger:** Click intake form row/card
- **Data Source:**
  - Intake form data from list or fresh fetch: `GET /api/intake/forms/{form_id}`
  - Patient data: `GET /api/patients/{patient_id}`
  - Appointment data (if available): `GET /api/appointments/{appointment_id}`
- **Display:**
  - Patient information: name, phone, email
  - Appointment information: date, time, doctor (if linked)
  - Form responses: Display `raw_answers` JSON object in readable format
    - Format as key-value pairs or form fields
    - Handle nested objects and arrays (medications, allergies)
  - AI Summary (if available):
    - Show "AI Summary" section
    - Display summary_text (2-3 sentences)
    - Display patient_concerns list
    - Display medications list
    - Display allergies list (highlighted with warning)
    - Display key_notes (if available)
    - Show generated_at timestamp
  - Status: pending, submitted, reviewed
  - Submitted timestamp (if available)

**Actions Available (Admin Only):**
- **Mark Complete Button:**
  - **Backend Endpoint:** `PUT /api/intake/forms/{form_id}/complete`
  - Updates status to "submitted"
  - Updates appointment intake_status to "completed" if linked
  - Refresh form data after success

**Submit Intake Form Manually:**
- **Backend Endpoint:** `POST /api/intake/forms`
- **Purpose:** Create/submit intake form for an appointment
- **Request Body:**
  ```json
  {
    "appointment_id": "appointment-uuid",
    "raw_answers": {
      "question1": "answer1",
      "medications": ["drug1", "drug2"],
      "allergies": ["allergy1"]
    }
  }
  ```
- **Backend Behavior:**
  - Creates intake form record
  - Updates appointment intake_status to "completed"
  - Triggers AI summary generation automatically (non-blocking)
- **After Success:**
  - Refresh intake forms list
  - Show success message
  - AI summary may not be available immediately (generated asynchronously)

**AI Summary Management:**
- **View Summary:** If summary exists, display in form detail view (see above)
- **Regenerate Summary (Admin Only):**
  - **Backend Endpoint:** `POST /api/intake/summary/{appointment_id}/regenerate`
  - Requires appointment_id from intake form
  - Regenerates AI summary using OpenAI GPT-4
  - **After Success:**
    - Refresh form detail view to see new summary
    - Show loading state during regeneration
    - Handle errors gracefully (API failures)

**Filtering (Client-Side MVP):**
- Filter by status: pending, submitted, reviewed
- Filter by date: submitted_at date range
- Filter by patient: Search by patient name (requires patient data fetch)
- **Note:** Backend doesn't support filtering yet (MVP) - implement client-side filtering

**Implementation Notes:**
- Intake form templates/visit types are UI-only (no backend CRUD)
- Only form submissions are backed by backend APIs
- AI summary generation is automatic on form submission (non-blocking)
- Handle null ai_summary gracefully (may not be generated yet)
- Pagination may need manual implementation (backend returns array, not paginated object)
- Patient and appointment data need to be fetched separately for display

**Role-Based Access:**
- Admin: Sees all intake forms in clinic
- Doctor: Sees only own patients' intake forms
- Backend automatically filters by role - no frontend logic needed

### 5. Settings (`/settings`)

**Backend Endpoint:** None (UI-only configuration)

**Purpose:** Clinic configuration and settings management

**IMPORTANT:** Settings backend APIs are deferred per MVP plan. All settings are UI-only.

**UI-Only Features (No Backend):**
- Clinic Profile tab (clinic name, timezone - stored in database but no update endpoint)
- Users & Permissions tab (UI-only, no user management APIs yet)
- Scheduling Rules tab (UI-only, no rules engine backend)
- Intake & Visit Logic tab (UI-only, no logic engine backend)
- Voice AI Controls tab (UI-only, no Voice AI backend)
- Notifications & Alerts tab (UI-only, no notification system backend)
- Data, Sync & Preferences tab (UI-only)
- Security & Audit tab (UI-only)

**Implementation Notes:**
- All settings are UI-only for MVP
- Store settings in localStorage or context state
- No backend persistence
- Settings changes don't affect backend behavior in MVP
- Plan backend APIs for post-MVP phase

---

## Sidebar Navigation - Doctor

### Navigation Items and Their Backend APIs

**Sidebar Structure:**
```
Dashboard
My Schedule
Settings (UI-only - no backend APIs)
```

### 1. Dashboard (`/dashboard`)

**Backend Endpoint:** `GET /api/dashboard/doctor?date=YYYY-MM-DD`

**Purpose:** Personal doctor dashboard showing only own appointments and patients

**All Content Dynamic:**
- Hero cards → `stats` object
- Doctor info → `doctor` object
- Today's patients → `todays_patients` array (with AI summaries)

**See "Doctor Dashboard Features" section above for complete details**

### 2. My Schedule (`/schedule`)

**Backend Endpoint:** `GET /api/schedule/day/{doctor_id}?date=YYYY-MM-DD`

**Purpose:** Single-doctor calendar view showing only this doctor's appointments

**All Content Dynamic - Backend Ready:**

#### Single-Doctor Schedule View

**Data Source:** `GET /api/schedule/day/{doctor_id}?date=YYYY-MM-DD`

**Backend Data Structure:**
```json
{
  "date": "2026-01-15",
  "doctors": [
    {
      "id": "doctor-uuid",
      "name": "Dr. Sarah Chen",
      "color": "#4A90A4",
      "appointments": [
        {
          "id": "appointment-uuid",
          "time": "09:00",
          "duration": 30,
          "patient": {
            "id": "patient-uuid",
            "name": "John Doe"
          },
          "visitType": "in-clinic" | "virtual",
          "status": {
            "confirmed": true | false,
            "intakeComplete": true | false
          }
        }
      ]
    }
  ]
}
```

**Display Requirements:**
- Single-column layout (expanded view)
- Time slots: 9 AM to 5 PM in 15-minute or 30-minute intervals
- Each appointment card shows:
  - Time (formatted as "HH:MM" from backend)
  - Patient name
  - Duration (if available, else default to 30 minutes)
  - Visit type indicator (in-clinic = solid card, virtual = dashed border or icon)
  - Status indicators:
    - Confirmed (green checkmark) or Unconfirmed (warning icon)
    - Intake Complete (green badge) or Missing (red badge)
    - Arrived (green badge if arrived)
- Click appointment card → Opens appointment detail drawer/modal
- Empty state if no appointments for the day

**Time Slot Grid:**
- Generate time slots from 9:00 AM to 5:00 PM
- Show appointments at their scheduled times
- Show empty slots as available time (for reference, doctor cannot create appointments)

**Date Navigation:**
- Date picker at top
- Fetch new schedule when date changes: `GET /api/schedule/day/{doctor_id}?date=YYYY-MM-DD`
- Default to today
- Use `current_user.doctor_id` from `/api/auth/me` response

**Appointment Detail Drawer/Modal:**
- **Trigger:** Click appointment card
- **Data Source:** 
  - Use appointment data from schedule response
  - OR fetch fresh: `GET /api/appointments/{appointment_id}` (must verify doctor_id matches)
- **Display:**
  - Patient information:
    - Patient name
    - Patient phone (from patient data)
    - Patient email (from patient data)
  - Appointment details:
    - Date and time
    - Visit type
    - Visit category
    - Duration
    - Status badges (confirmed, intake complete, arrived)
  - Intake summary (if available):
    - Fetch: `GET /api/intake/summary/{appointment_id}`
    - Display summary text, concerns, medications, allergies
    - This is the key feature for doctor preparation

**Actions Available (Doctor Cannot Modify Appointments):**
- **View Details Only:** Doctor can view appointment details
- **View Intake Summary:** Doctor can view AI intake summary for preparation
- **No Actions:** Doctor cannot confirm, cancel, reschedule, or mark arrived (admin only)
- **Note:** If doctor needs changes, they must contact admin

**Implementation Notes:**
- Doctor can only view their own schedule
- Backend automatically filters by doctor_id - no frontend logic needed
- Doctor ID comes from `current_user.doctor_id` in `/api/auth/me` response
- Schedule view is read-only for doctors
- Intake summary is the primary feature doctors use for preparation

### 3. Settings (`/settings`)

**Backend Endpoint:** None (UI-only configuration)

**Purpose:** Personal doctor settings and preferences

**IMPORTANT:** Settings backend APIs are deferred per MVP plan. All settings are UI-only.

**UI-Only Features (No Backend):**
- Personal working hours (UI-only, no backend storage)
- Visit type preferences (UI-only, no backend storage)
- Voice AI preferences (UI-only, no Voice AI backend)
- Personal preferences tab (UI-only)

**Implementation Notes:**
- All doctor settings are UI-only for MVP
- Store settings in localStorage or context state
- No backend persistence
- Settings changes don't affect backend behavior in MVP
- Plan backend APIs for post-MVP phase

---

## Data Flow & Real-Time Updates

### When Appointment is Created

```typescript
Admin creates appointment via POST /api/appointments
  ↓
Appointment created in database
  ↓
Frontend should refresh:
  ├── Dashboard: GET /api/dashboard/admin (stats update)
  ├── Schedule: GET /api/schedule/day (new appointment appears)
  ├── Patients: GET /api/patients/{id}/appointments (if viewing patient)
  └── Needs Attention: GET /api/dashboard/needs-attention (if unconfirmed)
```

### When Appointment is Confirmed

```typescript
Admin confirms appointment via POST /api/appointments/{id}/confirm
  ↓
Appointment status updated to "confirmed"
  ↓
Frontend should refresh:
  ├── Dashboard: GET /api/dashboard/admin (confirmed count increases)
  ├── Schedule: GET /api/schedule/day (status badge updates)
  ├── Doctor Dashboard: GET /api/dashboard/doctor (if doctor viewing)
  └── Needs Attention: GET /api/dashboard/needs-attention (removed from unconfirmed)
```

### When Appointment is Cancelled

```typescript
Admin cancels appointment via POST /api/appointments/{id}/cancel
  ↓
Appointment status updated to "cancelled"
Cancellation record created
  ↓
Frontend should refresh:
  ├── Dashboard: GET /api/dashboard/admin (total count decreases)
  ├── Schedule: GET /api/schedule/day (appointment removed from view)
  ├── Doctor Dashboard: GET /api/dashboard/doctor (if doctor viewing)
  └── Patient Appointments: GET /api/patients/{id}/appointments (shows cancelled)
```

### When Intake Form is Submitted

```typescript
Admin submits intake form via POST /api/intake/forms
  ↓
Intake form created
Appointment intake_status updated to "completed"
AI summary generation triggered (async, non-blocking)
  ↓
Frontend should refresh:
  ├── Dashboard: GET /api/dashboard/admin (missing_intake count decreases)
  ├── Intake Forms: GET /api/intake/forms (new form appears)
  ├── Schedule: GET /api/schedule/day (intake badge updates)
  ├── Doctor Dashboard: GET /api/dashboard/doctor (intake_summary may appear later)
  └── Needs Attention: GET /api/dashboard/needs-attention (removed from missing-intake)
```

### When AI Summary is Generated

```typescript
AI summary generation completes (async process)
  ↓
AIIntakeSummary record created/updated
  ↓
Frontend should refresh:
  ├── Intake Forms: GET /api/intake/forms/{form_id} (ai_summary appears)
  ├── Doctor Dashboard: GET /api/dashboard/doctor (intake_summary appears in patient list)
  └── Appointment Detail: GET /api/intake/summary/{appointment_id} (summary available)
```

**Implementation Notes:**
- Use `useEffect` hooks to re-fetch data after mutations
- Show loading states during API calls
- Optimize by only refreshing necessary views
- Consider optimistic updates for better UX
- Handle errors gracefully with user-friendly messages
- Use React Query or SWR for automatic refetching and caching

---

## Implementation Guide

### Step-by-Step Implementation Checklist

#### Phase 1: Authentication Integration

**Step 1.1: Set Up API Client**
- [ ] Create API client utility (`src/app/utils/api.ts`)
- [ ] Configure base URL: `http://localhost:8000/api` (development)
- [ ] Set up interceptors for JWT token in Authorization header
- [ ] Handle token expiration and refresh logic
- [ ] Configure error handling for 401/403/404 responses

**Step 1.2: Implement Login Flow**
- [ ] Create login page component
- [ ] Form fields: email, password
- [ ] On submit → `POST /api/auth/login`
- [ ] Store JWT token in localStorage or secure storage
- [ ] Redirect to dashboard on success
- [ ] Show error message on failure

**Step 1.3: Implement Google OAuth Login**
- [ ] Integrate Google OAuth button
- [ ] On Google success → Get ID token from Google
- [ ] Send ID token → `POST /api/auth/google/login`
- [ ] Store JWT token
- [ ] Redirect to dashboard on success
- [ ] Handle signup flow if user doesn't exist

**Step 1.4: Implement User Context**
- [ ] Create AuthContext to store current user
- [ ] On app load → Check localStorage for token
- [ ] If token exists → `GET /api/auth/me` to get user data
- [ ] Store user data in context (role, clinic_id, doctor_id)
- [ ] Provide user data to all components

**Step 1.5: Implement Protected Routes**
- [ ] Create ProtectedRoute component
- [ ] Check authentication status from AuthContext
- [ ] Redirect to login if not authenticated
- [ ] Check role-based access (admin vs doctor)
- [ ] Redirect to appropriate dashboard based on role

#### Phase 2: Admin Dashboard Integration

**Step 2.1: Create Dashboard Component**
- [ ] Create `AdminDashboard.tsx` component
- [ ] Fetch data on mount: `GET /api/dashboard/admin?date={date}`
- [ ] Store data in component state or React Query cache
- [ ] Show loading state while fetching
- [ ] Handle errors gracefully

**Step 2.2: Implement Hero Cards**
- [ ] Display 5 hero cards: Total, Confirmed, Unconfirmed, Missing Intake, Voice AI
- [ ] Use data from `stats` object in response
- [ ] Style cards with appropriate colors
- [ ] Make cards clickable (update filter state)
- [ ] Update filter state when card clicked

**Step 2.3: Implement Needs Attention Section**
- [ ] Display `needs_attention` array from response
- [ ] Show patient name, time, doctor, issue badge
- [ ] Filter items based on active filter state
- [ ] Click item → Open patient detail modal
- [ ] Show empty state if no items

**Step 2.4: Implement Today's Schedule Section**
- [ ] Display `todays_schedule` array from response
- [ ] Show appointments in timeline view
- [ ] Filter appointments based on active filter state
- [ ] Click appointment → Open appointment detail modal
- [ ] Show empty state if no appointments

**Step 2.5: Implement Date Navigation**
- [ ] Add date picker component
- [ ] Default to today
- [ ] On date change → Re-fetch dashboard data with new date
- [ ] Update URL query parameter with date (optional)

#### Phase 3: Schedule Page Integration

**Step 3.1: Create Schedule Page Component**
- [ ] Create `SchedulePage.tsx` component (admin) or `MySchedulePage.tsx` (doctor)
- [ ] Determine user role from AuthContext
- [ ] Choose endpoint: `/api/schedule/day` (admin) or `/api/schedule/day/{doctor_id}` (doctor)
- [ ] Fetch data on mount and date change
- [ ] Show loading state

**Step 3.2: Implement Multi-Doctor Grid (Admin)**
- [ ] Display doctors as columns
- [ ] Use `doctors` array from response
- [ ] Show doctor name and color in column header
- [ ] Generate time slots from 9 AM to 5 PM
- [ ] Render appointments at their scheduled times

**Step 3.3: Implement Single-Doctor View (Doctor)**
- [ ] Display single doctor schedule
- [ ] Use first doctor from `doctors` array (should be only one)
- [ ] Generate time slots from 9 AM to 5 PM
- [ ] Render appointments in chronological order
- [ ] Show empty slots

**Step 3.4: Implement Appointment Cards**
- [ ] Style appointment cards with doctor color
- [ ] Show patient name, time, duration
- [ ] Show visit type indicator
- [ ] Show status badges (confirmed, intake complete, arrived)
- [ ] Make cards clickable → Open appointment detail modal

**Step 3.5: Implement Add Appointment Flow**
- [ ] Create multi-step wizard component
- [ ] Step 1: Visit type selection (UI-only)
- [ ] Step 2: Provider & scheduling
  - [ ] Fetch doctors: `GET /api/doctors`
  - [ ] Show doctor dropdown
  - [ ] Show date picker
  - [ ] On doctor/date change → `GET /api/schedule/available-slots?doctor_id={id}&date={date}`
  - [ ] Display available slots grid
  - [ ] Select time slot
- [ ] Step 3: Patient information
  - [ ] Option A: Create new patient
    - [ ] Form fields: first_name, last_name, email, phone, date_of_birth
    - [ ] On submit → `POST /api/patients`
  - [ ] Option B: Select existing patient
    - [ ] Fetch patients: `GET /api/patients`
    - [ ] Show patient search/select
    - [ ] Select patient
- [ ] Step 4: Appointment details
  - [ ] Pre-fill: doctor_id, patient_id, date, start_time, visit_type
  - [ ] Additional fields: visit_category, duration
  - [ ] Calculate end_time
- [ ] Step 5: Submit appointment
  - [ ] `POST /api/appointments` with all data
  - [ ] On success → Refresh schedule and dashboard
  - [ ] Show success message
  - [ ] Close modal

**Step 3.6: Implement Appointment Detail Modal**
- [ ] Show patient information (name, phone, email)
- [ ] Show appointment details (date, time, doctor, visit type, status)
- [ ] Fetch intake summary: `GET /api/intake/summary/{appointment_id}` (if available)
- [ ] Display intake summary if available
- [ ] Actions (admin only):
  - [ ] Confirm button → `POST /api/appointments/{id}/confirm`
  - [ ] Cancel button → `POST /api/appointments/{id}/cancel` (with cancellation_type, reason_note)
  - [ ] Reschedule button → `PUT /api/appointments/{id}` (with new date, time, doctor_id)
  - [ ] Mark Arrived button → `POST /api/appointments/{id}/arrive`

#### Phase 4: Patients Page Integration

**Step 4.1: Create Patients Page Component**
- [ ] Create `PatientsPage.tsx` component
- [ ] Fetch patients on mount: `GET /api/patients?skip=0&limit=100`
- [ ] Implement pagination with skip/limit
- [ ] Show loading state

**Step 4.2: Implement Patient List Table**
- [ ] Display patients in table or card grid
- [ ] Show: name, email, phone, date_of_birth
- [ ] Click row → Open patient detail side panel
- [ ] Implement pagination controls
- [ ] Show total count

**Step 4.3: Implement Search Functionality (Client-Side MVP)**
- [ ] Add search input field
- [ ] Fetch all patients: `GET /api/patients?skip=0&limit=1000`
- [ ] Filter client-side by name, email, phone
- [ ] Update displayed list based on search term
- [ ] Show result count

**Step 4.4: Implement Filters**
- [ ] Time-based filter (client-side):
  - [ ] Filter buttons: "Last 7 days", "Last 14 days", "Last 30 days", "All"
  - [ ] Filter by `created_at` date
  - [ ] Update displayed list
- [ ] Needs Attention filter:
  - [ ] Filter button: "X patients need attention"
  - [ ] Fetch: `GET /api/dashboard/needs-attention?filter=all`
  - [ ] Filter patient list to show only those with attention items
  - [ ] Active filter indicator

**Step 4.5: Implement Patient Detail Side Panel**
- [ ] Show patient full information
- [ ] Fetch patient appointments: `GET /api/patients/{id}/appointments`
- [ ] Display appointment history list
- [ ] Quick actions: Edit, Create Appointment, View Appointments

**Step 4.6: Implement Add Patient Modal**
- [ ] Form fields: first_name, last_name, email, phone, date_of_birth
- [ ] On submit → `POST /api/patients`
- [ ] On success → Refresh patient list
- [ ] Show success message

**Step 4.7: Implement Edit Patient Modal**
- [ ] Pre-fill form with existing patient data
- [ ] Allow editing all fields
- [ ] On submit → `PUT /api/patients/{id}` (partial update)
- [ ] On success → Refresh patient list and detail panel

#### Phase 5: Intake Forms Page Integration

**Step 5.1: Create Intake Forms Page Component**
- [ ] Create `IntakeFormsPage.tsx` component
- [ ] Fetch intake forms on mount: `GET /api/intake/forms?skip=0&limit=100`
- [ ] Show loading state
- [ ] Note: Form templates are UI-only (no backend)

**Step 5.2: Implement Submitted Forms List**
- [ ] Display intake forms in table or card list
- [ ] For each form:
  - [ ] Fetch patient data: `GET /api/patients/{patient_id}` (or use cached data)
  - [ ] Fetch appointment data: `GET /api/appointments/{appointment_id}` (if available)
  - [ ] Show patient name, appointment date/time, status badge
  - [ ] Show AI summary indicator if `ai_summary` exists
- [ ] Click form → Open intake form detail view

**Step 5.3: Implement Intake Form Detail View**
- [ ] Show patient information
- [ ] Show appointment information (if linked)
- [ ] Display `raw_answers` JSON in readable format
  - [ ] Format as key-value pairs or form fields
  - [ ] Handle nested objects and arrays
- [ ] Display AI summary (if available):
  - [ ] Show summary_text
  - [ ] Show patient_concerns list
  - [ ] Show medications list
  - [ ] Show allergies list (highlighted)
  - [ ] Show key_notes (if available)
- [ ] Action (admin only): Mark Complete button → `PUT /api/intake/forms/{form_id}/complete`

**Step 5.4: Implement Submit Intake Form**
- [ ] Create form submission modal/component
- [ ] Select appointment (fetch from `GET /api/appointments` or use appointment from context)
- [ ] Form builder UI (for collecting `raw_answers`)
- [ ] On submit → `POST /api/intake/forms` with appointment_id and raw_answers
- [ ] On success → Refresh intake forms list
- [ ] Note: AI summary generates automatically (may not be available immediately)

**Step 5.5: Implement AI Summary Regeneration (Admin Only)**
- [ ] In intake form detail view, add "Regenerate Summary" button
- [ ] On click → `POST /api/intake/summary/{appointment_id}/regenerate`
- [ ] Show loading state during regeneration
- [ ] On success → Refresh form detail view to see new summary
- [ ] Handle errors gracefully

**Step 5.6: Implement Filters (Client-Side MVP)**
- [ ] Filter by status: pending, submitted, reviewed
- [ ] Filter by date: submitted_at date range
- [ ] Filter by patient: Search by patient name
- [ ] Update displayed list based on filters

#### Phase 6: Doctor Dashboard Integration

**Step 6.1: Create Doctor Dashboard Component**
- [ ] Create `DoctorDashboard.tsx` component
- [ ] Fetch data on mount: `GET /api/dashboard/doctor?date={date}`
- [ ] Show loading state
- [ ] Handle errors gracefully

**Step 6.2: Implement Hero Cards**
- [ ] Display 5 hero cards: Total, Confirmed, Unconfirmed, Missing Intake, Voice AI
- [ ] Use data from `stats` object (doctor's own appointments only)
- [ ] Cards are display-only (no filtering actions)

**Step 6.3: Implement Doctor Info Header**
- [ ] Display doctor name from `doctor` object
- [ ] Optional: Fetch full doctor data: `GET /api/doctors/{id}` for initials/specialty
- [ ] Show date selector

**Step 6.4: Implement Today's Patients List**
- [ ] Display `todays_patients` array
- [ ] For each patient:
  - [ ] Show time, patient name, visit type, visit category
  - [ ] Show status badges (confirmed, intake_complete, arrived)
  - [ ] Show expandable intake summary section (if available)
    - [ ] Display summary_text
    - [ ] Display patient_concerns list
    - [ ] Display medications list
    - [ ] Display allergies list (highlighted)
- [ ] Click patient card → Expand to show full details
- [ ] Empty state if no patients

**Step 6.5: Implement Date Navigation**
- [ ] Add date picker component
- [ ] Default to today
- [ ] On date change → Re-fetch dashboard data with new date

#### Phase 7: Doctor Schedule Integration

**Step 7.1: Create My Schedule Page Component**
- [ ] Create `MySchedulePage.tsx` component
- [ ] Get doctor_id from `current_user.doctor_id` (from `/api/auth/me`)
- [ ] Fetch schedule: `GET /api/schedule/day/{doctor_id}?date={date}`
- [ ] Show loading state

**Step 7.2: Implement Single-Doctor Schedule View**
- [ ] Display single-column layout (expanded view)
- [ ] Generate time slots from 9 AM to 5 PM
- [ ] Render appointments at their scheduled times
- [ ] Show empty slots

**Step 7.3: Implement Appointment Cards**
- [ ] Show patient name, time, duration
- [ ] Show visit type indicator
- [ ] Show status badges (confirmed, intake complete, arrived)
- [ ] Make cards clickable → Open appointment detail modal

**Step 7.4: Implement Appointment Detail Modal (Read-Only)**
- [ ] Show patient information
- [ ] Show appointment details
- [ ] Fetch and display intake summary: `GET /api/intake/summary/{appointment_id}`
- [ ] No action buttons (doctor cannot modify appointments)
- [ ] Show message: "Contact admin to make changes"

#### Phase 8: Real-Time Updates

**Step 8.1: Implement Data Refresh After Mutations**
- [ ] After creating appointment → Refresh schedule and dashboard
- [ ] After confirming appointment → Refresh dashboard and schedule
- [ ] After cancelling appointment → Refresh dashboard and schedule
- [ ] After submitting intake form → Refresh intake forms list and dashboard
- [ ] After updating patient → Refresh patient list

**Step 8.2: Implement Loading States**
- [ ] Show loading spinner/skeleton during API calls
- [ ] Disable buttons during mutations
- [ ] Show progress indicators for multi-step flows

**Step 8.3: Implement Error Handling**
- [ ] Catch API errors and display user-friendly messages
- [ ] Handle 401 errors → Redirect to login
- [ ] Handle 403 errors → Show "Access Denied" message
- [ ] Handle 404 errors → Show "Not Found" message
- [ ] Handle 409 errors (conflicts) → Show "Slot already booked" message
- [ ] Handle 500 errors → Show "Server error" message

**Step 8.4: Implement Optimistic Updates (Optional)**
- [ ] Update UI immediately after successful mutations
- [ ] Re-fetch data in background to ensure consistency
- [ ] Revert optimistic update if API call fails

---

## API Integration Best Practices

### Authentication Token Management

**Store JWT Token:**
```typescript
// After login
localStorage.setItem('auth_token', token);

// In API client
const token = localStorage.getItem('auth_token');
headers['Authorization'] = `Bearer ${token}`;
```

**Handle Token Expiration:**
```typescript
// If API returns 401, token expired
// Clear token and redirect to login
if (error.status === 401) {
  localStorage.removeItem('auth_token');
  navigate('/login');
}
```

### Error Handling

**API Error Response Format:**
```json
{
  "detail": "Error message here"
}
```

**Handle Errors:**
```typescript
try {
  const response = await api.post('/api/appointments', data);
  // Success
} catch (error) {
  if (error.response?.status === 409) {
    // Slot conflict
    showError('Time slot is already booked. Please select another time.');
  } else if (error.response?.status === 404) {
    // Not found
    showError('Resource not found.');
  } else {
    // Generic error
    showError(error.response?.data?.detail || 'An error occurred.');
  }
}
```

### Pagination Implementation

**Fetch Paginated Data:**
```typescript
const [page, setPage] = useState(1);
const limit = 20;
const skip = (page - 1) * limit;

const response = await api.get(`/api/patients?skip=${skip}&limit=${limit}`);
const { items, total } = response.data;

// Calculate total pages
const totalPages = Math.ceil(total / limit);
```

### Role-Based Access Control

**Check User Role:**
```typescript
const { user } = useAuthContext();

if (user?.role === 'admin') {
  // Show admin-only features
}

if (user?.role === 'doctor') {
  // Show doctor-only features
}
```

**Conditional API Calls:**
```typescript
// Admin sees all doctors, doctor sees own schedule
const endpoint = user?.role === 'admin' 
  ? `/api/schedule/day?date=${date}`
  : `/api/schedule/day/${user?.doctor_id}?date=${date}`;
```

### Date Format Handling

**Backend Expects:**
- Date: `YYYY-MM-DD` format (e.g., "2026-01-15")
- Time: `HH:MM:SS` format (e.g., "09:00:00")

**Frontend Conversion:**
```typescript
// Date picker value to API format
const dateString = date.toISOString().split('T')[0]; // "2026-01-15"

// Time picker value to API format
const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
```

### Loading States

**Show Loading During API Calls:**
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await api.get('/api/dashboard/admin');
    setData(response.data);
  } finally {
    setLoading(false);
  }
};
```

---

## Summary

### What Can Be Built Dynamically

✅ **Admin Dashboard** - Fully backed with `/api/dashboard/admin`
✅ **Doctor Dashboard** - Fully backed with `/api/dashboard/doctor`
✅ **Schedule Page** - Fully backed with `/api/schedule/day` endpoints
✅ **Patients Page** - Fully backed with `/api/patients` endpoints
✅ **Appointments Management** - Fully backed with `/api/appointments` endpoints
✅ **Intake Forms (Submissions)** - Fully backed with `/api/intake/forms` endpoints
✅ **AI Intake Summaries** - Fully backed with `/api/intake/summary` endpoints
✅ **Dashboard Statistics** - Fully backed and calculated by backend
✅ **Needs Attention** - Fully backed with `/api/dashboard/needs-attention`
✅ **Role-Based Access** - Fully enforced by backend APIs

### What Cannot Be Built Dynamically (UI-Only)

❌ **Owner Dashboard** - Backend deferred per MVP plan (hardcoded frontend only)
❌ **Voice AI System** - Backend deferred (UI placeholder only)
❌ **Automation Rules** - Backend deferred (UI structure only)
❌ **Settings Backend APIs** - Backend deferred (UI-only configuration)
❌ **Visit Types/Form Templates** - Backend CRUD deferred (UI form builder only, submissions backed)
❌ **Call Logs/Transcripts** - No backend (Voice AI deferred)
❌ **Automation Timeline** - No backend (Automation deferred)

### Key Implementation Points

1. **Every sidebar item with backend support** should fetch data from backend APIs
2. **All dynamic content** should be rendered from backend responses
3. **Role-based filtering** is handled by backend - frontend doesn't need additional filtering
4. **Real-time updates** require re-fetching data after mutations
5. **Error handling** is critical for good user experience
6. **Loading states** should be shown during all API calls
7. **Date navigation** triggers new API calls with date parameter
8. **Pagination** should be implemented for list endpoints

### Next Steps

1. Start with **Phase 1: Authentication Integration**
2. Then implement **Phase 2: Admin Dashboard Integration**
3. Continue with remaining phases in order
4. Test each phase before moving to next
5. Implement error handling and loading states throughout
6. Add optimizations (caching, optimistic updates) after basic functionality works

---

**This document provides complete roadmap for building dynamic dashboard UI with existing backend APIs. Every sidebar item and content section is mapped to its backend endpoint with step-by-step implementation guide.**