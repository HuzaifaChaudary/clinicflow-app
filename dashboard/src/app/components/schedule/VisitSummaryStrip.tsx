import { Video, User, Calendar } from 'lucide-react';

interface VisitSummaryStripProps {
  totalVisits: number;
  inClinicCount: number;
  videoCount: number;
}

export function VisitSummaryStrip({ 
  totalVisits, 
  inClinicCount, 
  videoCount 
}: VisitSummaryStripProps) {
  return (
    <div 
      className="px-6 py-3 border-b flex items-center gap-6"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Total visits */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'var(--accent-primary-bg)',
            border: '1px solid var(--accent-primary)',
          }}
        >
          <Calendar className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {totalVisits}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            total visits
          </span>
        </div>
      </div>

      <div className="w-px h-6" style={{ backgroundColor: 'var(--border-default)' }} />

      {/* In-clinic visits */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(52, 199, 89, 0.1)',
            border: '1px solid #34C759',
          }}
        >
          <User className="w-4 h-4" style={{ color: '#34C759' }} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {inClinicCount}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            in-clinic
          </span>
        </div>
      </div>

      <div className="w-px h-6" style={{ backgroundColor: 'var(--border-default)' }} />

      {/* Video consultations */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(91, 141, 239, 0.1)',
            border: '1px solid #5B8DEF',
          }}
        >
          <Video className="w-4 h-4" style={{ color: '#5B8DEF' }} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {videoCount}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            video
          </span>
        </div>
      </div>
    </div>
  );
}
