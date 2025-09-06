import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

export const WebSocketTest: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connectionState, setConnectionState] = useState<string>('CLOSED');
  const [messages, setMessages] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('{"type": "ping", "payload": "hello"}');
  const [lastError, setLastError] = useState<string>('');

  const connect = () => {
    if (ws) {
      ws.close();
    }

    console.log('🔌 직접 WebSocket 연결 테스트 시작');
    const websocket = new WebSocket('ws://localhost:8080');
    
    websocket.onopen = (event) => {
      console.log('✅ 테스트 WebSocket 연결 성공', event);
      setConnectionState('OPEN');
      setLastError('');
      setMessages(prev => [...prev, '✅ 연결 성공']);
    };

    websocket.onmessage = (event) => {
      console.log('📨 테스트 메시지 수신:', event.data);
      setMessages(prev => [...prev, `📨 수신: ${event.data}`]);
    };

    websocket.onclose = (event) => {
      console.log('❌ 테스트 WebSocket 연결 종료:', event);
      setConnectionState('CLOSED');
      setMessages(prev => [...prev, `❌ 연결 종료: 코드=${event.code}, 이유=${event.reason}`]);
    };

    websocket.onerror = (event) => {
      console.error('❌ 테스트 WebSocket 에러:', event);
      setLastError('WebSocket 연결 오류 발생');
      setMessages(prev => [...prev, '❌ 연결 오류']);
    };

    setWs(websocket);
  };

  const disconnect = () => {
    if (ws) {
      ws.close(1000, 'Manual disconnect');
      setWs(null);
    }
  };

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(testMessage);
      setMessages(prev => [...prev, `📤 전송: ${testMessage}`]);
    } else {
      setLastError('WebSocket이 연결되어 있지 않습니다');
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setLastError('');
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const getStateColor = () => {
    switch (connectionState) {
      case 'OPEN': return 'success';
      case 'CONNECTING': return 'warning';
      case 'CLOSED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        WebSocket 연결 테스트
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip 
          label={`상태: ${connectionState}`} 
          color={getStateColor()}
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={connect}
          disabled={connectionState === 'OPEN'}
          size="small"
        >
          연결
        </Button>
        <Button
          variant="outlined"
          onClick={disconnect}
          disabled={connectionState !== 'OPEN'}
          size="small"
        >
          해제
        </Button>
        <Button
          variant="outlined"
          onClick={clearMessages}
          startIcon={<RefreshIcon />}
          size="small"
        >
          로그 지우기
        </Button>
      </Box>

      {lastError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {lastError}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="테스트 메시지"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={connectionState !== 'OPEN'}
          startIcon={<SendIcon />}
          sx={{ mt: 1 }}
          size="small"
        >
          메시지 전송
        </Button>
      </Box>

      <Box 
        sx={{ 
          maxHeight: 200, 
          overflow: 'auto', 
          backgroundColor: 'grey.100', 
          p: 1, 
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.875rem'
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            메시지가 없습니다. 위의 "연결" 버튼을 클릭해보세요.
          </Typography>
        ) : (
          messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        이 컴포넌트는 WebSocket 연결을 직접 테스트합니다. 연결이 성공하면 백엔드 로그에 연결 메시지가 나타납니다.
      </Typography>
    </Paper>
  );
};