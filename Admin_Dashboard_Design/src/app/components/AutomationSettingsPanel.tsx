import { useState } from 'react';
import {
  X,
  GripVertical,
  Copy,
  Trash2,
  Plus,
  ExternalLink,
  MessageSquare,
  Mail,
  Phone,
  Sparkles,
  Pause,
  Play
} from 'lucide-react';

interface AutomationSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AutomationSettingsPanel({ isOpen, onClose }: AutomationSettingsPanelProps) {
  const [settingsActive, setSettingsActive] = useState(true);
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>(['new-patient', 'follow-up', 'telehealth']);
  const [automationSteps, setAutomationSteps] = useState([
    { id: '1', time: 'T-72h', condition: 'Always', channel: 'SMS', template: 'Initial intake link – Mental Health' },
    { id: '2', time: 'T-48h', condition: 'If intake not completed', channel: 'SMS', template: 'Reminder SMS' },
    { id: '3', time: 'T-36h', condition: 'If no response', channel: 'Ava call', template: 'Ava call script – Complete intake by phone' },
  ]);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [avaEnabled, setAvaEnabled] = useState(true);
  const [excludedDays, setExcludedDays] = useState<string[]>(['sat', 'sun']);

  if (!isOpen) return null;

  const toggleAppointmentType = (type: string) => {
    setAppointmentTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleDay = (day: string) => {
    setExcludedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addStep = () => {
    const newStep = {
      id: String(automationSteps.length + 1),
      time: 'T-24h',
      condition: 'If intake not completed',
      channel: 'SMS',
      template: 'Follow-up SMS',
    };
    setAutomationSteps([...automationSteps, newStep]);
  };

  const deleteStep = (id: string) => {
    setAutomationSteps(automationSteps.filter(step => step.id !== id));
  };

  const duplicateStep = (step: typeof automationSteps[0]) => {
    const newStep = {
      ...step,
      id: String(automationSteps.length + 1),
    };
    setAutomationSteps([...automationSteps, newStep]);
  };

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-[480px] flex flex-col"
        style={{ backgroundColor: 'var(--surface-card)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          className="px-6 py-4 border-b"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Automation settings
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Configure how Ava runs intake reminders and follow-ups
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Active/Paused toggle */}
              <div
                className="flex rounded-lg border p-0.5"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <button
                  onClick={() => setSettingsActive(true)}
                  className="px-2 py-1 rounded text-xs font-medium transition-all"
                  style={{
                    backgroundColor: settingsActive ? 'var(--surface-card)' : 'transparent',
                    color: settingsActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  Active
                </button>
                <button
                  onClick={() => setSettingsActive(false)}
                  className="px-2 py-1 rounded text-xs font-medium transition-all"
                  style={{
                    backgroundColor: !settingsActive ? 'var(--surface-card)' : 'transparent',
                    color: !settingsActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  Paused
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* BODY - Scrollable cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* CARD 1: Scope & Schedule */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Scope & schedule
            </h3>

            {/* Clinic type - read only */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Clinic type
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Mental Health Clinics
                </span>
              </div>
            </div>

            {/* Appointment types */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                Appointment types included
              </label>
              <div className="flex gap-2 flex-wrap">
                {['new-patient', 'follow-up', 'telehealth', 'in-clinic'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleAppointmentType(type)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: appointmentTypes.includes(type) ? 'var(--accent-primary-bg)' : 'var(--surface-canvas)',
                      color: appointmentTypes.includes(type) ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      border: `1px solid ${appointmentTypes.includes(type) ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                    }}
                  >
                    {type === 'new-patient' ? 'New patient' :
                     type === 'follow-up' ? 'Follow-up' :
                     type === 'telehealth' ? 'Telehealth' : 'In-clinic'}
                  </button>
                ))}
              </div>
            </div>

            {/* Start and Stop automation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Start automation
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option>1 day before</option>
                  <option>2 days before</option>
                  <option selected>3 days before</option>
                  <option>7 days before</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Stop automation
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option selected>4 hours before</option>
                  <option>8 hours before</option>
                  <option>24 hours before</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 2: Automation Steps */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Automation steps
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Define when and how Ava contacts patients about intake
            </p>

            <div className="space-y-3">
              {automationSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  {/* Step header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Step {idx + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateStep(step)}
                        className="p-1.5 rounded transition-all"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteStep(step.id)}
                        className="p-1.5 rounded transition-all"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Step controls */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                        Time
                      </label>
                      <select
                        className="w-full px-2 py-1.5 rounded border text-xs"
                        style={{
                          backgroundColor: 'var(--surface-card)',
                          borderColor: 'var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        value={step.time}
                      >
                        <option>T-72h</option>
                        <option>T-48h</option>
                        <option>T-36h</option>
                        <option>T-24h</option>
                        <option>Custom...</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                        Condition
                      </label>
                      <select
                        className="w-full px-2 py-1.5 rounded border text-xs"
                        style={{
                          backgroundColor: 'var(--surface-card)',
                          borderColor: 'var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        value={step.condition}
                      >
                        <option>Always</option>
                        <option>If intake not completed</option>
                        <option>If no response</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                        Channel
                      </label>
                      <select
                        className="w-full px-2 py-1.5 rounded border text-xs"
                        style={{
                          backgroundColor: 'var(--surface-card)',
                          borderColor: 'var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        value={step.channel}
                      >
                        <option>SMS</option>
                        <option>Email</option>
                        <option>Ava call</option>
                      </select>
                    </div>
                  </div>

                  {/* Template */}
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                      Message template
                    </label>
                    <select
                      className="w-full px-2 py-1.5 rounded border text-xs"
                      style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                      value={step.template}
                    >
                      <option>Initial intake link – Mental Health</option>
                      <option>Reminder SMS</option>
                      <option>Ava call script – Complete intake by phone</option>
                    </select>
                  </div>
                </div>
              ))}

              {/* Add step button */}
              <button
                onClick={addStep}
                className="w-full px-4 py-2.5 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--accent-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              >
                <Plus className="w-4 h-4" />
                Add step
              </button>
            </div>
          </div>

          {/* CARD 3: Channel Preferences */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Channel preferences
            </h3>

            <div className="space-y-4">
              {/* SMS */}
              <div className="pb-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      SMS
                    </span>
                  </div>
                  <button
                    onClick={() => setSmsEnabled(!smsEnabled)}
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                    style={{ backgroundColor: smsEnabled ? 'var(--accent-primary)' : '#D1D5DB' }}
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                      style={{ transform: smsEnabled ? 'translateX(20px)' : 'translateX(4px)' }}
                    />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                      Default language
                    </label>
                    <select
                      className="w-full px-2 py-1.5 rounded border text-xs"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Quiet hours
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      defaultValue="20:00"
                      className="flex-1 px-2 py-1.5 rounded border text-xs"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>to</span>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="flex-1 px-2 py-1.5 rounded border text-xs"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="pb-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Email
                    </span>
                  </div>
                  <button
                    onClick={() => setEmailEnabled(!emailEnabled)}
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                    style={{ backgroundColor: emailEnabled ? 'var(--accent-primary)' : '#D1D5DB' }}
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                      style={{ transform: emailEnabled ? 'translateX(20px)' : 'translateX(4px)' }}
                    />
                  </button>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Default language
                  </label>
                  <select
                    className="w-full px-2 py-1.5 rounded border text-xs"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option>English</option>
                    <option>Spanish</option>
                  </select>
                </div>
              </div>

              {/* Ava call */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Ava call
                    </span>
                  </div>
                  <button
                    onClick={() => setAvaEnabled(!avaEnabled)}
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                    style={{ backgroundColor: avaEnabled ? 'var(--accent-primary)' : '#D1D5DB' }}
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                      style={{ transform: avaEnabled ? 'translateX(20px)' : 'translateX(4px)' }}
                    />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                      Default language
                    </label>
                    <select
                      className="w-full px-2 py-1.5 rounded border text-xs"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                      Max calls/day
                    </label>
                    <input
                      type="number"
                      defaultValue="2"
                      min="1"
                      max="5"
                      className="w-full px-2 py-1.5 rounded border text-xs"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                    Quiet hours
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      defaultValue="20:00"
                      className="flex-1 px-2 py-1.5 rounded border text-xs"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>to</span>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="flex-1 px-2 py-1.5 rounded border text-xs"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: Limits & Guardrails */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Limits & guardrails
            </h3>

            <div className="space-y-4">
              {/* Max attempts */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Max total contact attempts per patient
                </label>
                <input
                  type="number"
                  defaultValue="4"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Max days */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Max days to keep patient in automation
                </label>
                <input
                  type="number"
                  defaultValue="7"
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Do not contact on */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Do not contact on
                </label>
                <div className="flex gap-2">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: excludedDays.includes(day) ? '#EF4444' : 'var(--surface-canvas)',
                        color: excludedDays.includes(day) ? 'white' : 'var(--text-secondary)',
                        border: `1px solid ${excludedDays.includes(day) ? '#EF4444' : 'var(--border-default)'}`,
                      }}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Skip automation if intake already complete in EHR
                  </span>
                  <button
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 transform rounded-full bg-white"
                      style={{ transform: 'translateX(20px)' }}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Stop after patient opts out (STOP / unsubscribe)
                  </span>
                  <button
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 transform rounded-full bg-white"
                      style={{ transform: 'translateX(20px)' }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 5: Needs Attention Routing */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Routing for 'Needs attention'
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              Choose who handles patients whose intake is still incomplete after all steps
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Assign to team
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option>Front desk</option>
                  <option>Care coordinator</option>
                  <option>Custom...</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Notification method
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option>In-app only</option>
                  <option>Email only</option>
                  <option>In-app + Email</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
                  Target follow-up within (hours)
                </label>
                <input
                  type="number"
                  defaultValue="4"
                  min="1"
                  max="48"
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                These patients appear in the 'Patients needing attention' section of Intake Operations.
              </p>
            </div>
          </div>

          {/* CARD 6: Templates Used */}
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Templates used in this automation
            </h3>

            <div className="space-y-2">
              {[
                'SMS: Initial intake link – Mental Health',
                'SMS: Reminder – Mental Health',
                'Ava call script: Complete intake by phone',
              ].map((template, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                  }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {template}
                  </span>
                  <button
                    className="text-xs font-medium flex items-center gap-1 transition-all"
                    style={{ color: 'var(--accent-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Edit in templates
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER - Sticky actions */}
        <div
          className="px-6 py-4 border-t"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-center justify-between">
            <button
              className="text-sm font-medium transition-all"
              style={{ color: 'var(--accent-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Preview patient journey
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border font-medium text-sm transition-all"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                Discard
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
