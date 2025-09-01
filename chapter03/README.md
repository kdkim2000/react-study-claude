# Chapter 3: React 기본 문법

## 📚 학습 목표
- JSX 문법과 규칙을 이해하고 Vue 템플릿과 비교
- 함수형 컴포넌트 작성법 마스터
- Props와 State의 차이점과 사용법 이해
- React의 이벤트 처리 방식 습득

---

## 1. JSX 문법과 규칙

### 이론 설명 (30%)

JSX(JavaScript XML)는 JavaScript를 확장한 문법으로, HTML과 유사하게 생겼지만 JavaScript입니다. Vue의 템플릿과 달리 JSX는 JavaScript 표현식이므로 더 유연하지만, 몇 가지 규칙을 따라야 합니다.

#### JSX 주요 규칙

| 규칙 | Vue3 템플릿 | React JSX |
|------|------------|-----------|
| 최상위 요소 | 여러 개 가능 | Fragment 필요 |
| 클래스 지정 | `class` | `className` |
| 스타일 바인딩 | `:style="객체"` 또는 문자열 | `style={객체}` (camelCase) |
| 주석 | `<!-- -->` | `{/* */}` |
| HTML 속성 | kebab-case | camelCase |
| 조건부 속성 | `:disabled="조건"` | `disabled={조건}` |
| 이벤트 | `@click` | `onClick` |

### 실습 코드 (70%)

#### 1.1 JSX 기본 문법

```vue
<!-- Vue3 Template -->
<template>
  <!-- 여러 루트 요소 가능 -->
  <v-app-bar color="primary">
    <v-app-bar-title>{{ title }}</v-app-bar-title>
  </v-app-bar>
  
  <v-container class="my-container">
    <!-- HTML 속성 kebab-case -->
    <v-text-field
      :value="inputValue"
      :placeholder="placeholderText"
      :disabled="isDisabled"
      @input="handleInput"
      label="입력"
      data-testid="input-field"
    />
    
    <!-- 스타일 바인딩 -->
    <v-card
      :style="{ backgroundColor: bgColor, padding: '20px' }"
      :class="{ active: isActive, 'error-card': hasError }"
    >
      <!-- 조건부 렌더링 -->
      <v-card-text v-if="showContent">
        {{ content }}
      </v-card-text>
    </v-card>
    
    <!-- HTML 직접 삽입 -->
    <div v-html="htmlContent"></div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const title = ref('My App')
const inputValue = ref('')
const isDisabled = ref(false)
const isActive = ref(true)
const hasError = ref(false)
const showContent = ref(true)
const content = ref('Card Content')
const bgColor = ref('#f5f5f5')
const htmlContent = ref('<strong>Bold Text</strong>')

const placeholderText = computed(() => 
  isDisabled.value ? '비활성화됨' : '입력하세요'
)

const handleInput = (e: Event) => {
  inputValue.value = (e.target as HTMLInputElement).value
}
</script>
```

```tsx
// React JSX
import { useState, useMemo } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Card,
  CardContent,
  Box
} from '@mui/material'

function JSXBasics() {
  const [title] = useState('My App')
  const [inputValue, setInputValue] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const [content] = useState('Card Content')
  const [bgColor] = useState('#f5f5f5')
  const [htmlContent] = useState('<strong>Bold Text</strong>')
  
  const placeholderText = useMemo(() => 
    isDisabled ? '비활성화됨' : '입력하세요',
    [isDisabled]
  )
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  
  return (
    // Fragment로 여러 요소 감싸기 (Vue3는 불필요)
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      
      <Container className="my-container">
        {/* HTML 속성 camelCase */}
        <TextField
          value={inputValue}
          placeholder={placeholderText}
          disabled={isDisabled}
          onChange={handleInput}
          label="입력"
          data-testid="input-field"  // kebab-case 허용 (data-, aria-)
          fullWidth
          margin="normal"
        />
        
        {/* 스타일 바인딩 - camelCase 필수! */}
        <Card
          style={{ 
            backgroundColor: bgColor,  // background-color (X)
            padding: '20px' 
          }}
          className={`
            ${isActive ? 'active' : ''} 
            ${hasError ? 'error-card' : ''}
          `}
        >
          {/* 조건부 렌더링 */}
          {showContent && (
            <CardContent>
              {content}
            </CardContent>
          )}
        </Card>
        
        {/* HTML 직접 삽입 - dangerouslySetInnerHTML */}
        <Box 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          sx={{ mt: 2 }}
        />
      </Container>
    </>
  )
}
```

#### 1.2 JSX 표현식과 JavaScript

```tsx
// React - JSX 내에서 JavaScript 사용
import { useState } from 'react'
import { 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box,
  Typography 
} from '@mui/material'

function JSXExpressions() {
  const [items] = useState([
    { id: 1, name: 'Item 1', price: 1000, active: true },
    { id: 2, name: 'Item 2', price: 2000, active: false },
    { id: 3, name: 'Item 3', price: 3000, active: true },
  ])
  
  // JSX 내에서 모든 JavaScript 표현식 사용 가능
  return (
    <Box>
      {/* 1. 삼항 연산자 */}
      <Typography variant="h6">
        {items.length > 0 ? `${items.length}개 항목` : '항목 없음'}
      </Typography>
      
      {/* 2. 논리 연산자 */}
      {items.length > 0 && (
        <Typography>첫 번째 항목: {items[0].name}</Typography>
      )}
      
      {/* 3. 즉시 실행 함수 (IIFE) */}
      <Box>
        {(() => {
          const total = items.reduce((sum, item) => sum + item.price, 0)
          return <Typography>총합: {total.toLocaleString()}원</Typography>
        })()}
      </Box>
      
      {/* 4. map과 filter 체이닝 */}
      <List>
        {items
          .filter(item => item.active)
          .map(item => (
            <ListItem key={item.id}>
              <ListItemText primary={item.name} />
              <Chip 
                label={`${item.price.toLocaleString()}원`}
                color="primary"
                size="small"
              />
            </ListItem>
          ))
        }
      </List>
      
      {/* 5. switch 표현식 (IIFE 활용) */}
      {(() => {
        switch(items.length) {
          case 0: return <Typography>항목이 없습니다</Typography>
          case 1: return <Typography>항목이 1개입니다</Typography>
          default: return <Typography>항목이 {items.length}개입니다</Typography>
        }
      })()}
      
      {/* 6. 조건부 클래스 및 스타일 */}
      <Box
        className={items.length > 2 ? 'many-items' : 'few-items'}
        sx={{
          bgcolor: items.length > 0 ? 'success.light' : 'grey.200',
          p: 2,
          borderRadius: 1
        }}
      >
        조건부 스타일링
      </Box>
    </Box>
  )
}
```

---

## 2. 컴포넌트 작성 (함수형)

### 이론 설명

React의 함수형 컴포넌트는 Vue3의 SFC(Single File Component)와 유사하지만, 구조가 다릅니다.

| 특징 | Vue3 SFC | React 함수형 컴포넌트 |
|------|----------|---------------------|
| 파일 구조 | template, script, style 분리 | JSX 반환하는 함수 |
| Props 정의 | `defineProps` | TypeScript 인터페이스 |
| 내부 상태 | `ref`, `reactive` | `useState` |
| 스타일 | `<style>` 태그 | CSS 파일 또는 CSS-in-JS |

### 실습 코드

#### 2.1 기본 컴포넌트 구조

```vue
<!-- Vue3 Component: UserCard.vue -->
<template>
  <v-card :elevation="elevation" class="user-card">
    <v-card-title>
      <v-avatar :color="avatarColor" size="40">
        {{ initials }}
      </v-avatar>
      <span class="ml-3">{{ fullName }}</span>
    </v-card-title>
    
    <v-card-text>
      <v-chip 
        v-for="role in user.roles" 
        :key="role"
        size="small"
        class="mr-1"
      >
        {{ role }}
      </v-chip>
    </v-card-text>
    
    <v-card-actions>
      <v-btn 
        variant="text" 
        @click="handleEdit"
      >
        편집
      </v-btn>
      <v-btn 
        variant="text" 
        color="error"
        @click="handleDelete"
      >
        삭제
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 정의
interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  roles: string[]
}

interface Props {
  user: User
  elevation?: number
  avatarColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  elevation: 2,
  avatarColor: 'primary'
})

// Emits 정의
const emit = defineEmits<{
  edit: [user: User]
  delete: [id: number]
}>()

// Computed
const fullName = computed(() => 
  `${props.user.firstName} ${props.user.lastName}`
)

const initials = computed(() => 
  `${props.user.firstName[0]}${props.user.lastName[0]}`
)

// Methods
const handleEdit = () => {
  emit('edit', props.user)
}

const handleDelete = () => {
  emit('delete', props.user.id)
}
</script>

<style scoped>
.user-card {
  margin-bottom: 16px;
}
</style>
```

```tsx
// React Component: UserCard.tsx
import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Chip,
  Button,
  Box,
  Stack
} from '@mui/material'

// Props 인터페이스 정의
interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  roles: string[]
}

interface UserCardProps {
  user: User
  elevation?: number
  avatarColor?: 'primary' | 'secondary' | 'default'
  onEdit?: (user: User) => void  // Vue의 emit 대신 콜백
  onDelete?: (id: number) => void
}

// 함수형 컴포넌트
function UserCard({ 
  user, 
  elevation = 2, 
  avatarColor = 'primary',
  onEdit,
  onDelete 
}: UserCardProps) {
  // 일반 변수로 계산 (computed 불필요)
  const fullName = `${user.firstName} ${user.lastName}`
  const initials = `${user.firstName[0]}${user.lastName[0]}`
  
  // 이벤트 핸들러
  const handleEdit = () => {
    onEdit?.(user)  // Optional chaining
  }
  
  const handleDelete = () => {
    onDelete?.(user.id)
  }
  
  // JSX 반환
  return (
    <Card elevation={elevation} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar 
            sx={{ 
              bgcolor: avatarColor === 'primary' ? 'primary.main' : 
                       avatarColor === 'secondary' ? 'secondary.main' : 
                       'grey.500',
              mr: 2 
            }}
          >
            {initials}
          </Avatar>
          <Typography variant="h6">
            {fullName}
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1}>
          {user.roles.map(role => (
            <Chip 
              key={role}
              label={role}
              size="small"
            />
          ))}
        </Stack>
      </CardContent>
      
      <CardActions>
        <Button onClick={handleEdit}>
          편집
        </Button>
        <Button color="error" onClick={handleDelete}>
          삭제
        </Button>
      </CardActions>
    </Card>
  )
}

// 컴포넌트 export
export default UserCard

// 또는 named export
// export { UserCard }
```

#### 2.2 컴포넌트 합성 (Composition)

```tsx
// React - 컴포넌트 합성 패턴
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from '@mui/material'

// 1. Children을 받는 레이아웃 컴포넌트
interface LayoutProps {
  children: React.ReactNode  // Vue의 <slot />과 유사
  title?: string
}

function Layout({ children, title }: LayoutProps) {
  return (
    <Box>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      <Box sx={{ p: 2 }}>
        {children}
      </Box>
    </Box>
  )
}

// 2. Render Props 패턴
interface DataProviderProps<T> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  renderEmpty?: () => React.ReactNode
}

function DataProvider<T>({ 
  data, 
  renderItem, 
  renderEmpty 
}: DataProviderProps<T>) {
  if (data.length === 0 && renderEmpty) {
    return <>{renderEmpty()}</>
  }
  
  return (
    <>
      {data.map((item, index) => renderItem(item, index))}
    </>
  )
}

// 3. Compound Components (복합 컴포넌트)
interface FormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  title: string
  children: React.ReactNode
}

function FormDialog({ 
  open, 
  onClose, 
  onSubmit, 
  title, 
  children 
}: FormDialogProps) {
  const [formData, setFormData] = useState({})
  
  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {children}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSubmit} variant="contained">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// 사용 예시
function App() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const users = [
    { id: 1, name: '홍길동' },
    { id: 2, name: '김철수' }
  ]
  
  return (
    <Layout title="대시보드">
      {/* Children 전달 */}
      <Typography>컨텐츠 영역</Typography>
      
      {/* Render Props 사용 */}
      <DataProvider
        data={users}
        renderItem={(user) => (
          <Card key={user.id}>
            <CardContent>{user.name}</CardContent>
          </Card>
        )}
        renderEmpty={() => <Typography>데이터가 없습니다</Typography>}
      />
      
      {/* Compound Component 사용 */}
      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(data) => console.log(data)}
        title="사용자 추가"
      >
        <TextField label="이름" fullWidth />
        <TextField label="이메일" fullWidth />
      </FormDialog>
    </Layout>
  )
}
```

---

## 3. Props와 State

### 이론 설명

| 구분 | Props | State |
|------|-------|-------|
| 정의 | 부모에서 전달받는 데이터 | 컴포넌트 내부 데이터 |
| 변경 | 읽기 전용 (불변) | setState로 변경 가능 |
| Vue3 대응 | props | ref, reactive |

### 실습 코드

#### 3.1 Props 다루기

```tsx
// React - Props 고급 패턴
import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Switch,
  FormControlLabel,
  Box
} from '@mui/material'

// 1. Props 타입 정의 방법들
interface BaseProps {
  id: string
  name: string
}

// Props 확장
interface ExtendedProps extends BaseProps {
  description?: string
  active?: boolean
}

// Union 타입 Props
type Status = 'idle' | 'loading' | 'success' | 'error'

interface StatusProps {
  status: Status
  message?: string
}

// 2. Props 기본값과 구조 분해
interface ComponentProps {
  title: string
  count?: number
  isVisible?: boolean
  items?: string[]
  onUpdate?: (value: number) => void
}

function PropsExample({
  title,
  count = 0,           // 기본값
  isVisible = true,
  items = [],
  onUpdate
}: ComponentProps) {
  // Props는 읽기 전용!
  // ❌ count++ // 에러!
  
  // Props를 기반으로 내부 상태 생성
  const [internalCount, setInternalCount] = useState(count)
  
  // Props 변경 감지
  useEffect(() => {
    setInternalCount(count)
  }, [count])
  
  const handleIncrement = () => {
    const newCount = internalCount + 1
    setInternalCount(newCount)
    onUpdate?.(newCount)  // 부모에게 알림
  }
  
  return (
    <Card sx={{ display: isVisible ? 'block' : 'none' }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography>카운트: {internalCount}</Typography>
        <Button onClick={handleIncrement}>증가</Button>
        
        {/* Props 배열 렌더링 */}
        {items.map((item, index) => (
          <Typography key={index}>{item}</Typography>
        ))}
      </CardContent>
    </Card>
  )
}

// 3. Props Spreading과 Rest
interface ButtonProps {
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  children: React.ReactNode
}

function CustomButton({ children, ...restProps }: ButtonProps) {
  return (
    <Button {...restProps}>
      {children}
    </Button>
  )
}

// 4. Props Validation (PropTypes 대신 TypeScript 사용)
interface ValidatedProps {
  email: string  // 필수
  age?: number   // 선택
  roles: string[] // 필수 배열
}

function ValidatedComponent({ email, age, roles }: ValidatedProps) {
  // TypeScript가 컴파일 시점에 타입 체크
  return (
    <Box>
      <Typography>Email: {email}</Typography>
      {age && <Typography>Age: {age}</Typography>}
      <Typography>Roles: {roles.join(', ')}</Typography>
    </Box>
  )
}
```

#### 3.2 State 관리 패턴

```tsx
// React - State 관리 고급 패턴
import { useState, useReducer } from 'react'
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

// 1. 단순 State
function SimpleState() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Box>
      <Typography>Count: {count}</Typography>
      <Button onClick={() => setCount(count + 1)}>+</Button>
      <Button onClick={() => setCount(prev => prev - 1)}>-</Button>
    </Box>
  )
}

// 2. 객체 State
interface UserState {
  name: string
  email: string
  age: number
  address: {
    city: string
    zipCode: string
  }
}

function ObjectState() {
  const [user, setUser] = useState<UserState>({
    name: '',
    email: '',
    age: 0,
    address: {
      city: '',
      zipCode: ''
    }
  })
  
  // 중첩 객체 업데이트
  const updateCity = (city: string) => {
    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city
      }
    }))
  }
  
  // 여러 필드 동시 업데이트
  const updateUserInfo = (updates: Partial<UserState>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }
  
  return (
    <Box>
      <TextField
        label="이름"
        value={user.name}
        onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
      />
      <TextField
        label="도시"
        value={user.address.city}
        onChange={(e) => updateCity(e.target.value)}
      />
    </Box>
  )
}

// 3. 배열 State
interface TodoItem {
  id: number
  text: string
  completed: boolean
}

function ArrayState() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState('')
  
  // 추가
  const addTodo = () => {
    if (inputText.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: inputText,
        completed: false
      }])
      setInputText('')
    }
  }
  
  // 수정
  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ))
  }
  
  // 삭제
  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }
  
  return (
    <Container>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="할 일 입력"
          fullWidth
        />
        <Button variant="contained" onClick={addTodo}>
          추가
        </Button>
      </Box>
      
      <List>
        {todos.map(todo => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <IconButton onClick={() => deleteTodo(todo.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={todo.text}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
              onClick={() => toggleTodo(todo.id)}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

// 4. useReducer로 복잡한 State 관리
type Action = 
  | { type: 'ADD_ITEM'; payload: string }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'TOGGLE_ITEM'; payload: number }
  | { type: 'CLEAR_ALL' }

interface State {
  items: TodoItem[]
  totalCount: number
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItem = {
        id: Date.now(),
        text: action.payload,
        completed: false
      }
      return {
        items: [...state.items, newItem],
        totalCount: state.totalCount + 1
      }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    
    case 'TOGGLE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload
            ? { ...item, completed: !item.completed }
            : item
        )
      }
    
    case 'CLEAR_ALL':
      return {
        items: [],
        totalCount: state.totalCount
      }
    
    default:
      return state
  }
}

function ComplexState() {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    totalCount: 0
  })
  
  const [input, setInput] = useState('')
  
  return (
    <Container>
      <Typography variant="h6">
        총 {state.totalCount}개 생성됨
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="항목 추가"
        />
        <Button 
          onClick={() => {
            dispatch({ type: 'ADD_ITEM', payload: input })
            setInput('')
          }}
        >
          추가
        </Button>
        <Button 
          onClick={() => dispatch({ type: 'CLEAR_ALL' })}
          color="error"
        >
          전체 삭제
        </Button>
      </Box>
      
      <List>
        {state.items.map(item => (
          <ListItem key={item.id}>
            <ListItemText primary={item.text} />
            <IconButton 
              onClick={() => dispatch({ type: 'TOGGLE_ITEM', payload: item.id })}
            >
              ✓
            </IconButton>
            <IconButton 
              onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}
```

---

## 4. 이벤트 처리

### 이론 설명

React의 이벤트는 SyntheticEvent로 래핑되어 있어 크로스 브라우저 호환성이 보장됩니다.

| Vue3 | React | 설명 |
|------|-------|------|
| `@click` | `onClick` | 클릭 이벤트 |
| `@input` | `onChange` | 입력 변경 |
| `@submit.prevent` | `onSubmit` + `e.preventDefault()` | 폼 제출 |
| `@keyup.enter` | `onKeyUp` + 조건 체크 | 키보드 이벤트 |
| `.stop` | `e.stopPropagation()` | 이벤트 전파 중단 |

### 실습 코드

#### 4.1 이벤트 처리 기본

```tsx
// React - 이벤트 처리
import { useState, FormEvent, MouseEvent, KeyboardEvent, ChangeEvent } from 'react'
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper
} from '@mui/material'

function EventHandling() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    category: '',
    agree: false
  })
  
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [keyPressed, setKeyPressed] = useState('')
  
  // 1. 폼 제출 이벤트
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()  // Vue의 .prevent 수식어와 동일
    console.log('Form submitted:', formData)
  }
  
  // 2. 입력 변경 이벤트
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  // 3. Select 변경 이벤트
  const handleSelectChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }))
  }
  
  // 4. 마우스 이벤트
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setClickPosition({
      x: e.clientX,
      y: e.clientY
    })
  }
  
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()  // Vue의 .stop 수식어와 동일
    console.log('Button clicked')
  }
  
  // 5. 키보드 이벤트
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setKeyPressed(e.key)
    
    // Enter 키 처리 (Vue의 @keyup.enter와 유사)
    if (e.key === 'Enter') {
      console.log('Enter pressed')
      e.preventDefault()
    }
    
    // Ctrl + S 처리
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      console.log('Save shortcut')
    }
  }
  
  // 6. 커스텀 이벤트 핸들러 with 파라미터
  const handleCustomClick = (id: number, name: string) => {
    console.log(`Clicked: ${id} - ${name}`)
  }
  
  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        이벤트 처리 예제
      </Typography>
      
      {/* 폼 이벤트 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            name="username"
            label="사용자명"
            value={formData.username}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            fullWidth
            margin="normal"
          />
          
          <TextField
            name="password"
            type="password"
            label="비밀번호"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>카테고리</InputLabel>
            <Select
              value={formData.category}
              onChange={handleSelectChange}
              label="카테고리"
            >
              <MenuItem value="개발">개발</MenuItem>
              <MenuItem value="디자인">디자인</MenuItem>
              <MenuItem value="기획">기획</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Checkbox
                name="agree"
                checked={formData.agree}
                onChange={handleInputChange}
              />
            }
            label="동의합니다"
          />
          
          <Button type="submit" variant="contained" fullWidth>
            제출
          </Button>
        </form>
      </Paper>
      
      {/* 마우스 이벤트 */}
      <Paper 
        sx={{ p: 3, mb: 3, height: 200, position: 'relative' }}
        onMouseMove={handleMouseMove}
      >
        <Typography>마우스 위치: X: {clickPosition.x}, Y: {clickPosition.y}</Typography>
        <Button onClick={handleClick}>
          클릭 (이벤트 전파 중단)
        </Button>
      </Paper>
      
      {/* 파라미터가 있는 이벤트 핸들러 */}
      <Box sx={{ mb: 3 }}>
        {[1, 2, 3].map(id => (
          <Button
            key={id}
            onClick={() => handleCustomClick(id, `Item ${id}`)}
            sx={{ mr: 1 }}
          >
            Item {id}
          </Button>
        ))}
      </Box>
      
      {/* 키보드 이벤트 상태 표시 */}
      <Typography>
        마지막 누른 키: {keyPressed}
      </Typography>
    </Container>
  )
}
```

#### 4.2 이벤트 위임과 최적화

```tsx
// React - 이벤트 위임과 성능 최적화
import { useState, useCallback, memo } from 'react'
import { List, ListItem, ListItemText, IconButton, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

interface Item {
  id: number
  name: string
}

// 메모이제이션된 자식 컴포넌트
const ListItemComponent = memo(({ 
  item, 
  onEdit, 
  onDelete 
}: {
  item: Item
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}) => {
  console.log(`Rendering item: ${item.id}`)
  
  return (
    <ListItem>
      <ListItemText primary={item.name} />
      <IconButton onClick={() => onEdit(item.id)}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => onDelete(item.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
})

function EventOptimization() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ])
  
  // useCallback으로 함수 메모이제이션
  const handleEdit = useCallback((id: number) => {
    console.log('Edit:', id)
  }, [])  // 빈 의존성 배열 = 함수 재생성 안 함
  
  const handleDelete = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])
  
  // 이벤트 위임 패턴
  const handleListClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement
    const listItem = target.closest('[data-item-id]')
    
    if (listItem) {
      const itemId = parseInt(listItem.getAttribute('data-item-id')!)
      const action = target.getAttribute('data-action')
      
      switch(action) {
        case 'edit':
          handleEdit(itemId)
          break
        case 'delete':
          handleDelete(itemId)
          break
      }
    }
  }
  
  return (
    <Box>
      <Typography variant="h6">최적화된 이벤트 처리</Typography>
      
      {/* 개별 이벤트 핸들러 */}
      <List>
        {items.map(item => (
          <ListItemComponent
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </List>
      
      {/* 이벤트 위임 */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        이벤트 위임 패턴
      </Typography>
      <List onClick={handleListClick}>
        {items.map(item => (
          <ListItem key={item.id} data-item-id={item.id}>
            <ListItemText primary={item.name} />
            <IconButton data-action="edit">
              <EditIcon />
            </IconButton>
            <IconButton data-action="delete">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
```

---

## ⚠️ 흔한 실수와 해결 방법

### 1. 이벤트 핸들러 바인딩 실수

```tsx
// ❌ 잘못된 코드 - 렌더링 때마다 함수 재생성
function BadExample() {
  const [items, setItems] = useState([1, 2, 3])
  
  return (
    <div>
      {items.map(item => (
        <button 
          key={item}
          onClick={() => console.log(item)}  // 매번 새 함수 생성
        >
          {item}
        </button>
      ))}
    </div>
  )
}

// ✅ 올바른 코드 - useCallback 사용
function GoodExample() {
  const [items, setItems] = useState([1, 2, 3])
  
  const handleClick = useCallback((item: number) => {
    console.log(item)
  }, [])
  
  return (
    <div>
      {items.map(item => (
        <button 
          key={item}
          onClick={() => handleClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
```

### 2. State 업데이트 시 이전 값 참조

```tsx
// ❌ 잘못된 코드 - 클로저 문제
function BadCounter() {
  const [count, setCount] = useState(0)
  
  const handleMultipleUpdates = () => {
    setCount(count + 1)  // count는 0
    setCount(count + 1)  // count는 여전히 0
    setCount(count + 1)  // count는 여전히 0
    // 결과: 1 (3이 아님!)
  }
  
  return <button onClick={handleMultipleUpdates}>{count}</button>
}

// ✅ 올바른 코드 - 함수형 업데이트
function GoodCounter() {
  const [count, setCount] = useState(0)
  
  const handleMultipleUpdates = () => {
    setCount(prev => prev + 1)  // 이전 값 기반
    setCount(prev => prev + 1)  // 이전 값 기반
    setCount(prev => prev + 1)  // 이전 값 기반
    // 결과: 3
  }
  
  return <button onClick={handleMultipleUpdates}>{count}</button>
}
```

### 3. JSX에서 조건부 렌더링 실수

```tsx
// ❌ 잘못된 코드 - 0이 렌더링됨
function BadConditional() {
  const [items, setItems] = useState([])
  
  return (
    <div>
      {items.length && <div>Items exist</div>}  
      {/* items.length가 0일 때 0이 화면에 표시됨! */}
    </div>
  )
}

// ✅ 올바른 코드 - 명확한 조건
function GoodConditional() {
  const [items, setItems] = useState([])
  
  return (
    <div>
      {items.length > 0 && <div>Items exist</div>}
      {/* 또는 */}
      {!!items.length && <div>Items exist</div>}
      {/* 또는 */}
      {items.length ? <div>Items exist</div> : null}
    </div>
  )
}
```

---

## 🎯 실습 과제

### 📝 과제 1: 간단한 카운터 컴포넌트 (난이도: ⭐)

Vue3 카운터를 React로 변환하고 Material-UI로 스타일링하세요.

#### 요구사항
- 증가, 감소, 리셋 버튼
- 최소값 0, 최대값 10 제한
- 5 이상일 때 경고 색상 표시

#### 정답

```tsx
// Counter.tsx
import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Box,
  Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import RefreshIcon from '@mui/icons-material/Refresh'

function Counter() {
  const [count, setCount] = useState(0)
  const MIN_VALUE = 0
  const MAX_VALUE = 10
  const WARNING_THRESHOLD = 5
  
  const increment = () => {
    setCount(prev => Math.min(prev + 1, MAX_VALUE))
  }
  
  const decrement = () => {
    setCount(prev => Math.max(prev - 1, MIN_VALUE))
  }
  
  const reset = () => {
    setCount(0)
  }
  
  const isWarning = count >= WARNING_THRESHOLD
  const isMax = count === MAX_VALUE
  const isMin = count === MIN_VALUE
  
  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          카운터
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            my: 3
          }}
        >
          <Typography
            variant="h2"
            color={isWarning ? 'warning.main' : 'primary.main'}
          >
            {count}
          </Typography>
        </Box>
        
        {isWarning && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            경고: 값이 {WARNING_THRESHOLD} 이상입니다!
          </Alert>
        )}
        
        {isMax && (
          <Alert severity="error" sx={{ mb: 2 }}>
            최대값에 도달했습니다!
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <ButtonGroup variant="contained">
            <Button
              onClick={decrement}
              disabled={isMin}
              startIcon={<RemoveIcon />}
            >
              감소
            </Button>
            <Button
              onClick={increment}
              disabled={isMax}
              startIcon={<AddIcon />}
            >
              증가
            </Button>
          </ButtonGroup>
          
          <Button
            variant="outlined"
            onClick={reset}
            startIcon={<RefreshIcon />}
          >
            리셋
          </Button>
        </Box>
        
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 2 }}
          color="text.secondary"
        >
          범위: {MIN_VALUE} ~ {MAX_VALUE}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Counter
```

### 📝 과제 2: 검색 가능한 목록 컴포넌트 (난이도: ⭐⭐)

#### 요구사항
- 사용자 목록 표시
- 실시간 검색 (이름, 이메일)
- 역할별 필터링
- 선택된 사용자 수 표시

#### 정답

```tsx
// SearchableList.tsx
import { useState, useMemo } from 'react'
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Checkbox,
  Chip,
  Box,
  Typography,
  Paper,
  InputAdornment
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  avatar: string
}

const USERS: User[] = [
  { id: 1, name: '홍길동', email: 'hong@example.com', role: 'admin', avatar: 'H' },
  { id: 2, name: '김철수', email: 'kim@example.com', role: 'user', avatar: 'K' },
  { id: 3, name: '이영희', email: 'lee@example.com', role: 'user', avatar: 'L' },
  { id: 4, name: '박민수', email: 'park@example.com', role: 'guest', avatar: 'P' },
  { id: 5, name: '정수연', email: 'jung@example.com', role: 'admin', avatar: 'J' },
]

function SearchableList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  
  // 필터링된 사용자 목록
  const filteredUsers = useMemo(() => {
    return USERS.filter(user => {
      // 검색어 필터
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      // 역할 필터
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      
      return matchesSearch && matchesRole
    })
  }, [searchTerm, roleFilter])
  
  // 사용자 선택/해제
  const toggleSelect = (userId: number) => {
    setSelectedIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }
  
  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredUsers.map(user => user.id))
    }
  }
  
  // 역할별 색상
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'error'
      case 'user': return 'primary'
      case 'guest': return 'default'
      default: return 'default'
    }
  }
  
  // 역할 한글 변환
  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return '관리자'
      case 'user': return '사용자'
      case 'guest': return '게스트'
      default: return role
    }
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          사용자 목록
        </Typography>
        
        {/* 검색 및 필터 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="이름 또는 이메일로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>
              <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              역할
            </InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="역할"
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="admin">관리자</MenuItem>
              <MenuItem value="user">사용자</MenuItem>
              <MenuItem value="guest">게스트</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* 선택 정보 */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredUsers.length}명 중 {selectedIds.length}명 선택됨
          </Typography>
          
          {filteredUsers.length > 0 && (
            <Button
              size="small"
              onClick={toggleSelectAll}
            >
              {selectedIds.length === filteredUsers.length ? '전체 해제' : '전체 선택'}
            </Button>
          )}
        </Box>
        
        {/* 사용자 목록 */}
        {filteredUsers.length > 0 ? (
          <List>
            {filteredUsers.map(user => (
              <ListItem
                key={user.id}
                divider
                sx={{
                  bgcolor: selectedIds.includes(user.id) ? 'action.selected' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {user.avatar}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{user.name}</Typography>
                      <Chip
                        label={getRoleLabel(user.role)}
                        size="small"
                        color={getRoleColor(user.role) as any}
                      />
                    </Box>
                  }
                  secondary={user.email}
                />
                
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              검색 결과가 없습니다
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default SearchableList
```

### 📝 과제 3: 동적 폼 빌더 (난이도: ⭐⭐⭐)

#### 요구사항
- 필드 동적 추가/삭제
- 다양한 입력 타입 지원 (text, number, select, checkbox)
- 실시간 유효성 검사
- 폼 데이터 JSON 미리보기

#### 정답

```tsx
// FormBuilder.tsx
import { useState, useCallback } from 'react'
import {
  Container,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

type FieldType = 'text' | 'number' | 'select' | 'checkbox'

interface FieldConfig {
  id: string
  name: string
  type: FieldType
  label: string
  required: boolean
  options?: string[]  // for select
  value: any
  error?: string
}

function FormBuilder() {
  const [fields, setFields] = useState<FieldConfig[]>([
    {
      id: '1',
      name: 'username',
      type: 'text',
      label: '사용자명',
      required: true,
      value: '',
      error: ''
    }
  ])
  
  const [newField, setNewField] = useState<Partial<FieldConfig>>({
    type: 'text',
    label: '',
    required: false
  })
  
  const [showJson, setShowJson] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  
  // 필드 추가
  const addField = () => {
    if (!newField.label) {
      alert('필드 레이블을 입력하세요')
      return
    }
    
    const field: FieldConfig = {
      id: Date.now().toString(),
      name: newField.label!.toLowerCase().replace(/\s+/g, '_'),
      type: newField.type as FieldType,
      label: newField.label!,
      required: newField.required || false,
      options: newField.type === 'select' ? ['옵션1', '옵션2', '옵션3'] : undefined,
      value: newField.type === 'checkbox' ? false : '',
      error: ''
    }
    
    setFields(prev => [...prev, field])
    setNewField({ type: 'text', label: '', required: false })
  }
  
  // 필드 삭제
  const removeField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id))
  }
  
  // 필드 값 업데이트
  const updateFieldValue = (id: string, value: any) => {
    setFields(prev => prev.map(field => {
      if (field.id === id) {
        const error = validateField({ ...field, value })
        return { ...field, value, error }
      }
      return field
    }))
  }
  
  // 유효성 검사
  const validateField = (field: FieldConfig): string => {
    if (field.required && !field.value) {
      return `${field.label}은(는) 필수 항목입니다`
    }
    
    if (field.type === 'number' && field.value && isNaN(field.value)) {
      return '올바른 숫자를 입력하세요'
    }
    
    return ''
  }
  
  // 전체 유효성 검사
  const validateForm = (): boolean => {
    let isValid = true
    
    setFields(prev => prev.map(field => {
      const error = validateField(field)
      if (error) isValid = false
      return { ...field, error }
    }))
    
    return isValid
  }
  
  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const formData = fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field.value
      }), {})
      
      setSubmitMessage('폼이 성공적으로 제출되었습니다!')
      console.log('Form Data:', formData)
      
      setTimeout(() => setSubmitMessage(''), 3000)
    }
  }
  
  // JSON 복사
  const copyJson = () => {
    const formData = fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.value
    }), {})
    
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2))
    alert('JSON이 클립보드에 복사되었습니다!')
  }
  
  // 필드 렌더링
  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={field.value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            required={field.required}
            error={!!field.error}
            helperText={field.error}
          />
        )
      
      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={field.value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            required={field.required}
            error={!!field.error}
            helperText={field.error}
          />
        )
      
      case 'select':
        return (
          <FormControl fullWidth error={!!field.error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={field.value}
              onChange={(e) => updateFieldValue(field.id, e.target.value)}
              label={field.label}
            >
              {field.options?.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {field.error && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {field.error}
              </Typography>
            )}
          </FormControl>
        )
      
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={(e) => updateFieldValue(field.id, e.target.checked)}
              />
            }
            label={
              <Box>
                {field.label}
                {field.required && <Typography component="span" color="error"> *</Typography>}
              </Box>
            }
          />
        )
      
      default:
        return null
    }
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* 폼 빌더 섹션 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              동적 폼 빌더
            </Typography>
            
            {/* 필드 추가 섹션 */}
            <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  새 필드 추가
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="필드 레이블"
                      value={newField.label || ''}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                      placeholder="예: 이메일"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>타입</InputLabel>
                      <Select
                        value={newField.type || 'text'}
                        onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
                        label="타입"
                      >
                        <MenuItem value="text">텍스트</MenuItem>
                        <MenuItem value="number">숫자</MenuItem>
                        <MenuItem value="select">선택</MenuItem>
                        <MenuItem value="checkbox">체크박스</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newField.required || false}
                          onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                        />
                      }
                      label="필수"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={addField}
                      startIcon={<AddIcon />}
                      sx={{ height: '100%' }}
                    >
                      추가
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Divider sx={{ my: 3 }} />
            
            {/* 동적 폼 필드들 */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {fields.map(field => (
                  <Box
                    key={field.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      {renderField(field)}
                    </Box>
                    
                    <IconButton
                      color="error"
                      onClick={() => removeField(field.id)}
                      sx={{ mt: field.type === 'checkbox' ? 0 : 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                {fields.length === 0 && (
                  <Alert severity="info">
                    필드를 추가하여 폼을 구성하세요
                  </Alert>
                )}
                
                {submitMessage && (
                  <Alert severity="success">
                    {submitMessage}
                  </Alert>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={fields.length === 0}
                    fullWidth
                  >
                    제출
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => setShowJson(!showJson)}
                    fullWidth
                  >
                    {showJson ? 'JSON 숨기기' : 'JSON 보기'}
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Grid>
        
        {/* JSON 미리보기 섹션 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                데이터 미리보기
              </Typography>
              <IconButton onClick={copyJson} size="small">
                <ContentCopyIcon />
              </IconButton>
            </Box>
            
            {/* 필드 구조 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                필드 구조
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {fields.map(field => (
                  <Chip
                    key={field.id}
                    label={`${field.label} (${field.type})`}
                    size="small"
                    color={field.required ? 'primary' : 'default'}
                    variant={field.required ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
            
            {/* JSON 데이터 */}
            {showJson && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.900',
                  color: 'common.white',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: 14,
                  overflow: 'auto',
                  maxHeight: 400
                }}
              >
                <pre>
                  {JSON.stringify(
                    fields.reduce((acc, field) => ({
                      ...acc,
                      [field.name]: field.value
                    }), {}),
                    null,
                    2
                  )}
                </pre>
              </Box>
            )}
            
            {/* 통계 */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                폼 통계
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    총 필드 수
                  </Typography>
                  <Typography variant="h6">
                    {fields.length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    필수 필드
                  </Typography>
                  <Typography variant="h6">
                    {fields.filter(f => f.required).length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    입력된 필드
                  </Typography>
                  <Typography variant="h6">
                    {fields.filter(f => f.value).length}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    완성도
                  </Typography>
                  <Typography variant="h6">
                    {fields.length > 0 
                      ? Math.round((fields.filter(f => f.value).length / fields.length) * 100)
                      : 0}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default FormBuilder
```

---

## 📌 Chapter 3 요약

### 핵심 학습 내용 정리

#### JSX 규칙
- **Fragment**: 여러 요소를 감싸기 위해 `<></>`또는 `<React.Fragment>` 사용
- **className**: HTML의 `class` 대신 `className` 사용
- **camelCase**: 스타일 속성은 camelCase (`backgroundColor`)
- **표현식**: `{}`안에 모든 JavaScript 표현식 사용 가능

#### 컴포넌트 작성
```tsx
// 기본 구조
interface Props {
  // props 타입 정의
}

function Component({ prop1, prop2 }: Props) {
  // hooks
  // 핸들러
  // 렌더링 로직
  
  return <JSX />
}
```

#### Props vs State
| Props | State |
|-------|-------|
| 부모로부터 받음 | 컴포넌트 내부 |
| 읽기 전용 | 변경 가능 |
| 타입 정의 필요 | useState로 관리 |

#### 이벤트 처리
```tsx
// Vue3 → React
@click → onClick
@input → onChange
@submit.prevent → onSubmit + e.preventDefault()
@keyup.enter → onKeyUp + if(e.key === 'Enter')
```

### Vue3 → React 변환 체크리스트

- [ ] 템플릿을 JSX로 변환
- [ ] `v-if` → `&&` 또는 삼항 연산자
- [ ] `v-for` → `map()`
- [ ] `v-model` → `value` + `onChange`
- [ ] `class` → `className`
- [ ] kebab-case → camelCase (스타일)
- [ ] `@event` → `onEvent`
- [ ] `ref`/`reactive` → `useState`
- [ ] `computed` → `useMemo` 또는 일반 변수
- [ ] `emit` → 콜백 함수 props

### 성능 최적화 팁
1. **메모이제이션**: `memo`, `useMemo`, `useCallback` 활용
2. **키 사용**: 리스트 렌더링 시 안정적인 `key` prop
3. **상태 분리**: 자주 변경되는 상태는 별도 컴포넌트로
4. **이벤트 위임**: 많은 요소에 이벤트가 있을 때

### 다음 장 예고
Chapter 4에서는 React Hooks를 심화 학습하며, Vue3의 Composition API와 비교하여 실무에서 활용 가능한 Custom Hooks를 작성합니다.

---

## 💬 Q&A 및 트러블슈팅

**Q1: Vue3의 슬롯(slot)과 같은 기능이 React에 있나요?**
> `children` prop을 사용하면 됩니다:
```tsx
function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
// 사용: <Layout>내용</Layout>
```

**Q2: v-model처럼 양방향 바인딩을 구현하려면?**
> Custom Hook을 만들어 사용:
```tsx
function useInput(initial: string) {
  const [value, setValue] = useState(initial)
  return {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  }
}
// 사용: const name = useInput(''); <input {...name} />
```

**Q3: computed와 같은 자동 계산은 어떻게 하나요?**
> 간단한 계산은 일반 변수로, 복잡한 계산은 `useMemo`로:
```tsx
// 간단한 경우
const fullName = `${firstName} ${lastName}`

// 복잡한 경우
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])
```

**Q4: Vue3의 watch와 같은 기능은?**
> `useEffect`를 사용:
```tsx
useEffect(() => {
  console.log('value changed:', value)
}, [value])  // value를 감시
```

이제 Chapter 3의 학습을 완료했습니다. React의 기본 문법을 마스터하고 실습 과제를 통해 실무 능력을 키웠습니다!