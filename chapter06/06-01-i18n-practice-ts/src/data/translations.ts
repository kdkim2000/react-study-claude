import { Translations, Language } from '../types/language';

// 한국어 번역
const koTranslations: Translations = {
  common: {
    title: '다국어 지원 시스템',
    subtitle: 'React Context API를 활용한 국제화 실습',
    changeLanguage: '언어 변경',
    currentLanguage: '현재 언어',
  },
  header: {
    welcome: '안녕하세요! 👋',
    description: '이것은 React Context API를 사용한 다국어 지원 시스템 예제입니다.',
  },
  main: {
    aboutTitle: '프로젝트 소개',
    aboutContent: '이 프로젝트는 React의 Context API를 활용하여 다국어 지원 기능을 구현한 실습 예제입니다. 사용자는 한국어와 영어 사이를 쉽게 전환할 수 있으며, 선택한 언어 설정은 localStorage에 저장되어 다음 방문 시에도 유지됩니다.',
    featuresTitle: '주요 기능',
    features: {
      contextApi: 'Context API를 통한 전역 언어 상태 관리',
      localStorage: '언어 설정의 브라우저 저장소 저장',
      typescript: 'TypeScript로 타입 안전한 다국어 구현',
      materialUi: 'Material-UI를 활용한 아름다운 사용자 인터페이스',
    },
  },
  footer: {
    copyright: '모든 권리 보유',
    madeWith: '❤️로 만든',
    technology: 'React 다국어 지원 시스템',
  },
  languages: {
    ko: '한국어',
    en: 'English',
  },
};

// 영어 번역
const enTranslations: Translations = {
  common: {
    title: 'Internationalization System',
    subtitle: 'i18n Practice with React Context API',
    changeLanguage: 'Change Language',
    currentLanguage: 'Current Language',
  },
  header: {
    welcome: 'Hello! 👋',
    description: 'This is an example of internationalization system using React Context API.',
  },
  main: {
    aboutTitle: 'About This Project',
    aboutContent: 'This project is a practice example that implements internationalization features using React\'s Context API. Users can easily switch between Korean and English, and the selected language setting is saved in localStorage and maintained on the next visit.',
    featuresTitle: 'Key Features',
    features: {
      contextApi: 'Global language state management through Context API',
      localStorage: 'Language settings saved in browser storage',
      typescript: 'Type-safe internationalization implementation with TypeScript',
      materialUi: 'Beautiful user interface using Material-UI',
    },
  },
  footer: {
    copyright: 'All rights reserved',
    madeWith: 'Made with ❤️',
    technology: 'React Internationalization System',
  },
  languages: {
    ko: '한국어',
    en: 'English',
  },
};

// 번역 객체들을 하나로 모음
export const translations: Record<Language, Translations> = {
  ko: koTranslations,
  en: enTranslations,
};

// 기본 언어 설정
export const DEFAULT_LANGUAGE: Language = 'ko';

// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES: Language[] = ['ko', 'en'];