import * as yup from 'yup';
import dayjs from 'dayjs';

// Yup 검증 스키마 정의
export const signupSchema = yup.object({
  // 이메일: 형식 검증
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .max(50, '이메일은 50자 이하로 입력해주세요'),

  // 비밀번호: 8자 이상, 영문/숫자/특수문자 포함
  password: yup
    .string()
    .required('비밀번호를 입력해주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      '영문, 숫자, 특수문자를 모두 포함해야 합니다'
    ),

  // 비밀번호 확인
  passwordConfirm: yup
    .string()
    .required('비밀번호 확인을 입력해주세요')
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다'),

  // 이름
  name: yup
    .string()
    .required('이름을 입력해주세요')
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(10, '이름은 10자 이하로 입력해주세요')
    .matches(/^[가-힣a-zA-Z\s]+$/, '이름은 한글 또는 영문만 입력 가능합니다'),

  // 전화번호: 한국 전화번호 형식
  phone: yup
    .string()
    .required('전화번호를 입력해주세요')
    .matches(
      /^01(?:0|1|[6-9])-?(?:\d{3}|\d{4})-?\d{4}$/,
      '올바른 휴대폰 번호 형식이 아닙니다 (예: 010-1234-5678)'
    ),

  // 생년월일: 14세 이상
  birthDate: yup
    .string()
    .required('생년월일을 입력해주세요')
    .test('age', '만 14세 이상만 가입 가능합니다', function(value) {
      if (!value) return false;
      const today = dayjs();
      const birthDay = dayjs(value);
      const age = today.diff(birthDay, 'year');
      return age >= 14;
    }),

  // 필수 약관 동의
  termsRequired: yup
    .boolean()
    .oneOf([true], '필수 약관에 동의해주세요'),

  // 선택 약관 동의 (검증 없음)
  termsOptional: yup.boolean(),
});

// 이메일 중복 체크 시뮬레이션
const existingEmails = ['test@example.com', 'user@test.com', 'admin@site.com'];

export const checkEmailDuplicate = async (email: string): Promise<boolean> => {
  // 실제 API 호출을 시뮬레이션
  return new Promise((resolve) => {
    setTimeout(() => {
      const isDuplicate = existingEmails.includes(email.toLowerCase());
      resolve(isDuplicate);
    }, 800); // 0.8초 지연
  });
};

// 전화번호 포맷팅 함수
export const formatPhoneNumber = (phone: string): string => {
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '');
  
  // 11자리 휴대폰 번호 형식으로 변환
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  
  return phone;
};