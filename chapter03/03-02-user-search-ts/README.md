# React 사용자 검색 시스템

## 프로젝트 개요

이 프로젝트는 React 중급 학습자를 위한 사용자 검색 및 필터링 시스템입니다. 실시간 검색, 다중 필터링, 페이지네이션, 일괄 선택 등 실무에서 자주 사용되는 기능들을 종합적으로 구현했습니다. Material-UI를 활용한 현대적인 UI와 함께 TypeScript로 타입 안전성을 보장합니다.

## 학습 목표

- **상태 관리**: 복잡한 상태를 useState와 useMemo로 관리
- **배열 메서드**: filter, map, slice 등을 활용한 데이터 처리
- **실시간 검색**: 사용자 입력에 따른 즉시 필터링
- **다중 선택**: Set을 활용한 효율적인 선택 관리
- **페이지네이션**: 대용량 데이터의 효율적인 표시
- **컴포넌트 구성**: 기능별 컴포넌트 분리와 Props 전달
- **성능 최적화**: useMemo를 통한 불필요한 재계산 방지

## 주요 기능

- 사용자 목록 카드 뷰로 표시
- 이름/이메일 실시간 검색
- 역할별 다중 필터링 (관리자, 매니저, 개발자, 디자이너, 인턴)
- 개별/일괄 사용자 선택
- 페이지네이션 (8/12/24/50개씩 표시)
- 선택된 사용자 통계 표시
- 반응형 그리드 레이아웃

## 프로젝트 구조

```
src/
├── App.tsx                    # 메인 애플리케이션 컴포넌트
├── App.css                    # 전역 스타일
├── index.css                  # 기본 스타일
├── main.tsx                   # 애플리케이션 진입점
├── components/                # UI 컴포넌트
│   ├── UserList.tsx          # 메인 사용자 목록 컨테이너
│   ├── UserCard.tsx          # 개별 사용자 카드 컴포넌트
│   └── UserFilters.tsx       # 검색 및 필터 컴포넌트
├── data/                      # 데이터 파일
│   └── mockUsers.ts          # 샘플 사용자 데이터
└── types/                     # 타입 정의
    └── user.ts               # 사용자 관련 타입
```

## 핵심 컴포넌트 분석

### 1. App.tsx (루트 컴포넌트)

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  // 컴포넌트별 스타일 오버라이드
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 }
      }
    }
  }
});
```

**핵심 개념:**
- **테마 커스터마이징**: Material-UI 테마 시스템 활용
- **컴포넌트 오버라이드**: 기본 스타일을 프로젝트에 맞게 수정
- **레이아웃 구성**: AppBar와 Container를 통한 기본 레이아웃

### 2. UserList.tsx (메인 컨테이너)

```typescript
const UserList: React.FC<UserListProps> = ({ users }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    selectedRoles: []
  });
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(12);

  // 필터링된 사용자 목록 (성능 최적화)
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = filters.searchTerm === '' || 
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesRole = filters.selectedRoles.length === 0 ||
        filters.selectedRoles.includes(user.role);

      return matchesSearch && matchesRole;
    });
  }, [users, filters]);
  
  // 페이지네이션된 사용자 목록
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, usersPerPage]);
```

**핵심 개념:**
- **useMemo 최적화**: 필터링과 페이지네이션 결과를 캐시하여 성능 향상
- **Set을 활용한 선택**: 중복 없는 사용자 ID 관리로 효율적인 선택 처리
- **의존성 배열**: useMemo의 의존성 배열로 필요할 때만 재계산

### 3. 검색 및 필터링 로직

```typescript
// 실시간 검색 처리
const matchesSearch = filters.searchTerm === '' || 
  user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

// 다중 역할 필터링
const matchesRole = filters.selectedRoles.length === 0 ||
  filters.selectedRoles.includes(user.role);

// 두 조건 모두 만족하는 사용자만 표시
return matchesSearch && matchesRole;
```

**핵심 개념:**
- **문자열 검색**: `toLowerCase()`와 `includes()`를 통한 대소문자 무관 검색
- **다중 조건 필터링**: 배열의 `includes()` 메서드로 역할 필터링
- **논리 연산**: AND 조건으로 여러 필터 조건 결합

### 4. UserCard.tsx (사용자 카드 컴포넌트)

```typescript
const UserCard: React.FC<UserCardProps> = ({
  user,
  isSelected,
  onSelectionChange
}) => {
  const roleInfo = USER_ROLES.find(r => r.value === user.role);
  
  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(user.id, event.target.checked);
  };

  const getAvatarText = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card 
      elevation={isSelected ? 4 : 1}
      sx={{ 
        border: isSelected ? `2px solid ${roleInfo?.color}` : 'none',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Avatar sx={{ bgcolor: roleInfo?.color }}>
        {getAvatarText(user.name)}
      </Avatar>
      <Checkbox
        checked={isSelected}
        onChange={handleSelectionChange}
      />
    </Card>
  );
};
```

**핵심 개념:**
- **Props 기반 렌더링**: 부모로부터 받은 props에 따른 조건부 스타일링
- **이벤트 버블링**: 체크박스 이벤트를 부모 컴포넌트로 전달
- **동적 스타일링**: 선택 상태에 따른 카드 스타일 변경

### 5. 선택 관리 시스템

```typescript
// Set을 사용한 효율적인 선택 관리
const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

// 개별 선택/해제
const handleUserSelectionChange = (userId: number, selected: boolean) => {
  const newSelectedUsers = new Set(selectedUsers);
  if (selected) {
    newSelectedUsers.add(userId);
  } else {
    newSelectedUsers.delete(userId);
  }
  setSelectedUsers(newSelectedUsers);
};

// 현재 페이지 전체 선택
const handleSelectAll = () => {
  const allVisibleUserIds = new Set(paginatedUsers.map(user => user.id));
  setSelectedUsers(prev => new Set([...prev, ...allVisibleUserIds]));
};

// 검색 결과 전체 선택
const handleSelectAllFiltered = () => {
  const allFilteredUserIds = new Set(filteredUsers.map(user => user.id));
  setSelectedUsers(allFilteredUserIds);
};
```

**핵심 개념:**
- **Set 데이터 구조**: 중복 없는 ID 관리로 성능 최적화
- **불변성 유지**: 새로운 Set 객체를 생성하여 상태 업데이트
- **스프레드 연산자**: 기존 선택과 새로운 선택을 합치기

### 6. 페이지네이션 구현

```typescript
const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

const paginatedUsers = useMemo(() => {
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  return filteredUsers.slice(startIndex, endIndex);
}, [filteredUsers, currentPage, usersPerPage]);

const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
  setCurrentPage(page);
};
```

**핵심 개념:**
- **배열 슬라이싱**: `slice()` 메서드로 현재 페이지에 해당하는 데이터만 추출
- **계산된 값**: Math.ceil로 총 페이지 수 계산
- **상태 동기화**: 필터 변경 시 첫 페이지로 자동 이동

## 타입 정의 구조

### user.ts 타입 시스템

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  joinDate: string;
}

export type UserRole = 'admin' | 'manager' | 'developer' | 'designer' | 'intern';

export interface FilterOptions {
  searchTerm: string;
  selectedRoles: UserRole[];
}

// 역할별 메타데이터
export const USER_ROLES = [
  { value: 'admin', label: '관리자', color: '#f44336' },
  { value: 'manager', label: '매니저', color: '#ff9800' },
  { value: 'developer', label: '개발자', color: '#2196f3' },
  { value: 'designer', label: '디자이너', color: '#9c27b0' },
  { value: 'intern', label: '인턴', color: '#4caf50' },
];
```

**핵심 개념:**
- **Union 타입**: `UserRole` 타입으로 허용 가능한 역할 제한
- **인터페이스 확장**: 기본 User 인터페이스와 추가 옵션들
- **상수 배열**: 역할별 메타데이터를 객체 배열로 관리

## 실무 패턴과 베스트 프랙티스

### 1. 성능 최적화 전략

```typescript
// ❌ 매번 재계산되는 비효율적인 방법
const filteredUsers = users.filter(user => {
  // 복잡한 필터링 로직
});

// ✅ useMemo로 최적화된 방법
const filteredUsers = useMemo(() => {
  return users.filter(user => {
    // 복잡한 필터링 로직
  });
}, [users, filters]); // 의존성이 변경될 때만 재계산
```

### 2. 상태 구조 설계

```typescript
// ❌ 여러 개의 개별 상태
const [searchTerm, setSearchTerm] = useState('');
const [selectedRoles, setSelectedRoles] = useState([]);
const [currentPage, setCurrentPage] = useState(1);

// ✅ 관련된 상태를 객체로 그룹화
const [filters, setFilters] = useState<FilterOptions>({
  searchTerm: '',
  selectedRoles: []
});
```

### 3. 컴포넌트 책임 분리

```typescript
// ✅ 각 컴포넌트가 명확한 역할 담당
- UserList: 전체 상태 관리와 데이터 흐름 제어
- UserFilters: 검색과 필터링 UI만 담당
- UserCard: 개별 사용자 표시와 선택만 담당
```

### 4. 에러 처리와 예외 상황

```typescript
// 빈 검색 결과 처리
{filteredUsers.length === 0 ? (
  <Alert severity="info">
    <Typography variant="h6">검색 결과가 없습니다</Typography>
    <Typography variant="body2">
      검색어나 필터 조건을 확인해보세요.
    </Typography>
  </Alert>
) : (
  // 정상적인 목록 표시
)}

// 선택 가능한 상태 체크
<Button
  onClick={handleSelectAll}
  disabled={paginatedUsers.length === 0}
>
  전체 선택
</Button>
```

## Material-UI 고급 활용

### 1. 그리드 시스템 활용

```typescript
<Grid container spacing={3}>
  {paginatedUsers.map(user => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
      <UserCard user={user} />
    </Grid>
  ))}
</Grid>
```

**반응형 브레이크포인트:**
- `xs={12}`: 모바일에서 전체 너비
- `sm={6}`: 태블릿에서 2개씩
- `md={4}`: 데스크탑에서 3개씩
- `lg={3}`: 대형 화면에서 4개씩

### 2. 테마 기반 스타일링

```typescript
<Card
  sx={{
    '&:hover': {
      elevation: 3,
      transform: 'translateY(-2px)'
    },
    border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none'
  }}
>
```

### 3. 아이콘과 타이포그래피

```typescript
<Box display="flex" alignItems="center" gap={1}>
  <EmailIcon fontSize="small" color="action" />
  <Typography variant="body2" color="text.secondary">
    {user.email}
  </Typography>
</Box>
```

## 실습 과제

### 초급 과제
1. **정렬 기능 추가**: 이름순, 입사일순 정렬 버튼 추가
2. **테마 변경**: 다크 테마 지원 기능 구현
3. **카드 레이아웃 변경**: 리스트 뷰와 카드 뷰 토글 기능

### 중급 과제
1. **고급 필터**: 입사일 범위, 부서별 필터링 추가
2. **즐겨찾기**: 사용자를 즐겨찾기로 표시하는 기능
3. **내보내기**: 선택된 사용자를 CSV로 내보내기

### 고급 과제
1. **무한 스크롤**: 페이지네이션 대신 무한 스크롤 구현
2. **드래그 앤 드롭**: 사용자를 그룹으로 드래그하여 역할 변경
3. **실시간 검색 최적화**: debounce를 적용한 성능 최적화

## 일반적인 실수와 해결 방법

### 1. 무한 리렌더링

```typescript
// ❌ 의존성 배열을 잘못 설정한 경우
useEffect(() => {
  setFilteredUsers(users.filter(/* 필터링 로직 */));
}, [users.length]); // users 배열이 변경되어도 length만 같으면 실행 안됨

// ✅ 올바른 의존성 설정
useMemo(() => {
  return users.filter(/* 필터링 로직 */);
}, [users, filters]);
```

### 2. 상태 불변성 위반

```typescript
// ❌ 기존 Set을 직접 수정
selectedUsers.add(userId);
setSelectedUsers(selectedUsers);

// ✅ 새로운 Set 생성
const newSelectedUsers = new Set(selectedUsers);
newSelectedUsers.add(userId);
setSelectedUsers(newSelectedUsers);
```

### 3. 키(key) prop 누락

```typescript
// ❌ 키가 없어서 React가 효율적으로 업데이트 불가
{users.map(user => <UserCard user={user} />)}

// ✅ 고유한 키 제공
{users.map(user => <UserCard key={user.id} user={user} />)}
```

## 성능 모니터링 및 디버깅

### React DevTools 활용

```javascript
// 컴포넌트 렌더링 횟수 확인
console.log('UserList 렌더링:', Date.now());

// 필터링 결과 확인
console.log('필터링된 사용자 수:', filteredUsers.length);
```

### Profiler API 사용

```typescript
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('컴포넌트:', id, '단계:', phase, '시간:', actualDuration);
};

<Profiler id="UserList" onRender={onRenderCallback}>
  <UserList users={users} />
</Profiler>
```

## 설치 및 실행

```bash
# 프로젝트 생성
npm create vite@latest user-search-app -- --template react-ts
cd user-search-app

# 의존성 설치
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# 개발 서버 실행
npm run dev
```

## 추가 학습 리소스

### React 고급 패턴
- [React Patterns](https://reactpatterns.com/) - 실무에서 사용되는 React 패턴
- [React Performance](https://react.dev/learn/render-and-commit) - 성능 최적화 가이드

### Material-UI 심화
- [MUI System](https://mui.com/system/basics/) - 스타일링 시스템 가이드
- [MUI Data Grid](https://mui.com/x/react-data-grid/) - 고급 테이블 컴포넌트

### TypeScript + React
- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react) - 타입스크립트 활용 가이드

## 다음 단계

이 프로젝트를 완료했다면 다음 주제들을 학습해보세요:

1. **상태 관리 라이브러리**: Context API, Zustand, Redux Toolkit
2. **데이터 페칭**: React Query, SWR을 활용한 서버 상태 관리
3. **폼 처리**: React Hook Form을 활용한 복잡한 폼 관리
4. **테스팅**: Jest, React Testing Library를 활용한 컴포넌트 테스트
5. **최적화**: React.memo, useCallback, 코드 분할 등 고급 최적화 기법

이 검색 시스템 프로젝트는 실무에서 자주 마주치는 패턴들을 종합적으로 다루고 있어, React 개발자로서 한 단계 성장할 수 있는 좋은 기반이 될 것입니다.