interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  return (
    <div className="mb-6">
      {/* Progress bar */}
      <div className="relative h-1 rounded-full mb-4" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
          style={{
            backgroundColor: 'var(--accent-primary)',
            width: `${(currentStep / totalSteps) * 100}%`,
          }}
        />
      </div>

      {/* Step labels */}
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                style={{
                  backgroundColor: isCompleted || isActive ? 'var(--accent-primary)' : 'var(--cf-neutral-20)',
                  color: isCompleted || isActive ? 'white' : 'var(--text-muted)',
                }}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span
                className="text-sm font-medium hidden md:inline"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
