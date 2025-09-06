# 📝 React Board Frontend

> **React + TypeScript + Material-UI + Vite 기반 게시판 프론트엔드**

## 🚀 빠른 시작

### 📋 사전 요구사항
- **Node.js 18+**
- **npm 8+**
- **백엔드 서버** (http://localhost:8080)

### ⚡ 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 🎉 완료! http://localhost:5173에서 확인
```

## 🛠 기술 스택

- **React 18** - 최신 React 버전
- **TypeScript** - 타입 안정성
- **Material-UI (MUI)** - 구글 Material Design
- **Vite** - 빠른 개발 서버
- **@vitejs/plugin-react-swc** - 고성능 컴파일러
- **Axios** - HTTP 클라이언트
- **ESLint** - 느슨한 설정으로 초보자 친화적

## 🎯 구현된 기능

### ✅ **핵심 기능**
- 📋 게시글 목록 조회 (페이지네이션)
- 👁 게시글 상세 조회
- ✍️ 게시글 작성
- ✏️ 게시글 수정
- 🗑 게시글 삭제

### 🎨 **UI/UX 특징**
- **Material Design 3.0** 적용
- **반응형 디자인** - 모바일/데스크톱 호환
- **Floating Action Button** - 직관적인 글쓰기
- **로딩 상태 표시** - 사용자 경험 향상
- **에러 처리** - 친화적인 에러 메시지
- **미리보기 기능** - 작성 전 내용 확인
- **키보드 단축키** - Ctrl+Enter로 저장

### 🔧 **개발자 편의 기능**
- **TypeScript 타입 안전성**
- **실시간 API 로깅**
- **백엔드 연결 상태 확인**
- **느슨한 ESLint** - 학습 중심

## 📁 프로젝트 구조

```
frontend/
├── 📂 src/
│   ├── 📂 components/           # React 컴포넌트
│   │   ├── 📋 PostList.tsx     # 게시글 목록
│   │   ├── 👁 PostDetail.tsx   # 게시글 상세
│   │   └── ✏️ PostForm.tsx     # 게시글 작성/수정
│   ├── 📂 services/
│   │   └── 🌐 api.ts           # API 서비스
│   ├── 📂 types/
│   │   └── 📋 index.ts         # TypeScript 타입
│   ├── 🏠 App.tsx               # 메인 앱
│   └── 🚀 main.tsx             # 엔트리 포인트
├── 📦 package.json             # 프로젝트 설정
├── ⚙️ vite.config.ts          # Vite 설정
├── 🎨 .eslintrc.cjs           # ESLint 설정 (느슨함)
├── 📝 tsconfig.json           # TypeScript 설정
└── 🌐 index.html              # HTML 템플릿
```

## 🌐 API 연동

### Backend API URL
- **개발 환경**: http://localhost:8080/api
- **프록시 설정**: Vite의 proxy로 자동 연동

### 지원하는 엔드포인트
```typescript
// 게시글 목록 (페이지네이션)
GET /api/posts?page=0&size=10

// 게시글 상세
GET /api/posts/:id

// 게시글 작성
POST /api/posts

// 게시글 수정  
PUT /api/posts/:id

// 게시글 삭제
DELETE /api/posts/:id
```

## 🎓 학습 포인트

### 🔥 **React 핵심 개념**
```typescript
// useState로 상태 관리
const [posts, setPosts] = useState<Post[]>([]);

// useEffect로 생명주기 관리
useEffect(() => {
  loadPosts();
}, []);

// 이벤트 핸들링
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // 폼 처리 로직
};
```

### 💪 **TypeScript 활용**
```typescript
// 인터페이스 정의
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// 제네릭 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}
```

### 🎨 **Material-UI 컴포넌트**
```typescript
// 카드 기반 레이아웃
<Card elevation={2}>
  <CardContent>
    <Typography variant="h6">{post.title}</Typography>
  </CardContent>
</Card>

// 폼 컴포넌트
<TextField
  fullWidth
  label="제목"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

### 🌐 **HTTP 통신**
```typescript
// Axios 인스턴스
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// API 호출
const posts = await postApi.getPosts(page, size);
```

## 🔧 개발 스크립트

| 명령어 | 설명 |
|-------|------|
| `npm run dev` | 개발 서버 실행 (http://localhost:5173) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드된 앱 미리보기 |
| `npm run lint` | ESLint 검사 |

## 🐛 문제 해결

### CORS 에러
- 백엔드에서 CORS가 설정되어 있는지 확인
- Vite proxy 설정이 올바른지 확인

### 백엔드 연결 오류
```bash
# 백엔드 서버가 실행 중인지 확인
curl http://localhost:8080/health

# 브라우저 개발자 도구에서 네트워크 탭 확인
```

### 타입 에러
- TypeScript 타입 정의 확인
- Backend API 응답 형식과 일치하는지 확인

## 🚀 향후 확장 계획

- [ ] **무한 스크롤** - 페이지네이션 대신
- [ ] **검색 기능** - 실시간 검색
- [ ] **댓글 시스템** - 게시글별 댓글
- [ ] **다크 모드** - 테마 토글
- [ ] **PWA** - 오프라인 지원
- [ ] **이미지 업로드** - 파일 첨부
- [ ] **마크다운 지원** - 리치 에디터

## 💡 초보자를 위한 팁

### 1. **컴포넌트 이해하기**
- 각 컴포넌트는 하나의 책임만 가져야 함
- Props로 데이터를 전달하고 State로 상태 관리

### 2. **타입스크립트 활용**
- 인터페이스로 데이터 구조 명확히 정의
- IDE의 자동완성과 오류 검출 활용

### 3. **디버깅 방법**
- 브라우저 개발자 도구 적극 활용
- console.log로 데이터 흐름 추적
- React Developer Tools 설치 권장

### 4. **성능 최적화**
- 불필요한 리렌더링 방지
- useEffect 의존성 배열 주의
- 이미지 최적화

---

🎉 **Happy Coding with React!**