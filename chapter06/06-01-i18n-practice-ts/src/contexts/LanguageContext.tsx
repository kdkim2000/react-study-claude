import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations } from '../types/language';
import { translations, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../data/translations';

// localStorage 키
const LANGUAGE_STORAGE_KEY = 'preferred-language';

// Context 타입 정의
interface LanguageContextType {
  currentLanguage: Language;
  translations: Translations;
  changeLanguage: (language: Language) => void;
  supportedLanguages: Language[];
}

// Context 생성
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider Props 타입
interface LanguageProviderProps {
  children: ReactNode;
}

// Language Provider 컴포넌트
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // localStorage에서 저장된 언어 설정 불러오기 또는 기본값 사용
  const getInitialLanguage = (): Language => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      return SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
    } catch (error) {
      console.warn('localStorage에서 언어 설정을 불러올 수 없습니다:', error);
      return DEFAULT_LANGUAGE;
    }
  };

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);

  // 언어 변경 함수
  const changeLanguage = (language: Language) => {
    if (SUPPORTED_LANGUAGES.includes(language)) {
      setCurrentLanguage(language);
      
      // localStorage에 언어 설정 저장
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } catch (error) {
        console.warn('localStorage에 언어 설정을 저장할 수 없습니다:', error);
      }
    }
  };

  // 브라우저 언어 감지 (선택사항)
  useEffect(() => {
    // 처음 방문자의 경우 브라우저 언어 감지
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (!savedLanguage) {
      const browserLanguage = navigator.language.toLowerCase();
      
      if (browserLanguage.startsWith('ko')) {
        changeLanguage('ko');
      } else if (browserLanguage.startsWith('en')) {
        changeLanguage('en');
      }
      // 다른 언어는 기본 언어(한국어) 사용
    }
  }, []);

  // Context value
  const contextValue: LanguageContextType = {
    currentLanguage,
    translations: translations[currentLanguage],
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook: useLanguage
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

// 편의를 위한 번역 텍스트 가져오기 Hook
export const useTranslation = () => {
  const { translations } = useLanguage();
  
  // 번역 텍스트를 가져오는 함수
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        console.warn(`번역 키를 찾을 수 없습니다: ${key}`);
        return key; // 키를 그대로 반환
      }
    }
    
    return typeof result === 'string' ? result : key;
  };
  
  return { t, translations };
};