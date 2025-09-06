// 상품 정보
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  options: ProductOption[];
}

// 상품 옵션
export interface ProductOption {
  id: string;
  name: string;
  values: string[];
  required: boolean;
}

// 선택된 상품
export interface SelectedProduct {
  productId: string;
  quantity: number;
  options: { [optionId: string]: string };
}

// 주문 폼 데이터
export interface OrderFormData {
  // 1단계: 상품 선택
  products: SelectedProduct[];
  
  // 2단계: 배송 정보
  deliveryMethod: 'delivery' | 'pickup';
  address?: {
    zipCode: string;
    address: string;
    detailAddress: string;
  };
  pickupLocation?: string;
  deliveryRequest?: string;
  recipientName: string;
  recipientPhone: string;
  
  // 3단계: 결제 정보
  paymentMethod: 'card' | 'bank' | 'kakao';
  couponCode?: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

// 주문 요약
export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  productCount: number;
}

// 폼 단계
export type FormStep = 'products' | 'delivery' | 'payment';