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
  ArrowLeft,
  Send,
  RotateCcw,
  User
} from 'lucide-react';
import { UniversalContactCard } from '../components/universal/UniversalContactCard';

interface PatientReminder {
  id: string;
  patientName: string;
  appointmentTime: string;
  appointmentDate: string;
  phone: string;
  email?: string;
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
  outcome: 'delivered' | 'answered' | 'voicemail' | 'no-response' | 'failed';
  transcript?: {
    message: string;
    response?: string;
  };
}

const mockPatients: PatientReminder[] = [
  {
    id: '1',
    patientName: 'Michael Brown',
    phone: '(555) 123-4567',
    email: 'michael@example.com',
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
        timestamp: '2 days ago at 10:00 AM',
        outcome: 'delivered',
        transcript: {
          message: 'Hi Michael, please complete your intake form for your appointment on Jan 3 at 9:30 AM.',
        },
      },
      {
        id: 'e2',
        channel: 'voice',
        timestamp: '1 day ago at 3:00 PM',
        outcome: 'voicemail',
        transcript: {
          message: 'Hello Michael, this is Westside Medical Center. We noticed you haven\'t completed your intake form yet.',
        },
      },
      {
        id: 'e3',
        channel: 'sms',
        timestamp: '4 hours ago',
        outcome: 'delivered',
        transcript: {
          message: 'Reminder: Your appointment is tomorrow at 9:30 AM. Please complete your intake form.',
          response: 'Started form, will finish tonight',
        },
      },
    ],
  },
  {
    id: '2',
    patientName: 'Lisa Anderson',
    phone: '(555) 987-6543',
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
        timestamp: '3 days ago at 9:00 AM',
        outcome: 'delivered',
      },
      {
        id: 'e2',
        channel: 'voice',
        timestamp: '2 days ago at 2:00 PM',
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
    patientName: 'James Wilson',
    phone: '(555) 456-7890',
    email: 'james@example.com',
    appointmentTime: '11:30 AM',
    appointmentDate: 'Jan 4',
    intakeStatus: 'needs-attention',
    lastReminder: {
      channel: 'email',
      time: '1 day ago',
      outcome: 'no-response',
    },
    timeline: [
      {
        id: 'e1',
        channel: 'email',
        timestamp: '1 day ago',
        outcome: 'delivered',
      },
    ],
  },
];

interface IntakeAutomationPageEnhancedProps {
  onBack: () => void;
}

export function IntakeAutomationPageEnhanced({ onBack }: IntakeAutomationPageEnhancedProps) {
  const [isAutomationActive, setIsAutomationActive] = useState(true);
  const [expandedTimelines, setExpandedTimelines] = useState<Set<string>>(new Set());
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showFilteredList, setShowFilteredList] = useState(false);

  const patientsNeedingAttention = mockPatients.filter(p => p.intakeStatus === 'needs-attention');

  const toggleTimeline = (patientId: string) => {
    const newExpanded = new Set(expandedTimelines);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedTimelines(newExpanded);
  };

  const handlePatientClick = (patient: PatientReminder) => {
    const patientData = {
      id: patient.id,
      patientName: patient.patientName,
      time: patient.appointmentTime,
      phone: patient.phone,
      email: patient.email,
      status: {
        confirmed: patient.intakeStatus !== 'needs-attention',
        intakeComplete: patient.intakeStatus === 'submitted',
      },
      automationAttempts: patient.timeline.length,
    };
    setSelectedPatient(patientData);
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'delivered':
      case 'answered':
        return <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-success)' }} />;
      case 'voicemail':
        return <Phone className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />;
      case 'no-response':
      case 'failed':
        return <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-error)' }} />;
      default:
        return <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'voice':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header with Back Button */}
      <div
        className="border-b sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-all flex items-center gap-2"
              style={{
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--cf-neutral-30)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Intake & Forms</span>
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Intake Automation
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Automated intake reminders and follow-ups
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 rounded-lg border transition-all flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setIsAutomationActive(!isAutomationActive)}
                className="px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                style={{
                  backgroundColor: isAutomationActive ? 'var(--status-success)' : 'var(--cf-neutral-30)',
                  color: 'white',
                }}
              >
                {isAutomationActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isAutomationActive ? 'Pause' : 'Resume'} Automation</span>
              </button>
            </div>
          </div>

          {/* Automation Status Card - Clickable */}
          <div
            className="p-5 rounded-lg border cursor-pointer transition-all"
            style={{
              backgroundColor: patientsNeedingAttention.length > 0 ? 'var(--status-warning-bg)' : 'var(--status-success-bg)',
              borderColor: patientsNeedingAttention.length > 0 ? 'var(--status-warning)' : 'var(--status-success)',
            }}
            onClick={() => setShowFilteredList(!showFilteredList)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {patientsNeedingAttention.length > 0 ? (
                  <AlertCircle className="w-6 h-6" style={{ color: 'var(--status-warning)' }} />
                ) : (
                  <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--status-success)' }} />
                )}
                <div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {patientsNeedingAttention.length === 0 
                      ? 'All patients are responding well'
                      : `${patientsNeedingAttention.length} patient${patientsNeedingAttention.length > 1 ? 's' : ''} need${patientsNeedingAttention.length === 1 ? 's' : ''} attention`}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {patientsNeedingAttention.length > 0
                      ? 'Click to view filtered list and take action'
                      : 'All automation sequences are performing as expected'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {showFilteredList ? 'Patients Needing Attention' : 'Active Automation Timeline'}
        </h2>

        <div className="space-y-4">
          {(showFilteredList ? patientsNeedingAttention : mockPatients).map((patient) => {
            const isExpanded = expandedTimelines.has(patient.id);
            
            return (
              <div
                key={patient.id}
                className="rounded-lg border transition-all"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                }}
              >
                {/* Patient header */}
                <div
                  className="px-5 py-4 cursor-pointer"
                  onClick={() => toggleTimeline(patient.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {isExpanded ? <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /> : <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />}
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {patient.patientName}
                          </h3>
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: patient.intakeStatus === 'needs-attention' ? 'var(--status-error-bg)' : patient.intakeStatus === 'in-progress' ? 'var(--status-warning-bg)' : 'var(--status-success-bg)',
                              color: patient.intakeStatus === 'needs-attention' ? 'var(--status-error)' : patient.intakeStatus === 'in-progress' ? 'var(--status-warning)' : 'var(--status-success)',
                            }}
                          >
                            {patient.intakeStatus === 'needs-attention' ? 'Needs Attention' : patient.intakeStatus === 'in-progress' ? 'In Progress' : 'Submitted'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <span>{patient.appointmentDate} at {patient.appointmentTime}</span>
                          <span>•</span>
                          <span>{patient.timeline.length} attempt{patient.timeline.length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {getChannelIcon(patient.lastReminder.channel)}
                      <span>{patient.lastReminder.time}</span>
                      {getOutcomeIcon(patient.lastReminder.outcome)}
                    </div>
                  </div>
                </div>

                {/* Expanded timeline */}
                {isExpanded && (
                  <div
                    className="px-5 pb-5 border-t"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <div className="pl-9 pt-4 space-y-4">
                      {patient.timeline.map((event, index) => (
                        <div key={event.id} className="relative">
                          {index < patient.timeline.length - 1 && (
                            <div
                              className="absolute left-2 top-6 bottom-0 w-px"
                              style={{ backgroundColor: 'var(--border-default)' }}
                            />
                          )}
                          
                          <div className="flex items-start gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center relative z-10"
                              style={{ backgroundColor: 'var(--surface-card)' }}
                            >
                              {getChannelIcon(event.channel)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                                  {event.channel} {event.channel === 'sms' ? 'Message' : event.channel === 'voice' ? 'Call' : 'Email'}
                                </span>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {event.timestamp}
                                </span>
                                {getOutcomeIcon(event.outcome)}
                              </div>

                              {event.transcript && (
                                <div
                                  className="p-3 rounded-lg text-sm"
                                  style={{
                                    backgroundColor: 'var(--surface-canvas)',
                                    color: 'var(--text-secondary)',
                                  }}
                                >
                                  <p className="mb-2">{event.transcript.message}</p>
                                  {event.transcript.response && (
                                    <div
                                      className="mt-2 pt-2 border-t"
                                      style={{ borderColor: 'var(--border-default)' }}
                                    >
                                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                                        Patient Response:
                                      </p>
                                      <p style={{ color: 'var(--status-success)' }}>
                                        "{event.transcript.response}"
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <div className="pl-9 pt-4 flex items-center gap-2">
                      <button
                        onClick={() => handlePatientClick(patient)}
                        className="px-3 py-2 rounded-lg border transition-all text-sm font-medium flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          borderColor: 'var(--accent-primary)',
                          color: 'white',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                        }}
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Patient</span>
                      </button>
                      
                      <button
                        className="px-3 py-2 rounded-lg border transition-all text-sm font-medium flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--surface-card)',
                          borderColor: 'var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                        }}
                      >
                        <Send className="w-4 h-4" />
                        <span>Resend Intake</span>
                      </button>
                      
                      <button
                        className="px-3 py-2 rounded-lg border transition-all text-sm font-medium flex items-center gap-2"
                        style={{
                          backgroundColor: 'var(--surface-card)',
                          borderColor: 'var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                        }}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Re-enroll in AI Sequence</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Universal Contact Card */}
      {selectedPatient && (
        <UniversalContactCard
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onCall={(p) => console.log('Call', p.name)}
          onSendIntake={(p) => console.log('Send intake', p.name)}
          onReEnroll={(p) => console.log('Re-enroll', p.name)}
          onViewIntake={(p) => console.log('View intake', p.name)}
          onJumpToCalendar={(p) => console.log('Jump to calendar', p.name)}
        />
      )}
    </div>
  );
}