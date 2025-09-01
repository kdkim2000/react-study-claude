import React from 'react';
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
  Chip,
  Button,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  List as AllIcon,
  Schedule as ActiveIcon,
  CheckCircle as CompletedIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { FilterType } from '../types/todo';

interface TodoFiltersProps {
  filter: FilterType;
  searchTerm: string;
  totalCount: number;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (searchTerm: string) => void;
  onClearCompleted: () => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({
  filter,
  searchTerm,
  totalCount,
  activeCount,
  completedCount,
  onFilterChange,
  onSearchChange,
  onClearCompleted
}) => {
  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: FilterType
  ) => {
    if (newFilter !== null) {
      onFilterChange(newFilter);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* 검색 */}
        <TextField
          fullWidth
          placeholder="할일 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={() => onSearchChange('')}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </Button>
              </InputAdornment>
            ),
          }}
        />

        {/* 필터 및 통계 */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          {/* 필터 버튼 */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            size="small"
          >
            <ToggleButton value="all">전체</ToggleButton>
            <ToggleButton value="active">진행중</ToggleButton>
            <ToggleButton value="completed">완료</ToggleButton>
          </ToggleButtonGroup>

          {/* 통계 정보 */}
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Chip
              label={`전체 ${totalCount}`}
              variant="outlined"
              size="small"
            />
            <Chip
              label={`진행중 ${activeCount}`}
              variant="outlined"
              size="small"
              color="primary"
            />
            <Chip
              label={`완료 ${completedCount}`}
              variant="outlined"
              size="small"
              color="success"
            />
            {completedCount > 0 && (
              <Button
                size="small"
                color="error"
                onClick={onClearCompleted}
              >
                완료된 항목 삭제
              </Button>
            )}
          </Box>
        </Box>

        {/* 현재 필터 상태 */}
        {(searchTerm || filter !== 'all') && (
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              현재 필터:
            </Typography>
            {searchTerm && (
              <Chip
                label={`검색: "${searchTerm}"`}
                size="small"
                onDelete={() => onSearchChange('')}
                color="primary"
              />
            )}
            {filter !== 'all' && (
              <Chip
                label={`상태: ${
                  filter === 'active' ? '진행중' : 
                  filter === 'completed' ? '완료' : '전체'
                }`}
                size="small"
                onDelete={() => onFilterChange('all')}
                color="secondary"
              />
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TodoFilters;