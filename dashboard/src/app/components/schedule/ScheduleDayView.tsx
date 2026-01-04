import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Video, User, Filter, AlertCircle } from 'lucide-react';
import { Appointment } from '../AppointmentRow';
import { TimeGridAxis } from './TimeGridAxis';
import { DoctorColumn } from './DoctorColumn';
import { VisitSummaryStrip } from './VisitSummaryStrip';
import { NeedsAttentionSlideOver } from './NeedsAttentionSlideOver';

interface ScheduleDayViewProps {
  appointments: Appointment[];
  onAppointmentClick?: (id: string) => void;
  date?: Date;
  startHour?: number;
  endHour?: number;
}

export function ScheduleDayView({
  appointments,
  onAppointmentClick,
  date = new Date(),
  startHour = 8,
  endHour = 18,
}: ScheduleDayViewProps) {
  const [selectedVisitType, setSelectedVisitType] = useState<'all' | 'virtual' | 'in-clinic'>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [isNeedsAttentionOpen, setIsNeedsAttentionOpen] = useState(false);

  // Get unique providers (doctors)
  const providers = useMemo(() => {
    const uniqueProviders = Array.from(new Set(appointments.map(apt => apt.provider))).sort();
    return uniqueProviders;
  }, [appointments]);

  // Group appointments by provider
  const appointmentsByProvider = useMemo(() => {
    const grouped = new Map<string, Appointment[]>();
    
    providers.forEach(provider => {
      const providerAppts = appointments.filter(apt => {
        const matchesProvider = apt.provider === provider;
        const matchesVisitType = selectedVisitType === 'all' || apt.visitType === selectedVisitType;
        return matchesProvider && matchesVisitType;
      });
      grouped.set(provider, providerAppts);
    });

    return grouped;
  }, [appointments, providers, selectedVisitType]);

  // Detect conflicts (same doctor, overlapping times)
  const conflicts = useMemo(() => {
    const conflictIds = new Set<string>();

    providers.forEach(provider => {
      const providerAppts = appointmentsByProvider.get(provider) || [];
      
      // Sort by time for easier conflict detection
      const sorted = [...providerAppts].sort((a, b) => {
        const parseTime = (time: string) => {
          const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (!match) return 0;
          let hour = parseInt(match[1]);
          const minute = parseInt(match[2]);
          const period = match[3].toUpperCase();
          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;
          return hour * 60 + minute;
        };
        return parseTime(a.time) - parseTime(b.time);
      });

      // Check for overlaps
      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];
        
        // Simple overlap check (would need actual duration data for precision)
        if (current.time === next.time) {
          conflictIds.add(current.id);
          conflictIds.add(next.id);
        }
      }
    });

    return conflictIds;
  }, [providers, appointmentsByProvider]);

  // Filter providers if needed
  const displayedProviders = selectedProvider === 'all' 
    ? providers 
    : providers.filter(p => p === selectedProvider);

  // Format date for header
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePreviousDay = () => {
    // Would integrate with parent date state
    console.log('Previous day');
  };

  const handleNextDay = () => {
    // Would integrate with parent date state
    console.log('Next day');
  };

  // Calculate visit summary stats
  const visitStats = useMemo(() => {
    const total = appointments.length;
    const inClinic = appointments.filter(apt => apt.visitType === 'in-clinic').length;
    const video = appointments.filter(apt => apt.visitType === 'virtual').length;
    return { total, inClinic, video };
  }, [appointments]);

  // Calculate needs attention count
  const needsAttentionCount = useMemo(() => {
    return appointments.filter(apt => !apt.status.confirmed || !apt.status.intakeComplete).length;
  }, [appointments]);

  // Action handlers for the needs attention panel
  const handleCall = (appointmentId: string) => {
    console.log('Calling patient:', appointmentId);
    // Would trigger phone call integration
  };

  const handleReEnrollAI = (appointmentId: string) => {
    console.log('Re-enrolling in AI sequence:', appointmentId);
    // Would trigger AI voice + text confirmation flow
  };

  const handleSendIntake = (appointmentId: string) => {
    console.log('Sending intake form:', appointmentId);
    // Would send SMS with intake link
  };

  const handleViewProfile = (appointmentId: string) => {
    console.log('Viewing patient profile:', appointmentId);
    onAppointmentClick?.(appointmentId);
    setIsNeedsAttentionOpen(false);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Date navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousDay}
                className="w-8 h-8 rounded-lg flex items-center justify-center motion-hover"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  border: '1px solid var(--border-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                }}
              >
                <ChevronLeft className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
              
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formattedDate}
              </h2>

              <button
                onClick={handleNextDay}
                className="w-8 h-8 rounded-lg flex items-center justify-center motion-hover"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  border: '1px solid var(--border-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                }}
              >
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Center: Visit type legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5B8DEF' }} />
              <Video className="w-3.5 h-3.5" style={{ color: '#5B8DEF' }} />
              <span>Video consultation</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#34C759' }} />
              <User className="w-3.5 h-3.5" style={{ color: '#34C759' }} />
              <span>In-clinic visit</span>
            </div>
          </div>

          {/* Right: Filters */}
          <div className="flex items-center gap-3">
            {/* Needs Attention Button */}
            {needsAttentionCount > 0 && (
              <button
                onClick={() => setIsNeedsAttentionOpen(true)}
                className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 motion-hover relative"
                style={{
                  backgroundColor: 'var(--status-warning-bg)',
                  border: '1.5px solid var(--status-warning)',
                  color: 'var(--status-warning)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(242, 166, 90, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Needs attention</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--status-warning)',
                    color: 'white',
                  }}
                >
                  {needsAttentionCount}
                </div>
              </button>
            )}

            {/* Visit type filter */}
            <select
              value={selectedVisitType}
              onChange={(e) => setSelectedVisitType(e.target.value as any)}
              className="px-3 py-2 rounded-lg text-sm font-medium border motion-hover"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="all">All visits</option>
              <option value="virtual">Video only</option>
              <option value="in-clinic">In-clinic only</option>
            </select>

            {/* Provider filter (for 6+ doctors) */}
            {providers.length >= 6 && (
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm font-medium border motion-hover"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="all">All providers ({providers.length})</option>
                {providers.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Visit Summary Strip */}
      <VisitSummaryStrip
        totalVisits={visitStats.total}
        inClinicCount={visitStats.inClinic}
        videoCount={visitStats.video}
      />

      {/* Schedule grid */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-h-full">
          {/* Time axis (sticky left) */}
          <TimeGridAxis startHour={startHour} endHour={endHour} />

          {/* Doctor columns (horizontal scroll) */}
          <div className="flex flex-1 overflow-x-auto">
            {displayedProviders.map(provider => (
              <DoctorColumn
                key={provider}
                doctorName={provider}
                appointments={appointmentsByProvider.get(provider) || []}
                onAppointmentClick={onAppointmentClick}
                startHour={startHour}
                endHour={endHour}
                conflicts={conflicts}
              />
            ))}

            {/* Empty state for no providers */}
            {displayedProviders.length === 0 && (
              <div 
                className="flex-1 flex items-center justify-center"
                style={{ color: 'var(--text-muted)' }}
              >
                <div className="text-center">
                  <Filter className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No appointments match the selected filters</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info footer (shows when conflicts detected) */}
      {conflicts.size > 0 && (
        <div
          className="px-6 py-3 border-t flex items-center gap-2 text-sm"
          style={{
            backgroundColor: 'var(--status-error-bg)',
            borderColor: 'var(--status-error)',
            color: 'var(--status-error)',
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-error)' }} />
          <span className="font-semibold">
            {conflicts.size} scheduling conflict{conflicts.size !== 1 ? 's' : ''} detected
          </span>
          <span className="opacity-75">• Review overlapping appointments</span>
        </div>
      )}

      {/* Needs Attention Slide-Over Panel */}
      <NeedsAttentionSlideOver
        appointments={appointments}
        isOpen={isNeedsAttentionOpen}
        onClose={() => setIsNeedsAttentionOpen(false)}
        onCall={handleCall}
        onReEnrollAI={handleReEnrollAI}
        onSendIntake={handleSendIntake}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
}