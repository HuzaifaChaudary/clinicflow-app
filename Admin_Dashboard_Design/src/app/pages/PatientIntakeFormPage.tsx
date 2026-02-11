import React, { useState } from 'react';
import { IntakeProgressBar } from '../components/intake/IntakeProgressBar';
import {
  IntakeFormField,
  IntakeTextInput,
  IntakeTextArea,
  IntakeSelectPills,
  IntakeToggle,
  IntakeCheckbox,
} from '../components/intake/IntakeFormField';
import { Button } from '../components/foundation/Button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface IntakeFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;

  // Reason for Visit
  visitReason: string;
  symptoms: string;

  // Medical Background
  allergies: string;
  medications: string;
  hasChronicConditions: boolean;
  chronicConditions?: string;

  // Consent
  consentAcknowledged: boolean;
}

const TOTAL_STEPS = 4;

export function PatientIntakeFormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<IntakeFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    visitReason: '',
    symptoms: '',
    allergies: '',
    medications: '',
    hasChronicConditions: false,
    consentAcknowledged: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof IntakeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      if (!formData.visitReason) newErrors.visitReason = 'Please select a reason for visit';
    }

    if (step === 4) {
      if (!formData.consentAcknowledged) {
        newErrors.consentAcknowledged = 'You must acknowledge the consent to continue';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting intake form:', formData);
    setIsSubmitted(true);
  };

  // Landing Screen (Step 0)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="max-w-lg w-full mx-auto px-6">
          <div
            className="rounded-[22px] p-8 text-center"
            style={{
              backgroundColor: 'var(--surface-primary)',
              boxShadow: '0px 4px 16px rgba(30, 41, 59, 0.08)',
            }}
          >
            {/* Clinic Logo Placeholder */}
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <span className="text-2xl font-bold" style={{ color: 'var(--text-inverse)' }}>
                WM
              </span>
            </div>

            <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome to Westside Medical
            </h1>

            <div className="my-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-canvas)' }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Your appointment
              </p>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Tomorrow at 10:30 AM
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                with Dr. Chen
              </p>
            </div>

            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              This will take about 3–5 minutes. Your information is secure and will only be shared with your care team.
            </p>

            <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
              Start intake
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="max-w-lg w-full mx-auto px-6">
          <div
            className="rounded-[22px] p-8 text-center"
            style={{
              backgroundColor: 'var(--surface-primary)',
              boxShadow: '0px 4px 16px rgba(30, 41, 59, 0.08)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(77, 163, 161, 0.15)' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'var(--cf-success)' }} />
            </div>

            <h2 className="mb-3" style={{ color: 'var(--text-primary)' }}>
              You're all set!
            </h2>

            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              We've shared your intake information with Westside Medical. See you at your appointment tomorrow at 10:30 AM.
            </p>

            <div
              className="p-4 rounded-xl text-left"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                What's next?
              </p>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <li>• Arrive 10 minutes early</li>
                <li>• Bring a valid ID and insurance card</li>
                <li>• Check in at the front desk</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form Steps
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-2xl w-full mx-auto px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <IntakeProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Form Card */}
        <div
          className="rounded-[22px] p-8"
          style={{
            backgroundColor: 'var(--surface-primary)',
            boxShadow: '0px 4px 16px rgba(30, 41, 59, 0.08)',
          }}
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 style={{ color: 'var(--text-primary)' }}>Basic information</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Let's start with your contact details
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <IntakeFormField label="First name" required error={errors.firstName}>
                  <IntakeTextInput
                    value={formData.firstName}
                    onChange={(value) => updateField('firstName', value)}
                    placeholder="John"
                    error={!!errors.firstName}
                  />
                </IntakeFormField>

                <IntakeFormField label="Last name" required error={errors.lastName}>
                  <IntakeTextInput
                    value={formData.lastName}
                    onChange={(value) => updateField('lastName', value)}
                    placeholder="Doe"
                    error={!!errors.lastName}
                  />
                </IntakeFormField>
              </div>

              <IntakeFormField label="Date of birth" required error={errors.dateOfBirth}>
                <IntakeTextInput
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(value) => updateField('dateOfBirth', value)}
                  error={!!errors.dateOfBirth}
                />
              </IntakeFormField>

              <IntakeFormField label="Email" required error={errors.email}>
                <IntakeTextInput
                  type="email"
                  value={formData.email}
                  onChange={(value) => updateField('email', value)}
                  placeholder="john.doe@example.com"
                  error={!!errors.email}
                />
              </IntakeFormField>

              <IntakeFormField label="Phone number" required error={errors.phone}>
                <IntakeTextInput
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => updateField('phone', value)}
                  placeholder="(555) 123-4567"
                  error={!!errors.phone}
                />
              </IntakeFormField>
            </div>
          )}

          {/* Step 2: Reason for Visit */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 style={{ color: 'var(--text-primary)' }}>Reason for visit</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Help us understand why you're coming in
                </p>
              </div>

              <IntakeFormField label="What brings you in today?" required error={errors.visitReason}>
                <IntakeSelectPills
                  options={[
                    { value: 'checkup', label: 'Annual checkup' },
                    { value: 'follow-up', label: 'Follow-up' },
                    { value: 'new-issue', label: 'New health issue' },
                    { value: 'consultation', label: 'Consultation' },
                  ]}
                  value={formData.visitReason}
                  onChange={(value) => updateField('visitReason', value)}
                />
              </IntakeFormField>

              <IntakeFormField
                label="Describe your symptoms or concerns"
                helpText="This helps your doctor prepare for your visit"
              >
                <IntakeTextArea
                  value={formData.symptoms}
                  onChange={(value) => updateField('symptoms', value)}
                  placeholder="Tell us what you've been experiencing..."
                  rows={5}
                />
              </IntakeFormField>
            </div>
          )}

          {/* Step 3: Medical Background */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 style={{ color: 'var(--text-primary)' }}>Medical background</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Information about your health history
                </p>
              </div>

              <IntakeFormField
                label="Any allergies?"
                helpText="Include medications, foods, or environmental allergies"
              >
                <IntakeTextInput
                  value={formData.allergies}
                  onChange={(value) => updateField('allergies', value)}
                  placeholder="None, or list allergies"
                />
              </IntakeFormField>

              <IntakeFormField
                label="Current medications"
                helpText="Include prescriptions, over-the-counter, and supplements"
              >
                <IntakeTextArea
                  value={formData.medications}
                  onChange={(value) => updateField('medications', value)}
                  placeholder="None, or list medications with dosages"
                  rows={4}
                />
              </IntakeFormField>

              <div className="space-y-3">
                <IntakeToggle
                  checked={formData.hasChronicConditions}
                  onChange={(value) => updateField('hasChronicConditions', value)}
                  label="I have chronic health conditions"
                />

                {formData.hasChronicConditions && (
                  <IntakeFormField label="Please describe">
                    <IntakeTextArea
                      value={formData.chronicConditions || ''}
                      onChange={(value) => updateField('chronicConditions', value)}
                      placeholder="e.g., Diabetes, Hypertension, Asthma"
                      rows={3}
                    />
                  </IntakeFormField>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Consent */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 style={{ color: 'var(--text-primary)' }}>Review and consent</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Please review and acknowledge the following
                </p>
              </div>

              <div
                className="p-5 rounded-xl max-h-64 overflow-y-auto text-sm leading-relaxed"
                style={{
                  backgroundColor: 'var(--surface-canvas)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Consent to Treatment
                </h4>
                <p className="mb-3">
                  I hereby give consent to Westside Medical Center and its healthcare providers to
                  examine, diagnose, and provide treatment as deemed necessary.
                </p>
                <p className="mb-3">
                  I understand that this consent includes routine diagnostic procedures, medical
                  treatment, and any procedures that may be necessary for my care.
                </p>
                <h4 className="font-medium mb-3 mt-4" style={{ color: 'var(--text-primary)' }}>
                  Privacy Notice
                </h4>
                <p className="mb-3">
                  Your health information is protected under HIPAA regulations. We will only share
                  your information with your care team and as required by law.
                </p>
                <p>
                  By submitting this form, you acknowledge that you have read and understood our
                  privacy practices.
                </p>
              </div>

              <IntakeCheckbox
                checked={formData.consentAcknowledged}
                onChange={(value) => updateField('consentAcknowledged', value)}
                label={
                  <span>
                    I have read and agree to the consent to treatment and privacy notice.{' '}
                    <span style={{ color: 'var(--cf-error)' }}>*</span>
                  </span>
                }
              />

              {errors.consentAcknowledged && (
                <p className="text-sm" style={{ color: 'var(--cf-error)' }}>
                  {errors.consentAcknowledged}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            icon={ArrowLeft}
            disabled={currentStep === 0}
          >
            Back
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            icon={currentStep === TOTAL_STEPS ? CheckCircle : ArrowRight}
            iconPosition={currentStep === TOTAL_STEPS ? 'left' : 'right'}
          >
            {currentStep === TOTAL_STEPS ? 'Submit intake' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}