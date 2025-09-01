import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  InputAdornment,
  Paper,
  Typography
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { UserRole, USER_ROLES, FilterOptions } from '../types/user';

interface UserFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalUsers: number;
  filteredUsers: number;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  totalUsers,
  filteredUsers
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchTerm: event.target.value
    });
  };

  const handleRoleChange = (event: SelectChangeEvent<UserRole[]>) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      selectedRoles: typeof value === 'string' ? value.split(',') as UserRole[] : value
    });
  };

  const getRoleColor = (role: UserRole) => {
    return USER_ROLES.find(r => r.value === role)?.color || '#gray';
  };

  const getRoleLabel = (role: UserRole) => {
    return USER_ROLES.find(r => r.value === role)?.label || role;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <FilterIcon color="primary" />
        <Typography variant="h6" component="h2">
          사용자 검색 및 필터
        </Typography>
      </Box>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        {/* 검색 입력 */}
        <TextField
          fullWidth
          placeholder="이름 또는 이메일로 검색..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: '300px' }}
        />

        {/* 역할 필터 */}
        <FormControl sx={{ minWidth: '200px' }}>
          <InputLabel>역할 필터</InputLabel>
          <Select
            multiple
            value={filters.selectedRoles}
            onChange={handleRoleChange}
            input={<OutlinedInput label="역할 필터" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((role) => (
                  <Chip
                    key={role}
                    label={getRoleLabel(role)}
                    size="small"
                    sx={{ 
                      backgroundColor: getRoleColor(role),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                ))}
              </Box>
            )}
          >
            {USER_ROLES.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                <Chip
                  label={role.label}
                  size="small"
                  sx={{ 
                    backgroundColor: role.color,
                    color: 'white',
                    fontWeight: 'bold',
                    mr: 1
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 결과 통계 */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <Typography variant="body2" color="text.secondary">
          전체 사용자: <strong>{totalUsers}명</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          필터링된 사용자: <strong>{filteredUsers}명</strong>
        </Typography>
        {filteredUsers < totalUsers && (
          <Typography variant="body2" color="warning.main">
            ({((filteredUsers / totalUsers) * 100).toFixed(1)}% 표시 중)
          </Typography>
        )}
        {filters.searchTerm && (
          <Typography variant="body2" color="primary">
            '{filters.searchTerm}' 검색 중
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default UserFilters;