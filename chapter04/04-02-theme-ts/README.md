# React 테마 설정 시스템 (Chapter 4 - 실습 과제 2)

React 초보자를 위한 교육용 프로젝트로, Context API를 활용한 전역 테마 관리 시스템을 구현합니다.

## 📋 프로젝트 개요

이 프로젝트는 React Context API를 학습하기 위한 실습 과제로, 라이트/다크 모드 전환이 가능한 테마 설정 시스템을 구현합니다.

### 🎯 학습 목표
- React Context API 이해 및 활용
- useState와 useEffect Hooks 활용
- localStorage를 통한 상태 지속성
- Material-UI 테마 시스템 적용
- TypeScript 기본 문법 학습

## ⚡ 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구 (@vitejs/plugin-react-swc)
- **Material-UI (MUI)** - UI 컴포넌트 및 스타일링
- **ESLint** - 코드 품질 관리 (느슨한 설정)

## 🚀 시작하기

### 설치 방법

1. 프로젝트 클론 및 의존성 설치
```bash
npm install
# 또는
yarn install
```

2. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

3. 브라우저에서 `http://localhost:5173` 접속

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── Header.tsx       # 헤더 컴포넌트 (테마 전환 버튼 포함)
│   ├── MainContent.tsx  # 메인 콘텐츠 컴포넌트
│   └── Footer.tsx       # 푸터 컴포넌트
├── contexts/            # Context 관련 파일
│   └── ThemeContext.tsx # 테마 Context 정의 및 Provider
├── types/               # TypeScript 타입 정의
│   └── theme.ts        # 테마 관련 타입
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx           # 엔트리 포인트
```

## 🎨 주요 기능

### 1. 테마 전역 관리
- Context API를 사용한 전역 테마 상태 관리
- 라이트 모드와 다크 모드 지원

### 2. 테마 지속성
- localStorage를 활용한 테마 설정 자동 저장
- 브라우저 재시작 시에도 설정 유지

### 3. Material-UI 테마 적용
- MUI의 `createTheme`을 사용한 커스텀 테마 생성
- `ThemeProvider`를 통한 전역 테마 적용

### 4. 반응형 컴포넌트
- Header, MainContent, Footer 컴포넌트에서 테마 활용
- 테마 변경 시 실시간 UI 업데이트

## 🔧 핵심 구현 사항

### Context 생성 및 활용
```typescript
// ThemeContext.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### localStorage 동기화
```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setThemeMode(savedTheme as 'light' | 'dark');
  }
}, []);

useEffect(() => {
  localStorage.setItem('theme', themeMode);
}, [themeMode]);
```

### Material-UI 테마 적용
```typescript
const muiTheme = createTheme({
  palette: {
    mode: themeMode,
    // 추가 팔레트 설정...
  },
});
```

## 📚 학습 포인트

### Context API 패턴
- `createContext`로 Context 생성
- `useContext`로 Context 값 사용
- Provider 패턴을 통한 상태 공유

### React Hooks 활용
- `useState`로 테마 상태 관리
- `useEffect`로 부수 효과 처리
- 커스텀 Hook(`useTheme`) 생성

### TypeScript 적용
- 인터페이스를 통한 타입 정의
- Props 타입 지정
- Context 타입 안전성 확보

## 🎯 실습 확장 아이디어

1. **색상 커스터마이징**: 사용자 정의 색상 선택 기능
2. **폰트 크기 조절**: 접근성을 위한 폰트 크기 설정
3. **애니메이션 효과**: 테마 전환 시 부드러운 전환 효과
4. **다국어 지원**: 테마와 함께 언어 설정 기능

## 📖 참고 자료

- [React Context API 공식 문서](https://react.dev/reference/react/createContext)
- [Material-UI 테마 가이드](https://mui.com/material-ui/customization/theming/)
- [TypeScript React 가이드](https://react-typescript-cheatsheet.netlify.app/)

## 🤝 기여하기

이 프로젝트는 교육 목적으로 제작되었습니다. 개선 사항이나 버그를 발견하시면 Issue를 등록해 주세요.

## 📄 라이선스

MIT License - 자유롭게 학습 및 수정 가능합니다.