import { useState } from 'react';
import {
  Typography,
  TextField,
  Box,
  Avatar,
  Alert
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import CustomButton from '../../components/ui/CustomButton';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from '../../hooks/useSnackbar';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, loading } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    const result = await login({ email, password });
    
    if (result.success) {
      showSuccess('로그인에 성공했습니다!');
      onLoginSuccess();
    } else {
      setError(result.error || '로그인에 실패했습니다.');
      showError(result.error || '로그인에 실패했습니다.');
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          계정에 로그인하여 서비스를 이용하세요
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
        />
        
        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          loading={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          로그인
        </CustomButton>

        <Box textAlign="center" mt={2}>
          <Typography variant="caption" color="text.secondary">
            데모용 계정: 아무 이메일과 비밀번호로 로그인 가능
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;