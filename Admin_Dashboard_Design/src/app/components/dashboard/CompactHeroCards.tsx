import { useState } from 'react';
import { Calendar, CheckCircle, AlertCircle, FileX, Phone, XCircle, ChevronRight, ChevronLeft, ExternalLink, TrendingUp } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface CompactHeroCardsProps {
  stats: {
    total: number;
    confirmed: number;
    unconfirmed: number;
    missingIntake: number;
    voiceCalls: number;
  };
  featuredAppointment: Appointment | null;
  onCall: (id: string) => void;
  onSendIntake: (id: string) => void;
  onViewProfile: (id: string) => void;
}

type MetricType = 'total' | 'at-risk' | 'no-show' | 'ai-calls';

export function CompactHeroCards({
  stats,
  featuredAppointment,
  onCall,
  onSendIntake,
  onViewProfile,
}: CompactHeroCardsProps) {
  const [showCalendarPopover, setShowCalendarPopover] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeMetric, setActiveMetric] = useState<MetricType>('no-show');
  const [dateFieldHovered, setDateFieldHovered] = useState(false);

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.3fr 1fr',
        gap: '16px',
        maxWidth: '100%',
        margin: '0',
      }}
    >
      {/* LEFT CARD - Date Control with Popover Calendar */}
      <div 
        style={{
          position: 'relative',
          backgroundColor: 'white',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          padding: '20px',
        }}
      >
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: '0 0 8px 0',
        }}>
          Date Control
        </p>

        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '18px',
          fontWeight: 600,
          margin: '0 0 16px 0',
        }}>
          Today
        </h3>

        {/* Clickable date field */}
        <button
          onClick={() => setShowCalendarPopover(!showCalendarPopover)}
          onMouseEnter={() => setDateFieldHovered(true)}
          onMouseLeave={() => setDateFieldHovered(false)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '6px',
            backgroundColor: 'var(--surface-canvas)',
            border: dateFieldHovered ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
            marginBottom: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease',
            boxShadow: dateFieldHovered ? '0 0 0 2px rgba(91, 141, 239, 0.1)' : 'none',
          }}
        >
          <p style={{
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 500,
            margin: 0,
          }}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              year: 'numeric' 
            })}
          </p>
          <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        </button>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '10px',
          margin: '0 0 4px 0',
        }}>
          Tap the date or Today to open the calendar.
        </p>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '11px',
          margin: '0 0 16px 0',
        }}>
          Choose a date to update schedule and queue.
        </p>

        <button
          onClick={() => setShowCalendarPopover(!showCalendarPopover)}
          className="motion-hover"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            fontSize: '13px',
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Calendar className="w-4 h-4" />
          <span>Today</span>
        </button>

        {/* Calendar Popover */}
        {showCalendarPopover && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '20px',
              zIndex: 50,
              backgroundColor: 'white',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '16px',
              width: '280px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-6px',
                left: '24px',
                width: '12px',
                height: '12px',
                backgroundColor: 'white',
                border: '1px solid var(--border-default)',
                borderRight: 'none',
                borderBottom: 'none',
                transform: 'rotate(45deg)',
              }}
            />

            <div className="flex items-center justify-between mb-3" style={{ position: 'relative', zIndex: 1 }}>
              <span style={{
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="p-1 rounded motion-hover"
                  style={{
                    color: 'var(--text-secondary)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                  className="p-1 rounded motion-hover"
                  style={{
                    color: 'var(--text-secondary)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div
                  key={day}
                  className="text-center"
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 0',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                const today = new Date();
                const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
                
                const cells = [];
                
                for (let i = 0; i < firstDay; i++) {
                  cells.push(<div key={`empty-${i}`} />);
                }
                
                for (let day = 1; day <= daysInMonth; day++) {
                  const isToday = isCurrentMonth && day === today.getDate();
                  const isSelected = day === selectedDate.getDate() && 
                                    currentMonth === selectedDate.getMonth() && 
                                    currentYear === selectedDate.getFullYear();
                  
                  cells.push(
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDate(new Date(currentYear, currentMonth, day));
                        setShowCalendarPopover(false);
                      }}
                      className="motion-hover"
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: isToday ? 600 : 400,
                        color: isToday ? 'white' : isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                        backgroundColor: isToday ? 'var(--accent-primary)' : 'transparent',
                        border: isSelected && !isToday ? '1px solid var(--accent-primary)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isToday) {
                          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isToday) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {day}
                    </button>
                  );
                }
                
                return cells;
              })()}
            </div>
          </div>
        )}
      </div>

      {/* MIDDLE CARD - Metric Filters */}
      <div 
        style={{
          backgroundColor: 'white',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          padding: '20px',
        }}
      >
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: '0 0 8px 0',
        }}>
          Metric Filters
        </p>

        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '18px',
          fontWeight: 600,
          margin: '0 0 6px 0',
        }}>
          Today's Metrics
        </h3>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '11px',
          margin: '0 0 16px 0',
        }}>
          Tap a metric to filter the rest of the dashboard.
        </p>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '10px',
          margin: '0 0 16px 0',
          fontStyle: 'italic',
        }}>
          Active metric filters Today's Schedule and Needs Attention.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setActiveMetric(activeMetric === 'total' ? 'total' : 'total')}
            className="motion-hover"
            style={{
              position: 'relative',
              padding: '14px',
              borderRadius: '10px',
              border: activeMetric === 'total' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
              backgroundColor: activeMetric === 'total' ? 'var(--accent-primary)' : 'white',
              boxShadow: activeMetric === 'total' ? '0 0 0 3px rgba(91, 141, 239, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              textAlign: 'left',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: activeMetric === 'total' 
                  ? 'rgba(255, 255, 255, 0.4)' 
                  : 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-primary) 60%, transparent 100%)',
              }}
            />
            
            <div className="flex items-center justify-between mb-2">
              <span style={{
                color: activeMetric === 'total' ? 'white' : 'var(--text-primary)',
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1,
              }}>
                {stats.total}
              </span>
              <TrendingUp 
                className="w-5 h-5" 
                style={{ 
                  color: activeMetric === 'total' ? 'rgba(255, 255, 255, 0.6)' : 'var(--text-muted)',
                  opacity: 0.7,
                }} 
              />
            </div>
            <p style={{
              color: activeMetric === 'total' ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              margin: 0,
              letterSpacing: '0.3px',
            }}>
              Total Appts
            </p>
          </button>

          <button
            onClick={() => setActiveMetric(activeMetric === 'at-risk' ? 'total' : 'at-risk')}
            className="motion-hover"
            style={{
              position: 'relative',
              padding: '14px',
              borderRadius: '10px',
              border: activeMetric === 'at-risk' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
              backgroundColor: activeMetric === 'at-risk' ? 'var(--accent-primary)' : 'white',
              boxShadow: activeMetric === 'at-risk' ? '0 0 0 3px rgba(91, 141, 239, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              textAlign: 'left',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: activeMetric === 'at-risk' 
                  ? 'rgba(255, 255, 255, 0.4)' 
                  : 'linear-gradient(90deg, #F59E0B 0%, #F59E0B 45%, transparent 100%)',
              }}
            />
            
            <div className="flex items-center justify-between mb-2">
              <span style={{
                color: activeMetric === 'at-risk' ? 'white' : 'var(--text-primary)',
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1,
              }}>
                {stats.unconfirmed + stats.missingIntake}
              </span>
              <AlertCircle 
                className="w-5 h-5" 
                style={{ 
                  color: activeMetric === 'at-risk' ? 'rgba(255, 255, 255, 0.6)' : '#F59E0B',
                  opacity: 0.7,
                }} 
              />
            </div>
            <p style={{
              color: activeMetric === 'at-risk' ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              margin: 0,
              letterSpacing: '0.3px',
            }}>
              At-Risk
            </p>
          </button>

          <button
            onClick={() => setActiveMetric(activeMetric === 'no-show' ? 'total' : 'no-show')}
            className="motion-hover"
            style={{
              position: 'relative',
              padding: '14px',
              borderRadius: '10px',
              border: activeMetric === 'no-show' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
              backgroundColor: activeMetric === 'no-show' ? 'var(--accent-primary)' : 'white',
              boxShadow: activeMetric === 'no-show' ? '0 0 0 3px rgba(91, 141, 239, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              textAlign: 'left',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: activeMetric === 'no-show' 
                  ? 'rgba(255, 255, 255, 0.4)' 
                  : 'linear-gradient(90deg, #DC2626 0%, #DC2626 30%, transparent 100%)',
              }}
            />
            
            <div className="flex items-center justify-between mb-2">
              <span style={{
                color: activeMetric === 'no-show' ? 'white' : 'var(--text-primary)',
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1,
              }}>
                {stats.total > 0 ? Math.round((stats.unconfirmed / stats.total) * 100) : 0}%
              </span>
              <XCircle 
                className="w-5 h-5" 
                style={{ 
                  color: activeMetric === 'no-show' ? 'rgba(255, 255, 255, 0.6)' : '#DC2626',
                  opacity: 0.7,
                }} 
              />
            </div>
            <p style={{
              color: activeMetric === 'no-show' ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              margin: 0,
              letterSpacing: '0.3px',
            }}>
              No-Show Risk
            </p>
          </button>

          <button
            onClick={() => setActiveMetric(activeMetric === 'ai-calls' ? 'total' : 'ai-calls')}
            className="motion-hover"
            style={{
              position: 'relative',
              padding: '14px',
              borderRadius: '10px',
              border: activeMetric === 'ai-calls' ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)',
              backgroundColor: activeMetric === 'ai-calls' ? 'var(--accent-primary)' : 'white',
              boxShadow: activeMetric === 'ai-calls' ? '0 0 0 3px rgba(91, 141, 239, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              textAlign: 'left',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: activeMetric === 'ai-calls' 
                  ? 'rgba(255, 255, 255, 0.4)' 
                  : 'linear-gradient(90deg, #10B981 0%, #10B981 40%, transparent 100%)',
              }}
            />
            
            <div className="flex items-center justify-between mb-2">
              <span style={{
                color: activeMetric === 'ai-calls' ? 'white' : 'var(--text-primary)',
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1,
              }}>
                {stats.voiceCalls}
              </span>
              <Phone 
                className="w-5 h-5" 
                style={{ 
                  color: activeMetric === 'ai-calls' ? 'rgba(255, 255, 255, 0.6)' : '#10B981',
                  opacity: 0.7,
                }} 
              />
            </div>
            <p style={{
              color: activeMetric === 'ai-calls' ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              margin: 0,
              letterSpacing: '0.3px',
            }}>
              AI Calls
            </p>
          </button>
        </div>
      </div>

      {/* RIGHT CARD - Selected Patient */}
      <div 
        style={{
          backgroundColor: 'white',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: '0 0 8px 0',
        }}>
          Selected Patient
        </p>

        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '18px',
          fontWeight: 600,
          margin: '0 0 16px 0',
        }}>
          {featuredAppointment ? featuredAppointment.patientName : 'No Selection'}
        </h3>

        {featuredAppointment ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {featuredAppointment.patientName.split(' ').map(n => n[0]).join('')}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 600,
                  margin: '0 0 3px 0',
                }}>
                  {featuredAppointment.time} with {featuredAppointment.provider}
                </p>
              </div>
            </div>

            <p style={{
              color: 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: '0 0 8px 0',
            }}>
              Status
            </p>

            <div className="flex flex-col gap-2 mb-4">
              {!featuredAppointment.status.intakeComplete && (
                <button
                  onClick={() => {
                    onSendIntake(featuredAppointment.id);
                    onViewProfile(featuredAppointment.id);
                  }}
                  className="motion-hover"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid #FDE68A',
                    cursor: 'pointer',
                    width: 'fit-content',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FDE68A';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF3C7';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FileX className="w-3.5 h-3.5" />
                  <span>Missing Intake</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
              {!featuredAppointment.status.confirmed && (
                <button
                  onClick={() => {
                    onCall(featuredAppointment.id);
                    onViewProfile(featuredAppointment.id);
                  }}
                  className="motion-hover"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid #FECACA',
                    cursor: 'pointer',
                    width: 'fit-content',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FECACA';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Unconfirmed</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
              {featuredAppointment.status.confirmed && featuredAppointment.status.intakeComplete && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#D1FAE5',
                    color: '#065F46',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid #A7F3D0',
                    width: 'fit-content',
                  }}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </div>
              )}
            </div>

            <p style={{
              color: 'var(--text-muted)',
              fontSize: '10px',
              margin: '0 0 12px 0',
            }}>
              Tap a status to open and focus this patient in the Needs Attention queue.
            </p>

            <div style={{ marginTop: 'auto' }} className="space-y-2">
              <button
                onClick={() => onCall(featuredAppointment.id)}
                className="motion-hover w-full"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </button>

              <button
                onClick={() => onViewProfile(featuredAppointment.id)}
                className="motion-hover w-full"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--accent-primary)',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>Open Details</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <p style={{
                color: 'var(--text-muted)',
                fontSize: '10px',
                margin: '8px 0 0 0',
                textAlign: 'center',
              }}>
                Actions here open and focus this patient in the queue below.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '13px',
            }}>
              No appointments scheduled
            </p>
          </div>
        )}
      </div>
    </div>
  );
}