import { useState } from 'react';
import { GripVertical, Trash2, Copy, Plus, X } from 'lucide-react';
import { FormQuestion, QuestionType, QuestionOption } from './FormBuilderTypes';

interface QuestionEditorProps {
  question: FormQuestion;
  onUpdate: (question: FormQuestion) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isDragging?: boolean;
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: 'short-text', label: 'Short Text' },
  { value: 'long-text', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'date', label: 'Date' },
];

export function QuestionEditor({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
  isDragging = false,
}: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const needsOptions = ['dropdown', 'radio', 'checkbox'].includes(question.type);

  const handleAddOption = () => {
    const newOption: QuestionOption = {
      id: `opt_${Date.now()}`,
      label: '',
    };
    onUpdate({
      ...question,
      options: [...(question.options || []), newOption],
    });
  };

  const handleUpdateOption = (optionId: string, label: string) => {
    onUpdate({
      ...question,
      options: question.options?.map(opt => 
        opt.id === optionId ? { ...opt, label } : opt
      ),
    });
  };

  const handleDeleteOption = (optionId: string) => {
    onUpdate({
      ...question,
      options: question.options?.filter(opt => opt.id !== optionId),
    });
  };

  return (
    <div
      className="border rounded-lg transition-all"
      style={{
        backgroundColor: 'var(--surface-card)',
        borderColor: isDragging ? 'var(--accent-primary)' : 'var(--border-default)',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          borderBottom: isExpanded ? '1px solid var(--border-default)' : 'none',
        }}
      >
        <GripVertical className="w-5 h-5 cursor-grab" style={{ color: 'var(--text-muted)' }} />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {question.label || 'Untitled Question'}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {questionTypes.find(t => t.value === question.type)?.label}
            {question.required && ' • Required'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-2 rounded transition-all"
            style={{
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded transition-all"
            style={{
              color: 'var(--status-error)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--status-error-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Question label */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Question Label *
            </label>
            <input
              type="text"
              value={question.label}
              onChange={(e) => onUpdate({ ...question, label: e.target.value })}
              placeholder="e.g., What is your date of birth?"
              className="w-full px-3 py-2 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Helper text */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Helper Text (Optional)
            </label>
            <input
              type="text"
              value={question.helperText || ''}
              onChange={(e) => onUpdate({ ...question, helperText: e.target.value })}
              placeholder="Additional instructions for the patient"
              className="w-full px-3 py-2 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Question type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Answer Type
            </label>
            <select
              value={question.type}
              onChange={(e) => onUpdate({ ...question, type: e.target.value as QuestionType })}
              className="w-full px-3 py-2 rounded-lg border transition-all"
              style={{
                backgroundColor: 'var(--surface-canvas)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Options (for dropdown, radio, checkbox) */}
          {needsOptions && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Options
              </label>
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border transition-all"
                      style={{
                        backgroundColor: 'var(--surface-canvas)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      onClick={() => handleDeleteOption(option.id)}
                      className="p-2 rounded transition-all"
                      style={{
                        color: 'var(--status-error)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--status-error-bg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddOption}
                  className="w-full px-3 py-2 rounded-lg border-2 border-dashed transition-all text-sm font-medium flex items-center justify-center gap-2"
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
                  <Plus className="w-4 h-4" />
                  <span>Add Option</span>
                </button>
              </div>
            </div>
          )}

          {/* Required toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Required Field
            </label>
            <button
              onClick={() => onUpdate({ ...question, required: !question.required })}
              className="relative w-11 h-6 rounded-full transition-all"
              style={{
                backgroundColor: question.required ? 'var(--accent-primary)' : 'var(--cf-neutral-30)',
              }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                style={{
                  left: question.required ? '24px' : '4px',
                }}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
