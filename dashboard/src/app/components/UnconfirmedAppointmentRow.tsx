import { Clock, ChevronRight, Video, User } from 'lucide-react';
import { Appointment } from './AppointmentRow';

interface UnconfirmedAppointmentRowProps {
  appointment: Appointment;
  onClick: () => void;
  showDate?: boolean;
}

export function UnconfirmedAppointmentRow({ 
  appointment, 
  onClick,
  showDate = false 
}: UnconfirmedAppointmentRowProps) {
  const getDoctorInitials = (providerName: string): string => {
    const names = providerName.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  // Use actual visit type from appointment data
  const visitType = appointment.visitType;
  const visitTypeColor = visitType === 'virtual' ? '#5B8DEF' : '#34C759';

  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-4 text-left motion-hover group"
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
              {showDate && <span>• Today</span>}
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

        {/* Right: Status and Action */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Unconfirmed Badge */}
          <div 
            className="px-3 py-1.5 rounded-lg flex items-center gap-2"
            style={{ 
              backgroundColor: 'var(--status-warning-bg)',
              border: '1px solid rgba(242, 166, 90, 0.2)',
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }} />
            <span className="text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--status-warning)' }}>
              Unconfirmed
            </span>
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