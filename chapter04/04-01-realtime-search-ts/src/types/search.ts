// 검색 결과 아이템 타입
export interface SearchResult {
  id: number;
  title: string;
  description: string;
  category: string;
}

// 검색 상태 타입
export interface SearchState {
  query: string;
  results: SearchResult[];
  history: string[];
  isLoading: boolean;
}