import { createContext, useContext, useState, ReactNode } from 'react';
import { Appointment, DoctorNote } from '../types/appointment';

interface PatientDataContextType {
  appointments: Appointment[];
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  addDoctorNote: (appointmentId: string, doctorId: string, content: string) => void;
  updateDoctorNote: (appointmentId: string, noteId: string, content: string) => void;
  updateFollowUp: (appointmentId: string, date: string, note: string, doctorId: string) => void;
}

const PatientDataContext = createContext<PatientDataContextType | undefined>(undefined);

export function PatientDataProvider({ 
  children, 
  initialAppointments 
}: { 
  children: ReactNode;
  initialAppointments: Appointment[];
}) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, ...updates }
          : apt
      )
    );
  };

  const addDoctorNote = (appointmentId: string, doctorId: string, content: string) => {
    const newNote: DoctorNote = {
      id: `note-${Date.now()}`,
      doctorId,
      content,
      timestamp: new Date().toISOString(),
    };

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? {
              ...apt,
              doctorNotes: [...(apt.doctorNotes || []), newNote],
            }
          : apt
      )
    );
  };

  const updateDoctorNote = (appointmentId: string, noteId: string, content: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? {
              ...apt,
              doctorNotes: apt.doctorNotes?.map(note =>
                note.id === noteId
                  ? { ...note, content, updatedAt: new Date().toISOString() }
                  : note
              ),
            }
          : apt
      )
    );
  };

  const updateFollowUp = (appointmentId: string, date: string, note: string, doctorId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? {
              ...apt,
              nextFollowUp: {
                date,
                note,
                setBy: doctorId,
                setAt: new Date().toISOString(),
              },
            }
          : apt
      )
    );
  };

  return (
    <PatientDataContext.Provider
      value={{
        appointments,
        updateAppointment,
        addDoctorNote,
        updateDoctorNote,
        updateFollowUp,
      }}
    >
      {children}
    </PatientDataContext.Provider>
  );
}

export function usePatientData() {
  const context = useContext(PatientDataContext);
  if (context === undefined) {
    throw new Error('usePatientData must be used within a PatientDataProvider');
  }
  return context;
}
