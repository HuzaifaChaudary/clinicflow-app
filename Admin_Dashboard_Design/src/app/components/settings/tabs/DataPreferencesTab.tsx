import { useSettings, DataPreferences } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';

export function DataPreferencesTab() {
  const { dataPreferences, updateDataPreferences } = useSettings();

  return (
    <div className="space-y-6">
      <SettingCard
        title="Display Formats"
        description="How dates and times are displayed"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Date Format
            </label>
            <select
              value={dataPreferences.dateFormat}
              onChange={(e) =>
                updateDataPreferences({ dateFormat: e.target.value as DataPreferences['dateFormat'] })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (01/15/2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (15/01/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-01-15)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Time Format
            </label>
            <select
              value={dataPreferences.timeFormat}
              onChange={(e) =>
                updateDataPreferences({ timeFormat: e.target.value as DataPreferences['timeFormat'] })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="12h">12-hour (2:30 PM)</option>
              <option value="24h">24-hour (14:30)</option>
            </select>
          </div>
        </div>
      </SettingCard>

      <SettingCard
        title="Dashboard Preferences"
        description="Control default views and behaviors"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Default Dashboard View
            </label>
            <select
              value={dataPreferences.defaultDashboardView}
              onChange={(e) =>
                updateDataPreferences({
                  defaultDashboardView: e.target.value as DataPreferences['defaultDashboardView'],
                })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="dashboard">Dashboard Overview</option>
              <option value="schedule">Schedule Calendar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Auto-Refresh Interval
            </label>
            <select
              value={dataPreferences.autoRefreshInterval}
              onChange={(e) =>
                updateDataPreferences({ autoRefreshInterval: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="0">Disabled</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="600">10 minutes</option>
            </select>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              How often the dashboard refreshes automatically
            </p>
          </div>
        </div>
      </SettingCard>
    </div>
  );
}
