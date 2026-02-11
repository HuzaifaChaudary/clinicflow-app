import { useState } from 'react';
import { MessageSquare, FileEdit, ChevronRight, Phone, User } from 'lucide-react';

interface Step4Props {
  patientName: string;
  patientPhone: string;
  selectedPath: 'send' | 'manual' | null;
  onPathSelect: (path: 'send' | 'manual') => void;
  onNext: () => void;
}

export function Step4_IntakePathDecision_Redesigned({
  patientName,
  patientPhone,
  selectedPath,
  onPathSelect,
  onNext,
}: Step4Props) {
  const [hoveredPath, setHoveredPath] = useState<'send' | 'manual' | null>(null);

  // Format phone for display
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formattedPhone = formatPhone(patientPhone);

  // Determine next button text
  const getNextButtonText = () => {
    if (!selectedPath) return 'Select an option';
    if (selectedPath === 'send') return 'Send Intake';
    return 'Continue to Intake';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          How would you like to complete the intake?
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Choose how the patient will fill their intake form
        </p>
      </div>

      {/* Patient confirmation card */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: 'var(--surface-canvas)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--accent-primary-bg)',
            }}
          >
            <User className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {patientName}
            </p>
            <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Phone className="w-3.5 h-3.5" />
              <span>{formattedPhone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Option A: Send to Patient (Primary/Recommended) */}
      <button
        onClick={() => onPathSelect('send')}
        onMouseEnter={() => setHoveredPath('send')}
        onMouseLeave={() => setHoveredPath(null)}
        className="w-full p-6 rounded-lg border-2 transition-all text-left group"
        style={{
          backgroundColor: selectedPath === 'send' ? 'var(--accent-primary)' : hoveredPath === 'send' ? 'var(--accent-primary-bg)' : 'var(--surface-card)',
          borderColor: selectedPath === 'send' ? 'var(--accent-primary)' : hoveredPath === 'send' ? 'var(--accent-primary)' : 'var(--border-default)',
          transform: hoveredPath === 'send' ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: selectedPath === 'send' 
            ? '0 8px 24px rgba(91, 141, 239, 0.25)' 
            : hoveredPath === 'send'
              ? '0 4px 12px rgba(0, 0, 0, 0.08)'
              : '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              backgroundColor: selectedPath === 'send' ? 'rgba(255, 255, 255, 0.2)' : 'var(--accent-primary-bg)',
            }}
          >
            <MessageSquare
              className="w-7 h-7"
              style={{ color: selectedPath === 'send' ? 'white' : 'var(--accent-primary)' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Recommended badge */}
            <div className="flex items-center gap-2 mb-3">
              <span 
                className="text-base font-semibold"
                style={{ color: selectedPath === 'send' ? 'white' : 'var(--text-primary)' }}
              >
                Send intake to patient automatically
              </span>
              <div
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: selectedPath === 'send' ? 'rgba(34, 197, 94, 1)' : 'var(--status-success)',
                  color: 'white',
                }}
              >
                RECOMMENDED
              </div>
            </div>

            {/* Description */}
            <p 
              className="text-sm mb-4 leading-relaxed"
              style={{ 
                color: selectedPath === 'send' ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)' 
              }}
            >
              We'll text the intake form to the patient's phone number so they can complete it on their own.
            </p>

            {/* Phone number display */}
            <div
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
              style={{
                backgroundColor: selectedPath === 'send' ? 'rgba(255, 255, 255, 0.15)' : 'var(--cf-neutral-20)',
              }}
            >
              <MessageSquare className="w-4 h-4" style={{ color: selectedPath === 'send' ? 'white' : 'var(--accent-primary)' }} />
              <span 
                className="text-sm font-medium"
                style={{ color: selectedPath === 'send' ? 'white' : 'var(--text-primary)' }}
              >
                Will be sent to {formattedPhone}
              </span>
            </div>

            {/* Status note */}
            <div className="flex items-start gap-2">
              <div 
                className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                style={{ 
                  backgroundColor: selectedPath === 'send' ? 'rgba(255, 255, 255, 0.6)' : 'var(--text-muted)' 
                }}
              />
              <p 
                className="text-xs leading-relaxed"
                style={{ 
                  color: selectedPath === 'send' ? 'rgba(255, 255, 255, 0.75)' : 'var(--text-muted)' 
                }}
              >
                Patient will appear as "Intake pending" until they complete the form. Automation begins immediately.
              </p>
            </div>
          </div>

          {/* Selection indicator */}
          {selectedPath === 'send' && (
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'white' }}
            >
              <svg className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </button>

      {/* Option B: Fill Manually (Secondary) */}
      <button
        onClick={() => onPathSelect('manual')}
        onMouseEnter={() => setHoveredPath('manual')}
        onMouseLeave={() => setHoveredPath(null)}
        className="w-full p-6 rounded-lg border-2 transition-all text-left"
        style={{
          backgroundColor: selectedPath === 'manual' ? 'var(--cf-neutral-20)' : hoveredPath === 'manual' ? 'var(--surface-hover)' : 'var(--surface-card)',
          borderColor: selectedPath === 'manual' ? 'var(--cf-neutral-50)' : hoveredPath === 'manual' ? 'var(--border-hover)' : 'var(--border-default)',
          transform: hoveredPath === 'manual' ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: selectedPath === 'manual' 
            ? '0 4px 12px rgba(0, 0, 0, 0.12)' 
            : hoveredPath === 'manual'
              ? '0 4px 12px rgba(0, 0, 0, 0.08)'
              : '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: selectedPath === 'manual' ? 'var(--cf-neutral-50)' : 'var(--cf-neutral-20)',
            }}
          >
            <FileEdit
              className="w-7 h-7"
              style={{ color: selectedPath === 'manual' ? 'white' : 'var(--text-secondary)' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Label */}
            <div className="mb-3">
              <span 
                className="text-base font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Fill intake manually now
              </span>
            </div>

            {/* Description */}
            <p 
              className="text-sm mb-3 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Complete the intake form on behalf of the patient during the visit or call.
            </p>

            {/* Use case note */}
            <div className="flex items-start gap-2">
              <div 
                className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: 'var(--text-muted)' }}
              />
              <p 
                className="text-xs leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                Best for walk-ins or patients without phone access
              </p>
            </div>
          </div>

          {/* Selection indicator */}
          {selectedPath === 'manual' && (
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: 'var(--cf-neutral-50)',
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </button>

      {/* Next button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!selectedPath}
          className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
          style={{
            backgroundColor: selectedPath ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
            color: 'white',
            opacity: selectedPath ? 1 : 0.5,
            cursor: selectedPath ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (selectedPath) {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedPath) {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            }
          }}
        >
          <span>{getNextButtonText()}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
