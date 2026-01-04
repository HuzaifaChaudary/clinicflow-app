import { useState } from 'react';
import { StatCards, createDashboardStats } from '../components/StatCards';
import { TodaysSchedule } from '../components/TodaysSchedule';
import { AttentionNeeded } from '../components/AttentionNeeded';
import { LiveActivityFeed, generateMockActivities } from '../components/LiveActivityFeed';
import { VoicePanel } from '../components/VoicePanel';
import { PatientSidePanel } from '../components/PatientSidePanel';
import { Appointment } from '../components/AppointmentRow';
import { AppointmentListView } from '../components/AppointmentListView';

interface DashboardPageProps {
  appointments: Appointment[];
  onConfirm: (id: string) => void;
  onMarkArrived: (id: string) => void;
  onMarkNoShow: (id: string) => void;
  onReschedule: (id: string) => void;
}

export function DashboardPage({
  appointments,
  onConfirm,
  onMarkArrived,
  onMarkNoShow,
  onReschedule,
}: DashboardPageProps) {
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [voicePanelPatient, setVoicePanelPatient] = useState<string>('');
  const [showUnconfirmedPreview, setShowUnconfirmedPreview] = useState(false);

  // Calculate stats
  const totalAppointments = appointments.length;
  const confirmed = appointments.filter(a => a.status.confirmed).length;
  const needsConfirmation = appointments.filter(a => !a.status.confirmed).length;
  const missingIntake = appointments.filter(a => !a.status.intakeComplete).length;
  const reschedules = appointments.filter(a => a.indicators.rescheduled).length;

  const dashboardStats = createDashboardStats({
    total: totalAppointments,
    confirmed,
    needsConfirmation,
    missingIntake,
    reschedules,
  });

  // Attention items
  const attentionItems = [
    needsConfirmation > 0 && {
      id: 'unconfirmed',
      message: `${needsConfirmation} appointment${needsConfirmation > 1 ? 's' : ''} need${needsConfirmation === 1 ? 's' : ''} confirmation`,
      severity: 'warning' as const,
    },
    missingIntake > 0 && {
      id: 'missing-intake',
      message: `${missingIntake} intake form${missingIntake > 1 ? 's' : ''} missing for today`,
      severity: 'warning' as const,
    },
  ].filter(Boolean) as { id: string; message: string; severity: 'urgent' | 'warning' | 'info' }[];

  // Background activity
  const callsSent = appointments.filter(a => a.indicators.voiceCallSent).length;
  const backgroundActivities = [
    { id: 'calls', icon: 'phone' as const, description: 'Confirmation calls sent', count: callsSent },
    { id: 'confirmations', icon: 'check' as const, description: 'Patients confirmed automatically', count: Math.max(0, confirmed - 4) },
    { id: 'reschedules', icon: 'clock' as const, description: 'Reschedules handled without staff', count: reschedules },
  ];

  // Filter appointments
  const filteredAppointments = activeFilter
    ? appointments.filter(a => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'confirmed') return a.status.confirmed;
        if (activeFilter === 'needs-confirmation') return !a.status.confirmed;
        if (activeFilter === 'missing-intake') return !a.status.intakeComplete;
        if (activeFilter === 'reschedules') return a.indicators.rescheduled;
        return true;
      })
    : appointments;

  const handleOpenPatient = (id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
    }
  };

  const handleOpenVoicePanel = (id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      setVoicePanelPatient(appointment.patientName);
      setVoicePanelOpen(true);
      setSelectedAppointment(null);
    }
  };

  const handleCardClick = (id: string) => {
    if (id === 'needs-confirmation') {
      setActiveFilter(prev => prev === 'needs-confirmation' ? '' : 'needs-confirmation');
      setShowUnconfirmedPreview(false);
    } else if (id === 'missing-intake') {
      setActiveFilter(prev => prev === 'missing-intake' ? '' : 'missing-intake');
      setShowUnconfirmedPreview(false);
    } else {
      setActiveFilter(prev => prev === id ? '' : id);
      setShowUnconfirmedPreview(false);
    }
  };

  // Get filtered appointments based on active filter
  const getFilteredPreviewAppointments = () => {
    if (activeFilter === 'needs-confirmation') {
      return appointments.filter(a => !a.status.confirmed);
    } else if (activeFilter === 'missing-intake') {
      return appointments.filter(a => !a.status.intakeComplete);
    }
    return [];
  };

  const previewAppointments = getFilteredPreviewAppointments();

  const mockVoiceMessages = [
    {
      id: '1',
      type: 'call' as const,
      direction: 'outbound' as const,
      content: 'Hi, this is Clinicflow calling to confirm your appointment tomorrow at 9:00 AM with Dr. Patel. Please press 1 to confirm or press 2 to reschedule.',
      timestamp: '2 hours ago',
      summary: 'Confirmation call sent successfully',
    },
    {
      id: '2',
      type: 'text' as const,
      direction: 'inbound' as const,
      content: 'Yes, confirmed! See you tomorrow.',
      timestamp: '1 hour ago',
    },
  ];

  return (
    <>
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Stat Cards */}
        <StatCards
          stats={dashboardStats}
          onCardClick={handleCardClick}
          activeFilter={activeFilter}
        />
        
        {/* Filtered Preview Lists (Unconfirmed or Missing Intake) */}
        {(activeFilter === 'needs-confirmation' || activeFilter === 'missing-intake') && previewAppointments.length > 0 && (
          <div className="animate-fade-in">
            <AppointmentListView
              appointments={previewAppointments}
              onAppointmentClick={handleOpenPatient}
              maxItems={3}
              showViewAllLink={true}
              onViewAll={() => {
                console.log(`View all ${activeFilter} appointments`);
              }}
            />
          </div>
        )}
        
        {/* Today's Schedule - Only show when no filter is active */}
        {!activeFilter && (
          <TodaysSchedule
            appointments={appointments}
            onConfirm={onConfirm}
            onReschedule={onReschedule}
            onMarkArrived={onMarkArrived}
            onMarkNoShow={onMarkNoShow}
            onOpenPatient={handleOpenPatient}
            onOpenVoicePanel={handleOpenVoicePanel}
          />
        )}
        
        {/* Attention Needed - Clickable Patient Rows */}
        <AttentionNeeded 
          appointments={appointments}
          onAppointmentClick={handleOpenPatient}
        />
        
        {/* Background Activity */}
        <LiveActivityFeed activities={generateMockActivities()} />
      </div>

      {/* Patient Side Panel */}
      {selectedAppointment && (
        <PatientSidePanel
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onOpenVoicePanel={() => {
            setVoicePanelPatient(selectedAppointment.patientName);
            setVoicePanelOpen(true);
            setSelectedAppointment(null);
          }}
          isDoctor={false}
        />
      )}

      {/* Voice Panel */}
      {voicePanelOpen && (
        <VoicePanel
          patientName={voicePanelPatient}
          messages={mockVoiceMessages}
          onClose={() => setVoicePanelOpen(false)}
          onMakeCall={() => console.log('Making call to', voicePanelPatient)}
        />
      )}
    </>
  );
}