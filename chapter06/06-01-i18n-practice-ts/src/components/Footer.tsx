import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useTranslation } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mt: 4,
        p: 3,
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
      }}
    >
      <Typography 
        variant="h6" 
        component="h3" 
        gutterBottom
        color="primary"
        sx={{ fontWeight: 'bold' }}
      >
        {t('footer.technology')}
      </Typography>
      
      <Divider sx={{ my: 2, maxWidth: 300, margin: '16px auto' }} />
      
      <Typography 
        variant="body1" 
        gutterBottom
        sx={{ mb: 2 }}
      >
        {t('footer.madeWith')} React & TypeScript
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ fontSize: '0.9rem' }}
      >
        © {currentYear} {t('footer.copyright')}
      </Typography>
    </Paper>
  );
};

export default Footer;