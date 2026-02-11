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
  selectedKPI?: 'patients' | 'registrations' | 'appointments' | 'at-risk';
  selectedDoctor?: string | null;
}

export function NeedsAttentionSection({
  appointments,
  filterType = 'all',
  onCall,
  onReEnrollAI,
  onSendIntake,
  onViewProfile,
  selectedKPI = 'appointments',
  selectedDoctor = null,
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
      className="h-full flex flex-col"
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--border-default)',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Header - Emphasized */}
      <div className="px-6 py-5 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h3 style={{ 
            color: 'var(--text-primary)',
            fontSize: '18px',
            fontWeight: 500,
            margin: 0,
          }}>
            Needs Attention
          </h3>
          <div
            className="px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'var(--status-warning-bg)',
              border: '1px solid var(--status-warning)',
            }}
          >
            <span style={{ 
              color: 'var(--status-warning)', 
              fontSize: '12px', 
              fontWeight: 600,
            }}>
              {needsAttention.length} {needsAttention.length === 1 ? 'patient' : 'patients'}
            </span>
          </div>
        </div>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '13px',
          margin: 0,
          marginBottom: selectedDoctor ? '6px' : 0,
        }}>
          Require action before their visit today
        </p>
        
        {/* Filtered by doctor indicator */}
        {selectedDoctor && (
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '11px',
            margin: 0,
            fontWeight: 500,
          }}>
            Filtered by: <span style={{ color: 'var(--accent-primary)' }}>{selectedDoctor}</span>
          </p>
        )}
      </div>

      {/* Scrollable patient list with dividers */}
      <div className="flex-1 overflow-y-auto">
        {needsAttention.length === 0 ? (
          <div className="text-center py-12 px-6">
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
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {needsAttention.map(appointment => (
              <div key={appointment.id} className="px-6 py-4">
                <PatientActionCard
                  appointment={appointment}
                  onCall={onCall}
                  onReEnrollAI={onReEnrollAI}
                  onSendIntake={onSendIntake}
                  onViewProfile={onViewProfile}
                  lastIntakeSentAt={getLastIntakeSent(appointment.id)}
                  showActions={true}
                  compact={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer summary */}
      {needsAttention.length > 0 && (
        <div
          className="flex-shrink-0 px-6 py-3 border-t"
          style={{
            backgroundColor: 'var(--surface-canvas)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                {unconfirmedCount} unconfirmed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                {missingIntakeCount} missing intake
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}