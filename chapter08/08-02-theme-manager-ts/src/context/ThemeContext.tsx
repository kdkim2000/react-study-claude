import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeSettings, defaultThemeSettings, fontSizeMap } from '../types/theme';

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 커스텀 훅: 테마 컨텍스트 사용
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// LocalStorage 키
const THEME_STORAGE_KEY = 'theme-settings';

// 테마 설정을 localStorage에서 불러오기
const loadThemeFromStorage = (): ThemeSettings => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return { ...defaultThemeSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return defaultThemeSettings;
};

// 테마 설정을 localStorage에 저장
const saveThemeToStorage = (settings: ThemeSettings) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(loadThemeFromStorage);

  // 설정 변경 시 localStorage에 저장
  useEffect(() => {
    saveThemeToStorage(settings);
  }, [settings]);

  // 설정 업데이트
  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // 설정 초기화
  const resetSettings = () => {
    setSettings(defaultThemeSettings);
  };

  // 설정 내보내기
  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  // 설정 가져오기
  const importSettings = (settingsJson: string) => {
    try {
      const imported = JSON.parse(settingsJson);
      const validSettings = { ...defaultThemeSettings, ...imported };
      setSettings(validSettings);
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  };

  // Material-UI 테마 생성
  const muiTheme = createTheme({
    palette: {
      mode: settings.mode,
      primary: {
        main: settings.primaryColor,
      },
      secondary: {
        main: settings.secondaryColor,
      },
    },
    typography: {
      fontSize: 14 * fontSizeMap[settings.fontSize],
      body1: {
        fontSize: `${fontSizeMap[settings.fontSize]}rem`,
      },
      body2: {
        fontSize: `${fontSizeMap[settings.fontSize] * 0.875}rem`,
      },
      h6: {
        fontSize: `${fontSizeMap[settings.fontSize] * 1.25}rem`,
      },
    },
  });

  const contextValue: ThemeContextType = {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};