# Chapter 9: 폼 처리와 검증

## 📚 학습 목표
- Vue3 폼 처리와 React Hook Form의 차이점 이해
- React Hook Form으로 효율적인 폼 관리
- Yup/Zod를 활용한 스키마 기반 검증
- 복잡한 폼 시나리오 처리 방법 마스터

---

## 1. React Hook Form 기초

### 이론 설명 (30%)

React Hook Form은 Vue3의 양방향 바인딩(v-model)보다 더 성능 최적화된 폼 처리 라이브러리입니다. 불필요한 리렌더링을 최소화하고 폼 상태를 효율적으로 관리합니다.

#### Vue3 vs React 폼 처리 비교

| 특징 | Vue3 | React (기본) | React Hook Form |
|------|------|-------------|-----------------|
| 바인딩 방식 | `v-model` | `value` + `onChange` | `register()` |
| 리렌더링 | 입력마다 | 입력마다 | 최소화 |
| 검증 | 수동 또는 라이브러리 | 수동 | 내장 + 스키마 |
| 에러 처리 | 수동 | 수동 | 자동화 |
| 타입 지원 | 중간 | 기본 | 우수 |
| 성능 | 좋음 | 보통 | 매우 좋음 |

### 실습 코드 (70%)

#### 1.1 기본 설치 및 설정

```bash
# React Hook Form 설치
npm install react-hook-form
npm install @hookform/resolvers yup
npm install @types/yup -D

# 또는 Zod 사용시
npm install zod
```

#### 1.2 기본 폼 처리 비교

```vue
<!-- Vue3: 기본 폼 처리 -->
<template>
  <form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="formData.email"
      label="이메일"
      :error-messages="errors.email"
      @blur="validateEmail"
    />
    
    <v-text-field
      v-model="formData.password"
      label="비밀번호"
      type="password"
      :error-messages="errors.password"
    />
    
    <v-checkbox
      v-model="formData.agree"
      label="약관 동의"
    />
    
    <v-btn type="submit" :disabled="!isValid">
      제출
    </v-btn>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const formData = reactive({
  email: '',
  password: '',
  agree: false
})

const errors = reactive({
  email: '',
  password: ''
})

const isValid = computed(() => {
  return !errors.email && !errors.password && formData.agree
})

const validateEmail = () => {
  if (!formData.email) {
    errors.email = '이메일은 필수입니다'
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다'
  } else {
    errors.email = ''
  }
}

const handleSubmit = () => {
  console.log('제출:', formData)
}
</script>
```

```tsx
// React: React Hook Form 기본 사용
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Container,
  Paper,
  Typography,
  Alert
} from '@mui/material'

// 폼 데이터 타입 정의
interface IFormData {
  email: string
  password: string
  agree: boolean
}

function BasicForm() {
  // React Hook Form 초기화
  const {
    register,      // 필드 등록
    handleSubmit,  // 폼 제출 핸들러
    formState: { 
      errors,      // 에러 객체
      isValid,     // 폼 유효성
      isSubmitting // 제출 중 상태
    },
    watch,         // 필드 값 관찰
    setValue,      // 값 설정
    getValues,     // 값 가져오기
    reset          // 폼 리셋
  } = useForm<IFormData>({
    mode: 'onChange',  // 검증 모드: onChange, onBlur, onSubmit
    defaultValues: {
      email: '',
      password: '',
      agree: false
    }
  })
  
  // 폼 제출 핸들러
  const onSubmit: SubmitHandler<IFormData> = (data) => {
    console.log('제출된 데이터:', data)
    // API 호출 등 처리
  }
  
  // 특정 필드 값 관찰 (Vue3의 watch와 유사)
  const agreeValue = watch('agree')
  
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          React Hook Form 기본 예제
        </Typography>
        
        {/* handleSubmit이 검증 후 onSubmit 호출 */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* 이메일 필드 */}
          <TextField
            fullWidth
            label="이메일"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: '이메일은 필수입니다',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: '올바른 이메일 형식이 아닙니다'
              }
            })}
          />
          
          {/* 비밀번호 필드 */}
          <TextField
            fullWidth
            type="password"
            label="비밀번호"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password', {
              required: '비밀번호는 필수입니다',
              minLength: {
                value: 8,
                message: '비밀번호는 8자 이상이어야 합니다'
              },
              validate: {
                hasUpperCase: value => 
                  /[A-Z]/.test(value) || '대문자를 포함해야 합니다',
                hasNumber: value =>
                  /\d/.test(value) || '숫자를 포함해야 합니다'
              }
            })}
          />
          
          {/* 체크박스 */}
          <FormControlLabel
            control={
              <Checkbox
                {...register('agree', {
                  required: '약관에 동의해야 합니다'
                })}
              />
            }
            label="약관에 동의합니다"
          />
          {errors.agree && (
            <FormHelperText error>
              {errors.agree.message}
            </FormHelperText>
          )}
          
          {/* 현재 동의 상태 표시 */}
          {agreeValue && (
            <Alert severity="success" sx={{ mt: 2 }}>
              약관에 동의하셨습니다
            </Alert>
          )}
          
          {/* 제출 버튼 */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? '제출 중...' : '제출'}
          </Button>
          
          {/* 리셋 버튼 */}
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => reset()}
          >
            초기화
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default BasicForm
```

#### 1.3 Controller 컴포넌트 사용

```tsx
// React: Material-UI 컴포넌트와 통합
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Autocomplete,
  DatePicker,
  RadioGroup,
  Radio,
  FormLabel,
  Rating,
  Button,
  Typography,
  Paper,
  FormHelperText
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ko from 'date-fns/locale/ko'

interface AdvancedFormData {
  name: string
  category: string
  level: number
  isActive: boolean
  tags: string[]
  birthDate: Date | null
  gender: string
  rating: number
}

function ControllerExample() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<AdvancedFormData>({
    defaultValues: {
      name: '',
      category: '',
      level: 50,
      isActive: false,
      tags: [],
      birthDate: null,
      gender: '',
      rating: 3
    }
  })
  
  const onSubmit: SubmitHandler<AdvancedFormData> = (data) => {
    console.log('제출된 데이터:', data)
  }
  
  // 옵션 데이터
  const categories = ['개발', '디자인', '기획', '마케팅']
  const tagOptions = ['React', 'Vue', 'Angular', 'Next.js', 'Nuxt']
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Controller 컴포넌트 예제
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* 일반 TextField - register 사용 가능 */}
          <Controller
            name="name"
            control={control}
            rules={{ required: '이름은 필수입니다' }}
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
          
          {/* Select - Controller 필수 */}
          <Controller
            name="category"
            control={control}
            rules={{ required: '카테고리를 선택하세요' }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.category}>
                <InputLabel>카테고리</InputLabel>
                <Select {...field} label="카테고리">
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <FormHelperText>{errors.category.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          {/* Slider */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography gutterBottom>
              레벨: {watch('level')}
            </Typography>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Slider
                  {...field}
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={100}
                />
              )}
            />
          </Box>
          
          {/* Switch */}
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch {...field} checked={field.value} />
                }
                label={field.value ? '활성' : '비활성'}
              />
            )}
          />
          
          {/* Autocomplete (다중 선택) */}
          <Controller
            name="tags"
            control={control}
            rules={{ 
              required: '최소 1개의 태그를 선택하세요',
              validate: value => value.length <= 3 || '최대 3개까지 선택 가능합니다'
            }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                options={tagOptions}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="태그"
                    margin="normal"
                    error={!!errors.tags}
                    helperText={errors.tags?.message}
                  />
                )}
              />
            )}
          />
          
          {/* DatePicker */}
          <Controller
            name="birthDate"
            control={control}
            rules={{ required: '생년월일을 선택하세요' }}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="생년월일"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    error: !!errors.birthDate,
                    helperText: errors.birthDate?.message
                  }
                }}
              />
            )}
          />
          
          {/* RadioGroup */}
          <Controller
            name="gender"
            control={control}
            rules={{ required: '성별을 선택하세요' }}
            render={({ field }) => (
              <FormControl margin="normal" error={!!errors.gender}>
                <FormLabel>성별</FormLabel>
                <RadioGroup {...field} row>
                  <FormControlLabel 
                    value="male" 
                    control={<Radio />} 
                    label="남성" 
                  />
                  <FormControlLabel 
                    value="female" 
                    control={<Radio />} 
                    label="여성" 
                  />
                  <FormControlLabel 
                    value="other" 
                    control={<Radio />} 
                    label="기타" 
                  />
                </RadioGroup>
                {errors.gender && (
                  <FormHelperText>{errors.gender.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          {/* Rating */}
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">평점</Typography>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating {...field} />
              )}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            제출
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  )
}
```

---

## 2. Yup/Zod 스키마 검증

### 이론 설명

스키마 기반 검증은 폼 검증 로직을 선언적으로 정의할 수 있게 해줍니다. Vue3에서는 VeeValidate + Yup을 사용하는 것과 유사합니다.

### 실습 코드

#### 2.1 Yup을 사용한 검증

```tsx
// React: Yup 스키마 검증
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Grid,
  MenuItem
} from '@mui/material'

// Yup 스키마 정의 (Vue3 VeeValidate와 유사)
const schema = yup.object({
  // 문자열 검증
  username: yup
    .string()
    .required('사용자명은 필수입니다')
    .min(3, '최소 3자 이상이어야 합니다')
    .max(20, '최대 20자까지 가능합니다')
    .matches(/^[a-zA-Z0-9_]+$/, '영문, 숫자, 언더스코어만 가능합니다'),
  
  // 이메일 검증
  email: yup
    .string()
    .required('이메일은 필수입니다')
    .email('올바른 이메일 형식이 아닙니다'),
  
  // 비밀번호 검증
  password: yup
    .string()
    .required('비밀번호는 필수입니다')
    .min(8, '최소 8자 이상이어야 합니다')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      '대소문자, 숫자, 특수문자를 포함해야 합니다'
    ),
  
  // 비밀번호 확인
  passwordConfirm: yup
    .string()
    .required('비밀번호 확인은 필수입니다')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),
  
  // 나이 (숫자)
  age: yup
    .number()
    .required('나이는 필수입니다')
    .positive('양수여야 합니다')
    .integer('정수여야 합니다')
    .min(18, '18세 이상이어야 합니다')
    .max(100, '100세 이하여야 합니다'),
  
  // 웹사이트 URL
  website: yup
    .string()
    .url('올바른 URL 형식이 아닙니다')
    .nullable(),
  
  // 전화번호
  phone: yup
    .string()
    .required('전화번호는 필수입니다')
    .matches(
      /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
      '올바른 전화번호 형식이 아닙니다'
    ),
  
  // 선택 필드
  role: yup
    .string()
    .required('역할을 선택하세요')
    .oneOf(['admin', 'user', 'guest'], '올바른 역할이 아닙니다'),
  
  // 약관 동의
  terms: yup
    .boolean()
    .required('약관에 동의해야 합니다')
    .oneOf([true], '약관에 동의해야 합니다'),
  
  // 조건부 검증
  newsletter: yup.boolean(),
  newsletterEmail: yup.string().when('newsletter', {
    is: true,
    then: (schema) => schema.required('뉴스레터 이메일은 필수입니다').email(),
    otherwise: (schema) => schema.nullable()
  })
}).required()

type FormData = yup.InferType<typeof schema>

function YupValidationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<FormData>({
    resolver: yupResolver(schema),  // Yup 스키마 연결
    mode: 'onChange'
  })
  
  const newsletterValue = watch('newsletter')
  
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('검증 통과:', data)
  }
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Yup 스키마 검증 예제
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* 사용자명 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="사용자명"
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register('username')}
              />
            </Grid>
            
            {/* 이메일 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="이메일"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
              />
            </Grid>
            
            {/* 비밀번호 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="비밀번호"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
              />
            </Grid>
            
            {/* 비밀번호 확인 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="비밀번호 확인"
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm?.message}
                {...register('passwordConfirm')}
              />
            </Grid>
            
            {/* 나이 */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="나이"
                error={!!errors.age}
                helperText={errors.age?.message}
                {...register('age')}
              />
            </Grid>
            
            {/* 역할 */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="역할"
                defaultValue=""
                error={!!errors.role}
                helperText={errors.role?.message}
                {...register('role')}
              >
                <MenuItem value="">선택하세요</MenuItem>
                <MenuItem value="admin">관리자</MenuItem>
                <MenuItem value="user">사용자</MenuItem>
                <MenuItem value="guest">게스트</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={!isValid}
          >
            제출
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
```

#### 2.2 Zod를 사용한 검증

```tsx
// React: Zod 스키마 검증
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { useState } from 'react'

// Zod 스키마 정의 (Yup보다 TypeScript 친화적)
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다')
    .max(50, '이름은 50자 이하여야 합니다'),
  lastName: z
    .string()
    .min(1, '성은 필수입니다'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)')
})

const contactSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 형식이 아닙니다'),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '올바른 전화번호 형식이 아닙니다'),
  address: z
    .string()
    .min(10, '주소는 10자 이상 입력하세요')
})

const accountSchema = z.object({
  username: z
    .string()
    .min(4, '사용자명은 4자 이상이어야 합니다')
    .regex(/^[a-zA-Z0-9_]+$/, '영문, 숫자, 언더스코어만 가능합니다'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '대문자, 소문자, 숫자를 포함해야 합니다'
    ),
  passwordConfirm: z.string(),
  terms: z
    .boolean()
    .refine(val => val === true, '약관에 동의해야 합니다')
}).refine(data => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm']
})

// 전체 스키마 결합
const fullSchema = z.object({
  ...personalInfoSchema.shape,
  ...contactSchema.shape,
  ...accountSchema.shape
})

type FullFormData = z.infer<typeof fullSchema>

// 다단계 폼 컴포넌트
function MultiStepForm() {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<Partial<FullFormData>>({})
  
  const steps = ['개인 정보', '연락처 정보', '계정 정보']
  
  // 각 단계별 스키마
  const schemas = [personalInfoSchema, contactSchema, accountSchema]
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues
  } = useForm<FullFormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
    defaultValues: formData
  })
  
  const handleNext = async () => {
    // 현재 단계의 필드만 검증
    const fieldsToValidate = Object.keys(schemas[activeStep].shape)
    const isValid = await trigger(fieldsToValidate as any)
    
    if (isValid) {
      const currentValues = getValues()
      setFormData({ ...formData, ...currentValues })
      setActiveStep(prev => prev + 1)
    }
  }
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }
  
  const onSubmit = (data: FullFormData) => {
    console.log('최종 제출:', data)
    // API 호출
  }
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          다단계 폼 (Zod 검증)
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: 개인 정보 */}
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="이름"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  {...register('firstName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="성"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  {...register('lastName')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="생년월일"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.birthDate}
                  helperText={errors.birthDate?.message}
                  {...register('birthDate')}
                />
              </Grid>
            </Grid>
          )}
          
          {/* Step 2: 연락처 정보 */}
          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="이메일"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="전화번호"
                  placeholder="010-1234-5678"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  {...register('phone')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="주소"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  {...register('address')}
                />
              </Grid>
            </Grid>
          )}
          
          {/* Step 3: 계정 정보 */}
          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="사용자명"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  {...register('username')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="비밀번호"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register('password')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="비밀번호 확인"
                  error={!!errors.passwordConfirm}
                  helperText={errors.passwordConfirm?.message}
                  {...register('passwordConfirm')}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox {...register('terms')} />
                  }
                  label="이용약관에 동의합니다"
                />
                {errors.terms && (
                  <Typography color="error" variant="caption" display="block">
                    {errors.terms.message}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
          
          {/* 버튼 영역 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              이전
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained">
                제출
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                다음
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
```

---

## 3. 복잡한 폼 시나리오

### 실습 코드

#### 3.1 동적 필드 관리 (useFieldArray)

```tsx
// React: 동적 폼 필드 관리
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material'

interface Education {
  school: string
  degree: string
  year: number
}

interface Experience {
  company: string
  position: string
  duration: string
  description: string
}

interface FormData {
  personalInfo: {
    name: string
    email: string
  }
  education: Education[]
  experience: Experience[]
  skills: { name: string; level: number }[]
}

function DynamicForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: {
      personalInfo: {
        name: '',
        email: ''
      },
      education: [
        { school: '', degree: '', year: new Date().getFullYear() }
      ],
      experience: [
        { company: '', position: '', duration: '', description: '' }
      ],
      skills: [
        { name: '', level: 1 }
      ]
    }
  })
  
  // useFieldArray로 동적 필드 관리
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
    move: moveEducation
  } = useFieldArray({
    control,
    name: 'education'
  })
  
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience
  } = useFieldArray({
    control,
    name: 'experience'
  })
  
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill
  } = useFieldArray({
    control,
    name: 'skills'
  })
  
  const onSubmit = (data: FormData) => {
    console.log('제출된 데이터:', data)
  }
  
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          이력서 폼 (동적 필드)
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* 개인 정보 섹션 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                개인 정보
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="이름"
                    error={!!errors.personalInfo?.name}
                    helperText={errors.personalInfo?.name?.message}
                    {...register('personalInfo.name', {
                      required: '이름은 필수입니다'
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="이메일"
                    error={!!errors.personalInfo?.email}
                    helperText={errors.personalInfo?.email?.message}
                    {...register('personalInfo.email', {
                      required: '이메일은 필수입니다',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: '올바른 이메일 형식이 아닙니다'
                      }
                    })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* 교육 섹션 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  교육 ({educationFields.length})
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => appendEducation({
                    school: '',
                    degree: '',
                    year: new Date().getFullYear()
                  })}
                >
                  추가
                </Button>
              </Box>
              
              {educationFields.map((field, index) => (
                <Box key={field.id} sx={{ mb: 2 }}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}
                  
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="학교명"
                        error={!!errors.education?.[index]?.school}
                        helperText={errors.education?.[index]?.school?.message}
                        {...register(`education.${index}.school`, {
                          required: '학교명은 필수입니다'
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="학위"
                        {...register(`education.${index}.degree`)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="졸업년도"
                        {...register(`education.${index}.year`, {
                          min: { value: 1950, message: '올바른 년도를 입력하세요' },
                          max: { value: 2030, message: '올바른 년도를 입력하세요' }
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton
                        color="error"
                        onClick={() => removeEducation(index)}
                        disabled={educationFields.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
          
          {/* 경력 섹션 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  경력 ({experienceFields.length})
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => appendExperience({
                    company: '',
                    position: '',
                    duration: '',
                    description: ''
                  })}
                >
                  추가
                </Button>
              </Box>
              
              {experienceFields.map((field, index) => (
                <Box key={field.id} sx={{ mb: 2 }}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="회사명"
                        {...register(`experience.${index}.company`)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="직책"
                        {...register(`experience.${index}.position`)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="기간"
                        placeholder="2020.01 - 2023.12"
                        {...register(`experience.${index}.duration`)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="설명"
                        {...register(`experience.${index}.description`)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton
                        color="error"
                        onClick={() => removeExperience(index)}
                        disabled={experienceFields.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
          
          {/* 스킬 섹션 */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  스킬 ({skillFields.length})
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => appendSkill({ name: '', level: 1 })}
                >
                  추가
                </Button>
              </Box>
              
              {skillFields.map((field, index) => (
                <Grid container spacing={2} key={field.id} sx={{ mb: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="스킬명"
                      {...register(`skills.${index}.name`)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`skills.${index}.level`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>레벨</InputLabel>
                          <Select {...field} label="레벨">
                            <MenuItem value={1}>초급</MenuItem>
                            <MenuItem value={2}>중급</MenuItem>
                            <MenuItem value={3}>고급</MenuItem>
                            <MenuItem value={4}>전문가</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <IconButton
                      color="error"
                      onClick={() => removeSkill(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            제출
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
```

#### 3.2 조건부 필드와 종속성

```tsx
// React: 조건부 필드 관리
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  Collapse,
  Alert,
  Grid,
  Chip
} from '@mui/material'

interface FormData {
  userType: 'individual' | 'company'
  
  // 개인 필드
  firstName?: string
  lastName?: string
  ssn?: string
  
  // 회사 필드
  companyName?: string
  businessNumber?: string
  representative?: string
  
  // 공통 필드
  email: string
  phone: string
  hasAddress: boolean
  
  // 주소 필드 (조건부)
  address?: {
    street: string
    city: string
    zipCode: string
  }
  
  // 배송 옵션
  shippingMethod: 'standard' | 'express' | 'pickup'
  expressDeliveryDate?: string
  pickupLocation?: string
}

function ConditionalForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    setError,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      userType: 'individual',
      hasAddress: false,
      shippingMethod: 'standard'
    }
  })
  
  // 필드 감시
  const userType = watch('userType')
  const hasAddress = watch('hasAddress')
  const shippingMethod = watch('shippingMethod')
  
  // userType 변경시 관련 필드 초기화
  useEffect(() => {
    if (userType === 'individual') {
      setValue('companyName', '')
      setValue('businessNumber', '')
      setValue('representative', '')
      clearErrors(['companyName', 'businessNumber', 'representative'])
    } else {
      setValue('firstName', '')
      setValue('lastName', '')
      setValue('ssn', '')
      clearErrors(['firstName', 'lastName', 'ssn'])
    }
  }, [userType, setValue, clearErrors])
  
  // shippingMethod 변경시 관련 필드 초기화
  useEffect(() => {
    if (shippingMethod !== 'express') {
      setValue('expressDeliveryDate', '')
    }
    if (shippingMethod !== 'pickup') {
      setValue('pickupLocation', '')
    }
  }, [shippingMethod, setValue])
  
  const onSubmit = (data: FormData) => {
    // 추가 검증
    if (data.shippingMethod === 'express' && !data.expressDeliveryDate) {
      setError('expressDeliveryDate', {
        message: '배송 날짜를 선택하세요'
      })
      return
    }
    
    console.log('제출된 데이터:', data)
  }
  
  // 도시 옵션 (동적)
  const getCityOptions = () => {
    const address = getValues('address')
    if (!address?.zipCode) return []
    
    // 우편번호에 따른 도시 목록 (예시)
    if (address.zipCode.startsWith('1')) {
      return ['서울', '경기']
    } else if (address.zipCode.startsWith('2')) {
      return ['인천', '부산']
    }
    return ['기타']
  }
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          조건부 폼 예제
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* 사용자 유형 선택 */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">사용자 유형</FormLabel>
            <Controller
              name="userType"
              control={control}
              rules={{ required: '사용자 유형을 선택하세요' }}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="individual"
                    control={<Radio />}
                    label="개인"
                  />
                  <FormControlLabel
                    value="company"
                    control={<Radio />}
                    label="법인"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          
          {/* 사용자 유형에 따른 조건부 필드 */}
          <Collapse in={userType === 'individual'}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="이름"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  {...register('firstName', {
                    required: userType === 'individual' ? '이름은 필수입니다' : false
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="성"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  {...register('lastName', {
                    required: userType === 'individual' ? '성은 필수입니다' : false
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="주민등록번호"
                  placeholder="######-#######"
                  error={!!errors.ssn}
                  helperText={errors.ssn?.message}
                  {...register('ssn', {
                    pattern: {
                      value: /^\d{6}-\d{7}$/,
                      message: '올바른 주민등록번호 형식이 아닙니다'
                    }
                  })}
                />
              </Grid>
            </Grid>
          </Collapse>
          
          <Collapse in={userType === 'company'}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="회사명"
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                  {...register('companyName', {
                    required: userType === 'company' ? '회사명은 필수입니다' : false
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="사업자등록번호"
                  placeholder="###-##-#####"
                  error={!!errors.businessNumber}
                  helperText={errors.businessNumber?.message}
                  {...register('businessNumber', {
                    required: userType === 'company' ? '사업자등록번호는 필수입니다' : false,
                    pattern: {
                      value: /^\d{3}-\d{2}-\d{5}$/,
                      message: '올바른 사업자등록번호 형식이 아닙니다'
                    }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="대표자명"
                  error={!!errors.representative}
                  helperText={errors.representative?.message}
                  {...register('representative', {
                    required: userType === 'company' ? '대표자명은 필수입니다' : false
                  })}
                />
              </Grid>
            </Grid>
          </Collapse>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 공통 필드 */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="이메일"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: '이메일은 필수입니다',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: '올바른 이메일 형식이 아닙니다'
                  }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="전화번호"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...register('phone', {
                  required: '전화번호는 필수입니다'
                })}
              />
            </Grid>
          </Grid>
          
          {/* 주소 토글 */}
          <FormControlLabel
            control={
              <Switch
                checked={hasAddress}
                {...register('hasAddress')}
              />
            }
            label="주소 입력"
            sx={{ mt: 2 }}
          />
          
          <Collapse in={hasAddress}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="도로명 주소"
                  error={!!errors.address?.street}
                  helperText={errors.address?.street?.message}
                  {...register('address.street', {
                    required: hasAddress ? '주소는 필수입니다' : false
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="우편번호"
                  error={!!errors.address?.zipCode}
                  helperText={errors.address?.zipCode?.message}
                  {...register('address.zipCode', {
                    required: hasAddress ? '우편번호는 필수입니다' : false,
                    pattern: {
                      value: /^\d{5}$/,
                      message: '5자리 숫자를 입력하세요'
                    }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="address.city"
                  control={control}
                  rules={{
                    required: hasAddress ? '도시를 선택하세요' : false
                  }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.address?.city}>
                      <InputLabel>도시</InputLabel>
                      <Select {...field} label="도시">
                        {getCityOptions().map(city => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.address?.city && (
                        <FormHelperText>
                          {errors.address.city.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Collapse>
          
          <Divider sx={{ my: 3 }} />
          
          {/* 배송 방법 */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">배송 방법</FormLabel>
            <Controller
              name="shippingMethod"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="standard"
                    control={<Radio />}
                    label="일반배송"
                  />
                  <FormControlLabel
                    value="express"
                    control={<Radio />}
                    label="특급배송"
                  />
                  <FormControlLabel
                    value="pickup"
                    control={<Radio />}
                    label="직접수령"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          
          {/* 배송 방법에 따른 추가 필드 */}
          <Collapse in={shippingMethod === 'express'}>
            <TextField
              fullWidth
              type="date"
              label="희망 배송일"
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 2 }}
              error={!!errors.expressDeliveryDate}
              helperText={errors.expressDeliveryDate?.message}
              {...register('expressDeliveryDate')}
            />
          </Collapse>
          
          <Collapse in={shippingMethod === 'pickup'}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>수령 지점</InputLabel>
              <Controller
                name="pickupLocation"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="수령 지점">
                    <MenuItem value="gangnam">강남점</MenuItem>
                    <MenuItem value="jongno">종로점</MenuItem>
                    <MenuItem value="bundang">분당점</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Collapse>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 4 }}
          >
            제출
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
```

---

## ⚠️ 흔한 실수와 해결 방법

### 1. register와 Controller 혼동

```tsx
// ❌ Material-UI Select에 register 사용
<Select {...register('category')}>
  <MenuItem value="1">옵션1</MenuItem>
</Select>

// ✅ Controller 사용
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <Select {...field}>
      <MenuItem value="1">옵션1</MenuItem>
    </Select>
  )}
/>
```

### 2. 검증 규칙 오류

```tsx
// ❌ 잘못된 required 규칙
{...register('email', {
  required: true  // 에러 메시지 없음
})}

// ✅ 에러 메시지 포함
{...register('email', {
  required: '이메일은 필수입니다'
})}
```

### 3. 조건부 검증 실수

```tsx
// ❌ 조건부 검증이 작동하지 않음
{...register('field', {
  required: someCondition && '필수입니다'  // false일 때 문제
})}

// ✅ 삼항 연산자 사용
{...register('field', {
  required: someCondition ? '필수입니다' : false
})}
```

### 4. useFieldArray 키 문제

```tsx
// ❌ index를 key로 사용
{fields.map((field, index) => (
  <div key={index}>  {/* 순서 변경시 문제 발생 */}

// ✅ field.id 사용
{fields.map((field, index) => (
  <div key={field.id}>  {/* 안정적인 key */}
```

---

## 🎯 실습 과제

### 📝 과제 1: 회원가입 폼 (난이도: ⭐)

#### 요구사항
- React Hook Form + Yup 사용
- 이메일, 비밀번호, 비밀번호 확인
- 이름, 전화번호, 생년월일
- 약관 동의 (필수/선택)
- 실시간 검증 피드백
- Material-UI 컴포넌트 사용

#### 검증 규칙
- 이메일: 형식 검증, 중복 체크 시뮬레이션
- 비밀번호: 8자 이상, 영문/숫자/특수문자 포함
- 전화번호: 한국 전화번호 형식
- 나이: 14세 이상

---

### 📝 과제 2: 상품 주문 폼 (난이도: ⭐⭐)

#### 요구사항
- 다단계 폼 (3단계)
- 동적 필드 (상품 추가/삭제)
- 조건부 필드 (배송/수령 선택)
- 주문 요약 표시
- 각 단계별 검증

#### 구현할 단계
1. **상품 선택**: 상품 목록, 수량, 옵션
2. **배송 정보**: 주소, 배송 방법, 요청사항
3. **결제 정보**: 결제 수단, 쿠폰, 최종 확인

---

## 📌 Chapter 9 요약

### React Hook Form 핵심 개념

| 기능 | Vue3 | React Hook Form |
|------|------|-----------------|
| 폼 생성 | `reactive()` | `useForm()` |
| 필드 등록 | `v-model` | `register()` |
| 검증 | 수동 또는 VeeValidate | 내장 또는 스키마 |
| 에러 표시 | `errors.field` | `formState.errors.field` |
| 동적 필드 | `v-for` | `useFieldArray` |
| 필드 감시 | `watch()` | `watch()` |
| 조건부 필드 | `v-if` | 조건부 렌더링 + 동적 검증 |

### 스키마 검증 비교

| 특징 | Yup | Zod |
|------|-----|-----|
| TypeScript | 수동 타입 정의 | 자동 타입 추론 |
| 문법 | 체이닝 방식 | 체이닝 + 메서드 |
| 성능 | 보통 | 빠름 |
| 번들 크기 | 크다 | 작다 |
| 에러 메시지 | 내장 | 커스터마이징 필요 |

### 마이그레이션 체크리스트

- [ ] `v-model` → `register()` 또는 `Controller`
- [ ] 수동 검증 → 검증 규칙 객체
- [ ] `@submit.prevent` → `handleSubmit(onSubmit)`
- [ ] `errors.field` → `formState.errors.field`
- [ ] VeeValidate → React Hook Form + Yup/Zod
- [ ] `v-for` 동적 필드 → `useFieldArray`
- [ ] `watch` → React Hook Form의 `watch`
- [ ] 조건부 검증 → 동적 rules

### 성능 최적화 팁

1. **적절한 mode 선택**
```tsx
useForm({
  mode: 'onBlur',     // blur 시점 검증 (성능 우수)
  mode: 'onChange',    // 입력마다 검증
  mode: 'onSubmit',    // 제출 시점 검증
  mode: 'all'         // 모든 이벤트에서 검증
})
```

2. **Controller 최소화**
```tsx
// 네이티브 HTML 요소는 register 사용
<input {...register('name')} />

// MUI 같은 커스텀 컴포넌트만 Controller
<Controller
  control={control}
  name="select"
  render={({ field }) => <Select {...field} />}
/>
```

3. **필요한 값만 watch**
```tsx
// ❌ 전체 폼 watch
const values = watch()

// ✅ 특정 필드만
const email = watch('email')
const [firstName, lastName] = watch(['firstName', 'lastName'])
```

### 복잡한 폼 패턴

#### 1. 폼 데이터 변환
```tsx
// 제출 전 데이터 변환
const onSubmit = (data: FormData) => {
  const transformedData = {
    ...data,
    birthDate: new Date(data.birthDate).toISOString(),
    phone: data.phone.replace(/-/g, ''),
    tags: data.tags.map(tag => tag.value)
  }
  
  api.submit(transformedData)
}
```

#### 2. 비동기 검증
```tsx
register('email', {
  validate: async (value) => {
    const response = await checkEmailDuplicate(value)
    return response.isAvailable || '이미 사용 중인 이메일입니다'
  }
})
```

#### 3. 폼 상태 관리
```tsx
const {
  formState: {
    isDirty,        // 폼이 수정되었는지
    isValid,        // 검증 통과 여부
    isSubmitting,   // 제출 중
    isSubmitted,    // 제출 완료
    submitCount,    // 제출 시도 횟수
    dirtyFields,    // 수정된 필드들
    touchedFields   // 터치된 필드들
  }
} = useForm()
```

### 다음 장 예고
Chapter 10에서는 Spring Boot와의 API 연동을 학습합니다.

---

## 💬 Q&A

**Q1: Vue3의 v-model처럼 양방향 바인딩은 없나요?**
> React Hook Form은 uncontrolled 방식으로 더 나은 성능을 제공합니다. 필요시 Controller로 controlled 컴포넌트를 만들 수 있습니다.

**Q2: VeeValidate와 비교해서 어떤가요?**
> React Hook Form이 더 가볍고 성능이 좋습니다. VeeValidate의 대부분 기능을 제공하면서도 번들 크기가 작습니다.

**Q3: 폼 초기값을 API에서 가져올 때는?**
> `reset()` 함수를 사용하세요:
```tsx
useEffect(() => {
  api.getUser().then(data => {
    reset(data)  // 폼 초기값 설정
  })
}, [reset])
```

**Q4: 파일 업로드는 어떻게 처리하나요?**
> register를 사용하거나 Controller로 처리:
```tsx
<input
  type="file"
  {...register('file', {
    validate: {
      lessThan10MB: (files) => files[0]?.size < 10000000 || '10MB 이하만 가능',
      acceptedFormats: (files) =>
        ['image/jpeg', 'image/png'].includes(files[0]?.type) || '이미지만 가능'
    }
  })}
/>
```

이제 React의 폼 처리와 검증을 마스터했습니다! 🎉
