import { useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { StatusToken } from './StatusToken';

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  provider: string;
  visitType: 'virtual' | 'in-clinic';
  status: {
    confirmed: boolean;
    intakeComplete: boolean;
    paid: boolean;
  };
  indicators: {
    voiceCallSent: boolean;
    rescheduled: boolean;
  };
  arrived?: boolean;
  noShow?: boolean;
  needsAttention?: boolean; // Auto-computed: true if unconfirmed or missing intake
}

interface AppointmentRowProps {
  appointment: Appointment;
  onConfirm?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onMarkArrived?: (id: string) => void;
  onMarkNoShow?: (id: string) => void;
  onOpenPatient?: (id: string) => void;
  onOpenVoicePanel?: (id: string) => void;
  isDoctor?: boolean;
}

export function AppointmentRow({
  appointment,
  onConfirm,
  onReschedule,
  onMarkArrived,
  onMarkNoShow,
  onOpenPatient,
  onOpenVoicePanel,
  isDoctor = false,
}: AppointmentRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConfirm = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    onConfirm?.(appointment.id);
    setIsUpdating(false);
  };

  const handleMarkArrived = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    onMarkArrived?.(appointment.id);
    setIsUpdating(false);
  };

  return (
    <button
      onClick={() => onOpenPatient?.(appointment.id)}
      className={`
        w-full flex items-center gap-4 px-6 py-4 border-b transition-all duration-150 text-left
        ${isUpdating ? 'opacity-50' : ''}
      `}
      style={{
        backgroundColor: isHovered ? 'var(--surface-hover)' : 'var(--surface-card)',
        borderColor: 'var(--border-light)',
        boxShadow: isHovered ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Time */}
      <div className="w-20 shrink-0">
        <div className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <span className="font-medium">{appointment.time}</span>
        </div>
      </div>

      {/* Patient Name */}
      <div className="w-48 shrink-0">
        <div style={{ color: 'var(--text-primary)' }} className="font-medium">
          {appointment.patientName}
        </div>
        <div style={{ color: 'var(--text-secondary)' }} className="text-sm mt-0.5">
          Follow-up
        </div>
      </div>

      {/* Provider */}
      <div className="w-32 shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {appointment.provider}
      </div>

      {/* Status Tokens */}
      <div className="flex items-center gap-2 flex-1">
        {/* Confirmation Status */}
        <StatusToken 
          type={appointment.status.confirmed ? 'confirmed' : 'unconfirmed'}
          readOnly={isDoctor}
          interactive={!isDoctor && !appointment.status.confirmed}
          onClick={!appointment.status.confirmed ? handleConfirm : undefined}
        />

        {/* Intake Status */}
        <StatusToken 
          type={appointment.status.intakeComplete ? 'intake-complete' : 'intake-missing'}
          readOnly
        />

        {/* Arrived Status */}
        {appointment.arrived && (
          <StatusToken type="arrived" readOnly />
        )}

        {/* No-show Status */}
        {appointment.noShow && (
          <StatusToken type="no-show" readOnly />
        )}

        {/* Voice Indicator */}
        {appointment.indicators.voiceCallSent && (
          <StatusToken 
            type="voice" 
            pulse 
            readOnly={isDoctor}
            interactive={!isDoctor}
            onClick={!isDoctor ? () => onOpenVoicePanel?.(appointment.id) : undefined}
          />
        )}

        {/* Rescheduled */}
        {appointment.indicators.rescheduled && (
          <StatusToken type="rescheduled" readOnly />
        )}
      </div>

      {/* Admin Actions (hover-revealed) */}
      {!isDoctor && (
        <div className={`flex items-center gap-2 transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {!appointment.arrived && !appointment.noShow && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkArrived();
              }}
              className="px-3 py-1.5 rounded-md transition-all duration-150 text-sm font-medium"
              style={{ 
                color: 'var(--status-success-text)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--status-success-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              disabled={isUpdating}
            >
              Mark Arrived
            </button>
          )}

          {!appointment.noShow && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkNoShow?.(appointment.id);
              }}
              className="px-3 py-1.5 rounded-md transition-all duration-150 text-sm font-medium"
              style={{ 
                color: 'var(--status-error-text)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--status-error-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              No-show
            </button>
          )}
        </div>
      )}

      {/* Chevron */}
      <ChevronRight 
        className={`w-5 h-5 shrink-0 transition-transform duration-150 ${isHovered ? 'translate-x-1' : ''}`}
        style={{ color: 'var(--text-muted)' }} 
      />
    </button>
  );
}