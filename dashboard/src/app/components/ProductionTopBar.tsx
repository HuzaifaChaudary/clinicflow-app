import { Bell } from 'lucide-react';
import { ProfileMenu } from './ProfileMenu';

interface Notification {
  id: string;
  type: 'voice' | 'confirmation' | 'reschedule';
  message: string;
  time: string;
}

interface ProductionTopBarProps {
  clinicName: string;
  date: string;
  notifications?: Notification[];
  userName?: string;
  onNavigateSettings?: () => void;
}

export function ProductionTopBar({
  clinicName,
  date,
  notifications = [],
  userName = 'Admin',
  onNavigateSettings,
}: ProductionTopBarProps) {
  const unreadCount = notifications.length;

  return (
    <header 
      className="glass border-b px-4 sm:px-6 py-3.5 sticky top-0 z-30"
      style={{
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <span style={{ color: 'var(--text-inverse)' }} className="font-semibold">C</span>
          </div>
          <span style={{ color: 'var(--text-primary)' }} className="font-medium hidden sm:inline">
            Clinicflow
          </span>
        </div>

        {/* Center: Date + Clinic */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Today</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {date.split(',')[0]}
            </div>
          </div>
          <div 
            className="hidden sm:block h-8 w-px"
            style={{ backgroundColor: 'var(--border-default)' }}
          />
          <div className="hidden md:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {clinicName}
          </div>
        </div>

        {/* Right: Notifications + Profile with Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button 
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span 
                className="absolute top-1 right-1 w-2 h-2 rounded-full ring-2"
                style={{ 
                  backgroundColor: 'var(--accent-primary)',
                  ringColor: 'var(--surface-card)',
                }}
              />
            )}
          </button>

          {/* Profile Menu with Role Switcher */}
          <ProfileMenu userName={userName} onNavigateSettings={onNavigateSettings} />
        </div>
      </div>
    </header>
  );
}