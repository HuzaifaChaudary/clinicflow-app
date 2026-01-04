import { useState } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { PatientActionCard } from '../schedule/PatientActionCard';

interface TodaysScheduleSectionProps {
  appointments: Appointment[];
  filteredStatus?: 'all' | 'confirmed' | 'unconfirmed';
  onAppointmentClick?: (id: string) => void;
  onViewFullSchedule?: () => void;
  onCall?: (appointmentId: string) => void;
  onReEnrollAI?: (appointmentId: string) => void;
  onSendIntake?: (appointmentId: string) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
}

export function TodaysScheduleSection({
  appointments,
  filteredStatus = 'all',
  onAppointmentClick,
  onViewFullSchedule,
  onCall,
  onReEnrollAI,
  onSendIntake,
  onReschedule,
  onCancel,
}: TodaysScheduleSectionProps) {
  // Group appointments by time slot
  const groupedByTime = appointments.reduce((acc, apt) => {
    if (!acc[apt.time]) {
      acc[apt.time] = [];
    }
    acc[apt.time].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Sort time slots
  const sortedTimeSlots = Object.keys(groupedByTime).sort((a, b) => {
    const parseTime = (time: string) => {
      const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;
      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const period = match[3].toUpperCase();
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return hour * 60 + minute;
    };
    return parseTime(a) - parseTime(b);
  });

  // Filter appointments based on status
  const filteredAppointments = appointments.filter(apt => {
    if (filteredStatus === 'confirmed') return apt.status.confirmed;
    if (filteredStatus === 'unconfirmed') return !apt.status.confirmed;
    return true;
  });

  const filteredTimeSlots = sortedTimeSlots.filter(time => {
    const aptsInSlot = groupedByTime[time];
    return aptsInSlot.some(apt => filteredAppointments.includes(apt));
  });

  return (
    <div 
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div>
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Today's Schedule
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
            {filteredStatus !== 'all' && (
              <span style={{ color: 'var(--accent-primary)' }}>
                {' '}• {filteredStatus} only
              </span>
            )}
          </p>
        </div>

        <button
          onClick={onViewFullSchedule}
          className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 motion-hover"
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
          <span>Full schedule</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline */}
      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {filteredTimeSlots.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              No appointments found
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {filteredStatus !== 'all' 
                ? `No ${filteredStatus} appointments to show` 
                : 'Schedule is empty for today'}
            </p>
          </div>
        ) : (
          filteredTimeSlots.map(time => {
            const aptsInSlot = groupedByTime[time].filter(apt => filteredAppointments.includes(apt));

            return (
              <div key={time} className="px-6 py-4">
                {/* Time marker */}
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="text-sm font-semibold px-3 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--accent-primary-bg)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {time}
                  </div>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
                </div>

                {/* Appointments at this time */}
                <div className="grid gap-3">
                  {aptsInSlot.map(apt => (
                    <PatientActionCard
                      key={apt.id}
                      appointment={apt}
                      onCall={onCall}
                      onReEnrollAI={onReEnrollAI}
                      onSendIntake={onSendIntake}
                      onViewProfile={onAppointmentClick}
                      showActions={false}
                      onReschedule={onReschedule}
                      onCancel={onCancel}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}