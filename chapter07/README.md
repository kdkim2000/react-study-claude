# Chapter 7: 라우팅

## 📚 학습 목표
- Vue Router와 React Router v6의 차이점 이해
- 중첩 라우팅과 레이아웃 구성 방법 학습
- 인증 기반 라우트 보호 구현
- 동적 라우팅과 파라미터 처리 마스터

---

## 1. React Router v6 기초

### 이론 설명 (30%)

React Router v6는 Vue Router와 많은 개념을 공유하지만, JSX 기반의 선언적 방식으로 동작합니다.

#### Vue Router vs React Router v6 비교

| 기능 | Vue Router | React Router v6 |
|------|------------|-----------------|
| 설치 | `vue-router` | `react-router-dom` |
| 라우터 생성 | `createRouter()` | `<BrowserRouter>` |
| 라우트 정의 | JavaScript 객체 | JSX 컴포넌트 |
| 라우트 출력 | `<router-view>` | `<Outlet>` |
| 링크 | `<router-link>` | `<Link>` 또는 `<NavLink>` |
| 프로그래밍 방식 | `router.push()` | `useNavigate()` |
| 현재 라우트 | `useRoute()` | `useLocation()`, `useParams()` |
| 라우트 가드 | `beforeEach`, `beforeEnter` | 조건부 렌더링 |

### 실습 코드 (70%)

#### 1.1 기본 라우터 설정

```bash
# React Router 설치
npm install react-router-dom
```

```tsx
// React: main.tsx - 라우터 설정
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Vue Router의 createRouter와 유사 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

```vue
<!-- Vue3 비교: main.ts -->
<script>
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [/* ... */]
})

createApp(App).use(router).mount('#app')
</script>
```

#### 1.2 라우트 정의와 네비게이션

```tsx
// React: App.tsx - 기본 라우팅
import { Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  Paper,
  Tabs,
  Tab
} from '@mui/material'
import { Home as HomeIcon, Person as PersonIcon, Settings as SettingsIcon } from '@mui/icons-material'

// 페이지 컴포넌트들
function HomePage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4">홈 페이지</Typography>
      <Typography>React Router v6 예제입니다.</Typography>
    </Paper>
  )
}

function AboutPage() {
  const navigate = useNavigate() // Vue Router의 useRouter().push와 유사
  
  const handleGoBack = () => {
    navigate(-1) // 뒤로 가기
  }
  
  const handleGoHome = () => {
    navigate('/') // 특정 경로로 이동
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4">소개 페이지</Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={handleGoBack}>
          뒤로 가기
        </Button>
        <Button variant="contained" onClick={handleGoHome}>
          홈으로
        </Button>
      </Box>
    </Paper>
  )
}

function ContactPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4">연락처 페이지</Typography>
    </Paper>
  )
}

function NotFoundPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" color="error">
        404 - 페이지를 찾을 수 없습니다
      </Typography>
    </Paper>
  )
}

// 네비게이션 컴포넌트
function Navigation() {
  const location = useLocation() // Vue Router의 useRoute()와 유사
  
  // 현재 경로에 따른 탭 인덱스 계산
  const getTabValue = () => {
    const paths = ['/', '/about', '/contact']
    const index = paths.indexOf(location.pathname)
    return index === -1 ? 0 : index
  }
  
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        
        {/* Link 컴포넌트 - Vue의 <router-link>와 유사 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<HomeIcon />}
          >
            홈
          </Button>
          
          {/* NavLink - 활성 상태 스타일링 가능 */}
          <Button
            component={NavLink}
            to="/about"
            color="inherit"
            startIcon={<PersonIcon />}
            sx={{
              '&.active': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            소개
          </Button>
          
          <Button
            component={NavLink}
            to="/contact"
            color="inherit"
            startIcon={<SettingsIcon />}
            sx={{
              '&.active': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            연락처
          </Button>
        </Box>
      </Toolbar>
      
      {/* 탭 네비게이션 예제 */}
      <Tabs
        value={getTabValue()}
        textColor="inherit"
        indicatorColor="secondary"
      >
        <Tab label="홈" component={Link} to="/" />
        <Tab label="소개" component={Link} to="/about" />
        <Tab label="연락처" component={Link} to="/contact" />
      </Tabs>
    </AppBar>
  )
}

// 메인 App 컴포넌트
function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Navigation />
      <Container>
        {/* Routes는 Vue Router의 <router-view>와 유사 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* 404 페이지 - Vue의 { path: '/:pathMatch(.*)*' }와 유사 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
```

---

## 2. 중첩 라우팅

### 이론 설명

중첩 라우팅을 통해 복잡한 레이아웃을 구성할 수 있습니다. React Router v6는 `<Outlet>` 컴포넌트를 사용하여 중첩된 라우트를 렌더링합니다.

### 실습 코드

#### 2.1 중첩 라우트와 레이아웃

```tsx
// React: 중첩 라우팅 예제
import { Routes, Route, Outlet, Link, useParams, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Typography,
  Breadcrumbs,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  AppBar,
  Toolbar,
  CssBaseline
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material'

// 레이아웃 컴포넌트 (Vue의 중첩된 <router-view>와 유사)
function DashboardLayout() {
  const location = useLocation()
  const drawerWidth = 240
  
  const menuItems = [
    { path: '/dashboard', label: '대시보드', icon: <DashboardIcon /> },
    { path: '/dashboard/users', label: '사용자 관리', icon: <PeopleIcon /> },
    { path: '/dashboard/settings', label: '설정', icon: <SettingsIcon /> }
  ]
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* 상단 AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            관리자 대시보드
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* 사이드바 */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 8
          }
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* 메인 컨텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          mt: 8,
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {/* Outlet은 중첩된 라우트를 렌더링 (Vue의 <router-view>와 유사) */}
        <Outlet />
      </Box>
    </Box>
  )
}

// 대시보드 홈
function DashboardHome() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        대시보드
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                총 사용자
              </Typography>
              <Typography variant="h3">
                1,234
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                활성 세션
              </Typography>
              <Typography variant="h3">
                89
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                신규 가입
              </Typography>
              <Typography variant="h3">
                24
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

// 사용자 목록 페이지
function UserList() {
  const users = [
    { id: 1, name: '홍길동', email: 'hong@example.com', role: 'Admin' },
    { id: 2, name: '김철수', email: 'kim@example.com', role: 'User' },
    { id: 3, name: '이영희', email: 'lee@example.com', role: 'User' }
  ]
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        사용자 관리
      </Typography>
      
      {/* 브레드크럼 */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          대시보드
        </Link>
        <Typography color="text.primary">사용자 관리</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={2}>
        {users.map(user => (
          <Grid item xs={12} md={6} lg={4} key={user.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>{user.name[0]}</Avatar>
                  <Box>
                    <Typography variant="h6">
                      <Link 
                        to={`/dashboard/users/${user.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {user.name}
                      </Link>
                    </Typography>
                    <Chip 
                      label={user.role} 
                      size="small" 
                      color={user.role === 'Admin' ? 'primary' : 'default'}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  {user.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

// 사용자 상세 페이지 (동적 라우트)
function UserDetail() {
  const { id } = useParams() // Vue의 useRoute().params와 유사
  
  // 실제로는 API 호출로 데이터 가져오기
  const user = {
    id,
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    role: 'Admin',
    joinDate: '2023-01-15'
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        사용자 상세 정보
      </Typography>
      
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          대시보드
        </Link>
        <Link to="/dashboard/users" style={{ textDecoration: 'none', color: 'inherit' }}>
          사용자 관리
        </Link>
        <Typography color="text.primary">{user.name}</Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {user.name[0]}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Chip label={user.role} color="primary" />
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  이메일
                </Typography>
                <Typography>{user.email}</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  전화번호
                </Typography>
                <Typography>{user.phone}</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  사용자 ID
                </Typography>
                <Typography>{user.id}</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                가입일
              </Typography>
              <Typography>{user.joinDate}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

// 설정 페이지
function Settings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        설정
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>시스템 설정 페이지입니다.</Typography>
      </Paper>
    </Box>
  )
}

// 중첩 라우트 설정
function NestedRoutesApp() {
  return (
    <Routes>
      {/* 대시보드 레이아웃과 중첩 라우트 */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* index는 부모 경로와 정확히 일치할 때 렌더링 */}
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* 루트 경로에서 대시보드로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
```

---

## 3. 보호된 라우트

### 이론 설명

React Router v6에서는 Vue Router의 `beforeEnter` 가드와 유사한 기능을 컴포넌트로 구현합니다.

### 실습 코드

#### 3.1 인증 기반 라우트 보호

```tsx
// React: 보호된 라우트 구현
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useState, createContext, useContext, ReactNode } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container
} from '@mui/material'

// 인증 컨텍스트
interface AuthContextType {
  user: { id: string; name: string; role: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// 인증 Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 초기 로드 시 토큰 확인
  useState(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // 토큰 검증 API 호출 시뮬레이션
      setTimeout(() => {
        setUser({ id: '1', name: '홍길동', role: 'admin' })
        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  })
  
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'admin@example.com' && password === 'password') {
      const userData = { 
        id: '1', 
        name: '관리자', 
        role: 'admin' 
      }
      setUser(userData)
      localStorage.setItem('token', 'fake-jwt-token')
    } else if (email === 'user@example.com' && password === 'password') {
      const userData = { 
        id: '2', 
        name: '사용자', 
        role: 'user' 
      }
      setUser(userData)
      localStorage.setItem('token', 'fake-jwt-token')
    } else {
      throw new Error('Invalid credentials')
    }
    
    setIsLoading(false)
  }
  
  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// 보호된 라우트 컴포넌트 (Vue Router의 beforeEnter와 유사)
function ProtectedRoute({ 
  allowedRoles = [] 
}: { 
  allowedRoles?: string[] 
}) {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  
  // 로딩 중
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    )
  }
  
  // 인증되지 않은 경우
  if (!user) {
    // 현재 위치를 state로 전달하여 로그인 후 돌아올 수 있도록
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  // 역할 기반 접근 제어
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  // 인증된 경우 자식 라우트 렌더링
  return <Outlet />
}

// 로그인 페이지
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // 로그인 전 페이지
  const from = location.state?.from?.pathname || '/dashboard'
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await login(email, password)
      // 이전 페이지로 돌아가기
      navigate(from, { replace: true })
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            로그인
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              테스트 계정:<br />
              관리자: admin@example.com / password<br />
              일반 사용자: user@example.com / password
            </Typography>
          </Alert>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

// 권한 없음 페이지
function UnauthorizedPage() {
  const navigate = useNavigate()
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            접근 권한이 없습니다
          </Typography>
          <Typography variant="body1" paragraph>
            이 페이지를 볼 수 있는 권한이 없습니다.
          </Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

// 관리자 전용 페이지
function AdminPage() {
  const { user } = useAuth()
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        관리자 페이지
      </Typography>
      <Typography>
        {user?.name}님, 관리자 전용 페이지에 오신 것을 환영합니다.
      </Typography>
    </Container>
  )
}

// 보호된 라우트가 포함된 앱
function ProtectedRoutesApp() {
  return (
    <AuthProvider>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* 인증 필요 라우트 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
        
        {/* 관리자 전용 라우트 */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        
        {/* 기본 리다이렉트 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
```

---

## 4. 동적 라우팅

### 이론 설명

동적 라우팅은 URL 파라미터를 통해 동적 콘텐츠를 표시합니다.

### 실습 코드

#### 4.1 동적 파라미터와 쿼리 스트링

```tsx
// React: 동적 라우팅 예제
import { 
  useParams, 
  useSearchParams, 
  useNavigate,
  Link,
  generatePath 
} from 'react-router-dom'
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Breadcrumbs
} from '@mui/material'

// 상품 타입
interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
}

// 상품 목록 페이지
function ProductList() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // 쿼리 파라미터 읽기
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'name'
  const page = parseInt(searchParams.get('page') || '1')
  
  // 샘플 데이터
  const products: Product[] = [
    {
      id: '1',
      name: '노트북',
      category: 'electronics',
      price: 1500000,
      image: '/api/placeholder/300/200',
      description: '고성능 노트북'
    },
    {
      id: '2',
      name: '마우스',
      category: 'electronics',
      price: 50000,
      image: '/api/placeholder/300/200',
      description: '무선 마우스'
    },
    {
      id: '3',
      name: '의자',
      category: 'furniture',
      price: 200000,
      image: '/api/placeholder/300/200',
      description: '사무용 의자'
    }
  ]
  
  // 필터링 및 정렬
  const filteredProducts = products
    .filter(p => category === 'all' || p.category === category)
    .sort((a, b) => {
      if (sort === 'price') return a.price - b.price
      return a.name.localeCompare(b.name)
    })
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    setSearchParams(params)
  }
  
  // 상품 상세 페이지로 이동
  const handleProductClick = (productId: string) => {
    // generatePath를 사용한 동적 경로 생성
    const path = generatePath('/products/:category/:id', {
      category: products.find(p => p.id === productId)?.category || '',
      id: productId
    })
    navigate(path)
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        상품 목록
      </Typography>
      
      {/* 필터 */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>카테고리</InputLabel>
          <Select
            value={category}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            label="카테고리"
          >
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="electronics">전자제품</MenuItem>
            <MenuItem value="furniture">가구</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>정렬</InputLabel>
          <Select
            value={sort}
            onChange={(e) => handleFilterChange({ sort: e.target.value })}
            label="정렬"
          >
            <MenuItem value="name">이름순</MenuItem>
            <MenuItem value="price">가격순</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* 현재 필터 표시 */}
      {category !== 'all' && (
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={`카테고리: ${category}`}
            onDelete={() => handleFilterChange({ category: '' })}
          />
        </Box>
      )}
      
      {/* 상품 그리드 */}
      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ₩{product.price.toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleProductClick(product.id)}
                >
                  상세보기
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* 페이지네이션 */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={10}
          page={page}
          onChange={(e, value) => handleFilterChange({ page: value.toString() })}
        />
      </Box>
    </Box>
  )
}

// 상품 상세 페이지
function ProductDetail() {
  const { category, id } = useParams() // 동적 파라미터
  const navigate = useNavigate()
  
  // 실제로는 API 호출로 데이터 가져오기
  const product = {
    id,
    name: '노트북',
    category,
    price: 1500000,
    image: '/api/placeholder/600/400',
    description: '고성능 노트북입니다.',
    specs: {
      cpu: 'Intel i7',
      ram: '16GB',
      storage: '512GB SSD'
    }
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* 브레드크럼 */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/products">상품 목록</Link>
        <Link to={`/products?category=${category}`}>
          {category}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <img 
            src={product.image} 
            alt={product.name}
            style={{ width: '100%' }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Chip label={product.category} sx={{ mb: 2 }} />
          
          <Typography variant="h5" color="primary" gutterBottom>
            ₩{product.price.toLocaleString()}
          </Typography>
          
          <Typography paragraph>
            {product.description}
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              사양
            </Typography>
            {Object.entries(product.specs).map(([key, value]) => (
              <Typography key={key} variant="body2">
                <strong>{key}:</strong> {value}
              </Typography>
            ))}
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" sx={{ mr: 2 }}>
              장바구니 담기
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              돌아가기
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

// 동적 라우트 설정
function DynamicRoutesApp() {
  return (
    <Routes>
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:category/:id" element={<ProductDetail />} />
    </Routes>
  )
}
```

---

## ⚠️ 흔한 실수와 해결 방법

### 1. 라우트 순서 문제

```tsx
// ❌ 잘못된 순서 - 구체적인 경로가 뒤에 있음
<Routes>
  <Route path="/users/*" element={<Users />} />
  <Route path="/users/new" element={<NewUser />} /> // 도달 불가능!
</Routes>

// ✅ 올바른 순서 - 구체적인 경로가 먼저
<Routes>
  <Route path="/users/new" element={<NewUser />} />
  <Route path="/users/*" element={<Users />} />
</Routes>
```

### 2. Navigate 무한 루프

```tsx
// ❌ 무한 리다이렉트
function Component() {
  return <Navigate to="/login" /> // 매번 리다이렉트
}

// ✅ 조건부 리다이렉트
function Component() {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <div>Content</div>
}
```

### 3. 중첩 라우트 Outlet 누락

```tsx
// ❌ Outlet 없음 - 중첩 라우트 렌더링 안 됨
function Layout() {
  return (
    <div>
      <Header />
      {/* Outlet이 없음! */}
    </div>
  )
}

// ✅ Outlet 포함
function Layout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* 중첩 라우트가 여기에 렌더링 */}
    </div>
  )
}
```

### 4. 라우트 파라미터 타입 체크

```tsx
// ❌ 타입 안전하지 않음
function Component() {
  const { id } = useParams() // id: string | undefined
  const userId = parseInt(id) // NaN 가능성
}

// ✅ 타입 가드 사용
function Component() {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return <div>ID가 없습니다</div>
  }
  
  const userId = parseInt(id)
  if (isNaN(userId)) {
    return <div>유효하지 않은 ID</div>
  }
  
  // 안전하게 사용
}
```

---

## 🎯 실습 과제

### 📝 과제 1: 블로그 라우팅 시스템 (난이도: ⭐)

#### 요구사항
- 블로그 포스트 목록 페이지 (`/posts`)
- 포스트 상세 페이지 (`/posts/:id`)
- 카테고리별 필터링 (쿼리 파라미터 사용)
- 브레드크럼 네비게이션

#### 구현할 라우트 구조
```
/posts (목록)
/posts/:id (상세)
/posts?category=tech (카테고리 필터)
```

---

### 📝 과제 2: 관리자 대시보드 (난이도: ⭐⭐)

#### 요구사항
- 로그인 페이지
- 보호된 대시보드 (로그인 필요)
- 역할 기반 접근 제어 (admin, user)
- 중첩 라우팅으로 레이아웃 구성

#### 구현할 라우트 구조
```
/login (공개)
/dashboard (인증 필요)
  /dashboard/overview
  /dashboard/users (admin만)
  /dashboard/profile
/unauthorized (권한 없음 페이지)
```

---

## 📌 Chapter 7 요약

### React Router v6 핵심 개념

| 개념 | Vue Router | React Router v6 |
|------|------------|-----------------|
| 라우터 설정 | `createRouter()` 객체 | `<BrowserRouter>` JSX |
| 라우트 정의 | 배열 설정 | `<Routes>`, `<Route>` |
| 중첩 라우트 | children 속성 | `<Outlet>` 컴포넌트 |
| 네비게이션 | `<router-link>` | `<Link>`, `<NavLink>` |
| 프로그래밍 방식 | `router.push()` | `useNavigate()` |
| 라우트 가드 | beforeEach, beforeEnter | 조건부 컴포넌트 |
| 동적 파라미터 | `:id` | `:id` + `useParams()` |

### 마이그레이션 체크리스트
- [ ] vue-router → react-router-dom 설치
- [ ] 라우트 설정을 JSX로 변환
- [ ] `<router-view>` → `<Outlet>`
- [ ] `<router-link>` → `<Link>`
- [ ] `useRoute()` → `useLocation()`, `useParams()`
- [ ] `router.push()` → `navigate()`
- [ ] 라우트 가드 → 보호된 라우트 컴포넌트

### 다음 장 예고
Chapter 8에서는 Material-UI를 활용한 UI 컴포넌트 개발을 학습합니다.

---

## 💬 Q&A

**Q1: Vue Router의 named routes와 같은 기능이 있나요?**
> React Router v6에는 직접적인 named routes는 없지만, 상수로 경로를 관리하거나 `generatePath` 함수를 활용할 수 있습니다.

**Q2: Vue Router의 route meta와 같은 기능은?**
> Route 컴포넌트에 custom props를 전달하거나, Context를 활용하여 구현할 수 있습니다.

**Q3: lazy loading (코드 분할)은 어떻게 하나요?**
> React.lazy()와 Suspense를 사용합니다:
```tsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

이제 React Router v6를 마스터했습니다! 🎉
