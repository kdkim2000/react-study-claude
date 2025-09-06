import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import OrderForm from './components/OrderForm';

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
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
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
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 페이지 제목 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            🛒 다단계 주문 폼
          </Typography>
          <Typography variant="body1" color="text.secondary">
            상품 선택부터 결제까지 3단계로 구성된 주문 시스템
          </Typography>
        </Box>

        {/* 주문 폼 */}
        <OrderForm />

        {/* 안내 정보 */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            💡 기능 안내
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>1단계</strong>: 상품 선택, 옵션 설정, 수량 조절<br />
            • <strong>2단계</strong>: 배송/픽업 선택, 주소 입력, 연락처 등록<br />
            • <strong>3단계</strong>: 결제 수단 선택, 쿠폰 적용, 최종 확인<br />
            • <strong>쿠폰 코드</strong>: WELCOME10, SUMMER20, VIP30
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;