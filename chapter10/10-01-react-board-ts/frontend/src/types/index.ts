/**
 * 게시글 타입 정의
 */
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 게시글 생성 요청 타입
 */
export interface PostCreateRequest {
  title: string;
  content: string;
  author: string;
}

/**
 * 게시글 수정 요청 타입
 */
export interface PostUpdateRequest {
  title: string;
  content: string;
}

/**
 * 페이지네이션 응답 타입 (백엔드 응답과 일치)
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * API 에러 응답 타입
 */
export interface ApiError {
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}