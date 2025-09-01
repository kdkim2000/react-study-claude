# Chapter 4: Essential Hooks

## 📚 학습 목표
- Vue3의 반응형 시스템과 React Hooks의 대응 관계 이해
- useState로 상태 관리하는 방법 마스터
- useEffect로 부수 효과 처리하는 방법 학습
- useContext로 전역 상태 공유하기
- useRef로 DOM 참조 및 값 보존하기

---

## 1. useState - Vue3의 ref/reactive 대체

### 이론 설명 (30%)

`useState`는 React에서 가장 기본적인 Hook으로, Vue3의 `ref`와 `reactive`를 대체합니다. 하지만 동작 방식에는 중요한 차이가 있습니다.

#### 핵심 차이점

| Vue3 | React | 주요 차이 |
|------|-------|----------|
| `ref(value)` | `useState(value)` | React는 setter 함수 사용 |
| `reactive(object)` | `useState(object)` | React는 불변성 유지 필요 |
| `.value` 접근 | 직접 접근 | React는 값 직접 사용 |
| 자동 반응성 | setter 호출 필요 | React는 명시적 업데이트 |

### 실습 코드 (70%)

#### 1.1 기본 사용법 비교

```vue
<!-- Vue3: Counter.vue -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>User: {{ user.name }} ({{ user.age }})</p>
    <button @click="increment">증가</button>
    <button @click="updateUser">사용자 업데이트</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// ref: 단일 값
const count = ref(0)

// reactive: 객체
const user = reactive({
  name: '홍길동',
  age: 25
})

const increment = () => {
  count.value++  // .value로 접근
}

const updateUser = () => {
  user.name = '김철수'  // 직접 수정 가능
  user.age++
}
</script>
```

```tsx
// React: Counter.tsx
import { useState } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'

function Counter() {
  // useState: 단일 값
  const [count, setCount] = useState(0)  // [현재값, setter함수] 반환
  
  // useState: 객체
  const [user, setUser] = useState({
    name: '홍길동',
    age: 25
  })
  
  const increment = () => {
    setCount(count + 1)  // setter 함수 사용
    // 또는 함수형 업데이트
    // setCount(prev => prev + 1)
  }
  
  const updateUser = () => {
    // ❌ 잘못된 방법 - 직접 수정
    // user.name = '김철수'  // 리렌더링 안됨!
    
    // ✅ 올바른 방법 - 새 객체 생성 (불변성)
    setUser({
      ...user,  // 기존 속성 복사
      name: '김철수',
      age: user.age + 1
    })
  }
  
  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6">useState 기본 예제</Typography>
      <Typography>Count: {count}</Typography>
      <Typography>User: {user.name} ({user.age})</Typography>
      
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={increment}>
          증가
        </Button>
        <Button variant="contained" onClick={updateUser}>
          사용자 업데이트
        </Button>
      </Box>
    </Paper>
  )
}
```

#### 1.2 여러 상태 관리 패턴

```tsx
// React: 다양한 useState 패턴
import { useState } from 'react'
import {
  Container,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Button,
  Chip,
  Alert
} from '@mui/material'

function StatePatterns() {
  // 1. 개별 상태 관리 (Vue3의 여러 ref)
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [isActive, setIsActive] = useState(false)
  
  // 2. 객체로 관련 상태 그룹화 (Vue3의 reactive)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  
  // 3. 배열 상태
  const [tags, setTags] = useState<string[]>(['React', 'Vue'])
  const [newTag, setNewTag] = useState('')
  
  // 4. 함수형 초기값 (expensive computation)
  const [expensiveData] = useState(() => {
    console.log('이 함수는 한 번만 실행됩니다')
    return Array.from({ length: 100 }, (_, i) => i)
  })
  
  // 객체 상태 업데이트 헬퍼
  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 배열에 항목 추가
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])  // 새 배열 생성
      setNewTag('')
    }
  }
  
  // 배열에서 항목 제거
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  
  // 모든 상태 초기화
  const resetAll = () => {
    setName('')
    setAge(0)
    setIsActive(false)
    setFormData({
      email: '',
      password: '',
      remember: false
    })
    setTags([])
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        useState 패턴 모음
      </Typography>
      
      {/* 개별 상태 */}
      <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>1. 개별 상태</Typography>
        <TextField
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="나이"
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          sx={{ mr: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="활성화"
        />
      </Box>
      
      {/* 객체 상태 */}
      <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>2. 객체로 그룹화</Typography>
        <TextField
          label="이메일"
          value={formData.email}
          onChange={(e) => updateFormField('email', e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="비밀번호"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormField('password', e.target.value)}
          sx={{ mr: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formData.remember}
              onChange={(e) => updateFormField('remember', e.target.checked)}
            />
          }
          label="기억하기"
        />
      </Box>
      
      {/* 배열 상태 */}
      <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>3. 배열 상태</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="새 태그"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button variant="contained" onClick={addTag}>추가</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => removeTag(tag)}
              color="primary"
            />
          ))}
        </Box>
      </Box>
      
      {/* 상태 요약 */}
      <Alert severity="info">
        <Typography variant="subtitle2">현재 상태:</Typography>
        <Typography variant="body2">
          이름: {name || '없음'}, 나이: {age}, 활성: {isActive ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          이메일: {formData.email || '없음'}, 기억: {formData.remember ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body2">
          태그: {tags.length}개
        </Typography>
      </Alert>
      
      <Button 
        variant="outlined" 
        color="error" 
        onClick={resetAll}
        sx={{ mt: 2 }}
      >
        모두 초기화
      </Button>
    </Container>
  )
}

export default StatePatterns
```

#### 1.3 useState의 함정과 해결책

```tsx
// React: useState 주의사항
import { useState } from 'react'
import { Box, Button, Typography, Alert } from '@mui/material'

function UseStatePitfalls() {
  // 🔴 문제 1: 클로저 문제
  const [count, setCount] = useState(0)
  
  const handleDelayedIncrement = () => {
    // 현재 count 값을 캡처 (클로저)
    setTimeout(() => {
      // ❌ 3초 후 실행될 때 count는 오래된 값
      setCount(count + 1)  // 항상 클릭 시점의 count 사용
    }, 3000)
  }
  
  const handleCorrectDelayedIncrement = () => {
    setTimeout(() => {
      // ✅ 함수형 업데이트로 최신 값 보장
      setCount(prev => prev + 1)
    }, 3000)
  }
  
  // 🔴 문제 2: 객체/배열 직접 수정
  const [user, setUser] = useState({ name: '홍길동', scores: [10, 20] })
  
  const wrongUpdate = () => {
    // ❌ 같은 참조 = 리렌더링 안됨
    user.name = '김철수'
    user.scores.push(30)
    setUser(user)  // React는 같은 객체로 인식
  }
  
  const correctUpdate = () => {
    // ✅ 새 객체/배열 생성
    setUser({
      ...user,
      name: '김철수',
      scores: [...user.scores, 30]
    })
  }
  
  // 🔴 문제 3: 비동기 상태 업데이트
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string | null>(null)
  
  const fetchData = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/data')
      const result = await response.text()
      
      // ⚠️ 컴포넌트가 언마운트되면 메모리 누수 발생 가능
      setData(result)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  
  // 🔴 문제 4: 연속된 상태 업데이트
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [sum, setSum] = useState(0)
  
  const wrongCalculation = () => {
    setA(5)
    setB(10)
    // ❌ a와 b는 아직 이전 값 (0)
    setSum(a + b)  // 0 + 0 = 0
  }
  
  const correctCalculation = () => {
    const newA = 5
    const newB = 10
    setA(newA)
    setB(newB)
    // ✅ 직접 계산
    setSum(newA + newB)  // 5 + 10 = 15
  }
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        useState 주의사항
      </Typography>
      
      {/* 클로저 문제 데모 */}
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle2">클로저 문제</Typography>
        <Typography variant="body2">
          Count: {count}
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          <Button size="small" onClick={() => setCount(count + 1)}>
            즉시 증가
          </Button>
          <Button size="small" onClick={handleDelayedIncrement} color="error">
            지연 증가 (문제)
          </Button>
          <Button size="small" onClick={handleCorrectDelayedIncrement} color="success">
            지연 증가 (해결)
          </Button>
        </Box>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          빠르게 여러 번 클릭해보세요!
        </Typography>
      </Alert>
      
      {/* 중요 규칙 */}
      <Alert severity="info">
        <Typography variant="subtitle2">useState 황금 규칙</Typography>
        <ol>
          <li>상태를 직접 수정하지 말고 새 값을 생성하세요</li>
          <li>이전 상태 기반 업데이트는 함수형 업데이트를 사용하세요</li>
          <li>관련된 여러 상태는 하나의 객체로 관리하세요</li>
          <li>비동기 작업 시 cleanup을 고려하세요</li>
        </ol>
      </Alert>
    </Box>
  )
}
```

---

## 2. useEffect - Vue3의 watchEffect/watch 대체

### 이론 설명

`useEffect`는 부수 효과(side effects)를 처리하는 Hook으로, Vue3의 `watchEffect`와 `watch`를 대체합니다.

#### 대응 관계

| Vue3 | React | 용도 |
|------|-------|------|
| `watchEffect` | `useEffect(() => {})` | 자동 의존성 추적 |
| `watch(source, callback)` | `useEffect(() => {}, [deps])` | 특정 값 감시 |
| `onMounted` | `useEffect(() => {}, [])` | 마운트 시 실행 |
| `onUnmounted` | `useEffect` cleanup | 정리 작업 |

### 실습 코드

#### 2.1 기본 사용법

```tsx
// React: useEffect 기본
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  CircularProgress,
  Alert
} from '@mui/material'

function UseEffectBasics() {
  const [count, setCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // 1. 모든 렌더링 후 실행 (watchEffect와 유사)
  useEffect(() => {
    console.log('컴포넌트가 렌더링되었습니다')
    // 주의: 무한 루프 위험!
  })
  
  // 2. 마운트 시 한 번만 실행 (onMounted와 유사)
  useEffect(() => {
    console.log('컴포넌트가 마운트되었습니다')
    
    // Cleanup 함수 (onUnmounted와 유사)
    return () => {
      console.log('컴포넌트가 언마운트됩니다')
    }
  }, [])  // 빈 배열 = 의존성 없음
  
  // 3. 특정 값 변경 시 실행 (watch와 유사)
  useEffect(() => {
    console.log(`count가 ${count}로 변경되었습니다`)
    
    // count가 5 이상일 때 알림
    if (count >= 5) {
      console.log('경고: count가 5 이상입니다!')
    }
  }, [count])  // count를 감시
  
  // 4. 디바운스된 검색 (실무 예제)
  useEffect(() => {
    // 검색어가 없으면 실행 안 함
    if (!searchTerm) {
      setSearchResults([])
      return
    }
    
    // 디바운스를 위한 타이머
    const timeoutId = setTimeout(() => {
      setIsSearching(true)
      
      // 가짜 API 호출 시뮬레이션
      setTimeout(() => {
        const results = [
          `${searchTerm} 결과 1`,
          `${searchTerm} 결과 2`,
          `${searchTerm} 결과 3`
        ]
        setSearchResults(results)
        setIsSearching(false)
      }, 1000)
    }, 500)  // 500ms 디바운스
    
    // Cleanup: 이전 타이머 취소
    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchTerm])  // searchTerm 변경 시 실행
  
  // 5. 여러 의존성 감시
  useEffect(() => {
    console.log('count 또는 searchTerm이 변경되었습니다')
  }, [count, searchTerm])  // 여러 값 감시
  
  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        useEffect 기본 예제
      </Typography>
      
      {/* 카운터 */}
      <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6">카운터 (watch 예제)</Typography>
        <Typography>현재 값: {count}</Typography>
        {count >= 5 && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            count가 5 이상입니다!
          </Alert>
        )}
        <Button 
          variant="contained" 
          onClick={() => setCount(count + 1)}
          sx={{ mt: 1 }}
        >
          증가
        </Button>
      </Box>
      
      {/* 검색 */}
      <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          디바운스 검색 (실무 예제)
        </Typography>
        <TextField
          fullWidth
          label="검색어 입력 (0.5초 디바운스)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="타이핑을 멈추면 검색이 시작됩니다"
        />
        
        {isSearching && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography>검색 중...</Typography>
          </Box>
        )}
        
        {searchResults.length > 0 && (
          <List>
            {searchResults.map((result, index) => (
              <ListItem key={index}>• {result}</ListItem>
            ))}
          </List>
        )}
      </Box>
      
      <Alert severity="info">
        <Typography variant="subtitle2">콘솔을 확인하세요!</Typography>
        <Typography variant="body2">
          useEffect의 실행 시점을 확인할 수 있습니다.
        </Typography>
      </Alert>
    </Box>
  )
}

export default UseEffectBasics
```

#### 2.2 useEffect 고급 패턴

```tsx
// React: useEffect 고급 사용법
import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material'

function UseEffectAdvanced() {
  // 1. 데이터 페칭 패턴
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    let cancelled = false  // cleanup 플래그
    
    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // 실제 API 대신 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 컴포넌트가 언마운트되지 않았을 때만 상태 업데이트
        if (!cancelled) {
          setUserData({
            name: '홍길동',
            email: 'hong@example.com',
            joinDate: new Date().toLocaleDateString()
          })
        }
      } catch (err) {
        if (!cancelled) {
          setError('데이터 로드 실패')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchUser()
    
    // Cleanup: 요청 취소
    return () => {
      cancelled = true
    }
  }, [])  // 마운트 시 한 번만
  
  // 2. 타이머/인터벌 패턴
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  
  useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
    
    // Cleanup: 인터벌 정리
    return () => {
      clearInterval(interval)
    }
  }, [isRunning])  // isRunning 변경 시 재실행
  
  // 3. 이벤트 리스너 패턴
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)
    
    // Cleanup: 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // 4. localStorage 동기화 패턴
  const [theme, setTheme] = useState(() => {
    // 초기값을 localStorage에서 가져오기
    return localStorage.getItem('theme') || 'light'
  })
  
  useEffect(() => {
    // theme 변경 시 localStorage 업데이트
    localStorage.setItem('theme', theme)
    
    // 다른 탭에서의 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [theme])
  
  // 5. 조건부 effect
  const [shouldFetch, setShouldFetch] = useState(false)
  const [conditionalData, setConditionalData] = useState<string>('')
  
  useEffect(() => {
    // 조건에 따라 effect 실행 여부 결정
    if (!shouldFetch) {
      return  // early return
    }
    
    // 데이터 페칭 로직
    const fetchData = async () => {
      const data = await new Promise<string>(resolve => 
        setTimeout(() => resolve('조건부 데이터'), 1000)
      )
      setConditionalData(data)
    }
    
    fetchData()
  }, [shouldFetch])
  
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        useEffect 고급 패턴
      </Typography>
      
      {/* 데이터 페칭 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">1. 데이터 페칭</Typography>
          {loading && <LinearProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {userData && (
            <Box>
              <Typography>이름: {userData.name}</Typography>
              <Typography>이메일: {userData.email}</Typography>
              <Typography>가입일: {userData.joinDate}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* 타이머 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">2. 타이머</Typography>
          <Typography>경과 시간: {seconds}초</Typography>
          <Button
            variant="contained"
            onClick={() => setIsRunning(!isRunning)}
            sx={{ mt: 1 }}
          >
            {isRunning ? '정지' : '시작'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSeconds(0)}
            sx={{ mt: 1, ml: 1 }}
          >
            리셋
          </Button>
        </CardContent>
      </Card>
      
      {/* 윈도우 크기 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">3. 윈도우 리사이즈</Typography>
          <Typography>
            창 크기: {windowSize.width} x {windowSize.height}
          </Typography>
          <Typography variant="caption">
            창 크기를 조절해보세요!
          </Typography>
        </CardContent>
      </Card>
      
      {/* 테마 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6">4. localStorage 동기화</Typography>
          <Typography>현재 테마: {theme}</Typography>
          <Box sx={{ mt: 1 }}>
            <Button
              variant={theme === 'light' ? 'contained' : 'outlined'}
              onClick={() => setTheme('light')}
              sx={{ mr: 1 }}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'contained' : 'outlined'}
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* 조건부 실행 */}
      <Card>
        <CardContent>
          <Typography variant="h6">5. 조건부 Effect</Typography>
          <Button
            variant="contained"
            onClick={() => setShouldFetch(!shouldFetch)}
          >
            {shouldFetch ? '페칭 중지' : '페칭 시작'}
          </Button>
          {conditionalData && (
            <Typography sx={{ mt: 1 }}>
              결과: {conditionalData}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
```

---

## 3. useContext - 전역 상태 공유

### 이론 설명

`useContext`는 Vue3의 `provide/inject`와 유사한 기능으로, 컴포넌트 트리 전체에 데이터를 공유합니다.

#### 비교

| Vue3 | React | 설명 |
|------|-------|------|
| `provide` | `Context.Provider` | 데이터 제공 |
| `inject` | `useContext` | 데이터 사용 |
| Symbol 키 | Context 객체 | 식별자 |

### 실습 코드

#### 3.1 Context 생성과 사용

```tsx
// React: Context 기본 사용법
import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material'

// 1. Context 생성
interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 2. Provider 컴포넌트
function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  
  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. Custom Hook으로 Context 사용 간소화
function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// 4. 자식 컴포넌트들
function Header() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: isDark ? 'grey.900' : 'primary.main',
        color: 'white'
      }}
    >
      <Typography variant="h6">헤더</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            sx={{ color: 'white' }}
          />
        }
        label="다크 모드"
      />
    </Box>
  )
}

function Content() {
  const { isDark } = useTheme()
  
  return (
    <Card
      sx={{
        m: 2,
        bgcolor: isDark ? 'grey.800' : 'background.paper',
        color: isDark ? 'white' : 'text.primary'
      }}
    >
      <CardContent>
        <Typography variant="h6">컨텐츠 영역</Typography>
        <Typography>
          현재 테마: {isDark ? '다크' : '라이트'}
        </Typography>
      </CardContent>
    </Card>
  )
}

function Footer() {
  const { isDark } = useTheme()
  
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: isDark ? 'grey.900' : 'grey.200',
        color: isDark ? 'white' : 'text.primary'
      }}
    >
      <Typography>푸터 - Context를 통해 테마 공유 중</Typography>
    </Box>
  )
}

// 5. 메인 컴포넌트
function ContextExample() {
  return (
    <ThemeProvider>
      <Box sx={{ minHeight: '400px' }}>
        <Header />
        <Content />
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

// 실무 예제: 사용자 인증 Context
interface User {
  id: string
  name: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  const login = async (email: string, password: string) => {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    setUser({
      id: '1',
      name: '홍길동',
      role: 'admin'
    })
  }
  
  const logout = () => {
    setUser(null)
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// 사용 예제
function LoginStatus() {
  const { user, isAuthenticated, logout } = useAuth()
  
  return (
    <Alert severity={isAuthenticated ? 'success' : 'info'}>
      {isAuthenticated ? (
        <Box>
          <Typography>로그인됨: {user?.name} ({user?.role})</Typography>
          <Button size="small" onClick={logout}>로그아웃</Button>
        </Box>
      ) : (
        <Typography>로그인이 필요합니다</Typography>
      )}
    </Alert>
  )
}
```

---

## 4. useRef - DOM 참조 및 값 보존

### 이론 설명

`useRef`는 두 가지 용도로 사용됩니다:
1. DOM 요소 참조 (Vue3의 템플릿 ref)
2. 렌더링 간 값 보존 (Vue3의 일반 변수와 유사)

#### 비교

| Vue3 | React | 용도 |
|------|-------|------|
| 템플릿 `ref="myRef"` | `ref={myRef}` | DOM 참조 |
| `const myRef = ref()` | `const myRef = useRef()` | ref 생성 |
| `myRef.value` | `myRef.current` | 값 접근 |

### 실습 코드

#### 4.1 DOM 참조와 값 보존

```tsx
// React: useRef 활용법
import { useState, useRef, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Divider
} from '@mui/material'

function UseRefExample() {
  // 1. DOM 요소 참조
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const focusInput = () => {
    // DOM 메서드 직접 호출
    inputRef.current?.focus()
    inputRef.current?.select()
  }
  
  const triggerFileUpload = () => {
    // 숨겨진 file input 트리거
    fileInputRef.current?.click()
  }
  
  // 2. 값 보존 (리렌더링해도 유지)
  const renderCount = useRef(0)
  const previousValue = useRef<string>('')
  const intervalId = useRef<NodeJS.Timeout | null>(null)
  
  const [inputValue, setInputValue] = useState('')
  const [count, setCount] = useState(0)
  
  // 렌더링 횟수 추적
  renderCount.current += 1
  
  // 이전 값 저장
  useEffect(() => {
    previousValue.current = inputValue
  }, [inputValue])
  
  // 3. 타이머 ID 저장
  const startTimer = () => {
    // 이전 타이머 정리
    if (intervalId.current) {
      clearInterval(intervalId.current)
    }
    
    intervalId.current = setInterval(() => {
      setCount(prev => prev + 1)
    }, 1000)
  }
  
  const stopTimer = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current)
      intervalId.current = null
    }
  }
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current)
      }
    }
  }, [])
  
  // 4. 스크롤 위치 저장
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<string[]>([
    '메시지 1',
    '메시지 2',
    '메시지 3'
  ])
  
  const addMessage = () => {
    setMessages(prev => [...prev, `메시지 ${prev.length + 1}`])
    
    // 새 메시지 추가 후 스크롤 맨 아래로
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 
          scrollContainerRef.current.scrollHeight
      }
    }, 0)
  }
  
  // 5. 컴포넌트 인스턴스 참조
  const formDataRef = useRef({
    name: '',
    email: '',
    message: ''
  })
  
  const updateFormData = (field: string, value: string) => {
    // 리렌더링 없이 데이터 업데이트
    formDataRef.current = {
      ...formDataRef.current,
      [field]: value
    }
  }
  
  const submitForm = () => {
    console.log('제출할 데이터:', formDataRef.current)
    alert('콘솔을 확인하세요!')
  }
  
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        useRef 활용 예제
      </Typography>
      
      {/* DOM 참조 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            1. DOM 요소 참조
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              inputRef={inputRef}
              label="포커스 테스트"
              defaultValue="클릭하면 선택됩니다"
              fullWidth
            />
            <Button variant="contained" onClick={focusInput}>
              포커스
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) alert(`선택된 파일: ${file.name}`)
              }}
            />
            <Button variant="outlined" onClick={triggerFileUpload}>
              파일 업로드 (숨겨진 input 트리거)
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* 값 보존 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            2. 값 보존 (리렌더링 간)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            렌더링 횟수: {renderCount.current}회
          </Alert>
          
          <TextField
            label="입력값"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            helperText={`이전 값: ${previousValue.current}`}
          />
        </CardContent>
      </Card>
      
      {/* 타이머 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            3. 타이머 ID 저장
          </Typography>
          <Typography>카운트: {count}</Typography>
          <Box sx={{ mt: 1 }}>
            <Button variant="contained" onClick={startTimer} sx={{ mr: 1 }}>
              시작
            </Button>
            <Button variant="outlined" onClick={stopTimer}>
              정지
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {/* 스크롤 컨테이너 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            4. 스크롤 제어
          </Typography>
          <Box
            ref={scrollContainerRef}
            sx={{
              height: 150,
              overflowY: 'auto',
              border: 1,
              borderColor: 'divider',
              p: 1,
              mb: 1
            }}
          >
            {messages.map((msg, index) => (
              <Typography key={index}>{msg}</Typography>
            ))}
          </Box>
          <Button variant="contained" onClick={addMessage}>
            메시지 추가 (자동 스크롤)
          </Button>
        </CardContent>
      </Card>
      
      {/* 폼 데이터 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            5. 리렌더링 없는 데이터 저장
          </Typography>
          <Typography variant="caption" color="text.secondary">
            입력해도 컴포넌트가 리렌더링되지 않습니다 (렌더링 횟수 확인)
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="이름"
              onChange={(e) => updateFormData('name', e.target.value)}
              sx={{ mr: 1 }}
            />
            <TextField
              label="이메일"
              onChange={(e) => updateFormData('email', e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button variant="contained" onClick={submitForm}>
              제출
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UseRefExample
```

---

## ⚠️ 흔한 실수와 해결 방법

### 1. useState 클로저 문제

```tsx
// ❌ 잘못된 코드
function BadExample() {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1)  // count는 클릭 시점의 값
    }, 3000)
  }
}

// ✅ 올바른 코드
function GoodExample() {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    setTimeout(() => {
      setCount(prev => prev + 1)  // 최신 값 사용
    }, 3000)
  }
}
```

### 2. useEffect 무한 루프

```tsx
// ❌ 잘못된 코드
function BadExample() {
  const [data, setData] = useState({})
  
  useEffect(() => {
    setData({ name: 'test' })  // 매번 새 객체 = 무한 루프
  }, [data])  // data가 변경되면 다시 실행
}

// ✅ 올바른 코드
function GoodExample() {
  const [data, setData] = useState({})
  
  useEffect(() => {
    setData({ name: 'test' })
  }, [])  // 마운트 시 한 번만
}
```

### 3. useContext 오용

```tsx
// ❌ 잘못된 코드 - Provider 없이 사용
function BadExample() {
  const theme = useContext(ThemeContext)  // undefined!
  return <div>{theme.isDark}</div>  // 에러!
}

// ✅ 올바른 코드 - Provider로 감싸기
function GoodExample() {
  return (
    <ThemeProvider>
      <ComponentUsingTheme />
    </ThemeProvider>
  )
}
```

### 4. useRef vs useState 선택

```tsx
// ❌ 잘못된 선택 - 렌더링 필요한데 useRef 사용
function BadExample() {
  const count = useRef(0)
  
  const increment = () => {
    count.current++  // 화면 업데이트 안 됨!
  }
  
  return <div>{count.current}</div>
}

// ✅ 올바른 선택 - 렌더링 필요하면 useState
function GoodExample() {
  const [count, setCount] = useState(0)
  
  const increment = () => {
    setCount(count + 1)  // 화면 업데이트됨
  }
  
  return <div>{count}</div>
}
```

---

## 🎯 실습 과제

### 📝 과제 1: 실시간 검색 컴포넌트 (난이도: ⭐)

#### 요구사항
- 검색어 입력 시 0.5초 디바운스
- 검색 중 로딩 표시
- 검색 결과 표시
- 검색 기록 저장 (최대 5개)

#### 힌트
- `useState`로 검색어, 결과, 기록 관리
- `useEffect`로 디바운스 구현
- `useRef`로 타이머 ID 저장

---

### 📝 과제 2: 테마 설정 시스템 (난이도: ⭐⭐)

#### 요구사항
- Context로 테마 상태 전역 관리
- 라이트/다크 모드 전환
- 테마 설정 localStorage 저장
- 3개 이상의 컴포넌트에서 테마 사용

#### 힌트
- `createContext`로 테마 Context 생성
- `useContext`로 테마 사용
- `useEffect`로 localStorage 동기화
- Material-UI 테마 적용

---

## 📌 Chapter 4 요약

### Hook 선택 가이드

| 상황 | 사용할 Hook |
|------|------------|
| 화면 업데이트 필요한 상태 | `useState` |
| API 호출, 타이머, 이벤트 리스너 | `useEffect` |
| 전역 상태 공유 | `useContext` |
| DOM 직접 조작 | `useRef` |
| 리렌더링 없는 값 저장 | `useRef` |

### Vue3 → React 마이그레이션 체크리스트

- [ ] `ref` → `useState`로 변환
- [ ] `reactive` → `useState`로 변환 (불변성 유지)
- [ ] `watchEffect` → `useEffect`로 변환
- [ ] `watch` → `useEffect`로 변환 (의존성 배열 추가)
- [ ] `provide/inject` → Context API로 변환
- [ ] 템플릿 ref → `useRef`로 변환

### 다음 장 예고
Chapter 5에서는 Custom Hooks를 작성하여 로직을 재사용하는 방법을 학습합니다.

---

## 💬 Q&A

**Q1: Vue3의 `computed`와 같은 Hook이 있나요?**
> `useMemo`를 사용하면 됩니다. Chapter 5에서 자세히 다룹니다.

**Q2: `useEffect`의 의존성 배열을 어떻게 결정하나요?**
> Effect 내부에서 사용하는 모든 외부 값을 포함시키세요. ESLint의 `exhaustive-deps` 규칙이 도움됩니다.

**Q3: Context vs Props 언제 사용하나요?**
> 여러 단계를 거쳐 전달해야 하는 데이터는 Context, 직접 부모-자식 간 데이터는 Props를 사용하세요.

이제 React의 Essential Hooks를 마스터했습니다!