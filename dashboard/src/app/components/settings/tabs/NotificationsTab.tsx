import { useSettings } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';

export function NotificationsTab() {
  const { notifications, updateNotifications } = useSettings();

  return (
    <div className="space-y-6">
      <SettingCard
        title="Alert Triggers"
        description="What events should create notifications"
      >
        <div className="space-y-3">
          {[
            {
              key: 'unconfirmedAppointments' as const,
              label: 'Unconfirmed Appointments',
              description: 'Notify when appointments need confirmation',
            },
            {
              key: 'missingIntake' as const,
              label: 'Missing Intake Forms',
              description: 'Notify when intake is incomplete',
            },
            {
              key: 'aiNeedsAttention' as const,
              label: 'AI Needs Attention',
              description: 'Notify when Voice AI requires human intervention',
            },
            {
              key: 'cancellations' as const,
              label: 'Cancellations',
              description: 'Notify when appointments are cancelled',
            },
            {
              key: 'noShows' as const,
              label: 'No-Shows',
              description: 'Notify when patients miss appointments',
            },
          ].map((trigger) => (
            <label
              key={trigger.key}
              className="flex items-start justify-between p-4 rounded-lg border cursor-pointer"
              style={{
                backgroundColor: notifications.triggers[trigger.key]
                  ? 'var(--accent-primary-bg)'
                  : 'var(--surface-card)',
                borderColor: notifications.triggers[trigger.key]
                  ? 'var(--accent-primary)'
                  : 'var(--border-default)',
              }}
            >
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  {trigger.label}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {trigger.description}
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.triggers[trigger.key]}
                onChange={(e) =>
                  updateNotifications({
                    triggers: {
                      ...notifications.triggers,
                      [trigger.key]: e.target.checked,
                    },
                  })
                }
                className="mt-1 w-5 h-5 rounded"
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </label>
          ))}
        </div>
      </SettingCard>

      <SettingCard
        title="Delivery Methods"
        description="How notifications are sent to users"
      >
        <div className="space-y-3">
          {[
            {
              key: 'inApp' as const,
              label: 'In-App Notifications',
              description: 'Show notifications in the dashboard',
            },
            {
              key: 'email' as const,
              label: 'Email Notifications',
              description: 'Send email alerts to team members',
            },
          ].map((method) => (
            <label
              key={method.key}
              className="flex items-start justify-between p-4 rounded-lg border cursor-pointer"
              style={{
                backgroundColor: notifications.delivery[method.key]
                  ? 'var(--accent-primary-bg)'
                  : 'var(--surface-card)',
                borderColor: notifications.delivery[method.key]
                  ? 'var(--accent-primary)'
                  : 'var(--border-default)',
              }}
            >
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  {method.label}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {method.description}
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.delivery[method.key]}
                onChange={(e) =>
                  updateNotifications({
                    delivery: {
                      ...notifications.delivery,
                      [method.key]: e.target.checked,
                    },
                  })
                }
                className="mt-1 w-5 h-5 rounded"
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </label>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}
