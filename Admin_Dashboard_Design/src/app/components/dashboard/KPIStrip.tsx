import { TrendingUp, TrendingDown, Users, UserPlus, Calendar, AlertCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface KPICardProps {
  label: string;
  value: number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  sparklineData?: number[];
  variant?: 'default' | 'warning';
  isSelected?: boolean;
  onClick?: () => void;
}

function KPICard({ label, value, change, changeLabel, icon, trend, sparklineData, variant = 'default', isSelected = false, onClick }: KPICardProps) {
  const isPositive = change >= 0;
  
  // Color mapping for each KPI type
  const getSparklineColor = () => {
    if (variant === 'warning') return '#F59E0B'; // Amber for at-risk
    if (label === 'New Registrations') return '#10B981'; // Teal/green for registrations
    return '#5B8DEF'; // Blue for patients and appointments
  };
  
  const sparklineColor = getSparklineColor();
  
  // Format sparkline data for recharts
  const chartData = sparklineData?.map((val, idx) => ({ value: val, index: idx })) || [];

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: isSelected ? 'rgba(91, 141, 239, 0.04)' : 'white',
        border: isSelected ? '2px solid #5B8DEF' : '1px solid var(--border-default)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: isSelected ? '0 2px 8px rgba(91, 141, 239, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.01)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
          e.currentTarget.style.backgroundColor = 'white';
        }
      }}
    >
      {/* Header with icon and label */}
      <div className="flex items-center justify-between">
        <span style={{
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: 500,
        }}>
          {label}
        </span>
        <div style={{ 
          color: variant === 'warning' ? '#F59E0B' : 'var(--accent-primary)',
          opacity: 0.7,
        }}>
          {icon}
        </div>
      </div>

      {/* Main value and trend */}
      <div className="flex items-end justify-between">
        <div>
          <div style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1,
            marginBottom: '6px',
          }}>
            {value.toLocaleString()}
          </div>
          
          {/* Change indicator */}
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-3 h-3" style={{ color: variant === 'warning' ? '#F59E0B' : '#10B981' }} />
            ) : (
              <TrendingDown className="w-3 h-3" style={{ color: '#EF4444' }} />
            )}
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: isPositive ? (variant === 'warning' ? '#F59E0B' : '#10B981') : '#EF4444',
            }}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
            }}>
              {changeLabel}
            </span>
          </div>
        </div>

        {/* Sparkline - improved design */}
        {sparklineData && sparklineData.length > 0 && (
          <div style={{ width: '70px', height: '36px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={sparklineColor}
                  strokeWidth={2}
                  fill="none"
                  animationDuration={300}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </button>
  );
}

interface KPIStripProps {
  totalPatients: number;
  newRegistrations: number;
  totalAppointments: number;
  atRiskPatients: number;
  patientsTrend?: number;
  registrationsTrend?: number;
  appointmentsTrend?: number;
  atRiskTrend?: number;
  patientsSparkline?: number[];
  registrationsSparkline?: number[];
  appointmentsSparkline?: number[];
  atRiskSparkline?: number[];
  selectedKPI?: 'patients' | 'registrations' | 'appointments' | 'at-risk' | null;
  onKPISelect?: (kpi: 'patients' | 'registrations' | 'appointments' | 'at-risk') => void;
}

export function KPIStrip({
  totalPatients,
  newRegistrations,
  totalAppointments,
  atRiskPatients,
  patientsTrend = 0,
  registrationsTrend = 0,
  appointmentsTrend = 0,
  atRiskTrend = 0,
  patientsSparkline,
  registrationsSparkline,
  appointmentsSparkline,
  atRiskSparkline,
  selectedKPI = 'appointments',
  onKPISelect,
}: KPIStripProps) {
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}>
        <KPICard
          label="Total Patients"
          value={totalPatients}
          change={patientsTrend}
          changeLabel="vs last week"
          icon={<Users className="w-5 h-5" />}
          sparklineData={patientsSparkline}
          isSelected={selectedKPI === 'patients'}
          onClick={() => onKPISelect?.('patients')}
        />
        
        <KPICard
          label="New Registrations"
          value={newRegistrations}
          change={registrationsTrend}
          changeLabel="vs last week"
          icon={<UserPlus className="w-5 h-5" />}
          sparklineData={registrationsSparkline}
          isSelected={selectedKPI === 'registrations'}
          onClick={() => onKPISelect?.('registrations')}
        />
        
        <KPICard
          label="Total Appointments"
          value={totalAppointments}
          change={appointmentsTrend}
          changeLabel="vs last month"
          icon={<Calendar className="w-5 h-5" />}
          sparklineData={appointmentsSparkline}
          isSelected={selectedKPI === 'appointments'}
          onClick={() => onKPISelect?.('appointments')}
        />
        
        <KPICard
          label="At-Risk Patients"
          value={atRiskPatients}
          change={atRiskTrend}
          changeLabel="vs last week"
          icon={<AlertCircle className="w-5 h-5" />}
          sparklineData={atRiskSparkline}
          variant="warning"
          isSelected={selectedKPI === 'at-risk'}
          onClick={() => onKPISelect?.('at-risk')}
        />
      </div>
      
      {/* Helper text */}
      <p style={{
        marginTop: '8px',
        marginBottom: 0,
        fontSize: '11px',
        color: 'var(--text-muted)',
      }}>
        Selecting a KPI filters Patients by Doctor, Appointment Status, Today's Schedule, and Needs Attention.
      </p>
    </div>
  );
}