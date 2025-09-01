import type { SearchResult } from '../types/search';

// 검색을 위한 더미 데이터 (100개)
export const mockData: SearchResult[] = [
  // 프로그래밍 언어 (20개)
  { id: 1, title: 'React 기초', description: 'React의 기본 개념과 컴포넌트 생성 방법을 배워보세요', category: '프로그래밍' },
  { id: 2, title: 'JavaScript ES6', description: 'ES6의 새로운 문법들: const, let, arrow function, destructuring', category: '프로그래밍' },
  { id: 3, title: 'TypeScript 가이드', description: 'TypeScript를 사용한 타입 안전한 개발 방법', category: '프로그래밍' },
  { id: 4, title: 'Vue.js 프레임워크', description: 'Vue.js로 SPA(Single Page Application) 개발하기', category: '프로그래밍' },
  { id: 5, title: 'Python 기초', description: 'Python 프로그래밍 시작하기: 변수, 함수, 클래스', category: '프로그래밍' },
  { id: 6, title: 'Java 객체지향', description: 'Java의 객체지향 프로그래밍 개념과 실습', category: '프로그래밍' },
  { id: 7, title: 'C++ 포인터', description: 'C++의 포인터와 메모리 관리 완벽 가이드', category: '프로그래밍' },
  { id: 8, title: 'Go 언어 입문', description: 'Google에서 개발한 Go 언어 기초 문법', category: '프로그래밍' },
  { id: 9, title: 'Rust 프로그래밍', description: '메모리 안전성을 보장하는 Rust 언어 학습', category: '프로그래밍' },
  { id: 10, title: 'Swift iOS 개발', description: 'Swift를 사용한 iOS 앱 개발 기초', category: '프로그래밍' },
  { id: 11, title: 'Kotlin Android', description: 'Kotlin으로 Android 앱 개발하기', category: '프로그래밍' },
  { id: 12, title: 'PHP 웹개발', description: 'PHP를 사용한 서버사이드 웹 개발', category: '프로그래밍' },
  { id: 13, title: 'Ruby on Rails', description: 'Ruby on Rails 프레임워크로 웹 애플리케이션 구축', category: '프로그래밍' },
  { id: 14, title: 'Scala 함수형', description: 'Scala를 이용한 함수형 프로그래밍 패러다임', category: '프로그래밍' },
  { id: 15, title: 'R 데이터분석', description: 'R 언어를 활용한 통계 분석과 데이터 시각화', category: '프로그래밍' },
  { id: 16, title: 'Dart Flutter', description: 'Dart 언어로 Flutter 크로스플랫폼 앱 개발', category: '프로그래밍' },
  { id: 17, title: 'Perl 스크립팅', description: 'Perl을 이용한 텍스트 처리와 시스템 관리', category: '프로그래밍' },
  { id: 18, title: 'Lua 스크립트', description: '가벼운 스크립트 언어 Lua 활용법', category: '프로그래밍' },
  { id: 19, title: 'Assembly 언어', description: '저수준 프로그래밍을 위한 Assembly 언어', category: '프로그래밍' },
  { id: 20, title: 'COBOL 레거시', description: '금융권에서 여전히 사용되는 COBOL 언어', category: '프로그래밍' },

  // 웹 개발 (20개)
  { id: 21, title: 'HTML5 시맨틱', description: '의미있는 HTML5 마크업 작성 방법', category: '웹 개발' },
  { id: 22, title: 'CSS3 애니메이션', description: 'CSS3를 활용한 부드러운 애니메이션 구현', category: '웹 개발' },
  { id: 23, title: 'Sass SCSS', description: 'Sass/SCSS를 이용한 효율적인 CSS 작성', category: '웹 개발' },
  { id: 24, title: 'Bootstrap 그리드', description: 'Bootstrap을 활용한 반응형 레이아웃', category: '웹 개발' },
  { id: 25, title: 'jQuery DOM 조작', description: 'jQuery를 사용한 DOM 요소 조작과 이벤트 처리', category: '웹 개발' },
  { id: 26, title: 'Ajax 비동기', description: 'Ajax를 활용한 비동기 데이터 통신', category: '웹 개발' },
  { id: 27, title: 'Webpack 번들러', description: 'Webpack을 이용한 모듈 번들링과 최적화', category: '웹 개발' },
  { id: 28, title: 'Vite 빌드도구', description: '차세대 빌드 도구 Vite 사용법', category: '웹 개발' },
  { id: 29, title: 'Next.js SSR', description: 'Next.js로 서버사이드 렌더링 구현', category: '웹 개발' },
  { id: 30, title: 'Nuxt.js Vue', description: 'Nuxt.js를 활용한 Vue.js 애플리케이션 개발', category: '웹 개발' },
  { id: 31, title: 'Angular SPA', description: 'Angular 프레임워크로 SPA 구축하기', category: '웹 개발' },
  { id: 32, title: 'Svelte 컴파일러', description: '컴파일 타임 최적화를 제공하는 Svelte', category: '웹 개발' },
  { id: 33, title: 'PWA 웹앱', description: 'Progressive Web App 개발 가이드', category: '웹 개발' },
  { id: 34, title: 'GraphQL API', description: 'GraphQL을 활용한 효율적인 API 설계', category: '웹 개발' },
  { id: 35, title: 'REST API 설계', description: 'RESTful API 설계 원칙과 베스트 프랙티스', category: '웹 개발' },
  { id: 36, title: 'WebSocket 실시간', description: 'WebSocket을 이용한 실시간 통신 구현', category: '웹 개발' },
  { id: 37, title: 'Service Worker', description: 'Service Worker로 오프라인 기능 구현', category: '웹 개발' },
  { id: 38, title: 'Web Components', description: '재사용 가능한 웹 컴포넌트 개발', category: '웹 개발' },
  { id: 39, title: 'Tailwind CSS', description: 'Utility-first CSS 프레임워크 Tailwind CSS', category: '웹 개발' },
  { id: 40, title: 'Styled Components', description: 'CSS-in-JS 라이브러리 Styled Components', category: '웹 개발' },

  // 백엔드 (15개)
  { id: 41, title: 'Node.js 서버', description: 'Node.js를 이용한 서버 개발과 비동기 처리', category: '백엔드' },
  { id: 42, title: 'Express.js 미들웨어', description: 'Express.js 프레임워크와 미들웨어 활용', category: '백엔드' },
  { id: 43, title: 'Django REST', description: 'Django로 REST API 서버 구축하기', category: '백엔드' },
  { id: 44, title: 'Flask 마이크로', description: '경량 웹 프레임워크 Flask 활용법', category: '백엔드' },
  { id: 45, title: 'Spring Boot', description: 'Spring Boot를 이용한 Java 웹 애플리케이션', category: '백엔드' },
  { id: 46, title: 'Laravel PHP', description: 'Laravel 프레임워크로 PHP 웹 개발', category: '백엔드' },
  { id: 47, title: 'ASP.NET Core', description: '.NET Core를 활용한 크로스플랫폼 웹 API', category: '백엔드' },
  { id: 48, title: 'Gin Go 프레임워크', description: 'Go 언어의 고성능 웹 프레임워크 Gin', category: '백엔드' },
  { id: 49, title: 'FastAPI Python', description: '고성능 Python 웹 프레임워크 FastAPI', category: '백엔드' },
  { id: 50, title: 'Koa.js 미들웨어', description: 'Express.js의 차세대 Node.js 프레임워크', category: '백엔드' },
  { id: 51, title: 'NestJS 타입스크립트', description: 'TypeScript 기반의 Node.js 프레임워크', category: '백엔드' },
  { id: 52, title: 'Actix Rust', description: 'Rust 언어의 고성능 웹 프레임워크', category: '백엔드' },
  { id: 53, title: 'Rocket Rust', description: 'Rust의 타입 안전한 웹 프레임워크', category: '백엔드' },
  { id: 54, title: 'Phoenix Elixir', description: 'Elixir 언어의 함수형 웹 프레임워크', category: '백엔드' },
  { id: 55, title: 'Rails Ruby', description: 'Ruby on Rails 프레임워크의 MVC 패턴', category: '백엔드' },

  // 데이터베이스 (15개)
  { id: 56, title: 'MySQL 관계형', description: 'MySQL 데이터베이스 설계와 최적화', category: '데이터베이스' },
  { id: 57, title: 'PostgreSQL 고급', description: 'PostgreSQL의 고급 기능과 성능 튜닝', category: '데이터베이스' },
  { id: 58, title: 'MongoDB NoSQL', description: 'MongoDB를 활용한 NoSQL 데이터베이스', category: '데이터베이스' },
  { id: 59, title: 'Redis 캐시', description: 'Redis를 이용한 인메모리 캐싱 전략', category: '데이터베이스' },
  { id: 60, title: 'Elasticsearch 검색', description: 'Elasticsearch를 활용한 전문 검색 엔진', category: '데이터베이스' },
  { id: 61, title: 'SQLite 임베디드', description: '경량 데이터베이스 SQLite 활용법', category: '데이터베이스' },
  { id: 62, title: 'Oracle 데이터베이스', description: 'Oracle DB의 고급 기능과 PL/SQL', category: '데이터베이스' },
  { id: 63, title: 'SQL Server 마이크로소프트', description: 'Microsoft SQL Server 관리와 T-SQL', category: '데이터베이스' },
  { id: 64, title: 'Cassandra 분산', description: '분산 NoSQL 데이터베이스 Cassandra', category: '데이터베이스' },
  { id: 65, title: 'DynamoDB AWS', description: 'AWS의 관리형 NoSQL 데이터베이스', category: '데이터베이스' },
  { id: 66, title: 'Firebase 실시간', description: 'Firebase 실시간 데이터베이스 활용', category: '데이터베이스' },
  { id: 67, title: 'InfluxDB 시계열', description: '시계열 데이터를 위한 InfluxDB', category: '데이터베이스' },
  { id: 68, title: 'Neo4j 그래프', description: '그래프 데이터베이스 Neo4j 활용법', category: '데이터베이스' },
  { id: 69, title: 'CouchDB 문서', description: '문서 기반 NoSQL 데이터베이스 CouchDB', category: '데이터베이스' },
  { id: 70, title: 'MariaDB 오픈소스', description: 'MySQL 호환 오픈소스 MariaDB', category: '데이터베이스' },

  // 클라우드 & 도구 (15개)
  { id: 71, title: 'AWS 클라우드', description: 'Amazon Web Services 클라우드 서비스 활용', category: '클라우드' },
  { id: 72, title: 'Docker 컨테이너', description: 'Docker를 이용한 컨테이너화 애플리케이션', category: '도구' },
  { id: 73, title: 'Kubernetes 오케스트레이션', description: 'Kubernetes로 컨테이너 오케스트레이션', category: '도구' },
  { id: 74, title: 'Git 버전관리', description: 'Git을 활용한 효율적인 버전 관리', category: '도구' },
  { id: 75, title: 'GitHub Actions', description: 'GitHub Actions로 CI/CD 파이프라인 구축', category: '도구' },
  { id: 76, title: 'Jenkins 자동화', description: 'Jenkins를 이용한 빌드 자동화', category: '도구' },
  { id: 77, title: 'Terraform 인프라', description: 'Terraform으로 인프라를 코드로 관리', category: '도구' },
  { id: 78, title: 'Ansible 구성관리', description: 'Ansible을 이용한 서버 구성 관리', category: '도구' },
  { id: 79, title: 'Nginx 웹서버', description: 'Nginx 웹서버 설정과 로드밸런싱', category: '도구' },
  { id: 80, title: 'Apache HTTP', description: 'Apache HTTP Server 설정과 모듈', category: '도구' },
  { id: 81, title: 'Linux 시스템', description: 'Linux 시스템 관리와 쉘 스크립팅', category: '도구' },
  { id: 82, title: 'VS Code 에디터', description: 'Visual Studio Code 효율적 사용법', category: '도구' },
  { id: 83, title: 'Vim 텍스트에디터', description: 'Vim 에디터 마스터하기', category: '도구' },
  { id: 84, title: 'Postman API', description: 'Postman을 활용한 API 테스팅', category: '도구' },
  { id: 85, title: 'Jira 프로젝트관리', description: 'Jira를 이용한 애자일 프로젝트 관리', category: '도구' },

  // AI & 데이터 과학 (15개)
  { id: 86, title: '머신러닝 기초', description: '머신러닝의 기본 개념과 알고리즘', category: '데이터 과학' },
  { id: 87, title: '딥러닝 신경망', description: '딥러닝과 신경망의 원리와 구현', category: '데이터 과학' },
  { id: 88, title: 'TensorFlow 프레임워크', description: 'TensorFlow를 이용한 머신러닝 모델 구축', category: '데이터 과학' },
  { id: 89, title: 'PyTorch 딥러닝', description: 'PyTorch로 딥러닝 모델 개발하기', category: '데이터 과학' },
  { id: 90, title: 'Pandas 데이터분석', description: 'Pandas를 활용한 데이터 분석과 전처리', category: '데이터 과학' },
  { id: 91, title: 'NumPy 수치계산', description: 'NumPy를 이용한 고성능 수치 계산', category: '데이터 과학' },
  { id: 92, title: 'Matplotlib 시각화', description: 'Matplotlib로 데이터 시각화하기', category: '데이터 과학' },
  { id: 93, title: 'Scikit-learn 머신러닝', description: 'Scikit-learn 라이브러리 활용법', category: '데이터 과학' },
  { id: 94, title: 'OpenCV 컴퓨터비전', description: 'OpenCV를 이용한 이미지 처리', category: '데이터 과학' },
  { id: 95, title: 'NLTK 자연어처리', description: 'NLTK를 활용한 자연어 처리', category: '데이터 과학' },
  { id: 96, title: 'Jupyter Notebook', description: 'Jupyter Notebook을 이용한 대화형 개발', category: '데이터 과학' },
  { id: 97, title: 'Apache Spark', description: '빅데이터 처리를 위한 Apache Spark', category: '데이터 과학' },
  { id: 98, title: 'Hadoop 빅데이터', description: 'Hadoop 생태계를 활용한 빅데이터 분석', category: '데이터 과학' },
  { id: 99, title: 'Tableau 시각화', description: 'Tableau를 이용한 비즈니스 인텔리전스', category: '데이터 과학' },
  { id: 100, title: 'Power BI 대시보드', description: 'Microsoft Power BI로 대시보드 구축', category: '데이터 과학' },
];

// 검색 함수 (실제로는 API 호출)
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