import { useState } from 'react';
import { 
  Pause, 
  Play,
  Settings, 
  MessageSquare, 
  Phone, 
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight,
  Sparkles,
  Activity,
  GripVertical,
  Copy,
  Trash2,
  Plus,
  ExternalLink
} from 'lucide-react';
import { Appointment } from '../types/appointment';
import { AutomationSettingsPanel } from '../components/AutomationSettingsPanel';

type TimeFilter = 'today' | 'next-7-days' | 'all-upcoming';
type AttentionFilter = 'all' | 'no-response' | 'failed-contact' | 'reported-issue' | 'overdue';
type JourneyFilter = 'all' | 'on-track' | 'completing-now' | 'at-risk';

interface IntakeOperationsPageProps {
  appointments: Appointment[];
  onUpdateAppointment: (id: string, updates: Partial<Appointment>) => void;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  provider: string;
  intakeStatus: 'not-started' | 'in-progress' | 'completed';
  progressDetail?: string;
  needsAttention: boolean;
  attentionReason?: 'no-response' | 'failed-contact' | 'reported-issue' | 'overdue';
  lastAutomationStep: string;
  statusBadge: string;
  recommendedAction?: string;
  timeline: AutomationEvent[];
  channelActivity: {
    sms: { sent: number; status: 'delivered' | 'pending' | 'failed' };
    email: { sent: number; status: 'delivered' | 'pending' | 'failed' };
    call: { attempts: number; status: 'completed' | 'voicemail' | 'failed' };
  };
  totalAttempts: number;
  lastTouch: string;
}

interface AutomationEvent {
  id: string;
  timing: string;
  action: string;
  outcome: string;
  details?: string;
  icon: 'sms' | 'email' | 'call' | 'ava';
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    phone: '(555) 123-4567',
    appointmentDate: 'Tomorrow',
    appointmentTime: '9:30 AM',
    provider: 'Dr. Chen',
    intakeStatus: 'not-started',
    needsAttention: true,
    attentionReason: 'no-response',
    lastAutomationStep: 'SMS 2 of 3 · no reply',
    statusBadge: 'Needs follow-up',
    recommendedAction: 'Call now',
    totalAttempts: 3,
    lastTouch: '6h ago via SMS',
    channelActivity: {
      sms: { sent: 2, status: 'delivered' },
      email: { sent: 1, status: 'delivered' },
      call: { attempts: 0, status: 'completed' },
    },
    timeline: [
      {
        id: 'e1',
        timing: 'T-48h',
        action: 'Ava sent SMS with intake link',
        outcome: 'Delivered · No response',
        icon: 'sms',
      },
      {
        id: 'e2',
        timing: 'T-36h',
        action: 'Ava called patient',
        outcome: 'Reached voicemail · Left message',
        icon: 'call',
      },
      {
        id: 'e3',
        timing: 'T-24h',
        action: 'Ava sent reminder SMS',
        outcome: 'Delivered · No response',
        icon: 'sms',
      },
    ],
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    phone: '(555) 234-5678',
    appointmentDate: 'Tomorrow',
    appointmentTime: '11:00 AM',
    provider: 'Dr. Patel',
    intakeStatus: 'in-progress',
    progressDetail: '2 of 4 sections',
    needsAttention: false,
    lastAutomationStep: 'Link clicked · Form in progress',
    statusBadge: 'On track',
    totalAttempts: 2,
    lastTouch: '2h ago via SMS',
    channelActivity: {
      sms: { sent: 2, status: 'delivered' },
      email: { sent: 0, status: 'delivered' },
      call: { attempts: 0, status: 'completed' },
    },
    timeline: [
      {
        id: 'e1',
        timing: 'T-48h',
        action: 'Ava sent SMS with intake link',
        outcome: 'Delivered',
        icon: 'sms',
      },
      {
        id: 'e2',
        timing: 'T-24h',
        action: 'Ava sent reminder SMS',
        outcome: 'Delivered · Link clicked',
        icon: 'sms',
      },
      {
        id: 'e3',
        timing: 'T-12h',
        action: 'Form partially completed',
        outcome: 'Missing clinical history section',
        details: 'Patient started intake, 2 of 4 sections complete',
        icon: 'ava',
      },
    ],
  },
  {
    id: '3',
    name: 'Emma Davis',
    phone: '(555) 345-6789',
    appointmentDate: 'In 2 days',
    appointmentTime: '2:00 PM',
    provider: 'Dr. Williams',
    intakeStatus: 'completed',
    needsAttention: false,
    lastAutomationStep: 'Intake completed',
    statusBadge: 'Completed',
    totalAttempts: 1,
    lastTouch: '1 day ago via SMS',
    channelActivity: {
      sms: { sent: 1, status: 'delivered' },
      email: { sent: 0, status: 'delivered' },
      call: { attempts: 0, status: 'completed' },
    },
    timeline: [
      {
        id: 'e1',
        timing: 'T-72h',
        action: 'Ava sent SMS with intake link',
        outcome: 'Delivered · Link clicked',
        icon: 'sms',
      },
      {
        id: 'e2',
        timing: 'T-60h',
        action: 'Intake form completed',
        outcome: 'All sections submitted',
        icon: 'ava',
      },
    ],
  },
  {
    id: '4',
    name: 'James Wilson',
    phone: '(555) 456-7890',
    appointmentDate: 'Tomorrow',
    appointmentTime: '3:30 PM',
    provider: 'Dr. Rodriguez',
    intakeStatus: 'not-started',
    needsAttention: true,
    attentionReason: 'failed-contact',
    lastAutomationStep: 'Call attempt failed',
    statusBadge: 'Escalated',
    recommendedAction: 'Send manual link',
    totalAttempts: 4,
    lastTouch: '3h ago via Call',
    channelActivity: {
      sms: { sent: 2, status: 'failed' },
      email: { sent: 1, status: 'delivered' },
      call: { attempts: 1, status: 'failed' },
    },
    timeline: [
      {
        id: 'e1',
        timing: 'T-48h',
        action: 'Ava sent SMS with intake link',
        outcome: 'Failed to deliver',
        icon: 'sms',
      },
      {
        id: 'e2',
        timing: 'T-36h',
        action: 'Ava sent email with intake link',
        outcome: 'Delivered · No response',
        icon: 'email',
      },
      {
        id: 'e3',
        timing: 'T-24h',
        action: 'Ava called patient',
        outcome: 'No answer · Could not connect',
        icon: 'call',
      },
    ],
  },
];

const automationRules = [
  { timing: 'T-72h', action: 'Send SMS with intake link' },
  { timing: 'T-48h', action: 'If not completed, send reminder SMS' },
  { timing: 'T-36h', action: 'If still no response, Ava calls and offers to complete intake by phone' },
  { timing: 'T-24h', action: 'Alert staff if intake still incomplete' },
];

export function IntakeOperationsPage({ appointments, onUpdateAppointment }: IntakeOperationsPageProps) {
  const [automationActive, setAutomationActive] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilter>('all');
  const [journeyFilter, setJourneyFilter] = useState<JourneyFilter>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsActive, setSettingsActive] = useState(true);
  
  // Settings state
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>(['new-patient', 'follow-up', 'telehealth']);
  const [automationSteps, setAutomationSteps] = useState([
    { id: '1', time: 'T-72h', condition: 'Always', channel: 'SMS', template: 'Initial intake link – Mental Health' },
    { id: '2', time: 'T-48h', condition: 'If intake not completed', channel: 'SMS', template: 'Reminder SMS' },
    { id: '3', time: 'T-36h', condition: 'If no response', channel: 'Ava call', template: 'Ava call script – Complete intake by phone' },
  ]);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [avaEnabled, setAvaEnabled] = useState(true);
  const [excludedDays, setExcludedDays] = useState<string[]>(['sat', 'sun']);

  const needsAttentionPatients = mockPatients.filter(p => p.needsAttention);
  const totalPatients = mockPatients.length;
  const completedCount = mockPatients.filter(p => p.intakeStatus === 'completed').length;
  const completionRate = Math.round((completedCount / totalPatients) * 100);

  const filteredAttentionPatients = attentionFilter === 'all' 
    ? needsAttentionPatients 
    : needsAttentionPatients.filter(p => p.attentionReason === attentionFilter);

  // Group patients by date
  const groupedPatients: Record<string, Patient[]> = {};
  mockPatients.forEach(patient => {
    if (!groupedPatients[patient.appointmentDate]) {
      groupedPatients[patient.appointmentDate] = [];
    }
    groupedPatients[patient.appointmentDate].push(patient);
  });

  const getStatusColor = (status: string) => {
    if (status.includes('Completed') || status.includes('On track')) return '#10B981';
    if (status.includes('Needs') || status.includes('At risk')) return '#F59E0B';
    if (status.includes('Escalated') || status.includes('Failed')) return '#EF4444';
    return '#6B7280';
  };

  const getChannelIcon = (channel: 'sms' | 'email' | 'call' | 'ava') => {
    switch (channel) {
      case 'sms': return MessageSquare;
      case 'email': return Mail;
      case 'call': return Phone;
      case 'ava': return Sparkles;
    }
  };

  return (
    <div className="h-screen overflow-y-auto" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="min-h-[1600px]">
        {/* PAGE HEADER */}
        <div
          className="border-b"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            {/* Title row with controls */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Intake Operations
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Automated intake reminders, follow-ups, and Ava-assisted outreach
                </p>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-3">
                {/* Time filter segmented control */}
                <div
                  className="flex rounded-lg border p-1"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  {(['today', 'next-7-days', 'all-upcoming'] as TimeFilter[]).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className="px-3 py-1.5 rounded text-sm font-medium transition-all"
                      style={{
                        backgroundColor: timeFilter === filter ? 'var(--surface-card)' : 'transparent',
                        color: timeFilter === filter ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      {filter === 'today' ? 'Today' : filter === 'next-7-days' ? 'Next 7 days' : 'All upcoming'}
                    </button>
                  ))}
                </div>

                {/* Automation toggle */}
                <button
                  onClick={() => setAutomationActive(!automationActive)}
                  className="px-4 py-2 rounded-lg border font-medium text-sm flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor: automationActive ? 'var(--surface-card)' : '#EF4444',
                    borderColor: automationActive ? 'var(--border-default)' : '#EF4444',
                    color: automationActive ? 'var(--text-primary)' : 'white',
                  }}
                >
                  {automationActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {automationActive ? 'Pause automation' : 'Resume automation'}
                </button>

                {/* Settings button */}
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 rounded-lg border font-medium text-sm flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Automation settings
                </button>
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex gap-3">
              <div
                className="px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Patients on intake journey:{' '}
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {totalPatients}
                  </span>
                </span>
              </div>
              <div
                className="px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Completed intake:{' '}
                  <span className="font-semibold" style={{ color: '#10B981' }}>
                    {completionRate}%
                  </span>
                </span>
              </div>
              <div
                className="px-4 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Need attention:{' '}
                  <span className="font-semibold" style={{ color: '#F59E0B' }}>
                    {needsAttentionPatients.length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* LEFT: Main content */}
            <div className="flex-1 space-y-6">
              {/* NEEDS ATTENTION TRIAGE PANEL */}
              {needsAttentionPatients.length > 0 && (
                <div
                  className="rounded-2xl border"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Patients needing attention
                    </h2>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      {needsAttentionPatients.length} patients need attention · 2 no responses · 1 failed contact · 1 reported issues
                    </p>

                    {/* Filter pills */}
                    <div className="flex gap-2">
                      {(['all', 'no-response', 'failed-contact', 'reported-issue', 'overdue'] as AttentionFilter[]).map(filter => (
                        <button
                          key={filter}
                          onClick={() => setAttentionFilter(filter)}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                          style={{
                            backgroundColor: attentionFilter === filter ? 'var(--accent-primary-bg)' : 'var(--surface-canvas)',
                            color: attentionFilter === filter ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            border: `1px solid ${attentionFilter === filter ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                          }}
                        >
                          {filter === 'all' ? 'All' : 
                           filter === 'no-response' ? 'No response' :
                           filter === 'failed-contact' ? 'Failed contact' :
                           filter === 'reported-issue' ? 'Reported issue' : 'Overdue intake'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b" style={{ borderColor: 'var(--border-default)' }}>
                          <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Patient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Appointment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Provider
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Last automation step
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Recommended action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAttentionPatients.map(patient => (
                          <tr
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className="border-b cursor-pointer transition-all"
                            style={{ borderColor: 'var(--border-default)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                  {patient.name}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {patient.phone}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                {patient.appointmentDate}
                              </div>
                              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {patient.appointmentTime}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                {patient.provider}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {patient.lastAutomationStep}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: `${getStatusColor(patient.statusBadge)}20`,
                                  color: getStatusColor(patient.statusBadge),
                                }}
                              >
                                {patient.statusBadge}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {patient.recommendedAction && (
                                <button
                                  className="px-3 py-1 rounded-lg text-xs font-medium"
                                  style={{
                                    backgroundColor: 'var(--accent-primary)',
                                    color: 'white',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  {patient.recommendedAction}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ACTIVE AUTOMATION TIMELINE */}
              <div
                className="rounded-2xl border"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Active intake journeys
                  </h2>

                  {/* Filter chips */}
                  <div className="flex gap-2">
                    {(['all', 'on-track', 'completing-now', 'at-risk'] as JourneyFilter[]).map(filter => (
                      <button
                        key={filter}
                        onClick={() => setJourneyFilter(filter)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                        style={{
                          backgroundColor: journeyFilter === filter ? 'var(--accent-primary-bg)' : 'var(--surface-canvas)',
                          color: journeyFilter === filter ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          border: `1px solid ${journeyFilter === filter ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                        }}
                      >
                        {filter === 'all' ? 'All patients' : 
                         filter === 'on-track' ? 'On track' :
                         filter === 'completing-now' ? 'Completing now' : 'At risk (intake pending)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grouped list */}
                <div className="p-6 space-y-6">
                  {Object.entries(groupedPatients).map(([date, patients]) => (
                    <div key={date}>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {date}
                      </h3>
                      <div className="space-y-2">
                        {patients.map(patient => (
                          <div
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className="p-4 rounded-lg border cursor-pointer transition-all"
                            style={{
                              backgroundColor: 'var(--surface-canvas)',
                              borderColor: 'var(--border-default)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                    {patient.name}
                                  </span>
                                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    {patient.appointmentTime}
                                  </span>
                                  <span
                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                    style={{
                                      backgroundColor: `${getStatusColor(patient.statusBadge)}20`,
                                      color: getStatusColor(patient.statusBadge),
                                    }}
                                  >
                                    {patient.intakeStatus === 'completed' ? 'Completed' :
                                     patient.intakeStatus === 'in-progress' ? `In progress ${patient.progressDetail || ''}` :
                                     'Not started'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {/* Channel icons */}
                                  <div className="flex items-center gap-2">
                                    {patient.channelActivity.sms.sent > 0 && (
                                      <div className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>{patient.channelActivity.sms.sent}</span>
                                        <div
                                          className="w-1.5 h-1.5 rounded-full"
                                          style={{
                                            backgroundColor:
                                              patient.channelActivity.sms.status === 'delivered' ? '#10B981' :
                                              patient.channelActivity.sms.status === 'pending' ? '#F59E0B' : '#EF4444',
                                          }}
                                        />
                                      </div>
                                    )}
                                    {patient.channelActivity.email.sent > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>{patient.channelActivity.email.sent}</span>
                                        <div
                                          className="w-1.5 h-1.5 rounded-full"
                                          style={{
                                            backgroundColor:
                                              patient.channelActivity.email.status === 'delivered' ? '#10B981' :
                                              patient.channelActivity.email.status === 'pending' ? '#F59E0B' : '#EF4444',
                                          }}
                                        />
                                      </div>
                                    )}
                                    {patient.channelActivity.call.attempts > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>{patient.channelActivity.call.attempts}</span>
                                        <div
                                          className="w-1.5 h-1.5 rounded-full"
                                          style={{
                                            backgroundColor:
                                              patient.channelActivity.call.status === 'completed' ? '#10B981' :
                                              patient.channelActivity.call.status === 'voicemail' ? '#F59E0B' : '#EF4444',
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <span>·</span>
                                  <span>{patient.totalAttempts} attempts</span>
                                  <span>·</span>
                                  <span>Last touch: {patient.lastTouch}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Automation rules panel */}
            <div
              className="w-80 rounded-2xl border p-6 h-fit sticky top-6"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Automation recipe
              </h2>

              {/* Rule flow */}
              <div className="space-y-3 mb-6">
                {automationRules.map((rule, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                        style={{
                          backgroundColor: 'var(--accent-primary-bg)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        {idx + 1}
                      </div>
                      {idx < automationRules.length - 1 && (
                        <div
                          className="w-0.5 h-6 my-1"
                          style={{ backgroundColor: 'var(--border-default)' }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                        {rule.timing}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {rule.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini KPIs */}
              <div
                className="p-4 rounded-lg space-y-2 mb-4"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Completion before visit
                  </span>
                  <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
                    72%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Avg attempts per patient
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    2.3
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Diverted to Ava call
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
                    18%
                  </span>
                </div>
              </div>

              {/* Edit link */}
              <button
                className="w-full text-sm font-medium transition-all"
                style={{ color: 'var(--accent-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Edit automation in Settings →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PATIENT JOURNEY DRAWER */}
      {selectedPatient && (
        <div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[500px] overflow-y-auto"
            style={{ backgroundColor: 'var(--surface-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div
              className="sticky top-0 z-10 px-6 py-4 border-b"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {selectedPatient.name}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {selectedPatient.appointmentDate} at {selectedPatient.appointmentTime} · {selectedPatient.provider}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <span
                className="px-3 py-1 rounded-lg text-sm font-medium inline-block"
                style={{
                  backgroundColor: `${getStatusColor(selectedPatient.statusBadge)}20`,
                  color: getStatusColor(selectedPatient.statusBadge),
                }}
              >
                {selectedPatient.statusBadge}
              </span>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Automation timeline
              </h3>
              <div className="space-y-4">
                {selectedPatient.timeline.map((event, idx) => {
                  const Icon = getChannelIcon(event.icon);
                  return (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: 'var(--accent-primary-bg)',
                            color: 'var(--accent-primary)',
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {idx < selectedPatient.timeline.length - 1 && (
                          <div
                            className="w-0.5 flex-1 my-1 min-h-[20px]"
                            style={{ backgroundColor: 'var(--border-default)' }}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                          {event.timing}
                        </div>
                        <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                          {event.action}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {event.outcome}
                        </div>
                        {event.details && (
                          <div
                            className="mt-2 p-3 rounded-lg text-xs"
                            style={{
                              backgroundColor: 'var(--surface-canvas)',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {event.details}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next best actions */}
            <div
              className="sticky bottom-0 p-6 border-t space-y-2"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Next best actions
              </h3>
              <button
                className="w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                }}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Call patient now
              </button>
              <button
                className="w-full px-4 py-2.5 rounded-lg border font-medium text-sm transition-all"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Send manual intake link
              </button>
              <button
                className="w-full px-4 py-2.5 rounded-lg border font-medium text-sm transition-all"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <CheckCircle2 className="w-4 h-4 inline mr-2" />
                Mark intake as complete
              </button>
              <button
                className="w-full px-4 py-2.5 rounded-lg border font-medium text-sm transition-all"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Snooze until tomorrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTOMATION SETTINGS DRAWER */}
      <AutomationSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}