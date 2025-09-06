import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  CheckCircle as CompleteIcon,
} from '@mui/icons-material';

import { OrderFormData, FormStep } from '../types/order';
import { step1Schema, step2Schema, step3Schema } from '../utils/validation';
import { getStepProgress, validateOrderData } from '../utils/orderUtils';

import Step1Products from './Step1Products';
import Step2Delivery from './Step2Delivery';
import Step3Payment from './Step3Payment';

// 단계 정보
const steps = [
  { key: 'products' as FormStep, label: '상품 선택', schema: step1Schema },
  { key: 'delivery' as FormStep, label: '배송 정보', schema: step2Schema },
  { key: 'payment' as FormStep, label: '결제 정보', schema: step3Schema },
];

const OrderForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('products');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  // React Hook Form 설정
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OrderFormData>({
    mode: 'onChange',
    defaultValues: {
      products: [],
      deliveryMethod: 'delivery',
      recipientName: '',
      recipientPhone: '',
      paymentMethod: 'card',
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  // 현재 단계 인덱스
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = getStepProgress(currentStep);

  // 다음 단계로 이동
  const nextStep = async () => {
    const currentStepData = steps[currentStepIndex];
    
    // 현재 단계 검증
    const isValid = await trigger();
    if (!isValid) {
      setStepErrors(['입력 정보를 확인해주세요']);
      return;
    }

    // 단계별 추가 검증
    try {
      const formData = getValues();
      await currentStepData.schema.validate(formData, { abortEarly: false });
      setStepErrors([]);
      
      // 다음 단계로 이동
      if (currentStepIndex < steps.length - 1) {
        setCurrentStep(steps[currentStepIndex + 1].key);
      }
    } catch (error: any) {
      if (error.errors) {
        setStepErrors(error.errors);
      }
    }
  };

  // 이전 단계로 이동
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
      setStepErrors([]);
    }
  };

  // 주문 완료
  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      // 최종 검증
      const validationErrors = validateOrderData(data);
      if (validationErrors.length > 0) {
        setStepErrors(validationErrors);
        return;
      }

      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('주문 데이터:', data);
      setShowSuccess(true);
    } catch (error) {
      console.error('주문 실패:', error);
      setStepErrors(['주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 단계별 컴포넌트 렌더링
  const renderStepContent = () => {
    switch (currentStep) {
      case 'products':
        return <Step1Products control={control} />;
      case 'delivery':
        return <Step2Delivery control={control} setValue={setValue} />;
      case 'payment':
        return <Step3Payment control={control} setValue={setValue} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
        {/* 진행 상황 표시 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            📋 상품 주문
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            {currentStepIndex + 1} / {steps.length} 단계
          </Typography>
        </Box>

        {/* 단계 표시 */}
        <Stepper activeStep={currentStepIndex} sx={{ mb: 4 }}>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* 에러 메시지 */}
        {stepErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {stepErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* 폼 내용 */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {renderStepContent()}

          {/* 네비게이션 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              startIcon={<BackIcon />}
              variant="outlined"
            >
              이전 단계
            </Button>

            {currentStepIndex === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? undefined : <CompleteIcon />}
                sx={{ px: 4 }}
              >
                {isSubmitting ? '주문 처리 중...' : '주문 완료'}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                variant="contained"
                endIcon={<NextIcon />}
              >
                다음 단계
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* 주문 완료 다이얼로그 */}
      <Dialog
        open={showSuccess}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <CompleteIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5">
            주문이 완료되었습니다!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            주문해주셔서 감사합니다.<br />
            주문 확인 및 배송 안내는 문자로 전송됩니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
          <Button
            onClick={() => setShowSuccess(false)}
            variant="contained"
            size="large"
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderForm;