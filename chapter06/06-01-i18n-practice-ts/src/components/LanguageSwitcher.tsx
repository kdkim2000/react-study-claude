import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useLanguage, useTranslation } from '../contexts/LanguageContext';
import { Language } from '../types/language';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { t, translations } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const selectedLanguage = event.target.value as Language;
    changeLanguage(selectedLanguage);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <LanguageIcon color="primary" />
      
      <Typography variant="body1" sx={{ minWidth: 120 }}>
        {t('common.currentLanguage')}:
      </Typography>
      
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={currentLanguage}
          onChange={handleLanguageChange}
          displayEmpty
        >
          {supportedLanguages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {translations.languages[lang]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSwitcher;