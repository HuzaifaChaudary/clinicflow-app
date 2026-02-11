import { useState } from 'react';
import { X, Phone, Mail, Calendar, FileText, MessageSquare, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface PatientProfileModalProps {
  appointment: Appointment;
  allAppointments?: Appointment[]; // All appointments for this patient (history)
  onClose: () => void;
  onCall: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onSendIntake: (appointment: Appointment) => void;
  onViewTranscript?: (appointment: Appointment) => void;
}

export function PatientProfileModal({
  appointment,
  allAppointments = [],
  onClose,
  onCall,
  onReschedule,
  onCancel,
  onSendIntake,
  onViewTranscript,
}: PatientProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'voice-ai' | 'messages'>('details');

  // Get patient's appointment history
  const patientHistory = allAppointments.filter(
    apt => apt.patientName === appointment.patientName
  );

  const voiceCallAttempts = appointment.voiceCallAttempts || [];
  const messages = appointment.messages || [];
  const cancellationHistory = appointment.cancellationHistory || [];

  const tabs = [
    { id: 'details' as const, label: 'Details', badge: null },
    { id: 'history' as const, label: 'History', badge: patientHistory.length },
    { id: 'voice-ai' as const, label: 'Voice AI', badge: voiceCallAttempts.length },
    { id: 'messages' as const, label: 'Messages', badge: messages.length },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--surface-card)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {appointment.patientName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {appointment.patientPhone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{appointment.patientPhone}</span>
                  </div>
                )}
                {appointment.patientEmail && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{appointment.patientEmail}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all ml-4"
              style={{
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-secondary)',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b -mb-5" style={{ borderColor: 'var(--border-default)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-3 font-medium text-sm transition-all relative"
                style={{
                  color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                {tab.label}
                {tab.badge !== null && tab.badge > 0 && (
                  <span
                    className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                      color: 'white',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Current Appointment */}
              <div>
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Current Appointment
                </h3>
                <div
                  className="p-4 rounded-lg border space-y-3"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Date & Time</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {appointment.date || 'Today'} • {appointment.time}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Provider</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {appointment.provider}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Visit Type</p>
                      <p className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                        {appointment.visitType}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Duration</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {appointment.duration || 30} minutes
                      </p>
                    </div>
                  </div>

                  {/* Status indicators */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div
                      className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5"
                      style={{
                        backgroundColor: appointment.status.confirmed
                          ? 'var(--status-success-bg)'
                          : 'var(--status-warning-bg)',
                        color: appointment.status.confirmed
                          ? 'var(--status-success)'
                          : 'var(--status-warning)',
                      }}
                    >
                      {appointment.status.confirmed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      {appointment.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
                    </div>
                    <div
                      className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5"
                      style={{
                        backgroundColor: appointment.status.intakeComplete
                          ? 'var(--status-success-bg)'
                          : 'var(--status-warning-bg)',
                        color: appointment.status.intakeComplete
                          ? 'var(--status-success)'
                          : 'var(--status-warning)',
                      }}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {appointment.status.intakeComplete ? 'Intake Complete' : 'Intake Pending'}
                    </div>
                    {appointment.arrived && (
                      <div
                        className="px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5"
                        style={{
                          backgroundColor: 'var(--status-info-bg)',
                          color: 'var(--status-info)',
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Arrived
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onCall(appointment)}
                    className="px-4 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      borderColor: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    <Phone className="w-4 h-4" />
                    Call Patient
                  </button>
                  {!appointment.status.intakeComplete && (
                    <button
                      onClick={() => onSendIntake(appointment)}
                      className="px-4 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all"
                      style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      Send Intake
                    </button>
                  )}
                  <button
                    onClick={() => onReschedule(appointment)}
                    className="px-4 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all"
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    Reschedule
                  </button>
                  <button
                    onClick={() => onCancel(appointment)}
                    className="px-4 py-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all"
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--status-error)',
                      color: 'var(--status-error)',
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>

              {/* Cancellation History */}
              {cancellationHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                    Cancellation History ({cancellationHistory.length})
                  </h3>
                  <div className="space-y-2">
                    {cancellationHistory.map((cancellation, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--surface-canvas)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <div className="flex items-start justify-between text-sm">
                          <div>
                            <p className="font-medium capitalize mb-1" style={{ color: 'var(--text-primary)' }}>
                              {cancellation.type.replace(/-/g, ' ')}
                            </p>
                            {cancellation.note && (
                              <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                                {cancellation.note}
                              </p>
                            )}
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {new Date(cancellation.timestamp).toLocaleDateString()} by {cancellation.cancelledBy}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Appointment History ({patientHistory.length})
              </h3>
              {patientHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>No appointment history</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {patientHistory.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: apt.id === appointment.id ? 'var(--accent-primary-bg)' : 'var(--surface-canvas)',
                        borderColor: apt.id === appointment.id ? 'var(--accent-primary)' : 'var(--border-default)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                            {apt.date || 'Today'} • {apt.time}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {apt.provider} • {apt.visitType}
                          </p>
                        </div>
                        {apt.cancelled && (
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--status-error-bg)',
                              color: 'var(--status-error)',
                            }}
                          >
                            Cancelled
                          </span>
                        )}
                        {!apt.cancelled && apt.id === appointment.id && (
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--status-info-bg)',
                              color: 'var(--status-info)',
                            }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      {apt.cancellationReason && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Reason: {apt.cancellationReason.type.replace(/-/g, ' ')}
                          {apt.cancellationReason.note && ` - ${apt.cancellationReason.note}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Voice AI Tab */}
          {activeTab === 'voice-ai' && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Voice Call History ({voiceCallAttempts.length})
              </h3>
              {voiceCallAttempts.length === 0 ? (
                <div className="text-center py-8">
                  <Phone className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>No voice call attempts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {voiceCallAttempts.map((call) => (
                    <div
                      key={call.id}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: call.needsAttention ? 'var(--status-warning)' : 'var(--border-default)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {new Date(call.timestamp).toLocaleString()}
                            </p>
                            <span
                              className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                              style={{
                                backgroundColor:
                                  call.status === 'completed'
                                    ? 'var(--status-success-bg)'
                                    : call.status === 'in-progress'
                                    ? 'var(--status-info-bg)'
                                    : 'var(--status-warning-bg)',
                                color:
                                  call.status === 'completed'
                                    ? 'var(--status-success)'
                                    : call.status === 'in-progress'
                                    ? 'var(--status-info)'
                                    : 'var(--status-warning)',
                              }}
                            >
                              {call.status.replace(/-/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Duration: {call.duration}
                          </p>
                          {call.needsAttention && call.attentionReason && (
                            <p className="text-xs mt-1" style={{ color: 'var(--status-warning)' }}>
                              ⚠️ {call.attentionReason.replace(/-/g, ' ')}
                            </p>
                          )}
                        </div>
                        {call.transcript && onViewTranscript && (
                          <button
                            onClick={() => onViewTranscript(appointment)}
                            className="px-3 py-1.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--accent-primary)',
                              color: 'white',
                            }}
                          >
                            View Transcript
                          </button>
                        )}
                      </div>
                      {call.transcript && (
                        <div
                          className="mt-3 p-3 rounded text-xs font-mono whitespace-pre-wrap"
                          style={{
                            backgroundColor: 'var(--surface-card)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {call.transcript}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Message History ({messages.length})
              </h3>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>No messages</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg border ${
                        msg.direction === 'outbound' ? 'ml-8' : 'mr-8'
                      }`}
                      style={{
                        backgroundColor:
                          msg.direction === 'outbound'
                            ? 'var(--accent-primary-bg)'
                            : 'var(--surface-canvas)',
                        borderColor: msg.needsResponse ? 'var(--status-warning)' : 'var(--border-default)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                            style={{
                              backgroundColor:
                                msg.sender === 'ai'
                                  ? 'var(--status-info-bg)'
                                  : msg.sender === 'patient'
                                  ? 'var(--cf-neutral-20)'
                                  : 'var(--accent-primary-bg)',
                              color:
                                msg.sender === 'ai'
                                  ? 'var(--status-info)'
                                  : msg.sender === 'patient'
                                  ? 'var(--text-primary)'
                                  : 'var(--accent-primary)',
                            }}
                          >
                            {msg.sender}
                          </span>
                          <span className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
                            {msg.type}
                          </span>
                        </div>
                        {msg.needsResponse && (
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--status-warning-bg)',
                              color: 'var(--status-warning)',
                            }}
                          >
                            Needs Response
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                        {msg.content}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
