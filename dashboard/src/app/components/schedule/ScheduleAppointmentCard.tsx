import { useState } from 'react';
import { Video, User, AlertTriangle, Clock } from 'lucide-react';
import { Appointment } from '../AppointmentRow';
import { timeToPixels, durationToPixels } from './TimeGridAxis';

interface ScheduleAppointmentCardProps {
  appointment: Appointment;
  startHour?: number;
  duration?: number; // Duration in minutes
  onClick?: (id: string) => void;
  hasConflict?: boolean;
}

export function ScheduleAppointmentCard({
  appointment,
  startHour = 8,
  duration = 30, // Default 30 minutes
  onClick,
  hasConflict = false,
}: ScheduleAppointmentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Parse time to get hour and minute
  const parseTime = (time: string): { hour: number; minute: number } => {
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return { hour: 9, minute: 0 };

    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    return { hour, minute };
  };

  const { hour, minute } = parseTime(appointment.time);
  const topPosition = timeToPixels(hour, minute, startHour);
  const cardHeight = durationToPixels(duration);

  const visitType = appointment.visitType;
  const railColor = visitType === 'virtual' ? '#5B8DEF' : '#34C759';
  const isUnconfirmed = !appointment.status.confirmed;
  const isMissingIntake = !appointment.status.intakeComplete;

  return (
    <div
      className="absolute left-0 right-0 px-2 animate-fade-in"
      style={{
        top: `${topPosition}px`,
        height: `${cardHeight}px`,
        transition: 'all 0.3s ease',
      }}
    >
      <button
        onClick={() => onClick?.(appointment.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full h-full rounded-lg relative overflow-hidden group"
        style={{
          backgroundColor: 'var(--surface-card)',
          border: hasConflict ? '2px solid var(--status-error)' : '1.5px solid var(--border-default)',
          boxShadow: isHovered 
            ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
          transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Left vertical rail for visit type */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            backgroundColor: railColor,
            boxShadow: isHovered ? `0 0 8px ${railColor}` : 'none',
            transition: 'box-shadow 0.2s ease',
          }}
        />

        {/* Conflict indicator */}
        {hasConflict && (
          <div
            className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--status-error)' }}
          >
            <AlertTriangle className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Card content */}
        <div className="pl-3 pr-2 py-2 h-full flex flex-col justify-between">
          {/* Top section */}
          <div className="min-w-0">
            {/* Patient name */}
            <div 
              className="font-semibold text-sm truncate mb-0.5"
              style={{ color: 'var(--text-primary)' }}
            >
              {appointment.patientName}
            </div>

            {/* Time and duration */}
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <Clock className="w-3 h-3" />
              <span>{appointment.time}</span>
              <span>•</span>
              <span>{duration}m</span>
            </div>

            {/* Visit type */}
            <div className="flex items-center gap-1.5 text-xs">
              {visitType === 'virtual' ? (
                <>
                  <Video className="w-3 h-3" style={{ color: railColor }} />
                  <span style={{ color: railColor }}>Video</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3" style={{ color: railColor }} />
                  <span style={{ color: railColor }}>In-clinic</span>
                </>
              )}
            </div>
          </div>

          {/* Bottom section - Status badges */}
          {(isUnconfirmed || isMissingIntake) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {isUnconfirmed && (
                <div
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--status-warning-bg)',
                    color: 'var(--status-warning)',
                  }}
                >
                  Unconfirmed
                </div>
              )}
              {isMissingIntake && (
                <div
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--status-error-bg)',
                    color: 'var(--status-error)',
                  }}
                >
                  No Intake
                </div>
              )}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
