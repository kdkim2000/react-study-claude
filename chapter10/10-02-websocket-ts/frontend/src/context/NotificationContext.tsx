import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Notification, NotificationSettings } from '../types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  isLoading: boolean;
  connectionStatus: string;
  
  // 액션 함수들
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updateSettings: (settings: NotificationSettings) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  reconnect?: () => void; // WebSocket 재연결 함수 추가
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    soundEnabled: true,
    browserNotification: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // WebSocket 훅 사용
  const websocketHook = useWebSocket();
  const connectionStatus = websocketHook.connectionStatus;
  const wsOn = websocketHook.on;
  const wsOff = websocketHook.off;
  const wsReconnect = websocketHook.reconnect || (() => {
    console.log('재연결 기능을 사용할 수 없습니다');
  });

  // API 호출 함수들
  const fetchNotifications = async (): Promise<Notification[]> => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
      return [];
    }
  };

  const fetchSettings = async (): Promise<NotificationSettings> => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('설정 조회 실패:', error);
      return {
        enabled: true,
        soundEnabled: true,
        browserNotification: true,
      };
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 상태 업데이트
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      throw error;
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    // 안전한 배열 확인
    if (!Array.isArray(notifications)) {
      console.warn('notifications가 배열이 아닙니다');
      return;
    }
    
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    if (unreadNotifications.length === 0) {
      console.log('읽지 않은 알림이 없습니다');
      return;
    }
    
    try {
      // 모든 읽지 않은 알림을 병렬로 처리
      await Promise.all(
        unreadNotifications.map(notification => markAsRead(notification.id))
      );
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: NotificationSettings): Promise<void> => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setSettings(newSettings);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      throw error;
    }
  };

  const refreshNotifications = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const [notificationData, settingsData] = await Promise.all([
        fetchNotifications(),
        fetchSettings(),
      ]);
      
      setNotifications(notificationData);
      setSettings(settingsData);
      setUnreadCount(notificationData.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket 이벤트 핸들러들
  const handleNewNotification = React.useCallback((notification: Notification) => {
    console.log('새 알림 수신:', notification);
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // 브라우저 알림
    if (settings.browserNotification && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png',
      });
    }
  }, [settings.browserNotification]);

  const handleNotificationRead = React.useCallback((notificationId: string) => {
    console.log('알림 읽음 처리:', notificationId);
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const handleCountUpdated = React.useCallback((count: number) => {
    console.log('읽지 않은 수 업데이트:', count);
    setUnreadCount(count);
  }, []);

  // WebSocket 이벤트 리스너 등록
  useEffect(() => {
    console.log('WebSocket 이벤트 리스너 등록');
    
    // 이벤트 리스너 등록
    wsOn('notification:new', handleNewNotification);
    wsOn('notification:read', handleNotificationRead);
    wsOn('notifications:count_updated', handleCountUpdated);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      console.log('WebSocket 이벤트 리스너 제거');
      wsOff('notification:new', handleNewNotification);
      wsOff('notification:read', handleNotificationRead);
      wsOff('notifications:count_updated', handleCountUpdated);
    };
  }, [wsOn, wsOff, handleNewNotification, handleNotificationRead, handleCountUpdated]);

  // 초기 데이터 로딩
  useEffect(() => {
    let mounted = true;
    
    const initializeData = async () => {
      if (!mounted) return;
      
      console.log('🚀 초기 데이터 로딩 시작');
      try {
        setIsLoading(true);
        
        // 병렬로 데이터 로드
        const [notificationData, settingsData] = await Promise.all([
          fetchNotifications(),
          fetchSettings(),
        ]);
        
        if (!mounted) return;
        
        const safeNotifications = Array.isArray(notificationData) ? notificationData : [];
        console.log('✅ 초기 알림 로드 완료:', safeNotifications.length, '개');
        
        setNotifications(safeNotifications);
        setSettings(settingsData);
        setUnreadCount(safeNotifications.filter(n => !n.isRead).length);
        
        // 브라우저 알림 권한 요청
        if (settingsData.browserNotification && typeof Notification !== 'undefined' && Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
            console.log('🔔 브라우저 알림 권한:', permission);
          });
        }
      } catch (error) {
        console.error('❌ 초기 데이터 로딩 실패:', error);
        if (mounted) {
          setNotifications([]);
          setUnreadCount(0);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    initializeData();
    
    return () => {
      mounted = false;
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    isLoading,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    updateSettings,
    refreshNotifications,
    reconnect: wsReconnect,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Context 사용을 위한 커스텀 훅
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification은 NotificationProvider 내에서 사용해야 합니다');
  }
  return context;
};