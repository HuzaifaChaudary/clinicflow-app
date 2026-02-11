import { Appointment } from '../AppointmentRow';
import { ScheduleAppointmentCard } from './ScheduleAppointmentCard';

interface DoctorColumnProps {
  doctorName: string;
  appointments: Appointment[];
  onAppointmentClick?: (id: string) => void;
  startHour?: number;
  endHour?: number;
  conflicts?: Set<string>; // Appointment IDs with conflicts
}

export function DoctorColumn({
  doctorName,
  appointments,
  onAppointmentClick,
  startHour = 8,
  endHour = 18,
  conflicts = new Set(),
}: DoctorColumnProps) {
  const getDoctorInitials = (name: string): string => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0];
  };

  const initials = getDoctorInitials(doctorName);

  // Calculate total height based on time range
  const totalHours = endHour - startHour;
  const totalHeight = totalHours * 60 * 4; // 4px per minute

  // Default appointment duration (can be made dynamic later)
  const getAppointmentDuration = (appointment: Appointment): number => {
    // Could be extended to read from appointment data
    // For now, use 30 minutes default, 45 for some variety
    const hash = appointment.id.charCodeAt(0);
    if (hash % 3 === 0) return 45;
    if (hash % 3 === 1) return 30;
    return 15;
  };

  return (
    <div className="flex-shrink-0 border-r" style={{ borderColor: 'var(--border-default)' }}>
      {/* Doctor header */}
      <div
        className="sticky top-0 z-10 border-b px-4 py-4 flex flex-col items-center gap-2"
        style={{
          height: '64px',
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        {/* Doctor initials badge */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm"
          style={{
            backgroundColor: 'var(--accent-primary-bg)',
            color: 'var(--accent-primary)',
            border: '1.5px solid var(--accent-primary)',
          }}
        >
          {initials}
        </div>
        {/* Doctor name */}
        <div className="text-sm font-semibold truncate max-w-full" style={{ color: 'var(--text-primary)' }}>
          {doctorName}
        </div>
      </div>

      {/* Appointment grid area */}
      <div
        className="relative"
        style={{
          height: `${totalHeight}px`,
          width: '220px',
          backgroundColor: 'var(--surface-canvas)',
        }}
      >
        {/* Background grid lines (15-minute intervals) */}
        {Array.from({ length: totalHours * 4 }).map((_, index) => {
          const isFullHour = index % 4 === 0;
          return (
            <div
              key={index}
              className="absolute left-0 right-0 border-b"
              style={{
                top: `${index * 60}px`,
                borderColor: isFullHour ? 'var(--border-subtle)' : 'var(--border-subtle)',
                opacity: isFullHour ? 0.5 : 0.2,
              }}
            />
          );
        })}

        {/* Appointment cards */}
        {appointments.map((appointment) => (
          <ScheduleAppointmentCard
            key={appointment.id}
            appointment={appointment}
            startHour={startHour}
            duration={getAppointmentDuration(appointment)}
            onClick={onAppointmentClick}
            hasConflict={conflicts.has(appointment.id)}
          />
        ))}
      </div>
    </div>
  );
}
