import { useSettings, IntakeDeliveryPath } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';

export function IntakeLogicTab() {
  const { intakeLogic, updateIntakeLogic } = useSettings();

  const deliveryPaths: { value: IntakeDeliveryPath; label: string; description: string }[] = [
    {
      value: 'automatic',
      label: 'Always Send Automatically',
      description: 'Intake forms are sent immediately upon booking',
    },
    {
      value: 'manual',
      label: 'Always Manual',
      description: 'Admin must manually send intake forms',
    },
    {
      value: 'ask-every-time',
      label: 'Ask Admin Every Time',
      description: 'Admin chooses at booking whether to send',
    },
  ];

  return (
    <div className="space-y-6">
      <SettingCard
        title="Global Intake Rules"
        description="Control when and how intake forms are required"
      >
        <div className="space-y-3">
          {[
            {
              key: 'intakeRequired' as const,
              label: 'Intake Required Before Visit',
              description: 'Patients must complete intake before arriving (affects dashboard cards)',
            },
            {
              key: 'lockAppointmentIfMissing' as const,
              label: 'Lock Appointment If Intake Missing',
              description: 'Prevent check-in if intake is incomplete',
            },
            {
              key: 'allowManualCompletion' as const,
              label: 'Allow Admin Manual Intake Completion',
              description: 'Admins can mark intake as complete manually',
            },
          ].map((toggle) => (
            <label
              key={toggle.key}
              className="flex items-start justify-between p-4 rounded-lg border cursor-pointer transition-all"
              style={{
                backgroundColor: intakeLogic[toggle.key]
                  ? 'var(--accent-primary-bg)'
                  : 'var(--surface-card)',
                borderColor: intakeLogic[toggle.key]
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
                checked={intakeLogic[toggle.key]}
                onChange={(e) =>
                  updateIntakeLogic({ [toggle.key]: e.target.checked })
                }
                className="mt-1 w-5 h-5 rounded"
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </label>
          ))}
        </div>
      </SettingCard>

      <SettingCard
        title="Intake Delivery Path"
        description="When intake forms are sent to patients"
      >
        <div className="space-y-2">
          {deliveryPaths.map((path) => (
            <label
              key={path.value}
              className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all"
              style={{
                backgroundColor:
                  intakeLogic.deliveryPath === path.value
                    ? 'var(--accent-primary-bg)'
                    : 'var(--surface-card)',
                borderColor:
                  intakeLogic.deliveryPath === path.value
                    ? 'var(--accent-primary)'
                    : 'var(--border-default)',
              }}
            >
              <input
                type="radio"
                name="deliveryPath"
                checked={intakeLogic.deliveryPath === path.value}
                onChange={() => updateIntakeLogic({ deliveryPath: path.value })}
                className="mt-1 w-5 h-5"
                style={{ accentColor: 'var(--accent-primary)' }}
              />
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  {path.label}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {path.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </SettingCard>

      <SettingCard
        title="Visit Type Mapping"
        description="Assign specific intake forms to visit types"
      >
        <div className="space-y-3">
          {Object.entries(intakeLogic.visitTypeMapping).map(([visitType, formId]) => (
            <div key={visitType}>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {visitType === 'in-clinic' ? 'In-Clinic' : 'Virtual'} Visit Form
              </label>
              <select
                value={formId}
                onChange={(e) =>
                  updateIntakeLogic({
                    visitTypeMapping: {
                      ...intakeLogic.visitTypeMapping,
                      [visitType]: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="form_general_intake">General Intake Form</option>
                <option value="form_telehealth_intake">Telehealth Intake Form</option>
                <option value="form_new_patient">New Patient Form</option>
                <option value="form_followup">Follow-Up Form</option>
              </select>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Fallback Form (if no mapping exists)
            </label>
            <select
              value={intakeLogic.fallbackFormId}
              onChange={(e) => updateIntakeLogic({ fallbackFormId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="form_general_intake">General Intake Form</option>
              <option value="form_telehealth_intake">Telehealth Intake Form</option>
              <option value="form_new_patient">New Patient Form</option>
              <option value="form_followup">Follow-Up Form</option>
            </select>
          </div>
        </div>
      </SettingCard>
    </div>
  );
}
