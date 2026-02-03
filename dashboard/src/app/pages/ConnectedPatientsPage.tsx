import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Card } from '../components/foundation/Card';
import { Button } from '../components/foundation/Button';
import { usePatients } from '../hooks/useApi';
import { patients as patientsApi } from '../services/api';
import { useClinicFormat } from '../hooks/useClinicFormat';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  created_at: string;
}

export function ConnectedPatientsPage() {
  const { formatDate } = useClinicFormat();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const pageSize = 20;

  // Fetch data from backend
  const { data: patientsData, loading, error, refetch } = usePatients(currentPage * pageSize, pageSize);

  const patients: Patient[] = patientsData?.items || [];
  const totalPatients = patientsData?.total || 0;
  const totalPages = Math.ceil(totalPatients / pageSize);

  // Filter patients by search query (client-side for now)
  const filteredPatients = searchQuery
    ? patients.filter(p => 
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery)
      )
    : patients;

  if (loading && patients.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface-canvas)' }}>
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--surface-card)' }}>
          <AlertCircle className="w-8 h-8" style={{ color: 'var(--status-error)' }} />
          <p style={{ color: 'var(--text-primary)' }}>Failed to load patients</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto p-6" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Patients
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {totalPatients} total patients
            </p>
          </div>

          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border"
            style={{
              backgroundColor: 'var(--surface-card)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Patients List */}
        <Card elevation="2" radius="md">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No patients found</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-default)' }}>
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 hover:bg-opacity-50 cursor-pointer transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                      style={{ 
                        backgroundColor: 'var(--cf-neutral-20)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {patient.first_name?.[0]}{patient.last_name?.[0]}
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {patient.full_name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        {patient.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {patient.email}
                            </span>
                          </div>
                        )}
                        {patient.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {patient.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div 
              className="flex items-center justify-between p-4 border-t"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Showing {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalPatients)} of {totalPatients}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedPatient(null)}
          >
            <div 
              className="w-full max-w-lg p-6 rounded-2xl"
              style={{ backgroundColor: 'var(--surface-card)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold"
                  style={{ 
                    backgroundColor: 'var(--cf-neutral-20)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {selectedPatient.first_name?.[0]}{selectedPatient.last_name?.[0]}
                </div>
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selectedPatient.full_name}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Patient since {formatDate(selectedPatient.created_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedPatient.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{selectedPatient.email}</span>
                  </div>
                )}
                {selectedPatient.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{selectedPatient.phone}</span>
                  </div>
                )}
                {selectedPatient.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>
                      DOB: {formatDate(selectedPatient.date_of_birth)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setSelectedPatient(null)}>
                  Close
                </Button>
                <Button variant="primary">
                  View Full Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectedPatientsPage;
