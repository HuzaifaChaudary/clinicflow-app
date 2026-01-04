import { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { mockDoctors } from '../data/enhancedMockData';
import { Appointment } from '../types/appointment';
import { getHighSignalEscalations } from '../utils/roleFilters';
import { 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Mail,
  Clock,
  ChevronDown,
  Radio,
} from 'lucide-react';

interface DoctorVoiceAIProps {
  appointments: Appointment[];
}

export function DoctorVoiceAI({ appointments }: DoctorVoiceAIProps) {
  const { activeDoctorId } = useRole();
  const [expandedTranscript, setExpandedTranscript] = useState<string | null>(null);

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

  // 🎯 Use appointments directly - already filtered by role in App.tsx
  // No need to re-filter here
  const doctorAppointments = appointments;
  
  // Get high-signal escalations that need doctor attention
  const escalations = getHighSignalEscalations(appointments, currentDoctor.name);
  
  // Get all voice interactions for summary
  const allVoiceCalls = doctorAppointments.flatMap(apt => 
    (apt.voiceCallAttempts || []).map(call => ({
      ...call,
      patientName: apt.patientName,
      appointmentTime: apt.time,
    }))
  );

  const liveCalls = allVoiceCalls.filter(call => call.status === 'in-progress');
  const completedCalls = allVoiceCalls.filter(call => call.status === 'completed');
  const totalConfirmed = doctorAppointments.filter(apt => apt.status.confirmed).length;
  const totalIntakeComplete = doctorAppointments.filter(apt => apt.status.intakeComplete).length;

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
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Voice AI Activity
          </h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Your patient interactions and alerts
          </p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* AI Status Summary (Read-Only) */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            AI Status Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-canvas)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-success)' }} />
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Confirmations
                </p>
              </div>
              <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {totalConfirmed}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Appointments confirmed by AI
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-canvas)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-success)' }} />
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Intake Complete
                </p>
              </div>
              <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {totalIntakeComplete}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Forms completed via AI
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-canvas)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Total Calls
                </p>
              </div>
              <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {allVoiceCalls.length}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Voice interactions handled
              </p>
            </div>
          </div>
        </div>

        {/* Live Calls (If any) */}
        {liveCalls.length > 0 && (
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--status-error)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Radio className="w-5 h-5 animate-pulse" style={{ color: 'var(--status-error)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Live Calls
              </h2>
            </div>

            <div className="space-y-3">
              {liveCalls.map((call) => (
                <div
                  key={call.id}
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {call.patientName}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Appointment at {call.appointmentTime}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2"
                      style={{
                        backgroundColor: 'var(--status-error)',
                        color: 'white',
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      Live
                    </span>
                  </div>

                  {call.transcript && (
                    <div
                      className="p-3 rounded-lg text-sm font-mono"
                      style={{
                        backgroundColor: 'var(--cf-dark-5)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {call.transcript.split('\n').slice(-4).join('\n')}
                    </div>
                  )}

                  <button
                    className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                    View Full Transcript
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Needs Your Attention (High-Signal Escalations) */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: escalations.length > 0 ? 'var(--status-warning)' : 'var(--border-default)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle 
                className="w-5 h-5" 
                style={{ color: escalations.length > 0 ? 'var(--status-warning)' : 'var(--text-muted)' }} 
              />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Needs Your Attention
              </h2>
              {escalations.length > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--status-warning)',
                    color: 'white',
                  }}
                >
                  {escalations.length}
                </span>
              )}
            </div>
          </div>

          {escalations.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--status-success)' }} />
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                All clear!
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                No patient interactions require your attention
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {escalations.map((escalation) => (
                <div
                  key={escalation.appointmentId}
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {escalation.patientName}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--status-warning)' }}>
                        {escalation.reason}
                      </p>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(escalation.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>

                  {escalation.snippet && (
                    <div
                      className="p-3 rounded-lg text-sm mb-3"
                      style={{
                        backgroundColor: 'var(--cf-dark-5)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                        Last interaction:
                      </p>
                      <p className="font-mono text-xs">{escalation.snippet}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1"
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
                      Respond via Message
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                      Call Patient
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transcripts (Scoped & Minimal) */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Recent Interactions
          </h2>

          {completedCalls.length === 0 ? (
            <div className="py-8 text-center">
              <Phone className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                No interactions yet
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Voice AI interactions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedCalls.slice(0, 10).map((call) => {
                const isExpanded = expandedTranscript === call.id;

                return (
                  <div
                    key={call.id}
                    className="rounded-xl border overflow-hidden"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <button
                      onClick={() => setExpandedTranscript(isExpanded ? null : call.id)}
                      className="w-full p-4 flex items-center justify-between text-left transition-colors"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: call.status === 'completed' 
                              ? 'var(--status-success-bg)' 
                              : 'var(--status-error-bg)',
                          }}
                        >
                          {call.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--status-success)' }} />
                          ) : (
                            <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-error)' }} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {call.patientName}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              <Clock className="w-3 h-3 inline mr-1" />
                              {call.duration}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {new Date(call.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronDown
                        className="w-5 h-5 transition-transform flex-shrink-0"
                        style={{
                          color: 'var(--text-secondary)',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </button>

                    {isExpanded && call.transcript && (
                      <div
                        className="px-4 pb-4 border-t"
                        style={{
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <div
                          className="mt-3 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap"
                          style={{
                            backgroundColor: 'var(--cf-dark-5)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {call.transcript}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: 'var(--cf-blue-5)',
            borderColor: 'var(--cf-blue-30)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong>Note:</strong> Voice AI settings and automation rules are managed by your admin team. 
            You can adjust your personal notification preferences in Settings.
          </p>
        </div>
      </div>
    </div>
  );
}