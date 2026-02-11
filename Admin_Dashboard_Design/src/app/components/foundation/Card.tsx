import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: '1' | '2' | '3';
  radius?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({ 
  children, 
  padding = 'md', 
  elevation = '1',
  radius = 'md',
  interactive = false,
  onClick,
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const radiusMap = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
  };

  const shadowMap = {
    '1': 'var(--shadow-1)',
    '2': 'var(--shadow-2)',
    '3': 'var(--shadow-3)',
  };

  return (
    <div
      onClick={onClick}
      className={`${paddingClasses[padding]} transition-default ${interactive ? 'cursor-pointer' : ''}`}
      style={{
        backgroundColor: 'var(--surface-card)',
        borderRadius: radiusMap[radius],
        boxShadow: shadowMap[elevation],
      }}
      onMouseEnter={(e) => {
        if (interactive) {
          e.currentTarget.style.boxShadow = 'var(--shadow-2)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (interactive) {
          e.currentTarget.style.boxShadow = shadowMap[elevation];
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
}
