# Chapter 10-2: 실시간 알림 시스템 🔔

Spring Boot와 React를 연동한 실시간 알림 시스템 구현 예제입니다.

## 📚 학습 목표

- WebSocket을 이용한 실시간 통신 이해
- React Context API를 활용한 상태 관리
- TypeScript로 타입 안전한 React 애플리케이션 개발
- Material-UI를 이용한 모던 UI 구현
- Spring Boot와 React 연동 방법 습득

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐
│   React App     │◄────────────────────►│  Spring Boot    │
│   (Frontend)    │                      │   (Backend)     │
│                 │                      │                 │
│ • 실시간 UI     │                      │ • REST API      │
│ • 상태 관리     │                      │ • WebSocket     │
│ • 알림 표시     │                      │ • 알림 관리     │
└─────────────────┘                      └─────────────────┘
```

## 🚀 프로젝트 구조

```
chapter-10-2-websocket/
├── backend/                     # Spring Boot 서버
│   ├── src/main/java/
│   │   └── notification/
│   │       ├── NotificationApplication.java
│   │       ├── controller/
│   │       ├── service/
│   │       └── config/
│   └── pom.xml
├── frontend/                    # React 애플리케이션
│   ├── src/
│   │   ├── components/         # UI 컴포넌트
│   │   ├── context/           # React Context
│   │   ├── hooks/             # 커스텀 훅
│   │   ├── types/             # TypeScript 타입
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🛠️ 기술 스택

### Backend (Spring Boot)
- **Java 17+** - 최신 Java 버전
- **Spring Boot 3.x** - 백엔드 프레임워크
- **Spring WebSocket** - 실시간 통신
- **Spring Web** - REST API
- **Jackson** - JSON 직렬화/역직렬화

### Frontend (React)
- **React 19** - 최신 React 버전
- **TypeScript 5.8** - 타입 안전성
- **Material-UI 7** - UI 컴포넌트 라이브러리
- **Vite 7** - 빌드 도구
- **Native WebSocket** - 실시간 통신

## ⚙️ 설치 및 실행

### 1. Backend 실행

```bash
# backend 디렉토리로 이동
cd backend

# Maven 의존성 설치
mvn clean install

# Spring Boot 애플리케이션 실행
mvn spring-boot:run
```

**백엔드 서버 정보:**
- HTTP 서버: `http://localhost:8080`
- WebSocket 서버: `ws://localhost:8080`

### 2. Frontend 실행

```bash
# frontend 디렉토리로 이동
cd frontend

# npm 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

**프론트엔드 서버 정보:**
- 개발 서버: `http://localhost:5173`
- API 프록시: `/api/*` → `http://localhost:8080`

## 📡 API 명세

### REST API 엔드포인트

| Method | URL | 설명 | 응답 |
|--------|-----|------|------|
| `GET` | `/api/notifications` | 알림 목록 조회 | `Notification[]` |
| `PUT` | `/api/notifications/:id/read` | 알림 읽음 처리 | `200 OK` |
| `POST` | `/api/comments` | 댓글 작성 | `Comment` |
| `GET` | `/api/settings` | 알림 설정 조회 | `NotificationSettings` |
| `PUT` | `/api/settings` | 알림 설정 변경 | `NotificationSettings` |

### WebSocket 이벤트

| 이벤트 | 방향 | 설명 | 데이터 |
|--------|------|------|-------|
| `notification:new` | Server → Client | 새 알림 전송 | `Notification` |
| `notification:read` | Server → Client | 알림 읽음 상태 변경 | `string (id)` |
| `connection:status` | Server → Client | 연결 상태 변경 | `ConnectionStatus` |
| `notifications:count_updated` | Server → Client | 읽지 않은 수 변경 | `number` |

### 데이터 타입

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  browserNotification: boolean;
}

type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';
```

## 🎯 주요 기능

### ✅ 실시간 알림 시스템
- **즉시 알림 수신** - WebSocket을 통한 실시간 메시지 전달
- **연결 상태 표시** - 연결/끊김/재연결 상태 시각화
- **자동 재연결** - 연결 끊김 시 지수 백오프로 재시도

### ✅ 알림 관리
- **목록 표시** - 시간순 정렬된 알림 목록
- **읽음/안읽음 처리** - 개별 및 일괄 읽음 처리
- **타입별 아이콘** - info, success, warning, error 구분
- **시간 표시** - "방금 전", "5분 전" 등 직관적 표시

### ✅ 사용자 설정
- **알림 on/off** - 전체 알림 활성화/비활성화
- **소리 알림** - 새 알림 시 소리 재생
- **브라우저 알림** - 시스템 푸시 알림 표시

### ✅ 개발자 도구
- **TypeScript** - 컴파일 타임 타입 검증
- **ESLint** - 코드 품질 관리
- **Hot Reload** - 개발 시 즉시 반영

## 🧩 핵심 컴포넌트 설명

### 1. useWebSocket Hook
```typescript
// WebSocket 연결 관리와 이벤트 처리
const { connectionStatus, on, off, emit } = useWebSocket();
```

**역할:**
- WebSocket 연결/해제
- 자동 재연결 로직
- 이벤트 기반 메시지 처리

### 2. NotificationContext
```typescript
// 전역 상태 관리
const { notifications, unreadCount, markAsRead } = useNotification();
```

**역할:**
- 알림 목록 상태 관리
- API 호출 로직
- WebSocket 이벤트 핸들링

### 3. NotificationList Component
```typescript
// 알림 목록 UI 렌더링
<NotificationList />
```

**역할:**
- 알림 목록 표시
- 읽음 처리 UI
- 빈 상태 처리

## 🔧 개발 가이드

### 백엔드 개발 시 주의사항

1. **CORS 설정**
   ```java
   @CrossOrigin(origins = "http://localhost:5173")
   ```

2. **WebSocket 설정**
   ```java
   @EnableWebSocket
   public class WebSocketConfig implements WebSocketConfigurer
   ```

3. **JSON 직렬화**
   ```java
   @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
   private Date createdAt;
   ```

### 프론트엔드 개발 시 주의사항

1. **타입 정의**
   ```typescript
   // types/notification.ts에서 중앙 관리
   interface Notification { ... }
   ```

2. **에러 처리**
   ```typescript
   try {
     await markAsRead(id);
   } catch (error) {
     console.error('읽음 처리 실패:', error);
   }
   ```

3. **메모리 누수 방지**
   ```typescript
   useEffect(() => {
     const handleNewNotification = (notification) => { ... };
     on('notification:new', handleNewNotification);
     
     return () => {
       off('notification:new', handleNewNotification);
     };
   }, [on, off]);
   ```

## 🧪 테스트 방법

### 1. 기본 기능 테스트
1. 백엔드와 프론트엔드 모두 실행
2. 브라우저에서 `http://localhost:5173` 접속
3. 연결 상태가 "연결됨"으로 표시되는지 확인

### 2. 실시간 알림 테스트
1. "댓글 작성" 폼에서 테스트 댓글 작성
2. 새로운 알림이 실시간으로 나타나는지 확인
3. 읽지 않은 수가 업데이트되는지 확인

### 3. 읽음 처리 테스트
1. 개별 알림의 "읽음" 버튼 클릭
2. 알림 스타일이 변경되는지 확인
3. "모두 읽음" 버튼으로 일괄 처리 테스트

### 4. 연결 끊김 테스트
1. 백엔드 서버 중지
2. 연결 상태가 "연결 끊김"으로 변경되는지 확인
3. 서버 재시작 후 자동 재연결되는지 확인

## 🚨 문제 해결

### 자주 발생하는 문제들

**1. CORS 에러**
```
Access to fetch at 'http://localhost:8080/api/notifications' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```
**해결:** 백엔드에서 `@CrossOrigin` 어노테이션 추가

**2. WebSocket 연결 실패**
```
WebSocket connection to 'ws://localhost:8080' failed
```
**해결:** 백엔드 서버가 실행 중인지 확인, 포트 번호 점검

**3. 타입스크립트 에러**
```
Property 'notifications' does not exist on type 'undefined'
```
**해결:** `useNotification()` 훅이 Provider 내에서 사용되는지 확인

## 📖 학습 포인트

### 초보자를 위한 핵심 개념

1. **실시간 통신의 이해**
   - HTTP vs WebSocket 차이점
   - 언제 WebSocket을 사용해야 하는가?

2. **React 상태 관리**
   - Context API 사용법
   - 전역 상태 vs 지역 상태

3. **비동기 프로그래밍**
   - Promise와 async/await
   - 에러 처리 패턴

4. **타입스크립트 활용**
   - Interface 정의
   - Generic 타입 사용

## 🎓 추가 학습 자료

- [React Context API 공식 문서](https://react.dev/reference/react/useContext)
- [WebSocket API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Material-UI 컴포넌트](https://mui.com/material-ui/getting-started/)
- [Spring WebSocket 가이드](https://docs.spring.io/spring-framework/reference/web/websocket.html)

## 📝 과제

### 기본 과제
1. 알림 타입에 따른 다른 색상 적용
2. 알림 삭제 기능 추가
3. 알림 필터링 기능 (타입별, 읽음상태별)

### 심화 과제
1. 알림 소리 커스터마이징
2. 알림 템플릿 시스템
3. 사용자별 알림 설정
4. 알림 통계 대시보드

---

**📞 문의사항**
- 버그 리포트: GitHub Issues
- 질문: Discussion 게시판
- 개선 제안: Pull Request

이 예제를 통해 실시간 웹 애플리케이션의 기초를 확실히 익혀보세요! 🚀