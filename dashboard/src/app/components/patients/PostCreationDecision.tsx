import { useState } from 'react';
import { X, MessageSquare, FileEdit, ChevronRight } from 'lucide-react';
import { PatientFormData } from './AddPatientFlow';

interface PostCreationDecisionProps {
  patientData: PatientFormData;
  onSendIntake: () => void;
  onFillManually: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export function PostCreationDecision({
  patientData,
  onSendIntake,
  onFillManually,
  onSkip,
  onClose,
}: PostCreationDecisionProps) {
  const [selectedAction, setSelectedAction] = useState<'send' | 'fill' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (selectedAction === 'send') {
      onSendIntake();
    } else if (selectedAction === 'fill') {
      onFillManually();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div
        className="w-full max-w-2xl rounded-lg shadow-xl animate-scale-in"
        style={{
          backgroundColor: 'var(--surface-card)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Patient Created Successfully
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {patientData.name} has been added to the system
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            How would you like to collect intake information?
          </p>

          {/* Option 1: Send Intake Form */}
          <button
            onClick={() => setSelectedAction('send')}
            className="w-full p-5 rounded-lg border-2 transition-all text-left"
            style={{
              backgroundColor: selectedAction === 'send' ? 'var(--accent-primary-bg)' : 'var(--surface-card)',
              borderColor: selectedAction === 'send' ? 'var(--accent-primary)' : 'var(--border-default)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: selectedAction === 'send' ? 'var(--accent-primary)' : 'var(--accent-primary-bg)',
                }}
              >
                <MessageSquare 
                  className="w-6 h-6" 
                  style={{ color: selectedAction === 'send' ? 'white' : 'var(--accent-primary)' }} 
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Send Intake Form via Text
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Send SMS to {patientData.phone} with intake form link. Patient completes it on their own.
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="px-3 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--status-success-bg)',
                      color: 'var(--status-success)',
                    }}
                  >
                    Recommended
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Automation begins immediately
                  </span>
                </div>
              </div>
              {selectedAction === 'send' && (
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
              )}
            </div>
          </button>

          {/* Option 2: Fill Manually */}
          <button
            onClick={() => setSelectedAction('fill')}
            className="w-full p-5 rounded-lg border-2 transition-all text-left"
            style={{
              backgroundColor: selectedAction === 'fill' ? 'var(--accent-primary-bg)' : 'var(--surface-card)',
              borderColor: selectedAction === 'fill' ? 'var(--accent-primary)' : 'var(--border-default)',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: selectedAction === 'fill' ? 'var(--accent-primary)' : 'var(--cf-neutral-20)',
                }}
              >
                <FileEdit 
                  className="w-6 h-6" 
                  style={{ color: selectedAction === 'fill' ? 'white' : 'var(--text-secondary)' }} 
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Fill Intake Form Now
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Open intake form and manually enter patient information on their behalf.
                </p>
              </div>
              {selectedAction === 'fill' && (
                <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
              )}
            </div>
          </button>

          {/* Option 3: Skip */}
          <button
            onClick={onSkip}
            className="w-full text-center py-3 text-sm font-medium transition-all rounded-lg"
            style={{
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Skip for now (patient will appear as "Missing Intake")
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--border-default)' }}>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-primary)',
            }}
            disabled={isProcessing}
          >
            Close
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAction || isProcessing}
            className="px-6 py-2.5 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: selectedAction ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
              color: 'white',
              opacity: selectedAction ? 1 : 0.5,
              cursor: selectedAction ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={(e) => {
              if (selectedAction) {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedAction) {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              }
            }}
          >
            {isProcessing ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
