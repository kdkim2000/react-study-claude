# Chapter 5: Custom Hooks - Vue Composables에서 React Hooks로의 전환

## 목차
1. [개념 비교: Composables vs Custom Hooks](#개념-비교)
2. [Custom Hooks 작성 규칙과 패턴](#custom-hooks-작성-규칙)
3. [실습: API 호출 Custom Hook 만들기](#실습-api-호출-custom-hook)
4. [로직 재사용 패턴 비교](#로직-재사용-패턴)
5. [흔한 실수와 해결방법](#흔한-실수와-해결방법)
6. [실습 과제](#실습-과제)

---

## 개념 비교: Composables vs Custom Hooks {#개념-비교}

### Vue3 Composables와 React Custom Hooks의 핵심 차이점

| 구분 | Vue3 Composables | React Custom Hooks |
|------|-----------------|-------------------|
| **네이밍 규칙** | `use` 접두사 권장 (선택적) | `use` 접두사 **필수** |
| **반응성 시스템** | `ref`, `reactive` 사용 | `useState`, `useEffect` 사용 |
| **생명주기** | `onMounted`, `onUnmounted` 등 | `useEffect`의 dependency로 관리 |
| **반환값** | 반응형 객체 직접 반환 | 일반 값과 setter 함수 반환 |
| **호출 위치** | `setup()` 함수 내부 | 컴포넌트 최상위 레벨 |

### 간단한 비교 예제

```javascript
// Vue3 Composable - useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => {
    count.value++  // .value로 접근
  }
  
  const decrement = () => {
    count.value--
  }
  
  return {
    count,  // ref 객체 그대로 반환
    increment,
    decrement
  }
}
```

```javascript
// React Custom Hook - useCounter.js
import { useState } from 'react'

export function useCounter(initialValue = 0) {
  // useState는 [값, setter함수] 배열을 반환
  const [count, setCount] = useState(initialValue)
  
  const increment = () => {
    setCount(prev => prev + 1)  // 이전 값 기반 업데이트
  }
  
  const decrement = () => {
    setCount(prev => prev - 1)
  }
  
  return {
    count,      // 일반 값으로 반환
    increment,
    decrement
  }
}
```

---

## Custom Hooks 작성 규칙과 패턴 {#custom-hooks-작성-규칙}

### React Custom Hooks의 필수 규칙

1. **반드시 `use`로 시작해야 함**
   ```javascript
   // ✅ 올바른 네이밍
   function useMyHook() { }
   
   // ❌ 잘못된 네이밍 - React가 Hook으로 인식하지 못함
   function myHook() { }
   ```

2. **최상위 레벨에서만 호출**
   ```javascript
   function MyComponent() {
     // ✅ 올바른 사용
     const { data } = useApi()
     
     // ❌ 조건문 안에서 호출 금지
     if (someCondition) {
       const { data } = useApi()  // 에러!
     }
     
     // ❌ 반복문 안에서 호출 금지
     for (let i = 0; i < 3; i++) {
       const { data } = useApi()  // 에러!
     }
   }
   ```

3. **React 함수 컴포넌트나 다른 Custom Hook에서만 호출**

---

## 실습: API 호출 Custom Hook 만들기 {#실습-api-호출-custom-hook}

### Step 1: Vue3 Composable 버전 (비교를 위한 참고)

```javascript
// Vue3: useApi.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useApi(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  let abortController = null
  
  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      abortController = new AbortController()
      const response = await fetch(url, {
        signal: abortController.signal
      })
      
      if (!response.ok) throw new Error('API 요청 실패')
      
      data.value = await response.json()
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  
  onUnmounted(() => {
    abortController?.abort()
  })
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}
```

### Step 2: React Custom Hook 버전

```javascript
// React: useApi.js
import { useState, useEffect, useCallback } from 'react'

/**
 * API 호출을 위한 Custom Hook
 * @param {string} url - API 엔드포인트 URL
 * @returns {Object} - data, loading, error, refetch를 포함한 객체
 */
export function useApi(url) {
  // 상태 관리 - Vue의 ref 대신 useState 사용
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // fetchData를 useCallback으로 메모이제이션
  // url이 변경될 때만 함수가 재생성됨
  const fetchData = useCallback(async () => {
    // AbortController 생성 - 컴포넌트 언마운트시 요청 취소용
    const abortController = new AbortController()
    
    setLoading(true)  // 로딩 시작
    setError(null)    // 이전 에러 초기화
    
    try {
      const response = await fetch(url, {
        signal: abortController.signal  // 취소 신호 연결
      })
      
      // 응답 상태 체크
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const jsonData = await response.json()
      setData(jsonData)  // 데이터 설정
      
    } catch (err) {
      // AbortError는 의도적인 취소이므로 에러로 처리하지 않음
      if (err.name !== 'AbortError') {
        setError(err.message)
        console.error('API 호출 에러:', err)
      }
    } finally {
      setLoading(false)  // 로딩 종료
    }
    
    // cleanup 함수 반환 - 컴포넌트 언마운트시 실행
    return () => {
      abortController.abort()
    }
  }, [url])  // url이 변경될 때만 fetchData 재생성
  
  // useEffect - Vue의 onMounted + onUnmounted 역할
  useEffect(() => {
    // fetchData 실행하고 cleanup 함수 받기
    const cleanup = fetchData()
    
    // cleanup 함수 반환 - 컴포넌트 언마운트시 실행
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn())
    }
  }, [fetchData])  // fetchData가 변경될 때마다 재실행
  
  // Vue composable과 동일한 인터페이스로 반환
  return {
    data,     // 응답 데이터
    loading,  // 로딩 상태
    error,    // 에러 메시지
    refetch: fetchData  // 수동으로 다시 호출할 수 있는 함수
  }
}
```

### Step 3: Custom Hook 사용하기

```javascript
// UserList.jsx
import React from 'react'
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert,
  List,
  ListItem,
  ListItemText,
  Button,
  Box
} from '@mui/material'
import { useApi } from './hooks/useApi'

function UserList() {
  // Custom Hook 사용 - Vue의 setup()에서 composable 사용과 유사
  const { 
    data: users, 
    loading, 
    error, 
    refetch 
  } = useApi('https://jsonplaceholder.typicode.com/users')
  
  // 로딩 중일 때
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    )
  }
  
  // 에러 발생시
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={refetch}>
            다시 시도
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    )
  }
  
  // 정상적으로 데이터를 받았을 때
  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">사용자 목록</Typography>
        <Button variant="outlined" onClick={refetch}>
          새로고침
        </Button>
      </Box>
      
      <List>
        {users?.map(user => (
          <ListItem key={user.id} divider>
            <ListItemText 
              primary={user.name}
              secondary={`@${user.username} - ${user.email}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default UserList
```

---

## 로직 재사용 패턴 비교 {#로직-재사용-패턴}

### 패턴 1: 로컬 스토리지 Hook

```javascript
// useLocalStorage.js
import { useState, useEffect } from 'react'

/**
 * 로컬 스토리지와 동기화되는 상태를 관리하는 Hook
 * Vue의 VueUse 라이브러리의 useLocalStorage와 유사
 */
export function useLocalStorage(key, initialValue) {
  // 초기값 설정 - 로컬 스토리지에 있으면 그 값을, 없으면 initialValue 사용
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`로컬 스토리지 읽기 에러 (${key}):`, error)
      return initialValue
    }
  })
  
  // 값을 설정하고 로컬 스토리지에 저장
  const setValue = (value) => {
    try {
      // 함수형 업데이트 지원
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value
      
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`로컬 스토리지 저장 에러 (${key}):`, error)
    }
  }
  
  // 다른 탭/창에서의 변경사항 감지
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error('스토리지 변경 파싱 에러:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])
  
  return [storedValue, setValue]
}
```

### 패턴 2: Debounce Hook

```javascript
// useDebounce.js
import { useState, useEffect } from 'react'

/**
 * 값의 변경을 지연시키는 Hook
 * 검색 입력 등에서 API 호출을 최적화할 때 유용
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    // 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    // cleanup - 값이 변경되면 이전 타이머 취소
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])  // value나 delay가 변경될 때마다 재실행
  
  return debouncedValue
}

// 사용 예시
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  
  // debouncedSearchTerm이 변경될 때만 API 호출
  const { data } = useApi(`/api/search?q=${debouncedSearchTerm}`)
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="검색..."
    />
  )
}
```

---

## 흔한 실수와 해결방법 {#흔한-실수와-해결방법}

### 실수 1: Hook 규칙 위반

```javascript
// ❌ 잘못된 예시
function MyComponent({ shouldFetch }) {
  if (shouldFetch) {
    // 조건문 안에서 Hook 호출 - 에러!
    const { data } = useApi('/api/data')
  }
  
  return <div>...</div>
}

// ✅ 올바른 해결방법
function MyComponent({ shouldFetch }) {
  // Hook은 항상 호출하고, 내부에서 조건 처리
  const { data } = useApi(shouldFetch ? '/api/data' : null)
  
  return <div>...</div>
}

// useApi Hook 내부에서 null 체크
export function useApi(url) {
  // ... 기존 코드
  
  useEffect(() => {
    if (!url) return  // url이 없으면 실행하지 않음
    
    const cleanup = fetchData()
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn())
    }
  }, [fetchData, url])
  
  // ...
}
```

### 실수 2: 무한 루프

```javascript
// ❌ 잘못된 예시 - 매 렌더링마다 새 객체 생성
function MyComponent() {
  const { data } = useApi('/api/data')
  
  useEffect(() => {
    console.log('데이터 변경:', data)
  }, [{ ...data }])  // 매번 새 객체 -> 무한 루프!
  
  return <div>...</div>
}

// ✅ 올바른 해결방법
function MyComponent() {
  const { data } = useApi('/api/data')
  
  useEffect(() => {
    console.log('데이터 변경:', data)
  }, [data])  // 원본 참조 사용
  
  return <div>...</div>
}
```

### 실수 3: Cleanup 함수 누락

```javascript
// ❌ 잘못된 예시 - cleanup 없음
export function useTimer() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
  }, [])  // 메모리 누수 발생!
  
  return count
}

// ✅ 올바른 해결방법
export function useTimer() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
    
    // cleanup 함수 반환
    return () => {
      clearInterval(timer)
    }
  }, [])
  
  return count
}
```

### 실수 4: Stale Closure 문제

```javascript
// ❌ 잘못된 예시 - 오래된 값 참조
export function useCounter() {
  const [count, setCount] = useState(0)
  
  const logCount = () => {
    setTimeout(() => {
      console.log(count)  // 클로저에 갇힌 오래된 count 값
    }, 3000)
  }
  
  return { count, setCount, logCount }
}

// ✅ 올바른 해결방법 - useRef 사용
export function useCounter() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  
  // count가 변경될 때마다 ref 업데이트
  useEffect(() => {
    countRef.current = count
  }, [count])
  
  const logCount = () => {
    setTimeout(() => {
      console.log(countRef.current)  // 항상 최신 값
    }, 3000)
  }
  
  return { count, setCount, logCount }
}
```

---

## 실습 과제 {#실습-과제}

### 과제 1: 페이지네이션 Hook 만들기 (난이도: 쉬움)

**요구사항:**
- `usePagination` Hook을 만들어 페이지네이션 로직을 재사용 가능하게 구현
- 현재 페이지, 전체 페이지 수, 페이지 이동 함수들을 제공
- Material-UI의 Pagination 컴포넌트와 함께 사용

**구현해야 할 기능:**
```javascript
// usePagination Hook의 인터페이스
const {
  currentPage,      // 현재 페이지 번호
  totalPages,       // 전체 페이지 수
  setPage,          // 특정 페이지로 이동
  nextPage,         // 다음 페이지로
  prevPage,         // 이전 페이지로
  firstPage,        // 첫 페이지로
  lastPage,         // 마지막 페이지로
  isFirstPage,      // 첫 페이지인지 여부
  isLastPage        // 마지막 페이지인지 여부
} = usePagination({
  totalItems: 100,  // 전체 아이템 수
  itemsPerPage: 10, // 페이지당 아이템 수
  initialPage: 1    // 초기 페이지
})
```

**힌트:**
- `useState`를 사용하여 현재 페이지 상태 관리
- 계산된 값들은 useMemo를 고려 (선택사항)
- 경계값 체크 (1보다 작거나 totalPages보다 큰 페이지로 이동 방지)

### 과제 2: 폼 유효성 검사 Hook 만들기 (난이도: 보통)

**요구사항:**
- `useForm` Hook을 만들어 폼 상태와 유효성 검사 로직 구현
- Material-UI의 TextField 컴포넌트와 통합
- 실시간 유효성 검사와 에러 메시지 표시

**구현해야 할 기능:**
```javascript
// useForm Hook의 인터페이스
const {
  values,           // 폼 필드 값들
  errors,           // 각 필드의 에러 메시지
  touched,          // 각 필드가 터치되었는지 여부
  isValid,          // 폼 전체가 유효한지
  handleChange,     // 입력 변경 핸들러
  handleBlur,       // 포커스 아웃 핸들러
  handleSubmit,     // 폼 제출 핸들러
  resetForm         // 폼 초기화
} = useForm({
  initialValues: {
    email: '',
    password: '',
    confirmPassword: ''
  },
  validationRules: {
    email: {
      required: '이메일은 필수입니다',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: '올바른 이메일 형식이 아닙니다'
      }
    },
    password: {
      required: '비밀번호는 필수입니다',
      minLength: {
        value: 8,
        message: '비밀번호는 최소 8자 이상이어야 합니다'
      }
    },
    confirmPassword: {
      required: '비밀번호 확인은 필수입니다',
      custom: (value, values) => 
        value === values.password || '비밀번호가 일치하지 않습니다'
    }
  },
  onSubmit: (values) => {
    console.log('폼 제출:', values)
  }
})
```

**Material-UI TextField와의 통합 예시:**
```javascript
<TextField
  name="email"
  label="이메일"
  value={values.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={touched.email && !!errors.email}
  helperText={touched.email && errors.email}
  fullWidth
  margin="normal"
/>
```

**힌트:**
- 각 필드의 유효성 검사는 `handleBlur` 시점에 실행
- `touched` 상태를 활용하여 사용자가 필드를 건드린 후에만 에러 표시
- `useEffect`를 사용하여 values 변경시 유효성 재검사
- 커스텀 유효성 검사 함수 지원 (confirmPassword처럼 다른 필드와 비교)

---

## 마무리

React Custom Hooks는 Vue3의 Composables와 매우 유사한 개념입니다. 주요 차이점은:

1. **네이밍**: React는 `use` 접두사가 필수
2. **반응성**: Vue는 `.value` 접근, React는 setter 함수 사용
3. **생명주기**: Vue는 명시적 훅, React는 useEffect로 통합 관리

Custom Hooks를 잘 활용하면 컴포넌트 로직을 효과적으로 재사용할 수 있고, 관심사의 분리를 통해 더 깨끗한 코드를 작성할 수 있습니다.

**다음 단계:**
- 실습 과제를 직접 구현해보세요
- 더 복잡한 Custom Hooks (useInfiniteScroll, useWebSocket 등)를 시도해보세요
- 오픈소스 Hook 라이브러리들(react-use, ahooks)을 참고하여 패턴을 학습하세요