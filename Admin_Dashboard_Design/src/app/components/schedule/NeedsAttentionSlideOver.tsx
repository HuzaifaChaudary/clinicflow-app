import { X, AlertCircle } from 'lucide-react';
import { Appointment } from '../AppointmentRow';
import { PatientActionCard } from './PatientActionCard';

interface NeedsAttentionSlideOverProps {
  appointments: Appointment[];
  isOpen: boolean;
  onClose: () => void;
  onCall?: (appointmentId: string) => void;
  onReEnrollAI?: (appointmentId: string) => void;
  onSendIntake?: (appointmentId: string) => void;
  onViewProfile?: (appointmentId: string) => void;
}

export function NeedsAttentionSlideOver({
  appointments,
  isOpen,
  onClose,
  onCall,
  onReEnrollAI,
  onSendIntake,
  onViewProfile,
}: NeedsAttentionSlideOverProps) {
  // Filter to appointments that need attention
  const needsAttention = appointments.filter(
    apt => !apt.status.confirmed || !apt.status.intakeComplete
  );

  // Mock last intake sent timestamps (would come from real data)
  const getLastIntakeSent = (appointmentId: string): Date | null => {
    // Mock: some appointments had intake sent recently
    if (appointmentId === '4') {
      return new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    }
    if (appointmentId === '5') {
      return new Date(Date.now() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-fade-in"
        onClick={onClose}
        style={{ backdropFilter: 'blur(2px)' }}
      />

      {/* Slide-over panel */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl z-50 flex flex-col animate-slide-in-right"
        style={{
          backgroundColor: 'var(--surface-canvas)',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-6 py-5 border-b flex items-center justify-between"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                border: '1px solid var(--status-warning)',
              }}
            >
              <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Needs Attention
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {needsAttention.length} patient{needsAttention.length !== 1 ? 's' : ''} requiring action
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center motion-hover"
            style={{
              backgroundColor: 'var(--surface-canvas)',
              border: '1px solid var(--border-default)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
            }}
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Content - Scrollable patient list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {needsAttention.length === 0 ? (
            <div
              className="text-center py-12 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--status-success-bg)',
                  border: '1px solid var(--status-success)',
                }}
              >
                <AlertCircle className="w-8 h-8" style={{ color: 'var(--status-success)' }} />
              </div>
              <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                All caught up!
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No patients need attention right now
              </p>
            </div>
          ) : (
            needsAttention.map((appointment) => (
              <PatientActionCard
                key={appointment.id}
                appointment={appointment}
                onCall={onCall}
                onReEnrollAI={onReEnrollAI}
                onSendIntake={onSendIntake}
                onViewProfile={onViewProfile}
                lastIntakeSentAt={getLastIntakeSent(appointment.id)}
                showActions={true}
              />
            ))
          )}
        </div>

        {/* Footer with summary */}
        {needsAttention.length > 0 && (
          <div
            className="flex-shrink-0 px-6 py-4 border-t"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {appointments.filter(a => !a.status.confirmed).length} unconfirmed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {appointments.filter(a => !a.status.intakeComplete).length} missing intake
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
