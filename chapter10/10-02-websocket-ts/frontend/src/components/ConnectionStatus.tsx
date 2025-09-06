import React from 'react';
import {
  Chip,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  Sync as ReconnectingIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';

export const ConnectionStatus: React.FC = () => {
  const { connectionStatus, reconnect } = useNotification();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          label: '연결됨',
          icon: <ConnectedIcon />,
          color: 'success' as const,
          description: '실시간 알림을 받을 수 있습니다',
        };
      case 'reconnecting':
        return {
          label: '재연결 중...',
          icon: <ReconnectingIcon sx={{ animation: 'spin 2s linear infinite' }} />,
          color: 'warning' as const,
          description: '서버에 연결을 시도하고 있습니다',
        };
      case 'disconnected':
      default:
        return {
          label: '연결 끊김',
          icon: <DisconnectedIcon />,
          color: 'error' as const,
          description: '실시간 알림을 받을 수 없습니다',
        };
    }
  };

  const config = getStatusConfig();

  const handleReconnect = () => {
    if (reconnect) {
      console.log('수동 재연결 시도');
      reconnect();
    } else {
      console.warn('재연결 함수를 사용할 수 없습니다');
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Tooltip title={config.description} arrow>
        <Chip
          icon={config.icon}
          label={config.label}
          color={config.color}
          size="small"
          variant="outlined"
        />
      </Tooltip>
      
      {connectionStatus === 'disconnected' && (
        <>
          <Tooltip title="수동 재연결" arrow>
            <IconButton 
              size="small" 
              onClick={handleReconnect}
              sx={{ ml: 0.5 }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="caption" color="text.secondary">
            백엔드 서버(8080)를 확인해주세요
          </Typography>
        </>
      )}
    </Box>
  );
};

// CSS 애니메이션을 위한 스타일
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);