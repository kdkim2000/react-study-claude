import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationHeader } from './components/NotificationHeader';
import { NotificationList } from './components/NotificationList';
import { NotificationSettings } from './components/NotificationSettings';
import { CommentForm } from './components/CommentForm';

// Material-UI 테마 설정
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans KR',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* 페이지 제목 */}
          <Box mb={4} textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom>
              실시간 알림 시스템
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              WebSocket을 활용한 실시간 알림 관리
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* 왼쪽: 알림 목록 */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ height: 'fit-content', minHeight: 600 }}>
                <NotificationHeader />
                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                  <NotificationList />
                </Box>
              </Paper>
            </Grid>

            {/* 오른쪽: 설정 및 테스트 */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" gap={3}>
                {/* 알림 설정 */}
                <NotificationSettings />
                
                {/* 댓글 작성 폼 (테스트용) */}
                <CommentForm />
              </Box>
            </Grid>
          </Grid>

          {/* 푸터 */}
          <Box mt={6} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              React + TypeScript + Material-UI + WebSocket
            </Typography>
          </Box>
        </Container>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;