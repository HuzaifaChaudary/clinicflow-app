import { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  Copy,
  Send,
  Calendar,
  Clock,
  Video,
  User,
  MessageSquare,
  RotateCcw,
  FileText,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../components/foundation/Button';
import { useRole } from '../context/RoleContext';

interface PatientContactTimelinePageProps {
  patientId: string;
  onBack: () => void;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'created' | 'ai-call' | 'ai-text' | 'response' | 'confirmation' | 'intake' | 'arrival' | 'reschedule';
  title: string;
  status: 'completed' | 'pending' | 'needs-attention';
  details?: {
    transcript?: string;
    message?: string;
    outcome?: string;
    aiConfidence?: number;
  };
}

const mockPatient = {
  id: '1',
  name: 'Sarah Martinez',
  dob: 'March 15, 1989',
  age: 34,
  gender: 'Female',
  phone: '(555) 234-5678',
  email: 'sarah.martinez@email.com',
  appointment: {
    date: 'Jan 3, 2025',
    time: '9:30 AM',
    provider: 'Dr. Chen',
    duration: '30 min',
    type: 'in-clinic' as const,
    visitType: 'Follow-up Visit',
  },
  status: {
    confirmed: false,
    intakeComplete: false,
    arrived: false,
  },
};

const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    timestamp: 'Dec 28, 2024 · 10:15 AM',
    type: 'created',
    title: 'Appointment scheduled',
    status: 'completed',
    details: {
      message: 'Follow-up visit scheduled with Dr. Chen for Jan 3 at 9:30 AM',
    },
  },
  {
    id: '2',
    timestamp: 'Dec 30, 2024 · 2:00 PM',
    type: 'ai-text',
    title: 'SMS reminder sent',
    status: 'completed',
    details: {
      message: 'Hi Sarah, this is Westside Medical Center. Your appointment with Dr. Chen is scheduled for Jan 3 at 9:30 AM. Please confirm: [link]',
      aiConfidence: 95,
    },
  },
  {
    id: '3',
    timestamp: 'Dec 31, 2024 · 10:30 AM',
    type: 'ai-call',
    title: 'AI confirmation call attempted',
    status: 'needs-attention',
    details: {
      transcript: "Hello, this is Westside Medical Center calling to confirm your appointment with Dr. Chen on January 3rd at 9:30 AM. If you'd like to confirm, press 1. To reschedule, press 2.",
      outcome: 'Voicemail left',
      aiConfidence: 88,
    },
  },
  {
    id: '4',
    timestamp: 'Jan 1, 2025 · 9:00 AM',
    type: 'ai-text',
    title: 'Intake form reminder sent',
    status: 'pending',
    details: {
      message: 'Hi Sarah, please complete your intake form before your appointment on Jan 3: [link]',
      aiConfidence: 92,
    },
  },
];

const mockAISummary = `Patient has upcoming follow-up appointment on Jan 3. Confirmation attempts made via SMS and voice call (voicemail left). Intake form reminder sent but not yet completed. No response to confirmation requests. Recommend follow-up contact or manual confirmation.`;

export function PatientContactTimelinePage({ patientId, onBack }: PatientContactTimelinePageProps) {
  const { role } = useRole();
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [adminNotes, setAdminNotes] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const toggleEvent = (eventId: string) => {
    setExpandedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'created':
        return <Calendar className="w-4 h-4" />;
      case 'ai-call':
        return <PhoneCall className="w-4 h-4" />;
      case 'ai-text':
        return <MessageSquare className="w-4 h-4" />;
      case 'response':
        return <MessageSquare className="w-4 h-4" />;
      case 'confirmation':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'intake':
        return <FileText className="w-4 h-4" />;
      case 'arrival':
        return <User className="w-4 h-4" />;
      case 'reschedule':
        return <RotateCcw className="w-4 h-4" />;
    }
  };

  const getEventColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'var(--accent-primary)';
      case 'pending':
        return 'var(--status-info)';
      case 'needs-attention':
        return 'var(--status-warning)';
    }
  };

  const getPrimaryAction = () => {
    if (!mockPatient.status.confirmed) {
      return 'confirmation';
    }
    if (!mockPatient.status.intakeComplete) {
      return 'intake';
    }
    return 'none';
  };

  const primaryAction = getPrimaryAction();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header - Context Bar */}
      <div
        className="glass border-b px-6 py-4 sticky top-0 z-10"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 style={{ color: 'var(--text-primary)' }} className="mb-1">
                {mockPatient.name}
              </h1>
              <div className="flex items-center gap-3" style={{ fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {mockPatient.age} years old · {mockPatient.gender}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {mockPatient.appointment.visitType}
                </span>
              </div>
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-2">
            {/* Confirmed Status */}
            <div
              className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{
                backgroundColor: mockPatient.status.confirmed
                  ? 'var(--status-info-bg)'
                  : 'var(--status-warning-bg)',
                color: mockPatient.status.confirmed ? 'var(--accent-primary)' : 'var(--status-warning)',
                fontSize: '13px',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {mockPatient.status.confirmed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>{mockPatient.status.confirmed ? 'Confirmed' : 'Unconfirmed'}</span>
            </div>

            {/* Intake Status */}
            <div
              className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{
                backgroundColor: mockPatient.status.intakeComplete
                  ? 'var(--status-info-bg)'
                  : 'var(--surface-card)',
                color: mockPatient.status.intakeComplete ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{mockPatient.status.intakeComplete ? 'Intake Complete' : 'Missing Intake'}</span>
            </div>

            {/* Arrival Status */}
            <div
              className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{
                backgroundColor: mockPatient.status.arrived
                  ? 'var(--status-info-bg)'
                  : 'var(--surface-card)',
                color: mockPatient.status.arrived ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <User className="w-3.5 h-3.5" />
              <span>{mockPatient.status.arrived ? 'Arrived' : 'Not Arrived'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="grid grid-cols-[380px_1fr] gap-6">
          {/* Left Column - Patient Contact & Actions */}
          <div className="space-y-4">
            {/* Card 1: Patient Identity */}
            {role === 'admin' && (
              <div
                className="p-5"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-1)',
                }}
              >
                <div className="flex items-start gap-4 mb-5">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                      color: 'var(--text-inverse)',
                      fontSize: '24px',
                      fontWeight: '600',
                    }}
                  >
                    {mockPatient.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>

                  <div className="flex-1">
                    <h3 style={{ color: 'var(--text-primary)' }} className="mb-1">
                      {mockPatient.name}
                    </h3>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      DOB: {mockPatient.dob}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  {/* Phone */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {mockPatient.phone}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(mockPatient.phone, 'phone')}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{
                        color: copiedField === 'phone' ? 'var(--accent-primary)' : 'var(--text-muted)',
                      }}
                      onMouseEnter={(e) => {
                        if (copiedField !== 'phone') {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {mockPatient.email}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(mockPatient.email, 'email')}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{
                        color: copiedField === 'email' ? 'var(--accent-primary)' : 'var(--text-muted)',
                      }}
                      onMouseEnter={(e) => {
                        if (copiedField !== 'email') {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <Button variant="secondary" size="sm" icon={Phone} iconPosition="left">
                    Call
                  </Button>
                  <Button variant="secondary" size="sm" icon={MessageSquare} iconPosition="left">
                    Message
                  </Button>
                </div>
              </div>
            )}

            {/* Card 2: Appointment Context */}
            <div
              className="p-5"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)' }} className="mb-4">
                Appointment Details
              </h3>

              <div className="space-y-3">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {mockPatient.appointment.date}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {mockPatient.appointment.time}
                    </div>
                  </div>
                </div>

                {/* Provider */}
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {mockPatient.appointment.provider}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {mockPatient.appointment.duration}
                    </div>
                  </div>
                </div>

                {/* Visit Type */}
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {mockPatient.appointment.type === 'in-clinic' ? 'In-Clinic Visit' : 'Telehealth'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {mockPatient.appointment.visitType}
                    </div>
                  </div>
                </div>

                {/* Telehealth Link (if applicable) */}
                {mockPatient.appointment.type === 'telehealth' && (
                  <button
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-colors"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--text-inverse)',
                      fontSize: '14px',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    <Video className="w-4 h-4" />
                    Join Meeting
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Card 3: Quick Actions (Admin Only) */}
            {role === 'admin' && (
              <div
                className="p-5"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-1)',
                }}
              >
                <h3 style={{ color: 'var(--text-primary)' }} className="mb-4">
                  Quick Actions
                </h3>

                <div className="space-y-2">
                  <Button
                    variant={primaryAction === 'confirmation' ? 'primary' : 'secondary'}
                    size="md"
                    icon={CheckCircle2}
                    iconPosition="left"
                    className="w-full"
                  >
                    Send Confirmation
                  </Button>

                  <Button
                    variant={primaryAction === 'intake' ? 'primary' : 'secondary'}
                    size="md"
                    icon={FileText}
                    iconPosition="left"
                    className="w-full"
                  >
                    Send Intake Form
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    icon={RotateCcw}
                    iconPosition="left"
                    className="w-full"
                  >
                    Reschedule
                  </Button>

                  <Button
                    variant="ghost"
                    size="md"
                    icon={Send}
                    iconPosition="left"
                    className="w-full"
                  >
                    Re-enroll in AI Sequence
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Timeline & Intelligence */}
          <div className="space-y-6">
            {/* AI Summary Card */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)' }} className="mb-4">
                AI Visit Summary
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                }}
              >
                {mockAISummary}
              </p>

              <div
                className="mt-4 pt-4"
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                  }}
                >
                  AI-generated summary. For operational use only.
                </p>
              </div>
            </div>

            {/* Patient Timeline */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)' }} className="mb-6">
                Patient Timeline
              </h3>

              <div className="space-y-1">
                {mockTimeline.map((event, index) => (
                  <div key={event.id}>
                    <button
                      onClick={() => toggleEvent(event.id)}
                      className="w-full flex gap-4 p-3 rounded-xl transition-all duration-200 text-left"
                      style={{
                        backgroundColor: expandedEvents.includes(event.id)
                          ? 'var(--surface-canvas)'
                          : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!expandedEvents.includes(event.id)) {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!expandedEvents.includes(event.id)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {/* Timeline spine */}
                      <div className="flex flex-col items-center">
                        {/* Event node */}
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: 'var(--surface-card)',
                            color: getEventColor(event.status),
                            border: `2px solid ${getEventColor(event.status)}`,
                          }}
                        >
                          {getEventIcon(event.type)}
                        </div>

                        {/* Connecting line */}
                        {index < mockTimeline.length - 1 && (
                          <div
                            style={{
                              width: '2px',
                              height: expandedEvents.includes(event.id) ? '100%' : '40px',
                              minHeight: '40px',
                              backgroundColor: 'var(--border-default)',
                              marginTop: '4px',
                            }}
                          />
                        )}
                      </div>

                      {/* Event content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <div
                              style={{
                                fontSize: '14px',
                                color: 'var(--text-primary)',
                                fontWeight: 'var(--font-weight-medium)',
                              }}
                            >
                              {event.title}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {event.timestamp}
                            </div>
                          </div>

                          {event.details && (
                            <div className="ml-2">
                              {expandedEvents.includes(event.id) ? (
                                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                              ) : (
                                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {expandedEvents.includes(event.id) && event.details && (
                      <div
                        className="ml-14 mb-4 p-4 rounded-xl"
                        style={{
                          backgroundColor: 'var(--surface-canvas)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {event.details.transcript && (
                          <div className="mb-3">
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                fontWeight: 'var(--font-weight-medium)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                              className="mb-2"
                            >
                              Transcript
                            </div>
                            <div
                              className="p-3 rounded-lg"
                              style={{
                                backgroundColor: 'var(--surface-card)',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.5',
                              }}
                            >
                              {event.details.transcript}
                            </div>
                          </div>
                        )}

                        {event.details.message && !event.details.transcript && (
                          <div className="mb-3">
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                fontWeight: 'var(--font-weight-medium)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                              className="mb-2"
                            >
                              Message
                            </div>
                            <div
                              className="p-3 rounded-lg"
                              style={{
                                backgroundColor: 'var(--surface-card)',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.5',
                              }}
                            >
                              {event.details.message}
                            </div>
                          </div>
                        )}

                        {event.details.outcome && (
                          <div className="mb-3">
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                                fontWeight: 'var(--font-weight-medium)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                              className="mb-2"
                            >
                              Outcome
                            </div>
                            <div
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                              style={{
                                backgroundColor: 'var(--status-warning-bg)',
                                color: 'var(--status-warning)',
                                fontSize: '13px',
                                fontWeight: 'var(--font-weight-medium)',
                              }}
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              {event.details.outcome}
                            </div>
                          </div>
                        )}

                        {event.details.aiConfidence && (
                          <div className="flex items-center gap-2">
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                              }}
                            >
                              AI Confidence:
                            </div>
                            <div
                              className="px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: 'var(--status-info-bg)',
                                color: 'var(--accent-primary)',
                                fontSize: '11px',
                                fontWeight: 'var(--font-weight-medium)',
                              }}
                            >
                              {event.details.aiConfidence}%
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)' }} className="mb-4">
                {role === 'admin' ? 'Operational Notes' : 'Clinical Notes'}
              </h3>

              <textarea
                value={role === 'admin' ? adminNotes : doctorNotes}
                onChange={(e) => {
                  if (role === 'admin') {
                    setAdminNotes(e.target.value);
                  } else {
                    setDoctorNotes(e.target.value);
                  }
                }}
                placeholder={
                  role === 'admin'
                    ? 'Add operational notes visible to admin staff...'
                    : 'Add clinical notes for this patient...'
                }
                rows={6}
                className="w-full px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  border: '2px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              />

              <div className="flex items-center justify-between mt-3">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {role === 'admin' ? 'Visible to admin only' : 'Visible to clinical staff only'}
                </span>
                <Button size="sm">Save Note</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
