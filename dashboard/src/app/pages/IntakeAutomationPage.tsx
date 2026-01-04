import { useState } from 'react';
import { 
  Play, 
  Pause, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  MessageSquare, 
  Phone, 
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  Send,
  RotateCcw
} from 'lucide-react';
import { Button } from '../components/foundation/Button';

interface PatientReminder {
  id: string;
  patientName: string;
  appointmentTime: string;
  appointmentDate: string;
  intakeStatus: 'awaiting-response' | 'in-progress' | 'submitted' | 'needs-attention';
  lastReminder: {
    channel: 'sms' | 'voice' | 'email';
    time: string;
    outcome: 'delivered' | 'answered' | 'voicemail' | 'no-response';
  };
  timeline: ReminderEvent[];
}

interface ReminderEvent {
  id: string;
  channel: 'sms' | 'voice' | 'email';
  timestamp: string;
  outcome: 'delivered' | 'answered' | 'voicemail' | 'no-response';
  transcript?: {
    message: string;
    response?: string;
  };
}

const mockPatients: PatientReminder[] = [
  {
    id: '1',
    patientName: 'Michael Brown',
    appointmentTime: '9:30 AM',
    appointmentDate: 'Tomorrow',
    intakeStatus: 'in-progress',
    lastReminder: {
      channel: 'sms',
      time: '4 hours ago',
      outcome: 'delivered',
    },
    timeline: [
      {
        id: 'e1',
        channel: 'sms',
        timestamp: '2 days ago',
        outcome: 'delivered',
        transcript: {
          message: 'Hi Michael, please complete your intake form for your appointment on Jan 3 at 9:30 AM. Click here: [link]',
        },
      },
      {
        id: 'e2',
        channel: 'voice',
        timestamp: '1 day ago',
        outcome: 'voicemail',
        transcript: {
          message: 'Hello Michael, this is Westside Medical Center. We noticed you haven\'t completed your intake form yet. Please complete it before your appointment tomorrow.',
        },
      },
      {
        id: 'e3',
        channel: 'sms',
        timestamp: '4 hours ago',
        outcome: 'delivered',
        transcript: {
          message: 'Reminder: Your appointment is tomorrow at 9:30 AM. Please complete your intake form: [link]',
          response: 'Started form, will finish tonight',
        },
      },
    ],
  },
  {
    id: '2',
    patientName: 'Lisa Anderson',
    appointmentTime: '10:00 AM',
    appointmentDate: 'Tomorrow',
    intakeStatus: 'needs-attention',
    lastReminder: {
      channel: 'voice',
      time: '6 hours ago',
      outcome: 'no-response',
    },
    timeline: [
      {
        id: 'e1',
        channel: 'sms',
        timestamp: '2 days ago',
        outcome: 'delivered',
      },
      {
        id: 'e2',
        channel: 'voice',
        timestamp: '1 day ago',
        outcome: 'no-response',
      },
      {
        id: 'e3',
        channel: 'voice',
        timestamp: '6 hours ago',
        outcome: 'no-response',
      },
    ],
  },
  {
    id: '3',
    patientName: 'Thomas Lee',
    appointmentTime: '1:00 PM',
    appointmentDate: 'Tomorrow',
    intakeStatus: 'awaiting-response',
    lastReminder: {
      channel: 'sms',
      time: '2 hours ago',
      outcome: 'delivered',
    },
    timeline: [
      {
        id: 'e1',
        channel: 'sms',
        timestamp: '2 hours ago',
        outcome: 'delivered',
        transcript: {
          message: 'Hi Thomas, please complete your intake form for tomorrow\'s appointment at 1:00 PM: [link]',
        },
      },
    ],
  },
  {
    id: '4',
    patientName: 'Patricia Miller',
    appointmentTime: '4:30 PM',
    appointmentDate: 'Tomorrow',
    intakeStatus: 'awaiting-response',
    lastReminder: {
      channel: 'email',
      time: '8 hours ago',
      outcome: 'delivered',
    },
    timeline: [
      {
        id: 'e1',
        channel: 'sms',
        timestamp: '3 days ago',
        outcome: 'delivered',
      },
      {
        id: 'e2',
        channel: 'voice',
        timestamp: '1 day ago',
        outcome: 'voicemail',
      },
      {
        id: 'e3',
        channel: 'email',
        timestamp: '8 hours ago',
        outcome: 'delivered',
      },
    ],
  },
];

export function IntakeAutomationPage() {
  const [automationActive, setAutomationActive] = useState(true);
  const [expandedPatients, setExpandedPatients] = useState<string[]>([]);

  const togglePatient = (patientId: string) => {
    setExpandedPatients((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId]
    );
  };

  const getStatusColor = (status: PatientReminder['intakeStatus']) => {
    switch (status) {
      case 'submitted':
        return 'var(--accent-primary)';
      case 'in-progress':
        return 'var(--status-info)';
      case 'awaiting-response':
        return 'var(--text-muted)';
      case 'needs-attention':
        return 'var(--status-warning)';
    }
  };

  const getStatusLabel = (status: PatientReminder['intakeStatus']) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'in-progress':
        return 'In Progress';
      case 'awaiting-response':
        return 'Awaiting Response';
      case 'needs-attention':
        return 'Needs Attention';
    }
  };

  const getChannelIcon = (channel: 'sms' | 'voice' | 'email') => {
    switch (channel) {
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'voice':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'delivered':
      case 'answered':
        return 'var(--accent-primary)';
      case 'voicemail':
        return 'var(--status-info)';
      case 'no-response':
        return 'var(--status-warning)';
      default:
        return 'var(--text-muted)';
    }
  };

  const needsAttentionCount = mockPatients.filter(
    (p) => p.intakeStatus === 'needs-attention'
  ).length;

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ color: 'var(--text-primary)' }}>Intake Automation</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mt-2">
          AI-assisted patient reminders and intake completion tracking
        </p>
      </div>

      {/* Automation Status Panel */}
      <div
        className="glass p-6 mb-6"
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: automationActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  }}
                />
                {automationActive && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping-slow"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                    }}
                  />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  {automationActive ? 'Automation Active' : 'Automation Paused'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {automationActive
                    ? 'System is monitoring and sending reminders'
                    : 'No reminders will be sent'}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: 'var(--border-default)',
              }}
            />

            {/* Current Rule */}
            <div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
                className="mb-1"
              >
                Current Rule
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                }}
              >
                Remind if intake not submitted 24h before visit
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: 'var(--border-default)',
              }}
            />

            {/* Channel Priority */}
            <div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
                className="mb-1"
              >
                Channel Priority
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                  }}
                >
                  <MessageSquare className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>SMS</span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                  }}
                >
                  <Phone className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Voice</span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                  }}
                >
                  <Mail className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Email</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {needsAttentionCount > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: 'var(--status-warning-bg)',
                }}
              >
                <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--status-warning)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  {needsAttentionCount} patient{needsAttentionCount > 1 ? 's' : ''} need attention
                </span>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              icon={Settings}
              iconPosition="left"
            >
              Edit Rules
            </Button>
            <Button
              variant={automationActive ? 'ghost' : 'primary'}
              size="sm"
              icon={automationActive ? Pause : Play}
              iconPosition="left"
              onClick={() => setAutomationActive(!automationActive)}
            >
              {automationActive ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </div>
      </div>

      {/* Patient Reminder Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: 'var(--text-primary)' }}>Patient Reminder Timeline</h3>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {mockPatients.length} patients tracked
          </div>
        </div>

        <div className="space-y-3">
          {mockPatients.map((patient) => (
            <div
              key={patient.id}
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              {/* Collapsed Row */}
              <button
                onClick={() => togglePatient(patient.id)}
                className="w-full flex items-center gap-4 p-4 transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center justify-center w-5 h-5">
                  {expandedPatients.includes(patient.id) ? (
                    <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  ) : (
                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  )}
                </div>

                <div className="flex-1 grid grid-cols-4 gap-4 text-left">
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {patient.patientName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {patient.appointmentDate} • {patient.appointmentTime}
                    </div>
                  </div>

                  <div>
                    <div
                      className="inline-flex items-center px-2.5 py-1 rounded-md"
                      style={{
                        backgroundColor:
                          patient.intakeStatus === 'needs-attention'
                            ? 'var(--status-warning-bg)'
                            : patient.intakeStatus === 'in-progress'
                            ? 'var(--status-info-bg)'
                            : 'var(--surface-canvas)',
                        color: getStatusColor(patient.intakeStatus),
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {getStatusLabel(patient.intakeStatus)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center justify-center p-1.5 rounded"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {getChannelIcon(patient.lastReminder.channel)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {patient.lastReminder.channel.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {patient.lastReminder.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                      }}
                    >
                      {patient.lastReminder.outcome === 'delivered' ||
                      patient.lastReminder.outcome === 'answered' ? (
                        <CheckCircle2
                          className="w-3 h-3"
                          style={{ color: getOutcomeColor(patient.lastReminder.outcome) }}
                        />
                      ) : (
                        <AlertCircle
                          className="w-3 h-3"
                          style={{ color: getOutcomeColor(patient.lastReminder.outcome) }}
                        />
                      )}
                      <span
                        style={{
                          fontSize: '12px',
                          color: getOutcomeColor(patient.lastReminder.outcome),
                        }}
                      >
                        {patient.lastReminder.outcome === 'delivered' && 'Delivered'}
                        {patient.lastReminder.outcome === 'answered' && 'Answered'}
                        {patient.lastReminder.outcome === 'voicemail' && 'Voicemail'}
                        {patient.lastReminder.outcome === 'no-response' && 'No response'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedPatients.includes(patient.id) && (
                <div
                  className="px-4 pb-4"
                  style={{
                    borderTop: '1px solid var(--border-default)',
                    backgroundColor: 'var(--surface-canvas)',
                  }}
                >
                  <div className="pt-4">
                    {/* Timeline */}
                    <div className="mb-5">
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                        className="mb-3"
                      >
                        Reminder Timeline
                      </div>
                      <div className="space-y-3">
                        {patient.timeline.map((event, index) => (
                          <div key={event.id} className="flex gap-3">
                            {/* Timeline Line */}
                            <div className="flex flex-col items-center">
                              <div
                                className="flex items-center justify-center p-2 rounded-lg"
                                style={{
                                  backgroundColor: 'var(--surface-card)',
                                  color: 'var(--accent-primary)',
                                }}
                              >
                                {getChannelIcon(event.channel)}
                              </div>
                              {index < patient.timeline.length - 1 && (
                                <div
                                  style={{
                                    width: '2px',
                                    height: '100%',
                                    minHeight: '40px',
                                    backgroundColor: 'var(--border-default)',
                                    margin: '4px 0',
                                  }}
                                />
                              )}
                            </div>

                            {/* Event Content */}
                            <div
                              className="flex-1 p-3 rounded-lg"
                              style={{
                                backgroundColor: 'var(--surface-card)',
                                border: '1px solid var(--border-subtle)',
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    style={{
                                      fontSize: '13px',
                                      color: 'var(--text-primary)',
                                      fontWeight: 'var(--font-weight-medium)',
                                    }}
                                  >
                                    {event.channel.toUpperCase()} Reminder
                                  </span>
                                  <div
                                    className="px-2 py-0.5 rounded"
                                    style={{
                                      backgroundColor: 'var(--surface-canvas)',
                                      color: getOutcomeColor(event.outcome),
                                      fontSize: '11px',
                                      fontWeight: 'var(--font-weight-medium)',
                                    }}
                                  >
                                    {event.outcome}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {event.timestamp}
                                  </span>
                                </div>
                              </div>

                              {event.transcript && (
                                <div className="space-y-2">
                                  <div
                                    className="p-2 rounded"
                                    style={{
                                      backgroundColor: 'var(--surface-canvas)',
                                      fontSize: '13px',
                                      color: 'var(--text-secondary)',
                                      lineHeight: '1.5',
                                    }}
                                  >
                                    {event.transcript.message}
                                  </div>
                                  {event.transcript.response && (
                                    <div
                                      className="p-2 rounded"
                                      style={{
                                        backgroundColor: 'var(--status-info-bg)',
                                        fontSize: '13px',
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.5',
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: 'var(--accent-primary)',
                                          fontWeight: 'var(--font-weight-medium)',
                                        }}
                                      >
                                        Patient:{' '}
                                      </span>
                                      {event.transcript.response}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <Button variant="secondary" size="sm" icon={Send} iconPosition="left">
                        Re-send Link
                      </Button>
                      <Button variant="secondary" size="sm" icon={RotateCcw} iconPosition="left">
                        Switch Channel
                      </Button>
                      <Button variant="ghost" size="sm" icon={Pause} iconPosition="left">
                        Pause Reminders
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
