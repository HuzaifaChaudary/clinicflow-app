import { X, Phone, MessageSquare, Clock } from 'lucide-react';

interface VoiceMessage {
  id: string;
  type: 'call' | 'text';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  summary?: string;
}

interface VoicePanelProps {
  patientName: string;
  messages: VoiceMessage[];
  onClose: () => void;
  onMakeCall?: () => void;
}

export function VoicePanel({ patientName, messages, onClose, onMakeCall }: VoicePanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-50 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900">Voice Assistant</h2>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-gray-600">{patientName}</div>
        </div>

        {/* Call Button */}
        <div className="px-6 py-4 border-b border-gray-200">
          <button
            onClick={onMakeCall}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>Start Live Call</span>
          </button>
        </div>

        {/* Conversation Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No conversation history yet
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    {message.type === 'call' ? (
                      <Phone className="w-3 h-3" />
                    ) : (
                      <MessageSquare className="w-3 h-3" />
                    )}
                    <span className="text-sm">{message.timestamp}</span>
                    <span className="text-sm">
                      {message.direction === 'outbound' ? 'Outbound' : 'Inbound'}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      message.direction === 'outbound'
                        ? 'bg-teal-50 border border-teal-100'
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    {message.summary && (
                      <div className="mb-2 pb-2 border-b border-gray-200">
                        <div className="text-gray-700 font-medium mb-1">Summary</div>
                        <div className="text-gray-600">{message.summary}</div>
                      </div>
                    )}
                    <div className="text-gray-800">{message.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="px-6 py-4 border-t border-gray-200">
          <label className="block text-gray-700 mb-2">Admin Notes</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            rows={3}
            placeholder="Add notes about this conversation..."
          />
        </div>
      </div>
    </>
  );
}
