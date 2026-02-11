import { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, Phone, FolderOpen, Settings, Pin, PinOff } from 'lucide-react';
import { AxisLogoMark } from './AxisLogoMark';

interface SidebarProps {
  activePage?: string;
  onPageChange?: (page: string) => void;
}

export function CollapsibleSidebar({ activePage = 'dashboard', onPageChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const primaryNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'intake', label: 'Intake', icon: FileText },
    { id: 'voice', label: 'Ava Ops', icon: Phone },
    { id: 'reports', label: 'Reports', icon: FolderOpen },
  ];

  const secondaryNav = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isPinned && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPinned]);

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsExpanded(!isPinned);
  };

  const handleItemClick = (id: string) => {
    onPageChange?.(id);
  };

  return (
    <aside
      ref={sidebarRef}
      className={`flex flex-col h-screen transition-all duration-200 ease-out border-r ${
        isExpanded ? 'w-64 shadow-lg' : 'w-16'
      }`}
      style={{
        backgroundColor: 'var(--surface-sidebar)',
        borderColor: 'var(--border-default)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo / Brand */}
      <div 
        className={`border-b flex items-center ${isExpanded ? 'px-6 py-5 justify-between' : 'px-4 py-5 justify-center'}`}
        style={{ borderColor: 'var(--border-default)' }}
      >
        {isExpanded ? (
          <>
            <div className="flex items-center gap-2">
              <AxisLogoMark size={24} />
              <h1 style={{ color: 'var(--text-primary)' }}>Axis</h1>
            </div>
            <button
              onClick={togglePin}
              className="p-1.5 rounded-md transition-colors"
              style={{
                color: 'var(--text-muted)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            </button>
          </>
        ) : (
          <AxisLogoMark size={32} />
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center gap-3 rounded-lg transition-all duration-150 ${
                    isExpanded ? 'px-3 py-2.5' : 'px-3 py-2.5 justify-center'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--surface-active)' : 'transparent',
                    color: isActive ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isExpanded && <span className="truncate">{item.label}</span>}
                </button>

                {/* Tooltip for collapsed state */}
                {!isExpanded && hoveredItem === item.id && (
                  <div 
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm rounded-md whitespace-nowrap pointer-events-none z-50"
                    style={{
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--text-inverse)',
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Secondary Navigation */}
      <div 
        className={`p-3 border-t`}
        style={{ borderColor: 'var(--border-default)' }}
      >
        <ul className="space-y-1">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <li key={item.id} className="relative">
                <button
                  onClick={() => handleItemClick(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center gap-3 rounded-lg transition-all duration-150 ${
                    isExpanded ? 'px-3 py-2.5' : 'px-3 py-2.5 justify-center'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--surface-active)' : 'transparent',
                    color: isActive ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isExpanded && <span className="truncate">{item.label}</span>}
                </button>

                {!isExpanded && hoveredItem === item.id && (
                  <div 
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm rounded-md whitespace-nowrap pointer-events-none z-50"
                    style={{
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--text-inverse)',
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}