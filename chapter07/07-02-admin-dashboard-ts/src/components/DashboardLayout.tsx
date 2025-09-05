import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DRAWER_WIDTH = 240;

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  // 네비게이션 메뉴 아이템들
  const menuItems = [
    {
      text: '대시보드',
      path: '/dashboard/overview',
      icon: <DashboardIcon />,
      requiredRole: null,
    },
    {
      text: '사용자 관리',
      path: '/dashboard/users',
      icon: <PeopleIcon />,
      requiredRole: 'admin' as const,
    },
    {
      text: '프로필',
      path: '/dashboard/profile',
      icon: <PersonIcon />,
      requiredRole: null,
    },
  ];

  // 사용자 역할에 따른 메뉴 필터링
  const filteredMenuItems = menuItems.filter(item => 
    !item.requiredRole || user?.role === item.requiredRole
  );

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          📊 Admin Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.50',
                  borderRight: 3,
                  borderColor: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    color: 'primary.main',
                    fontWeight: 'bold',
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* 앱바 */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            관리자 대시보드
          </Typography>

          {/* 사용자 역할 표시 */}
          <Chip
            label={user?.role === 'admin' ? '관리자' : '사용자'}
            size="small"
            color={user?.role === 'admin' ? 'secondary' : 'default'}
            sx={{ mr: 2 }}
          />

          {/* 사용자 프로필 */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user?.avatar || user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>

          {/* 프로필 메뉴 */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem component={RouterLink} to="/dashboard/profile">
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              프로필 설정
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              로그아웃
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* 사이드바 */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* 모바일 드로어 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // 모바일 성능 최적화
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>

        {/* 데스크톱 드로어 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* 메인 콘텐츠 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        {/* 중첩된 라우트가 렌더링되는 곳 */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;