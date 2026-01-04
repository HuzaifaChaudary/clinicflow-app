import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SettingsSidebar, SettingsTab } from '../components/settings/SettingsSidebar';
import { ClinicProfileTab } from '../components/settings/tabs/ClinicProfileTab';
import { UsersPermissionsTab } from '../components/settings/tabs/UsersPermissionsTab';
import { SchedulingRulesTab } from '../components/settings/tabs/SchedulingRulesTab';
import { IntakeLogicTab } from '../components/settings/tabs/IntakeLogicTab';
import { VoiceAITab } from '../components/settings/tabs/VoiceAITab';
import { NotificationsTab } from '../components/settings/tabs/NotificationsTab';
import { DataPreferencesTab } from '../components/settings/tabs/DataPreferencesTab';
import { SecurityAuditTab } from '../components/settings/tabs/SecurityAuditTab';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('clinic-profile');
  const [showUpdatedToast, setShowUpdatedToast] = useState(false);

  // Show "Updated" toast briefly when tab changes (simulates save)
  useEffect(() => {
    setShowUpdatedToast(true);
    const timer = setTimeout(() => setShowUpdatedToast(false), 2000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clinic-profile':
        return <ClinicProfileTab />;
      case 'users':
        return <UsersPermissionsTab />;
      case 'scheduling':
        return <SchedulingRulesTab />;
      case 'intake':
        return <IntakeLogicTab />;
      case 'voice-ai':
        return <VoiceAITab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'data':
        return <DataPreferencesTab />;
      case 'security':
        return <SecurityAuditTab />;
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    const titles: Record<SettingsTab, string> = {
      'clinic-profile': 'Clinic Profile',
      users: 'Users & Permissions',
      scheduling: 'Scheduling Rules',
      intake: 'Intake & Visit Logic',
      'voice-ai': 'Voice AI Controls',
      notifications: 'Notifications & Alerts',
      data: 'Data, Sync & Preferences',
      security: 'Security & Audit',
    };
    return titles[activeTab];
  };

  const getTabDescription = () => {
    const descriptions: Record<SettingsTab, string> = {
      'clinic-profile': 'Defines operational boundaries for the entire system',
      users: 'Control who can act, override, or intervene',
      scheduling: 'Define booking logic and cancellation rules',
      intake: 'Control intake enforcement and visit types',
      'voice-ai': 'Define automation boundaries and escalation rules',
      notifications: 'Control how humans are informed',
      data: 'Operational preferences and display formats',
      security: 'Visibility, traceability, and access control',
    };
    return descriptions[activeTab];
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Internal Left Rail */}
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Tab Header */}
          <div className="mb-8">
            <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>
              {getTabTitle()}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {getTabDescription()}
            </p>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>

      {/* Updated Toast */}
      {showUpdatedToast && (
        <div
          className="fixed bottom-8 right-8 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in"
          style={{
            backgroundColor: 'var(--status-success)',
            color: 'white',
          }}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Settings updated</span>
        </div>
      )}
    </div>
  );
}