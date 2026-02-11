import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/foundation/Button';

interface DoctorPatientContextPageProps {
  patientId: string;
  onBack: () => void;
}

interface IntakeSection {
  id: string;
  label: string;
  content: string;
}

export function DoctorPatientContextPage({ patientId, onBack }: DoctorPatientContextPageProps) {
  const [expandedIntake, setExpandedIntake] = useState(false);
  const [expandedPastVisits, setExpandedPastVisits] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  // Mock patient data
  const patient = {
    name: 'Sarah Martinez',
    age: 34,
    visitType: 'Follow-up Visit',
    appointmentTime: '9:00 AM',
    intakeStatus: 'complete',
    intakeSubmittedAt: '2 hours ago',
  };

  const intakeSnapshot: IntakeSection[] = [
    {
      id: '1',
      label: 'Reason for Visit',
      content: 'Persistent lower back pain, worsening over the past 2 weeks. Pain increases with sitting.',
    },
    {
      id: '2',
      label: 'Current Medications',
      content: 'Ibuprofen 400mg as needed, Lisinopril 10mg daily',
    },
    {
      id: '3',
      label: 'Allergies',
      content: 'Penicillin (rash)',
    },
    {
      id: '4',
      label: 'Recent Changes',
      content: 'Started new desk job 3 months ago, working from home',
    },
  ];

  const aiSummary = {
    confidence: 85,
    sections: [
      {
        title: 'Reason for Visit',
        content: 'Patient reports persistent lower back pain that has worsened over 2 weeks, particularly when sitting for extended periods.',
      },
      {
        title: 'Notable Symptoms',
        content: 'Pain localized to lower lumbar region, no radiation to legs, no numbness or tingling reported.',
      },
      {
        title: 'Changes Since Last Visit',
        content: 'New sedentary work environment (started desk job 3 months ago), increased sitting duration.',
      },
      {
        title: 'Suggested Discussion Areas',
        content: 'Ergonomic assessment, posture correction, physical therapy options, pain management alternatives.',
      },
    ],
  };

  const pastVisits = [
    {
      id: '1',
      date: 'Dec 15, 2024',
      visitType: 'Annual Physical',
      provider: 'Dr. Chen',
      notes: 'Patient in good health. Bloodwork normal. Discussed importance of regular exercise. Blood pressure 118/76. Continue current medications.',
      followUp: 'Schedule annual physical for 2025',
    },
    {
      id: '2',
      date: 'Aug 22, 2024',
      visitType: 'Follow-up',
      provider: 'Dr. Chen',
      notes: 'Follow-up for hypertension management. Blood pressure well controlled on Lisinopril 10mg. Patient reports no side effects. Encouraged continued healthy lifestyle modifications.',
      followUp: 'Continue current regimen, follow up in 6 months',
    },
  ];

  const togglePastVisit = (visitId: string) => {
    setExpandedPastVisits((prev) =>
      prev.includes(visitId) ? prev.filter((id) => id !== visitId) : [...prev, visitId]
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div
        className="glass border-b px-6 py-4 sticky top-0 z-10"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 style={{ color: 'var(--text-primary)' }} className="mb-1">
                {patient.name}
              </h1>
              <div className="flex items-center gap-4" style={{ fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {patient.age} years old
                </span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {patient.visitType}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                  {patient.appointmentTime}
                </span>
              </div>
            </div>
          </div>

          {/* Intake Status Badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              backgroundColor:
                patient.intakeStatus === 'complete'
                  ? 'var(--status-info-bg)'
                  : 'var(--status-warning-bg)',
              border:
                patient.intakeStatus === 'complete'
                  ? '2px solid var(--accent-primary)'
                  : '2px solid var(--status-warning)',
            }}
          >
            {patient.intakeStatus === 'complete' ? (
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            ) : (
              <AlertCircle className="w-4 h-4" style={{ color: 'var(--status-warning)' }} />
            )}
            <span
              style={{
                fontSize: '14px',
                fontWeight: 'var(--font-weight-medium)',
                color:
                  patient.intakeStatus === 'complete'
                    ? 'var(--accent-primary)'
                    : 'var(--status-warning)',
              }}
            >
              {patient.intakeStatus === 'complete' ? 'Intake Complete' : 'Intake Incomplete'}
            </span>
            {patient.intakeStatus === 'complete' && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {patient.intakeSubmittedAt}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto p-8">
        {/* Two-Column Layout */}
        <div className="grid grid-cols-[380px_1fr] gap-6 mb-6">
          {/* Left Column - Intake Snapshot */}
          <div>
            <div
              className="p-5 sticky top-24"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: 'var(--text-primary)' }}>Intake Snapshot</h3>
                <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </div>

              <div className="space-y-4">
                {intakeSnapshot.map((section) => (
                  <div key={section.id}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        fontWeight: 'var(--font-weight-medium)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                      className="mb-2"
                    >
                      {section.label}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setExpandedIntake(!expandedIntake)}
                className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  color: 'var(--accent-primary)',
                  fontSize: '14px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-canvas)';
                }}
              >
                {expandedIntake ? (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    View Full Intake
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center Column - AI Summary */}
          <div className="space-y-6">
            {/* AI Summary Card */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div className="mb-5">
                <h3 style={{ color: 'var(--text-primary)' }} className="mb-2">
                  Visit Summary
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      fontWeight: 'var(--font-weight-normal)',
                      marginLeft: '8px',
                    }}
                  >
                    (AI-assisted)
                  </span>
                </h3>

                {/* Confidence Indicator */}
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--surface-canvas)' }}
                  >
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${aiSummary.confidence}%`,
                        backgroundColor:
                          aiSummary.confidence >= 75
                            ? 'var(--accent-primary)'
                            : 'var(--status-warning)',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {aiSummary.confidence >= 75 ? 'High confidence' : 'Intake incomplete'}
                  </span>
                </div>
              </div>

              {/* Summary Sections */}
              <div className="space-y-5">
                {aiSummary.sections.map((section, index) => (
                  <div key={index}>
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'var(--accent-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                      className="mb-2"
                    >
                      {section.title}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                      }}
                    >
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div
                className="mt-6 pt-4"
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                  }}
                >
                  This summary is assistive and non-diagnostic.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Past Visits & Notes */}
        <div
          className="p-6"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <h3 style={{ color: 'var(--text-primary)' }} className="mb-5">
            Past Visits & Notes
          </h3>

          <div className="space-y-3 mb-6">
            {pastVisits.map((visit) => (
              <div
                key={visit.id}
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                {/* Visit Header */}
                <button
                  onClick={() => togglePastVisit(visit.id)}
                  className="w-full flex items-center justify-between p-4 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Clock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <div className="text-left">
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-primary)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {visit.date}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {visit.visitType} • {visit.provider}
                      </div>
                    </div>
                  </div>
                  {expandedPastVisits.includes(visit.id) ? (
                    <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  ) : (
                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  )}
                </button>

                {/* Expanded Content */}
                {expandedPastVisits.includes(visit.id) && (
                  <div
                    className="px-4 pb-4"
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '16px',
                    }}
                  >
                    <div className="mb-4">
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          fontWeight: 'var(--font-weight-medium)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                        className="mb-2"
                      >
                        Notes
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.6',
                        }}
                      >
                        {visit.notes}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          fontWeight: 'var(--font-weight-medium)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                        className="mb-2"
                      >
                        Follow-up Plan
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.6',
                        }}
                      >
                        {visit.followUp}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* New Note Section */}
          <div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--text-primary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              className="mb-3"
            >
              Today's Visit Notes
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Add notes for today's visit..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--surface-primary)',
                border: '2px solid var(--border-default)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: '1.6',
                resize: 'vertical',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
            />
            <div className="flex items-center justify-between mt-3">
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Notes are automatically saved as you type
              </span>
              <Button size="sm">Save Note</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
