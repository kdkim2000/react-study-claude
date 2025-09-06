/**
 * 글로벌 에러 핸들링 미들웨어
 */
const errorHandler = (err, req, res, next) => {
  console.error('🚨 Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // 기본 에러 응답
  let statusCode = 500;
  let message = '서버 내부 오류가 발생했습니다.';
  let details = null;

  // 에러 타입에 따른 처리
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '입력 데이터가 유효하지 않습니다.';
    details = err.details;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = '잘못된 데이터 형식입니다.';
  } else if (err.code === 'ENOENT') {
    statusCode = 404;
    message = '요청한 리소스를 찾을 수 없습니다.';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = '외부 서비스 연결에 실패했습니다.';
  } else if (err.message.includes('Failed to')) {
    statusCode = 500;
    message = '작업 처리 중 오류가 발생했습니다.';
  } else if (err.message.includes('EADDRINUSE')) {
    statusCode = 500;
    message = '서버 포트가 이미 사용 중입니다.';
  } else if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    statusCode = 400;
    message = 'JSON 형식이 올바르지 않습니다.';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = '인증이 필요합니다.';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = '접근 권한이 없습니다.';
  } else if (err.name === 'TimeoutError') {
    statusCode = 408;
    message = '요청 시간이 초과되었습니다.';
  }

  // Socket.IO 관련 에러
  if (err.message.includes('socket') || err.message.includes('websocket')) {
    statusCode = 503;
    message = 'WebSocket 연결 오류가 발생했습니다.';
  }

  // 파일 시스템 관련 에러
  if (err.code === 'EMFILE' || err.code === 'ENFILE') {
    statusCode = 503;
    message = '서버 리소스가 부족합니다. 잠시 후 다시 시도해주세요.';
  }

  // 메모리 관련 에러
  if (err.message.includes('Cannot create a string longer than') || err.code === 'ERR_STRING_TOO_LONG') {
    statusCode = 413;
    message = '요청 데이터가 너무 큽니다.';
  }

  // 개발 환경에서만 스택 트레이스 포함
  const response = {
    error: getErrorName(statusCode),
    message,
    timestamp: new Date().toISOString()
  };

  if (details) {
    response.details = details;
  }

  // 개발 환경에서만 스택 트레이스 추가
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.requestInfo = {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };
  }

  res.status(statusCode).json(response);
};

/**
 * HTTP 상태 코드에 따른 에러 이름 반환
 */
function getErrorName(statusCode) {
  const errorNames = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    408: 'Request Timeout',
    409: 'Conflict',
    413: 'Payload Too Large',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  };

  return errorNames[statusCode] || 'Unknown Error';
}

/**
 * 404 Not Found 핸들러
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      notifications: '/api/notifications',
      comments: '/api/comments',
      settings: '/api/settings',
      health: '/health'
    }
  });
};

/**
 * 비동기 라우트 핸들러 래퍼
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * WebSocket 에러 핸들러
 */
const handleSocketError = (socket, error) => {
  console.error(`🚨 Socket Error for ${socket.id}:`, {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  // 클라이언트에게 에러 정보 전송
  socket.emit('error', {
    message: '서버에서 오류가 발생했습니다.',
    code: error.code || 'UNKNOWN_ERROR',
    timestamp: new Date().toISOString()
  });
};

/**
 * 요청 제한 에러 핸들러
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    error: 'Too Many Requests',
    message: '너무 많은 요청이 전송되었습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '60초',
    timestamp: new Date().toISOString()
  });
};

/**
 * CORS 에러 핸들러
 */
const corsErrorHandler = (err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: '교차 출처 요청이 차단되었습니다.',
      origin: req.get('Origin'),
      timestamp: new Date().toISOString()
    });
  }
  next(err);
};

/**
 * JSON 파싱 에러 핸들러
 */
const jsonErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON Parse Error',
      message: 'JSON 형식이 올바르지 않습니다.',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
  next(err);
};

/**
 * 파일 시스템 에러 핸들러
 */
const fileSystemErrorHandler = (err, req, res, next) => {
  if (err.code === 'ENOENT') {
    return res.status(404).json({
      error: 'File Not Found',
      message: '요청한 파일을 찾을 수 없습니다.',
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.code === 'EACCES') {
    return res.status(500).json({
      error: 'File Access Denied',
      message: '파일 접근 권한이 없습니다.',
      timestamp: new Date().toISOString()
    });
  }
  
  next(err);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  handleSocketError,
  rateLimitHandler,
  corsErrorHandler,
  jsonErrorHandler,
  fileSystemErrorHandler
};