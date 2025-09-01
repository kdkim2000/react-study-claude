import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Alert,
  Divider,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckBoxOutlined as SelectAllIcon,
  CheckBoxOutlineBlankOutlined as ClearAllIcon,
  Group as GroupIcon,
  ViewModule as ViewIcon
} from '@mui/icons-material';
import { User, FilterOptions } from '../types/user';
import UserFilters from './UserFilters';
import UserCard from './UserCard';

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    selectedRoles: []
  });
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(12);

  // 필터링된 사용자 목록
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = filters.searchTerm === '' || 
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesRole = filters.selectedRoles.length === 0 ||
        filters.selectedRoles.includes(user.role);

      return matchesSearch && matchesRole;
    });
  }, [users, filters]);

  // 페이지네이션된 사용자 목록
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, usersPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleUsersPerPageChange = (event: any) => {
    setUsersPerPage(event.target.value);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
  };

  const handleUserSelectionChange = (userId: number, selected: boolean) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (selected) {
      newSelectedUsers.add(userId);
    } else {
      newSelectedUsers.delete(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAll = () => {
    const allVisibleUserIds = new Set(paginatedUsers.map(user => user.id));
    setSelectedUsers(prev => new Set([...prev, ...allVisibleUserIds]));
  };

  const handleSelectAllFiltered = () => {
    const allFilteredUserIds = new Set(filteredUsers.map(user => user.id));
    setSelectedUsers(allFilteredUserIds);
  };

  const handleDeselectAll = () => {
    setSelectedUsers(new Set());
  };

  const getSelectedUsersByRole = () => {
    const selectedUsersList = users.filter(user => selectedUsers.has(user.id));
    const roleCount: Record<string, number> = {};
    
    selectedUsersList.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    });

    return roleCount;
  };

  const selectedUsersByRole = getSelectedUsersByRole();

  return (
    <Box>
      {/* 필터 컴포넌트 */}
      <UserFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalUsers={users.length}
        filteredUsers={filteredUsers.length}
      />

      {/* 선택 관련 액션 및 정보 */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <GroupIcon color="primary" />
            <Typography variant="h6">
              선택된 사용자: <strong>{selectedUsers.size}명</strong>
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            {/* 페이지 당 표시 수 선택 */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>표시 수</InputLabel>
              <Select
                value={usersPerPage}
                onChange={handleUsersPerPageChange}
                label="표시 수"
              >
                <MenuItem value={8}>8개</MenuItem>
                <MenuItem value={12}>12개</MenuItem>
                <MenuItem value={24}>24개</MenuItem>
                <MenuItem value={50}>50개</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<SelectAllIcon />}
              onClick={handleSelectAll}
              disabled={paginatedUsers.length === 0}
              size="small"
            >
              현재 페이지 선택
            </Button>
            <Button
              variant="outlined"
              startIcon={<ViewIcon />}
              onClick={handleSelectAllFiltered}
              disabled={filteredUsers.length === 0}
              size="small"
            >
              전체 검색결과 선택
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClearAllIcon />}
              onClick={handleDeselectAll}
              disabled={selectedUsers.size === 0}
              size="small"
            >
              선택 해제
            </Button>
          </Box>
        </Box>

        {/* 선택된 사용자 역할별 통계 */}
        {selectedUsers.size > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                선택된 역할별 분포:
              </Typography>
              {Object.entries(selectedUsersByRole).map(([role, count]) => (
                <Chip
                  key={role}
                  label={`${role} (${count})`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </>
        )}
      </Paper>

      {/* 페이지네이션 정보 */}
      {filteredUsers.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {filteredUsers.length}명 중 {((currentPage - 1) * usersPerPage) + 1}-{Math.min(currentPage * usersPerPage, filteredUsers.length)}명 표시
            {totalPages > 1 && ` (${currentPage}/${totalPages} 페이지)`}
          </Typography>
        </Paper>
      )}

      {/* 사용자 목록 */}
      {filteredUsers.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            검색 결과가 없습니다
          </Typography>
          <Typography variant="body2">
            검색어나 필터 조건을 확인해보세요.
          </Typography>
        </Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedUsers.map(user => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                <UserCard
                  user={user}
                  isSelected={selectedUsers.has(user.id)}
                  onSelectionChange={handleUserSelectionChange}
                />
              </Grid>
            ))}
          </Grid>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default UserList;