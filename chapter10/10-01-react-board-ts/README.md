# 📝 Chapter 10-1: React + Node.js 게시판 프로젝트

> **React 초보자를 위한 풀스택 웹 개발 실습 프로젝트**  
> Node.js 백엔드와 React 프론트엔드를 연동하는 완전한 게시판 애플리케이션

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-5.14.17-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

**🎯 실습 과제 1: 게시판 API 연동 (난이도: ⭐)**

</div>

## 📋 프로젝트 개요

이 프로젝트는 **React 초보자**가 실제 백엔드와 연동하는 웹 애플리케이션을 구축하면서 **현대적인 웹 개발**을 학습할 수 있도록 설계된 **Chapter 10-1: Node.js 연동** 실습 과제입니다.

### 🎓 학습 목표
- **React Hooks** (useState, useEffect)를 활용한 상태 관리
- **TypeScript**를 사용한 타입 안전성 확보
- **RESTful API** 설계 및 구현 이해
- **Node.js + Express.js** 백엔드 개발 경험
- **Material-UI**를 활용한 현대적 UI 개발
- **프론트엔드와 백엔드 통합** 개발 경험

### 🏗 프로젝트 구조

```
react-board-project/
├── 🌐 frontend/                  # React + TypeScript + Material-UI
│   ├── 📂 src/
│   │   ├── 📂 components/        # React 컴포넌트
│   │   │   ├── 📋 PostList.tsx   # 게시글 목록 (페이지네이션)
│   │   │   ├── 👁 PostDetail.tsx  # 게시글 상세보기
│   │   │   └── ✏️ PostForm.tsx   # 게시글 작성/수정 폼
│   │   ├── 📂 services/
│   │   │   └── 🌐 api.ts         # API 통신 서비스
│   │   ├── 📂 types/
│   │   │   └── 📋 index.ts       # TypeScript 타입 정의
│   │   ├── 🏠 App.tsx             # 메인 앱 컴포넌트
│   │   └── 🚀 main.tsx           # 애플리케이션 엔트리 포인트
│   ├── 📦 package.json
│   ├── ⚙️ vite.config.ts        # Vite 설정 (@vitejs/plugin-react-swc)
│   └── 🎨 .eslintrc.cjs         # 느슨한 ESLint 설정
├── 🔧 backend/                   # Node.js + Express.js + File DB
│   ├── 📂 src/
│   │   ├── 🏠 server.js          # Express 서버
│   │   ├── 📂 controllers/       # API 컨트롤러
│   │   ├── 📂 services/          # 비즈니스 로직
│   │   ├── 📂 routes/            # API 라우팅
│   │   ├── 📂 middleware/        # 미들웨어 (검증, 에러처리)
│   │   └── 📂 database/          # 파일 기반 데이터베이스
│   ├── 📦 package.json
│   └── 🗃 data/posts.json       # JSON 파일 데이터베이스
└── 📖 README.md                 # 이 파일
```

## ✨ 구현된 기능

<table>
<tr>
<td valign="top" width="50%">

### 🌐 **Frontend (React)**
- ✅ **게시글 목록 조회** (페이지네이션)
- ✅ **게시글 상세 조회** 
- ✅ **게시글 작성** (제목, 내용, 작성자)
- ✅ **게시글 수정** (제목, 내용만)
- ✅ **게시글 삭제** (확인 다이얼로그)
- ✅ **로딩 상태 표시**
- ✅ **에러 처리** (친화적 메시지)
- ✅ **반응형 디자인**
- ✅ **미리보기 기능**
- ✅ **키보드 단축키** (Ctrl+Enter)

</td>
<td valign="top" width="50%">

### 🔧 **Backend (Node.js)**
- ✅ **RESTful API** 설계
- ✅ **파일 기반 데이터베이스** (JSON)
- ✅ **입력 데이터 검증** (Joi)
- ✅ **CORS 처리**
- ✅ **에러 처리 미들웨어**
- ✅ **로깅 시스템**
- ✅ **자동 샘플 데이터** 생성
- ✅ **헬스체크 엔드포인트**
- ✅ **보안 헤더** (Helmet)

</td>
</tr>
</table>

## 🛠 기술 스택

<div align="center">

### Frontend Technology Stack

| 기술 | 버전 | 역할 |
|------|------|------|
| **React** | 18.2.0 | UI 라이브러리 |
| **TypeScript** | 5.2.2 | 타입 안정성 |
| **Material-UI** | 5.14.17 | UI 컴포넌트 라이브러리 |
| **Vite** | 5.0.0 | 빌드 도구 |
| **@vitejs/plugin-react-swc** | 3.5.0 | 고성능 컴파일러 |
| **Axios** | 1.6.0 | HTTP 클라이언트 |
| **ESLint** | 8.53.0 | 코드 품질 (느슨한 설정) |

### Backend Technology Stack

| 기술 | 버전 | 역할 |
|------|------|------|
| **Node.js** | 18+ | JavaScript 런타임 |
| **Express.js** | 4.18.2 | 웹 프레임워크 |
| **File Database** | JSON | 데이터 저장소 |
| **Joi** | 17.11.0 | 데이터 검증 |
| **CORS** | 2.8.5 | 교차 출처 요청 처리 |
| **Helmet** | 7.1.0 | 보안 헤더 |
| **Morgan** | 1.10.0 | HTTP 로깅 |

</div>

## 🚀 빠른 시작

### 📋 사전 요구사항
- **Node.js 18+** 설치
- **npm 8+** 설치
- **코드 에디터** (VS Code 권장)

### ⚡ 1분 만에 시작하기

```bash
# 1. 프로젝트 클론 또는 다운로드
git clone <repository-url>
cd react-board-project

# 2. 백엔드 서버 실행 (터미널 1)
cd backend
npm install
npm run dev

# 3. 프론트엔드 서버 실행 (터미널 2)
cd ../frontend
npm install
npm run dev

# 🎉 완료!
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

### 🌐 접속 주소

| 서비스 | URL | 설명 |
|--------|-----|------|
| 🌐 **프론트엔드** | http://localhost:5173 | React 개발 서버 |
| 🔧 **백엔드 API** | http://localhost:8080/api | REST API 엔드포인트 |
| 💊 **헬스체크** | http://localhost:8080/health | 서버 상태 확인 |
| 📄 **API 문서** | http://localhost:8080 | API 정보 및 사용법 |

## 📡 API 명세

### 🔗 엔드포인트 목록

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| 🔍 `GET` | `/api/posts?page=0&size=10` | 게시글 목록 조회 (페이지네이션) | - |
| 👁 `GET` | `/api/posts/:id` | 게시글 상세 조회 | - |
| ✍️ `POST` | `/api/posts` | 게시글 작성 | `{title, content, author}` |
| ✏️ `PUT` | `/api/posts/:id` | 게시글 수정 | `{title, content}` |
| 🗑 `DELETE` | `/api/posts/:id` | 게시글 삭제 | - |

### 📝 API 사용 예시

<details>
<summary><strong>🔽 cURL 명령어 예시</strong></summary>

**게시글 목록 조회:**
```bash
curl "http://localhost:8080/api/posts?page=0&size=5"
```

**게시글 작성:**
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "첫 번째 게시글",
    "content": "React와 Node.js를 연동한 게시판입니다!",
    "author": "개발자"
  }'
```

**게시글 상세 조회:**
```bash
curl http://localhost:8080/api/posts/1
```

**게시글 수정:**
```bash
curl -X PUT http://localhost:8080/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "수정된 제목",
    "content": "수정된 내용입니다."
  }'
```

**게시글 삭제:**
```bash
curl -X DELETE http://localhost:8080/api/posts/1
```

</details>

### 📊 응답 형식

<details>
<summary><strong>🔽 JSON 응답 예시</strong></summary>

**게시글 목록 응답:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "React 학습 가이드",
      "content": "React를 처음 배우는 사람들을 위한...",
      "author": "김개발",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalElements": 12,
  "totalPages": 2,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false
}
```

**에러 응답:**
```json
{
  "error": "Validation Error",
  "message": "입력 데이터가 유효하지 않습니다.",
  "details": [
    {
      "field": "title",
      "message": "제목은 필수입니다."
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

</details>

## 🎓 학습 포인트

### 🔥 **React 핵심 개념**

<details>
<summary><strong>🔽 상태 관리와 생명주기</strong></summary>

```typescript
// useState로 상태 관리
const [posts, setPosts] = useState<PageResponse<Post> | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string>('');

// useEffect로 생명주기 관리
useEffect(() => {
  loadPosts(page);
}, [page]);

// 이벤트 핸들링
const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
  setPage(value - 1);
};
```

</details>

### 💪 **TypeScript 활용**

<details>
<summary><strong>🔽 타입 정의와 안정성</strong></summary>

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

// 제네릭 타입 활용
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

// 함수 타입 정의
const loadPosts = async (page: number): Promise<void> => {
  // API 호출 로직
};
```

</details>

### 🎨 **Material-UI 컴포넌트**

<details>
<summary><strong>🔽 현대적 UI 구성</strong></summary>

```typescript
// 카드 기반 레이아웃
<Card elevation={1} sx={{ '&:hover': { elevation: 3 } }}>
  <CardActionArea onClick={() => onSelectPost(post)}>
    <CardContent>
      <Typography variant="h6">{post.title}</Typography>
      <Chip label={post.author} size="small" />
    </CardContent>
  </CardActionArea>
</Card>

// Floating Action Button
<Fab color="primary" onClick={onCreatePost} sx={{ position: 'fixed', bottom: 24, right: 24 }}>
  <Add />
</Fab>
```

</details>

### 🌐 **HTTP 통신과 에러 처리**

<details>
<summary><strong>🔽 Axios 기반 API 통신</strong></summary>

```typescript
// Axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 인터셉터로 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
    throw new Error(message);
  }
);

// API 서비스 함수
export const postApi = {
  getPosts: async (page = 0, size = 10): Promise<PageResponse<Post>> => {
    const response = await api.get(`/posts?page=${page}&size=${size}`);
    return response.data;
  }
};
```

</details>

### 🔧 **Node.js 백엔드 개발**

<details>
<summary><strong>🔽 Express.js 서버 구축</strong></summary>

```javascript
// Express 서버 설정
const app = express();

// 미들웨어 설정
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(morgan('combined'));

// 라우터 연결
app.use('/api/posts', postRoutes);

// 에러 처리 미들웨어
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

</details>

## 🗄 데이터베이스

### 📁 **파일 기반 데이터베이스의 장점**

이 프로젝트는 **JSON 파일 기반 데이터베이스**를 사용합니다:

- 🚀 **빠른 시작**: 별도 DB 서버 설치 불필요
- 👁 **가시성**: 데이터를 눈으로 직접 확인 가능
- 📝 **편집 용이**: 텍스트 에디터로 직접 수정 가능
- 📦 **버전 관리**: Git으로 데이터 변경 이력 추적
- 🔄 **백업 간편**: 파일 복사만으로 백업 완료

### 📊 데이터 구조

```json
[
  {
    "id": 1,
    "title": "게시글 제목",
    "content": "게시글 내용...",
    "author": "작성자",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## 🔧 개발 환경 설정

### 📝 **스크립트 명령어**

**Backend:**
```bash
npm start          # 프로덕션 서버 실행
npm run dev        # 개발 서버 실행 (nodemon)
npm run init-db    # 데이터베이스 초기화
npm test           # 테스트 실행
npm run lint       # 코드 린트 검사
```

**Frontend:**
```bash
npm run dev        # 개발 서버 실행 (http://localhost:5173)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드된 앱 미리보기
npm run lint       # ESLint 검사
```

### ⚙️ **환경 변수 설정**

**Backend (.env):**
```env
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DB_PATH=./data/posts.json
```

**Frontend (Vite):**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

## 🧪 테스트

### 🔍 **기능 테스트**

```bash
# 백엔드 API 테스트
curl http://localhost:8080/health
curl http://localhost:8080/api/posts

# 프론트엔드 접속 테스트
open http://localhost:5173
```

### 🚨 **문제 해결**

<details>
<summary><strong>🔽 자주 발생하는 문제들</strong></summary>

**포트 충돌:**
```bash
# 포트 사용 확인
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # macOS/Linux

# 프로세스 종료
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux
```

**CORS 오류:**
- 백엔드 서버가 실행 중인지 확인
- `.env` 파일의 `FRONTEND_URL` 설정 확인

**의존성 문제:**
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

</details>

## 🚀 배포

### 🏗 **프로덕션 빌드**

```bash
# 프론트엔드 빌드
cd frontend
npm run build

# 백엔드와 통합 (선택사항)
cp -r dist/* ../backend/public/

# 백엔드 실행
cd ../backend
npm start
```

### ☁️ **클라우드 배포**

- **Vercel**: 프론트엔드 배포
- **Railway**: 백엔드 배포  
- **Netlify**: 정적 사이트 배포
- **Heroku**: 풀스택 배포

## 🔄 확장 가능성

### 📈 **다음 단계 기능**
- [ ] 사용자 인증 시스템 (JWT)
- [ ] 댓글 시스템
- [ ] 파일 업로드 기능
- [ ] 검색 및 필터링
- [ ] 무한 스크롤
- [ ] 실시간 알림 (WebSocket)

### 🗄 **데이터베이스 전환**
- [ ] **PostgreSQL**: 관계형 데이터베이스
- [ ] **MongoDB**: NoSQL 문서 데이터베이스
- [ ] **SQLite**: 파일 기반 SQL 데이터베이스
- [ ] **Redis**: 캐싱 및 세션 관리

### 🎨 **UI/UX 개선**
- [ ] 다크 모드
- [ ] 애니메이션 효과
- [ ] 반응형 개선
- [ ] PWA 지원

## 🎉 프로젝트 완성 체크리스트

### ✅ **요구사항 달성 현황**
- [x] 게시글 목록 조회 (페이지네이션) ⭐
- [x] 게시글 상세 조회 ⭐
- [x] 게시글 작성/수정/삭제 ⭐
- [x] 로딩 및 에러 처리 ⭐
- [x] Material-UI 사용 ⭐
- [x] TypeScript 작성 ⭐
- [x] @vitejs/plugin-react-swc 사용 ⭐
- [x] 느슨한 ESLint 적용 ⭐

### 🌟 **추가 완성 사항**
- [x] 파일 기반 데이터베이스 구현
- [x] RESTful API 완전 구현
- [x] 반응형 디자인
- [x] 미리보기 기능
- [x] 키보드 단축키
- [x] 자동 샘플 데이터
- [x] 에러 처리 및 로깅
- [x] 개발자 친화적 설정

## 🤝 기여하기

이 프로젝트는 **React 학습용** 프로젝트입니다:

- 🐛 **버그 리포트**: Issues에서 문제점 공유
- 💡 **기능 제안**: 학습에 도움되는 기능 아이디어
- 📝 **문서 개선**: README나 주석 개선
- 🎨 **UI 개선**: 더 나은 사용자 경험 제안

## 📞 지원 및 문의

- 📋 **GitHub Issues**: 버그 리포트 및 기능 요청
- 💬 **Discussions**: 일반적인 질문 및 토론  
- 📖 **Wiki**: 추가 학습 자료 및 팁

---

<div align="center">

### 🎊 축하합니다! React + Node.js 풀스택 개발을 완료했습니다!

**이 프로젝트를 통해 실무에서 바로 활용할 수 있는**  
**React와 Node.js 개발 경험을 쌓으셨습니다.**

⭐ **도움이 되었다면 Star를 눌러주세요!** ⭐

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer)

</div>