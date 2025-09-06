// 회원가입 폼 데이터 타입 정의
export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  birthDate: string;
  termsRequired: boolean;
  termsOptional: boolean;
}

// 폼 검증 상태
export interface ValidationStatus {
  isValid: boolean;
  message?: string;
  isChecking?: boolean;
}