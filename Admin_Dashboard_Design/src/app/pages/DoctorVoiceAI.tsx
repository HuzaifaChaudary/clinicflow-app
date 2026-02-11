import { useState } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Play, 
  Pause,
  Clock,
  Video,
  MapPin,
  FileText,
  Pill,
  Calendar,
  CheckCircle2,
  Edit2,
  AlertTriangle,
  ChevronRight,
  Shield,
  User,
  Activity,
  Stethoscope,
  ClipboardList,
  Bell
} from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { mockDoctors } from '../data/enhancedMockData';
import { Appointment } from '../types/appointment';

interface DoctorVoiceAIProps {
  appointments: Appointment[];
}

type TabType = 'note-draft' | 'medications' | 'follow-up';
type TranscriptionStatus = 'idle' | 'recording' | 'paused';

interface Message {
  id: string;
  role: 'doctor' | 'ava';
  content: string;
  timestamp: string;
}

interface NoteDraft {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface MedicationSuggestion {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  indication: string;
  safetyNote?: string;
  included: boolean;
}

interface FollowUpCadence {
  timing: string;
  suggested: boolean;
  editedDate?: string;
  visitType?: 'in-clinic' | 'virtual';
  reason: string;
  reminders: {
    id: string;
    timing: string;
    channel: string;
  }[];
}

export function DoctorVoiceAI({ appointments }: DoctorVoiceAIProps) {
  const { activeDoctorId } = useRole();
  const [activeTab, setActiveTab] = useState<TabType>('note-draft');
  const [transcriptionStatus, setTranscriptionStatus] = useState<TranscriptionStatus>('idle');
  const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ava',
      content: 'Good morning, Dr. Chen. I\'m ready to help you document today\'s visits. Select a patient from "Today\'s Patients" to begin, or start transcription for your active visit.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Get current doctor
  const currentDoctor = activeDoctorId 
    ? mockDoctors.find(d => d.id === activeDoctorId)
    : null;

  // Filter today's appointments for this doctor
  const todayAppointments = currentDoctor
    ? appointments
        .filter(apt => 
          apt.date === '2026-01-01' && 
          apt.provider === currentDoctor.name &&
          !apt.cancelled
        )
        .slice(0, 6) // Show first 6 for demo
    : [];

  // Mock active visit
  const activeVisit = todayAppointments[0] || null;

  // Mock note draft
  const [noteDraft, setNoteDraft] = useState<NoteDraft>({
    subjective: 'Patient presents with persistent cough and mild chest discomfort for the past 5 days. Reports dry cough, worse at night. No fever, no difficulty breathing. Has tried over-the-counter cough suppressants with minimal relief.',
    objective: 'Vitals: BP 120/80, HR 72, Temp 98.4°F, SpO2 98%. Chest auscultation: clear bilateral breath sounds, no wheezing or crackles. No respiratory distress observed.',
    assessment: 'Acute bronchitis, likely viral etiology. No signs of pneumonia or bacterial infection at this time.',
    plan: '1. Supportive care with fluids and rest\n2. Prescribe codeine-guaifenesin cough syrup\n3. Recommend humidifier use at night\n4. Return if symptoms worsen or fever develops\n5. Follow-up in 1 week if no improvement',
  });

  // Mock medication suggestions
  const [medications, setMedications] = useState<MedicationSuggestion[]>([
    {
      id: 'med1',
      name: 'Guaifenesin-Codeine',
      dosage: '100mg-10mg/5mL',
      frequency: '5mL every 4-6 hours',
      duration: '7 days',
      indication: 'Cough suppression',
      safetyNote: 'Contains codeine. Check for allergies and contraindications.',
      included: true,
    },
    {
      id: 'med2',
      name: 'Albuterol Inhaler',
      dosage: '90mcg',
      frequency: '2 puffs every 4-6 hours as needed',
      duration: '30 days',
      indication: 'Bronchodilation if wheeze develops',
      safetyNote: 'PRN use only. Monitor heart rate.',
      included: false,
    },
  ]);

  // Mock follow-up cadence
  const [followUp, setFollowUp] = useState<FollowUpCadence>({
    timing: '1 week',
    suggested: true,
    visitType: 'in-clinic',
    reason: 'Re-evaluate persistent cough and ensure no progression to pneumonia',
    reminders: [
      { id: 'r1', timing: '1 week before', channel: 'SMS' },
      { id: 'r2', timing: '2 days before', channel: 'SMS' },
      { id: 'r3', timing: '3 days after visit', channel: 'SMS (Post-visit check-in)' },
    ],
  });

  const handleToggleTranscription = () => {
    if (transcriptionStatus === 'idle') {
      setTranscriptionStatus('recording');
      // Add Ava message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ava',
        content: `Transcription started for ${activeVisit?.patientName}. I'm capturing the conversation to draft your clinical note.`,
        timestamp: new Date().toISOString(),
      }]);
    } else if (transcriptionStatus === 'recording') {
      setTranscriptionStatus('paused');
    } else {
      setTranscriptionStatus('recording');
    }
  };

  const handleStopTranscription = () => {
    setTranscriptionStatus('idle');
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ava',
      content: 'Transcription stopped. I\'ve updated the note draft based on the conversation. Please review in the "Note Draft" tab.',
      timestamp: new Date().toISOString(),
    }]);
  };

  const handleQuickAction = (action: string) => {
    let avaResponse = '';
    
    switch (action) {
      case 'draft-note':
        avaResponse = 'I\'ve generated a complete SOAP note from today\'s visit. Please review each section in the "Note Draft" tab and make any edits before saving to the EHR.';
        setActiveTab('note-draft');
        break;
      case 'summarize':
        avaResponse = '**Visit Summary:**\n\n• Chief complaint: Persistent dry cough x5 days\n• Assessment: Acute bronchitis, viral\n• Plan: Supportive care + cough suppressant, follow-up in 1 week';
        break;
      case 'suggest-plan':
        avaResponse = 'Based on the visit, I suggest:\n\n1. Prescribe cough suppressant with codeine\n2. Recommend fluids and humidifier\n3. Schedule 1-week follow-up\n4. Patient education on warning signs\n\nYou can review and edit the full plan in "Note Draft" → Plan section.';
        break;
      case 'medications':
        avaResponse = 'I\'ve suggested 2 medications based on the diagnosis. See the "Medications & Orders" tab to review dosing, indications, and safety notes. You can edit or remove any suggestion before ordering.';
        setActiveTab('medications');
        break;
      case 'follow-up':
        avaResponse = 'I recommend a 1-week in-clinic follow-up to re-evaluate. I\'ve pre-filled the cadence with 2 reminders and a post-visit check-in. Review in "Follow-Up & Cadence" tab.';
        setActiveTab('follow-up');
        break;
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ava',
      content: avaResponse,
      timestamp: new Date().toISOString(),
    }]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add doctor message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'doctor',
      content: inputValue,
      timestamp: new Date().toISOString(),
    }]);

    // Simulate Ava response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ava',
        content: 'I understand your request. I\'ve updated the clinical documentation based on your input. Please review the changes in the relevant tab.',
        timestamp: new Date().toISOString(),
      }]);
    }, 1000);

    setInputValue('');
  };

  const handleToggleMedication = (id: string) => {
    setMedications(prev => prev.map(med => 
      med.id === id ? { ...med, included: !med.included } : med
    ));
  };

  if (!currentDoctor) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            No doctor profile selected
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* HEADER - Fixed at top */}
      <div
        className="border-b px-6 py-4 flex-shrink-0"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Ava AI - Doctor Workspace
              </h1>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'var(--cf-blue-10)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--cf-blue-30)',
              }}
            >
              HIPAA Compliant
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {currentDoctor.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {currentDoctor.specialty}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE CONTENT - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full flex" style={{ minHeight: '100%' }}>
          {/* LEFT: Visit & Patient Context */}
          <div
            className="w-80 flex flex-col flex-shrink-0"
            style={{
              backgroundColor: 'var(--surface-card)',
            }}
          >
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Active Visit
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Currently documenting
              </p>
            </div>

            {activeVisit ? (
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {activeVisit.patientName}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: '#F59E0B20',
                          color: '#F59E0B',
                        }}
                      >
                        {activeVisit.visitCategory === 'new-patient' ? 'New patient' : 'Follow-up'}
                      </span>
                      {activeVisit.needsAttention && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: '#EF444420',
                            color: '#EF4444',
                          }}
                        >
                          High priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{activeVisit.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeVisit.visitType === 'virtual' ? (
                      <Video className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    ) : (
                      <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                    )}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {activeVisit.visitType === 'virtual' ? 'Video visit' : 'In-clinic'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b text-center" style={{ borderColor: 'var(--border-default)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No active visit
                </p>
              </div>
            )}

            <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Today's Patients
              </h2>
              {todayAppointments.length > 0 ? (
                <div className="space-y-2">
                  {todayAppointments.slice(0, 5).map(apt => (
                    <button
                      key={apt.id}
                      onClick={() => setSelectedPatient(apt)}
                      className="w-full p-2 rounded-lg border text-left transition-all"
                      style={{
                        backgroundColor: selectedPatient?.id === apt.id ? 'var(--accent-primary-bg)' : 'transparent',
                        borderColor: selectedPatient?.id === apt.id ? 'var(--accent-primary)' : 'var(--border-default)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {apt.patientName}
                        </p>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {apt.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {apt.visitType === 'virtual' ? (
                          <Video className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
                        ) : (
                          <MapPin className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
                        )}
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {apt.visitType === 'virtual' ? 'Video' : 'In-clinic'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No appointments scheduled for today
                </p>
              )}
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <div
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: '#3B82F610',
                  borderColor: '#3B82F640',
                }}
              >
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 flex-shrink-0" style={{ color: '#3B82F6' }} />
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: '#3B82F6' }}>
                      Ava can access
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Schedule, prior notes, labs, meds list (no raw PHI shown by default)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Ava Conversation */}
          <div className="flex-1 flex flex-col">
            {/* Transcription controls */}
            <div
              className="p-4 border-b"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Visit Audio / Transcription
                  </h2>
                  {transcriptionStatus === 'recording' && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-medium text-red-500">Recording</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {transcriptionStatus !== 'idle' && (
                    <button
                      onClick={handleStopTranscription}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: 'var(--surface-hover)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Stop
                    </button>
                  )}
                  <button
                    onClick={handleToggleTranscription}
                    className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all"
                    style={{
                      backgroundColor: transcriptionStatus === 'recording' ? '#F59E0B' : 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    {transcriptionStatus === 'idle' ? (
                      <>
                        <Mic className="w-4 h-4" />
                        Start transcription
                      </>
                    ) : transcriptionStatus === 'recording' ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Resume
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                className="p-3 rounded-lg border flex items-start gap-2"
                style={{
                  backgroundColor: '#10B98110',
                  borderColor: '#10B98140',
                }}
              >
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#10B981' }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Audio and text are processed in a HIPAA-conscious way. You review and approve all notes and orders before they are saved.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="p-4 border-b"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Quick Actions for Doctors
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleQuickAction('draft-note')}
                  className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Draft full visit note
                </button>
                <button
                  onClick={() => handleQuickAction('summarize')}
                  className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Summarize in 3 bullets
                </button>
                <button
                  onClick={() => handleQuickAction('suggest-plan')}
                  className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Suggest assessment & plan
                </button>
                <button
                  onClick={() => handleQuickAction('medications')}
                  className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Suggest medications
                </button>
                <button
                  onClick={() => handleQuickAction('follow-up')}
                  className="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Propose follow-up
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'doctor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[80%] rounded-lg p-3"
                    style={{
                      backgroundColor: msg.role === 'ava' ? 'var(--surface-card)' : 'var(--accent-primary)',
                      color: msg.role === 'ava' ? 'var(--text-primary)' : 'white',
                      border: msg.role === 'ava' ? '1px solid var(--border-default)' : 'none',
                    }}
                  >
                    {msg.role === 'ava' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4" style={{ color: '#F59E0B' }} />
                        <span className="text-xs font-medium" style={{ color: '#F59E0B' }}>Ava</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              className="p-4 border-t"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Ava to draft notes, suggest plans, or set follow-ups for this patient. You remain in full control."
                  className="flex-1 px-4 py-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-3 rounded-lg font-medium text-sm transition-all"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Structured Outputs */}
          <div
            className="w-96 border-l flex flex-col flex-shrink-0"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            {/* Tabs */}
            <div className="border-b" style={{ borderColor: 'var(--border-default)' }}>
              <div className="flex">
                <button
                  onClick={() => setActiveTab('note-draft')}
                  className="flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all"
                  style={{
                    color: activeTab === 'note-draft' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    borderColor: activeTab === 'note-draft' ? 'var(--accent-primary)' : 'transparent',
                  }}
                >
                  Note Draft
                </button>
                <button
                  onClick={() => setActiveTab('medications')}
                  className="flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all"
                  style={{
                    color: activeTab === 'medications' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    borderColor: activeTab === 'medications' ? 'var(--accent-primary)' : 'transparent',
                  }}
                >
                  Medications
                </button>
                <button
                  onClick={() => setActiveTab('follow-up')}
                  className="flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all"
                  style={{
                    color: activeTab === 'follow-up' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    borderColor: activeTab === 'follow-up' ? 'var(--accent-primary)' : 'transparent',
                  }}
                >
                  Follow-Up
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Note Draft Tab */}
              {activeTab === 'note-draft' && (
                <div className="space-y-4">
                  <div
                    className="p-3 rounded-lg border flex items-start gap-2"
                    style={{
                      backgroundColor: '#F59E0B10',
                      borderColor: '#F59E0B40',
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />
                    <div>
                      <p className="text-xs font-medium" style={{ color: '#F59E0B' }}>
                        Doctor review required
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        AI-generated note. Edit before saving to EHR.
                      </p>
                    </div>
                  </div>

                  {/* Subjective */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Subjective
                      </h3>
                      <button className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                    <div
                      className="p-3 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {noteDraft.subjective}
                    </div>
                  </div>

                  {/* Objective */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Objective
                      </h3>
                      <button className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                    <div
                      className="p-3 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {noteDraft.objective}
                    </div>
                  </div>

                  {/* Assessment */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Assessment
                      </h3>
                      <button className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                    <div
                      className="p-3 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {noteDraft.assessment}
                    </div>
                  </div>

                  {/* Plan */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Plan
                      </h3>
                      <button className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                    <div
                      className="p-3 rounded-lg border text-sm whitespace-pre-wrap"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {noteDraft.plan}
                    </div>
                  </div>

                  <button
                    className="w-full px-4 py-3 rounded-lg font-medium text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    Save note to EHR
                  </button>
                </div>
              )}

              {/* Medications Tab */}
              {activeTab === 'medications' && (
                <div className="space-y-4">
                  <div
                    className="p-3 rounded-lg border flex items-start gap-2"
                    style={{
                      backgroundColor: '#F59E0B10',
                      borderColor: '#F59E0B40',
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      AI-generated suggestions. Doctor must review before ordering.
                    </p>
                  </div>

                  {medications.map(med => (
                    <div
                      key={med.id}
                      className="p-3 rounded-lg border"
                      style={{
                        backgroundColor: med.included ? '#10B98110' : 'var(--surface-canvas)',
                        borderColor: med.included ? '#10B98140' : 'var(--border-default)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={med.included}
                            onChange={() => handleToggleMedication(med.id)}
                            className="mt-1"
                          />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {med.name}
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                              {med.dosage} · {med.frequency}
                            </p>
                          </div>
                        </div>
                        <button className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-default)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Duration:</strong> {med.duration}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Indication:</strong> {med.indication}
                        </p>
                        {med.safetyNote && (
                          <div className="mt-2 flex items-start gap-1">
                            <Shield className="w-3 h-3 flex-shrink-0" style={{ color: '#F59E0B' }} />
                            <p className="text-xs" style={{ color: '#F59E0B' }}>
                              {med.safetyNote}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    className="w-full px-4 py-3 rounded-lg font-medium text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    Submit orders ({medications.filter(m => m.included).length} selected)
                  </button>
                </div>
              )}

              {/* Follow-Up Tab */}
              {activeTab === 'follow-up' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--text-primary)' }}>
                      Follow-up timing
                    </label>
                    <input
                      type="text"
                      value={followUp.timing}
                      onChange={(e) => setFollowUp(prev => ({ ...prev, timing: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--text-primary)' }}>
                      Visit type
                    </label>
                    <select
                      value={followUp.visitType}
                      onChange={(e) => setFollowUp(prev => ({ ...prev, visitType: e.target.value as 'in-clinic' | 'virtual' }))}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <option value="in-clinic">In-clinic</option>
                      <option value="virtual">Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--text-primary)' }}>
                      Reason for follow-up
                    </label>
                    <textarea
                      value={followUp.reason}
                      onChange={(e) => setFollowUp(prev => ({ ...prev, reason: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Ava Follow-Up Cadence
                      </label>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div
                      className="p-3 rounded-lg border space-y-2"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                      }}
                    >
                      {followUp.reminders.map(reminder => (
                        <div key={reminder.id} className="flex items-center gap-2">
                          <Bell className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {reminder.timing} via {reminder.channel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="w-full px-4 py-3 rounded-lg font-medium text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    Save follow-up & add to cadence
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}