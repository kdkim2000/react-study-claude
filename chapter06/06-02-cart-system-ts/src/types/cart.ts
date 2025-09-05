// 상품 타입 정의
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

// 장바구니 아이템 타입 정의 (상품 + 수량)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  quantity: number;
}

// 장바구니 스토어 인터페이스
export interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
}