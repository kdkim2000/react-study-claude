import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';

interface MainLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const MainLayout = ({ children, currentPage, onPageChange }: MainLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentPage={currentPage} onPageChange={onPageChange} />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          py: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </Container>
      
      <Footer />
    </Box>
  );
};

export default MainLayout;