import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'admin' | 'doctor' | 'owner';

interface DoctorProfile {
  id: string;
  name: string;
  initials: string;
  specialty: string;
}

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  switchRole: (newRole: Role) => void;
  
  // Doctor-specific context (only populated when role === 'doctor')
  activeDoctorId: string | null;
  setActiveDoctorId: (doctorId: string | null) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>('owner'); // Default to owner to test the dashboard
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage on mount
    const savedRole = localStorage.getItem('clinicflow-role') as Role;
    const savedDoctorId = localStorage.getItem('clinicflow-active-doctor-id');
    
    if (savedRole) {
      setRoleState(savedRole);
    }
    if (savedDoctorId) {
      setActiveDoctorId(savedDoctorId);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('clinicflow-role', newRole);
    
    // Clear doctor ID when switching away from doctor role
    if (newRole !== 'doctor') {
      setActiveDoctorId(null);
      localStorage.removeItem('clinicflow-active-doctor-id');
    }
    // If switching TO doctor role and no active doctor, it will prompt for selection
  };

  const switchRole = (newRole: Role) => {
    setRole(newRole);
  };

  const handleSetActiveDoctorId = (doctorId: string | null) => {
    setActiveDoctorId(doctorId);
    if (doctorId) {
      localStorage.setItem('clinicflow-active-doctor-id', doctorId);
    } else {
      localStorage.removeItem('clinicflow-active-doctor-id');
    }
  };

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole, 
      switchRole,
      activeDoctorId,
      setActiveDoctorId: handleSetActiveDoctorId,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}