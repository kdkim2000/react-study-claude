# React TodoList 프로젝트

## 📋 프로젝트 개요

이 프로젝트는 React와 Material-UI를 활용한 할일 관리 애플리케이션입니다. Vue3 (Vuetify) TodoList를 React로 변환한 과제로, React 초보자가 컴포넌트 구조, 상태 관리, 그리고 Material-UI 사용법을 학습할 수 있도록 설계되었습니다.

## 🎯 학습 목표

- React 함수형 컴포넌트와 Hooks 사용법 이해
- Material-UI 컴포넌트 라이브러리 활용
- 컴포넌트 간 데이터 전달 (Props)
- 상태 관리 (useState, useMemo)
- 이벤트 핸들링
- 조건부 렌더링
- 배열 메서드를 이용한 데이터 필터링 및 정렬

## 🚀 기능

- ✅ 할일 추가/삭제/수정
- ✅ 할일 완료/미완료 토글
- ✅ 우선순위 설정 (높음/보통/낮음)
- ✅ 카테고리 분류
- ✅ 검색 기능
- ✅ 필터링 (전체/진행중/완료)
- ✅ 진행률 표시
- ✅ 반응형 디자인
- ✅ 완료된 항목 일괄 삭제

## 📁 프로젝트 구조

```
src/
├── App.tsx              # 메인 애플리케이션 컴포넌트
├── App.css              # 반응형 스타일
├── index.css            # 전역 스타일
├── main.tsx             # 애플리케이션 진입점
├── vite-env.d.ts        # Vite 타입 정의
├── components/          # 컴포넌트 디렉토리
│   ├── TodoList.tsx     # 메인 할일 목록 컴포넌트
│   ├── TodoItem.tsx     # 개별 할일 항목 컴포넌트
│   ├── TodoForm.tsx     # 할일 추가 폼 컴포넌트
│   └── TodoFilters.tsx  # 필터링 컴포넌트
└── types/
    └── todo.ts          # TypeScript 타입 정의
```

## 🏗️ 컴포넌트 구조 분석

### 1. App.tsx (루트 컴포넌트)
```typescript
// 테마 설정과 전역 스타일을 담당하는 최상위 컴포넌트
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <TodoList />
      </Container>
    </ThemeProvider>
  );
};
```

**핵심 개념:**
- **ThemeProvider**: Material-UI 테마 제공
- **CssBaseline**: 브라우저 기본 스타일 초기화
- **Container**: 반응형 레이아웃 컨테이너

### 2. TodoList.tsx (메인 컨테이너)
```typescript
const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 필터링된 할일 목록 계산
  const filteredTodos = useMemo(() => {
    // 복잡한 필터링 로직
  }, [todos, filter, searchTerm]);
```

**핵심 개념:**
- **useState**: 상태 관리 Hook
- **useMemo**: 성능 최적화를 위한 메모이제이션
- **Props 전달**: 자식 컴포넌트에 데이터와 함수 전달

### 3. TodoItem.tsx (개별 항목)
```typescript
const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <ListItem>
      <Checkbox onChange={() => onToggle(todo.id)} />
      <ListItemText primary={todo.text} />
      <IconButton onClick={() => onDelete(todo.id)} />
    </ListItem>
  );
};
```

**핵심 개념:**
- **Props 인터페이스**: TypeScript로 Props 타입 정의
- **조건부 렌더링**: isEditing 상태에 따른 UI 변경
- **이벤트 버블링 제어**: stopPropagation() 사용

### 4. TodoForm.tsx (입력 폼)
```typescript
const TodoForm = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ text, priority, completed: false });
    setText(''); // 폼 초기화
  };
};
```

**핵심 개념:**
- **Controlled Components**: React가 입력값을 제어
- **Form Validation**: 빈 값 검증
- **Event Handling**: onSubmit, onChange 등

### 5. TodoFilters.tsx (필터링)
```typescript
const TodoFilters = ({ filter, onFilterChange, searchTerm, onSearchChange }) => {
  return (
    <Box>
      <TextField onChange={(e) => onSearchChange(e.target.value)} />
      <ToggleButtonGroup value={filter} onChange={onFilterChange}>
        <ToggleButton value="all">전체</ToggleButton>
        <ToggleButton value="active">진행중</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
```

**핵심 개념:**
- **Props Drilling**: 상위에서 하위로 데이터 전달
- **Callback Functions**: 하위에서 상위로 이벤트 전달

## 🔧 핵심 React 개념 설명

### 1. useState Hook
```typescript
const [todos, setTodos] = useState<Todo[]>([]);
// todos: 현재 상태값
// setTodos: 상태를 업데이트하는 함수
// useState<Todo[]>([]): 초기값으로 빈 배열 설정
```

### 2. Props 전달
```typescript
// 부모 컴포넌트에서
<TodoItem 
  todo={todo} 
  onToggle={toggleTodo} 
  onDelete={deleteTodo} 
/>

// 자식 컴포넌트에서
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}
```

### 3. 상태 업데이트 패턴
```typescript
// 배열에 새 항목 추가
setTodos(prev => [newTodo, ...prev]);

// 배열에서 항목 제거
setTodos(prev => prev.filter(todo => todo.id !== id));

// 배열의 특정 항목 수정
setTodos(prev => 
  prev.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
);
```

### 4. 조건부 렌더링
```typescript
{filteredTodos.length === 0 ? (
  <Typography>할일이 없습니다</Typography>
) : (
  <List>
    {filteredTodos.map(todo => (
      <TodoItem key={todo.id} todo={todo} />
    ))}
  </List>
)}
```

### 5. useMemo 최적화
```typescript
const filteredTodos = useMemo(() => {
  // 복잡한 계산 로직
  return todos.filter(/* 필터링 조건 */);
}, [todos, filter, searchTerm]); // 의존성 배열
```

## 🎨 Material-UI 컴포넌트 활용

### 레이아웃 컴포넌트
- **Container**: 반응형 컨테이너
- **Box**: Flexbox 기반 레이아웃
- **Paper**: 그림자 효과가 있는 컨테이너

### 입력 컴포넌트
- **TextField**: 텍스트 입력 필드
- **Select**: 드롭다운 선택
- **Checkbox**: 체크박스
- **ToggleButton**: 토글 버튼

### 표시 컴포넌트
- **Typography**: 텍스트 표시
- **Chip**: 태그/라벨 표시
- **LinearProgress**: 진행률 바
- **List/ListItem**: 목록 표시

### 액션 컴포넌트
- **Button**: 일반 버튼
- **IconButton**: 아이콘 버튼
- **Fab**: 플로팅 액션 버튼

## 💡 중요한 패턴과 베스트 프랙티스

### 1. 컴포넌트 분리 원칙
```typescript
// ❌ 나쁜 예: 모든 로직이 한 컴포넌트에
const TodoApp = () => {
  // 300줄의 복잡한 로직...
};

// ✅ 좋은 예: 기능별로 컴포넌트 분리
const TodoList = () => {
  return (
    <>
      <TodoForm onAdd={addTodo} />
      <TodoFilters onFilter={setFilter} />
      <TodoItems todos={filteredTodos} />
    </>
  );
};
```

### 2. Props 인터페이스 정의
```typescript
// TypeScript 인터페이스로 Props 타입 명시
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}
```

### 3. 이벤트 처리 패턴
```typescript
// 이벤트 버블링 방지
const handleEdit = (e: React.MouseEvent) => {
  e.stopPropagation(); // 부모 클릭 이벤트 방지
  setIsEditing(true);
};

// 키보드 이벤트 처리
const handleKeyPress = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSave();
  } else if (event.key === 'Escape') {
    handleCancel();
  }
};
```

### 4. 상태 업데이트 최적화
```typescript
// 이전 상태를 기반으로 업데이트
setTodos(prev => 
  prev.map(todo => 
    todo.id === id 
      ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
      : todo
  )
);
```

## 🛠️ 설치 및 실행

```bash
# 프로젝트 생성 (Vite + React + TypeScript)
npm create vite@latest react-todolist -- --template react-ts
cd react-todolist

# 의존성 설치
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# 개발 서버 실행
npm run dev
```

## 📚 추가 학습 리소스

### React 기초
- [React 공식 문서](https://react.dev/)
- [React Hooks 가이드](https://react.dev/reference/react)

### Material-UI
- [MUI 공식 문서](https://mui.com/)
- [MUI 컴포넌트 데모](https://mui.com/components/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React와 TypeScript](https://react-typescript-cheatsheet.netlify.app/)

## 🎯 실습 과제

### 초급 과제
1. **색상 테마 변경**: Material-UI 테마의 primary 색상을 변경해보세요
2. **새로운 필드 추가**: 할일에 '마감일' 필드를 추가해보세요
3. **아이콘 변경**: 우선순위별로 다른 아이콘을 표시해보세요

### 중급 과제
1. **정렬 기능**: 생성일, 우선순위, 이름순 정렬 기능을 추가하세요
2. **로컬 스토리지**: 브라우저 새로고침 후에도 데이터가 유지되도록 하세요
3. **드래그 앤 드롭**: 할일 순서를 드래그로 변경할 수 있게 하세요

### 고급 과제
1. **Context API**: Props Drilling을 해결하기 위해 Context를 사용하세요
2. **useReducer**: useState 대신 useReducer로 복잡한 상태를 관리하세요
3. **React Query**: 서버 상태 관리를 위해 React Query를 도입하세요

## 🔍 코드 리뷰 포인트

### 체크리스트
- [ ] 컴포넌트가 단일 책임 원칙을 따르는가?
- [ ] Props 타입이 명확히 정의되었는가?
- [ ] 불필요한 리렌더링이 발생하지 않는가?
- [ ] 이벤트 핸들러가 적절히 구현되었는가?
- [ ] 접근성(Accessibility)이 고려되었는가?
- [ ] 에러 처리가 되어 있는가?

### 성능 최적화 팁
```typescript
// useMemo로 비용이 큰 계산 최적화
const expensiveCalculation = useMemo(() => {
  return todos.filter(/* 복잡한 필터링 */);
}, [todos, filter]);

// useCallback으로 함수 메모이제이션
const handleToggle = useCallback((id: number) => {
  setTodos(prev => /* 상태 업데이트 */);
}, []);
```

## 🤝 기여하기

이 프로젝트는 학습 목적으로 만들어졌습니다. 개선 사항이나 버그를 발견하시면 언제든지 이슈를 등록하거나 풀 리퀘스트를 보내주세요.

---

**Happy Coding! 🚀**
