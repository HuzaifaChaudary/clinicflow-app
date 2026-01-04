import { useState } from 'react';
import { UserPlus, RotateCcw, Activity, MessageCircle, MoreHorizontal, ChevronRight } from 'lucide-react';

interface Step5Props {
  selectedReason: string;
  customReason: string;
  onReasonSelect: (reason: string) => void;
  onCustomReasonChange: (reason: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const visitReasons = [
  {
    id: 'new-patient',
    label: 'New Patient Visit',
    icon: UserPlus,
    description: 'First-time patient requiring full intake',
    color: 'var(--accent-primary)',
    bgColor: 'var(--accent-primary-bg)',
  },
  {
    id: 'follow-up',
    label: 'Follow-up Visit',
    icon: RotateCcw,
    description: 'Returning patient for continued care',
    color: 'var(--status-info)',
    bgColor: 'var(--status-info-bg)',
  },
  {
    id: 'procedure',
    label: 'Procedure / Treatment',
    icon: Activity,
    description: 'Scheduled procedure or treatment',
    color: 'var(--status-warning)',
    bgColor: 'var(--status-warning-bg)',
  },
  {
    id: 'consultation',
    label: 'Consultation Only',
    icon: MessageCircle,
    description: 'Consultation without procedure',
    color: 'var(--status-success)',
    bgColor: 'var(--status-success-bg)',
  },
  {
    id: 'other',
    label: 'Other',
    icon: MoreHorizontal,
    description: 'Specify custom visit reason',
    color: 'var(--text-secondary)',
    bgColor: 'var(--cf-neutral-20)',
  },
];

export function Step5_VisitReasonSelection({
  selectedReason,
  customReason,
  onReasonSelect,
  onCustomReasonChange,
  onNext,
  onBack,
}: Step5Props) {
  const [hoveredReason, setHoveredReason] = useState<string | null>(null);

  const canProceed = selectedReason && (selectedReason !== 'other' || customReason.trim());

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          What is the reason for this visit?
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          This determines which intake form will be used
        </p>
      </div>

      {/* Visit reason options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visitReasons.map((reason) => {
          const Icon = reason.icon;
          const isSelected = selectedReason === reason.id;
          const isHovered = hoveredReason === reason.id;

          return (
            <button
              key={reason.id}
              onClick={() => onReasonSelect(reason.id)}
              onMouseEnter={() => setHoveredReason(reason.id)}
              onMouseLeave={() => setHoveredReason(null)}
              className="p-4 rounded-lg border-2 transition-all text-left"
              style={{
                backgroundColor: isSelected ? reason.bgColor : 'var(--surface-card)',
                borderColor: isSelected ? reason.color : isHovered ? 'var(--border-hover)' : 'var(--border-default)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isSelected 
                  ? `0 4px 12px ${reason.color}33` 
                  : isHovered
                    ? '0 4px 8px rgba(0, 0, 0, 0.08)'
                    : '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isSelected ? reason.color : reason.bgColor,
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: isSelected ? 'white' : reason.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {reason.label}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {reason.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: reason.color }}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom reason input */}
      {selectedReason === 'other' && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Please specify the visit reason
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => onCustomReasonChange(e.target.value)}
            placeholder="e.g., Pre-operative consultation, Annual checkup..."
            autoFocus
            className="w-full px-4 py-3 rounded-lg border transition-all"
            style={{
              backgroundColor: 'var(--surface-canvas)',
              borderColor: customReason ? 'var(--accent-primary)' : 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      )}

      {/* Info box */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: 'var(--accent-primary-bg)',
          borderColor: 'var(--accent-primary)',
        }}
      >
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Why this matters
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: 'var(--text-secondary)' }}>
          <li>Determines required intake form fields</li>
          <li>Affects reporting and analytics categorization</li>
          <li>Helps providers prepare for the appointment</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-primary)',
          }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
          style={{
            backgroundColor: canProceed ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
            color: 'white',
            opacity: canProceed ? 1 : 0.5,
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (canProceed) {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (canProceed) {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            }
          }}
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
