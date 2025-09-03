import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip
} from '@mui/material';
import {
  Brightness7 as SunIcon,
  Brightness2 as MoonIcon,
  Palette as ColorIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const MainContent = () => {
  const { mode, isDarkMode } = useTheme();

  const features = [
    {
      title: '자동 테마 감지',
      description: '시스템 설정에 따라 자동으로 라이트/다크 모드를 감지합니다.',
      icon: <ColorIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'localStorage 저장',
      description: '선택한 테마를 브라우저에 저장하여 다음 방문시에도 유지됩니다.',
      icon: isDarkMode ? <MoonIcon sx={{ fontSize: 40 }} /> : <SunIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: '실시간 전환',
      description: '버튼 클릭 한 번으로 즉시 테마가 전환됩니다.',
      icon: <ColorIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 소개 섹션 */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" gutterBottom>
          🎨 테마 설정 시스템
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Context API를 활용한 전역 테마 관리
        </Typography>
        <Chip 
          label={`현재: ${mode === 'light' ? '🌞 라이트' : '🌙 다크'} 모드`}
          color="primary"
          size="large"
          sx={{ mt: 2, px: 2, py: 1, fontSize: '1rem' }}
        />
      </Box>

      {/* 기능 카드들 */}
      <Grid container spacing={4} mb={6}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.palette.mode === 'dark' 
                    ? '0 8px 32px rgba(255,255,255,0.1)' 
                    : '0 8px 32px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box 
                  sx={{ 
                    color: 'primary.main', 
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 테마 정보 */}
      <Paper 
        elevation={2}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        }}
      >
        <Typography variant="h5" gutterBottom>
          💡 학습 포인트
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              Context API 활용
            </Typography>
            <Typography variant="body2" paragraph>
              • createContext로 테마 상태 생성<br/>
              • useContext로 컴포넌트에서 사용<br/>
              • Provider로 앱 전체에 상태 제공
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom color="primary">
              localStorage 연동
            </Typography>
            <Typography variant="body2" paragraph>
              • useEffect로 데이터 동기화<br/>
              • 페이지 새로고침 시에도 테마 유지<br/>
              • 시스템 기본 설정 자동 감지
            </Typography>
          </Grid>
        </Grid>

        <Box mt={3} p={2} bgcolor="action.hover" borderRadius={2}>
          <Typography variant="body2" textAlign="center">
            <strong>현재 상태:</strong> {mode} 모드 | 
            <strong> 저장 위치:</strong> localStorage['theme-mode'] | 
            <strong> 다크 모드:</strong> {isDarkMode ? 'ON' : 'OFF'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MainContent;