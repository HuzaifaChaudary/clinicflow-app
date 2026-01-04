import { Phone, MessageSquare, Video, Clock } from 'lucide-react';

interface AppointmentCardProps {
  patientName: string;
  provider: string;
  visitType: 'in-clinic' | 'virtual';
  time: string;
  duration: number;
  confirmed: boolean;
  isHovered: boolean;
  isRecentlyUpdated: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  onActionClick?: (action: 'call' | 'message' | 'join') => void;
}

export function AppointmentCard({
  patientName,
  provider,
  visitType,
  time,
  duration,
  confirmed,
  isHovered,
  isRecentlyUpdated,
  isDimmed,
  onHover,
  onLeave,
  onClick,
  onActionClick,
}: AppointmentCardProps) {
  const visitTypeColor = visitType === 'virtual' ? '#5B8DEF' : '#34C759';
  
  const getDoctorInitials = (providerName: string): string => {
    const names = providerName.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  return (
    <div
      className={`h-full rounded-xl overflow-hidden cursor-pointer motion-state relative ${
        isRecentlyUpdated ? 'animate-highlight-pulse' : ''
      }`}
      style={{
        backgroundColor: 'var(--surface-card)',
        boxShadow: isHovered ? 'var(--shadow-2)' : 'var(--shadow-1)',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        opacity: isDimmed ? 0.6 : 1,
        transition: 'all 0.2s ease',
        border: '1px solid var(--border-default)',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Vertical colored line - full height, rounded */}
      <div
        className="absolute left-0 top-0 bottom-0 rounded-l-xl"
        style={{
          width: '5px',
          backgroundColor: visitTypeColor,
          boxShadow: isHovered ? `0 0 12px ${visitTypeColor}66` : 'none',
        }}
      />

      <div className="p-4 h-full flex flex-col pl-5">
        {/* Header with patient name and visit type label */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <div 
                className="font-semibold truncate"
                style={{ 
                  color: 'var(--text-primary)',
                }}
              >
                {patientName}
              </div>
              {/* Visit type inline label */}
              <span
                className="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `${visitTypeColor}15`,
                  color: visitTypeColor,
                }}
              >
                {visitType === 'virtual' ? 'Video' : 'In clinic'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                {provider}
              </div>
              {/* Doctor initials badge */}
              <div
                className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold shrink-0"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {getDoctorInitials(provider)}
              </div>
            </div>
          </div>

          {/* Confirmation status indicator */}
          {!confirmed && (
            <div
              className="px-2 py-1 rounded text-xs font-medium shrink-0"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                color: 'var(--status-warning)',
              }}
            >
              Unconfirmed
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm mb-auto" style={{ color: 'var(--text-muted)' }}>
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{time}</span>
          <span>•</span>
          <span>{duration} min</span>
        </div>

        {/* Quick Actions (Hover State) */}
        {isHovered && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t animate-fade-in" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium motion-hover"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.('call');
              }}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </button>

            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium motion-hover"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.('message');
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Msg</span>
            </button>

            {visitType === 'virtual' && (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium motion-hover"
                style={{
                  backgroundColor: `${visitTypeColor}15`,
                  color: visitTypeColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${visitTypeColor}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${visitTypeColor}15`;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick?.('join');
                }}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
