import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Explore as ExploreIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getAllCategories, blogPosts } from '../data/blogPosts';

const HomePage: React.FC = () => {
  const categories = getAllCategories();
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* 히어로 섹션 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            📚 React Router 블로그
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}
          >
            React Router를 활용한 SPA 라우팅 시스템 실습 프로젝트
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, fontSize: '1.2rem', lineHeight: 1.6 }}
          >
            다양한 주제의 블로그 포스트를 탐색하고, 카테고리별 필터링과 
            브레드크럼 네비게이션을 경험해보세요.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/posts"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
              startIcon={<ArticleIcon />}
            >
              모든 포스트 보기
            </Button>
            <Button
              component={RouterLink}
              to="/posts?category=tech"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                },
              }}
              startIcon={<ExploreIcon />}
            >
              기술 포스트 보기
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* 카테고리 소개 섹션 */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            다양한 카테고리
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            관심 있는 주제별로 포스트를 찾아보세요
          </Typography>
          
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={category.value}>
                <Card
                  component={RouterLink}
                  to={`/posts?category=${category.value}`}
                  sx={{
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {category.icon}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: category.color,
                        mb: 1,
                      }}
                    >
                      {category.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {blogPosts.filter(post => post.category === category.value).length}개 포스트
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 최근 포스트 섹션 */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <TrendingIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              최근 포스트
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {recentPosts.map((post) => (
              <Grid item xs={12} md={4} key={post.id}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                  component={RouterLink}
                  to={`/posts/${post.id}`}
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {post.imageUrl}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.author} • {post.readingTime}분 읽기
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/posts"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              모든 포스트 보기
            </Button>
          </Box>
        </Box>

        {/* 기능 소개 섹션 */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            주요 기능
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            이 블로그에서 경험할 수 있는 React Router 기능들
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <ArticleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  동적 라우팅
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  /posts/:id 패턴으로 각 포스트별 상세 페이지를 제공합니다
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <ExploreIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  쿼리 파라미터
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ?category=tech 형태로 카테고리별 필터링을 구현합니다
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <TrendingIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  브레드크럼 네비게이션
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  현재 위치를 표시하고 쉬운 네비게이션을 제공합니다
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;