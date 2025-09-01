# React 실시간 검색 컴포넌트

React 초보자를 위한 실시간 검색 기능 구현 예제입니다. 디바운스(Debounce), 상태 관리, 비동기 처리 등의 핵심 개념을 학습할 수 있습니다.

## 🔍 검색 사용법

### 검색 가능한 데이터
이 예제에는 **100개의 프로그래밍 관련 자료**가 포함되어 있습니다:

| 카테고리 | 개수 | 예시 |
|---------|------|------|
| **프로그래밍** | 20개 | React, JavaScript, Python, Java, C++ |
| **웹 개발** | 20개 | HTML5, CSS3, Angular, Vue.js, Next.js |
| **백엔드** | 15개 | Node.js, Django, Spring Boot, Express |
| **데이터베이스** | 15개 | MySQL, MongoDB, PostgreSQL, Redis |
| **도구** | 15개 | Git, Docker, Kubernetes, VS Code |
| **데이터 과학** | 15개 | 머신러닝, TensorFlow, Pandas, NumPy |

### 검색 방법
1. **제목으로 검색**: `React`, `Python`, `Docker` 등
2. **설명으로 검색**: `API`, `데이터베이스`, `프레임워크` 등  
3. **카테고리로 검색**: `프로그래밍`, `웹 개발`, `백엔드` 등

### 추천 검색어
```
React          → React 기초, React Hooks 관련 자료
JavaScript     → ES6, Node.js, 웹 개발 관련 자료
데이터베이스     → MySQL, MongoDB, PostgreSQL 등
머신러닝        → TensorFlow, PyTorch, Pandas 등
클라우드        → AWS, Docker, Kubernetes 등
```

## 🎯 학습 목표

- **useState**: 여러 상태를 효율적으로 관리하는 방법
- **useEffect**: 사이드 이펙트와 디바운스 구현
- **useRef**: DOM 요소가 아닌 값을 저장하는 방법
- **비동기 처리**: Promise를 사용한 API 호출 시뮬레이션
- **컴포넌트 분리**: 재사용 가능한 컴포넌트 설계
- **TypeScript**: React에서 타입 안전성 확보

## 🚀 프로젝트 실행

### 1. 프로젝트 생성
```bash
npm create vite@latest realtime-search -- --template react-ts
cd realtime-search
npm install
```

### 2. 의존성 설치
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @vitejs/plugin-react-swc
```

### 3. 개발 서버 시작
```bash
npm run dev
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트들
│   ├── RealtimeSearch.tsx    # 메인 검색 컴포넌트
│   ├── SearchHistory.tsx     # 검색 기록 컴포넌트
│   └── SearchResults.tsx     # 검색 결과 컴포넌트
├── types/              # TypeScript 타입 정의
│   └── search.ts
├── data/               # 더미 데이터
│   └── mockData.ts
├── App.tsx            # 루트 컴포넌트
└── main.tsx          # 앱 진입점
```

## 🔑 핵심 기능

### 1. 디바운스 (Debounce)
사용자가 입력을 멈춘 후 0.5초 뒤에 검색을 실행합니다.

```typescript
// 타이머 ID를 저장하기 위한 ref
const debounceTimer = useRef<NodeJS.Timeout | null>(null);

// 디바운스를 적용한 검색
useEffect(() => {
  // 이전 타이머가 있으면 취소
  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }

  // 새로운 타이머 설정 (0.5초 후 실행)
  debounceTimer.current = setTimeout(() => {
    performSearch(query);
  }, 500);

  // 정리 함수
  return () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };
}, [query]);
```

**왜 디바운스가 필요한가요?**
- 사용자가 타이핑할 때마다 API를 호출하면 서버에 부하가 걸립니다
- 불필요한 네트워크 요청을 줄여 성능을 향상시킵니다

### 2. 상태 관리
여러 상태를 `useState`로 관리합니다.

```typescript
const [query, setQuery] = useState('');                    // 검색어
const [results, setResults] = useState<SearchResult[]>([]); // 검색 결과
const [history, setHistory] = useState<string[]>([]);      // 검색 기록
const [isLoading, setIsLoading] = useState(false);         // 로딩 상태
const [showResults, setShowResults] = useState(false);     // 결과 표시 여부
```

### 3. 검색 기록 관리
최대 5개의 검색 기록을 저장하고 중복을 제거합니다.

```typescript
// 검색 기록에 추가 (중복 제거, 최대 5개)
setHistory(prev => {
  const newHistory = prev.filter(item => item !== searchQuery);
  return [searchQuery, ...newHistory].slice(0, 5);
});
```

### 4. 비동기 처리
실제 API 호출을 시뮬레이션하는 함수입니다.

```typescript
export const searchMockData = (query: string): Promise<SearchResult[]> => {
  return new Promise((resolve) => {
    // API 호출을 시뮬레이션하기 위한 지연
    setTimeout(() => {
      const results = mockData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 300); // 300ms 지연으로 네트워크 요청 시뮬레이션
  });
};
```

## 🧩 컴포넌트 분석

### RealtimeSearch.tsx (메인 컴포넌트)
**역할**: 전체적인 검색 로직을 관리하는 컨테이너 컴포넌트

**주요 기능**:
- 검색어 입력 처리
- 디바운스 적용
- 검색 실행 및 결과 관리
- 검색 기록 관리

**핵심 Hook 사용**:
- `useState`: 상태 관리
- `useEffect`: 디바운스 구현
- `useRef`: 타이머 ID 저장

### SearchHistory.tsx (검색 기록)
**역할**: 검색 기록을 표시하고 관리하는 프레젠테이션 컴포넌트

**주요 기능**:
- 최근 검색어 목록 표시
- 검색어 재입력 기능
- 개별/전체 삭제 기능

### SearchResults.tsx (검색 결과)
**역할**: 검색 결과를 사용자 친화적으로 표시하는 컴포넌트

**주요 기능**:
- 검색 결과 리스트 표시
- 결과 없음 상태 처리
- 카테고리 태그 표시

## 💡 학습 포인트

### 1. useRef의 활용
```typescript
const debounceTimer = useRef<NodeJS.Timeout | null>(null);
```
- **DOM 조작이 아닌 값 저장용**으로 `useRef` 사용
- 리렌더링 시에도 값이 유지됨
- 타이머 ID 같은 값을 저장할 때 유용

### 2. useEffect의 정리 함수
```typescript
useEffect(() => {
  // 실행 로직
  return () => {
    // 정리 로직 (cleanup)
  };
}, [dependency]);
```
- 메모리 누수를 방지하기 위해 타이머를 정리
- 컴포넌트 언마운트 시 실행됨

### 3. 조건부 렌더링
```typescript
{!query && !showResults && (
  <SearchHistory ... />
)}

{showResults && query && (
  <SearchResults ... />
)}
```
- 상태에 따라 다른 컴포넌트를 표시
- `&&` 연산자를 활용한 간단한 조건부 렌더링

### 4. 이벤트 버블링 방지
```typescript
onClick={(e) => {
  e.stopPropagation();
  onHistoryDelete(query);
}}
```
- 부모 요소의 클릭 이벤트가 실행되는 것을 방지
- UX 개선을 위한 중요한 기법

## 🛠 기술 스택

- **React 18**: 최신 React 기능 사용
- **TypeScript**: 타입 안전성 확보
- **Material-UI**: 일관성 있는 UI 컴포넌트
- **Vite**: 빠른 개발 서버
- **@vitejs/plugin-react-swc**: 최적화된 빌드

## 🎨 사용자 경험 (UX)

1. **즉시 피드백**: 입력과 동시에 로딩 표시
2. **검색 기록**: 이전 검색어 재사용 가능
3. **명확한 상태**: 검색 중, 결과 있음/없음 구분
4. **직관적 인터페이스**: Material-UI의 일관성 있는 디자인

## 🔍 확장 아이디어

1. **실제 API 연동**: 실제 검색 API와 연결
2. **무한 스크롤**: 검색 결과가 많을 때 페이징 처리
3. **검색어 하이라이트**: 검색어를 결과에서 강조 표시
4. **카테고리 필터**: 검색 결과를 카테고리별로 필터링
5. **검색 기록 저장**: localStorage를 이용한 영구 저장

## 📚 추가 학습 자료

- [React Hooks 공식 문서](https://reactjs.org/docs/hooks-intro.html)
- [TypeScript React 가이드](https://react-typescript-cheatsheet.netlify.app/)
- [Material-UI 컴포넌트](https://mui.com/components/)
- [디바운스와 스로틀링](https://webclub.tistory.com/607)

---

이 프로젝트는 React의 핵심 개념들을 실제 사용 사례를 통해 학습할 수 있도록 설계되었습니다. 코드를 직접 실행해보고 수정해보며 React의 동작 방식을 이해해보세요! 🚀