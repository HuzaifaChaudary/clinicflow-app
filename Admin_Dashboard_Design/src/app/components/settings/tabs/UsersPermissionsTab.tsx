import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useSettings, User, Role, VisitType } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';

export function UsersPermissionsTab() {
  const { users, addUser, updateUser, removeUser } = useSettings();
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const getRoleBadgeColor = (role: Role) => {
    if (role === 'admin') return 'var(--status-info)';
    if (role === 'doctor') return 'var(--accent-primary)';
    return 'var(--cf-neutral-50)';
  };

  const toggleVisitType = (userId: string, user: User, visitType: VisitType) => {
    const current = user.supportedVisitTypes;
    const updated = current.includes(visitType)
      ? current.filter((t) => t !== visitType)
      : [...current, visitType];
    updateUser(userId, { supportedVisitTypes: updated });
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="Team Members"
        description="Manage users, roles, and permissions"
      >
        <div className="space-y-3">
          {users.map((user) => {
            const isExpanded = expandedUser === user.id;
            const isDoctor = user.role === 'doctor';

            return (
              <div
                key={user.id}
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: 'var(--border-default)' }}
              >
                {/* User Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                      style={{
                        backgroundColor: 'var(--accent-primary-bg)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {user.name}
                        </p>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${getRoleBadgeColor(user.role)}20`,
                            color: getRoleBadgeColor(user.role),
                          }}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isDoctor && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateUser(user.id, { voiceAIEnabled: !user.voiceAIEnabled });
                        }}
                        className="px-3 py-1.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: user.voiceAIEnabled
                            ? 'var(--status-success-bg)'
                            : 'var(--cf-neutral-20)',
                          color: user.voiceAIEnabled ? 'var(--status-success)' : 'var(--text-secondary)',
                        }}
                      >
                        Voice AI {user.voiceAIEnabled ? 'ON' : 'OFF'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details (Doctor Only) */}
                {isExpanded && isDoctor && (
                  <div className="p-4 border-t space-y-4" style={{ borderColor: 'var(--border-default)' }}>
                    {/* Working Hours Override */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          Working Hours Override
                        </label>
                        <button
                          onClick={() => {
                            if (user.workingHoursOverride) {
                              updateUser(user.id, { workingHoursOverride: undefined });
                            } else {
                              updateUser(user.id, {
                                workingHoursOverride: { start: '09:00', end: '17:00' },
                              });
                            }
                          }}
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: 'var(--accent-primary-bg)',
                            color: 'var(--accent-primary)',
                          }}
                        >
                          {user.workingHoursOverride ? 'Remove' : 'Add'}
                        </button>
                      </div>
                      {user.workingHoursOverride && (
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="time"
                            value={user.workingHoursOverride.start}
                            onChange={(e) =>
                              updateUser(user.id, {
                                workingHoursOverride: {
                                  ...user.workingHoursOverride!,
                                  start: e.target.value,
                                },
                              })
                            }
                            className="px-3 py-2 rounded border text-sm"
                            style={{
                              backgroundColor: 'var(--surface-card)',
                              borderColor: 'var(--border-default)',
                              color: 'var(--text-primary)',
                            }}
                          />
                          <input
                            type="time"
                            value={user.workingHoursOverride.end}
                            onChange={(e) =>
                              updateUser(user.id, {
                                workingHoursOverride: {
                                  ...user.workingHoursOverride!,
                                  end: e.target.value,
                                },
                              })
                            }
                            className="px-3 py-2 rounded border text-sm"
                            style={{
                              backgroundColor: 'var(--surface-card)',
                              borderColor: 'var(--border-default)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Supported Visit Types */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Supported Visit Types
                      </label>
                      <div className="flex gap-2">
                        {(['in-clinic', 'virtual', 'phone'] as VisitType[]).map((type) => {
                          const isActive = user.supportedVisitTypes.includes(type);
                          return (
                            <button
                              key={type}
                              onClick={() => toggleVisitType(user.id, user, type)}
                              className="px-3 py-2 rounded text-sm font-medium border"
                              style={{
                                backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--surface-card)',
                                borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-default)',
                                color: isActive ? 'white' : 'var(--text-primary)',
                              }}
                            >
                              {type === 'in-clinic' ? 'In-Clinic' : type === 'virtual' ? 'Virtual' : 'Phone'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-2">
                      {[
                        { key: 'videoVisitsEnabled', label: 'Video Visits Enabled' },
                        { key: 'allowWalkIns', label: 'Allow Walk-Ins' },
                        { key: 'allowForcedBooking', label: 'Allow Forced Admin Booking' },
                      ].map((toggle) => (
                        <label
                          key={toggle.key}
                          className="flex items-center justify-between p-3 rounded border cursor-pointer"
                          style={{ borderColor: 'var(--border-default)' }}
                        >
                          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {toggle.label}
                          </span>
                          <input
                            type="checkbox"
                            checked={user[toggle.key as keyof User] as boolean}
                            onChange={(e) =>
                              updateUser(user.id, { [toggle.key]: e.target.checked })
                            }
                            className="w-4 h-4 rounded"
                            style={{ accentColor: 'var(--accent-primary)' }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SettingCard>
    </div>
  );
}
