import { useState } from 'react';
import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { theme } from './theme';
import { useSnackbar } from './hooks/useSnackbar';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import Dashboard from './pages/dashboard/Dashboard';
import BoardList from './pages/board/BoardList';
import Login from './pages/auth/Login';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { snackbar, hideSnackbar } = useSnackbar();

  const handlePageChange = (page: string) => {
    if (page === 'login') {
      setIsAuthenticated(false);
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'board':
        return <BoardList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {!isAuthenticated ? (
        <AuthLayout>
          <Login onLoginSuccess={handleLoginSuccess} />
        </AuthLayout>
      ) : (
        <MainLayout 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
        >
          {renderPage()}
        </MainLayout>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;