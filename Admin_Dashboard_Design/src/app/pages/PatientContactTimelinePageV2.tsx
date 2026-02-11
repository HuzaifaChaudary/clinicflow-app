import { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronRight,
  PhoneCall,
  Send,
  Globe,
  ExternalLink,
  RotateCcw,
  Bell,
} from 'lucide-react';
import { Button } from '../components/foundation/Button';
import { useRole } from '../context/RoleContext';

interface PatientContactTimelinePageV2Props {
  patientId: string;
  sourcePage?: 'dashboard' | 'schedule' | 'unconfirmed' | 'needs-attention';
  onBack: () => void;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  time: string;
  actor: 'ai' | 'patient' | 'admin' | 'system';
  channel: 'call' | 'sms' | 'email' | 'system';
  title: string;
  outcome?: 'success' | 'partial' | 'failed' | 'pending';
  transcript?: {
    aiMessage: string;
    patientResponse?: string;
  };
  confidence?: number;
  details?: string;
}

const mockPatient = {
  id: '1',
  name: 'Sarah Martinez',
  dob: 'March 15, 1989',
  age: 34,
  phone: '(555) 234-5678',
  email: 'sarah.martinez@email.com',
  preferredContact: 'SMS',
  language: 'English',
  appointment: {
    date: 'Tomorrow',
    fullDate: 'Jan 3, 2025',
    time: '9:30 AM',
    duration: '30 min',
    provider: 'Dr. Chen',
    visitType: 'Follow-up Visit',
    location: 'Exam Room 3',
    type: 'in-clinic' as const,
  },
  status: {
    confirmed: false,
    intakeComplete: false,
    arrived: false,
  },
  readiness: {
    aiOutreachAttempts: 3,
    lastAttempt: '6 hours ago',
  },
};

const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    timestamp: 'Jan 1, 2025',
    time: '9:00 AM',
    actor: 'system',
    channel: 'sms',
    title: 'Intake form reminder sent',
    outcome: 'pending',
    details: 'SMS delivered, awaiting response',
  },
  {
    id: '2',
    timestamp: 'Dec 31, 2024',
    time: '10:30 AM',
    actor: 'ai',
    channel: 'call',
    title: 'AI confirmation call attempted',
    outcome: 'partial',
    transcript: {
      aiMessage: "Hello, this is Westside Medical Center calling to confirm your appointment with Dr. Chen on January 3rd at 9:30 AM. If you'd like to confirm, press 1. To reschedule, press 2. To speak with someone, press 0.",
      patientResponse: 'Voicemail left - no response',
    },
    confidence: 88,
  },
  {
    id: '3',
    timestamp: 'Dec 30, 2024',
    time: '2:00 PM',
    actor: 'ai',
    channel: 'sms',
    title: 'SMS confirmation sent',
    outcome: 'success',
    transcript: {
      aiMessage: 'Hi Sarah, this is Westside Medical Center. Your appointment with Dr. Chen is scheduled for Jan 3 at 9:30 AM. Please confirm by replying YES or clicking: [link]',
    },
    confidence: 95,
  },
  {
    id: '4',
    timestamp: 'Dec 28, 2024',
    time: '10:15 AM',
    actor: 'admin',
    channel: 'system',
    title: 'Appointment scheduled',
    outcome: 'success',
    details: 'Follow-up visit created by admin staff',
  },
  {
    id: '5',
    timestamp: 'Nov 15, 2024',
    time: '9:30 AM',
    actor: 'patient',
    channel: 'system',
    title: 'Previous visit completed',
    outcome: 'success',
    details: 'Annual physical examination',
  },
];

const mockAISummary = {
  reasonForVisit: 'Follow-up for persistent lower back pain, worsening over past 2 weeks',
  keyHistory: [
    'Previous visit: Annual physical (Nov 2024) - all normal',
    'Current medications: Ibuprofen 400mg PRN, Lisinopril 10mg daily',
    'Known allergies: Penicillin (rash)',
  ],
  openItems: [
    'Patient started new desk job 3 months ago',
    'Pain increases with prolonged sitting',
  ],
};

export function PatientContactTimelinePageV2({
  patientId,
  sourcePage = 'dashboard',
  onBack,
}: PatientContactTimelinePageV2Props) {
  const { role } = useRole();
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [doctorNotes, setDoctorNotes] = useState('');

  const toggleEvent = (eventId: string) => {
    setExpandedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const getActorColor = (actor: TimelineEvent['actor']) => {
    switch (actor) {
      case 'ai':
        return 'var(--accent-primary)';
      case 'patient':
        return 'var(--status-info)';
      case 'admin':
        return 'var(--text-secondary)';
      case 'system':
        return 'var(--text-muted)';
    }
  };

  const getOutcomeColor = (outcome?: TimelineEvent['outcome']) => {
    switch (outcome) {
      case 'success':
        return 'var(--accent-primary)';
      case 'partial':
        return 'var(--status-warning)';
      case 'failed':
        return 'var(--status-error)';
      case 'pending':
        return 'var(--text-muted)';
      default:
        return 'var(--text-muted)';
    }
  };

  const getChannelIcon = (channel: TimelineEvent['channel']) => {
    switch (channel) {
      case 'call':
        return <PhoneCall className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'system':
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPrimaryAction = () => {
    if (!mockPatient.status.confirmed) {
      return {
        label: 'Re-enroll in AI Confirmation',
        type: 'confirmation' as const,
        variant: 'primary' as const,
      };
    }
    if (!mockPatient.status.intakeComplete) {
      return {
        label: 'Send Intake Form',
        type: 'intake' as const,
        variant: 'primary' as const,
      };
    }
    return null;
  };

  const primaryAction = getPrimaryAction();
  const needsAttention = !mockPatient.status.confirmed || !mockPatient.status.intakeComplete;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Sticky Page Header */}
      <div
        className="glass border-b px-8 py-5 sticky top-0 z-20"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="max-w-[1800px] mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg transition-all duration-150"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              e.currentTarget.style.color = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {sourcePage === 'dashboard' ? 'Dashboard' : sourcePage === 'schedule' ? 'Schedule' : 'Unconfirmed Patients'}
          </button>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-start">
            {/* Left: Patient Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  color: 'var(--text-inverse)',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {mockPatient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>

              <div>
                <h1 style={{ color: 'var(--text-primary)', fontSize: '24px' }} className="mb-1">
                  {mockPatient.name}
                </h1>
                <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span>{mockPatient.age} years old</span>
                  <span>•</span>
                  <span>DOB: {mockPatient.dob}</span>
                </div>
              </div>
            </div>

            {/* Center: Appointment Details */}
            <div className="text-center px-8" style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="mb-2">
                Appointment
              </div>
              <div style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: '600' }} className="mb-1">
                {mockPatient.appointment.date} · {mockPatient.appointment.time}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {mockPatient.appointment.visitType} · {mockPatient.appointment.provider}
              </div>
            </div>

            {/* Right: Status Stack */}
            <div className="flex flex-wrap gap-2 justify-end">
              {/* Confirmation Status */}
              <div
                className="px-3 py-2 rounded-full flex items-center gap-2"
                style={{
                  backgroundColor: mockPatient.status.confirmed
                    ? 'var(--status-info-bg)'
                    : 'var(--status-warning-bg)',
                  fontSize: '13px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {mockPatient.status.confirmed ? (
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                ) : (
                  <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                )}
                <span style={{ color: mockPatient.status.confirmed ? 'var(--accent-primary)' : 'var(--status-warning)' }}>
                  {mockPatient.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
                </span>
              </div>

              {/* Intake Status */}
              <div
                className="px-3 py-2 rounded-full flex items-center gap-2"
                style={{
                  backgroundColor: mockPatient.status.intakeComplete
                    ? 'var(--status-info-bg)'
                    : 'var(--surface-card)',
                  fontSize: '13px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                <FileText
                  className="w-4 h-4"
                  style={{
                    color: mockPatient.status.intakeComplete ? 'var(--accent-primary)' : 'var(--text-muted)',
                  }}
                />
                <span
                  style={{
                    color: mockPatient.status.intakeComplete ? 'var(--accent-primary)' : 'var(--text-muted)',
                  }}
                >
                  {mockPatient.status.intakeComplete ? 'Intake Complete' : 'Missing Intake'}
                </span>
              </div>

              {/* Arrival Status */}
              <div
                className="px-3 py-2 rounded-full flex items-center gap-2"
                style={{
                  backgroundColor: mockPatient.status.arrived
                    ? 'var(--status-info-bg)'
                    : 'var(--surface-card)',
                  fontSize: '13px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                <User
                  className="w-4 h-4"
                  style={{
                    color: mockPatient.status.arrived ? 'var(--accent-primary)' : 'var(--text-muted)',
                  }}
                />
                <span
                  style={{
                    color: mockPatient.status.arrived ? 'var(--accent-primary)' : 'var(--text-muted)',
                  }}
                >
                  {mockPatient.status.arrived ? 'Arrived' : 'Not Arrived'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="max-w-[1800px] mx-auto p-8">
        <div className="grid grid-cols-[340px_1fr_380px] gap-6">
          {/* 1️⃣ Left Column - Patient & Visit Overview */}
          <div className="space-y-4">
            {/* Contact Info Card */}
            <div
              className="p-5"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)', fontSize: '16px' }} className="mb-4">
                Contact Info
              </h3>

              <div className="space-y-3">
                {/* Phone */}
                <a
                  href={`tel:${mockPatient.phone}`}
                  className="flex items-center gap-3 p-2 rounded-lg transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '14px' }}>{mockPatient.phone}</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${mockPatient.email}`}
                  className="flex items-center gap-3 p-2 rounded-lg transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '14px' }}>{mockPatient.email}</span>
                </a>

                {/* Preferred Contact */}
                <div className="flex items-center gap-3 p-2">
                  <MessageSquare className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Prefers: </span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
                      {mockPatient.preferredContact}
                    </span>
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center gap-3 p-2">
                  <Globe className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <div style={{ fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Language: </span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
                      {mockPatient.language}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Visit Card */}
            <div
              className="p-5"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)', fontSize: '16px' }} className="mb-4">
                Today's Visit
              </h3>

              <div className="space-y-3">
                {/* Time */}
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                      {mockPatient.appointment.time}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {mockPatient.appointment.duration}
                    </div>
                  </div>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {mockPatient.appointment.provider}
                  </div>
                </div>

                {/* Visit Type */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {mockPatient.appointment.visitType}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  {mockPatient.appointment.type === 'in-clinic' ? (
                    <MapPin className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  ) : (
                    <Video className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  )}
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {mockPatient.appointment.type === 'in-clinic'
                      ? mockPatient.appointment.location
                      : 'Virtual Visit'}
                  </div>
                </div>

                {/* Virtual Meeting Link */}
                {mockPatient.appointment.type === 'virtual' && (
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

            {/* Readiness Summary Card */}
            <div
              className="p-5"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)', fontSize: '16px' }} className="mb-4">
                Readiness Summary
              </h3>

              <div className="space-y-3">
                {/* Intake */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Intake</span>
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-medium)',
                      color: mockPatient.status.intakeComplete ? 'var(--accent-primary)' : 'var(--status-warning)',
                    }}
                  >
                    {mockPatient.status.intakeComplete ? 'Complete' : 'Missing'}
                  </span>
                </div>

                {/* Confirmation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Confirmation</span>
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-medium)',
                      color: mockPatient.status.confirmed ? 'var(--accent-primary)' : 'var(--status-warning)',
                    }}
                  >
                    {mockPatient.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
                  </span>
                </div>

                {/* AI Outreach */}
                <div
                  className="mt-4 pt-4"
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }} className="mb-2">
                    AI Outreach Activity
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {mockPatient.readiness.aiOutreachAttempts} attempts
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Last: {mockPatient.readiness.lastAttempt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2️⃣ Center Column - Timeline (Most Important) */}
          <div
            className="p-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <h3 style={{ color: 'var(--text-primary)', fontSize: '18px' }} className="mb-6">
              Patient Timeline
            </h3>

            <div className="space-y-1">
              {mockTimeline.map((event, index) => (
                <div key={event.id}>
                  <button
                    onClick={() => event.transcript && toggleEvent(event.id)}
                    disabled={!event.transcript}
                    className="w-full flex gap-4 p-4 rounded-xl transition-all duration-150 text-left"
                    style={{
                      backgroundColor: expandedEvents.includes(event.id)
                        ? 'var(--surface-canvas)'
                        : 'transparent',
                      cursor: event.transcript ? 'pointer' : 'default',
                    }}
                    onMouseEnter={(e) => {
                      if (event.transcript && !expandedEvents.includes(event.id)) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (event.transcript && !expandedEvents.includes(event.id)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center">
                      {/* Event node */}
                      <div
                        className="p-2.5 rounded-xl"
                        style={{
                          backgroundColor: 'var(--surface-card)',
                          color: getActorColor(event.actor),
                          border: `2px solid ${getOutcomeColor(event.outcome)}`,
                        }}
                      >
                        {getChannelIcon(event.channel)}
                      </div>

                      {/* Connecting line */}
                      {index < mockTimeline.length - 1 && (
                        <div
                          style={{
                            width: '2px',
                            minHeight: expandedEvents.includes(event.id) ? '80px' : '50px',
                            backgroundColor: 'var(--border-default)',
                            marginTop: '4px',
                            marginBottom: '4px',
                          }}
                        />
                      )}
                    </div>

                    {/* Event content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div
                            style={{
                              fontSize: '15px',
                              color: 'var(--text-primary)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                            className="mb-1"
                          >
                            {event.title}
                          </div>
                          <div className="flex items-center gap-2" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            <span>{event.timestamp}</span>
                            <span>•</span>
                            <span>{event.time}</span>
                            <span>•</span>
                            <span className="capitalize">{event.actor}</span>
                          </div>
                        </div>

                        {event.transcript && (
                          <div className="ml-2">
                            {expandedEvents.includes(event.id) ? (
                              <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            ) : (
                              <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Outcome badge */}
                      {event.outcome && (
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              event.outcome === 'success'
                                ? 'var(--status-info-bg)'
                                : event.outcome === 'partial'
                                ? 'var(--status-warning-bg)'
                                : 'var(--surface-canvas)',
                            fontSize: '12px',
                            color: getOutcomeColor(event.outcome),
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          {event.outcome === 'success' && <CheckCircle2 className="w-3 h-3" />}
                          {event.outcome === 'partial' && <AlertCircle className="w-3 h-3" />}
                          <span className="capitalize">{event.outcome}</span>
                        </div>
                      )}

                      {event.details && !event.transcript && (
                        <div
                          className="mt-2"
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {event.details}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Expanded Transcript */}
                  {expandedEvents.includes(event.id) && event.transcript && (
                    <div
                      className="ml-14 mb-4 p-4 rounded-xl animate-expand-vertical"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {/* AI Message */}
                      <div className="mb-3">
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            fontWeight: 'var(--font-weight-medium)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                          className="mb-2"
                        >
                          AI Message
                        </div>
                        <div
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: 'var(--surface-card)',
                            fontSize: '14px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                          }}
                        >
                          {event.transcript.aiMessage}
                        </div>
                      </div>

                      {/* Patient Response */}
                      {event.transcript.patientResponse && (
                        <div className="mb-3">
                          <div
                            style={{
                              fontSize: '11px',
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
                            className="p-3 rounded-lg"
                            style={{
                              backgroundColor: 'var(--status-warning-bg)',
                              fontSize: '14px',
                              color: 'var(--text-secondary)',
                              lineHeight: '1.6',
                              border: '1px solid var(--status-warning)',
                            }}
                          >
                            <span style={{ color: 'var(--status-warning)', fontWeight: 'var(--font-weight-medium)' }}>
                              {event.transcript.patientResponse}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* AI Confidence */}
                      {event.confidence && (
                        <div className="flex items-center gap-2">
                          <span
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                            }}
                          >
                            AI Confidence:
                          </span>
                          <div
                            className="px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: 'var(--status-info-bg)',
                              color: 'var(--accent-primary)',
                              fontSize: '11px',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {event.confidence}%
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3️⃣ Right Column - Contextual Action Panel */}
          <div className="space-y-4">
            {/* Attention Alert (if needed) */}
            {needsAttention && (
              <div
                className="p-5 rounded-xl"
                style={{
                  backgroundColor: 'var(--status-warning-bg)',
                  border: '2px solid var(--status-warning)',
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-warning)' }} />
                  <div>
                    <h3
                      style={{
                        fontSize: '15px',
                        color: 'var(--text-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                      className="mb-1"
                    >
                      Human Intervention Needed
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Patient hasn't responded to {mockPatient.readiness.aiOutreachAttempts} AI attempts.
                      {!mockPatient.status.confirmed && ' Appointment is tomorrow and still unconfirmed.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Action Card */}
            {primaryAction && (
              <div
                className="p-5"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-1)',
                }}
              >
                <h3 style={{ color: 'var(--text-primary)', fontSize: '16px' }} className="mb-4">
                  Recommended Action
                </h3>

                <Button
                  variant={primaryAction.variant}
                  size="lg"
                  icon={primaryAction.type === 'confirmation' ? CheckCircle2 : FileText}
                  iconPosition="left"
                  className="w-full mb-3"
                >
                  {primaryAction.label}
                </Button>

                {primaryAction.type === 'confirmation' && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Last SMS sent: {mockPatient.readiness.lastAttempt}
                    <br />
                    Channel: SMS → Voice → Email
                  </div>
                )}

                {primaryAction.type === 'intake' && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Last sent: {mockPatient.readiness.lastAttempt}
                    <br />
                    Will be delivered via: {mockPatient.preferredContact}
                  </div>
                )}
              </div>
            )}

            {/* Additional Actions */}
            <div
              className="p-5"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-1)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)', fontSize: '16px' }} className="mb-4">
                Other Actions
              </h3>

              <div className="space-y-2">
                <Button variant="secondary" size="md" icon={Phone} iconPosition="left" className="w-full">
                  Manual Call
                </Button>

                <Button variant="secondary" size="md" icon={MessageSquare} iconPosition="left" className="w-full">
                  Send Message
                </Button>

                <Button variant="secondary" size="md" icon={RotateCcw} iconPosition="left" className="w-full">
                  Reschedule
                </Button>

                {!mockPatient.status.arrived && (
                  <Button variant="ghost" size="md" icon={CheckCircle2} iconPosition="left" className="w-full">
                    Mark as Arrived
                  </Button>
                )}
              </div>
            </div>

            {/* AI Summary (Doctor Only) */}
            {role === 'doctor' && (
              <div
                className="p-5"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-1)',
                }}
              >
                <h3 style={{ color: 'var(--text-primary)', fontSize: '16px' }} className="mb-1">
                  AI Visit Summary
                </h3>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                  }}
                  className="mb-4"
                >
                  AI-generated summary (non-diagnostic)
                </p>

                <div className="space-y-4">
                  {/* Reason for Visit */}
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--accent-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                      className="mb-1"
                    >
                      Reason for Visit
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      {mockAISummary.reasonForVisit}
                    </div>
                  </div>

                  {/* Key History */}
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--accent-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                      className="mb-2"
                    >
                      Key History
                    </div>
                    <ul className="space-y-1">
                      {mockAISummary.keyHistory.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5',
                            paddingLeft: '12px',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '0',
                              color: 'var(--text-muted)',
                            }}
                          >
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Open Items */}
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--accent-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                      className="mb-2"
                    >
                      Open Items
                    </div>
                    <ul className="space-y-1">
                      {mockAISummary.openItems.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5',
                            paddingLeft: '12px',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '0',
                              color: 'var(--text-muted)',
                            }}
                          >
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Doctor Notes */}
                  <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                      className="mb-2"
                    >
                      Your Notes
                    </div>
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Add notes or follow-up plan..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        border: '2px solid var(--border-default)',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        resize: 'vertical',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
