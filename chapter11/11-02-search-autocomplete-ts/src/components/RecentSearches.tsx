import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Divider
} from '@mui/material'
import {
  History,
  Close,
  Clear,
  TrendingUp
} from '@mui/icons-material'
import { useSearch } from '../hooks/useSearch'
import { formatTimeAgo } from '../utils/searchUtils'

export default function RecentSearches() {
  const {
    recentSearches,
    popularSearches,
    removeRecentSearch,
    clearRecentSearches,
    setSearchQuery,
    addToRecentSearches
  } = useSearch()

  const handleSearchClick = (query: string) => {
    setSearchQuery(query)
    addToRecentSearches(query)
  }

  if (recentSearches.length === 0 && popularSearches.length === 0) {
    return null
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      {/* 최근 검색어 섹션 */}
      {recentSearches.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History color="action" />
              <Typography variant="h6" fontWeight="bold">
                최근 검색어
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={clearRecentSearches}
              startIcon={<Clear />}
              color="error"
              variant="outlined"
            >
              전체 삭제
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {recentSearches.map((search) => (
              <Chip
                key={search.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>{search.query}</span>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      • {formatTimeAgo(search.timestamp)}
                    </Typography>
                  </Box>
                }
                onClick={() => handleSearchClick(search.query)}
                onDelete={() => removeRecentSearch(search.id)}
                deleteIcon={<Close />}
                variant="outlined"
                clickable
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              />
            ))}
          </Box>
        </>
      )}

      {/* 구분선 */}
      {recentSearches.length > 0 && popularSearches.length > 0 && (
        <Divider sx={{ my: 2 }} />
      )}

      {/* 인기 검색어 섹션 */}
      {popularSearches.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TrendingUp color="primary" />
            <Typography variant="h6" fontWeight="bold" color="primary">
              인기 검색어
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {popularSearches.map((query, index) => (
              <Chip
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <span>{query}</span>
                  </Box>
                }
                onClick={() => handleSearchClick(query)}
                color="primary"
                variant="outlined"
                clickable
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Paper>
  )
}