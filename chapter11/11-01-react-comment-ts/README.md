# React 댓글 시스템 (Comment System)

## 프로젝트 개요

이 프로젝트는 React 초보자가 실무에서 자주 사용되는 댓글 시스템을 구현하며 CRUD 기능과 컴포넌트 구성을 학습할 수 있도록 설계되었습니다. Material-UI를 활용한 현대적인 UI와 함께 React의 핵심 개념들을 실전에서 적용해볼 수 있습니다.

## 학습 목표

- **CRUD 구현**: Create, Read, Update, Delete 기본 기능
- **컴포넌트 분리**: 기능별 컴포넌트 구조 설계
- **상태 관리**: useState와 useCallback을 활용한 로컬 상태 관리
- **커스텀 훅**: 로직 재사용을 위한 useComments 훅 구현
- **Material-UI 활용**: Dialog, TextField, IconButton 등 UI 컴포넌트 사용
- **사용자 경험**: 로딩 상태, 확인 다이얼로그, 에러 처리

## 주요 기능

- 댓글 작성 (작성자, 내용 입력)
- 댓글 목록 표시 (최신 순 정렬)
- 댓글 수정 (인라인 편집)
- 댓글 삭제 (확인 다이얼로그 포함)
- 댓글 개수 표시
- 실시간 UI 상태 관리 (로딩, 에러)
- 반응형 디자인

## 프로젝트 구조

```
src/
├── App.tsx                    # 메인 애플리케이션
├── App.css                    # 스타일 (Vite 기본)
├── index.css                  # 전역 스타일
├── main.tsx                   # 애플리케이션 진입점
├── components/                # 컴포넌트 디렉토리
│   ├── PostDetail.tsx        # 게시글 상세 컴포넌트
│   ├── CommentSection.tsx    # 댓글 섹션 컨테이너
│   ├── CommentForm.tsx       # 댓글 작성 폼
│   ├── CommentList.tsx       # 댓글 목록
│   └── CommentItem.tsx       # 개별 댓글 컴포넌트
├── hooks/                     # 커스텀 훅
│   └── useComments.ts        # 댓글 관리 훅
└── types/
    └── index.ts              # TypeScript 타입 정의
```

## 핵심 컴포넌트 분석

### 1. App.tsx (루트 컴포넌트)

```typescript
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
})

// 샘플 게시글 데이터
const samplePost = {
  id: '1',
  title: 'React 게시판 시스템 구축하기',
  content: 'React와 TypeScript를 사용하여 게시판 시스템을 구축하는 방법에 대해 알아보겠습니다.',
  author: '개발자',
  createdAt: new Date('2024-01-15')
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <PostDetail post={samplePost} />
      </Container>
    </ThemeProvider>
  )
}
```

**핵심 개념:**
- **Material-UI 테마**: 일관된 디자인 시스템 적용
- **샘플 데이터**: 개발 단계에서 하드코딩된 데이터 사용
- **컨테이너 패턴**: Container로 최대 너비 제한

### 2. useComments.ts (커스텀 훅)

```typescript
export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 게시글별 댓글 필터링
  const getCommentsByPostId = useCallback((postId: string) => {
    return comments.filter(comment => comment.postId === postId)
  }, [comments])

  // 댓글 추가
  const addComment = useCallback((postId: string, content: string, author: string, parentId?: string) => {
    setLoading(true)
    try {
      const newComment: Comment = {
        id: Date.now().toString(), // 임시 ID 생성
        postId,
        content,
        author,
        createdAt: new Date(),
        parentId
      }
      setComments(prev => [...prev, newComment])
      setError(null)
    } catch (err) {
      setError('댓글 추가에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 댓글 수정
  const updateComment = useCallback((commentId: string, content: string) => {
    setLoading(true)
    try {
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content }
            : comment
        )
      )
      setError(null)
    } catch (err) {
      setError('댓글 수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    getCommentsByPostId
  }
}
```

**핵심 개념:**
- **커스텀 훅**: 관련 로직을 하나로 묶어 재사용 가능하게 만듦
- **useCallback**: 함수 메모이제이션으로 불필요한 리렌더링 방지
- **에러 처리**: try-catch로 예외 상황 처리
- **불변성 유지**: map과 스프레드 연산자로 상태 불변성 보장

### 3. CommentForm.tsx (댓글 작성 폼)

```typescript
const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, loading }) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 입력값 검증
    if (!content.trim() || !author.trim()) {
      alert('댓글 내용과 작성자를 입력해주세요.')
      return
    }

    onSubmit(content.trim(), author.trim())
    setContent('') // 내용만 초기화
    // 작성자는 유지 (실제 앱에서는 로그인 정보 사용)
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="댓글을 작성하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={3}
        />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !content.trim() || !author.trim()}
            startIcon={loading && <CircularProgress size={16} />}
          >
            댓글 등록
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
```

**핵심 개념:**
- **폼 처리**: onSubmit 이벤트와 preventDefault() 사용
- **입력값 검증**: trim()으로 공백 제거 후 유효성 검사
- **조건부 렌더링**: 로딩 상태에 따른 버튼 비활성화
- **UX 고려**: 작성자 필드 유지, 내용만 초기화

### 4. CommentItem.tsx (개별 댓글 컴포넌트)

```typescript
const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onUpdate, 
  onDelete, 
  loading 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(comment.content)
  }

  const handleSave = () => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }
    onUpdate(comment.id, editContent.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(comment.content) // 원래 내용으로 복원
  }

  return (
    <>
      <Paper elevation={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2">
              {comment.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {comment.createdAt.toLocaleString()}
            </Typography>
          </Box>
          
          {/* 편집/삭제 버튼 */}
          <Box>
            {!isEditing ? (
              <>
                <IconButton onClick={handleEdit} color="primary">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={handleSave} color="primary">
                  <Save fontSize="small" />
                </IconButton>
                <IconButton onClick={handleCancel}>
                  <Cancel fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {/* 댓글 내용 (편집 모드에 따라 다른 컴포넌트) */}
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        ) : (
          <Typography variant="body2">
            {comment.content}
          </Typography>
        )}
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>댓글 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            이 댓글을 정말 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
```

**핵심 개념:**
- **인라인 편집**: 편집 모드에서 TextField로 전환
- **상태 관리**: 편집 상태, 임시 내용, 다이얼로그 상태 관리
- **사용자 확인**: 삭제 전 확인 다이얼로그 표시
- **취소 기능**: 편집 취소 시 원래 내용으로 복원

### 5. CommentList.tsx (댓글 목록)

```typescript
const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onUpdate, 
  onDelete, 
  loading 
}) => {
  if (comments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </Typography>
      </Box>
    )
  }

  // 최신 댓글부터 표시
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Box>
      {sortedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onUpdate={onUpdate}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </Box>
  )
}
```

**핵심 개념:**
- **조건부 렌더링**: 빈 상태 처리
- **배열 정렬**: 날짜 기준 내림차순 정렬
- **Props 전달**: 부모에서 받은 함수들을 자식으로 전달
- **key prop**: React의 효율적인 리렌더링을 위한 고유 키 사용

### 6. CommentSection.tsx (댓글 섹션 컨테이너)

```typescript
const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { 
    comments, 
    loading, 
    error, 
    addComment, 
    updateComment, 
    deleteComment, 
    getCommentsByPostId 
  } = useComments()
  
  const postComments = getCommentsByPostId(postId)
  const commentCount = postComments.length

  const handleAddComment = (content: string, author: string) => {
    addComment(postId, content, author)
  }

  return (
    <Box>
      <Typography variant="h6">
        댓글 ({commentCount})
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <CommentForm onSubmit={handleAddComment} loading={loading} />
      
      <CommentList 
        comments={postComments}
        onUpdate={updateComment}
        onDelete={deleteComment}
        loading={loading}
      />
    </Box>
  )
}
```

**핵심 개념:**
- **컨테이너 패턴**: 상태 관리와 비즈니스 로직을 담당
- **커스텀 훅 사용**: useComments로 댓글 관련 기능 가져오기
- **에러 표시**: Alert 컴포넌트로 사용자 친화적 에러 메시지
- **댓글 개수**: 실시간으로 댓글 수 표시

## TypeScript 타입 정의

### types/index.ts

```typescript
export interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
}

export interface Comment {
  id: string
  postId: string        // 어떤 게시글의 댓글인지
  content: string
  author: string
  createdAt: Date
  parentId?: string     // 대댓글 기능을 위한 선택적 필드
}
```

**핵심 개념:**
- **인터페이스**: 객체의 구조를 정의
- **관계형 데이터**: postId로 게시글과 댓글 연결
- **선택적 속성**: parentId?로 대댓글 지원 준비
- **타입 안전성**: 컴파일 타임에 오류 방지

## React 핵심 패턴 학습

### 1. 상태 끌어올리기 (Lifting State Up)

```typescript
// CommentSection에서 상태를 관리하고
const CommentSection = () => {
  const { comments, addComment, updateComment } = useComments()
  
  return (
    <>
      <CommentForm onSubmit={addComment} />
      <CommentList comments={comments} onUpdate={updateComment} />
    </>
  )
}

// 자식 컴포넌트들은 props로 받아서 사용
const CommentForm = ({ onSubmit }) => {
  // onSubmit을 통해 상위로 데이터 전달
}
```

### 2. 컴포넌트 합성 (Component Composition)

```typescript
// PostDetail은 CommentSection을 포함
const PostDetail = ({ post }) => {
  return (
    <Paper>
      {/* 게시글 내용 */}
      <Typography>{post.title}</Typography>
      
      {/* 댓글 섹션 합성 */}
      <CommentSection postId={post.id} />
    </Paper>
  )
}
```

### 3. 단방향 데이터 흐름

```
App
 └── PostDetail
     └── CommentSection (상태 관리)
         ├── CommentForm (데이터 상위로 전달)
         └── CommentList
             └── CommentItem (이벤트 상위로 전달)
```

### 4. 책임 분리 원칙

```typescript
// 각 컴포넌트는 명확한 역할 담당
- CommentForm: 입력과 검증만 담당
- CommentList: 목록 표시와 정렬만 담당
- CommentItem: 개별 댓글 표시와 편집만 담당
- CommentSection: 전체 상태 관리와 조율
```

## Material-UI 활용법

### 1. 반응형 레이아웃

```typescript
<Container maxWidth="md">        // 중간 크기 최대 너비
  <Paper elevation={2}>          // 그림자 효과
    <Box sx={{ p: 3 }}>         // 패딩 적용
      <Typography variant="h5">  // 텍스트 스타일링
        {title}
      </Typography>
    </Box>
  </Paper>
</Container>
```

### 2. 아이콘과 버튼

```typescript
<IconButton color="primary" onClick={handleEdit}>
  <Edit fontSize="small" />
</IconButton>

<Button 
  variant="contained" 
  startIcon={<Save />}
  disabled={loading}
>
  저장
</Button>
```

### 3. 다이얼로그 시스템

```typescript
<Dialog open={deleteDialogOpen} onClose={handleClose}>
  <DialogTitle>확인</DialogTitle>
  <DialogContent>
    <DialogContentText>정말 삭제하시겠습니까?</DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancel}>취소</Button>
    <Button onClick={handleConfirm} color="error">삭제</Button>
  </DialogActions>
</Dialog>
```

## 실습 과제

### 초급 과제
1. **댓글 좋아요 기능**: 각 댓글에 좋아요 버튼과 카운트 추가
2. **작성 시간 개선**: "방금 전", "1분 전" 형태로 상대적 시간 표시
3. **댓글 검색**: 댓글 내용으로 검색하는 기능 추가

### 중급 과제
1. **대댓글 시스템**: parentId를 활용한 답글 기능 구현
2. **무한 스크롤**: 댓글이 많을 때 무한 스크롤로 로딩
3. **이미지 업로드**: 댓글에 이미지를 첨부할 수 있는 기능

### 고급 과제
1. **실시간 업데이트**: WebSocket을 사용한 실시간 댓글 동기화
2. **마크다운 지원**: 댓글에 마크다운 문법 지원
3. **모더레이션**: 부적절한 댓글 신고 및 관리 기능

## 일반적인 실수와 해결 방법

### 1. 상태 불변성 위반

```typescript
// ❌ 직접 배열 수정
comments.push(newComment)
setComments(comments)

// ✅ 새 배열 생성
setComments(prev => [...prev, newComment])
```

### 2. Key prop 누락

```typescript
// ❌ Key 없음
{comments.map(comment => <CommentItem comment={comment} />)}

// ✅ 고유한 Key 제공
{comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
```

### 3. 메모리 누수

```typescript
// ❌ 이벤트 리스너 정리 안함
useEffect(() => {
  document.addEventListener('keydown', handleKeyDown)
}, [])

// ✅ cleanup 함수로 정리
useEffect(() => {
  document.addEventListener('keydown', handleKeyDown)
  return () => {
    document.removeEventListener('keydown', handleKeyDown)
  }
}, [])
```

### 4. 불필요한 리렌더링

```typescript
// ❌ 매번 새 함수 생성
const handleClick = () => doSomething()

// ✅ useCallback으로 메모이제이션
const handleClick = useCallback(() => doSomething(), [])
```

## 설치 및 실행

```bash
# 프로젝트 생성
npm create vite@latest comment-system -- --template react-ts
cd comment-system

# Material-UI 설치
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# 개발 서버 시작
npm run dev
```

## 다음 단계

이 댓글 시스템을 완성했다면 다음 주제들을 학습해보세요:

1. **상태 관리 라이브러리**: Context API, Zustand 도입
2. **데이터 페칭**: React Query로 서버 상태 관리
3. **폼 라이브러리**: React Hook Form으로 복잡한 폼 처리
4. **테스팅**: Jest와 React Testing Library로 테스트 작성
5. **최적화**: React.memo, useMemo로 성능 개선

이 프로젝트는 React의 핵심 개념들을 실제 사용 사례에 적용해볼 수 있는 실용적인 학습 경험을 제공합니다. 특히 CRUD 패턴과 컴포넌트 설계 원칙을 익히는 데 도움이 될 것입니다.