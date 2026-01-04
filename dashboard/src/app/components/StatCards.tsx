import { Calendar, CheckCheck, CircleAlert, FileText, Clock } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCard {
  id: string;
  label: string;
  value: number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

interface StatCardsProps {
  stats: StatCard[];
  onCardClick?: (id: string) => void;
  activeFilter?: string;
}

export function StatCards({ stats, onCardClick, activeFilter }: StatCardsProps) {
  const getVariantStyles = (variant: string = 'default', isActive: boolean) => {
    if (isActive) {
      return {
        default: {
          backgroundColor: 'var(--accent-primary-bg)',
          borderColor: 'var(--accent-primary)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
        success: {
          backgroundColor: 'var(--status-success-bg)',
          borderColor: 'var(--status-success)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
        warning: {
          backgroundColor: 'var(--status-warning-bg)',
          borderColor: 'var(--status-warning)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
        info: {
          backgroundColor: 'var(--status-info-bg)',
          borderColor: 'var(--status-info)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      }[variant];
    }

    return {
      backgroundColor: 'var(--surface-card)',
      borderColor: 'var(--border-default)',
    };
  };

  const getIconColor = (variant: string = 'default', isActive: boolean) => {
    if (isActive) {
      return {
        default: 'var(--accent-primary)',
        success: 'var(--status-success)',
        warning: 'var(--status-warning)',
        info: 'var(--status-info)',
      }[variant];
    }

    return 'var(--text-muted)';
  };

  const getValueColor = (variant: string = 'default', isActive: boolean) => {
    if (isActive) {
      return {
        default: 'var(--accent-primary-text)',
        success: 'var(--status-success-text)',
        warning: 'var(--status-warning-text)',
        info: 'var(--status-info-text)',
      }[variant];
    }

    return 'var(--text-primary)';
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isActive = activeFilter === stat.id;
        const baseStyles = getVariantStyles(stat.variant, isActive);

        return (
          <button
            key={stat.id}
            onClick={() => onCardClick?.(stat.id)}
            className="p-5 border rounded-xl text-left transition-all duration-200"
            style={baseStyles}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'var(--border-default)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <Icon className="w-5 h-5" style={{ color: getIconColor(stat.variant, isActive) }} />
            </div>
            <div className="text-3xl mb-1" style={{ color: getValueColor(stat.variant, isActive) }}>
              {stat.value}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
          </button>
        );
      })}
    </div>
  );
}

// Preset stat cards for dashboard
export function createDashboardStats(data: {
  total: number;
  confirmed: number;
  needsConfirmation: number;
  missingIntake: number;
  reschedules: number;
}): StatCard[] {
  return [
    {
      id: 'all',
      label: 'Appointments today',
      value: data.total,
      icon: Calendar,
      variant: 'default',
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      value: data.confirmed,
      icon: CheckCheck,
      variant: 'success',
    },
    {
      id: 'needs-confirmation',
      label: 'Needs confirmation',
      value: data.needsConfirmation,
      icon: CircleAlert,
      variant: 'warning',
    },
    {
      id: 'missing-intake',
      label: 'Missing intake',
      value: data.missingIntake,
      icon: FileText,
      variant: 'info',
    },
    {
      id: 'reschedules',
      label: 'Reschedules',
      value: data.reschedules,
      icon: Clock,
      variant: 'default',
    },
  ];
}
