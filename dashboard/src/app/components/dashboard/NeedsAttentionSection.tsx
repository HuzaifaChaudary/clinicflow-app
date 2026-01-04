import { AlertCircle } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { PatientActionCard } from '../schedule/PatientActionCard';

interface NeedsAttentionSectionProps {
  appointments: Appointment[];
  filterType?: 'all' | 'unconfirmed' | 'missing-intake';
  onCall?: (appointmentId: string) => void;
  onReEnrollAI?: (appointmentId: string) => void;
  onSendIntake?: (appointmentId: string) => void;
  onViewProfile?: (appointmentId: string) => void;
}

export function NeedsAttentionSection({
  appointments,
  filterType = 'all',
  onCall,
  onReEnrollAI,
  onSendIntake,
  onViewProfile,
}: NeedsAttentionSectionProps) {
  // Filter appointments that need attention
  const needsAttention = appointments.filter(apt => {
    const isUnconfirmed = !apt.status.confirmed;
    const isMissingIntake = !apt.status.intakeComplete;
    
    if (filterType === 'unconfirmed') return isUnconfirmed;
    if (filterType === 'missing-intake') return isMissingIntake;
    return isUnconfirmed || isMissingIntake;
  });

  // Mock last intake sent timestamps
  const getLastIntakeSent = (appointmentId: string): Date | null => {
    if (appointmentId === '4') return new Date(Date.now() - 2 * 60 * 60 * 1000);
    if (appointmentId === '5') return new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    return null;
  };

  const unconfirmedCount = appointments.filter(a => !a.status.confirmed).length;
  const missingIntakeCount = appointments.filter(a => !a.status.intakeComplete).length;

  return (
    <div 
      className="rounded-lg border overflow-hidden h-full flex flex-col"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center gap-3 mb-2">
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
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Needs Attention
            </h3>
          </div>
        </div>

        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {needsAttention.length} patient{needsAttention.length !== 1 ? 's' : ''} requiring action
          {filterType !== 'all' && (
            <span style={{ color: 'var(--accent-primary)' }}>
              {' '}• {filterType === 'unconfirmed' ? 'unconfirmed' : 'missing intake'} only
            </span>
          )}
        </p>
      </div>

      {/* Scrollable patient list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {needsAttention.length === 0 ? (
          <div className="text-center py-8">
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
              {filterType !== 'all'
                ? `No ${filterType === 'unconfirmed' ? 'unconfirmed' : 'missing intake'} patients`
                : 'No patients need attention right now'}
            </p>
          </div>
        ) : (
          needsAttention.map(appointment => (
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

      {/* Footer summary */}
      {needsAttention.length > 0 && (
        <div
          className="flex-shrink-0 px-6 py-4 border-t"
          style={{
            backgroundColor: 'var(--surface-canvas)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>
                {unconfirmedCount} unconfirmed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>
                {missingIntakeCount} missing intake
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}