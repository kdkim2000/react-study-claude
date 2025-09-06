import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { ArrowBack, Save, Preview } from '@mui/icons-material';
import { Post, PostCreateRequest, PostUpdateRequest } from '../types';
import { postApi } from '../services/api';

interface PostFormProps {
  post?: Post; // 수정 시에만 제공
  onBack: () => void;
  onSave: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onBack, onSave }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState(false);

  const isEdit = !!post;

  // 폼 초기화
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author);
    }
  }, [post]);

  // 폼 검증
  const isFormValid = () => {
    return title.trim() && content.trim() && (isEdit || author.trim());
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (isEdit) {
        const updateData: PostUpdateRequest = {
          title: title.trim(),
          content: content.trim(),
        };
        await postApi.updatePost(post.id, updateData);
      } else {
        const createData: PostCreateRequest = {
          title: title.trim(),
          content: content.trim(),
          author: author.trim(),
        };
        await postApi.createPost(createData);
      }

      onSave();
    } catch (err: any) {
      console.error('게시글 저장 오류:', err);
      setError(err.message || (isEdit ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (isFormValid()) {
          handleSubmit(e as any);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, content, author]);

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
        <Button
          startIcon={<Preview />}
          onClick={() => setPreview(!preview)}
          variant="outlined"
          color={preview ? 'primary' : 'inherit'}
        >
          {preview ? '편집 모드' : '미리보기'}
        </Button>
      </Box>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {isEdit ? '📝 게시글 수정' : '✏️ 새 게시글 작성'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!preview ? (
            // 편집 모드
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="제목 *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
                placeholder="게시글 제목을 입력하세요"
                error={!title.trim() && error !== ''}
                helperText={!title.trim() && error !== '' ? '제목을 입력해주세요' : ''}
                sx={{ mb: 2 }}
              />

              {!isEdit && (
                <TextField
                  fullWidth
                  label="작성자 *"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  margin="normal"
                  required
                  placeholder="작성자명을 입력하세요"
                  error={!author.trim() && error !== ''}
                  helperText={!author.trim() && error !== '' ? '작성자를 입력해주세요' : ''}
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                multiline
                rows={12}
                label="내용 *"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                margin="normal"
                required
                placeholder="게시글 내용을 입력하세요&#10;&#10;팁: Ctrl + Enter로 저장할 수 있습니다"
                error={!content.trim() && error !== ''}
                helperText={!content.trim() && error !== '' ? '내용을 입력해주세요' : `${content.length} 글자`}
                sx={{ mb: 3 }}
              />

              <Box display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  disabled={loading || !isFormValid()}
                  size="large"
                >
                  {loading ? '저장 중...' : (isEdit ? '수정 완료' : '게시글 작성')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={onBack}
                  disabled={loading}
                  size="large"
                >
                  취소
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                💡 팁: Ctrl + Enter로 빠르게 저장할 수 있습니다
              </Typography>
            </Box>
          ) : (
            // 미리보기 모드
            <Box>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  📄 미리보기
                </Typography>
                
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {title || '제목 없음'}
                </Typography>
                
                {!isEdit && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    작성자: {author || '작성자 없음'}
                  </Typography>
                )}
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    mt: 2,
                    lineHeight: 1.8 
                  }}
                >
                  {content || '내용 없음'}
                </Typography>
              </Paper>

              <Box mt={3} display="flex" gap={2}>
                <Button
                  onClick={() => setPreview(false)}
                  variant="contained"
                  color="primary"
                >
                  계속 편집
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="success"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  disabled={loading || !isFormValid()}
                >
                  {loading ? '저장 중...' : (isEdit ? '수정 완료' : '게시글 작성')}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostForm;