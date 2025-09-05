import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useTranslation } from '../contexts/LanguageContext';

const MainContent: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <SettingsIcon color="primary" />,
      text: t('main.features.contextApi'),
    },
    {
      icon: <StorageIcon color="primary" />,
      text: t('main.features.localStorage'),
    },
    {
      icon: <CodeIcon color="primary" />,
      text: t('main.features.typescript'),
    },
    {
      icon: <PaletteIcon color="primary" />,
      text: t('main.features.materialUi'),
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {/* 프로젝트 소개 섹션 */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography 
              variant="h4" 
              component="h3" 
              gutterBottom
              color="primary"
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              {t('main.aboutTitle')}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: 'text.secondary',
                flexGrow: 1,
              }}
            >
              {t('main.aboutContent')}
            </Typography>
          </Paper>
        </Grid>

        {/* 주요 기능 섹션 */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
            }}
          >
            <Typography 
              variant="h4" 
              component="h3" 
              gutterBottom
              color="primary"
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              {t('main.featuresTitle')}
            </Typography>
            
            <List disablePadding>
              {features.map((feature, index) => (
                <ListItem 
                  key={index} 
                  disablePadding
                  sx={{ mb: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={feature.text}
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      lineHeight: 1.6,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainContent;