import { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { mockDoctors } from '../data/enhancedMockData';
import { Bell, Clock, Video, Save } from 'lucide-react';

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

  // Doctor-specific settings (subset of full settings)
  const [settings, setSettings] = useState({
    preferences: {
      defaultVisitLength: 30,
      videoVisitsEnabled: true,
      autoConfirmAppointments: false,
    },
    notifications: {
      unconfirmedAppointments: true,
      missingIntake: true,
      aiEscalations: true,
      patientMessages: true,
      emailDigest: true,
    },
    availability: {
      workingHoursStart: '09:00',
      workingHoursEnd: '17:00',
      allowAIConfirmations: true,
      allowAIFollowups: true,
      escalateToAdmin: false,
    },
  });

  const tabs = [
    { id: 'preferences' as DoctorSettingsTab, label: 'Personal Preferences', icon: Clock },
    { id: 'notifications' as DoctorSettingsTab, label: 'Notifications', icon: Bell },
    { id: 'availability' as DoctorSettingsTab, label: 'Availability & AI', icon: Video },
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
          backgroundColor: 'rgba(var(--surface-card-rgb), 0.8)',
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
              Manage your personal preferences
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
                    <span>{tab.label}</span>
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
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <strong>Restricted Access</strong><br />
                Clinic-wide settings are managed by administrators. 
                Contact your admin team for system configuration changes.
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
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Personal Preferences
                    </h3>

                    <div className="space-y-4">
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
                          className="w-full px-4 py-2 rounded-lg border"
                          style={{
                            backgroundColor: 'var(--surface-canvas)',
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                          }}
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>60 minutes</option>
                        </select>
                      </div>

                      {/* Video Visits */}
                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            Enable Video Visits
                          </p>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
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
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Notification Preferences
                    </h3>

                    <div className="space-y-3">
                      {Object.entries(settings.notifications).map(([key, value]) => {
                        const labels: Record<string, { title: string; description: string }> = {
                          unconfirmedAppointments: {
                            title: 'Unconfirmed Appointments',
                            description: 'Get notified when patients haven\'t confirmed',
                          },
                          missingIntake: {
                            title: 'Missing Intake Forms',
                            description: 'Alert when patients need to complete intake',
                          },
                          aiEscalations: {
                            title: 'Voice AI Escalations',
                            description: 'Notify when AI needs your input',
                          },
                          patientMessages: {
                            title: 'Patient Messages',
                            description: 'Alert for new patient communications',
                          },
                          emailDigest: {
                            title: 'Daily Email Digest',
                            description: 'Receive daily summary of your schedule',
                          },
                        };

                        const label = labels[key];

                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 rounded-xl"
                            style={{ backgroundColor: 'var(--surface-canvas)' }}
                          >
                            <div>
                              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {label.title}
                              </p>
                              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                {label.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => {
                                  setSettings({
                                    ...settings,
                                    notifications: {
                                      ...settings.notifications,
                                      [key]: e.target.checked,
                                    },
                                  });
                                  setHasChanges(true);
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                                style={{
                                  backgroundColor: value ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                                }}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'availability' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Working Hours
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={settings.availability.workingHoursStart}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              availability: {
                                ...settings.availability,
                                workingHoursStart: e.target.value,
                              },
                            });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2 rounded-lg border"
                          style={{
                            backgroundColor: 'var(--surface-canvas)',
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                          End Time
                        </label>
                        <input
                          type="time"
                          value={settings.availability.workingHoursEnd}
                          onChange={(e) => {
                            setSettings({
                              ...settings,
                              availability: {
                                ...settings.availability,
                                workingHoursEnd: e.target.value,
                              },
                            });
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-2 rounded-lg border"
                          style={{
                            backgroundColor: 'var(--surface-canvas)',
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                      Note: These hours must fall within clinic operating hours set by your admin
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Voice AI Preferences
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            Allow AI Confirmations
                          </p>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Let AI automatically confirm your appointments
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.availability.allowAIConfirmations}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                availability: {
                                  ...settings.availability,
                                  allowAIConfirmations: e.target.checked,
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              backgroundColor: settings.availability.allowAIConfirmations ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            Allow AI Follow-ups
                          </p>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Let AI send follow-up messages to your patients
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.availability.allowAIFollowups}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                availability: {
                                  ...settings.availability,
                                  allowAIFollowups: e.target.checked,
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              backgroundColor: settings.availability.allowAIFollowups ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            Escalate to Admin First
                          </p>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Route AI escalations to admin team instead of directly to you
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.availability.escalateToAdmin}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                availability: {
                                  ...settings.availability,
                                  escalateToAdmin: e.target.checked,
                                },
                              });
                              setHasChanges(true);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{
                              backgroundColor: settings.availability.escalateToAdmin ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
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
