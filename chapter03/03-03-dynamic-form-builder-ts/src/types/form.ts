export type FieldType = 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customMessage?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: any;
  options?: SelectOption[]; // for select and radio
  validation?: ValidationRule;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export interface FormData {
  [fieldId: string]: any;
}

export interface FormConfig {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface ValidationError {
  fieldId: string;
  message: string;
}

export const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: '텍스트' },
  { value: 'number', label: '숫자' },
  { value: 'email', label: '이메일' },
  { value: 'textarea', label: '텍스트 영역' },
  { value: 'select', label: '선택 박스' },
  { value: 'radio', label: '라디오 버튼' },
  { value: 'checkbox', label: '체크박스' },
  { value: 'date', label: '날짜' }
] as const;