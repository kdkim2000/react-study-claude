import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box
} from '@mui/material';
import type { SearchResult } from '../types/search';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query }) => {
  if (results.length === 0) {
    return (
      <Paper elevation={1} sx={{ mt: 1 }}>
        <Box p={3} textAlign="center">
          <Typography color="text.secondary">
            '{query}'에 대한 검색 결과가 없습니다.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ mt: 1 }}>
      <Box p={2}>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          검색 결과 ({results.length}개)
        </Typography>
        
        <List>
          {results.map((result) => (
            <ListItem key={result.id} divider>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="subtitle1">
                      {result.title}
                    </Typography>
                    <Chip
                      label={result.category}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={result.description}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default SearchResults;