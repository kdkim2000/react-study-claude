import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, AuthContextType } from '../types/auth';
import { authenticateUser } from '../data/mockUsers';

// 로컬 스토리지 키
const AUTH_STORAGE_KEY = 'dashboard-auth';

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props 타입
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 저장된 인증 정보 복원
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
          const userData = JSON.parse(savedAuth);
          setUser(userData);
        }
      } catch (error) {
        console.warn('인증 정보 복원 실패:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 로그인 함수
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const authenticatedUser = await authenticateUser(credentials);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook: useAuth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};