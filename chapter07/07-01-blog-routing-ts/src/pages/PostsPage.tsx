import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import CategoryFilter from '../components/CategoryFilter';
import Breadcrumb from '../components/Breadcrumb';
import { getPostsByCategory } from '../data/blogPosts';

const PostsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const posts = getPostsByCategory(categoryFilter);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 브레드크럼 네비게이션 */}
      <Breadcrumb />
      
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          📝 블로그 포스트
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          다양한 주제의 블로그 포스트를 만나보세요. 
          카테고리별로 필터링하여 원하는 글을 쉽게 찾을 수 있습니다.
        </Typography>
      </Box>

      {/* 카테고리 필터 */}
      <CategoryFilter />

      {/* 포스트 목록 */}
      {posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert 
          severity="info" 
          sx={{ 
            mt: 4,
            textAlign: 'center',
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            해당 카테고리에 포스트가 없습니다
          </Typography>
          <Typography variant="body2">
            다른 카테고리를 선택해보세요.
          </Typography>
        </Alert>
      )}

      {/* 포스트 수 표시 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          총 {posts.length}개의 포스트
          {categoryFilter && (
            <span> (카테고리: {categoryFilter})</span>
          )}
        </Typography>
      </Box>
    </Container>
  );
};

export default PostsPage;