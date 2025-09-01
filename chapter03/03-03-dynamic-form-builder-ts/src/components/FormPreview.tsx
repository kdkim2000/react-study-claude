import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { FormConfig, FormData, ValidationError } from '../types/form';
import FormFieldRenderer from './FormFieldRenderer';

interface FormPreviewProps {
  config: FormConfig;
  onBack: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ config, onBack }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showJson, setShowJson] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 기본값 설정
  useEffect(() => {
    const initialData: FormData = {};
    config.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      } else if (field.type === 'checkbox' && field.options) {
        initialData[field.id] = [];
      }
    });
    setFormData(initialData);
  }, [config.fields]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // 실시간 유효성 검사
    validateField(fieldId, value);
  };

  const validateField = (fieldId: string, value: any) => {
    const field = config.fields.find(f => f.id === fieldId);
    if (!field) return;

    const newErrors = errors.filter(e => e.fieldId !== fieldId);

    // 필수 필드 검사
    if (field.required) {
      if (value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        newErrors.push({
          fieldId,
          message: `${field.label}은(는) 필수 항목입니다.`
        });
      }
    }

    // 타입별 유효성 검사
    if (value && field.validation) {
      const validation = field.validation;

      // 문자열 길이 검사
      if (typeof value === 'string') {
        if (validation.minLength && value.length < validation.minLength) {
          newErrors.push({
            fieldId,
            message: `${field.label}은(는) 최소 ${validation.minLength}자 이상이어야 합니다.`
          });
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          newErrors.push({
            fieldId,
            message: `${field.label}은(는) 최대 ${validation.maxLength}자 이하여야 합니다.`
          });
        }
      }

      // 숫자 범위 검사
      if (typeof value === 'number' || field.type === 'number') {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numValue)) {
          if (validation.min !== undefined && numValue < validation.min) {
            newErrors.push({
              fieldId,
              message: `${field.label}은(는) ${validation.min} 이상이어야 합니다.`
            });
          }
          if (validation.max !== undefined && numValue > validation.max) {
            newErrors.push({
              fieldId,
              message: `${field.label}은(는) ${validation.max} 이하여야 합니다.`
            });
          }
        }
      }

      // 이메일 검사
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.push({
            fieldId,
            message: '올바른 이메일 형식이 아닙니다.'
          });
        }
      }
    }

    setErrors(newErrors);
  };

  const validateAllFields = () => {
    const allErrors: ValidationError[] = [];

    config.fields.forEach(field => {
      const value = formData[field.id];
      
      // 필수 필드 검사
      if (field.required) {
        if (value === undefined || value === null || value === '' || 
            (Array.isArray(value) && value.length === 0)) {
          allErrors.push({
            fieldId: field.id,
            message: `${field.label}은(는) 필수 항목입니다.`
          });
        }
      }

      // 추가 유효성 검사는 validateField 함수와 동일
      if (value && field.validation) {
        const validation = field.validation;

        if (typeof value === 'string') {
          if (validation.minLength && value.length < validation.minLength) {
            allErrors.push({
              fieldId: field.id,
              message: `${field.label}은(는) 최소 ${validation.minLength}자 이상이어야 합니다.`
            });
          }
          if (validation.maxLength && value.length > validation.maxLength) {
            allErrors.push({
              fieldId: field.id,
              message: `${field.label}은(는) 최대 ${validation.maxLength}자 이하여야 합니다.`
            });
          }
        }

        if (typeof value === 'number' || field.type === 'number') {
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          if (!isNaN(numValue)) {
            if (validation.min !== undefined && numValue < validation.min) {
              allErrors.push({
                fieldId: field.id,
                message: `${field.label}은(는) ${validation.min} 이상이어야 합니다.`
              });
            }
            if (validation.max !== undefined && numValue > validation.max) {
              allErrors.push({
                fieldId: field.id,
                message: `${field.label}은(는) ${validation.max} 이하여야 합니다.`
              });
            }
          }
        }

        if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            allErrors.push({
              fieldId: field.id,
              message: '올바른 이메일 형식이 아닙니다.'
            });
          }
        }
      }
    });

    setErrors(allErrors);
    return allErrors.length === 0;
  };

  const handleSubmit = () => {
    if (validateAllFields()) {
      setSubmitted(true);
      console.log('폼 제출:', formData);
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors([]);
    setSubmitted(false);
  };

  const getFieldError = (fieldId: string) => {
    return errors.find(e => e.fieldId === fieldId);
  };

  return (
    <Box>
      {/* 헤더 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {config.title || '폼 미리보기'}
            </Typography>
            {config.description && (
              <Typography variant="body1" color="text.secondary" mt={1}>
                {config.description}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<CodeIcon />}
              onClick={() => setShowJson(!showJson)}
            >
              {showJson ? 'JSON 숨기기' : 'JSON 보기'}
            </Button>
            <Button variant="outlined" onClick={onBack}>
              편집으로 돌아가기
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* 폼 영역 */}
        <Grid item xs={12} md={showJson ? 6 : 12}>
          <Paper elevation={1} sx={{ p: 3 }}>
            {submitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                폼이 성공적으로 제출되었습니다!
              </Alert>
            )}

            {errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="subtitle2">다음 오류를 수정해주세요:</Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Box display="flex" flexDirection="column" gap={3}>
              {config.fields.map((field) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={handleFieldChange}
                  error={getFieldError(field.id)}
                />
              ))}

              <Divider sx={{ my: 2 }} />

              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                >
                  초기화
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={errors.length > 0}
                >
                  제출
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* JSON 미리보기 */}
        {showJson && (
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h6" gutterBottom>
                폼 데이터 (JSON)
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  maxHeight: '500px'
                }}
              >
                {JSON.stringify(formData, null, 2)}
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                폼 구조 (JSON)
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  maxHeight: '300px'
                }}
              >
                {JSON.stringify(config, null, 2)}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FormPreview;