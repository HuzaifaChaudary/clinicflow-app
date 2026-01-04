import { useSettings } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';

export function SchedulingRulesTab() {
  const { schedulingRules, updateSchedulingRules } = useSettings();

  return (
    <div className="space-y-6">
      <SettingCard
        title="Booking Logic"
        description="Control how appointments can be scheduled"
      >
        <div className="space-y-3">
          {[
            {
              key: 'allowOverlapping' as const,
              label: 'Allow Overlapping Appointments',
              description: 'Multiple appointments can be scheduled at the same time',
            },
            {
              key: 'allowWalkIns' as const,
              label: 'Allow Walk-In Bookings',
              description: 'Patients can arrive without a prior appointment',
            },
            {
              key: 'requireProvider' as const,
              label: 'Require Provider Selection',
              description: 'Every appointment must have a specific provider assigned',
            },
            {
              key: 'allowAdminOverride' as const,
              label: 'Allow Admin Override Outside Hours',
              description: 'Admins can schedule appointments outside clinic hours',
            },
          ].map((toggle) => (
            <label
              key={toggle.key}
              className="flex items-start justify-between p-4 rounded-lg border cursor-pointer transition-all"
              style={{
                backgroundColor: schedulingRules[toggle.key]
                  ? 'var(--accent-primary-bg)'
                  : 'var(--surface-card)',
                borderColor: schedulingRules[toggle.key]
                  ? 'var(--accent-primary)'
                  : 'var(--border-default)',
              }}
            >
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  {toggle.label}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {toggle.description}
                </p>
              </div>
              <input
                type="checkbox"
                checked={schedulingRules[toggle.key]}
                onChange={(e) =>
                  updateSchedulingRules({ [toggle.key]: e.target.checked })
                }
                className="mt-1 w-5 h-5 rounded"
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </label>
          ))}
        </div>
      </SettingCard>

      <SettingCard
        title="Cancellation & No-Show Logic"
        description="Manage appointment cancellation rules"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Minimum Cancellation Notice (minutes)
            </label>
            <input
              type="number"
              min="0"
              step="15"
              value={schedulingRules.minimumCancellationNotice}
              onChange={(e) =>
                updateSchedulingRules({ minimumCancellationNotice: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Currently: {Math.floor(schedulingRules.minimumCancellationNotice / 60)}h{' '}
              {schedulingRules.minimumCancellationNotice % 60}m
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Auto No-Show Threshold (minutes after appointment time)
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={schedulingRules.autoNoShowThreshold}
              onChange={(e) =>
                updateSchedulingRules({ autoNoShowThreshold: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <label
            className="flex items-start justify-between p-4 rounded-lg border cursor-pointer"
            style={{
              backgroundColor: schedulingRules.cancellationReasonRequired
                ? 'var(--accent-primary-bg)'
                : 'var(--surface-card)',
              borderColor: schedulingRules.cancellationReasonRequired
                ? 'var(--accent-primary)'
                : 'var(--border-default)',
            }}
          >
            <div className="flex-1">
              <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Cancellation Reason Required
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Admins must provide a reason when cancelling appointments
              </p>
            </div>
            <input
              type="checkbox"
              checked={schedulingRules.cancellationReasonRequired}
              onChange={(e) =>
                updateSchedulingRules({ cancellationReasonRequired: e.target.checked })
              }
              className="mt-1 w-5 h-5 rounded"
              style={{ accentColor: 'var(--accent-primary)' }}
            />
          </label>
        </div>
      </SettingCard>
    </div>
  );
}
