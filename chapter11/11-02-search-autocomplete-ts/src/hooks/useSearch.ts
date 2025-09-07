import { useState, useEffect, useCallback } from 'react'
import { SearchItem, RecentSearch, SearchHistory } from '../types'
import { mockSearchData } from '../data/mockData'
import { useDebounce } from './useDebounce'

const STORAGE_KEY = 'search-history'
const MAX_RECENT_SEARCHES = 10

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // 로컬스토리지에서 검색 히스토리 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const history: SearchHistory = JSON.parse(stored)
        setRecentSearches(history.recentSearches || [])
        setPopularSearches(history.popularSearches || [])
      } catch (error) {
        console.error('Failed to parse search history:', error)
      }
    }
    
    // 초기 인기 검색어 설정
    if (popularSearches.length === 0) {
      const popular = ['React', 'TypeScript', 'Material-UI', 'JavaScript', 'Node.js']
      setPopularSearches(popular)
    }
  }, [])

  // 검색 히스토리를 로컬스토리지에 저장
  const saveSearchHistory = useCallback((recent: RecentSearch[], popular: string[]) => {
    const history: SearchHistory = {
      recentSearches: recent,
      popularSearches: popular
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [])

  // 실시간 검색 실행
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    
    // 실제 API 호출을 시뮬레이션
    const searchTimeout = setTimeout(() => {
      const filteredResults = mockSearchData.filter(item =>
        item.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      ).slice(0, 10) // 최대 10개 결과

      setSearchResults(filteredResults)
      setLoading(false)
    }, 200)

    return () => {
      clearTimeout(searchTimeout)
      setLoading(false)
    }
  }, [debouncedSearchQuery])

  // 최근 검색어에 추가
  const addToRecentSearches = useCallback((query: string) => {
    if (!query.trim()) return

    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: Date.now()
    }

    setRecentSearches(prev => {
      // 중복 제거 후 최신순으로 정렬
      const filtered = prev.filter(item => item.query !== newSearch.query)
      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES)
      
      // 로컬스토리지에 저장
      saveSearchHistory(updated, popularSearches)
      
      return updated
    })
  }, [saveSearchHistory, popularSearches])

  // 최근 검색어 삭제
  const removeRecentSearch = useCallback((id: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.id !== id)
      saveSearchHistory(updated, popularSearches)
      return updated
    })
  }, [saveSearchHistory, popularSearches])

  // 최근 검색어 전체 삭제
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    saveSearchHistory([], popularSearches)
  }, [saveSearchHistory, popularSearches])

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    recentSearches,
    popularSearches,
    loading,
    addToRecentSearches,
    removeRecentSearch,
    clearRecentSearches
  }
}