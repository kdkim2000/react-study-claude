# React 카운터 컴포넌트

## 📋 프로젝트 개요

이 프로젝트는 React 초보자를 위한 첫 번째 학습 과제로, Vue3 카운터를 React로 변환하고 Material-UI로 스타일링한 간단한 카운터 애플리케이션입니다. React의 핵심 개념인 상태 관리, 이벤트 핸들링, 조건부 렌더링을 학습할 수 있습니다.

## 🎯 학습 목표

- **useState Hook**: React의 상태 관리 기초
- **이벤트 핸들링**: 버튼 클릭 이벤트 처리
- **조건부 렌더링**: 상태에 따른 UI 변경
- **Material-UI 사용법**: 컴포넌트와 스타일링
- **Props와 컴포넌트**: 컴포넌트 간 데이터 전달
- **TypeScript 기초**: 타입 정의와 타입 안전성

## 🚀 기능 요구사항

- ✅ **증가 버튼**: 카운터 값을 1씩 증가
- ✅ **감소 버튼**: 카운터 값을 1씩 감소
- ✅ **리셋 버튼**: 카운터 값을 0으로 초기화
- ✅ **최소값 제한**: 0 미만으로 감소 불가
- ✅ **최대값 제한**: 10 초과로 증가 불가
- ✅ **경고 색상**: 5 이상일 때 빨간색으로 표시
- ✅ **반응형 디자인**: 모바일 친화적 레이아웃

## 📁 프로젝트 구조

```
src/
├── App.tsx              # 메인 애플리케이션 컴포넌트
├── App.css              # 애플리케이션 스타일
├── index.css            # 전역 스타일
├── main.tsx             # 애플리케이션 진입점
├── components/          # 컴포넌트 디렉토리
│   ├── Counter.tsx      # 메인 카운터 컴포넌트
│   ├── CounterDisplay.tsx   # 카운터 표시 컴포넌트
│   └── CounterControls.tsx  # 버튼 컨트롤 컴포넌트
└── types/
    └── counter.ts       # TypeScript 타입 정의
```

## 🏗️ 컴포넌트 구조 분석

### 1. App.tsx (루트 컴포넌트)

```typescript
import React from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Counter from './components/Counter';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Counter />
      </Container>
    </ThemeProvider>
  );
};

export default App;
```

**핵심 개념:**
- **ThemeProvider**: Material-UI 테마 제공자
- **CssBaseline**: 브라우저 기본 스타일 초기화
- **Container**: 반응형 컨테이너로 레이아웃 구성

### 2. Counter.tsx (메인 카운터 컴포넌트)

```typescript
import React, { useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import CounterDisplay from './CounterDisplay';
import CounterControls from './CounterControls';

const Counter: React.FC = () => {
  // 상태 선언: 카운터 값을 관리
  const [count, setCount] = useState<number>(0);
  
  // 최소값과 최대값 상수 정의
  const MIN_VALUE = 0;
  const MAX_VALUE = 10;
  const WARNING_THRESHOLD = 5;

  // 증가 함수
  const handleIncrement = (): void => {
    setCount(prevCount => 
      prevCount < MAX_VALUE ? prevCount + 1 : prevCount
    );
  };

  // 감소 함수
  const handleDecrement = (): void => {
    setCount(prevCount => 
      prevCount > MIN_VALUE ? prevCount - 1 : prevCount
    );
  };

  // 리셋 함수
  const handleReset = (): void => {
    setCount(0);
  };

  // 경고 상태 계산
  const isWarning = count >= WARNING_THRESHOLD;

  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        React 카운터
      </Typography>
      
      <Box sx={{ my: 4 }}>
        <CounterDisplay 
          count={count} 
          isWarning={isWarning}
          maxValue={MAX_VALUE}
          minValue={MIN_VALUE}
        />
      </Box>
      
      <CounterControls
        count={count}
        maxValue={MAX_VALUE}
        minValue={MIN_VALUE}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onReset={handleReset}
      />
    </Paper>
  );
};

export default Counter;
```

**핵심 개념:**
- **useState Hook**: `const [count, setCount] = useState<number>(0)`
- **이벤트 핸들러**: 버튼 클릭 시 실행되는 함수들
- **Props 전달**: 자식 컴포넌트에 데이터와 함수 전달
- **상태 업데이트**: `setCount`를 통한 상태 변경

### 3. CounterDisplay.tsx (표시 컴포넌트)

```typescript
import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface CounterDisplayProps {
  count: number;
  isWarning: boolean;
  maxValue: number;
  minValue: number;
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({
  count,
  isWarning,
  maxValue,
  minValue
}) => {
  return (
    <Box>
      {/* 카운터 숫자 표시 */}
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: isWarning ? 'error.main' : 'primary.main',
          mb: 2,
          transition: 'color 0.3s ease',
        }}
      >
        {count}
      </Typography>
      
      {/* 경고 메시지 */}
      {isWarning && (
        <Chip
          icon={<WarningIcon />}
          label="경고: 높은 값입니다!"
          color="error"
          variant="filled"
          sx={{ mb: 2 }}
        />
      )}
      
      {/* 범위 정보 */}
      <Typography variant="body2" color="text.secondary">
        범위: {minValue} ~ {maxValue}
      </Typography>
      
      {/* 진행률 표시 */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          진행률: {Math.round((count / maxValue) * 100)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default CounterDisplay;
```

**핵심 개념:**
- **Props 인터페이스**: TypeScript로 Props 타입 정의
- **조건부 렌더링**: `{isWarning && <Component />}` 패턴
- **동적 스타일**: 상태에 따른 색상 변경
- **계산된 값**: `Math.round((count / maxValue) * 100)`

### 4. CounterControls.tsx (컨트롤 컴포넌트)

```typescript
import React from 'react';
import { Button, ButtonGroup, Stack } from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface CounterControlsProps {
  count: number;
  maxValue: number;
  minValue: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

const CounterControls: React.FC<CounterControlsProps> = ({
  count,
  maxValue,
  minValue,
  onIncrement,
  onDecrement,
  onReset
}) => {
  // 버튼 활성화 상태 계산
  const canIncrement = count < maxValue;
  const canDecrement = count > minValue;
  const canReset = count !== 0;

  return (
    <Stack spacing={2} alignItems="center">
      {/* 증가/감소 버튼 그룹 */}
      <ButtonGroup variant="contained" size="large">
        <Button
          onClick={onDecrement}
          disabled={!canDecrement}
          startIcon={<RemoveIcon />}
          sx={{ minWidth: 120 }}
        >
          감소
        </Button>
        
        <Button
          onClick={onIncrement}
          disabled={!canIncrement}
          endIcon={<AddIcon />}
          sx={{ minWidth: 120 }}
        >
          증가
        </Button>
      </ButtonGroup>
      
      {/* 리셋 버튼 */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={onReset}
        disabled={!canReset}
        startIcon={<RefreshIcon />}
        sx={{ minWidth: 120 }}
      >
        리셋
      </Button>
      
      {/* 상태 정보 */}
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        {!canDecrement && (
          <Chip label="최소값 도달" size="small" color="info" />
        )}
        {!canIncrement && (
          <Chip label="최대값 도달" size="small" color="warning" />
        )}
      </Stack>
    </Stack>
  );
};

export default CounterControls;
```

**핵심 개념:**
- **버튼 상태 관리**: `disabled` 속성으로 버튼 활성화/비활성화
- **콜백 함수**: Props로 전달받은 함수 호출
- **계산된 불린 값**: `canIncrement`, `canDecrement` 등
- **Material-UI 아이콘**: 버튼에 아이콘 추가

### 5. types/counter.ts (타입 정의)

```typescript
// 카운터 상태 타입
export interface CounterState {
  value: number;
  isWarning: boolean;
  canIncrement: boolean;
  canDecrement: boolean;
}

// 카운터 설정 타입
export interface CounterConfig {
  minValue: number;
  maxValue: number;
  warningThreshold: number;
  step: number;
}

// 이벤트 핸들러 타입
export type CounterEventHandler = () => void;

// Props 타입들
export interface CounterProps {
  initialValue?: number;
  config?: Partial<CounterConfig>;
}

export interface CounterDisplayProps {
  count: number;
  isWarning: boolean;
  maxValue: number;
  minValue: number;
}

export interface CounterControlsProps {
  count: number;
  maxValue: number;
  minValue: number;
  onIncrement: CounterEventHandler;
  onDecrement: CounterEventHandler;
  onReset: CounterEventHandler;
}
```

## 🔧 핵심 React 개념 설명

### 1. useState Hook 이해하기

```typescript
// 기본 사용법
const [count, setCount] = useState<number>(0);
//     ↑       ↑                    ↑
//   현재값   setter함수          초기값

// 상태 업데이트 방법들
setCount(5);                    // 직접 값 설정
setCount(count + 1);           // 현재 값 기반 (권장하지 않음)
setCount(prev => prev + 1);    // 이전 값 기반 (권장)
```

**왜 함수형 업데이트를 사용해야 할까?**
```typescript
// ❌ 잘못된 방법 - 여러 번 클릭해도 1번만 증가할 수 있음
const badIncrement = () => {
  setCount(count + 1);
  setCount(count + 1); // 여전히 같은 count 값 사용
};

// ✅ 올바른 방법 - 항상 최신 값을 기반으로 업데이트
const goodIncrement = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1); // 이전 업데이트 결과를 기반으로 함
};
```

### 2. 이벤트 핸들링 패턴

```typescript
// 기본 이벤트 핸들러
const handleClick = () => {
  console.log('버튼이 클릭됨');
};

// 매개변수가 있는 이벤트 핸들러
const handleClickWithParam = (value: number) => {
  setCount(value);
};

// 이벤트 객체 사용
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // 폼 제출 로직
};
```

### 3. 조건부 렌더링 방법들

```typescript
// 1. 논리 AND 연산자
{isWarning && <WarningMessage />}

// 2. 삼항 연산자
{count > 5 ? <HighValue /> : <NormalValue />}

// 3. 즉시 실행 함수
{(() => {
  if (count === 0) return <EmptyState />;
  if (count > 8) return <HighState />;
  return <NormalState />;
})()}

// 4. 변수에 할당
const renderMessage = () => {
  if (count >= 10) return '최대값입니다!';
  if (count <= 0) return '최소값입니다!';
  return `현재 값: ${count}`;
};
```

### 4. Props 전달과 타입 안전성

```typescript
// Props 인터페이스 정의
interface MyComponentProps {
  title: string;
  count: number;
  isActive?: boolean;        // 선택적 prop
  onAction: () => void;      // 함수 prop
}

// 컴포넌트에서 Props 사용
const MyComponent: React.FC<MyComponentProps> = ({
  title,
  count,
  isActive = false,  // 기본값 설정
  onAction
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <span>{count}</span>
      {isActive && <button onClick={onAction}>실행</button>}
    </div>
  );
};
```

## 🎨 Material-UI 스타일링 기법

### 1. sx prop 활용

```typescript
// 기본 스타일링
<Button
  sx={{
    backgroundColor: 'primary.main',
    color: 'white',
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
  }}
>
  버튼
</Button>

// 반응형 스타일링
<Box
  sx={{
    width: { xs: '100%', sm: '50%', md: '33%' },
    padding: { xs: 1, sm: 2, md: 3 },
  }}
>
  반응형 박스
</Box>

// 조건부 스타일링
<Typography
  sx={{
    color: isError ? 'error.main' : 'text.primary',
    fontWeight: isImportant ? 'bold' : 'normal',
  }}
>
  조건부 텍스트
</Typography>
```

### 2. 테마 시스템 활용

```typescript
// 테마 생성
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

// 테마 값 사용
<Button
  sx={{
    backgroundColor: 'primary.main', // 테마의 primary 색상 사용
    margin: theme.spacing(2),        // 테마의 spacing 사용
  }}
>
  테마 버튼
</Button>
```

### 3. 애니메이션과 전환 효과

```typescript
<Typography
  sx={{
    color: isWarning ? 'error.main' : 'primary.main',
    transition: 'color 0.3s ease', // 부드러운 색상 전환
    transform: isWarning ? 'scale(1.1)' : 'scale(1)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }}
>
  애니메이션 텍스트
</Typography>
```

## 💡 개발 패턴과 베스트 프랙티스

### 1. 컴포넌트 분리 원칙

```typescript
// ❌ 모든 로직이 한 곳에 - 유지보수 어려움
const BadCounter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1 style={{color: count >= 5 ? 'red' : 'blue'}}>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};

// ✅ 관심사별로 분리 - 유지보수 용이
const GoodCounter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <Paper>
      <CounterDisplay count={count} />
      <CounterControls 
        count={count}
        onIncrement={() => setCount(prev => prev + 1)}
        onDecrement={() => setCount(prev => prev - 1)}
        onReset={() => setCount(0)}
      />
    </Paper>
  );
};
```

### 2. 상수 및 설정 분리

```typescript
// constants/counter.ts
export const COUNTER_CONFIG = {
  MIN_VALUE: 0,
  MAX_VALUE: 10,
  WARNING_THRESHOLD: 5,
  STEP: 1,
} as const;

export const COUNTER_MESSAGES = {
  WARNING: '경고: 높은 값입니다!',
  MAX_REACHED: '최대값에 도달했습니다!',
  MIN_REACHED: '최소값에 도달했습니다!',
} as const;
```

### 3. 커스텀 훅으로 로직 분리

```typescript
// hooks/useCounter.ts
interface UseCounterOptions {
  minValue?: number;
  maxValue?: number;
  warningThreshold?: number;
  initialValue?: number;
}

export const useCounter = (options: UseCounterOptions = {}) => {
  const {
    minValue = 0,
    maxValue = 10,
    warningThreshold = 5,
    initialValue = 0
  } = options;
  
  const [count, setCount] = useState(initialValue);
  
  const increment = () => {
    setCount(prev => prev < maxValue ? prev + 1 : prev);
  };
  
  const decrement = () => {
    setCount(prev => prev > minValue ? prev - 1 : prev);
  };
  
  const reset = () => {
    setCount(initialValue);
  };
  
  const isWarning = count >= warningThreshold;
  const canIncrement = count < maxValue;
  const canDecrement = count > minValue;
  
  return {
    count,
    increment,
    decrement,
    reset,
    isWarning,
    canIncrement,
    canDecrement,
  };
};

// 컴포넌트에서 사용
const Counter = () => {
  const counter = useCounter({ maxValue: 20, warningThreshold: 15 });
  
  return (
    <div>
      <CounterDisplay count={counter.count} isWarning={counter.isWarning} />
      <CounterControls {...counter} />
    </div>
  );
};
```

## 🛠️ 설치 및 실행

### 프로젝트 생성
```bash
# Vite를 사용한 React + TypeScript 프로젝트 생성
npm create vite@latest react-counter -- --template react-ts
cd react-counter

# 의존성 설치
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# 개발 서버 시작
npm run dev
```

### 필요한 의존성
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

## 🎯 실습 과제

### 초급 과제 (⭐)
1. **단계 변경**: 증가/감소 단계를 2로 변경하세요
2. **색상 변경**: 경고 임계값을 3으로 변경하고 색상을 주황색으로 바꾸세요
3. **아이콘 변경**: 버튼의 아이콘을 다른 Material-UI 아이콘으로 변경하세요

### 중급 과제 (⭐⭐)
1. **입력 필드 추가**: 사용자가 직접 숫자를 입력할 수 있는 TextField를 추가하세요
2. **애니메이션 효과**: 카운터 값이 변경될 때 부드러운 애니메이션을 추가하세요
3. **localStorage 연동**: 카운터 값을 브라우저에 저장하여 새로고침 후에도 유지되게 하세요

### 고급 과제 (⭐⭐⭐)
1. **다중 카운터**: 여러 개의 카운터를 관리할 수 있는 시스템을 만드세요
2. **카운터 히스토리**: 카운터 변경 내역을 기록하고 되돌리기 기능을 추가하세요
3. **테스트 작성**: Jest와 React Testing Library로 컴포넌트 테스트를 작성하세요

## 🔍 디버깅 팁

### 1. React DevTools 사용
```javascript
// 브라우저 확장 프로그램 설치 후
// Components 탭에서 state와 props 확인 가능
console.log('현재 count:', count); // 개발 시에만 사용
```

### 2. 일반적인 오류들

```typescript
// ❌ 무한 렌더링 - useEffect 의존성 배열 누락
useEffect(() => {
  setCount(count + 1); // count가 변경되면 다시 실행됨
}, []); // 의존성 배열에 count 누락

// ✅ 올바른 사용
useEffect(() => {
  // 초기화 로직만 실행
}, []); // 빈 배열로 한 번만 실행

// ❌ 상태 직접 수정
count++; // React는 이 변경을 감지하지 못함

// ✅ setter 함수 사용
setCount(count + 1);
```

### 3. TypeScript 오류 해결

```typescript
// ❌ 타입 불일치
const [count, setCount] = useState('0'); // string 타입
setCount(count + 1); // 문자열 + 숫자 오류

// ✅ 올바른 타입 지정
const [count, setCount] = useState<number>(0);
setCount(count + 1); // 숫자 + 숫자 정상
```

## 📚 추가 학습 리소스

### React 기초
- [React 공식 문서 - useState](https://react.dev/reference/react/useState)
- [React 공식 문서 - 조건부 렌더링](https://react.dev/learn/conditional-rendering)
- [React 공식 문서 - 이벤트 핸들링](https://react.dev/learn/responding-to-events)

### Material-UI
- [MUI 컴포넌트 데모](https://mui.com/components/)
- [MUI 스타일링 가이드](https://mui.com/system/basics/)
- [MUI 아이콘 라이브러리](https://mui.com/components/icons/)

### TypeScript
- [TypeScript Handbook - 기초](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)

## 🔄 다음 단계

이 카운터 컴포넌트를 완료했다면, 다음 학습 주제를 추천합니다:

1. **useEffect Hook**: 컴포넌트 생명주기 관리
2. **폼 처리**: 사용자 입력 다루기
3. **리스트 렌더링**: 배열 데이터 표시
4. **컴포넌트 통신**: Props와 Context
5. **라우팅**: 페이지 간 네비게이션

---

**Happy Coding! 🚀**

*이 프로젝트를 통해 React의 기초를 탄탄히 다져보세요. 작은 것부터 시작해서 점진적으로 복잡한 기능을 추가해 나가는 것이 학습의 핵심입니다.*