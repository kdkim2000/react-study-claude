import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// 테마가 실시간으로 적용되는 것을 확인할 수 있는 미리보기 컴포넌트
const PreviewContent: React.FC = () => {
  return (
    <Box sx={{ space: 2 }}>
      {/* 헤더 */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          테마 미리보기
        </Typography>
        <Typography variant="body1" color="text.secondary">
          현재 적용된 테마를 실시간으로 확인할 수 있습니다.
        </Typography>
      </Paper>

      {/* 버튼 섹션 */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          버튼 스타일
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">
            Primary 버튼
          </Button>
          <Button variant="contained" color="secondary">
            Secondary 버튼
          </Button>
          <Button variant="outlined" color="primary">
            Outlined 버튼
          </Button>
          <Button variant="text" color="secondary">
            Text 버튼
          </Button>
        </Box>
      </Paper>

      {/* 카드 섹션 */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            샘플 카드
          </Typography>
          <Typography variant="body2" color="text.secondary">
            이 카드는 현재 테마 설정을 반영합니다. 
            폰트 크기와 색상이 실시간으로 변경되는 것을 확인하세요.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip label="Primary" color="primary" size="small" sx={{ mr: 1 }} />
            <Chip label="Secondary" color="secondary" size="small" />
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" startIcon={<FavoriteIcon />}>
            좋아요
          </Button>
          <Button size="small" color="secondary" startIcon={<ShareIcon />}>
            공유
          </Button>
        </CardActions>
      </Card>

      {/* 리스트 섹션 */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          텍스트 크기 미리보기
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="기본 텍스트 (body1)"
              secondary="이 텍스트는 body1 스타일을 사용합니다"
            />
            <StarIcon color="primary" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="작은 텍스트 (body2)"
              secondary="이 텍스트는 body2 스타일을 사용합니다"
            />
            <StarIcon color="secondary" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default PreviewContent;