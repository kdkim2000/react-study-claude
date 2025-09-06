import React, { useState } from 'react';
import { Controller, Control, useWatch } from 'react-hook-form';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Card,
  CardContent,
  Checkbox,
  Alert,
  Divider,
} from '@mui/material';
import {
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Chat as KakaoIcon,
  LocalOffer as CouponIcon,
} from '@mui/icons-material';
import { OrderFormData } from '../types/order';
import { validateCoupon } from '../utils/validation';
import { calculateOrderSummary, formatPrice } from '../utils/orderUtils';

interface Step3PaymentProps {
  control: Control<OrderFormData>;
  setValue: (name: keyof OrderFormData, value: any) => void;
}

const Step3Payment: React.FC<Step3PaymentProps> = ({ control, setValue }) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<{
    applied: boolean;
    discount: number;
    message: string;
  }>({ applied: false, discount: 0, message: '' });

  // 폼 데이터 감시 (주문 요약 계산용)
  const formData = useWatch({ control });
  const { products = [], deliveryMethod = 'delivery', couponCode } = formData;

  // 주문 요약 계산
  const orderSummary = calculateOrderSummary(
    products,
    deliveryMethod,
    couponStatus.discount
  );

  // 쿠폰 적용
  const applyCoupon = () => {
    const result = validateCoupon(couponInput);
    setCouponStatus({
      applied: result.valid,
      discount: result.discount,
      message: result.message,
    });

    if (result.valid) {
      setValue('couponCode', couponInput);
    }
  };

  // 쿠폰 제거
  const removeCoupon = () => {
    setCouponStatus({ applied: false, discount: 0, message: '' });
    setCouponInput('');
    setValue('couponCode', '');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        💳 결제 정보
      </Typography>

      {/* 결제 수단 선택 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl component="fieldset" error={!!error}>
                <FormLabel component="legend">결제 수단</FormLabel>
                <RadioGroup {...field} sx={{ mt: 1 }}>
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CardIcon color="primary" />
                        <Typography>신용카드 / 체크카드</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="bank"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BankIcon color="primary" />
                        <Typography>무통장 입금</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="kakao"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <KakaoIcon color="primary" />
                        <Typography>카카오페이</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
                {error && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {error.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </CardContent>
      </Card>

      {/* 쿠폰 적용 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CouponIcon color="primary" />
            <Typography variant="subtitle1">할인 쿠폰</Typography>
          </Box>

          {!couponStatus.applied ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="쿠폰 코드를 입력하세요"
                size="small"
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={applyCoupon}
                disabled={!couponInput.trim()}
              >
                적용
              </Button>
            </Box>
          ) : (
            <Alert
              severity="success"
              action={
                <Button color="inherit" size="small" onClick={removeCoupon}>
                  제거
                </Button>
              }
            >
              {couponStatus.message}
            </Alert>
          )}

          {couponStatus.message && !couponStatus.applied && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {couponStatus.message}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            사용 가능한 쿠폰: WELCOME10, SUMMER20, VIP30
          </Typography>
        </CardContent>
      </Card>

      {/* 주문 요약 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            📋 주문 요약
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>상품금액 ({orderSummary.productCount}개)</Typography>
              <Typography>{formatPrice(orderSummary.subtotal)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>배송비</Typography>
              <Typography>
                {orderSummary.deliveryFee === 0 ? '무료' : formatPrice(orderSummary.deliveryFee)}
              </Typography>
            </Box>
            
            {orderSummary.discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="error">할인금액</Typography>
                <Typography color="error">-{formatPrice(orderSummary.discount)}</Typography>
              </Box>
            )}
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="h6">최종 결제금액</Typography>
            <Typography variant="h6" color="primary">
              {formatPrice(orderSummary.total)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* 약관 동의 */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            약관 동의
          </Typography>

          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box>
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value || false} />}
                  label="[필수] 이용약관에 동의합니다"
                />
                {error && (
                  <Typography variant="caption" color="error" display="block">
                    {error.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Controller
            name="agreeToPrivacy"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box>
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value || false} />}
                  label="[필수] 개인정보 처리방침에 동의합니다"
                />
                {error && (
                  <Typography variant="caption" color="error" display="block">
                    {error.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            위 약관을 모두 확인하였으며, 이에 동의합니다.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Step3Payment;