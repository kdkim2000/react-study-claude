/**
 * 글로벌 에러 핸들링 미들웨어
 */
const errorHandler = (err, req, res, next) => {
  console.error('🚨 Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
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
    message = '데이터베이스 연결에 실패했습니다.';
  } else if (err.message.includes('Failed to')) {
    statusCode = 500;
    message = '데이터베이스 작업 중 오류가 발생했습니다.';
  }

  // 개발 환경에서는 스택 트레이스 포함
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
    409: 'Conflict',
    422: 'Unprocessable Entity',
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
    timestamp: new Date().toISOString()
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

module.exports = {
  errorHandler
};