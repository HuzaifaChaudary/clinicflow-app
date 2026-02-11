import { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { mockDoctors } from '../data/enhancedMockData';
import { Appointment } from '../types/appointment';
import { filterAppointmentsForDoctor } from '../utils/roleFilters';
import { 
  Calendar, 
  Clock, 
  Video, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  UserCheck,
  MessageSquare,
} from 'lucide-react';

interface DoctorScheduleProps {
  appointments: Appointment[];
  onMarkArrived?: (appointmentId: string) => void;
}

export function DoctorSchedule({ appointments, onMarkArrived }: DoctorScheduleProps) {
  const { activeDoctorId } = useRole();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get current doctor info
  const currentDoctor = activeDoctorId 
    ? mockDoctors.find(d => d.id === activeDoctorId)
    : null;

  if (!currentDoctor) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="text-center">
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            No doctor profile selected
          </p>
        </div>
      </div>
    );
  }

  // Filter appointments for this doctor only
  const doctorAppointments = filterAppointmentsForDoctor(appointments, currentDoctor.name);

  // Group appointments by time slots
  const sortedAppointments = [...doctorAppointments].sort((a, b) => {
    const timeA = a.time.toLowerCase().includes('pm') && !a.time.startsWith('12') 
      ? parseInt(a.time) + 12 
      : parseInt(a.time);
    const timeB = b.time.toLowerCase().includes('pm') && !b.time.startsWith('12')
      ? parseInt(b.time) + 12 
      : parseInt(b.time);
    return timeA - timeB;
  });

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div
        className="px-8 py-6 border-b backdrop-blur-xl sticky top-0 z-10"
        style={{
          backgroundColor: 'rgba(var(--surface-card-rgb), 0.8)',
          borderColor: 'var(--border-default)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              My Schedule
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              {doctorAppointments.length} appointments today
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
              }}
            >
              <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Today
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {doctorAppointments.length === 0 ? (
          <div
            className="p-12 rounded-2xl border text-center"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No appointments scheduled
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              You have no appointments for today. Enjoy your free time!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-6 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: apt.arrived 
                    ? 'var(--status-success)' 
                    : !apt.status.confirmed 
                    ? 'var(--status-warning)' 
                    : 'var(--border-default)',
                }}
              >
                <div className="flex items-start justify-between">
                  {/* Left: Time and Patient Info */}
                  <div className="flex items-start gap-6 flex-1">
                    {/* Time Block */}
                    <div className="text-center">
                      <div
                        className="px-4 py-2 rounded-xl"
                        style={{
                          backgroundColor: 'var(--cf-blue-10)',
                        }}
                      >
                        <p className="text-2xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                          {apt.time.split(' ')[0]}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {apt.time.split(' ')[1]}
                        </p>
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        {apt.duration || 30} min
                      </p>
                    </div>

                    {/* Patient Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {apt.patientName}
                        </h3>
                        {apt.arrived && (
                          <span
                            className="px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
                            style={{
                              backgroundColor: 'var(--status-success-bg)',
                              color: 'var(--status-success)',
                            }}
                          >
                            <UserCheck className="w-3 h-3" />
                            Arrived
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        {/* Visit Type */}
                        <div className="flex items-center gap-2">
                          {apt.visitType === 'virtual' ? (
                            <Video className="w-4 h-4" style={{ color: 'var(--cf-blue-60)' }} />
                          ) : (
                            <Building2 className="w-4 h-4" style={{ color: 'var(--cf-neutral-60)' }} />
                          )}
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {apt.visitType === 'virtual' ? 'Video Visit' : 'In-Clinic'}
                          </span>
                        </div>

                        {/* Phone */}
                        {apt.patientPhone && (
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {apt.patientPhone}
                          </span>
                        )}
                      </div>

                      {/* Status Indicators */}
                      <div className="flex items-center gap-3">
                        {apt.status.confirmed ? (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
                            <span style={{ color: 'var(--status-success)' }}>Confirmed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                            <span style={{ color: 'var(--status-warning)' }}>Unconfirmed</span>
                          </div>
                        )}

                        {apt.status.intakeComplete ? (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
                            <span style={{ color: 'var(--text-secondary)' }}>Intake Complete</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                            <span style={{ color: 'var(--status-warning)' }}>Intake Missing</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2">
                    {!apt.arrived && (
                      <button
                        onClick={() => onMarkArrived?.(apt.id)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'white',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                      >
                        <UserCheck className="w-4 h-4" />
                        Mark Arrived
                      </button>
                    )}
                    
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      style={{
                        backgroundColor: 'var(--surface-hover)',
                        color: 'var(--text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--cf-neutral-20)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Add Note
                    </button>

                    {apt.visitType === 'virtual' && (
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--cf-blue-10)',
                          color: 'var(--cf-blue-70)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--cf-blue-20)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--cf-blue-10)';
                        }}
                      >
                        <Video className="w-4 h-4" />
                        Join Call
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
