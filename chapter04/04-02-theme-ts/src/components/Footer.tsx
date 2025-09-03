import {
  Box,
  Container,
  Typography,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { mode, toggleTheme, isDarkMode } = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center">
          {/* 테마 토글 섹션 */}
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              테마가 마음에 들지 않으시나요?
            </Typography>
            <Tooltip title="테마 변경하기">
              <IconButton
                onClick={toggleTheme}
                size="large"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {isDarkMode ? '🌞' : '🌙'}
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* 푸터 정보 */}
          <Typography variant="body2" color="text.secondary" paragraph>
            React Context API를 활용한 테마 시스템 예제
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            현재 <strong>{mode}</strong> 모드로 표시 중입니다
          </Typography>

          {/* 소셜 링크 */}
          <Box mt={2}>
            <IconButton color="inherit" size="small">
              <GitHubIcon />
            </IconButton>
          </Box>

          {/* 하트 아이콘과 함께 */}
          <Box mt={1} display="flex" justifyContent="center" alignItems="center" gap={0.5}>
            <Typography variant="caption" color="text.secondary">
              Made with
            </Typography>
            <FavoriteIcon sx={{ fontSize: 14, color: 'error.main' }} />
            <Typography variant="caption" color="text.secondary">
              for React learners
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;