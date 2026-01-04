import { useState } from 'react';
import { Appointment } from '../components/AppointmentRow';
import { StatusToken } from '../components/StatusToken';
import { PatientSidePanel } from '../components/PatientSidePanel';
import { Clock, ChevronRight } from 'lucide-react';

interface DoctorTodayPageProps {
  appointments: Appointment[];
}

export function DoctorTodayPage({ appointments }: DoctorTodayPageProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const currentTime = new Date().getHours();

  return (
    <>
      <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div>
          <h1 style={{ color: 'var(--text-primary)' }} className="mb-1">
            Today's Schedule
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {appointments.length} appointments scheduled
          </p>
        </div>

        {/* Timeline */}
        <div 
          className="rounded-xl shadow-sm border"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="p-6 space-y-3">
            {appointments.map((appointment, index) => {
              const hour = parseInt(appointment.time.split(':')[0]);
              const isPast = hour < currentTime;
              const isCurrent = hour === currentTime;

              return (
                <div key={appointment.id}>
                  {/* Timeline indicator */}
                  {isCurrent && (
                    <div 
                      className="flex items-center gap-2 mb-2 py-2 px-3 rounded-lg"
                      style={{
                        backgroundColor: 'var(--accent-primary-bg)',
                        borderLeft: '3px solid var(--accent-primary)',
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                      />
                      <span className="text-sm font-medium" style={{ color: 'var(--accent-primary-text)' }}>
                        Current time
                      </span>
                    </div>
                  )}

                  {/* Appointment Row */}
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className={`
                      w-full flex items-center gap-4 px-5 py-4 rounded-lg border transition-all duration-150
                      ${isPast ? 'opacity-50' : ''}
                    `}
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--border-default)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    {/* Time */}
                    <div className="w-20 shrink-0">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-primary)' }}>{appointment.time}</span>
                      </div>
                    </div>

                    {/* Patient */}
                    <div className="flex-1 text-left">
                      <div style={{ color: 'var(--text-primary)' }} className="font-medium mb-1">
                        {appointment.patientName}
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }} className="text-sm">
                        Follow-up Consultation
                      </div>
                    </div>

                    {/* Status Tokens */}
                    <div className="flex items-center gap-2">
                      <StatusToken 
                        type={appointment.status.confirmed ? 'confirmed' : 'unconfirmed'}
                        readOnly
                      />
                      
                      {appointment.status.intakeComplete && (
                        <StatusToken type="intake-complete" readOnly />
                      )}
                      
                      {appointment.arrived && (
                        <StatusToken type="arrived" readOnly />
                      )}

                      {appointment.indicators.voiceCallSent && (
                        <StatusToken type="voice" pulse readOnly />
                      )}
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="w-5 h-5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
              );
            })}
          </div>

          {appointments.length === 0 && (
            <div 
              className="px-6 py-12 text-center"
              style={{ color: 'var(--text-muted)' }}
            >
              No appointments scheduled for today
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div 
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="text-3xl mb-1" style={{ color: 'var(--accent-primary-text)' }}>
              {appointments.filter(a => a.status.confirmed).length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Confirmed</div>
          </div>

          <div 
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="text-3xl mb-1" style={{ color: 'var(--status-success-text)' }}>
              {appointments.filter(a => a.arrived).length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Arrived</div>
          </div>

          <div 
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
              {appointments.filter(a => a.status.intakeComplete).length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Forms Complete</div>
          </div>
        </div>
      </div>

      {/* Patient Side Panel */}
      {selectedAppointment && (
        <PatientSidePanel
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          isDoctor
        />
      )}
    </>
  );
}
