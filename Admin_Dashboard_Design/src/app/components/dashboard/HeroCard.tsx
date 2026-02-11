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
      className="w-full text-left transition-all"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: isActive ? accentColor : 'var(--border-default)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '8px',
        boxShadow: isActive 
          ? `0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 2px ${accentColor}20`
          : isHovered 
            ? '0 2px 8px rgba(0, 0, 0, 0.06)' 
            : 'none',
        transform: isPressed ? 'scale(0.98)' : isHovered ? 'translateY(-1px)' : 'translateY(0)',
        padding: '16px',
      }}
    >
      {/* Icon with subtle background */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{
          backgroundColor: `${accentColor}12`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>

      {/* Label - small, medium weight */}
      <p
        className="mb-1"
        style={{ 
          color: isActive ? accentColor : 'var(--text-secondary)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </p>

      {/* Number - large, semibold */}
      <div className="flex items-baseline gap-2">
        <span
          style={{ 
            color: 'var(--text-primary)',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {count}
        </span>
        {isActive && (
          <span style={{ 
            color: accentColor, 
            fontSize: '11px', 
            fontWeight: 500,
            textTransform: 'lowercase',
          }}>
            active
          </span>
        )}
      </div>
    </button>
  );
}