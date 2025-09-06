import { Product } from '../types/order';

// 샘플 상품 데이터
export const products: Product[] = [
  {
    id: 'laptop-001',
    name: '울트라북 노트북',
    price: 1299000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
    description: '고성능 프로세서와 긴 배터리 수명을 자랑하는 프리미엄 노트북',
    options: [
      {
        id: 'color',
        name: '색상',
        values: ['실버', '스페이스 그레이', '골드'],
        required: true,
      },
      {
        id: 'storage',
        name: '저장 용량',
        values: ['256GB', '512GB', '1TB'],
        required: true,
      },
    ],
  },
  {
    id: 'smartphone-001',
    name: '스마트폰 프로',
    price: 899000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    description: '최신 카메라 기술과 AI 기능을 탑재한 플래그십 스마트폰',
    options: [
      {
        id: 'color',
        name: '색상',
        values: ['블랙', '화이트', '블루', '퍼플'],
        required: true,
      },
      {
        id: 'storage',
        name: '저장 용량',
        values: ['128GB', '256GB', '512GB'],
        required: true,
      },
      {
        id: 'case',
        name: '케이스',
        values: ['기본', '투명', '가죽'],
        required: false,
      },
    ],
  },
  {
    id: 'headphones-001',
    name: '무선 헤드폰',
    price: 329000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    description: '노이즈 캔슬링 기능과 하이파이 사운드를 제공하는 프리미엄 헤드폰',
    options: [
      {
        id: 'color',
        name: '색상',
        values: ['블랙', '화이트', '로즈골드'],
        required: true,
      },
    ],
  },
  {
    id: 'tablet-001',
    name: '태블릿 프로',
    price: 799000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
    description: '창작과 업무에 최적화된 고성능 태블릿',
    options: [
      {
        id: 'storage',
        name: '저장 용량',
        values: ['64GB', '256GB', '512GB'],
        required: true,
      },
      {
        id: 'keyboard',
        name: '키보드',
        values: ['없음', '기본 키보드', '마그네틱 키보드'],
        required: false,
      },
    ],
  },
];

// 쿠폰 데이터
export const coupons = [
  { code: 'WELCOME10', discount: 0.1, name: '신규 회원 10% 할인' },
  { code: 'SUMMER20', discount: 0.2, name: '여름 특가 20% 할인' },
  { code: 'VIP30', discount: 0.3, name: 'VIP 회원 30% 할인' },
];

// 픽업 장소 데이터
export const pickupLocations = [
  '강남점 (서울 강남구 테헤란로 123)',
  '홍대점 (서울 마포구 홍익로 45)',
  '부산점 (부산 해운대구 해운대해변로 264)',
  '대구점 (대구 중구 동성로 67)',
];