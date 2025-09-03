import { useState, useEffect, useCallback } from 'react';
import { ValidationFunction } from '../utils/validationRules';

// 폼 필드 설정 타입
interface FormFieldConfig<T> {
  initialValue?: any;
  validations?: ValidationFunction<T>[];
}

// 폼 설정 타입
export interface FormConfig<T extends Record<string, any>> {
  [key: string]: FormFieldConfig<T>;
}

// 폼 상태 타입
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

// useForm Hook 반환 타입
interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (event: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => string | null;
  validateAllFields: () => boolean;
}

export const useForm = <T extends Record<string, any>>(
  config: FormConfig<T>
): UseFormReturn<T> => {
  // 초기값 설정
  const initialValues = Object.keys(config).reduce((acc, key) => {
    acc[key as keyof T] = config[key].initialValue || '';
    return acc;
  }, {} as T);

  // 폼 상태 관리
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false,
  });

  // 개별 필드 유효성 검사
  const validateField = useCallback((field: keyof T): string | null => {
    const fieldConfig = config[field as string];
    const value = formState.values[field];
    
    if (!fieldConfig || !fieldConfig.validations) {
      return null;
    }

    for (const validation of fieldConfig.validations) {
      const error = validation(value, formState.values);
      if (error) {
        return error;
      }
    }
    
    return null;
  }, [config, formState.values]);

  // 모든 필드 유효성 검사
  const validateAllFields = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isFormValid = true;

    Object.keys(config).forEach((field) => {
      const error = validateField(field as keyof T);
      if (error) {
        newErrors[field as keyof T] = error;
        isFormValid = false;
      }
    });

    setFormState(prev => ({
      ...prev,
      errors: newErrors,
      isValid: isFormValid,
    }));

    return isFormValid;
  }, [config, validateField]);

  // values 변경시 유효성 재검사
  useEffect(() => {
    const hasAnyTouched = Object.values(formState.touched).some(touched => touched);
    if (hasAnyTouched) {
      validateAllFields();
    }
  }, [formState.values, formState.touched, validateAllFields]);

  // 입력값 변경 핸들러
  const handleChange = useCallback((field: keyof T) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
    }));
  }, []);

  // 필드 블러 핸들러 (유효성 검사 실행)
  const handleBlur = useCallback((field: keyof T) => (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    setFormState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));

    // 블러 시점에 해당 필드 유효성 검사
    const error = validateField(field);
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
    }));
  }, [validateField]);

  // 폼 제출 핸들러
  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => 
    async (event: React.FormEvent) => {
      event.preventDefault();
      
      setFormState(prev => ({ ...prev, isSubmitting: true }));

      // 모든 필드를 touched로 설정
      const allTouched = Object.keys(config).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as Partial<Record<keyof T, boolean>>);

      setFormState(prev => ({
        ...prev,
        touched: allTouched,
      }));

      // 전체 유효성 검사
      const isValid = validateAllFields();

      if (isValid) {
        try {
          await onSubmit(formState.values);
        } catch (error) {
          console.error('폼 제출 중 오류 발생:', error);
        }
      }

      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }, [config, formState.values, validateAllFields]);

  // 필드 값 직접 설정
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
    }));
  }, []);

  // 필드 에러 직접 설정
  const setFieldError = useCallback((field: keyof T, error: string | null) => {
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error || undefined,
      },
    }));
  }, []);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: true,
      isSubmitting: false,
    });
  }, [initialValues]);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateField,
    validateAllFields,
  };
};