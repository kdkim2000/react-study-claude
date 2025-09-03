# Chapter 1: React 개발 환경 구축

## 📚 학습 목표
- React 개발에 필요한 도구 설치 및 설정
- Vue3 프로젝트와 React 프로젝트 구조 비교
- Vite를 사용한 React 프로젝트 초기 설정
- Material-UI 설정 및 첫 번째 React 컴포넌트 작성

---

## 1. Node.js와 패키지 매니저 설정

### 이론 (30%)

React와 Vue3 모두 Node.js 기반으로 동작하므로, 이미 Vue3 개발 환경이 구축되어 있다면 추가 설치는 불필요합니다.

#### 버전 확인 및 권장 사양
```bash
# Node.js 버전 확인 (16.x 이상 권장)
node --version

# npm 버전 확인
npm --version

# yarn 버전 확인 (선택사항)
yarn --version
```

### 🔄 Vue3 vs React 패키지 매니저 사용 비교

| 작업 | Vue3 | React |
|------|------|-------|
| 프로젝트 생성 | `npm create vue@latest` | `npm create vite@latest` |
| 의존성 설치 | `npm install` | `npm install` |
| 개발 서버 실행 | `npm run dev` | `npm run dev` |
| 빌드 | `npm run build` | `npm run build` |

---

## 2. Create React App vs Vite

### 이론 설명

Vue3에서 Vite를 사용했다면, React에서도 Vite를 사용하는 것을 권장합니다.

#### 비교표

| 특징 | Create React App (CRA) | Vite |
|------|------------------------|------|
| 빌드 속도 | 느림 | 매우 빠름 |
| HMR 속도 | 보통 | 매우 빠름 |
| 설정 복잡도 | 간단 (Zero Config) | 간단 |
| 커스터마이징 | eject 필요 | vite.config.js로 쉽게 가능 |
| Vue3 경험자 친숙도 | 낮음 | 높음 (동일한 도구) |

### 실습 (70%)

#### Vite로 React + TypeScript + Material-UI 프로젝트 생성

```bash
# 1. React + TypeScript + Vite 프로젝트 생성
npm create vite@latest my-react-app -- --template react-ts

# 2. 프로젝트 디렉토리로 이동
cd my-react-app

# 3. 의존성 패키지 설치
npm install

# 4. Material-UI 설치 (Vuetify 대체)
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/lab

# 5. 추가 개발 도구 설치
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# 6. React Router 설치 (Vue Router와 유사)
npm install react-router-dom
npm install -D @types/react-router-dom

# 7. Axios 설치 (API 통신용)
npm install axios

# 8. 상태 관리 라이브러리 설치 (Pinia와 유사한 Zustand)
npm install zustand

# 9. 개발 서버 실행
npm run dev
```

#### Vue3 프로젝트와 비교
```bash
# Vue3 + Vuetify
npm create vue@latest my-vue-app
cd my-vue-app
npm install
npm install vuetify

# React + Material-UI
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm install @mui/material @emotion/react @emotion/styled
```

---

## 3. VS Code 확장 프로그램 설정

### 필수 확장 프로그램 비교

#### `.vscode/extensions.json`
```json
{
  "recommendations": [
    // React 필수
    "dsznajder.es7-react-js-snippets",
    "burkeholland.simple-react-snippets",
    
    // 공통 (Vue3와 동일)
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "formulahendry.auto-rename-tag",
    "naumovs.color-highlight",
    "PKief.material-icon-theme",
    
    // TypeScript
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### `.vscode/settings.json`
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### ESLint 및 Prettier 설정 파일

#### `.eslintrc.cjs`
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}
```

#### `.prettierrc.json`
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "auto"
}
```

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 4. Material-UI 초기 설정

### 🔄 Vuetify vs Material-UI 비교

| 기능 | Vuetify (Vue3) | Material-UI (React) |
|------|----------------|---------------------|
| 설치 | `npm install vuetify` | `npm install @mui/material` |
| 테마 설정 | `createVuetify()` | `ThemeProvider` |
| 컴포넌트 prefix | `v-` (v-btn, v-card) | `Mui` (Button, Card) |
| 아이콘 | `mdi-*` | `@mui/icons-material` |
| 그리드 시스템 | `v-row`, `v-col` | `Grid` |

### Material-UI 테마 설정

#### `src/theme/index.ts`
```typescript
import { createTheme } from '@mui/material/styles'

// Vuetify와 유사한 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 대문자 변환 비활성화
        },
      },
    },
  },
})

export default theme
```

---

## 5. 프로젝트 구조 이해

### 🔄 Vue3 vs React 프로젝트 구조 비교

```
Vue3 (Vuetify) 프로젝트 구조          React (Material-UI) 프로젝트 구조
-------------------------------       ---------------------------------
my-vue-app/                           my-react-app/
├── src/                              ├── src/
│   ├── assets/                       │   ├── assets/
│   ├── components/                   │   ├── components/
│   ├── composables/                  │   ├── hooks/
│   ├── views/                        │   ├── pages/
│   ├── router/                       │   ├── router/
│   ├── stores/                       │   ├── store/
│   ├── plugins/                      │   ├── theme/          # MUI 테마
│   │   └── vuetify.ts                │   │   └── index.ts
│   ├── utils/                        │   ├── utils/
│   ├── App.vue                       │   ├── App.tsx
│   └── main.ts                       │   └── main.tsx
├── public/                           ├── public/
├── index.html                        ├── index.html
├── vite.config.ts                    ├── vite.config.ts
├── tsconfig.json                     ├── tsconfig.json
└── package.json                      └── package.json
```

---

## 6. 첫 번째 React 컴포넌트 작성 (Material-UI 사용)

### Vue3 (Vuetify) 컴포넌트 → React (Material-UI) 컴포넌트 변환

#### Vue3 + Vuetify 예제
```vue
<!-- Counter.vue -->
<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-chip color="primary" size="large">
        현재 카운트: {{ count }}
      </v-chip>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="increment">
        <v-icon start>mdi-plus</v-icon>
        증가
      </v-btn>
      <v-btn color="secondary" @click="reset">
        <v-icon start>mdi-refresh</v-icon>
        리셋
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 0
})

const count = ref(props.initialCount)
const title = computed(() => `카운터 (시작값: ${props.initialCount})`)

const increment = () => {
  count.value++
}

const reset = () => {
  count.value = props.initialCount
}
</script>
```

#### React + Material-UI 예제
```tsx
// Counter.tsx
import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material'
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material'

interface CounterProps {
  initialCount?: number
}

function Counter({ initialCount = 0 }: CounterProps) {
  // 상태 관리 (ref → useState)
  const [count, setCount] = useState(initialCount)
  
  // 계산된 값 (computed → useMemo)
  const title = useMemo(
    () => `카운터 (시작값: ${initialCount})`,
    [initialCount]
  )
  
  // 메서드
  const increment = () => {
    setCount(count + 1)
  }
  
  const reset = () => {
    setCount(initialCount)
  }
  
  // JSX 반환 (v-card → Card)
  return (
    <Card sx={{ maxWidth: 400, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip 
            label={`현재 카운트: ${count}`}
            color="primary"
            size="medium"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={increment}
        >
          증가
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<RefreshIcon />}
          onClick={reset}
        >
          리셋
        </Button>
      </CardActions>
    </Card>
  )
}

export default Counter
```

### main.tsx 진입점 비교 (Material-UI 포함)

#### Vue3 + Vuetify
```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
```

#### React + Material-UI
```typescript
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import theme from './theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Vuetify의 기본 스타일 리셋과 유사 */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

---

## 7. Material-UI 컴포넌트 매핑 가이드

### 자주 사용하는 Vuetify → Material-UI 컴포넌트 매핑

| Vuetify | Material-UI | 사용 예시 |
|---------|-------------|-----------|
| `v-btn` | `Button` | `<Button variant="contained">` |
| `v-card` | `Card` | `<Card>` |
| `v-text-field` | `TextField` | `<TextField label="이름" />` |
| `v-select` | `Select` | `<Select>` |
| `v-checkbox` | `Checkbox` | `<Checkbox />` |
| `v-radio` | `Radio` | `<Radio />` |
| `v-switch` | `Switch` | `<Switch />` |
| `v-dialog` | `Dialog` | `<Dialog open={open}>` |
| `v-snackbar` | `Snackbar` | `<Snackbar open={open}>` |
| `v-data-table` | `DataGrid` | `<DataGrid rows={rows}>` |
| `v-chip` | `Chip` | `<Chip label="태그" />` |
| `v-icon` | `Icon` | `<HomeIcon />` |
| `v-row/v-col` | `Grid` | `<Grid container><Grid item>` |
| `v-container` | `Container` | `<Container>` |
| `v-app-bar` | `AppBar` | `<AppBar position="static">` |
| `v-navigation-drawer` | `Drawer` | `<Drawer open={open}>` |

---

## ⚠️ 흔한 실수와 해결 방법

### Vue3 → React 전환 시 흔한 실수들

```typescript
// ============================================
// 실수 1: Vuetify 스타일 props 사용
// ============================================

// ❌ 잘못된 코드 (Vuetify 스타일)
function WrongButton() {
  return <Button color="primary" large>클릭</Button>
}

// ✅ 올바른 코드 (Material-UI 스타일)
function CorrectButton() {
  return <Button variant="contained" color="primary" size="large">클릭</Button>
}

// ============================================
// 실수 2: v-model 패턴 사용 시도
// ============================================

// ❌ Vue3 스타일 (작동 안 함)
// <v-text-field v-model="name" />

// ✅ React + Material-UI 스타일
function TextInput() {
  const [name, setName] = useState('')
  
  return (
    <TextField
      value={name}
      onChange={(e) => setName(e.target.value)}
      label="이름"
      variant="outlined"
    />
  )
}

// ============================================
// 실수 3: v-for와 v-if 동시 사용 패턴
// ============================================

// Vue3 (Vuetify)
// <v-list-item v-for="item in items" v-if="item.visible" :key="item.id">

// React (Material-UI)
function ItemList() {
  const items = [/* ... */]
  
  return (
    <List>
      {items
        .filter(item => item.visible)  // 먼저 필터링
        .map(item => (
          <ListItem key={item.id}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))
      }
    </List>
  )
}

// ============================================
// 실수 4: 슬롯(slots) 사용
// ============================================

// Vue3 (Vuetify)
// <v-btn>
//   <template v-slot:prepend>
//     <v-icon>mdi-plus</v-icon>
//   </template>
//   추가
// </v-btn>

// React (Material-UI)
function IconButton() {
  return (
    <Button startIcon={<AddIcon />}>
      추가
    </Button>
  )
}

// ============================================
// 실수 5: 그리드 시스템 사용
// ============================================

// Vue3 (Vuetify)
// <v-row>
//   <v-col cols="12" md="6">컨텐츠</v-col>
// </v-row>

// React (Material-UI)
function GridLayout() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        컨텐츠
      </Grid>
    </Grid>
  )
}
```

---

## 🎯 실습 과제

### 📝 과제 1: 개발 환경 구축 (난이도: ⭐)

#### 과제 목표
Vite를 사용하여 React + TypeScript + Material-UI 프로젝트를 생성하고 기본 설정을 완료하세요.

#### 요구사항
1. ✅ Vite로 React + TypeScript 프로젝트 생성
2. ✅ Material-UI 설치 및 테마 설정
3. ✅ ESLint, Prettier 설정
4. ✅ VS Code 설정 완료
5. ✅ 경로 별칭(@) 설정
6. ✅ 개발 서버 실행 확인

#### 단계별 가이드

```bash
# Step 1: 프로젝트 생성
npm create vite@latest my-first-react -- --template react-ts
cd my-first-react

# Step 2: 의존성 설치
npm install

# Step 3: Material-UI 설치
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/lab

# Step 4: 개발 도구 설치
npm install -D eslint prettier eslint-config-prettier
npm install react-router-dom axios zustand
npm install -D @types/node

# Step 5: 테마 파일 생성 (src/theme/index.ts)
# Step 6: main.tsx에 ThemeProvider 추가
# Step 7: 실행
npm run dev
```

---

### 📝 과제 2: Material-UI TodoList 컴포넌트 (난이도: ⭐⭐)

#### Vue3 (Vuetify) TodoList를 React (Material-UI)로 변환

```typescript
// TodoList.tsx
import { useState, useMemo } from 'react'
import {
  Box,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Checkbox,
  Typography,
  Chip,
  Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  
  const completedCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos]
  )
  
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }])
      setNewTodo('')
    }
  }
  
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ))
  }
  
  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }
  
  return (
    <Paper sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        할 일 목록
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        label="할 일을 입력하세요"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        margin="normal"
      />
      
      <List>
        {todos.map(todo => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => removeTodo(todo.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
            </ListItemIcon>
            <ListItemText
              primary={todo.text}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.6 : 1,
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          완료: {completedCount} / {todos.length}
        </Typography>
        <Chip 
          label={`${Math.round((completedCount / (todos.length || 1)) * 100)}%`}
          color="primary"
          size="small"
        />
      </Box>
    </Paper>
  )
}

export default TodoList
```

---

### 📝 과제 3: 실무 프로젝트 구조 설계 (난이도: ⭐⭐⭐)

#### Material-UI를 사용한 프로젝트 구조

```
src/
├── assets/
│   ├── images/
│   └── styles/
├── components/
│   ├── common/
│   │   ├── Header.tsx         # AppBar 사용
│   │   ├── Footer.tsx
│   │   └── Loading.tsx        # CircularProgress 사용
│   ├── layout/
│   │   ├── MainLayout.tsx    # Container, Grid 사용
│   │   └── AuthLayout.tsx
│   └── ui/                    # Material-UI 커스텀 컴포넌트
│       ├── CustomButton.tsx
│       ├── CustomDialog.tsx
│       └── DataTable.tsx     # DataGrid 래핑
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useSnackbar.ts        # Material-UI Snackbar hook
│   └── useDialog.ts          # Dialog 상태 관리
├── pages/
│   ├── auth/
│   │   └── Login.tsx          # TextField, Button 사용
│   ├── dashboard/
│   │   └── Dashboard.tsx      # Grid, Card 사용
│   └── board/
│       └── BoardList.tsx      # DataGrid 사용
├── theme/                      # Material-UI 테마
│   ├── index.ts
│   ├── palette.ts
│   └── overrides.ts
├── App.tsx
└── main.tsx
```

#### Material-UI 테마 커스터마이징 예제

```typescript
// theme/index.ts
import { createTheme } from '@mui/material/styles'
import { koKR } from '@mui/material/locale'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Noto Sans KR, Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
}, koKR) // 한국어 지원

export default theme
```

---

## 📌 Chapter 1 요약

### 핵심 학습 내용
1. **개발 환경**: Vue3와 동일한 Vite 사용으로 친숙한 개발 경험
2. **UI 라이브러리**: Vuetify → Material-UI 전환
3. **프로젝트 구조**: composables → hooks, views → pages
4. **컴포넌트 작성**: template → JSX, v-btn → Button

### Vuetify → Material-UI 빠른 참조

| Vuetify | Material-UI | 주요 차이점 |
|---------|-------------|------------|
| `v-btn` | `Button` | variant prop 필수 |
| `v-text-field` | `TextField` | v-model → value + onChange |
| `v-card` | `Card` | CardContent, CardActions 분리 |
| `v-dialog` | `Dialog` | open prop으로 제어 |
| `v-row/v-col` | `Grid` | container/item 구분 |
| `v-icon` | `Icon` | 별도 import 필요 |

### 다음 장 예고
Chapter 2에서는 Vue3와 React의 핵심 차이점을 더 깊이 있게 다루며, 반응성 시스템과 컴포넌트 생명주기를 비교 학습합니다.

---

## 💬 Q&A 및 트러블슈팅

**Q1: Vuetify의 편리한 v-model을 React에서 어떻게 구현하나요?**
> Custom Hook을 만들어 사용할 수 있습니다:
```typescript
function useInput(initialValue: string) {
  const [value, setValue] = useState(initialValue)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  return { value, onChange }
}

// 사용
const nameInput = useInput('')
return <TextField {...nameInput} />
```

**Q2: Vuetify의 테마 시스템처럼 전역 테마를 관리하려면?**
> Material-UI의 ThemeProvider와 createTheme를 사용하면 Vuetify와 동일한 수준의 테마 관리가 가능합니다.

**Q3: v-data-table처럼 강력한 테이블 컴포넌트가 있나요?**
> MUI X의 DataGrid를 사용하면 됩니다. 무료 버전도 충분히 강력합니다.

이제 Chapter 1의 실습을 완료하고, 준비가 되면 Chapter 2로 진행하세요!
