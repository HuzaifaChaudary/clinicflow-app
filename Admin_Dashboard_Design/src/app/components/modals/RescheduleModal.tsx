import { useState, useMemo } from 'react';
import { X, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { Appointment, Doctor } from '../../types/appointment';
import { generateProviderAvailability } from '../../data/enhancedMockData';

interface RescheduleModalProps {
  appointment: Appointment;
  doctors: Doctor[];
  onClose: () => void;
  onConfirm: (appointmentId: string, newTime: string, newProvider: string, newDate: string) => void;
}

export function RescheduleModal({
  appointment,
  doctors,
  onClose,
  onConfirm,
}: RescheduleModalProps) {
  const [selectedProvider, setSelectedProvider] = useState(appointment.provider);
  const [selectedDate, setSelectedDate] = useState('2026-01-02'); // Tomorrow
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get availability for selected provider and date
  const availability = useMemo(() => {
    const doctor = doctors.find(d => d.name === selectedProvider);
    if (!doctor) return [];
    
    return generateProviderAvailability(doctor.id, selectedDate);
  }, [selectedProvider, selectedDate, doctors]);

  const availableSlots = availability.filter(slot => slot.available);

  const handleReschedule = () => {
    if (!selectedTime) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onConfirm(appointment.id, selectedTime, selectedProvider, selectedDate);
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--surface-card)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Reschedule Appointment
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {appointment.patientName} • Originally {appointment.time}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current appointment info */}
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--surface-canvas)',
              borderColor: 'var(--border-default)',
            }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              Current Appointment
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>
                  {appointment.date || 'Today'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{appointment.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{appointment.provider}</span>
              </div>
            </div>
          </div>

          {/* Provider selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Select Provider
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setSelectedProvider(doctor.name);
                    setSelectedTime(''); // Reset time when provider changes
                  }}
                  className="p-4 rounded-lg border transition-all text-left"
                  style={{
                    backgroundColor:
                      selectedProvider === doctor.name
                        ? 'var(--accent-primary-bg)'
                        : 'var(--surface-card)',
                    borderColor:
                      selectedProvider === doctor.name
                        ? 'var(--accent-primary)'
                        : 'var(--border-default)',
                    borderWidth: selectedProvider === doctor.name ? '2px' : '1px',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{
                        backgroundColor: doctor.color || 'var(--accent-primary)',
                        color: 'white',
                      }}
                    >
                      {doctor.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {doctor.name}
                      </p>
                      {doctor.specialty && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {doctor.specialty}
                        </p>
                      )}
                    </div>
                    {selectedProvider === doctor.name && (
                      <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Select Date
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { date: '2026-01-02', label: 'Tomorrow' },
                { date: '2026-01-03', label: 'Fri, Jan 3' },
                { date: '2026-01-06', label: 'Mon, Jan 6' },
                { date: '2026-01-07', label: 'Tue, Jan 7' },
                { date: '2026-01-08', label: 'Wed, Jan 8' },
              ].map((dateOption) => (
                <button
                  key={dateOption.date}
                  onClick={() => {
                    setSelectedDate(dateOption.date);
                    setSelectedTime(''); // Reset time when date changes
                  }}
                  className="px-3 py-2.5 rounded-lg border transition-all text-sm font-medium"
                  style={{
                    backgroundColor:
                      selectedDate === dateOption.date
                        ? 'var(--accent-primary)'
                        : 'var(--surface-card)',
                    borderColor:
                      selectedDate === dateOption.date
                        ? 'var(--accent-primary)'
                        : 'var(--border-default)',
                    color:
                      selectedDate === dateOption.date
                        ? 'white'
                        : 'var(--text-primary)',
                  }}
                >
                  {dateOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Available Time Slots
              <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>
                ({availableSlots.length} available)
              </span>
            </label>
            
            {availableSlots.length === 0 ? (
              <div
                className="p-6 rounded-lg border text-center"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  No slots available
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Try selecting a different date or provider
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedTime(slot.time)}
                    className="px-3 py-2 rounded-lg border transition-all text-sm font-medium"
                    style={{
                      backgroundColor:
                        selectedTime === slot.time
                          ? 'var(--accent-primary)'
                          : 'var(--surface-card)',
                      borderColor:
                        selectedTime === slot.time
                          ? 'var(--accent-primary)'
                          : 'var(--border-default)',
                      color:
                        selectedTime === slot.time
                          ? 'white'
                          : 'var(--text-primary)',
                    }}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {selectedTime && (
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--status-success-bg)',
                borderColor: 'var(--status-success)',
              }}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-success)' }} />
                <div>
                  <p className="font-medium mb-1" style={{ color: 'var(--status-success)' }}>
                    New appointment time
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {selectedDate} at {selectedTime} with {selectedProvider}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between gap-3 flex-shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-primary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={!selectedTime || isLoading}
            className="px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: selectedTime ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
              color: 'white',
            }}
          >
            {isLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}