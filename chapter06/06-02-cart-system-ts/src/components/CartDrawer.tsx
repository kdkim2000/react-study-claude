import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCartStore, useCartHelpers } from '../store/cartStore';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { getTotalPrice, getTotalQuantity, isEmpty, formatPrice } = useCartHelpers();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    // 실제 결제 로직은 여기서 구현
    alert('결제 페이지로 이동합니다! (데모용)');
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          p: 0,
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 헤더 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'primary.main',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CartIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              장바구니
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 장바구니 내용 */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {isEmpty() ? (
            // 빈 장바구니
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 4,
                textAlign: 'center',
              }}
            >
              <CartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                장바구니가 비어있습니다
              </Typography>
              <Typography variant="body2" color="text.secondary">
                상품을 추가해보세요!
              </Typography>
            </Box>
          ) : (
            // 장바구니 아이템 목록
            <>
              <Box sx={{ p: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  총 {getTotalQuantity()}개의 상품이 담겨있습니다
                </Alert>
              </Box>

              <List sx={{ p: 0 }}>
                {items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        p: 2,
                      }}
                    >
                      {/* 상품 정보 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontSize: '2rem', mr: 2 }}>
                          {item.image}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatPrice(item.price)} × {item.quantity}개
                          </Typography>
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                            소계: {formatPrice(item.price * item.quantity)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 수량 조절 및 삭제 버튼 */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 2, minWidth: '40px', textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </Box>

        {/* 하단 액션 영역 */}
        {!isEmpty() && (
          <Paper
            elevation={8}
            sx={{
              p: 2,
              borderRadius: 0,
              backgroundColor: 'background.paper',
            }}
          >
            {/* 총 금액 표시 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                총 결제금액: {formatPrice(getTotalPrice())}
              </Typography>
            </Box>

            {/* 액션 버튼들 */}
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                sx={{ py: 1.5 }}
              >
                주문하기
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleClearCart}
              >
                장바구니 비우기
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;