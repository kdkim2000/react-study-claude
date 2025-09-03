# 📁 실무 프로젝트 구조 - React Study

React 초보자를 위한 **실무에서 사용하는 프로젝트 구조** 학습 예제입니다. Material-UI를 활용한 체계적인 폴더 구조와 컴포넌트 설계 패턴을 배울 수 있습니다.

![프로젝트 스크린샷](https://via.placeholder.com/800x400/1976d2/ffffff?text=Project+Structure+Example)

## 🎯 학습 목표

이 프로젝트를 통해 다음을 학습할 수 있습니다:

- **📂 체계적인 폴더 구조**: 실무에서 사용하는 프로젝트 구조 이해
- **🧩 컴포넌트 분리**: 공통, 레이아웃, UI 컴포넌트 역할 구분
- **🎨 Material-UI 활용**: 테마 시스템과 커스텀 컴포넌트
- **🔗 커스텀 훅**: 로직 재사용을 위한 Hook 패턴
- **📱 반응형 디자인**: 다양한 화면 크기 대응
- **🔄 상태 관리**: React의 useState를 활용한 페이지 상태 관리

## 🚀 빠른 시작

### 1. 프로젝트 생성 및 설치

```bash
# 1. Vite를 사용한 React + TypeScript 프로젝트 생성
npm create vite@latest chapter01-project-structure -- --template react-ts
cd chapter01-project-structure

# 2. 필요한 패키지 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @vitejs/plugin-react-swc

# 3. 기본 패키지 설치
npm install

# 4. 개발 서버 시작
npm run dev
```

### 2. 접속 확인

브라우저에서 `http://localhost:5173`에 접속하여 애플리케이션을 확인하세요.

## 📁 프로젝트 구조 상세 설명

```
src/
├── assets/                 # 📎 정적 자원
│   ├── images/             #   - 이미지 파일
│   └── styles/             #   - 전역 스타일 (필요시)
├── components/             # 🧩 재사용 가능한 컴포넌트
│   ├── common/             #   - 공통 컴포넌트
│   │   ├── Header.tsx      #     • 네비게이션 헤더
│   │   ├── Footer.tsx      #     • 페이지 푸터
│   │   └── Loading.tsx     #     • 로딩 표시기
│   ├── layout/             #   - 레이아웃 컴포넌트
│   │   ├── MainLayout.tsx  #     • 메인 페이지 레이아웃
│   │   └── AuthLayout.tsx  #     • 로그인 페이지 레이아웃
│   └── ui/                 #   - UI 커스텀 컴포넌트
│       ├── CustomButton.tsx#     • 확장된 버튼
│       ├── CustomDialog.tsx#     • 맞춤형 다이얼로그
│       └── DataTable.tsx   #     • 데이터 테이블
├── hooks/                  # 🎣 커스텀 훅
│   ├── useAuth.ts          #   - 인증 관련 로직
│   ├── useApi.ts           #   - API 호출 로직
│   ├── useSnackbar.ts      #   - 알림 메시지 관리
│   └── useDialog.ts        #   - 다이얼로그 상태 관리
├── pages/                  # 📄 페이지 컴포넌트
│   ├── auth/               #   - 인증 관련 페이지
│   │   └── Login.tsx       #     • 로그인 페이지
│   ├── dashboard/          #   - 대시보드 페이지
│   │   └── Dashboard.tsx   #     • 메인 대시보드
│   └── board/              #   - 게시판 페이지
│       └── BoardList.tsx   #     • 게시글 목록
├── theme/                  # 🎨 Material-UI 테마
│   ├── index.ts            #   - 테마 메인 설정
│   ├── palette.ts          #   - 색상 팔레트
│   └── overrides.ts        #   - 컴포넌트 커스터마이징
├── App.tsx                 # 🏠 루트 컴포넌트
└── main.tsx               # 🚪 앱 진입점
```

## 🧩 핵심 컴포넌트 살펴보기

### 1. 📱 레이아웃 시스템

#### MainLayout.tsx
```typescript
// 메인 페이지의 기본 레이아웃 (헤더 + 콘텐츠 + 푸터)
<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <Header />           {/* 상단 네비게이션 */}
  <Container>          {/* 메인 콘텐츠 */}
    {children}
  </Container>
  <Footer />           {/* 하단 푸터 */}
</Box>
```

#### AuthLayout.tsx
```typescript
// 로그인 페이지의 중앙 정렬 레이아웃
<Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
  <Container maxWidth="sm">
    <Paper>{children}</Paper>
  </Container>
</Box>
```

### 2. 🎣 커스텀 훅 활용

#### useAuth.ts - 인증 관리
```typescript
const { user, login, logout, loading, isAuthenticated } = useAuth();

// 사용 예시
const handleLogin = async (credentials) => {
  const result = await login(credentials);
  if (result.success) {
    navigate('/dashboard');
  }
};
```

#### useApi.ts - API 데이터 관리
```typescript
const { data, loading, error, refetch } = useApi('/api/dashboard');

// 자동으로 로딩 상태와 에러 처리
if (loading) return <Loading />;
if (error) return <Typography color="error">{error}</Typography>;
```

#### useSnackbar.ts - 알림 관리
```typescript
const { showSuccess, showError, showWarning } = useSnackbar();

// 간단한 알림 표시
showSuccess('저장되었습니다!');
showError('오류가 발생했습니다.');
```

### 3. 🎨 테마 시스템

#### theme/palette.ts - 색상 정의
```typescript
export const palette = {
  primary: { main: '#1976d2' },      // 파란색 계열
  secondary: { main: '#9c27b0' },    // 보라색 계열
  background: { default: '#f5f5f5' } // 배경 색상
};
```

#### theme/overrides.ts - 컴포넌트 스타일 커스터마이징
```typescript
export const overrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,         // 둥근 모서리
        textTransform: 'none'    // 텍스트 대문자 변환 방지
      }
    }
  }
};
```

## 📄 페이지별 기능 설명

### 🔐 로그인 페이지 (Login.tsx)

**주요 기능:**
- 이메일/비밀번호 입력 폼
- 실시간 유효성 검사
- 로딩 상태 표시
- 에러 메시지 표시

**학습 포인트:**
```typescript
// useState로 폼 상태 관리
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

// 커스텀 훅 사용
const { login, loading } = useAuth();
const { showSuccess, showError } = useSnackbar();
```

### 📊 대시보드 (Dashboard.tsx)

**주요 기능:**
- 통계 카드 표시 (사용자 수, 게시글 수 등)
- 진행률 바 표시
- 그리드 레이아웃 활용

**학습 포인트:**
```typescript
// API 데이터 자동 로딩
const { data, loading, error } = useApi<DashboardData>('/api/dashboard');

// Grid 시스템으로 반응형 레이아웃
<Grid container spacing={3}>
  {stats.map((stat, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <Card>{/* 통계 내용 */}</Card>
    </Grid>
  ))}
</Grid>
```

### 📋 게시판 (BoardList.tsx)

**주요 기능:**
- 20개 샘플 데이터 표시
- 페이지네이션 (페이지당 5/10/25개)
- 게시글 상세 보기 다이얼로그
- 새로고침 기능

**학습 포인트:**
```typescript
// 커스텀 테이블 컴포넌트
<DataTable
  rows={data}
  columns={columns}
  loading={loading}
  height={600}
/>

// 다이얼로그 상태 관리
const { open, openDialog, closeDialog } = useDialog();
```

## 🛠 사용된 기술 스택

| 기술 | 용도 | 버전 |
|------|------|------|
| **React** | UI 라이브러리 | ^18.2.0 |
| **TypeScript** | 타입 안전성 | ^5.2.2 |
| **Material-UI** | UI 컴포넌트 | ^5.15.0 |
| **Vite** | 빌드 도구 | ^5.0.0 |
| **Emotion** | CSS-in-JS | ^11.11.1 |

## 🔍 주요 학습 포인트

### 1. **폴더 구조의 중요성**
```
❌ 잘못된 구조                   ✅ 올바른 구조
src/                           src/
├── Component1.tsx             ├── components/
├── Component2.tsx             │   ├── common/
├── page1.tsx                  │   ├── layout/
├── page2.tsx                  │   └── ui/
├── hook1.ts                   ├── pages/
└── hook2.ts                   ├── hooks/
                              └── theme/
```

### 2. **컴포넌트 재사용성**
```typescript
// ❌ 반복적인 코드
<Button onClick={handleClick} disabled={loading}>
  {loading ? '로딩 중...' : '저장'}
</Button>

// ✅ 커스텀 컴포넌트 활용
<CustomButton loading={loading} onClick={handleClick}>
  저장
</CustomButton>
```

### 3. **로직 분리**
```typescript
// ❌ 컴포넌트 내부에 복잡한 로직
const MyComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const login = async (credentials) => {
    // 복잡한 인증 로직...
  };
  // ...
};

// ✅ 커스텀 훅으로 로직 분리
const MyComponent = () => {
  const { user, login, loading } = useAuth();
  // 간단하고 명확한 컴포넌트
};
```

## 🎨 UI/UX 특징

### 📱 반응형 디자인
- **모바일 퍼스트**: 작은 화면부터 설계
- **브레이크포인트 활용**: xs, sm, md, lg, xl
- **유연한 그리드**: Material-UI Grid 시스템

### 🎯 사용자 경험
- **로딩 상태**: 모든 비동기 작업에 로딩 표시
- **에러 처리**: 친화적인 에러 메시지
- **피드백**: 성공/실패에 대한 즉각적인 알림
- **직관적 네비게이션**: 명확한 메뉴 구조

## 🚀 확장 아이디어

이 프로젝트를 기반으로 다음 기능들을 추가해볼 수 있습니다:

### 1. **고급 기능 추가**
- 🔍 **검색 기능**: 게시글 제목/내용 검색
- 📊 **정렬 기능**: 날짜순, 작성자순 정렬
- 🏷️ **태그 시스템**: 게시글 분류 기능
- 💬 **댓글 기능**: 게시글별 댓글 작성

### 2. **상태 관리 업그레이드**
- 🔄 **Context API**: 전역 상태 관리
- 📦 **Zustand**: 간단한 상태 관리 라이브러리
- 🌐 **React Query**: 서버 상태 관리

### 3. **실제 백엔드 연동**
- 🛠️ **REST API**: 실제 서버와 연동
- 🔐 **JWT 인증**: 실제 인증 시스템
- 📁 **파일 업로드**: 이미지 업로드 기능

## 🐛 문제 해결 가이드

### 자주 발생하는 문제들

#### 1. **패키지 설치 오류**
```bash
# node_modules 정리 후 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 2. **TypeScript 오류**
```bash
# 타입 체크 확인
npm run build
```

#### 3. **Material-UI 스타일 적용 안됨**
```typescript
// ThemeProvider로 앱을 감싸는지 확인
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## 📚 추가 학습 자료

### 📖 공식 문서
- [React 공식 문서](https://react.dev/)
- [Material-UI 가이드](https://mui.com/getting-started/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

### 🎥 추천 학습 영상
- React 18 새로운 기능
- Material-UI 커스터마이징
- TypeScript React 패턴

### 🛠️ 추천 도구
- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - Prettier
  - ESLint

## 💡 베스트 프랙티스

### 1. **컴포넌트 작성**
```typescript
// ✅ 좋은 예시
interface Props {
  title: string;
  onSubmit: () => void;
}

const MyComponent = ({ title, onSubmit }: Props) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Button onClick={onSubmit}>제출</Button>
    </Box>
  );
};
```

### 2. **폴더 네이밍**
```
✅ 올바른 네이밍
components/
  common/
  layout/
  ui/

❌ 피해야 할 네이밍  
Components/
  Common/
  Layout/
  UI/
```

### 3. **Import 순서**
```typescript
// 1. React 관련
import { useState, useEffect } from 'react';

// 2. 외부 라이브러리
import { Box, Typography } from '@mui/material';

// 3. 내부 컴포넌트
import CustomButton from '../ui/CustomButton';

// 4. 타입
import { User } from '../types/user';
```

## 🎉 프로젝트 완주 후 할 일

1. **✅ 코드 리뷰**: 각 컴포넌트의 역할과 구조 이해
2. **🔄 기능 확장**: 새로운 페이지나 기능 추가
3. **🎨 디자인 커스터마이징**: 자신만의 테마 만들기
4. **📱 반응형 테스트**: 다양한 화면 크기에서 테스트
5. **🚀 배포**: Vercel, Netlify 등으로 배포

---

## 📞 도움이 필요하다면

- 🐛 **버그 리포트**: GitHub Issues 활용
- 💬 **질문하기**: 개발 커뮤니티 활용
- 📧 **피드백**: 프로젝트 개선사항 제안

**즐거운 React 학습 되세요!** 🚀✨