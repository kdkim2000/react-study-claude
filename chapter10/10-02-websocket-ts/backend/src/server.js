const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// 환경 변수 설정
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Express 앱 생성
const app = express();
const server = http.createServer(app);

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

console.log('📁 Project root:', __dirname);

// 데이터 디렉토리 설정
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Data directory created:', dataDir);
}

// 데이터 파일들
const notificationsFile = path.join(dataDir, 'notifications.json');
const commentsFile = path.join(dataDir, 'comments.json');
const settingsFile = path.join(dataDir, 'settings.json');

// 데이터베이스 초기화
function initializeDatabase() {
  console.log('🔧 Initializing database...');
  
  // 알림 데이터 초기화
  if (!fs.existsSync(notificationsFile)) {
    console.log('📊 Creating notifications file with sample data...');
    const initialNotifications = [
      {
        id: 'notif-1',
        title: '환영합니다!',
        message: '실시간 알림 시스템에 오신 것을 환영합니다.',
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        title: '시스템 준비 완료',
        message: 'WebSocket 연결이 준비되었습니다.',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    ];
    fs.writeFileSync(notificationsFile, JSON.stringify(initialNotifications, null, 2));
  } else {
    console.log('📊 Notifications file exists');
  }
  
  // 댓글 데이터 초기화
  if (!fs.existsSync(commentsFile)) {
    console.log('📊 Creating comments file with sample data...');
    const initialComments = [];
    fs.writeFileSync(commentsFile, JSON.stringify(initialComments, null, 2));
  } else {
    console.log('📊 Comments file exists');
  }
  
  // 설정 데이터 초기화
  if (!fs.existsSync(settingsFile)) {
    console.log('📊 Creating settings file with default values...');
    const initialSettings = {
      enabled: true,
      soundEnabled: true,
      browserNotification: true
    };
    fs.writeFileSync(settingsFile, JSON.stringify(initialSettings, null, 2));
  } else {
    console.log('📊 Settings file exists');
  }
  
  console.log('✅ Database initialized successfully');
}

// 데이터 파일 읽기/쓰기 함수
function readJsonFile(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// WebSocket 서버 설정
const wss = new WebSocketServer({ 
  server: server,
  path: '/',
  perMessageDeflate: false
});

// WebSocket 연결된 클라이언트들
const clients = new Set();

// WebSocket 이벤트 처리
wss.on('connection', (ws, request) => {
  const clientIp = request.socket.remoteAddress;
  console.log(`🔌 WebSocket client connected from ${clientIp}`);
  
  clients.add(ws);
  
  // 연결 확인 메시지 전송
  const connectionMessage = {
    type: 'connection:status',
    payload: 'connected'
  };
  ws.send(JSON.stringify(connectionMessage));
  
  // 메시지 수신 처리
  ws.on('message', (message) => {
    try {
      console.log('📨 WebSocket message received:', message.toString());
      const data = JSON.parse(message.toString());
      
      // 메시지 타입에 따른 처리
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', payload: 'pong' }));
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });
  
  // 연결 종료 처리
  ws.on('close', (code, reason) => {
    console.log(`❌ WebSocket client disconnected: code=${code}, reason=${reason}`);
    clients.delete(ws);
  });
  
  // 에러 처리
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
    clients.delete(ws);
  });
});

// 모든 클라이언트에게 메시지 브로드캐스트
function broadcastToClients(message) {
  const messageString = JSON.stringify(message);
  console.log(`📡 Broadcasting to ${clients.size} clients:`, message);
  
  clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      try {
        client.send(messageString);
      } catch (error) {
        console.error('Error sending message to client:', error);
        clients.delete(client);
      }
    } else {
      clients.delete(client);
    }
  });
}

// API 라우트들
// 알림 목록 조회
app.get('/api/notifications', (req, res) => {
  console.log('📋 Getting notifications - limit: 50, unreadOnly: false');
  try {
    const notifications = readJsonFile(notificationsFile, []);
    console.log('🔔 Loaded', notifications.length, 'notifications');
    res.json(notifications);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// 알림 읽음 처리
app.put('/api/notifications/:id/read', (req, res) => {
  console.log('📖 Marking notification as read:', req.params.id);
  try {
    const notifications = readJsonFile(notificationsFile, []);
    const notificationIndex = notifications.findIndex(n => n.id === req.params.id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notifications[notificationIndex].isRead = true;
    writeJsonFile(notificationsFile, notifications);
    
    // 읽음 처리 WebSocket 알림
    broadcastToClients({
      type: 'notification:read',
      payload: req.params.id
    });
    
    // 읽지 않은 알림 수 업데이트
    const unreadCount = notifications.filter(n => !n.isRead).length;
    broadcastToClients({
      type: 'notifications:count_updated',
      payload: unreadCount
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// 댓글 작성 (새 알림 생성)
app.post('/api/comments', (req, res) => {
  console.log('💬 Creating comment and notification:', req.body);
  try {
    const { author, content } = req.body;
    
    if (!author || !content) {
      return res.status(400).json({ error: 'Author and content are required' });
    }
    
    // 댓글 저장
    const comments = readJsonFile(commentsFile, []);
    const newComment = {
      id: `comment-${Date.now()}`,
      author,
      content,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    writeJsonFile(commentsFile, comments);
    
    // 새 알림 생성
    const notifications = readJsonFile(notificationsFile, []);
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: `새 댓글: ${author}`,
      message: content.length > 50 ? content.substring(0, 50) + '...' : content,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.unshift(newNotification);
    writeJsonFile(notificationsFile, notifications);
    
    // 새 알림 WebSocket 브로드캐스트
    broadcastToClients({
      type: 'notification:new',
      payload: newNotification
    });
    
    // 읽지 않은 알림 수 업데이트
    const unreadCount = notifications.filter(n => !n.isRead).length;
    broadcastToClients({
      type: 'notifications:count_updated',
      payload: unreadCount
    });
    
    console.log('✅ Comment created and notification sent');
    res.json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// 알림 설정 조회
app.get('/api/settings', (req, res) => {
  console.log('⚙️ Getting notification settings');
  try {
    const settings = readJsonFile(settingsFile, {
      enabled: true,
      soundEnabled: true,
      browserNotification: true
    });
    res.json(settings);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// 알림 설정 변경
app.put('/api/settings', (req, res) => {
  console.log('⚙️ Updating notification settings:', req.body);
  try {
    const { enabled, soundEnabled, browserNotification } = req.body;
    const newSettings = {
      enabled: typeof enabled === 'boolean' ? enabled : true,
      soundEnabled: typeof soundEnabled === 'boolean' ? soundEnabled : true,
      browserNotification: typeof browserNotification === 'boolean' ? browserNotification : true
    };
    
    writeJsonFile(settingsFile, newSettings);
    res.json(newSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    websocketClients: clients.size
  });
});

// 404 처리
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// 에러 처리 미들웨어
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 서버 시작
function startServer() {
  initializeDatabase();
  
  server.listen(PORT, () => {
    console.log('🚀 Real-time Notification Backend Started');
    console.log('📡 HTTP Server: http://localhost:' + PORT);
    console.log('🔌 WebSocket Server: ws://localhost:' + PORT);
    console.log('🌐 Frontend URL: http://localhost:5173');
    console.log('📊 Environment:', NODE_ENV);
    console.log('');
    console.log('📋 Available Routes:');
    console.log('  GET    /api/notifications           - 알림 목록');
    console.log('  PUT    /api/notifications/:id/read  - 알림 읽음 처리');
    console.log('  POST   /api/comments                - 댓글 작성 (알림 생성)');
    console.log('  GET    /api/settings                - 알림 설정');
    console.log('  PUT    /api/settings                - 알림 설정 변경');
    console.log('');
    console.log('🔌 WebSocket Events:');
    console.log('  📨 notification:new                - 새 알림');
    console.log('  📖 notification:read               - 알림 읽음');
    console.log('  🔗 connection:status               - 연결 상태');
    console.log('  📊 notifications:count_updated     - 읽지 않은 수 변경');
  });
}

// graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// 에러 처리
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 서버 시작
startServer();