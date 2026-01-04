import { X, Phone, Mail, Calendar, FileText, MessageSquare, Upload, Clock, User, Activity } from 'lucide-react';
import { Appointment } from './AppointmentRow';
import { StatusToken } from './StatusToken';

interface PatientSidePanelProps {
  appointment: Appointment;
  onClose: () => void;
  onOpenVoicePanel?: () => void;
  isDoctor?: boolean;
}

export function PatientSidePanel({ 
  appointment, 
  onClose, 
  onOpenVoicePanel,
  isDoctor = false,
}: PatientSidePanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 w-[520px] shadow-2xl z-50 transform transition-transform duration-200 ease-out overflow-auto"
        style={{
          backgroundColor: 'var(--surface-card)',
        }}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between backdrop-blur-sm"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 style={{ color: 'var(--text-primary)' }}>Patient Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-150"
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
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient Header */}
          <div 
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: 'var(--surface-background)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-medium"
                style={{
                  backgroundColor: 'var(--accent-primary-bg)',
                  color: 'var(--accent-primary-text)',
                }}
              >
                {appointment.patientName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 style={{ color: 'var(--text-primary)' }} className="mb-2">
                  {appointment.patientName}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusToken 
                    type={appointment.status.confirmed ? 'confirmed' : 'unconfirmed'}
                    readOnly
                  />
                  {appointment.arrived && <StatusToken type="arrived" readOnly />}
                  {appointment.noShow && <StatusToken type="no-show" readOnly />}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                >
                  <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                >
                  <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>patient@email.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                >
                  <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>DOB: Jan 15, 1985 (39 years)</span>
              </div>
            </div>
          </div>

          {/* Today's Appointment */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4.5 h-4.5" style={{ color: 'var(--accent-primary)' }} />
              <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                Today's Appointment
              </span>
            </div>
            
            <div 
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--surface-background)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Time</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">{appointment.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Provider</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">{appointment.provider}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Visit Type</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">Follow-up Consultation</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Duration</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">30 minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Context - AI Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              />
              <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                Visit Context
              </span>
              <span 
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  backgroundColor: 'var(--accent-primary-bg)',
                  color: 'var(--accent-primary-text)',
                }}
              >
                AI Generated
              </span>
            </div>

            <div 
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--surface-background)',
                borderColor: 'var(--accent-primary-border)',
                boxShadow: '0 0 0 1px var(--accent-primary-glow)',
              }}
            >
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed">
                Follow-up for routine checkup. Patient confirmed via voice call 2 hours ago. 
                All intake documentation complete. No outstanding pre-visit requirements. 
                Insurance verified and active. Last visit 2 weeks ago showed normal vitals.
                Patient reported feeling well with no new concerns.
              </p>
            </div>
          </div>

          {/* Intake & Documentation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4.5 h-4.5" style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                Intake & Forms
              </span>
            </div>

            <div className="space-y-2">
              {/* Intake Status */}
              <div 
                className="p-3 rounded-lg border flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" style={{ color: 'var(--status-success-text)' }} />
                  <div>
                    <div style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
                      Patient Intake Form
                    </div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                      Completed 2 hours ago
                    </div>
                  </div>
                </div>
                <StatusToken type="intake-complete" readOnly />
              </div>

              {/* Insurance */}
              <div 
                className="p-3 rounded-lg border flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" style={{ color: 'var(--status-success-text)' }} />
                  <div>
                    <div style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
                      Insurance Card
                    </div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                      Verified
                    </div>
                  </div>
                </div>
                {appointment.status.paid && <StatusToken type="paid" readOnly />}
              </div>

              {/* Uploaded Documents */}
              <div 
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Upload className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <div style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
                      Lab Results (PDF)
                    </div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                      Uploaded Dec 20, 2025
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voice AI Timeline - Subtle & Read-only */}
          {appointment.indicators.voiceCallSent && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5" style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                    Voice & Messages
                  </span>
                </div>
                {!isDoctor && onOpenVoicePanel && (
                  <button
                    onClick={onOpenVoicePanel}
                    className="px-2.5 py-1 rounded-md transition-all duration-150 text-xs font-medium"
                    style={{
                      color: 'var(--accent-primary-text)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-primary-bg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    View Full Timeline
                  </button>
                )}
              </div>

              <div 
                className="space-y-3 p-4 rounded-xl border"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                }}
              >
                {/* Voice Call Entry */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: 'var(--token-voice-bg)',
                      borderColor: 'var(--token-voice-border)',
                    }}
                  >
                    <Phone className="w-4 h-4" style={{ color: 'var(--token-voice-text)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        2 hours ago
                      </span>
                      <StatusToken type="confirmed" readOnly />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Confirmation call completed. Patient confirmed attendance and has no questions about the visit.
                    </p>
                  </div>
                </div>

                {/* SMS Entry */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: 'var(--status-info-bg)',
                    }}
                  >
                    <MessageSquare className="w-4 h-4" style={{ color: 'var(--status-info-text)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        1 hour ago
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Reminder SMS sent successfully. Patient acknowledged receipt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Past Visit History */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4.5 h-4.5" style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                Recent Visits
              </span>
            </div>

            <div className="space-y-2">
              <div 
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
                        Dec 15, 2025
                      </span>
                      <span style={{ color: 'var(--text-muted)' }} className="text-xs">
                        {appointment.provider}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed">
                      Routine examination. All vitals normal. Patient reported feeling well.
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
                        Nov 8, 2025
                      </span>
                      <span style={{ color: 'var(--text-muted)' }} className="text-xs">
                        {appointment.provider}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed">
                      Follow-up consultation. Lab results reviewed. No concerns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Notes (Doctor View Only) */}
          {isDoctor && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4.5 h-4.5" style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                  Clinical Notes
                </span>
              </div>

              <div 
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                }}
              >
                <div className="mb-3 pb-3 border-b" style={{ borderColor: 'var(--border-default)' }}>
                  <span style={{ color: 'var(--text-muted)' }} className="text-xs">
                    Last Note - Dec 15, 2025
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm leading-relaxed whitespace-pre-line">
                  Patient presents for routine follow-up. Vitals stable. Blood pressure 120/80. No new complaints. Continue current medication regimen. Schedule next follow-up in 2 weeks.
                </p>
              </div>
            </div>
          )}

          {/* Follow-up Recommendations (Doctor View) */}
          {isDoctor && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4.5 h-4.5" style={{ color: 'var(--accent-primary)' }} />
                <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                  Recommended Follow-up
                </span>
              </div>

              <div 
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: 'var(--accent-primary-bg)',
                  borderColor: 'var(--accent-primary-border)',
                }}
              >
                <p style={{ color: 'var(--accent-primary-text)' }} className="text-sm leading-relaxed">
                  Schedule routine follow-up in 2 weeks. Consider ordering lab work if symptoms persist.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
