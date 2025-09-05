# 🌍 React 다국어 지원 시스템 (Internationalization)

React 초보자를 위한 Context API 활용 국제화(i18n) 실습 프로젝트입니다. Context API를 사용하여 전역 상태 관리를 통한 다국어 전환 시스템을 구현하고, localStorage를 통해 사용자 설정을 유지하는 방법을 학습할 수 있습니다.

## 🎯 학습 목표

- **Context API 마스터**: 전역 상태 관리의 핵심 개념 이해
- **Custom Hook 설계**: 재사용 가능한 Hook 패턴 학습
- **다국어 시스템 구현**: 실무에서 사용하는 i18n 패턴 익히기
- **localStorage 활용**: 브라우저 저장소를 통한 설정 유지
- **TypeScript 고급 활용**: 타입 안전한 다국어 시스템 구현
- **사용자 경험(UX) 최적화**: 자연스러운 언어 전환 경험 제공

## 🚀 실행 방법

### 1. 프로젝트 생성 및 설치
```bash
# Vite로 프로젝트 생성
npm create vite@latest i18n-practice -- --template react-swc-ts
cd i18n-practice

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
i18n-practice/
├── src/
│   ├── types/
│   │   └── language.ts             # 🔤 언어 관련 타입 정의
│   ├── data/
│   │   └── translations.ts         # 📚 한국어/영어 번역 데이터
│   ├── contexts/
│   │   └── LanguageContext.tsx     # 🌐 언어 Context 및 Hook (핵심)
│   ├── components/
│   │   ├── LanguageSwitcher.tsx    # 🔄 언어 전환 컴포넌트
│   │   ├── Header.tsx              # 📋 헤더 컴포넌트
│   │   ├── MainContent.tsx         # 📝 메인 컨텐츠 컴포넌트
│   │   └── Footer.tsx              # 👟 푸터 컴포넌트
│   ├── App.tsx                     # 🏠 메인 애플리케이션
│   ├── main.tsx                    # 🔧 앱 진입점 및 테마 설정
│   └── vite-env.d.ts              # 📋 Vite 타입 정의
├── package.json                    # 📦 프로젝트 설정 및 의존성
├── tsconfig.json                   # ⚙️ TypeScript 설정
├── vite.config.ts                  # ⚡ Vite 빌드 도구 설정
├── eslint.config.js                # 📏 코드 품질 검사 설정
└── index.html                      # 🌐 HTML 진입점
```

## 🔧 핵심 구현 사항

### 1. Context API 설계 (`src/contexts/LanguageContext.tsx`)

#### 🎛️ Context 구조
```typescript
interface LanguageContextType {
  currentLanguage: Language;           // 현재 선택된 언어
  translations: Translations;          // 현재 언어의 번역 객체
  changeLanguage: (language: Language) => void;  // 언어 변경 함수
  supportedLanguages: Language[];      // 지원하는 언어 목록
}
```

#### 🔑 핵심 Hook들
```typescript
// 기본 언어 Context Hook
export const useLanguage = (): LanguageContextType => {
  // Context 안전성 검사 포함
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 번역 전용 편의 Hook
export const useTranslation = () => {
  const { translations } = useLanguage();
  
  // 점(.) 표기법으로 중첩된 번역 키에 접근
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations;
    // 키 경로를 따라 번역 텍스트 찾기
    // 예: t('common.title') → translations.common.title
  };
  
  return { t, translations };
};
```

### 2. 번역 데이터 구조 (`src/data/translations.ts`)

#### 📊 타입 안전한 번역 구조
```typescript
export interface Translations {
  common: {
    title: string;
    subtitle: string;
    // ...
  };
  header: {
    welcome: string;
    description: string;
  };
  main: {
    aboutTitle: string;
    features: {
      contextApi: string;
      localStorage: string;
      // ...
    };
  };
  // ...
}
```

#### 🌐 다국어 데이터
```typescript
export const translations: Record<Language, Translations> = {
  ko: koTranslations,    // 한국어 번역
  en: enTranslations,    // 영어 번역
};
```

### 3. localStorage 통합

#### 💾 설정 저장 및 복원
```typescript
const getInitialLanguage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    return SUPPORTED_LANGUAGES.includes(savedLanguage) 
      ? savedLanguage 
      : DEFAULT_LANGUAGE;
  } catch (error) {
    // 에러 처리로 안정성 확보
    return DEFAULT_LANGUAGE;
  }
};
```

#### 🌍 브라우저 언어 자동 감지
```typescript
useEffect(() => {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (!savedLanguage) {
    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('ko')) {
      changeLanguage('ko');
    } else if (browserLanguage.startsWith('en')) {
      changeLanguage('en');
    }
  }
}, []);
```

### 4. 컴포넌트별 다국어 적용

#### 🔄 언어 전환 컴포넌트 (`LanguageSwitcher.tsx`)
- Material-UI Select 컴포넌트 활용
- 현재 언어 표시 및 전환 기능
- 아이콘과 함께 직관적인 UI

#### 📋 헤더 컴포넌트 (`Header.tsx`)
- 그라데이션 배경의 매력적인 헤더
- 환영 메시지와 프로젝트 설명
- 반응형 타이포그래피

#### 📝 메인 컨텐츠 (`MainContent.tsx`)
- Grid 레이아웃으로 정보 구성
- 프로젝트 소개와 주요 기능 설명
- 아이콘과 함께하는 기능 목록

#### 👟 푸터 컴포넌트 (`Footer.tsx`)
- 저작권 정보와 기술 스택 표시
- 현재 년도 자동 계산

## 💡 고급 학습 포인트

### 🔄 Context API vs Props Drilling

**❌ Props Drilling (피해야 할 패턴)**
```typescript
// 모든 컴포넌트를 거쳐서 props 전달
App → Header → Navigation → LanguageButton
```

**✅ Context API (권장 패턴)**
```typescript
// 필요한 곳에서 직접 Context 사용
const { currentLanguage, changeLanguage } = useLanguage();
```

### 🛠️ Custom Hook 설계 패턴

#### 1. 안전성 검사 포함
```typescript
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

#### 2. 편의성을 위한 추상화
```typescript
export const useTranslation = () => {
  const { translations } = useLanguage();
  
  const t = (key: string): string => {
    // 복잡한 키 파싱 로직을 숨김
    // 사용자는 단순히 t('common.title')만 호출하면 됨
  };
  
  return { t, translations };
};
```

### 🎨 사용자 경험 최적화

#### 1. Floating Action Button
- 화면 우하단 고정 위치
- 언어 전환 아이콘으로 직관성
- 클릭 시 언어 전환기 토글

#### 2. 매끄러운 전환 효과
- 언어 변경 시 즉시 UI 업데이트
- localStorage 자동 저장
- 페이지 새로고침 없이 상태 유지

#### 3. 접근성 고려
- 적절한 aria-label 설정
- 키보드 네비게이션 지원
- 시각적 피드백 제공

## 🎨 실행 결과

프로젝트를 실행하면 다음과 같은 기능을 확인할 수 있습니다:

### 📱 주요 기능들
- **실시간 언어 전환**: 한국어 ↔ 영어 즉시 전환
- **설정 영구 저장**: 다음 방문 시에도 언어 설정 유지
- **브라우저 언어 감지**: 초기 방문자의 브라우저 언어 자동 설정
- **다중 컴포넌트 지원**: Header, MainContent, Footer에서 모두 다국어 지원
- **타입 안전성**: TypeScript로 번역 키 오타 방지

### 🎯 UI/UX 특징
- **그라데이션 헤더**: 시각적 매력도 향상
- **반응형 레이아웃**: 모바일부터 데스크톱까지 대응
- **Material Design**: 일관된 디자인 시스템
- **부드러운 애니메이션**: 자연스러운 전환 효과

## 🔄 확장 가능한 기능들

이 프로젝트를 기반으로 다음과 같은 기능들을 추가로 구현해볼 수 있습니다:

- [ ] **더 많은 언어 지원**: 일본어, 중국어, 스페인어 등
- [ ] **네임스페이스 분리**: 페이지별, 기능별 번역 파일 분리
- [ ] **동적 번역 로딩**: 필요한 언어만 비동기 로딩
- [ ] **번역 검증 도구**: 누락된 번역 키 자동 감지
- [ ] **복수형 처리**: 수량에 따른 복수형 번역 지원
- [ ] **날짜/시간 지역화**: 각 언어권의 날짜 형식 적용
- [ ] **RTL 언어 지원**: 아랍어, 히브리어 등 우→좌 언어
- [ ] **번역 관리 시스템**: 비개발자도 번역을 수정할 수 있는 CMS

## 🔧 문제 해결 가이드

### 자주 발생하는 이슈들

1. **Context Provider 누락 에러**
   ```typescript
   // ❌ 에러: useLanguage must be used within a LanguageProvider
   
   // ✅ 해결: App을 LanguageProvider로 감싸기
   <LanguageProvider>
     <App />
   </LanguageProvider>
   ```

2. **번역 키를 찾을 수 없는 문제**
   ```typescript
   // ❌ 잘못된 키 경로
   t('header.welcomeMessage')  // 존재하지 않는 키
   
   // ✅ 올바른 키 경로
   t('header.welcome')  // translations.header.welcome
   ```

3. **localStorage 에러 처리**
   ```typescript
   // 시크릿 모드나 저장소 제한 환경에서의 에러 처리
   try {
     localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
   } catch (error) {
     console.warn('언어 설정을 저장할 수 없습니다:', error);
     // 애플리케이션 동작은 계속됨
   }
   ```

4. **TypeScript 타입 에러**
   ```typescript
   // ❌ 타입 불일치
   const lang: string = 'korean';  // Language 타입이 아님
   
   // ✅ 정확한 타입 사용
   const lang: Language = 'ko';  // 타입 안전성 확보
   ```

## 📚 참고 자료

### 📖 공식 문서
- [React Context API](https://ko.react.dev/reference/react/createContext)
- [React Custom Hooks](https://ko.react.dev/learn/reusing-logic-with-custom-hooks)
- [Material-UI Components](https://mui.com/material-ui/getting-started/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### 🌍 국제화 관련
- [React i18next](https://react.i18next.com/) - 업계 표준 i18n 라이브러리
- [FormatJS](https://formatjs.io/) - 국제화 유틸리티 모음
- [Mozilla i18n Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

### 🎨 디자인 시스템
- [Material Design Guidelines](https://material.io/design)
- [웹 접근성 가이드](https://www.w3.org/WAI/WCAG21/Understanding/)

## 🤝 기여하기

이 프로젝트는 교육 목적으로 만들어졌습니다. 다음과 같은 기여를 환영합니다:

- 🐛 **버그 리포트**: 발견한 문제점 보고
- 📖 **문서 개선**: README나 코드 주석 향상
- 🌍 **새 언어 추가**: 다른 언어 번역 데이터 기여
- ✨ **기능 개선**: 새로운 기능이나 최적화 제안
- 🧪 **테스트 코드**: 단위 테스트나 E2E 테스트 추가

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**Happy Coding! 🌍**

*Context API와 다국어 지원을 마스터하여 글로벌한 웹 애플리케이션을 만들어보세요!*

## 💭 학습 후 다음 단계

이 프로젝트를 완료한 후에는 다음과 같은 고급 주제들을 학습해보세요:

### 🚀 실무 레벨 국제화
1. **react-i18next**: 업계 표준 i18n 라이브러리 학습
2. **번역 관리**: Crowdin, Lokalise 같은 번역 플랫폼 활용
3. **SEO 최적화**: 다국어 사이트의 검색엔진 최적화
4. **성능 최적화**: Code splitting과 lazy loading 적용

### 🎯 Context API 고급 패턴
1. **여러 Context 조합**: 언어, 테마, 사용자 인증 Context 통합
2. **Context 최적화**: useMemo와 useCallback로 불필요한 리렌더링 방지
3. **미들웨어 패턴**: Context에 로깅, 디버깅 기능 추가

### 🔧 상태 관리 발전
1. **Redux Toolkit**: 복잡한 전역 상태 관리
2. **Zustand**: 경량 상태 관리 라이브러리
3. **Jotai**: Atomic 상태 관리 접근법