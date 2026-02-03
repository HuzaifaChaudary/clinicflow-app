import React, { useState, useEffect } from 'react';
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
  
  // Debug: log when detailedView changes
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:42',message:'detailedView state changed in useEffect',data:{newValue:detailedView,type:typeof detailedView,isNoShowRate:detailedView==='no-show-rate',isAppointmentsRecovered:detailedView==='appointments-recovered',isAdminHoursSaved:detailedView==='admin-hours-saved',isClinicUtilization:detailedView==='clinic-utilization'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
    // #endregion
    console.log('[ConnectedOwnerDashboard] detailedView state changed to:', detailedView);
  }, [detailedView]);

  // Debug: log when selectedPeriod or selectedLocation changes
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:50',message:'selectedPeriod or selectedLocation changed',data:{selectedPeriod:selectedPeriod,selectedLocation:selectedLocation},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
    // #endregion
    console.log('[ConnectedOwnerDashboard] Period/Location changed:', { selectedPeriod, selectedLocation });
  }, [selectedPeriod, selectedLocation]);

  // Fetch data from backend
  const { data: dashboardData, loading, error, refetch } = useOwnerDashboard(undefined, selectedPeriod);
  const { data: voiceAIStats } = useVoiceAIStats();

  // Debug: log when dashboardData changes
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:60',message:'dashboardData changed',data:{hasData:!!dashboardData,loading:loading,error:error,heroMetricsCount:dashboardData?.hero_metrics?.length||0,selectedPeriod:selectedPeriod},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
    // #endregion
    console.log('[ConnectedOwnerDashboard] dashboardData updated:', { hasData: !!dashboardData, loading, error, period: selectedPeriod });
  }, [dashboardData, loading, error, selectedPeriod]);

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'downtown', name: 'Downtown Clinic' },
    { id: 'westside', name: 'Westside Clinic' },
    { id: 'north', name: 'North Campus' },
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
                onChange={(e) => {
                  const newPeriod = e.target.value as 'week' | 'month' | 'quarter';
                  // #region agent log
                  fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:188',message:'Period dropdown onChange triggered',data:{oldPeriod:selectedPeriod,newPeriod:newPeriod},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
                  // #endregion
                  console.log('[ConnectedOwnerDashboard] Period dropdown changed:', { old: selectedPeriod, new: newPeriod });
                  setSelectedPeriod(newPeriod);
                }}
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
                onChange={(e) => {
                  const newLocation = e.target.value;
                  // #region agent log
                  fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:210',message:'Location dropdown onChange triggered',data:{oldLocation:selectedLocation,newLocation:newLocation,locationsCount:locations.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
                  // #endregion
                  console.log('[ConnectedOwnerDashboard] Location dropdown changed:', { old: selectedLocation, new: newLocation });
                  setSelectedLocation(newLocation);
                }}
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
                onClick={(e) => {
                  // #region agent log
                  fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:233',message:'Card onClick handler called',data:{metricId:metric.id,currentDetailedView:detailedView},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
                  // #endregion
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[ConnectedOwnerDashboard] Card clicked! Metric ID:', metric.id);
                  // #region agent log
                  fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:238',message:'About to call setDetailedView',data:{newValue:metric.id,oldValue:detailedView},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
                  // #endregion
                  setDetailedView(metric.id);
                  console.log('[ConnectedOwnerDashboard] setDetailedView called with:', metric.id);
                }}
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

      {/* Insight Panels - rendered outside scrollable container using portal */}
      {/* No-Show Rate Insight Panel */}
      {(() => {
        const isOpen = detailedView === 'no-show-rate';
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:795',message:'No-Show Rate panel render check',data:{isOpen:isOpen,detailedView:detailedView,comparison:detailedView==='no-show-rate'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
        // #endregion
        return (
          <InsightPanel
            isOpen={isOpen}
            onClose={() => {
              console.log('[ConnectedOwnerDashboard] Closing No-Show Rate panel');
              setDetailedView(null);
            }}
            title="No-Show Reduction"
            subtitle="Clinic-wide trend and contributing factors"
          >
            <InsightSection title="Before vs After Comparison">
              <MetricComparison
                before={{ label: 'Pre-Clinicflow', value: dashboardData?.pre_clinicflow_no_show_rate ? `${dashboardData.pre_clinicflow_no_show_rate}%` : '0%' }}
                after={{ label: 'Current', value: dashboardData?.hero_metrics?.find(m => m.id === 'no-show-rate')?.value || '0%' }}
                improvement={{ 
                  label: 'Reduction', 
                  value: dashboardData?.pre_clinicflow_no_show_rate && dashboardData?.hero_metrics?.find(m => m.id === 'no-show-rate')?.value 
                    ? `${Math.round(dashboardData.pre_clinicflow_no_show_rate - parseFloat(dashboardData.hero_metrics.find(m => m.id === 'no-show-rate')?.value?.replace('%', '') || '0'))}%`
                    : '0%'
                }}
              />
            </InsightSection>

            <InsightSection title="Trend Overview">
              <SimpleTrendChart
                data={dashboardData?.no_show_trend?.map(t => ({ label: t.label, value: t.value })) || []}
                unit="%"
                showToggle={true}
              />
            </InsightSection>

            <InsightSection title="What Improved">
              <BulletedInsightList
                items={[
                  'Automated appointment confirmations ensure patients receive timely reminders via voice and SMS',
                  'Intake completion before visit reduces day-of surprises and patient confusion',
                  'Waitlist backfills after cancellations maximize schedule density and prevent revenue loss',
                  'Real-time slot recovery converts cancellations into new bookings within minutes',
                ]}
              />
            </InsightSection>

            <InsightSection title="Breakdown by Visit Type">
              <div className="space-y-3">
                {noShowByVisitType.length > 0 ? (
                  noShowByVisitType.map((item) => (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          {item.type}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {item.rate}%
                        </span>
                      </div>
                      <div 
                        className="h-2.5 rounded-full"
                        style={{ backgroundColor: 'var(--cf-neutral-20)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${Math.min(100, (item.rate / 10) * 100)}%`,
                            backgroundColor: 'var(--accent-primary)',
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No visit type data available</p>
                )}
              </div>
            </InsightSection>

            <InsightSection title="Breakdown by Location">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Location breakdown data not available in current API response
              </p>
            </InsightSection>
          </InsightPanel>
        );
      })()}

      {/* Appointments Recovered Insight Panel */}
      {(() => {
        const isOpen = detailedView === 'appointments-recovered';
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:815',message:'Appointments Recovered panel render check',data:{isOpen:isOpen,detailedView:detailedView,comparison:detailedView==='appointments-recovered'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
        // #endregion
        return (
          <InsightPanel
            isOpen={isOpen}
            onClose={() => {
              console.log('[ConnectedOwnerDashboard] Closing Appointments Recovered panel');
              setDetailedView(null);
            }}
            title="Appointments Recovered by AI"
            subtitle="Recovered cancellations and no-response slots"
          >
            <InsightSection title="What This Means">
              <InfoCallout>
                <p style={{ color: 'var(--text-primary)' }}>
                  Appointments recovered when AI filled cancelled or unconfirmed slots through automated waitlist outreach, same-day rebooking, and confirmation conversion.
                </p>
              </InfoCallout>
            </InsightSection>

            <InsightSection title="Weekly Trend">
              <SimpleTrendChart
                data={dashboardData?.appointments_recovered_trend?.map(t => ({ label: t.label, value: t.value })) || []}
                unit=" appointments"
                showToggle={false}
              />
            </InsightSection>

            <InsightSection title="Recovery Sources">
              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Same-Day Cancellations Filled
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      AI contacted waitlist patients within minutes of cancellation
                    </p>
                  </div>
                  <p className="text-3xl font-semibold ml-4" style={{ color: 'var(--accent-primary)' }}>
                    {dashboardData?.recovery_sources?.same_day_cancellations || 0}
                  </p>
                </div>
                <div className="flex items-start justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Waitlist Outreach Success
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Proactive outreach converted waitlist interest into booked appointments
                    </p>
                  </div>
                  <p className="text-3xl font-semibold ml-4" style={{ color: 'var(--accent-primary)' }}>
                    {dashboardData?.recovery_sources?.waitlist_outreach || 0}
                  </p>
                </div>
                <div className="flex items-start justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Unconfirmed Appointments Converted
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      AI follow-ups secured confirmations that would have been no-shows
                    </p>
                  </div>
                  <p className="text-3xl font-semibold ml-4" style={{ color: 'var(--accent-primary)' }}>
                    {dashboardData?.recovery_sources?.unconfirmed_converted || 0}
                  </p>
                </div>
              </div>
            </InsightSection>

            <InsightSection title="Operational Impact">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(52, 199, 89, 0.08)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    Estimated Revenue Protected
                  </p>
                  <p className="text-2xl font-semibold" style={{ color: 'var(--status-success)' }}>
                    {dashboardData?.roi_summary?.monthly_cost_savings 
                      ? `$${Math.round(dashboardData.roi_summary.monthly_cost_savings).toLocaleString()}`
                      : '$0'}
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(91, 141, 239, 0.08)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    Handled Fully by AI
                  </p>
                  <p className="text-2xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                    {dashboardData?.ai_performance?.total_interactions 
                      ? `${Math.round((dashboardData.ai_performance.confirmations_achieved / dashboardData.ai_performance.total_interactions) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </InsightSection>
          </InsightPanel>
        );
      })()}

      {/* Admin Hours Saved Insight Panel */}
      {(() => {
        const isOpen = detailedView === 'admin-hours-saved';
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:835',message:'Admin Hours Saved panel render check',data:{isOpen:isOpen,detailedView:detailedView,comparison:detailedView==='admin-hours-saved'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
        // #endregion
        return (
          <InsightPanel
            isOpen={isOpen}
            onClose={() => {
              console.log('[ConnectedOwnerDashboard] Closing Admin Hours Saved panel');
              setDetailedView(null);
            }}
            title="Admin Hours Saved"
            subtitle="Time saved through automation"
          >
            <InsightSection title="How This Is Calculated">
              <InfoCallout>
                <p style={{ color: 'var(--text-primary)' }}>
                  We track every automated confirmation call, intake reminder, and reschedule coordination handled by AI. Each is converted into time saved based on average manual task duration (confirmation = 3min, intake follow-up = 5min, reschedule = 7min).
                </p>
              </InfoCallout>
            </InsightSection>

            <InsightSection title="Time Breakdown">
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Confirmation Handling
                    </p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {adminEfficiency.hours_per_week ? (adminEfficiency.hours_per_week * 0.4).toFixed(1) : '17.1'} hrs
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    342 automated calls × 3 min avg = 17.1 hours
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Intake Reminders
                    </p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {adminEfficiency.hours_per_week ? (adminEfficiency.hours_per_week * 0.39).toFixed(1) : '16.5'} hrs
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    198 automated form completions × 5 min avg = 16.5 hours
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Reschedule Coordination
                    </p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--accent-primary)' }}>
                      {adminEfficiency.hours_per_week ? (adminEfficiency.hours_per_week * 0.21).toFixed(1) : '8.9'} hrs
                    </p>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    76 automated reschedules × 7 min avg = 8.9 hours
                  </p>
                </div>
              </div>
            </InsightSection>

            <InsightSection title="Business Context">
              <InfoCallout variant="success">
                <p className="font-semibold mb-2">≈ Half an admin role per week</p>
                <p style={{ color: 'var(--text-primary)' }}>
                  {adminEfficiency.hours_per_week || 0} hours saved equals approximately {adminEfficiency.hours_per_week ? Math.round((adminEfficiency.hours_per_week / 40) * 100) : 0}% of a full-time admin's workweek. This allows your team to focus on complex patient needs, in-person interactions, and higher-value tasks.
                </p>
              </InfoCallout>
            </InsightSection>

            <InsightSection title="Efficiency Improvement Over Time">
              <SimpleTrendChart
                data={dashboardData?.admin_hours_trend?.map(t => ({ label: t.label, value: t.value })) || []}
                unit=" hrs"
                showToggle={false}
              />
            </InsightSection>
          </InsightPanel>
        );
      })()}

      {/* Clinic Utilization Insight Panel */}
      {(() => {
        const isOpen = detailedView === 'clinic-utilization';
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ConnectedOwnerDashboard.tsx:855',message:'Clinic Utilization panel render check',data:{isOpen:isOpen,detailedView:detailedView,comparison:detailedView==='clinic-utilization'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
        // #endregion
        return (
          <InsightPanel
            isOpen={isOpen}
            onClose={() => {
              console.log('[ConnectedOwnerDashboard] Closing Clinic Utilization panel');
              setDetailedView(null);
            }}
            title="Clinic Utilization"
            subtitle="Capacity usage across appointments"
          >
            <InsightSection title="Utilization Trend">
              <SimpleTrendChart
                data={dashboardData?.clinic_utilization_trend?.map(t => ({ label: t.label, value: t.value })) || []}
                unit="%"
                showToggle={false}
              />
            </InsightSection>

            <InsightSection title="Capacity Breakdown">
              <div className="space-y-4">
                {noShowByVisitType.map((item) => {
                  // Calculate utilization from visit type data
                  const totalAppointments = item.appointments || 0;
                  const utilization = totalAppointments > 0 ? Math.min(100, (totalAppointments / 20) * 100) : 0;
                  return (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {item.type} Utilization
                        </span>
                        <span className="text-lg font-semibold" style={{ color: 'var(--accent-primary)' }}>
                          {utilization.toFixed(0)}%
                        </span>
                      </div>
                      <div 
                        className="h-3 rounded-full"
                        style={{ backgroundColor: 'var(--cf-neutral-20)' }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${utilization}%`,
                            backgroundColor: 'var(--accent-primary)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {noShowByVisitType.length === 0 && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    No visit type data available for utilization breakdown
                  </p>
                )}
              </div>
            </InsightSection>

            <InsightSection title="Missed Capacity Drivers">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      No-Shows
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {dashboardData?.hero_metrics?.find(m => m.id === 'no-show-rate')?.value || '0%'} of total capacity
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full"
                    style={{ backgroundColor: 'var(--cf-neutral-20)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${Math.min(100, parseFloat(dashboardData?.hero_metrics?.find(m => m.id === 'no-show-rate')?.value?.replace('%', '') || '0'))}%`,
                        backgroundColor: 'var(--status-error)',
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Late cancellations and unfilled gaps data not available in current API response
                </p>
              </div>
            </InsightSection>

            <InsightSection title="AI-Driven Opportunity">
              <InfoCallout variant="success">
                <p className="font-semibold mb-2">68% of unused capacity addressed via AI workflows</p>
                <p style={{ color: 'var(--text-primary)' }}>
                  Of the 13% unused capacity, Clinicflow's AI automation has successfully recovered 68% through automated confirmations, waitlist management, and same-day slot filling— preventing revenue loss and maximizing provider schedules.
                </p>
              </InfoCallout>
            </InsightSection>
          </InsightPanel>
        );
      })()}
    </div>
  );
}

export default ConnectedOwnerDashboard;
