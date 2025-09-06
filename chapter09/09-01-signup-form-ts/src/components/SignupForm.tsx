import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import { SignupFormData } from '../types/form';
import { signupSchema, checkEmailDuplicate, formatPhoneNumber } from '../utils/validation';

// dayjs 한국어 설정
dayjs.locale('ko');

const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'duplicate'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // React Hook Form 설정
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: 'onChange', // 실시간 검증
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      phone: '',
      birthDate: '',
      termsRequired: false,
      termsOptional: false,
    },
  });

  // 이메일 값 감시
  const emailValue = watch('email');

  // 이메일 중복 체크
  useEffect(() => {
    const checkEmail = async () => {
      if (emailValue && !errors.email && emailValue.includes('@')) {
        setEmailCheckStatus('checking');
        try {
          const isDuplicate = await checkEmailDuplicate(emailValue);
          setEmailCheckStatus(isDuplicate ? 'duplicate' : 'available');
        } catch (error) {
          setEmailCheckStatus('idle');
        }
      } else {
        setEmailCheckStatus('idle');
      }
    };

    const timeoutId = setTimeout(checkEmail, 500); // 0.5초 디바운스
    return () => clearTimeout(timeoutId);
  }, [emailValue, errors.email]);

  // 전화번호 포맷팅
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setValue('phone', formatted);
    trigger('phone'); // 실시간 검증 트리거
  };

  // 폼 제출
  const onSubmit = async (data: SignupFormData) => {
    if (emailCheckStatus === 'duplicate') {
      return;
    }

    setIsSubmitting(true);
    try {
      // 실제 API 호출을 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('회원가입 데이터:', data);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이메일 상태 아이콘
  const renderEmailIcon = () => {
    switch (emailCheckStatus) {
      case 'checking':
        return <CircularProgress size={20} />;
      case 'available':
        return <CheckCircle color="success" />;
      case 'duplicate':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  // 제출 성공 화면
  if (submitSuccess) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            회원가입 완료!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            환영합니다! 회원가입이 성공적으로 완료되었습니다.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          회원가입
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          {/* 이메일 */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="이메일"
                type="email"
                margin="normal"
                error={!!errors.email || emailCheckStatus === 'duplicate'}
                helperText={
                  errors.email?.message ||
                  (emailCheckStatus === 'duplicate' ? '이미 사용중인 이메일입니다' : '') ||
                  (emailCheckStatus === 'available' ? '사용 가능한 이메일입니다' : '')
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {renderEmailIcon()}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* 비밀번호 */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* 비밀번호 확인 */}
          <Controller
            name="passwordConfirm"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="비밀번호 확인"
                type={showPasswordConfirm ? 'text' : 'password'}
                margin="normal"
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        edge="end"
                      >
                        {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* 이름 */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="이름"
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* 전화번호 */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="전화번호"
                placeholder="010-1234-5678"
                margin="normal"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            )}
          />

          {/* 생년월일 */}
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="생년월일"
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => {
                  field.onChange(date ? date.format('YYYY-MM-DD') : '');
                }}
                maxDate={dayjs().subtract(14, 'year')} // 14세 이상
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    error: !!errors.birthDate,
                    helperText: errors.birthDate?.message,
                  },
                }}
              />
            )}
          />

          {/* 약관 동의 */}
          <Box sx={{ mt: 3 }}>
            <Controller
              name="termsRequired"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    }
                    label="[필수] 이용약관 및 개인정보 처리방침에 동의합니다"
                  />
                  {errors.termsRequired && (
                    <FormHelperText error>
                      {errors.termsRequired.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />

            <Controller
              name="termsOptional"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      color="primary"
                    />
                  }
                  label="[선택] 마케팅 정보 수신에 동의합니다"
                />
              )}
            />
          </Box>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={!isValid || emailCheckStatus === 'duplicate' || isSubmitting}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </Button>

          {/* 안내 메시지 */}
          <Alert severity="info" sx={{ mt: 2 }}>
            모든 필드를 올바르게 입력하고 필수 약관에 동의해주세요.
          </Alert>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default SignupForm;