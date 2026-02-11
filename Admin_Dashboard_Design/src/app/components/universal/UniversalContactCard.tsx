import { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, RefreshCcw, FileText, Calendar, Clock, AlertCircle } from 'lucide-react';

interface UniversalContactCardProps {
  patient: {
    id: string;
    patientName: string;
    time: string;
    provider?: string;
    phone?: string;
    email?: string;
    visitType?: string;
    status?: {
      confirmed: boolean;
      intakeComplete: boolean;
    };
    automationAttempts?: number;
  };
  onClose: () => void;
  onCall: (patient: any) => void;
  onSendIntake: (patient: any) => void;
  onReEnroll: (patient: any) => void;
  onViewIntake: (patient: any) => void;
  onJumpToCalendar: (patient: any) => void;
  showFullActions?: boolean;
}

export function UniversalContactCard({
  patient,
  onClose,
  onCall,
  onSendIntake,
  onReEnroll,
  onViewIntake,
  onJumpToCalendar,
  showFullActions = true,
}: UniversalContactCardProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const hasIntakeIssue = !patient.status?.confirmed || !patient.status?.intakeComplete;
  const automationAttempts = patient.automationAttempts || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--surface-card)',
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          opacity: isClosing ? 0 : 1,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {patient.patientName}
            </h3>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Clock className="w-3.5 h-3.5" />
              <span>{patient.time}</span>
              {patient.provider && (
                <>
                  <span>•</span>
                  <span>{patient.provider}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status indicator */}
          {hasIntakeIssue && (
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                borderColor: 'var(--status-warning)',
              }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-warning)' }} />
                <div className="flex-1">
                  <p className="font-medium mb-1" style={{ color: 'var(--status-warning)' }}>
                    {patient.status?.confirmed ? 'Missing Intake' : 'Unconfirmed'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {automationAttempts > 0 
                      ? `${automationAttempts} automation attempt${automationAttempts > 1 ? 's' : ''} sent`
                      : 'No automation attempts yet'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {patient.phone || '(555) 123-4567'}
              </span>
            </div>
            {patient.email && (
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {patient.email}
                </span>
              </div>
            )}
          </div>

          {/* Visit type */}
          {patient.visitType && (
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-canvas)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Visit Type
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {patient.visitType}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            {/* Primary action - Call */}
            <button
              onClick={() => onCall(patient)}
              className="w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
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
              <span>Call Patient</span>
            </button>

            {/* Secondary actions */}
            <div className="grid grid-cols-2 gap-2">
              {hasIntakeIssue && (
                <button
                  onClick={() => onSendIntake(patient)}
                  className="px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
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
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Intake</span>
                </button>
              )}

              {hasIntakeIssue && automationAttempts > 0 && (
                <button
                  onClick={() => onReEnroll(patient)}
                  className="px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
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
                  <RefreshCcw className="w-4 h-4" />
                  <span>Re-enroll</span>
                </button>
              )}

              {showFullActions && (
                <>
                  <button
                    onClick={() => onViewIntake(patient)}
                    className="px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
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
                    <FileText className="w-4 h-4" />
                    <span>View Intake</span>
                  </button>

                  <button
                    onClick={() => onJumpToCalendar(patient)}
                    className="px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all text-sm"
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
                    <Calendar className="w-4 h-4" />
                    <span>View on Calendar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}