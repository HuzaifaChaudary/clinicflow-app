import { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { mockDoctors } from '../data/enhancedMockData';
import { Bell, Clock, Video, Save, Sparkles, Calendar } from 'lucide-react';

type DoctorSettingsTab = 'preferences' | 'notifications' | 'availability';

export function DoctorSettings() {
  const { activeDoctorId } = useRole();
  const [activeTab, setActiveTab] = useState<DoctorSettingsTab>('preferences');
  const [hasChanges, setHasChanges] = useState(false);

  // Get current doctor info
  const currentDoctor = activeDoctorId 
    ? mockDoctors.find(d => d.id === activeDoctorId)
    : null;

  if (!currentDoctor) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="text-center">
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            No doctor profile selected
          </p>
        </div>
      </div>
    );
  }

  // Doctor-specific settings
  const [settings, setSettings] = useState({
    preferences: {
      defaultVisitLength: 30,
      videoVisitsEnabled: true,
      defaultView: 'day' as 'day' | 'week' | 'month',
      timeZone: 'America/Los_Angeles (PST)',
    },
    notifications: {
      emailNewBookings: true,
      emailCancellations: true,
      emailSameDayChanges: false,
      inAppHighRiskFlags: true,
      inAppNoShowRisk: true,
      inAppFollowUpDue: true,
    },
    availability: {
      avaTranscription: true,
      avaSuggestions: true,
      avaFollowUpCadence: true,
    },
  });

  const tabs = [
    { id: 'preferences' as DoctorSettingsTab, label: 'Personal Preferences', icon: Calendar },
    { id: 'notifications' as DoctorSettingsTab, label: 'Notifications', icon: Bell },
    { id: 'availability' as DoctorSettingsTab, label: 'Availability & AI', icon: Sparkles },
  ];

  const handleSave = () => {
    // Save settings
    setHasChanges(false);
    // In real app, would save to backend
  };

  return (
    <div className="h-full overflow-auto" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div
        className="px-8 py-6 border-b backdrop-blur-xl sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Settings
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage your personal preferences and availability
            </p>
          </div>

          {hasChanges && (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Tabs */}
          <div className="col-span-3">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all text-left"
                    style={{
                      backgroundColor: isActive ? 'var(--surface-card)' : 'transparent',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                      border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Info Box */}
            <div
              className="mt-6 p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--cf-blue-5)',
                border: '1px solid var(--cf-blue-30)',
              }}
            >
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Restricted Access</strong><br />
                Clinic-wide settings are managed by administrators. Contact your admin team for system configuration changes.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-9">
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              {/* Personal Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Personal Preferences
                    </h3>

                    <div className="space-y-5">
                      {/* Default Visit Length */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                          Default Visit Length
                        </label>
                        <select
                          value={settings.preferences.defaultVisitLength}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              preferences: {
                                ...settings.preferences,
                                defaultVisitLength: parseInt(e.target.value),
                              },
                            });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 rounded-lg border text-sm"
                          style={{
                            backgroundColor: 'var(--surface-canvas)',
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <option value={15}>15 minutes</option>
                          <option value={20}>20 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                        </select>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Default duration for new appointments
                        </p>
                      </div>

                      {/* Enable Video Visits */}
                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            Enable Video Visits
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Allow patients to book virtual appointments with you
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.preferences.videoVisitsEnabled}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                preferences: {
                                  ...settings.preferences,
                                  videoVisitsEnabled: e.target.checked,
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              backgroundColor: settings.preferences.videoVisitsEnabled ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                            }}
                          />
                        </label>
                      </div>

                      {/* Default View */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                          Default View
                        </label>
                        <div className="flex items-center gap-2 p-1 rounded-lg" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          {(['day', 'week', 'month'] as const).map((view) => (
                            <button
                              key={view}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  preferences: {
                                    ...settings.preferences,
                                    defaultView: view,
                                  },
                                });
                                setHasChanges(true);
                              }}
                              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                              style={{
                                backgroundColor: settings.preferences.defaultView === view ? 'var(--accent-primary)' : 'transparent',
                                color: settings.preferences.defaultView === view ? 'white' : 'var(--text-primary)',
                              }}
                            >
                              {view}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Preferred calendar view for My Schedule page
                        </p>
                      </div>

                      {/* Time Zone */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                          Time Zone
                        </label>
                        <select
                          value={settings.preferences.timeZone}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              preferences: {
                                ...settings.preferences,
                                timeZone: e.target.value,
                              },
                            });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2.5 rounded-lg border text-sm"
                          style={{
                            backgroundColor: 'var(--surface-canvas)',
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <option value="America/Los_Angeles (PST)">America/Los Angeles (PST)</option>
                          <option value="America/New_York (EST)">America/New York (EST)</option>
                          <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                          <option value="America/Denver (MST)">America/Denver (MST)</option>
                        </select>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Current clinic time zone
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Notification Preferences
                    </h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Choose how and when you want to be notified
                    </p>

                    {/* Email Notifications */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                        Email Notifications
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              New Bookings
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Receive email when new appointments are booked
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.emailNewBookings}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    emailNewBookings: e.target.checked,
                                  },
                                });
                                setHasChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                              style={{
                                backgroundColor: settings.notifications.emailNewBookings ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              Cancellations
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Get notified when appointments are cancelled
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.emailCancellations}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    emailCancellations: e.target.checked,
                                  },
                                });
                                setHasChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                              style={{
                                backgroundColor: settings.notifications.emailCancellations ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              Same-day Changes
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Alert for changes to same-day appointments
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.emailSameDayChanges}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    emailSameDayChanges: e.target.checked,
                                  },
                                });
                                setHasChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                              style={{
                                backgroundColor: settings.notifications.emailSameDayChanges ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* In-App Alerts */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                        In-App Alerts
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              High-risk Patient Flags
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Show alerts for patients flagged as high-risk
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.inAppHighRiskFlags}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    inAppHighRiskFlags: e.target.checked,
                                  },
                                });
                                setHasChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                              style={{
                                backgroundColor: settings.notifications.inAppHighRiskFlags ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              No-show Risk Alerts
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Notify when patients are at risk of not showing up
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.inAppNoShowRisk}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    inAppNoShowRisk: e.target.checked,
                                  },
                                });
                                setHasChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                              style={{
                                backgroundColor: settings.notifications.inAppNoShowRisk ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                          <div>
                            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              Follow-up Due Today
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              Alert when patient follow-ups are due today
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications.inAppFollowUpDue}
                              onChange={(e) => {
                                setSettings({
                                  ...settings,
                                  notifications: {
                                    ...settings.notifications,
                                    inAppFollowUpDue: e.target.checked,
                                  },
                                });
                                setHasChanges(true);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                              style={{
                                backgroundColor: settings.notifications.inAppFollowUpDue ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Availability & AI Tab */}
              {activeTab === 'availability' && (
                <div className="space-y-6">
                  {/* Availability Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Availability
                    </h3>
                    <div
                      className="p-4 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                      }}
                    >
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        Your clinic hours are managed by the admin team
                      </p>
                      <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Contact admin to change global hours or request schedule modifications
                      </p>
                    </div>
                  </div>

                  {/* Ava AI Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Ava AI Preferences
                    </h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Control how Ava assists during patient visits
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            Use Ava Transcription During Visits
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Enable live transcription when this feature is available
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.availability.avaTranscription}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                availability: {
                                  ...settings.availability,
                                  avaTranscription: e.target.checked,
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              backgroundColor: settings.availability.avaTranscription ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            Show Ava Suggestions for Assessment & Plan
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Display AI-generated clinical suggestions to review
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.availability.avaSuggestions}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                availability: {
                                  ...settings.availability,
                                  avaSuggestions: e.target.checked,
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              backgroundColor: settings.availability.avaSuggestions ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                        <div>
                          <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            Automatically Propose Follow-up Cadence Drafts
                          </p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Let Ava suggest follow-up timing and reminders
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.availability.avaFollowUpCadence}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                availability: {
                                  ...settings.availability,
                                  avaFollowUpCadence: e.target.checked,
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              backgroundColor: settings.availability.avaFollowUpCadence ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
