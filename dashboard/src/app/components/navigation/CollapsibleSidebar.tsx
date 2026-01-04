import { useState, useEffect } from 'react';
import { LucideIcon, X, Menu } from 'lucide-react';
import { useRole } from '../../context/RoleContext';
import { ProfileSwitcher } from './ProfileSwitcher';

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  roles?: ('admin' | 'doctor' | 'owner')[]; // Which roles can see this item
}

interface CollapsibleSidebarProps {
  navigationItems: NavItem[];
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function CollapsibleSidebar({
  navigationItems,
  currentPage,
  onNavigate,
}: CollapsibleSidebarProps) {
  const { role } = useRole();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileOpen]);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Filter navigation items by role
  const visibleItems = navigationItems.filter(item => {
    if (!item.roles || item.roles.length === 0) {
      // If no roles specified, show to all
      return true;
    }
    return item.roles.includes(role);
  });

  // Get subtitle based on role
  const getSubtitle = () => {
    if (role === 'admin') return 'Admin Dashboard';
    if (role === 'doctor') return 'Doctor Platform';
    if (role === 'owner') return 'Owner Dashboard';
    return '';
  };

  return (
    <>
      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg lg:hidden"
          style={{
            backgroundColor: 'var(--surface-card)',
            color: 'var(--text-primary)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
        className={`fixed left-0 top-0 h-full border-r flex flex-col z-50 transition-all duration-200 ease-out ${
          isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : ''
        }`}
        style={{
          width: isMobile ? '280px' : isExpanded ? '256px' : '72px',
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
          boxShadow: isMobile ? '2px 0 8px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        {/* Logo */}
        <div
          className="px-4 py-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className={`transition-opacity duration-200 ${isExpanded || isMobile ? 'opacity-100' : 'opacity-0'}`}>
            {(isExpanded || isMobile) && (
              <>
                <h1 className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  Clinicflow
                </h1>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {getSubtitle()}
                </p>
              </>
            )}
          </div>
          
          {!isExpanded && !isMobile && (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-lg"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
              }}
            >
              C
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleNavigate(item.id)}
                  className="w-full px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-all text-left relative"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)',
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
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`transition-opacity duration-200 whitespace-nowrap ${
                      isExpanded || isMobile ? 'opacity-100' : 'opacity-0 w-0'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.badge && (isExpanded || isMobile) && (
                    <span
                      className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--status-error)',
                        color: 'white',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Tooltip for collapsed state (desktop only) */}
                {!isExpanded && !isMobile && (
                  <div
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none opacity-0 transition-opacity duration-200 z-50"
                    style={{
                      backgroundColor: 'var(--cf-dark-90)',
                      color: 'white',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {item.label}
                    <div
                      className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0"
                      style={{
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderRight: '4px solid var(--cf-dark-90)',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Profile Switcher */}
        <div
          className="border-t"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <ProfileSwitcher isExpanded={isExpanded} isMobile={isMobile} />
        </div>
      </div>

      {/* Spacer for content (desktop only) */}
      {!isMobile && (
        <div
          className="flex-shrink-0 transition-all duration-200"
          style={{
            width: '72px',
          }}
        />
      )}
    </>
  );
}