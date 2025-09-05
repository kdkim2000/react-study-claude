# 🎨 테마 관리 시스템 (Chapter 8-2 실습 과제)

React 초보자를 위한 **커스텀 테마 관리 시스템** 구현 프로젝트입니다. Material-UI의 테마 시스템과 React Context API를 활용하여 라이트/다크 모드, 색상 커스터마이징, 폰트 크기 조절 등의 기능을 실습할 수 있습니다.

## 🎯 학습 목표

- **React Context API**: 전역 상태 관리와 Provider 패턴 이해
- **Material-UI 테마 시스템**: createTheme과 ThemeProvider 활용법
- **브라우저 저장소**: localStorage를 이용한 설정 저장/복원
- **TypeScript**: 인터페이스와 타입 정의를 통한 타입 안전성
- **실시간 UI 업데이트**: 설정 변경에 따른 즉각적인 시각적 피드백
- **사용자 경험**: 직관적인 설정 패널과 미리보기 시스템

## ✨ 주요 기능

### 🌓 라이트/다크 모드 전환
- Switch 컴포넌트로 간편한 모드 변경
- 아이콘으로 현재 상태 시각적 표시
- 전체 앱 테마 실시간 반영

### 🎨 색상 커스터마이징
- **Primary 색상**: 주요 버튼과 강조 요소
- **Secondary 색상**: 보조 버튼과 액센트
- 18가지 미리 정의된 색상 팔레트
- HTML5 color picker로 무제한 색상 선택

### 📝 폰트 크기 조절
- **작게/보통/크게**: 3단계 크기 조절
- Slider UI로 직관적인 크기 선택
- 모든 Typography 컴포넌트 실시간 적용

### 💾 설정 저장 및 복원
- localStorage 자동 저장
- 브라우저 재시작 후에도 설정 유지
- 안전한 에러 처리

### 🔄 테마 Import/Export
- JSON 형태로 테마 설정 내보내기
- 클립보드 자동 복사 기능
- 다른 사용자와 테마 설정 공유
- 유효성 검사로 안전한 가져오기

## 🚀 빠른 시작

### 1. 프로젝트 생성
```bash
# Vite로 React TypeScript 프로젝트 생성
npm create vite@latest theme-manager-tutorial -- --template react-swc-ts
cd theme-manager-tutorial
```

### 2. 의존성 설치
```bash
# 기본 의존성 설치
npm install

# Material-UI 패키지 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 테마 관리 시스템을 체험해보세요!

## 📁 프로젝트 구조

```
theme-manager-tutorial/
├── src/
│   ├── types/
│   │   └── theme.ts              # 🔤 테마 관련 타입 정의
│   ├── context/
│   │   └── ThemeContext.tsx      # 🌐 테마 상태 관리 (핵심)
│   ├── components/
│   │   ├── ThemePanel.tsx        # 🎛️ 테마 설정 패널 (핵심)
│   │   ├── ColorPicker.tsx       # 🎨 색상 선택기
│   │   └── PreviewContent.tsx    # 👁️ 실시간 미리보기
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

### 1. 테마 타입 정의 (`src/types/theme.ts`)

```typescript
export interface ThemeSettings {
  mode: 'light' | 'dark';           // 라이트/다크 모드
  primaryColor: string;             // 주 색상 (#1976d2)
  secondaryColor: string;           // 보조 색상 (#dc004e)
  fontSize: 'small' | 'medium' | 'large'; // 폰트 크기
}

export const defaultThemeSettings: ThemeSettings = {
  mode: 'light',
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  fontSize: 'medium',
};
```

### 2. 테마 컨텍스트 (`src/context/ThemeContext.tsx`)

#### 🎯 핵심 개념: React Context API
```typescript
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

#### 💾 localStorage 연동
```typescript
// 설정 저장
const saveThemeToStorage = (settings: ThemeSettings) => {
  try {
    localStorage.setItem('theme-settings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

// 설정 복원
const loadThemeFromStorage = (): ThemeSettings => {
  try {
    const stored = localStorage.getItem('theme-settings');
    if (stored) {
      return { ...defaultThemeSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return defaultThemeSettings;
};
```

#### 🎨 Material-UI 테마 생성
```typescript
const muiTheme = createTheme({
  palette: {
    mode: settings.mode,
    primary: { main: settings.primaryColor },
    secondary: { main: settings.secondaryColor },
  },
  typography: {
    fontSize: 14 * fontSizeMap[settings.fontSize],
    body1: { fontSize: `${fontSizeMap[settings.fontSize]}rem` },
  },
});
```

### 3. 테마 설정 패널 (`src/components/ThemePanel.tsx`)

#### 🌓 다크 모드 토글
```typescript
const handleModeChange = () => {
  updateSettings({ mode: settings.mode === 'light' ? 'dark' : 'light' });
};

<FormControlLabel
  control={
    <Switch
      checked={settings.mode === 'dark'}
      onChange={handleModeChange}
      icon={<LightIcon />}
      checkedIcon={<DarkIcon />}
    />
  }
  label={`${settings.mode === 'dark' ? '다크' : '라이트'} 모드`}
/>
```

#### 📏 폰트 크기 슬라이더
```typescript
<Slider
  value={fontSizeIndex}
  onChange={(_, value) => handleFontSizeChange(value as number)}
  min={0}
  max={2}
  step={1}
  marks={[
    { value: 0, label: '작게' },
    { value: 1, label: '보통' },
    { value: 2, label: '크게' },
  ]}
/>
```

#### 📤 테마 내보내기/가져오기
```typescript
// 내보내기
const handleExport = () => {
  const settingsJson = exportSettings();
  navigator.clipboard.writeText(settingsJson);
  setMessage('테마 설정이 클립보드에 복사되었습니다!');
};

// 가져오기
const handleImport = () => {
  const success = importSettings(importText);
  if (success) {
    setMessage('테마 설정이 성공적으로 적용되었습니다!');
  } else {
    setMessage('유효하지 않은 테마 설정입니다.');
  }
};
```

### 4. 색상 선택기 (`src/components/ColorPicker.tsx`)

#### 🎨 색상 팔레트
```typescript
const colorPalette = [
  '#1976d2', '#1565c0', '#0d47a1', // Blue
  '#d32f2f', '#c62828', '#b71c1c', // Red
  '#388e3c', '#2e7d32', '#1b5e20', // Green
  '#f57c00', '#ef6c00', '#e65100', // Orange
  '#7b1fa2', '#6a1b9a', '#4a148c', // Purple
  '#00796b', '#00695c', '#004d40', // Teal
];
```

#### 🎯 색상 버튼과 커스텀 picker
```typescript
{colorPalette.map((paletteColor) => (
  <Button
    key={paletteColor}
    onClick={() => onChange(paletteColor)}
    sx={{
      minWidth: 32, width: 32, height: 32,
      bgcolor: paletteColor,
      border: color === paletteColor ? '3px solid #000' : '1px solid #ccc',
    }}
  />
))}

<input
  type="color"
  value={color}
  onChange={(e) => onChange(e.target.value)}
  style={{ width: '100%', height: 40 }}
/>
```

## 🎓 학습 포인트

### 🌟 React Context API 마스터
```typescript
// 1. Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Provider로 상태 제공
<ThemeContext.Provider value={contextValue}>
  {children}
</ThemeContext.Provider>

// 3. 커스텀 훅으로 사용
export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};

// 4. 컴포넌트에서 활용
const { settings, updateSettings } = useTheme();
```

### 🎨 Material-UI 테마 시스템
```typescript
// 테마 생성
const theme = createTheme({
  palette: {
    mode: 'light' | 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontSize: 14,
    body1: { fontSize: '1rem' },
  },
});

// 테마 적용
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### 💾 브라우저 저장소 활용
```typescript
// 저장
localStorage.setItem('key', JSON.stringify(data));

// 불러오기
const data = JSON.parse(localStorage.getItem('key') || '{}');

// 에러 처리
try {
  const stored = localStorage.getItem('theme-settings');
  return stored ? JSON.parse(stored) : defaultSettings;
} catch (error) {
  console.warn('Storage error:', error);
  return defaultSettings;
}
```

### 🔒 TypeScript 타입 안전성
```typescript
// 인터페이스 정의
interface ThemeSettings {
  mode: 'light' | 'dark';      // 유니온 타입
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

// 함수 타입 정의
type UpdateSettings = (newSettings: Partial<ThemeSettings>) => void;

// 컴포넌트 Props 타입
interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}
```

## 🎪 실행 결과

### 📱 주요 화면 구성
- **좌측 패널**: 테마 설정 컨트롤러
  - 다크/라이트 모드 토글
  - Primary/Secondary 색상 선택기
  - 폰트 크기 슬라이더
  - 현재 설정 미리보기 칩
  - 초기화/내보내기/가져오기 버튼

- **우측 패널**: 실시간 미리보기
  - 제목과 설명 텍스트
  - Primary/Secondary 버튼들
  - 카드 컴포넌트
  - 리스트 아이템
  - 다양한 Typography 스타일

### 🎯 상호작용 시나리오

1. **다크 모드 전환**: Switch 클릭 → 전체 배경이 어두운 테마로 변경
2. **색상 변경**: 빨간색 팔레트 클릭 → 모든 Primary 버튼이 빨간색으로 변경
3. **폰트 크기 조절**: 슬라이더를 '크게'로 이동 → 모든 텍스트가 커짐
4. **설정 저장**: 브라우저 새로고침 → 이전 설정 그대로 유지
5. **테마 공유**: 내보내기 → JSON 복사 → 다른 브라우저에서 가져오기

## 🔄 확장 가능한 기능들

이 프로젝트를 기반으로 다음과 같은 고급 기능을 추가해볼 수 있습니다:

### 🎨 고급 테마 기능
- [ ] **더 많은 색상 옵션**: Error, Warning, Info, Success 색상
- [ ] **폰트 패밀리 선택**: Roboto, Open Sans, Noto Sans 등
- [ ] **컴포넌트별 커스터마이징**: Button radius, Card elevation 등
- [ ] **애니메이션 속도**: Transition duration 조절

### 💾 데이터 관리
- [ ] **여러 테마 프리셋**: 미리 만들어진 테마 목록
- [ ] **테마 히스토리**: 이전 설정으로 되돌리기
- [ ] **클라우드 저장**: Firebase/Supabase 연동
- [ ] **팀 테마 공유**: 조직 내 테마 공유 시스템

### 🎪 사용자 경험
- [ ] **테마 애니메이션**: 색상 변경 시 부드러운 전환
- [ ] **접근성 개선**: 고대비 모드, 큰 글씨 옵션
- [ ] **모바일 최적화**: 터치 친화적 색상 선택기
- [ ] **키보드 단축키**: 빠른 테마 전환

## 🛠️ 기술 스택

- **⚛️ React 18**: 함수형 컴포넌트와 Hooks
- **🔷 TypeScript**: 타입 안전성과 개발 생산성
- **🎨 Material-UI**: 구글의 Material Design 시스템
- **⚡ Vite**: 빠른 개발 서버와 빌드 도구
- **🚀 SWC**: 고성능 JavaScript/TypeScript 컴파일러
- **📏 ESLint**: 코드 품질 관리 (초보자 친화적 설정)

## 🤝 학습 도움말

### 🆘 자주 발생하는 문제들

1. **Context가 undefined인 경우**
   ```typescript
   // ❌ 잘못된 사용
   function Component() {
     const theme = useContext(ThemeContext); // undefined 가능
   }
   
   // ✅ 올바른 사용
   function Component() {
     const theme = useTheme(); // 에러 처리가 포함된 커스텀 훅
   }
   ```

2. **localStorage 에러 처리**
   ```typescript
   // ❌ 에러 처리 없음
   const data = JSON.parse(localStorage.getItem('key'));
   
   // ✅ 안전한 에러 처리
   try {
     const stored = localStorage.getItem('key');
     const data = stored ? JSON.parse(stored) : defaultValue;
   } catch (error) {
     console.warn('Storage error:', error);
     return defaultValue;
   }
   ```

3. **테마가 적용되지 않는 경우**
   ```typescript
   // ThemeProvider가 올바른 위치에 있는지 확인
   <ThemeProvider theme={muiTheme}>
     <CssBaseline />  {/* 기본 CSS 리셋 */}
     <App />
   </ThemeProvider>
   ```

### 📚 추가 학습 자료

- [React Context API 공식 문서](https://react.dev/learn/passing-data-deeply-with-context)
- [Material-UI 테마 가이드](https://mui.com/material-ui/customization/theming/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [localStorage MDN 문서](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)

## 📄 라이선스

이 프로젝트는 교육 목적으로 만들어졌으며 MIT 라이선스를 따릅니다.

---

**Happy Theming! 🎨**

*React Context API와 Material-UI를 마스터하여 사용자 친화적인 테마 시스템을 구축해보세요!*