import { useRole } from '../context/RoleContext';
import { mockDoctors } from '../data/enhancedMockData';
import { Appointment } from '../types/appointment';
import { getDoctorNeedsAttentionCount } from '../utils/roleFilters';
import { 
  Calendar, 
  ClipboardList, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Phone,
  FileText,
  Sparkles,
  Clock,
  MapPin,
  Video,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { GlobalPatientProfile } from '../components/patient/GlobalPatientProfile';

interface DoctorDashboardProps {
  appointments: Appointment[];
  onNavigateToSchedule: () => void;
  doctorId?: string;
}

type ViewMode = 'day' | 'week';

export function DoctorDashboardRedesigned({
  appointments,
  onNavigateToSchedule,
  doctorId,
}: DoctorDashboardProps) {
  const { activeDoctorId, role } = useRole();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [showTasksPanel, setShowTasksPanel] = useState(true);
  const [showUnconfirmedModal, setShowUnconfirmedModal] = useState(false);

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

  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Calculate doctor-specific metrics
  const confirmedCount = todaysAppointments.filter(apt => apt.status.confirmed).length;
  const unconfirmedCount = todaysAppointments.filter(apt => !apt.status.confirmed).length;
  const intakeReadyCount = todaysAppointments.filter(apt => apt.status.intakeComplete).length;
  const missingIntakeCount = todaysAppointments.filter(apt => !apt.status.intakeComplete).length;
  const voiceAlertsCount = getDoctorNeedsAttentionCount(appointments, currentDoctor.name);

  // Mock tasks data
  const tasks = [
    { id: '1', type: 'message', patient: 'John Smith', content: 'Question about medication dosage', time: '30m ago' },
    { id: '2', type: 'refill', patient: 'Emma Davis', content: 'Metformin refill request', time: '2h ago' },
    { id: '3', type: 'note', patient: 'Sarah Mitchell', content: 'Lab results to review', time: 'Yesterday' },
  ];

  const avaAlerts = todaysAppointments
    .filter(apt => apt.needsAttention)
    .map(apt => ({
      id: apt.id,
      patient: apt.patientName,
      reason: apt.urgency === 'high' ? 'Reported chest pain overnight' : 'Did not complete intake after 3 attempts',
      time: apt.appointmentTime,
    }));

  // Check if viewing as admin
  const isAdminViewing = role === 'admin' || role === 'owner';

  const getIntakeStatus = (appointment: Appointment) => {
    if (appointment.status.intakeComplete) {
      return { label: 'Intake complete', color: '#10B981' };
    }
    // Check if partially complete
    if (appointment.notes && appointment.notes.includes('partial')) {
      return { label: 'Intake partial', color: '#F59E0B' };
    }
    return { label: 'Intake missing', color: '#EF4444' };
  };

  const getStatusChip = (appointment: Appointment) => {
    if (appointment.status.confirmed) {
      return { label: 'Confirmed', color: '#10B981' };
    }
    if (appointment.urgency === 'high') {
      return { label: 'No-show risk', color: '#EF4444' };
    }
    return { label: 'Unconfirmed', color: '#F59E0B' };
  };

  return (
    <div className="h-full flex" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Main content */}
      <div className={`flex-1 overflow-auto ${showTasksPanel ? 'mr-80' : ''}`}>
        {/* HEADER */}
        <div
          className="px-8 py-6 border-b backdrop-blur-xl sticky top-0 z-10"
          style={{
            backgroundColor: 'rgba(var(--surface-card-rgb), 0.8)',
            borderColor: 'var(--border-default)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Title Row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {greeting}, {currentDoctor.name}
                </h1>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>Today's signal:</span>
                  <span>{currentDoctor.specialty} · {todaysAppointments.length} appointments today</span>
                </div>
              </div>

              {/* Ava Status Pill */}
              <div
                className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shrink-0"
                style={{
                  backgroundColor: 'var(--accent-primary-bg)',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--accent-primary)',
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>
                  Ava MD: {todaysAppointments.length} patients today · {voiceAlertsCount > 0 ? `${voiceAlertsCount} high-priority` : 'All clear'}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Strip */}
          <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                }}
              >
                Today
              </button>
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                This week
              </button>
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                This month
              </button>
            </div>

            <div className="w-px h-4" style={{ backgroundColor: 'var(--border-default)' }} />

            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="font-medium">Trend:</span>
              <span style={{ color: 'var(--status-success)' }}>↑ {confirmedCount > 0 ? Math.round((confirmedCount / todaysAppointments.length) * 100) : 0}% confirmed rate</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Today's appointments */}
            <button
              onClick={() => setShowUnconfirmedModal(true)}
              className="p-6 rounded-2xl border transition-all text-left group"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--accent-primary-bg)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {confirmedCount} of {todaysAppointments.length}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Today's appointments
                </div>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {unconfirmedCount} pending confirmation
              </div>
            </button>

            {/* Card 2: Intake readiness */}
            <button
              className="p-6 rounded-2xl border transition-all text-left group"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10B981';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: '#10B98120',
                    color: '#10B981',
                  }}
                >
                  <ClipboardList className="w-5 h-5" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {intakeReadyCount} ready
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Intake readiness
                </div>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {missingIntakeCount} missing or partial intake
              </div>
            </button>

            {/* Card 3: Voice AI alerts */}
            <button
              onClick={() => setShowTasksPanel(true)}
              className="p-6 rounded-2xl border transition-all text-left group"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#F59E0B';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: '#F59E0B20',
                    color: '#F59E0B',
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {voiceAlertsCount}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Voice AI alerts (Ava)
                </div>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Patients flagged for follow-up or triage
              </div>
            </button>

            {/* Card 4: Tasks & messages */}
            <button
              onClick={() => setShowTasksPanel(true)}
              className="p-6 rounded-2xl border transition-all text-left group"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--accent-primary-bg)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
              <div className="mb-2">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {tasks.length}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Tasks & messages
                </div>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Messages, refills, and notes to review
              </div>
            </button>
          </div>

          {/* TODAY'S SCHEDULE */}
          <div
            className="rounded-2xl border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Today's Schedule
              </h2>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
              {todaysAppointments.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
                  <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    No appointments today
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Your schedule is clear
                  </p>
                </div>
              ) : (
                todaysAppointments.map((appointment) => {
                  const statusChip = getStatusChip(appointment);
                  const intakeStatus = getIntakeStatus(appointment);
                  
                  return (
                    <div
                      key={appointment.id}
                      onClick={() => setSelectedPatient(appointment)}
                      className="px-6 py-4 cursor-pointer transition-all group"
                      style={{ backgroundColor: 'var(--surface-card)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                      }}
                    >
                      <div className="flex items-center gap-6">
                        {/* Left: Time & Status */}
                        <div className="w-32 flex-shrink-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                              {appointment.appointmentTime}
                            </span>
                          </div>
                          <span
                            className="px-2 py-1 rounded text-xs font-medium inline-block"
                            style={{
                              backgroundColor: `${statusChip.color}20`,
                              color: statusChip.color,
                            }}
                          >
                            {statusChip.label}
                          </span>
                        </div>

                        {/* Middle: Patient details */}
                        <div className="flex-1">
                          <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            {appointment.patientName}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Visit type */}
                            <span
                              className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                              style={{
                                backgroundColor: 'var(--surface-canvas)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {appointment.type === 'video' ? (
                                <>
                                  <Video className="w-3 h-3" />
                                  Video
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-3 h-3" />
                                  In-Clinic
                                </>
                              )}
                            </span>
                            
                            {/* New/Follow-up */}
                            <span
                              className="px-2 py-0.5 rounded text-xs font-medium"
                              style={{
                                backgroundColor: 'var(--surface-canvas)',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {appointment.visitType || 'Follow-up'}
                            </span>

                            {/* Intake status */}
                            <span
                              className="px-2 py-0.5 rounded text-xs font-medium"
                              style={{
                                backgroundColor: `${intakeStatus.color}20`,
                                color: intakeStatus.color,
                              }}
                            >
                              {intakeStatus.label}
                            </span>
                          </div>
                        </div>

                        {/* Right: Ava alerts & actions */}
                        <div className="flex items-center gap-4">
                          {appointment.needsAttention ? (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: '#F59E0B20',
                                color: '#F59E0B',
                              }}
                              title="Ava alert - view details"
                            >
                              <Sparkles className="w-4 h-4" />
                            </div>
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: '#10B98120',
                                color: '#10B981',
                              }}
                              title="No issues"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}

                          {/* Quick actions (show on hover) */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <button
                              className="p-2 rounded-lg transition-all"
                              style={{
                                backgroundColor: 'var(--surface-canvas)',
                                color: 'var(--text-secondary)',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              title="Call patient"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg transition-all"
                              style={{
                                backgroundColor: 'var(--surface-canvas)',
                                color: 'var(--text-secondary)',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              title="Open chart"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>

                          <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Admin controls section (only if viewing as admin/owner) */}
          {isAdminViewing && (
            <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--border-default)' }}>
              <div
                className="p-6 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Admin controls
                </h3>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Edit scheduling rules
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Manage availability
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Tasks & Alerts Panel */}
      {showTasksPanel && (
        <div
          className="fixed right-0 top-0 bottom-0 w-80 border-l overflow-y-auto"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xl" style={{ 
            backgroundColor: 'rgba(var(--surface-card-rgb), 0.95)',
            borderColor: 'var(--border-default)' 
          }}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Today's tasks
              </h2>
              <button
                onClick={() => setShowTasksPanel(false)}
                className="p-1.5 rounded-lg transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Ava alerts section */}
            {avaAlerts.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Sparkles className="w-4 h-4" style={{ color: '#F59E0B' }} />
                  Ava alerts ({avaAlerts.length})
                </h3>
                <div className="space-y-2">
                  {avaAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg border cursor-pointer transition-all"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#F59E0B';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                      }}
                    >
                      <div className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                        {alert.patient}
                      </div>
                      <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                        {alert.reason}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Appointment: {alert.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <MessageSquare className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                Messages (1)
              </h3>
              <div className="space-y-2">
                {tasks.filter(t => t.type === 'message').map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border cursor-pointer transition-all"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      borderColor: 'var(--border-default)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                    }}
                  >
                    <div className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      {task.patient}
                    </div>
                    <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {task.content}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {task.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Refills & paperwork section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <ClipboardList className="w-4 h-4" style={{ color: '#10B981' }} />
                Refills & paperwork (2)
              </h3>
              <div className="space-y-2">
                {tasks.filter(t => t.type !== 'message').map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border cursor-pointer transition-all"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      borderColor: 'var(--border-default)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#10B981';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                    }}
                  >
                    <div className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      {task.patient}
                    </div>
                    <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {task.content}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {task.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unconfirmed appointments modal */}
      {showUnconfirmedModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowUnconfirmedModal(false)}
        >
          <div
            className="w-[500px] rounded-2xl border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Unconfirmed appointments
                </h2>
                <button
                  onClick={() => setShowUnconfirmedModal(false)}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {todaysAppointments.filter(apt => !apt.status.confirmed).map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    {apt.patientName}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {apt.appointmentTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Patient profile drawer */}
      {selectedPatient && (
        <GlobalPatientProfile
          appointment={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}