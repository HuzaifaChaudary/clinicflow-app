import { useState } from 'react';
import { User, Phone, Mail, FileText, ChevronRight } from 'lucide-react';

interface Step3Props {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientNotes: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
  onNotesChange: (notes: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3_PatientInformation({
  patientName,
  patientPhone,
  patientEmail,
  patientNotes,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onNotesChange,
  onNext,
  onBack,
}: Step3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!patientName.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (!patientPhone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(patientPhone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (patientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const canProceed = patientName.trim() && patientPhone.trim();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Patient Information
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Enter the patient's contact details
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            <span>Full Name *</span>
          </div>
        </label>
        <input
          type="text"
          value={patientName}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={validateForm}
          placeholder="Enter patient's full name"
          className="w-full px-4 py-3 rounded-lg border transition-all"
          style={{
            backgroundColor: 'var(--surface-canvas)',
            borderColor: errors.name ? 'var(--status-error)' : patientName ? 'var(--accent-primary)' : 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        />
        {errors.name && (
          <p className="text-sm mt-1.5 flex items-center gap-1" style={{ color: 'var(--status-error)' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4" />
            <span>Phone Number *</span>
          </div>
        </label>
        <input
          type="tel"
          value={patientPhone}
          onChange={(e) => onPhoneChange(e.target.value)}
          onBlur={validateForm}
          placeholder="(555) 123-4567"
          className="w-full px-4 py-3 rounded-lg border transition-all"
          style={{
            backgroundColor: 'var(--surface-canvas)',
            borderColor: errors.phone ? 'var(--status-error)' : patientPhone ? 'var(--accent-primary)' : 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        />
        {errors.phone && (
          <p className="text-sm mt-1.5 flex items-center gap-1" style={{ color: 'var(--status-error)' }}>
            {errors.phone}
          </p>
        )}
        <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
          Required for SMS intake forms and appointment reminders
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" />
            <span>Email Address (Optional)</span>
          </div>
        </label>
        <input
          type="email"
          value={patientEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={validateForm}
          placeholder="patient@example.com"
          className="w-full px-4 py-3 rounded-lg border transition-all"
          style={{
            backgroundColor: 'var(--surface-canvas)',
            borderColor: errors.email ? 'var(--status-error)' : patientEmail ? 'var(--accent-primary)' : 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        />
        {errors.email && (
          <p className="text-sm mt-1.5 flex items-center gap-1" style={{ color: 'var(--status-error)' }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            <span>Notes (Optional)</span>
          </div>
        </label>
        <textarea
          value={patientNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any relevant notes about this patient or appointment..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border transition-all resize-none"
          style={{
            backgroundColor: 'var(--surface-canvas)',
            borderColor: patientNotes ? 'var(--accent-primary)' : 'var(--border-default)',
            color: 'var(--text-primary)',
          }}
        />
        <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
          {patientNotes.length}/500 characters
        </p>
      </div>

      {/* Summary card */}
      {patientName && patientPhone && (
        <div
          className="p-4 rounded-lg border animate-fade-in"
          style={{
            backgroundColor: 'var(--status-success-bg)',
            borderColor: 'var(--status-success)',
          }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Patient Summary
          </p>
          <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>{patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>{patientPhone}</span>
            </div>
            {patientEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>{patientEmail}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: 'var(--surface-hover)',
            color: 'var(--text-primary)',
          }}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canProceed}
          className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
          style={{
            backgroundColor: canProceed ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
            color: 'white',
            opacity: canProceed ? 1 : 0.5,
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={(e) => {
            if (canProceed) {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (canProceed) {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            }
          }}
        >
          <span>Create Patient</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
