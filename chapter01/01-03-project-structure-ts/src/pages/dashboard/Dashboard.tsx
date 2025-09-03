import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  LinearProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  Visibility as ViewsIcon,
  TrendingUp as GrowthIcon
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import Loading from '../../components/common/Loading';

interface DashboardData {
  totalUsers: number;
  totalPosts: number;
  totalViews: number;
  growth: number;
}

const Dashboard = () => {
  const { data, loading, error } = useApi<DashboardData>('/api/dashboard');

  if (loading) return <Loading message="대시보드 데이터를 불러오는 중..." />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  const stats = [
    {
      title: '총 사용자',
      value: data.totalUsers.toLocaleString(),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: '총 게시글',
      value: data.totalPosts.toLocaleString(),
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: '총 조회수',
      value: data.totalViews.toLocaleString(),
      icon: <ViewsIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: '성장률',
      value: `${data.growth}%`,
      icon: <GrowthIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        대시보드
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        프로젝트의 주요 지표와 현황을 한눈에 확인하세요
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                
                {stat.title === '성장률' && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      지난 달 대비
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(data.growth * 10, 100)}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                최근 활동
              </Typography>
              <Typography variant="body2" color="text.secondary">
                여기에 최근 활동 내역이 표시됩니다.
              </Typography>
              <Box mt={2}>
                <Typography variant="body2">
                  • 새로운 사용자 5명이 가입했습니다.
                </Typography>
                <Typography variant="body2">
                  • 3개의 새로운 게시글이 등록되었습니다.
                </Typography>
                <Typography variant="body2">
                  • 전체 조회수가 10% 증가했습니다.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;