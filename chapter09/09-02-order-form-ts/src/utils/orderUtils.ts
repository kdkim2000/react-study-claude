import { OrderFormData, OrderSummary, SelectedProduct } from '../types/order';
import { products } from '../data/products';

// 주문 요약 계산
export const calculateOrderSummary = (
  selectedProducts: SelectedProduct[],
  deliveryMethod: 'delivery' | 'pickup',
  couponDiscount: number = 0
): OrderSummary => {
  // 상품 소계 계산
  const subtotal = selectedProducts.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return total;
    
    return total + (product.price * item.quantity);
  }, 0);
  
  // 배송비 계산
  const deliveryFee = deliveryMethod === 'delivery' 
    ? (subtotal >= 50000 ? 0 : 3000) // 5만원 이상 무료배송
    : 0;
  
  // 할인 금액 계산
  const discount = Math.round(subtotal * couponDiscount);
  
  // 최종 금액 계산
  const total = subtotal + deliveryFee - discount;
  
  // 상품 개수 계산
  const productCount = selectedProducts.reduce((count, item) => count + item.quantity, 0);
  
  return {
    subtotal,
    deliveryFee,
    discount,
    total,
    productCount,
  };
};

// 숫자를 한국 원화 형식으로 포맷팅
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
};

// 전화번호 포맷팅
export const formatPhoneNumber = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

// 선택된 상품의 옵션 텍스트 생성
export const getProductOptionText = (
  productId: string,
  options: { [optionId: string]: string }
): string => {
  const product = products.find(p => p.id === productId);
  if (!product) return '';
  
  const optionTexts = Object.entries(options).map(([optionId, value]) => {
    const option = product.options.find(opt => opt.id === optionId);
    return option ? `${option.name}: ${value}` : '';
  }).filter(Boolean);
  
  return optionTexts.join(', ');
};

// 폼 단계 진행 상황 계산
export const getStepProgress = (currentStep: string): number => {
  const steps = ['products', 'delivery', 'payment'];
  const currentIndex = steps.indexOf(currentStep);
  return ((currentIndex + 1) / steps.length) * 100;
};

// 주문 데이터 검증
export const validateOrderData = (data: OrderFormData): string[] => {
  const errors: string[] = [];
  
  // 상품 선택 검증
  if (!data.products || data.products.length === 0) {
    errors.push('상품을 선택해주세요');
  }
  
  // 배송 정보 검증
  if (!data.recipientName) {
    errors.push('받는 분 성함을 입력해주세요');
  }
  
  if (!data.recipientPhone) {
    errors.push('연락처를 입력해주세요');
  }
  
  if (data.deliveryMethod === 'delivery' && !data.address) {
    errors.push('배송 주소를 입력해주세요');
  }
  
  if (data.deliveryMethod === 'pickup' && !data.pickupLocation) {
    errors.push('픽업 장소를 선택해주세요');
  }
  
  // 결제 정보 검증
  if (!data.paymentMethod) {
    errors.push('결제 수단을 선택해주세요');
  }
  
  if (!data.agreeToTerms) {
    errors.push('이용약관에 동의해주세요');
  }
  
  if (!data.agreeToPrivacy) {
    errors.push('개인정보 처리방침에 동의해주세요');
  }
  
  return errors;
};