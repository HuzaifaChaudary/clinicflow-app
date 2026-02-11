import { Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface EnhancedVoiceCallCardProps {
  appointment: Appointment;
  onClick: () => void;
}

export function EnhancedVoiceCallCard({ appointment, onClick }: EnhancedVoiceCallCardProps) {
  const lastCall = appointment.voiceCallAttempts?.[appointment.voiceCallAttempts.length - 1];
  const needsAttention = lastCall?.needsAttention;
  const isLive = lastCall?.status === 'in-progress';

  return (
    <div
      onClick={onClick}
      className=\"p-4 rounded-lg border cursor-pointer transition-all\"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: needsAttention ? 'var(--status-warning)' : 'var(--border-default)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className=\"flex items-start gap-3\">
        {isLive && (
          <span className=\"relative flex h-2 w-2 mt-2\">
            <span
              className=\"animate-ping absolute inline-flex h-full w-full rounded-full opacity-75\"
              style={{ backgroundColor: 'var(--status-info)' }}
            ></span>
            <span
              className=\"relative inline-flex rounded-full h-2 w-2\"
              style={{ backgroundColor: 'var(--status-info)' }}
            ></span>
          </span>
        )}
        <div className=\"flex-1\">
          <p className=\"font-semibold mb-1\" style={{ color: 'var(--text-primary)' }}>
            {appointment.patientName}
          </p>
          <p className=\"text-sm mb-2\" style={{ color: 'var(--text-secondary)' }}>
            {appointment.time} • {appointment.provider}
          </p>
          {lastCall && (
            <div className=\"flex items-center gap-2\">
              {lastCall.status === 'completed' && (
                <CheckCircle className=\"w-4 h-4\" style={{ color: 'var(--status-success)' }} />
              )}
              {needsAttention && (
                <AlertCircle className=\"w-4 h-4\" style={{ color: 'var(--status-warning)' }} />
              )}
              <span className=\"text-xs\" style={{ color: 'var(--text-secondary)' }}>
                {lastCall.duration} • {lastCall.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
