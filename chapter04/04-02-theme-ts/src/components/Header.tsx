import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { mode, toggleTheme, isDarkMode } = useTheme();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* 로고 */}
        <PaletteIcon sx={{ mr: 2 }} />
        
        {/* 제목 */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          테마 설정 시스템
        </Typography>

        {/* 현재 테마 상태 표시 */}
        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            현재: {mode === 'light' ? '라이트' : '다크'} 모드
          </Typography>
          
          {/* 테마 토글 버튼 */}
          <Tooltip title={`${isDarkMode ? '라이트' : '다크'} 모드로 변경`}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;