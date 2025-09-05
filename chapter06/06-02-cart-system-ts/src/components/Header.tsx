import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Fab,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { useCartHelpers } from '../store/cartStore';
import CartDrawer from './CartDrawer';

const Header: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { getTotalQuantity, formatPrice, isEmpty } = useCartHelpers();

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const totalQuantity = getTotalQuantity();

  return (
    <>
      {/* 상단 헤더 */}
      <AppBar position="sticky">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <StoreIcon sx={{ mr: 1, fontSize: 30 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Zustand 쇼핑몰
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                React 장바구니 시스템 실습
              </Typography>
            </Box>
          </Box>

          {/* 데스크톱 장바구니 버튼 */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <IconButton
              color="inherit"
              onClick={handleCartOpen}
              sx={{
                mr: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <Badge badgeContent={totalQuantity} color="error">
                <CartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 모바일 Floating Action Button */}
      {!isEmpty() && (
        <Fab
          color="primary"
          onClick={handleCartOpen}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            display: { xs: 'flex', sm: 'none' },
          }}
        >
          <Badge badgeContent={totalQuantity} color="error">
            <CartIcon />
          </Badge>
        </Fab>
      )}

      {/* 장바구니 Drawer */}
      <CartDrawer open={cartOpen} onClose={handleCartClose} />
    </>
  );
};

export default Header;