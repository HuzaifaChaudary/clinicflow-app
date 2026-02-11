import { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, Calendar, FileText, Activity, MessageSquare, Save, ChevronDown } from 'lucide-react';
import { Button } from '../components/foundation/Button';
import { Card } from '../components/foundation/Card';
import { StatusChip } from '../components/foundation/StatusChip';

interface PatientPageProps {
  patientId: string;
  onBack: () => void;
}

export function PatientPage({ patientId, onBack }: PatientPageProps) {
  const [doctorNotes, setDoctorNotes] = useState('Patient presents for routine follow-up. Vitals stable. Blood pressure 120/80. No new complaints. Continue current medication regimen.');
  const [followUpPlan, setFollowUpPlan] = useState('Schedule routine follow-up in 2 weeks. Consider ordering lab work if symptoms persist.');
  const [showCommunication, setShowCommunication] = useState(false);

  // Mock patient data
  const patient = {
    name: 'Sarah Martinez',
    dob: 'Jan 15, 1985',
    age: 39,
    phone: '(555) 123-4567',
    email: 'sarah.martinez@email.com',
    todayAppointment: {
      time: '8:00 AM',
      provider: 'Dr. Chen',
      type: 'Follow-up Consultation',
      duration: '30 minutes',
    },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-background)' }}>
      {/* Header */}
      <div 
        className="border-b px-6 py-4"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <Button variant="ghost" icon={ArrowLeft} onClick={onBack}>
            Back to Schedule
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Patient Info & Context */}
          <div className="space-y-6">
            {/* Patient Overview */}
            <Card>
              <div className="flex items-start gap-4 mb-5">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-medium shrink-0"
                  style={{
                    backgroundColor: 'var(--accent-primary-bg)',
                    color: 'var(--accent-primary-text)',
                  }}
                >
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>
                    {patient.name}
                  </h1>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {patient.dob} • {patient.age} years
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{patient.email}</span>
                </div>
              </div>
            </Card>

            {/* Today's Appointment */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ color: 'var(--text-primary)' }}>Today's Visit</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Time</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                    {patient.todayAppointment.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Type</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                    {patient.todayAppointment.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Duration</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                    {patient.todayAppointment.duration}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusChip type="confirmed" size="sm" />
                  <StatusChip type="intake-complete" size="sm" />
                  <StatusChip type="arrived" size="sm" />
                </div>
              </div>
            </Card>

            {/* AI Summary */}
            <Card>
              <div className="flex items-start gap-2 mb-4">
                <div 
                  className="w-2 h-2 rounded-full mt-1.5"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                />
                <div className="flex-1">
                  <h3 style={{ color: 'var(--text-primary)' }}>Visit Context</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: 'var(--accent-primary-bg)',
                        color: 'var(--accent-primary-text)',
                      }}
                    >
                      AI Generated
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Updated 2 hours ago
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Follow-up for routine checkup. Patient confirmed via voice call 2 hours ago. 
                All intake documentation complete. No outstanding pre-visit requirements. 
                Insurance verified and active. Last visit 2 weeks ago showed normal vitals.
              </p>
            </Card>

            {/* Communication History (Collapsed) */}
            <Card padding="none">
              <button
                onClick={() => setShowCommunication(!showCommunication)}
                className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-primary)' }} className="font-medium">
                    Communication History
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform ${showCommunication ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-muted)' }}
                />
              </button>

              {showCommunication && (
                <div className="px-6 pb-4 space-y-3">
                  <div 
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--surface-background)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                      2 hours ago • Voice call
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Confirmation call completed. Patient confirmed attendance.
                    </p>
                  </div>

                  <div 
                    className="p-3 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--surface-background)',
                      borderColor: 'var(--border-default)',
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                      1 day ago • SMS
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Appointment reminder sent successfully.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Middle Column - Intake & Past Visits */}
          <div className="space-y-6">
            {/* Intake Forms */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <h3 style={{ color: 'var(--text-primary)' }}>Intake Forms</h3>
                <StatusChip type="intake-complete" size="sm" />
              </div>

              <div className="space-y-3">
                <div 
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--surface-background)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Patient Intake Form
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Completed 2h ago
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Chief Complaint:</span>
                      <p style={{ color: 'var(--text-secondary)' }}>Routine follow-up</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Current Medications:</span>
                      <p style={{ color: 'var(--text-secondary)' }}>Lisinopril 10mg daily</p>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Allergies:</span>
                      <p style={{ color: 'var(--text-secondary)' }}>None reported</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--surface-background)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Insurance Verification
                    </span>
                    <StatusChip type="confirmed" label="Verified" size="sm" />
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Blue Cross Blue Shield - Active
                  </p>
                </div>
              </div>
            </Card>

            {/* Past Visits */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <h3 style={{ color: 'var(--text-primary)' }}>Past Visits</h3>
              </div>

              <div className="space-y-3">
                <div 
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--surface-background)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Dec 15, 2025
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Dr. Chen
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Routine examination. All vitals normal. BP 118/78. Patient reported feeling well. 
                    No new concerns. Continue current medication.
                  </p>
                </div>

                <div 
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--surface-background)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Nov 8, 2025
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Dr. Chen
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Follow-up consultation. Lab results reviewed. All values within normal range. 
                    Patient adherent to medication regimen.
                  </p>
                </div>

                <div 
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: 'var(--surface-background)',
                    borderColor: 'var(--border-default)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Oct 1, 2025
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Dr. Patel
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Initial consultation for hypertension management. Started on Lisinopril 10mg. 
                    Patient education provided.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Editable Notes */}
          <div className="space-y-6">
            {/* Doctor Notes (Editable) */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: 'var(--text-primary)' }}>Clinical Notes</h3>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Editable
                </span>
              </div>

              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-lg border resize-none text-sm leading-relaxed"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
                placeholder="Enter clinical notes..."
              />

              <div className="mt-4">
                <Button variant="primary" icon={Save} fullWidth>
                  Save Notes
                </Button>
              </div>
            </Card>

            {/* Follow-up Plan (Editable) */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ color: 'var(--text-primary)' }}>Follow-up Plan</h3>
              </div>

              <textarea
                value={followUpPlan}
                onChange={(e) => setFollowUpPlan(e.target.value)}
                rows={6}
                className="w-full p-4 rounded-lg border resize-none text-sm leading-relaxed"
                style={{
                  backgroundColor: 'var(--surface-background)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
                placeholder="Enter follow-up recommendations..."
              />

              <div className="mt-4">
                <Button variant="primary" icon={Save} fullWidth>
                  Save Plan
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>Actions</h3>
              
              <div className="space-y-2">
                <Button variant="secondary" fullWidth>
                  Order Lab Work
                </Button>
                <Button variant="secondary" fullWidth>
                  Request Imaging
                </Button>
                <Button variant="secondary" fullWidth>
                  Schedule Follow-up
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
