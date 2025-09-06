const fs = require('fs').promises;
const path = require('path');

// 프로젝트 루트를 기준으로 data 디렉토리 경로 설정
const PROJECT_ROOT = path.join(__dirname, '../..');
const DB_FILE_PATH = path.join(PROJECT_ROOT, 'data', 'posts.json');

console.log('📁 Project root:', PROJECT_ROOT);
console.log('📁 Database file path:', DB_FILE_PATH);

/**
 * 파일 DB 초기화 (디렉토리 생성)
 */
async function initDatabase() {
  try {
    const dbDir = path.dirname(DB_FILE_PATH);
    
    // 데이터 디렉토리가 없으면 생성
    await fs.mkdir(dbDir, { recursive: true });
    console.log('📁 Database directory ready:', dbDir);

    // posts.json 파일이 없으면 생성
    try {
      await fs.access(DB_FILE_PATH);
      console.log('📊 Database file exists, checking data...');
      
      // 파일이 있으면 데이터 확인
      const posts = await readPosts();
      if (posts.length === 0) {
        console.log('📊 No data found, creating sample data...');
        await createSampleData();
      } else {
        console.log(`📊 Found ${posts.length} posts in database`);
      }
    } catch (error) {
      // 파일이 없으면 샘플 데이터와 함께 생성
      console.log('📊 Database file not found, creating with sample data...');
      await createSampleData();
    }

    console.log('✅ File database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
}

/**
 * 게시글 데이터 읽기
 */
async function readPosts() {
  try {
    const data = await fs.readFile(DB_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 파일이 없으면 빈 배열 반환
      return [];
    }
    throw error;
  }
}

/**
 * 게시글 데이터 쓰기
 */
async function writePosts(posts) {
  try {
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(posts, null, 2), 'utf8');
  } catch (error) {
    console.error('❌ Error writing posts:', error.message);
    throw error;
  }
}

/**
 * 샘플 데이터 생성
 */
async function createSampleData() {
  const samplePosts = [
    {
      id: 1,
      title: "React 학습 가이드",
      content: "React를 처음 배우는 사람들을 위한 완전 가이드입니다.\n\nReact는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다. 컴포넌트 기반 아키텍처를 통해 재사용 가능한 UI 요소를 만들 수 있습니다.\n\n주요 특징:\n1. 가상 DOM을 통한 효율적인 렌더링\n2. 컴포넌트 기반 개발\n3. JSX 문법\n4. 단방향 데이터 흐름\n\nReact를 배우면서 함수형 컴포넌트와 훅(Hooks)을 익히는 것이 중요합니다.",
      author: "김개발",
      createdAt: new Date('2024-01-15T10:30:00').toISOString(),
      updatedAt: new Date('2024-01-15T10:30:00').toISOString()
    },
    {
      id: 2,
      title: "Node.js와 Express.js 시작하기",
      content: "Node.js와 Express.js를 사용하여 웹 서버를 구축하는 방법을 알아보겠습니다.\n\nNode.js는 Chrome V8 엔진을 기반으로 한 JavaScript 런타임입니다. Express.js는 Node.js를 위한 빠르고 간편한 웹 프레임워크입니다.\n\n주요 특징:\n• 비동기 I/O 처리\n• NPM 패키지 생태계\n• 빠른 개발 속도\n• RESTful API 구축 용이\n\n실제 프로젝트에서 많이 사용되는 미들웨어들도 함께 알아보겠습니다.",
      author: "박노드",
      createdAt: new Date('2024-01-16T14:20:00').toISOString(),
      updatedAt: new Date('2024-01-16T14:20:00').toISOString()
    },
    {
      id: 3,
      title: "TypeScript vs JavaScript",
      content: "TypeScript와 JavaScript의 차이점과 장단점을 비교해보겠습니다.\n\nJavaScript는 동적 타입 언어로 유연성이 높지만, 런타임 에러가 발생할 가능성이 있습니다. 반면 TypeScript는 정적 타입을 지원하여 컴파일 타임에 오류를 찾을 수 있습니다.\n\nTypeScript의 장점:\n• 타입 안정성\n• IDE 지원 강화\n• 리팩토링 용이성\n• 대규모 프로젝트에 적합\n\n단점:\n• 학습 곡선\n• 컴파일 과정 필요\n• 설정 복잡성",
      author: "이타입",
      createdAt: new Date('2024-01-17T09:15:00').toISOString(),
      updatedAt: new Date('2024-01-17T09:15:00').toISOString()
    },
    {
      id: 4,
      title: "파일 기반 데이터베이스 활용하기",
      content: "JSON 파일을 활용한 간단한 데이터베이스 시스템을 구현해보겠습니다.\n\n파일 기반 데이터베이스는 별도의 DB 서버 설치 없이도 데이터를 관리할 수 있는 경량 솔루션입니다. 개발 단계나 소규모 프로젝트에서 매우 유용합니다.\n\n주요 특징:\n• 설치 및 설정 불필요\n• JSON 형태의 가독성 좋은 데이터\n• 버전 관리 시스템과 호환\n• 백업과 복원이 간단\n\nNode.js의 파일 시스템 API를 사용하여 CRUD 작업을 구현하는 방법을 실습해보겠습니다.",
      author: "최파일",
      createdAt: new Date('2024-01-18T16:45:00').toISOString(),
      updatedAt: new Date('2024-01-18T16:45:00').toISOString()
    },
    {
      id: 5,
      title: "REST API 설계 원칙",
      content: "좋은 REST API를 설계하기 위한 핵심 원칙들을 소개합니다.\n\nREST(Representational State Transfer)는 웹 아키텍처의 핵심 원칙입니다.\n\nREST API 설계 원칙:\n1. 일관된 URL 구조\n2. HTTP 메서드 적절한 사용\n3. 상태 코드 적절한 반환\n4. JSON 형태의 응답\n5. 버전 관리\n\nURL 예시:\nGET /api/posts - 전체 조회\nGET /api/posts/1 - 단일 조회\nPOST /api/posts - 생성\nPUT /api/posts/1 - 수정\nDELETE /api/posts/1 - 삭제\n\n명사를 사용하고 동사는 HTTP 메서드로 표현하는 것이 중요합니다.",
      author: "정레스트",
      createdAt: new Date('2024-01-19T11:30:00').toISOString(),
      updatedAt: new Date('2024-01-19T11:30:00').toISOString()
    },
    {
      id: 6,
      title: "Express.js 미들웨어 완전 정복",
      content: "Express.js의 핵심인 미들웨어를 완전히 이해하고 활용해보겠습니다.\n\n미들웨어는 요청과 응답 사이에서 실행되는 함수입니다. Express.js의 핵심 개념 중 하나입니다.\n\n주요 미들웨어들:\n• express.json() - JSON 파싱\n• cors - CORS 처리\n• helmet - 보안 강화\n• morgan - 로깅\n• compression - 압축\n\n커스텀 미들웨어 작성법:\napp.use((req, res, next) => {\n  console.log('Request received');\n  next();\n});\n\n미들웨어의 실행 순서와 에러 처리 방법도 중요한 포인트입니다.",
      author: "김미들",
      createdAt: new Date('2024-01-20T13:15:00').toISOString(),
      updatedAt: new Date('2024-01-20T13:15:00').toISOString()
    },
    {
      id: 7,
      title: "CORS 이해하고 해결하기",
      content: "웹 개발에서 자주 마주치는 CORS 에러를 이해하고 해결하는 방법을 알아보겠습니다.\n\nCORS(Cross-Origin Resource Sharing)는 웹 브라우저의 보안 정책입니다.\n\n발생 원인:\n• 다른 도메인, 포트, 프로토콜에서 요청\n• 브라우저의 Same-Origin Policy\n\n해결 방법:\n1. 서버에서 CORS 헤더 설정\n2. cors 미들웨어 사용\n3. 프록시 서버 활용\n\nExpress.js에서의 해결:\napp.use(cors({\n  origin: 'http://localhost:3000',\n  credentials: true\n}));\n\n개발 환경과 프로덕션 환경에서의 CORS 설정 차이점도 알아보겠습니다.",
      author: "오코어스",
      createdAt: new Date('2024-01-21T08:45:00').toISOString(),
      updatedAt: new Date('2024-01-21T08:45:00').toISOString()
    },
    {
      id: 8,
      title: "Git과 GitHub 활용법",
      content: "버전 관리 시스템인 Git과 GitHub를 효과적으로 활용하는 방법을 알아보겠습니다.\n\n개발자에게 Git은 필수 도구입니다. 코드의 변경 이력을 관리하고 협업을 위해 반드시 알아야 합니다.\n\n기본 명령어:\n• git init - 저장소 초기화\n• git add - 스테이징\n• git commit - 커밋\n• git push - 원격 저장소에 업로드\n• git pull - 원격 저장소에서 다운로드\n\nGitHub 활용:\n• 원격 저장소로 활용\n• 이슈 트래킹\n• Pull Request를 통한 협업\n• GitHub Pages로 웹사이트 호스팅\n\n효과적인 커밋 메시지 작성법도 중요한 스킬입니다.",
      author: "박깃허브",
      createdAt: new Date('2024-01-22T15:20:00').toISOString(),
      updatedAt: new Date('2024-01-22T15:20:00').toISOString()
    },
    {
      id: 9,
      title: "JWT 인증 시스템 구현하기",
      content: "JWT(JSON Web Token)를 활용한 인증 시스템을 구현해보겠습니다.\n\nJWT는 클라이언트와 서버 간의 정보를 JSON 객체로 안전하게 전송하기 위한 표준입니다.\n\nJWT 구조:\n• Header: 토큰 타입과 알고리즘\n• Payload: 사용자 정보\n• Signature: 토큰 검증을 위한 서명\n\n구현 단계:\n1. 로그인 시 JWT 토큰 발급\n2. 클라이언트에서 토큰 저장\n3. 요청 시 토큰 전송\n4. 서버에서 토큰 검증\n\nNode.js에서 jsonwebtoken 라이브러리를 사용한 구현 방법을 실습해보겠습니다.",
      author: "토큰마스터",
      createdAt: new Date('2024-01-23T10:10:00').toISOString(),
      updatedAt: new Date('2024-01-23T10:10:00').toISOString()
    },
    {
      id: 10,
      title: "모던 JavaScript ES6+ 문법",
      content: "ES6 이후 추가된 모던 JavaScript 문법을 정리했습니다.\n\n모던 JavaScript를 활용하면 더욱 간결하고 읽기 쉬운 코드를 작성할 수 있습니다.\n\n주요 문법:\n• const, let - 블록 스코프 변수\n• Arrow Functions - 화살표 함수\n• Template Literals - 템플릿 문자열\n• Destructuring - 구조 분해 할당\n• Spread/Rest Operator - 전개/나머지 연산자\n• async/await - 비동기 처리\n\n예시 코드:\nconst getData = async () => {\n  try {\n    const response = await fetch('/api/data');\n    const { data, status } = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n};\n\n이러한 문법들을 활용하면 더 효율적인 개발이 가능합니다.",
      author: "모던JS",
      createdAt: new Date('2024-01-24T12:30:00').toISOString(),
      updatedAt: new Date('2024-01-24T12:30:00').toISOString()
    },
    {
      id: 11,
      title: "API 테스트와 문서화",
      content: "API 개발에서 중요한 테스트와 문서화에 대해 알아보겠습니다.\n\n좋은 API는 테스트가 잘 되어 있고 문서화가 명확해야 합니다.\n\n테스트 도구:\n• Postman - GUI 기반 API 테스트\n• curl - 명령줄 기반 테스트\n• Jest + Supertest - 자동화 테스트\n• Thunder Client - VS Code 확장\n\n문서화 도구:\n• Swagger/OpenAPI - 표준 API 문서\n• Postman Documentation\n• README.md 파일\n\n테스트 예시:\ndescribe('Posts API', () => {\n  test('GET /api/posts', async () => {\n    const response = await request(app)\n      .get('/api/posts')\n      .expect(200);\n    expect(response.body.content).toBeDefined();\n  });\n});\n\n지속적인 테스트와 문서화가 API 품질을 보장합니다.",
      author: "테스트왕",
      createdAt: new Date('2024-01-25T14:45:00').toISOString(),
      updatedAt: new Date('2024-01-25T14:45:00').toISOString()
    },
    {
      id: 12,
      title: "Node.js 성능 최적화 팁",
      content: "Node.js 애플리케이션의 성능을 향상시키는 다양한 방법들을 소개합니다.\n\nNode.js는 단일 스레드 이벤트 루프를 기반으로 하므로 성능 최적화가 중요합니다.\n\n최적화 방법:\n• 비동기 프로그래밍 활용\n• 메모리 사용량 모니터링\n• 파일 I/O 최적화\n• 캐싱 전략 수립\n• 압축 미들웨어 사용\n\n성능 측정 도구:\n• Node.js built-in profiler\n• clinic.js\n• Artillery (부하 테스트)\n• PM2 (프로세스 매니저)\n\n메모리 누수 방지:\n• 이벤트 리스너 정리\n• 타이머 해제\n• 글로벌 변수 사용 최소화\n\n실제 운영 환경에서 중요한 최적화 포인트들을 실습해보겠습니다.",
      author: "성능튜너",
      createdAt: new Date('2024-01-26T09:20:00').toISOString(),
      updatedAt: new Date('2024-01-26T09:20:00').toISOString()
    }
  ];

  try {
    await writePosts(samplePosts);
    console.log(`✅ Created ${samplePosts.length} sample posts`);
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
    throw error;
  }
}

/**
 * 다음 사용 가능한 ID 찾기
 */
async function getNextId() {
  const posts = await readPosts();
  if (posts.length === 0) {
    return 1;
  }
  return Math.max(...posts.map(post => post.id)) + 1;
}

/**
 * ID로 게시글 찾기
 */
async function findPostById(id) {
  const posts = await readPosts();
  return posts.find(post => post.id === parseInt(id));
}

/**
 * ID로 게시글 인덱스 찾기
 */
async function findPostIndexById(id) {
  const posts = await readPosts();
  return posts.findIndex(post => post.id === parseInt(id));
}

module.exports = {
  initDatabase,
  readPosts,
  writePosts,
  createSampleData,
  getNextId,
  findPostById,
  findPostIndexById
};