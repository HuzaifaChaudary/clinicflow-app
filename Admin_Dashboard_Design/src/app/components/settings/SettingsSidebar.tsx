import { Building2, Users, Calendar, FileText, Phone, Bell, Database, Shield } from 'lucide-react';

export type SettingsTab =
  | 'clinic-profile'
  | 'users'
  | 'scheduling'
  | 'intake'
  | 'voice-ai'
  | 'notifications'
  | 'data'
  | 'security';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs: { id: SettingsTab; icon: typeof Building2; label: string; tooltip?: string }[] = [
  { id: 'clinic-profile', icon: Building2, label: 'Clinic Profile' },
  { id: 'users', icon: Users, label: 'Users & Permissions' },
  { id: 'scheduling', icon: Calendar, label: 'Scheduling Rules' },
  { id: 'intake', icon: FileText, label: 'Intake & Visit Logic' },
  { id: 'voice-ai', icon: Phone, label: 'Ava & Voice Agents', tooltip: 'Configure Ava and other clinic-specific voice agents.' },
  { id: 'notifications', icon: Bell, label: 'Notifications & Alerts' },
  { id: 'data', icon: Database, label: 'Data, Sync & Preferences' },
  { id: 'security', icon: Shield, label: 'Security & Audit' },
];

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div
      className="w-64 border-r h-full overflow-y-auto"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Control plane
        </p>
      </div>

      <nav className="p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="w-full px-3 py-2.5 rounded-lg flex items-center gap-3 mb-1 text-left transition-all"
              style={{
                backgroundColor: isActive ? 'var(--accent-primary-bg)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}