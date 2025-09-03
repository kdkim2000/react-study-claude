import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeContextType, ThemeProviderProps } from '../types/theme';

// 1. Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Context Provider 컴포넌트
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  // 3. 페이지 로드 시 localStorage에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme) {
      setMode(savedTheme);
    } else {
      // 시스템 기본 테마 감지
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      setMode(systemTheme);
    }
  }, []);

  // 4. 테마 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  // 5. 테마 토글 함수
  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  // 6. Context 값
  const value: ThemeContextType = {
    mode,
    toggleTheme,
    isDarkMode: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 7. 커스텀 훅 - Context를 쉽게 사용하기 위함
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  // Context 외부에서 사용하려고 할 때 에러 표시
  if (!context) {
    throw new Error('useTheme은 ThemeProvider 내부에서만 사용할 수 있습니다.');
  }
  
  return context;
};