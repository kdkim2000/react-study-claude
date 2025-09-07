# 실무 React 프로젝트 구조 설계

## 📋 프로젝트 개요

이 프로젝트는 실무에서 사용되는 React 애플리케이션의 표준적인 프로젝트 구조를 학습하기 위한 교육용 프로젝트입니다. Material-UI를 활용한 대시보드와 인증 시스템을 포함하며, 확장 가능하고 유지보수하기 쉬운 아키텍처 패턴을 적용했습니다.

## 🎯 학습 목표

- **프로젝트 구조**: 확장 가능한 폴더 구조 설계
- **컴포넌트 설계**: 재사용 가능한 컴포넌트 패턴
- **상태 관리**: React Hooks를 활용한 상태 관리
- **레이아웃 시스템**: 공통 레이아웃 컴포넌트 구조
- **라우팅**: 페이지 간 네비게이션 구현
- **테마 시스템**: Material-UI 테마 커스터마이징
- **에러 핸들링**: 사용자 피드백 시스템

## 🚀 주요 기능

- ✅ 인증 시스템 (로그인/로그아웃)
- ✅ 대시보드 페이지
- ✅ 게시판 시스템
- ✅ 반응형 네비게이션
- ✅ 스낵바 알림 시스템
- ✅ 커스텀 테마 적용
- ✅ TypeScript 지원

## 📁 프로젝트 구조

```
src/
├── App.tsx                    # 메인 애플리케이션 컴포넌트
├── App.css                    # 애플리케이션 전역 스타일
├── index.css                  # 기본 스타일 초기화
├── main.tsx                   # 애플리케이션 진입점
├── theme.ts                   # Material-UI 테마 설정
├── components/                # 재사용 가능한 컴포넌트
│   ├── layout/               # 레이아웃 컴포넌트
│   │   ├── MainLayout.tsx    # 메인 애플리케이션 레이아웃
│   │   ├── AuthLayout.tsx    # 인증 페이지 레이아웃
│   │   └── Navigation.tsx    # 네비게이션 컴포넌트
│   ├── common/               # 공통 컴포넌트
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ConfirmDialog.tsx
│   └── ui/                   # UI 컴포넌트
│       ├── CustomButton.tsx
│       ├── DataTable.tsx
│       └── FormField.tsx
├── pages/                    # 페이지 컴포넌트
│   ├── dashboard/           # 대시보드 관련
│   │   ├── Dashboard.tsx
│   │   └── components/
│   ├── board/               # 게시판 관련
│   │   ├── BoardList.tsx
│   │   ├── BoardDetail.tsx
│   │   └── components/
│   └── auth/                # 인증 관련
│       ├── Login.tsx
│       └── components/
├── hooks/                   # 커스텀 훅
│   ├── useSnackbar.ts
│   ├── useAuth.ts
│   └── useApi.ts
├── types/                   # TypeScript 타입 정의
│   ├── auth.ts
│   ├── board.ts
│   └── common.ts
├── utils/                   # 유틸리티 함수
│   ├── constants.ts
│   ├── helpers.ts
│   └── validation.ts
└── services/               # API 서비스
    ├── api.ts
    ├── authService.ts
    └── boardService.ts
```

## 🏗️ 핵심 아키텍처 분석

### 1. 메인 애플리케이션 (App.tsx)

```typescript
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { snackbar, hideSnackbar } = useSnackbar();

  // 페이지 라우팅 로직
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'board': return <BoardList />;
      default: return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuthenticated ? (
        <AuthLayout>
          <Login onLoginSuccess={handleLoginSuccess} />
        </AuthLayout>
      ) : (
        <MainLayout currentPage={currentPage} onPageChange={handlePageChange}>
          {renderPage()}
        </MainLayout>
      )}
      
      {/* 전역 스낵바 */}
      <Snackbar {...snackbarProps}>
        <Alert {...alertProps}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};
```

**핵심 개념:**
- **조건부 렌더링**: 인증 상태에 따른 레이아웃 분기
- **상태 기반 라우팅**: useState를 활용한 페이지 관리
- **전역 상태**: 인증 상태와 알림 시스템
- **레이아웃 패턴**: 인증/메인 레이아웃 분리

### 2. 레이아웃 시스템

#### MainLayout.tsx (메인 애플리케이션 레이아웃)
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  currentPage, 
  onPageChange 
}) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation 
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};
```

#### AuthLayout.tsx (인증 페이지 레이아웃)
```typescript
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};
```

**핵심 개념:**
- **레이아웃 컴포지션**: children prop을 통한 컨텐츠 삽입
- **반응형 디자인**: Material-UI의 Grid/Flexbox 시스템
- **컴포넌트 재사용**: 공통 레이아웃 패턴 추상화

### 3. 커스텀 훅 패턴

#### useSnackbar.ts
```typescript
interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const showSnackbar = (
    message: string, 
    severity: SnackbarState['severity'] = 'info'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return { snackbar, showSnackbar, hideSnackbar };
};
```

**핵심 개념:**
- **커스텀 훅**: 재사용 가능한 상태 로직 분리
- **상태 캡슐화**: 관련된 상태와 함수를 하나로 묶음
- **타입 안정성**: TypeScript 인터페이스 활용

### 4. 페이지 컴포넌트 구조

#### Dashboard.tsx
```typescript
const Dashboard: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch(() => showSnackbar('데이터 로드 실패', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>
      <Grid container spacing={3}>
        {/* 대시보드 컨텐츠 */}
      </Grid>
    </Container>
  );
};
```

**핵심 개념:**
- **데이터 페칭**: useEffect를 활용한 비동기 데이터 로드
- **로딩 상태**: 사용자 경험을 위한 로딩 처리
- **에러 핸들링**: 사용자 친화적인 에러 메시지

## 🎨 테마 시스템 (theme.ts)

```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});
```

**핵심 개념:**
- **테마 중앙집중화**: 디자인 시스템의 일관성 유지
- **컴포넌트 오버라이드**: 기본 스타일 커스터마이징
- **타이포그래피**: 텍스트 스타일 표준화

## 🔧 실무 패턴과 베스트 프랙티스

### 1. 폴더 구조 원칙

```
✅ 기능별 분리 (Feature-based)
pages/
├── dashboard/
│   ├── Dashboard.tsx
│   ├── components/
│   │   ├── StatsCard.tsx
│   │   └── ChartWidget.tsx
│   └── hooks/
│       └── useDashboardData.ts

✅ 계층별 분리 (Layer-based)
src/
├── components/  # 프레젠테이션 레이어
├── hooks/       # 비즈니스 로직 레이어
├── services/    # 데이터 액세스 레이어
└── types/       # 타입 정의 레이어
```

### 2. 컴포넌트 설계 패턴

```typescript
// ❌ 나쁜 예: 모든 로직이 한 컴포넌트에
const Dashboard = () => {
  // 50줄의 상태 로직...
  // 100줄의 이벤트 핸들러...
  // 200줄의 JSX...
};

// ✅ 좋은 예: 관심사 분리
const Dashboard = () => {
  const { data, loading, error } = useDashboardData();
  const { handleAction } = useDashboardActions();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardStats data={data} />
      <DashboardCharts data={data} onAction={handleAction} />
    </DashboardLayout>
  );
};
```

### 3. 상태 관리 패턴

```typescript
// 로컬 상태 vs 전역 상태 구분
const ComponentWithLocalState = () => {
  // ✅ 컴포넌트 내부에서만 사용되는 상태
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({});
  
  return (/* JSX */);
};

const App = () => {
  // ✅ 여러 컴포넌트에서 공유되는 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  return (/* JSX */);
};
```

### 4. 타입 정의 패턴

```typescript
// types/common.ts
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

// types/user.ts
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse<{
  user: User;
  token: string;
}> {}
```

### 5. 서비스 레이어 패턴

```typescript
// services/api.ts
class ApiService {
  private baseURL = process.env.REACT_APP_API_URL;
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    // POST 구현...
  }
}

export const apiService = new ApiService();

// services/userService.ts
export const userService = {
  async getProfile(): Promise<User> {
    return apiService.get<User>('/user/profile');
  },
  
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiService.post<User>('/user/profile', data);
  },
};
```

## 🛠️ 개발 환경 설정

### 필수 의존성
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
    "vite": "^4.4.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

### 프로젝트 설정
```bash
# 프로젝트 생성
npm create vite@latest my-project -- --template react-ts

# 의존성 설치
cd my-project
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# 개발 서버 시작
npm run dev
```

### VSCode 권장 확장
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

## 📚 코드 품질 관리

### ESLint 설정 (.eslintrc.js)
```javascript
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    '@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'warn',
  },
};
```

### Prettier 설정 (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🔍 성능 최적화 전략

### 1. 코드 분할 (Code Splitting)
```typescript
// 동적 import를 통한 페이지별 분할
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const BoardList = lazy(() => import('./pages/board/BoardList'));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/board" element={<BoardList />} />
        </Routes>
      </Router>
    </Suspense>
  );
};
```

### 2. 메모이제이션 최적화
```typescript
// React.memo로 불필요한 리렌더링 방지
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  return (
    <div>
      {data.map(item => (
        <ItemCard key={item.id} item={item} onAction={onAction} />
      ))}
    </div>
  );
});

// useMemo로 비용이 큰 계산 캐싱
const Dashboard = () => {
  const processedData = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      calculated: expensiveCalculation(item)
    }));
  }, [rawData]);
  
  return <DataTable data={processedData} />;
};
```

### 3. 커스텀 훅으로 로직 분리
```typescript
// 데이터 페칭 로직을 커스텀 훅으로 분리
const useApiData = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiService.get<T>(url);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
};
```

## 🎯 실습 과제

### 초급 과제 (⭐)
1. **새로운 페이지 추가**: 프로필 페이지를 추가하고 네비게이션에 연결하세요
2. **스타일 커스터마이징**: 테마의 색상을 변경하고 새로운 컴포넌트 스타일을 추가하세요
3. **폼 컴포넌트 생성**: 사용자 정보 입력 폼을 만들어보세요

### 중급 과제 (⭐⭐)
1. **데이터 테이블**: 정렬, 필터링 기능이 있는 데이터 테이블을 구현하세요
2. **모달 시스템**: 재사용 가능한 모달 컴포넌트를 만들어보세요
3. **폼 유효성 검사**: 실시간 유효성 검사 기능을 추가하세요

### 고급 과제 (⭐⭐⭐)
1. **상태 관리 개선**: Context API나 Zustand를 도입하여 전역 상태를 관리하세요
2. **React Router 도입**: 실제 라우팅 시스템으로 페이지 전환을 구현하세요
3. **테스팅**: Jest와 React Testing Library로 컴포넌트 테스트를 작성하세요

## 🔄 실무 개발 워크플로우

### 1. 개발 프로세스
```bash
# 기능 브랜치 생성
git checkout -b feature/user-profile

# 개발 진행
npm run dev

# 코드 품질 검사
npm run lint
npm run type-check

# 테스트 실행
npm run test

# 빌드 테스트
npm run build

# PR 생성 및 코드 리뷰
git push origin feature/user-profile
```

### 2. 컴포넌트 개발 순서
1. **타입 정의** → 인터페이스와 Props 타입 먼저 정의
2. **구조 설계** → JSX 구조와 레이아웃 구성
3. **상태 관리** → 필요한 상태와 이벤트 핸들러 구현
4. **스타일링** → Material-UI를 활용한 스타일 적용
5. **테스트** → 단위 테스트 작성
6. **리팩토링** → 코드 최적화와 성능 개선

### 3. 코드 리뷰 체크리스트
- [ ] 컴포넌트가 단일 책임 원칙을 따르는가?
- [ ] Props와 상태 타입이 명확히 정의되었는가?
- [ ] 접근성(a11y) 가이드라인을 준수하는가?
- [ ] 성능 최적화가 적절히 적용되었는가?
- [ ] 에러 처리가 구현되었는가?
- [ ] 재사용 가능한 패턴으로 작성되었는가?

## 📖 추가 학습 리소스

### React 심화
- [React Patterns](https://reactpatterns.com/) - React 디자인 패턴
- [React Performance](https://react.dev/learn/render-and-commit) - 성능 최적화

### Material-UI
- [MUI Design System](https://mui.com/design-kits/) - 디자인 시스템 가이드
- [MUI Templates](https://mui.com/store/) - 실무 템플릿

### TypeScript
- [React + TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react) - 타입스크립트 치트시트

### 아키텍처
- [Clean Architecture in React](https://dev.to/cleanbull/clean-architecture-in-react-2o51) - 클린 아키텍처
- [Feature-Sliced Design](https://feature-sliced.design/) - 모던 프론트엔드 아키텍처

---

**Happy Coding! 🚀**

*이 프로젝트는 실무 React 개발의 모든 핵심 개념을 담고 있습니다. 단계별로 학습하며 실제 프로덕션 환경에서 사용할 수 있는 스킬을 익혀보세요.*