import { useState } from 'react';
import { Plus, Search, Edit, Copy, Archive, Eye, Filter, TrendingUp } from 'lucide-react';
import { Button } from '../components/foundation/Button';
import { FormBuilderPage } from './FormBuilderPage';
import { IntakeAutomationPage } from './IntakeAutomationPage';

type TabType = 'visit-types' | 'active-forms' | 'responses' | 'analytics' | 'automation';

interface VisitType {
  id: string;
  name: string;
  description: string;
  formName: string | null;
  status: 'active' | 'draft' | 'needs-attention';
  lastUpdated: string;
}

interface ActiveForm {
  id: string;
  name: string;
  visitType: string;
  lastUpdated: string;
  completionRate: number;
  isActive: boolean;
}

interface Response {
  id: string;
  patientName: string;
  visitType: string;
  formName: string;
  status: 'sent' | 'opened' | 'in-progress' | 'submitted';
  timeSinceSent: string;
}

// Mock data
const mockVisitTypes: VisitType[] = [
  {
    id: '1',
    name: 'New Patient Visit',
    description: 'Complete intake for first-time patients',
    formName: 'New Patient Full Intake',
    status: 'active',
    lastUpdated: '2 days ago',
  },
  {
    id: '2',
    name: 'Follow-up Visit',
    description: 'Quick check-in for returning patients',
    formName: 'Follow-up Check-in',
    status: 'active',
    lastUpdated: '1 week ago',
  },
  {
    id: '3',
    name: 'Physical Therapy Session',
    description: 'PT-specific intake and assessment',
    formName: null,
    status: 'needs-attention',
    lastUpdated: '3 weeks ago',
  },
  {
    id: '4',
    name: 'Telehealth Consultation',
    description: 'Virtual visit intake form',
    formName: 'Telehealth Intake',
    status: 'draft',
    lastUpdated: '5 days ago',
  },
  {
    id: '5',
    name: 'Annual Physical',
    description: 'Comprehensive annual health assessment',
    formName: 'Annual Physical Intake',
    status: 'active',
    lastUpdated: '2 weeks ago',
  },
  {
    id: '6',
    name: 'Specialist Referral',
    description: 'Intake for specialty consultations',
    formName: null,
    status: 'needs-attention',
    lastUpdated: '1 month ago',
  },
];

const mockActiveForms: ActiveForm[] = [
  {
    id: '1',
    name: 'New Patient Full Intake',
    visitType: 'New Patient Visit',
    lastUpdated: '2 days ago',
    completionRate: 87,
    isActive: true,
  },
  {
    id: '2',
    name: 'Follow-up Check-in',
    visitType: 'Follow-up Visit',
    lastUpdated: '1 week ago',
    completionRate: 92,
    isActive: true,
  },
  {
    id: '3',
    name: 'Telehealth Intake',
    visitType: 'Telehealth Consultation',
    lastUpdated: '5 days ago',
    completionRate: 45,
    isActive: false,
  },
  {
    id: '4',
    name: 'Annual Physical Intake',
    visitType: 'Annual Physical',
    lastUpdated: '2 weeks ago',
    completionRate: 78,
    isActive: true,
  },
];

const mockResponses: Response[] = [
  {
    id: '1',
    patientName: 'Sarah Martinez',
    visitType: 'New Patient Visit',
    formName: 'New Patient Full Intake',
    status: 'submitted',
    timeSinceSent: '2 hours ago',
  },
  {
    id: '2',
    patientName: 'James Wilson',
    visitType: 'Follow-up Visit',
    formName: 'Follow-up Check-in',
    status: 'in-progress',
    timeSinceSent: '4 hours ago',
  },
  {
    id: '3',
    patientName: 'Emily Johnson',
    visitType: 'Annual Physical',
    formName: 'Annual Physical Intake',
    status: 'opened',
    timeSinceSent: '1 day ago',
  },
  {
    id: '4',
    patientName: 'Michael Brown',
    visitType: 'New Patient Visit',
    formName: 'New Patient Full Intake',
    status: 'sent',
    timeSinceSent: '2 days ago',
  },
  {
    id: '5',
    patientName: 'Lisa Anderson',
    visitType: 'Telehealth Consultation',
    formName: 'Telehealth Intake',
    status: 'in-progress',
    timeSinceSent: '3 hours ago',
  },
  {
    id: '6',
    patientName: 'David Kim',
    visitType: 'Follow-up Visit',
    formName: 'Follow-up Check-in',
    status: 'submitted',
    timeSinceSent: '5 hours ago',
  },
];

export function IntakeFormsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('visit-types');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);

  // If form builder is open, show it full screen
  if (isFormBuilderOpen) {
    return <FormBuilderPage onBack={() => setIsFormBuilderOpen(false)} />;
  }

  // If automation tab is active, show it full screen
  if (activeTab === 'automation') {
    return <IntakeAutomationPage />;
  }

  const getStatusColor = (status: VisitType['status']) => {
    switch (status) {
      case 'active':
        return 'var(--accent-primary)';
      case 'draft':
        return 'var(--text-muted)';
      case 'needs-attention':
        return 'var(--status-warning)';
    }
  };

  const getResponseStatusColor = (status: Response['status']) => {
    switch (status) {
      case 'submitted':
        return 'var(--accent-primary)';
      case 'in-progress':
        return 'var(--status-warning)';
      case 'opened':
        return 'var(--text-secondary)';
      case 'sent':
        return 'var(--text-muted)';
    }
  };

  const getResponseStatusLabel = (status: Response['status']) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'in-progress':
        return 'In Progress';
      case 'opened':
        return 'Opened';
      case 'sent':
        return 'Sent';
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ color: 'var(--text-primary)' }}>Intake & Forms</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mt-2">
          Manage digital intake forms and patient responses
        </p>
      </div>

      {/* Tab Navigation */}
      <div 
        className="flex gap-1 p-1 mb-8"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
        }}
      >
        {[
          { id: 'visit-types', label: 'Visit Types' },
          { id: 'active-forms', label: 'Active Forms' },
          { id: 'responses', label: 'Responses' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'automation', label: 'Automation' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className="flex-1 px-4 py-2.5 transition-all duration-200"
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-inverse)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: activeTab === tab.id ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'visit-types' && (
        <div>
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 max-w-md relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search visit types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                }}
              />
            </div>
            <Button icon={Plus} iconPosition="left">
              Create Visit Type
            </Button>
          </div>

          {/* Visit Type Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockVisitTypes.map((visitType) => (
              <div
                key={visitType.id}
                className="relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                }}
              >
                {/* Status Accent Strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: getStatusColor(visitType.status) }}
                />

                {/* Card Content */}
                <div className="mt-2">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 style={{ color: 'var(--text-primary)' }} className="mb-1">
                        {visitType.name}
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {visitType.description}
                      </p>
                    </div>
                  </div>

                  {/* Form Assignment */}
                  <div 
                    className="py-3 px-3 mb-4"
                    style={{
                      backgroundColor: visitType.formName 
                        ? 'var(--status-info-bg)' 
                        : 'var(--status-warning-bg)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }} className="mb-1">
                      Assigned Form
                    </div>
                    <div 
                      style={{ 
                        fontSize: '14px', 
                        color: visitType.formName ? 'var(--accent-primary)' : 'var(--status-warning)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {visitType.formName || 'No form assigned'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Updated {visitType.lastUpdated}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          e.currentTarget.style.color = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          e.currentTarget.style.color = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                          e.currentTarget.style.color = 'var(--status-error)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <div
                        style={{
                          width: '1px',
                          height: '20px',
                          backgroundColor: 'var(--border-default)',
                          margin: '0 4px',
                        }}
                      />
                      {visitType.formName ? (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          icon={Edit} 
                          iconPosition="left"
                          onClick={() => setIsFormBuilderOpen(true)}
                        >
                          Edit Form
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          icon={Plus} 
                          iconPosition="left"
                          onClick={() => setIsFormBuilderOpen(true)}
                        >
                          Create Form
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'active-forms' && (
        <div>
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] pl-10 pr-4 py-2.5"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                  }}
                />
              </div>
              <button
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                }}
              >
                <Filter className="w-4 h-4" />
                <span style={{ fontSize: '14px' }}>Filter</span>
              </button>
            </div>
          </div>

          {/* Forms List */}
          <div className="space-y-3">
            {mockActiveForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-5 transition-all duration-200"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 style={{ color: 'var(--text-primary)' }}>
                      {form.name}
                    </h4>
                    <div
                      className="px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: form.isActive ? 'var(--status-info-bg)' : 'var(--surface-canvas)',
                        color: form.isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {form.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-3">
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }} className="mb-1">
                        Visit Type
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {form.visitType}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }} className="mb-1">
                        Last Updated
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {form.lastUpdated}
                      </div>
                    </div>
                  </div>

                  {/* Completion Rate Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Completion Rate
                      </div>
                      <div 
                        style={{ 
                          fontSize: '14px', 
                          color: form.completionRate >= 75 ? 'var(--accent-primary)' : 'var(--status-warning)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {form.completionRate}%
                      </div>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--surface-canvas)' }}
                    >
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${form.completionRate}%`,
                          backgroundColor: form.completionRate >= 75 
                            ? 'var(--accent-primary)' 
                            : 'var(--status-warning)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-6">
                  <Button variant="ghost" size="sm" icon={Eye}>
                    Preview
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    icon={Edit}
                    onClick={() => setIsFormBuilderOpen(true)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'responses' && (
        <div>
          {/* Actions Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search patient responses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                }}
              />
            </div>
            <button
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-card)';
              }}
            >
              <Filter className="w-4 h-4" />
              <span style={{ fontSize: '14px' }}>Filter by Status</span>
            </button>
          </div>

          {/* Responses Table */}
          <div 
            className="overflow-hidden"
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            {/* Table Header */}
            <div 
              className="grid grid-cols-5 gap-4 px-6 py-4"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderBottom: '1px solid var(--border-default)',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'var(--font-weight-medium)' }}>
                PATIENT
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'var(--font-weight-medium)' }}>
                VISIT TYPE
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'var(--font-weight-medium)' }}>
                FORM
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'var(--font-weight-medium)' }}>
                STATUS
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'var(--font-weight-medium)' }}>
                TIME
              </div>
            </div>

            {/* Table Rows */}
            {mockResponses.map((response, index) => (
              <div
                key={response.id}
                className="grid grid-cols-5 gap-4 px-6 py-4 transition-colors cursor-pointer"
                style={{
                  borderBottom: index !== mockResponses.length - 1 ? '1px solid var(--border-default)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {response.patientName}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {response.visitType}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {response.formName}
                </div>
                <div>
                  <div
                    className="inline-flex items-center px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: response.status === 'submitted' 
                        ? 'var(--status-info-bg)'
                        : response.status === 'in-progress'
                        ? 'var(--status-warning-bg)'
                        : 'var(--surface-canvas)',
                      color: getResponseStatusColor(response.status),
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {getResponseStatusLabel(response.status)}
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {response.timeSinceSent}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Overall Completion', value: '84%', trend: '+5%', color: 'var(--accent-primary)' },
              { label: 'Avg Completion Time', value: '3.2 min', trend: '-12s', color: 'var(--status-success)' },
              { label: 'Drop-off Rate', value: '16%', trend: '-3%', color: 'var(--status-warning)' },
              { label: 'Total Responses', value: '1,247', trend: '+18%', color: 'var(--text-secondary)' },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-5"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }} className="mb-2">
                  {stat.label}
                </div>
                <div className="flex items-end justify-between">
                  <div style={{ fontSize: '28px', color: stat.color, fontWeight: 'var(--font-weight-semibold)' }}>
                    {stat.value}
                  </div>
                  <div 
                    className="flex items-center gap-1"
                    style={{ 
                      fontSize: '13px', 
                      color: stat.trend.startsWith('+') && index !== 2 ? 'var(--status-success)' : 'var(--status-error)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Completion Rate by Visit Type */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)' }} className="mb-6">
                Completion Rate by Visit Type
              </h3>
              <div className="space-y-4">
                {[
                  { type: 'Follow-up Visit', rate: 92 },
                  { type: 'New Patient Visit', rate: 87 },
                  { type: 'Annual Physical', rate: 78 },
                  { type: 'Telehealth', rate: 45 },
                ].map((item) => (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-2">
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {item.type}
                      </div>
                      <div 
                        style={{ 
                          fontSize: '14px', 
                          color: item.rate >= 75 ? 'var(--accent-primary)' : 'var(--status-warning)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {item.rate}%
                      </div>
                    </div>
                    <div
                      className="w-full h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--surface-canvas)' }}
                    >
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${item.rate}%`,
                          backgroundColor: item.rate >= 75 
                            ? 'var(--accent-primary)' 
                            : 'var(--status-warning)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drop-off Points */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <h3 style={{ color: 'var(--text-primary)' }} className="mb-6">
                Common Drop-off Points
              </h3>
              <div className="space-y-4">
                {[
                  { section: 'Medical History', dropoff: 42 },
                  { section: 'Insurance Info', dropoff: 28 },
                  { section: 'Consent Forms', dropoff: 18 },
                  { section: 'Basic Info', dropoff: 12 },
                ].map((item) => (
                  <div key={item.section}>
                    <div className="flex items-center justify-between mb-2">
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        {item.section}
                      </div>
                      <div 
                        style={{ 
                          fontSize: '14px', 
                          color: 'var(--status-warning)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {item.dropoff}%
                      </div>
                    </div>
                    <div
                      className="w-full h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--surface-canvas)' }}
                    >
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${item.dropoff}%`,
                          backgroundColor: 'var(--status-warning)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}