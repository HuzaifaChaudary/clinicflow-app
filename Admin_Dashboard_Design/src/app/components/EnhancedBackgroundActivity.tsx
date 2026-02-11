import { useState, useEffect } from 'react';
import { Check, Phone, MessageSquare, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: 'check' | 'phone' | 'message' | 'clock';
  description: string;
  count: number;
  animated?: boolean;
}

interface EnhancedBackgroundActivityProps {
  activities: ActivityItem[];
}

export function EnhancedBackgroundActivity({ activities }: EnhancedBackgroundActivityProps) {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);

  useEffect(() => {
    // Stagger the appearance of items
    activities.forEach((activity, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, activity.id]);
      }, index * 150);
    });
  }, [activities]);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'check':
        return Check;
      case 'phone':
        return Phone;
      case 'message':
        return MessageSquare;
      case 'clock':
        return Clock;
      default:
        return Check;
    }
  };

  return (
    <section 
      className="px-8 py-6 border-t"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <h2 className="mb-4" style={{ color: 'var(--text-primary)' }}>What Axis handled for you today</h2>

      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = getIcon(activity.icon);
          const isVisible = visibleItems.includes(activity.id);

          return (
            <div
              key={activity.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{
                background: 'linear-gradient(to right, var(--accent-primary-bg), transparent)',
                borderColor: 'var(--accent-primary)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: 'var(--accent-primary-bg)',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div className="flex-1" style={{ color: 'var(--text-secondary)' }}>
                {activity.description}
              </div>
              <div className="text-2xl font-medium shrink-0" style={{ color: 'var(--accent-primary-text)' }}>
                {activity.count}
              </div>
              {isVisible && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 animate-scale-in"
                  style={{ backgroundColor: 'var(--status-success)' }}
                >
                  <Check className="w-4 h-4" style={{ color: 'var(--text-inverse)' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          Background activity will appear here as the day progresses
        </div>
      )}
    </section>
  );
}