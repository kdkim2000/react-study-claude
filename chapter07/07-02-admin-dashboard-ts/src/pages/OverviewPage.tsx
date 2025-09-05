import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats } from '../data/mockUsers';

const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const stats = getUserStats();

  const statCards = [
    {
      title: '전체 사용자',
      value: stats.totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      title: '관리자',
      value: stats.adminUsers,
      icon: <AdminIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      bgColor: '#ffebee',
    },
    {
      title: '오늘 활성 사용자',
      value: stats.activeToday,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      bgColor: '#e8f5e8',
    },
    {
      title: '이달의 신규 사용자',
      value: stats.newThisMonth,
      icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      bgColor: '#fff3e0',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          대시보드 개요
        </Typography>
        <Typography variant="body1" color="text.secondary">
          시스템 현황을 한눈에 확인하세요
        </Typography>
      </Box>

      {/* 환영 메시지 */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
        <Box sx={{ color: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            환영합니다, {user?.name}님! {user?.avatar}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body1">
              역할: 
            </Typography>
            <Chip
              label={user?.role === 'admin' ? '관리자' : '일반 사용자'}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
            {user?.lastLoginAt && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                마지막 로그인: {formatDate(user.lastLoginAt)}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* 통계 카드들 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: stat.bgColor,
                    color: stat.color,
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 권한별 접근 가능 메뉴 안내 */}
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          📋 접근 가능한 메뉴
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            현재 계정({user?.role === 'admin' ? '관리자' : '일반 사용자'})으로 접근 가능한 메뉴:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip label="📊 대시보드" color="primary" />
            <Chip label="👤 프로필" color="primary" />
            {user?.role === 'admin' && (
              <Chip label="👥 사용자 관리" color="secondary" />
            )}
          </Box>
          
          {user?.role !== 'admin' && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'warning.50', borderRadius: 1, borderLeft: 4, borderColor: 'warning.main' }}>
              <Typography variant="body2" color="warning.dark">
                💡 <strong>참고:</strong> '사용자 관리' 메뉴는 관리자 권한이 필요합니다. 
                관리자 계정(admin@example.com)으로 로그인하면 모든 메뉴에 접근할 수 있습니다.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default OverviewPage;