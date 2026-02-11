import { AlertCircle, Clock } from 'lucide-react';
import { Card } from './foundation/Card';
import { Appointment } from './AppointmentRow';
import { UnconfirmedAppointmentRow } from './UnconfirmedAppointmentRow';

interface UnconfirmedAppointmentsListProps {
  appointments: Appointment[];
  onAppointmentClick: (appointmentId: string) => void;
  maxItems?: number;
  showSummaryBar?: boolean;
  showViewAllLink?: boolean;
  onViewAll?: () => void;
}

export function UnconfirmedAppointmentsList({
  appointments,
  onAppointmentClick,
  maxItems,
  showSummaryBar = true,
  showViewAllLink = false,
  onViewAll,
}: UnconfirmedAppointmentsListProps) {
  const unconfirmedAppointments = appointments.filter(apt => !apt.status.confirmed);
  const displayedAppointments = maxItems 
    ? unconfirmedAppointments.slice(0, maxItems)
    : unconfirmedAppointments;
  
  const totalUnconfirmed = unconfirmedAppointments.length;
  const beforeNoonCount = unconfirmedAppointments.filter(apt => {
    const hour = parseInt(apt.time.split(':')[0]);
    return hour < 12;
  }).length;

  if (totalUnconfirmed === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      {showSummaryBar && (
        <div 
          className="px-5 py-4 rounded-xl flex items-center justify-between"
          style={{ 
            backgroundColor: 'var(--status-warning-bg)',
            border: '1.5px solid rgba(242, 166, 90, 0.2)',
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: 'rgba(242, 166, 90, 0.15)',
              }}
            >
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
            </div>
            
            <div>
              <div className="font-semibold" style={{ color: 'var(--status-warning)' }}>
                {totalUnconfirmed} Unconfirmed Appointment{totalUnconfirmed !== 1 ? 's' : ''}
              </div>
              <div className="text-sm mt-0.5" style={{ color: 'var(--status-warning)', opacity: 0.85 }}>
                {beforeNoonCount > 0 && (
                  <>
                    <Clock className="w-3.5 h-3.5 inline mr-1" />
                    {beforeNoonCount} before noon • Needs attention
                  </>
                )}
                {beforeNoonCount === 0 && 'Review and follow up as needed'}
              </div>
            </div>
          </div>

          {beforeNoonCount > 0 && (
            <div 
              className="px-3 py-1.5 rounded-lg font-semibold text-sm"
              style={{ 
                backgroundColor: 'var(--status-warning)',
                color: 'white',
              }}
            >
              Urgent
            </div>
          )}
        </div>
      )}

      {/* Appointment List */}
      <Card padding="none" elevation="2" radius="lg">
        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {displayedAppointments.map((appointment, index) => (
            <UnconfirmedAppointmentRow
              key={appointment.id}
              appointment={appointment}
              onClick={() => onAppointmentClick(appointment.id)}
              showDate={index === 0}
            />
          ))}
        </div>

        {/* View All Link */}
        {showViewAllLink && maxItems && totalUnconfirmed > maxItems && (
          <button
            onClick={onViewAll}
            className="w-full px-6 py-4 text-center font-medium motion-hover border-t"
            style={{
              color: 'var(--accent-primary)',
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            View all {totalUnconfirmed} unconfirmed appointments →
          </button>
        )}
      </Card>
    </div>
  );
}
