# 📝 React Board Backend (Node.js + File Database)

> **Node.js + Express.js + JSON 파일 DB 기반 게시판 REST API**

## 🚀 빠른 시작

### 📋 사전 요구사항
- **Node.js 18+**
- **npm 8+**

### ⚡ 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env

# 3. 개발 서버 실행
npm run dev

# 또는 프로덕션 실행
npm start
```

## 🌐 API 엔드포인트

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| 🔍 GET | `/api/posts?page=0&size=10` | 게시글 목록 조회 (페이지네이션) | - |
| 👁 GET | `/api/posts/:id` | 게시글 상세 조회 | - |
| ✍️ POST | `/api/posts` | 게시글 작성 | `{title, content, author}` |
| ✏️ PUT | `/api/posts/:id` | 게시글 수정 | `{title, content}` |
| 🗑 DELETE | `/api/posts/:id` | 게시글 삭제 | - |

### 📝 API 사용 예시

**게시글 목록 조회:**
```bash
curl "http://localhost:8080/api/posts?page=0&size=10"
```

**게시글 작성:**
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "새 게시글",
    "content": "게시글 내용입니다.",
    "author": "작성자"
  }'
```

## 🛠 기술 스택

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: JSON File Database
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Development**: Nodemon

## 📁 프로젝트 구조

```
backend/
├── 📂 src/
│   ├── 🏠 server.js              # 메인 서버 파일
│   ├── 📂 controllers/           # 컨트롤러
│   │   └── 🎮 postController.js
│   ├── 📂 services/              # 비즈니스 로직
│   │   └── 💼 postService.js
│   ├── 📂 routes/                # 라우트
│   │   └── 🛣 posts.js
│   ├── 📂 middleware/            # 미들웨어
│   │   ├── ✅ validation.js
│   │   └── 🚨 errorHandler.js
│   ├── 📂 database/              # 파일 데이터베이스
│   │   └── 🗄 database.js
│   └── 📂 scripts/               # 유틸리티 스크립트
│       └── 🔧 initDatabase.js
├── 📂 data/                      # 데이터베이스 파일
│   └── 🗃 posts.json
├── 📦 package.json               # 프로젝트 설정
├── ⚙️ .env.example              # 환경 변수 예시
└── 📖 README.md                  # 이 파일
```

## 🗄 파일 데이터베이스

### 특징
- **JSON 형태**: 가독성이 좋고 직접 편집 가능
- **별도 설치 불필요**: SQLite나 DB 서버 설치 없음
- **버전 관리 친화적**: Git으로 데이터 변경 이력 추적 가능
- **백업 간단**: 파일 복사만으로 백업 완료
- **개발 편의성**: 브라우저나 에디터에서 바로 확인 가능

### 데이터 구조
```json
[
  {
    "id": 1,
    "title": "게시글 제목",
    "content": "게시글 내용",
    "author": "작성자",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 자동 초기화
- 서버 시작 시 자동으로 `data` 디렉토리와 `posts.json` 파일 생성
- 샘플 데이터 12개 자동 생성
- 파일 위치: `./data/posts.json`

## 📊 응답 형식

### 성공 응답

**게시글 목록:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "게시글 제목",
      "content": "게시글 내용",
      "author": "작성자",
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

### 에러 응답

```json
{
  "error": "Bad Request",
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

## ✨ 파일 DB의 장점

### 🎯 **개발 단계**
- 별도 DB 서버 설치/설정 불필요
- 데이터를 직접 눈으로 확인 가능
- 테스트 데이터 관리 용이

### 📁 **데이터 관리**
- JSON 포맷으로 가독성 우수
- 수동 데이터 편집 가능
- 버전 관리 시스템과 완벽 호환

### 🚀 **배포**
- 의존성 최소화
- 컨테이너 이미지 크기 감소
- 설정 복잡도 낮음

## 🔧 설정

### 환경 변수 (.env)

```bash
# 서버 포트
PORT=8080

# 개발 환경
NODE_ENV=development

# 프론트엔드 URL (CORS)
FRONTEND_URL=http://localhost:5173

# 데이터베이스 경로
DB_PATH=./data/posts.json
```

## 📝 스크립트

| 명령어 | 설명 |
|-------|------|
| `npm start` | 프로덕션 서버 실행 |
| `npm run dev` | 개발 서버 실행 (nodemon) |
| `npm run init-db` | 데이터베이스 초기화 |
| `npm test` | 테스트 실행 |
| `npm run lint` | 코드 린트 검사 |
| `npm run lint:fix` | 린트 오류 자동 수정 |

## 💡 데이터 관리 팁

### 수동 데이터 편집
```bash
# JSON 파일 직접 편집
code data/posts.json

# 또는 브라우저에서 확인
open data/posts.json
```

### 백업과 복원
```bash
# 백업
cp data/posts.json data/posts.backup.json

# 복원
cp data/posts.backup.json data/posts.json
```

### 데이터 초기화
```bash
# 데이터 파일 삭제 후 재시작
rm -f data/posts.json
npm run dev
```

## 🔄 확장성

이 파일 DB 구조는 나중에 실제 데이터베이스로 쉽게 전환할 수 있도록 설계되었습니다:

- **PostgreSQL**: 관계형 데이터베이스로 확장
- **MongoDB**: NoSQL 문서 데이터베이스로 전환  
- **Redis**: 캐싱 및 세션 관리 추가
- **Elasticsearch**: 검색 기능 강화

## 🐛 문제 해결

### 데이터 파일 권한 오류
```bash
# 권한 확인 및 수정
ls -la data/
chmod 755 data/
chmod 644 data/posts.json
```

### JSON 파일 손상
```bash
# JSON 유효성 검사
node -e "console.log(JSON.parse(require('fs').readFileSync('data/posts.json')))"

# 손상된 경우 재초기화
rm data/posts.json
npm run init-db
```

---

✨ **Simple & Effective File Database!**

## 🚀 빠른 시작

### 📋 사전 요구사항
- **Node.js 18+**
- **npm 8+**

### ⚡ 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env

# 3. 개발 서버 실행
npm run dev

# 또는 프로덕션 실행
npm start
```

## 🌐 API 엔드포인트

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| 🔍 GET | `/api/posts?page=0&size=10` | 게시글 목록 조회 (페이지네이션) | - |
| 👁 GET | `/api/posts/:id` | 게시글 상세 조회 | - |
| ✍️ POST | `/api/posts` | 게시글 작성 | `{title, content, author}` |
| ✏️ PUT | `/api/posts/:id` | 게시글 수정 | `{title, content}` |
| 🗑 DELETE | `/api/posts/:id` | 게시글 삭제 | - |

### 📝 API 사용 예시

**게시글 목록 조회:**
```bash
curl "http://localhost:8080/api/posts?page=0&size=10"
```

**게시글 작성:**
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "새 게시글",
    "content": "게시글 내용입니다.",
    "author": "작성자"
  }'
```

## 🛠 기술 스택

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: SQLite 3
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Development**: Nodemon

## 📁 프로젝트 구조

```
backend/
├── 📂 src/
│   ├── 🏠 server.js              # 메인 서버 파일
│   ├── 📂 controllers/           # 컨트롤러
│   │   └── 🎮 postController.js
│   ├── 📂 services/              # 비즈니스 로직
│   │   └── 💼 postService.js
│   ├── 📂 routes/                # 라우트
│   │   └── 🛣 posts.js
│   ├── 📂 middleware/            # 미들웨어
│   │   ├── ✅ validation.js
│   │   └── 🚨 errorHandler.js
│   ├── 📂 database/              # 데이터베이스
│   │   └── 🗄 database.js
│   └── 📂 scripts/               # 유틸리티 스크립트
│       └── 🔧 initDatabase.js
├── 📂 data/                      # 데이터베이스 파일
│   └── 🗃 board.db
├── 📦 package.json               # 프로젝트 설정
├── ⚙️ .env.example              # 환경 변수 예시
└── 📖 README.md                  # 이 파일
```

## 🗄 데이터베이스

### 스키마
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 자동 초기화
- 서버 시작 시 자동으로 데이터베이스와 테이블 생성
- 샘플 데이터 12개 자동 생성
- SQLite 파일 위치: `./data/board.db`

## 📊 응답 형식

### 성공 응답

**게시글 목록:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "게시글 제목",
      "content": "게시글 내용",
      "author": "작성자",
      "createdAt": "2024-01-15 10:30:00",
      "updatedAt": "2024-01-15 10:30:00"
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

**단일 게시글:**
```json
{
  "id": 1,
  "title": "게시글 제목",
  "content": "게시글 내용",
  "author": "작성자",
  "createdAt": "2024-01-15 10:30:00",
  "updatedAt": "2024-01-15 10:30:00"
}
```

### 에러 응답

```json
{
  "error": "Bad Request",
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

## 🔧 설정

### 환경 변수 (.env)

```bash
# 서버 포트
PORT=8080

# 개발 환경
NODE_ENV=development

# 프론트엔드 URL (CORS)
FRONTEND_URL=http://localhost:5173

# 데이터베이스 경로
DB_PATH=./data/board.db
```

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 테스트 + 커버리지
npm run test:coverage
```

## 📝 스크립트

| 명령어 | 설명 |
|-------|------|
| `npm start` | 프로덕션 서버 실행 |
| `npm run dev` | 개발 서버 실행 (nodemon) |
| `npm run init-db` | 데이터베이스 초기화 |
| `npm test` | 테스트 실행 |
| `npm run lint` | 코드 린트 검사 |
| `npm run lint:fix` | 린트 오류 자동 수정 |

## 🔍 개발 도구

### API 테스트
- **Postman**: GUI 기반 테스트
- **Thunder Client**: VS Code 확장
- **curl**: 명령줄 테스트

### 로그 확인
```bash
# 실시간 로그
npm run dev

# 로그 레벨 조정
LOG_LEVEL=debug npm run dev
```

## 🚀 배포

### 1. 로컬 빌드
```bash
npm run build
npm start
```

### 2. PM2 배포
```bash
npm install -g pm2
pm2 start src/server.js --name "board-api"
pm2 startup
pm2 save
```

### 3. Docker 배포
```bash
docker build -t board-api .
docker run -p 8080:8080 board-api
```

## 🛡 보안 기능

- **Helmet**: 보안 헤더 설정
- **CORS**: 교차 출처 요청 제어
- **Input Validation**: Joi 기반 입력 검증
- **Error Handling**: 안전한 에러 응답
- **Request Limiting**: 요청 크기 제한

## 🐛 문제 해결

### 포트 이미 사용 중
```bash
# 포트 사용 확인
lsof -i :8080

# 프로세스 종료
kill -9 <PID>
```

### 데이터베이스 초기화
```bash
# 데이터베이스 파일 삭제 후 재시작
rm -f data/board.db
npm run dev
```

### CORS 오류
- `.env` 파일의 `FRONTEND_URL` 확인
- 프론트엔드 포트와 일치하는지 확인

## 📞 지원

문제가 발생하면:
1. 🐛 **Issues**: GitHub Issues에 버그 리포트
2. 💬 **Discussions**: 일반적인 질문 및 토론
3. 📖 **Wiki**: 추가 문서 및 가이드

---

✨ **Happy Coding!**