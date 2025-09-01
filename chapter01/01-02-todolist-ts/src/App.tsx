import React from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  GlobalStyles
} from '@mui/material';
import TodoList from './components/TodoList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: '#c1c1c1 #f1f1f1',
      },
      '*::-webkit-scrollbar': {
        width: '6px',
      },
      '*::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '*::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '3px',
      },
    }}
  />
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <Container maxWidth="lg" sx={{ minHeight: '100vh', py: 2 }}>
        <TodoList />
      </Container>
    </ThemeProvider>
  );
}

export default App;