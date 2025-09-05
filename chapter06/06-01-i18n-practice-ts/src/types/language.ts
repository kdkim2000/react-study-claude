// 지원하는 언어 타입 정의
export type Language = 'ko' | 'en';

// 번역 객체의 타입 정의
export interface Translations {
  // 공통 UI
  common: {
    title: string;
    subtitle: string;
    changeLanguage: string;
    currentLanguage: string;
  };
  
  // 헤더 컴포넌트
  header: {
    welcome: string;
    description: string;
  };
  
  // 메인 컨텐츠
  main: {
    aboutTitle: string;
    aboutContent: string;
    featuresTitle: string;
    features: {
      contextApi: string;
      localStorage: string;
      typescript: string;
      materialUi: string;
    };
  };
  
  // 푸터 컴포넌트
  footer: {
    copyright: string;
    madeWith: string;
    technology: string;
  };
  
  // 언어 이름
  languages: {
    ko: string;
    en: string;
  };
}