import { CircleAlert, ChevronRight } from 'lucide-react';
import { Appointment } from './AppointmentRow';

interface AttentionNeededProps {
  appointments: Appointment[];
  onAppointmentClick: (appointmentId: string) => void;
}

export function AttentionNeeded({ appointments, onAppointmentClick }: AttentionNeededProps) {
  // Filter appointments that need attention
  const needsAttentionAppointments = appointments.filter(apt => 
    !apt.status.confirmed || !apt.status.intakeComplete
  );

  if (needsAttentionAppointments.length === 0) {
    return (
      <section 
        className="rounded-xl shadow-sm border px-8 py-6 mt-6"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <h2 className="mb-4" style={{ color: 'var(--text-primary)' }}>Attention Needed</h2>
        <div 
          className="flex items-center gap-3 px-4 py-3 rounded-lg border"
          style={{
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success-text)',
            borderColor: 'var(--status-success)',
          }}
        >
          <span>Nothing needs attention right now</span>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="rounded-xl shadow-sm border overflow-hidden mt-6"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="px-8 py-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex items-center gap-3">
          <CircleAlert className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
          <h2 style={{ color: 'var(--text-primary)' }}>Attention Needed</h2>
          <div 
            className="ml-auto px-3 py-1 rounded-lg text-sm font-semibold"
            style={{ 
              backgroundColor: 'var(--status-warning-bg)',
              color: 'var(--status-warning)',
            }}
          >
            {needsAttentionAppointments.length}
          </div>
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {needsAttentionAppointments.map((appointment) => {
          const issues = [];
          if (!appointment.status.confirmed) issues.push('Unconfirmed');
          if (!appointment.status.intakeComplete) issues.push('Missing Intake');

          return (
            <button
              key={appointment.id}
              onClick={() => onAppointmentClick(appointment.id)}
              className="w-full px-8 py-4 text-left motion-hover group"
              style={{
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="flex items-center gap-4">
                {/* Left: Patient Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {appointment.patientName}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {appointment.time} • {appointment.provider}
                  </div>
                </div>

                {/* Right: Status Pills Stacked */}
                <div className="flex items-center gap-2 shrink-0">
                  {!appointment.status.confirmed && (
                    <div 
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                      style={{ 
                        backgroundColor: 'var(--status-warning-bg)',
                        color: 'var(--status-warning)',
                        border: '1px solid rgba(242, 166, 90, 0.2)',
                      }}
                    >
                      Unconfirmed
                    </div>
                  )}
                  {!appointment.status.intakeComplete && (
                    <div 
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                      style={{ 
                        backgroundColor: 'var(--status-error-bg)',
                        color: 'var(--status-error)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                      }}
                    >
                      Missing Intake
                    </div>
                  )}

                  {/* Chevron */}
                  <ChevronRight 
                    className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                    style={{ color: 'var(--text-muted)' }} 
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}