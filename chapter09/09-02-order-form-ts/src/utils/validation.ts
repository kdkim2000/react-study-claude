import * as yup from 'yup';

// 1단계: 상품 선택 검증
export const step1Schema = yup.object({
  products: yup
    .array()
    .of(
      yup.object({
        productId: yup.string().required(),
        quantity: yup.number().min(1, '수량은 1개 이상이어야 합니다').required(),
        options: yup.object().required(),
      })
    )
    .min(1, '최소 1개의 상품을 선택해주세요')
    .required(),
});

// 2단계: 배송 정보 검증
export const step2Schema = yup.object({
  deliveryMethod: yup
    .string()
    .oneOf(['delivery', 'pickup'], '배송 방법을 선택해주세요')
    .required('배송 방법을 선택해주세요'),
  
  recipientName: yup
    .string()
    .required('받는 분 성함을 입력해주세요')
    .min(2, '성함은 2자 이상 입력해주세요'),
  
  recipientPhone: yup
    .string()
    .required('연락처를 입력해주세요')
    .matches(
      /^01(?:0|1|[6-9])-?(?:\d{3}|\d{4})-?\d{4}$/,
      '올바른 휴대폰 번호를 입력해주세요'
    ),
  
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
});

// 3단계: 결제 정보 검증
export const step3Schema = yup.object({
  paymentMethod: yup
    .string()
    .oneOf(['card', 'bank', 'kakao'], '결제 수단을 선택해주세요')
    .required('결제 수단을 선택해주세요'),
  
  agreeToTerms: yup
    .boolean()
    .oneOf([true], '이용약관에 동의해주세요')
    .required(),
  
  agreeToPrivacy: yup
    .boolean()
    .oneOf([true], '개인정보 처리방침에 동의해주세요')
    .required(),
});

// 전체 폼 검증 스키마
export const orderSchema = yup.object({
  ...step1Schema.fields,
  ...step2Schema.fields,
  ...step3Schema.fields,
});

// 쿠폰 검증
export const validateCoupon = (code: string): { valid: boolean; discount: number; message: string } => {
  const validCoupons = [
    { code: 'WELCOME10', discount: 0.1, name: '신규 회원 10% 할인' },
    { code: 'SUMMER20', discount: 0.2, name: '여름 특가 20% 할인' },
    { code: 'VIP30', discount: 0.3, name: 'VIP 회원 30% 할인' },
  ];
  
  const coupon = validCoupons.find(c => c.code === code);
  
  if (coupon) {
    return {
      valid: true,
      discount: coupon.discount,
      message: `${coupon.name} 적용되었습니다`,
    };
  }
  
  return {
    valid: false,
    discount: 0,
    message: '유효하지 않은 쿠폰 코드입니다',
  };
};