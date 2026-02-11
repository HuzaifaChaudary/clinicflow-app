import { useState } from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Calendar,
  BarChart3,
  Users,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  DollarSign,
  Activity,
  FileText,
  Video,
  Building2,
  Bell,
  X,
  UserCircle,
  MessageSquare
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { Appointment } from '../types/appointment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { AxisLogoMark } from '../components/AxisLogoMark';

interface OwnerDashboardPageProps {
  appointments: Appointment[];
  cancelledAppointments: Appointment[];
  onNavigateToSchedule: () => void;
  onUpdateAppointment: (appointment: Appointment) => void;
  onReschedule: (appointmentId: string, newTime: string, newProvider: string, newDate: string) => void;
  onCancel: (appointmentId: string, reason: any) => void;
}

export function OwnerDashboardPage({
  appointments,
  cancelledAppointments,
  onNavigateToSchedule,
  onUpdateAppointment,
  onReschedule,
  onCancel,
}: OwnerDashboardPageProps) {
  const { settings } = useSettings();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('last-7-days');
  const [dismissedActions, setDismissedActions] = useState<string[]>([]);

  // Mock locations
  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'loc1', name: 'Downtown Clinic' },
    { id: 'loc2', name: 'Westside Clinic' },
    { id: 'loc3', name: 'North Campus' },
  ];

  const dateRanges = [
    { id: 'last-7-days', name: 'Last 7 days' },
    { id: 'last-30-days', name: 'Last 30 days' },
    { id: 'last-90-days', name: 'Last 90 days' },
    { id: 'year-to-date', name: 'Year to date' },
  ];

  // KPI tiles with Ava insights
  const kpiTiles = [
    {
      id: 'no-show-rate',
      label: 'No-Show Rate',
      value: '4.2%',
      previousValue: '6.8%',
      change: -38,
      trend: 'down' as const,
      icon: TrendingDown,
      avaInsight: 'No-show rate is higher than last month, mostly driven by new patients at Westside Clinic',
      isGood: true,
    },
    {
      id: 'utilization',
      label: 'Clinic Utilization',
      value: '87%',
      previousValue: '79%',
      change: +10,
      trend: 'up' as const,
      icon: Activity,
      avaInsight: 'Utilization is at 87%, close to capacity for Dr. Sarah Chen at Downtown',
      isGood: true,
    },
    {
      id: 'revenue',
      label: 'Weekly Revenue',
      value: '$42.3k',
      previousValue: '$38.1k',
      change: +11,
      trend: 'up' as const,
      icon: DollarSign,
      avaInsight: 'Revenue up 11% vs last week, driven by increased video visit conversion',
      isGood: true,
    },
    {
      id: 'admin-hours',
      label: 'Admin Hours Saved',
      value: '42.5 hrs',
      previousValue: '36.2 hrs',
      change: +17,
      trend: 'up' as const,
      icon: Clock,
      avaInsight: 'Automation saved 42.5 hours this week, up 17% from baseline',
      isGood: true,
    },
  ];

  // Provider breakdown data
  const providerData = [
    { 
      name: 'Dr. Sarah Chen', 
      utilization: 89, 
      noShowRate: 3.8, 
      appointments: 142,
      badge: 'Over capacity',
      badgeType: 'warning' as const,
    },
    { 
      name: 'Dr. Michael Park', 
      utilization: 82, 
      noShowRate: 4.1, 
      appointments: 128,
      badge: null,
      badgeType: null,
    },
    { 
      name: 'Dr. Jennifer Williams', 
      utilization: 94, 
      noShowRate: 5.2, 
      appointments: 156,
      badge: 'High no-show',
      badgeType: 'error' as const,
    },
    { 
      name: 'Dr. David Rodriguez', 
      utilization: 86, 
      noShowRate: 3.9, 
      appointments: 134,
      badge: null,
      badgeType: null,
    },
    { 
      name: 'Dr. Emily Thompson', 
      utilization: 78, 
      noShowRate: 4.6, 
      appointments: 118,
      badge: null,
      badgeType: null,
    },
  ];

  // Visit type breakdown data
  const visitTypeData = [
    { type: 'In-Clinic', total: 456, completed: 441, cancelled: 15, noShowRate: 3.2, color: '#5B8DEF' },
    { type: 'Video Call', total: 222, completed: 209, cancelled: 13, noShowRate: 5.8, color: '#7BA7E1' },
    { type: 'New Patient', total: 189, completed: 171, cancelled: 18, noShowRate: 9.5, color: '#F2A65A' },
    { type: 'Follow-up', total: 489, completed: 479, cancelled: 10, noShowRate: 2.0, color: '#4DA3A1' },
  ];

  // AI-generated action cards
  const actionCards = [
    {
      id: 'action-1',
      title: 'Increase reminder intensity for new patients at Westside Clinic',
      impact: 'Could reduce no-shows by 1.5%',
      impactType: 'positive' as const,
      category: 'No-Show Reduction',
    },
    {
      id: 'action-2',
      title: 'Add an extra half-day for Dr. Sarah Chen next week',
      impact: 'Projected to reduce wait times by 2.3 days',
      impactType: 'positive' as const,
      category: 'Capacity Management',
    },
    {
      id: 'action-3',
      title: 'Review refill turnaround times – 15% are over 48 hours',
      impact: 'Patient satisfaction at risk',
      impactType: 'warning' as const,
      category: 'Clinical Operations',
    },
    {
      id: 'action-4',
      title: 'Enable video visits for Dr. Emily Thompson',
      impact: 'Could add 8-12 appointments/week',
      impactType: 'positive' as const,
      category: 'Revenue Opportunity',
    },
    {
      id: 'action-5',
      title: 'Diabetes follow-up completion is 68% (target: 85%)',
      impact: 'Risk of readmissions',
      impactType: 'warning' as const,
      category: 'Care Quality',
    },
  ];

  // Follow-up & retention data by segment
  const followUpSegments = [
    { segment: 'Diabetes Management', scheduled: 45, completed: 38, rate: 84.4, status: 'good' as const },
    { segment: 'Hypertension', scheduled: 62, completed: 58, rate: 93.5, status: 'excellent' as const },
    { segment: 'Post-Surgery', scheduled: 28, completed: 19, rate: 67.9, status: 'needs-attention' as const },
    { segment: 'Preventive Care', scheduled: 51, completed: 46, rate: 90.2, status: 'good' as const },
  ];

  // Automation impact over time (mock trend data)
  const automationTrendData = [
    { week: 'Week 1', callsAutomated: 280, formsAutomated: 165, hoursSaved: 32 },
    { week: 'Week 2', callsAutomated: 298, formsAutomated: 178, hoursSaved: 35 },
    { week: 'Week 3', callsAutomated: 315, formsAutomated: 185, hoursSaved: 39 },
    { week: 'Week 4', callsAutomated: 342, formsAutomated: 198, hoursSaved: 42.5 },
  ];

  const handleDismissAction = (actionId: string) => {
    setDismissedActions([...dismissedActions, actionId]);
  };

  const filteredActions = actionCards.filter(action => !dismissedActions.includes(action.id));

  const quickPrompts = [
    'Where are we losing the most revenue?',
    'Which providers are near burnout?',
    'What changed since last month?',
    'How can we improve follow-up rates?',
  ];

  const riskAlerts = [
    { id: 'alert-1', title: 'High no-show rate at Westside Clinic', severity: 'warning' as const },
    { id: 'alert-2', title: 'Dr. Sarah Chen is over capacity', severity: 'warning' as const },
    { id: 'alert-3', title: 'Refill turnaround times are slow', severity: 'warning' as const },
    { id: 'alert-4', title: 'Diabetes follow-up completion is low', severity: 'warning' as const },
  ];

  return (
    <div className="h-screen overflow-y-auto" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Owner Command Center
                </h1>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>Today's signal:</span>
                  <span>Clinic performance, risks, and AI-suggested actions</span>
                </div>
              </div>

              {/* Ava Status Pill */}
              <div
                className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shrink-0"
                style={{
                  backgroundColor: '#10B98120',
                  border: '1px solid #10B981',
                  color: '#10B981',
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>
                  Ava Command: Stable · {riskAlerts.length} risk alerts
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Strip + Controls */}
          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                  }}
                >
                  Today
                </button>
                <button
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  This week
                </button>
                <button
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  This month
                </button>
              </div>

              <div className="w-px h-4" style={{ backgroundColor: 'var(--border-default)' }} />

              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="font-medium">Trend:</span>
                <span style={{ color: 'var(--status-success)' }}>↑ 12% vs last week</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Location Selector */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 pr-10 rounded-xl border appearance-none cursor-pointer text-sm"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>

              {/* Date Range Selector */}
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 pr-10 rounded-xl border appearance-none cursor-pointer text-sm"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {dateRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Tiles with Ava Commentary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiTiles.map((tile) => {
            const Icon = tile.icon;
            
            return (
              <div
                key={tile.id}
                className="p-5 rounded-[18px] border"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                }}
              >
                {/* Icon & Value */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(91, 141, 239, 0.08)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  
                  {/* Trend indicator */}
                  <div className="flex items-center gap-1">
                    {tile.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" style={{ color: tile.isGood ? 'var(--status-success)' : 'var(--status-error)' }} />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" style={{ color: tile.isGood ? 'var(--status-success)' : 'var(--status-error)' }} />
                    )}
                    <span 
                      className="text-xs font-medium"
                      style={{ color: tile.isGood ? 'var(--status-success)' : 'var(--status-error)' }}
                    >
                      {Math.abs(tile.change)}%
                    </span>
                  </div>
                </div>

                {/* Label */}
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {tile.label}
                </p>

                {/* Value */}
                <p className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {tile.value}
                </p>

                {/* Ava Insight */}
                <div
                  className="p-2 rounded-lg flex items-start gap-2"
                  style={{ backgroundColor: 'rgba(91, 141, 239, 0.04)' }}
                >
                  <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {tile.avaInsight}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content: Left (Drivers) + Right (Ava Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Drivers & Breakdowns (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Header */}
            <div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                What's driving these numbers?
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Performance breakdown by provider and visit type
              </p>
            </div>

            {/* Card A: By Provider */}
            <div
              className="p-6 rounded-[18px] border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Users className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  By Provider
                </h3>
              </div>

              {/* Bar chart */}
              <div className="mb-6" style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={providerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                      tickFormatter={(value) => value.split(' ')[1]} // Show last name only
                    />
                    <YAxis 
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                      label={{ value: 'Utilization %', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-secondary)', fontSize: 12 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface-card)', 
                        borderColor: 'var(--border-default)',
                        borderRadius: '12px',
                        fontSize: '13px'
                      }}
                      labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    />
                    <Bar dataKey="utilization" fill="var(--accent-primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Provider list with badges */}
              <div className="space-y-3">
                {providerData.map((provider) => (
                  <div 
                    key={provider.name}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--cf-neutral-20)' }}
                  >
                    <div className="flex items-center gap-3">
                      <UserCircle className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {provider.name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {provider.appointments} appointments • {provider.noShowRate}% no-show
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {provider.badge && (
                        <span
                          className="px-2 py-1 rounded-md text-xs font-medium"
                          style={{
                            backgroundColor: provider.badgeType === 'warning' ? 'var(--status-warning-bg)' : 'var(--status-error-bg)',
                            color: provider.badgeType === 'warning' ? 'var(--status-warning)' : 'var(--status-error)',
                          }}
                        >
                          {provider.badge}
                        </span>
                      )}
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {provider.utilization}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card B: By Visit Type / Channel */}
            <div
              className="p-6 rounded-[18px] border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  By Visit Type / Channel
                </h3>
              </div>

              {/* Visit type breakdown grid */}
              <div className="grid grid-cols-2 gap-4">
                {visitTypeData.map((visitType) => (
                  <div
                    key={visitType.type}
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: visitType.color }}
                      />
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {visitType.type}
                      </p>
                    </div>

                    <p className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {visitType.total}
                    </p>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-secondary)' }}>Completed</span>
                        <span style={{ color: 'var(--text-primary)' }}>{visitType.completed}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: 'var(--text-secondary)' }}>No-show rate</span>
                        <span 
                          className="font-medium"
                          style={{ 
                            color: visitType.noShowRate > 6 ? 'var(--status-error)' : 'var(--status-success)' 
                          }}
                        >
                          {visitType.noShowRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ava insight for visit types */}
              <div
                className="mt-4 p-3 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: 'rgba(242, 166, 90, 0.08)' }}
              >
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-warning)' }} />
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--status-warning)' }}>
                    Ava's Observation
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    New patient no-shows (9.5%) are significantly higher than follow-ups (2.0%). Consider adding an extra confirmation touchpoint for first-time visits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Ava for Owners Panel */}
          <div
            className="p-6 rounded-[18px] border h-fit sticky top-6"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            {/* Panel Header with Axis Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
              >
                <AxisLogoMark size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                    Ava Command
                  </h3>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                  Your owner insights partner
                </p>
              </div>
            </div>

            {/* Status summary */}
            <div
              className="p-4 rounded-xl mb-5"
              style={{ backgroundColor: 'rgba(91, 141, 239, 0.06)' }}
            >
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                This week, Ava Command recommends focusing on <strong>reducing no-shows</strong> and <strong>improving follow-up for diabetes patients</strong>.
              </p>
            </div>

            {/* Action cards */}
            <div className="space-y-3 mb-5">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Suggested Actions ({filteredActions.length})
              </p>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    {/* Header with dismiss */}
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: 'rgba(91, 141, 239, 0.08)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        {action.category}
                      </span>
                      <button
                        onClick={() => handleDismissAction(action.id)}
                        className="p-1 rounded-lg hover:bg-opacity-80 transition-colors"
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>

                    {/* Action title */}
                    <p className="text-sm font-medium mb-2 leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {action.title}
                    </p>

                    {/* Impact estimate */}
                    <div
                      className="px-3 py-2 rounded-lg mb-3 flex items-center gap-2"
                      style={{
                        backgroundColor: action.impactType === 'warning' ? 'var(--status-warning-bg)' : 'var(--status-success-bg)',
                      }}
                    >
                      <Target className="w-3 h-3" style={{ color: action.impactType === 'warning' ? 'var(--status-warning)' : 'var(--status-success)' }} />
                      <p 
                        className="text-xs font-medium"
                        style={{ color: action.impactType === 'warning' ? 'var(--status-warning)' : 'var(--status-success)' }}
                      >
                        {action.impact}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: 'var(--accent-primary-bg)',
                          color: 'var(--accent-primary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(91, 141, 239, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent-primary-bg)';
                        }}
                      >
                        Assign to Admin
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: 'var(--cf-neutral-20)',
                          color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--cf-neutral-20)';
                        }}
                      >
                        Discuss
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: 'var(--cf-neutral-20)',
                          color: 'var(--text-secondary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--cf-neutral-20)';
                        }}
                      >
                        Snooze
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt area */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                Ask Ava
              </p>
              
              {/* Input */}
              <div
                className="flex items-center gap-2 p-3 rounded-xl border mb-3"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <MessageSquare className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Ask Ava about performance, risks, or what to fix next"
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                  }}
                >
                  <Send className="w-4 h-4" style={{ color: 'white' }} />
                </button>
              </div>

              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                    style={{
                      backgroundColor: 'var(--cf-neutral-20)',
                      color: 'var(--text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      e.currentTarget.style.color = 'var(--accent-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--cf-neutral-20)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Execution & Monitoring */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Execution & Monitoring
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Follow-Up & Retention */}
            <div
              className="p-6 rounded-[18px] border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Follow-Up & Retention
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Completion rate of Ava follow-up cadences
                  </p>
                </div>
              </div>

              {/* Segments list */}
              <div className="space-y-3 mb-4">
                {followUpSegments.map((segment) => (
                  <div
                    key={segment.segment}
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: 'var(--cf-neutral-20)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {segment.segment}
                      </p>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: segment.status === 'excellent' ? 'var(--status-success-bg)' : segment.status === 'good' ? 'var(--status-info-bg)' : 'var(--status-warning-bg)',
                          color: segment.status === 'excellent' ? 'var(--status-success)' : segment.status === 'good' ? 'var(--status-info)' : 'var(--status-warning)',
                        }}
                      >
                        {segment.rate}%
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>{segment.completed}/{segment.scheduled} completed</span>
                      {segment.status === 'needs-attention' && (
                        <span className="flex items-center gap-1" style={{ color: 'var(--status-warning)' }}>
                          <AlertCircle className="w-3 h-3" />
                          Needs attention
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div 
                      className="h-1.5 rounded-full mt-2"
                      style={{ backgroundColor: 'var(--border-default)' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${segment.rate}%`,
                          backgroundColor: segment.status === 'excellent' ? 'var(--status-success)' : segment.status === 'good' ? 'var(--status-info)' : 'var(--status-warning)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Ava note */}
              <div
                className="p-3 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.06)' }}
              >
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Post-surgery follow-up is underperforming (68% vs target 85%). Ava recommends increasing reminder frequency for this segment.
                </p>
              </div>
            </div>

            {/* Automation Impact */}
            <div
              className="p-6 rounded-[18px] border"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Activity className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Automation Impact
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Hours saved and tasks automated over time
                  </p>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div
                  className="p-3 rounded-xl text-center"
                  style={{ backgroundColor: 'rgba(91, 141, 239, 0.08)' }}
                >
                  <PhoneCall className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--accent-primary)' }} />
                  <p className="text-xl font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    342
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Calls automated
                  </p>
                </div>

                <div
                  className="p-3 rounded-xl text-center"
                  style={{ backgroundColor: 'rgba(77, 163, 161, 0.08)' }}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--status-success)' }} />
                  <p className="text-xl font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    198
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Forms automated
                  </p>
                </div>

                <div
                  className="p-3 rounded-xl text-center"
                  style={{ backgroundColor: 'rgba(242, 166, 90, 0.08)' }}
                >
                  <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--status-warning)' }} />
                  <p className="text-xl font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                    42.5
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Hours saved
                  </p>
                </div>
              </div>

              {/* Trend chart */}
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={automationTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--surface-card)', 
                        borderColor: 'var(--border-default)',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="circle"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="callsAutomated" 
                      stroke="var(--accent-primary)" 
                      strokeWidth={2}
                      name="Calls"
                      dot={{ fill: 'var(--accent-primary)', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="formsAutomated" 
                      stroke="var(--status-success)" 
                      strokeWidth={2}
                      name="Forms"
                      dot={{ fill: 'var(--status-success)', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hoursSaved" 
                      stroke="var(--status-warning)" 
                      strokeWidth={2}
                      name="Hours"
                      dot={{ fill: 'var(--status-warning)', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Ava note */}
              <div
                className="mt-4 p-3 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: 'rgba(77, 163, 161, 0.08)' }}
              >
                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--status-success)' }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  If we increased automation for intake forms at North Campus to match Downtown levels, we could save ~10 more hours/week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}