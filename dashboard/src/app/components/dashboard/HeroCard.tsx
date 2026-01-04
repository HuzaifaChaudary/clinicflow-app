import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface HeroCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  accentColor: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function HeroCard({
  title,
  count,
  icon: Icon,
  accentColor,
  isActive = false,
  onClick,
}: HeroCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="w-full text-left rounded-lg border transition-all"
      style={{
        backgroundColor: isActive ? 'var(--surface-card)' : isHovered ? 'var(--surface-card)' : 'var(--surface-card)',
        borderColor: isActive ? accentColor : 'var(--border-default)',
        borderWidth: isActive ? '2px' : '1.5px',
        boxShadow: isActive 
          ? `0 8px 16px rgba(0, 0, 0, 0.12), 0 0 0 3px ${accentColor}15`
          : isHovered 
            ? '0 4px 12px rgba(0, 0, 0, 0.08)' 
            : '0 1px 3px rgba(0, 0, 0, 0.05)',
        transform: isPressed ? 'scale(0.98)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
        opacity: !isActive && onClick ? 1 : 1,
        padding: isActive ? '23px' : '24px', // Compensate for border width
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: `${accentColor}15`,
            border: `1.5px solid ${accentColor}`,
            transform: isActive ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Icon className="w-6 h-6" style={{ color: accentColor }} />
        </div>

        {isActive && (
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span
            className="text-3xl font-semibold"
            style={{ 
              color: isActive ? 'var(--text-primary)' : 'var(--text-primary)',
              transition: 'color 0.2s ease',
            }}
          >
            {count}
          </span>
          {isActive && (
            <span className="text-sm font-medium" style={{ color: accentColor }}>
              filtered
            </span>
          )}
        </div>
        <p
          className="text-sm font-medium"
          style={{ 
            color: isActive ? accentColor : 'var(--text-secondary)',
            transition: 'color 0.2s ease',
          }}
        >
          {title}
        </p>
      </div>
    </button>
  );
}
