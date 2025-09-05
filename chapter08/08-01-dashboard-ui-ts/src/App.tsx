import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Toolbar,
  Fade,
  CssBaseline,
} from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ChartSection from './components/ChartSection';
import { statsData, menuItems, userInfo } from './data/mockData';

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleMenuSelect = (itemId: string) => {
    setSelectedMenuItem(itemId);
    // 모바일에서 메뉴 선택 시 사이드바 닫기
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* 헤더 */}
      <Header onMenuClick={handleDrawerToggle} userInfo={userInfo} />
      
      {/* 사이드바 */}
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        menuItems={menuItems}
        selectedItem={selectedMenuItem}
        onMenuSelect={handleMenuSelect}
      />

      {/* 메인 컨텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {/* AppBar 높이만큼 spacer */}
        <Toolbar />

        <Fade in timeout={800}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* 통계 카드 그리드 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statsData.map((stat) => (
                <Grid item xs={12} sm={6} md={3} key={stat.id}>
                  <StatCard data={stat} />
                </Grid>
              ))}
            </Grid>

            {/* 차트 섹션 */}
            <ChartSection />
          </Container>
        </Fade>
      </Box>
    </Box>
  );
};

export default App;