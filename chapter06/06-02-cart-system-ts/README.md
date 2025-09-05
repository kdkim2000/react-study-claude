# 🛒 React Zustand 장바구니 시스템

React 초보자를 위한 Zustand 상태 관리 라이브러리 활용 실습 프로젝트입니다. 실제 쇼핑몰의 장바구니 시스템을 구현하면서 Zustand의 핵심 개념과 localStorage 연동, Material-UI를 활용한 사용자 인터페이스 구성 방법을 학습할 수 있습니다.

## 🎯 학습 목표

- **Zustand 상태 관리**: Context API보다 간단한 전역 상태 관리 방법
- **Persist 미들웨어**: localStorage와 자동 동기화하는 방법
- **실무형 상태 설계**: 장바구니라는 실제 비즈니스 로직 구현
- **TypeScript 고급 활용**: 제네릭과 인터페이스를 활용한 타입 안전성
- **Material-UI 실무 패턴**: Drawer, Badge, Fab 등 실무에서 자주 사용하는 컴포넌트들
- **사용자 경험(UX) 최적화**: 반응형 디자인과 직관적인 인터랙션

## 🚀 실행 방법

### 1. 프로젝트 생성 및 설치
```bash
# Vite로 프로젝트 생성
npm create vite@latest cart-system-practice -- --template react-swc-ts
cd cart-system-practice

# 의존성 설치
npm install

# 필수 패키지 설치
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material zustand
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 결과를 확인할 수 있습니다.

### 3. 기타 명령어
```bash
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
npm run preview  # 빌드 결과 미리보기
```

## 📁 프로젝트 구조

```
cart-system-practice/
├── src/
│   ├── types/
│   │   └── cart.ts                 # 🔤 장바구니 관련 타입 정의
│   ├── data/
│   │   └── products.ts             # 📦 샘플 상품 데이터 및 유틸리티
│   ├── store/
│   │   └── cartStore.ts            # 🏪 Zustand 장바구니 스토어 (핵심)
│   ├── components/
│   │   ├── Header.tsx              # 📋 헤더 및 장바구니 버튼
│   │   ├── ProductCard.tsx         # 🛍️ 개별 상품 카드
│   │   ├── ProductList.tsx         # 📜 상품 목록 및 카테고리 탭
│   │   ├── CartDrawer.tsx          # 🗃️ 장바구니 사이드바 (핵심)
│   │   └── CartStats.tsx           # 📊 장바구니 통계 대시보드
│   ├── App.tsx                     # 🏠 메인 애플리케이션
│   ├── main.tsx                    # 🔧 앱 진입점 및 테마 설정
│   └── vite-env.d.ts              # 📋 Vite 타입 정의
├── package.json                    # 📦 프로젝트 설정 및 의존성
├── tsconfig.json                   # ⚙️ TypeScript 설정
├── vite.config.ts                  # ⚡ Vite 빌드 도구 설정
├── eslint.config.js                # 📏 코드 품질 검사 설정
└── index.html                      # 🌐 HTML 진입점
```

## 🔧 핵심 구현 사항

### 1. Zustand 스토어 설계 (`src/store/cartStore.ts`)

#### 🎛️ 스토어 인터페이스 (요구사항 구현)
```typescript
interface CartStore {
  items: CartItem[];                              // 장바구니 아이템 배열
  addItem: (product: Product) => void;            // 상품 추가
  removeItem: (productId: string) => void;        // 상품 제거
  updateQuantity: (productId: string, quantity: number) => void; // 수량 변경
  clearCart: () => void;                          // 장바구니 비우기
  getTotalPrice: () => number;                    // 총 가격 계산
  getTotalQuantity: () => number;                 // 총 수량 계산 (추가 기능)
}
```

#### 🔑 Zustand 스토어 생성 패턴
```typescript
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            // 기존 상품의 수량 증가
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            // 새 상품 추가
            const newItem: CartItem = { ...product, quantity: 1 };
            return { items: [...state.items, newItem] };
          }
        });
      },

      // ... 다른 액션들
    }),
    {
      name: 'shopping-cart',  // localStorage 키
      // 자동으로 localStorage와 동기화
    }
  )
);
```

#### 🛠️ 헬퍼 함수들
```typescript
export const useCartHelpers = () => {
  const store = useCartStore();

  return {
    isInCart: (productId: string) => store.items.some(item => item.id === productId),
    getItemQuantity: (productId: string) => store.items.find(item => item.id === productId)?.quantity || 0,
    isEmpty: () => store.items.length === 0,
    formatPrice: (price: number) => new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price),
  };
};
```

### 2. TypeScript 타입 시스템 (`src/types/cart.ts`)

#### 📊 데이터 모델 정의
```typescript
// 기본 상품 타입
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

// 장바구니 아이템 타입 (상품 + 수량)
export interface CartItem extends Product {
  quantity: number;  // 상품 정보에 수량 추가
}
```

### 3. localStorage 자동 동기화

#### 💾 Persist 미들웨어 활용
```typescript
persist(
  (set, get) => ({
    // 스토어 구현
  }),
  {
    name: 'shopping-cart',           // localStorage 키
    serialize: (state) => JSON.stringify(state),    // 저장 시 직렬화
    deserialize: (str) => JSON.parse(str),          // 로드 시 역직렬화
  }
)
```

**장점:**
- 자동으로 상태 변경을 localStorage에 저장
- 페이지 새로고침 후에도 장바구니 내용 유지
- 브라우저 탭 간 상태 동기화

### 4. 컴포넌트별 핵심 기능

#### 🛍️ ProductCard 컴포넌트
- **동적 UI**: 장바구니 상태에 따른 버튼 변화
- **수량 조절**: +/- 버튼으로 직관적인 수량 변경
- **실시간 반영**: Zustand 상태 변경 즉시 UI 업데이트

```typescript
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, updateQuantity } = useCartStore();
  const { isInCart, getItemQuantity } = useCartHelpers();

  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  // 상태에 따른 조건부 렌더링
  return (
    <Card>
      {/* 상품 정보 */}
      <CardContent>...</CardContent>
      
      <CardActions>
        {!inCart ? (
          <Button onClick={() => addItem(product)}>
            장바구니에 추가
          </Button>
        ) : (
          <QuantityControls />
        )}
      </CardActions>
    </Card>
  );
};
```

#### 🗃️ CartDrawer 컴포넌트
- **Drawer 컴포넌트**: 오른쪽에서 슬라이드되는 사이드바
- **실시간 계산**: 총 금액과 수량 자동 계산 및 표시
- **완전한 CRUD**: 추가, 수량 변경, 개별 삭제, 전체 삭제

#### 📊 CartStats 컴포넌트
- **대시보드 형태**: 장바구니 현황을 한눈에 파악
- **통계 정보**: 상품 종류, 총 수량, 총 금액 표시
- **조건부 렌더링**: 장바구니가 비어있을 때는 숨김

### 5. 반응형 디자인 구현

#### 📱 모바일 최적화
```typescript
// 데스크톱: 헤더의 장바구니 버튼
<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
  <IconButton onClick={handleCartOpen}>
    <Badge badgeContent={totalQuantity}>
      <CartIcon />
    </Badge>
  </IconButton>
</Box>

// 모바일: Floating Action Button
<Fab
  sx={{
    position: 'fixed',
    bottom: 16,
    right: 16,
    display: { xs: 'flex', sm: 'none' },
  }}
>
  <CartIcon />
</Fab>
```

## 💡 고급 학습 포인트

### 🔄 Zustand vs Context API vs Redux

| 특징 | Context API | Zustand | Redux Toolkit |
|------|-------------|---------|---------------|
| 설정 복잡도 | 중간 | **매우 간단** | 복잡 |
| 번들 크기 | 내장 | **2.2kb** | 큰 편 |
| TypeScript 지원 | 수동 설정 | **자동 추론** | 좋음 |
| 미들웨어 | 없음 | **다양함** | 풍부함 |
| 학습 곡선 | 완만 | **매우 완만** | 가파름 |

### 🛠️ Zustand 핵심 패턴

#### 1. Immer 없이도 불변성 보장
```typescript
// ❌ 직접 변경 (잘못된 방법)
state.items.push(newItem);

// ✅ 새 배열 생성 (올바른 방법)
return { items: [...state.items, newItem] };
```

#### 2. get()을 활용한 현재 상태 접근
```typescript
getTotalPrice: () => {
  const { items } = get();  // 현재 상태 가져오기
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
},
```

#### 3. 조건부 상태 업데이트
```typescript
updateQuantity: (productId: string, quantity: number) => {
  if (quantity <= 0) {
    get().removeItem(productId);  // 다른 액션 호출
    return;
  }
  // 정상적인 수량 업데이트
  set(state => ({ ... }));
},
```

### 🎨 사용자 경험(UX) 최적화

#### 1. 시각적 피드백
- **Badge 컴포넌트**: 장바구니 수량을 시각적으로 표시
- **호버 효과**: 상품 카드에 마우스 오버 시 애니메이션
- **상태별 버튼**: 장바구니 여부에 따른 버튼 변화

#### 2. 직관적인 인터랙션
- **원클릭 추가**: 상품 카드에서 바로 장바구니 추가
- **인라인 수량 조절**: 별도 페이지 이동 없이 수량 변경
- **드래그 없는 사이드바**: 버튼 클릭으로 간편한 접근

#### 3. 정보 전달
- **실시간 통계**: 장바구니 현황을 대시보드로 표시
- **빈 상태 처리**: 장바구니가 비어있을 때 안내 메시지
- **가격 포맷팅**: 한국 원화 형식으로 가독성 향상

## 🎨 실행 결과

프로젝트를 실행하면 다음과 같은 완전한 쇼핑몰 장바구니 시스템을 확인할 수 있습니다:

### 📱 주요 기능들
- **상품 브라우징**: 카테고리별 상품 탐색 (8개 샘플 상품)
- **장바구니 관리**: 추가, 수량 변경, 삭제, 전체 비우기
- **실시간 계산**: 총 가격과 수량 자동 계산
- **데이터 영속성**: 페이지 새로고침 후에도 장바구니 유지
- **반응형 UI**: 모바일부터 데스크톱까지 최적화

### 🎯 UI/UX 특징
- **Material Design**: 일관된 디자인 시스템
- **애니메이션**: 부드러운 전환 효과
- **접근성**: 키보드 네비게이션 지원
- **직관적 아이콘**: 이모지 기반의 상품 이미지

### 📊 실시간 대시보드
- **상품 종류**: 장바구니에 담긴 서로 다른 상품 개수
- **총 수량**: 모든 상품의 개수 합계
- **총 금액**: 한국 원화 형식으로 표시

## 🔄 확장 가능한 기능들

이 프로젝트를 기반으로 다음과 같은 고급 기능들을 추가로 구현해볼 수 있습니다:

### 🛍️ 쇼핑몰 기능 확장
- [ ] **위시리스트**: 관심 상품 저장 기능
- [ ] **상품 검색**: 이름이나 카테고리로 필터링
- [ ] **상품 상세 페이지**: React Router를 활용한 페이지 라우팅
- [ ] **리뷰 시스템**: 상품 평점과 리뷰 기능
- [ ] **쿠폰/할인**: 할인 코드 적용 시스템

### 📊 데이터 관리 고도화
- [ ] **서버 연동**: REST API 또는 GraphQL 연동
- [ ] **사용자 인증**: 로그인/회원가입 시스템
- [ ] **주문 내역**: 구매 기록 관리
- [ ] **재고 관리**: 실시간 재고 수량 확인

### 🎨 UI/UX 개선
- [ ] **다크 모드**: 테마 전환 기능
- [ ] **무한 스크롤**: 상품 목록 페이지네이션
- [ ] **이미지 갤러리**: 실제 상품 이미지 표시
- [ ] **알림 시스템**: 토스트 메시지나 스낵바

### 🚀 성능 최적화
- [ ] **가상화**: 대량 상품 목록 렌더링 최적화
- [ ] **코드 스플리팅**: 페이지별 번들 분할
- [ ] **이미지 최적화**: lazy loading과 WebP 형식
- [ ] **서비스 워커**: 오프라인 지원

## 🔧 문제 해결 가이드

### 자주 발생하는 이슈들

1. **Zustand 상태가 유지되지 않는 문제**
   ```typescript
   // ❌ 잘못된 persist 설정
   create(persist((set, get) => ({ ... }), { name: '' }))
   
   // ✅ 올바른 persist 설정
   create(persist((set, get) => ({ ... }), { name: 'shopping-cart' }))
   ```

2. **TypeScript 타입 에러**
   ```typescript
   // ❌ 타입 불일치
   const quantity: string = getItemQuantity(productId);
   
   // ✅ 올바른 타입 사용
   const quantity: number = getItemQuantity(productId);
   ```

3. **리렌더링 최적화**
   ```typescript
   // ❌ 전체 스토어 구독 (불필요한 리렌더링)
   const store = useCartStore();
   
   // ✅ 필요한 부분만 구독
   const items = useCartStore(state => state.items);
   const addItem = useCartStore(state => state.addItem);
   ```

4. **localStorage 에러 처리**
   ```typescript
   // Zustand persist 미들웨어가 자동으로 처리하지만,
   // 직접 구현시에는 try-catch 필요
   try {
     localStorage.setItem('cart', JSON.stringify(cartData));
   } catch (error) {
     console.warn('저장소 접근 불가:', error);
   }
   ```

## 📚 참고 자료

### 📖 공식 문서
- [Zustand 공식 문서](https://zustand-demo.pmnd.rs/) - 핵심 개념과 고급 패턴
- [Material-UI Components](https://mui.com/material-ui/getting-started/) - UI 컴포넌트 가이드
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - 타입 시스템 심화

### 🛒 상태 관리 비교
- [Redux Toolkit](https://redux-toolkit.js.org/) - 복잡한 앱을 위한 상태 관리
- [Jotai](https://jotai.org/) - Atomic 상태 관리 접근법
- [Valtio](https://valtio.pmnd.rs/) - Proxy 기반 상태 관리

### 🎨 디자인 시스템
- [Material Design Guidelines](https://material.io/design) - 구글의 디자인 철학
- [React Transition Group](https://reactcommunity.org/react-transition-group/) - 애니메이션 라이브러리

## 🤝 기여하기

이 프로젝트는 교육 목적으로 만들어졌습니다. 다음과 같은 기여를 환영합니다:

- 🐛 **버그 리포트**: 발견한 문제점이나 개선사항 보고
- 📖 **문서 개선**: README나 코드 주석 향상
- ✨ **기능 추가**: 새로운 쇼핑몰 기능이나 UI 컴포넌트
- 🧪 **테스트 코드**: 단위 테스트나 E2E 테스트 추가
- 🎨 **디자인 개선**: UI/UX 향상 제안

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**Happy Coding! 🛒**

*Zustand로 간단하고 효율적인 상태 관리를 마스터하여 실무급 쇼핑몰을 만들어보세요!*

## 💭 학습 후 다음 단계

이 프로젝트를 완료한 후에는 다음과 같은 고급 주제들을 학습해보세요:

### 🚀 실무 레벨 상태 관리
1. **복잡한 상태 구조**: 중첩된 객체와 배열 관리
2. **미들웨어 활용**: devtools, logger, immer 연동
3. **상태 분할**: 도메인별 스토어 분리 전략
4. **성능 최적화**: 선택적 구독과 메모이제이션

### 🔄 상태 관리 패턴 비교
1. **Zustand vs Redux**: 언제 어떤 것을 선택할지
2. **서버 상태 분리**: React Query와의 조합
3. **상태 정규화**: 관계형 데이터 구조 관리
4. **옵티미스틱 업데이트**: 사용자 경험 향상 기법

### 🛍️ 실제 쇼핑몰 개발
1. **결제 시스템 연동**: Stripe, PayPal 등
2. **실시간 알림**: WebSocket 연동
3. **SEO 최적화**: Next.js와 SSR
4. **성능 모니터링**: 실제 사용자 경험 측정