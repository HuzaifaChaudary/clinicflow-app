import { useState, useMemo } from 'react';
import { Phone, Clock, MessageSquare, AlertCircle, CheckCircle, Pause, ChevronRight, Play } from 'lucide-react';
import { Appointment, CancellationReason } from '../types/appointment';
import { EnhancedVoiceCallCard } from '../components/voice-ai/EnhancedVoiceCallCard';
import { TranscriptPanel } from '../components/voice-ai/TranscriptPanel';
import { LiveCallIndicator } from '../components/voice-ai/LiveCallIndicator';
import { PatientProfileModal } from '../components/patient/PatientProfileModal';

type DateFilter = 'today' | '7d' | '14d';
type StatusFilter = 'all' | 'in-progress' | 'needs-attention' | 'completed';
type ViewMode = 'calls' | 'messages';

interface VoiceAIPageEnhancedProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
  onReschedule: (appointmentId: string, newTime: string, newProvider: string, newDate: string) => void;
  onCancel: (appointmentId: string, reason: CancellationReason) => void;
}

export function VoiceAIPageEnhanced({
  appointments,
  onUpdateAppointment,
  onReschedule,
  onCancel,
}: VoiceAIPageEnhancedProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('calls');
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [transcriptPatient, setTranscriptPatient] = useState<Appointment | null>(null);
  const [liveCallPatient, setLiveCallPatient] = useState<Appointment | null>(null);

  // Filter appointments with voice AI data
  const voiceAIAppointments = useMemo(() => {
    return appointments.filter(apt => 
      (apt.voiceCallAttempts && apt.voiceCallAttempts.length > 0) || 
      (apt.messages && apt.messages.length > 0)
    );
  }, [appointments]);

  // Get appointments with messages that need response
  const messageAppointments = useMemo(() => {
    return appointments.filter(apt => 
      apt.messages && apt.messages.some(msg => msg.needsResponse)
    );
  }, [appointments]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = voiceAIAppointments.filter(apt => apt.date === '2026-01-01'); // Today
    const inProgress = voiceAIAppointments.filter(apt => 
      apt.voiceCallAttempts?.some(call => call.status === 'in-progress')
    );
    const needsAttention = voiceAIAppointments.filter(apt => 
      apt.voiceCallAttempts?.some(call => call.needsAttention) ||
      apt.messages?.some(msg => msg.needsResponse)
    );
    const confirmed = voiceAIAppointments.filter(apt => apt.status.confirmed);

    return {
      totalToday: today.length,
      inProgress: inProgress.length,
      needsAttention: needsAttention.length,
      completed: confirmed.length,
    };
  }, [voiceAIAppointments]);

  // Filter based on status
  const filteredAppointments = useMemo(() => {
    return voiceAIAppointments.filter(apt => {
      if (statusFilter === 'in-progress') {
        return apt.voiceCallAttempts?.some(call => call.status === 'in-progress');
      }
      if (statusFilter === 'needs-attention') {
        return apt.voiceCallAttempts?.some(call => call.needsAttention) ||
               apt.messages?.some(msg => msg.needsResponse);
      }
      if (statusFilter === 'completed') {
        return apt.status.confirmed;
      }
      return true;
    });
  }, [voiceAIAppointments, statusFilter]);

  const handleCardClick = (filter: StatusFilter) => {
    setStatusFilter(statusFilter === filter ? 'all' : filter);
  };

  const getLastAttemptInfo = (apt: Appointment) => {
    if (!apt.voiceCallAttempts || apt.voiceCallAttempts.length === 0) {
      return { time: '-', count: 0, duration: '-' };
    }
    
    const lastCall = apt.voiceCallAttempts[apt.voiceCallAttempts.length - 1];
    const timestamp = new Date(lastCall.timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    let timeAgo = '';
    if (diffMinutes < 1) timeAgo = 'Just now';
    else if (diffMinutes < 60) timeAgo = `${diffMinutes}m ago`;
    else if (diffMinutes < 1440) timeAgo = `${Math.floor(diffMinutes / 60)}h ago`;
    else timeAgo = `${Math.floor(diffMinutes / 1440)}d ago`;
    
    return {
      time: timeAgo,
      count: apt.voiceCallAttempts.length,
      duration: lastCall.duration,
    };
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

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                <button
                  onClick={() => setViewMode('calls')}
                  className="px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: viewMode === 'calls' ? 'var(--accent-primary)' : 'transparent',
                    color: viewMode === 'calls' ? 'white' : 'var(--text-primary)',
                  }}
                >
                  <Phone className="w-4 h-4" />
                  Calls
                </button>
                <button
                  onClick={() => setViewMode('messages')}
                  className="px-4 py-2 rounded text-sm font-medium transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: viewMode === 'messages' ? 'var(--accent-primary)' : 'transparent',
                    color: viewMode === 'messages' ? 'white' : 'var(--text-primary)',
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                  {messageAppointments.length > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: viewMode === 'messages' ? 'rgba(255,255,255,0.2)' : 'var(--status-error)',
                        color: 'white',
                      }}
                    >
                      {messageAppointments.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { filter: 'all' as StatusFilter, icon: Phone, label: 'Total Calls Today', value: stats.totalToday, color: 'var(--accent-primary)' },
              { filter: 'in-progress' as StatusFilter, icon: Clock, label: 'Calls In Progress', value: stats.inProgress, color: 'var(--status-info)' },
              { filter: 'needs-attention' as StatusFilter, icon: AlertCircle, label: 'Needs Attention', value: stats.needsAttention, color: 'var(--status-warning)' },
              { filter: 'completed' as StatusFilter, icon: CheckCircle, label: 'Confirmations', value: stats.completed, color: 'var(--status-success)' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.filter}
                  onClick={() => handleCardClick(card.filter)}
                  className="p-4 rounded-lg border cursor-pointer transition-all"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: statusFilter === card.filter ? 'var(--accent-primary)' : 'var(--border-default)',
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
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                    <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {card.label}
                    </p>
                  </div>
                  <p className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content - Calls View */}
      {viewMode === 'calls' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Call Activity
              <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                ({filteredAppointments.length})
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
                    <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Patient</th>
                    <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Appointment</th>
                    <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Provider</th>
                    <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Last Call</th>
                    <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Duration</th>
                    <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Attempts</th>
                    <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => {
                    const attemptInfo = getLastAttemptInfo(apt);
                    const hasLiveCall = apt.voiceCallAttempts?.some(call => call.status === 'in-progress');
                    const needsAttention = apt.voiceCallAttempts?.some(call => call.needsAttention);
                    
                    return (
                      <tr
                        key={apt.id}
                        className="border-b transition-all cursor-pointer"
                        style={{ borderColor: 'var(--border-default)' }}
                        onClick={() => setSelectedPatient(apt)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {hasLiveCall && (
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--status-info)' }}></span>
                                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--status-info)' }}></span>
                              </span>
                            )}
                            <div>
                              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {apt.patientName}
                              </p>
                              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {apt.patientPhone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {apt.date || 'Today'}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {apt.time}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                          {apt.provider}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {attemptInfo.time}
                            </span>
                            {needsAttention && (
                              <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {attemptInfo.duration}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--cf-neutral-20)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {attemptInfo.count}
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
                              <Phone className="w-4 h-4" />
                            </button>
                            {apt.voiceCallAttempts && apt.voiceCallAttempts.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTranscriptPatient(apt);
                                }}
                                className="p-2 rounded transition-all"
                                style={{ color: 'var(--text-secondary)' }}
                                title="View transcript"
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
                              <Pause className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredAppointments.length === 0 && (
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

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filteredAppointments.map((apt) => {
              const attemptInfo = getLastAttemptInfo(apt);
              const hasLiveCall = apt.voiceCallAttempts?.some(call => call.status === 'in-progress');
              
              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedPatient(apt)}
                  className="p-4 rounded-lg border transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 flex items-start gap-2">
                      {hasLiveCall && (
                        <span className="relative flex h-2 w-2 mt-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--status-info)' }}></span>
                          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--status-info)' }}></span>
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {apt.patientName}
                        </h3>
                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                          {apt.patientPhone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Appointment</p>
                      <p style={{ color: 'var(--text-primary)' }}>{apt.date || 'Today'}</p>
                      <p style={{ color: 'var(--text-secondary)' }}>{apt.time}</p>
                    </div>
                    <div>
                      <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Last Call</p>
                      <p style={{ color: 'var(--text-primary)' }}>{attemptInfo.time}</p>
                      <p style={{ color: 'var(--text-secondary)' }}>{attemptInfo.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {attemptInfo.count} attempt{attemptInfo.count > 1 ? 's' : ''}
                    </div>
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
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content - Messages View */}
      {viewMode === 'messages' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Message Inbox
              <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                ({messageAppointments.length} need response)
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            {messageAppointments.map((apt) => {
              const needsResponseMsg = apt.messages?.find(msg => msg.needsResponse);
              if (!needsResponseMsg) return null;
              
              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedPatient(apt)}
                  className="p-4 rounded-lg border cursor-pointer transition-all"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--status-warning)',
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--accent-primary-bg)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {apt.patientName}
                        </p>
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--status-warning-bg)',
                            color: 'var(--status-warning)',
                          }}
                        >
                          Needs Response
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                        {apt.patientPhone} • {apt.time}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {needsResponseMsg.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTranscriptPatient(apt);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        color: 'white',
                      }}
                    >
                      Reply
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Call');
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--surface-hover)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Call Instead
                    </button>
                  </div>
                </div>
              );
            })}
            
            {messageAppointments.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  All caught up!
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No messages need your attention
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals & Panels */}
      {selectedPatient && (
        <PatientProfileModal
          appointment={selectedPatient}
          allAppointments={appointments}
          onClose={() => setSelectedPatient(null)}
          onCall={(apt) => {
            console.log('Call', apt.patientName);
            setSelectedPatient(null);
          }}
          onReschedule={(apt) => {
            console.log('Reschedule', apt.patientName);
          }}
          onCancel={(apt) => {
            console.log('Cancel', apt.patientName);
          }}
          onSendIntake={(apt) => {
            console.log('Send intake', apt.patientName);
          }}
          onViewTranscript={(apt) => {
            setTranscriptPatient(apt);
          }}
        />
      )}

      {transcriptPatient && (
        <TranscriptPanel
          appointment={transcriptPatient}
          onClose={() => setTranscriptPatient(null)}
        />
      )}

      {liveCallPatient && (
        <LiveCallIndicator
          patientName={liveCallPatient.patientName}
          duration="0:45"
          currentlySpeaking="ai"
          transcript="AI: Hello, this is Clinicflow calling to confirm your appointment..."
          onClose={() => setLiveCallPatient(null)}
        />
      )}
    </div>
  );
}