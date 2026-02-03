import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboard, doctors, patients, appointments, schedule, intake, owner } from '../services/api';

// Types for API responses
export interface AdminDashboardData {
  date: string;
  stats: {
    total_appointments: number;
    confirmed: number;
    unconfirmed: number;
    missing_intake: number;
    voice_ai_alerts: number;
  };
  needs_attention: Array<{
    id: string;
    patient_name: string;
    time: string;
    doctor: string;
    issue: string;
  }>;
  todays_schedule: Array<{
    id: string;
    time: string;
    patient_name: string;
    doctor: string;
    visit_type: string;
    status: {
      confirmed: boolean;
      intake_complete: boolean;
    };
  }>;
}

export interface DoctorDashboardData {
  date: string;
  doctor: {
    id: string;
    name: string;
  };
  stats: {
    total_appointments: number;
    confirmed: number;
    unconfirmed: number;
    missing_intake: number;
    voice_ai_alerts: number;
  };
  todays_patients: Array<{
    id: string;
    appointment_id: string;
    time: string;
    patient_name: string;
    visit_type: string;
    visit_category: string | null;
    status: {
      confirmed: boolean;
      intake_complete: boolean;
      arrived: boolean;
    };
    intake_summary: {
      summary_text: string;
      patient_concerns: string[];
      medications: string[];
      allergies: string[];
    } | null;
  }>;
}

export interface OwnerDashboardData {
  date: string;
  hero_metrics: Array<{
    id: string;
    label: string;
    value: string;
    change: number;
    change_label: string;
    trend: 'up' | 'down';
    good_direction: 'up' | 'down';
  }>;
  no_show_by_doctor: Array<{
    doctor_id: string;
    doctor: string;
    rate: number;
    appointments: number;
  }>;
  no_show_by_visit_type: Array<{
    type: string;
    rate: number;
    appointments: number;
  }>;
  no_show_by_day_of_week: Array<{
    day: string;
    rate: number;
  }>;
  follow_up_data: {
    scheduled: number;
    completed: number;
    missed: number;
    completion_rate: number;
    retention_impact: string;
  };
  admin_efficiency: {
    calls_automated: number;
    forms_auto_completed: number;
    manual_tasks_avoided: number;
    hours_per_week: number;
    cost_savings: string;
    cost_savings_monthly: string;
  };
  doctor_capacity: Array<{
    doctor_id: string;
    doctor: string;
    appointments: number;
    utilization: number;
    specialty: string;
  }>;
  ai_performance: {
    total_interactions: number;
    confirmations_achieved: number;
    escalations_to_humans: number;
    success_rate: number;
    avg_resolution_time: string;
  };
  roi_summary: {
    appointments_recovered_weekly: number;
    monthly_cost_savings: number;
    message: string;
  };
  // Historical trend data
  no_show_trend?: Array<{
    label: string;
    value: number;
  }>;
  appointments_recovered_trend?: Array<{
    label: string;
    value: number;
  }>;
  admin_hours_trend?: Array<{
    label: string;
    value: number;
  }>;
  clinic_utilization_trend?: Array<{
    label: string;
    value: number;
  }>;
  // Recovery sources breakdown
  recovery_sources?: {
    same_day_cancellations: number;
    waitlist_outreach: number;
    unconfirmed_converted: number;
  };
  // Pre-clinicflow baseline
  pre_clinicflow_no_show_rate?: number;
}

export interface VoiceAIStats {
  date_range: { from: string; to: string };
  stats: {
    total_calls: number;
    successful_calls: number;
    failed_calls: number;
    escalated_calls: number;
    avg_duration_seconds: number;
    confirmations_achieved: number;
    success_rate: number;
  };
  recent_calls: Array<{
    id: string;
    call_type: string;
    status: string;
    outcome: string | null;
    duration_seconds: number;
    created_at: string;
  }>;
}

export interface ClinicSettings {
  id: string;
  clinic_id: string;
  working_hours: Record<string, { start: string; end: string; enabled: boolean }>;
  default_appointment_duration: number;
  buffer_between_appointments: number;
  max_appointments_per_day: number;
  confirmation_reminder_hours: number;
  intake_reminder_hours: number;
  follow_up_reminder_days: number;
  voice_ai_enabled: boolean;
  voice_ai_auto_confirm: boolean;
  voice_ai_escalation_enabled: boolean;
  sms_enabled: boolean;
  sms_confirmation_enabled: boolean;
  sms_reminder_enabled: boolean;
  email_enabled: boolean;
  email_confirmation_enabled: boolean;
  email_reminder_enabled: boolean;
  waitlist_enabled: boolean;
  auto_fill_cancellations: boolean;
  timezone: string;
  date_format: string;
  time_format: string;
}

// Generic hook for API calls
function useApiCall<T>(
  apiCall: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useApi.ts:211',message:'refetch called',data:{deps:JSON.stringify(deps)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
    // #endregion
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useApi.ts:216',message:'API call succeeded',data:{hasResult:!!result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
      // #endregion
      setData(result);
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useApi.ts:219',message:'API call failed',data:{error:err?.message||'Unknown error'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
      // #endregion
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useApi.ts:225',message:'useEffect triggered refetch',data:{deps:JSON.stringify(deps)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
    // #endregion
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// Admin Dashboard Hook
export interface AdminDashboardAnalytics {
  weekly_confirmation: Array<{
    day: string;
    rate: number;
  }>;
  no_show_trend: Array<{
    week: string;
    noShows: number;
  }>;
  recent_activity: Array<{
    time: string;
    patient: string;
    action: string;
    type: string;
  }>;
}

export function useAdminDashboard(date?: string) {
  return useApiCall<AdminDashboardData>(
    () => dashboard.getAdminDashboard(date) as Promise<AdminDashboardData>,
    [date]
  );
}

export function useAdminDashboardAnalytics() {
  return useApiCall<AdminDashboardAnalytics>(
    () => dashboard.getAdminDashboardAnalytics() as Promise<AdminDashboardAnalytics>,
    []
  );
}

// Doctor Dashboard Hook
export function useDoctorDashboard(date?: string) {
  return useApiCall<DoctorDashboardData>(
    () => dashboard.getDoctorDashboard(date) as Promise<DoctorDashboardData>,
    [date]
  );
}

// Owner Dashboard Hook
export function useOwnerDashboard(date?: string, period?: 'week' | 'month' | 'quarter') {
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useApi.ts:260',message:'useOwnerDashboard called',data:{date:date,period:period},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch((err)=>{console.error('[DEBUG] Fetch failed:',err);});
  }, [date, period]);
  // #endregion
  
  // Use useMemo to ensure the apiCall function is recreated when date or period changes
  const apiCall = useCallback(
    () => owner.getDashboard({ date, period }) as Promise<OwnerDashboardData>,
    [date, period]
  );
  
  return useApiCall<OwnerDashboardData>(apiCall, [date, period]);
}

// Doctors List Hook
export function useDoctors() {
  return useApiCall<any[]>(
    () => doctors.list() as Promise<any[]>,
    []
  );
}

// Patients List Hook
export function usePatients(skip?: number, limit?: number) {
  return useApiCall<{ items: any[]; total: number }>(
    () => patients.list({ skip, limit }) as Promise<{ items: any[]; total: number }>,
    [skip, limit]
  );
}

// Appointments List Hook
export function useAppointments(params?: {
  date?: string;
  doctor_id?: string;
  status?: string;
  intake_status?: string;
}) {
  return useApiCall<any[]>(
    () => appointments.list(params) as Promise<any[]>,
    [params?.date, params?.doctor_id, params?.status, params?.intake_status]
  );
}

// Schedule Hook
export function useSchedule(date?: string) {
  return useApiCall<any>(
    () => schedule.getDaySchedule(date),
    [date]
  );
}

// Doctor Schedule Hook
export function useDoctorSchedule(doctorId: string, date?: string) {
  return useApiCall<any>(
    () => schedule.getDoctorSchedule(doctorId, date),
    [doctorId, date]
  );
}

// Available Slots Hook
export function useAvailableSlots(doctorId: string, date: string) {
  return useApiCall<{ date: string; doctor_id: string; available_slots: string[] }>(
    () => schedule.getAvailableSlots(doctorId, date) as Promise<{ date: string; doctor_id: string; available_slots: string[] }>,
    [doctorId, date]
  );
}

// Intake Forms Hook
export function useIntakeForms() {
  return useApiCall<any[]>(
    () => intake.list() as Promise<any[]>,
    []
  );
}

// Voice AI Stats Hook
export function useVoiceAIStats(dateFrom?: string, dateTo?: string) {
  return useApiCall<VoiceAIStats>(
    () => owner.getVoiceAIStats({ date_from: dateFrom, date_to: dateTo }) as Promise<VoiceAIStats>,
    [dateFrom, dateTo]
  );
}

// Voice AI Logs Hook
export function useVoiceAILogs(params?: {
  skip?: number;
  limit?: number;
  status?: string;
  call_type?: string;
}) {
  return useApiCall<any[]>(
    () => owner.getVoiceAILogs(params) as Promise<any[]>,
    [params?.skip, params?.limit, params?.status, params?.call_type]
  );
}

// Automation Rules Hook
export function useAutomationRules(ruleType?: string, enabled?: boolean) {
  return useApiCall<any[]>(
    () => owner.getAutomationRules({ rule_type: ruleType, enabled }) as Promise<any[]>,
    [ruleType, enabled]
  );
}

// Clinic Settings Hook
export function useClinicSettings() {
  return useApiCall<ClinicSettings>(
    () => owner.getSettings() as Promise<ClinicSettings>,
    []
  );
}

// Doctor Capacity Hook
export function useDoctorCapacity(date?: string, doctorId?: string) {
  return useApiCall<any[]>(
    () => owner.getCapacity({ date, doctor_id: doctorId }) as Promise<any[]>,
    [date, doctorId]
  );
}

// Needs Attention Hook
export function useNeedsAttention(filter?: 'all' | 'unconfirmed' | 'missing-intake') {
  return useApiCall<{ total: number; items: any[] }>(
    () => dashboard.getNeedsAttention(filter) as Promise<{ total: number; items: any[] }>,
    [filter]
  );
}
