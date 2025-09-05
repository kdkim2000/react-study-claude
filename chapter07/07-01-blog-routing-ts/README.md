# 📝 React Router 블로그 라우팅 시스템

React 초보자를 위한 React Router v6 활용 실습 프로젝트입니다. SPA(Single Page Application)의 핵심인 클라이언트 사이드 라우팅을 구현하면서 동적 라우트, 쿼리 파라미터, 브레드크럼 네비게이션 등 실무에서 필수적인 라우팅 기능들을 학습할 수 있습니다.

## 🎯 학습 목표

- **React Router v6 마스터**: 최신 버전의 React Router 핵심 기능 이해
- **동적 라우팅**: URL 파라미터를 활용한 동적 페이지 구현
- **쿼리 파라미터 활용**: 필터링과 검색 기능을 위한 URL 상태 관리
- **브레드크럼 네비게이션**: 사용자 위치 안내와 편리한 네비게이션 제공
- **SPA 아키텍처**: 페이지 새로고침 없는 매끄러운 사용자 경험
- **SEO 친화적 URL**: 의미 있는 URL 구조 설계

## 🚀 실행 방법

### 1. 프로젝트 생성 및 설치
```bash
# Vite로 프로젝트 생성
npm create vite@latest blog-routing-practice -- --template react-swc-ts
cd blog-routing-practice

# 의존성 설치
npm install

# 필수 패키지 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom
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
blog-routing-practice/
├── src/
│   ├── types/
│   │   └── blog.ts                 # 🔤 블로그 관련 타입 정의
│   ├── data/
│   │   └── blogPosts.ts            # 📚 샘플 블로그 데이터 및 유틸리티
│   ├── components/
│   │   ├── Breadcrumb.tsx          # 🧭 브레드크럼 네비게이션 (핵심)
│   │   ├── PostCard.tsx            # 📄 개별 포스트 카드
│   │   └── CategoryFilter.tsx      # 🏷️ 카테고리 필터링 (핵심)
│   ├── pages/
│   │   ├── HomePage.tsx            # 🏠 홈 페이지
│   │   ├── PostsPage.tsx           # 📜 포스트 목록 페이지 (핵심)
│   │   └── PostDetailPage.tsx      # 📖 포스트 상세 페이지 (핵심)
│   ├── App.tsx                     # 🛣️ 라우터 설정 (핵심)
│   ├── main.tsx                    # 🔧 앱 진입점 및 테마 설정
│   └── vite-env.d.ts              # 📋 Vite 타입 정의
├── package.json                    # 📦 프로젝트 설정 및 의존성
├── tsconfig.json                   # ⚙️ TypeScript 설정
├── vite.config.ts                  # ⚡ Vite 빌드 도구 설정
├── eslint.config.js                # 📏 코드 품질 검사 설정
└── index.html                      # 🌐 HTML 진입점
```

## 🛣️ 라우트 구조 (요구사항 완벽 구현)

### 📊 구현된 라우트들
```typescript
// 기본 라우트
/ (홈페이지)
/posts (포스트 목록)
/posts/:id (포스트 상세)

// 쿼리 파라미터를 활용한 필터링
/posts?category=tech (기술 포스트)
/posts?category=design (디자인 포스트)
/posts?category=business (비즈니스 포스트)
/posts?category=life (라이프 포스트)
/posts?category=travel (여행 포스트)
```

### 🔧 라우터 설정 (`src/App.tsx`)
```typescript
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="*" element={<PostsPage />} />
      </Routes>
    </Router>
  );
};
```

## 🔧 핵심 구현 사항

### 1. 동적 라우팅 (`/posts/:id`)

#### 🎛️ URL 파라미터 처리
```typescript
// PostDetailPage.tsx
const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // URL에서 id 추출
  const post = getPostById(id || '');          // 해당 ID의 포스트 조회
  
  if (!post) {
    return <Navigate to="/posts" replace />;   // 404 처리
  }
  
  return <PostDetail post={post} />;
};
```

#### 🔗 동적 링크 생성
```typescript
// PostCard.tsx
<Button
  component={RouterLink}
  to={`/posts/${post.id}`}          // 동적 URL 생성
  variant="contained"
>
  자세히 보기
</Button>
```

### 2. 쿼리 파라미터 활용 (`?category=tech`)

#### 📋 쿼리 파라미터 읽기/쓰기
```typescript
// CategoryFilter.tsx
const CategoryFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleCategoryChange = (category: string | null) => {
    if (category) {
      setSearchParams({ category });           // ?category=tech 설정
    } else {
      setSearchParams({});                     // 쿼리 파라미터 제거
    }
  };

  return (
    <Chip 
      onClick={() => handleCategoryChange('tech')}
      color={currentCategory === 'tech' ? 'primary' : 'default'}
    />
  );
};
```

#### 🔄 URL과 UI 상태 동기화
```typescript
// PostsPage.tsx
const PostsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  // URL의 쿼리 파라미터에 따라 포스트 필터링
  const posts = getPostsByCategory(categoryFilter);
  
  return <PostList posts={posts} />;
};
```

### 3. 브레드크럼 네비게이션 시스템

#### 🧭 동적 브레드크럼 생성
```typescript
// Breadcrumb.tsx
const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: '홈', path: '/', icon: <HomeIcon /> }
    ];

    // URL 경로 분석
    if (pathSegments.includes('posts')) {
      items.push({ label: '블로그 포스트', path: '/posts' });
      
      // 카테고리 필터 감지
      const category = new URLSearchParams(location.search).get('category');
      if (category) {
        const categoryInfo = getCategoryInfo(category);
        items.push({ label: categoryInfo?.label || '카테고리' });
      }
      
      // 포스트 상세 페이지 감지
      const postId = pathSegments[pathSegments.length - 1];
      if (postId !== 'posts') {
        items.push({ label: `포스트 #${postId}` });
      }
    }

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();
  // 브레드크럼 렌더링...
};
```

### 4. 선언적 네비게이션

#### 🔗 Link 컴포넌트 활용
```typescript
// 기본 링크
<Link component={RouterLink} to="/posts">
  포스트 보기
</Link>

// 쿼리 파라미터가 포함된 링크
<Link component={RouterLink} to="/posts?category=tech">
  기술 포스트
</Link>

// 동적 링크
<Link component={RouterLink} to={`/posts/${post.id}`}>
  {post.title}
</Link>
```

#### 🎯 프로그래밍 방식 네비게이션
```typescript
const navigate = useNavigate();

// 페이지 이동
const handleGoToPost = (postId: string) => {
  navigate(`/posts/${postId}`);
};

// 뒤로 가기
const handleGoBack = () => {
  navigate(-1);
};

// 리다이렉트 (replace)
const handleRedirect = () => {
  navigate('/posts', { replace: true });
};
```

## 💡 고급 학습 포인트

### 🔄 React Router v6 vs v5 주요 변화

| 기능 | React Router v5 | React Router v6 |
|------|----------------|-----------------|
| 라우트 정의 | `<Route path="/posts/:id" component={PostDetail} />` | `<Route path="/posts/:id" element={<PostDetail />} />` |
| 중첩 라우팅 | Switch + Route | Routes + Route |
| 네비게이션 | useHistory | useNavigate |
| 라우트 매칭 | 부분 매칭 | **정확한 매칭** |
| 쿼리 파라미터 | useLocation + 수동 파싱 | **useSearchParams** |

### 🛠️ React Router v6 핵심 Hook들

#### 1. useParams - URL 파라미터 추출
```typescript
// URL: /posts/123
const { id } = useParams<{ id: string }>();
console.log(id); // "123"
```

#### 2. useSearchParams - 쿼리 파라미터 관리
```typescript
// URL: /posts?category=tech&page=2
const [searchParams, setSearchParams] = useSearchParams();

const category = searchParams.get('category'); // "tech"
const page = searchParams.get('page'); // "2"

// 쿼리 파라미터 변경
setSearchParams({ category: 'design', page: '1' });
// 결과: /posts?category=design&page=1
```

#### 3. useLocation - 현재 위치 정보
```typescript
const location = useLocation();

console.log(location.pathname);  // "/posts/123"
console.log(location.search);    // "?category=tech"
console.log(location.hash);      // "#comments"
console.log(location.state);     // 전달된 state 객체
```

#### 4. useNavigate - 프로그래밍 네비게이션
```typescript
const navigate = useNavigate();

// 기본 이동
navigate('/posts');

// 쿼리 파라미터와 함께 이동
navigate('/posts?category=tech');

// state와 함께 이동
navigate('/posts/123', { state: { from: 'home' } });

// 히스토리 조작
navigate(-1);        // 뒤로 가기
navigate(1);         // 앞으로 가기
navigate('/', { replace: true }); // 현재 히스토리 대체
```

### 🎨 사용자 경험(UX) 최적화

#### 1. 로딩 상태 처리
```typescript
const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const postData = await getPostById(id);
      setPost(postData);
      setLoading(false);
    };
    
    fetchPost();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!post) return <NotFound />;
  
  return <PostDetail post={post} />;
};
```

#### 2. 404 에러 처리
```typescript
// App.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/posts" element={<PostsPage />} />
  <Route path="/posts/:id" element={<PostDetailPage />} />
  <Route path="*" element={<NotFoundPage />} />  {/* 모든 미매칭 라우트 */}
</Routes>
```

#### 3. 메타 정보 관리
```typescript
const PostDetailPage: React.FC = () => {
  const post = getPostById(id);
  
  useEffect(() => {
    // 페이지별 타이틀 변경
    document.title = `${post.title} - React Router 블로그`;
    
    // 메타 태그 업데이트 (SEO)
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', post.excerpt);
    }
  }, [post]);
  
  return <PostDetail post={post} />;
};
```

## 🎨 실행 결과

프로젝트를 실행하면 다음과 같은 완전한 블로그 시스템을 확인할 수 있습니다:

### 📱 주요 기능들
- **홈페이지**: 블로그 소개와 최근 포스트 미리보기
- **포스트 목록**: 카드 형태의 포스트 목록과 카테고리 필터
- **포스트 상세**: 마크다운 스타일의 풀 콘텐츠 보기
- **브레드크럼**: 현재 위치 표시와 편리한 네비게이션
- **카테고리 필터링**: URL 기반 필터 상태 관리

### 🎯 URL 패턴 예시
```
/ (홈페이지)
/posts (전체 포스트)
/posts?category=tech (기술 포스트만)
/posts?category=design (디자인 포스트만)
/posts/1 (첫 번째 포스트 상세)
/posts/2 (두 번째 포스트 상세)
```

### 🧭 브레드크럼 예시
```
홈
홈 > 블로그 포스트
홈 > 블로그 포스트 > 기술 (카테고리 필터링 시)
홈 > 블로그 포스트 > 포스트 #1 (상세 페이지)
```

## 🔄 확장 가능한 기능들

이 프로젝트를 기반으로 다음과 같은 고급 기능들을 추가로 구현해볼 수 있습니다:

### 🛣️ 라우팅 고도화
- [ ] **중첩 라우팅**: Layout 컴포넌트와 Outlet 활용
- [ ] **보호된 라우트**: 인증이 필요한 페이지 구현
- [ ] **지연 로딩**: React.lazy와 Suspense를 활용한 코드 스플리팅
- [ ] **라우트 가드**: 페이지 이동 전 조건 확인
- [ ] **동적 라우트 생성**: 파일 기반 라우팅 시스템

### 📊 검색 및 필터링
- [ ] **전체 텍스트 검색**: 제목, 내용, 태그 검색
- [ ] **고급 필터**: 날짜, 작성자, 읽는 시간별 필터
- [ ] **정렬 기능**: 최신순, 인기순, 알파벳순 정렬
- [ ] **무한 스크롤**: 페이지네이션 대신 스크롤 기반 로딩
- [ ] **검색 하이라이트**: 검색어 강조 표시

### 🎨 사용자 경험 향상
- [ ] **페이지 전환 애니메이션**: Framer Motion 활용
- [ ] **스크롤 복원**: 뒤로가기 시 이전 스크롤 위치 복원
- [ ] **즐겨찾기**: 관심 포스트 북마크 기능
- [ ] **다크 모드**: 테마 전환과 URL 상태 유지
- [ ] **읽기 진행률**: 긴 포스트의 읽기 진행도 표시

### 🔍 SEO 최적화
- [ ] **메타 태그**: 동적 메타 정보 생성
- [ ] **Open Graph**: 소셜 미디어 공유 최적화
- [ ] **사이트맵**: 검색 엔진 크롤링 지원
- [ ] **구조화된 데이터**: JSON-LD 스키마 추가

## 🔧 문제 해결 가이드

### 자주 발생하는 이슈들

1. **라우트가 작동하지 않는 문제**
   ```typescript
   // ❌ 잘못된 방법
   <div onClick={() => window.location.href = '/posts'}>
   
   // ✅ 올바른 방법
   <Button component={RouterLink} to="/posts">
   // 또는
   const navigate = useNavigate();
   navigate('/posts');
   ```

2. **새로고침 시 404 오류**
   ```typescript
   // Vite 개발 서버 설정 (vite.config.ts)
   export default defineConfig({
     server: {
       historyApiFallback: true, // SPA 라우팅 지원
     },
   });
   
   // 프로덕션 배포 시 서버 설정 필요
   // Nginx: try_files $uri $uri/ /index.html;
   ```

3. **쿼리 파라미터 타입 에러**
   ```typescript
   // ❌ 잘못된 타입 처리
   const category: string = searchParams.get('category');
   
   // ✅ 올바른 null 체크
   const category = searchParams.get('category');
   if (category) {
     // category는 string 타입으로 좁혀짐
   }
   ```

4. **브레드크럼이 업데이트되지 않는 문제**
   ```typescript
   // useLocation을 의존성 배열에 포함
   useEffect(() => {
     generateBreadcrumbs();
   }, [location.pathname, location.search]);
   ```

## 📚 참고 자료

### 📖 공식 문서
- [React Router v6 공식 문서](https://reactrouter.com/) - 최신 기능과 API 가이드
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial) - 단계별 학습 가이드
- [Material-UI Navigation](https://mui.com/material-ui/react-breadcrumbs/) - UI 컴포넌트 활용법

### 🛣️ 라우팅 심화 학습
- [React Router Migration Guide](https://reactrouter.com/en/main/upgrading/v5) - v5에서 v6로 마이그레이션
- [Nested Routing](https://reactrouter.com/en/main/start/concepts#nested-routes) - 중첩 라우팅 패턴
- [Code Splitting](https://reactjs.org/docs/code-splitting.html) - 라우트 기반 코드 스플리팅

### 🎨 UX 패턴
- [Navigation Best Practices](https://www.nngroup.com/articles/navigation-design/) - 네비게이션 디자인 원칙
- [Breadcrumb Guidelines](https://www.nngroup.com/articles/breadcrumbs/) - 브레드크럼 사용 가이드

## 🤝 기여하기

이 프로젝트는 교육 목적으로 만들어졌습니다. 다음과 같은 기여를 환영합니다:

- 🐛 **버그 리포트**: 라우팅 이슈나 UI 문제 보고
- 📖 **문서 개선**: README나 코드 주석 향상
- ✨ **기능 추가**: 새로운 라우팅 패턴이나 네비게이션 개선
- 🧪 **테스트 코드**: 라우팅 로직 테스트 추가
- 🎨 **UI/UX 개선**: 더 나은 사용자 경험 제안

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**Happy Routing! 🛣️**

*React Router로 매끄럽고 직관적인 SPA 네비게이션을 마스터하여 전문적인 웹 애플리케이션을 만들어보세요!*

## 💭 학습 후 다음 단계

이 프로젝트를 완료한 후에는 다음과 같은 고급 주제들을 학습해보세요:

### 🚀 고급 라우팅 패턴
1. **중첩 라우팅**: Layout 기반 라우트 구조 설계
2. **라우트 기반 코드 스플리팅**: 성능 최적화
3. **동적 라우트 생성**: 파일 기반 또는 API 기반 라우팅
4. **라우트 가드와 미들웨어**: 인증, 권한 체크

### 🔄 상태 관리와 라우팅
1. **URL 상태 동기화**: 복잡한 필터와 검색 상태 관리
2. **히스토리 조작**: 사용자 플로우 최적화
3. **라우트 기반 데이터 페칭**: 각 라우트별 데이터 로딩 전략

### 🌐 실제 배포와 SEO
1. **서버 사이드 렌더링**: Next.js와 함께 사용하는 라우팅
2. **정적 사이트 생성**: Gatsby 또는 Next.js Static Export
3. **SEO 최적화**: 메타 태그, 사이트맵, 구조화된 데이터