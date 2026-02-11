import { useState, useMemo } from 'react';
import { 
  Phone, MessageSquare, Sparkles, TrendingUp, TrendingDown, 
  Settings, Calendar, FileText, PhoneCall, MessageCircle, 
  AlertTriangle, CheckCircle, Clock, BarChart3, Activity,
  ChevronDown, Play, Video, Mail
} from 'lucide-react';
import { Appointment, CancellationReason } from '../types/appointment';
import { TranscriptPanel } from '../components/voice-ai/TranscriptPanel';
import { PatientProfileModal } from '../components/patient/PatientProfileModal';

type ClinicType = 'mental-health' | 'physiotherapy' | 'dental' | 'outpatient';
type AgentMode = 'scheduling' | 'intake-text' | 'intake-call' | 'triage' | 'reminders' | 'followup';
type ConversationStatus = 'scheduled' | 'intake-completed' | 'escalated' | 'no-answer' | 'in-progress';
type Channel = 'phone' | 'sms' | 'whatsapp';

interface VoiceAIPageEnhancedProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
  onReschedule: (appointmentId: string, newTime: string, newProvider: string, newDate: string) => void;
  onCancel: (appointmentId: string, reason: CancellationReason) => void;
}

const clinicTypes = [
  { id: 'mental-health' as ClinicType, label: 'Mental Health Clinics' },
  { id: 'physiotherapy' as ClinicType, label: 'Physiotherapy Clinics' },
  { id: 'dental' as ClinicType, label: 'Dental Clinics' },
  { id: 'outpatient' as ClinicType, label: 'Outpatient Clinics' },
];

const agentModes = [
  { 
    id: 'scheduling' as AgentMode, 
    label: 'Scheduling & Rescheduling',
    description: 'Book, reschedule, and cancel appointments',
    icon: Calendar,
  },
  { 
    id: 'intake-text' as AgentMode, 
    label: 'Intake via Text',
    description: 'Collect intake forms via SMS/WhatsApp',
    icon: MessageSquare,
  },
  { 
    id: 'intake-call' as AgentMode, 
    label: 'Intake via Call',
    description: 'Conversational intake over phone',
    icon: PhoneCall,
  },
  { 
    id: 'triage' as AgentMode, 
    label: 'Triage & Symptom Screening',
    description: 'Pre-visit risk assessment and routing',
    icon: AlertTriangle,
  },
  { 
    id: 'reminders' as AgentMode, 
    label: 'Appointment Reminders',
    description: 'Automated reminder calls and texts',
    icon: Clock,
  },
  { 
    id: 'followup' as AgentMode, 
    label: 'Follow-up Campaigns',
    description: 'Post-visit check-ins and recalls',
    icon: Activity,
  },
];

const intakeSections = [
  {
    id: 'demographics',
    name: 'Demographics',
    fields: 5,
    channels: { text: true, call: true },
    fields_detail: [
      { name: 'Full name', type: 'Text', required: true, channels: 'Text + Call' },
      { name: 'Date of birth', type: 'Date', required: true, channels: 'Text + Call' },
      { name: 'Address', type: 'Text', required: false, channels: 'Text only' },
    ]
  },
  {
    id: 'visit-reason',
    name: 'Visit Reason',
    fields: 3,
    channels: { text: true, call: true },
    fields_detail: [
      { name: 'Chief concern (free text)', type: 'Text', required: true, channels: 'Text + Call' },
      { name: 'Symptom onset', type: 'Date', required: false, channels: 'Text + Call' },
    ]
  },
  {
    id: 'clinical-history',
    name: 'Clinical History',
    fields: 8,
    channels: { text: true, call: false },
    fields_detail: []
  },
  {
    id: 'consent',
    name: 'Consent',
    fields: 2,
    channels: { text: true, call: true },
    fields_detail: []
  },
];

const triageQuestions = [
  {
    id: 'crisis-1',
    question: 'Are you having thoughts of harming yourself or others?',
    riskLevel: 'high' as const,
    outcome: 'Escalate to clinician on call immediately',
  },
  {
    id: 'crisis-2',
    question: 'Have you experienced recent suicidal ideation?',
    riskLevel: 'high' as const,
    outcome: 'Escalate to clinician on call immediately',
  },
  {
    id: 'urgent-1',
    question: 'Are symptoms interfering with daily activities?',
    riskLevel: 'medium' as const,
    outcome: 'Flag for same-day slot',
  },
  {
    id: 'routine-1',
    question: 'Is this a routine follow-up or med check?',
    riskLevel: 'low' as const,
    outcome: 'Continue normal scheduling',
  },
];

export function VoiceAIPageEnhanced({
  appointments,
  onUpdateAppointment,
  onReschedule,
  onCancel,
}: VoiceAIPageEnhancedProps) {
  const [selectedClinicType, setSelectedClinicType] = useState<ClinicType>('mental-health');
  const [enabledModes, setEnabledModes] = useState<Record<AgentMode, boolean>>({
    'scheduling': true,
    'intake-text': true,
    'intake-call': false,
    'triage': true,
    'reminders': true,
    'followup': false,
  });
  const [configTab, setConfigTab] = useState<'intake' | 'triage'>('intake');
  const [expandedSection, setExpandedSection] = useState<string | null>('demographics');
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [transcriptPatient, setTranscriptPatient] = useState<Appointment | null>(null);
  const [timeframe, setTimeframe] = useState<'today' | 'week'>('today');

  // Mock data for conversations
  const conversations = useMemo(() => {
    return appointments.slice(0, 12).map((apt, idx) => ({
      id: apt.id,
      patientName: apt.patientName,
      patientPhone: apt.patientPhone,
      channel: ['phone', 'sms', 'whatsapp'][idx % 3] as Channel,
      mode: Object.keys(enabledModes).filter(m => enabledModes[m as AgentMode])[idx % 4] as AgentMode,
      status: ['scheduled', 'intake-completed', 'escalated', 'no-answer', 'in-progress'][idx % 5] as ConversationStatus,
      timestamp: `${Math.floor(Math.random() * 2) + 1}h ago`,
      duration: idx % 2 === 0 ? '2:34' : '1:12',
      appointment: apt,
    }));
  }, [appointments, enabledModes]);

  // Agent statistics
  const stats = useMemo(() => {
    const totalConversations = conversations.length;
    const enabledModesCount = Object.values(enabledModes).filter(Boolean).length;
    const enabledModesList = Object.entries(enabledModes)
      .filter(([_, enabled]) => enabled)
      .map(([mode, _]) => agentModes.find(m => m.id === mode)?.label)
      .join(', ');
    
    return {
      agentStatus: enabledModesCount > 0 ? 'Online' : 'Limited',
      enabledModesList,
      todayConversations: totalConversations,
      conversationsTrend: 12.5,
      intakeCompletion: 72,
      intakeTextPercent: 68,
      intakeVoicePercent: 22,
      intakeMissingPercent: 10,
      triageTotal: 14,
      triageEscalated: 3,
      triageTrend: -8.2,
    };
  }, [conversations, enabledModes]);

  const toggleMode = (mode: AgentMode) => {
    setEnabledModes(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case 'scheduled': return '#10B981';
      case 'intake-completed': return '#3B82F6';
      case 'escalated': return '#EF4444';
      case 'no-answer': return '#F59E0B';
      case 'in-progress': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case 'phone': return Phone;
      case 'sms': return MessageSquare;
      case 'whatsapp': return MessageCircle;
    }
  };

  const getModeIcon = (mode: AgentMode) => {
    const modeConfig = agentModes.find(m => m.id === mode);
    return modeConfig?.icon || Activity;
  };

  return (
    <div 
      className="h-screen overflow-y-auto" 
      style={{ backgroundColor: 'var(--surface-canvas)' }}
    >
      {/* Content wrapper - ensures minimum height for scrolling */}
      <div className="min-h-[1600px]">
        {/* TOP BAND - Agent Overview */}
      <div
        className="border-b"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Header with Clinic Type Selector */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              <div>
                <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Ava – Voice Operations for {clinicTypes.find(c => c.id === selectedClinicType)?.label}
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Niche-specific voice agent configured for your clinic workflows
                </p>
              </div>
            </div>
            
            {/* Clinic Type Selector */}
            <div className="relative">
              <select
                value={selectedClinicType}
                onChange={(e) => setSelectedClinicType(e.target.value as ClinicType)}
                className="px-4 py-2 pr-10 rounded-full text-sm font-medium appearance-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--cf-blue-10)',
                  color: 'var(--cf-blue-70)',
                  border: '1px solid var(--cf-blue-30)',
                }}
              >
                {clinicTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
                style={{ color: 'var(--cf-blue-70)' }}
              />
            </div>
          </div>

          {/* Agent Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            {/* Agent Status */}
            <div
              className="p-4 rounded-2xl border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Agent Status
                </p>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: stats.agentStatus === 'Online' ? '#10B981' : '#F59E0B' }}
                />
              </div>
              <p className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {stats.agentStatus}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {stats.enabledModesList || 'No modes enabled'}
              </p>
            </div>

            {/* Today's Conversations */}
            <div
              className="p-4 rounded-2xl border cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Today's Conversations
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" style={{ color: '#10B981' }} />
                  <span className="text-xs font-semibold" style={{ color: '#10B981' }}>
                    +{stats.conversationsTrend}%
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {stats.todayConversations}
              </p>
              {/* Mini sparkline */}
              <div className="flex items-end gap-0.5 h-8">
                {[42, 38, 45, 52, 48, 55, 58, 62, 59, 65, 70, 68].map((height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${height}%`,
                      backgroundColor: 'var(--accent-primary)',
                      opacity: 0.3 + (idx * 0.05),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Intake Completion */}
            <div
              className="p-4 rounded-2xl border cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                Intake Completion
              </p>
              <p className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {stats.intakeCompletion}%
              </p>
              {/* Segmented bar */}
              <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-2">
                <div
                  style={{
                    width: `${stats.intakeTextPercent}%`,
                    backgroundColor: '#3B82F6',
                  }}
                  title="Text"
                />
                <div
                  style={{
                    width: `${stats.intakeVoicePercent}%`,
                    backgroundColor: '#8B5CF6',
                  }}
                  title="Voice"
                />
                <div
                  style={{
                    width: `${stats.intakeMissingPercent}%`,
                    backgroundColor: '#EF4444',
                  }}
                  title="Missing"
                />
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Text {stats.intakeTextPercent}%</span>
                <span>Voice {stats.intakeVoicePercent}%</span>
                <span>Missing {stats.intakeMissingPercent}%</span>
              </div>
            </div>

            {/* Triage & Escalations */}
            <div
              className="p-4 rounded-2xl border cursor-pointer transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Triage & Escalations
                </p>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" style={{ color: '#10B981' }} />
                  <span className="text-xs font-semibold" style={{ color: '#10B981' }}>
                    {stats.triageTrend}%
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.triageTotal}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  / {stats.triageEscalated} escalated
                </p>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {Math.round((stats.triageEscalated / stats.triageTotal) * 100)}% escalation rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE WORKSPACE - Configuration & Modes */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* LEFT: Agent Modes */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Ava Modes
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Control which capabilities Ava uses for this clinic type
            </p>

            <div className="space-y-3">
              {agentModes.map((mode) => {
                const Icon = mode.icon;
                const isEnabled = enabledModes[mode.id];
                
                return (
                  <div
                    key={mode.id}
                    className="flex items-center justify-between p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: isEnabled ? 'var(--accent-primary-bg)' : 'var(--surface-canvas)',
                      border: isEnabled ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon 
                        className="w-5 h-5 flex-shrink-0" 
                        style={{ color: isEnabled ? 'var(--accent-primary)' : 'var(--text-muted)' }} 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {mode.label}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {mode.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConfigTab(mode.id.includes('intake') || mode.id === 'triage' ? 
                          (mode.id === 'triage' ? 'triage' : 'intake') : 'intake')}
                        className="p-2 rounded-lg transition-all"
                        style={{ 
                          color: 'var(--text-muted)',
                          display: mode.id.includes('intake') || mode.id === 'triage' ? 'block' : 'none',
                        }}
                        title="Configure"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleMode(mode.id)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                        style={{
                          backgroundColor: isEnabled ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                        }}
                      >
                        <span
                          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                          style={{
                            transform: isEnabled ? 'translateX(24px)' : 'translateX(4px)',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Intake & Triage Config */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            {/* Tabs */}
            <div 
              className="flex border-b"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <button
                onClick={() => setConfigTab('intake')}
                className="flex-1 px-6 py-4 text-sm font-medium transition-all"
                style={{
                  color: configTab === 'intake' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: configTab === 'intake' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  backgroundColor: configTab === 'intake' ? 'var(--surface-canvas)' : 'transparent',
                }}
              >
                Intake
              </button>
              <button
                onClick={() => setConfigTab('triage')}
                className="flex-1 px-6 py-4 text-sm font-medium transition-all"
                style={{
                  color: configTab === 'triage' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: configTab === 'triage' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  backgroundColor: configTab === 'triage' ? 'var(--surface-canvas)' : 'transparent',
                }}
              >
                Triage
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {configTab === 'intake' ? (
                <div>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Define Ava's intake questions once; deliver them via text, voice, or both.
                  </p>

                  {/* Template Selector */}
                  <div className="mb-6">
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                      Intake Template
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-2 pr-10 rounded-lg text-sm appearance-none"
                        style={{
                          backgroundColor: 'var(--surface-canvas)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <option>Mental Health – New Patient</option>
                        <option>Mental Health – Follow-up Visit</option>
                        <option>Crisis Screening Protocol</option>
                      </select>
                      <ChevronDown 
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
                        style={{ color: 'var(--text-muted)' }}
                      />
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-3">
                    {intakeSections.map((section) => (
                      <div
                        key={section.id}
                        className="rounded-xl border overflow-hidden"
                        style={{
                          backgroundColor: 'var(--surface-canvas)',
                          borderColor: expandedSection === section.id ? 'var(--accent-primary)' : 'var(--border-default)',
                        }}
                      >
                        {/* Section Header */}
                        <button
                          onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                          className="w-full px-4 py-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <div className="text-left">
                              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {section.name}
                              </p>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {section.fields} fields
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Channel icons */}
                            <div className="flex items-center gap-1">
                              <MessageSquare 
                                className="w-4 h-4" 
                                style={{ color: section.channels.text ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                              />
                              <Phone 
                                className="w-4 h-4" 
                                style={{ color: section.channels.call ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                              />
                            </div>
                            <ChevronDown 
                              className="w-4 h-4 transition-transform" 
                              style={{ 
                                color: 'var(--text-muted)',
                                transform: expandedSection === section.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                            />
                          </div>
                        </button>

                        {/* Expanded Fields */}
                        {expandedSection === section.id && section.fields_detail.length > 0 && (
                          <div 
                            className="border-t px-4 py-3 space-y-2"
                            style={{ borderColor: 'var(--border-default)' }}
                          >
                            {section.fields_detail.map((field, idx) => (
                              <div 
                                key={idx}
                                className="flex items-center justify-between py-2 px-3 rounded-lg"
                                style={{ backgroundColor: 'var(--surface-card)' }}
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                    {field.name}
                                  </p>
                                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                    {field.type} • {field.required ? 'Required' : 'Optional'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span 
                                    className="px-2 py-1 rounded text-xs font-medium"
                                    style={{
                                      backgroundColor: 'var(--cf-blue-10)',
                                      color: 'var(--cf-blue-70)',
                                    }}
                                  >
                                    {field.channels}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Risk gates Ava uses before scheduling or advising patients.
                  </p>

                  {/* Triage Profile Selector */}
                  <div className="mb-6">
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                      Triage Profile
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-2 pr-10 rounded-lg text-sm appearance-none"
                        style={{
                          backgroundColor: 'var(--surface-canvas)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <option>Mental Health – Crisis Screen</option>
                        <option>Mental Health – Routine Assessment</option>
                        <option>Suicide Risk Protocol</option>
                      </select>
                      <ChevronDown 
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
                        style={{ color: 'var(--text-muted)' }}
                      />
                    </div>
                  </div>

                  {/* Red-flag Questions */}
                  <div className="space-y-3 mb-6">
                    {triageQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border"
                        style={{
                          backgroundColor: 'var(--surface-canvas)',
                          borderColor: q.riskLevel === 'high' ? '#EF4444' : 
                                      q.riskLevel === 'medium' ? '#F59E0B' : '#10B981',
                          borderWidth: '2px',
                        }}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <AlertTriangle 
                            className="w-4 h-4 flex-shrink-0 mt-0.5" 
                            style={{ 
                              color: q.riskLevel === 'high' ? '#EF4444' : 
                                     q.riskLevel === 'medium' ? '#F59E0B' : '#10B981'
                            }} 
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              {q.question}
                            </p>
                            <div className="flex items-center gap-2">
                              <span 
                                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: q.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.1)' : 
                                                  q.riskLevel === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                  color: q.riskLevel === 'high' ? '#EF4444' : 
                                         q.riskLevel === 'medium' ? '#F59E0B' : '#10B981',
                                }}
                              >
                                {q.riskLevel.toUpperCase()} RISK
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs pl-7" style={{ color: 'var(--text-secondary)' }}>
                          → {q.outcome}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Flow Diagram */}
                  <div 
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                      Triage Flow
                    </p>
                    <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                        <span>High Risk (any YES) → Escalate + warm transfer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                        <span>Medium Risk → Flag for same-day slot</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                        <span>Low Risk → Continue normal scheduling</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ZONE - Live Activity & Logs */}
        <div className="grid grid-cols-2 gap-6 pb-12">
          {/* LEFT: Conversation Feed */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Live Conversations
                <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                  ({conversations.length})
                </span>
              </h2>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {conversations.map((conv) => {
                const ChannelIcon = getChannelIcon(conv.channel);
                const ModeIcon = getModeIcon(conv.mode);
                const statusColor = getStatusColor(conv.status);
                const modeLabel = agentModes.find(m => m.id === conv.mode)?.label || conv.mode;
                
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedPatient(conv.appointment)}
                    className="px-6 py-4 border-b cursor-pointer transition-all"
                    style={{ borderColor: 'var(--border-default)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: 'var(--accent-primary-bg)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        <ChannelIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {conv.patientName}
                          </p>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {conv.timestamp}
                          </span>
                        </div>
                        
                        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {conv.patientPhone}
                        </p>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                            style={{
                              backgroundColor: 'var(--cf-blue-10)',
                              color: 'var(--cf-blue-70)',
                            }}
                          >
                            <ModeIcon className="w-3 h-3" />
                            {modeLabel}
                          </span>
                          
                          <span 
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${statusColor}15`,
                              color: statusColor,
                            }}
                          >
                            {conv.status.replace('-', ' ')}
                          </span>
                          
                          {conv.duration && (
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {conv.duration}
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTranscriptPatient(conv.appointment);
                          }}
                          className="mt-2 text-xs flex items-center gap-1"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          <Play className="w-3 h-3" />
                          View transcript
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Ava Insights */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Ava Insights
              </h2>
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as 'today' | 'week')}
                  className="px-3 py-1.5 pr-8 rounded-lg text-xs font-medium appearance-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                </select>
                <ChevronDown 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" 
                  style={{ color: 'var(--text-muted)' }}
                />
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
              {/* Conversations by Mode Chart */}
              <div>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Conversations by Mode
                </p>
                <div className="space-y-2">
                  {[
                    { mode: 'Scheduling', count: 42, color: '#3B82F6' },
                    { mode: 'Intake (Text)', count: 28, color: '#8B5CF6' },
                    { mode: 'Intake (Call)', count: 8, color: '#EC4899' },
                    { mode: 'Triage', count: 14, color: '#F59E0B' },
                    { mode: 'Reminders', count: 35, color: '#10B981' },
                  ].map((item) => (
                    <div key={item.mode}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
                          {item.mode}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          {item.count}
                        </span>
                      </div>
                      <div 
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--surface-canvas)' }}
                      >
                        <div 
                          style={{ 
                            width: `${(item.count / 127) * 100}%`,
                            height: '100%',
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Reasons */}
              <div>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Top Reasons Patients Contacted Ava
                </p>
                <div className="space-y-2">
                  {[
                    { reason: 'Confirm appointment', count: 38 },
                    { reason: 'Reschedule', count: 24 },
                    { reason: 'New symptoms', count: 16 },
                    { reason: 'Intake questions', count: 12 },
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded-lg"
                      style={{ backgroundColor: 'var(--surface-canvas)' }}
                    >
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {item.reason}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI Chips */}
              <div>
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Key Performance Indicators
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div 
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: 'var(--surface-canvas)' }}
                  >
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      Patients completing intake before visit
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                        72%
                      </p>
                      <span className="text-xs font-semibold" style={{ color: '#10B981' }}>
                        +8.5%
                      </span>
                    </div>
                  </div>
                  
                  <div 
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: 'var(--surface-canvas)' }}
                  >
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      Average triage completion time
                    </p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                      1:42
                    </p>
                  </div>
                  
                  <div 
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: 'var(--surface-canvas)' }}
                  >
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      Calls fully handled by Ava (no staff)
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                        84%
                      </p>
                      <span className="text-xs font-semibold" style={{ color: '#10B981' }}>
                        +12.3%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
      </div>
      {/* End of content wrapper */}
    </div>
  );
}