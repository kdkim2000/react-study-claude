# 📝 회원가입 폼 (Chapter 9-1 실습 과제)

React 초보자를 위한 **완전한 회원가입 폼** 구현 프로젝트입니다. React Hook Form과 Yup 검증 라이브러리를 활용하여 실시간 검증, 이메일 중복 체크, 복잡한 비밀번호 규칙 등 실제 서비스에서 사용되는 모든 기능을 학습할 수 있습니다.

## 🎯 학습 목표

- **React Hook Form**: 성능 최적화된 폼 상태 관리
- **Yup 검증 스키마**: 선언적 데이터 검증 시스템
- **실시간 UI 피드백**: 사용자 친화적 인터랙션 디자인
- **비동기 검증**: API 호출을 통한 중복 체크 구현
- **Material-UI 통합**: 전문적인 디자인 시스템 활용
- **TypeScript**: 타입 안전한 폼 데이터 처리
- **정규표현식**: 복잡한 패턴 매칭과 데이터 검증

## ✨ 주요 기능

### 📋 완전한 입력 필드
- **이메일**: 형식 검증 + 실시간 중복 체크
- **비밀번호**: 8자 이상, 영문/숫자/특수문자 포함 + 보기/숨기기 기능
- **비밀번호 확인**: 실시간 일치 여부 검증
- **이름**: 2-10자, 한글/영문만 허용
- **전화번호**: 한국 휴대폰 형식 + 자동 하이픈 포맷팅
- **생년월일**: DatePicker 사용, 만 14세 이상 제한

### 🔐 고급 검증 시스템
- **실시간 검증**: 타이핑과 동시에 오류 메시지 표시
- **이메일 중복 체크**: 0.8초 디바운스 + 로딩 인디케이터
- **복잡한 비밀번호 규칙**: 정규표현식을 이용한 강력한 패스워드 정책
- **나이 계산 검증**: dayjs를 이용한 정확한 나이 계산
- **약관 동의**: 필수/선택 약관 분리 관리

### 🎨 사용자 경험 최적화
- **시각적 피드백**: 성공/실패 아이콘과 색상 코딩
- **로딩 상태**: 제출 중 버튼 비활성화 + 로딩 스피너
- **성공 페이지**: 가입 완료 후 축하 메시지
- **접근성**: 스크린 리더와 키보드 네비게이션 지원

## 🚀 빠른 시작

### 1. 프로젝트 생성
```bash
# Vite로 React TypeScript 프로젝트 생성
npm create vite@latest signup-form-tutorial -- --template react-swc-ts
cd signup-form-tutorial
```

### 2. 의존성 설치
```bash
# 기본 의존성 설치
npm install

# 폼 관련 패키지
npm install react-hook-form @hookform/resolvers yup

# Material-UI 패키지
npm install @mui/material @emotion/react @emotion/styled @mui/system
npm install @mui/icons-material @mui/x-date-pickers

# 날짜 라이브러리
npm install dayjs
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 회원가입 폼을 체험해보세요!

## 📁 프로젝트 구조

```
signup-form-tutorial/
├── src/
│   ├── types/
│   │   └── form.ts               # 🔤 폼 데이터 타입 정의
│   ├── utils/
│   │   └── validation.ts         # 🛡️ Yup 검증 스키마 (핵심)
│   ├── components/
│   │   └── SignupForm.tsx        # 📝 메인 회원가입 폼 (핵심)
│   ├── App.tsx                   # 🏠 메인 앱 컴포넌트
│   ├── main.tsx                  # 🚪 앱 진입점
│   └── vite-env.d.ts            # 📋 Vite 타입 정의
├── package.json                  # 📦 프로젝트 설정
├── tsconfig.json                # ⚙️ TypeScript 설정
├── vite.config.ts               # ⚡ Vite 설정 (SWC 사용)
├── eslint.config.js             # 📏 느슨한 ESLint 설정
└── README.md                    # 📖 프로젝트 문서
```

## 🔧 핵심 구현 사항

### 1. 폼 데이터 타입 정의 (`src/types/form.ts`)

```typescript
export interface SignupFormData {
  email: string;                    // 이메일 주소
  password: string;                 // 비밀번호
  passwordConfirm: string;          // 비밀번호 확인
  name: string;                     // 사용자 이름
  phone: string;                    // 전화번호
  birthDate: string;                // 생년월일 (YYYY-MM-DD)
  termsRequired: boolean;           // 필수 약관 동의
  termsOptional: boolean;           // 선택 약관 동의
}
```

### 2. Yup 검증 스키마 (`src/utils/validation.ts`)

#### 🎯 핵심 개념: 선언적 검증
```typescript
export const signupSchema = yup.object({
  // 이메일: 형식 + 길이 검증
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .max(50, '이메일은 50자 이하로 입력해주세요'),

  // 비밀번호: 복잡한 정규표현식 규칙
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      '영문, 숫자, 특수문자를 모두 포함해야 합니다'
    ),

  // 비밀번호 확인: 참조를 이용한 일치 검증
  passwordConfirm: yup
    .string()
    .required('비밀번호 확인을 입력해주세요')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),
});
```

#### 📱 전화번호 검증 및 포맷팅
```typescript
// 한국 휴대폰 번호 패턴
phone: yup
  .string()
  .required('전화번호를 입력해주세요')
  .matches(
    /^01(?:0|1|[6-9])-?(?:\d{3}|\d{4})-?\d{4}$/,
    '올바른 휴대폰 번호 형식이 아닙니다'
  ),

// 자동 하이픈 포맷팅 함수
export const formatPhoneNumber = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};
```

#### 📅 나이 검증 (커스텀 테스트)
```typescript
birthDate: yup
  .string()
  .required('생년월일을 입력해주세요')
  .test('age', '만 14세 이상만 가입 가능합니다', function(value) {
    if (!value) return false;
    const today = dayjs();
    const birthDay = dayjs(value);
    const age = today.diff(birthDay, 'year');
    return age >= 14;
  })
```

#### 🔍 이메일 중복 체크 시뮬레이션
```typescript
const existingEmails = ['test@example.com', 'user@test.com', 'admin@site.com'];

export const checkEmailDuplicate = async (email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isDuplicate = existingEmails.includes(email.toLowerCase());
      resolve(isDuplicate);
    }, 800); // 0.8초 지연으로 실제 API 호출 시뮬레이션
  });
};
```

### 3. 메인 폼 컴포넌트 (`src/components/SignupForm.tsx`)

#### 🎛️ React Hook Form 설정
```typescript
const {
  control,          // 입력 필드 제어
  handleSubmit,     // 폼 제출 처리
  formState: { errors, isValid }, // 검증 상태
  watch,           // 필드 값 감시
  setValue,        // 값 직접 설정
  trigger,         // 수동 검증 트리거
} = useForm<SignupFormData>({
  resolver: yupResolver(signupSchema),  // Yup 스키마 연결
  mode: 'onChange',                     // 실시간 검증
  defaultValues: { /* 초기값 설정 */ },
});
```

#### 🔄 실시간 이메일 중복 체크
```typescript
// 이메일 값 감시
const emailValue = watch('email');

// 디바운스된 중복 체크
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
```

#### 👁️ 시각적 피드백 시스템
```typescript
// 이메일 상태에 따른 아이콘 렌더링
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
```

#### 📱 Controller를 이용한 Material-UI 연동
```typescript
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
```

#### 📅 DatePicker 통합
```typescript
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
      maxDate={dayjs().subtract(14, 'year')} // 14세 이상만
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
```

## 🎓 주요 학습 포인트

### 🌟 React Hook Form 심화
```typescript
// 1. 기본 설정과 옵션
const form = useForm({
  resolver: yupResolver(schema),    // 검증 스키마 연결
  mode: 'onChange',                // 검증 타이밍
  reValidateMode: 'onChange',       // 재검증 타이밍
  defaultValues: {},               // 초기값
});

// 2. 실시간 값 감시
const watchedValue = watch('fieldName');
const allValues = watch(); // 모든 필드 감시

// 3. 수동 조작
setValue('fieldName', 'newValue');  // 값 설정
trigger('fieldName');              // 검증 트리거
reset();                          // 폼 초기화
```

### 🛡️ Yup 검증 마스터
```typescript
// 기본 검증 타입들
yup.string()      // 문자열
yup.number()      // 숫자
yup.boolean()     // 불린
yup.date()        // 날짜
yup.array()       // 배열
yup.object()      // 객체

// 검증 체이닝
yup.string()
  .required('필수 항목')           // 필수 검증
  .min(2, '최소 2자')             // 최소 길이
  .max(10, '최대 10자')           // 최대 길이
  .matches(/pattern/, '메시지')    // 정규표현식
  .email('이메일 형식 오류')        // 이메일 검증
  .oneOf([yup.ref('other')], '불일치') // 다른 필드와 비교
  .test('custom', '메시지', func)  // 커스텀 검증
```

### 🎨 Material-UI 폼 컴포넌트
```typescript
// TextField 고급 사용법
<TextField
  error={!!errors.field}           // 에러 상태
  helperText={errors.field?.message} // 도움말 텍스트
  InputProps={{                    // Input 컴포넌트 props
    startAdornment: <Icon />,      // 시작 장식
    endAdornment: <Icon />,        // 끝 장식
  }}
  inputProps={{                    // input 엘리먼트 속성
    maxLength: 50,
  }}
/>

// FormControlLabel로 체크박스
<FormControlLabel
  control={<Checkbox {...field} />}
  label="동의합니다"
/>
```

### ⚡ 성능 최적화 기법
```typescript
// 1. 디바운스로 API 호출 최적화
const debouncedValue = useDebounce(inputValue, 500);

// 2. useCallback으로 함수 메모이제이션
const handleInputChange = useCallback((value: string) => {
  const formatted = formatPhoneNumber(value);
  setValue('phone', formatted);
}, [setValue]);

// 3. React.memo로 컴포넌트 최적화
const FormField = React.memo(({ field, error }) => {
  return <TextField {...field} error={error} />;
});
```

## 🧪 테스트 시나리오

### 🔍 검증 테스트 케이스

#### **이메일 검증**
- ✅ 정상: `user@example.com`
- ❌ 형식 오류: `invalid-email`
- ❌ 중복: `test@example.com`, `user@test.com`, `admin@site.com`

#### **비밀번호 검증**
- ✅ 정상: `Password1!`, `Test123@`
- ❌ 길이 부족: `Test1!` (7자)
- ❌ 영문 없음: `123456!@`
- ❌ 숫자 없음: `Password!`
- ❌ 특수문자 없음: `Password1`

#### **전화번호 검증**
- ✅ 정상: `010-1234-5678`, `01012345678`
- ✅ 자동 포맷팅: `01012345678` → `010-1234-5678`
- ❌ 형식 오류: `02-123-4567`, `010-123-456`

#### **생년월일 검증**
- ✅ 만 14세 이상: `2009-12-31` 이전
- ❌ 만 14세 미만: `2010-01-01` 이후

### 🎯 사용자 시나리오 테스트

1. **정상 가입 플로우**
   - 모든 필드 올바르게 입력
   - 필수 약관 동의 체크
   - 제출 버튼 활성화 확인
   - 2초 후 성공 페이지 표시

2. **실시간 검증 확인**
   - 이메일 입력 중 형식 검증
   - 비밀번호 입력 중 규칙 안내
   - 비밀번호 확인 불일치 표시
   - 전화번호 자동 포맷팅

3. **에러 상황 처리**
   - 중복 이메일 입력 시 오류 표시
   - 필수 약관 미동의 시 제출 불가
   - 만 14세 미만 생년월일 선택 시 오류

## 🎪 실행 결과

### 📱 주요 화면 구성

#### **메인 폼**
- 깔끔한 Material-UI 디자인
- 8개 입력 필드가 세로로 배열
- 각 필드마다 실시간 검증 메시지
- 하단에 약관 동의 체크박스
- 큰 제출 버튼으로 명확한 액션

#### **실시간 피드백**
- 이메일: 체크 중 스피너 → 성공/실패 아이콘
- 비밀번호: 보기/숨기기 토글 버튼
- 전화번호: 타이핑과 동시에 하이픈 자동 추가
- 생년월일: DatePicker로 직관적인 날짜 선택

#### **성공 페이지**
- 큰 체크 아이콘
- "회원가입 완료!" 축하 메시지
- 깔끔한 중앙 정렬 레이아웃

### 🎯 상호작용 시나리오

1. **이메일 중복 체크**: `test@example.com` 입력 → 0.8초 후 빨간 오류 아이콘
2. **비밀번호 규칙**: `password` 입력 → "영문, 숫자, 특수문자 포함" 오류 메시지
3. **전화번호 포맷팅**: `01012345678` 입력 → 자동으로 `010-1234-5678`로 변환
4. **미성년자 체크**: 2011년 생년월일 선택 → "만 14세 이상만 가입 가능" 오류
5. **폼 제출**: 모든 조건 만족 → 2초 로딩 후 성공 페이지

## 🔄 확장 가능한 기능들

이 프로젝트를 기반으로 다음과 같은 고급 기능을 추가해볼 수 있습니다:

### 🚀 고급 검증 기능
- [ ] **비밀번호 강도 시각화**: 프로그래스 바로 강도 표시
- [ ] **실시간 사용자명 중복 체크**: 이메일과 동일한 방식
- [ ] **국가별 전화번호 형식**: 국가 코드에 따른 동적 검증
- [ ] **이메일 도메인 제안**: `@gmai.com` → `@gmail.com` 자동 완성
- [ ] **주소 API 연동**: 우편번호로 주소 자동 입력

### 💾 데이터 관리
- [ ] **임시 저장 기능**: localStorage에 작성 중인 데이터 저장
- [ ] **단계별 가입**: 여러 페이지로 나누어 입력 부담 감소
- [ ] **소셜 로그인 연동**: Google, Facebook, Kakao 로그인
- [ ] **이메일 인증**: 가입 후 이메일 확인 링크 발송
- [ ] **SMS 인증**: 휴대폰 번호 본인 확인

### 🎨 사용자 경험
- [ ] **프로그레스 표시**: 폼 완성도 시각화
- [ ] **툴팁 도움말**: 각 필드별 상세 가이드
- [ ] **키보드 단축키**: Enter로 다음 필드 이동
- [ ] **오토포커스**: 페이지 로드 시 첫 번째 필드에 포커스
- [ ] **반응형 디자인**: 모바일 최적화 레이아웃

### 🔐 보안 강화
- [ ] **CAPTCHA 연동**: 봇 방지 시스템
- [ ] **비밀번호 유출 체크**: HaveIBeenPwned API 연동
- [ ] **IP 기반 제한**: 같은 IP에서 과도한 가입 시도 방지
- [ ] **Two-Factor Authentication**: 2단계 인증 설정
- [ ] **개인정보 암호화**: 민감 정보 클라이언트 암호화

## 🛠️ 기술 스택

- **⚛️ React 18**: 함수형 컴포넌트와 Hooks
- **🔷 TypeScript**: 타입 안전한 개발 환경
- **📝 React Hook Form**: 고성능 폼 상태 관리
- **🛡️ Yup**: 선언적 데이터 검증 스키마
- **🎨 Material-UI**: 구글의 Material Design 시스템
- **📅 dayjs**: 가벼운 날짜 처리 라이브러리
- **⚡ Vite**: 빠른 개발 서버와 빌드 도구
- **🚀 SWC**: 고성능 JavaScript/TypeScript 컴파일러

## 🤝 학습 도움말

### 🆘 자주 발생하는 문제들

1. **Controller vs register 사용**
   ```typescript
   // ❌ Material-UI와 register 직접 사용 (작동하지 않음)
   <TextField {...register('email')} />
   
   // ✅ Controller 컴포넌트 사용 (올바른 방법)
   <Controller
     name="email"
     control={control}
     render={({ field }) => <TextField {...field} />}
   />
   ```

2. **Yup 스키마 타입 오류**
   ```typescript
   // ❌ 타입 불일치
   const schema = yup.object({
     age: yup.string().required(), // 숫자를 문자열로 검증
   });
   
   // ✅ 올바른 타입
   const schema = yup.object({
     age: yup.number().required().positive().integer(),
   });
   ```

3. **DatePicker 값 처리**
   ```typescript
   // dayjs 객체 ↔ 문자열 변환 주의
   value={field.value ? dayjs(field.value) : null}
   onChange={(date) => field.onChange(date?.format('YYYY-MM-DD') || '')}
   ```

4. **비동기 검증 타이밍**
   ```typescript
   // 디바운스 없이 즉시 API 호출 (성능 문제)
   useEffect(() => {
     checkEmailDuplicate(email);
   }, [email]);
   
   // 디바운스 적용 (올바른 방법)
   useEffect(() => {
     const timeoutId = setTimeout(() => {
       checkEmailDuplicate(email);
     }, 500);
     return () => clearTimeout(timeoutId);
   }, [email]);
   ```

### 📚 추가 학습 자료

- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [Yup 검증 스키마 가이드](https://github.com/jquense/yup)
- [Material-UI 폼 컴포넌트](https://mui.com/material-ui/react-text-field/)
- [JavaScript 정규표현식](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions)
- [dayjs 날짜 라이브러리](https://day.js.org/docs/en/installation/installation)

## 📄 라이선스

이 프로젝트는 교육 목적으로 만들어졌으며 MIT 라이선스를 따릅니다.

---

**Happy Coding! 📝**

*React Hook Form과 Yup을 마스터하여 전문적이고 사용자 친화적인 폼을 구현해보세요!*