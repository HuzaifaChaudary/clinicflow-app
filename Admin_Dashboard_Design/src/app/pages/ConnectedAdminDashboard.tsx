import { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, CheckCircle, AlertCircle, FileX, Phone, XCircle, ChevronRight, ChevronLeft, ExternalLink, TrendingUp } from 'lucide-react';
import { Appointment, CancellationReason } from '../types/appointment';
import { KPIStrip } from '../components/dashboard/KPIStrip';
import { PatientsByDoctorChart } from '../components/dashboard/PatientsByDoctorChart';
import { AppointmentStatusChart } from '../components/dashboard/AppointmentStatusChart';
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
  
  // KPI filter state
  const [selectedKPI, setSelectedKPI] = useState<'patients' | 'registrations' | 'appointments' | 'at-risk'>('appointments');
  
  // Doctor filter state
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>('Dr. Sarah Chen');

  // Calendar popover state
  const [showCalendarPopover, setShowCalendarPopover] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Active metric state
  type MetricType = 'total' | 'at-risk' | 'no-show' | 'ai-calls';
  const [activeMetric, setActiveMetric] = useState<MetricType>('total');

  // Get first appointment for "Selected Patient" card
  const featuredAppointment = useMemo(() => {
    return appointments[0] || null;
  }, [appointments]);

  // Calculate hero card counts
  const stats = useMemo(() => ({
    total: appointments.length,
    confirmed: appointments.filter(a => a.status.confirmed).length,
    unconfirmed: appointments.filter(a => !a.status.confirmed).length,
    missingIntake: appointments.filter(a => !a.status.intakeComplete).length,
    voiceCalls: appointments.filter(a => a.indicators.voiceCallSent).length,
  }), [appointments]);

  // Calculate KPI data
  const kpiData = useMemo(() => {
    const totalPatients = appointments.length;
    const atRiskPatients = appointments.filter(a => !a.status.confirmed || !a.status.intakeComplete).length;
    
    return {
      totalPatients,
      newRegistrations: Math.floor(totalPatients * 0.15), // Mock: ~15% are new
      totalAppointments: appointments.length,
      atRiskPatients,
      patientsTrend: 8.2,
      registrationsTrend: 12.5,
      appointmentsTrend: 5.3,
      atRiskTrend: -3.1,
      // Sparklines that match trend direction
      patientsSparkline: [72, 75, 73, 78, 82, 80, 85], // Upward trend for +8.2%
      registrationsSparkline: [12, 14, 13, 16, 19, 18, 22], // Upward trend for +12.5%
      appointmentsSparkline: [52, 55, 53, 58, 61, 60, 64], // Upward trend for +5.3%
      atRiskSparkline: [28, 26, 27, 24, 22, 23, 20], // Downward trend for -3.1%
    };
  }, [appointments]);

  // Calculate doctor distribution
  const doctorData = useMemo(() => {
    const doctorCounts = appointments.reduce((acc, apt) => {
      acc[apt.provider] = (acc[apt.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#5B8DEF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    
    return Object.entries(doctorCounts).map(([name, count], index) => ({
      name,
      patients: count,
      color: colors[index % colors.length],
    }));
  }, [appointments]);
  
  // Filter appointments based on selected KPI and selected doctor
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;
    
    // First apply KPI filter
    switch (selectedKPI) {
      case 'patients':
        // Show all patients (no filter)
        break;
      case 'registrations':
        // Mock: filter to show only "new" patients (simulated)
        filtered = filtered.slice(0, Math.ceil(filtered.length * 0.15));
        break;
      case 'appointments':
        // Show all appointments (default view)
        break;
      case 'at-risk':
        // Show only at-risk patients
        filtered = filtered.filter(a => !a.status.confirmed || !a.status.intakeComplete);
        break;
    }
    
    // Then apply doctor filter if one is selected
    if (selectedDoctor) {
      filtered = filtered.filter(a => a.provider === selectedDoctor);
    }
    
    return filtered;
  }, [appointments, selectedKPI, selectedDoctor]);
  
  // Handle KPI selection
  const handleKPISelect = (kpi: 'patients' | 'registrations' | 'appointments' | 'at-risk') => {
    setSelectedKPI(kpi);
  };
  
  // Handle doctor selection
  const handleDoctorSelect = (doctorName: string | null) => {
    setSelectedDoctor(doctorName);
  };

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
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        {/* Page header */}
        <div>
          <h1 style={{ 
            color: 'var(--text-primary)',
            fontSize: '24px',
            fontWeight: 600,
            margin: 0,
            marginBottom: '4px',
          }}>
            Dashboard
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)',
            fontSize: '14px',
            margin: 0,
          }}>
            Operational overview for today's clinic schedule
          </p>
        </div>

        {/* KPI Strip - 4 cards */}
        <KPIStrip
          totalPatients={kpiData.totalPatients}
          newRegistrations={kpiData.newRegistrations}
          totalAppointments={kpiData.totalAppointments}
          atRiskPatients={kpiData.atRiskPatients}
          patientsTrend={kpiData.patientsTrend}
          registrationsTrend={kpiData.registrationsTrend}
          appointmentsTrend={kpiData.appointmentsTrend}
          atRiskTrend={kpiData.atRiskTrend}
          patientsSparkline={kpiData.patientsSparkline}
          registrationsSparkline={kpiData.registrationsSparkline}
          appointmentsSparkline={kpiData.appointmentsSparkline}
          atRiskSparkline={kpiData.atRiskSparkline}
          selectedKPI={selectedKPI}
          onKPISelect={handleKPISelect}
        />

        {/* Chart Row - 2 large charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}>
          <PatientsByDoctorChart 
            data={doctorData} 
            selectedKPI={selectedKPI}
            selectedDoctor={selectedDoctor}
            onDoctorSelect={handleDoctorSelect}
          />
          <AppointmentStatusChart 
            selectedKPI={selectedKPI}
          />
        </div>

        {/* Main content: Schedule + Needs Attention */}
        <div className="grid grid-cols-3 gap-6">
          {/* Today's Schedule - 2 columns */}
          <div className="col-span-2">
            <TodaysScheduleSection
              appointments={filteredAppointments}
              filteredStatus={scheduleFilter}
              onAppointmentClick={handleViewProfile}
              onViewFullSchedule={onNavigateToSchedule}
              onCall={handleCall}
              onReEnrollAI={handleReEnrollAI}
              onSendIntake={handleSendIntake}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
              selectedKPI={selectedKPI}
              selectedDoctor={selectedDoctor}
            />
          </div>

          {/* Needs Attention - 1 column */}
          <div ref={needsAttentionRef}>
            <NeedsAttentionSection
              appointments={filteredAppointments}
              filterType={needsAttentionFilter}
              onCall={handleCall}
              onReEnrollAI={handleReEnrollAI}
              onSendIntake={handleSendIntake}
              onViewProfile={handleViewProfile}
              selectedKPI={selectedKPI}
              selectedDoctor={selectedDoctor}
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