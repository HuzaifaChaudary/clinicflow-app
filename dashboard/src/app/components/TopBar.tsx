import { Bell } from 'lucide-react';

interface TopBarProps {
  clinicName: string;
  date: string;
  alertCount?: number;
}

export function TopBar({ clinicName, date, alertCount = 0 }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-gray-600">Today</div>
            <div className="text-gray-900">{date}</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <div className="text-gray-900">{clinicName}</div>
          </div>
        </div>

        {alertCount > 0 && (
          <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        )}
      </div>
    </header>
  );
}
