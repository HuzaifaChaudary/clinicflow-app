// Time grid axis with 15-minute granularity
// Fixed left column that never shifts or resizes

interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
  isFullHour: boolean;
}

interface TimeGridAxisProps {
  startHour?: number;
  endHour?: number;
}

export function TimeGridAxis({ startHour = 8, endHour = 18 }: TimeGridAxisProps) {
  const timeSlots: TimeSlot[] = [];

  // Generate 15-minute slots
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      if (hour === endHour && minute > 0) break; // Don't exceed end hour

      const isFullHour = minute === 0;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const label = isFullHour 
        ? `${displayHour}:00 ${period}`
        : `${displayHour}:${minute.toString().padStart(2, '0')}`;

      timeSlots.push({
        hour,
        minute,
        label: isFullHour ? `${displayHour}:00 ${period}` : '',
        isFullHour,
      });
    }
  }

  return (
    <div 
      className="sticky left-0 z-20 flex-shrink-0 border-r"
      style={{
        width: '80px',
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Header spacer */}
      <div 
        className="border-b"
        style={{
          height: '64px',
          borderColor: 'var(--border-default)',
        }}
      />

      {/* Time slots */}
      <div className="relative">
        {timeSlots.map((slot, index) => (
          <div
            key={`${slot.hour}-${slot.minute}`}
            className="relative border-b"
            style={{
              height: '60px', // 15 minutes = 60px (4px per minute for precision)
              borderColor: slot.isFullHour ? 'var(--border-default)' : 'var(--border-subtle)',
            }}
          >
            {slot.isFullHour && (
              <div
                className="absolute -top-3 left-3 text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {slot.label}
              </div>
            )}
            {!slot.isFullHour && (
              <div
                className="absolute -top-2 right-2 text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                :{slot.minute}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to convert time to pixel position
// 15 minutes = 60px, so 1 minute = 4px
export function timeToPixels(hour: number, minute: number, startHour: number = 8): number {
  const totalMinutes = (hour - startHour) * 60 + minute;
  return totalMinutes * 4; // 4px per minute
}

// Helper function to convert duration in minutes to pixel height
export function durationToPixels(durationMinutes: number): number {
  return durationMinutes * 4; // 4px per minute
}
