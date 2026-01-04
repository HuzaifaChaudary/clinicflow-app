import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, Phone, Mail, MessageSquare, Clock, AlertCircle, Video, User, RefreshCw } from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { Appointment } from '../components/AppointmentRow';
import { UnconfirmedAppointmentsList } from '../components/UnconfirmedAppointmentsList';

interface UnconfirmedAppointmentsPageProps {
  appointments: Appointment[];
  onBack: () => void;
}

interface AICallAttempt {
  id: string;
  type: 'call' | 'text' | 'email';
  timestamp: string;
  outcome: 'answered' | 'voicemail' | 'no-response' | 'delivered';
  transcript?: string;
  duration?: string;
}

interface UnconfirmedPatientDetail {
  appointment: Appointment;
  phone: string;
  email: string;
  preferredContact: 'phone' | 'email' | 'text';
  aiAttempts: AICallAttempt[];
}

export function UnconfirmedAppointmentsPage({ appointments, onBack }: UnconfirmedAppointmentsPageProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [expandedAttempts, setExpandedAttempts] = useState<Set<string>>(new Set());
  const [reEnrollFeedback, setReEnrollFeedback] = useState<string | null>(null);

  const unconfirmedAppointments = appointments.filter(apt => !apt.status.confirmed);

  // Mock detailed patient data
  const getPatientDetail = (apt: Appointment): UnconfirmedPatientDetail => ({
    appointment: apt,
    phone: '(555) 123-4567',
    email: 'patient@email.com',
    preferredContact: 'phone',
    aiAttempts: [
      {
        id: '1',
        type: 'call',
        timestamp: 'Today, 9:15 AM',
        outcome: 'voicemail',
        transcript: 'Hi, this is Clinicflow calling to confirm your appointment with Dr. Chen tomorrow at 9:00 AM. Please call us back at 555-0123 to confirm. Thank you.',
        duration: '28 seconds',
      },
      {
        id: '2',
        type: 'text',
        timestamp: 'Today, 11:30 AM',
        outcome: 'delivered',
        transcript: 'Hi! This is Clinicflow. We\'re confirming your appointment tomorrow at 9:00 AM with Dr. Chen. Reply YES to confirm or call (555) 0123.',
      },
      {
        id: '3',
        type: 'call',
        timestamp: 'Yesterday, 2:45 PM',
        outcome: 'no-response',
        duration: 'No answer',
      },
    ],
  });

  const selectedPatientDetail = selectedPatient 
    ? getPatientDetail(unconfirmedAppointments.find(apt => apt.id === selectedPatient)!)
    : null;

  const toggleAttemptExpanded = (attemptId: string) => {
    const newExpanded = new Set(expandedAttempts);
    if (newExpanded.has(attemptId)) {
      newExpanded.delete(attemptId);
    } else {
      newExpanded.add(attemptId);
    }
    setExpandedAttempts(newExpanded);
  };

  const handleReEnroll = () => {
    setReEnrollFeedback('Confirmation sequence restarted');
    setTimeout(() => setReEnrollFeedback(null), 3000);
  };

  const getOutcomeColor = (outcome: AICallAttempt['outcome']) => {
    switch (outcome) {
      case 'answered':
        return 'var(--status-success)';
      case 'voicemail':
        return 'var(--status-info)';
      case 'delivered':
        return 'var(--status-success)';
      case 'no-response':
        return 'var(--status-error)';
    }
  };

  const getOutcomeLabel = (outcome: AICallAttempt['outcome']) => {
    switch (outcome) {
      case 'answered':
        return 'Answered';
      case 'voicemail':
        return 'Voicemail';
      case 'delivered':
        return 'Delivered';
      case 'no-response':
        return 'No response';
    }
  };

  if (selectedPatientDetail) {
    // Detail View
    return (
      <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b" style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-default)' }}>
          <div className="max-w-[1200px] mx-auto">
            <button
              onClick={() => setSelectedPatient(null)}
              className="flex items-center gap-2 mb-4 motion-hover"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-medium">Back to list</span>
            </button>

            <div className="flex items-start justify-between">
              <div>
                <h1 style={{ color: 'var(--text-primary)' }}>
                  {selectedPatientDetail.appointment.patientName}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{selectedPatientDetail.appointment.time}</span>
                  </div>
                  <span>•</span>
                  <span>{selectedPatientDetail.appointment.provider}</span>
                  <span>•</span>
                  <span>Follow-up Consultation</span>
                </div>
              </div>

              <div 
                className="px-4 py-2 rounded-lg flex items-center gap-2"
                style={{ backgroundColor: 'var(--status-warning-bg)' }}
              >
                <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                <span className="font-medium text-sm" style={{ color: 'var(--status-warning)' }}>
                  Unconfirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {/* Contact Info */}
            <Card elevation="2" radius="lg">
              <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}>
                      <Phone className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Phone</div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {selectedPatientDetail.phone}
                      </div>
                    </div>
                  </div>
                  {selectedPatientDetail.preferredContact === 'phone' && (
                    <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)', color: 'var(--accent-primary)' }}>
                      Preferred
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}>
                      <Mail className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Email</div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {selectedPatientDetail.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Caller Activity */}
            <Card elevation="2" radius="lg">
              <div className="flex items-center gap-2 mb-5">
                <Phone className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ color: 'var(--text-primary)' }}>AI Confirmation Attempts</h3>
                <div className="ml-auto px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--surface-canvas)', color: 'var(--text-secondary)' }}>
                  {selectedPatientDetail.aiAttempts.length} attempts
                </div>
              </div>

              <div className="space-y-3">
                {selectedPatientDetail.aiAttempts.map((attempt) => {
                  const isExpanded = expandedAttempts.has(attempt.id);
                  const hasTranscript = !!attempt.transcript;

                  return (
                    <div
                      key={attempt.id}
                      className="rounded-xl overflow-hidden"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        border: '1.5px solid var(--border-subtle)',
                      }}
                    >
                      {/* Attempt Header */}
                      <button
                        onClick={() => hasTranscript && toggleAttemptExpanded(attempt.id)}
                        className="w-full p-4 text-left motion-hover"
                        style={{
                          cursor: hasTranscript ? 'pointer' : 'default',
                        }}
                        onMouseEnter={(e) => {
                          if (hasTranscript) {
                            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            {/* Icon */}
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                              style={{ 
                                backgroundColor: attempt.type === 'call' ? 'rgba(91, 141, 239, 0.12)' : 'rgba(123, 167, 225, 0.12)',
                              }}
                            >
                              {attempt.type === 'call' ? (
                                <Phone className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                              ) : attempt.type === 'text' ? (
                                <MessageSquare className="w-4 h-4" style={{ color: 'var(--status-info)' }} />
                              ) : (
                                <Mail className="w-4 h-4" style={{ color: 'var(--status-info)' }} />
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                                  {attempt.type === 'call' ? 'Voice Call' : attempt.type === 'text' ? 'Text Message' : 'Email'}
                                </span>
                                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  {attempt.timestamp}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: getOutcomeColor(attempt.outcome) }}
                                />
                                <span className="text-sm font-medium" style={{ color: getOutcomeColor(attempt.outcome) }}>
                                  {getOutcomeLabel(attempt.outcome)}
                                </span>
                                {attempt.duration && (
                                  <>
                                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>•</span>
                                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                      {attempt.duration}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expand Icon */}
                          {hasTranscript && (
                            <ChevronDown 
                              className={`w-5 h-5 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              style={{ color: 'var(--text-muted)' }}
                            />
                          )}
                        </div>
                      </button>

                      {/* Transcript (Expandable) */}
                      {hasTranscript && isExpanded && (
                        <div 
                          className="px-4 pb-4 pt-2 border-t animate-fade-in"
                          style={{ borderColor: 'var(--border-subtle)' }}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                              {attempt.type === 'call' ? 'Voicemail Transcript' : 'Message Content'}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)', color: 'var(--accent-primary)' }}>
                              AI-generated
                            </span>
                          </div>
                          <div 
                            className="p-3 rounded-lg text-sm leading-relaxed"
                            style={{ 
                              backgroundColor: 'var(--surface-card)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {attempt.transcript}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Re-Enroll Action */}
            <Card elevation="2" radius="lg">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="mb-2" style={{ color: 'var(--text-primary)' }}>
                    Re-enroll in Confirmation Sequence
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    This will restart the automated confirmation process. The AI will attempt to reach the patient via their preferred contact method within the next hour.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    icon={RefreshCw}
                    onClick={handleReEnroll}
                  >
                    Re-enroll Patient
                  </Button>
                </div>
              </div>

              {/* Feedback */}
              {reEnrollFeedback && (
                <div 
                  className="mt-4 p-3 rounded-lg flex items-center gap-2 animate-fade-in"
                  style={{ backgroundColor: 'var(--status-success-bg)' }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-success)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--status-success)' }}>
                    {reEnrollFeedback}
                  </span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-[1400px] mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 motion-hover"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium">Back to Schedule</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 style={{ color: 'var(--text-primary)' }}>Unconfirmed Appointments</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {unconfirmedAppointments.length} patients need confirmation
              </p>
            </div>

            <div 
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: 'var(--status-warning-bg)' }}
            >
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
              <span className="font-semibold" style={{ color: 'var(--status-warning)' }}>
                Needs attention
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <UnconfirmedAppointmentsList
            appointments={appointments}
            onAppointmentClick={setSelectedPatient}
            showSummaryBar={true}
          />
        </div>
      </div>
    </div>
  );
}