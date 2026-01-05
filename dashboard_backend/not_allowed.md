# ClinicFlow MVP - Prohibited Features

**Purpose:** This document lists ALL features that are explicitly PROHIBITED from being built in the MVP phase.

**Status:** ❌ DO NOT BUILD - These features are intentionally deferred

---

## Critical Rule: What NOT to Build

### ❌ Owner Dashboard Backend

**Decision:** Keep hardcoded/mocked in frontend ONLY. No backend work.

**Reason:** 
- Owner analytics require historical data pipelines
- Complex aggregations not needed for pre-seed
- Show structure, not accuracy
- Requires data from multiple clinics over time

**What Frontend Should Do:**
- Display static/hardcoded metrics
- Show UI structure only
- No API calls to backend

**Deferred Until:** Post-funding phase

---

### ❌ Voice AI System

**What's Prohibited:**
- Voice AI calling infrastructure
- Call routing system
- Phone number provisioning
- Call recording storage
- Call transcription processing
- Voice AI conversation logic
- Call logs backend
- Call history storage
- Real-time call status updates

**Reason:**
- High infrastructure costs (Twilio, phone numbers)
- HIPAA compliance complexity
- Call quality monitoring requirements
- Not core to MVP demo
- Can be demonstrated without live calling

**What Frontend Should Do:**
- Display Voice AI page with mock data
- Show call history with hardcoded entries
- Return `voice_ai_alerts: 0` from backend (mocked)
- UI placeholder only

**Backend Should Do:**
- Return `stats.voice_ai_alerts = 0` (always)
- No call log endpoints
- No call routing endpoints
- No transcript storage

**Deferred Until:** Post-funding phase with infrastructure budget

---

### ❌ SMS Automation

**What's Prohibited:**
- SMS sending infrastructure
- Twilio SMS integration
- SMS template management backend
- SMS delivery tracking
- SMS response handling
- Phone number verification
- Opt-in/opt-out management

**Reason:**
- Requires Twilio integration ($$$)
- TCPA compliance requirements
- Phone number validation complexity
- Not needed to prove product value

**What Frontend Should Do:**
- Show SMS settings UI
- Display mock SMS templates
- No actual SMS sending

**Backend Should Do:**
- No SMS endpoints
- No SMS templates CRUD
- No SMS delivery tracking

**Deferred Until:** Post-funding phase

---

### ❌ Email Automation

**What's Prohibited:**
- Email sending service integration
- Email template management backend
- Email delivery tracking
- Email open/click tracking
- Automated email workflows
- Email queue management

**Reason:**
- Not core to MVP demo
- Requires email service integration (SendGrid, etc.)
- Email deliverability management
- Can be added post-launch

**What Frontend Should Do:**
- Show email settings UI (placeholder)
- No actual email sending

**Backend Should Do:**
- No email endpoints
- No email template CRUD
- No email tracking

**Deferred Until:** Post-funding phase

---

### ❌ Automation Rules Engine

**What's Prohibited:**
- Rules engine backend
- Rule creation/editing APIs
- Rule execution engine
- Trigger evaluation system
- Conditional logic processing
- Action execution system
- Rule testing/simulation
- Rule history/audit log

**Reason:**
- Complex business logic not needed for demo
- Requires workflow engine infrastructure
- Can be simulated in frontend for presentation
- Not differentiator for pre-seed

**What Frontend Should Do:**
- Show automation rules UI structure
- Display mock rules
- Allow UI-only rule creation (no persistence)
- Store in localStorage only

**Backend Should Do:**
- No rules CRUD endpoints
- No rule execution engine
- No trigger evaluation

**Deferred Until:** Post-MVP with proper architecture

---

### ❌ Settings Backend APIs

**What's Prohibited:**
- Clinic profile update endpoints
- User management CRUD (create/update/delete users)
- Role/permission management
- Scheduling rules CRUD
- Working hours management
- Visit type preferences backend
- Notification preferences storage
- Integration settings management
- Clinic preferences persistence
- Security settings management
- Audit log system

**Reason:**
- Settings don't affect core demo flow
- UI can store settings locally
- No need for backend persistence in MVP
- Adds complexity without ROI

**What Frontend Should Do:**
- Display all settings pages
- Store settings in localStorage
- Show UI structure
- Settings changes don't persist across sessions

**Backend Should Do:**
- No `PUT /api/clinics/{id}` endpoint
- No user management endpoints (except auth)
- No settings/preferences endpoints

**Deferred Until:** Post-MVP when needed

---

### ❌ Visit Types / Form Templates Backend

**What's Prohibited:**
- Form template CRUD endpoints
- Form builder backend
- Visit type CRUD endpoints
- Template versioning
- Form field management backend
- Form logic/conditionals backend
- Form template publishing workflow

**Reason:**
- Form submissions are backed (sufficient for MVP)
- Template builder is complex
- Static templates work for demo
- Frontend form builder UI sufficient

**What IS Allowed:**
- Intake form submissions: `POST /api/intake/forms` ✅
- View submitted forms: `GET /api/intake/forms` ✅
- AI summary generation ✅

**What Frontend Should Do:**
- Show form builder UI
- Create/edit templates in UI only
- Store templates in localStorage
- Use templates when submitting forms

**Backend Should Do:**
- Accept any JSON in `raw_answers` field
- No template validation
- No template CRUD

**Deferred Until:** Post-MVP

---

### ❌ Owner Analytics Pipeline

**What's Prohibited:**
- Historical data aggregations
- Multi-clinic analytics
- Revenue analytics
- Growth metrics calculations
- Comparative analytics
- Benchmark data collection
- Time-series data storage
- Analytics data warehouse
- Reporting pipeline

**Reason:**
- Requires data over time (not available in MVP)
- Complex aggregations
- Not needed for pre-seed demo
- Owner dashboard is mocked

**What Frontend Should Do:**
- Display hardcoded metrics on owner dashboard
- Show chart placeholders with mock data
- No backend API calls

**Backend Should Do:**
- Nothing - no owner analytics endpoints

**Deferred Until:** Post-funding with real data

---

### ❌ Escalation Logic

**What's Prohibited:**
- Escalation rules engine
- Priority queue management
- Escalation notifications
- Task reassignment logic
- SLA tracking
- Alert escalation chains

**Reason:**
- Depends on Voice AI system (deferred)
- Complex workflow not needed for MVP
- Can be handled manually in demo

**What Frontend Should Do:**
- Show escalation UI placeholder
- No actual escalation processing

**Backend Should Do:**
- No escalation endpoints
- No priority queue

**Deferred Until:** Post-Voice AI implementation

---

### ❌ Advanced Form Builder

**What's Prohibited:**
- Drag-and-drop form builder backend
- Form field types management
- Form validation rules backend
- Conditional field logic backend
- Multi-page forms backend
- Form section management
- Form preview/testing backend
- Form analytics

**Reason:**
- Full form builder is complex
- Static templates sufficient for MVP
- Frontend can handle UI-only builder
- Submissions are backed (sufficient)

**What IS Allowed:**
- Basic intake form submissions ✅
- Fixed form structure ✅

**Deferred Until:** Post-MVP when scale requires it

---

### ❌ Audit Logging System

**What's Prohibited:**
- User action logging
- Data change tracking
- Audit trail storage
- Compliance logging
- Activity history
- Security event logging
- Log querying/search
- Log retention policies

**Reason:**
- Nice-to-have, not MVP requirement
- Adds database overhead
- Not needed for demo
- Compliance not required for pre-seed

**What Frontend Should Do:**
- Nothing - no audit log UI needed

**Backend Should Do:**
- No audit log endpoints
- No activity tracking

**Deferred Until:** Production launch / compliance required

---

### ❌ Multi-Location Support

**What's Prohibited:**
- Multiple clinic locations per clinic
- Location-based scheduling
- Location-specific doctors
- Location-specific patients
- Cross-location transfers
- Location analytics

**Reason:**
- Adds complexity to data model
- Not needed for MVP (single location)
- Target customers are small practices (1-2 locations)
- Can be added as feature later

**What IS Allowed:**
- Single clinic per account ✅
- Clinic has timezone field ✅

**Backend Should Do:**
- One clinic per user
- No location CRUD

**Deferred Until:** Enterprise tier (post-funding)

---

### ❌ Video Visit Integration

**What's Prohibited:**
- Zoom API integration
- Google Meet API integration
- Jitsi integration
- Video call creation
- Video call management
- Calendar invitation generation
- Video link generation via API

**Reason:**
- API integration complexity
- Not core differentiator
- Can store meeting links manually

**What IS Allowed:**
- `meeting_link` field in appointments ✅
- Admin can paste Zoom/Meet link manually ✅

**What Frontend Should Do:**
- Allow admin to paste meeting link
- Display meeting link for virtual appointments
- Click link opens in new tab

**Backend Should Do:**
- Store `meeting_link` string field only
- No video API integration
- No link generation

**Deferred Until:** Post-MVP if customer demand exists

---

### ❌ Real-Time Features (WebSocket/Server-Sent Events)

**What's Prohibited:**
- WebSocket connections
- Server-Sent Events (SSE)
- Real-time data push
- Live updates without refresh
- Presence indicators
- Real-time notifications
- Socket.io or similar

**Reason:**
- Adds infrastructure complexity
- Polling works fine for MVP demo
- Not needed for small clinics
- Can be added later for scale

**What IS Allowed:**
- Manual refresh / re-fetch after mutations ✅
- Polling (if needed) ✅

**What Frontend Should Do:**
- Re-fetch data after mutations
- Show loading states
- Optional: Poll dashboard every 30-60 seconds

**Backend Should Do:**
- Standard HTTP endpoints only
- No WebSocket endpoints

**Deferred Until:** Scale requires it (post-funding)

---

### ❌ Advanced Caching (Redis)

**What's Prohibited:**
- Redis integration
- Cache layer
- Session storage in Redis
- Cache invalidation strategies
- Distributed caching

**Reason:**
- Not needed for MVP scale
- Adds infrastructure dependency
- Database queries fast enough for demo
- Over-engineering for current needs

**What IS Allowed:**
- Database query optimization ✅
- SQLAlchemy query caching (built-in) ✅

**Backend Should Do:**
- Direct database queries
- No Redis

**Deferred Until:** Scale issues arise

---

### ❌ Background Job Processing (Celery)

**What's Prohibited:**
- Celery task queue
- Background job workers
- Asynchronous task processing via Celery
- Periodic tasks (cron jobs)
- Task retry logic
- Job monitoring/queuing

**Reason:**
- AI summary generation is fast enough (blocks for 2-3 seconds - acceptable)
- No heavy background tasks in MVP
- Adds infrastructure complexity
- Not needed for demo

**What IS Allowed:**
- Synchronous API calls ✅
- Fast API responses (< 5 seconds) ✅
- AI summary can block request (acceptable for MVP) ✅

**Backend Should Do:**
- Synchronous processing only
- If AI summary takes too long, return 202 Accepted (not implemented in MVP)

**Deferred Until:** Performance issues arise

---

### ❌ Token Refresh Mechanism

**What's Prohibited:**
- Refresh token system
- Token rotation
- Automatic token refresh
- Refresh token storage
- Refresh token revocation

**Reason:**
- Not needed for MVP
- JWT expiration is 8 hours (sufficient)
- Users can re-login if needed
- Adds complexity without ROI

**What IS Allowed:**
- JWT access tokens (8 hour expiration) ✅
- Manual re-login ✅

**Backend Should Do:**
- Single JWT token on login
- No refresh token endpoint

**Deferred Until:** Production launch

---

### ❌ Advanced Search/Filtering

**What's Prohibited:**
- Full-text search (Elasticsearch)
- Advanced query builder
- Fuzzy search
- Search suggestions/autocomplete backend
- Search analytics
- Search result ranking

**Reason:**
- Client-side filtering sufficient for MVP
- Database queries fast enough
- Small data volume (< 1000 patients per clinic)
- Elasticsearch overkill

**What IS Allowed:**
- Simple database queries with filters ✅
- Client-side filtering (JavaScript) ✅

**Backend CAN Add (Optional, Low Priority):**
- `?search=` query parameter for simple LIKE queries
- Basic filtering by date ranges

**Deferred Until:** Scale requires it

---

### ❌ File Upload/Storage System

**What's Prohibited:**
- Document upload (insurance cards, ID)
- Image upload (profile pictures)
- File storage (S3, GCS)
- File management backend
- File access control
- File versioning

**Reason:**
- Not needed for MVP demo
- Adds storage infrastructure
- Not core to scheduling/intake flow
- Can be added later

**What IS Allowed:**
- Storing data as text/JSON ✅

**Backend Should Do:**
- No file upload endpoints
- No file storage

**Deferred Until:** Customer demand / compliance requires it

---

### ❌ Payment Processing

**What's Prohibited:**
- Stripe integration
- Payment collection
- Billing management
- Subscription management
- Invoice generation
- Payment history

**Reason:**
- No monetization in pre-seed MVP
- Not needed for product demo
- Can be added when launching

**Deferred Until:** Launch / monetization required

---

### ❌ Multi-Factor Authentication (MFA)

**What's Prohibited:**
- MFA setup
- TOTP generation
- SMS-based 2FA
- Authenticator app support
- Backup codes

**Reason:**
- Not required for pre-seed demo
- Security nice-to-have, not must-have
- Can be added for production

**What IS Allowed:**
- Password-based login ✅
- Google OAuth ✅

**Deferred Until:** Production launch / compliance required

---

## Summary of Prohibited Features

### Infrastructure/Technical
- ❌ Redis caching
- ❌ Celery background jobs
- ❌ WebSockets / SSE
- ❌ Elasticsearch
- ❌ File storage (S3/GCS)
- ❌ Multi-region deployment
- ❌ Load balancing

### Communication Systems
- ❌ Voice AI calling
- ❌ SMS automation (Twilio)
- ❌ Email automation (SendGrid)
- ❌ Push notifications
- ❌ In-app messaging

### Advanced Features
- ❌ Automation rules engine
- ❌ Form builder backend
- ❌ Owner analytics pipeline
- ❌ Multi-location support
- ❌ Video call integration APIs
- ❌ Audit logging system
- ❌ Advanced search (Elasticsearch)

### Settings/Configuration
- ❌ Settings backend persistence
- ❌ User management CRUD
- ❌ Visit type CRUD
- ❌ Form template CRUD
- ❌ Notification preferences backend
- ❌ Integration management

### Security/Compliance
- ❌ MFA/2FA
- ❌ Audit logs
- ❌ Token refresh
- ❌ Advanced access control
- ❌ HIPAA compliance infrastructure

### Business Logic
- ❌ Owner dashboard backend
- ❌ Escalation logic
- ❌ SLA tracking
- ❌ Payment processing
- ❌ Billing/subscriptions

---

## What TO Build (Allowed Features)

For clarity, here's what IS allowed and MUST be built:

### ✅ Core Features (REQUIRED)
1. **Authentication**
   - JWT login
   - Google OAuth
   - Role-based access (admin/doctor/owner)

2. **Core CRUD**
   - Clinics (read only)
   - Doctors CRUD
   - Patients CRUD
   - Appointments CRUD

3. **Scheduling**
   - Day schedule view
   - Available slots
   - Slot validation
   - Appointment status management

4. **Intake System**
   - Intake form submissions
   - AI summary generation (OpenAI)
   - View submitted forms

5. **Dashboards**
   - Admin dashboard API
   - Doctor dashboard API
   - Statistics aggregation

6. **Status Management**
   - Appointment confirm/cancel/arrive
   - Intake completion tracking
   - Cancellation records

### ✅ UI-Only (Frontend Mock)
- Owner dashboard (hardcoded metrics)
- Voice AI page (mock data)
- Automation settings (localStorage)
- Settings pages (localStorage)
- Form builder (localStorage)

---

## Decision Framework

**When in doubt, ask:**

1. **Is it needed to PROVE the product works?**
   - No → Don't build it

2. **Can the frontend fake it with mock data?**
   - Yes → Don't build backend

3. **Does it require external service integration?**
   - Yes → Probably defer it

4. **Is it a "nice-to-have" vs "must-have"?**
   - Nice-to-have → Defer it

5. **Does it block the demo flow?**
   - No → Defer it

6. **Will it take more than 2 days to build?**
   - Yes → Probably out of scope

---

## Consequences of Building Prohibited Features

**If you build features from this list:**
- ❌ Wastes time on non-essential features
- ❌ Delays MVP completion
- ❌ Adds complexity and maintenance burden
- ❌ Increases infrastructure costs
- ❌ Creates technical debt
- ❌ Distracts from core value proposition
- ❌ May not be used in production (wasted effort)

---

## How to Handle Requests for Prohibited Features

**If someone asks for a prohibited feature:**

1. **Confirm it's prohibited** - Check this document
2. **Explain the reason** - Reference the "Reason" section
3. **Propose alternative** - Suggest frontend mock or workaround
4. **Add to post-MVP backlog** - Document for future consideration
5. **Stay focused** - Keep working on allowed features

---

**Last Updated:** January 5, 2026  
**Document Version:** 1.0  
**Status:** Final - Do Not Build Listed Features
