import { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Phone, 
  ChevronRight,
  ChevronDown,
  Clock,
  User,
  PhoneCall,
  RotateCcw,
  Bell
} from 'lucide-react';
import { Appointment } from '../components/AppointmentRow';

interface AdminDashboardPageV2Props {
  appointments: Appointment[];
  onConfirm: (id: string) => void;
  onMarkArrived: (id: string) => void;
  onMarkNoShow: (id: string) => void;
  onNavigate?: (page: string) => void;
  onOpenPatient?: (id: string) => void;
}

interface ActivityItem {
  id: string;
  type: 'voice' | 'intake' | 'reschedule' | 'arrival';
  timestamp: string;
  description: string;
  patientName: string;
}

const mockWeeklyData = [
  { day: 'Mon', rate: 78 },
  { day: 'Tue', rate: 82 },
  { day: 'Wed', rate: 85 },
  { day: 'Thu', rate: 79 },
  { day: 'Fri', rate: 88 },
  { day: 'Sat', rate: 75 },
  { day: 'Sun', rate: 72 },
];

const mockNoShowData = [
  { week: 'W1', count: 1, cause: 'Weather delays', previousWeekCount: 2 },
  { week: 'W2', count: 3, cause: 'Mostly unconfirmed', previousWeekCount: 1 },
  { week: 'W3', count: 5, cause: 'System issues', previousWeekCount: 3 },
  { week: 'W4', count: 2, cause: 'Transportation', previousWeekCount: 5 },
];

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'voice',
    timestamp: '2 min ago',
    description: 'Confirmation call completed',
    patientName: 'Sarah Martinez',
  },
  {
    id: '2',
    type: 'intake',
    timestamp: '8 min ago',
    description: 'Intake form submitted',
    patientName: 'Michael Brown',
  },
  {
    id: '3',
    type: 'reschedule',
    timestamp: '15 min ago',
    description: 'Appointment rescheduled',
    patientName: 'Emily Johnson',
  },
  {
    id: '4',
    type: 'arrival',
    timestamp: '22 min ago',
    description: 'Patient checked in',
    patientName: 'James Wilson',
  },
  {
    id: '5',
    type: 'voice',
    timestamp: '34 min ago',
    description: 'Voicemail left',
    patientName: 'Lisa Anderson',
  },
];

export function AdminDashboardPageV2({
  appointments,
  onConfirm,
  onMarkArrived,
  onMarkNoShow,
  onNavigate,
  onOpenPatient,
}: AdminDashboardPageV2Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7D' | '14D' | '30D'>('7D');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [expandedActivity, setExpandedActivity] = useState(false);
  const [noShowTimeRange, setNoShowTimeRange] = useState<'7days' | '4weeks' | '3months'>('4weeks');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const confirmedCount = appointments.filter((a) => a.status.confirmed).length;
  const unconfirmedCount = appointments.filter((a) => !a.status.confirmed).length;
  const missingIntakeCount = appointments.filter((a) => !a.status.intakeComplete).length;
  const voiceCallsCount = appointments.filter((a) => a.indicators?.voiceCallSent).length;
  
  const needsAttention = appointments
    .filter((a) => !a.status.confirmed || !a.status.intakeComplete)
    .slice(0, 5);

  const todaySchedule = appointments.slice(0, 8);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'voice':
        return <PhoneCall className="w-4 h-4" />;
      case 'intake':
        return <FileText className="w-4 h-4" />;
      case 'reschedule':
        return <RotateCcw className="w-4 h-4" />;
      case 'arrival':
        return <User className="w-4 h-4" />;
    }
  };

  const handleCardClick = (type: string) => {
    switch (type) {
      case 'appointments':
        onNavigate?.('schedule');
        break;
      case 'confirmed':
        onNavigate?.('schedule');
        break;
      case 'unconfirmed':
        // Navigate to unconfirmed action page
        break;
      case 'intake':
        onNavigate?.('intake-forms');
        break;
      case 'voice':
        onNavigate?.('voice');
        break;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Main Content */}
      <div className="p-8 max-w-[1800px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Today</span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Wednesday, January 1, 2025
            </span>
          </div>
        </div>

        {/* Section 1: Top Action Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {/* Appointments Card */}
          <button
            onClick={() => handleCardClick('appointments')}
            onMouseEnter={() => setHoveredCard('appointments')}
            onMouseLeave={() => setHoveredCard(null)}
            className="text-left p-5 rounded-2xl transition-all duration-200"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              boxShadow: hoveredCard === 'appointments' ? 'var(--shadow-2)' : 'var(--shadow-1)',
              transform: hoveredCard === 'appointments' ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  color: 'var(--accent-primary)',
                }}
              >
                <Calendar className="w-5 h-5" />
              </div>
              <ChevronRight
                className="w-4 h-4"
                style={{
                  color: 'var(--text-muted)',
                  opacity: hoveredCard === 'appointments' ? 1 : 0.5,
                }}
              />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--text-primary)' }} className="mb-1">
              {appointments.length}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Appointments
            </div>
          </button>

          {/* Confirmed Card */}
          <button
            onClick={() => handleCardClick('confirmed')}
            onMouseEnter={() => setHoveredCard('confirmed')}
            onMouseLeave={() => setHoveredCard(null)}
            className="text-left p-5 rounded-2xl transition-all duration-200"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              boxShadow: hoveredCard === 'confirmed' ? 'var(--shadow-2)' : 'var(--shadow-1)',
              transform: hoveredCard === 'confirmed' ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  backgroundColor: 'var(--status-info-bg)',
                  color: 'var(--accent-primary)',
                }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <ChevronRight
                className="w-4 h-4"
                style={{
                  color: 'var(--text-muted)',
                  opacity: hoveredCard === 'confirmed' ? 1 : 0.5,
                }}
              />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--text-primary)' }} className="mb-1">
              {confirmedCount}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Confirmed
            </div>
          </button>

          {/* Unconfirmed Card - With urgency */}
          <button
            onClick={() => handleCardClick('unconfirmed')}
            onMouseEnter={() => setHoveredCard('unconfirmed')}
            onMouseLeave={() => setHoveredCard(null)}
            className="text-left p-5 rounded-2xl transition-all duration-200 relative overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--status-warning)',
              boxShadow: hoveredCard === 'unconfirmed' ? 'var(--shadow-2)' : 'var(--shadow-1)',
              transform: hoveredCard === 'unconfirmed' ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            {/* Subtle warm tint overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                opacity: 0.3,
              }}
            />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{
                      backgroundColor: 'var(--status-warning-bg)',
                      color: 'var(--status-warning)',
                    }}
                  >
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  {/* Animated attention dot */}
                  <div className="relative">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--status-warning)' }}
                    />
                    <div
                      className="absolute inset-0 rounded-full animate-ping-slow"
                      style={{ backgroundColor: 'var(--status-warning)' }}
                    />
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4"
                  style={{
                    color: 'var(--status-warning)',
                    opacity: hoveredCard === 'unconfirmed' ? 1 : 0.7,
                  }}
                />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--status-warning)' }} className="mb-1">
                {unconfirmedCount}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Unconfirmed
              </div>
            </div>
          </button>

          {/* Missing Intake Card - With urgency */}
          <button
            onClick={() => handleCardClick('intake')}
            onMouseEnter={() => setHoveredCard('intake')}
            onMouseLeave={() => setHoveredCard(null)}
            className="text-left p-5 rounded-2xl transition-all duration-200 relative overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--status-warning)',
              boxShadow: hoveredCard === 'intake' ? 'var(--shadow-2)' : 'var(--shadow-1)',
              transform: hoveredCard === 'intake' ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            {/* Subtle warm tint overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: 'var(--status-warning-bg)',
                opacity: 0.3,
              }}
            />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{
                      backgroundColor: 'var(--status-warning-bg)',
                      color: 'var(--status-warning)',
                    }}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  {/* Animated attention dot */}
                  <div className="relative">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--status-warning)' }}
                    />
                    <div
                      className="absolute inset-0 rounded-full animate-ping-slow"
                      style={{ backgroundColor: 'var(--status-warning)' }}
                    />
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4"
                  style={{
                    color: 'var(--status-warning)',
                    opacity: hoveredCard === 'intake' ? 1 : 0.7,
                  }}
                />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--status-warning)' }} className="mb-1">
                {missingIntakeCount}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Missing Intake
              </div>
            </div>
          </button>

          {/* Voice Calls Card */}
          <button
            onClick={() => handleCardClick('voice')}
            onMouseEnter={() => setHoveredCard('voice')}
            onMouseLeave={() => setHoveredCard(null)}
            className="text-left p-5 rounded-2xl transition-all duration-200"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              boxShadow: hoveredCard === 'voice' ? 'var(--shadow-2)' : 'var(--shadow-1)',
              transform: hoveredCard === 'voice' ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  color: 'var(--accent-primary)',
                }}
              >
                <Phone className="w-5 h-5" />
              </div>
              <ChevronRight
                className="w-4 h-4"
                style={{
                  color: 'var(--text-muted)',
                  opacity: hoveredCard === 'voice' ? 1 : 0.5,
                }}
              />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--text-primary)' }} className="mb-1">
              {voiceCallsCount}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Voice Calls
            </div>
          </button>
        </div>

        {/* Section 2: Analytics Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Card A: Weekly Confirmation Rate */}
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: 'var(--text-primary)' }}>Weekly Confirmation Rate</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPeriod('7D')}
                  className="px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: selectedPeriod === '7D' ? 'var(--accent-primary)' : 'var(--surface-canvas)',
                    color: selectedPeriod === '7D' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  7D
                </button>
                <button
                  onClick={() => setSelectedPeriod('14D')}
                  className="px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: selectedPeriod === '14D' ? 'var(--accent-primary)' : 'var(--surface-canvas)',
                    color: selectedPeriod === '14D' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  14D
                </button>
                <button
                  onClick={() => setSelectedPeriod('30D')}
                  className="px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: selectedPeriod === '30D' ? 'var(--accent-primary)' : 'var(--surface-canvas)',
                    color: selectedPeriod === '30D' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  30D
                </button>
              </div>
            </div>

            {/* Line Chart */}
            <div className="relative h-48">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={40 * i}
                    x2="400"
                    y2={40 * i}
                    stroke="var(--border-subtle)"
                    strokeWidth="1"
                  />
                ))}

                {/* Area fill */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d={`M 0 ${160 - mockWeeklyData[0].rate} ${mockWeeklyData
                    .map((d, i) => `L ${(i * 400) / 6} ${160 - d.rate}`)
                    .join(' ')} L ${400} 160 L 0 160 Z`}
                  fill="url(#chartGradient)"
                />

                {/* Line */}
                <path
                  d={`M 0 ${160 - mockWeeklyData[0].rate} ${mockWeeklyData
                    .map((d, i) => `L ${(i * 400) / 6} ${160 - d.rate}`)
                    .join(' ')}`}
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(91, 141, 239, 0.4))',
                  }}
                />

                {/* Points */}
                {mockWeeklyData.map((d, i) => (
                  <circle
                    key={i}
                    cx={(i * 400) / 6}
                    cy={160 - d.rate}
                    r="4"
                    fill="var(--accent-primary)"
                    stroke="var(--surface-card)"
                    strokeWidth="2"
                  />
                ))}
              </svg>

              {/* Labels */}
              <div className="flex justify-between mt-2">
                {mockWeeklyData.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      textAlign: 'center',
                      width: `${100 / mockWeeklyData.length}%`,
                    }}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card B: No-Show Trend - Redesigned */}
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            {/* Header with subtext and dropdown */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 style={{ color: 'var(--text-primary)' }} className="mb-1">No-Show Trend</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Track missed appointments over time
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNoShowTimeRange('7days')}
                  className="px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: noShowTimeRange === '7days' ? 'var(--accent-primary)' : 'var(--surface-canvas)',
                    color: noShowTimeRange === '7days' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  7D
                </button>
                <button
                  onClick={() => setNoShowTimeRange('4weeks')}
                  className="px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: noShowTimeRange === '4weeks' ? 'var(--accent-primary)' : 'var(--surface-canvas)',
                    color: noShowTimeRange === '4weeks' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  4W
                </button>
                <button
                  onClick={() => setNoShowTimeRange('3months')}
                  className="px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: noShowTimeRange === '3months' ? 'var(--accent-primary)' : 'var(--surface-canvas)',
                    color: noShowTimeRange === '3months' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  3M
                </button>
              </div>
            </div>

            {/* Bar Chart with darker plotting area */}
            <div
              className="relative p-6 rounded-xl mt-5"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                minHeight: '240px',
              }}
            >
              {/* Grid lines layer (bottom) */}
              <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
                <div className="relative w-full h-full">
                  {/* Horizontal dashed grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <div
                      key={value}
                      className="absolute w-full border-t"
                      style={{
                        top: `${(value / 5) * 100}%`,
                        borderColor: 'var(--border-subtle)',
                        borderStyle: 'dashed',
                        opacity: 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Y-axis labels (left side) */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-2 pr-3">
                {[5, 4, 3, 2, 1, 0].map((value) => (
                  <div
                    key={value}
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      textAlign: 'right',
                      lineHeight: '1',
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>

              {/* Bars container (above grid lines) */}
              <div className="relative ml-10 flex items-end justify-around gap-8" style={{ height: '180px' }}>
                {mockNoShowData.map((d, i) => {
                  // Height scaling: max value (5) = 160px
                  const maxValue = 5;
                  const maxHeight = 160;
                  const barHeight = (d.count / maxValue) * maxHeight;
                  
                  // Color based on severity (solid, no opacity)
                  let barColor: string;
                  if (d.count <= 1) {
                    barColor = '#6B8CFF'; // Soft Blue
                  } else if (d.count <= 3) {
                    barColor = '#F4A261'; // Amber
                  } else {
                    barColor = '#E76F51'; // Soft Red
                  }

                  // Calculate % change from previous week
                  const change =
                    d.previousWeekCount > 0
                      ? Math.round(((d.count - d.previousWeekCount) / d.previousWeekCount) * 100)
                      : 0;

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-1 relative"
                      style={{ height: '100%' }}
                    >
                      {/* Data label above bar */}
                      <div
                        className="absolute transition-all duration-200"
                        style={{
                          bottom: `calc(100% - ${180 - barHeight}px + 8px)`,
                          fontSize: '14px',
                          fontWeight: '600',
                          color: barColor,
                        }}
                      >
                        {d.count}
                      </div>

                      {/* Bar itself - positioned at bottom */}
                      <button
                        className="absolute bottom-0 rounded-t-xl transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}
                        onClick={() => console.log(`Navigate to no-shows for ${d.week}`)}
                        style={{
                          width: '44px',
                          height: `${barHeight}px`,
                          backgroundColor: barColor,
                          boxShadow:
                            hoveredBar === i
                              ? `0 4px 16px ${barColor}66`
                              : `0 2px 4px ${barColor}33`,
                          transform: hoveredBar === i ? 'translateY(-4px)' : 'translateY(0)',
                        }}
                      >
                        {/* Tooltip */}
                        {hoveredBar === i && (
                          <div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 rounded-lg whitespace-nowrap z-20"
                            style={{
                              backgroundColor: 'var(--text-primary)',
                              color: 'var(--text-inverse)',
                              boxShadow: 'var(--shadow-2)',
                            }}
                          >
                            <div style={{ fontSize: '13px', fontWeight: '600' }} className="mb-1">
                              {d.week}: {d.count} no-shows
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.9 }} className="mb-1">
                              {d.cause}
                            </div>
                            {d.previousWeekCount > 0 && (
                              <div
                                style={{
                                  fontSize: '11px',
                                  opacity: 0.8,
                                  color: change > 0 ? '#ffcccc' : '#ccffcc',
                                }}
                              >
                                {change > 0 ? '+' : ''}
                                {change}% vs prev week
                              </div>
                            )}
                          </div>
                        )}
                      </button>

                      {/* X-axis label */}
                      <div
                        className="absolute transition-colors duration-200"
                        style={{
                          bottom: '-28px',
                          fontSize: '13px',
                          color: hoveredBar === i ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: hoveredBar === i ? '600' : '500',
                        }}
                      >
                        {d.week}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4: Today's Schedule + Needs Attention */}
        <div className="grid grid-cols-[1fr_380px] gap-6 mb-8">
          {/* Today's Schedule */}
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <h3 style={{ color: 'var(--text-primary)' }} className="mb-5">
              Today's Schedule
            </h3>

            <div className="space-y-2">
              {todaySchedule.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onOpenPatient?.(apt.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-150 text-left"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Time */}
                  <div className="flex items-center gap-2 w-24">
                    <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      {apt.time}
                    </span>
                  </div>

                  {/* Patient */}
                  <div className="flex-1">
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>
                      {apt.patientName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {apt.provider}
                    </div>
                  </div>

                  {/* Status Chips */}
                  <div className="flex items-center gap-2">
                    {/* Confirmed */}
                    <div
                      className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
                      style={{
                        backgroundColor: apt.status.confirmed
                          ? 'var(--status-info-bg)'
                          : 'var(--status-warning-bg)',
                        fontSize: '12px',
                        color: apt.status.confirmed ? 'var(--accent-primary)' : 'var(--status-warning)',
                      }}
                    >
                      {apt.status.confirmed ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{apt.status.confirmed ? 'Confirmed' : 'Unconfirmed'}</span>
                    </div>

                    {/* Intake */}
                    <div
                      className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
                      style={{
                        backgroundColor: apt.status.intakeComplete
                          ? 'var(--status-info-bg)'
                          : 'var(--surface-canvas)',
                        fontSize: '12px',
                        color: apt.status.intakeComplete ? 'var(--accent-primary)' : 'var(--text-muted)',
                      }}
                    >
                      <FileText className="w-3 h-3" />
                      <span>Intake</span>
                    </div>

                    {/* Voice */}
                    {apt.indicators?.voiceCallSent && (
                      <div
                        className="p-1.5 rounded-full"
                        style={{
                          backgroundColor: 'var(--surface-canvas)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        <PhoneCall className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Needs Attention Panel */}
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ color: 'var(--text-primary)' }}>Needs Attention</h3>
              <div
                className="px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: 'var(--status-warning-bg)',
                  fontSize: '12px',
                  color: 'var(--status-warning)',
                  fontWeight: '600',
                }}
              >
                {needsAttention.length}
              </div>
            </div>

            <div className="space-y-3">
              {needsAttention.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onOpenPatient?.(apt.id)}
                  className="w-full p-3 rounded-xl transition-all duration-150 text-left relative"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                    e.currentTarget.style.borderColor = 'var(--status-warning)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Urgency dot */}
                  <div className="absolute left-3 top-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--status-warning)' }}
                    />
                  </div>

                  <div className="ml-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>
                          {apt.patientName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {apt.time} • {apt.provider}
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex flex-wrap gap-1.5"
                      style={{ fontSize: '11px', color: 'var(--status-warning)' }}
                    >
                      {!apt.status.confirmed && (
                        <div
                          className="px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--status-warning-bg)' }}
                        >
                          Unconfirmed
                        </div>
                      )}
                      {!apt.status.intakeComplete && (
                        <div
                          className="px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--status-warning-bg)' }}
                        >
                          Missing Intake
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {/* Review All Button */}
              <button
                className="w-full mt-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  color: 'var(--accent-primary)',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid var(--border-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              >
                Review All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Recent Activity */}
        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-1)',
          }}
        >
          <h3 style={{ color: 'var(--text-primary)' }} className="mb-5">
            Recent Activity
          </h3>

          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <button
                key={activity.id}
                className="w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-150 text-left"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  border: '1px solid var(--border-subtle)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1">
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                    {activity.description}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {activity.patientName}
                  </div>
                </div>

                <div
                  className="flex items-center gap-1.5"
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}
                >
                  <Clock className="w-3 h-3" />
                  {activity.timestamp}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}