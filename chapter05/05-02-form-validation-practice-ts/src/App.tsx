import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Grid
} from '@mui/material';
import { useState } from 'react';
import { useForm, FormConfig } from './hooks/useForm';
import { validationRules, combineValidations } from './utils/validationRules';

// 폼 데이터 타입 정의
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  age: string;
}

// 폼 설정
const formConfig: FormConfig<RegisterFormData> = {
  name: {
    initialValue: '',
    validations: [
      validationRules.required,
      validationRules.minLength(2),
      validationRules.maxLength(20),
    ],
  },
  email: {
    initialValue: '',
    validations: [
      validationRules.required,
      validationRules.email,
    ],
  },
  password: {
    initialValue: '',
    validations: [
      validationRules.required,
      validationRules.strongPassword,
    ],
  },
  confirmPassword: {
    initialValue: '',
    validations: [
      validationRules.required,
      // 커스텀 유효성 검사: 비밀번호 확인
      (value: string, allValues?: RegisterFormData) => {
        return validationRules.confirmPassword(allValues?.password || '')(value);
      },
    ],
  },
  phoneNumber: {
    initialValue: '',
    validations: [
      validationRules.required,
      validationRules.phoneNumber,
    ],
  },
  age: {
    initialValue: '',
    validations: [
      validationRules.required,
      validationRules.numbersOnly,
      // 커스텀 유효성 검사: 나이 범위
      (value: string) => {
        const age = parseInt(value);
        if (value && (age < 1 || age > 120)) {
          return '1세 이상 120세 이하만 입력 가능합니다.';
        }
        return null;
      },
    ],
  },
};

function App() {
  const [submitMessage, setSubmitMessage] = useState<string>('');
  
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm(formConfig);

  // 폼 제출 처리
  const onSubmit = async (formData: RegisterFormData) => {
    console.log('폼 데이터:', formData);
    
    // 실제로는 여기서 API 호출을 할 것입니다
    await new Promise(resolve => setTimeout(resolve, 1000)); // 가짜 지연
    
    setSubmitMessage('회원가입이 성공적으로 완료되었습니다! 🎉');
    
    // 폼 초기화
    setTimeout(() => {
      resetForm();
      setSubmitMessage('');
    }, 3000);
  };

  // 필드별 헬퍼 함수
  const getFieldProps = (fieldName: keyof RegisterFormData) => ({
    value: values[fieldName],
    onChange: handleChange(fieldName),
    onBlur: handleBlur(fieldName),
    error: !!(touched[fieldName] && errors[fieldName]),
    helperText: touched[fieldName] && errors[fieldName] ? errors[fieldName] : '',
  });

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        폼 유효성 검사 실습
      </Typography>
      
      <Typography variant="h6" gutterBottom color="text.secondary" align="center">
        useForm Hook을 활용한 회원가입 폼
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        {submitMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {submitMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={0}>
            {/* 이름 필드 */}
              <TextField
                fullWidth
                label="이름"
                placeholder="홍길동"
                {...getFieldProps('name')}
              />

            {/* 이메일 필드 */}
              <TextField
                fullWidth
                label="이메일"
                type="email"
                placeholder="example@email.com"
                {...getFieldProps('email')}
              />

            {/* 비밀번호 필드 */}
              <TextField
                fullWidth
                label="비밀번호"
                type="password"
                placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
                {...getFieldProps('password')}
              />

            {/* 비밀번호 확인 필드 */}
              <TextField
                fullWidth
                label="비밀번호 확인"
                type="password"
                placeholder="위에서 입력한 비밀번호를 다시 입력하세요"
                {...getFieldProps('confirmPassword')}
              />

            {/* 전화번호 필드 */}
              <TextField
                fullWidth
                label="전화번호"
                placeholder="010-1234-5678"
                {...getFieldProps('phoneNumber')}
              />

            {/* 나이 필드 */}
              <TextField
                fullWidth
                label="나이"
                type="number"
                placeholder="25"
                {...getFieldProps('age')}
              />
          </Grid>

          {/* 폼 상태 표시 */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" gutterBottom>
              <strong>폼 상태:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              유효성: {isValid ? '✅ 유효함' : '❌ 유효하지 않음'} |
              제출 중: {isSubmitting ? '🔄 제출 중...' : '⏸️ 대기 중'} |
              터치된 필드: {Object.keys(touched).filter(key => touched[key as keyof RegisterFormData]).length}개
            </Typography>
          </Box>

          {/* 제출 버튼 */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!isValid || isSubmitting}
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? '처리 중...' : '회원가입'}
            </Button>
            
            <Button
              type="button"
              variant="outlined"
              onClick={resetForm}
              disabled={isSubmitting}
              sx={{ minWidth: 100 }}
            >
              초기화
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* 디버깅 정보 (개발용) */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          개발자 정보 (디버깅용)
        </Typography>
        <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
          {JSON.stringify({ values, errors, touched }, null, 2)}
        </Typography>
      </Box>
    </Container>
  );
}

export default App;