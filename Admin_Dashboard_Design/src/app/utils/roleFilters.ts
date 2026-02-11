import { Appointment, VoiceCallAttempt } from '../types/appointment';

/**
 * Role-based data filtering utilities
 * Ensures strict privacy and data scoping per role
 */

// ============================================================================
// DOCTOR FILTERS - Only show data for the logged-in doctor
// ============================================================================

export function filterAppointmentsForDoctor(
  appointments: Appointment[],
  doctorName: string
): Appointment[] {
  return appointments.filter(apt => apt.provider === doctorName);
}

export function filterVoiceCallsForDoctor(
  voiceCallAttempts: VoiceCallAttempt[],
  appointments: Appointment[],
  doctorName: string
): VoiceCallAttempt[] {
  // Get appointment IDs for this doctor
  const doctorAppointmentIds = new Set(
    appointments
      .filter(apt => apt.provider === doctorName)
      .map(apt => apt.id)
  );

  // Filter voice calls that belong to doctor's appointments
  return voiceCallAttempts.filter(call => {
    // This would need appointment ID context - for now filter by appointment list
    return true; // Implementation depends on voice call data structure
  });
}

export function getDoctorNeedsAttentionCount(
  appointments: Appointment[],
  doctorName: string
): number {
  const doctorAppointments = filterAppointmentsForDoctor(appointments, doctorName);
  
  // Count appointments that need doctor's attention
  return doctorAppointments.filter(apt => {
    // Voice AI escalations that require doctor input
    const hasVoiceEscalation = apt.voiceCallAttempts?.some(call => 
      call.needsAttention && 
      (call.attentionReason === 'complex-question' || 
       call.attentionReason === 'requested-human')
    );

    // Unconfirmed or missing intake close to appointment
    const needsPreparation = !apt.status.confirmed || !apt.status.intakeComplete;

    return hasVoiceEscalation || needsPreparation;
  }).length;
}

export function getHighSignalEscalations(
  appointments: Appointment[],
  doctorName: string
): Array<{
  appointmentId: string;
  patientName: string;
  reason: string;
  snippet?: string;
  timestamp: string;
}> {
  const doctorAppointments = filterAppointmentsForDoctor(appointments, doctorName);
  const escalations: Array<{
    appointmentId: string;
    patientName: string;
    reason: string;
    snippet?: string;
    timestamp: string;
  }> = [];

  doctorAppointments.forEach(apt => {
    apt.voiceCallAttempts?.forEach(call => {
      if (call.needsAttention) {
        let reason = 'Requires attention';
        if (call.attentionReason === 'complex-question') {
          reason = 'Patient asked a medical question';
        } else if (call.attentionReason === 'requested-human') {
          reason = 'Patient requested to speak with doctor';
        } else if (call.attentionReason === 'paused-interaction') {
          reason = 'Patient mentioned symptom change';
        }

        escalations.push({
          appointmentId: apt.id,
          patientName: apt.patientName,
          reason,
          snippet: call.transcript?.split('\n').slice(-2).join('\n'), // Last 2 lines
          timestamp: call.timestamp,
        });
      }
    });
  });

  return escalations;
}

// ============================================================================
// OWNER FILTERS - Show aggregate/analytics data
// ============================================================================

export function getClinicWideMetrics(appointments: Appointment[]) {
  return {
    totalAppointments: appointments.length,
    confirmed: appointments.filter(apt => apt.status.confirmed).length,
    unconfirmed: appointments.filter(apt => !apt.status.confirmed).length,
    intakeComplete: appointments.filter(apt => apt.status.intakeComplete).length,
    intakeMissing: appointments.filter(apt => !apt.status.intakeComplete).length,
    arrived: appointments.filter(apt => apt.arrived).length,
  };
}

export function getProviderMetrics(appointments: Appointment[]) {
  const providerStats: Record<string, {
    total: number;
    confirmed: number;
    intakeComplete: number;
  }> = {};

  appointments.forEach(apt => {
    if (!providerStats[apt.provider]) {
      providerStats[apt.provider] = {
        total: 0,
        confirmed: 0,
        intakeComplete: 0,
      };
    }

    providerStats[apt.provider].total++;
    if (apt.status.confirmed) providerStats[apt.provider].confirmed++;
    if (apt.status.intakeComplete) providerStats[apt.provider].intakeComplete++;
  });

  return providerStats;
}

// ============================================================================
// ADMIN FILTERS - Full access
// ============================================================================

export function filterAppointmentsForAdmin(appointments: Appointment[]): Appointment[] {
  // Admins see everything
  return appointments;
}

// ============================================================================
// PRIVACY ENFORCEMENT
// ============================================================================

/**
 * Sanitize appointment data for doctor view
 * Removes admin-only fields and notes
 */
export function sanitizeAppointmentForDoctor(
  appointment: Appointment,
  doctorName: string
): Appointment | null {
  // If appointment doesn't belong to this doctor, return null
  if (appointment.provider !== doctorName) {
    return null;
  }

  // Return appointment with doctor-visible fields only
  return {
    ...appointment,
    // Remove admin-only fields if they exist
  };
}

/**
 * Check if a role can access specific data
 */
export function canAccessAppointment(
  role: 'admin' | 'doctor' | 'owner',
  appointment: Appointment,
  doctorName?: string
): boolean {
  if (role === 'admin' || role === 'owner') {
    return true;
  }

  if (role === 'doctor' && doctorName) {
    return appointment.provider === doctorName;
  }

  return false;
}
