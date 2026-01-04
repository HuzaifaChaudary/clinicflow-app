import { useState, useEffect } from 'react';
import { Calendar, FileText, Users, Settings, LayoutDashboard, Bell, Phone } from 'lucide-react';
import { CollapsibleSidebar } from './components/navigation/CollapsibleSidebar';
import { ConnectedAdminDashboard } from './pages/ConnectedAdminDashboard';
import { EnhancedSchedulePage } from './pages/EnhancedSchedulePage';
import { VoiceAIPageEnhanced } from './pages/VoiceAIPageEnhanced';
import { PatientsPageFinalized } from './pages/PatientsPageFinalized';
import { IntakeFormsPageComplete } from './pages/IntakeFormsPageComplete';
import { IntakeAutomationPageEnhanced } from './pages/IntakeAutomationPageEnhanced';
import { SettingsPage } from './pages/SettingsPage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { DoctorVoiceAI } from './pages/DoctorVoiceAI';
import { DoctorSettings } from './pages/DoctorSettings';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { OwnerSettings } from './pages/OwnerSettings';
import { useAppointmentState } from './hooks/useAppointmentState';
import { SettingsProvider } from './context/SettingsContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { PatientFlowData } from './components/add-patient-flow/ScalableAddPatientFlow';
import { Appointment } from './types/appointment';
import { getDoctorNeedsAttentionCount } from './utils/roleFilters';
import { mockDoctors } from './data/enhancedMockData';

type Page = 'dashboard' | 'schedule' | 'patients' | 'intake-forms' | 'automation' | 'voice-ai' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { role, activeDoctorId } = useRole();
  
  // 🎯 DOCTOR DATE CONTEXT - Single source of truth for doctor appointments
  const [doctorSelectedDate, setDoctorSelectedDate] = useState('2026-01-01'); // Today's date in the system

  const {
    appointments,
    updateAppointment,
    rescheduleAppointment,
    cancelAppointment,
    addPatientFromFlow,
    cancelledAppointments,
  } = useAppointmentState();

  // Get current doctor info for filtering
  const currentDoctor = activeDoctorId 
    ? mockDoctors.find(d => d.id === activeDoctorId)
    : null;

  // 🎯 DOCTOR APPOINTMENTS DATASET - Single source of truth
  // This filters by BOTH doctor AND selected date for Doctor role
  // For Doctor role: filter by doctor name AND date
  // For other roles: use all appointments
  const filteredAppointments = role === 'doctor' && currentDoctor
    ? appointments.filter(apt => 
        apt.provider === currentDoctor.name && 
        apt.date === doctorSelectedDate &&
        !apt.cancelled
      )
    : appointments;

  const filteredCancelledAppointments = role === 'doctor' && currentDoctor
    ? cancelledAppointments.filter(apt => 
        apt.provider === currentDoctor.name &&
        apt.date === doctorSelectedDate
      )
    : cancelledAppointments;
  
  // 🎯 STATE RESET - Clear data when role/doctor/date changes
  useEffect(() => {
    // Reset to default date when switching roles or changing doctor
    if (role === 'doctor') {
      // Keep current date
    } else {
      // Reset date when leaving doctor role
      setDoctorSelectedDate('2026-01-01');
    }
  }, [role, activeDoctorId]);

  // Role-based navigation items
  const getNavigationItems = () => {
    if (role === 'doctor') {
      return [
        {
          id: 'dashboard' as Page,
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'schedule' as Page,
          label: 'My Schedule',
          icon: Calendar,
        },
        {
          id: 'voice-ai' as Page,
          label: 'Voice AI',
          icon: Phone,
          badge: getDoctorNeedsAttentionCount(appointments, currentDoctor?.name || ''),
        },
        {
          id: 'settings' as Page,
          label: 'Settings',
          icon: Settings,
        },
      ];
    }

    if (role === 'owner') {
      return [
        {
          id: 'dashboard' as Page,
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'schedule' as Page,
          label: 'Schedule',
          icon: Calendar,
        },
        {
          id: 'settings' as Page,
          label: 'Settings',
          icon: Settings,
        },
      ];
    }

    // Admin navigation (default)
    // 🔒 DESIGN RULE: Sidebar labels must be static text only.
    // Counts/badges are NOT allowed in navigation labels.
    // Counts belong in: Dashboard cards, notification badges, inline section headers.
    return [
      {
        id: 'dashboard' as Page,
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
      {
        id: 'schedule' as Page,
        label: 'Schedule',
        icon: Calendar,
      },
      {
        id: 'patients' as Page,
        label: 'Patients',
        icon: Users,
      },
      {
        id: 'intake-forms' as Page,
        label: 'Intake Forms',
        icon: FileText,
      },
      {
        id: 'automation' as Page,
        label: 'Automation',
        icon: Bell,
      },
      {
        id: 'voice-ai' as Page,
        label: 'Voice AI',
        icon: Phone,
      },
      {
        id: 'settings' as Page,
        label: 'Settings',
        icon: Settings,
      },
    ];
  };

  const renderPage = () => {
    if (role === 'doctor') {
      switch (currentPage) {
        case 'dashboard':
          return (
            <DoctorDashboard
              appointments={filteredAppointments}
              onNavigateToSchedule={() => setCurrentPage('schedule')}
              doctorId={currentDoctor?.name || ''}
            />
          );
        case 'schedule':
          return (
            <EnhancedSchedulePage
              appointments={filteredAppointments}
              onUpdateAppointment={updateAppointment}
              onReschedule={rescheduleAppointment}
              onCancel={cancelAppointment}
              onAddPatient={addPatientFromFlow}
            />
          );
        case 'voice-ai':
          return (
            <DoctorVoiceAI
              appointments={filteredAppointments}
            />
          );
        case 'settings':
          return <DoctorSettings />;
        default:
          return (
            <DoctorDashboard
              appointments={filteredAppointments}
              onNavigateToSchedule={() => setCurrentPage('schedule')}
              doctorId={currentDoctor?.name || ''}
            />
          );
      }
    }

    if (role === 'owner') {
      switch (currentPage) {
        case 'dashboard':
          return (
            <OwnerDashboardPage
              appointments={appointments}
              cancelledAppointments={cancelledAppointments}
              onNavigateToSchedule={() => setCurrentPage('schedule')}
              onUpdateAppointment={updateAppointment}
              onReschedule={rescheduleAppointment}
              onCancel={cancelAppointment}
            />
          );
        case 'schedule':
          return (
            <EnhancedSchedulePage
              appointments={appointments}
              onUpdateAppointment={updateAppointment}
              onReschedule={rescheduleAppointment}
              onCancel={cancelAppointment}
              onAddPatient={addPatientFromFlow}
            />
          );
        case 'settings':
          return <OwnerSettings />;
        default:
          return (
            <OwnerDashboardPage
              appointments={appointments}
              cancelledAppointments={cancelledAppointments}
              onNavigateToSchedule={() => setCurrentPage('schedule')}
              onUpdateAppointment={updateAppointment}
              onReschedule={rescheduleAppointment}
              onCancel={cancelAppointment}
            />
          );
      }
    }

    // Admin pages (default)
    switch (currentPage) {
      case 'dashboard':
        return (
          <ConnectedAdminDashboard
            appointments={appointments}
            onNavigateToSchedule={() => setCurrentPage('schedule')}
            onNavigateToVoiceAI={() => setCurrentPage('voice-ai')}
          />
        );
      case 'schedule':
        return (
          <EnhancedSchedulePage
            appointments={appointments}
            onUpdateAppointment={updateAppointment}
            onReschedule={rescheduleAppointment}
            onCancel={cancelAppointment}
            onAddPatient={addPatientFromFlow}
          />
        );
      case 'patients':
        return <PatientsPageFinalized appointments={appointments} />;
      case 'intake-forms':
        return <IntakeFormsPageComplete />;
      case 'automation':
        return (
          <IntakeAutomationPageEnhanced
            appointments={appointments}
            onUpdateAppointment={updateAppointment}
          />
        );
      case 'voice-ai':
        return (
          <VoiceAIPageEnhanced
            appointments={appointments}
            onUpdateAppointment={updateAppointment}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <ConnectedAdminDashboard
            appointments={appointments}
            onNavigateToSchedule={() => setCurrentPage('schedule')}
            onNavigateToVoiceAI={() => setCurrentPage('voice-ai')}
          />
        );
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <CollapsibleSidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        navigationItems={getNavigationItems()}
      />
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </RoleProvider>
  );
}