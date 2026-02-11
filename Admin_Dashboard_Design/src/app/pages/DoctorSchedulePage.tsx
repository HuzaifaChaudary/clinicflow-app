import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar,
  Filter,
  Video,
  MapPin,
  Sparkles,
  AlertCircle,
  X,
  Phone,
  Edit,
  Trash2,
  FileText,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Appointment, CancellationReason } from '../types/appointment';
import { GlobalPatientProfile } from '../components/patient/GlobalPatientProfile';
import { mockDoctors } from '../data/enhancedMockData';
import { RescheduleModal } from '../components/modals/RescheduleModal';
import { CancelAppointmentModal } from '../components/modals/CancelAppointmentModal';
import { useRole } from '../context/RoleContext';

interface DoctorSchedulePageProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
  onReschedule: (appointmentId: string, newTime: string, newProvider: string, newDate: string) => void;
  onCancel: (appointmentId: string, reason: CancellationReason) => void;
  onUpdateFollowUp?: (appointmentId: string, date: string, note: string) => void;
  onAddDoctorNote?: (appointmentId: string, doctorId: string, content: string) => void;
  onUpdateDoctorNote?: (appointmentId: string, noteId: string, content: string) => void;
  onAddPatient?: (patientData: any) => void;
}

type ViewMode = 'day' | 'week' | 'month';
type VisitTypeFilter = 'all' | 'in-clinic' | 'video';
type StatusFilter = 'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled';

export function DoctorSchedulePage({
  appointments,
  onUpdateAppointment,
  onReschedule,
  onCancel,
}: DoctorSchedulePageProps) {
  const { activeDoctorId } = useRole();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState('2026-01-01');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [cancelAppointment, setCancelAppointment] = useState<Appointment | null>(null);
  const [visitTypeFilter, setVisitTypeFilter] = useState<VisitTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Get current doctor info
  const currentDoctor = activeDoctorId 
    ? mockDoctors.find(d => d.id === activeDoctorId)
    : null;

  // Time slots - 15-minute intervals from 8 AM to 6 PM
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        if (hour === 17 && minute > 30) break;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        slots.push(timeString);
      }
    }
    return slots;
  }, []);

  // Week view dates
  const weekDates = useMemo(() => {
    const dates = [];
    const startDate = new Date(selectedDate);
    // Get Monday of the week
    const dayOfWeek = startDate.getDay();
    const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startDate.setDate(diff);
    
    for (let i = 0; i < 5; i++) { // Mon-Fri
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }, [selectedDate]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Visit type filter
      if (visitTypeFilter === 'in-clinic' && apt.visitType === 'virtual') return false;
      if (visitTypeFilter === 'video' && apt.visitType !== 'virtual') return false;
      
      // Status filter
      if (statusFilter === 'confirmed' && !apt.status.confirmed) return false;
      if (statusFilter === 'pending' && apt.status.confirmed) return false;
      if (statusFilter === 'cancelled' && !apt.cancelled) return false;
      if (statusFilter === 'completed' && !apt.status.completed) return false;
      
      return true;
    });
  }, [appointments, visitTypeFilter, statusFilter]);

  // Group appointments by date for week view
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    weekDates.forEach(date => {
      grouped[date] = filteredAppointments.filter(apt => apt.date === date);
    });
    return grouped;
  }, [filteredAppointments, weekDates]);

  // AI insights
  const highPriorityCount = appointments.filter(apt => apt.urgency === 'high').length;
  const noShowRiskCount = appointments.filter(apt => !apt.status.confirmed && apt.urgency === 'high').length;

  // Calculate appointment position and height
  const getAppointmentStyle = (appointment: Appointment) => {
    const timeIndex = timeSlots.indexOf(appointment.time);
    if (timeIndex === -1) return { top: 0, height: 0 };
    
    const slotHeight = 60;
    const top = timeIndex * slotHeight;
    const duration = appointment.duration || 30;
    const slotsNeeded = Math.ceil(duration / 15);
    const height = slotsNeeded * slotHeight - 4;
    
    return { top, height };
  };

  // Get appointment color based on type
  const getAppointmentColor = (appointment: Appointment) => {
    if (appointment.visitType === 'virtual') {
      return {
        bg: '#10B981',
        border: '#059669',
        text: 'white',
      };
    }
    return {
      bg: 'var(--accent-primary)',
      border: 'var(--cf-blue-60)',
      text: 'white',
    };
  };

  const goToToday = () => {
    setSelectedDate('2026-01-01');
  };

  const handlePrevious = () => {
    const date = new Date(selectedDate);
    if (viewMode === 'day') {
      date.setDate(date.getDate() - 1);
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() - 7);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    const date = new Date(selectedDate);
    if (viewMode === 'day') {
      date.setDate(date.getDate() + 1);
    } else if (viewMode === 'week') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  if (!currentDoctor) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            No doctor profile selected
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* HEADER */}
      <div
        className="border-b px-6 py-4 flex-shrink-0"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                My Schedule
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Your appointments and availability
              </p>
            </div>
          </div>

          {/* Doctor info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {currentDoctor.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {currentDoctor.specialty}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
              style={{
                backgroundColor: currentDoctor.color || 'var(--accent-primary)',
                color: 'white',
              }}
            >
              {currentDoctor.initials}
            </div>
          </div>
        </div>

        {/* AI Insights Banner */}
        {(highPriorityCount > 0 || noShowRiskCount > 0) && (
          <div
            className="mb-4 p-4 rounded-lg border"
            style={{
              backgroundColor: '#F59E0B10',
              borderColor: '#F59E0B40',
            }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: '#F59E0B' }} />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  AI Insights
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {highPriorityCount > 0 && (
                    <span>{highPriorityCount} patients flagged as high priority today</span>
                  )}
                  {noShowRiskCount > 0 && (
                    <span>· {noShowRiskCount} likely no-shows</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls row */}
        <div className="flex items-center justify-between gap-4">
          {/* View mode toggle */}
          <div
            className="flex rounded-lg border p-1"
            style={{
              backgroundColor: 'var(--surface-canvas)',
              borderColor: 'var(--border-default)',
            }}
          >
            {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-3 py-1.5 rounded text-sm font-medium transition-all capitalize"
                style={{
                  backgroundColor: viewMode === mode ? 'var(--surface-card)' : 'transparent',
                  color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Date navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div
              className="px-4 py-2 rounded-lg border min-w-[240px] text-center"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {viewMode === 'week' 
                  ? `Week of ${new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(weekDates[4]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: viewMode === 'day' ? 'long' : undefined,
                      month: 'long',
                      day: viewMode !== 'month' ? 'numeric' : undefined,
                      year: 'numeric',
                    })
                }
              </p>
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-primary)',
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-lg border font-medium text-sm transition-all"
              style={{
                backgroundColor: 'var(--accent-primary)',
                borderColor: 'var(--accent-primary)',
                color: 'white',
              }}
            >
              Today
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {/* Visit type filter */}
            <select
              value={visitTypeFilter}
              onChange={(e) => setVisitTypeFilter(e.target.value as VisitTypeFilter)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="all">All Types</option>
              <option value="in-clinic">In-clinic</option>
              <option value="video">Video</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* SCHEDULE GRID - Week View */}
      {viewMode === 'week' && (
        <div className="flex-1 overflow-auto">
          <div className="min-w-max h-full">
            {/* Day headers */}
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
              
              {/* Day columns */}
              {weekDates.map((date, idx) => {
                const dateObj = new Date(date);
                const isToday = date === '2026-01-01';
                const dayAppointments = appointmentsByDate[date] || [];
                
                return (
                  <div
                    key={date}
                    className="flex-1 px-4 py-4 border-r"
                    style={{ 
                      borderColor: 'var(--border-default)',
                      backgroundColor: isToday ? 'var(--accent-primary-bg)' : 'transparent',
                    }}
                  >
                    <div className="text-center">
                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                        {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p 
                        className="text-lg font-bold"
                        style={{ 
                          color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)',
                        }}
                      >
                        {dateObj.getDate()}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {dayAppointments.length} appointments
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time grid */}
            <div className="flex">
              {/* Time labels */}
              <div className="w-20 flex-shrink-0 border-r" style={{ borderColor: 'var(--border-default)' }}>
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-[60px] px-2 py-1 border-b text-right"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns with appointments */}
              {weekDates.map((date) => {
                const isToday = date === '2026-01-01';
                const dayAppointments = appointmentsByDate[date] || [];
                
                return (
                  <div
                    key={date}
                    className="flex-1 border-r relative"
                    style={{ 
                      borderColor: 'var(--border-default)',
                      backgroundColor: isToday ? 'var(--accent-primary-bg)' : 'var(--surface-card)',
                    }}
                  >
                    {/* Time slot backgrounds */}
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="h-[60px] border-b"
                        style={{ borderColor: 'var(--border-default)' }}
                      />
                    ))}

                    {/* Appointments */}
                    <div className="absolute inset-0 px-2">
                      {dayAppointments.map((appointment) => {
                        const style = getAppointmentStyle(appointment);
                        const colors = getAppointmentColor(appointment);
                        const hasAIInsight = appointment.needsAttention || appointment.urgency === 'high';
                        
                        // Determine intake status
                        const hasIntake = appointment.status.intakeComplete;
                        const hasArrived = appointment.status.arrived;
                        
                        return (
                          <button
                            key={appointment.id}
                            onClick={() => setSelectedAppointment(appointment)}
                            className="absolute left-2 right-2 rounded-lg p-2 text-left transition-all cursor-pointer overflow-hidden"
                            style={{
                              top: `${style.top}px`,
                              height: `${style.height}px`,
                              backgroundColor: colors.bg,
                              borderLeft: `4px solid ${colors.border}`,
                              color: colors.text,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateX(2px)';
                              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateX(0)';
                              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                            }}
                          >
                            {/* Time and AI insight */}
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-1">
                                {appointment.visitType === 'virtual' ? (
                                  <Video className="w-3 h-3" />
                                ) : (
                                  <MapPin className="w-3 h-3" />
                                )}
                                <span className="text-xs font-semibold">
                                  {appointment.time}
                                </span>
                              </div>
                              {hasAIInsight && (
                                <Sparkles className="w-3.5 h-3.5" style={{ color: '#FCD34D' }} />
                              )}
                            </div>

                            {/* Patient name */}
                            <p className="text-sm font-semibold mb-1 truncate">
                              {appointment.patientName}
                            </p>

                            {/* Visit type */}
                            <p className="text-xs opacity-90 mb-2 truncate">
                              {appointment.visitType === 'virtual' ? 'Video' : 'In Clinic'}
                            </p>

                            {/* Status chips row */}
                            <div className="flex items-center gap-1 flex-wrap">
                              {/* Intake status */}
                              {!hasIntake && (
                                <span 
                                  className="text-[10px] px-1 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap max-w-full" 
                                  style={{
                                    backgroundColor: 'rgba(245, 158, 11, 0.25)',
                                    color: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid rgba(245, 158, 11, 0.4)',
                                  }}
                                  title="Missing intake"
                                >
                                  <FileText className="w-2.5 h-2.5 flex-shrink-0" />
                                  <span className="truncate">Missing intake</span>
                                </span>
                              )}

                              {/* Arrival status */}
                              {hasArrived ? (
                                <span 
                                  className="text-[10px] px-1 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap max-w-full" 
                                  style={{
                                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                                    color: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid rgba(16, 185, 129, 0.4)',
                                  }}
                                  title="Arrived"
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0" />
                                  <span className="truncate">Arrived</span>
                                </span>
                              ) : (
                                <span 
                                  className="text-[10px] px-1 py-0.5 rounded flex items-center gap-0.5 whitespace-nowrap max-w-full" 
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    color: 'rgba(255, 255, 255, 0.75)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                  }}
                                  title="Not arrived"
                                >
                                  <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                                  <span className="truncate">Not arrived</span>
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            {filteredAppointments.filter(apt => apt.date === selectedDate).length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No appointments scheduled today
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Your schedule is clear for this day
                </p>
                <button
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                  }}
                >
                  View availability
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments
                  .filter(apt => apt.date === selectedDate)
                  .sort((a, b) => timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time))
                  .map(appointment => {
                    const colors = getAppointmentColor(appointment);
                    const hasAIInsight = appointment.needsAttention || appointment.urgency === 'high';
                    const hasIntake = appointment.status.intakeComplete;
                    const hasArrived = appointment.status.arrived;
                    
                    return (
                      <button
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                        className="w-full p-4 rounded-lg border text-left transition-all"
                        style={{
                          backgroundColor: 'var(--surface-card)',
                          borderColor: 'var(--border-default)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = colors.bg;
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-default)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-1 h-16 rounded-full flex-shrink-0"
                            style={{ backgroundColor: colors.bg }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {appointment.time}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{
                                backgroundColor: `${colors.bg}20`,
                                color: colors.bg,
                              }}>
                                {appointment.visitType === 'virtual' ? (
                                  <>
                                    <Video className="w-3 h-3" />
                                    Video
                                  </>
                                ) : (
                                  <>
                                    <MapPin className="w-3 h-3" />
                                    In-clinic
                                  </>
                                )}
                              </span>
                              
                              {/* Intake status */}
                              {!hasIntake && (
                                <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{
                                  backgroundColor: '#F59E0B20',
                                  color: '#F59E0B',
                                  border: '1px solid #F59E0B40',
                                }}>
                                  <FileText className="w-3 h-3" />
                                  Missing intake
                                </span>
                              )}
                              
                              {/* Arrival status */}
                              {hasArrived ? (
                                <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{
                                  backgroundColor: '#10B98120',
                                  color: '#10B981',
                                  border: '1px solid #10B98140',
                                }}>
                                  <CheckCircle2 className="w-3 h-3" />
                                  Arrived
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{
                                  backgroundColor: 'var(--surface-canvas)',
                                  color: 'var(--text-secondary)',
                                  border: '1px solid var(--border-default)',
                                }}>
                                  <Clock className="w-3 h-3" />
                                  Not arrived
                                </span>
                              )}

                              {hasAIInsight && (
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                                  <span className="text-xs" style={{ color: '#F59E0B' }}>
                                    AI Alert
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                              {appointment.patientName}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {appointment.visitType || 'Consultation'} · {appointment.duration} minutes
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Month view placeholder */}
      {viewMode === 'month' && (
        <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
            <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Month view coming soon
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Switch to Day or Week view to see your appointments
            </p>
          </div>
        </div>
      )}

      {/* Appointment details drawer */}
      {selectedAppointment && (
        <GlobalPatientProfile
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* Modals */}
      {rescheduleAppointment && (
        <RescheduleModal
          appointment={rescheduleAppointment}
          onClose={() => setRescheduleAppointment(null)}
          onConfirm={(newTime, newProvider, newDate) => {
            onReschedule(rescheduleAppointment.id, newTime, newProvider, newDate);
            setRescheduleAppointment(null);
          }}
        />
      )}

      {cancelAppointment && (
        <CancelAppointmentModal
          appointment={cancelAppointment}
          onClose={() => setCancelAppointment(null)}
          onConfirm={(reason) => {
            onCancel(cancelAppointment.id, reason);
            setCancelAppointment(null);
          }}
        />
      )}
    </div>
  );
}