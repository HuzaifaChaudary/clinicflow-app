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
  ChevronDown
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { Appointment } from '../types/appointment';
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
  goodDirection: 'up' | 'down'; // Which direction is positive
}

interface DetailedView {
  id: string;
  title: string;
}

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
  // Settings removed - not used in this component
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [detailedView, setDetailedView] = useState<string | null>(null);

  // Debug: log when detailedView changes
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OwnerDashboardPage.tsx:65',message:'detailedView state changed in useEffect',data:{newValue:detailedView,type:typeof detailedView,isNoShowRate:detailedView==='no-show-rate',isAppointmentsRecovered:detailedView==='appointments-recovered',isAdminHoursSaved:detailedView==='admin-hours-saved',isClinicUtilization:detailedView==='clinic-utilization'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    console.log('[OwnerDashboard] detailedView state changed to:', detailedView);
    console.log('[OwnerDashboard] detailedView type:', typeof detailedView);
    console.log('[OwnerDashboard] detailedView === "no-show-rate":', detailedView === 'no-show-rate');
  }, [detailedView]);
  
  // Debug: log initial render
  useEffect(() => {
    console.log('[OwnerDashboard] Component mounted, initial detailedView:', detailedView);
    console.log('[OwnerDashboard] heroMetrics count:', heroMetrics.length);
  }, []);

  // Locations - empty for now, should come from settings/backend
  const locations = [
    { id: 'all', name: 'All Locations' },
  ];

  // Default hero metrics - should be fetched from backend
  const heroMetrics: HeroMetric[] = [
    {
      id: 'no-show-rate',
      label: 'No-Show Rate',
      value: '4.2%',
      change: -58,
      changeLabel: '58% reduction',
      icon: TrendingDown,
      trend: 'down',
      goodDirection: 'down',
    },
    {
      id: 'appointments-recovered',
      label: 'Appointments Recovered by AI',
      value: '127',
      change: 23,
      changeLabel: '23 more vs last week',
      icon: Sparkles,
      trend: 'up',
      goodDirection: 'up',
    },
    {
      id: 'admin-hours-saved',
      label: 'Admin Hours Saved',
      value: '42.5 hrs',
      change: 18,
      changeLabel: '18% more efficient',
      icon: Clock,
      trend: 'up',
      goodDirection: 'up',
    },
    {
      id: 'clinic-utilization',
      label: 'Clinic Utilization',
      value: '87%',
      change: 12,
      changeLabel: '12% increase',
      icon: Calendar,
      trend: 'up',
      goodDirection: 'up',
    },
  ];
  const noShowByDoctor: any[] = [];
  const noShowByVisitType: any[] = [];
  const noShowByDayOfWeek: any[] = [];
  const followUpData = {
    scheduled: 0,
    completed: 0,
    missed: 0,
    completionRate: 0,
    retentionImpact: 'N/A',
  };
  const adminEfficiency = {
    callsAutomated: 0,
    formsAutoCompleted: 0,
    manualTasksAvoided: 0,
    hoursPerWeek: 0,
    costSavings: '$0',
    costSavingsMonthly: '$0',
  };
  const doctorCapacity: any[] = [];
  const aiPerformance = {
    totalInteractions: 0,
    confirmationsAchieved: 0,
    escalationsToHumans: 0,
    successRate: 0,
    avgResolutionTime: '0m 0s',
  };

  const isPositiveChange = (metric: HeroMetric) => {
    return metric.goodDirection === metric.trend;
  };

  return (
    <>
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

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {heroMetrics.map((metric) => {
            const Icon = metric.icon;
            const positive = isPositiveChange(metric);
            
            return (
              <button
                key={metric.id}
                type="button"
                onClick={(e) => {
                  // #region agent log
                  fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OwnerDashboardPage.tsx:209',message:'Card onClick handler called',data:{metricId:metric.id,currentDetailedView:detailedView},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
                  // #endregion
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('[OwnerDashboard] Card clicked!');
                  console.log('[OwnerDashboard] Metric ID:', metric.id);
                  console.log('[OwnerDashboard] Current detailedView before update:', detailedView);
                  console.log('[OwnerDashboard] Calling setDetailedView with:', metric.id);
                  // #region agent log
                  fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OwnerDashboardPage.tsx:217',message:'About to call setDetailedView',data:{newValue:metric.id,oldValue:detailedView},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
                  // #endregion
                  setDetailedView(metric.id);
                  console.log('[OwnerDashboard] setDetailedView called, checking state in next render...');
                  console.log('[OwnerDashboard] After setDetailedView, detailedView will be:', metric.id);
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
          <button
            onClick={() => setDetailedView('no-show-rate')}
            className="p-6 rounded-[18px] border text-left transition-all hover:shadow-lg w-full"
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
                  Pre-Clinicflow: 10.2% → Post-Clinicflow: 4.2%
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
                      {/* Simple bar chart */}
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
          </button>

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
                  {followUpData.completionRate}%
                </span>
              </div>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'var(--cf-neutral-20)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: `${followUpData.completionRate}%`,
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
                {followUpData.retentionImpact}
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
                Tasks Automated This Week
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Calls
                  </span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {adminEfficiency.callsAutomated}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Forms
                  </span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {adminEfficiency.formsAutoCompleted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Manual Tasks Avoided
                  </span>
                  <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {adminEfficiency.manualTasksAvoided}
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
                {adminEfficiency.hoursPerWeek}
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
                {adminEfficiency.costSavings}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {adminEfficiency.costSavingsMonthly}/month projected
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
                {aiPerformance.successRate}%
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Avg resolution: {aiPerformance.avgResolutionTime}
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
                  {aiPerformance.totalInteractions}
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
                  {aiPerformance.confirmationsAchieved}
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
                  {aiPerformance.escalationsToHumans}
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
            Clinicflow is recovering <span style={{ color: 'var(--status-success)' }}>127 appointments</span> per week and saving{' '}
            <span style={{ color: 'var(--status-success)' }}>$9,180/month</span> in admin costs
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            At this rate, your investment pays for itself in operational efficiency alone
          </p>
        </div>
        </div>
      </div>

      {/* Insight Panels - rendered outside scrollable container */}
      {/* No-Show Rate Insight Panel */}
      {(() => {
        const isOpen = detailedView === 'no-show-rate';
        // #region agent log
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OwnerDashboardPage.tsx:768',message:'No-Show Rate panel render check',data:{isOpen:isOpen,detailedView:detailedView,comparison:detailedView==='no-show-rate'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        console.log('[OwnerDashboard] Rendering No-Show Rate panel, isOpen:', isOpen, 'detailedView:', detailedView);
        return (
      <InsightPanel
            isOpen={isOpen}
            onClose={() => {
              console.log('[OwnerDashboard] Closing No-Show Rate panel');
              setDetailedView(null);
            }}
        title="No-Show Reduction"
        subtitle="Clinic-wide trend and contributing factors"
      >
        <InsightSection title="Before vs After Comparison">
          <MetricComparison
            before={{ label: 'Pre-Clinicflow', value: '10.2%' }}
            after={{ label: 'Current', value: '4.2%' }}
            improvement={{ label: 'Reduction', value: '58%' }}
          />
        </InsightSection>

        <InsightSection title="Trend Overview">
          <SimpleTrendChart
            data={[
              { label: 'Week 1', value: 9.8 },
              { label: 'Week 2', value: 8.2 },
              { label: 'Week 3', value: 6.5 },
              { label: 'Week 4', value: 5.1 },
              { label: 'Week 5', value: 4.6 },
              { label: 'Current Week', value: 4.2 },
            ]}
            unit="%"
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
            {noShowByVisitType.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {item.type}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.rate}%
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full"
                  style={{ backgroundColor: 'var(--cf-neutral-20)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(item.rate / 10) * 100}%`,
                      backgroundColor: 'var(--accent-primary)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </InsightSection>

        {selectedLocation === 'all' && (
          <InsightSection title="Breakdown by Location">
            <div className="space-y-3">
              {[
                { location: 'Downtown Clinic', rate: 3.8 },
                { location: 'Westside Clinic', rate: 4.5 },
                { location: 'North Campus', rate: 4.3 },
              ].map((item) => (
                <div key={item.location}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {item.location}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.rate}%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full"
                    style={{ backgroundColor: 'var(--cf-neutral-20)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(item.rate / 10) * 100}%`,
                        backgroundColor: 'var(--accent-primary)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </InsightSection>
        )}
      </InsightPanel>
        );
      })()}

      {/* Appointments Recovered Insight Panel */}
      {(() => {
        const isOpen = detailedView === 'appointments-recovered';
        console.log('[OwnerDashboard] Rendering Appointments Recovered panel, isOpen:', isOpen, 'detailedView:', detailedView);
        return (
      <InsightPanel
            isOpen={isOpen}
            onClose={() => {
              console.log('[OwnerDashboard] Closing Appointments Recovered panel');
              setDetailedView(null);
            }}
        title="Appointments Recovered by AI"
        subtitle="Recovered cancellations and no-response slots"
      >
        <InfoCallout title="What This Means" variant="info">
          Appointments recovered when AI filled cancelled or unconfirmed slots through automated
          waitlist outreach, same-day rebooking, and confirmation conversion.
        </InfoCallout>

        <InsightSection title="Weekly Trend">
          <SimpleTrendChart
            data={[
              { label: 'Week 1', value: 89 },
              { label: 'Week 2', value: 103 },
              { label: 'Week 3', value: 118 },
              { label: 'Week 4', value: 127 },
            ]}
            unit=" appointments"
            showToggle={false}
          />
        </InsightSection>

        <InsightSection title="Recovery Sources">
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Same-Day Cancellations Filled
                </span>
                <span className="text-xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  48
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                AI contacted waitlist patients within minutes of cancellation
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Waitlist Outreach Success
                </span>
                <span className="text-xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  52
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Proactive outreach converted waitlist interest into booked appointments
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Unconfirmed Appointments Converted
                </span>
                <span className="text-xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  27
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                AI follow-ups secured confirmations that would have been no-shows
              </p>
            </div>
          </div>
        </InsightSection>

        <InsightSection title="Operational Impact">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'rgba(52, 199, 89, 0.08)' }}
            >
              <p className="text-2xl font-semibold mb-1" style={{ color: 'var(--status-success)' }}>
                $19,050
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Estimated Revenue Protected
              </p>
            </div>
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'rgba(91, 141, 239, 0.08)' }}
            >
              <p className="text-2xl font-semibold mb-1" style={{ color: 'var(--accent-primary)' }}>
                94%
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Handled Fully by AI
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
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OwnerDashboardPage.tsx:999',message:'Admin Hours Saved panel render check',data:{isOpen:isOpen,detailedView:detailedView,comparison:detailedView==='admin-hours-saved'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        console.log('[OwnerDashboard] Rendering Admin Hours Saved panel, isOpen:', isOpen, 'detailedView:', detailedView);
        return (
      <InsightPanel
            isOpen={isOpen}
            onClose={() => {
              console.log('[OwnerDashboard] Closing Admin Hours Saved panel');
              setDetailedView(null);
            }}
        title="Admin Hours Saved"
        subtitle="Time saved through automation"
      >
        <InfoCallout title="How This Is Calculated" variant="neutral">
          We track every automated confirmation call, intake reminder, and reschedule coordination
          handled by AI. Each is converted into time saved based on average manual task duration
          (confirmation = 3min, intake follow-up = 5min, reschedule = 7min).
        </InfoCallout>

        <InsightSection title="Time Breakdown">
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Confirmation Handling
                </span>
                <span className="text-xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  17.1 hrs
                </span>
              </div>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.1)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: '40%',
                    backgroundColor: 'var(--accent-primary)',
                  }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                342 automated calls × 3 min avg = 17.1 hours
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Intake Reminders
                </span>
                <span className="text-xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  16.5 hrs
                </span>
              </div>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.1)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: '39%',
                    backgroundColor: 'var(--accent-primary)',
                  }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                198 automated form completions × 5 min avg = 16.5 hours
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Reschedule Coordination
                </span>
                <span className="text-xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  8.9 hrs
                </span>
              </div>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.1)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: '21%',
                    backgroundColor: 'var(--accent-primary)',
                  }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                76 automated reschedules × 7 min avg = 8.9 hours
              </p>
            </div>
          </div>
        </InsightSection>

        <InsightSection title="Business Context">
          <InfoCallout variant="success">
            <p className="font-semibold mb-2">≈ Half an admin role per week</p>
            <p>
              42.5 hours saved equals approximately 53% of a full-time admin's workweek. This allows
              your team to focus on complex patient needs, in-person interactions, and higher-value tasks.
            </p>
          </InfoCallout>
        </InsightSection>

        <InsightSection title="Efficiency Improvement Over Time">
          <SimpleTrendChart
            data={[
              { label: 'Month 1', value: 28 },
              { label: 'Month 2', value: 35 },
              { label: 'Month 3', value: 42.5 },
            ]}
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
        fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'OwnerDashboardPage.tsx:1135',message:'Clinic Utilization panel render check',data:{isOpen:isOpen,detailedView:detailedView,comparison:detailedView==='clinic-utilization'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        console.log('[OwnerDashboard] Rendering Clinic Utilization panel, isOpen:', isOpen, 'detailedView:', detailedView);
        return (
      <InsightPanel
            isOpen={isOpen}
            onClose={() => {
              console.log('[OwnerDashboard] Closing Clinic Utilization panel');
              setDetailedView(null);
            }}
        title="Clinic Utilization"
        subtitle="Capacity usage across appointments"
      >
        <InsightSection title="Utilization Trend">
          <SimpleTrendChart
            data={[
              { label: 'Week 1', value: 72 },
              { label: 'Week 2', value: 78 },
              { label: 'Week 3', value: 83 },
              { label: 'Current Week', value: 87 },
            ]}
            unit="%"
            showToggle={false}
          />
        </InsightSection>

        <InsightSection title="Capacity Breakdown">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                In-Clinic Utilization
              </p>
              <p className="text-3xl font-semibold mb-3" style={{ color: 'var(--accent-primary)' }}>
                91%
              </p>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.2)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: '91%',
                    backgroundColor: 'var(--accent-primary)',
                  }}
                />
              </div>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Video Utilization
              </p>
              <p className="text-3xl font-semibold mb-3" style={{ color: 'var(--accent-primary)' }}>
                78%
              </p>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.2)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: '78%',
                    backgroundColor: 'var(--accent-primary)',
                  }}
                />
              </div>
            </div>
          </div>
        </InsightSection>

        <InsightSection title="Missed Capacity Drivers">
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'rgba(255, 149, 0, 0.08)' }}
            >
              <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  No-Shows
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  4.2% of total capacity
                </p>
              </div>
              <span className="text-xl font-semibold" style={{ color: 'var(--status-warning)' }}>
                4.2%
              </span>
              </div>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'rgba(255, 149, 0, 0.2)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: '4.2%',
                    backgroundColor: 'var(--status-warning)',
                  }}
                />
              </div>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'rgba(255, 149, 0, 0.08)' }}
            >
              <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Late Cancellations
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  3.8% of total capacity
                </p>
              </div>
              <span className="text-xl font-semibold" style={{ color: 'var(--status-warning)' }}>
                3.8%
              </span>
              </div>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'rgba(255, 149, 0, 0.2)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: '3.8%',
                    backgroundColor: 'var(--status-warning)',
                  }}
                />
              </div>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'rgba(255, 149, 0, 0.08)' }}
            >
              <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Unfilled Gaps
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  5.0% of total capacity
                </p>
              </div>
              <span className="text-xl font-semibold" style={{ color: 'var(--status-warning)' }}>
                5.0%
              </span>
              </div>
              <div 
                className="h-2 rounded-full"
                style={{ backgroundColor: 'rgba(255, 149, 0, 0.2)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ 
                    width: '5.0%',
                    backgroundColor: 'var(--status-warning)',
                  }}
                />
              </div>
            </div>
          </div>
        </InsightSection>

        <InsightSection title="AI-Driven Opportunity">
          <InfoCallout variant="success">
            <p className="font-semibold mb-2">68% of unused capacity addressed via AI workflows</p>
            <p>
              Of the 13% unused capacity, Clinicflow's AI automation has successfully recovered
              68% through automated confirmations, waitlist management, and same-day slot filling—
              preventing revenue loss and maximizing provider schedules.
            </p>
          </InfoCallout>
        </InsightSection>
      </InsightPanel>
        );
      })()}
    </>
  );
}