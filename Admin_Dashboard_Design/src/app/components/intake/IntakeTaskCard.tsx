import React from 'react';
import { Phone, Mail, MessageSquare, Clock } from 'lucide-react';
import { Button } from '../foundation/Button';

type IntakeStatus = 'not-started' | 'in-progress' | 'submitted' | 'overdue';
type OutreachChannel = 'sms' | 'call' | 'email' | null;

interface IntakeTaskCardProps {
  patientName: string;
  appointmentTime: string;
  provider: string;
  visitType: string;
  status: IntakeStatus;
  progress?: number; // 0-100 for in-progress
  lastOutreach?: {
    channel: OutreachChannel;
    timeAgo: string;
    attempts: number;
  };
  onAction: () => void;
  onClick?: () => void;
}

export function IntakeTaskCard({
  patientName,
  appointmentTime,
  provider,
  visitType,
  status,
  progress = 0,
  lastOutreach,
  onAction,
  onClick,
}: IntakeTaskCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'submitted':
        return 'var(--cf-success)';
      case 'in-progress':
        return 'var(--cf-info)';
      case 'overdue':
        return 'var(--cf-error)';
      default:
        return 'var(--cf-warning)';
    }
  };

  const getActionLabel = () => {
    switch (status) {
      case 'submitted':
        return 'View intake';
      case 'in-progress':
        return 'Remind patient';
      case 'overdue':
        return 'Call via AI';
      default:
        return 'Send intake link';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getOutreachIcon = (channel: OutreachChannel) => {
    switch (channel) {
      case 'sms':
        return MessageSquare;
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      default:
        return null;
    }
  };

  const OutreachIcon = lastOutreach?.channel ? getOutreachIcon(lastOutreach.channel) : null;
  const statusColor = getStatusColor();
  const isUrgent = status === 'overdue';

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-[18px] p-5 transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${isUrgent ? 'animate-pulse-subtle' : ''}
      `}
      style={{
        backgroundColor: 'var(--surface-card)',
        boxShadow: '0px 2px 8px rgba(30, 41, 59, 0.04)',
        border: isUrgent ? '1px solid rgba(224, 122, 95, 0.2)' : '1px solid var(--border-subtle)',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0px 4px 12px rgba(30, 41, 59, 0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0px 2px 8px rgba(30, 41, 59, 0.04)';
        }
      }}
    >
      <div className="flex items-center gap-5">
        {/* Patient Identity */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar with progress ring */}
          <div className="relative flex-shrink-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-medium text-sm"
              style={{
                backgroundColor: 'var(--surface-primary)',
                color: 'var(--text-secondary)',
              }}
            >
              {getInitials(patientName)}
            </div>
            {/* Progress ring */}
            {status === 'in-progress' && (
              <svg
                className="absolute inset-0 -rotate-90"
                width="48"
                height="48"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="2"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke={statusColor}
                  strokeWidth="2"
                  strokeDasharray={`${(progress / 100) * 138} 138`}
                  strokeLinecap="round"
                />
              </svg>
            )}
            {/* Status indicator dot */}
            {status !== 'in-progress' && (
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{
                  backgroundColor: statusColor,
                  borderColor: 'var(--surface-card)',
                }}
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {patientName}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Phone className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
              <MessageSquare className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        {/* Appointment Context */}
        <div className="flex-shrink-0 min-w-[160px]">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5" style={{ color: isUrgent ? 'var(--cf-error)' : 'var(--text-muted)' }} />
            <span
              className="text-sm font-medium"
              style={{ color: isUrgent ? 'var(--cf-error)' : 'var(--text-primary)' }}
            >
              {appointmentTime}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {provider} · {visitType}
          </p>
        </div>

        {/* Last Outreach */}
        {lastOutreach && OutreachIcon && (
          <div className="flex items-center gap-2 flex-shrink-0 min-w-[100px]">
            <OutreachIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {lastOutreach.timeAgo}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {lastOutreach.attempts} {lastOutreach.attempts === 1 ? 'attempt' : 'attempts'}
              </p>
            </div>
          </div>
        )}

        {/* Action */}
        <div className="flex-shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
          >
            {getActionLabel()}
          </Button>
        </div>
      </div>
    </div>
  );
}
