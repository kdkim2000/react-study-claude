import React from 'react';
import { useFieldArray, Control, useWatch } from 'react-hook-form';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { OrderFormData, SelectedProduct } from '../types/order';
import { products } from '../data/products';
import { formatPrice } from '../utils/orderUtils';

interface Step1ProductsProps {
  control: Control<OrderFormData>;
}

const Step1Products: React.FC<Step1ProductsProps> = ({ control }) => {
  // 동적 필드 관리 (상품 추가/삭제)
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'products',
  });

  // 현재 선택된 상품들 감시
  const selectedProducts = useWatch({
    control,
    name: 'products',
    defaultValue: [],
  });

  // 상품 추가
  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // 필수 옵션 초기값 설정
    const initialOptions: { [key: string]: string } = {};
    product.options.forEach(option => {
      if (option.required) {
        initialOptions[option.id] = option.values[0];
      }
    });

    const newProduct: SelectedProduct = {
      productId,
      quantity: 1,
      options: initialOptions,
    };

    append(newProduct);
  };

  // 수량 변경
  const updateQuantity = (index: number, delta: number) => {
    const currentProduct = selectedProducts[index];
    if (!currentProduct) return;

    const newQuantity = Math.max(1, currentProduct.quantity + delta);
    update(index, { ...currentProduct, quantity: newQuantity });
  };

  // 옵션 변경
  const updateOption = (index: number, optionId: string, value: string) => {
    const currentProduct = selectedProducts[index];
    if (!currentProduct) return;

    const newOptions = { ...currentProduct.options, [optionId]: value };
    update(index, { ...currentProduct, options: newOptions });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📦 상품 선택
      </Typography>

      {/* 선택된 상품 목록 */}
      {fields.map((field, index) => {
        const product = products.find(p => p.id === field.productId);
        if (!product) return null;

        return (
          <Card key={field.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', p: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 120, height: 120, borderRadius: 1 }}
                image={product.image}
                alt={product.name}
              />
              
              <Box sx={{ flex: 1, ml: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <IconButton
                    onClick={() => remove(index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>

                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  {formatPrice(product.price)}
                </Typography>

                {/* 상품 옵션 */}
                <Box sx={{ mb: 2 }}>
                  {product.options.map(option => (
                    <FormControl key={option.id} sx={{ minWidth: 120, mr: 2, mb: 1 }}>
                      <InputLabel>{option.name}</InputLabel>
                      <Select
                        value={selectedProducts[index]?.options[option.id] || ''}
                        label={option.name}
                        onChange={(e) => updateOption(index, option.id, e.target.value)}
                        required={option.required}
                      >
                        {option.values.map(value => (
                          <MenuItem key={value} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                </Box>

                {/* 수량 조절 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">수량:</Typography>
                  <IconButton
                    onClick={() => updateQuantity(index, -1)}
                    disabled={selectedProducts[index]?.quantity <= 1}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    value={selectedProducts[index]?.quantity || 1}
                    inputProps={{ min: 1, style: { textAlign: 'center', width: 60 } }}
                    size="small"
                    type="number"
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value) || 1;
                      const currentProduct = selectedProducts[index];
                      if (currentProduct) {
                        update(index, { ...currentProduct, quantity });
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => updateQuantity(index, 1)}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Card>
        );
      })}

      {/* 선택된 상품이 없을 때 안내 */}
      {fields.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          아래에서 원하는 상품을 선택해주세요
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      {/* 상품 목록 */}
      <Typography variant="h6" gutterBottom>
        🛍️ 상품 목록
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
        {products.map(product => {
          const isSelected = selectedProducts.some(p => p.productId === product.id);
          
          return (
            <Card key={product.id} sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  {formatPrice(product.price)}
                </Typography>
                <Button
                  variant={isSelected ? "outlined" : "contained"}
                  fullWidth
                  onClick={() => addProduct(product.id)}
                  disabled={isSelected}
                >
                  {isSelected ? '이미 선택됨' : '장바구니에 추가'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default Step1Products;