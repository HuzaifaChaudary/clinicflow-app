import { useRole } from '../context/RoleContext';
import { mockDoctors } from '../data/enhancedMockData';
import { Appointment } from '../types/appointment';
import { getDoctorNeedsAttentionCount } from '../utils/roleFilters';
import { Calendar, ClipboardList, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { GlobalPatientProfile } from '../components/patient/GlobalPatientProfile';

interface DoctorDashboardProps {
  appointments: Appointment[];
  onNavigateToSchedule: () => void;
  doctorId?: string; // Doctor name for compatibility
}

type FilterType = 'all' | 'confirmed' | 'unconfirmed' | 'missing-intake' | 'voice-alerts';

export function DoctorDashboard({
  appointments,
  onNavigateToSchedule,
  doctorId,
}: DoctorDashboardProps) {
  const { activeDoctorId } = useRole();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);

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
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Please select a doctor profile from the sidebar
          </p>
        </div>
      </div>
    );
  }

  // Use appointments directly - they're already filtered in App.tsx
  const todaysAppointments = appointments;

  // Calculate doctor-specific metrics
  const confirmedCount = todaysAppointments.filter(apt => apt.status.confirmed).length;
  const unconfirmedCount = todaysAppointments.filter(apt => !apt.status.confirmed).length;
  const missingIntakeCount = todaysAppointments.filter(apt => !apt.status.intakeComplete).length;
  const voiceAlertsCount = getDoctorNeedsAttentionCount(appointments, currentDoctor.name);

  // Apply active filter
  const getFilteredAppointments = (): Appointment[] => {
    switch (activeFilter) {
      case 'confirmed':
        return todaysAppointments.filter(apt => apt.status.confirmed);
      case 'unconfirmed':
        return todaysAppointments.filter(apt => !apt.status.confirmed);
      case 'missing-intake':
        return todaysAppointments.filter(apt => !apt.status.intakeComplete);
      case 'voice-alerts':
        return todaysAppointments.filter(apt => apt.needsAttention);
      default:
        return todaysAppointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  const heroCards = [
    {
      id: 'confirmed' as FilterType,
      label: "Today's Appointments",
      value: confirmedCount,
      total: todaysAppointments.length,
      subtitle: `${confirmedCount} confirmed`,
      icon: Calendar,
      color: 'var(--accent-primary)',
    },
    {
      id: 'unconfirmed' as FilterType,
      label: 'Unconfirmed',
      value: unconfirmedCount,
      subtitle: unconfirmedCount === 0 ? 'All set' : 'Need confirmation',
      icon: AlertCircle,
      color: unconfirmedCount > 0 ? 'var(--status-warning)' : 'var(--status-success)',
    },
    {
      id: 'missing-intake' as FilterType,
      label: 'Missing Intake',
      value: missingIntakeCount,
      subtitle: missingIntakeCount === 0 ? 'All complete' : 'Pending completion',
      icon: ClipboardList,
      color: missingIntakeCount > 0 ? 'var(--status-warning)' : 'var(--status-success)',
    },
    {
      id: 'voice-alerts' as FilterType,
      label: 'Voice AI Alerts',
      value: voiceAlertsCount,
      subtitle: voiceAlertsCount === 0 ? 'No alerts' : 'Need your attention',
      icon: AlertCircle,
      color: voiceAlertsCount > 0 ? 'var(--status-error)' : 'var(--status-success)',
    },
  ];

  const handleCardClick = (filterId: FilterType) => {
    if (activeFilter === filterId) {
      setActiveFilter('all');
    } else {
      setActiveFilter(filterId);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedPatient(appointment);
  };

  const isFiltered = activeFilter !== 'all';

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
              Welcome back, {currentDoctor.name.split(' ')[1]}
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              {currentDoctor.specialty} · {todaysAppointments.length} appointments today
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
              style={{
                backgroundColor: currentDoctor.color || 'var(--accent-primary)',
                color: 'white',
              }}
            >
              {currentDoctor.initials}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {heroCards.map((card) => {
            const Icon = card.icon;
            const isActive = activeFilter === card.id;
            
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="p-6 rounded-2xl border transition-all text-left group relative"
                style={{
                  backgroundColor: isActive ? `${card.color}10` : 'var(--surface-card)',
                  borderColor: isActive ? card.color : 'var(--border-default)',
                  boxShadow: isActive ? `0 0 0 3px ${card.color}20` : '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {isActive && (
                  <div 
                    className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: card.color,
                      color: 'white',
                    }}
                  >
                    Active
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${card.color}15`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    {card.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {card.value}
                    </p>
                    {card.total !== undefined && (
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        of {card.total}
                      </p>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {card.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter indicator */}
        {isFiltered && (
          <div className="mb-4 flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                backgroundColor: 'var(--cf-blue-10)',
                border: '1px solid var(--cf-blue-30)',
              }}
            >
              <span className="text-sm font-medium" style={{ color: 'var(--cf-blue-70)' }}>
                Filtered: {heroCards.find(c => c.id === activeFilter)?.label}
              </span>
              <button
                onClick={() => setActiveFilter('all')}
                className="p-1 rounded-lg transition-all"
                style={{
                  backgroundColor: 'var(--cf-blue-20)',
                  color: 'var(--cf-blue-70)',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing {filteredAppointments.length} of {todaysAppointments.length} appointments
            </span>
          </div>
        )}

        {/* Appointments List */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {isFiltered ? 'Filtered Appointments' : "Today's Schedule"}
          </h2>
          
          {filteredAppointments.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {isFiltered ? 'No appointments match this filter' : 'No appointments scheduled for today'}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {isFiltered ? 'Try selecting a different filter' : 'Enjoy your day off!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => handleAppointmentClick(apt)}
                  className="w-full p-4 rounded-xl border flex items-center justify-between transition-all text-left"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {apt.time}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {apt.duration || 30}min
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {apt.patientName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: apt.visitType === 'virtual' 
                              ? 'var(--cf-blue-10)' 
                              : 'var(--cf-neutral-10)',
                            color: apt.visitType === 'virtual' 
                              ? 'var(--cf-blue-70)' 
                              : 'var(--cf-neutral-70)',
                          }}
                        >
                          {apt.visitType === 'virtual' ? 'Video' : 'In-Clinic'}
                        </span>
                        {apt.visitCategory && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: apt.visitCategory === 'new-patient'
                                ? 'var(--status-info-bg)'
                                : 'var(--cf-neutral-10)',
                              color: apt.visitCategory === 'new-patient'
                                ? 'var(--status-info)'
                                : 'var(--cf-neutral-70)',
                            }}
                          >
                            {apt.visitCategory === 'new-patient' ? 'New Patient' : 'Follow-up'}
                          </span>
                        )}
                        {apt.nextFollowUp && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--status-success-bg)',
                              color: 'var(--status-success)',
                            }}
                          >
                            Follow-up scheduled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {apt.status.confirmed && (
                      <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-success)' }} />
                    )}
                    {!apt.status.intakeComplete && (
                      <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <GlobalPatientProfile
          appointment={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}