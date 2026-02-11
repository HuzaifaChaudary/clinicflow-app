import { useState } from 'react';
import { ChevronLeft, ChevronRight, Phone, MessageSquare, User, Video, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { Appointment } from '../components/AppointmentRow';
import { AppointmentCard } from '../components/AppointmentCard';
import { useRole } from '../context/RoleContext';
import { useSettings } from '../context/SettingsContext';
import { GlobalPatientProfile } from '../components/patient/GlobalPatientProfile';

interface SchedulePageProps {
  appointments: Appointment[];
  onNavigateToUnconfirmed?: () => void;
  onUpdateFollowUp: (appointmentId: string, date: string, note: string) => void;
  onAddDoctorNote: (appointmentId: string, doctorId: string, content: string) => void;
  onUpdateDoctorNote: (appointmentId: string, noteId: string, content: string) => void;
}

type StatusType = 'confirmed' | 'pending' | 'cancelled' | 'rescheduled';

interface ScheduleAppointment extends Appointment {
  visitType: 'in-clinic' | 'virtual';
  duration: number; // in minutes
  notes?: string;
  meetingLink?: string;
}

export function SchedulePage({ 
  appointments, 
  onNavigateToUnconfirmed,
  onUpdateFollowUp,
  onAddDoctorNote,
  onUpdateDoctorNote,
}: SchedulePageProps) {
  const { role, activeDoctorId } = useRole();
  const { users } = useSettings();
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [visitTypeFilter, setVisitTypeFilter] = useState<'all' | 'in-clinic' | 'virtual'>('all');
  const [hoveredAppointment, setHoveredAppointment] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<ScheduleAppointment | null>(null);
  const [recentlyUpdated, setRecentlyUpdated] = useState<string[]>([]);

  // Mock schedule appointments with realistic overlapping scenarios
  const scheduleAppointments: ScheduleAppointment[] = [
    // 9:00 AM - Two overlapping appointments (different doctors)
    {
      ...appointments[0],
      id: 'apt-1',
      patientName: 'Sarah Martinez',
      provider: 'Dr. Sarah Chen',
      time: '9:00',
      visitType: 'virtual',
      duration: 30,
      notes: 'Follow-up consultation',
      meetingLink: 'https://meet.clinicflow.com/abc123',
    },
    {
      ...appointments[0],
      id: 'apt-2',
      patientName: 'James Wilson',
      provider: 'Dr. Michael Ross',
      time: '9:00',
      visitType: 'in-clinic',
      duration: 30,
      notes: 'Annual checkup',
    },
    // 9:30 AM - Three overlapping appointments (max density example)
    {
      ...appointments[0],
      id: 'apt-3',
      patientName: 'Emily Chen',
      provider: 'Dr. Sarah Chen',
      time: '9:30',
      visitType: 'in-clinic',
      duration: 30,
      notes: 'Initial consultation',
    },
    {
      ...appointments[0],
      id: 'apt-4',
      patientName: 'Michael Brown',
      provider: 'Dr. Michael Ross',
      time: '9:30',
      visitType: 'virtual',
      duration: 30,
      notes: 'Treatment follow-up',
      meetingLink: 'https://meet.clinicflow.com/def456',
    },
    {
      ...appointments[0],
      id: 'apt-5',
      patientName: 'Lisa Anderson',
      provider: 'Dr. Emily Parker',
      time: '9:30',
      visitType: 'in-clinic',
      duration: 30,
      notes: 'Prescription review',
    },
    // 10:00 AM - Single appointment
    {
      ...appointments[0],
      id: 'apt-6',
      patientName: 'David Kim',
      provider: 'Dr. Sarah Chen',
      time: '10:00',
      visitType: 'virtual',
      duration: 30,
      notes: 'Lab results discussion',
      meetingLink: 'https://meet.clinicflow.com/ghi789',
      status: { ...appointments[0].status, confirmed: false },
    },
    // 10:30 AM - Two overlapping
    {
      ...appointments[0],
      id: 'apt-7',
      patientName: 'Jennifer Taylor',
      provider: 'Dr. Michael Ross',
      time: '10:30',
      visitType: 'in-clinic',
      duration: 30,
      notes: 'Post-surgery checkup',
    },
    {
      ...appointments[0],
      id: 'apt-8',
      patientName: 'Robert Garcia',
      provider: 'Dr. Emily Parker',
      time: '10:30',
      visitType: 'virtual',
      duration: 30,
      notes: 'Consultation',
      meetingLink: 'https://meet.clinicflow.com/jkl012',
    },
    // 11:00 AM - Single appointment
    {
      ...appointments[0],
      id: 'apt-9',
      patientName: 'Amanda White',
      provider: 'Dr. Sarah Chen',
      time: '11:00',
      visitType: 'in-clinic',
      duration: 30,
      notes: 'Regular checkup',
    },
    // 14:00 PM - Four overlapping (will show +1 more)
    {
      ...appointments[0],
      id: 'apt-10',
      patientName: 'Thomas Lee',
      provider: 'Dr. Sarah Chen',
      time: '14:00',
      visitType: 'virtual',
      duration: 30,
      notes: 'Follow-up',
      meetingLink: 'https://meet.clinicflow.com/mno345',
    },
    {
      ...appointments[0],
      id: 'apt-11',
      patientName: 'Patricia Moore',
      provider: 'Dr. Michael Ross',
      time: '14:00',
      visitType: 'in-clinic',
      duration: 30,
      notes: 'Consultation',
    },
    {
      ...appointments[0],
      id: 'apt-12',
      patientName: 'Christopher Davis',
      provider: 'Dr. Emily Parker',
      time: '14:00',
      visitType: 'virtual',
      duration: 30,
      notes: 'Treatment plan',
      meetingLink: 'https://meet.clinicflow.com/pqr678',
    },
    {
      ...appointments[0],
      id: 'apt-13',
      patientName: 'Michelle Johnson',
      provider: 'Dr. Sarah Chen',
      time: '14:00',
      visitType: 'in-clinic',
      duration: 30,
      notes: 'Annual physical',
    },
  ];

  const providers = ['Dr. Sarah Chen', 'Dr. Michael Ross', 'Dr. Emily Parker'];
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Calculate current time position (8am to 6pm = 10 hours)
  const startHour = 8;
  const endHour = 18;
  const totalHours = endHour - startHour;
  const currentTimePercentage = ((currentHour - startHour + currentMinute / 60) / totalHours) * 100;

  const nextAppointment = scheduleAppointments.find(apt => !apt.arrived && !apt.noShow);
  const unconfirmedBeforeNoon = scheduleAppointments.filter(apt => {
    const hour = parseInt(apt.time.split(':')[0]);
    return !apt.status.confirmed && hour < 12;
  }).length;

  // Helper to get doctor initials
  const getDoctorInitials = (providerName: string): string => {
    const names = providerName.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  // Helper to get visit type color (high contrast)
  const getVisitTypeColor = (visitType: 'in-clinic' | 'virtual'): string => {
    return visitType === 'in-clinic' ? '#5B8DEF' : '#34C759'; // In-clinic = blue, Virtual = green
  };

  // Helper to get visit type background color
  const getVisitTypeBackgroundColor = (visitType: 'in-clinic' | 'virtual'): string => {
    return visitType === 'in-clinic' ? 'rgba(91, 141, 239, 0.08)' : 'rgba(52, 199, 89, 0.08)'; // In-clinic = light blue, Virtual = light green
  };

  // Detect overlapping appointments and group them
  const getTimeInMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Group appointments by time slots to detect overlaps
  const groupAppointmentsByTimeSlot = () => {
    const timeSlots: { [key: string]: ScheduleAppointment[] } = {};
    
    scheduleAppointments.forEach((apt) => {
      const startMinutes = getTimeInMinutes(apt.time);
      const endMinutes = startMinutes + apt.duration;
      
      // Find all time slots that overlap with this appointment
      let addedToGroup = false;
      Object.keys(timeSlots).forEach((slotKey) => {
        const slotApts = timeSlots[slotKey];
        const hasOverlap = slotApts.some((existingApt) => {
          const existingStart = getTimeInMinutes(existingApt.time);
          const existingEnd = existingStart + existingApt.duration;
          
          // Check if there's any time overlap
          return (
            (startMinutes < existingEnd && endMinutes > existingStart)
          );
        });
        
        if (hasOverlap) {
          timeSlots[slotKey].push(apt);
          addedToGroup = true;
        }
      });
      
      // If no overlap found, create new time slot group
      if (!addedToGroup) {
        timeSlots[apt.time] = [apt];
      }
    });
    
    return timeSlots;
  };

  const timeSlotGroups = groupAppointmentsByTimeSlot();

  const getStatusInfo = (appointment: ScheduleAppointment): { color: string; type: StatusType; dotted?: boolean; strikethrough?: boolean; icon?: any } => {
    if (appointment.noShow || appointment.indicators.rescheduled) {
      return { 
        color: '#C4CDD8', 
        type: 'cancelled', 
        strikethrough: true 
      };
    }
    if (appointment.indicators.rescheduled) {
      return { 
        color: '#9B82E8', 
        type: 'rescheduled', 
        icon: ArrowRight 
      };
    }
    if (!appointment.status.confirmed) {
      return { 
        color: 'var(--status-warning)', 
        type: 'pending', 
        dotted: true 
      };
    }
    return { 
      color: 'var(--accent-primary)', 
      type: 'confirmed' 
    };
  };

  const getAppointmentPosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const hoursSinceStart = hours - startHour;
    return ((hoursSinceStart + minutes / 60) / totalHours) * 100;
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Top Control Header */}
      <div className="px-6 py-4 border-b" style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-default)' }}>
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          {/* Left: Date Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                className="p-2 rounded-lg motion-hover"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setSelectedDate('today')}
                className={`px-4 py-2 rounded-lg font-medium motion-hover ${selectedDate === 'today' ? 'active' : ''}`}
                style={{
                  backgroundColor: selectedDate === 'today' ? 'var(--accent-primary)' : 'transparent',
                  color: selectedDate === 'today' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                }}
              >
                Today
              </button>
              
              <button
                onClick={() => setSelectedDate('tomorrow')}
                className="px-4 py-2 rounded-lg font-medium motion-hover"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  if (selectedDate !== 'tomorrow') e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  if (selectedDate !== 'tomorrow') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Tomorrow
              </button>

              <button
                className="px-4 py-2 rounded-lg font-medium motion-hover flex items-center gap-2"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Custom</span>
              </button>

              <button 
                className="p-2 rounded-lg motion-hover"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(91, 141, 239, 0.08)' }}>
              <div className="w-2 h-2 rounded-full animate-gentle-pulse" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>Live</span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 ml-4">
              <select 
                className="px-3 py-2 rounded-lg text-sm font-medium motion-hover"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  color: 'var(--text-secondary)',
                  border: '1.5px solid var(--border-default)',
                }}
                onChange={(e) => setVisitTypeFilter(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="in-clinic">In-Clinic</option>
                <option value="virtual">Virtual</option>
              </select>

              <select 
                className="px-3 py-2 rounded-lg text-sm font-medium motion-hover"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  color: 'var(--text-secondary)',
                  border: '1.5px solid var(--border-default)',
                }}
              >
                <option value="">All Providers</option>
                {providers.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 ml-6 px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--surface-canvas)' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5B8DEF' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  In-clinic
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#34C759' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Video
                </span>
              </div>
            </div>
          </div>

          {/* Right: Context Hints */}
          <div className="flex items-center gap-6">
            {nextAppointment && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Next appointment in <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>12 min</span>
                </span>
              </div>
            )}

            {unconfirmedBeforeNoon > 0 && (
              <button
                onClick={onNavigateToUnconfirmed}
                className="motion-hover px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: 'var(--status-warning-bg)',
                  border: '1.5px solid var(--status-warning)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(242, 166, 90, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--status-warning-bg)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold" style={{ color: 'var(--status-warning)' }}>
                    {unconfirmedBeforeNoon} unconfirmed before noon
                  </span>
                  <span className="text-xs mt-0.5" style={{ color: 'var(--status-warning)', opacity: 0.8 }}>
                    Needs attention
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative">
            {/* Time Rail */}
            <div className="absolute left-0 top-0 bottom-0 w-20 border-r" style={{ borderColor: 'var(--border-subtle)' }}>
              {Array.from({ length: totalHours + 1 }, (_, i) => {
                const hour = startHour + i;
                const displayHour = hour > 12 ? hour - 12 : hour;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                
                return (
                  <div
                    key={hour}
                    className="absolute left-0 -translate-y-1/2"
                    style={{ top: `${(i / totalHours) * 100}%` }}
                  >
                    <span className="text-xs font-medium pr-3" style={{ color: 'var(--text-muted)' }}>
                      {displayHour}:00 {ampm}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timeline Grid */}
            <div className="ml-24 relative min-h-[800px]">
              {/* Grid Lines */}
              {Array.from({ length: totalHours + 1 }, (_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t"
                  style={{ 
                    top: `${(i / totalHours) * 100}%`,
                    borderColor: 'var(--border-subtle)',
                  }}
                />
              ))}

              {/* Current Time Indicator */}
              {currentHour >= startHour && currentHour < endHour && (
                <div
                  className="absolute left-0 right-0 z-10 flex items-center"
                  style={{ top: `${currentTimePercentage}%` }}
                >
                  <div className="w-3 h-3 rounded-full animate-gentle-pulse" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <div className="flex-1 h-0.5" style={{ backgroundColor: 'var(--accent-primary)' }} />
                </div>
              )}

              {/* Appointment Cards */}
              {scheduleAppointments.map((appointment) => {
                const statusInfo = getStatusInfo(appointment);
                const topPosition = getAppointmentPosition(appointment.time);
                const heightPercentage = (appointment.duration / 60 / totalHours) * 100;
                const isHovered = hoveredAppointment === appointment.id;
                const visitTypeColor = getVisitTypeColor(appointment.visitType);
                const isRecentlyUpdated = recentlyUpdated.includes(appointment.id);

                return (
                  <div
                    key={appointment.id}
                    className="absolute left-0 right-0 px-2 motion-state"
                    style={{
                      top: `${topPosition}%`,
                      height: `${heightPercentage}%`,
                      minHeight: '80px',
                    }}
                    onMouseEnter={() => setHoveredAppointment(appointment.id)}
                    onMouseLeave={() => setHoveredAppointment(null)}
                  >
                    <div
                      className={`h-full rounded-xl overflow-hidden cursor-pointer motion-state relative ${
                        isRecentlyUpdated ? 'animate-highlight-pulse' : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--surface-card)',
                        boxShadow: isHovered ? 'var(--shadow-2)' : 'var(--shadow-1)',
                        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                        opacity: hoveredAppointment && !isHovered ? 0.6 : 1,
                        transition: 'all 0.2s ease',
                        border: '1px solid var(--border-default)',
                      }}
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      {/* Vertical colored line - full height, rounded */}
                      <div
                        className="absolute left-0 top-0 bottom-0 rounded-l-xl"
                        style={{
                          width: '5px',
                          backgroundColor: visitTypeColor,
                        }}
                      />

                      <div className="p-4 h-full flex flex-col pl-5">
                        {/* Header with patient name and visit type label */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div 
                                className="font-semibold"
                                style={{ 
                                  color: 'var(--text-primary)',
                                  textDecoration: statusInfo.strikethrough ? 'line-through' : 'none',
                                  opacity: statusInfo.strikethrough ? 0.5 : 1,
                                }}
                              >
                                {appointment.patientName}
                              </div>
                              {/* Visit type inline label */}
                              <span
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: `${visitTypeColor}15`,
                                  color: visitTypeColor,
                                }}
                              >
                                {appointment.visitType === 'virtual' ? 'Video' : 'In clinic'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {appointment.provider}
                              </div>
                              {/* Doctor initials badge */}
                              <div
                                className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: 'var(--surface-canvas)',
                                  color: 'var(--text-secondary)',
                                  border: '1px solid var(--border-subtle)',
                                }}
                              >
                                {getDoctorInitials(appointment.provider)}
                              </div>
                            </div>
                          </div>

                          {/* Confirmation status indicator */}
                          {!appointment.status.confirmed && (
                            <div
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: 'var(--status-warning-bg)',
                                color: 'var(--status-warning)',
                              }}
                            >
                              Unconfirmed
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm mb-auto" style={{ color: 'var(--text-muted)' }}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{appointment.time}</span>
                          <span>•</span>
                          <span>{appointment.duration} min</span>
                        </div>

                        {/* Quick Actions (Hover State) */}
                        {isHovered && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t animate-fade-in" style={{ borderColor: 'var(--border-subtle)' }}>
                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium motion-hover"
                              style={{
                                backgroundColor: 'var(--surface-canvas)',
                                color: 'var(--text-secondary)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </button>

                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium motion-hover"
                              style={{
                                backgroundColor: 'var(--surface-canvas)',
                                color: 'var(--text-secondary)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Message</span>
                            </button>

                            {appointment.visitType === 'virtual' && (
                              <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium motion-hover"
                                style={{
                                  backgroundColor: `${visitTypeColor}15`,
                                  color: visitTypeColor,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${visitTypeColor}25`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = `${visitTypeColor}15`;
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Join</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Over Panel */}
      {selectedAppointment && (
        <GlobalPatientProfile
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdateFollowUp={onUpdateFollowUp}
          onAddDoctorNote={onAddDoctorNote}
          onUpdateDoctorNote={onUpdateDoctorNote}
        />
      )}
    </div>
  );
}