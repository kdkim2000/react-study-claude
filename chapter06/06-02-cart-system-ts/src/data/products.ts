import { Product } from '../types/cart';

// 샘플 상품 데이터
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    price: 3290000,
    image: '💻',
    description: '최신 M3 Pro 칩셋을 탑재한 고성능 노트북',
    category: '전자제품',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    price: 1550000,
    image: '📱',
    description: 'A17 Pro 칩과 티타늄 디자인의 프리미엄 스마트폰',
    category: '전자제품',
  },
  {
    id: '3',
    name: 'AirPods Pro',
    price: 390000,
    image: '🎧',
    description: '액티브 노이즈 캔슬링 기능의 무선 이어폰',
    category: '오디오',
  },
  {
    id: '4',
    name: 'iPad Air',
    price: 929000,
    image: '📟',
    description: 'M2 칩과 Liquid Retina 디스플레이의 태블릿',
    category: '전자제품',
  },
  {
    id: '5',
    name: 'Magic Mouse',
    price: 99000,
    image: '🖱️',
    description: '멀티터치 표면의 무선 마우스',
    category: '액세서리',
  },
  {
    id: '6',
    name: 'Magic Keyboard',
    price: 149000,
    image: '⌨️',
    description: '백라이트 키가 있는 무선 키보드',
    category: '액세서리',
  },
  {
    id: '7',
    name: 'Apple Watch Series 9',
    price: 599000,
    image: '⌚',
    description: '건강 추적과 피트니스 기능의 스마트워치',
    category: '웨어러블',
  },
  {
    id: '8',
    name: 'HomePod mini',
    price: 129000,
    image: '🔊',
    description: '컴팩트한 크기의 스마트 스피커',
    category: '오디오',
  },
];

// 카테고리별 상품 분류
export const getProductsByCategory = (category?: string): Product[] => {
  if (!category) return sampleProducts;
  return sampleProducts.filter(product => product.category === category);
};

// 상품 ID로 상품 찾기
export const getProductById = (id: string): Product | undefined => {
  return sampleProducts.find(product => product.id === id);
};

// 카테고리 목록 추출
export const getCategories = (): string[] => {
  const categories = sampleProducts.map(product => product.category || '기타');
  return ['전체', ...Array.from(new Set(categories))];
};