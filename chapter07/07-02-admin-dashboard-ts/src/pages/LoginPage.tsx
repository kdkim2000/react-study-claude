import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import {
  Login as LoginIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types/auth';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // 로그인 후 리다이렉트할 경로 (보호된 라우트에서 온 경우 원래 경로로)
  const from = (location.state as any)?.from || '/dashboard/overview';

  // 이미 로그인되어 있다면 대시보드로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (field: keyof LoginRequest) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
      // 입력 시 에러 메시지 초기화
      if (error) setError('');
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const success = await login(credentials);
      
      if (!success) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      // 성공시 AuthContext에서 자동으로 리다이렉트됨
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const demoCredentials = [
    { email: 'admin@example.com', password: 'admin123', role: '관리자' },
    { email: 'user@example.com', password: 'user123', role: '일반사용자' },
  ];

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
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        {/* 로그인 카드 */}
        <Card elevation={8}>
          <CardContent sx={{ p: 4 }}>
            {/* 헤더 */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                📊 Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                관리자 대시보드에 로그인하세요
              </Typography>
            </Box>

            {/* 에러 메시지 */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* 로그인 폼 */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="이메일"
                type="email"
                value={credentials.email}
                onChange={handleInputChange('email')}
                margin="normal"
                required
                autoComplete="email"
                placeholder="admin@example.com"
              />
              
              <TextField
                fullWidth
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleInputChange('password')}
                margin="normal"
                required
                autoComplete="current-password"
                placeholder="비밀번호를 입력하세요"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={<LoginIcon />}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {isSubmitting ? '로그인 중...' : '로그인'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 데모 계정 정보 */}
        <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            🎯 데모 계정
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            아래 계정으로 테스트해보세요
          </Typography>
          
          {demoCredentials.map((demo, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={demo.role} 
                  size="small" 
                  color={demo.role === '관리자' ? 'primary' : 'default'}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {demo.email}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                비밀번호: {demo.password}
              </Typography>
              {index < demoCredentials.length - 1 && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;