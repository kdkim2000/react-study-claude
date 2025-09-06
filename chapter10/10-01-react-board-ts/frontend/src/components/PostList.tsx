import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  Box,
  Fab,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Post, PageResponse } from '../types';
import { postApi } from '../services/api';

interface PostListProps {
  onSelectPost: (post: Post) => void;
  onCreatePost: () => void;
}

const PostList: React.FC<PostListProps> = ({ onSelectPost, onCreatePost }) => {
  const [posts, setPosts] = useState<PageResponse<Post> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(0);

  // 게시글 목록 로드
  const loadPosts = async (pageNum: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await postApi.getPosts(pageNum, 10);
      setPosts(data);
    } catch (err: any) {
      console.error('게시글 로딩 오류:', err);
      setError(err.message || '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 첫 페이지 로드
  useEffect(() => {
    loadPosts(page);
  }, [page]);

  // 페이지 변경 핸들러
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1); // MUI Pagination은 1부터 시작, API는 0부터
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="400px"
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          게시글을 불러오는 중...
        </Typography>
      </Box>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert 
          severity="error" 
          action={
            <Box>
              <Typography variant="button" onClick={() => loadPosts(page)} sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
                다시 시도
              </Typography>
            </Box>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', pb: 8 }}>
      {/* 헤더 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            📝 React 게시판
          </Typography>
          {posts && (
            <Typography variant="body2" color="text.secondary">
              전체 {posts.totalElements}개의 게시글
            </Typography>
          )}
        </Box>
        <Chip 
          label="File Database" 
          color="primary" 
          variant="outlined" 
          size="small"
        />
      </Box>

      {/* 게시글 목록 */}
      {posts && posts.content.length > 0 ? (
        <Grid container spacing={2}>
          {posts.content.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Card 
                elevation={1}
                sx={{ 
                  '&:hover': { 
                    elevation: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <CardActionArea onClick={() => onSelectPost(post)}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {post.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        #{post.id}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      color="text.secondary" 
                      variant="body2" 
                      sx={{ mb: 1 }}
                    >
                      {post.content.length > 150 
                        ? `${post.content.substring(0, 150)}...` 
                        : post.content}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip 
                          label={post.author} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(post.createdAt)}
                        {post.updatedAt !== post.createdAt && (
                          <span> (수정됨)</span>
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            아직 게시글이 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            첫 번째 게시글을 작성해보세요!
          </Typography>
        </Box>
      )}

      {/* 페이지네이션 */}
      {posts && posts.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={posts.totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="글쓰기"
        onClick={onCreatePost}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default PostList;