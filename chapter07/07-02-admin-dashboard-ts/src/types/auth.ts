// 사용자 역할 타입
export type UserRole = 'admin' | 'user';

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// 로그인 요청 데이터
export interface LoginRequest {
  email: string;
  password: string;
}

// 인증 컨텍스트 타입
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
}

// 보호된 라우트 Props
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}