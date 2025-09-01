# Chapter 2: Vue3 vs React 핵심 차이점

## 📚 학습 목표
- 템플릿과 JSX의 차이점 이해
- Composition API와 React Hooks 비교
- Vue3와 React의 반응성 시스템 차이 파악
- 컴포넌트 생명주기 패턴 비교 및 전환

---

## 1. 템플릿 vs JSX

### 이론 설명 (30%)

Vue3는 HTML 기반 템플릿을 사용하는 반면, React는 JSX(JavaScript XML)를 사용합니다. JSX는 JavaScript 코드 안에 HTML과 유사한 마크업을 작성할 수 있게 해주는 JavaScript 확장 문법입니다.

#### 주요 차이점

| 특징 | Vue3 템플릿 | React JSX |
|------|------------|-----------|
| 문법 | HTML 확장 | JavaScript 확장 |
| 조건부 렌더링 | `v-if`, `v-show` | 삼항 연산자, `&&` |
| 반복 렌더링 | `v-for` | `map()` |
| 이벤트 | `@click` | `onClick` |
| 양방향 바인딩 | `v-model` | `value` + `onChange` |
| 클래스 바인딩 | `:class` | `className` |
| 스타일 바인딩 | `:style` | `style` |

### 실습 코드 (70%)

#### 1.1 조건부 렌더링 비교

```vue
<!-- Vue3 Template -->
<template>
  <v-container>
    <!-- v-if: DOM에서 완전히 제거/추가 -->
    <v-alert v-if="isError" type="error">
      에러가 발생했습니다!
    </v-alert>
    
    <!-- v-show: display:none으로 숨김 -->
    <v-card v-show="isVisible">
      <v-card-text>표시/숨김 토글 카드</v-card-text>
    </v-card>
    
    <!-- v-else-if, v-else -->
    <v-chip v-if="status === 'success'" color="success">성공</v-chip>
    <v-chip v-else-if="status === 'warning'" color="warning">경고</v-chip>
    <v-chip v-else color="error">실패</v-chip>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isError = ref(false)
const isVisible = ref(true)
const status = ref<'success' | 'warning' | 'error'>('success')
</script>
```

```tsx
// React JSX
import { useState } from 'react'
import { Container, Alert, Card, CardContent, Chip } from '@mui/material'

function ConditionalRendering() {
  const [isError, setIsError] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [status, setStatus] = useState<'success' | 'warning' | 'error'>('success')
  
  return (
    <Container>
      {/* && 연산자: 조건이 true일 때만 렌더링 (v-if와 유사) */}
      {isError && (
        <Alert severity="error">
          에러가 발생했습니다!
        </Alert>
      )}
      
      {/* style.display로 숨김 처리 (v-show와 유사) */}
      <Card style={{ display: isVisible ? 'block' : 'none' }}>
        <CardContent>표시/숨김 토글 카드</CardContent>
      </Card>
      
      {/* 삼항 연산자와 중첩 조건 */}
      {status === 'success' ? (
        <Chip label="성공" color="success" />
      ) : status === 'warning' ? (
        <Chip label="경고" color="warning" />
      ) : (
        <Chip label="실패" color="error" />
      )}
    </Container>
  )
}
```

#### 1.2 리스트 렌더링 비교

```vue
<!-- Vue3 Template -->
<template>
  <v-container>
    <!-- 기본 v-for -->
    <v-list>
      <v-list-item
        v-for="item in items"
        :key="item.id"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <template v-slot:append>
          <v-chip size="small">{{ item.category }}</v-chip>
        </template>
      </v-list-item>
    </v-list>
    
    <!-- 인덱스와 함께 사용 -->
    <v-row>
      <v-col
        v-for="(card, index) in cards"
        :key="card.id"
        cols="12"
        md="4"
      >
        <v-card>
          <v-card-title>Card #{{ index + 1 }}: {{ card.title }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- 객체 순회 -->
    <v-list>
      <v-list-item
        v-for="(value, key) in userInfo"
        :key="key"
      >
        <strong>{{ key }}:</strong> {{ value }}
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  id: number
  name: string
  category: string
}

const items = ref<Item[]>([
  { id: 1, name: 'Item 1', category: 'A' },
  { id: 2, name: 'Item 2', category: 'B' },
])

const cards = ref([
  { id: 1, title: 'First' },
  { id: 2, title: 'Second' },
])

const userInfo = ref({
  name: '홍길동',
  email: 'hong@example.com',
  role: '관리자'
})
</script>
```

```tsx
// React JSX
import { useState } from 'react'
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material'

interface Item {
  id: number
  name: string
  category: string
}

function ListRendering() {
  const [items] = useState<Item[]>([
    { id: 1, name: 'Item 1', category: 'A' },
    { id: 2, name: 'Item 2', category: 'B' },
  ])
  
  const [cards] = useState([
    { id: 1, title: 'First' },
    { id: 2, title: 'Second' },
  ])
  
  const [userInfo] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    role: '관리자'
  })
  
  return (
    <Container>
      {/* 기본 map 사용 */}
      <List>
        {items.map(item => (
          <ListItem
            key={item.id}  // key는 필수!
            secondaryAction={
              <Chip label={item.category} size="small" />
            }
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      
      {/* 인덱스와 함께 사용 */}
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={4} key={card.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Card #{index + 1}: {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* 객체 순회 - Object.entries() 사용 */}
      <List>
        {Object.entries(userInfo).map(([key, value]) => (
          <ListItem key={key}>
            <ListItemText>
              <strong>{key}:</strong> {value}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}
```

#### 1.3 폼 바인딩 비교

```vue
<!-- Vue3 Template -->
<template>
  <v-container>
    <v-form @submit.prevent="handleSubmit">
      <!-- v-model 양방향 바인딩 -->
      <v-text-field
        v-model="formData.name"
        label="이름"
        :rules="[rules.required]"
      />
      
      <!-- v-model with modifiers -->
      <v-text-field
        v-model.number="formData.age"
        type="number"
        label="나이"
      />
      
      <!-- Select -->
      <v-select
        v-model="formData.category"
        :items="categories"
        label="카테고리"
      />
      
      <!-- Checkbox -->
      <v-checkbox
        v-model="formData.agree"
        label="동의합니다"
      />
      
      <!-- Radio Group -->
      <v-radio-group v-model="formData.gender">
        <v-radio label="남성" value="male" />
        <v-radio label="여성" value="female" />
      </v-radio-group>
      
      <v-btn type="submit" color="primary">
        제출
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
  age: 0,
  category: '',
  agree: false,
  gender: 'male'
})

const categories = ['개발', '디자인', '기획']

const rules = {
  required: (v: any) => !!v || '필수 입력 항목입니다.'
}

const handleSubmit = () => {
  console.log('Form submitted:', formData.value)
}
</script>
```

```tsx
// React JSX - 수동 바인딩 필요
import { useState, FormEvent, ChangeEvent } from 'react'
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Box,
} from '@mui/material'

function FormBinding() {
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    category: '',
    agree: false,
    gender: 'male'
  })
  
  const categories = ['개발', '디자인', '기획']
  
  // 각 입력 필드에 대한 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }))
  }
  
  // Select는 별도 처리
  const handleSelectChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }))
  }
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()  // 폼 기본 동작 방지
    console.log('Form submitted:', formData)
  }
  
  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* 텍스트 입력 - value와 onChange 필요 */}
        <TextField
          fullWidth
          name="name"
          label="이름"
          value={formData.name}
          onChange={handleInputChange}
          required
          margin="normal"
        />
        
        {/* 숫자 입력 */}
        <TextField
          fullWidth
          name="age"
          type="number"
          label="나이"
          value={formData.age}
          onChange={handleInputChange}
          margin="normal"
        />
        
        {/* Select */}
        <FormControl fullWidth margin="normal">
          <InputLabel>카테고리</InputLabel>
          <Select
            value={formData.category}
            label="카테고리"
            onChange={handleSelectChange}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Checkbox */}
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
        
        {/* Radio Group */}
        <FormControl margin="normal">
          <RadioGroup
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <FormControlLabel value="male" control={<Radio />} label="남성" />
            <FormControlLabel value="female" control={<Radio />} label="여성" />
          </RadioGroup>
        </FormControl>
        
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            제출
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
```

---

## 2. Composition API vs Hooks

### 이론 설명

Vue3의 Composition API와 React Hooks는 유사한 목적을 가지고 있습니다: 로직 재사용과 컴포넌트 구성을 개선하는 것입니다.

#### 대응 관계

| Vue3 Composition API | React Hooks | 용도 |
|---------------------|-------------|------|
| `ref`, `reactive` | `useState` | 상태 관리 |
| `computed` | `useMemo` | 계산된 값 캐싱 |
| `watch`, `watchEffect` | `useEffect` | 부수 효과 처리 |
| `provide`/`inject` | `useContext` | 의존성 주입 |
| `onMounted` | `useEffect(() => {}, [])` | 마운트 시점 |
| `onUnmounted` | `useEffect` cleanup | 정리 작업 |
| Custom Composables | Custom Hooks | 로직 재사용 |

### 실습 코드

#### 2.1 상태 관리 비교

```typescript
// Vue3 - Composable (useCounter.ts)
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  // ref: 단일 값 반응형 상태
  const count = ref(initialValue)
  
  // computed: 계산된 속성
  const doubled = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  
  // 메서드들
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  return {
    count,      // ref 객체 반환
    doubled,    // computed 객체 반환
    isEven,
    increment,
    decrement,
    reset
  }
}

// 사용 예시 (Component.vue)
/*
<script setup lang="ts">
import { useCounter } from './useCounter'

const { count, doubled, isEven, increment, decrement, reset } = useCounter(10)
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <p>Is Even: {{ isEven }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
  </div>
</template>
*/
```

```typescript
// React - Custom Hook (useCounter.ts)
import { useState, useMemo, useCallback } from 'react'

export function useCounter(initialValue = 0) {
  // useState: 상태 관리
  const [count, setCount] = useState(initialValue)
  
  // useMemo: 계산된 값 캐싱 (computed와 유사)
  const doubled = useMemo(() => count * 2, [count])
  const isEven = useMemo(() => count % 2 === 0, [count])
  
  // useCallback: 함수 메모이제이션 (성능 최적화)
  const increment = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1)
  }, [])
  
  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])
  
  return {
    count,      // 값 직접 반환 (ref.value 불필요)
    doubled,    // 계산된 값
    isEven,
    increment,
    decrement,
    reset
  }
}

// 사용 예시 (Component.tsx)
import { useCounter } from './useCounter'
import { Button, Typography, Box } from '@mui/material'

function CounterComponent() {
  const { count, doubled, isEven, increment, decrement, reset } = useCounter(10)
  
  return (
    <Box>
      <Typography>Count: {count}</Typography>
      <Typography>Doubled: {doubled}</Typography>
      <Typography>Is Even: {isEven ? 'Yes' : 'No'}</Typography>
      <Button onClick={increment}>+</Button>
      <Button onClick={decrement}>-</Button>
      <Button onClick={reset}>Reset</Button>
    </Box>
  )
}
```

#### 2.2 부수 효과(Side Effects) 처리 비교

```typescript
// Vue3 - watch와 watchEffect
import { ref, watch, watchEffect, onMounted, onUnmounted } from 'vue'

export function useDataFetcher(url: string) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  // watchEffect: 의존성 자동 추적 (React useEffect와 유사)
  watchEffect(() => {
    console.log(`URL changed: ${url}`)
  })
  
  // watch: 특정 값 감시
  watch(url, async (newUrl, oldUrl) => {
    console.log(`URL changed from ${oldUrl} to ${newUrl}`)
    await fetchData()
  })
  
  // 생명주기 훅
  onMounted(async () => {
    await fetchData()
  })
  
  onUnmounted(() => {
    // 정리 작업
    console.log('Component unmounted')
  })
  
  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}
```

```typescript
// React - useEffect
import { useState, useEffect, useCallback } from 'react'

export function useDataFetcher(url: string) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // useEffect: 부수 효과 처리
  useEffect(() => {
    console.log(`URL changed: ${url}`)
    
    // 데이터 페칭
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(url)
        const result = await response.json()
        setData(result)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    
    // Cleanup 함수 (onUnmounted와 유사)
    return () => {
      console.log('Cleanup: Component unmounted or URL changed')
    }
  }, [url])  // 의존성 배열 - url이 변경될 때만 실행
  
  // refetch 함수
  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url)
      const result = await response.json()
      setData(result)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [url])
  
  return {
    data,
    loading,
    error,
    refetch
  }
}
```

---

## 3. 반응성 시스템 차이

### 이론 설명

Vue3와 React의 가장 큰 차이점 중 하나는 반응성 시스템입니다.

| 특징 | Vue3 | React |
|------|------|-------|
| 반응성 | 자동 (Proxy 기반) | 수동 (setState 호출) |
| 상태 변경 | 직접 변경 가능 | 불변성 유지 필요 |
| 성능 최적화 | 자동 의존성 추적 | memo, useMemo, useCallback |
| 배열/객체 | 자동 감지 | 새 참조 필요 |

### 실습 코드

#### 3.1 객체와 배열 상태 관리

```typescript
// Vue3 - reactive와 ref
import { reactive, ref } from 'vue'

export function useTodoList() {
  // reactive: 객체를 반응형으로 만듦
  const state = reactive({
    todos: [
      { id: 1, text: 'Vue 공부', done: false },
      { id: 2, text: 'React 공부', done: false }
    ],
    filter: 'all' as 'all' | 'active' | 'done'
  })
  
  // 직접 변경 가능!
  const addTodo = (text: string) => {
    state.todos.push({
      id: Date.now(),
      text,
      done: false
    })
  }
  
  const toggleTodo = (id: number) => {
    const todo = state.todos.find(t => t.id === id)
    if (todo) {
      todo.done = !todo.done  // 직접 변경!
    }
  }
  
  const removeTodo = (id: number) => {
    const index = state.todos.findIndex(t => t.id === id)
    if (index > -1) {
      state.todos.splice(index, 1)  // 직접 변경!
    }
  }
  
  // ref로 배열 관리
  const tags = ref<string[]>(['중요', '긴급'])
  
  const addTag = (tag: string) => {
    tags.value.push(tag)  // .value 필요
  }
  
  return {
    state,
    addTodo,
    toggleTodo,
    removeTodo,
    tags,
    addTag
  }
}
```

```typescript
// React - 불변성 유지 필요
import { useState, useCallback } from 'react'

interface Todo {
  id: number
  text: string
  done: boolean
}

export function useTodoList() {
  // useState로 객체 상태 관리
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Vue 공부', done: false },
    { id: 2, text: 'React 공부', done: false }
  ])
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  
  // 불변성 유지하며 추가
  const addTodo = useCallback((text: string) => {
    setTodos(prev => [...prev, {  // 새 배열 생성
      id: Date.now(),
      text,
      done: false
    }])
  }, [])
  
  // 불변성 유지하며 토글
  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(todo =>  // map으로 새 배열 생성
      todo.id === id 
        ? { ...todo, done: !todo.done }  // 새 객체 생성
        : todo
    ))
  }, [])
  
  // 불변성 유지하며 삭제
  const removeTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))  // filter로 새 배열
  }, [])
  
  // 태그 배열 관리
  const [tags, setTags] = useState<string[]>(['중요', '긴급'])
  
  const addTag = useCallback((tag: string) => {
    setTags(prev => [...prev, tag])  // 스프레드 연산자로 새 배열
  }, [])
  
  return {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    removeTodo,
    tags,
    addTag
  }
}
```

#### 3.2 성능 최적화 비교

```vue
<!-- Vue3 - 자동 최적화 -->
<template>
  <v-container>
    <!-- computed는 자동으로 메모이제이션 -->
    <v-chip>
      Expensive Calculation: {{ expensiveValue }}
    </v-chip>
    
    <!-- 컴포넌트는 props가 변경될 때만 재렌더링 -->
    <ChildComponent 
      :data="filteredData"
      @update="handleUpdate"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ChildComponent from './ChildComponent.vue'

const items = ref([/* ... */])
const searchTerm = ref('')

// computed는 의존성이 변경될 때만 재계산
const expensiveValue = computed(() => {
  console.log('Computing expensive value...')
  return items.value.reduce((sum, item) => sum + item.value, 0)
})

const filteredData = computed(() => {
  return items.value.filter(item => 
    item.name.includes(searchTerm.value)
  )
})

// 메서드는 자동으로 캐싱되지 않음
const handleUpdate = (newValue: any) => {
  console.log('Updated:', newValue)
}
</script>
```

```tsx
// React - 수동 최적화 필요
import { useState, useMemo, useCallback, memo } from 'react'
import { Container, Chip } from '@mui/material'

// memo로 컴포넌트 메모이제이션
const ChildComponent = memo(({ data, onUpdate }: any) => {
  console.log('ChildComponent rendered')
  return <div>{/* ... */}</div>
})

function PerformanceOptimization() {
  const [items, setItems] = useState([/* ... */])
  const [searchTerm, setSearchTerm] = useState('')
  
  // useMemo로 값 메모이제이션 (computed와 유사)
  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value...')
    return items.reduce((sum, item) => sum + item.value, 0)
  }, [items])  // 의존성 배열 명시 필요
  
  const filteredData = useMemo(() => {
    return items.filter(item => 
      item.name.includes(searchTerm)
    )
  }, [items, searchTerm])
  
  // useCallback으로 함수 메모이제이션
  const handleUpdate = useCallback((newValue: any) => {
    console.log('Updated:', newValue)
  }, [])  // 빈 배열 = 함수 재생성 안 함
  
  return (
    <Container>
      <Chip label={`Expensive Calculation: ${expensiveValue}`} />
      
      {/* memo된 컴포넌트에 메모이제이션된 props 전달 */}
      <ChildComponent 
        data={filteredData}
        onUpdate={handleUpdate}
      />
    </Container>
  )
}
```

---

## 4. 컴포넌트 생명주기 비교

### 이론 설명

Vue3와 React의 생명주기 접근 방식이 다릅니다.

| Vue3 Lifecycle | React Equivalent | 설명 |
|----------------|------------------|------|
| `setup()` | 컴포넌트 함수 본문 | 초기화 |
| `onBeforeMount` | - | React에 없음 |
| `onMounted` | `useEffect(() => {}, [])` | 마운트 완료 |
| `onBeforeUpdate` | - | React에 없음 |
| `onUpdated` | `useEffect(() => {})` | 업데이트 완료 |
| `onBeforeUnmount` | - | React에 없음 |
| `onUnmounted` | `useEffect` cleanup | 언마운트 |

### 실습 코드

```typescript
// Vue3 - 생명주기 훅
import { 
  ref, 
  onMounted, 
  onUpdated, 
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount 
} from 'vue'

export function useLifecycle() {
  const count = ref(0)
  const timer = ref<number | null>(null)
  
  // 마운트 전
  onBeforeMount(() => {
    console.log('Before Mount: DOM 아직 없음')
  })
  
  // 마운트 완료
  onMounted(() => {
    console.log('Mounted: DOM 접근 가능')
    
    // 타이머 시작
    timer.value = window.setInterval(() => {
      count.value++
    }, 1000)
  })
  
  // 업데이트 전
  onBeforeUpdate(() => {
    console.log('Before Update: 상태 변경됨, DOM 업데이트 전')
  })
  
  // 업데이트 완료
  onUpdated(() => {
    console.log('Updated: DOM 업데이트 완료')
  })
  
  // 언마운트 전
  onBeforeUnmount(() => {
    console.log('Before Unmount: 정리 작업 시작')
  })
  
  // 언마운트
  onUnmounted(() => {
    console.log('Unmounted: 컴포넌트 제거됨')
    if (timer.value) {
      clearInterval(timer.value)
    }
  })
  
  return {
    count
  }
}
```

```typescript
// React - useEffect로 생명주기 구현
import { useState, useEffect, useRef } from 'react'

export function useLifecycle() {
  const [count, setCount] = useState(0)
  const timerRef = useRef<number | null>(null)
  const mountedRef = useRef(false)
  
  // componentDidMount와 유사
  useEffect(() => {
    console.log('Mounted: 컴포넌트 마운트됨')
    
    // 타이머 시작
    timerRef.current = window.setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)
    
    // componentWillUnmount와 유사 (cleanup)
    return () => {
      console.log('Unmounting: 컴포넌트 언마운트됨')
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])  // 빈 배열 = 마운트 시 한 번만
  
  // componentDidUpdate와 유사
  useEffect(() => {
    if (mountedRef.current) {
      console.log('Updated: count 변경됨', count)
    } else {
      mountedRef.current = true
    }
  }, [count])  // count가 변경될 때마다
  
  // 모든 렌더링 후 실행
  useEffect(() => {
    console.log('After every render')
  })  // 의존성 배열 없음 = 매 렌더링마다
  
  return {
    count
  }
}

// 실제 컴포넌트에서 사용
function LifecycleDemo() {
  const { count } = useLifecycle()
  const [show, setShow] = useState(true)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setShow(!show)}>
        Toggle Component
      </button>
      {show && <ChildComponent />}
    </div>
  )
}
```

---

## ⚠️ 흔한 실수와 해결 방법

### 1. 상태 직접 변경 (React)

```typescript
// ❌ 잘못된 코드 - Vue3 습관
function BadExample() {
  const [user, setUser] = useState({ name: 'John', age: 30 })
  
  const updateAge = () => {
    user.age = 31  // 직접 변경 - 리렌더링 안 됨!
    setUser(user)  // 같은 참조 - 리렌더링 안 됨!
  }
  
  return <div>{user.age}</div>
}

// ✅ 올바른 코드 - 불변성 유지
function GoodExample() {
  const [user, setUser] = useState({ name: 'John', age: 30 })
  
  const updateAge = () => {
    setUser({ ...user, age: 31 })  // 새 객체 생성
    // 또는
    setUser(prev => ({ ...prev, age: 31 }))
  }
  
  return <div>{user.age}</div>
}
```

### 2. useEffect 의존성 배열 누락

```typescript
// ❌ 잘못된 코드 - 의존성 누락
function BadExample() {
  const [count, setCount] = useState(0)
  const [multiplier, setMultiplier] = useState(2)
  
  useEffect(() => {
    console.log(count * multiplier)  // multiplier 사용하지만 의존성에 없음
  }, [count])  // ESLint 경고!
  
  return <div>{count}</div>
}

// ✅ 올바른 코드 - 모든 의존성 포함
function GoodExample() {
  const [count, setCount] = useState(0)
  const [multiplier, setMultiplier] = useState(2)
  
  useEffect(() => {
    console.log(count * multiplier)
  }, [count, multiplier])  // 모든 의존성 포함
  
  return <div>{count}</div>
}
```

### 3. 조건부 Hook 사용

```typescript
// ❌ 잘못된 코드 - 조건부 Hook
function BadExample({ shouldFetch }: { shouldFetch: boolean }) {
  if (shouldFetch) {
    const [data, setData] = useState(null)  // 에러! 조건부 Hook
    useEffect(() => {/* ... */}, [])
  }
  
  return <div>...</div>
}

// ✅ 올바른 코드 - Hook은 항상 최상위에서
function GoodExample({ shouldFetch }: { shouldFetch: boolean }) {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    if (shouldFetch) {
      // 조건은 Hook 내부에서
      fetchData()
    }
  }, [shouldFetch])
  
  return <div>...</div>
}
```

---

## 🎯 실습 과제

### 📝 과제 1: 템플릿을 JSX로 변환 (난이도: ⭐)

Vue3 컴포넌트를 React로 변환하세요.

#### Vue3 코드
```vue
<template>
  <v-container>
    <v-row v-if="isLoading">
      <v-col>
        <v-progress-circular indeterminate />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col 
        v-for="product in filteredProducts" 
        :key="product.id"
        cols="12" 
        md="4"
      >
        <v-card>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-text>
            <v-chip 
              :color="product.inStock ? 'success' : 'error'"
              small
            >
              {{ product.inStock ? '재고 있음' : '품절' }}
            </v-chip>
            <p>가격: {{ formatPrice(product.price) }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn 
              @click="addToCart(product)"
              :disabled="!product.inStock"
              color="primary"
            >
              장바구니 추가
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
  category: string
}

const products = ref<Product[]>([
  { id: 1, name: '노트북', price: 1500000, inStock: true, category: '전자제품' },
  { id: 2, name: '마우스', price: 50000, inStock: false, category: '액세서리' },
])

const isLoading = ref(false)
const searchCategory = ref('전자제품')

const filteredProducts = computed(() => 
  products.value.filter(p => p.category === searchCategory.value)
)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(price)
}

const addToCart = (product: Product) => {
  console.log('Added to cart:', product)
}
</script>
```

#### 정답
```tsx
import { useState, useMemo } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Box
} from '@mui/material'

interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
  category: string
}

function ProductList() {
  const [products] = useState<Product[]>([
    { id: 1, name: '노트북', price: 1500000, inStock: true, category: '전자제품' },
    { id: 2, name: '마우스', price: 50000, inStock: false, category: '액세서리' },
  ])
  
  const [isLoading] = useState(false)
  const [searchCategory] = useState('전자제품')
  
  // computed → useMemo
  const filteredProducts = useMemo(() => 
    products.filter(p => p.category === searchCategory),
    [products, searchCategory]
  )
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price)
  }
  
  const addToCart = (product: Product) => {
    console.log('Added to cart:', product)
  }
  
  return (
    <Container>
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <Grid item xs={12} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Chip
                    label={product.inStock ? '재고 있음' : '품절'}
                    color={product.inStock ? 'success' : 'error'}
                    size="small"
                  />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    가격: {formatPrice(product.price)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    variant="contained"
                    color="primary"
                  >
                    장바구니 추가
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default ProductList
```

### 📝 과제 2: Composable을 Custom Hook으로 변환 (난이도: ⭐⭐)

Vue3 Composable을 React Custom Hook으로 변환하세요.

#### Vue3 Composable
```typescript
// useSearch.ts
import { ref, computed, watch } from 'vue'

interface SearchOptions {
  debounceMs?: number
  minLength?: number
}

export function useSearch<T>(
  items: Ref<T[]>,
  searchFields: (keyof T)[],
  options: SearchOptions = {}
) {
  const { debounceMs = 300, minLength = 2 } = options
  
  const searchTerm = ref('')
  const isSearching = ref(false)
  let timeoutId: number | null = null
  
  const filteredItems = computed(() => {
    if (searchTerm.value.length < minLength) {
      return items.value
    }
    
    const term = searchTerm.value.toLowerCase()
    return items.value.filter(item => 
      searchFields.some(field => 
        String(item[field]).toLowerCase().includes(term)
      )
    )
  })
  
  const resultCount = computed(() => filteredItems.value.length)
  
  const hasResults = computed(() => resultCount.value > 0)
  
  watch(searchTerm, (newVal) => {
    isSearching.value = true
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = window.setTimeout(() => {
      isSearching.value = false
    }, debounceMs)
  })
  
  const clearSearch = () => {
    searchTerm.value = ''
  }
  
  return {
    searchTerm,
    isSearching,
    filteredItems,
    resultCount,
    hasResults,
    clearSearch
  }
}
```

#### 정답
```typescript
// useSearch.ts
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'

interface SearchOptions {
  debounceMs?: number
  minLength?: number
}

export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  options: SearchOptions = {}
) {
  const { debounceMs = 300, minLength = 2 } = options
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  
  // computed → useMemo
  const filteredItems = useMemo(() => {
    if (searchTerm.length < minLength) {
      return items
    }
    
    const term = searchTerm.toLowerCase()
    return items.filter(item => 
      searchFields.some(field => 
        String(item[field]).toLowerCase().includes(term)
      )
    )
  }, [items, searchTerm, searchFields, minLength])
  
  const resultCount = useMemo(() => filteredItems.length, [filteredItems])
  
  const hasResults = useMemo(() => resultCount > 0, [resultCount])
  
  // watch → useEffect
  useEffect(() => {
    setIsSearching(true)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = window.setTimeout(() => {
      setIsSearching(false)
    }, debounceMs)
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchTerm, debounceMs])
  
  const clearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])
  
  return {
    searchTerm,
    setSearchTerm,  // React는 setter를 별도로 제공
    isSearching,
    filteredItems,
    resultCount,
    hasResults,
    clearSearch
  }
}

// 사용 예시
function UserList() {
  const users = [
    { id: 1, name: '홍길동', email: 'hong@example.com' },
    { id: 2, name: '김철수', email: 'kim@example.com' },
  ]
  
  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    filteredItems,
    resultCount,
    hasResults,
    clearSearch
  } = useSearch(users, ['name', 'email'], { minLength: 1 })
  
  return (
    <Container>
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색..."
        InputProps={{
          endAdornment: isSearching && <CircularProgress size={20} />
        }}
      />
      <Button onClick={clearSearch}>Clear</Button>
      <Typography>결과: {resultCount}개</Typography>
      {/* 결과 표시 */}
    </Container>
  )
}
```

### 📝 과제 3: 복잡한 상태 관리 마이그레이션 (난이도: ⭐⭐⭐)

Vue3의 reactive 상태 관리를 React로 변환하세요.

#### Vue3 코드
```typescript
// useShoppingCart.ts (Vue3)
import { reactive, computed, watch } from 'vue'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export function useShoppingCart() {
  const state = reactive({
    items: [] as CartItem[],
    discount: 0,
    taxRate: 0.1,
    shippingFee: 5000
  })
  
  const subtotal = computed(() => 
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )
  
  const tax = computed(() => subtotal.value * state.taxRate)
  
  const total = computed(() => 
    subtotal.value + tax.value + state.shippingFee - state.discount
  )
  
  const itemCount = computed(() => 
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  )
  
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existing = state.items.find(i => i.id === item.id)
    if (existing) {
      existing.quantity++
    } else {
      state.items.push({ ...item, quantity: 1 })
    }
  }
  
  const removeItem = (id: number) => {
    const index = state.items.findIndex(i => i.id === id)
    if (index > -1) {
      state.items.splice(index, 1)
    }
  }
  
  const updateQuantity = (id: number, quantity: number) => {
    const item = state.items.find(i => i.id === id)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) {
        removeItem(id)
      }
    }
  }
  
  const applyDiscount = (amount: number) => {
    state.discount = Math.min(amount, subtotal.value)
  }
  
  const clearCart = () => {
    state.items = []
    state.discount = 0
  }
  
  // 자동 저장
  watch(
    () => state.items,
    (items) => {
      localStorage.setItem('cart', JSON.stringify(items))
    },
    { deep: true }
  )
  
  return {
    state,
    subtotal,
    tax,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount,
    clearCart
  }
}
```

#### 정답
```typescript
// useShoppingCart.ts (React)
import { useState, useMemo, useCallback, useEffect } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  discount: number
  taxRate: number
  shippingFee: number
}

export function useShoppingCart() {
  // reactive → useState (각 속성을 개별 state로 관리하거나 하나의 객체로 관리)
  const [state, setState] = useState<CartState>({
    items: [],
    discount: 0,
    taxRate: 0.1,
    shippingFee: 5000
  })
  
  // computed → useMemo
  const subtotal = useMemo(() => 
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  )
  
  const tax = useMemo(() => subtotal * state.taxRate, [subtotal, state.taxRate])
  
  const total = useMemo(() => 
    subtotal + tax + state.shippingFee - state.discount,
    [subtotal, tax, state.shippingFee, state.discount]
  )
  
  const itemCount = useMemo(() => 
    state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  )
  
  // 메서드들 - useCallback으로 메모이제이션
  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setState(prev => {
      const existing = prev.items.find(i => i.id === item.id)
      if (existing) {
        // 불변성 유지하며 수량 증가
        return {
          ...prev,
          items: prev.items.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
      } else {
        // 새 아이템 추가
        return {
          ...prev,
          items: [...prev.items, { ...item, quantity: 1 }]
        }
      }
    })
  }, [])
  
  const removeItem = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== id)
    }))
  }, [])
  
  const updateQuantity = useCallback((id: number, quantity: number) => {
    setState(prev => {
      const newQuantity = Math.max(0, quantity)
      if (newQuantity === 0) {
        // 수량이 0이면 아이템 제거
        return {
          ...prev,
          items: prev.items.filter(i => i.id !== id)
        }
      }
      // 수량 업데이트
      return {
        ...prev,
        items: prev.items.map(i => 
          i.id === id 
            ? { ...i, quantity: newQuantity }
            : i
        )
      }
    })
  }, [])
  
  const applyDiscount = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      discount: Math.min(amount, subtotal)
    }))
  }, [subtotal])
  
  const clearCart = useCallback(() => {
    setState(prev => ({
      ...prev,
      items: [],
      discount: 0
    }))
  }, [])
  
  // watch → useEffect (자동 저장)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])
  
  // 초기 로드
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const items = JSON.parse(saved)
        setState(prev => ({ ...prev, items }))
      } catch (e) {
        console.error('Failed to load cart:', e)
      }
    }
  }, [])  // 마운트 시 한 번만
  
  return {
    // React는 개별 값들을 반환
    items: state.items,
    discount: state.discount,
    taxRate: state.taxRate,
    shippingFee: state.shippingFee,
    // 계산된 값들
    subtotal,
    tax,
    total,
    itemCount,
    // 메서드들
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount,
    clearCart
  }
}

// 사용 예시
function ShoppingCart() {
  const {
    items,
    subtotal,
    tax,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  } = useShoppingCart()
  
  return (
    <Container>
      <Typography variant="h5">
        장바구니 ({itemCount}개)
      </Typography>
      
      <List>
        {items.map(item => (
          <ListItem key={item.id}>
            <ListItemText 
              primary={item.name}
              secondary={`${item.price}원 x ${item.quantity}`}
            />
            <IconButton onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              <RemoveIcon />
            </IconButton>
            <Typography>{item.quantity}</Typography>
            <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={() => removeItem(item.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <Box sx={{ mt: 2 }}>
        <Typography>소계: {subtotal}원</Typography>
        <Typography>세금: {tax}원</Typography>
        <Typography variant="h6">총계: {total}원</Typography>
      </Box>
      
      <Button onClick={clearCart} variant="outlined" color="error">
        장바구니 비우기
      </Button>
    </Container>
  )
}
```

---

## 📌 Chapter 2 요약

### 핵심 차이점 정리

| 영역 | Vue3 | React |
|------|------|-------|
| **템플릿** | HTML 기반, 디렉티브 사용 | JSX, JavaScript 표현식 |
| **조건부 렌더링** | `v-if`, `v-show` | `&&`, 삼항 연산자 |
| **리스트 렌더링** | `v-for` | `map()` |
| **양방향 바인딩** | `v-model` | `value` + `onChange` |
| **상태 관리** | `ref`, `reactive` | `useState` |
| **계산된 값** | `computed` | `useMemo` |
| **감시자** | `watch`, `watchEffect` | `useEffect` |
| **생명주기** | 명시적 훅 | `useEffect`로 통합 |
| **반응성** | 자동 (Proxy) | 수동 (불변성) |
| **성능 최적화** | 자동 | `memo`, `useMemo`, `useCallback` |

### 마이그레이션 체크리스트

- [ ] 템플릿 디렉티브를 JSX 표현식으로 변환
- [ ] `v-model`을 수동 바인딩으로 변경
- [ ] `ref.value` 제거
- [ ] 상태 변경 시 불변성 유지
- [ ] `computed`를 `useMemo`로 변환
- [ ] `watch`를 `useEffect`로 변환
- [ ] 생명주기 훅을 `useEffect`로 통합
- [ ] 필요한 곳에 메모이제이션 추가

### 다음 장 예고
Chapter 3에서는 React의 기본 문법을 더 자세히 다루며, 실제 컴포넌트 작성 패턴을 학습합니다.

---

## 💬 Q&A 및 트러블슈팅

**Q1: Vue3의 `v-model`처럼 편리한 양방향 바인딩이 React에는 없나요?**
> Custom Hook을 만들어 유사하게 구현할 수 있습니다:
```typescript
function useModel<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue)
  return {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value as T)
  }
}
// 사용: const name = useModel(''); <input {...name} />
```

**Q2: React에서 `watch`처럼 특정 값만 감시하려면?**
> `useEffect`의 의존성 배열을 활용합니다:
```typescript
useEffect(() => {
  console.log('userId가 변경됨:', userId)
}, [userId])  // userId만 감시
```

**Q3: Vue3의 `reactive`처럼 중첩된 객체를 쉽게 관리하는 방법은?**
> `useReducer`나 상태 관리 라이브러리(Zustand, Immer)를 사용하면 편리합니다.

이제 Chapter 2의 실습을 완료하고, React의 핵심 개념을 Vue3와 비교하여 이해했습니다!
