import { Check, X, FileText, UserCheck, Calendar, AlertCircle, Phone } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type ChipType = 
  | 'confirmed' 
  | 'unconfirmed' 
  | 'intake-complete' 
  | 'intake-missing' 
  | 'arrived' 
  | 'no-show'
  | 'rescheduled'
  | 'voice'
  | 'alert';

interface StatusChipProps {
  type: ChipType;
  label?: string;
  size?: 'sm' | 'md';
}

const chipConfig: Record<ChipType, {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
}> = {
  'confirmed': {
    icon: Check,
    label: 'Confirmed',
    color: 'var(--status-success)',
    bgColor: 'var(--status-success-bg)',
  },
  'unconfirmed': {
    icon: AlertCircle,
    label: 'Unconfirmed',
    color: 'var(--status-warning)',
    bgColor: 'var(--status-warning-bg)',
  },
  'intake-complete': {
    icon: FileText,
    label: 'Intake complete',
    color: 'var(--status-info)',
    bgColor: 'var(--status-info-bg)',
  },
  'intake-missing': {
    icon: AlertCircle,
    label: 'Missing intake',
    color: 'var(--status-warning)',
    bgColor: 'var(--status-warning-bg)',
  },
  'arrived': {
    icon: UserCheck,
    label: 'Arrived',
    color: 'var(--status-success)',
    bgColor: 'var(--status-success-bg)',
  },
  'no-show': {
    icon: X,
    label: 'No-show',
    color: 'var(--status-error)',
    bgColor: 'var(--status-error-bg)',
  },
  'rescheduled': {
    icon: Calendar,
    label: 'Rescheduled',
    color: 'var(--status-info)',
    bgColor: 'var(--status-info-bg)',
  },
  'voice': {
    icon: Phone,
    label: 'Voice call',
    color: 'var(--accent-primary)',
    bgColor: 'rgba(47, 209, 174, 0.08)',
  },
  'alert': {
    icon: AlertCircle,
    label: 'Attention',
    color: 'var(--status-warning)',
    bgColor: 'var(--status-warning-bg)',
  },
};

export function StatusChip({ type, label, size = 'md' }: StatusChipProps) {
  const config = chipConfig[type];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const sizeStyles = {
    sm: { height: '26px', padding: '0 10px', fontSize: '13px' },
    md: { height: '28px', padding: '0 12px', fontSize: '14px' },
  };

  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        ...sizeStyles[size],
        backgroundColor: config.bgColor,
        color: config.color,
        borderRadius: 'var(--radius-pill)',
        fontWeight: 'var(--font-weight-medium)',
      }}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{displayLabel}</span>
    </span>
  );
}
