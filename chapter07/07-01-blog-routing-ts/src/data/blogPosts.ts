import { BlogPost, Category, CategoryInfo } from '../types/blog';

// 카테고리 정보
export const categories: CategoryInfo[] = [
  {
    value: 'tech',
    label: '기술',
    color: '#2196F3',
    icon: '💻',
  },
  {
    value: 'design',
    label: '디자인',
    color: '#FF9800',
    icon: '🎨',
  },
  {
    value: 'business',
    label: '비즈니스',
    color: '#4CAF50',
    icon: '💼',
  },
  {
    value: 'life',
    label: '라이프',
    color: '#E91E63',
    icon: '🌱',
  },
  {
    value: 'travel',
    label: '여행',
    color: '#9C27B0',
    icon: '✈️',
  },
];

// 샘플 블로그 포스트 데이터
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'React 18의 새로운 기능들',
    excerpt: 'React 18에서 추가된 Concurrent Features와 Automatic Batching에 대해 알아보세요.',
    content: `# React 18의 새로운 기능들

React 18이 출시되면서 많은 새로운 기능들이 추가되었습니다. 이번 포스트에서는 가장 주목할 만한 기능들을 살펴보겠습니다.

## 1. Concurrent Features

React 18의 가장 큰 변화는 Concurrent Features의 도입입니다. 이를 통해 더 부드러운 사용자 경험을 제공할 수 있습니다.

### Suspense 개선
- 더 나은 로딩 상태 관리
- 중첩된 Suspense 경계 지원
- 서버 사이드 렌더링 개선

### useTransition Hook
사용자 입력에 대한 즉각적인 피드백을 제공하면서 무거운 작업을 백그라운드에서 처리할 수 있습니다.

\`\`\`jsx
const [isPending, startTransition] = useTransition();

const handleClick = () => {
  startTransition(() => {
    setTab(nextTab);
  });
};
\`\`\`

## 2. Automatic Batching

React 18에서는 모든 상태 업데이트가 자동으로 배치됩니다. 이는 성능 향상으로 이어집니다.

## 3. StrictMode 개선

개발 모드에서 더 엄격한 검사를 통해 잠재적인 문제를 미리 발견할 수 있습니다.

React 18은 현대적인 웹 개발에 필수적인 기능들을 제공합니다. 점진적으로 마이그레이션하여 이러한 기능들을 활용해보세요!`,
    author: '김개발',
    category: 'tech',
    tags: ['React', 'JavaScript', 'Frontend'],
    publishedAt: '2024-01-15',
    readingTime: 8,
    imageUrl: '💻',
  },
  {
    id: '2',
    title: 'UI/UX 디자인 트렌드 2024',
    excerpt: '2024년 주목해야 할 UI/UX 디자인 트렌드와 실무 적용 방법을 소개합니다.',
    content: `# UI/UX 디자인 트렌드 2024

2024년 디자인 업계에서 주목받고 있는 트렌드들을 정리해보았습니다.

## 1. 네오모피즘의 진화

부드러운 그림자와 하이라이트를 활용한 네오모피즘이 더욱 세련되게 발전하고 있습니다.

### 특징
- 미묘한 그림자 효과
- 부드러운 색상 전환
- 입체적인 요소들

## 2. 다크 모드의 표준화

이제 다크 모드는 선택이 아닌 필수가 되었습니다.

### 고려사항
- 접근성 향상
- 배터리 수명 개선
- 눈의 피로 감소

## 3. 마이크로 인터랙션

작은 애니메이션과 피드백이 사용자 경험을 크게 향상시킵니다.

### 예시
- 버튼 호버 효과
- 로딩 애니메이션
- 상태 변화 알림

## 4. 미니멀한 인터페이스

불필요한 요소를 제거하고 핵심에 집중하는 디자인이 트렌드입니다.

2024년에는 사용자 중심의 디자인이 더욱 중요해질 것입니다.`,
    author: '박디자인',
    category: 'design',
    tags: ['UI/UX', 'Design', 'Trend'],
    publishedAt: '2024-01-12',
    readingTime: 6,
    imageUrl: '🎨',
  },
  {
    id: '3',
    title: '스타트업 성장 전략',
    excerpt: '성공적인 스타트업을 위한 핵심 성장 전략과 실제 사례를 분석합니다.',
    content: `# 스타트업 성장 전략

스타트업이 성공하기 위해서는 체계적인 성장 전략이 필요합니다.

## 1. 제품-시장 적합성(PMF) 찾기

### 핵심 질문들
- 우리 제품이 정말 필요한가?
- 고객이 기꺼이 돈을 낼 만한 가치를 제공하는가?
- 시장 규모는 충분한가?

## 2. 린 스타트업 방법론

### 핵심 원칙
- Build-Measure-Learn 사이클
- 최소 기능 제품(MVP) 개발
- 빠른 실패와 학습

## 3. 성장 해킹 전략

### 주요 방법들
- 바이럴 마케팅
- 콘텐츠 마케팅
- 파트너십 구축
- 데이터 기반 의사결정

## 4. 팀 빌딩과 문화

성공하는 스타트업은 뛰어난 팀과 강한 문화를 가지고 있습니다.

### 중요한 요소들
- 공통된 비전과 가치
- 빠른 실행력
- 지속적인 학습 문화
- 투명한 소통

## 5. 자금 조달 전략

### 단계별 접근
1. 시드 자금: 가족, 친구, 엔젤 투자자
2. 시리즈 A: VC 투자 유치
3. 후속 라운드: 성장을 위한 추가 자금

성공적인 스타트업은 하루아침에 만들어지지 않습니다. 지속적인 노력과 올바른 전략이 필요합니다.`,
    author: '이비즈니스',
    category: 'business',
    tags: ['Startup', 'Business', 'Growth'],
    publishedAt: '2024-01-10',
    readingTime: 10,
    imageUrl: '💼',
  },
  {
    id: '4',
    title: '건강한 라이프스타일을 위한 10가지 습관',
    excerpt: '바쁜 일상 속에서도 실천할 수 있는 건강한 생활 습관들을 소개합니다.',
    content: `# 건강한 라이프스타일을 위한 10가지 습관

현대인의 바쁜 일상 속에서도 건강을 유지할 수 있는 실용적인 습관들을 소개합니다.

## 1. 규칙적인 수면 패턴

### 좋은 수면을 위한 팁
- 매일 같은 시간에 잠자리에 들기
- 침실 환경 최적화 (온도, 조명)
- 수면 전 디지털 기기 사용 자제

## 2. 균형 잡힌 식단

### 기본 원칙
- 다양한 색깔의 채소와 과일
- 적정량의 단백질 섭취
- 충분한 수분 섭취

## 3. 규칙적인 운동

### 운동의 종류
- 유산소 운동: 주 3-4회, 30분
- 근력 운동: 주 2-3회
- 스트레칭: 매일 10-15분

## 4. 스트레스 관리

### 효과적인 방법들
- 명상과 마음챙김
- 취미 활동
- 사회적 관계 유지

## 5. 시간 관리

### 생산성 향상 팁
- 우선순위 설정
- 시간 블로킹
- 디지털 디톡스

## 6. 지속적인 학습

평생 학습은 정신 건강에 매우 중요합니다.

## 7. 긍정적인 마인드셋

감사 일기 쓰기, 긍정적인 사람들과 시간 보내기 등이 도움이 됩니다.

## 8. 정기적인 건강 검진

예방이 치료보다 중요합니다.

## 9. 환경 정리

깔끔한 환경은 마음의 평안을 가져다 줍니다.

## 10. 자기 성찰 시간

매일 조금씩이라도 자신을 돌아보는 시간을 가져보세요.

작은 변화부터 시작해서 점진적으로 건강한 습관들을 만들어나가세요!`,
    author: '최라이프',
    category: 'life',
    tags: ['Health', 'Lifestyle', 'Habits'],
    publishedAt: '2024-01-08',
    readingTime: 7,
    imageUrl: '🌱',
  },
  {
    id: '5',
    title: '유럽 배낭여행 완벽 가이드',
    excerpt: '첫 유럽 배낭여행을 계획하는 분들을 위한 실용적인 가이드와 팁을 제공합니다.',
    content: `# 유럽 배낭여행 완벽 가이드

첫 유럽 배낭여행을 계획하고 계신가요? 이 가이드가 도움이 될 것입니다!

## 1. 여행 계획 세우기

### 기본 준비사항
- 여권 및 비자 확인
- 여행 보험 가입
- 항공편 예약
- 숙소 예약 (일부만)

## 2. 추천 루트

### 서유럽 클래식 루트 (3-4주)
1. **런던** (3일) - 대영박물관, 빅벤, 런던 아이
2. **파리** (4일) - 루브르, 에펠탑, 몽마르뜨
3. **암스테르담** (2일) - 운하, 박물관, 자전거 투어
4. **베를린** (3일) - 역사 탐방, 박물관 섬
5. **프라하** (2일) - 구시가지, 카를 다리
6. **비엔나** (2일) - 음악과 예술의 도시
7. **취리히/인터라켄** (3일) - 알프스 자연 경관
8. **로마** (3일) - 콜로세움, 바티칸
9. **바르셀로나** (3일) - 가우디 건축, 해변

## 3. 교통수단

### 유레일패스
- 장점: 자유로운 이동, 예약 불필요
- 단점: 비용이 높을 수 있음
- 팁: 여행 거리와 빈도를 계산해보세요

### 저비용 항공
- Ryanair, EasyJet 등 활용
- 수하물 정책 주의
- 공항 위치 확인 필수

## 4. 숙소 선택

### 호스텔
- 저렴한 비용
- 다양한 사람들과의 만남
- 공용 시설 이용

### 에어비앤비
- 현지인처럼 생활 경험
- 주방 이용 가능
- 장기 숙박시 할인

## 5. 짐 패킹 팁

### 필수 아이템
- 백팩 (40-60L 추천)
- 편한 신발 (최소 2켤레)
- 계절에 맞는 옷
- 충전기 및 어댑터
- 상비약

### 짐 줄이기 팁
- 다용도 아이템 선택
- 현지에서 구입 가능한 것들은 제외
- 세탁 가능한 소재 선택

## 6. 예산 관리

### 일일 예산 (1인 기준)
- 숙소: 20-40유로
- 식비: 25-35유로
- 교통: 15-25유로
- 관광: 10-20유로
- 기타: 10-15유로

### 절약 팁
- 마트에서 간단한 식재료 구입
- 무료 워킹 투어 참여
- 박물관 무료 입장일 활용
- 도시별 관광패스 구매 고려

## 7. 안전 수칙

### 기본 안전 수칙
- 여권 복사본 보관
- 비상 연락처 메모
- 소매치기 주의
- 야간 이동 자제

## 8. 현지 문화 존중

각 나라의 문화와 예절을 미리 알아보고 존중하는 자세가 중요합니다.

## 9. 추천 앱

- **교통**: Citymapper, Google Maps
- **숙소**: Hostelworld, Booking.com
- **언어**: Google Translate
- **환율**: XE Currency

## 10. 마지막 조언

완벽한 계획보다는 유연한 마음으로 여행을 즐기세요. 예상치 못한 경험들이 가장 소중한 추억이 될 것입니다!

안전하고 즐거운 여행 되세요! 🎒✈️`,
    author: '정여행',
    category: 'travel',
    tags: ['Travel', 'Europe', 'Backpacking'],
    publishedAt: '2024-01-05',
    readingTime: 12,
    imageUrl: '✈️',
  },
];

// 유틸리티 함수들
export const getPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getPostsByCategory = (category?: string): BlogPost[] => {
  if (!category || category === 'all') {
    return blogPosts;
  }
  return blogPosts.filter(post => post.category === category);
};

export const getCategoryInfo = (category: Category): CategoryInfo | undefined => {
  return categories.find(cat => cat.value === category);
};

export const getAllCategories = (): CategoryInfo[] => {
  return categories;
};