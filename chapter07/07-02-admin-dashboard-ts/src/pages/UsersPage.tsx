import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Alert,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { getAllUsers } from '../data/mockUsers';
import { User } from '../types/auth';

const UsersPage: React.FC = () => {
  const users = getAllUsers();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleChip = (role: User['role']) => {
    return role === 'admin' ? (
      <Chip
        icon={<AdminIcon />}
        label="관리자"
        color="secondary"
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    ) : (
      <Chip
        icon={<PersonIcon />}
        label="일반사용자"
        color="default"
        size="small"
      />
    );
  };

  return (
    <Box>
      {/* 페이지 헤더 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          👥 사용자 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          시스템에 등록된 모든 사용자를 관리할 수 있습니다
        </Typography>
      </Box>

      {/* 관리자 전용 안내 */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          🔒 <strong>관리자 전용 페이지</strong> - 이 페이지는 관리자 권한을 가진 사용자만 접근할 수 있습니다.
        </Typography>
      </Alert>

      {/* 사용자 통계 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 사용자 통계
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`전체 사용자: ${users.length}명`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`관리자: ${users.filter(u => u.role === 'admin').length}명`} 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            label={`일반사용자: ${users.filter(u => u.role === 'user').length}명`} 
            color="default" 
            variant="outlined" 
          />
        </Box>
      </Box>

      {/* 사용자 목록 테이블 */}
      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>사용자</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>이메일</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>역할</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>가입일</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>마지막 로그인</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {user.avatar || user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  {getRoleChip(user.role)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(user.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : '로그인 기록 없음'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 추가 기능 안내 */}
      <Paper elevation={1} sx={{ mt: 3, p: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          🚀 추가 기능 (구현 예정)
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
            사용자 검색 및 필터링
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
            사용자 권한 변경
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
            사용자 계정 활성화/비활성화
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
            대량 작업 (일괄 권한 변경 등)
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            사용자 활동 로그 조회
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default UsersPage;