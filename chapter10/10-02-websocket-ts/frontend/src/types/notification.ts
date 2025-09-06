import type { ConnectionStatus, WebSocketEvents } from './notification';

export interface WebSocketHookReturn {
  connectionStatus: ConnectionStatus;
  isReconnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  on: <K extends keyof WebSocketEvents>(event: K, callback: WebSocketEvents[K]) => void;
  off: <K extends keyof WebSocketEvents>(event: K, callback?: WebSocketEvents[K]) => void;
  emit: (event: string, data?: any) => void;
}