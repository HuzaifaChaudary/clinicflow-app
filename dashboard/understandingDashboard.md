# Frontend Architecture Understanding

## Overview

**ClinicFlow** is a comprehensive medical clinic management dashboard built with **React + TypeScript** and **Vite**. Originally designed in Figma, this admin dashboard provides a complete system for managing appointments, patients, voice AI automation, and clinic operations across multiple user roles.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + Custom CSS Variables (theme tokens) |
| **UI Components** | Radix UI Primitives + Custom Components |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Drag & Drop** | react-dnd |
| **Date Handling** | date-fns, react-day-picker |
| **Animations** | Motion (Framer Motion) |
| **Toasts** | Sonner |

---

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── styles/
│   ├── index.css              # Style imports
│   ├── tailwind.css           # Tailwind base
│   ├── theme.css              # Design token system
│   └── fonts.css              # Typography
└── app/
    ├── App.tsx                # Root component with routing
    ├── context/               # React Context providers
    ├── hooks/                 # Custom hooks
    ├── types/                 # TypeScript definitions
    ├── data/                  # Mock data
    ├── utils/                 # Utility functions
    ├── pages/                 # Page-level components
    └── components/            # Reusable components
```

---

## Design System

### Theme Architecture

The app uses a sophisticated **CSS variable-based design token system** defined in [theme.css](src/styles/theme.css):

#### Color Tokens
- **Neutrals**: `--cf-neutral-00` to `--cf-neutral-90` (light mode base)
- **Brand Accent**: Blue-grey palette (`--cf-blue-40`, `--cf-blue-60`, `--cf-blue-80`)
- **Status Colors**: Success, Warning, Info, Error with background variants

#### Semantic Tokens
```css
--surface-primary     /* Main background */
--surface-canvas      /* Page background */
--surface-card        /* Card backgrounds */
--text-primary        /* Primary text */
--text-secondary      /* Secondary text */
--accent-primary      /* Interactive elements */
--status-success/warning/info/error
```

#### Dark Mode Support
Full dark mode support via `[data-theme="dark"]` selector with inverted token values.

#### Design Constants
- **Border Radius**: `--radius-sm: 14px`, `--radius-md: 18px`, `--radius-lg: 22px`
- **Motion**: `--motion-hover: 150ms`, `--motion-state: 200ms`
- **Glass Effect**: iOS-style blur with `--glass-bg`, `--glass-blur`

---

## Application Architecture

### Entry Point Flow

```
main.tsx → App.tsx → RoleProvider → SettingsProvider → AppContent
```

### Context Providers

#### 1. RoleContext ([RoleContext.tsx](src/app/context/RoleContext.tsx))
Manages user role switching and doctor identity:
- **Roles**: `admin` | `doctor` | `owner`
- Persists role selection to localStorage
- Tracks `activeDoctorId` for doctor role

#### 2. SettingsContext ([SettingsContext.tsx](src/app/context/SettingsContext.tsx))
Comprehensive settings management:
- Clinic profile (name, timezone, hours)
- User management
- Scheduling rules
- Intake logic
- Voice AI controls
- Notification preferences
- Security settings

### State Management

Primary appointment state is managed in [useAppointmentState.ts](src/app/hooks/useAppointmentState.ts):

```typescript
const {
  appointments,           // Active appointments
  cancelledAppointments,  // Cancelled history
  updateAppointment,      // Update single appointment
  rescheduleAppointment,  // Reschedule with new time/provider
  cancelAppointment,      // Cancel with reason
  addPatientFromFlow,     // Add new patient
} = useAppointmentState();
```

---

## Role-Based Architecture

### Navigation by Role

| Role | Pages Available |
|------|-----------------|
| **Admin** | Dashboard, Schedule, Patients, Intake Forms, Automation, Voice AI, Settings |
| **Doctor** | Dashboard, My Schedule, Voice AI, Settings |
| **Owner** | Dashboard, Schedule, Settings |

### Data Filtering
- **Admin/Owner**: Full access to all appointments
- **Doctor**: Filtered by `provider` name and `selectedDate`

---

## Core Data Types

### Appointment ([appointment.ts](src/app/types/appointment.ts))

```typescript
interface Appointment {
  id: string;
  time: string;
  duration?: number;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  provider: string;
  visitType: 'in-clinic' | 'virtual';
  visitCategory?: 'new-patient' | 'follow-up';
  status: {
    confirmed: boolean;
    intakeComplete: boolean;
    paid: boolean;
  };
  indicators: {
    voiceCallSent: boolean;
    rescheduled: boolean;
  };
  arrived: boolean;
  needsAttention?: boolean;
  voiceCallAttempts?: VoiceCallAttempt[];
  messages?: Message[];
  intakeSummary?: IntakeSummary;
  doctorNotes?: DoctorNote[];
}
```

### Doctor
```typescript
interface Doctor {
  id: string;
  name: string;
  initials: string;
  specialty?: string;
  color?: string;
}
```

---

## Page Components

### Admin Dashboard ([ConnectedAdminDashboard.tsx](src/app/pages/ConnectedAdminDashboard.tsx))
- **Hero Cards**: Total, Confirmed, Unconfirmed, Missing Intake, Voice Calls
- **Today's Schedule Section**: Real-time appointment list
- **Needs Attention Section**: Unconfirmed + missing intake items
- Filter-based navigation between sections

### Doctor Dashboard ([DoctorDashboard.tsx](src/app/pages/DoctorDashboard.tsx))
- Filtered view for single doctor
- Hero cards: Appointments, Unconfirmed, Missing Intake, Voice Alerts
- Quick patient selection panel

### Owner Dashboard ([OwnerDashboardPage.tsx](src/app/pages/OwnerDashboardPage.tsx))
- Business intelligence metrics
- No-show rate tracking
- AI recovery statistics
- Admin hours saved
- Location-based filtering
- Insight panels with trends

### Schedule Page ([EnhancedSchedulePage.tsx](src/app/pages/EnhancedSchedulePage.tsx))
- Multi-doctor column grid view
- 15-minute time slot intervals (9 AM - 5 PM)
- Drag-and-drop support
- Patient profile modal integration

### Voice AI Page ([VoiceAIPageEnhanced.tsx](src/app/pages/VoiceAIPageEnhanced.tsx))
- Voice call tracking and history
- Message queue management
- Real-time call status
- Transcript viewing
- Needs attention filtering

### Patients Page ([PatientsPageFinalized.tsx](src/app/pages/PatientsPageFinalized.tsx))
- Patient listing with search
- Time-based filtering (7/14/30 days)
- Attention filter (needs confirmation/intake)
- Add patient flow

### Settings Page ([SettingsPage.tsx](src/app/pages/SettingsPage.tsx))
8 configuration tabs:
1. Clinic Profile
2. Users & Permissions
3. Scheduling Rules
4. Intake & Visit Logic
5. Voice AI Controls
6. Notifications & Alerts
7. Data, Sync & Preferences
8. Security & Audit

---

## Component Organization

### UI Components ([/components/ui/](src/app/components/ui/))
Radix UI-based primitives with custom styling:
- `button.tsx` - Variant-based button system
- `card.tsx` - Card containers
- `dialog.tsx`, `drawer.tsx` - Modals
- `tabs.tsx` - Tab navigation
- `calendar.tsx` - Date picker
- `table.tsx` - Data tables
- 40+ UI primitives

### Feature Components

#### Navigation
- `CollapsibleSidebar.tsx` - Main sidebar with collapse/expand
- `ProfileSwitcher.tsx` - Role/doctor switching

#### Dashboard
- `HeroCard.tsx` - Metric cards
- `TodaysScheduleSection.tsx` - Schedule list
- `NeedsAttentionSection.tsx` - Attention items

#### Schedule
- `ScheduleDayGrid.tsx` - Day view grid
- `DoctorColumn.tsx` - Per-doctor column
- `ScheduleAppointmentCard.tsx` - Appointment cards

#### Voice AI
- `EnhancedVoiceCallCard.tsx` - Call history cards
- `TranscriptPanel.tsx` - Call transcripts
- `LiveCallIndicator.tsx` - Real-time status

#### Patient Management
- `PatientProfileModal.tsx` - Patient detail view
- `GlobalPatientProfile.tsx` - Universal patient card
- `PatientTableRow.tsx` - Table row component

#### Add Patient Flow
Multi-step wizard ([/add-patient-flow/](src/app/components/add-patient-flow/)):
1. Visit Type Selection
2. Provider & Scheduling
3. Patient Information
4. Intake Path Decision
5. Visit Reason Selection
6. Intake Form Selection
7. Completion Screen

#### Modals
- `RescheduleModal.tsx` - Appointment rescheduling
- `CancelAppointmentModal.tsx` - Cancellation flow

---

## Mock Data ([enhancedMockData.ts](src/app/data/enhancedMockData.ts))

### Doctors
5 mock doctors with specialties:
- Dr. Sarah Chen (Family Medicine)
- Dr. Michael Park (Internal Medicine)
- Dr. Jennifer Williams (Pediatrics)
- Dr. David Rodriguez (Cardiology)
- Dr. Emily Thompson (Dermatology)

### Appointments
Full-featured mock appointments including:
- Voice call attempts with transcripts
- SMS/email message history
- Cancellation history
- Intake summaries
- Doctor notes

---

## Key Design Patterns

### 1. Prop Drilling with Callbacks
Actions flow down via props from App.tsx:
```typescript
<EnhancedSchedulePage
  appointments={appointments}
  onUpdateAppointment={updateAppointment}
  onReschedule={rescheduleAppointment}
  onCancel={cancelAppointment}
/>
```

### 2. Controlled Filtering
Hero cards control filters that propagate to lists:
```typescript
const [activeFilter, setActiveFilter] = useState<FilterType>('all');
// Click hero card → updates filter → re-renders schedule/attention sections
```

### 3. Role-Based Rendering
Dynamic navigation and page rendering based on role:
```typescript
if (role === 'doctor') {
  return <DoctorDashboard ... />;
}
```

### 4. CSS Variables for Theming
Consistent use of theme tokens:
```jsx
<div style={{ 
  backgroundColor: 'var(--surface-card)',
  color: 'var(--text-primary)' 
}}>
```

### 5. Memoized Computations
Heavy use of `useMemo` for derived data:
```typescript
const stats = useMemo(() => ({
  total: appointments.length,
  confirmed: appointments.filter(a => a.status.confirmed).length,
  ...
}), [appointments]);
```

---

## Key Features Summary

| Feature | Description |
|---------|-------------|
| **Multi-Role System** | Admin, Doctor, Owner with distinct views |
| **Appointment Management** | Full CRUD with status tracking |
| **Voice AI Integration** | Call tracking, transcripts, attention flags |
| **Patient Intake** | Form management and completion tracking |
| **Scheduling** | Multi-doctor grid view with drag support |
| **Settings** | Comprehensive configuration system |
| **Dark Mode** | Full theme support |
| **Responsive** | Mobile hamburger menu |
| **Analytics** | Owner dashboard with business metrics |

---

## Running the Application

```bash
npm install    # Install dependencies
npm run dev    # Start development server
npm run build  # Production build
```

---

## Files of Interest

| File | Purpose |
|------|---------|
| [App.tsx](src/app/App.tsx) | Main routing and role logic |
| [useAppointmentState.ts](src/app/hooks/useAppointmentState.ts) | Core state management |
| [RoleContext.tsx](src/app/context/RoleContext.tsx) | Role switching |
| [SettingsContext.tsx](src/app/context/SettingsContext.tsx) | Settings state |
| [appointment.ts](src/app/types/appointment.ts) | Core type definitions |
| [theme.css](src/styles/theme.css) | Design token system |
| [enhancedMockData.ts](src/app/data/enhancedMockData.ts) | Sample data |
