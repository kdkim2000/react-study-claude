import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useCartStore, useCartHelpers } from '../store/cartStore';

const CartStats: React.FC = () => {
  const { items } = useCartStore();
  const { 
    getTotalPrice, 
    getTotalQuantity, 
    getTotalItemTypes, 
    isEmpty, 
    formatPrice 
  } = useCartHelpers();

  if (isEmpty()) {
    return null; // 장바구니가 비어있으면 통계 숨김
  }

  const stats = [
    {
      icon: <InventoryIcon color="primary" sx={{ fontSize: 40 }} />,
      label: '상품 종류',
      value: `${getTotalItemTypes()}종`,
      color: 'primary' as const,
    },
    {
      icon: <CartIcon color="success" sx={{ fontSize: 40 }} />,
      label: '총 수량',
      value: `${getTotalQuantity()}개`,
      color: 'success' as const,
    },
    {
      icon: <MoneyIcon color="error" sx={{ fontSize: 40 }} />,
      label: '총 금액',
      value: formatPrice(getTotalPrice()),
      color: 'error' as const,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: 3,
          fontWeight: 'bold',
        }}
      >
        🛍️ 장바구니 현황
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Box sx={{ mb: 2 }}>
                {stat.icon}
              </Box>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 1,
                  color: `${stat.color}.main`,
                }}
              >
                {stat.value}
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: '1.1rem' }}
              >
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 장바구니 아이템 목록 (간단한 칩 형태) */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3, 
          mt: 3, 
          backgroundColor: 'grey.50',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          장바구니 상품 목록:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {items.map((item) => (
            <Chip
              key={item.id}
              label={`${item.image} ${item.name} (${item.quantity}개)`}
              color="primary"
              variant="outlined"
              size="medium"
              sx={{
                height: 'auto',
                '& .MuiChip-label': {
                  display: 'block',
                  whiteSpace: 'normal',
                  py: 1,
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default CartStats;