export type QuestionType = 
  | 'short-text'
  | 'long-text'
  | 'number'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'date';

export type VisitCategory = 'new-patient' | 'follow-up' | 'custom';

export interface QuestionOption {
  id: string;
  label: string;
}

export interface FormQuestion {
  id: string;
  label: string;
  helperText?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[]; // For dropdown, radio, checkbox
  order: number;
}

export interface VisitTypeForm {
  id: string;
  name: string;
  description?: string;
  category: VisitCategory;
  questions: FormQuestion[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export interface FormResponse {
  id: string;
  patientId: string;
  patientName: string;
  visitTypeFormId: string;
  visitTypeName: string;
  responses: Record<string, string | string[]>; // questionId -> answer
  submittedAt: Date;
  submittedBy: 'patient' | 'staff';
}
