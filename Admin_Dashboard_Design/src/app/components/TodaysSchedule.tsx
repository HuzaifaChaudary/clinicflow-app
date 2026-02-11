import { AppointmentRow, Appointment } from './AppointmentRow';

interface TodaysScheduleProps {
  appointments: Appointment[];
  onConfirm?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onMarkArrived?: (id: string) => void;
  onMarkNoShow?: (id: string) => void;
  onOpenPatient?: (id: string) => void;
  onOpenVoicePanel?: (id: string) => void;
  isDoctor?: boolean;
}

export function TodaysSchedule({
  appointments,
  onConfirm,
  onReschedule,
  onMarkArrived,
  onMarkNoShow,
  onOpenPatient,
  onOpenVoicePanel,
  isDoctor = false,
}: TodaysScheduleProps) {
  return (
    <section 
      className="rounded-xl shadow-sm border"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div 
        className="px-8 py-4 border-b"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <h2 style={{ color: 'var(--text-primary)' }}>Today's Schedule</h2>
      </div>
      
      <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
        {appointments.length === 0 ? (
          <div 
            className="px-8 py-12 text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            No appointments scheduled for today
          </div>
        ) : (
          appointments.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              onConfirm={onConfirm}
              onReschedule={onReschedule}
              onMarkArrived={onMarkArrived}
              onMarkNoShow={onMarkNoShow}
              onOpenPatient={onOpenPatient}
              onOpenVoicePanel={onOpenVoicePanel}
              isDoctor={isDoctor}
            />
          ))
        )}
      </div>
    </section>
  );
}