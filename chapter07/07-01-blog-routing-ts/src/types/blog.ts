// 블로그 포스트 타입 정의
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: number; // 분 단위
  imageUrl?: string;
}

// 카테고리 타입
export type Category = 'tech' | 'design' | 'business' | 'life' | 'travel';

// 카테고리 정보
export interface CategoryInfo {
  value: Category;
  label: string;
  color: string;
  icon: string;
}

// 브레드크럼 아이템 타입
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}