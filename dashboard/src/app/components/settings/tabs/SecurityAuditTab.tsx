import { useSettings } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';
import { Shield, Clock, FileText } from 'lucide-react';

export function SecurityAuditTab() {
  const { security, updateSecurity, auditLog } = useSettings();

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="Session Security"
        description="Control user session behavior"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              min="5"
              step="5"
              value={security.sessionTimeout}
              onChange={(e) =>
                updateSecurity({ sessionTimeout: parseInt(e.target.value) || 5 })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Users will be logged out after this period of inactivity
            </p>
          </div>

          <label
            className="flex items-start justify-between p-4 rounded-lg border cursor-pointer"
            style={{
              backgroundColor: security.passwordResetRequired
                ? 'var(--status-warning-bg)'
                : 'var(--surface-card)',
              borderColor: security.passwordResetRequired
                ? 'var(--status-warning)'
                : 'var(--border-default)',
            }}
          >
            <div className="flex-1">
              <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Require Periodic Password Reset
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Force users to change passwords every 90 days
              </p>
            </div>
            <input
              type="checkbox"
              checked={security.passwordResetRequired}
              onChange={(e) =>
                updateSecurity({ passwordResetRequired: e.target.checked })
              }
              className="mt-1 w-5 h-5 rounded"
              style={{ accentColor: 'var(--accent-primary)' }}
            />
          </label>
        </div>
      </SettingCard>

      <SettingCard
        title="Audit Log"
        description="Immutable record of all system changes"
      >
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {auditLog.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
              <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                No audit entries yet
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Changes will be recorded here
              </p>
            </div>
          ) : (
            auditLog.map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-hover)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--accent-primary-bg)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {entry.action}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {entry.target}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(entry.timestamp)}
                  </div>
                </div>
                <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {entry.details}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  By {entry.userName}
                </p>
              </div>
            ))
          )}
        </div>
      </SettingCard>
    </div>
  );
}
