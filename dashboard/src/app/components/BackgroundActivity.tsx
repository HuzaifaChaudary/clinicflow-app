import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  description: string;
  count?: number;
}

interface BackgroundActivityProps {
  activities: ActivityItem[];
}

export function BackgroundActivity({ activities }: BackgroundActivityProps) {
  return (
    <section className="bg-white px-8 py-6 border-t border-gray-200">
      <h2 className="text-gray-900 mb-4">Background Activity</h2>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 text-gray-600">
            <Activity className="w-4 h-4 text-gray-400" />
            <span>
              {activity.description}
              {activity.count !== undefined && (
                <span className="ml-2 text-gray-900">{activity.count}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
