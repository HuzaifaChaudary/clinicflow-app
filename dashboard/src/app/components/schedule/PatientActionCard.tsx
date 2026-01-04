import { useState } from 'react';
import { Phone, Repeat, FileText, User as UserIcon, Video, User, Clock } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { Button } from '../foundation/Button';

interface PatientActionCardProps {
  appointment: Appointment;
  onCall?: (appointmentId: string) => void;
  onReEnrollAI?: (appointmentId: string) => void;
  onSendIntake?: (appointmentId: string) => void;
  onViewProfile?: (appointmentId: string) => void;
  lastIntakeSentAt?: Date | null;
  showActions?: boolean;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
}

export function PatientActionCard({
  appointment,
  onCall,
  onReEnrollAI,
  onSendIntake,
  onViewProfile,
  lastIntakeSentAt,
  showActions = true,
  onReschedule,
  onCancel,
}: PatientActionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSendingIntake, setIsSendingIntake] = useState(false);
  const [isCallingAI, setIsCallingAI] = useState(false);

  const isUnconfirmed = !appointment.status.confirmed;
  const isMissingIntake = !appointment.status.intakeComplete;
  const visitType = appointment.visitType;
  const railColor = visitType === 'virtual' ? '#5B8DEF' : '#34C759';

  const handleSendIntake = async () => {
    setIsSendingIntake(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onSendIntake?.(appointment.id);
    setIsSendingIntake(false);
  };

  const handleReEnrollAI = async () => {
    setIsCallingAI(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onReEnrollAI?.(appointment.id);
    setIsCallingAI(false);
  };

  const formatLastSent = (date: Date | null | undefined) => {
    if (!date) return null;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewProfile?.(appointment.id)}
      className="rounded-lg border overflow-hidden transition-all cursor-pointer"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
        boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Left rail for visit type */}
      <div className="flex">
        <div
          className="w-1 flex-shrink-0"
          style={{
            backgroundColor: railColor,
            transition: 'box-shadow 0.2s ease',
            boxShadow: isHovered ? `0 0 8px ${railColor}` : 'none',
          }}
        />

        <div className="flex-1 p-4">
          {/* Header: Patient info */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
                {appointment.patientName}
              </h4>
              
              <div className="flex items-center gap-3 text-sm flex-wrap">
                {/* Time */}
                <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{appointment.time}</span>
                </div>

                <span style={{ color: 'var(--border-default)' }}>•</span>

                {/* Doctor */}
                <span style={{ color: 'var(--text-secondary)' }}>
                  {appointment.provider}
                </span>

                <span style={{ color: 'var(--border-default)' }}>•</span>

                {/* Visit type */}
                <div className="flex items-center gap-1.5">
                  {visitType === 'virtual' ? (
                    <Video className="w-3.5 h-3.5" style={{ color: railColor }} />
                  ) : (
                    <User className="w-3.5 h-3.5" style={{ color: railColor }} />
                  )}
                  <span className="text-xs font-medium" style={{ color: railColor }}>
                    {visitType === 'virtual' ? 'Video' : 'In-clinic'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status badges */}
          {(isUnconfirmed || isMissingIntake) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {isUnconfirmed && (
                <div
                  className="px-3 py-1.5 rounded-lg inline-flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--status-warning-bg)',
                    border: '1px solid rgba(242, 166, 90, 0.2)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--status-warning)' }}>
                    Unconfirmed
                  </span>
                </div>
              )}
              {isMissingIntake && (
                <div
                  className="px-3 py-1.5 rounded-lg inline-flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--status-error-bg)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--status-error)' }}>
                    Missing Intake
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Last intake sent timestamp */}
          {isMissingIntake && lastIntakeSentAt && (
            <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Last sent {formatLastSent(lastIntakeSentAt)}
            </div>
          )}

          {/* Action buttons */}
          {showActions && (
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
              {/* Manual call - Primary action */}
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCall?.(appointment.id);
                }}
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call patient</span>
              </Button>

              {/* Re-enroll AI sequence */}
              {isUnconfirmed && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReEnrollAI();
                  }}
                  disabled={isCallingAI}
                  className="flex items-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  <span>{isCallingAI ? 'Enrolling...' : 'Re-enroll AI sequence'}</span>
                </Button>
              )}

              {/* Send intake form */}
              {isMissingIntake && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendIntake();
                  }}
                  disabled={isSendingIntake}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isSendingIntake ? 'Sending...' : 'Send intake form'}</span>
                </Button>
              )}

              {/* View patient profile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile?.(appointment.id);
                }}
                className="flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>View profile</span>
              </Button>

              {/* Reschedule appointment */}
              {onReschedule && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReschedule(appointment);
                  }}
                  className="flex items-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Reschedule</span>
                </Button>
              )}

              {/* Cancel appointment */}
              {onCancel && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel(appointment);
                  }}
                  className="flex items-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Cancel</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}