import { useState, useEffect } from 'react';
import { Phone, Check, Calendar, FileText, MessageSquare } from 'lucide-react';

export interface ActivityItem {
  id: string;
  time: string;
  type: 'call' | 'confirmation' | 'reschedule' | 'intake' | 'message';
  description: string;
  patientName?: string;
}

interface LiveActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export function LiveActivityFeed({ activities, maxItems = 8 }: LiveActivityFeedProps) {
  const [visibleActivities, setVisibleActivities] = useState<string[]>([]);

  useEffect(() => {
    // Stagger the appearance of activities
    activities.slice(0, maxItems).forEach((activity, index) => {
      setTimeout(() => {
        setVisibleActivities(prev => [...prev, activity.id]);
      }, index * 100);
    });
  }, [activities, maxItems]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'confirmation':
        return Check;
      case 'reschedule':
        return Calendar;
      case 'intake':
        return FileText;
      case 'message':
        return MessageSquare;
      default:
        return Check;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'var(--accent-primary)';
      case 'confirmation':
        return 'var(--status-success)';
      case 'reschedule':
        return 'var(--token-rescheduled-text)';
      case 'intake':
        return 'var(--status-info)';
      case 'message':
        return 'var(--accent-secondary)';
      default:
        return 'var(--text-muted)';
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <section 
      className="rounded-xl shadow-sm border p-6"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ color: 'var(--text-primary)' }}>What Axis handled for you today</h2>
        <div 
          className="px-2 py-1 rounded-md text-sm"
          style={{
            backgroundColor: 'var(--accent-primary-bg)',
            color: 'var(--accent-primary-text)',
          }}
        >
          Live
        </div>
      </div>

      <div className="space-y-2">
        {displayedActivities.map((activity) => {
          const Icon = getIcon(activity.type);
          const isVisible = visibleActivities.includes(activity.id);
          const iconColor = getIconColor(activity.type);

          return (
            <div
              key={activity.id}
              className={`
                flex items-start gap-3 p-3 rounded-lg border transition-all duration-300
                ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
              `}
              style={{
                backgroundColor: 'var(--surface-hover)',
                borderColor: 'var(--border-light)',
              }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: 'var(--surface-card)',
                }}
              >
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    {activity.time}
                  </span>
                  {activity.patientName && (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {activity.patientName}
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {activity.description}
                </p>
              </div>

              {isVisible && (
                <div 
                  className="w-2 h-2 rounded-full shrink-0 mt-2 animate-scale-in"
                  style={{ backgroundColor: iconColor }}
                />
              )}
            </div>
          );
        })}
      </div>

      {displayedActivities.length === 0 && (
        <div 
          className="text-center py-12 border rounded-lg"
          style={{
            color: 'var(--text-muted)',
            borderColor: 'var(--border-light)',
            backgroundColor: 'var(--surface-hover)',
          }}
        >
          Activity will appear here as the day progresses
        </div>
      )}
    </section>
  );
}

// Helper to generate mock activities
export function generateMockActivities(): ActivityItem[] {
  return [
    {
      id: '1',
      time: '10:12 AM',
      type: 'call',
      description: 'Confirmation call completed',
      patientName: 'Emily Johnson',
    },
    {
      id: '2',
      time: '10:18 AM',
      type: 'intake',
      description: 'Intake form submitted',
      patientName: 'Thomas Lee',
    },
    {
      id: '3',
      time: '10:24 AM',
      type: 'reschedule',
      description: 'Appointment rescheduled automatically',
      patientName: 'David Kim',
    },
    {
      id: '4',
      time: '10:31 AM',
      type: 'confirmation',
      description: 'Patient confirmed via text response',
      patientName: 'Sarah Martinez',
    },
    {
      id: '5',
      time: '10:45 AM',
      type: 'message',
      description: 'Reminder sent successfully',
      patientName: 'Lisa Anderson',
    },
    {
      id: '6',
      time: '11:02 AM',
      type: 'call',
      description: 'Follow-up call completed',
      patientName: 'Michael Brown',
    },
    {
      id: '7',
      time: '11:15 AM',
      type: 'confirmation',
      description: 'Patient confirmed appointment',
      patientName: 'Rachel Green',
    },
    {
      id: '8',
      time: '11:28 AM',
      type: 'intake',
      description: 'Insurance verification completed',
      patientName: 'James Wilson',
    },
  ];
}