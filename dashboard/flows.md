ClinicFlow - Complete User Flows and Permissions
================================================

This document shows all possible actions for each role (Admin, Doctor, Owner) in the ClinicFlow dashboard. It explains what each user can do, what they cannot do, and how actions from one role affect what others see.


WHERE DATA COMES FROM
---------------------

There are two ways data enters the system:

1. From Marketing Website Signup Form
   -> When a new clinic signs up on the marketing website
   -> The signup form collects clinic name, owner email, timezone
   -> This creates the clinic account and first owner user
   -> This data flows automatically into the dashboard

2. From Dashboard Manual Entry (using +Add buttons)
   -> Admin manually adds doctors, patients, appointments
   -> Admin creates user accounts for doctors
   -> Admin enters patient information when booking


================================================================================
ADMIN ROLE - Full Operations Control
================================================================================

The Admin is the person who runs the day-to-day clinic operations. They have the most access and control over the system.


PAGES ADMIN CAN ACCESS
----------------------

Dashboard -> Shows all clinic appointments, confirmations, intake status, voice AI alerts
Schedule -> Shows multi-doctor calendar grid with all appointments
Patients -> Shows all patients in the clinic
Intake Forms -> Shows all intake form templates and submissions
Automation -> Shows voice AI automation rules and settings
Voice AI -> Shows all AI calls, messages, and items needing attention
Settings -> Shows all 8 settings tabs for full configuration


WHAT ADMIN CAN DO - APPOINTMENTS
--------------------------------

View all appointments across all doctors
-> Admin opens Dashboard -> sees hero cards with total count, confirmed count, unconfirmed count
-> Admin opens Schedule -> sees multi-column grid with all doctors

Create new appointment manually
-> Admin clicks +Add Patient button on Schedule page
-> Step 1: Select visit type (in-clinic or virtual)
-> Step 2: Select doctor and pick time slot
-> Step 3: Enter patient name, phone, email (this data entered manually by admin)
-> Step 4: Choose intake path (send form now, later, or skip)
-> Step 5: Select visit reason
-> Step 6: Select intake form template
-> Step 7: Confirmation screen
-> Result: Appointment created -> Doctor will see this in their schedule

Confirm appointment on behalf of patient
-> Admin finds unconfirmed appointment in Dashboard or Schedule
-> Admin clicks appointment card -> opens detail drawer
-> Admin clicks Confirm button
-> Result: Appointment status changes to confirmed -> Doctor sees it as confirmed

Reschedule appointment
-> Admin clicks appointment -> opens detail drawer
-> Admin clicks Reschedule button -> opens reschedule modal
-> Admin selects new date, new time, optionally new doctor
-> Admin clicks Save
-> Result: Appointment moves to new slot -> Doctor sees updated schedule -> Original slot becomes free

Cancel appointment
-> Admin clicks appointment -> opens detail drawer
-> Admin clicks Cancel button -> opens cancellation modal
-> Admin selects reason (patient cancelled, no-show, rescheduled externally, other)
-> Admin adds optional note
-> Admin clicks Confirm Cancel
-> Result: Appointment removed from schedule -> Added to cancellation history -> Doctor no longer sees it

Mark patient as arrived
-> Admin finds appointment in Schedule
-> Admin clicks Mark Arrived button
-> Result: Appointment shows "Arrived" status -> Doctor sees patient has arrived


WHAT ADMIN CAN DO - PATIENTS
----------------------------

View all patients in clinic
-> Admin opens Patients page -> sees full patient list with search and filters

Search for specific patient
-> Admin types in search box -> filters by name, email, or phone

Filter patients by attention needed
-> Admin clicks "Needs Attention" filter -> shows only patients with unconfirmed appointments or missing intake

View patient profile with full history
-> Admin clicks patient row -> opens patient side panel
-> Admin sees full history: all appointments, all cancellations, all AI interactions

Add new patient manually
-> Admin clicks +Add Patient button
-> Admin enters patient details (this data entered manually by admin)
-> Result: Patient created in system -> Can be assigned to appointments


WHAT ADMIN CAN DO - INTAKE FORMS
--------------------------------

View all intake form templates
-> Admin opens Intake Forms page -> sees list of form templates

Create new intake form template
-> Admin clicks +Create Form button
-> Admin uses form builder to add fields
-> Admin saves template
-> Result: Form available to send to patients

Send intake form to patient
-> Admin finds patient or appointment
-> Admin clicks Send Intake button
-> Result: Patient receives intake form link via email or SMS

View submitted intake forms
-> Admin opens Intake Forms -> Submissions tab
-> Admin sees all submitted forms with patient names

Mark intake as manually completed
-> Admin finds appointment with missing intake
-> Admin clicks "Mark Complete" button
-> Result: Intake status changes to complete -> Doctor sees it as complete


WHAT ADMIN CAN DO - VOICE AI
----------------------------

View all AI interactions
-> Admin opens Voice AI page -> sees all calls and messages across all patients

Filter by status
-> Admin clicks filter buttons -> In Progress, Needs Attention, Completed

View call transcript
-> Admin clicks on call card -> opens transcript panel
-> Admin reads full conversation between AI and patient

Handle escalated items
-> Admin sees items flagged as "Needs Attention"
-> Reasons can be: patient asked complex question, patient requested human, AI paused interaction
-> Admin clicks Resolve button after handling
-> Result: Item cleared from attention queue

Re-enroll patient in AI sequence
-> Admin clicks Re-enroll button on patient card
-> Result: AI will attempt to contact patient again


WHAT ADMIN CAN DO - SETTINGS
----------------------------

Configure clinic profile
-> Admin opens Settings -> Clinic Profile tab
-> Admin sets clinic name, timezone, working days, hours, slot size
-> Result: Changes apply to entire clinic

Manage users and permissions
-> Admin opens Settings -> Users & Permissions tab
-> Admin can add new admin users, create doctor accounts
-> Admin can disable accounts
-> Result: New users can log in with assigned role

Configure scheduling rules
-> Admin opens Settings -> Scheduling Rules tab
-> Admin sets rules for overlapping, walk-ins, cancellation notice, no-show threshold
-> Result: Rules enforced when creating appointments

Configure intake logic
-> Admin opens Settings -> Intake & Visit Logic tab
-> Admin sets whether intake is required, what happens if missing
-> Result: Affects how appointments are handled

Configure voice AI controls
-> Admin opens Settings -> Voice AI Controls tab
-> Admin enables or disables voice, SMS, email
-> Admin sets max attempts, call window times, retry delay
-> Admin sets escalation triggers
-> Result: Changes how AI contacts patients

Configure notifications
-> Admin opens Settings -> Notifications tab
-> Admin sets what triggers notifications and how they are delivered
-> Result: Changes what alerts admin receives


WHAT ADMIN CANNOT DO
--------------------

Cannot see owner-only business metrics (revenue trends, ROI calculations)
Cannot delete clinic account
Cannot access other clinics
Cannot change their own role to owner
Cannot see data from other clinics


HOW ADMIN ACTIONS AFFECT DOCTORS
--------------------------------

When Admin creates appointment for a doctor
-> Doctor sees new appointment in their Dashboard and Schedule

When Admin confirms an appointment
-> Doctor sees appointment status change to confirmed

When Admin reschedules appointment to different doctor
-> Original doctor no longer sees appointment
-> New doctor sees appointment in their schedule

When Admin cancels appointment
-> Doctor no longer sees appointment
-> If doctor opens patient profile, they see cancellation in history

When Admin sends intake form
-> When patient completes it, AI generates summary
-> Doctor sees intake summary in patient preparation view

When Admin resolves Voice AI escalation
-> Item removed from attention queue
-> Doctor may see outcome in appointment notes


================================================================================
DOCTOR ROLE - Patient Care Focus
================================================================================

The Doctor only sees their own patients and schedule. They focus on care, not operations.


PAGES DOCTOR CAN ACCESS
-----------------------

Dashboard -> Shows only their appointments for today
My Schedule -> Shows only their calendar (single column, expanded view)
Voice AI -> Shows only AI interactions for their patients
Settings -> Shows only their personal preferences


PAGES DOCTOR CANNOT ACCESS
--------------------------

Patients page (full list) -> Doctor cannot see all clinic patients, only their own
Intake Forms page -> Doctor cannot manage form templates
Automation page -> Doctor cannot configure AI rules


WHAT DOCTOR CAN SEE ON DASHBOARD
--------------------------------

Today's appointments filtered to only their patients
-> Doctor opens Dashboard -> sees hero cards with their counts only
-> Total appointments (theirs only)
-> Unconfirmed appointments (theirs only)
-> Missing intake (theirs only)
-> Voice AI alerts (theirs only)

Patient list for the day
-> Doctor sees list of patients they will see today
-> Each card shows patient name, time, visit type, status

Intake summary preview
-> Doctor clicks patient card -> sees AI-generated intake summary
-> Summary shows patient concerns, medications, allergies, key notes
-> This helps doctor prepare before seeing patient


WHAT DOCTOR CAN SEE ON SCHEDULE
-------------------------------

Single-column calendar view
-> Doctor opens My Schedule -> sees expanded single column (not multi-doctor grid)
-> Shows only their appointments
-> Time slots from 9 AM to 5 PM in 15-minute intervals

Appointment details
-> Doctor clicks appointment -> sees patient info, visit type, status
-> Doctor sees if patient has arrived
-> Doctor sees if intake is complete


WHAT DOCTOR CAN DO - APPOINTMENTS
---------------------------------

View their appointments only
-> Doctor sees only appointments where they are the assigned provider
-> Doctor cannot see other doctors' appointments

View patient profile (limited)
-> Doctor clicks patient -> opens profile panel
-> Doctor sees: visits with this doctor only, intake summary, their own notes
-> Doctor does not see: visits with other doctors, clinic-wide history

Add doctor notes
-> Doctor clicks patient -> opens profile panel
-> Doctor clicks Add Note button
-> Doctor types clinical notes
-> Doctor clicks Save
-> Result: Note saved to patient record -> Only this doctor sees their own notes

Set follow-up date
-> Doctor clicks patient -> opens profile panel
-> Doctor clicks Set Follow-up button
-> Doctor selects date and adds optional note
-> Result: Follow-up scheduled -> Admin may see this for scheduling


WHAT DOCTOR CAN DO - VOICE AI
-----------------------------

View AI interactions for their patients only
-> Doctor opens Voice AI page -> sees calls and messages for their patients only
-> Doctor cannot see AI interactions for other doctors' patients

View call transcripts
-> Doctor clicks call card -> reads transcript
-> Helps doctor understand patient concerns before visit

See items needing attention
-> Doctor sees escalated items for their patients
-> Example: Patient asked complex medical question during AI call
-> Doctor can review and prepare response


WHAT DOCTOR CAN DO - SETTINGS
-----------------------------

Configure personal working hours
-> Doctor opens Settings -> can set their own working hours
-> This overrides clinic default for scheduling

Set visit type preferences
-> Doctor can enable or disable virtual visits for themselves
-> Doctor can allow or disallow walk-ins for their schedule

Set Voice AI preferences
-> Doctor can enable or disable AI calls for their patients


WHAT DOCTOR CANNOT DO
---------------------

Cannot create appointments (must ask admin)
Cannot reschedule appointments (must ask admin)
Cannot cancel appointments (must ask admin)
Cannot confirm appointments (admin responsibility)
Cannot view other doctors' schedules
Cannot view other doctors' patients
Cannot access clinic-wide settings
Cannot manage users
Cannot configure intake forms
Cannot configure AI automation rules
Cannot see owner metrics
Cannot access billing or revenue data


HOW ADMIN ACTIONS APPEAR TO DOCTOR
----------------------------------

When Admin creates appointment for this doctor
-> Doctor sees new appointment appear in Dashboard
-> Doctor sees new appointment in My Schedule

When Admin reschedules appointment to another doctor
-> Appointment disappears from this doctor's view
-> Doctor no longer sees this patient for that day

When Admin cancels appointment
-> Appointment disappears from doctor's schedule
-> If doctor checks patient profile later, they see cancellation history

When Admin sends intake form and patient completes it
-> Doctor sees "Intake Complete" status on appointment
-> Doctor can view AI-generated summary

When Admin resolves Voice AI escalation
-> Escalation removed from doctor's Voice AI attention list


================================================================================
OWNER ROLE - Business Oversight Only
================================================================================

The Owner sees business performance metrics only. They do not see individual patient data or manage operations.


PAGES OWNER CAN ACCESS
----------------------

Dashboard -> Shows business metrics and trends (no patient data)
Schedule -> Shows schedule overview (can see appointment counts, not patient names)
Settings -> Shows limited settings (their preferences only)


PAGES OWNER CANNOT ACCESS
-------------------------

Patients page -> Owner cannot see patient list or patient data
Intake Forms page -> Owner cannot manage forms
Automation page -> Owner cannot configure AI
Voice AI page -> Owner cannot see call transcripts or patient messages


WHAT OWNER CAN SEE ON DASHBOARD
-------------------------------

Business metrics overview
-> No-show rate with trend (percentage, not patient names)
-> Appointments recovered by AI (count only)
-> Admin hours saved (time calculation)
-> Confirmation rate (percentage)

Location filtering (if multi-location)
-> Owner can filter metrics by location
-> Example: "Downtown Clinic" vs "Westside Clinic"

Trend charts
-> Visual graphs showing performance over time
-> Week over week comparisons
-> Month over month trends

Insight panels
-> AI-generated insights about clinic performance
-> Example: "No-show rate decreased 58% since enabling Voice AI"
-> Example: "Tuesday afternoons have highest cancellation rate"


WHAT OWNER CAN SEE ON SCHEDULE
------------------------------

Schedule overview only
-> Owner can see that there are appointments on the schedule
-> Owner sees counts (how many appointments per day)
-> Owner cannot see patient names
-> Owner cannot see appointment details


WHAT OWNER CAN DO
-----------------

View business metrics
-> Owner opens Dashboard -> sees all KPI cards
-> Owner can click cards to see detailed breakdowns (still aggregated, no patient data)

Filter by location
-> Owner selects location from dropdown
-> Metrics update to show that location only

Filter by time period
-> Owner selects date range
-> Metrics update to show that period

Export reports (future feature)
-> Owner can download PDF or CSV of metrics
-> Reports contain aggregated data only


WHAT OWNER CANNOT DO
--------------------

Cannot see patient names
Cannot see patient contact information
Cannot see appointment details
Cannot see intake forms or submissions
Cannot see intake summaries
Cannot see AI call transcripts
Cannot see AI message content
Cannot create appointments
Cannot edit appointments
Cannot cancel appointments
Cannot manage doctors
Cannot manage admin users
Cannot configure clinic operations
Cannot configure AI automation


HOW DATA APPEARS TO OWNER VS ADMIN
----------------------------------

Example: No-Show Tracking

What Admin sees:
-> "John Smith - No Show - Jan 3, 2026 - 2:00 PM - Dr. Chen"
-> Full patient name, date, time, doctor, cancellation reason

What Owner sees:
-> "No-Show Rate: 4.2%"
-> "12 no-shows this month"
-> No patient names, no specific dates, no doctor attribution

Example: Voice AI Impact

What Admin sees:
-> "Maria Garcia confirmed via AI call at 9:15 AM"
-> "Call transcript: AI: Hello Maria..."

What Owner sees:
-> "127 appointments recovered by AI this month"
-> "AI confirmation success rate: 78%"
-> No patient names, no transcripts


================================================================================
DATA FLOW SUMMARY
================================================================================

Data Entry Points
-----------------

Marketing Website Signup (automatic)
-> Clinic owner fills signup form on marketing website
-> Data collected: clinic name, owner email, timezone, plan selection
-> System creates: clinic account, owner user account
-> Owner can then log into dashboard

Admin Manual Entry (using +Add buttons in dashboard)
-> Admin clicks +Add Patient -> enters patient data manually
-> Admin clicks +Add Appointment -> selects patient, doctor, time
-> Admin clicks +Add User -> creates doctor or admin accounts
-> This is the primary way data enters the system after initial signup


Permission Boundaries (What Flows Where)
----------------------------------------

Clinic Level Data
-> Flows to: Admin (full), Owner (metrics only), Doctor (none)
-> Example: Total appointment count, cancellation rate

Doctor Level Data
-> Flows to: Admin (full), Doctor (own only), Owner (aggregated)
-> Example: Dr. Chen's appointments, Dr. Chen's patients

Patient Level Data
-> Flows to: Admin (full), Doctor (own patients only), Owner (never)
-> Example: Patient names, contact info, medical notes

AI Interaction Data
-> Flows to: Admin (full), Doctor (own patients only), Owner (metrics only)
-> Example: Call transcripts, message content


Real-Time Updates (WebSocket Events)
------------------------------------

When appointment is created
-> Admin sees: new row in dashboard immediately
-> Doctor sees: new appointment in their schedule immediately (if assigned to them)
-> Owner sees: appointment count updates

When appointment is confirmed
-> Admin sees: status changes to confirmed
-> Doctor sees: status changes to confirmed
-> Owner sees: confirmation rate updates

When AI call happens
-> Admin sees: new call in Voice AI page
-> Doctor sees: call in their Voice AI view (if their patient)
-> Owner sees: AI activity metric updates

When intake is completed
-> Admin sees: intake status changes to complete
-> Doctor sees: intake summary available, status updated
-> Owner sees: intake completion rate updates


================================================================================
QUICK REFERENCE - CAN DO / CANNOT DO
================================================================================

ADMIN CAN:
-> View all appointments
-> Create appointments
-> Edit appointments
-> Reschedule appointments
-> Cancel appointments
-> Confirm appointments
-> View all patients
-> Add patients
-> Edit patients
-> View all intake forms
-> Create intake templates
-> Send intake forms
-> Mark intake complete
-> View all AI interactions
-> Handle AI escalations
-> Configure all settings
-> Manage users

ADMIN CANNOT:
-> See owner business metrics dashboard
-> Delete clinic
-> Access other clinics

-----------------------------------------

DOCTOR CAN:
-> View own appointments only
-> View own patients only
-> View intake summaries for own patients
-> Add doctor notes
-> Set follow-up dates
-> View AI interactions for own patients
-> Configure own preferences

DOCTOR CANNOT:
-> View other doctors' data
-> Create appointments
-> Edit appointments
-> Cancel appointments
-> View all patients
-> Manage intake templates
-> Configure clinic settings
-> Handle AI escalations for other doctors' patients
-> See owner metrics

-----------------------------------------

OWNER CAN:
-> View business metrics
-> View trend charts
-> Filter by location
-> Filter by time period
-> View aggregated performance data

OWNER CANNOT:
-> See patient names
-> See patient data
-> See appointment details
-> See AI transcripts
-> Create anything
-> Edit anything
-> Cancel anything
-> Configure operations
-> Manage users
