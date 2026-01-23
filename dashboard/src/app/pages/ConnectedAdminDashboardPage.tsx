import { useState } from 'react';
import { Users, AlertCircle, FileText, Phone, Clock, ChevronRight, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { StatusChip } from '../components/foundation/StatusChip';
import { VoiceActivityPanel, generateMockVoiceCalls } from '../components/VoiceActivityPanel';
import { useAdminDashboard, useNeedsAttention } from '../hooks/useApi';
import { appointments as appointmentsApi } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyConfirmationData = [
  { day: 'Mon', rate: 85 },
  { day: 'Tue', rate: 88 },
  { day: 'Wed', rate: 92 },
  { day: 'Thu', rate: 90 },
  { day: 'Fri', rate: 87 },
  { day: 'Sat', rate: 80 },
  { day: 'Sun', rate: 75 },
];

const noShowTrendData = [
  { week: 'W1', noShows: 3 },
  { week: 'W2', noShows: 2 },
  { week: 'W3', noShows: 4 },
  { week: 'W4', noShows: 1 },
];

export function ConnectedAdminDashboardPage() {
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unconfirmed' | 'missing-intake'>('all');

  // Fetch data from backend
  const { data: dashboardData, loading, error, refetch } = useAdminDashboard(selectedDate);
  const { data: needsAttentionData, refetch: refetchAttention } = useNeedsAttention(activeFilter);

  const handleConfirm = async (id: string) => {
    try {
      await appointmentsApi.confirm(id);
      refetch();
      refetchAttention();
    } catch (err) {
      console.error('Failed to confirm appointment:', err);
    }
  };

  const handleMarkArrived = async (id: string) => {
    try {
      await appointmentsApi.markArrived(id);
      refetch();
    } catch (err) {
      console.error('Failed to mark arrived:', err);
    }
  };

  const handleCancel = async (id: string, reason: string) => {
    try {
      await appointmentsApi.cancel(id, { cancellation_type: 'clinic-cancelled', reason_note: reason });
      refetch();
      refetchAttention();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    }
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

  const stats = dashboardData?.stats || {
    total_appointments: 0,
    confirmed: 0,
    unconfirmed: 0,
    missing_intake: 0,
    voice_ai_alerts: 0,
  };

  const needsAttention = dashboardData?.needs_attention || [];
  const todaysSchedule = dashboardData?.todays_schedule || [];

  const filteredSchedule = todaysSchedule.filter(apt => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unconfirmed') return !apt.status.confirmed;
    if (activeFilter === 'missing-intake') return !apt.status.intake_complete;
    return true;
  });

  const recentActivity = [
    { time: '10:12 AM', patient: 'Sarah Martinez', action: 'confirmed via voice call', type: 'success' },
    { time: '10:18 AM', patient: 'Thomas Lee', action: 'submitted intake form', type: 'info' },
    { time: '10:24 AM', patient: 'David Kim', action: 'rescheduled automatically', type: 'info' },
    { time: '10:31 AM', patient: 'Emily Johnson', action: 'needs confirmation', type: 'warning' },
  ];

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1800px] mx-auto">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card elevation="2" radius="md">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveFilter('all')}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.total_appointments}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Appointments
                </div>
              </div>
            </div>
          </Card>

          <Card elevation="2" radius="md">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--status-success-bg)' }}
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--status-success)' }} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.confirmed}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Confirmed
                </div>
              </div>
            </div>
          </Card>

          <Card elevation="2" radius="md">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveFilter('unconfirmed')}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--status-warning-bg)' }}
              >
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--status-warning)' }} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.unconfirmed}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Unconfirmed
                </div>
              </div>
            </div>
          </Card>

          <Card elevation="2" radius="md">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveFilter('missing-intake')}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--status-error-bg)' }}
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--status-error)' }} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.missing_intake}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Missing Intake
                </div>
              </div>
            </div>
          </Card>

          <Card elevation="2" radius="md" onClick={() => setVoicePanelOpen(true)}>
            <div className="flex items-center gap-3 cursor-pointer">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.voice_ai_alerts}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Voice AI Alerts
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Needs Attention */}
          <div className="lg:col-span-2">
            <Card elevation="2" radius="md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Needs Attention
                </h2>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {needsAttention.length} items
                </span>
              </div>
              
              <div className="space-y-3">
                {needsAttention.length === 0 ? (
                  <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                    No items need attention
                  </div>
                ) : (
                  needsAttention.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg transition-colors"
                      style={{ backgroundColor: 'var(--surface-elevated)' }}
                      onMouseEnter={() => setHoveredRow(item.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {item.patient_name}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {item.time} • {item.doctor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusChip
                          variant={item.issue === 'unconfirmed' ? 'warning' : 'error'}
                          size="sm"
                          label={item.issue === 'unconfirmed' ? 'Unconfirmed' : 'Missing Intake'}
                        />
                        {item.issue === 'unconfirmed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConfirm(item.id)}
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card elevation="2" radius="md">
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2"
                      style={{ 
                        backgroundColor: activity.type === 'success' 
                          ? 'var(--status-success)' 
                          : activity.type === 'warning' 
                            ? 'var(--status-warning)' 
                            : 'var(--accent-primary)' 
                      }}
                    />
                    <div>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        <span className="font-medium">{activity.patient}</span> {activity.action}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Today's Schedule */}
        <Card elevation="2" radius="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Today's Schedule
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {filteredSchedule.length} appointments
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {filteredSchedule.length === 0 ? (
              <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                No appointments scheduled
              </div>
            ) : (
              filteredSchedule.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--surface-elevated)' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)', minWidth: '80px' }}>
                      {apt.time}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {apt.patient_name}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {apt.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusChip
                      variant={apt.visit_type === 'virtual' ? 'info' : 'neutral'}
                      size="sm"
                      label={apt.visit_type === 'virtual' ? 'Virtual' : 'In-Clinic'}
                    />
                    <StatusChip
                      variant={apt.status.confirmed ? 'success' : 'warning'}
                      size="sm"
                      label={apt.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
                    />
                    <StatusChip
                      variant={apt.status.intake_complete ? 'success' : 'error'}
                      size="sm"
                      label={apt.status.intake_complete ? 'Intake Done' : 'Missing Intake'}
                    />
                    {!apt.status.confirmed && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirm(apt.id)}
                      >
                        Confirm
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card elevation="2" radius="md">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Weekly Confirmation Rate
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyConfirmationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                  <XAxis dataKey="day" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="var(--accent-primary)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--accent-primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card elevation="2" radius="md">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              No-Show Trend
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={noShowTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                  <XAxis dataKey="week" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip />
                  <Bar dataKey="noShows" fill="var(--status-error)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Voice Activity Panel */}
      <VoiceActivityPanel
        isOpen={voicePanelOpen}
        onClose={() => setVoicePanelOpen(false)}
        calls={generateMockVoiceCalls()}
      />
    </>
  );
}

export default ConnectedAdminDashboardPage;
