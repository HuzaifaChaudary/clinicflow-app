import { X, Phone, MessageSquare, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from './foundation/Button';
import { Card } from './foundation/Card';
import { StatusChip } from './foundation/StatusChip';

interface VoiceCall {
  id: string;
  patientName: string;
  time: string;
  date: string;
  type: 'confirmation' | 'reminder' | 'follow-up';
  outcome: 'confirmed' | 'rescheduled' | 'no-answer' | 'voicemail';
  duration: string;
  transcript?: string;
}

interface VoiceActivityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  calls: VoiceCall[];
}

export function VoiceActivityPanel({ isOpen, onClose, calls }: VoiceActivityPanelProps) {
  const [expandedCall, setExpandedCall] = useState<string | null>(null);

  if (!isOpen) return null;

  const getOutcomeChip = (outcome: string) => {
    switch (outcome) {
      case 'confirmed':
        return <StatusChip type="confirmed" size="sm" />;
      case 'rescheduled':
        return <StatusChip type="rescheduled" size="sm" />;
      case 'no-answer':
        return <StatusChip type="alert" label="No answer" size="sm" />;
      case 'voicemail':
        return <StatusChip type="alert" label="Voicemail" size="sm" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-default"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 w-[560px] z-50 overflow-auto animate-slide-in-right"
        style={{
          backgroundColor: 'var(--surface-card)',
          boxShadow: 'var(--shadow-3)',
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 px-8 py-6 backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderBottom: '1.5px solid var(--border-default)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ color: 'var(--text-primary)' }}>Voice Activity</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {calls.length} calls logged today
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-default"
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
        </div>

        {/* Call List */}
        <div className="p-8 space-y-4">
          {calls.map((call) => {
            const isExpanded = expandedCall === call.id;

            return (
              <div
                key={call.id}
                className="p-6 rounded-xl transition-default"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  border: '1.5px solid var(--border-subtle)',
                }}
              >
                {/* Call Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: 'var(--accent-primary-bg)',
                      }}
                    >
                      <Phone className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div className="flex-1">
                      <div style={{ color: 'var(--text-primary)' }} className="font-medium mb-1">
                        {call.patientName}
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{call.date} at {call.time}</span>
                        <span>•</span>
                        <span>{call.duration}</span>
                      </div>
                    </div>
                  </div>
                  {getOutcomeChip(call.outcome)}
                </div>

                {/* Call Type */}
                <div 
                  className="px-3 py-2 rounded-lg mb-3 text-sm"
                  style={{
                    backgroundColor: 'var(--surface-hover)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {call.type.charAt(0).toUpperCase() + call.type.slice(1)} call
                </div>

                {/* Transcript Toggle */}
                {call.transcript && (
                  <>
                    <button
                      onClick={() => setExpandedCall(isExpanded ? null : call.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>View transcript</span>
                      </div>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    {/* Transcript */}
                    {isExpanded && (
                      <div 
                        className="mt-3 p-4 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--surface-background)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                          TRANSCRIPT
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                          {call.transcript}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {calls.length === 0 && (
            <div 
              className="text-center py-12"
              style={{ color: 'var(--text-muted)' }}
            >
              No voice activity recorded
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Mock data generator
export function generateMockVoiceCalls(): VoiceCall[] {
  return [
    {
      id: '1',
      patientName: 'Sarah Martinez',
      time: '8:15 AM',
      date: 'Today',
      type: 'confirmation',
      outcome: 'confirmed',
      duration: '1m 23s',
      transcript: 'AI: Hi Sarah, this is Clinicflow calling to confirm your appointment today at 8:00 AM with Dr. Chen.\n\nPatient: Yes, I\'ll be there.\n\nAI: Great! We\'ll see you then. Please arrive 10 minutes early to complete any paperwork.',
    },
    {
      id: '2',
      patientName: 'Michael Brown',
      time: '9:45 AM',
      date: 'Today',
      type: 'reminder',
      outcome: 'no-answer',
      duration: '0m 30s',
    },
    {
      id: '3',
      patientName: 'Emily Johnson',
      time: '2:30 PM',
      date: 'Yesterday',
      type: 'confirmation',
      outcome: 'rescheduled',
      duration: '2m 15s',
      transcript: 'AI: Hi Emily, confirming your appointment tomorrow at 9:00 AM.\n\nPatient: Actually, I need to reschedule. Can we do next week?\n\nAI: Of course. I\'ll note that and have the office reach out with new times.',
    },
    {
      id: '4',
      patientName: 'David Kim',
      time: '11:00 AM',
      date: 'Yesterday',
      type: 'follow-up',
      outcome: 'voicemail',
      duration: '0m 45s',
    },
  ];
}