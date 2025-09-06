# 실시간 알림 시스템 (React + TypeScript)

Spring Boot 백엔드와 연동되는 실시간 알림 시스템입니다.

## 🚀 기능

- ✅ WebSocket 실시간 연결
- ✅ 알림 목록 표시 및 관리
- ✅ 읽음/안읽음 처리
- ✅ 알림 설정 (on/off, 소리, 브라우저 알림)
- ✅ 자동 재연결 로직
- ✅ 연결 상태 표시
- ✅ Material-UI 디자인

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

## 🛠 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Material-UI** - UI 컴포넌트
- **Socket.IO Client** - WebSocket 통신
- **Vite** - 빌드 도구
- **ESLint** - 코드 품질

## 📁 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── NotificationList.tsx      # 알림 목록
│   ├── NotificationSettings.tsx  # 알림 설정
│   ├── NotificationHeader.tsx    # 헤더
│   ├── ConnectionStatus.tsx      # 연결 상태
│   └── CommentForm.tsx          # 테스트용 댓글 폼
├── context/             # React Context
│   └── NotificationContext.tsx  # 알림 상태 관리
├── hooks/               # 커스텀 훅
│   └── useWebSocket.ts          # WebSocket 관리
├── types/               # 타입 정의
│   └── notification.ts          # 알림 관련 타입
├── App.tsx             # 메인 컴포넌트
└── main.tsx           # 앱 진입점
```

## 🔌 백엔드 연동

### API 엔드포인트
- `GET /api/notifications` - 알림 목록 조회
- `PUT /api/notifications/:id/read` - 알림 읽음 처리
- `POST /api/comments` - 댓글 작성 (알림 생성)
- `GET /api/settings` - 알림 설정 조회
- `PUT /api/settings` - 알림 설정 변경

### WebSocket 이벤트
- `notification:new` - 새 알림 수신
- `notification:read` - 알림 읽음 상태 변경
- `connection:status` - 연결 상태 변경
- `notifications:count_updated` - 읽지 않은 알림 수 변경

## 🎯 주요 특징

### 1. WebSocket 자동 재연결
- 연결이 끊어지면 자동으로 재연결 시도
- 지수 백오프 알고리즘 적용
- 최대 5회 재연결 시도

### 2. 상태 관리
- React Context를 활용한 전역 상태 관리
- 알림 목록, 설정, 연결 상태 통합 관리

### 3. 사용자 경험
- 실시간 연결 상태 표시
- 브라우저 알림 지원
- 읽음/안읽음 상태 시각적 구분

## 🔧 개발 가이드

### 타입 안전성
모든 컴포넌트와 함수에 TypeScript 타입을 적용하여 개발 시 오류를 방지합니다.

### 컴포넌트 재사용성
각 컴포넌트는 독립적으로 동작하도록 설계되어 재사용이 가능합니다.

### 에러 처리
네트워크 오류 및 WebSocket 연결 오류에 대한 적절한 처리가 포함되어 있습니다.

## 📝 사용법

1. **백엔드 서버 실행** (포트 8080)
2. **프론트엔드 개발 서버 실행** (포트 5173)
3. **댓글 작성**으로 알림 생성 테스트
4. **실시간 알림 수신** 확인

이 프로젝트는 React 초보자도 이해하기 쉽도록 간단하고 명확한 코드 구조로 작성되었습니다.