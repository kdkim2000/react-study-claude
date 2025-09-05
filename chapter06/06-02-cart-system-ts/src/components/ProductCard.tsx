import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { Product } from '../types/cart';
import { useCartStore, useCartHelpers } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, updateQuantity } = useCartStore();
  const { isInCart, getItemQuantity, formatPrice } = useCartHelpers();

  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      updateQuantity(product.id, 0); // 0으로 설정하면 아이템 제거됨
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        {/* 상품 이모지 이미지 */}
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: '4rem', 
            mb: 2, 
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        >
          {product.image}
        </Typography>

        {/* 카테고리 칩 */}
        {product.category && (
          <Chip 
            label={product.category}
            size="small"
            color="primary"
            sx={{ mb: 2 }}
          />
        )}

        {/* 상품명 */}
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 1,
            minHeight: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {product.name}
        </Typography>

        {/* 상품 설명 */}
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2, 
            minHeight: '2.5rem',
            fontSize: '0.875rem',
            lineHeight: 1.4,
          }}
        >
          {product.description}
        </Typography>

        {/* 가격 */}
        <Typography 
          variant="h5" 
          color="primary"
          sx={{ 
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          {formatPrice(product.price)}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {!inCart ? (
          // 장바구니에 없을 때: 추가 버튼
          <Button
            fullWidth
            variant="contained"
            startIcon={<CartIcon />}
            onClick={handleAddToCart}
            sx={{ py: 1 }}
          >
            장바구니에 추가
          </Button>
        ) : (
          // 장바구니에 있을 때: 수량 조절 버튼들
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <IconButton 
              onClick={handleDecreaseQuantity}
              size="small"
              color="primary"
            >
              <RemoveIcon />
            </IconButton>
            
            <Box sx={{ textAlign: 'center', minWidth: '60px' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {quantity}개
              </Typography>
            </Box>
            
            <IconButton 
              onClick={handleIncreaseQuantity}
              size="small"
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;