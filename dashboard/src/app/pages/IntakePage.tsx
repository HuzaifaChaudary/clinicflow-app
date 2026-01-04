import { useState } from 'react';
import { FileText, CheckCircle, Clock, Send } from 'lucide-react';

interface IntakeForm {
  id: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  provider: string;
  status: 'completed' | 'pending' | 'overdue';
  completedDate?: string;
}

const mockIntakeForms: IntakeForm[] = [
  {
    id: '1',
    patientName: 'Sarah Martinez',
    appointmentDate: 'Dec 31, 2025',
    appointmentTime: '8:00 AM',
    provider: 'Dr. Chen',
    status: 'completed',
    completedDate: 'Dec 30, 2025',
  },
  {
    id: '2',
    patientName: 'James Wilson',
    appointmentDate: 'Dec 31, 2025',
    appointmentTime: '8:30 AM',
    provider: 'Dr. Chen',
    status: 'completed',
    completedDate: 'Dec 29, 2025',
  },
  {
    id: '3',
    patientName: 'Emily Johnson',
    appointmentDate: 'Dec 31, 2025',
    appointmentTime: '9:00 AM',
    provider: 'Dr. Patel',
    status: 'completed',
    completedDate: 'Dec 30, 2025',
  },
  {
    id: '4',
    patientName: 'Michael Brown',
    appointmentDate: 'Dec 31, 2025',
    appointmentTime: '9:30 AM',
    provider: 'Dr. Chen',
    status: 'pending',
  },
  {
    id: '5',
    patientName: 'Lisa Anderson',
    appointmentDate: 'Dec 31, 2025',
    appointmentTime: '10:00 AM',
    provider: 'Dr. Patel',
    status: 'pending',
  },
  {
    id: '6',
    patientName: 'Robert Clark',
    appointmentDate: 'Dec 31, 2025',
    appointmentTime: '3:00 PM',
    provider: 'Dr. Chen',
    status: 'overdue',
  },
];

export function IntakePage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'completed'>('pending');

  const pendingForms = mockIntakeForms.filter(f => f.status === 'pending' || f.status === 'overdue');
  const completedForms = mockIntakeForms.filter(f => f.status === 'completed');

  const formsToShow = selectedTab === 'pending' ? pendingForms : completedForms;

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700">
          <CheckCircle className="w-3 h-3" />
          <span>Completed</span>
        </span>
      );
    }
    if (status === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700">
          <Clock className="w-3 h-3" />
          <span>Overdue</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700">
        <Clock className="w-3 h-3" />
        <span>Pending</span>
      </span>
    );
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-1">Intake Forms</h1>
          <p className="text-gray-600">Manage patient intake documentation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl text-gray-900">{pendingForms.length}</div>
              <div className="text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl text-gray-900">{completedForms.length}</div>
              <div className="text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl text-gray-900">
                {mockIntakeForms.filter(f => f.status === 'overdue').length}
              </div>
              <div className="text-gray-600">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            selectedTab === 'pending'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingForms.length})
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            selectedTab === 'completed'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed ({completedForms.length})
        </button>
      </div>

      {/* Forms List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Patient</th>
                <th className="px-6 py-3 text-left text-gray-700">Appointment</th>
                <th className="px-6 py-3 text-left text-gray-700">Provider</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                {selectedTab === 'completed' && (
                  <th className="px-6 py-3 text-left text-gray-700">Completed Date</th>
                )}
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formsToShow.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{form.patientName}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {form.appointmentDate} at {form.appointmentTime}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{form.provider}</td>
                  <td className="px-6 py-4">{getStatusBadge(form.status)}</td>
                  {selectedTab === 'completed' && (
                    <td className="px-6 py-4 text-gray-600">{form.completedDate}</td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {selectedTab === 'pending' ? (
                        <>
                          <button className="flex items-center gap-2 px-3 py-1.5 text-teal-700 hover:bg-teal-50 rounded-md transition-colors">
                            <Send className="w-4 h-4" />
                            <span>Send Reminder</span>
                          </button>
                          <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            View Form
                          </button>
                        </>
                      ) : (
                        <button className="flex items-center gap-2 px-3 py-1.5 text-teal-700 hover:bg-teal-50 rounded-md transition-colors">
                          <FileText className="w-4 h-4" />
                          <span>View Form</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {formsToShow.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            No {selectedTab} intake forms
          </div>
        )}
      </div>
    </div>
  );
}
