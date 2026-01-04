import React from 'react';

interface IntakeProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function IntakeProgressBar({ currentStep, totalSteps }: IntakeProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--surface-card)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: 'var(--accent-primary)',
          }}
        />
      </div>
    </div>
  );
}
