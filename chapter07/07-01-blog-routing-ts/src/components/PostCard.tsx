import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  ArrowForward as ReadMoreIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import { getCategoryInfo } from '../data/blogPosts';

interface PostCardProps {
  post: BlogPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
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

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* 카테고리와 이모지 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ mr: 1 }}>
            {post.imageUrl || categoryInfo?.icon || '📝'}
          </Typography>
          {categoryInfo && (
            <Chip
              label={categoryInfo.label}
              size="small"
              sx={{
                backgroundColor: `${categoryInfo.color}20`,
                color: categoryInfo.color,
                fontWeight: 'medium',
              }}
            />
          )}
        </Box>

        {/* 제목 */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
            minHeight: '3.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {post.title}
        </Typography>

        {/* 요약 */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            minHeight: '3rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
          }}
        >
          {post.excerpt}
        </Typography>

        {/* 메타 정보 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {/* 작성자 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 20, height: 20, mr: 1, fontSize: '0.75rem' }}>
              <PersonIcon fontSize="small" />
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {post.author}
            </Typography>
          </Box>

          {/* 읽는 시간 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {post.readingTime}분 읽기
            </Typography>
          </Box>
        </Box>

        {/* 발행일 */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {formatDate(post.publishedAt)}
        </Typography>

        {/* 태그 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {post.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                height: '24px',
              }}
            />
          ))}
          {post.tags.length > 3 && (
            <Chip
              label={`+${post.tags.length - 3}`}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                height: '24px',
                color: 'text.secondary',
              }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/posts/${post.id}`}
          variant="contained"
          endIcon={<ReadMoreIcon />}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
          }}
        >
          자세히 보기
        </Button>
      </CardActions>
    </Card>
  );
};

export default PostCard;