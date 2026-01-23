import { useState, useEffect } from 'react';
import { 
  Settings, 
  Clock, 
  Bell, 
  Phone, 
  Mail, 
  Calendar,
  Loader2,
  AlertCircle,
  Save,
  CheckCircle
} from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { useClinicSettings, ClinicSettings } from '../hooks/useApi';
import { owner } from '../services/api';

export function ConnectedSettingsPage() {
  const { data: settingsData, loading, error, refetch } = useClinicSettings();
  const [localSettings, setLocalSettings] = useState<Partial<ClinicSettings>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setLocalSettings(settingsData);
    }
  }, [settingsData]);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await owner.updateSettings(localSettings);
      setSaveSuccess(true);
      refetch();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof ClinicSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading && !settingsData) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--surface-card)' }}>
          <AlertCircle className="w-8 h-8" style={{ color: 'var(--status-error)' }} />
          <p style={{ color: 'var(--text-primary)' }}>Failed to load settings</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto p-6" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Settings
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Configure your clinic preferences
            </p>
          </div>

          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>

        {/* Appointment Settings */}
        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Appointment Settings
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Configure default appointment behavior
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Default Appointment Duration
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Standard length for new appointments
                </p>
              </div>
              <select
                value={localSettings.default_appointment_duration || 30}
                onChange={(e) => updateSetting('default_appointment_duration', parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Buffer Between Appointments
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Time gap between consecutive appointments
                </p>
              </div>
              <select
                value={localSettings.buffer_between_appointments || 0}
                onChange={(e) => updateSetting('buffer_between_appointments', parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value={0}>No buffer</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Max Appointments Per Day
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Maximum appointments per provider per day
                </p>
              </div>
              <input
                type="number"
                value={localSettings.max_appointments_per_day || 50}
                onChange={(e) => updateSetting('max_appointments_per_day', parseInt(e.target.value))}
                className="w-20 px-3 py-2 rounded-lg border text-center"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <Bell className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Notification Settings
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Configure reminder timing
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Confirmation Reminder
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Hours before appointment to send confirmation
                </p>
              </div>
              <select
                value={localSettings.confirmation_reminder_hours || 24}
                onChange={(e) => updateSetting('confirmation_reminder_hours', parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>72 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Intake Form Reminder
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Hours before appointment to request intake
                </p>
              </div>
              <select
                value={localSettings.intake_reminder_hours || 48}
                onChange={(e) => updateSetting('intake_reminder_hours', parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>72 hours</option>
                <option value={96}>96 hours</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Voice AI Settings */}
        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <Phone className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Voice AI Settings
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Configure automated calling
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Enable Voice AI
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Allow automated voice calls for confirmations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.voice_ai_enabled ?? true}
                  onChange={(e) => updateSetting('voice_ai_enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Auto-Confirm on Response
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Automatically confirm when patient responds positively
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.voice_ai_auto_confirm ?? true}
                  onChange={(e) => updateSetting('voice_ai_auto_confirm', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Enable Escalation
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Escalate to staff when AI cannot resolve
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.voice_ai_escalation_enabled ?? true}
                  onChange={(e) => updateSetting('voice_ai_escalation_enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* SMS & Email Settings */}
        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <Mail className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                SMS & Email Settings
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Configure messaging preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SMS */}
            <div className="space-y-4">
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>SMS</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Enable SMS</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.sms_enabled ?? true}
                    onChange={(e) => updateSetting('sms_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Confirmations</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.sms_confirmation_enabled ?? true}
                    onChange={(e) => updateSetting('sms_confirmation_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.sms_reminder_enabled ?? true}
                    onChange={(e) => updateSetting('sms_reminder_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-4">
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Email</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Enable Email</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.email_enabled ?? true}
                    onChange={(e) => updateSetting('email_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Confirmations</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.email_confirmation_enabled ?? true}
                    onChange={(e) => updateSetting('email_confirmation_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.email_reminder_enabled ?? true}
                    onChange={(e) => updateSetting('email_reminder_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* General Settings */}
        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <Clock className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                General Settings
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Timezone and display preferences
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Timezone
                </p>
              </div>
              <select
                value={localSettings.timezone || 'America/New_York'}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Time Format
                </p>
              </div>
              <select
                value={localSettings.time_format || '12h'}
                onChange={(e) => updateSetting('time_format', e.target.value)}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Date Format
                </p>
              </div>
              <select
                value={localSettings.date_format || 'MM/DD/YYYY'}
                onChange={(e) => updateSetting('date_format', e.target.value)}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ConnectedSettingsPage;
