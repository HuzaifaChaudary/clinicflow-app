import { LayoutDashboard, Calendar, Users, FileText, Phone, FolderOpen, Settings } from 'lucide-react';

interface SidebarProps {
  activePage?: string;
}

export function Sidebar({ activePage = 'dashboard' }: SidebarProps) {
  const primaryNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'intake', label: 'Intake', icon: FileText },
    { id: 'voice', label: 'Voice Activity', icon: Phone },
    { id: 'reports', label: 'Reports', icon: FolderOpen },
  ];

  const secondaryNav = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-gray-900">Clinicflow</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-1">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
