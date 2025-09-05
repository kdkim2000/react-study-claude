import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { useTranslation } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        mb: 3,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 2 }}
      >
        {t('common.title')}
      </Typography>
      
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          opacity: 0.9,
          mb: 3,
          fontWeight: 300,
        }}
      >
        {t('common.subtitle')}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          {t('header.welcome')}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.1rem',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {t('header.description')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Header;