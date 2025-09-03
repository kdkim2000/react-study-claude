// 유효성 검사 함수 타입 정의
export type ValidationFunction<T = any> = (value: any, allValues?: T) => string | null;

// 기본 유효성 검사 규칙들
export const validationRules = {
  // 필수 입력 검사
  required: (value: any): string | null => {
    if (!value || value.toString().trim() === '') {
      return '필수 입력 항목입니다.';
    }
    return null;
  },

  // 이메일 형식 검사
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return '올바른 이메일 형식을 입력해주세요.';
    }
    return null;
  },

  // 최소 길이 검사
  minLength: (min: number) => (value: string): string | null => {
    if (value && value.length < min) {
      return `최소 ${min}자 이상 입력해주세요.`;
    }
    return null;
  },

  // 최대 길이 검사
  maxLength: (max: number) => (value: string): string | null => {
    if (value && value.length > max) {
      return `최대 ${max}자까지 입력 가능합니다.`;
    }
    return null;
  },

  // 비밀번호 강도 검사
  strongPassword: (value: string): string | null => {
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (value.length < 8) {
      return '비밀번호는 최소 8자 이상이어야 합니다.';
    }
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      return '대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.';
    }
    
    return null;
  },

  // 비밀번호 확인 검사
  confirmPassword: (password: string) => (confirmPassword: string): string | null => {
    if (confirmPassword && confirmPassword !== password) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return null;
  },

  // 전화번호 형식 검사
  phoneNumber: (value: string): string | null => {
    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
      return '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
    }
    return null;
  },

  // 숫자만 허용
  numbersOnly: (value: string): string | null => {
    const numberRegex = /^\d+$/;
    if (value && !numberRegex.test(value)) {
      return '숫자만 입력 가능합니다.';
    }
    return null;
  },
};

// 여러 유효성 검사 규칙을 조합하는 헬퍼 함수
export const combineValidations = <T = any>(
  ...validators: ValidationFunction<T>[]
) => (value: any, allValues?: T): string | null => {
  for (const validator of validators) {
    const error = validator(value, allValues);
    if (error) {
      return error;
    }
  }
  return null;
};