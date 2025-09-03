# 📄 React 페이지네이션 Hook 실습 프로젝트

React 초보자를 위한 Custom Hook 학습 프로젝트입니다. `usePagination` Hook을 직접 만들어보면서 React Hook의 개념과 페이지네이션 로직을 이해할 수 있습니다.

## 🎯 학습 목표

- **Custom Hook 개념 이해**: `usePagination` Hook을 직접 구현해보기
- **useState와 useMemo 활용**: 상태 관리와 성능 최적화 학습
- **TypeScript 기초**: 타입 정의와 인터페이스 사용법 익히기
- **Material-UI 컴포넌트**: 현대적인 UI 라이브러리 사용 경험
- **재사용 가능한 로직**: Hook을 통한 코드 재사용성 향상

## 🚀 실행 방법

### 1. 프로젝트 생성 및 설치
```bash
# Vite로 프로젝트 생성
npm create vite@latest pagination-practice -- --template react-swc-ts
cd pagination-practice

# 의존성 설치
npm install

# Material-UI 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 결과를 확인할 수 있습니다.

### 3. 기타 명령어
```bash
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npm run preview  # 빌드 결과 미리보기
```

## 📁 프로젝트 구조

```
pagination-practice/
├── src/
│   ├── hooks/
│   │   └── usePagination.ts    # 📝 페이지네이션 Hook (핵심 파일)
│   ├── App.tsx                 # 🏠 메인 컴포넌트
│   ├── main.tsx                # 🔧 앱 진입점 및 Material-UI 설정
│   └── vite-env.d.ts          # 📋 Vite 타입 정의
├── package.json                # 📦 프로젝트 설정 및 의존성
├── tsconfig.json              # ⚙️ TypeScript 설정
├── vite.config.ts             # ⚡ Vite 빌드 도구 설정
├── eslint.config.js           # 📏 코드 품질 검사 설정
└── index.html                 # 🌐 HTML 진입점
```

## 🔧 핵심 구현 사항

### 1. usePagination Hook (`src/hooks/usePagination.ts`)

```typescript
interface UsePaginationOptions {
  totalPages: number;     // 전체 페이지 수
  initialPage?: number;   // 초기 페이지 (기본값: 1)
}

interface UsePaginationReturn {
  currentPage: number;         // 현재 페이지
  totalPages: number;          // 전체 페이지 수
  hasNextPage: boolean;        // 다음 페이지 존재 여부
  hasPreviousPage: boolean;    // 이전 페이지 존재 여부
  goToPage: (page: number) => void;  // 특정 페이지로 이동
  nextPage: () => void;        // 다음 페이지로 이동
  previousPage: () => void;    // 이전 페이지로 이동
  firstPage: () => void;       // 첫 페이지로 이동
  lastPage: () => void;        // 마지막 페이지로 이동
}
```

**주요 기능:**
- ✅ 경계값 체크 (1보다 작거나 totalPages보다 큰 페이지로 이동 방지)
- ✅ useMemo를 활용한 성능 최적화
- ✅ TypeScript로 타입 안전성 보장
- ✅ 다양한 페이지 이동 방법 제공

### 2. Material-UI 스타일링

- **컴포넌트**: Container, Typography, Box, Paper, Pagination
- **테마**: Primary color (#1976d2), 커스텀 폰트 설정
- **반응형**: 모바일부터 데스크톱까지 대응

### 3. TypeScript 설정

- **엄격 모드**: 타입 안전성 보장
- **느슨한 ESLint**: 학습에 집중할 수 있도록 경고 수준 완화
- **SWC 컴파일러**: 빠른 개발 경험

## 💡 학습 포인트

### Hook 사용법 이해하기
```typescript
// Hook 사용 예시
const {
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  goToPage,
} = usePagination({
  totalPages: Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE),
  initialPage: 1,
});
```

### 상태 관리와 최적화
- `useState`로 현재 페이지 상태 관리
- `useMemo`로 계산된 값 캐싱하여 불필요한 재계산 방지
- 경계값 체크로 안전한 페이지 이동 보장

### Material-UI와의 통합
```typescript
<Pagination
  count={pages}
  page={currentPage}
  onChange={handlePageChange}
  color="primary"
  size="large"
  showFirstButton
  showLastButton
/>
```

## 🎨 실행 결과

프로젝트를 실행하면 다음과 같은 기능을 확인할 수 있습니다:

1. **아이템 목록**: 50개 아이템을 페이지당 5개씩 표시
2. **페이지네이션**: Material-UI Pagination 컴포넌트
3. **상태 표시**: 현재 페이지, 전체 페이지, 이전/다음 페이지 존재 여부
4. **반응형 디자인**: 다양한 화면 크기에 대응

## 🔄 확장 가능한 기능들

이 프로젝트를 기반으로 다음과 같은 기능들을 추가로 구현해볼 수 있습니다:

- [ ] 페이지 크기 변경 기능 (페이지당 아이템 수 조절)
- [ ] URL과 연동하여 페이지 상태 유지
- [ ] 검색 기능과 페이지네이션 연동
- [ ] 무한 스크롤 방식으로 변경
- [ ] 페이지네이션 애니메이션 효과
- [ ] 키보드 단축키 지원 (←, → 키로 페이지 이동)

## 📚 참고 자료

- [React Hooks 공식 문서](https://ko.react.dev/reference/react)
- [Material-UI 공식 문서](https://mui.com/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Vite 공식 문서](https://vitejs.dev/)

## 🤝 기여하기

이 프로젝트는 교육 목적으로 만들어졌습니다. 개선 사항이나 버그를 발견하시면 이슈를 등록해 주세요!

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**Happy Coding! 🚀**

*React Hook을 마스터하여 더 나은 개발자가 되어보세요!*