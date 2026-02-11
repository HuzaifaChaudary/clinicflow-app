import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator';
import { Step1_VisitTypeSelection } from './Step1_VisitTypeSelection';
import { Step2_ProviderAndScheduling } from './Step2_ProviderAndScheduling';
import { Step3_PatientInformation } from './Step3_PatientInformation';
import { Step4_IntakePathDecision_Redesigned } from './Step4_IntakePathDecision_Redesigned';
import { Step5_VisitReasonSelection } from './Step5_VisitReasonSelection';
import { Step6_IntakeFormSelection } from './Step6_IntakeFormSelection';

interface ScalableAddPatientFlowProps {
  onClose: () => void;
  onComplete: (patientData: PatientFlowData) => void;
  availableProviders: string[];
}

export interface PatientFlowData {
  // Step 1
  visitType: 'in-clinic' | 'virtual';
  // Step 2
  provider?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  // Step 3
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientNotes?: string;
  // Step 4
  intakePath: 'send' | 'manual' | 'skip';
  // Step 5
  visitReason?: string;
  customReason?: string;
  // Step 6
  selectedForm?: string;
}

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6;

export function ScalableAddPatientFlow({
  onClose,
  onComplete,
  availableProviders,
}: ScalableAddPatientFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);
  const [isClosing, setIsClosing] = useState(false);

  // Form state
  const [visitType, setVisitType] = useState<'in-clinic' | 'virtual' | null>(null);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [intakePath, setIntakePath] = useState<'send' | 'manual' | 'skip' | null>(null);
  const [visitReason, setVisitReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [selectedForm, setSelectedForm] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const stepLabels = ['Visit Type', 'Schedule', 'Patient Info', 'Intake Path', 'Visit Reason', 'Form'];
  const totalSteps = 6;

  // Determine actual total steps based on flow
  const getEffectiveStepCount = () => {
    if (intakePath === 'skip') return 4; // Skip steps 5 and 6
    if (intakePath === 'send' || intakePath === 'manual') return 6;
    return 6;
  };

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep3Next = () => {
    setCurrentStep(4);
  };

  const handleStep3Back = () => {
    setCurrentStep(2);
  };

  const handleStep4Next = () => {
    if (intakePath === 'skip') {
      // Complete flow immediately
      handleComplete();
    } else {
      setCurrentStep(5);
    }
  };

  const handleStep5Next = () => {
    setCurrentStep(6);
  };

  const handleStep5Back = () => {
    setCurrentStep(4);
  };

  const handleStep6Back = () => {
    setCurrentStep(5);
  };

  const handleComplete = () => {
    const patientData: PatientFlowData = {
      visitType: visitType!,
      provider: selectedProvider || undefined,
      appointmentDate: selectedDate || undefined,
      appointmentTime: selectedTime !== 'unscheduled' ? selectedTime : undefined,
      patientName,
      patientPhone,
      patientEmail: patientEmail || undefined,
      patientNotes: patientNotes || undefined,
      intakePath: intakePath!,
      visitReason: visitReason || undefined,
      customReason: customReason || undefined,
      selectedForm: selectedForm || undefined,
    };

    onComplete(patientData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-lg shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--surface-card)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          opacity: isClosing ? 0 : 1,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div>
            <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Add New Patient
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Step {currentStep} of {getEffectiveStepCount()}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-6 flex-shrink-0">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />
        </div>

        {/* Step content - scrollable */}
        <div
          className="flex-1 overflow-y-auto px-6 py-6"
          style={{
            minHeight: 0, // Important for flex scrolling
          }}
        >
          {currentStep === 1 && (
            <Step1_VisitTypeSelection
              selectedType={visitType}
              onSelect={setVisitType}
              onNext={handleStep1Next}
            />
          )}

          {currentStep === 2 && (
            <Step2_ProviderAndScheduling
              selectedProvider={selectedProvider}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              availableProviders={availableProviders}
              onProviderChange={setSelectedProvider}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              onNext={handleStep2Next}
              onBack={handleStep2Back}
            />
          )}

          {currentStep === 3 && (
            <Step3_PatientInformation
              patientName={patientName}
              patientPhone={patientPhone}
              patientEmail={patientEmail}
              patientNotes={patientNotes}
              onNameChange={setPatientName}
              onPhoneChange={setPatientPhone}
              onEmailChange={setPatientEmail}
              onNotesChange={setPatientNotes}
              onNext={handleStep3Next}
              onBack={handleStep3Back}
            />
          )}

          {currentStep === 4 && (
            <Step4_IntakePathDecision_Redesigned
              patientName={patientName}
              patientPhone={patientPhone}
              selectedPath={intakePath}
              onPathSelect={setIntakePath}
              onNext={handleStep4Next}
            />
          )}

          {currentStep === 5 && (
            <Step5_VisitReasonSelection
              selectedReason={visitReason}
              customReason={customReason}
              onReasonSelect={setVisitReason}
              onCustomReasonChange={setCustomReason}
              onNext={handleStep5Next}
              onBack={handleStep5Back}
            />
          )}

          {currentStep === 6 && (
            <Step6_IntakeFormSelection
              visitReason={visitReason}
              intakePath={intakePath as 'send' | 'manual'}
              selectedForm={selectedForm}
              patientPhone={patientPhone}
              onFormSelect={setSelectedForm}
              onComplete={handleComplete}
              onBack={handleStep6Back}
            />
          )}
        </div>
      </div>
    </div>
  );
}