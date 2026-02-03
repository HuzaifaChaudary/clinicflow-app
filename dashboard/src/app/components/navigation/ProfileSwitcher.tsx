import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, UserCog, Stethoscope, Building2, LogOut } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { mockDoctors } from '../../data/enhancedMockData';
import { auth } from '../../services/api';

type Role = 'admin' | 'doctor' | 'owner';

interface RoleOption {
  id: Role;
  label: string;
  description: string;
  icon: typeof UserCog;
}

const roleOptions: RoleOption[] = [
  {
    id: 'admin',
    label: 'Admin',
    description: 'Full clinic operations access',
    icon: UserCog,
  },
  {
    id: 'doctor',
    label: 'Doctor',
    description: 'Patient care and schedule',
    icon: Stethoscope,
  },
  {
    id: 'owner',
    label: 'Owner',
    description: 'Business and analytics',
    icon: Building2,
  },
];

interface ProfileSwitcherProps {
  isExpanded: boolean;
  isMobile: boolean;
}

export function ProfileSwitcher({ isExpanded, isMobile }: ProfileSwitcherProps) {
  const { role, activeDoctorId, setRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Role switching removed - users can only see their own role

  const handleSignOut = () => {
    // Clear authentication token
    auth.logout();
    // Clear role from context and localStorage
    setRole('admin'); // Reset to default, will be cleared by login page
    localStorage.removeItem('clinicflow-role');
    localStorage.removeItem('clinicflow-active-doctor-id');
    // Reload the page to show login page
    window.location.href = '/';
  };

  const currentRole = roleOptions.find(r => r.id === role);
  const currentDoctor = role === 'doctor' && activeDoctorId 
    ? mockDoctors.find(d => d.id === activeDoctorId)
    : null;

  // Get display info based on role
  const getDisplayInfo = () => {
    if (role === 'doctor' && currentDoctor) {
      return {
        initials: currentDoctor.initials,
        name: currentDoctor.name,
        subtitle: currentDoctor.specialty || 'Doctor',
      };
    }
    
    return {
      initials: role === 'admin' ? 'AC' : role === 'owner' ? 'OW' : 'DR',
      name: role === 'admin' ? 'Admin User' : role === 'owner' ? 'Clinic Owner' : 'Doctor',
      subtitle: currentRole?.description || '',
    };
  };

  const displayInfo = getDisplayInfo();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-4 transition-colors"
        style={{
          backgroundColor: isOpen ? 'var(--surface-hover)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
          style={{
            backgroundColor: role === 'doctor' && currentDoctor?.color 
              ? currentDoctor.color 
              : 'var(--accent-primary)',
            color: 'white',
          }}
        >
          {displayInfo.initials}
        </div>

        {/* Info (shown when expanded) */}
        <div
          className={`flex-1 min-w-0 text-left transition-opacity duration-200 ${
            isExpanded || isMobile ? 'opacity-100' : 'opacity-0 w-0'
          }`}
        >
          {(isExpanded || isMobile) && (
            <>
              <div className="flex items-center gap-2">
                <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {displayInfo.name}
                </p>
                <ChevronDown 
                  className="w-4 h-4 flex-shrink-0 transition-transform"
                  style={{ 
                    color: 'var(--text-secondary)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </div>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                {displayInfo.subtitle}
              </p>
            </>
          )}
        </div>
      </button>

      {/* Dropdown Menu - Only show current role, no switching allowed */}
      {isOpen && (isExpanded || isMobile) && (
        <div
          className="absolute bottom-full left-0 right-0 mb-2 rounded-xl shadow-lg border overflow-hidden"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          }}
        >
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Current Role
            </div>
            {(() => {
              // Only show the current user's role, no switching allowed
              const currentOption = roleOptions.find(opt => opt.id === role);
              if (!currentOption) return null;
              
              const Icon = currentOption.icon;

              return (
                <div
                  className="w-full px-3 py-2.5 flex items-center gap-3"
                  style={{
                    backgroundColor: 'var(--surface-hover)',
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                  <div className="flex-1 text-left">
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {currentOption.label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {currentOption.description}
                    </p>
                  </div>
                    <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                </div>
              );
            })()}

            {/* Sign Out Button */}
            <div className="border-t mt-2 pt-2" style={{ borderColor: 'var(--border-default)' }}>
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2.5 flex items-center gap-3 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--status-error)' }} />
                <div className="flex-1 text-left">
                  <p className="font-medium" style={{ color: 'var(--status-error)' }}>
                    Sign Out
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor selection removed - users cannot switch roles */}
    </div>
  );
}