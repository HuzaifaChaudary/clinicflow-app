import { useState } from 'react';
import { X, Calendar, Phone, Mail, FileText, Clock, AlertCircle, User, Stethoscope, CalendarPlus, Edit2, Save } from 'lucide-react';
import { Appointment, DoctorNote } from '../../types/appointment';
import { useRole } from '../../context/RoleContext';

interface GlobalPatientProfileProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdateFollowUp?: (appointmentId: string, date: string, note: string) => void;
  onAddDoctorNote?: (appointmentId: string, doctorId: string, content: string) => void;
  onUpdateDoctorNote?: (appointmentId: string, noteId: string, content: string) => void;
}

export function GlobalPatientProfile({
  appointment,
  onClose,
  onUpdateFollowUp,
  onAddDoctorNote,
  onUpdateDoctorNote,
}: GlobalPatientProfileProps) {
  const { role, activeDoctorId } = useRole();
  const [isClosing, setIsClosing] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(appointment.nextFollowUp?.date || '');
  const [followUpNote, setFollowUpNote] = useState(appointment.nextFollowUp?.note || '');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState('');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleSaveFollowUp = () => {
    if (followUpDate && activeDoctorId && onUpdateFollowUp) {
      onUpdateFollowUp(appointment.id, followUpDate, followUpNote);
    }
  };

  const handleAddNote = () => {
    if (noteContent.trim() && activeDoctorId && onAddDoctorNote) {
      onAddDoctorNote(appointment.id, activeDoctorId, noteContent);
      setNoteContent('');
    }
  };

  const handleSaveEditedNote = (noteId: string) => {
    if (editingNoteContent.trim() && onUpdateDoctorNote) {
      onUpdateDoctorNote(appointment.id, noteId, editingNoteContent);
      setEditingNoteId(null);
      setEditingNoteContent('');
    }
  };

  // Filter notes for current doctor only
  const myNotes = role === 'doctor' && activeDoctorId
    ? appointment.doctorNotes?.filter(note => note.doctorId === activeDoctorId) || []
    : appointment.doctorNotes || [];

  const isDoctor = role === 'doctor';
  const isMyPatient = isDoctor && appointment.provider.includes(activeDoctorId || '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--surface-card)',
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          opacity: isClosing ? 0 : 1,
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 border-b backdrop-blur-xl sticky top-0 z-10"
          style={{
            backgroundColor: 'rgba(var(--surface-card-rgb), 0.95)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: 'var(--cf-blue-10)',
                    color: 'var(--cf-blue-70)',
                  }}
                >
                  {appointment.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {appointment.patientName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: appointment.status.confirmed 
                          ? 'var(--status-success-bg)' 
                          : 'var(--status-warning-bg)',
                        color: appointment.status.confirmed 
                          ? 'var(--status-success)' 
                          : 'var(--status-warning)',
                      }}
                    >
                      {appointment.status.confirmed ? 'Confirmed' : 'Unconfirmed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl transition-all"
              style={{
                backgroundColor: 'var(--surface-hover)',
                color: 'var(--text-secondary)',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Appointment Details */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: 'var(--surface-canvas)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Calendar className="w-5 h-5" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Time
                </p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {appointment.time} · {appointment.duration || 30} min
                </p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Provider
                </p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {appointment.provider}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Visit Type
                </p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {appointment.visitType === 'virtual' ? 'Video Visit' : 'In-Clinic'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Phone
                </p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {appointment.patientPhone || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Visit Context - Critical Section */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: 'var(--surface-canvas)',
              borderColor: 'var(--border-default)',
            }}
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <User className="w-5 h-5" />
              Visit Context
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Patient Type
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: appointment.visitCategory === 'new-patient' 
                        ? 'var(--cf-blue-10)' 
                        : 'var(--cf-neutral-10)',
                      color: appointment.visitCategory === 'new-patient' 
                        ? 'var(--cf-blue-70)' 
                        : 'var(--cf-neutral-70)',
                    }}
                  >
                    {appointment.visitCategory === 'new-patient' ? 'New Patient' : 'Follow-up Visit'}
                  </span>
                </div>
              </div>
              {appointment.visitCategory === 'follow-up' && appointment.lastVisitDate && (
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Last Visit
                  </p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {new Date(appointment.lastVisitDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Intake Summary */}
          {appointment.intakeSummary && (
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
              }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FileText className="w-5 h-5" />
                Intake Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: appointment.intakeSummary.completed 
                        ? 'var(--status-success-bg)' 
                        : 'var(--status-warning-bg)',
                      color: appointment.intakeSummary.completed 
                        ? 'var(--status-success)' 
                        : 'var(--status-warning)',
                    }}
                  >
                    {appointment.intakeSummary.completed ? 'Complete' : 'Incomplete'}
                  </span>
                </div>

                {appointment.intakeSummary.patientConcerns && appointment.intakeSummary.patientConcerns.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                      Patient-Reported Concerns
                    </p>
                    <div className="space-y-2">
                      {appointment.intakeSummary.patientConcerns.map((concern, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl flex items-start gap-2"
                          style={{
                            backgroundColor: 'var(--surface-card)',
                            border: '1px solid var(--border-default)',
                          }}
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
                          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {concern}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {appointment.intakeSummary.allergies && appointment.intakeSummary.allergies.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                      Allergies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {appointment.intakeSummary.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--status-error-bg)',
                            color: 'var(--status-error)',
                          }}
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {appointment.intakeSummary.medications && appointment.intakeSummary.medications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                      Current Medications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {appointment.intakeSummary.medications.map((med, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--cf-neutral-10)',
                            color: 'var(--cf-neutral-70)',
                          }}
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {!isDoctor && (
                  <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
                    Doctors can view but not edit intake structure
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Doctor Notes - Private to current doctor */}
          {isDoctor && (
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
              }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Stethoscope className="w-5 h-5" />
                My Notes
                <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--cf-neutral-10)', color: 'var(--cf-neutral-70)' }}>
                  Private
                </span>
              </h3>

              <div className="space-y-3">
                {/* Existing notes */}
                {myNotes.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {myNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 rounded-xl border"
                        style={{
                          backgroundColor: 'var(--surface-card)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        {editingNoteId === note.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editingNoteContent}
                              onChange={(e) => setEditingNoteContent(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border resize-none"
                              style={{
                                backgroundColor: 'var(--surface-canvas)',
                                borderColor: 'var(--border-default)',
                                color: 'var(--text-primary)',
                              }}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEditedNote(note.id)}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
                                style={{
                                  backgroundColor: 'var(--accent-primary)',
                                  color: 'white',
                                }}
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingNoteId(null);
                                  setEditingNoteContent('');
                                }}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                style={{
                                  backgroundColor: 'var(--surface-hover)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                              {note.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {new Date(note.timestamp).toLocaleDateString()} at {new Date(note.timestamp).toLocaleTimeString()}
                              </p>
                              <button
                                onClick={() => {
                                  setEditingNoteId(note.id);
                                  setEditingNoteContent(note.content);
                                }}
                                className="p-1.5 rounded-lg"
                                style={{
                                  backgroundColor: 'var(--surface-hover)',
                                  color: 'var(--text-secondary)',
                                }}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic mb-4" style={{ color: 'var(--text-muted)' }}>
                    No notes yet for this patient
                  </p>
                )}

                {/* Add new note */}
                <div className="space-y-2">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add a private note about this patient..."
                    className="w-full px-4 py-3 rounded-xl border resize-none"
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                    rows={3}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteContent.trim()}
                    className="px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Next Follow-Up */}
          {isDoctor && (
            <div
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
              }}
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <CalendarPlus className="w-5 h-5" />
                Schedule Next Follow-Up
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                    Note (Optional)
                  </label>
                  <textarea
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                    placeholder="Reason for follow-up..."
                    className="w-full px-4 py-3 rounded-xl border resize-none"
                    style={{
                      backgroundColor: 'var(--surface-card)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                    rows={2}
                  />
                </div>

                <button
                  onClick={handleSaveFollowUp}
                  disabled={!followUpDate}
                  className="w-full py-3 rounded-xl font-medium transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                  }}
                >
                  Save Follow-Up Schedule
                </button>

                {appointment.nextFollowUp && (
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: 'var(--status-success-bg)',
                      border: '1px solid var(--status-success)',
                    }}
                  >
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--status-success)' }}>
                      Currently Scheduled
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {new Date(appointment.nextFollowUp.date).toLocaleDateString()}
                      {appointment.nextFollowUp.note && ` · ${appointment.nextFollowUp.note}`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}