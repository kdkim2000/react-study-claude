import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Avatar,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  ArrowBack as BackIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { getPostById, getCategoryInfo } from '../data/blogPosts';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = getPostById(id || '');

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            포스트를 찾을 수 없습니다
          </Typography>
          <Typography variant="body2">
            요청하신 포스트가 존재하지 않거나 삭제되었습니다.
          </Typography>
        </Alert>
        <Button
          component={RouterLink}
          to="/posts"
          variant="contained"
          startIcon={<BackIcon />}
        >
          포스트 목록으로 돌아가기
        </Button>
      </Container>
    );
  }

  const categoryInfo = getCategoryInfo(post.category as any);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 마크다운 스타일 텍스트를 간단히 HTML로 변환하는 함수
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // 헤딩 처리
        if (line.startsWith('# ')) {
          return (
            <Typography key={index} variant="h3" component="h1" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
              {line.substring(2)}
            </Typography>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <Typography key={index} variant="h4" component="h2" gutterBottom sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
              {line.substring(3)}
            </Typography>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <Typography key={index} variant="h5" component="h3" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
              {line.substring(4)}
            </Typography>
          );
        }

        // 코드 블록 처리
        if (line.startsWith('```')) {
          return <Box key={index} sx={{ height: 16 }} />; // 코드 블록 구분용 공간
        }

        // 일반 텍스트 처리
        if (line.trim()) {
          return (
            <Typography key={index} variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 2 }}>
              {line}
            </Typography>
          );
        }

        return <Box key={index} sx={{ height: 8 }} />; // 빈 줄 처리
      });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 브레드크럼 네비게이션 */}
      <Breadcrumb />

      {/* 뒤로 가기 버튼 */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to="/posts"
          variant="outlined"
          startIcon={<BackIcon />}
          sx={{ mb: 2 }}
        >
          포스트 목록으로
        </Button>
      </Box>

      {/* 메인 콘텐츠 */}
      <Paper elevation={1} sx={{ p: 4 }}>
        {/* 포스트 헤더 */}
        <Box sx={{ mb: 4 }}>
          {/* 카테고리와 이모지 */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h2" sx={{ mr: 2 }}>
              {post.imageUrl || categoryInfo?.icon || '📝'}
            </Typography>
            {categoryInfo && (
              <Chip
                icon={<CategoryIcon />}
                label={categoryInfo.label}
                sx={{
                  backgroundColor: `${categoryInfo.color}20`,
                  color: categoryInfo.color,
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                }}
              />
            )}
          </Box>

          {/* 제목 */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          {/* 메타 정보 */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 3,
              mb: 3,
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 2,
            }}
          >
            {/* 작성자 */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {post.author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  작성자
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* 읽는 시간 */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {post.readingTime}분
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  읽는 시간
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* 발행일 */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {formatDate(post.publishedAt)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                발행일
              </Typography>
            </Box>
          </Box>

          {/* 요약 */}
          <Typography
            variant="h6"
            sx={{
              fontStyle: 'italic',
              color: 'text.secondary',
              mb: 3,
              p: 2,
              borderLeft: 4,
              borderColor: 'primary.main',
              backgroundColor: 'primary.50',
              borderRadius: '0 8px 8px 0',
            }}
          >
            {post.excerpt}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 포스트 내용 */}
        <Box sx={{ mb: 4 }}>
          {renderContent(post.content)}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* 태그 */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            태그
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant="outlined"
                size="medium"
                sx={{
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'primary.50',
                    borderColor: 'primary.main',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* 하단 네비게이션 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          component={RouterLink}
          to="/posts"
          variant="contained"
          size="large"
          startIcon={<BackIcon />}
          sx={{ px: 4, py: 1.5 }}
        >
          다른 포스트 보러가기
        </Button>
      </Box>
    </Container>
  );
};

export default PostDetailPage;