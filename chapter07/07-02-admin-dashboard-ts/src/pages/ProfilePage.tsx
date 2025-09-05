import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [saveMessage, setSaveMessage] = useState<string>('');

  const handleEditToggle = () => {
    if (isEditing) {
      // 편집 취소시 원래 데이터로 복원
      setEditData({
        name: user?.name || '',
        email: user?.email || '',
      });
    }
    setIsEditing(!isEditing);
    setSaveMessage('');
  };

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = () => {
    // 실제로는 API 호출을 통해 서버에 저장
    console.log('프로필 업데이트:', editData);
    
    // 성공 메시지 표시
    setSaveMessage('프로필이 성공적으로 업데이트되었습니다!');
    setIsEditing(false);
    
    // 3초 후 메시지 숨김
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <Alert severity="error">
        사용자 정보를 불러올 수 없습니다.
      </Alert>
    );
  }

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          👤 내 프로필
        </Typography>
        <Typography variant="body1" color="text.secondary">
          계정 정보를 확인하고 수정할 수 있습니다
        </Typography>
      </Box>

      {/* 저장 성공 메시지 */}
      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 프로필 기본 정보 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
              }}
            >
              {user.avatar || user.name.charAt(0)}
            </Avatar>
            
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {user.name}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Chip
                icon={user.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                label={user.role === 'admin' ? '관리자' : '일반 사용자'}
                color={user.role === 'admin' ? 'secondary' : 'default'}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Paper>
        </Grid>

        {/* 프로필 상세 정보 */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                프로필 정보
              </Typography>
              
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditToggle}
                >
                  수정
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    size="small"
                  >
                    저장
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleEditToggle}
                    size="small"
                  >
                    취소
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="이름"
                  value={isEditing ? editData.name : user.name}
                  onChange={handleInputChange('name')}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="이메일"
                  value={isEditing ? editData.email : user.email}
                  onChange={handleInputChange('email')}
                  disabled={!isEditing}
                  variant={isEditing ? 'outlined' : 'filled'}
                  type="email"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="사용자 ID"
                  value={user.id}
                  disabled
                  variant="filled"
                  helperText="사용자 ID는 변경할 수 없습니다"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="역할"
                  value={user.role === 'admin' ? '관리자' : '일반 사용자'}
                  disabled
                  variant="filled"
                  helperText="역할은 관리자가 변경할 수 있습니다"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* 계정 정보 */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              계정 정보
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    계정 생성일
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(user.createdAt)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    마지막 로그인
                  </Typography>
                  <Typography variant="body1">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : '기록 없음'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* 추가 설정 */}
      <Paper elevation={1} sx={{ mt: 3, p: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          🔒 보안 설정 (구현 예정)
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
            비밀번호 변경
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
            2단계 인증 설정
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
            로그인 기록 조회
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            계정 삭제
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;