import { useState, useEffect } from 'react';
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
  ArrowRight,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useOwnerDashboard, useVoiceAIStats } from '../hooks/useApi';
import {
  InsightPanel,
  InsightSection,
  MetricComparison,
  SimpleTrendChart,
  BulletedInsightList,
  InfoCallout,
} from '../components/owner/InsightPanel';

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
  goodDirection: 'up' | 'down';
}

export function ConnectedOwnerDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [detailedView, setDetailedView] = useState<string | null>(null);

  // Fetch data from backend
  const { data: dashboardData, loading, error, refetch } = useOwnerDashboard(undefined, selectedPeriod);
  const { data: voiceAIStats } = useVoiceAIStats();

  const locations = [
    { id: 'all', name: 'All Locations' },
  ];

  // Map backend data to hero metrics
  const getHeroMetrics = (): HeroMetric[] => {
    if (!dashboardData?.hero_metrics) {
      return [];
    }
    
    const iconMap: Record<string, React.ElementType> = {
      'no-show-rate': TrendingDown,
      'appointments-recovered': Sparkles,
      'admin-hours-saved': Clock,
      'clinic-utilization': Calendar,
    };

    return dashboardData.hero_metrics.map(metric => ({
      id: metric.id,
      label: metric.label,
      value: metric.value,
      change: metric.change,
      changeLabel: metric.change_label,
      icon: iconMap[metric.id] || BarChart3,
      trend: metric.trend,
      goodDirection: metric.good_direction,
    }));
  };

  const heroMetrics = getHeroMetrics();

  const noShowByDoctor = dashboardData?.no_show_by_doctor?.map(d => ({
    doctor: d.doctor,
    rate: d.rate,
    appointments: d.appointments,
  })) || [];

  const noShowByVisitType = dashboardData?.no_show_by_visit_type?.map(v => ({
    type: v.type,
    rate: v.rate,
    appointments: v.appointments,
  })) || [];

  const noShowByDayOfWeek = dashboardData?.no_show_by_day_of_week?.map(d => ({
    day: d.day,
    rate: d.rate,
  })) || [];

  const followUpData = dashboardData?.follow_up_data || {
    scheduled: 0,
    completed: 0,
    missed: 0,
    completion_rate: 0,
    retention_impact: 'N/A',
  };

  const adminEfficiency = dashboardData?.admin_efficiency || {
    calls_automated: 0,
    forms_auto_completed: 0,
    manual_tasks_avoided: 0,
    hours_per_week: 0,
    cost_savings: '$0',
    cost_savings_monthly: '$0',
  };

  const doctorCapacity = dashboardData?.doctor_capacity?.map(d => ({
    doctor: d.doctor,
    appointments: d.appointments,
    utilization: d.utilization,
    specialty: d.specialty,
  })) || [];

  const aiPerformance = dashboardData?.ai_performance || {
    total_interactions: 0,
    confirmations_achieved: 0,
    escalations_to_humans: 0,
    success_rate: 0,
    avg_resolution_time: '0m 0s',
  };

  const isPositiveChange = (metric: HeroMetric) => {
    return metric.goodDirection === metric.trend;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--surface-card)' }}>
          <AlertCircle className="w-8 h-8" style={{ color: 'var(--status-error)' }} />
          <p style={{ color: 'var(--text-primary)' }}>Failed to load dashboard</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Owner Dashboard
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Clinic performance, efficiency insights, and ROI metrics
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
                className="px-4 py-2 pr-10 rounded-xl border appearance-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 90 Days</option>
              </select>
              <ChevronDown 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-secondary)' }}
              />
            </div>

            {/* Location Selector */}
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 pr-10 rounded-xl border appearance-none cursor-pointer"
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
          </div>
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {heroMetrics.map((metric) => {
            const Icon = metric.icon;
            const positive = isPositiveChange(metric);
            
            return (
              <button
                key={metric.id}
                onClick={() => setDetailedView(metric.id)}
                className="p-6 rounded-[18px] border text-left transition-all hover:shadow-lg group w-full"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  borderColor: 'var(--border-default)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--cf-neutral-20)' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <ArrowRight 
                    className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--text-muted)' }}
                  />
                </div>
                
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {metric.label}
                </p>
                
                <p className="text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {metric.value}
                </p>
                
                <div className="flex items-center gap-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" style={{ color: positive ? 'var(--status-success)' : 'var(--status-error)' }} />
                  ) : (
                    <TrendingDown className="w-4 h-4" style={{ color: positive ? 'var(--status-success)' : 'var(--status-error)' }} />
                  )}
                  <span 
                    className="text-sm font-medium"
                    style={{ color: positive ? 'var(--status-success)' : 'var(--status-error)' }}
                  >
                    {metric.changeLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* No-Show Reduction */}
          <div
            className="p-6 rounded-[18px] border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--cf-neutral-20)' }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  No-Show Reduction
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  By provider and visit type
                </p>
              </div>
            </div>

            {/* By Doctor */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                By Provider
              </p>
              <div className="space-y-2">
                {noShowByDoctor.map((item) => (
                  <div key={item.doctor} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {item.doctor}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.appointments} appointments
                      </span>
                      <span 
                        className="text-sm font-medium px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'var(--cf-neutral-20)',
                          color: 'var(--text-primary)' 
                        }}
                      >
                        {item.rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Visit Type */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                By Visit Type
              </p>
              <div className="space-y-2">
                {noShowByVisitType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {item.type}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.appointments} appointments
                      </span>
                      <span 
                        className="text-sm font-medium px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'var(--cf-neutral-20)',
                          color: 'var(--text-primary)' 
                        }}
                      >
                        {item.rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Day of Week */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                By Day of Week
              </p>
              <div className="space-y-2">
                {noShowByDayOfWeek.map((item) => (
                  <div key={item.day} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {item.day}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${item.rate * 10}px`,
                          backgroundColor: 'var(--accent-primary)',
                          opacity: 0.3 
                        }}
                      />
                      <span 
                        className="text-sm font-medium px-2 py-1 rounded min-w-[48px] text-center"
                        style={{ 
                          backgroundColor: 'var(--cf-neutral-20)',
                          color: 'var(--text-primary)' 
                        }}
                      >
                        {item.rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Follow-Up & Retention */}
          <div
            className="p-6 rounded-[18px] border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--cf-neutral-20)' }}
              >
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Follow-Up & Retention
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Automated scheduling impact
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'var(--cf-neutral-20)' }}
              >
                <p className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {followUpData.scheduled}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Scheduled
                </p>
              </div>
              
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)' }}
              >
                <p className="text-2xl font-semibold mb-1" style={{ color: 'var(--status-success)' }}>
                  {followUpData.completed}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Completed
                </p>
              </div>
              
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)' }}
              >
                <p className="text-2xl font-semibold mb-1" style={{ color: 'var(--status-warning)' }}>
                  {followUpData.missed}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Missed
                </p>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Completion Rate
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {followUpData.completion_rate}%
                </span>
              </div>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'var(--cf-neutral-20)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: `${followUpData.completion_rate}%`,
                    backgroundColor: 'var(--status-success)' 
                  }}
                />
              </div>
            </div>

            {/* Insight */}
            <div
              className="p-4 rounded-xl border-l-4"
              style={{
                backgroundColor: 'var(--cf-neutral-20)',
                borderLeftColor: 'var(--accent-primary)',
              }}
            >
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Retention Impact
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {followUpData.retention_impact}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Efficiency Section */}
        <div
          className="p-6 rounded-[18px] border"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <Clock className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Admin Efficiency
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Automation impact on staff workload
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Tasks Automated */}
            <div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Tasks Automated This Period
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Calls
                  </span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {adminEfficiency.calls_automated}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Forms
                  </span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {adminEfficiency.forms_auto_completed}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Manual Tasks Avoided
                  </span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {adminEfficiency.manual_tasks_avoided}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Savings */}
            <div
              className="p-6 rounded-xl flex flex-col justify-center"
              style={{ backgroundColor: 'rgba(91, 141, 239, 0.08)' }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Hours Saved Per Week
              </p>
              <p className="text-4xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                {adminEfficiency.hours_per_week}
              </p>
            </div>

            {/* Cost Savings */}
            <div
              className="p-6 rounded-xl flex flex-col justify-center"
              style={{ backgroundColor: 'rgba(52, 199, 89, 0.08)' }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Estimated Savings
              </p>
              <p className="text-4xl font-semibold mb-1" style={{ color: 'var(--status-success)' }}>
                {adminEfficiency.cost_savings}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {adminEfficiency.cost_savings_monthly}/month projected
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Doctor Capacity & AI Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor Capacity Overview */}
          <div
            className="p-6 rounded-[18px] border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--cf-neutral-20)' }}
              >
                <Users className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Provider Capacity
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Aggregate utilization overview
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {doctorCapacity.map((item) => (
                <div key={item.doctor}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.doctor}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.specialty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.appointments} appointments
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {item.utilization}% utilization
                      </p>
                    </div>
                  </div>
                  <div 
                    className="h-2 rounded-full"
                    style={{ backgroundColor: 'var(--cf-neutral-20)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${item.utilization}%`,
                        backgroundColor: 'var(--accent-primary)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Performance Summary */}
          <div
            className="p-6 rounded-[18px] border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--cf-neutral-20)' }}
              >
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  AI Performance
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Voice AI automation metrics
                </p>
              </div>
            </div>

            {/* Big Success Rate */}
            <div
              className="p-6 rounded-xl mb-6 text-center"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Success Rate
              </p>
              <p className="text-5xl font-semibold mb-1" style={{ color: 'var(--accent-primary)' }}>
                {aiPerformance.success_rate}%
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Avg resolution: {aiPerformance.avg_resolution_time}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Total Interactions
                  </span>
                </div>
                <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {aiPerformance.total_interactions}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(52, 199, 89, 0.08)' }}>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--status-success)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Confirmations Achieved
                  </span>
                </div>
                <span className="text-lg font-semibold" style={{ color: 'var(--status-success)' }}>
                  {aiPerformance.confirmations_achieved}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 149, 0, 0.08)' }}>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Escalations to Staff
                  </span>
                </div>
                <span className="text-lg font-semibold" style={{ color: 'var(--status-warning)' }}>
                  {aiPerformance.escalations_to_humans}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Summary Footer */}
        <div
          className="p-6 rounded-[18px] border text-center"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            Monthly ROI Impact
          </p>
          <p className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {dashboardData?.roi_summary?.message || 'Loading ROI data...'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            At this rate, your investment pays for itself in operational efficiency alone
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConnectedOwnerDashboard;
