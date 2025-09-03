import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Home, Dashboard, List } from '@mui/icons-material';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Header = ({ currentPage, onPageChange }: HeaderProps) => {
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: <Dashboard /> },
    { id: 'board', label: '게시판', icon: <List /> },
    { id: 'login', label: '로그인', icon: <Home /> },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          실무 프로젝트 구조
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              color="inherit"
              startIcon={item.icon}
              onClick={() => onPageChange(item.id)}
              variant={currentPage === item.id ? 'outlined' : 'text'}
              sx={{ 
                color: 'white',
                borderColor: currentPage === item.id ? 'white' : 'transparent'
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;