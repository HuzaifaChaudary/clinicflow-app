import { X, Phone, MessageSquare, Mail } from 'lucide-react';
import { Appointment, VoiceCallAttempt, Message } from '../../types/appointment';

interface TranscriptPanelProps {
  appointment: Appointment;
  onClose: () => void;
}

export function TranscriptPanel({ appointment, onClose }: TranscriptPanelProps) {
  const voiceCallAttempts = appointment.voiceCallAttempts || [];
  const messages = appointment.messages || [];

  // Combine and sort all communications by timestamp
  const allCommunications = [
    ...voiceCallAttempts.map(call => ({
      type: 'voice' as const,
      timestamp: call.timestamp,
      data: call,
    })),
    ...messages.map(msg => ({
      type: 'message' as const,
      timestamp: msg.timestamp,
      data: msg,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div
      className="fixed inset-y-0 right-0 w-full md:w-[480px] shadow-2xl z-50 flex flex-col"
      style={{ backgroundColor: 'var(--surface-card)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Communication History
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {appointment.patientName}
            </p>
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {allCommunications.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              No communications yet
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Voice calls and messages will appear here
            </p>
          </div>
        ) : (
          allCommunications.map((comm, idx) => (
            <div key={idx}>
              {comm.type === 'voice' ? (
                <VoiceCallCard call={comm.data as VoiceCallAttempt} />
              ) : (
                <MessageCard message={comm.data as Message} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function VoiceCallCard({ call }: { call: VoiceCallAttempt }) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: 'var(--surface-canvas)',
        borderColor: call.needsAttention ? 'var(--status-warning)' : 'var(--border-default)',
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: 'var(--status-info-bg)',
            color: 'var(--status-info)',
          }}
        >
          <Phone className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Voice Call
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
            {call.status === 'in-progress' && (
              <span
                className="relative flex h-2 w-2"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--status-info)' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--status-info)' }}></span>
              </span>
            )}
          </div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
            {new Date(call.timestamp).toLocaleString()} • Duration: {call.duration}
          </p>
          {call.needsAttention && call.attentionReason && (
            <div
              className="mt-2 px-3 py-2 rounded text-xs font-medium"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                color: 'var(--status-warning)',
              }}
            >
              ⚠️ {call.attentionReason.replace(/-/g, ' ')}
            </div>
          )}
        </div>
      </div>

      {call.transcript && (
        <div
          className="p-3 rounded text-xs font-mono whitespace-pre-wrap"
          style={{
            backgroundColor: 'var(--surface-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-default)',
          }}
        >
          {call.transcript.split('\n').map((line, idx) => {
            const isAI = line.startsWith('AI:');
            const isPatient = line.startsWith('Patient:');
            
            return (
              <div
                key={idx}
                className="mb-2 last:mb-0"
                style={{
                  color: isAI
                    ? 'var(--status-info)'
                    : isPatient
                    ? 'var(--text-primary)'
                    : 'var(--text-secondary)',
                  fontWeight: isAI || isPatient ? 600 : 400,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MessageCard({ message }: { message: Message }) {
  const isInbound = message.direction === 'inbound';
  const icon = message.type === 'sms' ? MessageSquare : Mail;
  const Icon = icon;

  return (
    <div
      className={`p-4 rounded-lg border ${isInbound ? '' : 'ml-8'}`}
      style={{
        backgroundColor: isInbound ? 'var(--surface-canvas)' : 'var(--accent-primary-bg)',
        borderColor: message.needsResponse ? 'var(--status-warning)' : 'var(--border-default)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor:
              message.sender === 'ai'
                ? 'var(--status-info-bg)'
                : message.sender === 'patient'
                ? 'var(--cf-neutral-20)'
                : 'var(--accent-primary-bg)',
            color:
              message.sender === 'ai'
                ? 'var(--status-info)'
                : message.sender === 'patient'
                ? 'var(--text-primary)'
                : 'var(--accent-primary)',
          }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium uppercase"
              style={{
                backgroundColor:
                  message.sender === 'ai'
                    ? 'var(--status-info-bg)'
                    : message.sender === 'patient'
                    ? 'var(--cf-neutral-20)'
                    : 'var(--accent-primary-bg)',
                color:
                  message.sender === 'ai'
                    ? 'var(--status-info)'
                    : message.sender === 'patient'
                    ? 'var(--text-primary)'
                    : 'var(--accent-primary)',
              }}
            >
              {message.sender}
            </span>
            <span className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
              {message.type}
            </span>
            {message.needsResponse && (
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
            {message.content}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {new Date(message.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
