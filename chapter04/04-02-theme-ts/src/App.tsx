import { useState } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Box, Fab } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import { createMuiTheme } from './theme/muiTheme';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// App 내부 컴포넌트 (테마를 사용하기 위해 분리)
const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode } = useTheme(); // Context에서 테마 모드 가져오기

  // Material-UI 테마 생성
  const muiTheme = createMuiTheme(mode);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* Material-UI 기본 스타일 리셋 */}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* 헤더 */}
        <Header />

        {/* 메인 콘텐츠 */}
        <Box component="main" sx={{ flex: 1 }}>
          <MainContent />
        </Box>

        {/* 푸터 */}
        <Footer />

        {/* 사이드바 */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 플로팅 메뉴 버튼 */}
        <Fab
          color="primary"
          aria-label="menu"
          onClick={handleSidebarToggle}
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1200,
          }}
        >
          <MenuIcon />
        </Fab>
      </Box>
    </MuiThemeProvider>
  );
};

// 메인 App 컴포넌트
const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;