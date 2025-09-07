import React from 'react'
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Paper
} from '@mui/material'
import {
  Person,
  LocationOn,
  ShoppingCart,
  Article,
  Business,
  Search,
  TrendingUp
} from '@mui/icons-material'
import { SearchItem, SearchCategory } from '../types'
import { useSearch } from '../hooks/useSearch'
import { highlightSearchTerm, getCategoryIcon } from '../utils/searchUtils'

const iconComponents = {
  Person,
  LocationOn,
  ShoppingCart,
  Article,
  Business,
  Search
}

export default function SearchAutocomplete() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    recentSearches,
    popularSearches,
    loading,
    addToRecentSearches
  } = useSearch()

  const handleSearchSelect = (value: SearchItem | string | null) => {
    if (value) {
      const searchTerm = typeof value === 'string' ? value : value.title
      addToRecentSearches(searchTerm)
      setSearchQuery(searchTerm)
    }
  }

  const getIconComponent = (category: SearchCategory) => {
    const iconName = getCategoryIcon(category) as keyof typeof iconComponents
    const IconComponent = iconComponents[iconName] || Search
    return <IconComponent fontSize="small" />
  }

  // 자동완성 옵션 구성
  const getAutocompleteOptions = () => {
    const options: Array<SearchItem | { type: 'section'; title: string }> = []

    // 검색 결과가 있으면 표시
    if (searchQuery && searchResults.length > 0) {
      options.push({ type: 'section', title: '검색 결과' })
      options.push(...searchResults)
    }

    // 검색어가 없고 최근 검색어가 있으면 표시
    if (!searchQuery && recentSearches.length > 0) {
      options.push({ type: 'section', title: '최근 검색어' })
      options.push(...recentSearches.map(recent => ({
        id: `recent-${recent.id}`,
        title: recent.query,
        category: 'article' as SearchCategory,
        popularity: 0
      })))
    }

    // 인기 검색어 표시
    if (!searchQuery && popularSearches.length > 0) {
      options.push({ type: 'section', title: '인기 검색어' })
      options.push(...popularSearches.map((query, index) => ({
        id: `popular-${index}`,
        title: query,
        category: 'article' as SearchCategory,
        popularity: 100 - index * 5
      })))
    }

    return options
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Autocomplete
        freeSolo
        options={getAutocompleteOptions()}
        loading={loading}
        inputValue={searchQuery}
        onInputChange={(_, newInputValue) => {
          setSearchQuery(newInputValue)
        }}
        onChange={(_, value) => {
          handleSearchSelect(value)
        }}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option
          if ('type' in option) return option.title
          return option.title
        }}
        groupBy={(option) => {
          if ('type' in option) return option.title
          return ''
        }}
        renderGroup={(params) => (
          <Box key={params.key}>
            {params.group && (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: 'grey.100',
                  borderBottom: 1,
                  borderColor: 'grey.200'
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  {params.group}
                </Typography>
              </Box>
            )}
            {params.children}
          </Box>
        )}
        renderOption={(props, option, { inputValue }) => {
          if ('type' in option) return null

          const searchItem = option as SearchItem
          
          // key를 분리하여 직접 전달
          const { key, ...otherProps } = props
          
          return (
            <Box 
              component="li" 
              key={key}
              {...otherProps}
              sx={{ display: 'flex', alignItems: 'center', py: 1 }}
            >
              <Box sx={{ mr: 2, color: 'text.secondary' }}>
                {getIconComponent(searchItem.category)}
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="body1"
                  sx={{ 
                    fontWeight: 500,
                    '& mark': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      padding: '0 2px',
                      borderRadius: '2px'
                    }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerm(searchItem.title, inputValue)
                  }}
                />
                {searchItem.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(searchItem.description, inputValue)
                    }}
                  />
                )}
              </Box>
              {searchItem.popularity > 80 && (
                <Box sx={{ ml: 1 }}>
                  <Chip
                    icon={<TrendingUp />}
                    label="인기"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              )}
            </Box>
          )
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="검색어를 입력하세요..."
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <Box sx={{ mr: 1, color: 'text.secondary' }}>
                  <Search />
                </Box>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'background.paper'
              }
            }}
          />
        )}
        PaperComponent={(props) => (
          <Paper
            {...props}
            sx={{
              mt: 1,
              borderRadius: 2,
              boxShadow: 3,
              maxHeight: 400,
              overflow: 'auto'
            }}
          />
        )}
        ListboxProps={{
          sx: { padding: 0 }
        }}
        noOptionsText={
          searchQuery ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="text.secondary">
                '{searchQuery}'에 대한 검색 결과가 없습니다.
              </Typography>
            </Box>
          ) : null
        }
      />
    </Box>
  )
}