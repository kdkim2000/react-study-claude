# Chapter 8: UI 라이브러리

## 📚 학습 목표
- Vuetify에서 Material-UI로 전환하는 방법 이해
- Material-UI 컴포넌트 시스템 마스터
- Ant Design 기본 사용법 학습
- 테마 커스터마이징으로 일관된 디자인 시스템 구축

---

## 1. Material-UI (MUI) - Vuetify 대체

### 이론 설명 (30%)

Material-UI(MUI)는 React를 위한 Material Design 구현체로, Vuetify와 매우 유사한 컴포넌트와 기능을 제공합니다. 두 라이브러리 모두 Google의 Material Design 가이드라인을 따르므로 전환이 비교적 쉽습니다.

#### Vuetify vs Material-UI 비교

| 특징 | Vuetify | Material-UI |
|------|---------|-------------|
| 설치 | `vuetify` | `@mui/material @emotion/react @emotion/styled` |
| 컴포넌트 접두사 | `v-` (v-btn, v-card) | 없음 (Button, Card) |
| 테마 설정 | `createVuetify()` | `createTheme()` + `ThemeProvider` |
| 그리드 시스템 | `v-row`, `v-col` | `Grid` |
| 아이콘 | `mdi-*` | `@mui/icons-material` |
| 스타일 props | `color`, `variant` | `color`, `variant` |
| 커스텀 스타일 | `class`, `style` | `sx` prop |

### 실습 코드 (70%)

#### 1.1 Material-UI 설치 및 기본 설정

```bash
# Material-UI 설치
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/lab  # 실험적 컴포넌트
npm install @mui/x-date-pickers  # 날짜 선택기
```

```tsx
// main.tsx - Material-UI 초기 설정
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'

// Vuetify의 createVuetify()와 유사
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Vuetify의 v-app과 유사한 역할 */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 브라우저 기본 스타일 초기화 */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
```

```vue
<!-- Vue3/Vuetify 비교: main.ts -->
<script>
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'

const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1976d2',
          secondary: '#dc004e',
        }
      }
    }
  }
})

createApp(App).use(vuetify).mount('#app')
</script>
```

#### 1.2 주요 컴포넌트 매핑

```tsx
// React/Material-UI: 컴포넌트 비교 예제
import React, { useState } from 'react'
import {
  // Layout
  Container,
  Box,
  Grid,
  Stack,
  
  // Navigation
  AppBar,
  Toolbar,
  Drawer,
  BottomNavigation,
  BottomNavigationAction,
  
  // Inputs
  TextField,
  Button,
  IconButton,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Slider,
  
  // Data Display
  Typography,
  Avatar,
  Badge,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  
  // Feedback
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  LinearProgress,
  Skeleton,
  
  // Surfaces
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  
  // Utils
  ClickAwayListener,
  Grow,
  Modal,
  Popover,
  Popper,
  Portal,
  
  // Icons
  InputAdornment,
  FormControl,
  InputLabel,
  FormHelperText,
  
  // Advanced
  Autocomplete,
  Rating,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stepper,
  Step,
  StepLabel,
  
  Tabs,
  Tab,
  
  Tooltip,
  Zoom,
  Fade,
  Collapse,
  
} from '@mui/material'

// Icons
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'

// Vuetify → Material-UI 컴포넌트 매핑 예제
function ComponentComparison() {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState('')
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Vuetify → Material-UI 컴포넌트 매핑
      </Typography>
      
      {/* 1. 버튼 컴포넌트 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          버튼 (v-btn → Button)
        </Typography>
        
        {/* Vuetify: <v-btn color="primary" variant="elevated">버튼</v-btn> */}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary">
            Contained (elevated)
          </Button>
          <Button variant="outlined" color="secondary">
            Outlined
          </Button>
          <Button variant="text">
            Text
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            size="large"
          >
            아이콘 버튼
          </Button>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
        </Stack>
      </Paper>
      
      {/* 2. 입력 필드 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          입력 필드 (v-text-field → TextField)
        </Typography>
        
        {/* Vuetify: <v-text-field v-model="value" label="라벨" /> */}
        <Stack spacing={2}>
          <TextField
            label="기본 입력"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
          />
          <TextField
            label="아웃라인"
            variant="outlined"
            helperText="도움말 텍스트"
            fullWidth
          />
          <TextField
            label="에러 상태"
            error
            helperText="에러 메시지"
            fullWidth
          />
          <TextField
            label="비밀번호"
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Stack>
      </Paper>
      
      {/* 3. 카드 컴포넌트 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          카드 (v-card → Card)
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* Vuetify:
            <v-card>
              <v-card-title>제목</v-card-title>
              <v-card-text>내용</v-card-text>
              <v-card-actions>
                <v-btn>액션</v-btn>
              </v-card-actions>
            </v-card>
            */}
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/api/placeholder/400/140"
                alt="이미지"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  카드 제목
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  카드 내용이 여기에 표시됩니다.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">더보기</Button>
                <Button size="small">공유</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 4. 그리드 시스템 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          그리드 (v-row/v-col → Grid)
        </Typography>
        
        {/* Vuetify:
        <v-row>
          <v-col cols="12" md="6">컬럼1</v-col>
          <v-col cols="12" md="6">컬럼2</v-col>
        </v-row>
        */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
              xs=12 md=6
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'white' }}>
              xs=12 md=6
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'white' }}>
              xs=12 sm=6 md=4
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'white' }}>
              xs=12 sm=6 md=4
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
              xs=12 sm=12 md=4
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 5. 대화상자 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          대화상자 (v-dialog → Dialog)
        </Typography>
        
        <Button variant="contained" onClick={() => setOpen(true)}>
          대화상자 열기
        </Button>
        
        {/* Vuetify:
        <v-dialog v-model="open">
          <v-card>
            <v-card-title>제목</v-card-title>
            <v-card-text>내용</v-card-text>
            <v-card-actions>
              <v-btn @click="open = false">닫기</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>대화상자 제목</DialogTitle>
          <DialogContent>
            <Typography>
              대화상자 내용이 여기에 표시됩니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={() => setOpen(false)} variant="contained">
              확인
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      
      {/* 6. 데이터 테이블 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          테이블 (v-data-table → Table)
        </Typography>
        
        {/* Vuetify:
        <v-data-table
          :headers="headers"
          :items="items"
        />
        */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>역할</TableCell>
                <TableCell>액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { id: 1, name: '홍길동', email: 'hong@example.com', role: 'Admin' },
                { id: 2, name: '김철수', email: 'kim@example.com', role: 'User' },
              ].map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.role}
                      color={row.role === 'Admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* 7. 탭 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          탭 (v-tabs → Tabs)
        </Typography>
        
        {/* Vuetify:
        <v-tabs v-model="tab">
          <v-tab>탭1</v-tab>
          <v-tab>탭2</v-tab>
        </v-tabs>
        */}
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="탭 1" />
          <Tab label="탭 2" />
          <Tab label="탭 3" />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {tabValue === 0 && <Typography>탭 1 내용</Typography>}
          {tabValue === 1 && <Typography>탭 2 내용</Typography>}
          {tabValue === 2 && <Typography>탭 3 내용</Typography>}
        </Box>
      </Paper>
    </Container>
  )
}

export default ComponentComparison
```

#### 1.3 Material-UI의 sx prop 활용

```tsx
// React: sx prop을 활용한 스타일링
import { Box, Button, Typography } from '@mui/material'

function SxPropExample() {
  return (
    <Box>
      {/* sx prop은 Vuetify의 class + style을 합친 것과 유사 */}
      
      {/* 1. 기본 스타일링 */}
      <Box
        sx={{
          bgcolor: 'primary.main',  // theme 색상 사용
          color: 'white',
          p: 2,  // padding: theme.spacing(2)
          m: 1,  // margin: theme.spacing(1)
          borderRadius: 1,  // theme.shape.borderRadius
        }}
      >
        기본 박스
      </Box>
      
      {/* 2. 반응형 스타일 */}
      <Box
        sx={{
          width: {
            xs: '100%',  // 모바일
            sm: '50%',   // 태블릿
            md: '33%',   // 데스크톱
          },
          display: { xs: 'none', md: 'block' },  // 모바일에서 숨김
        }}
      >
        반응형 박스
      </Box>
      
      {/* 3. 가상 선택자 */}
      <Button
        sx={{
          '&:hover': {
            bgcolor: 'primary.dark',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          '& .MuiButton-startIcon': {
            color: 'secondary.main',
          },
        }}
      >
        호버 효과 버튼
      </Button>
      
      {/* 4. 조건부 스타일 */}
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
          ...theme.typography.body2,
          p: theme.spacing(2),
        })}
      >
        테마 기반 스타일
      </Box>
      
      {/* 5. 배열 구문 (여러 스타일 병합) */}
      <Box
        sx={[
          { p: 2, bgcolor: 'background.paper' },
          { border: 1, borderColor: 'divider' },
          (theme) => ({
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
          }),
        ]}
      >
        배열 스타일
      </Box>
    </Box>
  )
}
```

---

## 2. Ant Design 소개

### 이론 설명

Ant Design은 또 다른 인기 있는 React UI 라이브러리로, 기업용 애플리케이션에 특화되어 있습니다.

### 실습 코드

#### 2.1 Ant Design 기본 사용법

```bash
# Ant Design 설치
npm install antd
```

```tsx
// React: Ant Design 기본 예제
import React, { useState } from 'react'
import {
  Button,
  Input,
  Select,
  DatePicker,
  Table,
  Card,
  Form,
  message,
  notification,
  Modal,
  Drawer,
  Steps,
  Upload,
  Switch,
  Rate,
  Tag,
  Badge,
  Avatar,
  Dropdown,
  Menu,
  Space,
  Row,
  Col,
  Typography,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import 'antd/dist/reset.css'

const { Title, Text } = Typography
const { Option } = Select

function AntDesignExample() {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  
  // 테이블 데이터
  const columns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '나이',
      dataIndex: 'age',
      key: 'age',
      sorter: (a: any, b: any) => a.age - b.age,
    },
    {
      title: '주소',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '액션',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
            수정
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            삭제
          </Button>
        </Space>
      ),
    },
  ]
  
  const data = [
    {
      key: '1',
      name: '홍길동',
      age: 32,
      address: '서울시 강남구',
    },
    {
      key: '2',
      name: '김철수',
      age: 42,
      address: '부산시 해운대구',
    },
  ]
  
  // 폼 제출
  const onFinish = (values: any) => {
    console.log('Form values:', values)
    message.success('폼이 성공적으로 제출되었습니다!')
  }
  
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Ant Design 컴포넌트 예제</Title>
      
      {/* 1. 폼 */}
      <Card title="폼 예제" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="사용자명"
                name="username"
                rules={[{ required: true, message: '사용자명을 입력하세요' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="사용자명" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="비밀번호"
                name="password"
                rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="카테고리"
            name="category"
          >
            <Select placeholder="카테고리 선택">
              <Option value="cat1">카테고리 1</Option>
              <Option value="cat2">카테고리 2</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="날짜"
            name="date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              제출
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      {/* 2. 테이블 */}
      <Card title="테이블 예제" style={{ marginBottom: 16 }}>
        <Table columns={columns} dataSource={data} />
      </Card>
      
      {/* 3. 기타 컴포넌트 */}
      <Card title="기타 컴포넌트">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="link">Link</Button>
            <Button danger>Danger</Button>
          </Space>
          
          <Space>
            <Tag color="magenta">Tag 1</Tag>
            <Tag color="red">Tag 2</Tag>
            <Tag color="volcano">Tag 3</Tag>
          </Space>
          
          <Space>
            <Badge count={5}>
              <Avatar shape="square" icon={<UserOutlined />} />
            </Badge>
            <Rate defaultValue={3} />
            <Switch defaultChecked />
          </Space>
        </Space>
      </Card>
    </div>
  )
}

// Material-UI vs Ant Design 비교
function UILibraryComparison() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Material-UI vs Ant Design
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Material-UI 장점</Typography>
            <ul>
              <li>Material Design 가이드라인 준수</li>
              <li>Vuetify와 유사한 컴포넌트 구조</li>
              <li>sx prop으로 유연한 스타일링</li>
              <li>TypeScript 지원 우수</li>
              <li>커스터마이징 용이</li>
            </ul>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Ant Design 장점</Typography>
            <ul>
              <li>기업용 애플리케이션에 최적화</li>
              <li>폼 처리 기능 강력</li>
              <li>데이터 테이블 기능 풍부</li>
              <li>다양한 비즈니스 컴포넌트</li>
              <li>중국 시장에서 인기</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
```

---

## 3. 테마 커스터마이징

### 이론 설명

Material-UI의 테마 시스템은 Vuetify와 매우 유사하며, 일관된 디자인 시스템을 구축할 수 있습니다.

### 실습 코드

#### 3.1 Material-UI 테마 커스터마이징

```tsx
// theme/index.ts - 커스텀 테마 생성
import { createTheme, ThemeOptions } from '@mui/material/styles'
import { koKR } from '@mui/material/locale'

// 테마 타입 확장
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string
      warning: string
    }
  }
  interface ThemeOptions {
    status?: {
      danger?: string
      warning?: string
    }
  }
  
  // 커스텀 색상 추가
  interface Palette {
    neutral: Palette['primary']
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
  }
}

// 테마 설정 (Vuetify의 theme 설정과 유사)
const themeOptions: ThemeOptions = {
  // 1. 색상 팔레트
  palette: {
    mode: 'light',  // 'dark' for dark mode
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#e33371',
      dark: '#9a0036',
      contrastText: '#fff',
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
    // 커스텀 색상
    neutral: {
      main: '#64748B',
      light: '#94A3B8',
      dark: '#475569',
      contrastText: '#fff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  
  // 2. 타이포그래피
  typography: {
    fontFamily: [
      'Pretendard',
      'Noto Sans KR',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',  // 대문자 변환 비활성화
      fontWeight: 600,
    },
  },
  
  // 3. 모양
  shape: {
    borderRadius: 8,  // 기본 border-radius
  },
  
  // 4. 간격
  spacing: 8,  // 기본 spacing 단위 (8px)
  
  // 5. 컴포넌트별 커스터마이징
  components: {
    // Button 커스터마이징
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    
    // TextField 커스터마이징
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        },
      },
    },
    
    // Card 커스터마이징
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    
    // Chip 커스터마이징
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
  
  // 6. 커스텀 속성
  status: {
    danger: '#e53e3e',
    warning: '#dd6b20',
  },
}

// 라이트 테마
export const lightTheme = createTheme(themeOptions, koKR)

// 다크 테마
export const darkTheme = createTheme({
  ...themeOptions,
  palette: {
    ...themeOptions.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
}, koKR)
```

#### 3.2 테마 적용 및 사용

```tsx
// App.tsx - 테마 적용 예제
import React, { useState, createContext, useContext } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from '@mui/icons-material'
import { lightTheme, darkTheme } from './theme'

// 테마 컨텍스트
interface ThemeContextType {
  toggleTheme: () => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  isDarkMode: false,
})

export const useTheme = () => useContext(ThemeContext)

// 테마 프로바이더 컴포넌트
function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }
  
  const theme = isDarkMode ? darkTheme : lightTheme
  
  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

// 테마 사용 예제 컴포넌트
function ThemedComponent() {
  const { toggleTheme, isDarkMode } = useTheme()
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 테마 토글 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              icon={<LightIcon />}
              checkedIcon={<DarkIcon />}
            />
          }
          label={isDarkMode ? '다크 모드' : '라이트 모드'}
        />
      </Box>
      
      {/* 색상 팔레트 표시 */}
      <Typography variant="h4" gutterBottom>
        테마 커스터마이징 예제
      </Typography>
      
      <Grid container spacing={3}>
        {/* Primary 색상 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Primary 색상
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.light',
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'primary.dark',
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                Primary Button
              </Button>
              <Button variant="outlined" color="primary">
                Outlined
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Secondary 색상 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Secondary 색상
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'secondary.light',
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'secondary.main',
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'secondary.dark',
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Button variant="contained" color="secondary" sx={{ mr: 1 }}>
                Secondary Button
              </Button>
              <Button variant="outlined" color="secondary">
                Outlined
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 커스텀 색상 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                커스텀 Neutral 색상
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'neutral.light',
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'neutral.main',
                    borderRadius: 1,
                  }}
                />
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'neutral.dark',
                    borderRadius: 1,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 타이포그래피 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                타이포그래피
              </Typography>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="body1">
                Body 1 - 본문 텍스트입니다.
              </Typography>
              <Typography variant="body2">
                Body 2 - 작은 본문 텍스트입니다.
              </Typography>
              <Typography variant="button">Button Text</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 기타 컴포넌트 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                커스터마이징된 컴포넌트
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip label="Default Chip" />
                <Chip label="Primary Chip" color="primary" />
                <Chip label="Secondary Chip" color="secondary" />
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

// 메인 앱
function ThemedApp() {
  return (
    <CustomThemeProvider>
      <ThemedComponent />
    </CustomThemeProvider>
  )
}

export default ThemedApp
```

---

## ⚠️ 흔한 실수와 해결 방법

### 1. Import 문제

```tsx
// ❌ 잘못된 import - 전체 라이브러리 import
import * as MUI from '@mui/material'

// ✅ 올바른 import - 필요한 컴포넌트만
import { Button, TextField, Box } from '@mui/material'

// ❌ 아이콘 전체 import
import * as Icons from '@mui/icons-material'

// ✅ 개별 아이콘 import
import HomeIcon from '@mui/icons-material/Home'
// 또는
import { Home, Person } from '@mui/icons-material'
```

### 2. sx prop 오타

```tsx
// ❌ CSS 속성명 사용
<Box sx={{ 'margin-top': 2, 'background-color': 'red' }} />

// ✅ camelCase 또는 약어 사용
<Box sx={{ mt: 2, bgcolor: 'red' }} />
<Box sx={{ marginTop: 2, backgroundColor: 'red' }} />
```

### 3. 테마 접근 방법

```tsx
// ❌ 하드코딩된 색상
<Box sx={{ bgcolor: '#1976d2' }} />

// ✅ 테마 색상 사용
<Box sx={{ bgcolor: 'primary.main' }} />
<Box sx={(theme) => ({ bgcolor: theme.palette.primary.main })} />
```

### 4. Grid 사용 실수

```tsx
// ❌ Grid item에 container 속성
<Grid item container>

// ✅ 별도의 Grid로 중첩
<Grid item>
  <Grid container>
    {/* ... */}
  </Grid>
</Grid>

// ❌ 잘못된 breakpoint
<Grid item xs={12} sm={6} md={4} lg={3} xl={2} />

// ✅ 올바른 breakpoint 사용
<Grid item xs={12} sm={6} md={4} lg={3} />
```

---

## 🎯 실습 과제

### 📝 과제 1: 대시보드 UI 구성 (난이도: ⭐)

#### 요구사항
- Material-UI를 사용한 대시보드 레이아웃
- AppBar, Drawer, Grid 시스템 활용
- 최소 3개의 통계 카드
- 차트 영역 (Skeleton으로 대체 가능)
- 반응형 디자인

#### 구현할 컴포넌트
- 상단 AppBar (로고, 사용자 정보)
- 좌측 Drawer (메뉴)
- 메인 영역 (Grid로 카드 배치)
- 통계 카드 컴포넌트

---

### 📝 과제 2: 커스텀 테마 관리 시스템 (난이도: ⭐⭐)

#### 요구사항
- 라이트/다크 모드 전환
- Primary, Secondary 색상 커스터마이징
- 폰트 크기 조절 (작게/보통/크게)
- 테마 설정 localStorage 저장
- 실시간 테마 미리보기

#### 구현할 기능
- 테마 설정 패널
- 색상 선택기
- 폰트 크기 슬라이더
- 테마 리셋 버튼
- 테마 export/import

---

## 📌 Chapter 8 요약

### UI 라이브러리 선택 가이드

| 상황 | 추천 라이브러리 | 이유 |
|------|----------------|------|
| Vuetify에서 전환 | Material-UI | 동일한 Material Design |
| 기업용 애플리케이션 | Ant Design | 풍부한 비즈니스 컴포넌트 |
| 커스터마이징 중요 | Material-UI | sx prop, 테마 시스템 |
| 빠른 개발 | Ant Design | 기본 스타일 우수 |

### Vuetify → Material-UI 전환 체크리스트

- [ ] `v-` 접두사 제거
- [ ] `v-model` → `value` + `onChange`
- [ ] `v-row/v-col` → `Grid`
- [ ] `:color` → `color` prop
- [ ] `@click` → `onClick`
- [ ] `class` → `sx` prop
- [ ] `v-if` → 조건부 렌더링
- [ ] `v-for` → `map()`

### 핵심 포인트
1. **sx prop**: 강력한 스타일링 도구
2. **테마**: 일관된 디자인 시스템
3. **타입 지원**: TypeScript 완벽 지원
4. **반응형**: breakpoint 시스템 활용

### 다음 장 예고
Chapter 9에서는 폼 처리와 검증을 학습합니다.

---

## 💬 Q&A

**Q1: Vuetify의 v-model처럼 간편한 방법이 있나요?**
> Material-UI는 controlled component 패턴을 사용합니다. Custom Hook으로 간소화할 수 있습니다:
```tsx
const [value, setValue] = useState('')
const handleChange = (e) => setValue(e.target.value)
// 또는 Custom Hook 사용
```

**Q2: Vuetify의 그리드 시스템과 차이점은?**
> Material-UI의 Grid는 12 컬럼 시스템은 동일하지만, `container`와 `item` prop을 명시해야 합니다.

**Q3: 어떤 UI 라이브러리를 선택해야 하나요?**
> Vuetify 사용 경험이 있다면 Material-UI를, 관리자 페이지나 대시보드는 Ant Design을 추천합니다.

이제 React UI 라이브러리를 마스터했습니다! 🎉
