import React from 'react';
import {
  Box,
  Typography,
  Badge,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  Refresh as RefreshIcon,
  DoneAll as MarkAllReadIcon,
} from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';
import { ConnectionStatus } from './ConnectionStatus';

export const NotificationHeader: React.FC = () => {
  const { 
    unreadCount, 
    isLoading, 
    refreshNotifications, 
    markAllAsRead,
    notifications
  } = useNotification();

  const handleRefresh = async () => {
    await refreshNotifications();
  };

  const handleMarkAllRead = async () => {
    if (unreadCount > 0) {
      await markAllAsRead();
    }
  };

  const hasUnreadNotifications = unreadCount > 0;
  const hasNotifications = notifications.length > 0;

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between"
      p={2}
      borderBottom={1}
      borderColor="divider"
    >
      {/* 왼쪽: 제목과 알림 수 */}
      <Box display="flex" alignItems="center" gap={2}>
        <Badge badgeContent={unreadCount} color="primary" max={99}>
          <NotificationIcon />
        </Badge>
        
        <Box>
          <Typography variant="h6" component="h1">
            알림
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {hasNotifications 
              ? `총 ${notifications.length}개 (${unreadCount}개 읽지 않음)`
              : '알림이 없습니다'
            }
          </Typography>
        </Box>
      </Box>

      {/* 오른쪽: 액션 버튼들과 연결 상태 */}
      <Box display="flex" alignItems="center" gap={1}>
        <ConnectionStatus />
        
        {hasUnreadNotifications && (
          <Tooltip title="모두 읽음으로 표시">
            <Button
              size="small"
              startIcon={<MarkAllReadIcon />}
              onClick={handleMarkAllRead}
              variant="outlined"
            >
              모두 읽음
            </Button>
          </Tooltip>
        )}
        
        <Tooltip title="새로고침">
          <IconButton
            onClick={handleRefresh}
            disabled={isLoading}
            size="small"
          >
            <RefreshIcon 
              sx={{
                animation: isLoading ? 'spin 1s linear infinite' : 'none'
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};