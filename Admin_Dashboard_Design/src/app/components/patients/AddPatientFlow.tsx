import { useState } from 'react';
import { X, User, Phone, Mail, Video, MapPin, Calendar, Clock } from 'lucide-react';

interface AddPatientFlowProps {
  onClose: () => void;
  onSubmit: (patientData: PatientFormData) => void;
  providers: string[];
}

export interface PatientFormData {
  name: string;
  phone: string;
  email?: string;
  visitType: 'in-clinic' | 'virtual';
  provider?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

export function AddPatientFlow({ onClose, onSubmit, providers }: AddPatientFlowProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    phone: '',
    email: '',
    visitType: 'in-clinic',
    provider: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div
        className="w-full max-w-2xl rounded-lg shadow-xl animate-scale-in"
        style={{
          backgroundColor: 'var(--surface-card)',
          maxHeight: '90vh',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Add New Patient
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Enter patient information to create appointment
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter patient name"
              className="w-full px-4 py-3 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: errors.name ? 'var(--status-error)' : 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            {errors.name && (
              <p className="text-sm mt-1" style={{ color: 'var(--status-error)' }}>
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
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: errors.phone ? 'var(--status-error)' : 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            {errors.phone && (
              <p className="text-sm mt-1" style={{ color: 'var(--status-error)' }}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                <span>Email (Optional)</span>
              </div>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="patient@example.com"
              className="w-full px-4 py-3 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Visit Type */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Visit Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visitType: 'in-clinic' })}
                className="p-4 rounded-lg border transition-all text-left"
                style={{
                  backgroundColor: formData.visitType === 'in-clinic' ? 'var(--accent-primary-bg)' : 'var(--surface-canvas)',
                  borderColor: formData.visitType === 'in-clinic' ? 'var(--accent-primary)' : 'var(--border-default)',
                  borderWidth: formData.visitType === 'in-clinic' ? '2px' : '1px',
                }}
              >
                <MapPin className="w-5 h-5 mb-2" style={{ color: formData.visitType === 'in-clinic' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>In-clinic</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Physical visit</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, visitType: 'virtual' })}
                className="p-4 rounded-lg border transition-all text-left"
                style={{
                  backgroundColor: formData.visitType === 'virtual' ? 'var(--accent-primary-bg)' : 'var(--surface-canvas)',
                  borderColor: formData.visitType === 'virtual' ? 'var(--accent-primary)' : 'var(--border-default)',
                  borderWidth: formData.visitType === 'virtual' ? '2px' : '1px',
                }}
              >
                <Video className="w-5 h-5 mb-2" style={{ color: formData.visitType === 'virtual' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Video call</div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Virtual visit</div>
              </button>
            </div>
          </div>

          {/* Provider */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Provider (Optional)
            </label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">Select provider</option>
              {providers.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>

          {/* Appointment Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date (Optional)</span>
                </div>
              </label>
              <input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border transition-all"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Time (Optional)</span>
                </div>
              </label>
              <input
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border transition-all"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        </form>

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
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg font-medium transition-all"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
