import { useState } from 'react';
import { Phone, Mail, FileText, MoreVertical, Video, MapPin, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface PatientTableRowProps {
  patient: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    appointmentTime: string;
    provider: string;
    visitType: 'in-clinic' | 'virtual';
    status: {
      confirmed: boolean;
      intakeComplete: boolean;
      arrived: boolean;
    };
    automation: {
      attemptCount: number;
      lastAttempt?: Date;
    };
  };
  onClick?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
  onSendIntake?: () => void;
}

export function PatientTableRow({ 
  patient, 
  onClick,
  onCall,
  onMessage,
  onSendIntake,
}: PatientTableRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatLastAttempt = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all border-b items-center"
      style={{
        backgroundColor: isHovered ? 'var(--surface-hover)' : 'transparent',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Patient info - 3 cols */}
      <div className="col-span-3">
        <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          {patient.name}
        </div>
        <div className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          {patient.email ? (
            <>
              <Mail className="w-3 h-3" />
              <span className="truncate">{patient.email}</span>
            </>
          ) : (
            <>
              <Phone className="w-3 h-3" />
              <span>{patient.phone}</span>
            </>
          )}
        </div>
      </div>

      {/* Appointment - 2 cols */}
      <div className="col-span-2">
        <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          {patient.appointmentTime}
        </div>
        <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {patient.visitType === 'virtual' ? (
            <>
              <Video className="w-3 h-3" />
              <span>Video</span>
            </>
          ) : (
            <>
              <MapPin className="w-3 h-3" />
              <span>In-clinic</span>
            </>
          )}
        </div>
      </div>

      {/* Provider - 2 cols */}
      <div className="col-span-2">
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {patient.provider}
        </div>
      </div>

      {/* Status - 2 cols */}
      <div className="col-span-2 flex flex-wrap gap-1.5">
        {!patient.status.confirmed && (
          <div
            className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: 'var(--status-warning-bg)',
              color: 'var(--status-warning)',
            }}
          >
            <AlertCircle className="w-3 h-3" />
            <span>Unconfirmed</span>
          </div>
        )}
        {!patient.status.intakeComplete && (
          <div
            className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: 'var(--status-error-bg)',
              color: 'var(--status-error)',
            }}
          >
            <FileText className="w-3 h-3" />
            <span>Missing intake</span>
          </div>
        )}
        {patient.status.confirmed && patient.status.intakeComplete && (
          <div
            className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success)',
            }}
          >
            <CheckCircle className="w-3 h-3" />
            <span>Ready</span>
          </div>
        )}
      </div>

      {/* Automation - 1 col */}
      <div className="col-span-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div className="font-medium mb-0.5">
          {patient.automation.attemptCount} attempts
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatLastAttempt(patient.automation.lastAttempt)}</span>
        </div>
      </div>

      {/* Actions - 2 cols */}
      <div className="col-span-2 flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onCall}
          className="p-2 rounded-lg transition-all"
          style={{
            backgroundColor: 'var(--accent-primary)',
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
        </button>

        <button
          onClick={onMessage}
          className="p-2 rounded-lg transition-all"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-card)';
          }}
        >
          <Mail className="w-4 h-4" />
        </button>

        {!patient.status.intakeComplete && (
          <button
            onClick={onSendIntake}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--status-error-bg)',
              border: '1px solid var(--status-error)',
              color: 'var(--status-error)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--status-error)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--status-error-bg)';
              e.currentTarget.style.color = 'var(--status-error)';
            }}
          >
            <FileText className="w-4 h-4" />
          </button>
        )}

        <button
          className="p-2 rounded-lg transition-all"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-card)';
          }}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
