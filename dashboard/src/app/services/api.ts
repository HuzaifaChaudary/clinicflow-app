/**
 * API Client for ClinicFlow Backend
 * Handles all HTTP requests to the backend API
 */

// @ts-ignore - Vite env
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';
// #region agent log
fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:7',message:'API_BASE_URL initialized',data:{apiBaseUrl:API_BASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

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
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:43',message:'API request initiated',data:{method:options.method||'GET',url:url,endpoint:endpoint,hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
  // #endregion
  
  // Merge with any existing headers
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  console.log(`API Response: ${response.status} ${response.statusText}`);
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:52',message:'API response received',data:{status:response.status,statusText:response.statusText,url:url,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D,E,F'})}).catch(()=>{});
  // #endregion
  
  // Handle 401 - unauthorized
  if (response.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || errorMessage;
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:64',message:'API error response parsed',data:{status:response.status,errorMessage:errorMessage,errorDetail:error.detail,errorObj:error,url:url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
      // #endregion
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:68',message:'API error response not JSON',data:{status:response.status,errorMessage:errorMessage,statusText:response.statusText,url:url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D'})}).catch(()=>{});
      // #endregion
    }
    console.error(`API Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
  
  return response.json();
}

// Auth endpoints
export const auth = {
  async login(email: string, password: string) {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:66',message:'Login request starting',data:{email:email,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    const data = await apiRequest<{ access_token: string; token_type: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:74',message:'Login response received',data:{hasToken:!!data.access_token,tokenType:data.token_type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    setToken(data.access_token);
    // #region agent log
    const storedToken = getToken();
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:77',message:'Token stored after login',data:{tokenStored:!!storedToken,tokenLength:storedToken?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
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
    // #region agent log
    const tokenBefore = getToken();
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:127',message:'getCurrentUser called',data:{hasToken:!!tokenBefore,tokenLength:tokenBefore?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})}).catch(()=>{});
    // #endregion
    try {
      const result = await apiRequest('/auth/me');
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:131',message:'getCurrentUser success',data:{hasResult:!!result,resultKeys:result?Object.keys(result):[]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return result;
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:135',message:'getCurrentUser error',data:{errorMessage:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      throw err;
    }
  },
};

// Dashboard endpoints
export const dashboard = {
  async getAdminDashboard(date?: string) {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/dashboard/admin${params}`);
  },
  
  async getAdminDashboardAnalytics() {
    return apiRequest(`/dashboard/admin/analytics`);
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

// Helper to filter out undefined values from params
function cleanParams(params?: Record<string, any>): Record<string, string> | undefined {
  if (!params) return undefined;
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== 'undefined') {
      cleaned[key] = String(value);
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

// Owner endpoints
export const owner = {
  async getDashboard(params?: { date?: string; period?: 'week' | 'month' | 'quarter' }) {
    const cleaned = cleanParams(params);
    const query = cleaned ? `?${new URLSearchParams(cleaned)}` : '';
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:378',message:'owner.getDashboard called',data:{params:JSON.stringify(params),cleaned:JSON.stringify(cleaned),query:query},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
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
    const cleaned = cleanParams(params);
    const query = cleaned ? `?${new URLSearchParams(cleaned)}` : '';
    return apiRequest(`/owner/voice-ai/logs${query}`);
  },
  
  async getVoiceAIStats(params?: { date_from?: string; date_to?: string }) {
    const cleaned = cleanParams(params);
    const query = cleaned ? `?${new URLSearchParams(cleaned)}` : '';
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
    const cleaned = cleanParams(params);
    const query = cleaned ? `?${new URLSearchParams(cleaned)}` : '';
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
    const cleaned = cleanParams(params);
    const query = cleaned ? `?${new URLSearchParams(cleaned)}` : '';
    return apiRequest(`/owner/automation/executions${query}`);
  },
  
  // Settings
  async getSettings() {
    return apiRequest('/owner/settings');
  },
  
  async updateSettings(data: any) {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/3da94f36-ebb1-4a32-99ae-bf2f3f2b64be',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:463',message:'owner.updateSettings called',data:{hasDefaultDuration:!!data.default_appointment_duration,hasBuffer:!!data.buffer_between_appointments,hasMaxAppointments:!!data.max_appointments_per_day,defaultDuration:data.default_appointment_duration,buffer:data.buffer_between_appointments,maxAppointments:data.max_appointments_per_day},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return apiRequest('/owner/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Metrics
  async getMetrics(params?: { date_from?: string; date_to?: string }) {
    const cleaned = cleanParams(params);
    const query = cleaned ? `?${new URLSearchParams(cleaned)}` : '';
    return apiRequest(`/owner/metrics${query}`);
  },
  
  // Capacity
  async getCapacity(params?: { date?: string; doctor_id?: string }) {
    const cleaned = cleanParams(params);
    const query = cleaned ? `?${new URLSearchParams(cleaned)}` : '';
    return apiRequest(`/owner/capacity${query}`);
  },
};

// Invite endpoints
export const invites = {
  async getLimits() {
    return apiRequest('/invites/limits');
  },
  
  async list(params?: { status?: string; role?: string; skip?: number; limit?: number }) {
    const cleaned = cleanParams(params);
    const query = cleaned ? `?${new URLSearchParams(cleaned)}` : '';
    return apiRequest(`/invites${query}`);
  },
  
  async create(data: { email: string; role: string }) {
    return apiRequest('/invites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async createBulk(data: { emails: string[]; role: string }) {
    return apiRequest('/invites/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async cancel(inviteId: string) {
    return apiRequest(`/invites/${inviteId}`, {
      method: 'DELETE',
    });
  },
  
  async resend(inviteId: string) {
    return apiRequest(`/invites/${inviteId}/resend`, {
      method: 'POST',
    });
  },
  
  async verify(token: string) {
    return apiRequest(`/invites/verify/${token}`);
  },
  
  async accept(token: string, data: { name: string; password: string }) {
    return apiRequest(`/invites/accept/${token}`, {
      method: 'POST',
      body: JSON.stringify({ token, ...data }),
    });
  },
};

