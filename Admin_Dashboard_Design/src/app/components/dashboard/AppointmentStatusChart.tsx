import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

interface AppointmentStatusChartProps {
  weeklyData?: any[];
  monthlyData?: any[];
  selectedKPI?: 'patients' | 'registrations' | 'appointments' | 'at-risk';
}

export function AppointmentStatusChart({ weeklyData, monthlyData, selectedKPI = 'appointments' }: AppointmentStatusChartProps) {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const [showDropdown, setShowDropdown] = useState(false);

  // Default weekly data
  const defaultWeeklyData = [
    { day: 'Mon', upcoming: 45, completed: 38, cancelled: 5, noshow: 2 },
    { day: 'Tue', upcoming: 52, completed: 42, cancelled: 4, noshow: 3 },
    { day: 'Wed', upcoming: 48, completed: 45, cancelled: 6, noshow: 1 },
    { day: 'Thu', upcoming: 55, completed: 40, cancelled: 3, noshow: 4 },
    { day: 'Fri', upcoming: 60, completed: 50, cancelled: 7, noshow: 3 },
    { day: 'Sat', upcoming: 35, completed: 30, cancelled: 2, noshow: 1 },
    { day: 'Sun', upcoming: 25, completed: 20, cancelled: 1, noshow: 1 },
  ];

  // Default monthly data
  const defaultMonthlyData = [
    { week: 'Week 1', upcoming: 320, completed: 280, cancelled: 25, noshow: 15 },
    { week: 'Week 2', upcoming: 340, completed: 300, cancelled: 20, noshow: 12 },
    { week: 'Week 3', upcoming: 360, completed: 310, cancelled: 30, noshow: 18 },
    { week: 'Week 4', upcoming: 350, completed: 295, cancelled: 22, noshow: 14 },
  ];

  const data = timeRange === 'weekly' ? (weeklyData || defaultWeeklyData) : (monthlyData || defaultMonthlyData);

  const statusConfig = [
    { key: 'upcoming', label: 'Upcoming', color: '#5B8DEF' },
    { key: 'completed', label: 'Completed', color: '#10B981' },
    { key: 'cancelled', label: 'Cancelled', color: '#6B7280' },
    { key: 'noshow', label: 'No-show', color: '#EF4444' },
  ];

  const timeRangeOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--border-default)',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            Appointment Status Overview
          </h3>
        </div>

        {/* Time range dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {timeRangeOptions.find(opt => opt.value === timeRange)?.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: 'white',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                minWidth: '120px',
              }}
            >
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTimeRange(option.value as any);
                    setShowDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '13px',
                    color: timeRange === option.value ? 'var(--accent-primary)' : 'var(--text-primary)',
                    backgroundColor: timeRange === option.value ? 'rgba(91, 141, 239, 0.05)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: timeRange === option.value ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (timeRange !== option.value) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (timeRange !== option.value) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--border-subtle)" 
              vertical={false}
            />
            <XAxis 
              dataKey={timeRange === 'weekly' ? 'day' : 'week'}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-default)' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-default)' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid var(--border-default)',
                borderRadius: '6px',
                fontSize: '12px',
                padding: '8px 12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
              cursor={{ fill: 'rgba(91, 141, 239, 0.05)' }}
            />
            {statusConfig.map((status) => (
              <Bar
                key={status.key}
                dataKey={status.key}
                fill={status.color}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'center',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {statusConfig.map((status) => (
          <div key={status.key} className="flex items-center gap-2">
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                backgroundColor: status.color,
              }}
            />
            <span style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}>
              {status.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}