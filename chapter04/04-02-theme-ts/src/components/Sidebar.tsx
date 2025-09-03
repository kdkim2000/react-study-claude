import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar
} from '@mui/material';
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { mode, isDarkMode } = useTheme();

  const menuItems = [
    { icon: <HomeIcon />, text: '홈', id: 'home' },
    { icon: <SettingsIcon />, text: '설정', id: 'settings' },
    { icon: <InfoIcon />, text: '정보', id: 'info' },
  ];

  return (
    <Drawer 
      anchor="left" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        }
      }}
    >
      {/* 사이드바 헤더 */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Avatar 
          sx={{ 
            width: 60, 
            height: 60, 
            mx: 'auto', 
            mb: 1,
            bgcolor: 'primary.main'
          }}
        >
          <PersonIcon />
        </Avatar>
        <Typography variant="h6" gutterBottom>
          사용자
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {mode} 테마 사용 중
        </Typography>
      </Box>

      {/* 메뉴 목록 */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* 테마 정보 */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: 'action.hover', 
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            현재 테마 상태
          </Typography>
          <Typography variant="caption" color="text.secondary">
            모드: {mode}<br/>
            다크 모드: {isDarkMode ? 'ON' : 'OFF'}<br/>
            저장됨: localStorage
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;