import { useEffect, useRef, useState, useCallback } from 'react';
import type { ConnectionStatus, WebSocketEvents } from '../types/notification';

// 환경에 따른 WebSocket URL 설정
const getWebSocketURL = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  const port = '8080'; // 백엔드 포트
  return `${protocol}//${host}:${port}`;
};

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const eventListenersRef = useRef<Map<string, Function[]>>(new Map());

  // WebSocket 연결
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket이 이미 연결되어 있습니다');
      return;
    }

    const wsUrl = getWebSocketURL();
    console.log(`WebSocket 연결 시도... ${wsUrl}`);
    setConnectionStatus('reconnecting');

    try {
      const ws = new WebSocket(wsUrl);

      // 연결 성공
      ws.onopen = () => {
        console.log('✅ WebSocket 연결됨');
        setConnectionStatus('connected');
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
      };

      // 메시지 수신
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket 메시지 수신:', data);
          
          const { type, payload } = data;
          
          // 등록된 이벤트 리스너들 호출
          const listeners = eventListenersRef.current.get(type) || [];
          listeners.forEach(listener => {
            try {
              listener(payload);
            } catch (error) {
              console.error(`이벤트 리스너 실행 오류 (${type}):`, error);
            }
          });
        } catch (error) {
          console.error('WebSocket 메시지 파싱 에러:', error);
        }
      };

      // 연결 끊김
      ws.onclose = (event) => {
        console.log('❌ WebSocket 연결 끊김:', event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // 정상적인 종료가 아닐 때만 재연결 시도
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts && !isReconnecting) {
          setIsReconnecting(true);
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          
          console.log(`🔄 ${delay}ms 후 재연결 시도 (${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        }
      };

      // 연결 에러
      ws.onerror = (error) => {
        console.error('❌ WebSocket 연결 에러:', error);
        setConnectionStatus('disconnected');
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket 생성 에러:', error);
      setConnectionStatus('disconnected');
      
      // 연결 실패 시 재시도
      if (reconnectAttemptsRef.current < maxReconnectAttempts && !isReconnecting) {
        setIsReconnecting(true);
        const delay = 2000;
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      }
    }
  }, [isReconnecting]);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    console.log('🔌 WebSocket 연결 해제');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      // 정상 종료 코드로 닫기
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setConnectionStatus('disconnected');
    setIsReconnecting(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  // 이벤트 리스너 등록
  const on = useCallback(<K extends keyof WebSocketEvents>(
    event: K,
    callback: WebSocketEvents[K]
  ) => {
    const listeners = eventListenersRef.current.get(event) || [];
    listeners.push(callback);
    eventListenersRef.current.set(event, listeners);
    console.log(`📋 이벤트 리스너 등록: ${event}`);
  }, []);

  // 이벤트 리스너 제거
  const off = useCallback(<K extends keyof WebSocketEvents>(
    event: K,
    callback?: WebSocketEvents[K]
  ) => {
    if (!callback) {
      eventListenersRef.current.delete(event);
      console.log(`🗑️ 모든 이벤트 리스너 제거: ${event}`);
      return;
    }
    
    const listeners = eventListenersRef.current.get(event) || [];
    const filteredListeners = listeners.filter(listener => listener !== callback);
    
    if (filteredListeners.length === 0) {
      eventListenersRef.current.delete(event);
    } else {
      eventListenersRef.current.set(event, filteredListeners);
    }
    console.log(`🗑️ 이벤트 리스너 제거: ${event}`);
  }, []);

  // 이벤트 전송
  const emit = useCallback((event: string, data?: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type: event, payload: data });
      wsRef.current.send(message);
      console.log('📤 WebSocket 메시지 전송:', { type: event, payload: data });
    } else {
      console.warn('⚠️ WebSocket이 연결되어 있지 않습니다. 메시지 전송 실패:', event);
    }
  }, []);

  // 수동 재연결
  const reconnect = useCallback(() => {
    console.log('🔄 수동 재연결 시도');
    disconnect();
    setTimeout(() => {
      reconnectAttemptsRef.current = 0;
      setIsReconnecting(false);
      connect();
    }, 1000);
  }, [connect, disconnect]);

  // 컴포넌트 마운트 시 연결
  useEffect(() => {
    console.log('🚀 WebSocket 훅 초기화');
    
    // 백엔드가 준비될 시간을 주기 위해 약간 지연
    const initTimeout = setTimeout(() => {
      console.log('🔌 WebSocket 연결 시작');
      connect();
    }, 500); // 500ms 후 연결 시도

    return () => {
      console.log('🧹 WebSocket 훅 정리');
      clearTimeout(initTimeout);
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connectionStatus,
    isReconnecting,
    connect,
    disconnect,
    reconnect,
    on,
    off,
    emit,
  } as WebSocketHookReturn;
};