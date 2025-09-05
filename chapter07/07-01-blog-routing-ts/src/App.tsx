import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Routes>
          {/* 홈 페이지 */}
          <Route path="/" element={<HomePage />} />
          
          {/* 포스트 목록 페이지 */}
          <Route path="/posts" element={<PostsPage />} />
          
          {/* 포스트 상세 페이지 */}
          <Route path="/posts/:id" element={<PostDetailPage />} />
          
          {/* 404 페이지 (추가 예정) */}
          <Route path="*" element={<PostsPage />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;