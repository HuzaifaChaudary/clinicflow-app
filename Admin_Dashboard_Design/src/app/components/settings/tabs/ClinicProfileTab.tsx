import { useSettings, DayOfWeek, SlotSize } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';
import { useState } from 'react';

type HourTemplate = 'custom' | 'standard-9-5' | 'extended-8-8' | 'weekend-clinic';

export function ClinicProfileTab() {
  const { clinicProfile, updateClinicProfile } = useSettings();
  const [hourTemplate, setHourTemplate] = useState<HourTemplate>('custom');

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

  const applyHourTemplate = (template: HourTemplate) => {
    setHourTemplate(template);
    switch (template) {
      case 'standard-9-5':
        updateClinicProfile({
          clinicHours: { start: '09:00', end: '17:00' },
          workingDays: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
          },
        });
        break;
      case 'extended-8-8':
        updateClinicProfile({
          clinicHours: { start: '08:00', end: '20:00' },
          workingDays: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
          },
        });
        break;
      case 'weekend-clinic':
        updateClinicProfile({
          clinicHours: { start: '09:00', end: '17:00' },
          workingDays: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: true,
            sunday: true,
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="Clinic Information"
        description="Basic clinic details"
        metadata={{ updatedBy: 'Admin User', updatedAt: '2 days ago' }}
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
        metadata={{ updatedBy: 'Admin User', updatedAt: '1 week ago' }}
      >
        {/* Quick action buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => {
              updateClinicProfile({
                workingDays: {
                  monday: true,
                  tuesday: true,
                  wednesday: true,
                  thursday: true,
                  friday: true,
                  saturday: false,
                  sunday: false,
                },
              });
            }}
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--accent-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Select weekdays
          </button>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <button
            onClick={() => {
              updateClinicProfile({
                workingDays: {
                  monday: false,
                  tuesday: false,
                  wednesday: false,
                  thursday: false,
                  friday: false,
                  saturday: false,
                  sunday: false,
                },
              });
            }}
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--accent-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Clear all
          </button>
        </div>
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
        metadata={{ updatedBy: 'System', updatedAt: '3 days ago' }}
      >
        {/* Hour template selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Hour template
          </label>
          <select
            value={hourTemplate}
            onChange={(e) => applyHourTemplate(e.target.value as HourTemplate)}
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="custom">Custom hours</option>
            <option value="standard-9-5">Standard 9–5</option>
            <option value="extended-8-8">Extended hours (8–8)</option>
            <option value="weekend-clinic">Weekend clinic</option>
          </select>
        </div>
        
        {/* Time inputs */}
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