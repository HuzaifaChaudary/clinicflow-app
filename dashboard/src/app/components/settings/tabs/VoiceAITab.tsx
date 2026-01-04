import { useSettings } from '../../../context/SettingsContext';
import { SettingCard } from '../SettingCard';
import { Phone, MessageSquare, Mail } from 'lucide-react';

export function VoiceAITab() {
  const { voiceAI, updateVoiceAI } = useSettings();

  return (
    <div className="space-y-6">
      <SettingCard
        title="Automation Channels"
        description="Enable or disable communication channels"
      >
        <div className="space-y-3">
          {[
            { key: 'voiceEnabled' as const, label: 'Voice Calls', icon: Phone },
            { key: 'smsEnabled' as const, label: 'SMS Messages', icon: MessageSquare },
            { key: 'emailEnabled' as const, label: 'Email', icon: Mail },
          ].map((channel) => {
            const Icon = channel.icon;
            return (
              <label
                key={channel.key}
                className="flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all"
                style={{
                  backgroundColor: voiceAI[channel.key]
                    ? 'var(--accent-primary-bg)'
                    : 'var(--surface-card)',
                  borderColor: voiceAI[channel.key]
                    ? 'var(--accent-primary)'
                    : 'var(--border-default)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="w-5 h-5"
                    style={{ color: voiceAI[channel.key] ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                  />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {channel.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={voiceAI[channel.key]}
                  onChange={(e) =>
                    updateVoiceAI({ [channel.key]: e.target.checked })
                  }
                  className="w-5 h-5 rounded"
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
              </label>
            );
          })}
        </div>
      </SettingCard>

      <SettingCard
        title="Call Logic"
        description="Define automated calling behavior"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Maximum Call Attempts
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={voiceAI.maxAttempts}
              onChange={(e) =>
                updateVoiceAI({ maxAttempts: parseInt(e.target.value) || 1 })
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
              Allowed Call Window
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="time"
                value={voiceAI.callWindow.start}
                onChange={(e) =>
                  updateVoiceAI({
                    callWindow: { ...voiceAI.callWindow, start: e.target.value },
                  })
                }
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
              <input
                type="time"
                value={voiceAI.callWindow.end}
                onChange={(e) =>
                  updateVoiceAI({
                    callWindow: { ...voiceAI.callWindow, end: e.target.value },
                  })
                }
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Retry Delay (minutes)
            </label>
            <input
              type="number"
              min="15"
              step="15"
              value={voiceAI.retryDelay}
              onChange={(e) =>
                updateVoiceAI({ retryDelay: parseInt(e.target.value) || 15 })
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
        title="Escalation Rules"
        description="When to flag calls for human intervention"
      >
        <div className="space-y-3">
          {[
            {
              key: 'unrecognizedQuestion' as const,
              label: 'Unrecognized Question',
              description: 'Patient asks something AI cannot answer',
            },
            {
              key: 'requestsHuman' as const,
              label: 'Patient Requests Human',
              description: 'Patient explicitly asks to speak with someone',
            },
            {
              key: 'noResponseAfterMax' as const,
              label: 'No Response After Max Attempts',
              description: 'All retry attempts have been exhausted',
            },
            {
              key: 'ambiguousReply' as const,
              label: 'Ambiguous Reply Detected',
              description: 'Patient response is unclear or uncertain',
            },
          ].map((rule) => (
            <label
              key={rule.key}
              className="flex items-start justify-between p-4 rounded-lg border cursor-pointer"
              style={{
                backgroundColor: voiceAI.escalateOn[rule.key]
                  ? 'var(--status-warning-bg)'
                  : 'var(--surface-card)',
                borderColor: voiceAI.escalateOn[rule.key]
                  ? 'var(--status-warning)'
                  : 'var(--border-default)',
              }}
            >
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  {rule.label}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {rule.description}
                </p>
              </div>
              <input
                type="checkbox"
                checked={voiceAI.escalateOn[rule.key]}
                onChange={(e) =>
                  updateVoiceAI({
                    escalateOn: {
                      ...voiceAI.escalateOn,
                      [rule.key]: e.target.checked,
                    },
                  })
                }
                className="mt-1 w-5 h-5 rounded"
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </label>
          ))}
        </div>
      </SettingCard>
    </div>
  );
}
