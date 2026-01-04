import { useState } from 'react';

interface TimeFilterPillProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function TimeFilterPill({ label, count, isActive, onClick }: TimeFilterPillProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="px-6 py-4 rounded-lg transition-all text-left"
      style={{
        backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--surface-card)',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-default)',
        boxShadow: isActive 
          ? '0 4px 12px rgba(91, 141, 239, 0.2)' 
          : isHovered 
            ? '0 2px 8px rgba(0, 0, 0, 0.06)' 
            : '0 1px 3px rgba(0, 0, 0, 0.04)',
        transform: isHovered && !isActive ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      <div className="mb-1">
        <span 
          className="text-2xl font-semibold"
          style={{ color: isActive ? 'white' : 'var(--text-primary)' }}
        >
          {count}
        </span>
      </div>
      <div className="text-sm font-medium" style={{ color: isActive ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)' }}>
        {label}
      </div>
    </button>
  );
}
