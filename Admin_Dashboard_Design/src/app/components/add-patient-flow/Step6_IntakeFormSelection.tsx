import { useState } from 'react';
import { FileText, CheckCircle, Send, ChevronRight } from 'lucide-react';

interface IntakeForm {
  id: string;
  name: string;
  description: string;
  fieldCount: number;
  estimatedTime: string;
  categories: string[];
}

interface Step6Props {
  visitReason: string;
  intakePath: 'send' | 'manual';
  selectedForm: string;
  patientPhone: string;
  onFormSelect: (formId: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

const intakeFormsByReason: Record<string, IntakeForm[]> = {
  'new-patient': [
    {
      id: 'new-patient-full',
      name: 'New Patient - Full Intake',
      description: 'Comprehensive intake for first-time patients',
      fieldCount: 24,
      estimatedTime: '8-10 min',
      categories: ['Medical History', 'Current Medications', 'Allergies', 'Insurance'],
    },
    {
      id: 'new-patient-pediatric',
      name: 'New Patient - Pediatric',
      description: 'Specialized intake for patients under 18',
      fieldCount: 20,
      estimatedTime: '7-9 min',
      categories: ['Medical History', 'Immunizations', 'Parent/Guardian Info'],
    },
  ],
  'follow-up': [
    {
      id: 'follow-up-standard',
      name: 'Follow-up Visit Form',
      description: 'Quick update for returning patients',
      fieldCount: 8,
      estimatedTime: '3-4 min',
      categories: ['Symptoms Update', 'Medication Changes'],
    },
  ],
  'procedure': [
    {
      id: 'procedure-pre-op',
      name: 'Pre-Procedure Intake',
      description: 'Required before surgical procedures',
      fieldCount: 16,
      estimatedTime: '6-8 min',
      categories: ['Medical Clearance', 'Consent Forms', 'Anesthesia History'],
    },
  ],
  'consultation': [
    {
      id: 'consultation-standard',
      name: 'Consultation Intake',
      description: 'Basic information for consultation visits',
      fieldCount: 12,
      estimatedTime: '4-6 min',
      categories: ['Chief Complaint', 'Brief History', 'Questions'],
    },
  ],
  'other': [
    {
      id: 'general-intake',
      name: 'General Visit Form',
      description: 'Standard intake for miscellaneous visits',
      fieldCount: 14,
      estimatedTime: '5-7 min',
      categories: ['Visit Information', 'Medical History', 'Current Concerns'],
    },
  ],
};

export function Step6_IntakeFormSelection({
  visitReason,
  intakePath,
  selectedForm,
  patientPhone,
  onFormSelect,
  onComplete,
  onBack,
}: Step6Props) {
  const [hoveredForm, setHoveredForm] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const availableForms = intakeFormsByReason[visitReason] || intakeFormsByReason['other'];

  const handleComplete = async () => {
    if (intakePath === 'send') {
      setIsSending(true);
      // Simulate sending SMS
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {intakePath === 'send' ? 'Select Form to Send' : 'Select Form to Fill'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {intakePath === 'send' 
            ? `Choose which intake form to send to ${patientPhone}`
            : 'Choose which intake form to complete manually'}
        </p>
      </div>

      {/* Form options */}
      <div className="space-y-3">
        {availableForms.map((form) => {
          const isSelected = selectedForm === form.id;
          const isHovered = hoveredForm === form.id;

          return (
            <button
              key={form.id}
              onClick={() => onFormSelect(form.id)}
              onMouseEnter={() => setHoveredForm(form.id)}
              onMouseLeave={() => setHoveredForm(null)}
              className="w-full p-4 rounded-lg border-2 transition-all text-left"
              style={{
                backgroundColor: isSelected ? 'var(--accent-primary-bg)' : 'var(--surface-card)',
                borderColor: isSelected ? 'var(--accent-primary)' : isHovered ? 'var(--border-hover)' : 'var(--border-default)',
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: isSelected 
                  ? '0 4px 12px rgba(91, 141, 239, 0.2)' 
                  : isHovered
                    ? '0 4px 8px rgba(0, 0, 0, 0.08)'
                    : '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--accent-primary-bg)',
                  }}
                >
                  <FileText
                    className="w-5 h-5"
                    style={{ color: isSelected ? 'white' : 'var(--accent-primary)' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {form.name}
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {form.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--surface-canvas)', color: 'var(--text-secondary)' }}>
                      {form.fieldCount} fields
                    </div>
                    <div className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--surface-canvas)', color: 'var(--text-secondary)' }}>
                      ~{form.estimatedTime}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.categories.map(category => (
                      <span
                        key={category}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: 'var(--cf-neutral-20)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--accent-primary)' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action preview */}
      {selectedForm && (
        <div
          className="p-4 rounded-lg border animate-fade-in"
          style={{
            backgroundColor: intakePath === 'send' ? 'var(--status-success-bg)' : 'var(--accent-primary-bg)',
            borderColor: intakePath === 'send' ? 'var(--status-success)' : 'var(--accent-primary)',
          }}
        >
          <div className="flex items-start gap-3">
            {intakePath === 'send' ? (
              <Send className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-success)' }} />
            ) : (
              <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                {intakePath === 'send' ? 'Ready to Send' : 'Ready to Fill'}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {intakePath === 'send' 
                  ? `Form will be sent via SMS to ${patientPhone}. Patient will receive a link to complete it online.`
                  : `You will be taken to the intake form to manually enter patient information.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          disabled={isSending}
          className="px-5 py-2.5 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-primary)',
            opacity: isSending ? 0.5 : 1,
          }}
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          disabled={!selectedForm || isSending}
          className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
          style={{
            backgroundColor: selectedForm && !isSending ? (intakePath === 'send' ? 'var(--status-success)' : 'var(--accent-primary)') : 'var(--cf-neutral-30)',
            color: 'white',
            opacity: selectedForm && !isSending ? 1 : 0.5,
            cursor: selectedForm && !isSending ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (selectedForm && !isSending) {
              e.currentTarget.style.opacity = '0.9';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedForm && !isSending) {
              e.currentTarget.style.opacity = '1';
            }
          }}
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>{intakePath === 'send' ? 'Send Form' : 'Open Form'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
