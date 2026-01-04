import React, { ReactNode } from 'react';

interface IntakeFormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: ReactNode;
}

export function IntakeFormField({
  label,
  required = false,
  error,
  helpText,
  children,
}: IntakeFormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
          {required && (
            <span className="ml-1" style={{ color: 'var(--cf-error)' }}>
              *
            </span>
          )}
        </span>
      </label>

      {children}

      {helpText && !error && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {helpText}
        </p>
      )}

      {error && (
        <p className="text-xs" style={{ color: 'var(--cf-error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

interface IntakeTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'date';
  error?: boolean;
}

export function IntakeTextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  error = false,
}: IntakeTextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
      style={{
        backgroundColor: 'var(--surface-card)',
        color: 'var(--text-primary)',
        border: error
          ? '2px solid var(--cf-error)'
          : '2px solid var(--border-subtle)',
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.border = '2px solid var(--accent-primary)';
        }
      }}
      onBlur={(e) => {
        if (!error) {
          e.currentTarget.style.border = '2px solid var(--border-subtle)';
        }
      }}
    />
  );
}

interface IntakeTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: boolean;
}

export function IntakeTextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  error = false,
}: IntakeTextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 rounded-xl text-base resize-none transition-all duration-200 focus:outline-none"
      style={{
        backgroundColor: 'var(--surface-card)',
        color: 'var(--text-primary)',
        border: error
          ? '2px solid var(--cf-error)'
          : '2px solid var(--border-subtle)',
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.border = '2px solid var(--accent-primary)';
        }
      }}
      onBlur={(e) => {
        if (!error) {
          e.currentTarget.style.border = '2px solid var(--border-subtle)';
        }
      }}
    />
  );
}

interface SelectPillOption {
  value: string;
  label: string;
}

interface IntakeSelectPillsProps {
  options: SelectPillOption[];
  value: string;
  onChange: (value: string) => void;
}

export function IntakeSelectPills({
  options,
  value,
  onChange,
}: IntakeSelectPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: isSelected
                ? 'var(--accent-primary)'
                : 'var(--surface-card)',
              color: isSelected ? 'var(--text-inverse)' : 'var(--text-primary)',
              border: isSelected
                ? '2px solid var(--accent-primary)'
                : '2px solid var(--border-default)',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface IntakeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function IntakeToggle({ checked, onChange, label }: IntakeToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className="relative w-12 h-6 rounded-full transition-all duration-200"
        style={{
          backgroundColor: checked ? 'var(--accent-primary)' : 'var(--border-default)',
        }}
      >
        <div
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
          style={{
            transform: checked ? 'translateX(24px)' : 'translateX(0)',
          }}
        />
      </div>
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {label}
      </span>
    </label>
  );
}

interface IntakeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string | ReactNode;
}

export function IntakeCheckbox({ checked, onChange, label }: IntakeCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        className="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 mt-0.5"
        style={{
          borderColor: checked ? 'var(--accent-primary)' : 'var(--border-default)',
          backgroundColor: checked ? 'var(--accent-primary)' : 'transparent',
        }}
      >
        {checked && (
          <svg
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M1 5L4.5 8.5L11 1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
        {label}
      </span>
    </label>
  );
}
