import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { StatCardProps } from '../types/dashboard';

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const isPositiveChange = data.change > 0;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* 상단: 아이콘과 변화율 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          {/* 아이콘 박스 */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: `${data.color}.main`,
              color: `${data.color}.contrastText`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                fontSize: 24,
              },
            }}
          >
            {data.icon}
          </Box>

          {/* 변화율 칩 */}
          <Chip
            icon={isPositiveChange ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={`${isPositiveChange ? '+' : ''}${data.change}%`}
            size="small"
            color={isPositiveChange ? 'success' : 'error'}
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
        </Box>

        {/* 중단: 제목 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            fontWeight: 500,
          }}
        >
          {data.title}
        </Typography>

        {/* 하단: 값 */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: `${data.color}.main`,
            lineHeight: 1.2,
          }}
        >
          {data.value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;