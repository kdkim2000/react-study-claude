// 알림 타입 정의
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// WebSocket 이벤트 타입
export interface WebSocketEvents {
  'notification:new': (notification: Notification) => void;
  'notification:read': (notificationId: string) => void;
  'connection:status': (status: 'connected' | 'disconnected' | 'reconnecting') => void;
  'notifications:count_updated': (count: number) => void;
}

// 알림 설정 타입
export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  browserNotification: boolean;
}

// WebSocket 연결 상태
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';