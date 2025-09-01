import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import type { SearchResult } from '../types/search';
import { searchMockData } from '../data/mockData';
import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';

const RealtimeSearch: React.FC = () => {
  // 상태 관리
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 타이머 ID를 저장하기 위한 ref
  const debounceTimer = useRef<number | null>(null);

  // 검색 함수
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const searchResults = await searchMockData(searchQuery);
      setResults(searchResults);
      setShowResults(true);
      
      // 검색 기록에 추가 (중복 제거, 최대 5개)
      setHistory(prev => {
        const newHistory = prev.filter(item => item !== searchQuery);
        return [searchQuery, ...newHistory].slice(0, 5);
      });
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 디바운스를 적용한 검색
  useEffect(() => {
    // 이전 타이머가 있으면 취소
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 새로운 타이머 설정 (0.5초 후 실행)
    debounceTimer.current = setTimeout(() => {
      performSearch(query);
    }, 500);

    // 컴포넌트가 언마운트되거나 query가 변경될 때 타이머 정리
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  // 입력 필드 변경 처리
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // 검색어 초기화
  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  // 검색 기록 클릭
  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
  };

  // 검색 기록 개별 삭제
  const handleHistoryDelete = (historyQuery: string) => {
    setHistory(prev => prev.filter(item => item !== historyQuery));
  };

  // 검색 기록 전체 삭제
  const handleHistoryClear = () => {
    setHistory([]);
  };

  return (
    <Box>
      {/* 헤더 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          실시간 검색
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          검색어를 입력하면 0.5초 후 자동으로 검색됩니다
        </Typography>
        
        {/* 검색 가이드 */}
        <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="subtitle2" gutterBottom>
            💡 검색 예시:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {['React', 'JavaScript', 'Python', 'Node.js', '데이터베이스', '머신러닝', 'AWS', 'Docker'].map((example) => (
              <Typography 
                key={example}
                variant="caption" 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  cursor: 'pointer'
                }}
                onClick={() => setQuery(example)}
              >
                {example}
              </Typography>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" mt={1} display="block">
            제목, 설명, 카테고리에서 검색됩니다. 총 100개의 프로그래밍 관련 자료가 있습니다.
          </Typography>
        </Box>
      </Paper>

      {/* 검색 입력 필드 */}
      <Paper elevation={1} sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="검색어를 입력하세요..."
          value={query}
          onChange={handleQueryChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <SearchIcon />
                )}
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <ClearIcon
                  sx={{ cursor: 'pointer' }}
                  onClick={handleClearSearch}
                />
              </InputAdornment>
            ),
          }}
        />

        {/* 검색 기록 (검색어가 없을 때만 표시) */}
        {!query && !showResults && (
          <SearchHistory
            history={history}
            onHistoryClick={handleHistoryClick}
            onHistoryDelete={handleHistoryDelete}
            onHistoryClear={handleHistoryClear}
          />
        )}

        {/* 검색 결과 */}
        {showResults && query && (
          <SearchResults results={results} query={query} />
        )}
      </Paper>

      {/* 로딩 상태 표시 */}
      {isLoading && (
        <Paper elevation={1} sx={{ mt: 1 }}>
          <Box p={3} display="flex" alignItems="center" justifyContent="center">
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography color="text.secondary">
              검색 중...
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default RealtimeSearch;