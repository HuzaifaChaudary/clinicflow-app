import { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, CheckCircle, AlertCircle, FileX, Phone, XCircle } from 'lucide-react';
import { Appointment, CancellationReason } from '../types/appointment';
import { HeroCard } from '../components/dashboard/HeroCard';
import { TodaysScheduleSection } from '../components/dashboard/TodaysScheduleSection';
import { NeedsAttentionSection } from '../components/dashboard/NeedsAttentionSection';
import { PatientProfileModal } from '../components/patient/PatientProfileModal';
import { RescheduleModal } from '../components/modals/RescheduleModal';
import { CancelAppointmentModal } from '../components/modals/CancelAppointmentModal';
import { mockDoctors } from '../data/enhancedMockData';
import { useSettings } from '../context/SettingsContext';

interface ConnectedAdminDashboardProps {
  appointments: Appointment[];
  cancelledAppointments?: Appointment[];
  onNavigateToSchedule?: () => void;
  onUpdateAppointment?: (appointment: Appointment) => void;
  onReschedule?: (appointmentId: string, newTime: string, newProvider: string, newDate: string) => void;
  onCancel?: (appointmentId: string, reason: CancellationReason) => void;
}

type FilterType = 'all' | 'confirmed' | 'unconfirmed' | 'missing-intake' | 'voice-calls' | 'cancelled';

export function ConnectedAdminDashboard({ 
  appointments,
  cancelledAppointments = [],
  onNavigateToSchedule,
  onUpdateAppointment,
  onReschedule,
  onCancel,
}: ConnectedAdminDashboardProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [cancelAppointment, setCancelAppointment] = useState<Appointment | null>(null);
  const [showCancelledList, setShowCancelledList] = useState(false);
  const needsAttentionRef = useRef<HTMLDivElement>(null);

  // Calculate hero card counts
  const stats = useMemo(() => ({
    total: appointments.length,
    confirmed: appointments.filter(a => a.status.confirmed).length,
    unconfirmed: appointments.filter(a => !a.status.confirmed).length,
    missingIntake: appointments.filter(a => !a.status.intakeComplete).length,
    voiceCalls: appointments.filter(a => a.indicators.voiceCallSent).length,
  }), [appointments]);

  // Handle hero card clicks
  const handleFilterClick = (filter: FilterType) => {
    if (activeFilter === filter) {
      // Deactivate if clicking the same filter
      setActiveFilter('all');
    } else {
      setActiveFilter(filter);

      // Scroll to needs attention panel when clicking unconfirmed or missing intake
      if (filter === 'unconfirmed' || filter === 'missing-intake') {
        setTimeout(() => {
          needsAttentionRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 150);
      }
    }
  };

  // Map filter type to schedule filter
  const scheduleFilter = useMemo(() => {
    if (activeFilter === 'confirmed') return 'confirmed';
    if (activeFilter === 'unconfirmed') return 'unconfirmed';
    return 'all';
  }, [activeFilter]);

  // Map filter type to needs attention filter
  const needsAttentionFilter = useMemo(() => {
    if (activeFilter === 'unconfirmed') return 'unconfirmed';
    if (activeFilter === 'missing-intake') return 'missing-intake';
    return 'all';
  }, [activeFilter]);

  // Voice calls filtered appointments (highlight in schedule)
  const voiceCallAppointments = useMemo(() => {
    if (activeFilter !== 'voice-calls') return new Set<string>();
    return new Set(appointments.filter(a => a.indicators.voiceCallSent).map(a => a.id));
  }, [activeFilter, appointments]);

  // Action handlers
  const handleCall = (appointmentId: string) => {
    console.log('Calling patient:', appointmentId);
  };

  const handleReEnrollAI = (appointmentId: string) => {
    console.log('Re-enrolling in AI sequence:', appointmentId);
  };

  const handleSendIntake = (appointmentId: string) => {
    console.log('Sending intake form:', appointmentId);
  };

  const handleViewProfile = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
    }
  };

  const handleClosePatientPanel = () => {
    setSelectedAppointment(null);
  };

  const handleReschedule = (appointment: Appointment) => {
    setRescheduleAppointment(appointment);
  };

  const handleCancel = (appointment: Appointment) => {
    setCancelAppointment(appointment);
  };

  const handleRescheduleConfirm = (appointmentId: string, newTime: string, newProvider: string, newDate: string) => {
    if (onReschedule) {
      onReschedule(appointmentId, newTime, newProvider, newDate);
    }
    setRescheduleAppointment(null);
  };

  const handleCancelConfirm = (appointmentId: string, reason: CancellationReason) => {
    if (onCancel) {
      onCancel(appointmentId, reason);
    }
    setCancelAppointment(null);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Page header */}
        <div>
          <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Operational overview for today's clinic schedule
          </p>
        </div>

        {/* Hero cards */}
        <div className="grid grid-cols-6 gap-4">
          <HeroCard
            title="Appointments"
            count={stats.total}
            icon={Calendar}
            accentColor="var(--accent-primary)"
            isActive={activeFilter === 'all'}
            onClick={() => handleFilterClick('all')}
          />
          <HeroCard
            title="Confirmed"
            count={stats.confirmed}
            icon={CheckCircle}
            accentColor="var(--status-success)"
            isActive={activeFilter === 'confirmed'}
            onClick={() => handleFilterClick('confirmed')}
          />
          <HeroCard
            title="Unconfirmed"
            count={stats.unconfirmed}
            icon={AlertCircle}
            accentColor="var(--status-warning)"
            isActive={activeFilter === 'unconfirmed'}
            onClick={() => handleFilterClick('unconfirmed')}
          />
          <HeroCard
            title="Missing Intake"
            count={stats.missingIntake}
            icon={FileX}
            accentColor="var(--status-error)"
            isActive={activeFilter === 'missing-intake'}
            onClick={() => handleFilterClick('missing-intake')}
          />
          <HeroCard
            title="Voice Calls"
            count={stats.voiceCalls}
            icon={Phone}
            accentColor="var(--cf-blue-60)"
            isActive={activeFilter === 'voice-calls'}
            onClick={() => handleFilterClick('voice-calls')}
          />
          <HeroCard
            title="Cancelled"
            count={cancelledAppointments.length}
            icon={XCircle}
            accentColor="var(--cf-neutral-50)"
            isActive={activeFilter === 'cancelled'}
            onClick={() => {
              handleFilterClick('cancelled');
              setShowCancelledList(true);
            }}
          />
        </div>

        {/* Active filter indicator */}
        {activeFilter !== 'all' && (
          <div
            className="px-4 py-3 rounded-lg flex items-center justify-between animate-fade-in"
            style={{
              backgroundColor: 'var(--accent-primary-bg)',
              border: '1px solid var(--accent-primary)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>
                Filtered by: {activeFilter.replace('-', ' ')}
              </span>
            </div>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-sm font-medium px-3 py-1 rounded motion-hover"
              style={{
                color: 'var(--accent-primary)',
                backgroundColor: 'white',
              }}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Main content: Schedule + Needs Attention */}
        <div className="grid grid-cols-3 gap-6">
          {/* Today's Schedule - 2 columns */}
          <div className="col-span-2">
            <TodaysScheduleSection
              appointments={appointments}
              filteredStatus={scheduleFilter}
              onAppointmentClick={handleViewProfile}
              onViewFullSchedule={onNavigateToSchedule}
              onCall={handleCall}
              onReEnrollAI={handleReEnrollAI}
              onSendIntake={handleSendIntake}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
            />
          </div>

          {/* Needs Attention - 1 column */}
          <div ref={needsAttentionRef}>
            <NeedsAttentionSection
              appointments={appointments}
              filterType={needsAttentionFilter}
              onCall={handleCall}
              onReEnrollAI={handleReEnrollAI}
              onSendIntake={handleSendIntake}
              onViewProfile={handleViewProfile}
            />
          </div>
        </div>
      </div>

      {/* Patient side panel */}
      {selectedAppointment && (
        <PatientProfileModal
          appointment={selectedAppointment}
          onClose={handleClosePatientPanel}
          onUpdateAppointment={onUpdateAppointment}
        />
      )}

      {/* Reschedule modal */}
      {rescheduleAppointment && (
        <RescheduleModal
          appointment={rescheduleAppointment}
          doctors={mockDoctors}
          onClose={() => setRescheduleAppointment(null)}
          onConfirm={handleRescheduleConfirm}
        />
      )}

      {/* Cancel appointment modal */}
      {cancelAppointment && (
        <CancelAppointmentModal
          appointment={cancelAppointment}
          onClose={() => setCancelAppointment(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
}