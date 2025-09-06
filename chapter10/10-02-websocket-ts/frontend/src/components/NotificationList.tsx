import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  MarkEmailRead as MarkReadIcon,
  Circle as UnreadIcon,
} from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';
import type { Notification } from '../types/notification';

// 알림 타입별 아이콘과 색상
const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'info':
      return <InfoIcon color="info" />;
    case 'success':
      return <SuccessIcon color="success" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
    default:
      return <InfoIcon />;
  }
};

// 시간 포맷팅 함수
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return date.toLocaleDateString('ko-KR');
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  return (
    <ListItem
      disablePadding
      sx={{
        backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
        borderLeft: notification.isRead ? 'none' : '4px solid',
        borderLeftColor: 'primary.main',
      }}
    >
      <ListItemButton>
        <ListItemIcon>
          {getNotificationIcon(notification.type)}
        </ListItemIcon>
        
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: notification.isRead ? 'normal' : 'bold',
                }}
              >
                {notification.title}
              </Typography>
              {!notification.isRead && (
                <UnreadIcon sx={{ fontSize: 8, color: 'primary.main' }} />
              )}
            </Box>
          }
          secondary={
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                {notification.message}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {formatTime(notification.createdAt)}
              </Typography>
            </Box>
          }
        />

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={notification.type}
            size="small"
            variant="outlined"
            color={notification.type === 'error' ? 'error' : 'default'}
          />
          
          {!notification.isRead && (
            <Tooltip title="읽음으로 표시">
              <IconButton
                size="small"
                onClick={handleMarkAsRead}
                sx={{ ml: 1 }}
              >
                <MarkReadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export const NotificationList: React.FC = () => {
  const { notifications, markAsRead } = useNotification();

  if (notifications.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={4}
      >
        <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          알림이 없습니다
        </Typography>
        <Typography variant="body2" color="text.secondary">
          새로운 알림이 오면 여기에 표시됩니다
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={markAsRead}
        />
      ))}
    </List>
  );
};