import { useState, useCallback } from 'react';
import { Appointment, CancellationReason, DoctorNote } from '../types/appointment';
import { enhancedMockAppointments, mockCancelledAppointments } from '../data/enhancedMockData';

export function useAppointmentState() {
  const [appointments, setAppointments] = useState<Appointment[]>(enhancedMockAppointments);
  const [cancelledAppointments, setCancelledAppointments] = useState<Appointment[]>(mockCancelledAppointments);

  // Update appointment
  const updateAppointment = useCallback((updatedAppointment: Appointment) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
    );
  }, []);

  // Reschedule appointment
  const rescheduleAppointment = useCallback((
    appointmentId: string,
    newTime: string,
    newProvider: string,
    newDate: string
  ) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            time: newTime,
            provider: newProvider,
            date: newDate,
            indicators: {
              ...apt.indicators,
              rescheduled: true,
            },
          };
        }
        return apt;
      })
    );
  }, []);

  // Cancel appointment
  const cancelAppointment = useCallback((
    appointmentId: string,
    cancellationReason: CancellationReason
  ) => {
    const appointmentToCancel = appointments.find(apt => apt.id === appointmentId);
    if (!appointmentToCancel) return;

    // Add to cancelled appointments
    const cancelled: Appointment = {
      ...appointmentToCancel,
      cancelled: true,
      cancellationReason,
      cancellationHistory: [
        ...(appointmentToCancel.cancellationHistory || []),
        cancellationReason,
      ],
      totalCancellations: (appointmentToCancel.totalCancellations || 0) + 1,
    };

    setCancelledAppointments(prev => [...prev, cancelled]);

    // Remove from active appointments
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  }, [appointments]);

  // Add new appointment
  const addAppointment = useCallback((appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  }, []);

  // Confirm appointment
  const confirmAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: { ...apt.status, confirmed: true } }
          : apt
      )
    );
  }, []);

  // Mark intake complete
  const completeIntake = useCallback((appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: { ...apt.status, intakeComplete: true } }
          : apt
      )
    );
  }, []);

  // Mark as arrived
  const markArrived = useCallback((appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, arrived: true }
          : apt
      )
    );
  }, []);

  // Add doctor note
  const addDoctorNote = useCallback((appointmentId: string, doctorId: string, content: string) => {
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
  }, []);

  // Update doctor note
  const updateDoctorNote = useCallback((appointmentId: string, noteId: string, content: string) => {
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
  }, []);

  // Update follow-up schedule
  const updateFollowUp = useCallback((appointmentId: string, date: string, note: string, doctorId: string) => {
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
  }, []);

  return {
    appointments,
    cancelledAppointments,
    updateAppointment,
    rescheduleAppointment,
    cancelAppointment,
    addAppointment,
    confirmAppointment,
    completeIntake,
    markArrived,
    addDoctorNote,
    updateDoctorNote,
    updateFollowUp,
  };
}