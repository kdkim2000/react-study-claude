# Chapter 10: Spring Boot 연동

## 📚 학습 목표
- Vue3와 React의 API 통신 패턴 비교
- Axios를 활용한 효율적인 API 통신 구현
- JWT 기반 인증/인가 처리
- 체계적인 에러 핸들링 시스템 구축

---

## 1. Axios 설정

### 이론 설명 (30%)

Axios는 Vue3와 React 모두에서 사용하는 HTTP 클라이언트 라이브러리입니다. 설정과 사용 방법은 거의 동일하지만, 상태 관리와 생명주기 처리 방식이 다릅니다.

#### Vue3 vs React API 통신 비교

| 특징 | Vue3 | React |
|------|------|-------|
| Axios 설정 | 동일 | 동일 |
| 상태 관리 | `ref`, `reactive` | `useState` |
| 생명주기 | `onMounted` | `useEffect` |
| 에러 처리 | try-catch | try-catch + Error Boundary |
| 로딩 상태 | `ref<boolean>` | `useState<boolean>` |
| 데이터 캐싱 | 수동 또는 Pinia | 수동 또는 React Query |

### 실습 코드 (70%)

#### 1.1 Axios 기본 설정

```bash
# Axios 설치
npm install axios
npm install @types/axios -D
```

```typescript
// src/api/axios.config.ts - Axios 인스턴스 설정
import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios'

// API 응답 타입
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

// API 에러 타입
interface ApiError {
  code: string
  message: string
  details?: any
}

// Axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 전송 허용
})

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 토큰 추가
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 요청 로깅 (개발 환경)
    if (import.meta.env.DEV) {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, config.data)
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 응답 로깅 (개발 환경)
    if (import.meta.env.DEV) {
      console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.config.url}`, response.data)
    }
    
    // API 응답 구조에 따라 data 추출
    return response
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    
    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // 리프레시 토큰으로 액세스 토큰 갱신
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        })
        
        const { accessToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)
        
        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // 리프레시 실패 - 로그인 페이지로
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    // 에러 로깅
    if (import.meta.env.DEV) {
      console.error(`❌ [${error.config?.method?.toUpperCase()}] ${error.config?.url}`, error.response?.data)
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance
export type { ApiResponse, ApiError }
```

```vue
<!-- Vue3 비교: axios.config.ts -->
<script lang="ts">
import axios, { AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 요청/응답 인터셉터 설정 (React와 동일)
axiosInstance.interceptors.request.use(/* ... */)
axiosInstance.interceptors.response.use(/* ... */)

export default axiosInstance
</script>
```

#### 1.2 환경별 설정

```typescript
// src/config/environment.ts - 환경별 설정
interface EnvironmentConfig {
  apiBaseUrl: string
  apiTimeout: number
  enableLogging: boolean
  enableMockData: boolean
}

const config: Record<string, EnvironmentConfig> = {
  development: {
    apiBaseUrl: 'http://localhost:8080/api',
    apiTimeout: 10000,
    enableLogging: true,
    enableMockData: true,
  },
  staging: {
    apiBaseUrl: 'https://staging-api.example.com/api',
    apiTimeout: 15000,
    enableLogging: true,
    enableMockData: false,
  },
  production: {
    apiBaseUrl: 'https://api.example.com/api',
    apiTimeout: 10000,
    enableLogging: false,
    enableMockData: false,
  },
}

const environment = import.meta.env.MODE || 'development'

export default config[environment]
```

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=My App (Dev)

# .env.staging
VITE_API_BASE_URL=https://staging-api.example.com/api
VITE_APP_TITLE=My App (Staging)

# .env.production
VITE_API_BASE_URL=https://api.example.com/api
VITE_APP_TITLE=My App
```

---

## 2. API 통신 패턴

### 실습 코드

#### 2.1 API 서비스 계층

```typescript
// src/api/services/user.service.ts - API 서비스 클래스
import axiosInstance, { ApiResponse } from '../axios.config'

// 사용자 타입 정의
export interface User {
  id: number
  username: string
  email: string
  name: string
  role: 'ADMIN' | 'USER' | 'GUEST'
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  username: string
  email: string
  password: string
  name: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
}

export interface UserListParams {
  page?: number
  size?: number
  sort?: string
  search?: string
  role?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// API 서비스 클래스
class UserService {
  private readonly basePath = '/users'
  
  // 사용자 목록 조회
  async getUsers(params?: UserListParams): Promise<PageResponse<User>> {
    const response = await axiosInstance.get<ApiResponse<PageResponse<User>>>(
      this.basePath,
      { params }
    )
    return response.data.data
  }
  
  // 사용자 상세 조회
  async getUser(id: number): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      `${this.basePath}/${id}`
    )
    return response.data.data
  }
  
  // 사용자 생성
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      this.basePath,
      data
    )
    return response.data.data
  }
  
  // 사용자 수정
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      `${this.basePath}/${id}`,
      data
    )
    return response.data.data
  }
  
  // 사용자 삭제
  async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`)
  }
  
  // 프로필 이미지 업로드
  async uploadAvatar(userId: number, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
      `${this.basePath}/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data.url
  }
  
  // CSV 다운로드
  async downloadUsersCSV(): Promise<Blob> {
    const response = await axiosInstance.get(
      `${this.basePath}/export`,
      {
        responseType: 'blob',
      }
    )
    return response.data
  }
}

export default new UserService()
```

#### 2.2 Custom Hook으로 API 호출

```typescript
// src/hooks/useApi.ts - API 호출 Custom Hook
import { useState, useEffect, useCallback } from 'react'
import { AxiosError } from 'axios'
import { ApiError } from '@/api/axios.config'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiOptions {
  immediate?: boolean  // 컴포넌트 마운트 시 즉시 실행
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
}

// GET 요청용 Hook
export function useApiGet<T = any>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })
  
  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await apiCall()
      setState({ data, loading: false, error: null })
      onSuccess?.(data)
      return data
    } catch (error) {
      const apiError = (error as AxiosError<ApiError>).response?.data || {
        code: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류가 발생했습니다.',
      }
      setState({ data: null, loading: false, error: apiError })
      onError?.(apiError)
      throw error
    }
  }, [apiCall, onSuccess, onError])
  
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [])
  
  return {
    ...state,
    refetch: execute,
  }
}

// POST, PUT, DELETE 요청용 Hook
export function useApiMutation<TData = any, TVariables = any>(
  apiCall: (variables: TVariables) => Promise<TData>,
  options: Omit<UseApiOptions, 'immediate'> = {}
) {
  const { onSuccess, onError } = options
  
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  })
  
  const execute = useCallback(async (variables: TVariables) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await apiCall(variables)
      setState({ data, loading: false, error: null })
      onSuccess?.(data)
      return data
    } catch (error) {
      const apiError = (error as AxiosError<ApiError>).response?.data || {
        code: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류가 발생했습니다.',
      }
      setState({ data: null, loading: false, error: apiError })
      onError?.(apiError)
      throw error
    }
  }, [apiCall, onSuccess, onError])
  
  return {
    ...state,
    mutate: execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  }
}
```

```vue
<!-- Vue3 비교: composables/useApi.ts -->
<script lang="ts">
import { ref, Ref } from 'vue'
import { AxiosError } from 'axios'

interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  execute: () => Promise<void>
}

export function useApi<T>(
  apiCall: () => Promise<T>
): UseApiReturn<T> {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  const execute = async () => {
    loading.value = true
    error.value = null
    
    try {
      data.value = await apiCall()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
  
  return {
    data,
    loading,
    error,
    execute
  }
}
</script>
```

#### 2.3 컴포넌트에서 API 사용

```tsx
// React: API 사용 예제 컴포넌트
import React, { useState } from 'react'
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Skeleton,
  Snackbar,
  CircularProgress,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import userService, { User, CreateUserDto, UpdateUserDto } from '@/api/services/user.service'
import { useApiGet, useApiMutation } from '@/hooks/useApi'
import { useForm } from 'react-hook-form'

function UserManagement() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  })
  
  // 사용자 목록 조회
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useApiGet(
    () => userService.getUsers({
      page,
      size: rowsPerPage,
      sort: 'createdAt,desc'
    }),
    {
      onError: (error) => {
        showSnackbar('사용자 목록 조회 실패: ' + error.message, 'error')
      }
    }
  )
  
  // 사용자 생성
  const {
    loading: createLoading,
    mutate: createUser
  } = useApiMutation(
    (data: CreateUserDto) => userService.createUser(data),
    {
      onSuccess: () => {
        showSnackbar('사용자가 생성되었습니다', 'success')
        refetchUsers()
        handleCloseDialog()
      },
      onError: (error) => {
        showSnackbar('사용자 생성 실패: ' + error.message, 'error')
      }
    }
  )
  
  // 사용자 수정
  const {
    loading: updateLoading,
    mutate: updateUser
  } = useApiMutation(
    ({ id, data }: { id: number; data: UpdateUserDto }) => 
      userService.updateUser(id, data),
    {
      onSuccess: () => {
        showSnackbar('사용자가 수정되었습니다', 'success')
        refetchUsers()
        handleCloseDialog()
      },
      onError: (error) => {
        showSnackbar('사용자 수정 실패: ' + error.message, 'error')
      }
    }
  )
  
  // 사용자 삭제
  const {
    loading: deleteLoading,
    mutate: deleteUser
  } = useApiMutation(
    (id: number) => userService.deleteUser(id),
    {
      onSuccess: () => {
        showSnackbar('사용자가 삭제되었습니다', 'success')
        refetchUsers()
      },
      onError: (error) => {
        showSnackbar('사용자 삭제 실패: ' + error.message, 'error')
      }
    }
  )
  
  // 폼 설정
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CreateUserDto | UpdateUserDto>()
  
  // 다이얼로그 열기
  const handleOpenDialog = (user?: User) => {
    if (user) {
      // 수정 모드
      setIsEditMode(true)
      setSelectedUser(user)
      setValue('name', user.name)
      setValue('email', user.email)
      setValue('username', user.username)
    } else {
      // 생성 모드
      setIsEditMode(false)
      setSelectedUser(null)
      reset()
    }
    setOpenDialog(true)
  }
  
  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false)
    reset()
  }
  
  // 폼 제출
  const onSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    if (isEditMode && selectedUser) {
      await updateUser({ id: selectedUser.id, data })
    } else {
      await createUser(data as CreateUserDto)
    }
  }
  
  // 삭제 확인
  const handleDelete = async (user: User) => {
    if (window.confirm(`${user.name}님을 삭제하시겠습니까?`)) {
      await deleteUser(user.id)
    }
  }
  
  // 페이지 변경
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }
  
  // 페이지 크기 변경
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  
  // 스낵바 표시
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }
  
  // 역할별 색상
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error'
      case 'USER': return 'primary'
      default: return 'default'
    }
  }
  
  // 로딩 상태
  if (usersLoading && !usersData) {
    return (
      <Container>
        <Paper sx={{ p: 3 }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} height={60} sx={{ my: 1 }} />
          ))}
        </Paper>
      </Container>
    )
  }
  
  // 에러 상태
  if (usersError) {
    return (
      <Container>
        <Alert severity="error">
          {usersError.message}
          <Button onClick={refetchUsers} sx={{ ml: 2 }}>
            재시도
          </Button>
        </Alert>
      </Container>
    )
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">
            사용자 관리
          </Typography>
          <Box>
            <IconButton onClick={refetchUsers} disabled={usersLoading}>
              <RefreshIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              사용자 추가
            </Button>
          </Box>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>사용자명</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>역할</TableCell>
                <TableCell>생성일</TableCell>
                <TableCell align="center">액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData?.content.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleOpenDialog(user)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user)}
                      size="small"
                      color="error"
                      disabled={deleteLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={usersData?.totalElements || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행:"
        />
      </Paper>
      
      {/* 사용자 생성/수정 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {isEditMode ? '사용자 수정' : '사용자 생성'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="사용자명"
              margin="normal"
              disabled={isEditMode}
              error={!!errors.username}
              helperText={errors.username?.message}
              {...register('username', {
                required: '사용자명은 필수입니다',
                minLength: {
                  value: 3,
                  message: '최소 3자 이상 입력하세요'
                }
              })}
            />
            <TextField
              fullWidth
              label="이름"
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', {
                required: '이름은 필수입니다'
              })}
            />
            <TextField
              fullWidth
              label="이메일"
              type="email"
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
            {!isEditMode && (
              <TextField
                fullWidth
                label="비밀번호"
                type="password"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                  required: '비밀번호는 필수입니다',
                  minLength: {
                    value: 8,
                    message: '최소 8자 이상 입력하세요'
                  }
                })}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>취소</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createLoading || updateLoading}
            >
              {createLoading || updateLoading ? (
                <CircularProgress size={24} />
              ) : (
                isEditMode ? '수정' : '생성'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default UserManagement
```

---

## 3. 인증/인가 처리

### 실습 코드

#### 3.1 인증 서비스

```typescript
// src/api/services/auth.service.ts - 인증 API 서비스
import axiosInstance, { ApiResponse } from '../axios.config'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: {
    id: number
    username: string
    name: string
    email: string
    role: string
  }
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  name: string
}

class AuthService {
  // 로그인
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    )
    
    const data = response.data.data
    
    // 토큰 저장
    this.saveTokens(data.accessToken, data.refreshToken)
    
    return data
  }
  
  // 회원가입
  async register(data: RegisterRequest): Promise<void> {
    await axiosInstance.post('/auth/register', data)
  }
  
  // 로그아웃
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout')
    } finally {
      this.clearTokens()
    }
  }
  
  // 토큰 갱신
  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    )
    
    const { accessToken } = response.data.data
    this.saveAccessToken(accessToken)
    
    return accessToken
  }
  
  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<LoginResponse['user']> {
    const response = await axiosInstance.get<ApiResponse<LoginResponse['user']>>(
      '/auth/me'
    )
    return response.data.data
  }
  
  // 비밀번호 변경
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await axiosInstance.post('/auth/change-password', {
      oldPassword,
      newPassword
    })
  }
  
  // 토큰 관리 메서드
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }
  
  saveAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken)
  }
  
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }
  
  clearTokens(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
  
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }
}

export default new AuthService()
```

#### 3.2 인증 Context와 Provider

```tsx
// src/contexts/AuthContext.tsx - 인증 Context
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import authService, { LoginRequest, LoginResponse, RegisterRequest } from '@/api/services/auth.service'

interface AuthContextType {
  user: LoginResponse['user'] | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  
  // 로그인
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      navigate('/dashboard')
    } catch (error) {
      throw error
    }
  }
  
  // 회원가입
  const register = async (data: RegisterRequest) => {
    try {
      await authService.register(data)
      // 회원가입 후 자동 로그인
      await login({
        username: data.username,
        password: data.password
      })
    } catch (error) {
      throw error
    }
  }
  
  // 로그아웃
  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      navigate('/login')
    }
  }
  
  // 인증 상태 확인
  const checkAuth = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null)
      setIsLoading(false)
      return
    }
    
    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (error) {
      authService.clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 초기 인증 확인
  useEffect(() => {
    checkAuth()
  }, [])
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

#### 3.3 보호된 라우트 컴포넌트

```tsx
// src/components/ProtectedRoute.tsx - 인가 처리
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { CircularProgress, Box } from '@mui/material'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

function ProtectedRoute({ 
  children, 
  allowedRoles = [],
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  
  // 로딩 중
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }
  
  // 인증되지 않은 경우
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }
  
  // 역할 확인
  if (allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />
    }
  }
  
  return <>{children}</>
}

export default ProtectedRoute
```

---

## 4. 에러 핸들링

### 실습 코드

#### 4.1 전역 에러 핸들러

```typescript
// src/utils/errorHandler.ts - 에러 처리 유틸리티
import { AxiosError } from 'axios'
import { ApiError } from '@/api/axios.config'

export class AppError extends Error {
  code: string
  details?: any
  
  constructor(message: string, code: string = 'APP_ERROR', details?: any) {
    super(message)
    this.code = code
    this.details = details
    this.name = 'AppError'
  }
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError
    
    // HTTP 상태 코드별 처리
    switch (error.response?.status) {
      case 400:
        return new AppError(
          apiError?.message || '잘못된 요청입니다',
          'BAD_REQUEST',
          apiError?.details
        )
      
      case 401:
        return new AppError(
          '인증이 필요합니다',
          'UNAUTHORIZED'
        )
      
      case 403:
        return new AppError(
          '접근 권한이 없습니다',
          'FORBIDDEN'
        )
      
      case 404:
        return new AppError(
          '요청한 리소스를 찾을 수 없습니다',
          'NOT_FOUND'
        )
      
      case 409:
        return new AppError(
          apiError?.message || '중복된 데이터가 존재합니다',
          'CONFLICT',
          apiError?.details
        )
      
      case 422:
        return new AppError(
          '입력 데이터가 올바르지 않습니다',
          'VALIDATION_ERROR',
          apiError?.details
        )
      
      case 500:
        return new AppError(
          '서버 오류가 발생했습니다',
          'INTERNAL_SERVER_ERROR'
        )
      
      case 503:
        return new AppError(
          '서비스를 일시적으로 사용할 수 없습니다',
          'SERVICE_UNAVAILABLE'
        )
      
      default:
        return new AppError(
          apiError?.message || '알 수 없는 오류가 발생했습니다',
          apiError?.code || 'UNKNOWN_ERROR'
        )
    }
  }
  
  // 네트워크 에러
  if (error instanceof AxiosError && !error.response) {
    return new AppError(
      '네트워크 연결을 확인해주세요',
      'NETWORK_ERROR'
    )
  }
  
  // 일반 에러
  if (error instanceof Error) {
    return new AppError(error.message, 'GENERAL_ERROR')
  }
  
  return new AppError('알 수 없는 오류가 발생했습니다', 'UNKNOWN_ERROR')
}

// 에러 메시지 포맷팅
export function formatErrorMessage(error: AppError): string {
  if (error.code === 'VALIDATION_ERROR' && error.details) {
    // 검증 에러 상세 메시지 생성
    const messages = Object.entries(error.details)
      .map(([field, message]) => `${field}: ${message}`)
      .join('\n')
    return messages || error.message
  }
  
  return error.message
}
```

#### 4.2 Error Boundary

```tsx
// src/components/ErrorBoundary.tsx - React Error Boundary
import React, { Component, ReactNode } from 'react'
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Alert
} from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 서비스로 전송
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Sentry, LogRocket 등 에러 추적 서비스 연동
    if (import.meta.env.PROD) {
      // logErrorToService(error, errorInfo)
    }
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }
      
      return (
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
          >
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" color="error" gutterBottom>
                오류가 발생했습니다
              </Typography>
              
              <Alert severity="error" sx={{ my: 2 }}>
                {this.state.error?.message || '알 수 없는 오류가 발생했습니다'}
              </Alert>
              
              {import.meta.env.DEV && this.state.error && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="caption" component="pre" sx={{ textAlign: 'left' }}>
                    {this.state.error.stack}
                  </Typography>
                </Box>
              )}
              
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleReset}
                sx={{ mt: 2 }}
              >
                다시 시도
              </Button>
            </Paper>
          </Box>
        </Container>
      )
    }
    
    return this.props.children
  }
}

export default ErrorBoundary
```

#### 4.3 에러 알림 시스템

```tsx
// src/contexts/NotificationContext.tsx - 알림 시스템
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Snackbar, Alert, AlertProps } from '@mui/material'

interface Notification {
  id: string
  message: string
  severity: AlertProps['severity']
  duration?: number
}

interface NotificationContextType {
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const addNotification = (
    message: string,
    severity: AlertProps['severity'],
    duration: number = 6000
  ) => {
    const id = Date.now().toString()
    const notification: Notification = { id, message, severity, duration }
    
    setNotifications(prev => [...prev, notification])
    
    // 자동 제거
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  const showSuccess = (message: string, duration?: number) => {
    addNotification(message, 'success', duration)
  }
  
  const showError = (message: string, duration?: number) => {
    addNotification(message, 'error', duration)
  }
  
  const showWarning = (message: string, duration?: number) => {
    addNotification(message, 'warning', duration)
  }
  
  const showInfo = (message: string, duration?: number) => {
    addNotification(message, 'info', duration)
  }
  
  return (
    <NotificationContext.Provider
      value={{ showSuccess, showError, showWarning, showInfo }}
    >
      {children}
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          sx={{ top: `${(index + 1) * 65}px !important` }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
```

---

## ⚠️ 흔한 실수와 해결 방법

### 1. useEffect에서 async 함수 직접 사용

```tsx
// ❌ 잘못된 코드
useEffect(async () => {
  const data = await api.getData()
  setData(data)
}, [])

// ✅ 올바른 코드
useEffect(() => {
  const fetchData = async () => {
    const data = await api.getData()
    setData(data)
  }
  fetchData()
}, [])
```

### 2. 에러 처리 누락

```tsx
// ❌ 에러 처리 없음
const fetchData = async () => {
  const data = await api.getData()
  setData(data)
}

// ✅ 적절한 에러 처리
const fetchData = async () => {
  try {
    setLoading(true)
    const data = await api.getData()
    setData(data)
  } catch (error) {
    setError(handleApiError(error))
    showError('데이터 로드 실패')
  } finally {
    setLoading(false)
  }
}
```

### 3. 메모리 누수 (cleanup 누락)

```tsx
// ❌ cleanup 없음
useEffect(() => {
  let timer = setTimeout(() => {
    fetchData()
  }, 1000)
}, [])

// ✅ cleanup 추가
useEffect(() => {
  let timer = setTimeout(() => {
    fetchData()
  }, 1000)
  
  return () => clearTimeout(timer)  // cleanup
}, [])
```

### 4. Race Condition

```tsx
// ❌ Race condition 발생 가능
useEffect(() => {
  fetchData().then(setData)
}, [id])

// ✅ AbortController 사용
useEffect(() => {
  const controller = new AbortController()
  
  fetchData({ signal: controller.signal })
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') {
        setError(err)
      }
    })
  
  return () => controller.abort()
}, [id])
```

---

## 🎯 실습 과제

### 📝 과제 1: 게시판 API 연동 (난이도: ⭐)

#### 요구사항
- 게시글 목록 조회 (페이지네이션)
- 게시글 상세 조회
- 게시글 작성/수정/삭제
- 로딩 및 에러 처리
- Material-UI 테이블 사용

#### API 엔드포인트
```
GET    /api/posts?page=0&size=10
GET    /api/posts/:id
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id
```

---

### 📝 과제 2: 실시간 알림 시스템 (난이도: ⭐⭐)

#### 요구사항
- WebSocket 연결 관리
- 실시간 알림 수신
- 알림 목록 표시
- 읽음/안읽음 처리
- 알림 설정 (on/off)

#### 구현할 기능
- WebSocket Hook 작성
- 알림 Context 구현
- 알림 UI 컴포넌트
- 자동 재연결 로직

---

## 📌 Chapter 10 요약

### API 통신 체크리스트

- [ ] Axios 인스턴스 설정
- [ ] Request/Response 인터셉터
- [ ] API 서비스 레이어 구성
- [ ] Custom Hook 작성
- [ ] 로딩/에러 상태 관리
- [ ] 토큰 관리 시스템
- [ ] 에러 핸들링 전략

### Spring Boot 연동 핵심

| 구성 요소 | 역할 | 파일 위치 |
|----------|------|----------|
| Axios Config | HTTP 클라이언트 설정 | `/api/axios.config.ts` |
| API Service | API 호출 로직 | `/api/services/*.ts` |
| Custom Hook | 컴포넌트 로직 | `/hooks/useApi.ts` |
| Auth Context | 인증 상태 관리 | `/contexts/AuthContext.tsx` |
| Error Handler | 에러 처리 | `/utils/errorHandler.ts` |

### 베스트 프랙티스

1. **API 서비스 분리**: 도메인별로 서비스 클래스 생성
2. **타입 정의**: Request/Response DTO 타입 정의
3. **에러 처리**: 일관된 에러 처리 패턴
4. **로딩 상태**: 사용자 피드백 제공
5. **캐싱**: 필요시 React Query 도입 검토

### 다음 장 예고
Chapter 11에서는 CRUD 애플리케이션을 구현합니다.

---

## 💬 Q&A

**Q1: Vue3의 Axios 플러그인처럼 전역 설정이 가능한가요?**
> React는 플러그인 시스템이 없지만, Axios 인스턴스를 export하여 전역으로 사용할 수 있습니다.

**Q2: Vuex/Pinia처럼 API 상태를 전역으로 관리하려면?**
> Zustand나 React Query를 사용하면 전역 API 상태 관리가 가능합니다.

**Q3: API 호출 시 매번 try-catch를 써야 하나요?**
> Custom Hook으로 추상화하거나 React Query를 사용하면 보일러플레이트를 줄일 수 있습니다.

이제 Spring Boot와의 API 연동을 마스터했습니다! 🎉
