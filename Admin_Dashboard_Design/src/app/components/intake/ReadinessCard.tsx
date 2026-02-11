import React from 'react';

interface ReadinessCardProps {
  label: string;
  subtext: string;
  count: number;
  variant: 'action' | 'risk' | 'ready';
  onClick?: () => void;
}

export function ReadinessCard({ 
  label, 
  subtext, 
  count, 
  variant,
  onClick,
}: ReadinessCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'action':
        return {
          bg: 'linear-gradient(135deg, rgba(242, 166, 90, 0.08) 0%, rgba(242, 166, 90, 0.04) 100%)',
          accentColor: 'var(--cf-warning)',
          textColor: 'var(--cf-warning)',
        };
      case 'risk':
        return {
          bg: 'linear-gradient(135deg, rgba(224, 122, 95, 0.08) 0%, rgba(224, 122, 95, 0.04) 100%)',
          accentColor: 'var(--cf-error)',
          textColor: 'var(--cf-error)',
        };
      case 'ready':
        return {
          bg: 'linear-gradient(135deg, rgba(123, 167, 225, 0.08) 0%, rgba(123, 167, 225, 0.04) 100%)',
          accentColor: 'var(--cf-info)',
          textColor: 'var(--cf-info)',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-[22px] p-6 text-left w-full transition-all duration-200 group"
      style={{
        background: styles.bg,
        boxShadow: '0px 2px 8px rgba(30, 41, 59, 0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0px 8px 20px rgba(30, 41, 59, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0px 2px 8px rgba(30, 41, 59, 0.04)';
      }}
    >
      {/* Subtle accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: styles.accentColor }}
      />

      <div className="space-y-1">
        <p
          className="text-sm font-medium tracking-wide uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          {subtext}
        </p>
      </div>

      <div className="mt-4">
        <span
          className="text-4xl font-semibold tracking-tight"
          style={{ color: styles.textColor }}
        >
          {count}
        </span>
      </div>

      {/* Hover indicator */}
      <div
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: styles.accentColor }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7.5 15L12.5 10L7.5 5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}
