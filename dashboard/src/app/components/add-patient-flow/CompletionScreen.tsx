import { CheckCircle, User, Calendar, FileText, Send, ArrowRight } from 'lucide-react';
import { PatientFlowData } from './ScalableAddPatientFlow';

interface CompletionScreenProps {
  patientData: PatientFlowData;
  onViewPatient: () => void;
  onViewSchedule: () => void;
  onClose: () => void;
}

export function CompletionScreen({
  patientData,
  onViewPatient,
  onViewSchedule,
  onClose,
}: CompletionScreenProps) {
  const hasAppointment = patientData.appointmentDate && patientData.appointmentTime;

  return (
    <div className="text-center py-8">
      {/* Success icon */}
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center animate-scale-in"
        style={{
          backgroundColor: 'var(--status-success-bg)',
        }}
      >
        <CheckCircle className="w-10 h-10" style={{ color: 'var(--status-success)' }} />
      </div>

      {/* Success message */}
      <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        Patient Successfully Added!
      </h3>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        {patientData.patientName} has been created and is now in the system
      </p>

      {/* Summary cards */}
      <div className="space-y-3 mb-8">
        {/* Patient info */}
        <div
          className="p-4 rounded-lg border text-left"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Patient Information
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {patientData.patientName} • {patientData.patientPhone}
                {patientData.patientEmail && ` • ${patientData.patientEmail}`}
              </p>
            </div>
          </div>
        </div>

        {/* Appointment info */}
        {hasAppointment && (
          <div
            className="p-4 rounded-lg border text-left"
            style={{
              backgroundColor: 'var(--accent-primary-bg)',
              borderColor: 'var(--accent-primary)',
            }}
          >
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  Appointment Scheduled
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(patientData.appointmentDate!).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {patientData.appointmentTime}
                  {patientData.provider && ` with ${patientData.provider}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Intake status */}
        <div
          className="p-4 rounded-lg border text-left"
          style={{
            backgroundColor: patientData.intakePath === 'send' 
              ? 'var(--status-success-bg)' 
              : patientData.intakePath === 'manual'
                ? 'var(--accent-primary-bg)'
                : 'var(--status-warning-bg)',
            borderColor: patientData.intakePath === 'send' 
              ? 'var(--status-success)' 
              : patientData.intakePath === 'manual'
                ? 'var(--accent-primary)'
                : 'var(--status-warning)',
          }}
        >
          <div className="flex items-start gap-3">
            {patientData.intakePath === 'send' ? (
              <Send className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--status-success)' }} />
            ) : (
              <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ 
                color: patientData.intakePath === 'manual' ? 'var(--accent-primary)' : 'var(--status-warning)' 
              }} />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                {patientData.intakePath === 'send' && 'Intake Form Sent'}
                {patientData.intakePath === 'manual' && 'Manual Intake Initiated'}
                {patientData.intakePath === 'skip' && 'Intake Pending'}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {patientData.intakePath === 'send' && `SMS sent to ${patientData.patientPhone} with intake form link`}
                {patientData.intakePath === 'manual' && 'Form ready to be filled by staff'}
                {patientData.intakePath === 'skip' && 'Patient will appear in "Needs Attention"'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={onViewSchedule}
          className="w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
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
          <Calendar className="w-4 h-4" />
          <span>View Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onViewPatient}
          className="w-full px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-card)';
          }}
        >
          <User className="w-4 h-4" />
          <span>View Patient Details</span>
        </button>

        <button
          onClick={onClose}
          className="w-full text-sm font-medium py-2 transition-all"
          style={{
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
