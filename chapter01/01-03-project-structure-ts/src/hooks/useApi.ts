import { useState, useEffect } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>(url: string, immediate = true) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // 실제로는 fetch나 axios를 사용
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 더미 데이터 (URL에 따라 다른 데이터 반환)
      let dummyData: any;
      if (url.includes('dashboard')) {
        dummyData = {
          totalUsers: 1250,
          totalPosts: 342,
          totalViews: 15620,
          growth: 12.5,
        };
      } else if (url.includes('board')) {
        dummyData = [
          { id: 1, title: 'React 18의 새로운 기능들', author: '김개발자', date: '2024-01-15' },
          { id: 2, title: 'TypeScript와 함께하는 React 개발', author: '이프론트', date: '2024-01-14' },
          { id: 3, title: 'Material-UI 디자인 시스템 구축하기', author: '박디자인', date: '2024-01-13' },
          { id: 4, title: 'Next.js 13 App Router 완벽 가이드', author: '최풀스택', date: '2024-01-12' },
          { id: 5, title: 'React Query로 서버 상태 관리하기', author: '정백엔드', date: '2024-01-11' },
          { id: 6, title: 'Vite를 활용한 빠른 React 개발', author: '김빌드러', date: '2024-01-10' },
          { id: 7, title: 'React Hook의 올바른 사용법', author: '이훅마스터', date: '2024-01-09' },
          { id: 8, title: 'CSS-in-JS vs CSS Modules 비교', author: '박스타일러', date: '2024-01-08' },
          { id: 9, title: '웹 접근성을 고려한 React 컴포넌트', author: '최접근성', date: '2024-01-07' },
          { id: 10, title: 'React Testing Library 단위 테스트', author: '정테스터', date: '2024-01-06' },
          { id: 11, title: 'Redux Toolkit으로 상태 관리 개선', author: '김리덕스', date: '2024-01-05' },
          { id: 12, title: 'React 성능 최적화 베스트 프랙티스', author: '이최적화', date: '2024-01-04' },
          { id: 13, title: 'GraphQL과 Apollo Client 사용법', author: '박그래프큐엘', date: '2024-01-03' },
          { id: 14, title: 'React Native 모바일 앱 개발 시작하기', author: '최모바일', date: '2024-01-02' },
          { id: 15, title: 'Storybook으로 컴포넌트 문서화하기', author: '정스토리북', date: '2024-01-01' },
          { id: 16, title: 'React Server Components 이해하기', author: '김서버', date: '2023-12-31' },
          { id: 17, title: 'ESLint와 Prettier 설정 가이드', author: '이린터', date: '2023-12-30' },
          { id: 18, title: 'React 18 Concurrent Features 활용', author: '박동시성', date: '2023-12-29' },
          { id: 19, title: 'Docker로 React 앱 배포하기', author: '최도커', date: '2023-12-28' },
          { id: 20, title: 'React 생태계 트렌드 2024', author: '정트렌드', date: '2023-12-27' },
        ];
      }
      
      setState({
        data: dummyData as T,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: '데이터를 불러오는데 실패했습니다.',
      });
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [url, immediate]);

  return {
    ...state,
    refetch: fetchData,
  };
};