import { useState, useEffect } from 'react';
import { AlertCircle, Clock, ChevronRight, FileText, Calendar } from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { StatusChip } from '../components/foundation/StatusChip';
import { Button } from '../components/foundation/Button';
import { Appointment } from '../components/AppointmentRow';

interface DoctorDashboardPageProps {
  appointments: Appointment[];
  onOpenPatient: (id: string) => void;
}

export function DoctorDashboardPage({ appointments, onOpenPatient }: DoctorDashboardPageProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState('15 minutes');
  
  const currentTime = new Date().getHours();
  const upcomingAppointments = appointments.filter(a => !a.noShow);
  const nextPatient = upcomingAppointments[0];
  const alertItems = appointments.filter(a => !a.status.confirmed || !a.status.intakeComplete);

  // Simulate countdown (mock)
  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = Math.floor(Math.random() * 15) + 10;
      setTimeUntilNext(`${minutes} minutes`);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Next Patient Focus Card (Primary Feature) */}
      {nextPatient && (
        <Card elevation="3" radius="lg" interactive onClick={() => onOpenPatient(nextPatient.id)}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full animate-gentle-pulse" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Next Patient
            </span>
            <div className="ml-auto px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                  {timeUntilNext}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            {/* Patient Avatar */}
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-semibold shrink-0"
              style={{
                backgroundColor: 'rgba(91, 141, 239, 0.12)',
                color: 'var(--accent-primary)',
              }}
            >
              {nextPatient.patientName.charAt(0)}
            </div>

            {/* Patient Info */}
            <div className="flex-1 w-full sm:w-auto">
              <h2 className="mb-3" style={{ color: 'var(--text-primary)' }}>
                {nextPatient.patientName}
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span className="text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
                    {nextPatient.time}
                  </span>
                </div>
                <span className="hidden sm:inline" style={{ color: 'var(--text-muted)' }}>•</span>
                <span className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                  Follow-up Consultation
                </span>
                <span className="hidden sm:inline" style={{ color: 'var(--text-muted)' }}>•</span>
                <span className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                  30 minutes
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusChip 
                  type={nextPatient.status.confirmed ? 'confirmed' : 'unconfirmed'}
                  size="md"
                />
                <StatusChip 
                  type={nextPatient.status.intakeComplete ? 'intake-complete' : 'intake-missing'}
                  size="md"
                />
                {nextPatient.arrived && <StatusChip type="arrived" size="md" />}
              </div>
            </div>

            <ChevronRight className="hidden sm:block w-7 h-7" style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Alert if Intake Incomplete */}
          {!nextPatient.status.intakeComplete && (
            <div 
              className="mt-6 p-4 rounded-xl flex items-center gap-3"
              style={{ backgroundColor: 'var(--status-warning-bg)' }}
            >
              <AlertCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--status-warning)' }} />
              <span className="font-medium text-sm sm:text-base" style={{ color: 'var(--status-warning)' }}>
                Intake forms incomplete — review before visit
              </span>
            </div>
          )}

          {/* Quick Links */}
          <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <Button variant="secondary" size="md" icon={FileText} fullWidth>
              View Intake Forms
            </Button>
            <Button variant="secondary" size="md" icon={Calendar} fullWidth>
              Patient History
            </Button>
          </div>
        </Card>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compact Daily Timeline */}
        <div className="lg:col-span-2">
          <Card padding="none" elevation="2" radius="lg">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <h3 style={{ color: 'var(--text-primary)' }}>Today's Timeline</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {upcomingAppointments.length} patients scheduled
              </p>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {upcomingAppointments.map((appointment, index) => {
                const hour = parseInt(appointment.time.split(':')[0]);
                const isPast = hour < currentTime;
                const isNext = index === 0;

                return (
                  <button
                    key={appointment.id}
                    onClick={() => onOpenPatient(appointment.id)}
                    className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-left motion-state"
                    style={{
                      backgroundColor: 
                        isNext ? 'rgba(91, 141, 239, 0.06)' :
                        hoveredRow === appointment.id ? 'var(--surface-hover)' : 
                        'transparent',
                      borderLeft: isNext ? '3px solid var(--accent-primary)' : 'none',
                      opacity: isPast ? 0.5 : 1,
                    }}
                    onMouseEnter={() => setHoveredRow(appointment.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center gap-5">
                      <div className="w-20 shrink-0">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {appointment.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                          {appointment.patientName}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Follow-up Consultation
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusChip 
                          type={appointment.status.confirmed ? 'confirmed' : 'unconfirmed'}
                          size="sm"
                        />
                        {appointment.arrived && <StatusChip type="arrived" size="sm" />}
                      </div>

                      <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {appointment.patientName}
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {appointment.time}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusChip 
                          type={appointment.status.confirmed ? 'confirmed' : 'unconfirmed'}
                          size="sm"
                        />
                        {appointment.arrived && <StatusChip type="arrived" size="sm" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card elevation="2" radius="lg">
            <div className="flex items-center gap-2 mb-5">
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
              <h3 style={{ color: 'var(--text-primary)' }}>Alerts</h3>
              {alertItems.length > 0 && (
                <div 
                  className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--status-warning-bg)',
                    color: 'var(--status-warning)',
                  }}
                >
                  {alertItems.length}
                </div>
              )}
            </div>

            {alertItems.length === 0 ? (
              <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                No alerts for today
              </div>
            ) : (
              <div className="space-y-3">
                {alertItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onOpenPatient(item.id)}
                    className="w-full text-left p-4 rounded-xl motion-state"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      border: '1.5px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      {item.patientName}
                    </div>
                    <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {item.time}
                    </div>
                    
                    <div className="space-y-2">
                      {!item.status.intakeComplete && (
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-3.5 h-3.5" style={{ color: 'var(--status-warning)' }} />
                          <span style={{ color: 'var(--status-warning)' }}>
                            Missing intake forms
                          </span>
                        </div>
                      )}
                      {!item.status.confirmed && (
                        <StatusChip type="unconfirmed" size="sm" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Today's Summary */}
          <Card elevation="2" radius="lg">
            <h3 className="mb-5" style={{ color: 'var(--text-primary)' }}>Today's Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Total Patients
                </span>
                <span className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {appointments.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Arrived
                </span>
                <span className="text-2xl font-semibold" style={{ color: 'var(--status-success)' }}>
                  {appointments.filter(a => a.arrived).length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Confirmed
                </span>
                <span className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {appointments.filter(a => a.status.confirmed).length}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card elevation="2" radius="lg">
            <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="secondary" fullWidth>
                View All Notes
              </Button>
              <Button variant="secondary" fullWidth>
                Today's Lab Results
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
