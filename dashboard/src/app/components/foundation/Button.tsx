import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  children,
  fullWidth = false,
}: ButtonProps) {
  const sizeStyles = {
    sm: { height: '36px', padding: '0 14px', fontSize: '14px' },
    md: { height: '44px', padding: '0 18px', fontSize: '16px' },
    lg: { height: '52px', padding: '0 24px', fontSize: '18px' },
  };

  const getStyles = () => {
    const baseStyle = {
      ...sizeStyles[size],
      borderRadius: 'var(--radius-pill)',
      fontWeight: 'var(--font-weight-medium)',
      transition: `all var(--motion-hover) ease-out`,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? 'var(--text-muted)' : 'var(--accent-primary)',
          color: 'var(--text-inverse)',
          border: 'none',
          boxShadow: disabled ? 'none' : '0 1px 3px rgba(59, 111, 226, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          border: `1.5px solid var(--border-default)`,
          boxShadow: 'none',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none',
          boxShadow: 'none',
        };
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    switch (variant) {
      case 'primary':
        e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 111, 226, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        break;
      case 'secondary':
        e.currentTarget.style.backgroundColor = 'rgba(91, 141, 239, 0.04)';
        e.currentTarget.style.borderColor = 'var(--accent-subtle)';
        break;
      case 'ghost':
        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
        break;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    switch (variant) {
      case 'primary':
        e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(59, 111, 226, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)';
        e.currentTarget.style.transform = 'translateY(0)';
        break;
      case 'secondary':
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderColor = 'var(--border-default)';
        break;
      case 'ghost':
        e.currentTarget.style.backgroundColor = 'transparent';
        break;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''}`}
      style={{
        ...getStyles(),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
}