import React, { useState } from 'react';
import {
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Box,
  Divider,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  VolumeUp as VolumeIcon,
  Computer as BrowserIcon,
} from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';
import type { NotificationSettings as SettingsType } from '../types/notification';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useNotification();
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSettingChange = (key: keyof SettingsType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: event.target.checked,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings(localSettings);
      
      setSnackbar({
        open: true,
        message: '설정이 저장되었습니다',
        severity: 'success',
      });
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setSnackbar({
        open: true,
        message: '설정 저장에 실패했습니다',
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(localSettings);

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          알림 설정
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          {/* 알림 활성화 */}
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.enabled}
                onChange={handleSettingChange('enabled')}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <NotificationsIcon />
                <Box>
                  <Typography variant="body1">
                    알림 받기
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    새로운 알림을 받을지 설정합니다
                  </Typography>
                </Box>
              </Box>
            }
          />

          <Divider sx={{ my: 2 }} />

          {/* 소리 알림 */}
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.soundEnabled && localSettings.enabled}
                onChange={handleSettingChange('soundEnabled')}
                disabled={!localSettings.enabled}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <VolumeIcon />
                <Box>
                  <Typography variant="body1">
                    소리 알림
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    알림 시 소리로 알려줍니다
                  </Typography>
                </Box>
              </Box>
            }
          />

          <Divider sx={{ my: 2 }} />

          {/* 브라우저 알림 */}
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.browserNotification && localSettings.enabled}
                onChange={handleSettingChange('browserNotification')}
                disabled={!localSettings.enabled}
                color="primary"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <BrowserIcon />
                <Box>
                  <Typography variant="body1">
                    브라우저 알림
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    브라우저 푸시 알림을 표시합니다
                  </Typography>
                </Box>
              </Box>
            }
          />
        </Box>

        {/* 저장 버튼 */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? '저장 중...' : '설정 저장'}
          </Button>
        </Box>
      </Paper>

      {/* 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};