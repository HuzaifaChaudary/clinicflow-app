import { useState } from 'react';
import { Pause, Play, StopCircle, Phone, MessageSquare, Mail, CheckCircle2, AlertCircle, Clock, TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';

interface AIInteraction {
  id: string;
  patient: string;
  channel: 'call' | 'text' | 'email';
  intent: string;
  outcome: 'confirmed' | 'rescheduled' | 'no-response' | 'human-needed';
  timestamp: string;
  confidence: number; // 0-100
  transcript?: {
    messages: Array<{
      role: 'ai' | 'patient';
      text: string;
      keyPhrases?: string[];
    }>;
    aiSummary: string;
    detectedIntent: string;
  };
  adminNotes?: string;
}

type AIStatus = 'active' | 'paused' | 'stopped';
type ConfirmAction = 'pause' | 'resume' | 'stop' | null;

export function VoiceActivityPage() {
  const [aiStatus, setAIStatus] = useState<AIStatus>('active');
  const [expandedInteraction, setExpandedInteraction] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  // Mock data
  const aiSystemData = {
    status: aiStatus,
    mode: 'Confirmation & Reschedule',
    uptime: '12h 34m',
    activeCalls: 2,
    queuedCalls: 7,
  };

  const intelligenceData = {
    confirmationRate: 78,
    confirmationTrend: 'up',
    avgResponseTime: '1.2s',
    responseTrend: 'down',
    needingFollowUp: 5,
    channelEffectiveness: {
      call: 82,
      text: 71,
      email: 45,
    },
  };

  const interactions: AIInteraction[] = [
    {
      id: '1',
      patient: 'Sarah Martinez',
      channel: 'call',
      intent: 'Confirm appointment',
      outcome: 'confirmed',
      timestamp: '2 min ago',
      confidence: 95,
      transcript: {
        messages: [
          { role: 'ai', text: 'Hi Sarah, this is Clinicflow calling to confirm your appointment with Dr. Chen tomorrow at 2:00 PM. Can you confirm you\'ll be able to make it?' },
          { role: 'patient', text: 'Yes, I\'ll be there.', keyPhrases: ['Yes', 'be there'] },
          { role: 'ai', text: 'Perfect! Your appointment is confirmed. We\'ll send you a reminder text one hour before. Is there anything else I can help you with?' },
          { role: 'patient', text: 'No, that\'s all. Thank you!' },
        ],
        aiSummary: 'Patient confirmed attendance for tomorrow\'s appointment. No additional requests or concerns.',
        detectedIntent: 'Confirmation (positive)',
      },
    },
    {
      id: '2',
      patient: 'James Wilson',
      channel: 'text',
      intent: 'Confirm appointment',
      outcome: 'human-needed',
      timestamp: '8 min ago',
      confidence: 62,
      transcript: {
        messages: [
          { role: 'ai', text: 'Hi James! This is Clinicflow. We\'re confirming your appointment tomorrow at 3:30 PM with Dr. Chen. Reply YES to confirm.' },
          { role: 'patient', text: 'Can I come in 30 minutes earlier?', keyPhrases: ['30 minutes earlier'] },
          { role: 'ai', text: 'I understand you\'d like to come earlier. Let me check availability and have a team member reach out to you shortly.' },
        ],
        aiSummary: 'Patient requested time change. Escalated to human staff for scheduling adjustment.',
        detectedIntent: 'Reschedule request',
      },
      adminNotes: 'Need to check if 3:00 PM slot is available.',
    },
    {
      id: '3',
      patient: 'Emily Johnson',
      channel: 'call',
      intent: 'Send intake reminder',
      outcome: 'confirmed',
      timestamp: '15 min ago',
      confidence: 88,
      transcript: {
        messages: [
          { role: 'ai', text: 'Hi Emily, this is Clinicflow. We noticed you haven\'t completed your intake forms yet. Your appointment is tomorrow at 9:00 AM. Would you like me to send you the link again?' },
          { role: 'patient', text: 'Yes please, I lost the email.', keyPhrases: ['Yes', 'lost the email'] },
          { role: 'ai', text: 'No problem! I just sent it to your email. It takes about 5 minutes to complete. Can you fill it out today?' },
          { role: 'patient', text: 'I\'ll do it right now.' },
        ],
        aiSummary: 'Patient acknowledged missing intake. Link resent. Committed to completing today.',
        detectedIntent: 'Assistance with intake forms',
      },
    },
    {
      id: '4',
      patient: 'Michael Brown',
      channel: 'call',
      intent: 'Confirm appointment',
      outcome: 'no-response',
      timestamp: '22 min ago',
      confidence: 0,
    },
    {
      id: '5',
      patient: 'Lisa Anderson',
      channel: 'text',
      intent: 'Confirm appointment',
      outcome: 'rescheduled',
      timestamp: '35 min ago',
      confidence: 91,
      transcript: {
        messages: [
          { role: 'ai', text: 'Hi Lisa! Confirming your appointment with Dr. Patel tomorrow at 11:00 AM. Reply YES to confirm.' },
          { role: 'patient', text: 'I need to reschedule, something came up', keyPhrases: ['reschedule', 'something came up'] },
          { role: 'ai', text: 'I understand. Let me help you find a new time. We have availability next week. A team member will call you within the hour to reschedule.' },
          { role: 'patient', text: 'Perfect thanks' },
        ],
        aiSummary: 'Patient needs to reschedule. Escalated to scheduling team for follow-up.',
        detectedIntent: 'Reschedule request',
      },
    },
    {
      id: '6',
      patient: 'David Kim',
      channel: 'email',
      intent: 'Send intake reminder',
      outcome: 'confirmed',
      timestamp: '1h ago',
      confidence: 75,
    },
  ];

  const handleAIAction = (action: ConfirmAction) => {
    setConfirmAction(action);
  };

  const executeAction = () => {
    if (confirmAction === 'pause') {
      setAIStatus('paused');
    } else if (confirmAction === 'resume') {
      setAIStatus('active');
    } else if (confirmAction === 'stop') {
      setAIStatus('stopped');
    }
    setConfirmAction(null);
  };

  const getChannelIcon = (channel: 'call' | 'text' | 'email') => {
    switch (channel) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'text':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
    }
  };

  const getOutcomeColor = (outcome: AIInteraction['outcome']) => {
    switch (outcome) {
      case 'confirmed':
        return 'var(--status-success)';
      case 'rescheduled':
        return 'var(--status-info)';
      case 'no-response':
        return 'var(--text-muted)';
      case 'human-needed':
        return 'var(--status-warning)';
    }
  };

  const getOutcomeLabel = (outcome: AIInteraction['outcome']) => {
    switch (outcome) {
      case 'confirmed':
        return 'Confirmed';
      case 'rescheduled':
        return 'Rescheduled';
      case 'no-response':
        return 'No response';
      case 'human-needed':
        return 'Human needed';
    }
  };

  const getOutcomeIcon = (outcome: AIInteraction['outcome']) => {
    switch (outcome) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rescheduled':
        return <Clock className="w-4 h-4" />;
      case 'no-response':
        return <Minus className="w-4 h-4" />;
      case 'human-needed':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div className="px-6 py-6 border-b" style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-[1800px] mx-auto">
          <h1 style={{ color: 'var(--text-primary)' }}>AI Voice Center</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Operational control for automated patient communication
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-[300px_1fr_280px] gap-6">
            {/* Left: AI System Status */}
            <div>
              <Card 
                elevation="2" 
                radius="lg"
                style={{
                  background: aiStatus === 'active' 
                    ? 'linear-gradient(135deg, rgba(91, 141, 239, 0.03) 0%, rgba(91, 141, 239, 0.01) 100%)'
                    : 'var(--surface-card)',
                  border: aiStatus === 'active' 
                    ? '1.5px solid rgba(91, 141, 239, 0.2)' 
                    : '1.5px solid var(--border-default)',
                }}
              >
                <div className="space-y-6">
                  {/* Status Indicator */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                      System Status
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div 
                          className={`w-4 h-4 rounded-full ${aiStatus === 'active' ? 'animate-gentle-pulse' : ''}`}
                          style={{ 
                            backgroundColor: aiStatus === 'active' 
                              ? 'var(--status-success)' 
                              : aiStatus === 'paused' 
                                ? 'var(--status-warning)' 
                                : 'var(--text-muted)',
                          }}
                        />
                        {aiStatus === 'active' && (
                          <div 
                            className="absolute inset-0 w-4 h-4 rounded-full animate-ping-slow"
                            style={{ backgroundColor: 'var(--status-success)', opacity: 0.3 }}
                          />
                        )}
                      </div>
                      <span className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                        {aiStatus}
                      </span>
                    </div>
                  </div>

                  {/* Mode */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Current Mode
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {aiSystemData.mode}
                    </div>
                  </div>

                  {/* Uptime */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Uptime Today
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {aiSystemData.uptime}
                    </div>
                  </div>

                  {/* Active & Queued */}
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Active calls
                        </span>
                        <span className="font-semibold" style={{ color: aiStatus === 'active' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                          {aiSystemData.activeCalls}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          Queued calls
                        </span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {aiSystemData.queuedCalls}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Center: Intelligence + Timeline */}
            <div className="space-y-6">
              {/* Intelligence Summary */}
              <Card elevation="2" radius="lg" padding="md">
                <div className="grid grid-cols-4 gap-6">
                  {/* Confirmation Rate */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Confirmation Rate
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {intelligenceData.confirmationRate}%
                      </span>
                      {intelligenceData.confirmationTrend === 'up' ? (
                        <TrendingUp className="w-4 h-4 mb-1" style={{ color: 'var(--status-success)' }} />
                      ) : (
                        <TrendingDown className="w-4 h-4 mb-1" style={{ color: 'var(--status-error)' }} />
                      )}
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${intelligenceData.confirmationRate}%`,
                          backgroundColor: 'var(--accent-primary)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Avg Response Time */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Avg Response
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {intelligenceData.avgResponseTime}
                      </span>
                      {intelligenceData.responseTrend === 'down' ? (
                        <TrendingUp className="w-4 h-4 mb-1" style={{ color: 'var(--status-success)' }} />
                      ) : (
                        <TrendingDown className="w-4 h-4 mb-1" style={{ color: 'var(--status-error)' }} />
                      )}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {intelligenceData.responseTrend === 'down' ? 'Faster' : 'Slower'} than yesterday
                    </div>
                  </div>

                  {/* Needing Follow-up */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Need Follow-up
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-2xl font-semibold" style={{ color: 'var(--status-warning)' }}>
                        {intelligenceData.needingFollowUp}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Patients awaiting human contact
                    </div>
                  </div>

                  {/* Channel Effectiveness */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Channel Success
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div 
                            className="h-full"
                            style={{ 
                              width: `${intelligenceData.channelEffectiveness.call}%`,
                              backgroundColor: 'var(--accent-primary)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {intelligenceData.channelEffectiveness.call}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div 
                            className="h-full"
                            style={{ 
                              width: `${intelligenceData.channelEffectiveness.text}%`,
                              backgroundColor: 'var(--status-info)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {intelligenceData.channelEffectiveness.text}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div 
                            className="h-full"
                            style={{ 
                              width: `${intelligenceData.channelEffectiveness.email}%`,
                              backgroundColor: 'var(--text-muted)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {intelligenceData.channelEffectiveness.email}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* AI Interaction Timeline */}
              <Card elevation="2" radius="lg" padding="none">
                <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <h3 style={{ color: 'var(--text-primary)' }}>Recent Interactions</h3>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                  {interactions.map((interaction) => {
                    const isExpanded = expandedInteraction === interaction.id;

                    return (
                      <div key={interaction.id}>
                        {/* Interaction Row */}
                        <button
                          onClick={() => setExpandedInteraction(isExpanded ? null : interaction.id)}
                          className="w-full px-6 py-4 text-left motion-hover"
                          style={{ backgroundColor: 'transparent' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr_auto] gap-4 items-center">
                            {/* Patient */}
                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {interaction.patient}
                            </div>

                            {/* Channel */}
                            <div className="flex items-center gap-2">
                              <div style={{ color: 'var(--accent-primary)' }}>
                                {getChannelIcon(interaction.channel)}
                              </div>
                              <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                                {interaction.channel}
                              </span>
                            </div>

                            {/* Intent */}
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {interaction.intent}
                            </div>

                            {/* Outcome */}
                            <div className="flex items-center gap-2">
                              <div style={{ color: getOutcomeColor(interaction.outcome) }}>
                                {getOutcomeIcon(interaction.outcome)}
                              </div>
                              <span className="text-sm" style={{ color: getOutcomeColor(interaction.outcome) }}>
                                {getOutcomeLabel(interaction.outcome)}
                              </span>
                            </div>

                            {/* Timestamp */}
                            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                              {interaction.timestamp}
                            </div>

                            {/* Confidence */}
                            {interaction.confidence > 0 && (
                              <div className="flex items-center gap-2">
                                <div 
                                  className="px-2 py-1 rounded text-xs font-medium"
                                  style={{ 
                                    backgroundColor: interaction.confidence >= 80 
                                      ? 'rgba(91, 141, 239, 0.12)' 
                                      : interaction.confidence >= 60 
                                        ? 'var(--status-warning-bg)' 
                                        : 'var(--surface-canvas)',
                                    color: interaction.confidence >= 80 
                                      ? 'var(--accent-primary)' 
                                      : interaction.confidence >= 60 
                                        ? 'var(--status-warning)' 
                                        : 'var(--text-muted)',
                                  }}
                                >
                                  {interaction.confidence}%
                                </div>
                              </div>
                            )}
                          </div>
                        </button>

                        {/* Expanded Transcript */}
                        {isExpanded && interaction.transcript && (
                          <div 
                            className="px-6 pb-6 animate-fade-in"
                            style={{ backgroundColor: 'var(--surface-canvas)' }}
                          >
                            <div className="grid grid-cols-2 gap-6">
                              {/* Left: Transcript */}
                              <div>
                                <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                                  Conversation
                                </div>
                                <div className="space-y-3">
                                  {interaction.transcript.messages.map((message, i) => (
                                    <div 
                                      key={i}
                                      className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                    >
                                      <div 
                                        className="max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed"
                                        style={{
                                          backgroundColor: message.role === 'ai' 
                                            ? 'rgba(91, 141, 239, 0.08)' 
                                            : 'var(--surface-card)',
                                          color: 'var(--text-primary)',
                                        }}
                                      >
                                        {message.keyPhrases ? (
                                          <span>
                                            {message.text.split(new RegExp(`(${message.keyPhrases.join('|')})`, 'gi')).map((part, j) => 
                                              message.keyPhrases?.some(phrase => phrase.toLowerCase() === part.toLowerCase()) ? (
                                                <span 
                                                  key={j}
                                                  className="font-semibold"
                                                  style={{ color: 'var(--accent-primary)' }}
                                                >
                                                  {part}
                                                </span>
                                              ) : (
                                                <span key={j}>{part}</span>
                                              )
                                            )}
                                          </span>
                                        ) : (
                                          message.text
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Right: AI Analysis */}
                              <div className="space-y-4">
                                {/* AI Summary */}
                                <div>
                                  <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    AI Summary
                                  </div>
                                  <div 
                                    className="p-3 rounded-lg text-sm leading-relaxed"
                                    style={{ 
                                      backgroundColor: 'var(--surface-card)',
                                      color: 'var(--text-secondary)',
                                    }}
                                  >
                                    {interaction.transcript.aiSummary}
                                  </div>
                                </div>

                                {/* Detected Intent */}
                                <div>
                                  <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    Detected Intent
                                  </div>
                                  <div 
                                    className="px-3 py-2 rounded-lg text-sm font-medium inline-block"
                                    style={{ 
                                      backgroundColor: 'rgba(91, 141, 239, 0.12)',
                                      color: 'var(--accent-primary)',
                                    }}
                                  >
                                    {interaction.transcript.detectedIntent}
                                  </div>
                                </div>

                                {/* Admin Notes */}
                                {interaction.adminNotes && (
                                  <div>
                                    <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                      Admin Notes
                                    </div>
                                    <div 
                                      className="p-3 rounded-lg text-sm leading-relaxed"
                                      style={{ 
                                        backgroundColor: 'var(--status-warning-bg)',
                                        color: 'var(--text-secondary)',
                                      }}
                                    >
                                      {interaction.adminNotes}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right: AI Controls */}
            <div>
              <Card elevation="2" radius="lg">
                <div className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                  AI Controls
                </div>
                <div className="space-y-3">
                  {aiStatus === 'active' && (
                    <button
                      onClick={() => handleAIAction('pause')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium motion-hover"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        color: 'var(--text-primary)',
                        border: '1.5px solid var(--border-default)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                      }}
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause AI</span>
                    </button>
                  )}

                  {aiStatus === 'paused' && (
                    <button
                      onClick={() => handleAIAction('resume')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium motion-hover"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        color: 'var(--text-inverse)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                      }}
                    >
                      <Play className="w-4 h-4" />
                      <span>Resume AI</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleAIAction('stop')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium motion-hover"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      color: 'var(--text-muted)',
                      border: '1.5px solid var(--border-default)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>Stop for Today</span>
                  </button>

                  <div 
                    className="mt-6 p-3 rounded-lg text-xs leading-relaxed"
                    style={{ 
                      backgroundColor: 'var(--surface-canvas)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    AI controls affect all automated outreach. Active calls will complete before changes take effect.
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setConfirmAction(null)}
          />
          
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-fade-in"
          >
            <Card elevation="3" radius="lg">
              <div className="flex items-start justify-between mb-4">
                <h3 style={{ color: 'var(--text-primary)' }}>
                  {confirmAction === 'pause' && 'Pause AI System'}
                  {confirmAction === 'resume' && 'Resume AI System'}
                  {confirmAction === 'stop' && 'Stop AI for Today'}
                </h3>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="p-1 rounded-lg motion-hover"
                  style={{ color: 'var(--text-muted)' }}
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

              <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {confirmAction === 'pause' && 'The AI will stop making new calls but will complete active conversations. Queued calls will be held.'}
                {confirmAction === 'resume' && 'The AI will resume making calls from the queue. This will restart automated patient outreach.'}
                {confirmAction === 'stop' && 'The AI will stop all outreach for today. Active calls will complete. The system will automatically resume tomorrow.'}
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => setConfirmAction(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant={confirmAction === 'resume' ? 'primary' : 'secondary'}
                  size="md"
                  fullWidth
                  onClick={executeAction}
                >
                  Confirm
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
