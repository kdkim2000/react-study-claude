import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  Article as ArticleIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { BreadcrumbItem } from '../types/blog';
import { getCategoryInfo } from '../data/blogPosts';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  // 브레드크럼 아이템 생성 함수
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: '홈',
        path: '/',
        icon: <HomeIcon fontSize="small" />,
      },
    ];

    // URL 경로에 따른 브레드크럼 생성
    if (pathSegments.length === 0) {
      return items.slice(0, 1); // 홈에서는 홈만 표시
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      if (segment === 'posts') {
        // URL 쿼리 파라미터에서 카테고리 확인
        const urlParams = new URLSearchParams(location.search);
        const category = urlParams.get('category');
        
        if (category) {
          const categoryInfo = getCategoryInfo(category as any);
          items.push({
            label: '포스트',
            path: '/posts',
            icon: <ArticleIcon fontSize="small" />,
          });
          items.push({
            label: categoryInfo ? `${categoryInfo.icon} ${categoryInfo.label}` : '카테고리',
            icon: <CategoryIcon fontSize="small" />,
          });
        } else {
          items.push({
            label: '블로그 포스트',
            path: currentPath,
            icon: <ArticleIcon fontSize="small" />,
          });
        }
      } else if (pathSegments[index - 1] === 'posts' && segment !== 'posts') {
        // 포스트 상세 페이지
        items.push({
          label: `포스트 #${segment}`,
          icon: <ArticleIcon fontSize="small" />,
        });
      }
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs();

  // 홈 페이지에서는 브레드크럼을 보여주지 않음
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary',
          },
        }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return isLast ? (
            // 마지막 아이템은 텍스트로만 표시 (링크 없음)
            <Typography
              key={item.label}
              color="text.primary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'medium',
              }}
            >
              {item.icon && (
                <Box sx={{ mr: 0.5, display: 'flex' }}>
                  {item.icon}
                </Box>
              )}
              {item.label}
            </Typography>
          ) : (
            // 이전 아이템들은 링크로 표시
            <Link
              key={item.label}
              component={RouterLink}
              to={item.path || '/'}
              underline="hover"
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {item.icon && (
                <Box sx={{ mr: 0.5, display: 'flex' }}>
                  {item.icon}
                </Box>
              )}
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;