import { useState, useMemo } from 'react';
import { Phone, PhoneCall, PhoneOff, Clock, Calendar, Filter, Play, RotateCcw, AlertCircle, CheckCircle2, MessageSquare, Mail } from 'lucide-react';
import { UniversalContactCard } from '../components/universal/UniversalContactCard';
import { Appointment } from '../types/appointment';
import { TranscriptPanel } from '../components/voice-ai/TranscriptPanel';
import { LiveCallIndicator } from '../components/voice-ai/LiveCallIndicator';
import { PatientProfileModal } from '../components/patient/PatientProfileModal';

type CallStatus = 'in-progress' | 'confirmed' | 'no-response' | 'failed';
type DateFilter = 'today' | '7d' | '14d' | 'custom';
type StatusFilter = 'all' | 'in-progress' | 'needs-attention' | 'completed';

interface VoiceAIPageProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
}

export function VoiceAIPage({ appointments, onUpdateAppointment }: VoiceAIPageProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [transcriptPatient, setTranscriptPatient] = useState<Appointment | null>(null);
  const [showLiveCall, setShowLiveCall] = useState(false);
  const [activeView, setActiveView] = useState<'calls' | 'messages'>('calls');

  // Filter appointments with voice AI data
  const voiceAIAppointments = useMemo(() => {
    return appointments.filter(apt => apt.voiceCallAttempts && apt.voiceCallAttempts.length > 0);
  }, [appointments]);

  const filteredCalls = useMemo(() => {
    return voiceAIAppointments.filter(call => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'in-progress' && call.status !== 'in-progress') return false;
        if (statusFilter === 'needs-attention' && call.status !== 'no-response' && call.status !== 'failed') return false;
        if (statusFilter === 'completed' && call.status !== 'confirmed') return false;
      }

      // Date filter (simplified for demo)
      if (dateFilter === 'today' && !call.appointmentDate.includes('Today')) return false;

      return true;
    });
  }, [dateFilter, statusFilter]);

  const stats = useMemo(() => {
    const todayCalls = voiceAIAppointments.filter(c => c.appointmentDate.includes('Today'));
    return {
      totalToday: todayCalls.length,
      inProgress: voiceAIAppointments.filter(c => c.status === 'in-progress').length,
      needsAttention: voiceAIAppointments.filter(c => c.status === 'no-response' || c.status === 'failed').length,
      completed: voiceAIAppointments.filter(c => c.status === 'confirmed').length,
    };
  }, []);

  const handleCardClick = (filter: StatusFilter) => {
    setStatusFilter(statusFilter === filter ? 'all' : filter);
  };

  const handlePatientClick = (call: Appointment) => {
    setSelectedPatient({
      id: call.id,
      patientName: call.patientName,
      time: call.appointmentTime,
      phone: call.phone,
      email: call.email,
      provider: call.provider,
      status: {
        confirmed: call.status === 'confirmed',
        intakeComplete: true,
      },
      automationAttempts: call.voiceCallAttempts.length,
    });
  };

  const getStatusBadge = (status: CallStatus) => {
    const configs = {
      'in-progress': {
        bg: 'var(--status-info-bg)',
        color: 'var(--status-info)',
        label: 'In Progress',
      },
      'confirmed': {
        bg: 'var(--status-success-bg)',
        color: 'var(--status-success)',
        label: 'Confirmed',
      },
      'no-response': {
        bg: 'var(--status-warning-bg)',
        color: 'var(--status-warning)',
        label: 'No Response',
      },
      'failed': {
        bg: 'var(--status-error-bg)',
        color: 'var(--status-error)',
        label: 'Failed',
      },
    };

    const config = configs[status];

    return (
      <span
        className="px-2 py-1 rounded text-xs font-medium"
        style={{
          backgroundColor: config.bg,
          color: config.color,
        }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div
        className="border-b sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="font-semibold mb-1 md:mb-2" style={{ color: 'var(--text-primary)' }}>
                Voice AI
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Automated patient confirmations and follow-ups
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Date range */}
              <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                {(['today', '7d', '14d'] as DateFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDateFilter(filter)}
                    className="px-3 py-1.5 rounded text-sm font-medium transition-all"
                    style={{
                      backgroundColor: dateFilter === filter ? 'var(--accent-primary)' : 'transparent',
                      color: dateFilter === filter ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {filter === 'today' ? 'Today' : filter === '7d' ? '7 Days' : '14 Days'}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-3 py-2 rounded-lg border text-sm font-medium"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="all">All Status</option>
                <option value="in-progress">In Progress</option>
                <option value="needs-attention">Needs Attention</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div
              onClick={() => handleCardClick('all')}
              className="p-4 rounded-lg border cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: statusFilter === 'all' ? 'var(--accent-primary)' : 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Total Calls Today
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.totalToday}
              </p>
            </div>

            <div
              onClick={() => handleCardClick('in-progress')}
              className="p-4 rounded-lg border cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: statusFilter === 'in-progress' ? 'var(--accent-primary)' : 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" style={{ color: 'var(--status-info)' }} />
                <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Calls In Progress
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.inProgress}
              </p>
            </div>

            <div
              onClick={() => handleCardClick('needs-attention')}
              className="p-4 rounded-lg border cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: statusFilter === 'needs-attention' ? 'var(--accent-primary)' : 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Needs Attention
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.needsAttention}
              </p>
            </div>

            <div
              onClick={() => handleCardClick('completed')}
              className="p-4 rounded-lg border cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: statusFilter === 'completed' ? 'var(--accent-primary)' : 'var(--border-default)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
                <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Confirmations
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call Activity Table/List */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Call Activity
            <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
              ({filteredCalls.length})
            </span>
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Patient
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Appointment
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Provider
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Last Attempt
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Attempts
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map((call) => (
                  <tr
                    key={call.id}
                    className="border-b transition-all cursor-pointer"
                    style={{ borderColor: 'var(--border-default)' }}
                    onClick={() => handlePatientClick(call)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {call.patientName}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {call.phone}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {call.appointmentDate}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {call.appointmentTime}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {call.provider}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(call.status)}
                    </td>
                    <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {call.lastAttemptTime}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--cf-neutral-20)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {call.voiceCallAttempts.length}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Call manually');
                          }}
                          className="p-2 rounded transition-all"
                          style={{ color: 'var(--accent-primary)' }}
                          title="Call manually"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--accent-primary-bg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <PhoneCall className="w-4 h-4" />
                        </button>
                        {call.transcript && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTranscriptPatient(call);
                            }}
                            className="p-2 rounded transition-all"
                            style={{ color: 'var(--text-secondary)' }}
                            title="Replay last call"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Re-enroll');
                          }}
                          className="p-2 rounded transition-all"
                          style={{ color: 'var(--text-secondary)' }}
                          title="Re-enroll in AI sequence"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCalls.length === 0 && (
              <div className="text-center py-12">
                <Phone className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  No calls found
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden space-y-3">
          {filteredCalls.map((call) => (
            <div
              key={call.id}
              onClick={() => handlePatientClick(call)}
              className="p-4 rounded-lg border transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {call.patientName}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {call.phone}
                  </p>
                </div>
                {getStatusBadge(call.status)}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Appointment</p>
                  <p style={{ color: 'var(--text-primary)' }}>{call.appointmentDate}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{call.appointmentTime}</p>
                </div>
                <div>
                  <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Provider</p>
                  <p style={{ color: 'var(--text-primary)' }}>{call.provider}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {call.lastAttemptTime} • {call.voiceCallAttempts.length} attempt{call.voiceCallAttempts.length > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Call');
                    }}
                    className="p-2 rounded transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredCalls.length === 0 && (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                No calls found
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Universal Contact Card */}
      {selectedPatient && (
        <UniversalContactCard
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onCall={(p) => console.log('Call', p.patientName)}
          onSendIntake={(p) => console.log('Send intake', p.patientName)}
          onReEnroll={(p) => console.log('Re-enroll', p.patientName)}
          onViewIntake={(p) => console.log('View intake', p.patientName)}
          onJumpToCalendar={(p) => console.log('Jump to calendar', p.patientName)}
        />
      )}

      {/* Transcript Panel */}
      {transcriptPatient && (
        <TranscriptPanel
          patient={transcriptPatient}
          onClose={() => setTranscriptPatient(null)}
        />
      )}

      {/* Live Call Indicator */}
      {showLiveCall && (
        <LiveCallIndicator
          patient={selectedPatient}
          onClose={() => setShowLiveCall(false)}
        />
      )}

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <PatientProfileModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}