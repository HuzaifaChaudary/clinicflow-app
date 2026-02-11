// Core appointment types with full feature support

export type VisitType = 'in-clinic' | 'virtual';
export type VisitCategory = 'new-patient' | 'follow-up';

export interface AppointmentStatus {
  confirmed: boolean;
  intakeComplete: boolean;
  paid: boolean;
}

export interface AppointmentIndicators {
  voiceCallSent: boolean;
  rescheduled: boolean;
}

export interface CancellationReason {
  type: 'patient-cancelled' | 'no-show' | 'rescheduled-externally' | 'other';
  note?: string;
  timestamp: string;
  cancelledBy: string; // Admin name
}

export interface VoiceCallAttempt {
  id: string;
  timestamp: string;
  duration: string; // e.g., "45s", "2m 15s"
  status: 'completed' | 'no-answer' | 'failed' | 'in-progress';
  transcript?: string;
  needsAttention?: boolean;
  attentionReason?: 'complex-question' | 'requested-human' | 'paused-interaction';
}

export interface Message {
  id: string;
  type: 'sms' | 'email';
  direction: 'inbound' | 'outbound';
  sender: 'ai' | 'patient' | 'admin';
  content: string;
  timestamp: string;
  needsResponse?: boolean;
}

// Doctor-specific patient data
export interface DoctorNote {
  id: string;
  doctorId: string;
  content: string;
  timestamp: string;
  updatedAt?: string;
}

export interface IntakeSummary {
  completed: boolean;
  patientConcerns?: string[];
  medications?: string[];
  allergies?: string[];
  notes?: string;
}

export interface FollowUpSchedule {
  date: string;
  note?: string;
  setBy: string; // doctor ID
  setAt: string; // timestamp
}

export interface Appointment {
  id: string;
  time: string;
  duration?: number; // in minutes, default 30
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  provider: string;
  visitType: VisitType;
  visitCategory?: VisitCategory; // new vs follow-up
  lastVisitDate?: string; // ISO date string for follow-ups
  status: AppointmentStatus;
  indicators: AppointmentIndicators;
  arrived: boolean;
  needsAttention?: boolean;
  
  // Enhanced fields
  date?: string; // ISO date string
  cancelled?: boolean;
  cancellationReason?: CancellationReason;
  
  // Voice AI integration
  voiceCallAttempts?: VoiceCallAttempt[];
  messages?: Message[];
  
  // Patient history
  cancellationHistory?: CancellationReason[];
  totalCancellations?: number;
  
  // Clinical data
  intakeSummary?: IntakeSummary;
  doctorNotes?: DoctorNote[]; // All notes for this patient
  nextFollowUp?: FollowUpSchedule;
}

export interface Doctor {
  id: string;
  name: string;
  initials: string;
  specialty?: string;
  color?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface ProviderAvailability {
  providerId: string;
  providerName: string;
  date: string;
  slots: TimeSlot[];
}