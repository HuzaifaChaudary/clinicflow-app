import { useState } from 'react';
import { Users, AlertCircle, FileText, Phone, Clock, ChevronRight, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { StatusChip } from '../components/foundation/StatusChip';
import { VoiceActivityPanel, generateMockVoiceCalls } from '../components/VoiceActivityPanel';
import { Appointment } from '../components/AppointmentRow';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardPageProps {
  appointments: Appointment[];
  onConfirm: (id: string) => void;
  onMarkArrived: (id: string) => void;
  onMarkNoShow: (id: string) => void;
}

// Mock data for graphs
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

export function AdminDashboardPage({
  appointments,
  onConfirm,
  onMarkArrived,
  onMarkNoShow,
}: AdminDashboardPageProps) {
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status.confirmed).length,
    unconfirmed: appointments.filter(a => !a.status.confirmed).length,
    missingIntake: appointments.filter(a => !a.status.intakeComplete).length,
    voiceCalls: 12,
  };

  const exceptions = appointments.filter(a => !a.status.confirmed || !a.status.intakeComplete);
  
  const recentActivity = [
    { time: '10:12 AM', patient: 'Sarah Martinez', action: 'confirmed via voice call', type: 'success' },
    { time: '10:18 AM', patient: 'Thomas Lee', action: 'submitted intake form', type: 'info' },
    { time: '10:24 AM', patient: 'David Kim', action: 'rescheduled automatically', type: 'info' },
    { time: '10:31 AM', patient: 'Emily Johnson', action: 'needs confirmation', type: 'warning' },
  ];

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Dashboard
                </h1>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>Today's signal:</span>
                  <span>Operational overview for today's clinic schedule</span>
                </div>
              </div>

              {/* Ava Status Pill */}
              <div
                className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shrink-0"
                style={{
                  backgroundColor: 'var(--accent-primary-bg)',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--accent-primary)',
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>
                  Ava Ops · 3 pending intakes · 2 alerts
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Strip */}
          <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
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
              <span style={{ color: 'var(--status-success)' }}>
                ↑ 18% more tasks automated vs last week
              </span>
            </div>
          </div>
        </div>

        {/* Top Metrics (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card elevation="2" radius="md">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.total}
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
            <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--status-info-bg)' }}
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--status-info)' }} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.missingIntake}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Missing intake
                </div>
              </div>
            </div>
          </Card>

          <Card elevation="2" radius="md" interactive onClick={() => setVoicePanelOpen(true)}>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.voiceCalls}
                </div>
                <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Voice calls
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>
              View activity →
            </div>
          </Card>
        </div>

        {/* Graphs Row (Admin Only) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Confirmation Rate */}
          <Card elevation="2" radius="lg">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ color: 'var(--text-primary)' }}>Weekly Confirmation Rate</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyConfirmationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-default)' }}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-default)' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-2)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="var(--accent-primary)" 
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--accent-primary)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* No-Show Trend */}
          <Card elevation="2" radius="lg">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--status-error)' }} />
              <h3 style={{ color: 'var(--text-primary)' }}>No-Show Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={noShowTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-default)' }}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-default)' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-2)',
                  }}
                />
                <Bar 
                  dataKey="noShows" 
                  fill="var(--status-error)" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule (Responsive) */}
          <div className="lg:col-span-2">
            <Card padding="none" elevation="2" radius="lg">
              <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b" style={{ borderColor: 'var(--border-default)' }}>
                <h2 style={{ color: 'var(--text-primary)' }}>Today's Schedule</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {appointments.length} appointments
                </p>
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 motion-hover"
                    style={{
                      backgroundColor: hoveredRow === appointment.id ? 'var(--surface-hover)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredRow(appointment.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center gap-5">
                      {/* Time */}
                      <div className="w-20 shrink-0">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {appointment.time}
                          </span>
                        </div>
                      </div>

                      {/* Patient & Provider */}
                      <div className="w-52 shrink-0">
                        <div className="font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
                          {appointment.patientName}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {appointment.provider}
                        </div>
                      </div>

                      {/* Status Chips */}
                      <div className="flex items-center gap-2 flex-1 flex-wrap">
                        <StatusChip 
                          type={appointment.status.confirmed ? 'confirmed' : 'unconfirmed'}
                          size="sm"
                        />
                        <StatusChip 
                          type={appointment.status.intakeComplete ? 'intake-complete' : 'intake-missing'}
                          size="sm"
                        />
                        {appointment.arrived && <StatusChip type="arrived" size="sm" />}
                        {appointment.noShow && <StatusChip type="no-show" size="sm" />}
                        {appointment.indicators.voiceCallSent && <StatusChip type="voice" size="sm" />}
                      </div>

                      {/* Actions */}
                      <div 
                        className="flex items-center gap-2 motion-hover"
                        style={{ opacity: hoveredRow === appointment.id ? 1 : 0 }}
                      >
                        {!appointment.status.confirmed && (
                          <Button variant="secondary" size="sm" onClick={() => onConfirm(appointment.id)}>
                            Confirm
                          </Button>
                        )}
                        {!appointment.arrived && !appointment.noShow && appointment.status.confirmed && (
                          <Button variant="secondary" size="sm" onClick={() => onMarkArrived(appointment.id)}>
                            Arrived
                          </Button>
                        )}
                      </div>

                      <button className="p-2 rounded-full motion-hover" style={{ color: 'var(--text-muted)' }}>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile/Tablet Layout */}
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                            {appointment.patientName}
                          </div>
                          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{appointment.time}</span>
                            <span>•</span>
                            <span>{appointment.provider}</span>
                          </div>
                        </div>
                        <button className="p-2" style={{ color: 'var(--text-muted)' }}>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusChip 
                          type={appointment.status.confirmed ? 'confirmed' : 'unconfirmed'}
                          size="sm"
                        />
                        <StatusChip 
                          type={appointment.status.intakeComplete ? 'intake-complete' : 'intake-missing'}
                          size="sm"
                        />
                        {appointment.arrived && <StatusChip type="arrived" size="sm" />}
                      </div>

                      {!appointment.status.confirmed && (
                        <Button variant="secondary" size="sm" fullWidth onClick={() => onConfirm(appointment.id)}>
                          Confirm Appointment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Exceptions */}
            <Card elevation="2" radius="lg">
              <div className="flex items-center gap-2 mb-5">
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--status-warning)' }} />
                <h3 style={{ color: 'var(--text-primary)' }}>Needs Attention</h3>
                {exceptions.length > 0 && (
                  <div 
                    className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--status-warning-bg)',
                      color: 'var(--status-warning)',
                    }}
                  >
                    {exceptions.length}
                  </div>
                )}
              </div>

              {exceptions.length === 0 ? (
                <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                  All clear
                </div>
              ) : (
                <div className="space-y-3">
                  {exceptions.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl motion-state cursor-pointer"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        border: '1.5px solid var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      }}
                    >
                      <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                        {item.patientName}
                      </div>
                      <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {item.time} • {item.provider}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {!item.status.confirmed && <StatusChip type="unconfirmed" size="sm" />}
                        {!item.status.intakeComplete && <StatusChip type="intake-missing" size="sm" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card elevation="2" radius="lg">
              <div className="flex items-center justify-between mb-5">
                <h3 style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
                <div className="w-2 h-2 rounded-full animate-gentle-pulse" style={{ backgroundColor: 'var(--status-success)' }} />
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const dotColor = 
                    activity.type === 'success' ? 'var(--status-success)' :
                    activity.type === 'warning' ? 'var(--status-warning)' :
                    'var(--status-info)';

                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: dotColor }} />
                      <div className="flex-1">
                        <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
                          {activity.time}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {activity.patient}
                          </span>{' '}
                          {activity.action}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
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