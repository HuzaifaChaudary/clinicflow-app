import { useState } from 'react';
import { Plus, FileText, Archive, Search, MoreVertical, Edit, ArchiveRestore } from 'lucide-react';
import { VisitTypeForm } from '../components/form-builder/FormBuilderTypes';
import { CreateVisitTypeFlow } from '../components/form-builder/CreateVisitTypeFlow';

interface IntakeFormsPageCompleteProps {
  onNavigateToAutomation?: () => void;
}

export function IntakeFormsPageComplete({ onNavigateToAutomation }: IntakeFormsPageCompleteProps) {
  const [visitTypeForms, setVisitTypeForms] = useState<VisitTypeForm[]>([
    {
      id: 'vt_1',
      name: 'New Patient - Full Intake',
      description: 'Comprehensive intake for first-time patients',
      category: 'new-patient',
      questions: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      isArchived: false,
    },
    {
      id: 'vt_2',
      name: 'Follow-up Visit',
      description: 'Quick update for returning patients',
      category: 'follow-up',
      questions: [],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-20'),
      isArchived: false,
    },
    {
      id: 'vt_3',
      name: 'Annual Wellness Check',
      description: 'Yearly health assessment',
      category: 'custom',
      questions: [],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      isArchived: false,
    },
  ]);

  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [editingForm, setEditingForm] = useState<VisitTypeForm | undefined>();
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveVisitType = (visitType: VisitTypeForm) => {
    if (editingForm) {
      // Update existing
      setVisitTypeForms(forms => 
        forms.map(f => f.id === visitType.id ? visitType : f)
      );
    } else {
      // Add new
      setVisitTypeForms(forms => [...forms, visitType]);
    }
    setShowCreateFlow(false);
    setEditingForm(undefined);
  };

  const handleArchiveToggle = (id: string) => {
    setVisitTypeForms(forms =>
      forms.map(f => f.id === id ? { ...f, isArchived: !f.isArchived } : f)
    );
  };

  const handleEdit = (form: VisitTypeForm) => {
    setEditingForm(form);
    setShowCreateFlow(true);
  };

  const filteredForms = visitTypeForms.filter(form => {
    if (!showArchived && form.isArchived) return false;
    if (searchQuery && !form.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeForms = visitTypeForms.filter(f => !f.isArchived);
  const archivedForms = visitTypeForms.filter(f => f.isArchived);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--surface-canvas)' }}>
      {/* Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: 'var(--surface-card)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Intake & Forms
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Manage visit types and intake forms
              </p>
            </div>
            <button
              onClick={() => {
                setEditingForm(undefined);
                setShowCreateFlow(true);
              }}
              className="px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Visit Type</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: 'var(--surface-canvas)' }}
            >
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Active Forms
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {activeForms.length}
              </p>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: 'var(--surface-canvas)' }}
            >
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Archived Forms
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {archivedForms.length}
              </p>
            </div>
            <div
              className="p-4 rounded-lg cursor-pointer transition-all"
              style={{ backgroundColor: 'var(--accent-primary-bg)' }}
              onClick={onNavigateToAutomation}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                const text = e.currentTarget.querySelector('p:last-child') as HTMLElement;
                if (text) text.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-primary-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
                const text = e.currentTarget.querySelector('p:last-child') as HTMLElement;
                if (text) text.style.color = 'var(--accent-primary)';
              }}
            >
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Automation Active
              </p>
              <p className="text-2xl font-semibold" style={{ color: 'var(--accent-primary)' }}>
                View →
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search visit types..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Show archived toggle */}
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="px-4 py-2.5 rounded-lg border transition-all font-medium flex items-center gap-2"
            style={{
              backgroundColor: showArchived ? 'var(--accent-primary-bg)' : 'var(--surface-card)',
              borderColor: showArchived ? 'var(--accent-primary)' : 'var(--border-default)',
              color: showArchived ? 'var(--accent-primary)' : 'var(--text-primary)',
            }}
          >
            <Archive className="w-4 h-4" />
            <span>Archived</span>
          </button>
        </div>

        {/* Visit types list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForms.map(form => (
            <div
              key={form.id}
              className="rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-card)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {form.name}
                      </h3>
                      {form.isArchived && (
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--cf-neutral-20)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Archived
                        </span>
                      )}
                    </div>
                    {form.description && (
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {form.description}
                      </p>
                    )}
                  </div>
                  <div className="relative group">
                    <button
                      className="p-2 rounded transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div
                      className="absolute right-0 top-full mt-1 rounded-lg border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10"
                      style={{
                        backgroundColor: 'var(--surface-card)',
                        borderColor: 'var(--border-default)',
                        minWidth: '160px',
                      }}
                    >
                      <button
                        onClick={() => handleEdit(form)}
                        className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-all"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleArchiveToggle(form.id)}
                        className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-all"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {form.isArchived ? (
                          <>
                            <ArchiveRestore className="w-4 h-4" />
                            <span>Restore</span>
                          </>
                        ) : (
                          <>
                            <Archive className="w-4 h-4" />
                            <span>Archive</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                    style={{
                      backgroundColor: form.category === 'new-patient' ? 'var(--accent-primary-bg)' : form.category === 'follow-up' ? 'var(--status-info-bg)' : 'var(--cf-neutral-20)',
                      color: form.category === 'new-patient' ? 'var(--accent-primary)' : form.category === 'follow-up' ? 'var(--status-info)' : 'var(--text-muted)',
                    }}
                  >
                    {form.category.replace('-', ' ')}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Last updated {form.updatedAt.toLocaleDateString()}
                </div>
              </div>

              <div
                className="px-5 py-3 border-t flex items-center justify-between"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <button
                  className="text-sm font-medium transition-all"
                  style={{ color: 'var(--accent-primary)' }}
                  onClick={() => handleEdit(form)}
                >
                  View Details
                </button>
                <FileText className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          ))}

          {filteredForms.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {searchQuery ? 'No forms found' : showArchived ? 'No archived forms' : 'No visit types yet'}
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {searchQuery ? 'Try a different search term' : 'Create your first visit type to get started'}
              </p>
              {!searchQuery && !showArchived && (
                <button
                  onClick={() => setShowCreateFlow(true)}
                  className="px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'white',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Visit Type</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit flow */}
      {showCreateFlow && (
        <CreateVisitTypeFlow
          onClose={() => {
            setShowCreateFlow(false);
            setEditingForm(undefined);
          }}
          onSave={handleSaveVisitType}
          editingForm={editingForm}
        />
      )}
    </div>
  );
}
