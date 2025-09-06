import axios from 'axios';
import { Post, PostCreateRequest, PostUpdateRequest, PageResponse } from '../types';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (로깅용)
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('📡 API Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error);
    
    // 네트워크 오류 처리
    if (!error.response) {
      throw new Error('네트워크 연결을 확인해주세요.');
    }

    // 서버 에러 메시지 처리
    const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
    throw new Error(message);
  }
);

/**
 * 게시글 API 서비스
 */
export const postApi = {
  /**
   * 게시글 목록 조회 (페이지네이션)
   */
  getPosts: async (page = 0, size = 10): Promise<PageResponse<Post>> => {
    const response = await api.get(`/posts?page=${page}&size=${size}`);
    return response.data;
  },

  /**
   * 게시글 상세 조회
   */
  getPost: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  /**
   * 게시글 작성
   */
  createPost: async (post: PostCreateRequest): Promise<Post> => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  /**
   * 게시글 수정
   */
  updatePost: async (id: number, post: PostUpdateRequest): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  },

  /**
   * 게시글 삭제
   */
  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};