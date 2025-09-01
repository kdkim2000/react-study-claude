import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box
} from '@mui/material';
import {
  History as HistoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface SearchHistoryProps {
  history: string[];
  onHistoryClick: (query: string) => void;
  onHistoryDelete: (query: string) => void;
  onHistoryClear: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onHistoryClick,
  onHistoryDelete,
  onHistoryClear
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Paper elevation={1} sx={{ mt: 1 }}>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            최근 검색
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={onHistoryClear}
          >
            전체 삭제
          </Typography>
        </Box>
        
        <List dense>
          {history.map((query, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => onHistoryClick(query)}>
                <ListItemIcon>
                  <HistoryIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={query} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onHistoryDelete(query);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default SearchHistory;