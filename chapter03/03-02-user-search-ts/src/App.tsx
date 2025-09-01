import React from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import UserList from './components/UserList';
import { mockUsers } from './data/mockUsers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
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
    h6: {
      fontWeight: 500,
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
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 앱바 */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <SearchIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            사용자 검색 시스템
          </Typography>
          <Typography variant="body2">
            총 {mockUsers.length}명의 사용자
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            사용자 관리 대시보드
          </Typography>
          <Typography variant="body1" color="text.secondary">
            이름, 이메일로 검색하고 역할별로 필터링하여 사용자를 관리하세요.
          </Typography>
        </Box>

        <UserList users={mockUsers} />
      </Container>
    </ThemeProvider>
  );
}

export default App;