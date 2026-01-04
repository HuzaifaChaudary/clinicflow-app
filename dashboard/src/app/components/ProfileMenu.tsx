import { useState, useRef, useEffect } from 'react';
import { User, Moon, Sun, Settings as SettingsIcon, LogOut, UserCog, Stethoscope, Building2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRole } from '../context/RoleContext';

interface ProfileMenuProps {
  userName: string;
  onNavigateSettings?: () => void;
}

export function ProfileMenu({ userName, onNavigateSettings }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useRole();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchRole = (newRole: 'admin' | 'doctor' | 'owner') => {
    setRole(newRole);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-primary-bg)' }}
        >
          <User className="w-4 h-4" style={{ color: 'var(--accent-primary-text)' }} />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {userName}
          </div>
          <div className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
            {role}
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border py-2 z-50 animate-fade-in"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          {/* Role Switcher */}
          <div 
            className="px-3 py-2 border-b"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              Switch Role
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleSwitchRole('admin')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                  role === 'admin' ? '' : ''
                }`}
                style={{
                  backgroundColor: role === 'admin' ? 'var(--accent-primary-bg)' : 'transparent',
                  color: role === 'admin' ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (role !== 'admin') {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (role !== 'admin') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <UserCog className="w-4 h-4" />
                <span className="text-sm">Admin</span>
              </button>

              <button
                onClick={() => handleSwitchRole('doctor')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                  role === 'doctor' ? '' : ''
                }`}
                style={{
                  backgroundColor: role === 'doctor' ? 'var(--accent-primary-bg)' : 'transparent',
                  color: role === 'doctor' ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (role !== 'doctor') {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (role !== 'doctor') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Stethoscope className="w-4 h-4" />
                <span className="text-sm">Doctor</span>
              </button>

              <button
                onClick={() => handleSwitchRole('owner')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                  role === 'owner' ? '' : ''
                }`}
                style={{
                  backgroundColor: role === 'owner' ? 'var(--accent-primary-bg)' : 'transparent',
                  color: role === 'owner' ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (role !== 'owner') {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (role !== 'owner') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Owner</span>
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="text-sm">
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              onNavigateSettings?.();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>

          {/* Divider */}
          <div 
            className="my-2 h-px"
            style={{ backgroundColor: 'var(--border-default)' }}
          />

          {/* Log Out */}
          <button
            onClick={() => console.log('Logout')}
            className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
            style={{ color: 'var(--status-error-text)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--status-error-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}