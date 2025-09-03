import { useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 더미 사용자 정보
      const userData: User = {
        id: '1',
        email: credentials.email,
        name: '김사용자',
      };
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: '로그인에 실패했습니다.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
  };
};