import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Circle as CircleIcon,
} from '@mui/icons-material';

// 범례 아이템 컴포넌트
const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CircleIcon 
        sx={{ 
          fontSize: 12, 
          color: theme.palette[color as keyof typeof theme.palette].main || color 
        }} 
      />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};

const ChartSection: React.FC = () => {
  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      {/* 매출 추이 차트 */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardHeader
            title="월별 매출 추이"
            subheader="최근 12개월 매출 현황"
            titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          />
          <CardContent>
            {/* Skeleton으로 차트 영역 표현 */}
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{
                borderRadius: 2,
                mb: 3,
              }}
            />

            {/* 범례 영역 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                flexWrap: 'wrap',
              }}
            >
              <LegendItem color="primary" label="이번 년도" />
              <LegendItem color="secondary" label="작년" />
              <LegendItem color="success" label="목표" />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 카테고리별 분석 */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardHeader
            title="카테고리별 분석"
            subheader="제품 카테고리 매출 비율"
            titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          />
          <CardContent>
            <Skeleton
              variant="circular"
              width={240}
              height={240}
              sx={{ mx: 'auto', mb: 2 }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <LegendItem color="primary" label="전자제품" />
              <LegendItem color="secondary" label="의류" />
              <LegendItem color="success" label="도서" />
              <LegendItem color="warning" label="기타" />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 방문자 통계 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="일일 방문자"
            subheader="최근 7일 방문자 추이"
            titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          />
          <CardContent>
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{ borderRadius: 2, mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
              <LegendItem color="info" label="고유 방문자" />
              <LegendItem color="warning" label="페이지뷰" />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 실시간 현황 */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader
            title="실시간 현황"
            subheader="현재 접속 중인 사용자"
            titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            action={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: 'success.main',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                    '50%': {
                      opacity: 0.5,
                      transform: 'scale(1.2)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                  },
                }}
              />
            }
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 4,
              }}
            >
              <Typography variant="h2" color="primary.main" sx={{ fontWeight: 700, mb: 1 }}>
                247
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                현재 활성 사용자
              </Typography>
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChartSection;