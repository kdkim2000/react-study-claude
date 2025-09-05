import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import ThemePanel from './components/ThemePanel';
import PreviewContent from './components/PreviewContent';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 앱 제목 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" color="primary" gutterBottom>
            🎨 테마 관리 시스템
          </Typography>
          <Typography variant="body1" color="text.secondary">
            라이트/다크 모드, 색상, 폰트 크기를 자유롭게 커스터마이징하세요
          </Typography>
        </Box>

        {/* 메인 콘텐츠 */}
        <Grid container spacing={4}>
          {/* 테마 설정 패널 */}
          <Grid item xs={12} md={4}>
            <ThemePanel />
          </Grid>

          {/* 미리보기 영역 */}
          <Grid item xs={12} md={8}>
            <PreviewContent />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;