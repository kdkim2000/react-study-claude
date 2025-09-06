import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import SignupForm from './components/SignupForm';

// Material-UI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        {/* 페이지 제목 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            📝 React Hook Form
          </Typography>
          <Typography variant="body1" color="text.secondary">
            실시간 검증 기능이 있는 회원가입 폼 구현
          </Typography>
        </Box>

        {/* 회원가입 폼 */}
        <SignupForm />

        {/* 테스트 안내 */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 테스트 안내
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • 중복 이메일: test@example.com, user@test.com, admin@site.com<br />
            • 비밀번호: 영문, 숫자, 특수문자 포함 8자 이상<br />
            • 전화번호: 010-1234-5678 형식<br />
            • 나이: 만 14세 이상만 가입 가능
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;