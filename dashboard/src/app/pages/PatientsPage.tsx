import { useState } from 'react';
import { Search, Plus, Phone, MessageSquare, FileText, MoreVertical, User, CheckCircle2, AlertCircle, Clock, ChevronDown } from 'lucide-react';
import { Button } from '../components/foundation/Button';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nextAppointment?: {
    date: string;
    time: string;
    provider: string;
  };
  readiness: {
    intakeComplete: boolean;
    confirmed: boolean;
    arrived?: boolean;
  };
  aiActivity?: {
    attempts: number;
    lastAttempt: string;
    details: Array<{
      type: 'call' | 'text' | 'voicemail';
      time: string;
    }>;
  };
  primaryAction: 'confirm' | 'send-intake' | 're-enroll' | null;
}

export function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [readinessFilter, setReadinessFilter] = useState('all');
  const [upcomingVisitsFilter, setUpcomingVisitsFilter] = useState('all');
  const [hoveredPatient, setHoveredPatient] = useState<string | null>(null);
  const [hoveredAIActivity, setHoveredAIActivity] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Mock patient data
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Martinez',
      email: 'sarah.martinez@email.com',
      phone: '(555) 123-4567',
      nextAppointment: {
        date: 'Today',
        time: '2:00 PM',
        provider: 'Dr. Chen',
      },
      readiness: {
        intakeComplete: true,
        confirmed: true,
        arrived: true,
      },
      aiActivity: {
        attempts: 2,
        lastAttempt: '3h ago',
        details: [
          { type: 'call', time: '3h ago' },
          { type: 'text', time: '5h ago' },
        ],
      },
      primaryAction: null,
    },
    {
      id: '2',
      name: 'James Wilson',
      email: 'james.w@email.com',
      phone: '(555) 234-5678',
      nextAppointment: {
        date: 'Today',
        time: '3:30 PM',
        provider: 'Dr. Chen',
      },
      readiness: {
        intakeComplete: true,
        confirmed: false,
        arrived: false,
      },
      aiActivity: {
        attempts: 3,
        lastAttempt: '2h ago',
        details: [
          { type: 'voicemail', time: '2h ago' },
          { type: 'text', time: '4h ago' },
          { type: 'call', time: '6h ago' },
        ],
      },
      primaryAction: 'confirm',
    },
    {
      id: '3',
      name: 'Emily Johnson',
      email: 'emily.johnson@email.com',
      phone: '(555) 345-6789',
      nextAppointment: {
        date: 'Tomorrow',
        time: '9:00 AM',
        provider: 'Dr. Patel',
      },
      readiness: {
        intakeComplete: false,
        confirmed: true,
      },
      aiActivity: {
        attempts: 1,
        lastAttempt: '1d ago',
        details: [
          { type: 'text', time: '1d ago' },
        ],
      },
      primaryAction: 'send-intake',
    },
    {
      id: '4',
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '(555) 456-7890',
      nextAppointment: {
        date: 'Tomorrow',
        time: '10:30 AM',
        provider: 'Dr. Chen',
      },
      readiness: {
        intakeComplete: false,
        confirmed: false,
      },
      aiActivity: {
        attempts: 5,
        lastAttempt: '1h ago',
        details: [
          { type: 'voicemail', time: '1h ago' },
          { type: 'call', time: '3h ago' },
          { type: 'text', time: '5h ago' },
        ],
      },
      primaryAction: 're-enroll',
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '(555) 567-8901',
      nextAppointment: {
        date: 'Jan 15',
        time: '11:00 AM',
        provider: 'Dr. Patel',
      },
      readiness: {
        intakeComplete: true,
        confirmed: true,
      },
      primaryAction: null,
    },
    {
      id: '6',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '(555) 678-9012',
      nextAppointment: {
        date: 'Jan 16',
        time: '2:00 PM',
        provider: 'Dr. Chen',
      },
      readiness: {
        intakeComplete: true,
        confirmed: true,
      },
      primaryAction: null,
    },
    {
      id: '7',
      name: 'Rachel Green',
      email: 'rachel.green@email.com',
      phone: '(555) 789-0123',
      readiness: {
        intakeComplete: false,
        confirmed: false,
      },
      primaryAction: null,
    },
    {
      id: '8',
      name: 'Thomas Lee',
      email: 'thomas.lee@email.com',
      phone: '(555) 890-1234',
      nextAppointment: {
        date: 'Jan 20',
        time: '3:00 PM',
        provider: 'Dr. Ross',
      },
      readiness: {
        intakeComplete: true,
        confirmed: false,
      },
      aiActivity: {
        attempts: 2,
        lastAttempt: '4h ago',
        details: [
          { type: 'text', time: '4h ago' },
          { type: 'call', time: '8h ago' },
        ],
      },
      primaryAction: 'confirm',
    },
  ];

  const patientsNeedingAttention = patients.filter(p => p.primaryAction !== null).length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getPrimaryActionLabel = (action: Patient['primaryAction']) => {
    switch (action) {
      case 'confirm':
        return 'Confirm';
      case 'send-intake':
        return 'Send Intake';
      case 're-enroll':
        return 'Re-enroll AI';
      default:
        return null;
    }
  };

  const getAIActivityIcon = (type: 'call' | 'text' | 'voicemail') => {
    switch (type) {
      case 'call':
        return <Phone className="w-3 h-3" />;
      case 'text':
        return <MessageSquare className="w-3 h-3" />;
      case 'voicemail':
        return <Phone className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div className="px-6 py-6 border-b" style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 style={{ color: 'var(--text-primary)' }}>Patients</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                View and manage patient information
              </p>
            </div>
            <Button variant="primary" size="md" icon={Plus}>
              Add Patient
            </Button>
          </div>

          {/* Utility Bar */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm motion-hover"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1.5px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-default)';
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <select
                value={readinessFilter}
                onChange={(e) => setReadinessFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium motion-hover"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1.5px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                <option value="all">All Readiness</option>
                <option value="complete">Complete</option>
                <option value="incomplete">Incomplete</option>
              </select>

              <select
                value={upcomingVisitsFilter}
                onChange={(e) => setUpcomingVisitsFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium motion-hover"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1.5px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                <option value="all">All Visits</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
              </select>

              {/* Attention Indicator */}
              {patientsNeedingAttention > 0 && (
                <div 
                  className="px-4 py-2.5 rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: 'var(--status-warning-bg)' }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-warning)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--status-warning)' }}>
                    {patientsNeedingAttention} patients need attention
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="space-y-2">
            {patients.map((patient) => {
              const isHovered = hoveredPatient === patient.id;
              const isAIHovered = hoveredAIActivity === patient.id;

              return (
                <div
                  key={patient.id}
                  className="rounded-xl overflow-hidden motion-state cursor-pointer"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    boxShadow: isHovered ? 'var(--shadow-2)' : 'var(--shadow-1)',
                    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                  }}
                  onMouseEnter={() => setHoveredPatient(patient.id)}
                  onMouseLeave={() => setHoveredPatient(null)}
                  onClick={() => console.log('Navigate to patient profile:', patient.id)}
                >
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr_1fr_auto] gap-6 items-center">
                      {/* Patient */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: 'rgba(91, 141, 239, 0.12)' }}
                        >
                          <span className="text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
                            {getInitials(patient.name)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                            {patient.name}
                          </div>
                          <div className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>
                            {patient.email}
                          </div>
                        </div>
                      </div>

                      {/* Next Appointment */}
                      <div>
                        {patient.nextAppointment ? (
                          <div>
                            <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                              {patient.nextAppointment.date} · {patient.nextAppointment.time}
                            </div>
                            <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                              {patient.nextAppointment.provider}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            No upcoming visit
                          </div>
                        )}
                      </div>

                      {/* Readiness */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {patient.readiness.intakeComplete ? (
                            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
                          ) : (
                            <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                          )}
                          <span 
                            className="text-sm"
                            style={{ color: patient.readiness.intakeComplete ? 'var(--status-success)' : 'var(--status-warning)' }}
                          >
                            Intake {patient.readiness.intakeComplete ? 'complete' : 'missing'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {patient.readiness.confirmed ? (
                            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
                          ) : (
                            <Clock className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
                          )}
                          <span 
                            className="text-sm"
                            style={{ color: patient.readiness.confirmed ? 'var(--status-success)' : 'var(--status-warning)' }}
                          >
                            {patient.readiness.confirmed ? 'Confirmed' : 'Pending'}
                          </span>
                        </div>
                        {patient.readiness.arrived !== undefined && (
                          <div className="flex items-center gap-2">
                            {patient.readiness.arrived ? (
                              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
                            ) : (
                              <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            )}
                            <span 
                              className="text-sm"
                              style={{ color: patient.readiness.arrived ? 'var(--status-success)' : 'var(--text-muted)' }}
                            >
                              {patient.readiness.arrived ? 'Arrived' : 'Not arrived'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* AI Activity */}
                      <div>
                        {patient.aiActivity ? (
                          <div
                            className="relative"
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              setHoveredAIActivity(patient.id);
                            }}
                            onMouseLeave={(e) => {
                              e.stopPropagation();
                              setHoveredAIActivity(null);
                            }}
                          >
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {patient.aiActivity.attempts} attempts
                              </span>
                              <span className="mx-1.5">·</span>
                              <span style={{ color: 'var(--text-muted)' }}>
                                last {patient.aiActivity.lastAttempt}
                              </span>
                            </div>

                            {/* Hover Tooltip */}
                            {isAIHovered && (
                              <div
                                className="absolute left-0 top-full mt-2 z-10 p-3 rounded-lg min-w-[200px] animate-fade-in"
                                style={{
                                  backgroundColor: 'var(--surface-card)',
                                  boxShadow: 'var(--shadow-3)',
                                  border: '1.5px solid var(--border-default)',
                                }}
                              >
                                <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                                  Recent Attempts
                                </div>
                                <div className="space-y-1.5">
                                  {patient.aiActivity.details.map((detail, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <div style={{ color: 'var(--accent-primary)' }}>
                                        {getAIActivityIcon(detail.type)}
                                      </div>
                                      <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                                        {detail.type}
                                      </span>
                                      <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
                                        {detail.time}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            No activity
                          </div>
                        )}
                      </div>

                      {/* Primary Action */}
                      <div>
                        {patient.primaryAction && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Primary action:', patient.primaryAction);
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-medium motion-hover whitespace-nowrap"
                            style={{
                              backgroundColor: 'var(--accent-primary)',
                              color: 'var(--text-inverse)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                            }}
                          >
                            {getPrimaryActionLabel(patient.primaryAction)}
                          </button>
                        )}
                      </div>

                      {/* More Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Call:', patient.id);
                          }}
                          className="w-9 h-9 rounded-lg flex items-center justify-center motion-hover"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-muted)';
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Message:', patient.id);
                          }}
                          className="w-9 h-9 rounded-lg flex items-center justify-center motion-hover"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-muted)';
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Documents:', patient.id);
                          }}
                          className="w-9 h-9 rounded-lg flex items-center justify-center motion-hover"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-muted)';
                          }}
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === patient.id ? null : patient.id);
                            }}
                            className="w-9 h-9 rounded-lg flex items-center justify-center motion-hover"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={(e) => {
                              if (openMenuId !== patient.id) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'var(--text-muted)';
                              }
                            }}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Overflow Menu */}
                          {openMenuId === patient.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(null);
                                }}
                              />
                              <div
                                className="absolute right-0 top-full mt-2 z-20 py-2 rounded-lg min-w-[160px] animate-fade-in"
                                style={{
                                  backgroundColor: 'var(--surface-card)',
                                  boxShadow: 'var(--shadow-3)',
                                  border: '1.5px solid var(--border-default)',
                                }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('View profile:', patient.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm motion-hover"
                                  style={{ color: 'var(--text-primary)' }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  View Profile
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit patient:', patient.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm motion-hover"
                                  style={{ color: 'var(--text-primary)' }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  Edit Details
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Schedule appointment:', patient.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm motion-hover"
                                  style={{ color: 'var(--text-primary)' }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  Schedule Appointment
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
