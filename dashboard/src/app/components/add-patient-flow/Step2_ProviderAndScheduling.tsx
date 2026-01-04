import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, User, ChevronRight } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Step2Props {
  selectedProvider: string;
  selectedDate: string;
  selectedTime: string;
  availableProviders: string[];
  onProviderChange: (provider: string) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2_ProviderAndScheduling({
  selectedProvider,
  selectedDate,
  selectedTime,
  availableProviders,
  onProviderChange,
  onDateChange,
  onTimeChange,
  onNext,
  onBack,
}: Step2Props) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);

  // Simulate fetching available slots when provider and date are selected
  useEffect(() => {
    if (selectedProvider && selectedDate) {
      setIsLoadingSlots(true);
      setShowAvailability(true);

      // Simulate API call
      setTimeout(() => {
        // Mock available slots (15-minute granularity)
        const mockSlots: TimeSlot[] = [
          { time: '9:00 AM', available: true },
          { time: '9:15 AM', available: false },
          { time: '9:30 AM', available: true },
          { time: '9:45 AM', available: true },
          { time: '10:00 AM', available: false },
          { time: '10:15 AM', available: true },
          { time: '10:30 AM', available: true },
          { time: '10:45 AM', available: true },
          { time: '11:00 AM', available: true },
          { time: '11:15 AM', available: false },
          { time: '11:30 AM', available: true },
          { time: '11:45 AM', available: true },
          { time: '1:00 PM', available: true },
          { time: '1:15 PM', available: true },
          { time: '1:30 PM', available: false },
          { time: '1:45 PM', available: true },
          { time: '2:00 PM', available: true },
          { time: '2:15 PM', available: true },
          { time: '2:30 PM', available: true },
          { time: '2:45 PM', available: false },
        ];
        setAvailableSlots(mockSlots);
        setIsLoadingSlots(false);
      }, 600);
    } else {
      setAvailableSlots([]);
      setShowAvailability(false);
    }
  }, [selectedProvider, selectedDate]);

  const hasAvailableSlots = availableSlots.some(slot => slot.available);
  const canProceed = selectedDate && selectedTime; // Provider is optional

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Get next 30 days for date limit
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Schedule Appointment
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Select provider, date, and time for this appointment
        </p>
      </div>

      {/* Provider selection */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            <span>Provider (Optional but recommended)</span>
          </div>
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border transition-all"
          style={{
            backgroundColor: 'var(--surface-canvas)',
            borderColor: selectedProvider ? 'var(--accent-primary)' : 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">Select a provider</option>
          {availableProviders.map(provider => (
            <option key={provider} value={provider}>{provider}</option>
          ))}
        </select>
      </div>

      {/* Date selection */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            <span>Appointment Date</span>
          </div>
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={today}
          max={maxDateStr}
          className="w-full px-4 py-3 rounded-lg border transition-all"
          style={{
            backgroundColor: 'var(--surface-canvas)',
            borderColor: selectedDate ? 'var(--accent-primary)' : 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Available time slots */}
      {showAvailability && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span>Available Time Slots</span>
            </div>
          </label>

          {isLoadingSlots ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
              <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
                Checking availability for {selectedProvider}...
              </p>
            </div>
          ) : hasAvailableSlots ? (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto p-1">
                {availableSlots.filter(slot => slot.available).map(slot => (
                  <button
                    key={slot.time}
                    onClick={() => onTimeChange(slot.time)}
                    className="px-3 py-2 rounded-lg border transition-all text-sm font-medium"
                    style={{
                      backgroundColor: selectedTime === slot.time ? 'var(--accent-primary)' : 'var(--surface-card)',
                      borderColor: selectedTime === slot.time ? 'var(--accent-primary)' : 'var(--border-default)',
                      color: selectedTime === slot.time ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                {availableSlots.filter(s => s.available).length} slots available for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </>
          ) : (
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                borderColor: 'var(--status-warning)',
              }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-warning)' }} />
                <div className="flex-1">
                  <p className="font-medium mb-1" style={{ color: 'var(--status-warning)' }}>
                    No availability for {selectedProvider} on this date
                  </p>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Try selecting a different date or provider, or leave the time unset for now.
                  </p>
                  <button
                    onClick={() => onTimeChange('unscheduled')}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: 'white',
                      color: 'var(--status-warning)',
                      border: '1px solid var(--status-warning)',
                    }}
                  >
                    Continue without time
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual time input fallback */}
      {!selectedProvider && selectedDate && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span>Appointment Time (Optional)</span>
            </div>
          </label>
          <input
            type="time"
            value={selectedTime !== 'unscheduled' ? selectedTime : ''}
            onChange={(e) => onTimeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border transition-all"
            style={{
              backgroundColor: 'var(--surface-canvas)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      )}

      {/* Selected summary */}
      {selectedDate && selectedTime && selectedTime !== 'unscheduled' && (
        <div
          className="p-4 rounded-lg border animate-fade-in"
          style={{
            backgroundColor: 'var(--accent-primary-bg)',
            borderColor: 'var(--accent-primary)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
                Appointment scheduled for
              </p>
              <p className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
              {selectedProvider && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  with {selectedProvider}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-primary)',
          }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
          style={{
            backgroundColor: canProceed ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
            color: 'white',
            opacity: canProceed ? 1 : 0.5,
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (canProceed) {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (canProceed) {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            }
          }}
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
