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
  compact?: boolean;
  selectedPatientId?: string | null;
  isSelected?: boolean;
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
  compact = false,
  selectedPatientId,
  isSelected = false,
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

  // Compact mode: no card border, slim layout, dividers separate items
  if (compact) {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewProfile?.(appointment.id)}
        className="cursor-pointer rounded-lg transition-all"
        style={{
          backgroundColor: isSelected ? 'rgba(91, 141, 239, 0.04)' : 'transparent',
          border: isSelected ? '2px solid var(--accent-primary)' : '2px solid transparent',
          borderLeft: isSelected ? '4px solid var(--accent-primary)' : '4px solid transparent',
          padding: '8px',
          marginLeft: '-8px',
          marginRight: '-8px',
          boxShadow: isSelected ? '0 0 0 2px rgba(91, 141, 239, 0.08)' : 'none',
        }}
      >
        {/* Line 1: Patient name, time, provider */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 style={{ 
              color: 'var(--text-primary)',
              fontSize: '15px',
              fontWeight: 600,
              margin: 0,
              marginBottom: '4px',
            }}>
              {appointment.patientName}
            </h4>
            <div style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '13px',
            }}>
              {appointment.time} · {appointment.provider} · {visitType === 'virtual' ? 'Video visit' : 'In-clinic'}
            </div>
          </div>
        </div>

        {/* Line 2: Status pills */}
        {(isUnconfirmed || isMissingIntake) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {isUnconfirmed && (
              <div
                className="px-2 py-1 rounded inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: 'var(--status-warning-bg)',
                  border: '1px solid rgba(242, 166, 90, 0.2)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }} />
                <span style={{ 
                  color: 'var(--status-warning)', 
                  fontSize: '11px', 
                  fontWeight: 600,
                }}>
                  Unconfirmed
                </span>
              </div>
            )}
            {isMissingIntake && (
              <div
                className="px-2 py-1 rounded inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: 'var(--status-error-bg)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
                <span style={{ 
                  color: 'var(--status-error)', 
                  fontSize: '11px', 
                  fontWeight: 600,
                }}>
                  Missing Intake
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions section with label */}
        {showActions && (
          <>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '0 0 6px 0',
            }}>
              Actions
            </p>
            <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCall?.(appointment.id);
                }}
                className="flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span style={{ fontSize: '13px' }}>Call patient</span>
              </Button>

              {isMissingIntake && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendIntake();
                  }}
                  disabled={isSendingIntake}
                  className="flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span style={{ fontSize: '13px' }}>{isSendingIntake ? 'Sending...' : 'Send intake form'}</span>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Regular card mode for Today's Schedule - more compact with slim left rail
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewProfile?.(appointment.id)}
      className="rounded-lg border overflow-hidden transition-all cursor-pointer"
      style={{
        backgroundColor: isSelected ? 'rgba(91, 141, 239, 0.04)' : 'var(--surface-card)',
        borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-default)',
        borderWidth: isSelected ? '2px' : '1px',
        boxShadow: isSelected 
          ? '0 0 0 3px rgba(91, 141, 239, 0.1)' 
          : isHovered 
            ? '0 2px 8px rgba(0, 0, 0, 0.06)' 
            : 'none',
      }}
    >
      {/* Left rail - slim color stripe */}
      <div className="flex">
        <div
          className="w-1 flex-shrink-0"
          style={{
            backgroundColor: railColor,
          }}
        />

        <div className="flex-1 px-4 py-3">
          {/* Header row: Patient info + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Patient name - prominent */}
              <h4 style={{ 
                color: 'var(--text-primary)',
                fontSize: '15px',
                fontWeight: 600,
                margin: 0,
                marginBottom: '4px',
              }}>
                {appointment.patientName}
              </h4>
              
              {/* Single line: Time · Provider · Visit type */}
              <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '13px',
              }}>
                {appointment.time} · {appointment.provider} · {visitType === 'virtual' ? 'Video visit' : 'In-clinic'}
              </div>
            </div>

            {/* Status pill on the right */}
            {(isUnconfirmed || isMissingIntake) && (
              <div className="flex-shrink-0">
                {isMissingIntake ? (
                  <div
                    className="px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--status-error-bg)',
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
                    <span style={{ 
                      color: 'var(--status-error)', 
                      fontSize: '11px', 
                      fontWeight: 600,
                    }}>
                      Missing Intake
                    </span>
                  </div>
                ) : isUnconfirmed ? (
                  <div
                    className="px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--status-warning-bg)',
                      border: '1px solid rgba(242, 166, 90, 0.15)',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }} />
                    <span style={{ 
                      color: 'var(--status-warning)', 
                      fontSize: '11px', 
                      fontWeight: 600,
                    }}>
                      Unconfirmed
                    </span>
                  </div>
                ) : (
                  <div
                    className="px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--status-success-bg)',
                      border: '1px solid rgba(77, 163, 161, 0.15)',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-success)' }} />
                    <span style={{ 
                      color: 'var(--status-success)', 
                      fontSize: '11px', 
                      fontWeight: 600,
                    }}>
                      Ready
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

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