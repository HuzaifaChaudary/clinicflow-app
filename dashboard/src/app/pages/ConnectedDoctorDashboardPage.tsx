import { useState } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Video, 
  MapPin,
  ChevronRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { useDoctorDashboard } from '../hooks/useApi';
import { appointments as appointmentsApi } from '../services/api';

export function ConnectedDoctorDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  // Fetch data from backend
  const { data: dashboardData, loading, error, refetch } = useDoctorDashboard(selectedDate);

  const handleMarkArrived = async (appointmentId: string) => {
    try {
      await appointmentsApi.markArrived(appointmentId);
      refetch();
    } catch (err) {
      console.error('Failed to mark arrived:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--surface-card)' }}>
          <AlertCircle className="w-8 h-8" style={{ color: 'var(--status-error)' }} />
          <p style={{ color: 'var(--text-primary)' }}>Failed to load dashboard</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const doctor = dashboardData?.doctor || { id: '', name: 'Doctor' };
  const stats = dashboardData?.stats || {
    total_appointments: 0,
    confirmed: 0,
    unconfirmed: 0,
    missing_intake: 0,
    voice_ai_alerts: 0,
  };
  const todaysPatients = dashboardData?.todays_patients || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Good morning, {doctor.name}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {dashboardData?.date ? new Date(dashboardData.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'Today'}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
            >
              <Users className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <div className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.total_appointments}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Patients Today
              </div>
            </div>
          </div>
        </Card>

        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--status-success-bg)' }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: 'var(--status-success)' }} />
            </div>
            <div>
              <div className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.confirmed}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Confirmed
              </div>
            </div>
          </div>
        </Card>

        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--status-warning-bg)' }}
            >
              <AlertCircle className="w-6 h-6" style={{ color: 'var(--status-warning)' }} />
            </div>
            <div>
              <div className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.unconfirmed}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Unconfirmed
              </div>
            </div>
          </div>
        </Card>

        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--status-error-bg)' }}
            >
              <FileText className="w-6 h-6" style={{ color: 'var(--status-error)' }} />
            </div>
            <div>
              <div className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.missing_intake}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Missing Intake
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Patients */}
      <Card elevation="2" radius="md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Today's Patients
          </h2>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {todaysPatients.length} appointments
          </span>
        </div>

        <div className="space-y-3">
          {todaysPatients.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No patients scheduled for today</p>
            </div>
          ) : (
            todaysPatients.map((patient) => (
              <div
                key={patient.id}
                className="rounded-xl border overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)'
                }}
              >
                {/* Patient Row */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedPatient(
                    expandedPatient === patient.id ? null : patient.id
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Time */}
                    <div 
                      className="text-sm font-medium px-3 py-1 rounded-lg"
                      style={{ 
                        backgroundColor: 'var(--cf-neutral-20)',
                        color: 'var(--text-primary)',
                        minWidth: '80px',
                        textAlign: 'center'
                      }}
                    >
                      {patient.time}
                    </div>

                    {/* Patient Info */}
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {patient.patient_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {patient.visit_type === 'virtual' ? (
                          <Video className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                        ) : (
                          <MapPin className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        )}
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {patient.visit_type === 'virtual' ? 'Video Call' : 'In-Clinic'} 
                          {patient.visit_category && ` • ${patient.visit_category}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    {/* Status Indicators */}
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: patient.status.confirmed 
                            ? 'var(--status-success)' 
                            : 'var(--status-warning)' 
                        }}
                        title={patient.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
                      />
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: patient.status.intake_complete 
                            ? 'var(--status-success)' 
                            : 'var(--status-error)' 
                        }}
                        title={patient.status.intake_complete ? 'Intake Complete' : 'Missing Intake'}
                      />
                      {patient.status.arrived && (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--accent-primary)' }}
                          title="Arrived"
                        />
                      )}
                    </div>

                    {/* Arrived Button */}
                    {!patient.status.arrived && patient.status.confirmed && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkArrived(patient.appointment_id)}
                      >
                        Mark Arrived
                      </Button>
                    )}

                    {patient.status.arrived && (
                      <span 
                        className="text-sm font-medium px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'rgba(91, 141, 239, 0.12)',
                          color: 'var(--accent-primary)'
                        }}
                      >
                        Arrived
                      </span>
                    )}

                    <ChevronRight 
                      className={`w-5 h-5 transition-transform ${
                        expandedPatient === patient.id ? 'rotate-90' : ''
                      }`}
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </div>
                </div>

                {/* Expanded Content - AI Summary */}
                {expandedPatient === patient.id && patient.intake_summary && (
                  <div 
                    className="px-4 pb-4 pt-2 border-t"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        AI Intake Summary
                      </span>
                    </div>

                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {patient.intake_summary.summary_text}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Patient Concerns */}
                      {patient.intake_summary.patient_concerns?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                            CONCERNS
                          </p>
                          <ul className="space-y-1">
                            {patient.intake_summary.patient_concerns.map((concern, i) => (
                              <li key={i} className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                • {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Medications */}
                      {patient.intake_summary.medications?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                            MEDICATIONS
                          </p>
                          <ul className="space-y-1">
                            {patient.intake_summary.medications.map((med, i) => (
                              <li key={i} className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                • {med}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Allergies */}
                      {patient.intake_summary.allergies?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                            ALLERGIES
                          </p>
                          <ul className="space-y-1">
                            {patient.intake_summary.allergies.map((allergy, i) => (
                              <li key={i} className="text-sm" style={{ color: 'var(--status-error)' }}>
                                • {allergy}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* No Intake Message */}
                {expandedPatient === patient.id && !patient.intake_summary && (
                  <div 
                    className="px-4 pb-4 pt-2 border-t text-center"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Intake form not yet completed
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default ConnectedDoctorDashboardPage;
