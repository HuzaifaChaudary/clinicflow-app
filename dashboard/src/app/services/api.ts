/**
 * API Client for ClinicFlow Backend
 * Handles all HTTP requests to the backend API
 */

// @ts-ignore - Vite env
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

// Token management
const TOKEN_KEY = 'clinicflow_auth_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge with any existing headers
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Handle 401 - unauthorized
  if (response.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Auth endpoints
export const auth = {
  async login(email: string, password: string) {
    const data = await apiRequest<{ access_token: string; token_type: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    setToken(data.access_token);
    return data;
  },
  
  async googleSignup(signupData: {
    idToken: string;
    fullName: string;
    clinicName: string;
    clinicType?: string;
    clinicSize?: string;
    email?: string;
    phone?: string;
    timezone?: string;
    role?: string;
  }) {
    const data = await apiRequest<{ access_token: string; token_type: string }>(
      '/auth/google/signup',
      {
        method: 'POST',
        body: JSON.stringify({
          id_token: signupData.idToken,
          full_name: signupData.fullName,
          clinic_name: signupData.clinicName,
          clinic_type: signupData.clinicType,
          clinic_size: signupData.clinicSize,
          email: signupData.email,
          phone: signupData.phone,
          timezone: signupData.timezone || 'America/New_York',
          role: signupData.role || 'owner',
        }),
      }
    );
    setToken(data.access_token);
    return data;
  },
  
  async googleLogin(idToken: string) {
    const data = await apiRequest<{ access_token: string; token_type: string }>(
      '/auth/google/login',
      {
        method: 'POST',
        body: JSON.stringify({ id_token: idToken }),
      }
    );
    setToken(data.access_token);
    return data;
  },
  
  logout() {
    clearToken();
  },
  
  async getCurrentUser() {
    return apiRequest('/auth/me');
  },
};

// Dashboard endpoints
export const dashboard = {
  async getAdminDashboard(date?: string) {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/dashboard/admin${params}`);
  },
  
  async getDoctorDashboard(date?: string) {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/dashboard/doctor${params}`);
  },
  
  async getNeedsAttention(filter?: 'all' | 'unconfirmed' | 'missing-intake') {
    const params = filter ? `?filter=${filter}` : '';
    return apiRequest(`/dashboard/needs-attention${params}`);
  },
};

// Doctors endpoints
export const doctors = {
  async list() {
    return apiRequest('/doctors');
  },
  
  async get(id: string) {
    return apiRequest(`/doctors/${id}`);
  },
  
  async create(data: any) {
    return apiRequest('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async update(id: string, data: any) {
    return apiRequest(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id: string) {
    return apiRequest(`/doctors/${id}`, {
      method: 'DELETE',
    });
  },
};

// Patients endpoints
export const patients = {
  async list(params?: { skip?: number; limit?: number }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/patients${query}`);
  },
  
  async get(id: string) {
    return apiRequest(`/patients/${id}`);
  },
  
  async create(data: any) {
    return apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async update(id: string, data: any) {
    return apiRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async getAppointments(id: string) {
    return apiRequest(`/patients/${id}/appointments`);
  },
};

// Appointments endpoints
export const appointments = {
  async list(params?: {
    date?: string;
    doctor_id?: string;
    status?: string;
    intake_status?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/appointments${query}`);
  },
  
  async get(id: string) {
    return apiRequest(`/appointments/${id}`);
  },
  
  async create(data: any) {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async update(id: string, data: any) {
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async confirm(id: string) {
    return apiRequest(`/appointments/${id}/confirm`, {
      method: 'POST',
    });
  },
  
  async cancel(id: string, data: { cancellation_type: string; reason_note?: string }) {
    return apiRequest(`/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async markArrived(id: string) {
    return apiRequest(`/appointments/${id}/arrive`, {
      method: 'POST',
    });
  },
};

// Schedule endpoints
export const schedule = {
  async getDaySchedule(date?: string) {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/schedule/day${params}`);
  },
  
  async getDoctorSchedule(doctorId: string, date?: string) {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/schedule/day/${doctorId}${params}`);
  },
  
  async getAvailableSlots(doctorId: string, date: string) {
    return apiRequest(`/schedule/available-slots?doctor_id=${doctorId}&date=${date}`);
  },
};

// Intake endpoints
export const intake = {
  async list() {
    return apiRequest('/intake/forms');
  },
  
  async get(id: string) {
    return apiRequest(`/intake/forms/${id}`);
  },
  
  async submit(data: { appointment_id: string; raw_answers: any }) {
    return apiRequest('/intake/forms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async markComplete(id: string) {
    return apiRequest(`/intake/forms/${id}/complete`, {
      method: 'PUT',
    });
  },
  
  async getSummary(appointmentId: string) {
    return apiRequest(`/intake/summary/${appointmentId}`);
  },
  
  async regenerateSummary(appointmentId: string) {
    return apiRequest(`/intake/summary/${appointmentId}/regenerate`, {
      method: 'POST',
    });
  },
};

// Owner endpoints
export const owner = {
  async getDashboard(params?: { date?: string; period?: 'week' | 'month' | 'quarter' }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/owner/dashboard${query}`);
  },
  
  // Voice AI
  async getVoiceAILogs(params?: { 
    skip?: number; 
    limit?: number; 
    status?: string; 
    call_type?: string;
    date_from?: string;
    date_to?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/owner/voice-ai/logs${query}`);
  },
  
  async getVoiceAIStats(params?: { date_from?: string; date_to?: string }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/owner/voice-ai/stats${query}`);
  },
  
  async createVoiceAILog(data: any) {
    return apiRequest('/owner/voice-ai/logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async updateVoiceAILog(id: string, data: any) {
    return apiRequest(`/owner/voice-ai/logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Automation Rules
  async getAutomationRules(params?: { rule_type?: string; enabled?: boolean }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/owner/automation/rules${query}`);
  },
  
  async getAutomationRule(id: string) {
    return apiRequest(`/owner/automation/rules/${id}`);
  },
  
  async createAutomationRule(data: any) {
    return apiRequest('/owner/automation/rules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async updateAutomationRule(id: string, data: any) {
    return apiRequest(`/owner/automation/rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async deleteAutomationRule(id: string) {
    return apiRequest(`/owner/automation/rules/${id}`, {
      method: 'DELETE',
    });
  },
  
  async getAutomationExecutions(params?: { rule_id?: string; status?: string; skip?: number; limit?: number }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/owner/automation/executions${query}`);
  },
  
  // Settings
  async getSettings() {
    return apiRequest('/owner/settings');
  },
  
  async updateSettings(data: any) {
    return apiRequest('/owner/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Metrics
  async getMetrics(params?: { date_from?: string; date_to?: string }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/owner/metrics${query}`);
  },
  
  // Capacity
  async getCapacity(params?: { date?: string; doctor_id?: string }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return apiRequest(`/owner/capacity${query}`);
  },
};

