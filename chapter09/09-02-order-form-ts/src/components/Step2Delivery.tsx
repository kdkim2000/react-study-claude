import React from 'react';
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
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  Collapse,
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  Store as PickupIcon,
} from '@mui/icons-material';
import { OrderFormData } from '../types/order';
import { pickupLocations } from '../data/products';
import { formatPhoneNumber } from '../utils/orderUtils';

interface Step2DeliveryProps {
  control: Control<OrderFormData>;
  setValue: (name: keyof OrderFormData, value: any) => void;
}

const Step2Delivery: React.FC<Step2DeliveryProps> = ({ control, setValue }) => {
  // 배송 방법 감시
  const deliveryMethod = useWatch({
    control,
    name: 'deliveryMethod',
    defaultValue: 'delivery',
  });

  // 전화번호 포맷팅 처리
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setValue('recipientPhone', formatted);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🚚 배송 정보
      </Typography>

      {/* 배송 방법 선택 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Controller
            name="deliveryMethod"
            control={control}
            defaultValue="delivery"
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend">배송 방법</FormLabel>
                <RadioGroup {...field} sx={{ mt: 1 }}>
                  <FormControlLabel
                    value="delivery"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeliveryIcon color="primary" />
                        <Box>
                          <Typography variant="body1">배송 (3,000원)</Typography>
                          <Typography variant="body2" color="text.secondary">
                            5만원 이상 주문 시 무료배송
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="pickup"
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PickupIcon color="primary" />
                        <Box>
                          <Typography variant="body1">매장 픽업 (무료)</Typography>
                          <Typography variant="body2" color="text.secondary">
                            매장에서 직접 수령
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
        </CardContent>
      </Card>

      {/* 받는 분 정보 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            받는 분 정보
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Controller
              name="recipientName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="받는 분 성함"
                  required
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            
            <Controller
              name="recipientPhone"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="연락처"
                  placeholder="010-1234-5678"
                  required
                  error={!!error}
                  helperText={error?.message}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
              )}
            />
          </Box>
        </CardContent>
      </Card>

      {/* 조건부 필드: 배송 주소 */}
      <Collapse in={deliveryMethod === 'delivery'}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              배송 주소
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Controller
                name="address.zipCode"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="우편번호"
                    required
                    sx={{ width: 200 }}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Box>
            
            <Controller
              name="address.address"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="주소"
                  fullWidth
                  required
                  sx={{ mb: 2 }}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            
            <Controller
              name="address.detailAddress"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="상세주소"
                  fullWidth
                  required
                  placeholder="동/호수를 입력해주세요"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </CardContent>
        </Card>
      </Collapse>

      {/* 조건부 필드: 픽업 장소 */}
      <Collapse in={deliveryMethod === 'pickup'}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Controller
              name="pickupLocation"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>픽업 장소 선택</InputLabel>
                  <Select {...field} label="픽업 장소 선택">
                    {pickupLocations.map((location, index) => (
                      <MenuItem key={index} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
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
      </Collapse>

      {/* 배송 요청사항 (선택) */}
      <Card>
        <CardContent>
          <Controller
            name="deliveryRequest"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="배송 요청사항 (선택)"
                fullWidth
                multiline
                rows={3}
                placeholder="배송 시 요청사항이 있으시면 입력해주세요"
                helperText="예: 부재 시 경비실 보관, 문 앞에 놓아주세요 등"
              />
            )}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Step2Delivery;