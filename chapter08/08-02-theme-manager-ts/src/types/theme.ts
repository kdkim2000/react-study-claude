// 테마 설정 타입 정의
export interface ThemeSettings {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

// 기본 테마 설정
export const defaultThemeSettings: ThemeSettings = {
  mode: 'light',
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  fontSize: 'medium',
};

// 폰트 크기 매핑
export const fontSizeMap = {
  small: 0.875,
  medium: 1,
  large: 1.125,
} as const;