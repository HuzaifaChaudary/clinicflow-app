import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Appointment, CancellationReason } from '../types/appointment';
import { ScheduleDayGrid } from '../components/schedule/ScheduleDayGrid';
import { GlobalPatientProfile } from '../components/patient/GlobalPatientProfile';
import { mockDoctors } from '../data/enhancedMockData';
import { RescheduleModal } from '../components/modals/RescheduleModal';
import { CancelAppointmentModal } from '../components/modals/CancelAppointmentModal';
import { useRole } from '../context/RoleContext';

interface EnhancedSchedulePageProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
  onReschedule: (appointmentId: string, newTime: string, newProvider: string, newDate: string) => void;
  onCancel: (appointmentId: string, reason: CancellationReason) => void;
  onUpdateFollowUp?: (appointmentId: string, date: string, note: string) => void;
  onAddDoctorNote?: (appointmentId: string, doctorId: string, content: string) => void;
  onUpdateDoctorNote?: (appointmentId: string, noteId: string, content: string) => void;
}

export function EnhancedSchedulePage({
  appointments,
  onUpdateAppointment,
  onReschedule,
  onCancel,
  onUpdateFollowUp,
  onAddDoctorNote,
  onUpdateDoctorNote,
}: EnhancedSchedulePageProps) {
  const { role, activeDoctorId } = useRole();
  const [selectedDate, setSelectedDate] = useState('2026-01-01');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [cancelAppointment, setCancelAppointment] = useState<Appointment | null>(null);

  // Time slots - 15-minute intervals from 9 AM to 5 PM
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        if (hour === 16 && minute > 30) break; // Stop at 4:30 PM
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

  // Group appointments by doctor
  const appointmentsByDoctor = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    
    // Filter doctors based on role
    const visibleDoctors = role === 'doctor' 
      ? mockDoctors.filter(d => d.id === activeDoctorId)
      : mockDoctors;
    
    visibleDoctors.forEach(doctor => {
      // 🎯 For Doctor role: appointments are already filtered by date in App.tsx
      // For Admin/Owner roles: filter by selectedDate here
      if (role === 'doctor') {
        // Use appointments directly - already filtered by doctor AND date
        grouped[doctor.id] = appointments.filter(
          apt => apt.provider === doctor.name && !apt.cancelled
        );
      } else {
        // Admin/Owner: filter by date
        grouped[doctor.id] = appointments.filter(
          apt => apt.provider === doctor.name && apt.date === selectedDate && !apt.cancelled
        );
      }
    });
    
    return grouped;
  }, [appointments, selectedDate, role, activeDoctorId]);

  // Get visible doctors based on role
  const visibleDoctors = useMemo(() => {
    return role === 'doctor' 
      ? mockDoctors.filter(d => d.id === activeDoctorId)
      : mockDoctors;
  }, [role, activeDoctorId]);

  // Column width based on role
  const columnWidth = role === 'doctor' ? 'flex-1' : 'w-64';

  // Calculate appointment position and height
  const getAppointmentStyle = (appointment: Appointment) => {
    const timeIndex = timeSlots.indexOf(appointment.time);
    if (timeIndex === -1) return { top: 0, height: 0 };
    
    const slotHeight = 60; // Height per 15-minute slot
    const top = timeIndex * slotHeight;
    const duration = appointment.duration || 30;
    const slotsNeeded = Math.ceil(duration / 15);
    const height = slotsNeeded * slotHeight - 4; // -4 for gap
    
    return { top, height };
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div
        className="border-b px-6 py-4 flex-shrink-0"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {role === 'doctor' ? 'My Schedule' : 'Schedule'}
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Click any booking to open full patient details.
            </p>
          </div>
          {/* Date Navigation - Hidden for doctor role since date is managed in App.tsx */}
          {role !== 'doctor' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() - 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
                className="p-2 rounded-lg transition-all"
                style={{
                  backgroundColor: 'var(--surface-hover)',
                  color: 'var(--text-primary)',
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div
                className="px-4 py-2 rounded-lg border min-w-[200px] text-center"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={() => {
                  const date = new Date(selectedDate);
                  date.setDate(date.getDate() + 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
                className="p-2 rounded-lg transition-all"
                style={{
                  backgroundColor: 'var(--surface-hover)',
                  color: 'var(--text-primary)',
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          {/* For doctor role, show current date as read-only */}
          {role === 'doctor' && (
            <div
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--cf-blue-10)',
                borderColor: 'var(--cf-blue-30)',
              }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--cf-blue-70)' }}>
                📅 Today - {new Date('2026-01-01').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Doctor Headers */}
          <div
            className="sticky top-0 z-10 flex border-b"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            {/* Time column header */}
            <div
              className="w-20 px-4 py-4 border-r flex-shrink-0"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <Clock className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </div>
            
            {/* Doctor columns */}
            {visibleDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`${columnWidth} px-4 py-4 border-r flex items-center gap-3`}
                style={{ borderColor: 'var(--border-default)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: doctor.color || 'var(--accent-primary)',
                    color: 'white',
                  }}
                >
                  {doctor.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {doctor.name}
                  </p>
                  {doctor.specialty && (
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {doctor.specialty}
                    </p>
                  )}
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--cf-neutral-20)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {appointmentsByDoctor[doctor.id]?.length || 0}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots & Appointments */}
          <div className="flex">
            {/* Time labels */}
            <div
              className="w-20 border-r flex-shrink-0"
              style={{ borderColor: 'var(--border-default)' }}
            >
              {timeSlots.map((time, idx) => (
                <div
                  key={time}
                  className="h-[60px] px-2 py-1 border-b text-right"
                  style={{ borderColor: 'var(--border-default)' }}
                >
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {time}
                  </span>
                </div>
              ))}
            </div>

            {/* Doctor columns with appointments */}
            {visibleDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`${columnWidth} border-r relative`}
                style={{ borderColor: 'var(--border-default)' }}
              >
                {/* Time slot grid */}
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-[60px] border-b"
                    style={{ borderColor: 'var(--border-default)' }}
                  />
                ))}

                {/* Appointments overlay */}
                <div className="absolute inset-0 p-2">
                  {appointmentsByDoctor[doctor.id]?.map((appointment) => {
                    const style = getAppointmentStyle(appointment);
                    
                    // Strong color-coded slots for visit type
                    const isInClinic = appointment.visitType === 'in-clinic';
                    const cardBg = isInClinic ? 'rgba(91, 141, 239, 0.15)' : 'rgba(52, 199, 89, 0.15)';
                    const borderColor = isInClinic ? '#4A7ED8' : '#2BB058';
                    
                    // Determine arrival status
                    const getArrivalStatus = () => {
                      if (appointment.arrived) return { label: 'Here', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
                      // Mock logic: appointments before current time are "Late"
                      const appointmentTime = appointment.time;
                      const isLate = false; // Simplified for now
                      if (isLate) return { label: 'Late', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
                      return { label: 'Not arrived', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' };
                    };
                    
                    // Determine intake status
                    const getIntakeStatus = () => {
                      if (appointment.status.intakeComplete) {
                        return { label: 'Intake done', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
                      }
                      return { label: 'Intake pending', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
                    };
                    
                    const arrivalStatus = getArrivalStatus();
                    const intakeStatus = getIntakeStatus();
                    
                    return (
                      <button
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        className="absolute left-2 right-2 rounded-lg p-3 cursor-pointer transition-all"
                        style={{
                          top: `${style.top}px`,
                          height: `${style.height}px`,
                          backgroundColor: cardBg,
                          border: `2px solid ${borderColor}`,
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                          e.currentTarget.style.borderColor = isInClinic ? '#3968C7' : '#1F9D47';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
                          e.currentTarget.style.borderColor = borderColor;
                        }}
                      >
                        {/* Top row: Patient name + status dot */}
                        <div className="flex items-start justify-between">
                          <p
                            className="font-semibold line-clamp-1"
                            style={{
                              color: 'var(--text-primary)',
                              fontSize: '13px',
                            }}
                          >
                            {appointment.patientName}
                          </p>
                          {appointment.needsAttention && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0 ml-1 mt-1"
                              style={{ backgroundColor: '#F59E0B' }}
                            />
                          )}
                        </div>
                        
                        {/* Middle row: Time · Duration · Doctor */}
                        <p 
                          className="text-xs line-clamp-1" 
                          style={{ 
                            color: 'var(--text-secondary)',
                            fontWeight: 500,
                          }}
                        >
                          {appointment.time} · {appointment.duration || 30} min · {appointment.provider}
                        </p>
                        
                        {/* Bottom row: Status chips */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Arrival status chip */}
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: arrivalStatus.bg,
                              color: arrivalStatus.color,
                              border: `1px solid ${arrivalStatus.color}`,
                            }}
                          >
                            {arrivalStatus.label}
                          </span>
                          
                          {/* Intake status chip */}
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: intakeStatus.bg,
                              color: intakeStatus.color,
                              border: `1px solid ${intakeStatus.color}`,
                            }}
                          >
                            {intakeStatus.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Profile Modal */}
      {selectedAppointment && (
        <GlobalPatientProfile
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdateFollowUp={onUpdateFollowUp}
          onAddDoctorNote={onAddDoctorNote}
          onUpdateDoctorNote={onUpdateDoctorNote}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleAppointment && (
        <RescheduleModal
          appointment={rescheduleAppointment}
          doctors={mockDoctors}
          onClose={() => setRescheduleAppointment(null)}
          onConfirm={onReschedule}
        />
      )}

      {/* Cancel Modal */}
      {cancelAppointment && (
        <CancelAppointmentModal
          appointment={cancelAppointment}
          onClose={() => setCancelAppointment(null)}
          onConfirm={onCancel}
        />
      )}
    </div>
  );
}