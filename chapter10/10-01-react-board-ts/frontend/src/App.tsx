import React, { useState } from 'react';
import { 
  Container, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Storage } from '@mui/icons-material';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import { Post } from './types';

// Material-UI 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Noto Sans KR"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// 뷰 모드 타입
type ViewMode = 'list' | 'detail' | 'create' | 'edit';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // 게시글 선택
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setViewMode('detail');
  };

  // 게시글 작성
  const handleCreatePost = () => {
    setSelectedPost(null);
    setViewMode('create');
  };

  // 게시글 수정
  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setViewMode('edit');
  };

  // 목록으로 돌아가기
  const handleBack = () => {
    setSelectedPost(null);
    setViewMode('list');
  };

  // 저장 후 목록으로 돌아가기
  const handleSave = () => {
    setSelectedPost(null);
    setViewMode('list');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 상단 앱바 */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              React Board
            </Typography>
            <Chip 
              icon={<Storage />}
              label="File Database" 
              size="small" 
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.3)',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Node.js + React Tutorial
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <Container maxWidth="md" sx={{ py: 4, minHeight: 'calc(100vh - 64px)' }}>
        {viewMode === 'list' && (
          <PostList 
            onSelectPost={handleSelectPost}
            onCreatePost={handleCreatePost}
          />
        )}

        {viewMode === 'detail' && selectedPost && (
          <PostDetail
            postId={selectedPost.id}
            onBack={handleBack}
            onEdit={handleEditPost}
            onDelete={handleBack}
          />
        )}

        {viewMode === 'create' && (
          <PostForm
            onBack={handleBack}
            onSave={handleSave}
          />
        )}

        {viewMode === 'edit' && selectedPost && (
          <PostForm
            post={selectedPost}
            onBack={handleBack}
            onSave={handleSave}
          />
        )}
      </Container>

      {/* 푸터 */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'grey.100', 
          py: 3, 
          mt: 'auto',
          textAlign: 'center',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          🚀 React Board Tutorial - Chapter 10: Backend Integration
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Node.js + Express.js + File Database + React + TypeScript + Material-UI
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;