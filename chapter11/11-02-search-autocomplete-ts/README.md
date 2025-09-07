# React 실시간 검색 자동완성 시스템

## 프로젝트 개요

React와 TypeScript를 활용하여 구현한 실시간 검색 자동완성 시스템입니다. 사용자가 검색어를 입력하는 동시에 관련 결과를 실시간으로 제공하며, 최근 검색어와 인기 검색어를 localStorage에 저장하여 사용자 경험을 향상시킵니다.

## 주요 기능

### 핵심 기능
- **실시간 자동완성**: 검색어 입력 시 300ms 디바운스로 최적화된 검색
- **검색어 하이라이팅**: 정규식을 활용한 검색어 강조 표시
- **최근 검색어 관리**: localStorage를 통한 검색 이력 저장 (최대 10개)
- **인기 검색어**: 추천 검색어를 통한 빠른 접근
- **카테고리별 아이콘**: 검색 결과 타입에 따른 직관적 아이콘 표시

### 사용자 경험
- **키보드 네비게이션**: 화살표 키와 Enter로 결과 탐색
- **반응형 디자인**: 모바일/태블릿/데스크탑 환경 지원
- **로딩 상태**: 검색 중 시각적 피드백 제공
- **빈 상태 처리**: 검색 결과가 없을 때 안내 메시지

## 기술 스택

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Hooks (useState, useCallback)
- **Data Persistence**: localStorage
- **Code Quality**: ESLint (loosely configured)

## 프로젝트 구조

```
src/
├── components/                   # UI 컴포넌트
│   ├── SearchAutocomplete.tsx   # 메인 검색 자동완성 컴포넌트
│   └── RecentSearches.tsx       # 최근/인기 검색어 컴포넌트
├── hooks/                       # 커스텀 훅
│   ├── useDebounce.ts          # 디바운스 처리 훅
│   └── useSearch.ts            # 검색 로직 관리 훅
├── utils/                       # 유틸리티 함수
│   └── searchUtils.ts          # 검색 관련 헬퍼 함수
├── data/                       # 데이터
│   └── mockData.ts             # 샘플 검색 데이터
├── types/                      # TypeScript 타입 정의
│   └── index.ts                # 인터페이스 및 타입 정의
├── App.tsx                     # 루트 컴포넌트
├── main.tsx                    # 애플리케이션 진입점
└── index.css                   # 전역 스타일
```

## 설치 및 실행

### 사전 요구사항
- Node.js 16.0 이상
- npm 또는 yarn

### 설치 과정
```bash
# 1. 프로젝트 생성
npm create vite@latest search-autocomplete -- --template react-ts
cd search-autocomplete

# 2. 의존성 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# 3. 개발 의존성 설치
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-plugin-react-hooks eslint-plugin-react-refresh

# 4. 개발 서버 시작
npm run dev
```

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 핵심 구현 사항

### 1. useDebounce Hook
```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

**목적**: 사용자 입력 시 불필요한 검색 요청을 방지하여 성능 최적화

### 2. 검색어 하이라이팅
```typescript
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
```

**기능**: 정규식을 사용하여 검색어를 `<mark>` 태그로 감싸서 시각적으로 강조

### 3. localStorage 활용
```typescript
const saveSearchHistory = useCallback((recent: RecentSearch[], popular: string[]) => {
  const history: SearchHistory = {
    recentSearches: recent,
    popularSearches: popular
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}, [])
```

**데이터 영속성**: 브라우저를 닫았다 열어도 검색 이력이 유지됨

### 4. Material-UI Autocomplete 커스터마이징
- `renderOption`: 검색 결과 항목의 커스텀 렌더링
- `renderGroup`: 검색 결과 그룹 헤더 렌더링
- `getOptionLabel`: 옵션의 라벨 추출 로직
- `groupBy`: 검색 결과 그룹화 로직

## 주요 컴포넌트 설명

### SearchAutocomplete.tsx
**역할**: 메인 검색 입력 및 자동완성 기능
**핵심 기능**:
- 실시간 검색어 입력 처리
- 자동완성 결과 표시
- 카테고리별 아이콘 표시
- 검색어 하이라이팅

### RecentSearches.tsx
**역할**: 최근 검색어와 인기 검색어 관리
**핵심 기능**:
- 최근 검색어 목록 표시
- 개별/전체 삭제 기능
- 인기 검색어 순위 표시

### useSearch.ts
**역할**: 검색 관련 비즈니스 로직 중앙 관리
**핵심 기능**:
- 검색 상태 관리
- localStorage 동기화
- 검색 결과 필터링

## 타입 정의

```typescript
export interface SearchItem {
  id: string
  title: string
  description?: string
  category: SearchCategory
  popularity: number
}

export type SearchCategory = 'person' | 'place' | 'product' | 'article' | 'company'

export interface RecentSearch {
  id: string
  query: string
  timestamp: number
}
```

## 사용법

### 기본 검색
1. 검색창에 원하는 키워드 입력
2. 자동완성 목록에서 원하는 항목 선택
3. 또는 Enter 키로 검색 실행

### 키보드 단축키
- `↑↓`: 자동완성 항목 탐색
- `Enter`: 선택한 항목으로 검색
- `Esc`: 자동완성 닫기

### 검색 이력 관리
- 검색한 내용은 자동으로 최근 검색어에 저장
- 최근 검색어 우측 X 버튼으로 개별 삭제
- "전체 삭제" 버튼으로 모든 이력 삭제

## 성능 최적화

### 디바운스 적용
- 300ms 지연으로 입력 완료 후 검색 실행
- 타이핑 중 불필요한 검색 방지

### React 최적화
- `useCallback`으로 함수 메모이제이션
- `useMemo` 없이도 효율적인 렌더링 (단순한 로직)

### 데이터 제한
- 검색 결과 최대 10개 표시
- 최근 검색어 최대 10개 저장

## 커스터마이징 가이드

### 검색 결과 수 변경
```typescript
// useSearch.ts 파일에서
.slice(0, 10) // 10을 원하는 숫자로 변경
```

### 디바운스 시간 조정
```typescript
// useSearch.ts 파일에서
const debouncedSearchQuery = useDebounce(searchQuery, 300) // 300을 원하는 ms로 변경
```

### 새로운 카테고리 추가
1. `types/index.ts`에서 `SearchCategory` 타입에 추가
2. `utils/searchUtils.ts`에서 `getCategoryIcon` 함수에 아이콘 매핑 추가
3. `components/SearchAutocomplete.tsx`에서 아이콘 컴포넌트 import

### 테마 커스터마이징
```typescript
// App.tsx에서 Material-UI 테마 수정
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color', // 원하는 색상으로 변경
    },
  },
})
```

## 트러블슈팅

### React key prop 경고 해결
Material-UI Autocomplete에서 발생하는 key prop 경고는 다음과 같이 해결:
```typescript
const { key, ...otherProps } = props
return <Box key={key} {...otherProps}>
```

### localStorage 용량 제한
브라우저의 localStorage 용량 제한(보통 5-10MB)을 고려하여 데이터 크기 관리

### 검색 성능 개선
- 대용량 데이터의 경우 서버 사이드 검색 권장
- 클라이언트 사이드에서는 인덱싱 또는 검색 라이브러리 활용 고려

## 확장 아이디어

### 고급 기능
- **음성 검색**: Web Speech API 활용
- **검색 통계**: 검색 패턴 분석 및 시각화
- **개인화**: 사용자별 맞춤 검색 결과
- **다국어 지원**: i18n 라이브러리 도입

### 기술적 개선
- **가상화**: 대용량 검색 결과를 위한 react-window 적용
- **캐싱**: React Query로 서버 상태 관리
- **오프라인**: Service Worker로 오프라인 검색 지원
- **성능 모니터링**: Web Vitals 측정

### UI/UX 개선
- **다크 테마**: 사용자 설정에 따른 테마 전환
- **접근성**: ARIA 레이블 및 스크린 리더 지원 강화
- **애니메이션**: Framer Motion으로 부드러운 전환 효과
- **모바일 최적화**: 터치 제스처 및 햅틱 피드백

## 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 기여하기

1. Fork 후 브랜치 생성
2. 기능 구현 또는 버그 수정
3. 테스트 코드 작성
4. Pull Request 생성

---

**이 프로젝트는 React 초보자부터 중급자까지 실무에서 자주 사용되는 검색 기능 구현을 통해 React Hooks, TypeScript, Material-UI 활용법을 학습할 수 있도록 설계되었습니다.**