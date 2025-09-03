# 📝 React 폼 유효성 검사 Hook 실습 프로젝트

React 초보자를 위한 Custom Hook 고급 학습 프로젝트입니다. `useForm` Hook을 직접 만들어보면서 폼 상태 관리, 실시간 유효성 검사, 그리고 사용자 경험을 향상시키는 방법을 학습할 수 있습니다.

## 🎯 학습 목표

- **Custom Hook 고급 활용**: 복잡한 상태 관리를 Hook으로 캡슐화하기
- **실시간 유효성 검사**: 사용자 입력에 따른 즉시 피드백 제공
- **Touched 상태 관리**: 사용자가 필드를 건드린 후에만 에러 표시
- **커스텀 유효성 검사**: 비밀번호 확인 등 필드 간 비교 검사
- **TypeScript 제네릭**: 타입 안전한 폼 Hook 구현
- **Material-UI 통합**: 전문적인 UI 컴포넌트와의 연동

## 🚀 실행 방법

### 1. 프로젝트 생성 및 설치
```bash
# Vite로 프로젝트 생성
npm create vite@latest form-validation-practice -- --template react-swc-ts
cd form-validation-practice

# 의존성 설치
npm install

# Material-UI 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 결과를 확인할 수 있습니다.

### 3. 기타 명령어
```bash
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npm run preview  # 빌드 결과 미리보기
```

## 📁 프로젝트 구조

```
form-validation-practice/
├── src/
│   ├── hooks/
│   │   └── useForm.ts              # 📋 폼 Hook (핵심 파일)
│   ├── utils/
│   │   └── validationRules.ts      # 🔍 유효성 검사 규칙들
│   ├── App.tsx                     # 🏠 메인 컴포넌트 (회원가입 폼)
│   ├── main.tsx                    # 🔧 앱 진입점 및 테마 설정
│   └── vite-env.d.ts              # 📋 Vite 타입 정의
├── package.json                    # 📦 프로젝트 설정 및 의존성
├── tsconfig.json                   # ⚙️ TypeScript 설정
├── vite.config.ts                  # ⚡ Vite 빌드 도구 설정
├── eslint.config.js                # 📏 코드 품질 검사 설정
└── index.html                      # 🌐 HTML 진입점
```

## 🔧 핵심 구현 사항

### 1. useForm Hook (`src/hooks/useForm.ts`)

폼의 모든 상태와 로직을 관리하는 커스텀 Hook입니다.

#### 🎛️ Hook 인터페이스
```typescript
interface UseFormReturn<T> {
  // 상태
  values: T;                    // 폼 입력값들
  errors: Partial<Record<keyof T, string>>;  // 에러 메시지들
  touched: Partial<Record<keyof T, boolean>>; // 터치된 필드들
  isValid: boolean;             // 전체 폼 유효성
  isSubmitting: boolean;        // 제출 진행 상태

  // 핸들러 함수들
  handleChange: (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (event: React.FormEvent) => Promise<void>;
  
  // 유틸리티 함수들
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string | null) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => string | null;
  validateAllFields: () => boolean;
}
```

#### 🔑 핵심 기능
- ✅ **실시간 유효성 검사**: `handleBlur` 시점에 필드별 검사 실행
- ✅ **Touched 상태 관리**: 사용자가 필드를 건드린 후에만 에러 표시
- ✅ **자동 재검사**: `useEffect`로 values 변경시 touched 필드들 재검사
- ✅ **비동기 제출 처리**: 로딩 상태 관리와 에러 핸들링
- ✅ **제네릭 타입 지원**: 타입 안전한 폼 데이터 처리

### 2. 유효성 검사 규칙 (`src/utils/validationRules.ts`)

재사용 가능한 유효성 검사 함수들을 제공합니다.

#### 📋 내장 규칙들
```typescript
const validationRules = {
  required: (value: any) => string | null;           // 필수 입력
  email: (value: string) => string | null;           // 이메일 형식
  minLength: (min: number) => ValidationFunction;    // 최소 길이
  maxLength: (max: number) => ValidationFunction;    // 최대 길이
  strongPassword: (value: string) => string | null;  // 강력한 비밀번호
  confirmPassword: (password: string) => ValidationFunction; // 비밀번호 확인
  phoneNumber: (value: string) => string | null;     // 전화번호 형식
  numbersOnly: (value: string) => string | null;     // 숫자만 허용
};
```

#### 🔗 규칙 조합 기능
```typescript
// 여러 규칙을 조합하여 사용
const nameValidation = combineValidations(
  validationRules.required,
  validationRules.minLength(2),
  validationRules.maxLength(20)
);
```

#### 🎯 커스텀 검사 지원
```typescript
// 다른 필드와 비교하는 커스텀 검사
confirmPassword: {
  validations: [
    validationRules.required,
    (value: string, allValues?: RegisterFormData) => {
      return validationRules.confirmPassword(allValues?.password || '')(value);
    },
  ],
}
```

### 3. 폼 설정 시스템

각 필드별로 초기값과 유효성 검사 규칙을 설정할 수 있습니다.

```typescript
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
  // ... 다른 필드들
};
```

## 💡 고급 학습 포인트

### 🔄 실시간 유효성 검사 플로우

1. **사용자 입력** → `handleChange` 호출 → `values` 상태 업데이트
2. **필드 블러** → `handleBlur` 호출 → `touched` 상태 업데이트 + 해당 필드 유효성 검사
3. **values 변경** → `useEffect` 트리거 → 모든 touched 필드들 재검사
4. **폼 제출** → 모든 필드 touched로 설정 + 전체 유효성 검사

### 🎭 사용자 경험 최적화

- **점진적 에러 표시**: 사용자가 필드를 건드린 후에만 에러 메시지 표시
- **실시간 피드백**: 다른 필드 입력시 관련 필드 자동 재검사 (비밀번호 확인 등)
- **로딩 상태 관리**: 제출 중 버튼 비활성화 및 로딩 표시
- **성공 피드백**: 제출 완료 후 성공 메시지와 자동 초기화

### 🛠️ Material-UI 통합 패턴

```typescript
// 필드별 props를 쉽게 생성하는 헬퍼 함수
const getFieldProps = (fieldName: keyof RegisterFormData) => ({
  value: values[fieldName],
  onChange: handleChange(fieldName),
  onBlur: handleBlur(fieldName),
  error: !!(touched[fieldName] && errors[fieldName]),
  helperText: touched[fieldName] && errors[fieldName] ? errors[fieldName] : '',
});

// 사용법
<TextField
  fullWidth
  label="이메일"
  type="email"
  {...getFieldProps('email')}
/>
```

## 🎨 실행 결과

프로젝트를 실행하면 다음과 같은 회원가입 폼을 확인할 수 있습니다:

### 📋 폼 필드들
- **이름**: 2-20자 길이 제한
- **이메일**: 이메일 형식 검사
- **비밀번호**: 강력한 비밀번호 정책 (대소문자, 숫자, 특수문자 포함 8자 이상)
- **비밀번호 확인**: 비밀번호와 일치 여부 검사
- **전화번호**: 한국 휴대폰 번호 형식
- **나이**: 1-120 범위의 숫자

### 🔍 실시간 기능들
- **즉시 유효성 검사**: 필드를 벗어날 때마다 실행
- **관련 필드 재검사**: 비밀번호 변경시 확인 필드 자동 재검사
- **폼 상태 표시**: 실시간으로 전체 폼 유효성 및 터치된 필드 수 표시
- **디버깅 정보**: 개발자를 위한 실시간 상태 정보

## 🔄 확장 가능한 기능들

이 프로젝트를 기반으로 다음과 같은 기능들을 추가로 구현해볼 수 있습니다:

- [ ] **비동기 유효성 검사**: 이메일 중복 확인, 사용자명 중복 확인
- [ ] **조건부 필드**: 다른 필드 값에 따라 보이거나 숨겨지는 필드
- [ ] **다단계 폼**: 여러 단계로 나누어진 긴 폼 처리
- [ ] **파일 업로드**: 이미지 업로드와 유효성 검사
- [ ] **동적 필드**: 사용자가 필드를 추가/삭제할 수 있는 동적 폼
- [ ] **폼 저장/복원**: localStorage를 활용한 임시 저장 기능
- [ ] **접근성 개선**: 스크린 리더 지원, 키보드 네비게이션
- [ ] **국제화**: 다국어 에러 메시지 지원

## 🔧 문제 해결 가이드

### 자주 발생하는 이슈들

1. **에러가 즉시 표시되는 문제**
   ```typescript
   // ❌ 잘못된 방법
   error={!!errors[fieldName]}
   
   // ✅ 올바른 방법
   error={!!(touched[fieldName] && errors[fieldName])}
   ```

2. **비밀번호 확인이 작동하지 않는 문제**
   ```typescript
   // 커스텀 검사에서 allValues 매개변수 활용
   (value: string, allValues?: RegisterFormData) => {
     return validationRules.confirmPassword(allValues?.password || '')(value);
   }
   ```

3. **TypeScript 에러**
   ```typescript
   // 제네릭 타입을 명시적으로 지정
   const form = useForm<RegisterFormData>(formConfig);
   ```

## 📚 참고 자료

- [React Hooks 공식 문서](https://ko.react.dev/reference/react)
- [Material-UI TextField API](https://mui.com/material-ui/react-text-field/)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [폼 유효성 검사 모범 사례](https://web.dev/sign-up-form-best-practices/)
- [접근성 가이드라인](https://www.w3.org/WAI/WCAG21/Understanding/)

## 🤝 기여하기

이 프로젝트는 교육 목적으로 만들어졌습니다. 다음과 같은 기여를 환영합니다:

- 🐛 버그 리포트 및 수정
- 📖 문서 개선
- ✨ 새로운 유효성 검사 규칙 추가
- 🎨 UI/UX 개선
- 🧪 테스트 코드 추가

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**Happy Coding! 🚀**

*폼 유효성 검사를 마스터하여 사용자 친화적인 웹 애플리케이션을 만들어보세요!*

## 💭 학습 후 다음 단계

이 프로젝트를 완료한 후에는 다음과 같은 고급 주제들을 학습해보세요:

1. **React Hook Form**: 업계 표준 폼 라이브러리 학습
2. **Formik + Yup**: 또 다른 인기 폼 관리 솔루션
3. **React Testing Library**: 폼 컴포넌트 테스트 작성
4. **Zod**: 타입 안전한 스키마 검증 라이브러리
5. **React Query**: API 연동 및 서버 상태 관리