import { useEffect, useRef, useState, useCallback } from 'react';
import type { ConnectionStatus, WebSocketEvents } from '../types/notification';

const WEBSOCKET_URL = 'ws://localhost:8080';

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
      return;
    }

    console.log('WebSocket 연결 시도...');
    setConnectionStatus('reconnecting');

    const ws = new WebSocket(WEBSOCKET_URL);

    // 연결 성공
    ws.onopen = () => {
      console.log('WebSocket 연결됨');
      setConnectionStatus('connected');
      setIsReconnecting(false);
      reconnectAttemptsRef.current = 0;
    };

    // 메시지 수신
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { type, payload } = data;
        
        // 등록된 이벤트 리스너들 호출
        const listeners = eventListenersRef.current.get(type) || [];
        listeners.forEach(listener => listener(payload));
      } catch (error) {
        console.error('WebSocket 메시지 파싱 에러:', error);
      }
    };

    // 연결 끊김
    ws.onclose = () => {
      console.log('WebSocket 연결 끊김');
      setConnectionStatus('disconnected');
      
      // 자동 재연결 시도
      if (reconnectAttemptsRef.current < maxReconnectAttempts && !isReconnecting) {
        setIsReconnecting(true);
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          console.log(`재연결 시도 ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
          connect();
        }, delay);
      }
    };

    // 연결 에러
    ws.onerror = (error) => {
      console.error('WebSocket 연결 에러:', error);
      setConnectionStatus('disconnected');
    };

    wsRef.current = ws;
  }, [isReconnecting]);

  // WebSocket 연결 해제
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
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
  }, []);

  // 이벤트 리스너 제거
  const off = useCallback(<K extends keyof WebSocketEvents>(
    event: K,
    callback?: WebSocketEvents[K]
  ) => {
    if (!callback) {
      eventListenersRef.current.delete(event);
      return;
    }
    
    const listeners = eventListenersRef.current.get(event) || [];
    const filteredListeners = listeners.filter(listener => listener !== callback);
    
    if (filteredListeners.length === 0) {
      eventListenersRef.current.delete(event);
    } else {
      eventListenersRef.current.set(event, filteredListeners);
    }
  }, []);

  // 이벤트 전송
  const emit = useCallback((event: string, data?: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: event, payload: data }));
    }
  }, []);

  // 컴포넌트 마운트 시 연결
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connectionStatus,
    isReconnecting,
    connect,
    disconnect,
    on,
    off,
    emit,
  };
};