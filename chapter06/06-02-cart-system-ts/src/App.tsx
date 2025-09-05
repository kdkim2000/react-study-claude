import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartStats from './components/CartStats';

const App: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* 헤더 */}
      <Header />
      
      {/* 메인 컨텐츠 */}
      <Box component="main">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* 장바구니 통계 */}
          <CartStats />
          
          {/* 상품 목록 */}
          <ProductList />
        </Container>
      </Box>
    </Box>
  );
};

export default App;