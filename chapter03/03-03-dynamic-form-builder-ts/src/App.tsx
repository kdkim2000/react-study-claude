import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Paper
} from '@mui/material';
import {
  Build as BuildIcon,
  Visibility as PreviewIcon,
  Description as FormIcon
} from '@mui/icons-material';
import { FormConfig } from './types/form';
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

type ViewMode = 'builder' | 'preview';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: '새 폼',
    description: '',
    fields: []
  });

  const handleConfigChange = (config: FormConfig) => {
    setFormConfig(config);
  };

  const handlePreview = () => {
    setViewMode('preview');
  };

  const handleBackToBuilder = () => {
    setViewMode('builder');
  };

  const handleSaveConfig = () => {
    const dataStr = JSON.stringify(formConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formConfig.title || 'form'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        setFormConfig(config);
      } catch (error) {
        alert('잘못된 파일 형식입니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 앱바 */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <FormIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            동적 폼 빌더
          </Typography>
          
          {viewMode === 'builder' && (
            <Box display="flex" gap={1}>
              <input
                type="file"
                accept=".json"
                onChange={handleLoadConfig}
                style={{ display: 'none' }}
                id="load-config"
              />
              <label htmlFor="load-config">
                <Button variant="outlined" component="span" sx={{ color: 'white', borderColor: 'white' }}>
                  불러오기
                </Button>
              </label>
              <Button 
                variant="outlined" 
                onClick={handleSaveConfig}
                disabled={formConfig.fields.length === 0}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                저장
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {viewMode === 'builder' ? (
          <>
            {/* 인트로 섹션 */}
            <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <BuildIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                동적 폼 빌더
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                직관적인 인터페이스로 맞춤형 폼을 제작하고 실시간으로 미리보기하세요
              </Typography>
            </Paper>

            {/* 기능 설명 */}
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap={3} mb={4}>
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  다양한 필드 타입
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  텍스트, 숫자, 이메일, 선택박스, 체크박스 등 8가지 타입 지원
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  실시간 유효성 검사
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  필수값, 길이, 범위 등 다양한 검증 규칙을 실시간으로 적용
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  JSON 내보내기
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  완성된 폼을 JSON 형태로 저장하고 다시 불러올 수 있습니다
                </Typography>
              </Paper>
            </Box>

            {/* 폼 빌더 */}
            <FormBuilder
              config={formConfig}
              onConfigChange={handleConfigChange}
              onPreview={handlePreview}
            />
          </>
        ) : (
          <FormPreview
            config={formConfig}
            onBack={handleBackToBuilder}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;