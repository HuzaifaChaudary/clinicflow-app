import { useState } from 'react';
import { MapPin, Video } from 'lucide-react';

interface Step1Props {
  selectedType: 'in-clinic' | 'virtual' | null;
  onSelect: (type: 'in-clinic' | 'virtual') => void;
  onNext: () => void;
}

export function Step1_VisitTypeSelection({ selectedType, onSelect, onNext }: Step1Props) {
  const [hoveredType, setHoveredType] = useState<'in-clinic' | 'virtual' | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          What type of visit is this?
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Select the visit format for this appointment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* In-clinic option */}
        <button
          onClick={() => onSelect('in-clinic')}
          onMouseEnter={() => setHoveredType('in-clinic')}
          onMouseLeave={() => setHoveredType(null)}
          className="p-6 rounded-lg border-2 transition-all text-left"
          style={{
            backgroundColor: selectedType === 'in-clinic' ? 'var(--status-success-bg)' : 'var(--surface-card)',
            borderColor: selectedType === 'in-clinic' ? 'var(--status-success)' : hoveredType === 'in-clinic' ? 'var(--border-hover)' : 'var(--border-default)',
            transform: hoveredType === 'in-clinic' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: selectedType === 'in-clinic' 
              ? '0 4px 12px rgba(34, 197, 94, 0.2)' 
              : hoveredType === 'in-clinic' 
                ? '0 4px 8px rgba(0, 0, 0, 0.08)' 
                : '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
            style={{
              backgroundColor: selectedType === 'in-clinic' ? 'var(--status-success)' : 'var(--status-success-bg)',
            }}
          >
            <MapPin
              className="w-6 h-6"
              style={{ color: selectedType === 'in-clinic' ? 'white' : 'var(--status-success)' }}
            />
          </div>
          <div className="mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
            In-clinic Visit
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Patient will visit the clinic physically
          </p>
          {selectedType === 'in-clinic' && (
            <div className="mt-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--status-success)' }}>
                Selected
              </span>
            </div>
          )}
        </button>

        {/* Video option */}
        <button
          onClick={() => onSelect('virtual')}
          onMouseEnter={() => setHoveredType('virtual')}
          onMouseLeave={() => setHoveredType(null)}
          className="p-6 rounded-lg border-2 transition-all text-left"
          style={{
            backgroundColor: selectedType === 'virtual' ? 'var(--accent-primary-bg)' : 'var(--surface-card)',
            borderColor: selectedType === 'virtual' ? 'var(--accent-primary)' : hoveredType === 'virtual' ? 'var(--border-hover)' : 'var(--border-default)',
            transform: hoveredType === 'virtual' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: selectedType === 'virtual' 
              ? '0 4px 12px rgba(91, 141, 239, 0.2)' 
              : hoveredType === 'virtual' 
                ? '0 4px 8px rgba(0, 0, 0, 0.08)' 
                : '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
            style={{
              backgroundColor: selectedType === 'virtual' ? 'var(--accent-primary)' : 'var(--accent-primary-bg)',
            }}
          >
            <Video
              className="w-6 h-6"
              style={{ color: selectedType === 'virtual' ? 'white' : 'var(--accent-primary)' }}
            />
          </div>
          <div className="mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
            Video Consultation
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Virtual appointment via video call
          </p>
          {selectedType === 'virtual' && (
            <div className="mt-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                Selected
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Next button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!selectedType}
          className="px-6 py-3 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: selectedType ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
            color: 'white',
            opacity: selectedType ? 1 : 0.5,
            cursor: selectedType ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (selectedType) {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedType) {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            }
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
