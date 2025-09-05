import React from 'react';
import { Container, Box, Fab } from '@mui/material';
import { Translate as TranslateIcon } from '@mui/icons-material';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [showLanguageSwitcher, setShowLanguageSwitcher] = React.useState(false);

  return (
    <LanguageProvider>
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', position: 'relative' }}>
        {/* 언어 전환 버튼 (Floating Action Button) */}
        <Fab
          color="primary"
          aria-label="change language"
          onClick={() => setShowLanguageSwitcher(!showLanguageSwitcher)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <TranslateIcon />
        </Fab>

        {/* 언어 전환기 (조건부 렌더링) */}
        {showLanguageSwitcher && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 16,
              zIndex: 999,
              minWidth: 280,
            }}
          >
            <LanguageSwitcher />
          </Box>
        )}

        {/* 메인 컨텐츠 */}
        <Box>
          {/* 헤더 컴포넌트 */}
          <Header />

          {/* 항상 보이는 언어 전환기 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <LanguageSwitcher />
          </Box>

          {/* 메인 컨텐츠 컴포넌트 */}
          <MainContent />

          {/* 푸터 컴포넌트 */}
          <Footer />
        </Box>
      </Container>
    </LanguageProvider>
  );
};

export default App;