import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Box,
  Divider,
  TextField,
  Alert,
  Chip,
} from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Refresh as ResetIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import ColorPicker from './ColorPicker';
import { fontSizeMap } from '../types/theme';

const ThemePanel: React.FC = () => {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useTheme();
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState('');

  // 다크 모드 토글
  const handleModeChange = () => {
    updateSettings({ mode: settings.mode === 'light' ? 'dark' : 'light' });
  };

  // 폰트 크기 변경
  const handleFontSizeChange = (value: number) => {
    const fontSizes = Object.keys(fontSizeMap) as Array<keyof typeof fontSizeMap>;
    const fontSize = fontSizes[value];
    updateSettings({ fontSize });
  };

  // 테마 내보내기
  const handleExport = () => {
    const settingsJson = exportSettings();
    navigator.clipboard.writeText(settingsJson);
    setMessage('테마 설정이 클립보드에 복사되었습니다!');
    setTimeout(() => setMessage(''), 3000);
  };

  // 테마 가져오기
  const handleImport = () => {
    if (importText.trim()) {
      const success = importSettings(importText);
      if (success) {
        setMessage('테마 설정이 성공적으로 적용되었습니다!');
        setImportText('');
      } else {
        setMessage('유효하지 않은 테마 설정입니다.');
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const fontSizeIndex = Object.keys(fontSizeMap).indexOf(settings.fontSize);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        🎨 테마 설정
      </Typography>

      {/* 메시지 표시 */}
      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* 다크/라이트 모드 */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.mode === 'dark'}
              onChange={handleModeChange}
              icon={<LightIcon />}
              checkedIcon={<DarkIcon />}
            />
          }
          label={`${settings.mode === 'dark' ? '다크' : '라이트'} 모드`}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 기본 색상 설정 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          기본 색상
        </Typography>
        <ColorPicker
          label="Primary"
          color={settings.primaryColor}
          onChange={(color) => updateSettings({ primaryColor: color })}
        />
      </Box>

      {/* 보조 색상 설정 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          보조 색상
        </Typography>
        <ColorPicker
          label="Secondary"
          color={settings.secondaryColor}
          onChange={(color) => updateSettings({ secondaryColor: color })}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 폰트 크기 설정 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          폰트 크기: {settings.fontSize}
        </Typography>
        <Slider
          value={fontSizeIndex}
          onChange={(_, value) => handleFontSizeChange(value as number)}
          min={0}
          max={2}
          step={1}
          marks={[
            { value: 0, label: '작게' },
            { value: 1, label: '보통' },
            { value: 2, label: '크게' },
          ]}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 현재 설정 미리보기 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          현재 설정
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={settings.mode} color="primary" size="small" />
          <Chip 
            label="Primary" 
            size="small"
            sx={{ bgcolor: settings.primaryColor, color: 'white' }}
          />
          <Chip 
            label="Secondary" 
            size="small"
            sx={{ bgcolor: settings.secondaryColor, color: 'white' }}
          />
          <Chip label={settings.fontSize} color="secondary" size="small" />
        </Box>
      </Box>

      {/* 액션 버튼들 */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ResetIcon />}
          onClick={resetSettings}
          size="small"
        >
          초기화
        </Button>
        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          onClick={handleExport}
          size="small"
        >
          내보내기
        </Button>
      </Box>

      {/* 가져오기 */}
      <Box>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="테마 설정 JSON을 붙여넣으세요"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          size="small"
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<ImportIcon />}
          onClick={handleImport}
          size="small"
          disabled={!importText.trim()}
        >
          가져오기
        </Button>
      </Box>
    </Paper>
  );
};

export default ThemePanel;