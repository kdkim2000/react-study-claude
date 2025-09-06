const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const postRoutes = require('./routes/posts');
const { initDatabase } = require('./database/database');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
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

// 라우트 설정
app.use('/api/posts', postRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '🚀 React Board Backend API',
    version: '1.0.0',
    database: 'JSON File Database',
    endpoints: {
      posts: '/api/posts',
      health: '/health'
    },
    documentation: {
      posts_list: 'GET /api/posts?page=0&size=10',
      post_detail: 'GET /api/posts/:id',
      create_post: 'POST /api/posts',
      update_post: 'PUT /api/posts/:id',
      delete_post: 'DELETE /api/posts/:id'
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
    memory: process.memoryUsage()
  });
});

// 404 처리 (모든 라우트 후에 위치)
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// 에러 핸들링 미들웨어 (맨 마지막에 위치)
app.use(errorHandler);

// 서버 시작
async function startServer() {
  try {
    // 데이터베이스 초기화
    console.log('🔧 Initializing database...');
    await initDatabase();
    console.log('✅ Database initialized successfully');

    // 서버 시작
    const server = app.listen(PORT, () => {
      console.log('🚀 React Board Backend Server Started');
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`🌐 API endpoints: http://localhost:${PORT}/api/posts`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('📋 Available Routes:');
      console.log('  GET    /api/posts?page=0&size=10  - 게시글 목록');
      console.log('  GET    /api/posts/:id             - 게시글 상세');
      console.log('  POST   /api/posts                 - 게시글 작성');
      console.log('  PUT    /api/posts/:id             - 게시글 수정');
      console.log('  DELETE /api/posts/:id             - 게시글 삭제');
    });

    // 서버 에러 처리
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try changing the PORT in .env file or stop other services');
        console.log(`💡 To find what's using port ${PORT}:`);
        console.log(`   Windows: netstat -ano | findstr :${PORT}`);
        console.log(`   macOS/Linux: lsof -i :${PORT}`);
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 서버 시작
startServer();