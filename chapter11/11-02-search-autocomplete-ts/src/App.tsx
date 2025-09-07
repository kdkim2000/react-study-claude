import React from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Paper
} from '@mui/material'
import { Search } from '@mui/icons-material'
import SearchAutocomplete from './components/SearchAutocomplete'
import RecentSearches from './components/RecentSearches'

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
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          elevation: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
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
            <Search sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom>
            실시간 검색 자동완성
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            검색어를 입력하면 실시간으로 자동완성 결과를 확인할 수 있습니다
          </Typography>
        </Paper>

        {/* 검색 컴포넌트 */}
        <Box sx={{ mb: 4 }}>
          <SearchAutocomplete />
        </Box>

        {/* 최근 검색어 및 인기 검색어 */}
        <RecentSearches />

        {/* 푸터 정보 */}
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary">
            • 검색어는 자동으로 로컬 스토리지에 저장됩니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • 키보드 화살표 키로 검색 결과를 탐색할 수 있습니다
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default App