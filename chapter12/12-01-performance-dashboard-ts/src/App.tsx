import React from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Paper,
  Alert
} from '@mui/material'
import { Speed as SpeedIcon } from '@mui/icons-material'
import PerformanceDashboard from './components/PerformanceDashboard'
import TestComponent from './components/TestComponent'

const theme = createTheme({
  palette: {
    mode: 'light',
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
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 성능 대시보드 위젯 */}
      <PerformanceDashboard
        showInProduction={true}
        position="bottom-right"
        collapsible={true}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 헤더 */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <SpeedIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Performance Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            실시간 Web Vitals 및 애플리케이션 성능 모니터링
          </Typography>
        </Paper>

        {/* 설명 */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            우측 하단의 Performance 위젯을 클릭하여 확장하고, 아래 테스트 기능들을 사용하여 성능 변화를 확인해보세요.
            차트 보기를 활성화하면 시간별 성능 추이를 관찰할 수 있습니다.
          </Typography>
        </Alert>

        {/* 테스트 컴포넌트 */}
        <TestComponent />

        {/* 설명서 */}
        <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            측정되는 성능 지표
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Web Vitals
              </Typography>
              <Typography variant="body2" paragraph>
                • <strong>CLS</strong>: 누적 레이아웃 이동 (좋음: ≤0.1)
              </Typography>
              <Typography variant="body2" paragraph>
                • <strong>FID</strong>: 최초 입력 지연 (좋음: ≤100ms)
              </Typography>
              <Typography variant="body2" paragraph>
                • <strong>LCP</strong>: 최대 콘텐츠 렌더링 시간 (좋음: ≤2.5s)
              </Typography>
              <Typography variant="body2" paragraph>
                • <strong>FCP</strong>: 최초 콘텐츠 렌더링 시간 (좋음: ≤1.8s)
              </Typography>
              <Typography variant="body2">
                • <strong>TTFB</strong>: 첫 바이트까지의 시간 (좋음: ≤800ms)
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Runtime Performance
              </Typography>
              <Typography variant="body2" paragraph>
                • <strong>FPS</strong>: 초당 프레임 수 (좋음: ≥50fps)
              </Typography>
              <Typography variant="body2" paragraph>
                • <strong>Memory</strong>: 메모리 사용량 (좋음: ≤50MB)
              </Typography>
              <Typography variant="body2">
                • <strong>Renders</strong>: 컴포넌트 렌더링 횟수
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default App