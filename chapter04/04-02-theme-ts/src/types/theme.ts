// 테마 관련 타입 정의
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}