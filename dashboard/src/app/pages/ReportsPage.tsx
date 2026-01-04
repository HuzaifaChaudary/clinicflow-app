import { TrendingDown, CheckCircle, Clock, Phone } from 'lucide-react';

export function ReportsPage() {
  const reportData = {
    noShowReduction: {
      current: '4.2%',
      previous: '12.8%',
      change: '-67%',
    },
    confirmationSuccess: {
      current: '91%',
      previous: '73%',
      change: '+18%',
    },
    adminTimeSaved: {
      current: '12.5 hrs/week',
      previous: '3.2 hrs/week',
      change: '+291%',
    },
    autoConfirmations: {
      current: '156',
      thisMonth: '623',
    },
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Reports</h1>
        <p className="text-gray-600">Simple summaries of clinic operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-6">
        {/* No-show Reduction */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-gray-600 mb-1">No-show Rate</div>
              <div className="text-4xl text-gray-900 mb-1">{reportData.noShowReduction.current}</div>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingDown className="w-4 h-4" />
                <span className="font-medium">{reportData.noShowReduction.change}</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="text-gray-600 text-sm">Previous month: {reportData.noShowReduction.previous}</div>
          </div>
        </div>

        {/* Confirmation Success */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-gray-600 mb-1">Confirmation Success Rate</div>
              <div className="text-4xl text-gray-900 mb-1">{reportData.confirmationSuccess.current}</div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">{reportData.confirmationSuccess.change}</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="text-gray-600 text-sm">Previous month: {reportData.confirmationSuccess.previous}</div>
          </div>
        </div>

        {/* Admin Time Saved */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-gray-600 mb-1">Admin Time Saved</div>
              <div className="text-4xl text-gray-900 mb-1">{reportData.adminTimeSaved.current}</div>
              <div className="flex items-center gap-2 text-green-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{reportData.adminTimeSaved.change}</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="text-gray-600 text-sm">Previous month: {reportData.adminTimeSaved.previous}</div>
          </div>
        </div>

        {/* Automatic Confirmations */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-gray-600 mb-1">Automatic Confirmations</div>
              <div className="text-4xl text-gray-900 mb-1">{reportData.autoConfirmations.current}</div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>This week</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="text-gray-600 text-sm">This month total: {reportData.autoConfirmations.thisMonth}</div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-gray-900 mb-4">Monthly Summary</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="text-gray-900 font-medium mb-1">No-shows reduced by 67%</div>
              <div className="text-gray-600">
                From 12.8% last month to 4.2% this month. Voice confirmations are working.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg">
            <Phone className="w-5 h-5 text-teal-600 mt-0.5" />
            <div>
              <div className="text-gray-900 font-medium mb-1">623 automated confirmations this month</div>
              <div className="text-gray-600">
                Clinicflow handled patient confirmations without staff involvement.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-gray-900 font-medium mb-1">12.5 hours saved per week</div>
              <div className="text-gray-600">
                Time previously spent on manual confirmation calls now available for patient care.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">
          <strong>Note:</strong> These are operational metrics, not analytics. 
          Numbers reflect real-time clinic performance to help you understand how Clinicflow supports your team.
        </p>
      </div>
    </div>
  );
}
