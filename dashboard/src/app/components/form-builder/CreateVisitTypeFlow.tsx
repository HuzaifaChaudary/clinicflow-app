import { useState, useEffect } from 'react';
import { X, ChevronRight, Plus } from 'lucide-react';
import { FormQuestion, VisitCategory, VisitTypeForm, QuestionType } from './FormBuilderTypes';
import { QuestionEditor } from './QuestionEditor';

interface CreateVisitTypeFlowProps {
  onClose: () => void;
  onSave: (visitType: VisitTypeForm) => void;
  editingForm?: VisitTypeForm;
}

type FlowStep = 1 | 2;

export function CreateVisitTypeFlow({ onClose, onSave, editingForm }: CreateVisitTypeFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);
  const [isClosing, setIsClosing] = useState(false);

  // Step 1 state
  const [visitTypeName, setVisitTypeName] = useState(editingForm?.name || '');
  const [description, setDescription] = useState(editingForm?.description || '');
  const [category, setCategory] = useState<VisitCategory>(editingForm?.category || 'new-patient');

  // Step 2 state
  const [questions, setQuestions] = useState<FormQuestion[]>(
    editingForm?.questions || []
  );

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleAddQuestion = () => {
    const newQuestion: FormQuestion = {
      id: `q_${Date.now()}`,
      label: '',
      type: 'short-text',
      required: false,
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (id: string, updated: FormQuestion) => {
    setQuestions(questions.map(q => q.id === id ? updated : q));
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleDuplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      const duplicated: FormQuestion = {
        ...question,
        id: `q_${Date.now()}`,
        label: `${question.label} (Copy)`,
        order: questions.length,
      };
      setQuestions([...questions, duplicated]);
    }
  };

  const handleSave = () => {
    const visitTypeForm: VisitTypeForm = {
      id: editingForm?.id || `vt_${Date.now()}`,
      name: visitTypeName,
      description,
      category,
      questions: questions.map((q, index) => ({ ...q, order: index })),
      createdAt: editingForm?.createdAt || new Date(),
      updatedAt: new Date(),
      isArchived: false,
    };
    onSave(visitTypeForm);
  };

  const canProceedStep1 = visitTypeName.trim().length > 0;
  const canSave = questions.length > 0 && questions.every(q => q.label.trim().length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-lg shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--surface-card)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          opacity: isClosing ? 0 : 1,
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div>
            <h2 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {editingForm ? 'Edit Visit Type' : 'Create Visit Type'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Step {currentStep} of 2
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--surface-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6" style={{ minHeight: 0 }}>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Visit Type Information
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Define the basic details for this visit type
                </p>
              </div>

              {/* Visit Type Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Visit Type Name *
                </label>
                <input
                  type="text"
                  value={visitTypeName}
                  onChange={(e) => setVisitTypeName(e.target.value)}
                  placeholder="e.g., New Patient Visit, Annual Check-up"
                  className="w-full px-4 py-3 rounded-lg border transition-all"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: visitTypeName ? 'var(--accent-primary)' : 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of when to use this visit type"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border transition-all resize-none"
                  style={{
                    backgroundColor: 'var(--surface-canvas)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  Visit Category
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { value: 'new-patient' as VisitCategory, label: 'New Patient' },
                    { value: 'follow-up' as VisitCategory, label: 'Follow-up' },
                    { value: 'custom' as VisitCategory, label: 'Custom' },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className="p-4 rounded-lg border-2 transition-all text-center"
                      style={{
                        backgroundColor: category === cat.value ? 'var(--accent-primary-bg)' : 'var(--surface-card)',
                        borderColor: category === cat.value ? 'var(--accent-primary)' : 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedStep1}
                  className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
                  style={{
                    backgroundColor: canProceedStep1 ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                    color: 'white',
                    opacity: canProceedStep1 ? 1 : 0.5,
                    cursor: canProceedStep1 ? 'pointer' : 'not-allowed',
                  }}
                >
                  <span>Continue to Form Builder</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Build Your Form
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Add questions that patients will answer for "{visitTypeName}"
                </p>
              </div>

              {/* Questions list */}
              <div className="space-y-3">
                {questions.map((question) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    onUpdate={(updated) => handleUpdateQuestion(question.id, updated)}
                    onDelete={() => handleDeleteQuestion(question.id)}
                    onDuplicate={() => handleDuplicateQuestion(question.id)}
                  />
                ))}

                {questions.length === 0 && (
                  <div
                    className="p-8 rounded-lg border-2 border-dashed text-center"
                    style={{
                      borderColor: 'var(--border-default)',
                      backgroundColor: 'var(--surface-canvas)',
                    }}
                  >
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      No questions yet. Add your first question to get started.
                    </p>
                  </div>
                )}

                {/* Add question button */}
                <button
                  onClick={handleAddQuestion}
                  className="w-full px-4 py-3 rounded-lg border-2 border-dashed transition-all font-medium flex items-center justify-center gap-2"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Question</span>
                </button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--surface-hover)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  className="px-6 py-3 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: canSave ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
                    color: 'white',
                    opacity: canSave ? 1 : 0.5,
                    cursor: canSave ? 'pointer' : 'not-allowed',
                  }}
                >
                  {editingForm ? 'Save Changes' : 'Create Visit Type'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
