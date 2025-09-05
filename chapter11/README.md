# Chapter 11: CRUD 애플리케이션 - 게시판 시스템 구축

## 목차
1. [개요: Vue3 vs React CRUD 패턴](#개요)
2. [프로젝트 구조 설계](#프로젝트-구조)
3. [상태 관리 전략](#상태-관리)
4. [게시판 CRUD 구현](#게시판-crud)
5. [페이지네이션 구현](#페이지네이션)
6. [검색 및 필터링](#검색-필터링)
7. [파일 업로드](#파일-업로드)
8. [흔한 실수와 해결방법](#흔한-실수)
9. [실습 과제](#실습-과제)

---

## 개요: Vue3 vs React CRUD 패턴 {#개요}

### CRUD 애플리케이션 구현 방식 비교

| 구분 | Vue3 | React |
|------|------|-------|
| **상태 관리** | `ref`, `reactive` | `useState`, `useReducer` |
| **비동기 처리** | `async/await` in setup | `useEffect` + `async/await` |
| **폼 바인딩** | `v-model` 양방향 | `value` + `onChange` 단방향 |
| **조건부 렌더링** | `v-if`, `v-show` | 삼항 연산자, `&&` |
| **리스트 렌더링** | `v-for` | `map()` 함수 |
| **이벤트 핸들링** | `@click` | `onClick` |

### 데이터 흐름 비교

```javascript
// Vue3 - 양방향 데이터 바인딩
<template>
  <input v-model="title" />
  <!-- title이 자동으로 업데이트 -->
</template>

<script setup>
import { ref } from 'vue'
const title = ref('')
</script>
```

```javascript
// React - 단방향 데이터 흐름
function Component() {
  const [title, setTitle] = useState('')
  
  return (
    <input 
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  )
}
```

---

## 프로젝트 구조 설계 {#프로젝트-구조}

### 폴더 구조
```
src/
├── components/
│   ├── board/
│   │   ├── BoardList.tsx       # 게시글 목록
│   │   ├── BoardForm.tsx       # 게시글 작성/수정 폼
│   │   ├── BoardDetail.tsx     # 게시글 상세
│   │   └── BoardSearch.tsx     # 검색/필터
│   └── common/
│       ├── Pagination.tsx      # 페이지네이션
│       └── FileUpload.tsx      # 파일 업로드
├── hooks/
│   ├── useBoard.ts            # 게시판 로직
│   ├── usePagination.ts       # 페이지네이션
│   └── useFileUpload.ts       # 파일 업로드
├── services/
│   └── boardService.ts        # API 호출
├── types/
│   └── board.types.ts         # 타입 정의
└── utils/
    └── storage.ts              # 로컬 스토리지
```

---

## 상태 관리 전략 {#상태-관리}

### 타입 정의

```typescript
// types/board.types.ts
export interface Post {
  id: string
  title: string
  content: string
  author: string
  category: 'notice' | 'general' | 'question'
  tags: string[]
  attachments?: File[]
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface BoardFilters {
  category?: string
  searchTerm?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}
```

---

## 게시판 CRUD 구현 {#게시판-crud}

### 1. 게시판 Custom Hook

```typescript
// hooks/useBoard.ts
import { useState, useEffect, useCallback } from 'react'
import { Post, BoardFilters } from '../types/board.types'
import * as boardService from '../services/boardService'

export function useBoard() {
  // 상태 관리 - Vue의 ref와 유사하지만 setter 함수 필요
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  
  // 게시글 목록 조회
  const fetchPosts = useCallback(async (filters?: BoardFilters) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await boardService.getPosts(filters)
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다')
      console.error('게시글 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // 게시글 생성
  const createPost = useCallback(async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => {
    setLoading(true)
    setError(null)
    
    try {
      const newPost = await boardService.createPost(postData)
      // 새 게시글을 목록에 추가 - Vue의 반응성과 다르게 새 배열 생성 필요
      setPosts(prev => [newPost, ...prev])
      return newPost
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 작성 실패')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
  
  // 게시글 수정
  const updatePost = useCallback(async (id: string, updates: Partial<Post>) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedPost = await boardService.updatePost(id, updates)
      // 불변성 유지하며 업데이트 - Vue와 다른 점
      setPosts(prev => prev.map(post => 
        post.id === id ? updatedPost : post
      ))
      return updatedPost
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 수정 실패')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
  
  // 게시글 삭제
  const deletePost = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await boardService.deletePost(id)
      // filter로 새 배열 생성 - React의 불변성 원칙
      setPosts(prev => prev.filter(post => post.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 삭제 실패')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
  
  // 초기 데이터 로드 - Vue의 onMounted와 유사
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])
  
  return {
    posts,
    loading,
    error,
    selectedPost,
    setSelectedPost,
    fetchPosts,
    createPost,
    updatePost,
    deletePost
  }
}
```

### 2. 게시글 목록 컴포넌트

```typescript
// components/board/BoardList.tsx
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { Post } from '../../types/board.types'

interface BoardListProps {
  posts: Post[]
  loading: boolean
  error: string | null
  onEdit: (post: Post) => void
  onDelete: (id: string) => void
  onView: (post: Post) => void
}

export function BoardList({ 
  posts, 
  loading, 
  error,
  onEdit, 
  onDelete, 
  onView 
}: BoardListProps) {
  
  // 카테고리별 색상 매핑
  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'error' | 'warning' | 'info'> = {
      notice: 'error',
      question: 'warning',
      general: 'info'
    }
    return colors[category] || 'default'
  }
  
  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR')
  }
  
  // 로딩 상태
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    )
  }
  
  // 에러 상태
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }
  
  // 빈 상태
  if (!posts.length) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="body1" color="text.secondary">
          게시글이 없습니다.
        </Typography>
      </Box>
    )
  }
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>번호</TableCell>
            <TableCell>카테고리</TableCell>
            <TableCell>제목</TableCell>
            <TableCell>작성자</TableCell>
            <TableCell align="center">조회수</TableCell>
            <TableCell>작성일</TableCell>
            <TableCell align="center">작업</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post, index) => (
            <TableRow 
              key={post.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onView(post)}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Chip 
                  label={post.category} 
                  size="small"
                  color={getCategoryColor(post.category)}
                />
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">
                    {post.title}
                  </Typography>
                  {post.tags.length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      {post.tags.map(tag => (
                        <Chip 
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, height: 20 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell align="center">{post.viewCount}</TableCell>
              <TableCell>{formatDate(post.createdAt)}</TableCell>
              <TableCell align="center">
                <Tooltip title="수정">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()  // 이벤트 전파 중단
                      onEdit(post)
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="삭제">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm('정말 삭제하시겠습니까?')) {
                        onDelete(post.id)
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
```

### 3. 게시글 폼 컴포넌트

```typescript
// components/board/BoardForm.tsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Stack
} from '@mui/material'
import { Post } from '../../types/board.types'

interface BoardFormProps {
  open: boolean
  post?: Post | null  // 수정할 게시글 (없으면 신규 작성)
  onClose: () => void
  onSubmit: (data: Partial<Post>) => Promise<void>
}

export function BoardForm({ open, post, onClose, onSubmit }: BoardFormProps) {
  // 폼 상태 - Vue의 v-model과 달리 각 필드마다 state 필요
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'general' as Post['category'],
    tags: [] as string[]
  })
  
  const [tagInput, setTagInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        tags: post.tags
      })
    } else {
      // 신규 작성 모드 - 폼 초기화
      setFormData({
        title: '',
        content: '',
        author: '',
        category: 'general',
        tags: []
      })
    }
  }, [post])
  
  // 입력 핸들러 - Vue의 v-model을 수동으로 구현
  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }
  
  // 카테고리 변경
  const handleCategoryChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      category: event.target.value
    }))
  }
  
  // 태그 추가
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }))
      setTagInput('')
    }
  }
  
  // 태그 삭제
  const handleDeleteTag = (tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }))
  }
  
  // 유효성 검사
  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    }
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요'
    }
    if (!formData.author.trim()) {
      newErrors.author = '작성자를 입력해주세요'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // 폼 제출
  const handleSubmit = async () => {
    if (!validate()) return
    
    setSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('제출 실패:', error)
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {post ? '게시글 수정' : '게시글 작성'}
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* 제목 입력 */}
          <TextField
            label="제목"
            value={formData.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
          />
          
          {/* 작성자 입력 */}
          <TextField
            label="작성자"
            value={formData.author}
            onChange={handleChange('author')}
            error={!!errors.author}
            helperText={errors.author}
            fullWidth
            required
          />
          
          {/* 카테고리 선택 */}
          <FormControl fullWidth>
            <InputLabel>카테고리</InputLabel>
            <Select
              value={formData.category}
              label="카테고리"
              onChange={handleCategoryChange}
            >
              <MenuItem value="notice">공지사항</MenuItem>
              <MenuItem value="general">일반</MenuItem>
              <MenuItem value="question">질문</MenuItem>
            </Select>
          </FormControl>
          
          {/* 내용 입력 */}
          <TextField
            label="내용"
            value={formData.content}
            onChange={handleChange('content')}
            error={!!errors.content}
            helperText={errors.content}
            multiline
            rows={8}
            fullWidth
            required
          />
          
          {/* 태그 입력 */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="태그"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button 
                onClick={handleAddTag}
                variant="outlined"
                size="small"
              >
                추가
              </Button>
            </Stack>
            
            {/* 태그 목록 */}
            <Box sx={{ mt: 1 }}>
              {formData.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? '저장 중...' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
```

---

## 페이지네이션 구현 {#페이지네이션}

```typescript
// components/common/Pagination.tsx
import React from 'react'
import {
  Pagination as MuiPagination,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Box
} from '@mui/material'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) {
  
  // 표시할 아이템 범위 계산
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  return (
    <Stack 
      direction="row" 
      spacing={2} 
      alignItems="center" 
      justifyContent="space-between"
      sx={{ mt: 2, mb: 2 }}
    >
      {/* 아이템 정보 */}
      <Typography variant="body2" color="text.secondary">
        전체 {totalItems}개 중 {startItem}-{endItem}개 표시
      </Typography>
      
      {/* 페이지네이션 컨트롤 */}
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
      />
      
      {/* 페이지당 아이템 수 선택 */}
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2">표시 개수:</Typography>
        <FormControl size="small">
          <Select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Stack>
  )
}
```

---

## 검색 및 필터링 {#검색-필터링}

```typescript
// components/board/BoardSearch.tsx
import React, { useState, useCallback } from 'react'
import {
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Chip,
  InputAdornment,
  IconButton,
  Collapse,
  Box
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'
import { BoardFilters } from '../../types/board.types'
import { useDebounce } from '../../hooks/useDebounce'

interface BoardSearchProps {
  onSearch: (filters: BoardFilters) => void
  onReset: () => void
}

export function BoardSearch({ onSearch, onReset }: BoardSearchProps) {
  // 필터 상태
  const [filters, setFilters] = useState<BoardFilters>({
    searchTerm: '',
    category: '',
    tags: []
  })
  
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [tagInput, setTagInput] = useState('')
  
  // 검색어 디바운싱 - 입력 후 500ms 후에 검색
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500)
  
  // 디바운싱된 검색어가 변경될 때 검색 실행
  React.useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      onSearch(filters)
    }
  }, [debouncedSearchTerm])
  
  // 검색어 변경
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      searchTerm: event.target.value
    }
    setFilters(newFilters)
  }
  
  // 카테고리 변경
  const handleCategoryChange = (event: any) => {
    const newFilters = {
      ...filters,
      category: event.target.value
    }
    setFilters(newFilters)
    onSearch(newFilters)  // 즉시 검색
  }
  
  // 태그 추가
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !filters.tags?.includes(trimmedTag)) {
      const newFilters = {
        ...filters,
        tags: [...(filters.tags || []), trimmedTag]
      }
      setFilters(newFilters)
      setTagInput('')
      onSearch(newFilters)
    }
  }
  
  // 태그 삭제
  const handleDeleteTag = (tagToDelete: string) => {
    const newFilters = {
      ...filters,
      tags: filters.tags?.filter(tag => tag !== tagToDelete)
    }
    setFilters(newFilters)
    onSearch(newFilters)
  }
  
  // 필터 초기화
  const handleReset = () => {
    setFilters({
      searchTerm: '',
      category: '',
      tags: []
    })
    onReset()
  }
  
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack spacing={2}>
        {/* 기본 검색 */}
        <Stack direction="row" spacing={2}>
          <TextField
            placeholder="제목, 내용, 작성자 검색..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, searchTerm: '' }))
                      onSearch({ ...filters, searchTerm: '' })
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            고급 필터
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
          >
            초기화
          </Button>
        </Stack>
        
        {/* 고급 필터 */}
        <Collapse in={showAdvanced}>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {/* 카테고리 필터 */}
            <FormControl size="small" sx={{ width: 200 }}>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={filters.category}
                label="카테고리"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value="notice">공지사항</MenuItem>
                <MenuItem value="general">일반</MenuItem>
                <MenuItem value="question">질문</MenuItem>
              </Select>
            </FormControl>
            
            {/* 태그 필터 */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  label="태그 필터"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  size="small"
                  sx={{ width: 200 }}
                />
                <Button 
                  onClick={handleAddTag}
                  variant="outlined"
                  size="small"
                >
                  추가
                </Button>
              </Stack>
              
              {/* 선택된 태그 */}
              {filters.tags && filters.tags.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {filters.tags.map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleDeleteTag(tag)}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  )
}

// hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])
  
  return debouncedValue
}
```

---

## 파일 업로드 {#파일-업로드}

```typescript
// components/common/FileUpload.tsx
import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  LinearProgress,
  Alert,
  Paper
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material'

interface FileUploadProps {
  multiple?: boolean
  accept?: string
  maxSize?: number  // MB 단위
  maxFiles?: number
  onUpload: (files: File[]) => void
  onRemove?: (index: number) => void
  files?: File[]
}

export function FileUpload({
  multiple = true,
  accept = '*',
  maxSize = 10,  // 기본 10MB
  maxFiles = 5,
  onUpload,
  onRemove,
  files = []
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  
  // 파일 아이콘 선택
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon />
    if (file.type === 'application/pdf') return <PdfIcon />
    return <FileIcon />
  }
  
  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  // 파일 유효성 검사
  const validateFiles = (fileList: FileList | File[]): File[] => {
    const validFiles: File[] = []
    const newErrors: string[] = []
    const filesArray = Array.from(fileList)
    
    // 파일 개수 체크
    if (files.length + filesArray.length > maxFiles) {
      newErrors.push(`최대 ${maxFiles}개 파일만 업로드 가능합니다`)
      setErrors(newErrors)
      return []
    }
    
    filesArray.forEach(file => {
      // 파일 크기 체크
      if (file.size > maxSize * 1024 * 1024) {
        newErrors.push(`${file.name}: 파일 크기는 ${maxSize}MB를 초과할 수 없습니다`)
        return
      }
      
      // 파일 타입 체크 (accept 속성이 설정된 경우)
      if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
        newErrors.push(`${file.name}: 지원하지 않는 파일 형식입니다`)
        return
      }
      
      // 중복 체크
      if (files.some(f => f.name === file.name)) {
        newErrors.push(`${file.name}: 이미 추가된 파일입니다`)
        return
      }
      
      validFiles.push(file)
    })
    
    setErrors(newErrors)
    return validFiles
  }
  
  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const validFiles = validateFiles(event.target.files)
      if (validFiles.length > 0) {
        onUpload(validFiles)
      }
    }
    // input 초기화 (같은 파일 재선택 가능하도록)
    event.target.value = ''
  }
  
  // 드래그 앤 드롭 핸들러
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }
  
  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }
  
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    if (event.dataTransfer.files) {
      const validFiles = validateFiles(event.dataTransfer.files)
      if (validFiles.length > 0) {
        onUpload(validFiles)
      }
    }
  }
  
  // 파일 삭제
  const handleRemove = (index: number) => {
    if (onRemove) {
      onRemove(index)
    }
  }
  
  return (
    <Box>
      {/* 드래그 앤 드롭 영역 */}
      <Paper
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'divider',
          bgcolor: dragOver ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s',
          textAlign: 'center'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          파일을 드래그하거나 클릭하여 업로드
        </Typography>
        <Typography variant="body2" color="text.secondary">
          최대 {maxFiles}개, 각 {maxSize}MB까지 업로드 가능
        </Typography>
      </Paper>
      
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {/* 에러 메시지 */}
      {errors.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {errors.map((error, index) => (
            <Alert 
              key={index} 
              severity="error" 
              onClose={() => {
                setErrors(prev => prev.filter((_, i) => i !== index))
              }}
              sx={{ mb: 1 }}
            >
              {error}
            </Alert>
          ))}
        </Box>
      )}
      
      {/* 업로드 진행 상태 */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            업로드 중...
          </Typography>
        </Box>
      )}
      
      {/* 파일 목록 */}
      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((file, index) => (
            <ListItem key={index} divider>
              <ListItemIcon>
                {getFileIcon(file)}
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={formatFileSize(file.size)}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleRemove(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

// hooks/useFileUpload.ts
import { useState, useCallback } from 'react'

export function useFileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // 파일 추가
  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles])
  }, [])
  
  // 파일 제거
  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])
  
  // 파일 업로드 시뮬레이션
  const uploadFiles = useCallback(async () => {
    setUploading(true)
    setProgress(0)
    
    try {
      // 실제 업로드 로직 구현
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])
        
        // API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProgress((i + 1) / files.length * 100)
      }
      
      return true
    } catch (error) {
      console.error('업로드 실패:', error)
      return false
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [files])
  
  // 초기화
  const reset = useCallback(() => {
    setFiles([])
    setProgress(0)
  }, [])
  
  return {
    files,
    uploading,
    progress,
    addFiles,
    removeFile,
    uploadFiles,
    reset
  }
}
```

---

## 흔한 실수와 해결방법 {#흔한-실수}

### 1. 상태 업데이트 불변성 위반

```typescript
// ❌ 잘못된 예시 - 직접 수정
function Component() {
  const [posts, setPosts] = useState([])
  
  const updatePost = (id, updates) => {
    const post = posts.find(p => p.id === id)
    post.title = updates.title  // 직접 수정 - React가 변경 감지 못함
    setPosts(posts)  // 같은 참조 -> 리렌더링 안됨
  }
}

// ✅ 올바른 예시 - 새 배열/객체 생성
function Component() {
  const [posts, setPosts] = useState([])
  
  const updatePost = (id, updates) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, ...updates }  // 새 객체 생성
        : post
    ))
  }
}
```

### 2. 비동기 처리 실수

```typescript
// ❌ 잘못된 예시 - cleanup 없음
useEffect(() => {
  fetch('/api/posts')
    .then(res => res.json())
    .then(data => setPosts(data))  // 컴포넌트 언마운트 후 setState 시도
}, [])

// ✅ 올바른 예시 - AbortController 사용
useEffect(() => {
  const controller = new AbortController()
  
  fetch('/api/posts', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setPosts(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err)
      }
    })
  
  return () => controller.abort()
}, [])
```

### 3. 이벤트 핸들러 바인딩

```typescript
// ❌ 잘못된 예시 - 매 렌더링마다 새 함수
<Button onClick={() => handleDelete(post.id)}>삭제</Button>

// ✅ 올바른 예시 - useCallback 사용
const handleDelete = useCallback((id: string) => {
  // 삭제 로직
}, [dependencies])

<Button onClick={() => handleDelete(post.id)}>삭제</Button>
```

### 4. 폼 상태 관리

```typescript
// ❌ 잘못된 예시 - 각 필드마다 state
const [title, setTitle] = useState('')
const [content, setContent] = useState('')
const [author, setAuthor] = useState('')
// ... 필드가 많아질수록 복잡

// ✅ 올바른 예시 - 하나의 객체로 관리
const [formData, setFormData] = useState({
  title: '',
  content: '',
  author: ''
})

const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [field]: e.target.value
  }))
}
```

---

## 실습 과제 {#실습-과제}

### 과제 1: 댓글 시스템 추가 (난이도: 쉬움)

**요구사항:**
- 게시글에 댓글 기능 추가
- 댓글 CRUD 구현
- 댓글 개수 표시
- Material-UI 컴포넌트 사용

**구현해야 할 기능:**
```typescript
interface Comment {
  id: string
  postId: string
  content: string
  author: string
  createdAt: Date
  parentId?: string  // 대댓글용
}

// useComments Hook 인터페이스
const {
  comments,
  loading,
  error,
  addComment,
  updateComment,
  deleteComment,
  getCommentsByPostId
} = useComments()
```

**컴포넌트 요구사항:**
- 댓글 목록 표시
- 댓글 작성 폼
- 댓글 수정/삭제 기능
- 작성 시간 표시 (몇 분 전, 몇 시간 전 형식)

### 과제 2: 실시간 검색 자동완성 구현 (난이도: 보통)

**요구사항:**
- 검색어 입력시 실시간 자동완성
- 최근 검색어 저장 (localStorage)
- 인기 검색어 표시
- 검색 결과 하이라이팅

**구현해야 할 기능:**
```typescript
interface SearchSuggestion {
  type: 'recent' | 'popular' | 'result'
  text: string
  count?: number  // 검색 결과 수
}

// useSearchAutocomplete Hook 인터페이스
const {
  suggestions,
  loading,
  searchTerm,
  setSearchTerm,
  recentSearches,
  popularSearches,
  clearRecentSearches,
  handleSearch
} = useSearchAutocomplete({
  debounceDelay: 300,
  maxSuggestions: 10,
  maxRecentSearches: 5
})
```

**UI 요구사항:**
- Material-UI Autocomplete 컴포넌트 활용
- 검색어 타입별 다른 아이콘 표시
- 키보드 네비게이션 지원
- 모바일 반응형 디자인

**힌트:**
- `useDebounce` Hook 활용
- `localStorage`로 최근 검색어 관리
- `Autocomplete` 컴포넌트의 `renderOption` 커스터마이징
- 검색어 하이라이팅은 정규식 활용

---

## 마무리

이번 장에서는 React로 완전한 CRUD 애플리케이션을 구현하는 방법을 학습했습니다. Vue3와의 주요 차이점:

1. **상태 관리**: 불변성 유지가 필수
2. **폼 처리**: 수동 바인딩 필요
3. **비동기 처리**: useEffect + cleanup 패턴
4. **이벤트 처리**: 명시적 핸들러 바인딩

### 핵심 포인트
- Custom Hooks로 비즈니스 로직 분리
- Material-UI 컴포넌트 활용으로 빠른 UI 구성
- TypeScript로 타입 안전성 확보
- 적절한 에러 처리와 로딩 상태 관리

### 다음 학습 추천
- 상태 관리 라이브러리 (Redux, Zustand)
- 서버 상태 관리 (React Query, SWR)
- 폼 라이브러리 (React Hook Form)
- 테스팅 (Jest, React Testing Library)