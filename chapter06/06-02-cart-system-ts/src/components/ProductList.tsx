import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import { Store as StoreIcon } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { sampleProducts, getProductsByCategory, getCategories } from '../data/products';

const ProductList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const categories = getCategories();

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const filteredProducts = selectedCategory === '전체' 
    ? sampleProducts 
    : getProductsByCategory(selectedCategory);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <StoreIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold' }}>
            상품 목록
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          원하는 상품을 선택하여 장바구니에 담아보세요
        </Typography>
      </Box>

      {/* 카테고리 탭 */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category}
              value={category}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: selectedCategory === category ? 'bold' : 'normal',
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* 상품 그리드 */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* 상품이 없을 때 메시지 */}
      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            선택한 카테고리에 상품이 없습니다.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductList;