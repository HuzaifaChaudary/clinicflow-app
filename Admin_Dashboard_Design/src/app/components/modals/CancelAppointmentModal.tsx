import { useState } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Appointment, CancellationReason } from '../../types/appointment';

interface CancelAppointmentModalProps {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: (appointmentId: string, reason: CancellationReason) => void;
}

type CancellationType = 'patient-cancelled' | 'no-show' | 'rescheduled-externally' | 'other';

export function CancelAppointmentModal({
  appointment,
  onClose,
  onConfirm,
}: CancelAppointmentModalProps) {
  const [selectedReason, setSelectedReason] = useState<CancellationType | ''>('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reasonOptions: { value: CancellationType; label: string; description: string }[] = [
    {
      value: 'patient-cancelled',
      label: 'Patient Cancelled',
      description: 'Patient called or messaged to cancel',
    },
    {
      value: 'no-show',
      label: 'No Show',
      description: 'Patient did not arrive for appointment',
    },
    {
      value: 'rescheduled-externally',
      label: 'Rescheduled Externally',
      description: 'Patient rescheduled through another channel',
    },
    {
      value: 'other',
      label: 'Other',
      description: 'Other reason (please specify)',
    },
  ];

  const handleCancel = () => {
    if (!selectedReason) return;

    setIsLoading(true);

    const cancellationReason: CancellationReason = {
      type: selectedReason,
      note: note.trim() || undefined,
      timestamp: new Date().toISOString(),
      cancelledBy: 'Admin User', // Would come from auth context in real app
    };

    // Simulate API call
    setTimeout(() => {
      onConfirm(appointment.id, cancellationReason);
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
        className="w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: 'var(--surface-card)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Cancel Appointment
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {appointment.patientName} • {appointment.time}
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
        <div className="p-6 space-y-6">
          {/* Warning */}
          <div
            className="p-4 rounded-lg border flex items-start gap-3"
            style={{
              backgroundColor: 'var(--status-warning-bg)',
              borderColor: 'var(--status-warning)',
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-warning)' }} />
            <div>
              <p className="font-medium mb-1" style={{ color: 'var(--status-warning)' }}>
                This action cannot be undone
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                The appointment will be removed from all active schedules and moved to cancelled appointments.
              </p>
            </div>
          </div>

          {/* Reason selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Cancellation Reason
              <span style={{ color: 'var(--status-error)' }}>*</span>
            </label>
            <div className="space-y-2">
              {reasonOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedReason(option.value)}
                  className="w-full p-4 rounded-lg border transition-all text-left"
                  style={{
                    backgroundColor:
                      selectedReason === option.value
                        ? 'var(--accent-primary-bg)'
                        : 'var(--surface-card)',
                    borderColor:
                      selectedReason === option.value
                        ? 'var(--accent-primary)'
                        : 'var(--border-default)',
                    borderWidth: selectedReason === option.value ? '2px' : '1px',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all`}
                      style={{
                        borderColor:
                          selectedReason === option.value
                            ? 'var(--accent-primary)'
                            : 'var(--border-default)',
                        backgroundColor:
                          selectedReason === option.value
                            ? 'var(--accent-primary)'
                            : 'transparent',
                      }}
                    >
                      {selectedReason === option.value && (
                        <CheckCircle2 className="w-3 h-3" style={{ color: 'white' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {option.label}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional notes */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Additional Notes {selectedReason === 'other' && <span style={{ color: 'var(--status-error)' }}>*</span>}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any additional context..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border resize-none"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
              {selectedReason === 'other'
                ? 'Please provide details about the cancellation reason'
                : 'Optional: Add any relevant details'}
            </p>
          </div>

          {/* Patient cancellation history */}
          {appointment.totalCancellations && appointment.totalCancellations > 0 && (
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
              }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Cancellation History
              </p>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                This patient has cancelled{' '}
                <span className="font-semibold" style={{ color: 'var(--status-warning)' }}>
                  {appointment.totalCancellations}
                </span>{' '}
                appointment{appointment.totalCancellations > 1 ? 's' : ''} previously.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between gap-3"
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
            Keep Appointment
          </button>
          <button
            onClick={handleCancel}
            disabled={!selectedReason || (selectedReason === 'other' && !note.trim()) || isLoading}
            className="px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                selectedReason && !(selectedReason === 'other' && !note.trim())
                  ? 'var(--status-error)'
                  : 'var(--cf-neutral-30)',
              color: 'white',
            }}
          >
            {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    </div>
  );
}