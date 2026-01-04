import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ============================================================================
// SETTINGS TYPES
// ============================================================================

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type SlotSize = 15 | 30 | 45;
export type Role = 'admin' | 'doctor' | 'staff';
export type VisitType = 'in-clinic' | 'virtual' | 'phone';
export type IntakeDeliveryPath = 'automatic' | 'manual' | 'ask-every-time';

export interface ClinicProfile {
  name: string;
  timezone: string;
  workingDays: Record<DayOfWeek, boolean>;
  clinicHours: {
    start: string;
    end: string;
  };
  slotSize: SlotSize;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  doctorId?: string;
  voiceAIEnabled: boolean;
  workingHoursOverride?: {
    start: string;
    end: string;
  };
  supportedVisitTypes: VisitType[];
  videoVisitsEnabled: boolean;
  allowWalkIns: boolean;
  allowForcedBooking: boolean;
}

export interface SchedulingRules {
  allowOverlapping: boolean;
  allowWalkIns: boolean;
  requireProvider: boolean;
  allowAdminOverride: boolean;
  minimumCancellationNotice: number; // minutes
  autoNoShowThreshold: number; // minutes
  cancellationReasonRequired: boolean;
}

export interface IntakeLogic {
  intakeRequired: boolean;
  lockAppointmentIfMissing: boolean;
  allowManualCompletion: boolean;
  deliveryPath: IntakeDeliveryPath;
  visitTypeMapping: Record<string, string>; // visitType -> formId
  fallbackFormId: string;
}

export interface VoiceAIControls {
  voiceEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  maxAttempts: number;
  callWindow: {
    start: string;
    end: string;
  };
  retryDelay: number; // minutes
  escalateOn: {
    unrecognizedQuestion: boolean;
    requestsHuman: boolean;
    noResponseAfterMax: boolean;
    ambiguousReply: boolean;
  };
}

export interface NotificationSettings {
  triggers: {
    unconfirmedAppointments: boolean;
    missingIntake: boolean;
    aiNeedsAttention: boolean;
    cancellations: boolean;
    noShows: boolean;
  };
  delivery: {
    inApp: boolean;
    email: boolean;
  };
}

export interface DataPreferences {
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  defaultDashboardView: 'dashboard' | 'schedule';
  autoRefreshInterval: number; // seconds, 0 = disabled
}

export interface SecuritySettings {
  sessionTimeout: number; // minutes
  passwordResetRequired: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  details: string;
}

// ============================================================================
// CONTEXT
// ============================================================================

interface SettingsContextType {
  // State
  clinicProfile: ClinicProfile;
  users: User[];
  schedulingRules: SchedulingRules;
  intakeLogic: IntakeLogic;
  voiceAI: VoiceAIControls;
  notifications: NotificationSettings;
  dataPreferences: DataPreferences;
  security: SecuritySettings;
  auditLog: AuditLogEntry[];
  
  // Update functions
  updateClinicProfile: (updates: Partial<ClinicProfile>) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  updateSchedulingRules: (updates: Partial<SchedulingRules>) => void;
  updateIntakeLogic: (updates: Partial<IntakeLogic>) => void;
  updateVoiceAI: (updates: Partial<VoiceAIControls>) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  updateDataPreferences: (updates: Partial<DataPreferences>) => void;
  updateSecurity: (updates: Partial<SecuritySettings>) => void;
  
  // Helpers
  isSettingEnabled: (setting: string) => boolean;
  canBookAppointment: (time: string, doctorId?: string) => boolean;
  shouldShowMissingIntake: () => boolean;
  shouldShowVoiceAI: () => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const defaultClinicProfile: ClinicProfile = {
  name: 'Clinicflow Medical Center',
  timezone: 'America/Los_Angeles',
  workingDays: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  },
  clinicHours: {
    start: '08:00',
    end: '17:00',
  },
  slotSize: 30,
};

const defaultSchedulingRules: SchedulingRules = {
  allowOverlapping: false,
  allowWalkIns: true,
  requireProvider: true,
  allowAdminOverride: true,
  minimumCancellationNotice: 120, // 2 hours
  autoNoShowThreshold: 15, // 15 minutes
  cancellationReasonRequired: true,
};

const defaultIntakeLogic: IntakeLogic = {
  intakeRequired: true,
  lockAppointmentIfMissing: false,
  allowManualCompletion: true,
  deliveryPath: 'ask-every-time',
  visitTypeMapping: {
    'in-clinic': 'form_general_intake',
    'virtual': 'form_telehealth_intake',
  },
  fallbackFormId: 'form_general_intake',
};

const defaultVoiceAI: VoiceAIControls = {
  voiceEnabled: true,
  smsEnabled: true,
  emailEnabled: true,
  maxAttempts: 3,
  callWindow: {
    start: '09:00',
    end: '18:00',
  },
  retryDelay: 60,
  escalateOn: {
    unrecognizedQuestion: true,
    requestsHuman: true,
    noResponseAfterMax: true,
    ambiguousReply: true,
  },
};

const defaultNotifications: NotificationSettings = {
  triggers: {
    unconfirmedAppointments: true,
    missingIntake: true,
    aiNeedsAttention: true,
    cancellations: true,
    noShows: true,
  },
  delivery: {
    inApp: true,
    email: true,
  },
};

const defaultDataPreferences: DataPreferences = {
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  defaultDashboardView: 'dashboard',
  autoRefreshInterval: 0,
};

const defaultSecurity: SecuritySettings = {
  sessionTimeout: 30,
  passwordResetRequired: false,
};

const defaultUsers: User[] = [
  {
    id: 'user_admin_1',
    name: 'Admin User',
    email: 'admin@clinicflow.com',
    role: 'admin',
    voiceAIEnabled: false,
    supportedVisitTypes: ['in-clinic', 'virtual'],
    videoVisitsEnabled: false,
    allowWalkIns: true,
    allowForcedBooking: true,
  },
  {
    id: 'user_dr_chen',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@clinicflow.com',
    role: 'doctor',
    doctorId: 'dr_chen',
    voiceAIEnabled: true,
    supportedVisitTypes: ['in-clinic', 'virtual'],
    videoVisitsEnabled: true,
    allowWalkIns: true,
    allowForcedBooking: true,
  },
  {
    id: 'user_dr_patel',
    name: 'Dr. James Patel',
    email: 'james.patel@clinicflow.com',
    role: 'doctor',
    doctorId: 'dr_patel',
    voiceAIEnabled: true,
    supportedVisitTypes: ['in-clinic'],
    videoVisitsEnabled: false,
    allowWalkIns: false,
    allowForcedBooking: false,
  },
];

// ============================================================================
// PROVIDER
// ============================================================================

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile>(defaultClinicProfile);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [schedulingRules, setSchedulingRules] = useState<SchedulingRules>(defaultSchedulingRules);
  const [intakeLogic, setIntakeLogic] = useState<IntakeLogic>(defaultIntakeLogic);
  const [voiceAI, setVoiceAI] = useState<VoiceAIControls>(defaultVoiceAI);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [dataPreferences, setDataPreferences] = useState<DataPreferences>(defaultDataPreferences);
  const [security, setSecurity] = useState<SecuritySettings>(defaultSecurity);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  const logAudit = useCallback((action: string, target: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'user_admin_1',
      userName: 'Admin User',
      action,
      target,
      details,
    };
    setAuditLog(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 entries
  }, []);

  const updateClinicProfile = useCallback((updates: Partial<ClinicProfile>) => {
    setClinicProfile(prev => {
      const next = { ...prev, ...updates };
      logAudit('Updated', 'Clinic Profile', JSON.stringify(updates));
      return next;
    });
  }, [logAudit]);

  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
    logAudit('Created', 'User', `Added ${user.name} as ${user.role}`);
  }, [logAudit]);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    logAudit('Updated', 'User', `User ${userId}: ${JSON.stringify(updates)}`);
  }, [logAudit]);

  const removeUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    logAudit('Deleted', 'User', `Removed ${user?.name || userId}`);
  }, [users, logAudit]);

  const updateSchedulingRules = useCallback((updates: Partial<SchedulingRules>) => {
    setSchedulingRules(prev => {
      const next = { ...prev, ...updates };
      logAudit('Updated', 'Scheduling Rules', JSON.stringify(updates));
      return next;
    });
  }, [logAudit]);

  const updateIntakeLogic = useCallback((updates: Partial<IntakeLogic>) => {
    setIntakeLogic(prev => {
      const next = { ...prev, ...updates };
      logAudit('Updated', 'Intake Logic', JSON.stringify(updates));
      return next;
    });
  }, [logAudit]);

  const updateVoiceAI = useCallback((updates: Partial<VoiceAIControls>) => {
    setVoiceAI(prev => {
      const next = { ...prev, ...updates };
      logAudit('Updated', 'Voice AI Controls', JSON.stringify(updates));
      return next;
    });
  }, [logAudit]);

  const updateNotifications = useCallback((updates: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...updates }));
    logAudit('Updated', 'Notifications', JSON.stringify(updates));
  }, [logAudit]);

  const updateDataPreferences = useCallback((updates: Partial<DataPreferences>) => {
    setDataPreferences(prev => ({ ...prev, ...updates }));
    logAudit('Updated', 'Data Preferences', JSON.stringify(updates));
  }, [logAudit]);

  const updateSecurity = useCallback((updates: Partial<SecuritySettings>) => {
    setSecurity(prev => ({ ...prev, ...updates }));
    logAudit('Updated', 'Security Settings', JSON.stringify(updates));
  }, [logAudit]);

  // Helper functions
  const isSettingEnabled = useCallback((setting: string): boolean => {
    if (setting === 'voiceAI') return voiceAI.voiceEnabled;
    if (setting === 'intake') return intakeLogic.intakeRequired;
    if (setting === 'walkIns') return schedulingRules.allowWalkIns;
    return true;
  }, [voiceAI, intakeLogic, schedulingRules]);

  const canBookAppointment = useCallback((time: string, doctorId?: string): boolean => {
    // Check if time is within clinic hours
    const [hours] = time.split(':').map(Number);
    const [startHours] = clinicProfile.clinicHours.start.split(':').map(Number);
    const [endHours] = clinicProfile.clinicHours.end.split(':').map(Number);
    
    if (hours < startHours || hours >= endHours) {
      return schedulingRules.allowAdminOverride;
    }
    
    return true;
  }, [clinicProfile, schedulingRules]);

  const shouldShowMissingIntake = useCallback((): boolean => {
    return intakeLogic.intakeRequired && notifications.triggers.missingIntake;
  }, [intakeLogic, notifications]);

  const shouldShowVoiceAI = useCallback((): boolean => {
    return voiceAI.voiceEnabled;
  }, [voiceAI]);

  const value: SettingsContextType = {
    clinicProfile,
    users,
    schedulingRules,
    intakeLogic,
    voiceAI,
    notifications,
    dataPreferences,
    security,
    auditLog,
    updateClinicProfile,
    addUser,
    updateUser,
    removeUser,
    updateSchedulingRules,
    updateIntakeLogic,
    updateVoiceAI,
    updateNotifications,
    updateDataPreferences,
    updateSecurity,
    isSettingEnabled,
    canBookAppointment,
    shouldShowMissingIntake,
    shouldShowVoiceAI,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
