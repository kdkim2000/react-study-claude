import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { getAllCategories } from '../data/blogPosts';

const CategoryFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const categories = getAllCategories();

  const handleCategoryChange = (category: string | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        카테고리별 필터링
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {/* 전체 카테고리 */}
        <Chip
          label="전체"
          onClick={() => handleCategoryChange(null)}
          color={!currentCategory ? 'primary' : 'default'}
          variant={!currentCategory ? 'filled' : 'outlined'}
          sx={{
            fontWeight: !currentCategory ? 'bold' : 'normal',
            '&:hover': {
              backgroundColor: !currentCategory ? 'primary.dark' : 'action.hover',
            },
          }}
        />
        
        {/* 개별 카테고리들 */}
        {categories.map((category) => {
          const isSelected = currentCategory === category.value;
          
          return (
            <Chip
              key={category.value}
              label={`${category.icon} ${category.label}`}
              onClick={() => handleCategoryChange(category.value)}
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                fontWeight: isSelected ? 'bold' : 'normal',
                backgroundColor: isSelected ? category.color : undefined,
                borderColor: category.color,
                color: isSelected ? 'white' : category.color,
                '&:hover': {
                  backgroundColor: isSelected ? category.color : `${category.color}20`,
                  borderColor: category.color,
                },
                '&.MuiChip-filled': {
                  backgroundColor: category.color,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: category.color,
                    filter: 'brightness(0.9)',
                  },
                },
              }}
            />
          );
        })}
      </Box>
      
      {/* 선택된 카테고리 표시 */}
      {currentCategory && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            선택된 카테고리: {categories.find(cat => cat.value === currentCategory)?.label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CategoryFilter;