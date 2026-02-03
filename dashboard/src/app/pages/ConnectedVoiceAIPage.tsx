import { useState } from 'react';
import { 
  Phone, 
  PhoneCall,
  PhoneOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Filter,
  TrendingUp,
  Users,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { useVoiceAIStats, useVoiceAILogs } from '../hooks/useApi';
import { useClinicFormat } from '../hooks/useClinicFormat';

export function ConnectedVoiceAIPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [callTypeFilter, setCallTypeFilter] = useState<string>('all');
  const { formatDateTime } = useClinicFormat();

  // Fetch data from backend
  const { data: statsData, loading: statsLoading, error: statsError, refetch: refetchStats } = useVoiceAIStats();
  const { data: logsData, loading: logsLoading, error: logsError, refetch: refetchLogs } = useVoiceAILogs({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    call_type: callTypeFilter !== 'all' ? callTypeFilter : undefined,
    limit: 50
  });

  const loading = statsLoading || logsLoading;
  const error = statsError || logsError;

  if (loading && !statsData) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading Voice AI data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--surface-card)' }}>
          <AlertCircle className="w-8 h-8" style={{ color: 'var(--status-error)' }} />
          <p style={{ color: 'var(--text-primary)' }}>Failed to load Voice AI data</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => { refetchStats(); refetchLogs(); }}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = statsData?.stats || {
    total_calls: 0,
    successful_calls: 0,
    failed_calls: 0,
    escalated_calls: 0,
    avg_duration_seconds: 0,
    confirmations_achieved: 0,
    success_rate: 0
  };

  const logs = logsData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--status-success)';
      case 'failed': return 'var(--status-error)';
      case 'in_progress': return 'var(--accent-primary)';
      case 'pending': return 'var(--status-warning)';
      default: return 'var(--text-muted)';
    }
  };

  const getOutcomeIcon = (outcome: string | null) => {
    switch (outcome) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" style={{ color: 'var(--status-success)' }} />;
      case 'rescheduled': return <Clock className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />;
      case 'cancelled': return <PhoneOff className="w-4 h-4" style={{ color: 'var(--status-error)' }} />;
      case 'escalated': return <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />;
      default: return <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="h-screen overflow-auto p-6" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Voice AI
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Automated appointment confirmations and reminders
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card elevation="2" radius="md">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
              >
                <PhoneCall className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <div className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.total_calls}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Total Calls
                </div>
              </div>
            </div>
          </Card>

          <Card elevation="2" radius="md">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--status-success-bg)' }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: 'var(--status-success)' }} />
              </div>
              <div>
                <div className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.confirmations_achieved}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Confirmations
                </div>
              </div>
            </div>
          </Card>

          <Card elevation="2" radius="md">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
              >
                <TrendingUp className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <div className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.success_rate}%
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Success Rate
                </div>
              </div>
            </div>
          </Card>

          <Card elevation="2" radius="md">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--status-warning-bg)' }}
              >
                <AlertCircle className="w-6 h-6" style={{ color: 'var(--status-warning)' }} />
              </div>
              <div>
                <div className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {stats.escalated_calls}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Escalations
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Filter:</span>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={callTypeFilter}
            onChange={(e) => setCallTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">All Types</option>
            <option value="confirmation">Confirmation</option>
            <option value="reminder">Reminder</option>
            <option value="follow_up">Follow Up</option>
            <option value="intake_request">Intake Request</option>
          </select>
        </div>

        {/* Call Logs */}
        <Card elevation="2" radius="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Calls
            </h2>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {logs.length} calls
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No call logs found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--surface-elevated)' }}
                >
                  <div className="flex items-center gap-4">
                    {/* Status Indicator */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${getStatusColor(log.status)}20` }}
                    >
                      {getOutcomeIcon(log.outcome)}
                    </div>

                    {/* Call Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {log.call_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: `${getStatusColor(log.status)}20`,
                            color: getStatusColor(log.status)
                          }}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        {log.to_number && (
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {log.to_number}
                          </span>
                        )}
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {formatDateTime(log.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Duration & Outcome */}
                  <div className="text-right">
                    {log.duration_seconds > 0 && (
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {formatDuration(log.duration_seconds)}
                      </p>
                    )}
                    {log.outcome && (
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {log.outcome.replace('_', ' ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AI Performance Summary */}
        <Card elevation="2" radius="md">
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--cf-neutral-20)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                AI Performance Summary
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {statsData?.date_range?.from} to {statsData?.date_range?.to}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--cf-neutral-20)' }}>
              <p className="text-4xl font-semibold mb-2" style={{ color: 'var(--accent-primary)' }}>
                {stats.success_rate}%
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Overall Success Rate
              </p>
            </div>

            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(52, 199, 89, 0.08)' }}>
              <p className="text-4xl font-semibold mb-2" style={{ color: 'var(--status-success)' }}>
                {stats.successful_calls}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Successful Calls
              </p>
            </div>

            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(91, 141, 239, 0.08)' }}>
              <p className="text-4xl font-semibold mb-2" style={{ color: 'var(--accent-primary)' }}>
                {formatDuration(Math.round(stats.avg_duration_seconds))}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Avg Call Duration
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ConnectedVoiceAIPage;
