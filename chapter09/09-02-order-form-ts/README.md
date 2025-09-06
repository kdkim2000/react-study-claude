# 🛒 상품 주문 폼 (Chapter 9-2 실습 과제)

React 초보자를 위한 **고급 다단계 주문 폼** 구현 프로젝트입니다. 동적 필드 관리, 조건부 렌더링, 실시간 계산 등 실제 전자상거래 사이트에서 사용되는 복잡한 폼 시스템을 학습할 수 있습니다.

## 🎯 학습 목표

- **다단계 폼 설계**: 복잡한 폼을 단계별로 나누어 사용자 경험 최적화
- **동적 필드 관리**: useFieldArray를 이용한 실시간 필드 추가/삭제
- **조건부 렌더링**: 사용자 선택에 따른 동적 UI 변경
- **실시간 계산**: 상품 가격, 배송비, 할인 등 복합 계산 시스템
- **고급 검증**: 단계별 검증과 조건부 검증 구현
- **사용자 경험**: 진행 상황 표시, 에러 처리, 성공 피드백
- **상태 관리**: 복잡한 폼 데이터의 효율적인 관리

## ✨ 주요 기능

### 📋 3단계 주문 프로세스
1. **상품 선택**: 상품 목록, 옵션 설정, 수량 조절
2. **배송 정보**: 배송/픽업 선택, 주소 입력, 연락처 등록
3. **결제 정보**: 결제 수단, 쿠폰 적용, 최종 확인

### 🔄 고급 폼 기능
- **동적 필드**: 상품 추가/삭제, 수량 조절, 옵션 변경
- **조건부 필드**: 배송 방법에 따른 입력 필드 변화
- **실시간 계산**: 주문 금액, 배송비, 할인 자동 계산
- **단계별 검증**: 각 단계별 필수 입력 사항 검증
- **진행 상황**: 시각적 스텝퍼와 프로그레스 바

### 🎨 프리미엄 사용자 경험
- **반응형 디자인**: 데스크톱/모바일 최적화
- **부드러운 애니메이션**: 단계 전환과 필드 표시/숨김
- **직관적 인터페이스**: 아이콘과 색상으로 명확한 안내
- **실시간 피드백**: 즉각적인 에러 표시와 성공 알림

## 🚀 빠른 시작

### 1. 프로젝트 생성
```bash
# Vite로 React TypeScript 프로젝트 생성
npm create vite@latest order-form-tutorial -- --template react-swc-ts
cd order-form-tutorial
```

### 2. 의존성 설치
```bash
# 기본 의존성 설치
npm install

# 폼 관련 패키지
npm install react-hook-form @hookform/resolvers yup

# Material-UI 패키지
npm install @mui/material @emotion/react @emotion/styled @mui/system @mui/icons-material
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 다단계 주문 폼을 체험해보세요!

## 📁 프로젝트 구조

```
order-form-tutorial/
├── src/
│   ├── types/
│   │   └── order.ts              # 🔤 주문 관련 타입 정의
│   ├── data/
│   │   └── products.ts           # 📦 상품 데이터 및 샘플 데이터
│   ├── utils/
│   │   ├── validation.ts         # 🛡️ Yup 검증 스키마 (핵심)
│   │   └── orderUtils.ts         # 🔧 주문 계산 유틸리티
│   ├── components/
│   │   ├── OrderForm.tsx         # 📋 메인 주문 폼 (핵심)
│   │   ├── Step1Products.tsx     # 🛍️ 1단계: 상품 선택 (동적 필드)
│   │   ├── Step2Delivery.tsx     # 🚚 2단계: 배송 정보 (조건부 필드)
│   │   └── Step3Payment.tsx      # 💳 3단계: 결제 정보 (주문 요약)
│   ├── App.tsx                   # 🏠 메인 앱 컴포넌트
│   ├── main.tsx                  # 🚪 앱 진입점
│   └── vite-env.d.ts            # 📋 Vite 타입 정의
├── package.json                  # 📦 프로젝트 설정
├── tsconfig.json                # ⚙️ TypeScript 설정
├── vite.config.ts               # ⚡ Vite 설정 (SWC 사용)
├── eslint.config.js             # 📏 느슨한 ESLint 설정
└── README.md                    # 📖 프로젝트 문서
```

## 🔧 핵심 구현 사항

### 1. 타입 정의 (`src/types/order.ts`)

#### 🏗️ 체계적인 데이터 구조 설계
```typescript
// 선택된 상품 정보
export interface SelectedProduct {
  productId: string;
  quantity: number;
  options: { [optionId: string]: string };
}

// 완전한 주문 폼 데이터
export interface OrderFormData {
  // 1단계: 상품 선택
  products: SelectedProduct[];
  
  // 2단계: 배송 정보 (조건부 필드)
  deliveryMethod: 'delivery' | 'pickup';
  address?: { zipCode: string; address: string; detailAddress: string; };
  pickupLocation?: string;
  recipientName: string;
  recipientPhone: string;
  
  // 3단계: 결제 정보
  paymentMethod: 'card' | 'bank' | 'kakao';
  couponCode?: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

// 주문 요약 계산 결과
export interface OrderSummary {
  subtotal: number;      // 상품 소계
  deliveryFee: number;   // 배송비
  discount: number;      // 할인금액
  total: number;         // 최종 금액
  productCount: number;  // 총 상품 개수
}
```

### 2. 동적 필드 관리 (`src/components/Step1Products.tsx`)

#### 🔄 useFieldArray로 상품 동적 관리
```typescript
// React Hook Form의 useFieldArray 활용
const { fields, append, remove, update } = useFieldArray({
  control,
  name: 'products',
});

// 상품 추가 (필수 옵션 자동 설정)
const addProduct = (productId: string) => {
  const product = products.find(p => p.id === productId);
  
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

// 실시간 수량 변경
const updateQuantity = (index: number, delta: number) => {
  const currentProduct = selectedProducts[index];
  const newQuantity = Math.max(1, currentProduct.quantity + delta);
  update(index, { ...currentProduct, quantity: newQuantity });
};

// 옵션 변경 (색상, 용량 등)
const updateOption = (index: number, optionId: string, value: string) => {
  const currentProduct = selectedProducts[index];
  const newOptions = { ...currentProduct.options, [optionId]: value };
  update(index, { ...currentProduct, options: newOptions });
};
```

#### 🛍️ 상품 카드 렌더링
```typescript
{fields.map((field, index) => {
  const product = products.find(p => p.id === field.productId);
  
  return (
    <Card key={field.id}>
      <Box sx={{ display: 'flex', p: 2 }}>
        {/* 상품 이미지 */}
        <CardMedia component="img" src={product.image} />
        
        <Box sx={{ flex: 1, ml: 2 }}>
          {/* 상품명과 삭제 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">{product.name}</Typography>
            <IconButton onClick={() => remove(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>

          {/* 옵션 선택 드롭다운 */}
          {product.options.map(option => (
            <FormControl key={option.id}>
              <Select
                value={selectedProducts[index]?.options[option.id] || ''}
                onChange={(e) => updateOption(index, option.id, e.target.value)}
              >
                {option.values.map(value => (
                  <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          {/* 수량 조절 UI */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => updateQuantity(index, -1)}>
              <RemoveIcon />
            </IconButton>
            <TextField
              value={selectedProducts[index]?.quantity || 1}
              onChange={(e) => {
                const quantity = parseInt(e.target.value) || 1;
                update(index, { ...currentProduct, quantity });
              }}
            />
            <IconButton onClick={() => updateQuantity(index, 1)}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Card>
  );
})}
```

### 3. 조건부 필드 (`src/components/Step2Delivery.tsx`)

#### 🎯 핵심 개념: 조건부 렌더링
```typescript
// 배송 방법 감시
const deliveryMethod = useWatch({
  control,
  name: 'deliveryMethod',
  defaultValue: 'delivery',
});

// 조건부 필드 렌더링 (배송 주소)
<Collapse in={deliveryMethod === 'delivery'}>
  <Card>
    <CardContent>
      <Typography variant="subtitle1">배송 주소</Typography>
      
      {/* 우편번호 */}
      <Controller
        name="address.zipCode"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="우편번호"
            required
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      
      {/* 주소 */}
      <Controller name="address.address" /* ... */ />
      <Controller name="address.detailAddress" /* ... */ />
    </CardContent>
  </Card>
</Collapse>

// 조건부 필드 렌더링 (픽업 장소)
<Collapse in={deliveryMethod === 'pickup'}>
  <Card>
    <CardContent>
      <Controller
        name="pickupLocation"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel>픽업 장소 선택</InputLabel>
            <Select {...field}>
              {pickupLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </CardContent>
  </Card>
</Collapse>
```

### 4. 조건부 검증 스키마 (`src/utils/validation.ts`)

#### 🛡️ Yup 조건부 검증
```typescript
// 2단계 배송 정보 검증
export const step2Schema = yup.object({
  deliveryMethod: yup
    .string()
    .oneOf(['delivery', 'pickup'])
    .required('배송 방법을 선택해주세요'),
  
  // 조건부 검증: 배송 선택 시 주소 필수
  address: yup.object().when('deliveryMethod', {
    is: 'delivery',
    then: (schema) => schema.shape({
      zipCode: yup.string().required('우편번호를 입력해주세요'),
      address: yup.string().required('주소를 입력해주세요'),
      detailAddress: yup.string().required('상세주소를 입력해주세요'),
    }).required('배송 주소를 입력해주세요'),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  // 조건부 검증: 픽업 선택 시 픽업 장소 필수
  pickupLocation: yup.string().when('deliveryMethod', {
    is: 'pickup',
    then: (schema) => schema.required('픽업 장소를 선택해주세요'),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  recipientName: yup.string().required('받는 분 성함을 입력해주세요'),
  recipientPhone: yup.string()
    .required('연락처를 입력해주세요')
    .matches(/^01(?:0|1|[6-9])-?(?:\d{3}|\d{4})-?\d{4}$/, '올바른 휴대폰 번호를 입력해주세요'),
});
```

### 5. 실시간 주문 계산 (`src/utils/orderUtils.ts`)

#### 💰 복합 금액 계산 시스템
```typescript
export const calculateOrderSummary = (
  selectedProducts: SelectedProduct[],
  deliveryMethod: 'delivery' | 'pickup',
  couponDiscount: number = 0
): OrderSummary => {
  // 1. 상품별 소계 계산
  const subtotal = selectedProducts.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return total;
    
    return total + (product.price * item.quantity);
  }, 0);
  
  // 2. 배송비 계산 (5만원 이상 무료배송)
  const deliveryFee = deliveryMethod === 'delivery' 
    ? (subtotal >= 50000 ? 0 : 3000) 
    : 0;
  
  // 3. 할인 금액 계산
  const discount = Math.round(subtotal * couponDiscount);
  
  // 4. 최종 금액 계산
  const total = subtotal + deliveryFee - discount;
  
  // 5. 상품 개수 계산
  const productCount = selectedProducts.reduce((count, item) => count + item.quantity, 0);
  
  return { subtotal, deliveryFee, discount, total, productCount };
};
```

### 6. 다단계 폼 관리 (`src/components/OrderForm.tsx`)

#### 📋 단계별 폼 컨트롤러
```typescript
// 단계 정보와 검증 스키마 매핑
const steps = [
  { key: 'products' as FormStep, label: '상품 선택', schema: step1Schema },
  { key: 'delivery' as FormStep, label: '배송 정보', schema: step2Schema },
  { key: 'payment' as FormStep, label: '결제 정보', schema: step3Schema },
];

// 다음 단계 진행 로직
const nextStep = async () => {
  const currentStepData = steps[currentStepIndex];
  
  // 1. React Hook Form 기본 검증
  const isValid = await trigger();
  if (!isValid) {
    setStepErrors(['입력 정보를 확인해주세요']);
    return;
  }

  // 2. 단계별 Yup 스키마 검증
  try {
    const formData = getValues();
    await currentStepData.schema.validate(formData, { abortEarly: false });
    setStepErrors([]);
    
    // 3. 다음 단계로 이동
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  } catch (error: any) {
    if (error.errors) {
      setStepErrors(error.errors);
    }
  }
};

// 최종 주문 완료
const onSubmit = async (data: OrderFormData) => {
  setIsSubmitting(true);
  
  try {
    // 최종 검증
    const validationErrors = validateOrderData(data);
    if (validationErrors.length > 0) {
      setStepErrors(validationErrors);
      return;
    }

    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('주문 데이터:', data);
    setShowSuccess(true);
  } catch (error) {
    setStepErrors(['주문 처리 중 오류가 발생했습니다.']);
  } finally {
    setIsSubmitting(false);
  }
};
```

## 🎪 실행 결과

### 📱 주요 화면 구성

#### **메인 화면**
- 깔끔한 Material-UI 디자인
- 상단에 진행률 표시 (LinearProgress)
- 시각적 스텝퍼로 현재 단계 안내
- 에러 메시지 영역

#### **1단계: 상품 선택**
- 4개 샘플 상품 그리드 레이아웃
- 상품별 이미지, 이름, 설명, 가격 표시
- 장바구니 추가 시 상세 옵션 설정
- 선택된 상품 카드로 표시
- 수량 조절 (+/- 버튼, 직접 입력)
- 개별 상품 삭제 기능

#### **2단계: 배송 정보**
- 배송/픽업 라디오 버튼 선택
- 받는 분 정보 (이름, 전화번호)
- 조건부 필드 애니메이션:
  - 배송 선택: 주소 입력 폼 슬라이드 다운
  - 픽업 선택: 픽업 장소 선택 드롭다운
- 배송 요청사항 텍스트 영역

#### **3단계: 결제 정보**
- 결제 수단 아이콘과 함께 선택 옵션
- 쿠폰 입력 및 적용 시스템
- 실시간 주문 요약 카드:
  - 상품금액 (개수 표시)
  - 배송비 (무료배송 안내)
  - 할인금액 (빨간색 표시)
  - 최종 결제금액 (큰 글씨 강조)
- 필수 약관 동의 체크박스

#### **완료 화면**
- 모달 다이얼로그
- 큰 체크 아이콘
- "주문이 완료되었습니다!" 메시지
- 감사 인사 및 안내 문구

### 🎯 상호작용 시나리오

1. **상품 선택 및 옵션 설정**:
   - 노트북 선택 → 색상: 스페이스 그레이, 용량: 512GB
   - 수량 3개로 조절 → 실시간 금액 반영

2. **조건부 필드 체험**:
   - 배송 선택 → 주소 입력 필드 애니메이션 표시
   - 픽업으로 변경 → 주소 필드 숨김, 픽업 장소 드롭다운 표시

3. **실시간 계산**:
   - 상품 추가/삭제 시 즉시 금액 재계산
   - 5만원 이상 주문 시 "무료배송" 표시
   - 쿠폰 적용 시 할인금액 실시간 반영

4. **단계별 검증**:
   - 상품 미선택 상태로 다음 단계 시도 → 에러 메시지
   - 필수 필드 누락 시 해당 단계 진행 차단
   - 약관 미동의 시 주문 완료 불가

5. **성공적인 주문 완료**:
   - 모든 정보 입력 → 2초 로딩 → 성공 모달

## 🎓 주요 학습 포인트

### 🌟 useFieldArray 완전 정복
```typescript
// 1. 기본 설정
const { fields, append, remove, update } = useFieldArray({
  control,
  name: 'products',  // 배열 필드명
});

// 2. 동적 추가
append({ productId: 'new-id', quantity: 1, options: {} });

// 3. 특정 인덱스 수정
update(index, { ...currentData, quantity: newQuantity });

// 4. 제거
remove(index);

// 5. 전체 재설정
replace([newItem1, newItem2]);
```

### 🎨 Material-UI 조건부 애니메이션
```typescript
// Collapse로 부드러운 나타나기/사라지기
<Collapse in={condition} timeout="auto" unmountOnExit>
  <Card>
    <CardContent>
      {/* 조건부 컨텐츠 */}
    </CardContent>
  </Card>
</Collapse>

// Fade로 페이지 전환 효과
<Fade in={visible} timeout={500}>
  <Box>{content}</Box>
</Fade>
```

### 🔄 실시간 데이터 감시와 계산
```typescript
// useWatch로 특정 필드 감시
const products = useWatch({ control, name: 'products' });
const deliveryMethod = useWatch({ control, name: 'deliveryMethod' });

// 감시된 데이터로 실시간 계산
useEffect(() => {
  const summary = calculateOrderSummary(products, deliveryMethod, couponDiscount);
  setOrderSummary(summary);
}, [products, deliveryMethod, couponDiscount]);
```

### 🛡️ 고급 검증 패턴
```typescript
// 조건부 검증
yup.object().when('condition', {
  is: value => value === 'target',
  then: schema => schema.required('필수입니다'),
  otherwise: schema => schema.notRequired(),
})

// 배열 검증
yup.array().of(
  yup.object({
    quantity: yup.number().min(1, '1개 이상'),
    options: yup.object().required(),
  })
).min(1, '최소 1개 선택')

// 커스텀 검증
yup.string().test('custom', '메시지', function(value) {
  return customValidationLogic(value);
})
```

### ⚡ 성능 최적화 기법
```typescript
// React.memo로 컴포넌트 최적화
const ProductCard = React.memo(({ product, onAdd }) => {
  return <Card>{/* 상품 카드 내용 */}</Card>;
});

// useCallback으로 함수 메모이제이션
const updateQuantity = useCallback((index: number, delta: number) => {
  const newQuantity = Math.max(1, products[index].quantity + delta);
  update(index, { ...products[index], quantity: newQuantity });
}, [products, update]);

// useMemo로 계산 결과 캐싱
const orderSummary = useMemo(() => {
  return calculateOrderSummary(products, deliveryMethod, discount);
}, [products, deliveryMethod, discount]);
```

## 🧪 테스트 시나리오

### 📦 1단계 테스트
- **정상 시나리오**: 노트북 + 스마트폰 선택, 각각 다른 옵션 설정
- **옵션 변경**: 색상 변경 시 실시간 반영 확인
- **수량 조절**: +/- 버튼과 직접 입력 모두 테스트
- **상품 제거**: 개별 삭제 후 목록 업데이트 확인
- **에러 케이스**: 상품 미선택 상태로 다음 단계 시도

### 🚚 2단계 테스트
- **배송 선택**: 주소 필드 애니메이션 확인
- **픽업 선택**: 픽업 장소 드롭다운 표시 확인
- **전환 테스트**: 배송 ↔ 픽업 반복 변경
- **전화번호**: 자동 하이픈 포맷팅 확인 (01012345678 → 010-1234-5678)
- **검증 테스트**: 필수 필드 누락 시 에러 메시지

### 💳 3단계 테스트
- **쿠폰 적용**: WELCOME10 (10% 할인) 테스트
- **무료배송**: 5만원 이상 주문 시 배송비 0원 확인
- **실시간 계산**: 상품 변경 시 즉시 금액 재계산
- **결제 수단**: 각 결제 방법 선택 테스트
- **약관 동의**: 미동의 시 주문 완료 버튼 비활성화

### 🎯 전체 플로우 테스트
1. **완벽한 주문**: 모든 단계 정상 진행 → 성공 모달
2. **단계별 뒤로가기**: 이전 단계 데이터 보존 확인
3. **새로고침 테스트**: 브라우저 새로고침 후 데이터 손실 (정상)
4. **반응형 테스트**: 모바일/태블릿 화면에서 UI 확인

## 🔄 확장 가능한 기능들

### 🚀 고급 쇼핑 기능
- [ ] **위시리스트**: 상품을 나중에 구매할 목록에 저장
- [ ] **장바구니 저장**: localStorage로 임시 저장 기능
- [ ] **상품 비교**: 여러 상품의 스펙 비교 테이블
- [ ] **추천 시스템**: 선택한 상품 기반 추천 상품 표시
- [ ] **재고 관리**: 실시간 재고 확인 및 품절 표시

### 💾 데이터 관리 고도화
- [ ] **주문 히스토리**: 이전 주문 내역 조회 및 재주문
- [ ] **배송 추적**: 실시간 배송 상태 확인
- [ ] **쿠폰 관리**: 사용 가능한 쿠폰 목록과 자동 적용
- [ ] **회원 등급**: VIP, 골드 등급별 할인 혜택
- [ ] **포인트 시스템**: 적립 포인트로 결제 가능

### 🎨 사용자 경험 향상
- [ ] **상품 이미지 갤러리**: 여러 각도의 상품 이미지
- [ ] **360도 뷰**: 3D 상품 미리보기
- [ ] **AR 체험**: 증강현실로 상품 착용/배치 시뮬레이션
- [ ] **리뷰 시스템**: 실제 구매자 리뷰와 평점
- [ ] **라이브 채팅**: 실시간 고객 상담 기능

### 🔐 보안 및 결제 고도화
- [ ] **PG 연동**: 실제 결제 게이트웨이 연결
- [ ] **간편 결제**: 애플페이, 구글페이, 네이버페이
- [ ] **할부 옵션**: 무이자 할부 및 분할 결제
- [ ] **보안 강화**: 결제 정보 암호화 및 3D Secure
- [ ] **영수증 관리**: 전자영수증 발급 및 관리

## 🛠️ 기술 스택

- **⚛️ React 18**: 함수형 컴포넌트와 최신 Hooks
- **🔷 TypeScript**: 완전한 타입 안전성과 IntelliSense 지원
- **📝 React Hook Form**: 고성능 폼 상태 관리와 검증
- **🛡️ Yup**: 직관적인 스키마 기반 데이터 검증
- **🎨 Material-UI**: 구글의 Material Design 시스템
- **⚡ Vite**: 번개처럼 빠른 개발 서버와 HMR
- **🚀 SWC**: 고성능 Rust 기반 JavaScript 컴파일러

## 🤝 학습 도움말

### 🆘 자주 발생하는 문제들

1. **useFieldArray 인덱스 오류**
   ```typescript
   // ❌ 잘못된 방법: 직접 state 수정
   products[index].quantity = newQuantity;
   
   // ✅ 올바른 방법: update 함수 사용
   update(index, { ...products[index], quantity: newQuantity });
   ```

2. **조건부 필드 검증 문제**
   ```typescript
   // ❌ 항상 검증됨
   address: yup.object().shape({
     zipCode: yup.string().required(),
   }),
   
   // ✅ 조건부 검증
   address: yup.object().when('deliveryMethod', {
     is: 'delivery',
     then: schema => schema.shape({
       zipCode: yup.string().required(),
     }).required(),
   }),
   ```

3. **무한 리렌더링 문제**
   ```typescript
   // ❌ 의존성 배열 없음
   useEffect(() => {
     const summary = calculateOrderSummary(products);
     setOrderSummary(summary);
   }); // 의존성 배열 누락
   
   // ✅ 올바른 의존성
   useEffect(() => {
     const summary = calculateOrderSummary(products, deliveryMethod);
     setOrderSummary(summary);
   }, [products, deliveryMethod]);
   ```

4. **타입 오류 해결**
   ```typescript
   // ❌ any 타입 사용
   const updateQuantity = (index: any, quantity: any) => { ... };
   
   // ✅ 정확한 타입 정의
   const updateQuantity = (index: number, quantity: number) => { ... };
   ```

### 📚 추가 학습 자료

- [React Hook Form - useFieldArray](https://react-hook-form.com/docs/usefieldarray)
- [Yup 조건부 검증](https://github.com/jquense/yup#yupobjectshapefields-object--schema)
- [Material-UI Stepper](https://mui.com/material-ui/react-stepper/)
- [TypeScript 고급 타입](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [React 성능 최적화](https://react.dev/learn/render-and-commit)

## 📄 라이선스

이 프로젝트는 교육 목적으로 만들어졌으며 MIT 라이선스를 따릅니다.

---

**Happy Shopping! 🛒**

*React의 고급 폼 기술을 마스터하여 전자상거래급 사용자 경험을 구현해보세요!*