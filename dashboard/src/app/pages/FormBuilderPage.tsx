import { useState } from 'react';
import { ArrowLeft, Plus, ChevronDown, ChevronRight, ToggleLeft, ToggleRight, Trash2, Eye } from 'lucide-react';
import { Button } from '../components/foundation/Button';

interface Section {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  fields: Field[];
}

interface Field {
  id: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'checkbox';
  label: string;
  required: boolean;
  conditional?: boolean;
}

const defaultSections: Section[] = [
  {
    id: '1',
    name: 'Basic Information',
    description: 'Patient demographics and contact info',
    isActive: true,
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', required: true },
      { id: 'f2', type: 'date', label: 'Date of Birth', required: true },
      { id: 'f3', type: 'email', label: 'Email Address', required: true },
      { id: 'f4', type: 'phone', label: 'Phone Number', required: true },
    ],
  },
  {
    id: '2',
    name: 'Reason for Visit',
    description: 'Chief complaint and symptoms',
    isActive: true,
    fields: [
      { id: 'f5', type: 'textarea', label: 'What brings you in today?', required: true },
      { id: 'f6', type: 'select', label: 'Symptom Duration', required: false },
    ],
  },
  {
    id: '3',
    name: 'Medical History',
    description: 'Previous conditions and medications',
    isActive: true,
    fields: [
      { id: 'f7', type: 'checkbox', label: 'Do you have any chronic conditions?', required: false },
      { id: 'f8', type: 'textarea', label: 'Current Medications', required: false, conditional: true },
      { id: 'f9', type: 'textarea', label: 'Allergies', required: true },
    ],
  },
  {
    id: '4',
    name: 'Insurance Information',
    description: 'Coverage and billing details',
    isActive: false,
    fields: [
      { id: 'f10', type: 'text', label: 'Insurance Provider', required: false },
      { id: 'f11', type: 'text', label: 'Policy Number', required: false },
    ],
  },
  {
    id: '5',
    name: 'Consent & Signature',
    description: 'Legal agreements and authorization',
    isActive: true,
    fields: [
      { id: 'f12', type: 'checkbox', label: 'I agree to the terms and conditions', required: true },
      { id: 'f13', type: 'text', label: 'Digital Signature', required: true },
    ],
  },
];

export function FormBuilderPage({ onBack }: { onBack: () => void }) {
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [expandedSections, setExpandedSections] = useState<string[]>(['1', '2']);
  const [formName, setFormName] = useState('New Patient Full Intake');
  const [isDraft, setIsDraft] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSectionActive = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, isActive: !section.isActive }
          : section
      )
    );
  };

  const getFieldIcon = (type: Field['type']) => {
    const style = { color: 'var(--text-muted)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)' };
    switch (type) {
      case 'text':
        return <span style={style}>TEXT</span>;
      case 'email':
        return <span style={style}>EMAIL</span>;
      case 'phone':
        return <span style={style}>PHONE</span>;
      case 'date':
        return <span style={style}>DATE</span>;
      case 'select':
        return <span style={style}>SELECT</span>;
      case 'textarea':
        return <span style={style}>LONG TEXT</span>;
      case 'checkbox':
        return <span style={style}>CHECKBOX</span>;
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div
        className="glass border-b px-6 py-4"
        style={{ borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-xl font-semibold border-none outline-none bg-transparent mb-1"
                style={{ color: 'var(--text-primary)' }}
              />
              <div className="flex items-center gap-2">
                <div
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: isDraft ? 'var(--surface-canvas)' : 'var(--status-info-bg)',
                    color: isDraft ? 'var(--text-muted)' : 'var(--accent-primary)',
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  {isDraft ? 'Draft' : 'Active'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Last saved 2 minutes ago
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" icon={Eye}>
              Preview
            </Button>
            <Button variant="secondary" size="sm">
              Save Draft
            </Button>
            <Button size="sm">
              {isDraft ? 'Publish Form' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form Editor */}
        <div className="w-[50%] border-r overflow-y-auto" style={{ borderColor: 'var(--border-default)' }}>
          <div className="p-8 max-w-[700px] mx-auto">
            <div className="mb-6">
              <h2 style={{ color: 'var(--text-primary)' }} className="mb-2">
                Form Sections
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Build your intake form by organizing questions into sections
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="overflow-hidden"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {/* Section Header */}
                  <div
                    className="flex items-center justify-between p-4"
                    style={{
                      backgroundColor: expandedSections.includes(section.id)
                        ? 'var(--surface-canvas)'
                        : 'transparent',
                      borderBottom: expandedSections.includes(section.id)
                        ? '1px solid var(--border-default)'
                        : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="p-1 rounded transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 style={{ color: 'var(--text-primary)' }}>
                            {section.name}
                          </h4>
                          <div
                            className="px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: 'var(--surface-canvas)',
                              color: 'var(--text-muted)',
                              fontSize: '11px',
                            }}
                          >
                            {section.fields.length} fields
                          </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSectionActive(section.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        color: section.isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title={section.isActive ? 'Deactivate section' : 'Activate section'}
                    >
                      {section.isActive ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Section Fields */}
                  {expandedSections.includes(section.id) && (
                    <div className="p-4 space-y-2">
                      {section.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                          style={{
                            backgroundColor: 'var(--surface-primary)',
                            border: '1px solid var(--border-subtle)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-default)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          }}
                        >
                          <div
                            className="px-2 py-1 rounded"
                            style={{
                              backgroundColor: 'var(--surface-canvas)',
                              fontSize: '11px',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {getFieldIcon(field.type)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                                {field.label}
                              </span>
                              {field.required && (
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: 'var(--accent-primary)' }}
                                  title="Required"
                                />
                              )}
                              {field.conditional && (
                                <div
                                  className="px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: 'var(--status-warning-bg)',
                                    color: 'var(--status-warning)',
                                    fontSize: '10px',
                                    fontWeight: 'var(--font-weight-medium)',
                                  }}
                                >
                                  Conditional
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            className="p-1.5 rounded transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--status-error-bg)';
                              e.currentTarget.style.color = 'var(--status-error)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors"
                        style={{
                          border: '1.5px dashed var(--border-default)',
                          color: 'var(--text-secondary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-primary)';
                          e.currentTarget.style.color = 'var(--accent-primary)';
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-default)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        <span style={{ fontSize: '14px' }}>Add Field</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Section Button */}
              <button
                className="w-full flex items-center justify-center gap-2 p-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--surface-card)',
                  border: '2px dashed var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                }}
              >
                <Plus className="w-5 h-5" />
                <span>Add New Section</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-[50%] overflow-y-auto" style={{ backgroundColor: 'var(--surface-canvas)' }}>
          <div className="p-8 flex justify-center">
            <div className="w-full max-w-[420px]">
              {/* Preview Label */}
              <div className="mb-6 text-center">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <Eye className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Patient View (Mobile)
                  </span>
                </div>
              </div>

              {/* Mobile Preview Container */}
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  border: '8px solid var(--text-primary)',
                  boxShadow: 'var(--shadow-3)',
                }}
              >
                {/* Mobile Screen */}
                <div className="h-[800px] overflow-y-auto">
                  {/* Header */}
                  <div
                    className="p-6 text-center"
                    style={{
                      backgroundColor: 'var(--surface-canvas)',
                      borderBottom: '1px solid var(--border-default)',
                    }}
                  >
                    <h2 style={{ color: 'var(--text-primary)' }} className="mb-2">
                      {formName}
                    </h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      This will take about 3-5 minutes
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Section 1 of {sections.filter(s => s.isActive).length}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--accent-primary)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        20%
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--surface-canvas)' }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: '20%',
                          backgroundColor: 'var(--accent-primary)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Form Content Preview */}
                  <div className="p-6 space-y-6">
                    {sections
                      .filter((s) => s.isActive)
                      .slice(0, 2)
                      .map((section) => (
                        <div key={section.id}>
                          <h3 style={{ color: 'var(--accent-primary)' }} className="mb-4">
                            {section.name}
                          </h3>
                          <div className="space-y-4">
                            {section.fields.map((field) => (
                              <div key={field.id}>
                                <label
                                  style={{
                                    fontSize: '14px',
                                    color: 'var(--text-primary)',
                                    fontWeight: 'var(--font-weight-medium)',
                                  }}
                                  className="block mb-2"
                                >
                                  {field.label}
                                  {field.required && (
                                    <span style={{ color: 'var(--status-error)' }}> *</span>
                                  )}
                                </label>
                                {field.type === 'textarea' ? (
                                  <textarea
                                    rows={3}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                    className="w-full px-4 py-3 rounded-lg"
                                    style={{
                                      backgroundColor: 'var(--surface-canvas)',
                                      border: '1px solid var(--border-default)',
                                      color: 'var(--text-primary)',
                                      fontSize: '16px',
                                    }}
                                  />
                                ) : field.type === 'checkbox' ? (
                                  <div className="flex items-start gap-3">
                                    <input
                                      type="checkbox"
                                      className="mt-1"
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        accentColor: 'var(--accent-primary)',
                                      }}
                                    />
                                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                      {field.label}
                                    </span>
                                  </div>
                                ) : (
                                  <input
                                    type={field.type}
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                    className="w-full px-4 py-3 rounded-lg"
                                    style={{
                                      backgroundColor: 'var(--surface-canvas)',
                                      border: '1px solid var(--border-default)',
                                      color: 'var(--text-primary)',
                                      fontSize: '16px',
                                    }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                    {/* Preview Continue Button */}
                    <button
                      className="w-full py-4 rounded-full"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        color: 'var(--text-inverse)',
                        fontWeight: 'var(--font-weight-medium)',
                        fontSize: '16px',
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
