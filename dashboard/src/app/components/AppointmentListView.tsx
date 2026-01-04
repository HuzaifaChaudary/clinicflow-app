import { Clock, ChevronRight, Video, User } from 'lucide-react';
import { Card } from './foundation/Card';
import { Appointment } from './AppointmentRow';

interface AppointmentListRowProps {
  appointment: Appointment;
  onClick: () => void;
  highlightId?: string;
}

function AppointmentListRow({ appointment, onClick, highlightId }: AppointmentListRowProps) {
  const getDoctorInitials = (providerName: string): string => {
    const names = providerName.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  const visitType = appointment.visitType;
  const visitTypeColor = visitType === 'virtual' ? '#5B8DEF' : '#34C759';
  const isHighlighted = highlightId === appointment.id;

  // Determine which status badges to show
  const statusBadges = [];
  if (!appointment.status.confirmed) {
    statusBadges.push({ label: 'Unconfirmed', color: 'var(--status-warning)' });
  }
  if (!appointment.status.intakeComplete) {
    statusBadges.push({ label: 'Missing Intake', color: 'var(--status-error)' });
  }

  return (
    <button
      onClick={onClick}
      className={`w-full px-6 py-4 text-left motion-hover group ${isHighlighted ? 'animate-highlight-pulse' : ''}`}
      style={{
        backgroundColor: 'transparent',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
        e.currentTarget.style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <div className="flex items-center gap-4">
        {/* Left: Main Info */}
        <div className="flex-1 min-w-0">
          {/* Patient Name - Primary Focus */}
          <div className="font-semibold mb-1.5 truncate" style={{ color: 'var(--text-primary)' }}>
            {appointment.patientName}
          </div>
          
          {/* Secondary Info Row */}
          <div className="flex items-center gap-3 text-sm flex-wrap">
            {/* Time */}
            <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium">{appointment.time}</span>
            </div>
            
            <span style={{ color: 'var(--border-default)' }}>•</span>
            
            {/* Doctor with initials */}
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <div
                className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold shrink-0"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {getDoctorInitials(appointment.provider)}
              </div>
              <span>{appointment.provider}</span>
            </div>
            
            <span style={{ color: 'var(--border-default)' }}>•</span>
            
            {/* Visit Type */}
            <div className="flex items-center gap-1.5">
              {visitType === 'virtual' ? (
                <Video className="w-3.5 h-3.5 shrink-0" style={{ color: visitTypeColor }} />
              ) : (
                <User className="w-3.5 h-3.5 shrink-0" style={{ color: visitTypeColor }} />
              )}
              <span className="text-xs font-medium" style={{ color: visitTypeColor }}>
                {visitType === 'virtual' ? 'Video consultation' : 'In clinic visit'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status Badges and Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Status Badges - Stacked */}
          <div className="flex items-center gap-2">
            {statusBadges.map((badge, index) => (
              <div
                key={index}
                className="px-3 py-1.5 rounded-lg flex items-center gap-2"
                style={{
                  backgroundColor: `${badge.color}15`,
                  border: `1px solid ${badge.color}33`,
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: badge.color }} />
                <span className="text-sm font-semibold whitespace-nowrap" style={{ color: badge.color }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          {/* Chevron Action Indicator */}
          <ChevronRight 
            className="w-5 h-5 transition-transform group-hover:translate-x-1" 
            style={{ color: 'var(--text-muted)' }} 
          />
        </div>
      </div>
    </button>
  );
}

interface AppointmentListViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointmentId: string) => void;
  maxItems?: number;
  showViewAllLink?: boolean;
  onViewAll?: () => void;
  highlightId?: string;
}

export function AppointmentListView({
  appointments,
  onAppointmentClick,
  maxItems,
  showViewAllLink = false,
  onViewAll,
  highlightId,
}: AppointmentListViewProps) {
  const displayedAppointments = maxItems 
    ? appointments.slice(0, maxItems)
    : appointments;

  if (appointments.length === 0) {
    return (
      <Card elevation="2" radius="lg">
        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          No appointments to display
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" elevation="2" radius="lg">
      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {displayedAppointments.map((appointment) => (
          <AppointmentListRow
            key={appointment.id}
            appointment={appointment}
            onClick={() => onAppointmentClick(appointment.id)}
            highlightId={highlightId}
          />
        ))}
      </div>

      {/* View All Link */}
      {showViewAllLink && maxItems && appointments.length > maxItems && (
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
          View all {appointments.length} appointments →
        </button>
      )}
    </Card>
  );
}
