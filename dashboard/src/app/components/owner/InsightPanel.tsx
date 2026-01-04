import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface InsightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function InsightPanel({ isOpen, onClose, title, subtitle, children }: InsightPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 animate-fade-in"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-2xl shadow-2xl overflow-y-auto animate-slide-in-right"
        style={{
          backgroundColor: 'var(--surface-card)',
          zIndex: 9999,
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 border-b px-8 py-6"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors ml-4"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {children}
        </div>
      </div>
    </>
  );
}

// Insight Section Component
interface InsightSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function InsightSection({ title, children, className = '' }: InsightSectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// Metric Comparison Component
interface MetricComparisonProps {
  before: {
    label: string;
    value: string;
  };
  after: {
    label: string;
    value: string;
  };
  improvement: {
    label: string;
    value: string;
  };
}

export function MetricComparison({ before, after, improvement }: MetricComparisonProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div
        className="p-4 rounded-xl"
        style={{ backgroundColor: 'var(--cf-neutral-20)' }}
      >
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
          {before.label}
        </p>
        <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {before.value}
        </p>
      </div>
      <div
        className="p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
      >
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
          {after.label}
        </p>
        <p className="text-2xl font-semibold" style={{ color: 'var(--status-success)' }}>
          {after.value}
        </p>
      </div>
      <div
        className="p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(91, 141, 239, 0.08)' }}
      >
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
          {improvement.label}
        </p>
        <p className="text-2xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
          {improvement.value}
        </p>
      </div>
    </div>
  );
}

// Simple Trend Chart Component
interface TrendDataPoint {
  label: string;
  value: number;
}

interface SimpleTrendChartProps {
  data: TrendDataPoint[];
  unit?: string;
  showToggle?: boolean;
}

export function SimpleTrendChart({ data, unit = '%', showToggle = true }: SimpleTrendChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div>
      {showToggle && (
        <div className="flex gap-2 mb-4">
          {['30 Days', '60 Days', '90 Days'].map((period, idx) => (
            <button
              key={period}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: idx === 0 ? 'var(--accent-primary-bg)' : 'var(--cf-neutral-20)',
                color: idx === 0 ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
              }}
            >
              {period}
            </button>
          ))}
        </div>
      )}
      
      <div className="space-y-3">
        {data.map((point, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {point.label}
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {point.value}{unit}
              </span>
            </div>
            <div 
              className="h-2 rounded-full"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${(point.value / maxValue) * 100}%`,
                  backgroundColor: 'var(--accent-primary)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bulleted Insight List
interface BulletedInsightListProps {
  items: string[];
}

export function BulletedInsightList({ items }: BulletedInsightListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-3">
          <div
            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          />
          <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

// Info Callout
interface InfoCalloutProps {
  title?: string;
  children: ReactNode;
  variant?: 'info' | 'success' | 'neutral';
}

export function InfoCallout({ title, children, variant = 'info' }: InfoCalloutProps) {
  const getBgColor = () => {
    if (variant === 'success') return 'rgba(52, 199, 89, 0.08)';
    if (variant === 'neutral') return 'var(--cf-neutral-20)';
    return 'rgba(91, 141, 239, 0.08)';
  };

  const getBorderColor = () => {
    if (variant === 'success') return 'var(--status-success)';
    if (variant === 'neutral') return 'var(--border-default)';
    return 'var(--accent-primary)';
  };

  return (
    <div
      className="p-4 rounded-xl border-l-4"
      style={{
        backgroundColor: getBgColor(),
        borderLeftColor: getBorderColor(),
      }}
    >
      {title && (
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
      )}
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </div>
  );
}