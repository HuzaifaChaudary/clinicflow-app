import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Plus, 
  Filter,
  Loader2,
  
  AlertCircle,
  Clock,
  User,
  Video,
  MapPin
} from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { useSchedule, useDoctors } from '../hooks/useApi';
import { appointments as appointmentsApi } from '../services/api';
import { useClinicFormat } from '../hooks/useClinicFormat';

interface ScheduleAppointment {
  id: string;
  time: string;
  patient_name: string;
  doctor: string;
  doctor_id: string;
  visit_type: string;
  status: {
    confirmed: boolean;
    intake_complete: boolean;
  };
}

export function ConnectedSchedulePage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // Fetch data from backend
  const { data: scheduleData, loading, error, refetch } = useSchedule(selectedDate);
  const { data: doctorsData, loading: doctorsLoading, error: doctorsError } = useDoctors();

  // Handle doctors data - API returns { items: [...], total: ... } or array
  const doctors = Array.isArray(doctorsData) 
    ? doctorsData 
    : ((doctorsData as any)?.items || []);

  // Debug: log doctors data
  useEffect(() => {
    console.log('[ConnectedSchedulePage] Doctors data:', { 
      doctorsData, 
      doctors, 
      doctorsCount: doctors.length,
      doctorsLoading,
      doctorsError 
    });
  }, [doctorsData, doctors, doctorsLoading, doctorsError]);

  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleConfirm = async (appointmentId: string) => {
    setConfirmingId(appointmentId);
    setConfirmError(null);
    try {
      await appointmentsApi.confirm(appointmentId);
      await refetch();
      setConfirmingId(null);
    } catch (err: any) {
      console.error('Failed to confirm:', err);
      setConfirmError(err?.message || 'Failed to confirm appointment');
      setConfirmingId(null);
      // Clear error after 3 seconds
      setTimeout(() => setConfirmError(null), 3000);
    }
  };

  const { formatDateLong } = useClinicFormat();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--surface-card)' }}>
          <AlertCircle className="w-8 h-8" style={{ color: 'var(--status-error)' }} />
          <p style={{ color: 'var(--text-primary)' }}>Failed to load schedule</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Transform backend response to match frontend structure
  // Backend returns: { date: "...", doctors: [{ name: "...", appointments: [...] }] }
  // Frontend expects: flat list of appointments with doctor name
  const allAppointments: ScheduleAppointment[] = [];
  if (scheduleData?.doctors) {
    scheduleData.doctors.forEach((doctor: any) => {
      if (doctor.appointments) {
        doctor.appointments.forEach((apt: any) => {
          allAppointments.push({
            id: apt.id,
            time: apt.time,
            patient_name: apt.patient?.name || apt.patient_name || 'Unknown',
            doctor: doctor.name,
            doctor_id: doctor.id,
            visit_type: apt.visitType || apt.visit_type || 'in-clinic',
            status: {
              confirmed: apt.status?.confirmed || false,
              intake_complete: apt.status?.intakeComplete || apt.status?.intake_complete || false,
            },
          });
        });
      }
    });
  }

  // Group appointments by doctor
  const appointmentsByDoctor: Record<string, ScheduleAppointment[]> = {};
  allAppointments.forEach((apt: ScheduleAppointment) => {
    if (!appointmentsByDoctor[apt.doctor]) {
      appointmentsByDoctor[apt.doctor] = [];
    }
    appointmentsByDoctor[apt.doctor].push(apt);
  });

  // Filter by selected doctor
  const filteredDoctors = selectedDoctor === 'all' 
    ? Object.keys(appointmentsByDoctor)
    : [selectedDoctor].filter(d => appointmentsByDoctor[d]);

  // Time slots for the day
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = 7 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <div className="h-screen overflow-auto p-6" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Schedule
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {formatDateLong(selectedDate)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Doctor Filter */}
            <div className="relative">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="px-4 py-2 pr-10 rounded-xl border appearance-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">All Providers</option>
                {doctors.map((doc: any) => (
                  <option key={doc.id} value={doc.name}>{doc.name}</option>
                ))}
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-secondary)' }}
              />
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handlePrevDay}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleToday}>
                Today
              </Button>
              <Button variant="secondary" size="sm" onClick={handleNextDay}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Date Picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Schedule Grid */}
        <Card elevation="2" radius="md">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No appointments scheduled for this day</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header Row */}
                <div 
                  className="grid gap-4 pb-4 border-b"
                  style={{ 
                    gridTemplateColumns: `80px repeat(${filteredDoctors.length}, 1fr)`,
                    borderColor: 'var(--border-default)'
                  }}
                >
                  <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    Time
                  </div>
                  {filteredDoctors.map(doctor => (
                    <div key={doctor} className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {doctor}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
                  {timeSlots.map(time => {
                    const hour = parseInt(time.split(':')[0]);
                    const displayTime = hour > 12 
                      ? `${hour - 12}:${time.split(':')[1]} PM`
                      : `${hour}:${time.split(':')[1]} AM`;

                    return (
                      <div 
                        key={time}
                        className="grid gap-4 py-2"
                        style={{ 
                          gridTemplateColumns: `80px repeat(${filteredDoctors.length}, 1fr)`,
                        }}
                      >
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {displayTime}
                        </div>
                        {filteredDoctors.map(doctor => {
                          const apt = appointmentsByDoctor[doctor]?.find(a => 
                            a.time.startsWith(time) || a.time.startsWith(displayTime)
                          );

                          if (!apt) {
                            return (
                              <div 
                                key={`${doctor}-${time}`}
                                className="h-12 rounded-lg border-2 border-dashed flex items-center justify-center"
                                style={{ borderColor: 'var(--border-default)' }}
                              >
                                <Plus className="w-4 h-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
                              </div>
                            );
                          }

                          return (
                            <div
                              key={apt.id}
                              className="p-2 rounded-lg border"
                              style={{
                                backgroundColor: apt.status.confirmed 
                                  ? 'rgba(52, 199, 89, 0.08)'
                                  : 'rgba(255, 149, 0, 0.08)',
                                borderColor: apt.status.confirmed
                                  ? 'var(--status-success)'
                                  : 'var(--status-warning)'
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {apt.visit_type === 'virtual' ? (
                                    <Video className="w-3 h-3" style={{ color: 'var(--accent-primary)' }} />
                                  ) : (
                                    <MapPin className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                                  )}
                                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                    {apt.patient_name}
                                  </span>
                                </div>
                                {!apt.status.confirmed && (
                                  <div className="flex flex-col items-end gap-1">
                                    <button
                                      onClick={() => handleConfirm(apt.id)}
                                      disabled={confirmingId === apt.id}
                                      className="text-xs px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                      style={{
                                        backgroundColor: confirmingId === apt.id 
                                          ? 'var(--text-muted)' 
                                          : 'var(--accent-primary)',
                                        color: 'white'
                                      }}
                                    >
                                      {confirmingId === apt.id ? 'Confirming...' : 'Confirm'}
                                    </button>
                                    {confirmError && confirmingId !== apt.id && (
                                      <span className="text-xs" style={{ color: 'var(--status-error)' }}>
                                        {confirmError}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ 
                                    backgroundColor: apt.status.intake_complete 
                                      ? 'var(--status-success)' 
                                      : 'var(--status-error)' 
                                  }}
                                />
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {apt.status.intake_complete ? 'Intake done' : 'Missing intake'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card elevation="1" radius="md">
            <div className="text-center">
              <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {allAppointments.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Total Appointments
              </p>
            </div>
          </Card>
          <Card elevation="1" radius="md">
            <div className="text-center">
              <p className="text-3xl font-semibold" style={{ color: 'var(--status-success)' }}>
                {allAppointments.filter(a => a.status.confirmed).length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Confirmed
              </p>
            </div>
          </Card>
          <Card elevation="1" radius="md">
            <div className="text-center">
              <p className="text-3xl font-semibold" style={{ color: 'var(--status-warning)' }}>
                {allAppointments.filter(a => !a.status.confirmed).length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Unconfirmed
              </p>
            </div>
          </Card>
          <Card elevation="1" radius="md">
            <div className="text-center">
              <p className="text-3xl font-semibold" style={{ color: 'var(--status-error)' }}>
                {allAppointments.filter(a => !a.status.intake_complete).length}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Missing Intake
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ConnectedSchedulePage;
