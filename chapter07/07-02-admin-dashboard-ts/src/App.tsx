import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Routes>
            {/* 공개 라우트 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* 보호된 대시보드 라우트 (중첩 라우팅) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* 중첩된 라우트들 */}
              <Route path="overview" element={<OverviewPage />} />
              
              {/* 관리자 전용 라우트 */}
              <Route
                path="users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* 루트 경로 리다이렉트 */}
            <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
            
            {/* 404 처리 */}
            <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
          </Routes>
        </Box>
      </Router>
    </AuthProvider>
  );
};

export default App;