import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import {
  Lock as LockIcon,
  ArrowBack as BackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
        }}
      >
        {/* 아이콘 */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'error.50',
            color: 'error.main',
            mb: 3,
          }}
        >
          <LockIcon sx={{ fontSize: 50 }} />
        </Box>

        {/* 에러 메시지 */}
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
          403
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          접근 권한이 없습니다
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          요청하신 페이지에 접근할 권한이 없습니다. 
          필요한 권한이 있는 계정으로 로그인해주세요.
        </Typography>

        {/* 현재 사용자 정보 */}
        {user && (
          <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="body2" gutterBottom>
              <strong>현재 로그인 계정:</strong>
            </Typography>
            <Typography variant="body2" gutterBottom>
              이름: {user.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              이메일: {user.email}
            </Typography>
            <Typography variant="body2">
              권한: {user.role === 'admin' ? '관리자' : '일반 사용자'}
            </Typography>
          </Alert>
        )}

        {/* 안내 메시지 */}
        <Box sx={{ mb: 4, p: 2, backgroundColor: 'warning.50', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.dark">
            <strong>💡 도움말:</strong><br />
            일부 페이지는 관리자 권한이 필요합니다. 
            관리자 계정으로 로그인하거나 권한 요청을 문의해주세요.
          </Typography>
        </Box>

        {/* 액션 버튼들 */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/dashboard/overview"
            variant="contained"
            startIcon={<HomeIcon />}
            size="large"
          >
            대시보드로 돌아가기
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="outlined"
            startIcon={<BackIcon />}
            size="large"
          >
            이전 페이지
          </Button>
        </Box>

        {/* 추가 안내 */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            문제가 지속되면 시스템 관리자에게 문의하세요.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;