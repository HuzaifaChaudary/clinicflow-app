import { useState, useMemo } from 'react';
import { Plus, AlertCircle, Search, Calendar } from 'lucide-react';
import { Appointment } from '../components/AppointmentRow';
import { TimeFilterPill } from '../components/patients/TimeFilterPill';
import { PatientTableRow } from '../components/patients/PatientTableRow';
import { ScalableAddPatientFlow, PatientFlowData } from '../components/add-patient-flow/ScalableAddPatientFlow';
import { PatientSidePanel } from '../components/PatientSidePanel';
import { UniversalContactCard } from '../components/universal/UniversalContactCard';

interface PatientsPageFinalizedProps {
  appointments: Appointment[];
  onAddPatient?: (data: PatientFlowData) => void;
}

type TimeFilter = '7days' | '14days' | '30days';
type AttentionFilter = 'all' | 'needs-attention';

export function PatientsPageFinalized({ appointments, onAddPatient }: PatientsPageFinalizedProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7days');
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatientData, setNewPatientData] = useState<PatientFlowData | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Available providers
  const providers = useMemo(() => {
    const uniqueProviders = new Set(appointments.map(a => a.provider));
    return Array.from(uniqueProviders).sort();
  }, [appointments]);

  // Convert appointments to patient format
  const patients = useMemo(() => {
    return appointments.map(apt => ({
      id: apt.id,
      name: apt.patientName,
      email: `${apt.patientName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: '(555) 123-4567',
      appointmentTime: apt.time,
      provider: apt.provider,
      visitType: apt.visitType,
      status: {
        confirmed: apt.status.confirmed,
        intakeComplete: apt.status.intakeComplete,
        arrived: apt.arrived,
      },
      automation: {
        attemptCount: apt.indicators.voiceCallSent ? 3 : 0,
        lastAttempt: apt.indicators.voiceCallSent ? new Date(Date.now() - 2 * 60 * 60 * 1000) : undefined,
      },
    }));
  }, [appointments]);

  // Calculate time-based stats (mock completed consultations)
  const timeStats = useMemo(() => ({
    '7days': Math.floor(patients.length * 0.6),
    '14days': Math.floor(patients.length * 0.8),
    '30days': patients.length,
  }), [patients]);

  // Calculate needs attention count
  const needsAttentionCount = useMemo(() => {
    return patients.filter(p => !p.status.confirmed || !p.status.intakeComplete).length;
  }, [patients]);

  // Filter patients
  const filteredPatients = useMemo(() => {
    let result = [...patients];

    // Apply attention filter
    if (attentionFilter === 'needs-attention') {
      result = result.filter(p => !p.status.confirmed || !p.status.intakeComplete);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        p.provider.toLowerCase().includes(query)
      );
    }

    return result;
  }, [patients, attentionFilter, searchQuery]);

  // Handlers
  const handleAddPatientSubmit = (data: PatientFlowData) => {
    setNewPatientData(data);
    setShowAddPatient(false);
    if (onAddPatient && newPatientData) {
      onAddPatient(newPatientData);
    }
  };

  const handleCall = (patientId: string) => {
    console.log('Calling patient:', patientId);
  };

  const handleMessage = (patientId: string) => {
    console.log('Messaging patient:', patientId);
  };

  const handleSendIntakeAction = (patientId: string) => {
    console.log('Sending intake to patient:', patientId);
  };

  const selectedPatient = selectedPatientId
    ? appointments.find(a => a.id === selectedPatientId)
    : null;

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>
              Patients
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage patient records, appointments, and intake status
            </p>
          </div>

          <button
            onClick={() => setShowAddPatient(true)}
            className="px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Patient</span>
          </button>
        </div>

        {/* Time-based filters */}
        <div className="grid grid-cols-3 gap-4">
          <TimeFilterPill
            label="Last 7 days"
            count={timeStats['7days']}
            isActive={timeFilter === '7days'}
            onClick={() => setTimeFilter('7days')}
          />
          <TimeFilterPill
            label="Last 14 days"
            count={timeStats['14days']}
            isActive={timeFilter === '14days'}
            onClick={() => setTimeFilter('14days')}
          />
          <TimeFilterPill
            label="Last 30 days"
            count={timeStats['30days']}
            isActive={timeFilter === '30days'}
            onClick={() => setTimeFilter('30days')}
          />
        </div>

        {/* Needs attention button + search */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAttentionFilter(attentionFilter === 'all' ? 'needs-attention' : 'all')}
            className="px-5 py-3 rounded-lg font-medium flex items-center gap-3 transition-all"
            style={{
              backgroundColor: attentionFilter === 'needs-attention' ? 'var(--status-warning)' : 'var(--status-warning-bg)',
              borderWidth: '1.5px',
              borderStyle: 'solid',
              borderColor: 'var(--status-warning)',
              color: attentionFilter === 'needs-attention' ? 'white' : 'var(--status-warning)',
            }}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{needsAttentionCount} patients need attention</span>
          </button>

          <div className="flex-1 relative">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
              style={{ color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              placeholder="Search patients by name, email, phone, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Active filter indicator */}
        {attentionFilter === 'needs-attention' && (
          <div
            className="px-4 py-3 rounded-lg flex items-center justify-between animate-fade-in"
            style={{
              backgroundColor: 'var(--status-warning-bg)',
              border: '1px solid var(--status-warning)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-warning)' }} />
              <span className="font-medium" style={{ color: 'var(--status-warning)' }}>
                Showing only patients needing attention
              </span>
            </div>
            <button
              onClick={() => setAttentionFilter('all')}
              className="text-sm font-medium px-3 py-1 rounded transition-all"
              style={{
                color: 'var(--status-warning)',
                backgroundColor: 'white',
              }}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Patient table */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: 'var(--surface-card)',
            borderColor: 'var(--border-default)',
          }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-12 gap-4 px-6 py-3 border-b text-sm font-medium"
            style={{
              backgroundColor: 'var(--surface-canvas)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            <div className="col-span-3">Patient</div>
            <div className="col-span-2">Appointment</div>
            <div className="col-span-2">Provider</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Automation</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table body */}
          <div>
            {filteredPatients.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  No patients found
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery ? 'Try adjusting your search' : 'Add a new patient to get started'}
                </p>
              </div>
            ) : (
              filteredPatients.map(patient => (
                <PatientTableRow
                  key={patient.id}
                  patient={patient}
                  onClick={() => setSelectedPatientId(patient.id)}
                  onCall={() => handleCall(patient.id)}
                  onMessage={() => handleMessage(patient.id)}
                  onSendIntake={() => handleSendIntakeAction(patient.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Results summary */}
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Showing {filteredPatients.length} of {patients.length} patients
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>

      {/* Add patient flow */}
      {showAddPatient && (
        <ScalableAddPatientFlow
          onClose={() => setShowAddPatient(false)}
          onComplete={handleAddPatientSubmit}
          availableProviders={providers}
        />
      )}

      {/* Patient side panel */}
      {selectedPatient && (
        <PatientSidePanel
          appointment={selectedPatient}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
}