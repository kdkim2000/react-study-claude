import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ArrowBack, Edit, Delete, Schedule, Person } from '@mui/icons-material';
import { Post } from '../types';
import { postApi } from '../services/api';

interface PostDetailProps {
  postId: number;
  onBack: () => void;
  onEdit: (post: Post) => void;
  onDelete: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId, onBack, onEdit, onDelete }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 게시글 로드
  const loadPost = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postApi.getPost(postId);
      setPost(data);
    } catch (err: any) {
      console.error('게시글 로딩 오류:', err);
      setError(err.message || '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 게시글 로드
  useEffect(() => {
    loadPost();
  }, [postId]);

  // 삭제 핸들러
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await postApi.deletePost(postId);
      setDeleteDialogOpen(false);
      onDelete();
    } catch (err: any) {
      console.error('게시글 삭제 오류:', err);
      setError(err.message || '게시글 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short'
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>
          목록으로 돌아가기
        </Button>
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
      </Box>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>
          목록으로 돌아가기
        </Button>
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadPost}>
              다시 시도
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // 게시글이 없는 경우
  if (!post) return null;

  return (
    <Box>
      {/* 상단 네비게이션 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={onBack}
          variant="outlined"
        >
          목록으로 돌아가기
        </Button>
        <Box display="flex" gap={1}>
          <Tooltip title="게시글 수정">
            <Button
              startIcon={<Edit />}
              onClick={() => onEdit(post)}
              variant="contained"
              color="primary"
            >
              수정
            </Button>
          </Tooltip>
          <Tooltip title="게시글 삭제">
            <Button
              startIcon={<Delete />}
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              variant="outlined"
            >
              삭제
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* 메인 게시글 카드 */}
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          {/* 게시글 헤더 */}
          <Box mb={3}>
            <Box display="flex" justifyContent="between" alignItems="flex-start" mb={2}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flex: 1 }}>
                {post.title}
              </Typography>
              <Chip 
                label={`#${post.id}`} 
                size="small" 
                variant="outlined"
                color="primary"
              />
            </Box>
            
            {/* 메타 정보 */}
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={0.5}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  작성자:
                </Typography>
                <Chip 
                  label={post.author} 
                  size="small" 
                  color="primary"
                  variant="filled"
                />
              </Box>
              
              <Box display="flex" alignItems="center" gap={0.5}>
                <Schedule fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  작성일: {formatDate(post.createdAt)}
                </Typography>
              </Box>
              
              {post.updatedAt !== post.createdAt && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Schedule fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    수정일: {formatDate(post.updatedAt)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 게시글 내용 */}
          <Typography 
            variant="body1" 
            component="div"
            sx={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: 'text.primary'
            }}
          >
            {post.content}
          </Typography>
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          🗑️ 게시글 삭제
        </DialogTitle>
        <DialogContent>
          <Typography>
            <strong>"{post.title}"</strong> 게시글을 정말로 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            삭제된 게시글은 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            취소
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <Delete />}
          >
            {deleting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostDetail;