import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container
} from '@mui/material';
import RealtimeSearch from './components/RealtimeSearch';

// 간단한 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <RealtimeSearch />
      </Container>
    </ThemeProvider>
  );
}

export default App;