import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChevronDown } from 'lucide-react';

interface DoctorData {
  name: string;
  patients: number;
  color: string;
}

interface PatientsByDoctorChartProps {
  data: DoctorData[];
  onDoctorSelect?: (doctorName: string | null) => void;
  selectedKPI?: 'patients' | 'registrations' | 'appointments' | 'at-risk';
  selectedDoctor?: string | null;
}

export function PatientsByDoctorChart({ data, onDoctorSelect, selectedKPI = 'appointments', selectedDoctor = null }: PatientsByDoctorChartProps) {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDoctorClick = (doctorName: string) => {
    // Toggle: if clicking the same doctor, deselect; otherwise select the new one
    const newSelection = selectedDoctor === doctorName ? null : doctorName;
    onDoctorSelect?.(newSelection);
  };

  const totalPatients = data.reduce((sum, item) => sum + item.patients, 0);

  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
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
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: '4px',
          }}>
            Patients by Doctor
          </h3>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            Filter by doctor to update schedule and queue.
          </p>
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
      <div style={{ flex: 1, minHeight: 0, marginTop: '16px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
              dataKey="patients"
              onClick={handleDoctorClick}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={selectedDoctor === entry.name ? '#000' : 'transparent'}
                  strokeWidth={selectedDoctor === entry.name ? 2 : 0}
                  opacity={selectedDoctor && selectedDoctor !== entry.name ? 0.3 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid var(--border-default)',
                borderRadius: '6px',
                fontSize: '12px',
                padding: '8px 12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: any) => [`${value} patients`, '']}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div
          style={{
            position: 'absolute',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {totalPatients}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginTop: '4px',
          }}>
            Total Patients
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '8px',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {data.map((doctor, index) => (
          <button
            key={index}
            onClick={() => handleDoctorClick(doctor.name)}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{
              border: selectedDoctor === doctor.name ? '1px solid var(--accent-primary)' : '1px solid transparent',
              backgroundColor: selectedDoctor === doctor.name ? 'rgba(91, 141, 239, 0.04)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedDoctor !== doctor.name) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDoctor !== doctor.name) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                backgroundColor: doctor.color,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {doctor.name}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
              }}>
                {doctor.patients} patients
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}