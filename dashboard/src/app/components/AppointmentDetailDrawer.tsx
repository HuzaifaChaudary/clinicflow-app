import { X, Phone, MessageSquare, FileText, Clock, User } from 'lucide-react';
import { Appointment } from './AppointmentRow';

interface AppointmentDetailDrawerProps {
  appointment: Appointment | null;
  onClose: () => void;
  onOpenVoicePanel?: () => void;
}

export function AppointmentDetailDrawer({
  appointment,
  onClose,
  onOpenVoicePanel,
}: AppointmentDetailDrawerProps) {
  if (!appointment) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Patient Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <div className="text-gray-900">{appointment.patientName}</div>
                <div className="text-gray-500">Patient</div>
              </div>
            </div>
          </div>

          {/* Appointment Time & Provider */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <User className="w-4 h-4 text-gray-400" />
              <span>{appointment.provider}</span>
            </div>
          </div>

          {/* Status */}
          <div>
            <div className="text-gray-700 mb-3">Status</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Confirmation</span>
                <span
                  className={`px-2 py-1 rounded-md ${
                    appointment.status.confirmed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {appointment.status.confirmed ? 'Confirmed' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Intake Form</span>
                <span
                  className={`px-2 py-1 rounded-md ${
                    appointment.status.intakeComplete
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {appointment.status.intakeComplete ? 'Complete' : 'Missing'}
                </span>
              </div>
              {appointment.status.paid && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Payment</span>
                  <span className="px-2 py-1 rounded-md bg-gray-200 text-gray-600">
                    Paid
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Communication */}
          <div>
            <div className="text-gray-700 mb-3">Recent Communication</div>
            <div className="space-y-2">
              {appointment.indicators.voiceCallSent && (
                <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                  <Phone className="w-4 h-4 text-teal-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-gray-900">Confirmation call sent</div>
                    <div className="text-gray-500">2 hours ago</div>
                  </div>
                </div>
              )}
              {appointment.status.confirmed && (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-gray-900">Patient confirmed via text</div>
                    <div className="text-gray-500">1 hour ago</div>
                  </div>
                </div>
              )}
              {!appointment.indicators.voiceCallSent && (
                <div className="p-3 bg-gray-50 rounded-lg text-gray-500 text-center">
                  No recent activity
                </div>
              )}
            </div>
          </div>

          {/* Voice Assistant Button */}
          <button
            onClick={onOpenVoicePanel}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Open Voice Assistant</span>
          </button>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <FileText className="w-4 h-4" />
              <span>View Intake Form</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <MessageSquare className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
