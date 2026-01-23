import { useState } from 'react';
import { Calendar, FileText, Users, Settings, LayoutDashboard, Bell, Phone } from 'lucide-react';
import { CollapsibleSidebar } from './components/navigation/CollapsibleSidebar';
import { ConnectedAdminDashboardPage } from './pages/ConnectedAdminDashboardPage';
import { ConnectedSchedulePage } from './pages/ConnectedSchedulePage';
import { ConnectedVoiceAIPage } from './pages/ConnectedVoiceAIPage';
import { ConnectedPatientsPage } from './pages/ConnectedPatientsPage';
import { IntakeFormsPageComplete } from './pages/IntakeFormsPageComplete';
import { IntakeAutomationPageEnhanced } from './pages/IntakeAutomationPageEnhanced';
import { ConnectedSettingsPage } from './pages/ConnectedSettingsPage';
import { ConnectedDoctorDashboardPage } from './pages/ConnectedDoctorDashboardPage';
import { ConnectedOwnerDashboard } from './pages/ConnectedOwnerDashboard';
import { SettingsProvider } from './context/SettingsContext';
import { RoleProvider, useRole } from './context/RoleContext';

type Page = 'dashboard' | 'schedule' | 'patients' | 'intake-forms' | 'automation' | 'voice-ai' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { role } = useRole();

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
          return <ConnectedDoctorDashboardPage />;
        case 'schedule':
          return <ConnectedSchedulePage />;
        case 'voice-ai':
          return <ConnectedVoiceAIPage />;
        case 'settings':
          return <ConnectedSettingsPage />;
        default:
          return <ConnectedDoctorDashboardPage />;
      }
    }

    if (role === 'owner') {
      switch (currentPage) {
        case 'dashboard':
          return <ConnectedOwnerDashboard />;
        case 'schedule':
          return <ConnectedSchedulePage />;
        case 'settings':
          return <ConnectedSettingsPage />;
        default:
          return <ConnectedOwnerDashboard />;
      }
    }

    // Admin pages (default)
    switch (currentPage) {
      case 'dashboard':
        return <ConnectedAdminDashboardPage />;
      case 'schedule':
        return <ConnectedSchedulePage />;
      case 'patients':
        return <ConnectedPatientsPage />;
      case 'intake-forms':
        return <IntakeFormsPageComplete />;
      case 'automation':
        return <IntakeAutomationPageEnhanced onBack={() => setCurrentPage('dashboard')} />;
      case 'voice-ai':
        return <ConnectedVoiceAIPage />;
      case 'settings':
        return <ConnectedSettingsPage />;
      default:
        return <ConnectedAdminDashboardPage />;
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