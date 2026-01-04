import { useSettings, DayOfWeek, SlotSize } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';

export function ClinicProfileTab() {
  const { clinicProfile, updateClinicProfile } = useSettings();

  const days: { id: DayOfWeek; label: string }[] = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' },
  ];

  const slotSizes: SlotSize[] = [15, 30, 45];

  return (
    <div className="space-y-6">
      <SettingCard
        title="Clinic Information"
        description="Basic clinic details"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Clinic Name
            </label>
            <input
              type="text"
              value={clinicProfile.name}
              onChange={(e) => updateClinicProfile({ name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Timezone
            </label>
            <select
              value={clinicProfile.timezone}
              onChange={(e) => updateClinicProfile({ timezone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
            </select>
          </div>
        </div>
      </SettingCard>

      <SettingCard
        title="Default Working Days"
        description="Defines which days the clinic operates"
      >
        <div className="flex gap-2">
          {days.map((day) => {
            const isActive = clinicProfile.workingDays[day.id];
            return (
              <button
                key={day.id}
                onClick={() =>
                  updateClinicProfile({
                    workingDays: {
                      ...clinicProfile.workingDays,
                      [day.id]: !isActive,
                    },
                  })
                }
                className="flex-1 px-3 py-2 rounded-lg border font-medium text-sm transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--surface-card)',
                  borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-default)',
                  color: isActive ? 'white' : 'var(--text-primary)',
                }}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </SettingCard>

      <SettingCard
        title="Default Clinic Hours"
        description="Operating hours for scheduling"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Start Time
            </label>
            <input
              type="time"
              value={clinicProfile.clinicHours.start}
              onChange={(e) =>
                updateClinicProfile({
                  clinicHours: { ...clinicProfile.clinicHours, start: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
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
              value={clinicProfile.clinicHours.end}
              onChange={(e) =>
                updateClinicProfile({
                  clinicHours: { ...clinicProfile.clinicHours, end: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </SettingCard>

      <SettingCard
        title="Default Appointment Slot Size"
        description="Duration of each appointment slot (affects schedule grid)"
      >
        <div className="flex gap-3">
          {slotSizes.map((size) => {
            const isActive = clinicProfile.slotSize === size;
            return (
              <button
                key={size}
                onClick={() => updateClinicProfile({ slotSize: size })}
                className="flex-1 px-4 py-3 rounded-lg border font-medium transition-all"
                style={{
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--surface-card)',
                  borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-default)',
                  color: isActive ? 'white' : 'var(--text-primary)',
                }}
              >
                {size} min
              </button>
            );
          })}
        </div>
      </SettingCard>
    </div>
  );
}
