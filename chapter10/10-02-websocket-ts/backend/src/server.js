const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const notificationRoutes = require('./routes/notifications');
const commentRoutes = require('./routes/comments');
const settingsRoutes = require('./routes/settings');
const { initDatabase } = require('./database/database');
const { errorHandler } = require('./middleware/errorHandler');
const NotificationService = require('./services/NotificationService');

const app = express();
const server = createServer(app);

// Socket.IO 설정
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8080;

// 미들웨어 설정
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 전역 변수로 io 인스턴스를 저장 (다른 파일에서 사용하기 위해)
app.set('io', io);

// 알림 서비스 초기화
const notificationService = new NotificationService(io);

// 라우트 설정
app.use('/api/notifications', notificationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/settings', settingsRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Real-time Notification Backend API',
    version: '1.0.0',
    features: {
      websocket: 'Socket.IO',
      database: 'JSON File Database',
      realtime: true
    },
    endpoints: {
      notifications: '/api/notifications',
      comments: '/api/comments',
      settings: '/api/settings',
      health: '/health',
      websocket: '/socket.io'
    },
    documentation: {
      get_notifications: 'GET /api/notifications',
      mark_as_read: 'PUT /api/notifications/:id/read',
      create_comment: 'POST /api/comments',
      get_settings: 'GET /api/settings',
      update_settings: 'PUT /api/settings'
    },
    websocket_events: {
      client_to_server: [
        'join_room',
        'mark_notification_read'
      ],
      server_to_client: [
        'notification:new',
        'notification:read',
        'connection:status',
        'notifications:count_updated'
      ]
    }
  });
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'File Database',
    websocket: 'Socket.IO Active',
    memory: process.memoryUsage(),
    connections: io.engine.clientsCount
  });
});

// WebSocket 연결 관리
io.on('connection', (socket) => {
  console.log(`📱 Client connected: ${socket.id}`);

  // 클라이언트를 기본 룸에 추가
  socket.join('notifications');

  // 연결 상태 전송
  socket.emit('connection:status', {
    status: 'connected',
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });

  // 클라이언트가 룸 참여 요청
  socket.on('join_room', (data) => {
    const { room = 'notifications' } = data || {};
    socket.join(room);
    console.log(`🏠 Client ${socket.id} joined room: ${room}`);
    
    socket.emit('connection:status', {
      status: 'joined',
      room: room,
      timestamp: new Date().toISOString()
    });
  });

  // 알림 읽음 처리
  socket.on('mark_notification_read', async (data) => {
    try {
      const { notificationId } = data;
      console.log(`📖 Marking notification as read: ${notificationId}`);
      
      const success = await notificationService.markAsRead(notificationId);
      if (success) {
        // 모든 클라이언트에게 알림 상태 변경 알림
        io.to('notifications').emit('notification:read', {
          notificationId,
          timestamp: new Date().toISOString()
        });

        // 읽지 않은 알림 수 업데이트
        const unreadCount = await notificationService.getUnreadCount();
        io.to('notifications').emit('notifications:count_updated', {
          unreadCount,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      socket.emit('error', {
        message: '알림 상태 변경에 실패했습니다.',
        error: error.message
      });
    }
  });

  // 연결 해제
  socket.on('disconnect', (reason) => {
    console.log(`📱 Client disconnected: ${socket.id}, reason: ${reason}`);
  });

  // 에러 처리
  socket.on('error', (error) => {
    console.error(`🚨 Socket error for ${socket.id}:`, error);
  });
});

// 404 처리
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// 에러 핸들링 미들웨어
app.use(errorHandler);

// 서버 시작
async function startServer() {
  try {
    // 데이터베이스 초기화
    console.log('🔧 Initializing database...');
    await initDatabase();
    console.log('✅ Database initialized successfully');

    // 알림 서비스 시작
    await notificationService.initialize();
    console.log('🔔 Notification service initialized');

    // 서버 시작
    server.listen(PORT, () => {
      console.log('🚀 Real-time Notification Backend Started');
      console.log(`📡 HTTP Server: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
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

    // 서버 에러 처리
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try changing the PORT in .env file');
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

// 서버 시작
startServer();