import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStore, CartItem, Product } from '../types/cart';

// localStorage 키
const CART_STORAGE_KEY = 'shopping-cart';

// Zustand 장바구니 스토어 생성
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // 상품을 장바구니에 추가
      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            // 이미 존재하는 상품이면 수량 증가
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            // 새로운 상품 추가
            const newItem: CartItem = {
              ...product,
              quantity: 1,
            };
            return {
              items: [...state.items, newItem],
            };
          }
        });
      },

      // 장바구니에서 상품 완전 제거
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }));
      },

      // 상품 수량 업데이트
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          // 수량이 0 이하면 상품 제거
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      // 장바구니 비우기
      clearCart: () => {
        set({ items: [] });
      },

      // 총 가격 계산
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      },

      // 총 상품 개수 계산
      getTotalQuantity: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + item.quantity;
        }, 0);
      },
    }),
    {
      name: CART_STORAGE_KEY,
      // localStorage에 저장할 때와 불러올 때의 변환 로직
      serialize: (state) => JSON.stringify(state),
      deserialize: (str) => JSON.parse(str),
    }
  )
);

// 장바구니 상태를 확인하는 헬퍼 함수들
export const useCartHelpers = () => {
  const store = useCartStore();

  return {
    // 특정 상품이 장바구니에 있는지 확인
    isInCart: (productId: string) => {
      return store.items.some(item => item.id === productId);
    },

    // 특정 상품의 장바구니 수량 확인
    getItemQuantity: (productId: string) => {
      const item = store.items.find(item => item.id === productId);
      return item ? item.quantity : 0;
    },

    // 장바구니가 비어있는지 확인
    isEmpty: () => {
      return store.items.length === 0;
    },

    // 총 상품 종류 수
    getTotalItemTypes: () => {
      return store.items.length;
    },

    // 총 상품 개수 계산 (스토어 함수 사용)
    getTotalQuantity: () => {
      return store.getTotalQuantity();
    },

    // 총 가격 계산 (스토어 함수 사용)
    getTotalPrice: () => {
      return store.getTotalPrice();
    },

    // 가격 포맷팅 함수
    formatPrice: (price: number) => {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(price);
    },
  };
};