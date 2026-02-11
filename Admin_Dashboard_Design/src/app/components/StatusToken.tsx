import { Check, X, FileText, DollarSign, Phone, Calendar, UserCheck } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type StatusType = 
  | 'confirmed' 
  | 'unconfirmed' 
  | 'intake-complete' 
  | 'intake-missing' 
  | 'arrived' 
  | 'rescheduled' 
  | 'voice' 
  | 'paid'
  | 'no-show';

interface StatusTokenProps {
  type: StatusType;
  label?: string;
  interactive?: boolean;
  onClick?: () => void;
  pulse?: boolean;
  readOnly?: boolean;
}

const statusConfig: Record<StatusType, {
  icon: LucideIcon;
  label: string;
  bgVar: string;
  textVar: string;
  borderVar: string;
  glowVar: string;
}> = {
  'confirmed': {
    icon: Check,
    label: 'Confirmed',
    bgVar: '--token-confirmed-bg',
    textVar: '--token-confirmed-text',
    borderVar: '--token-confirmed-border',
    glowVar: '--token-confirmed-glow',
  },
  'unconfirmed': {
    icon: X,
    label: 'Unconfirmed',
    bgVar: '--token-unconfirmed-bg',
    textVar: '--token-unconfirmed-text',
    borderVar: '--token-unconfirmed-border',
    glowVar: '--token-unconfirmed-glow',
  },
  'intake-complete': {
    icon: FileText,
    label: 'Intake',
    bgVar: '--token-intake-complete-bg',
    textVar: '--token-intake-complete-text',
    borderVar: '--token-intake-complete-border',
    glowVar: '--token-intake-complete-glow',
  },
  'intake-missing': {
    icon: FileText,
    label: 'Missing intake',
    bgVar: '--token-intake-missing-bg',
    textVar: '--token-intake-missing-text',
    borderVar: '--token-intake-missing-border',
    glowVar: '--token-intake-missing-glow',
  },
  'arrived': {
    icon: UserCheck,
    label: 'Arrived',
    bgVar: '--token-arrived-bg',
    textVar: '--token-arrived-text',
    borderVar: '--token-arrived-border',
    glowVar: '--token-arrived-glow',
  },
  'rescheduled': {
    icon: Calendar,
    label: 'Rescheduled',
    bgVar: '--token-rescheduled-bg',
    textVar: '--token-rescheduled-text',
    borderVar: '--token-rescheduled-border',
    glowVar: '--token-rescheduled-glow',
  },
  'voice': {
    icon: Phone,
    label: 'Voice',
    bgVar: '--token-voice-bg',
    textVar: '--token-voice-text',
    borderVar: '--token-voice-border',
    glowVar: '--token-voice-glow',
  },
  'paid': {
    icon: DollarSign,
    label: 'Paid',
    bgVar: '--token-intake-missing-bg',
    textVar: '--token-intake-missing-text',
    borderVar: '--token-intake-missing-border',
    glowVar: '--token-intake-missing-glow',
  },
  'no-show': {
    icon: X,
    label: 'No-show',
    bgVar: '--status-error-bg',
    textVar: '--status-error-text',
    borderVar: '--status-error-border',
    glowVar: 'rgba(220, 38, 38, 0.15)',
  },
};

export function StatusToken({ 
  type, 
  label, 
  interactive = false, 
  onClick, 
  pulse = false,
  readOnly = false,
}: StatusTokenProps) {
  const config = statusConfig[type];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const Component = interactive ? 'button' : 'span';

  return (
    <Component
      onClick={interactive ? onClick : undefined}
      disabled={readOnly}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1.5 
        rounded-md border transition-all duration-150
        ${interactive && !readOnly ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}
      `}
      style={{
        backgroundColor: `var(${config.bgVar})`,
        color: `var(${config.textVar})`,
        borderColor: `var(${config.borderVar})`,
        boxShadow: `0 0 12px var(${config.glowVar})`,
      }}
    >
      <Icon className={`w-3.5 h-3.5 ${pulse ? 'animate-pulse' : ''}`} />
      <span className="text-sm font-medium">{displayLabel}</span>
      
      {pulse && type === 'voice' && (
        <span className="relative flex h-2 w-2 ml-0.5">
          <span 
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: `var(${config.textVar})` }}
          />
          <span 
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: `var(${config.textVar})` }}
          />
        </span>
      )}
    </Component>
  );
}
