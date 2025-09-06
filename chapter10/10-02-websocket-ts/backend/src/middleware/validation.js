const Joi = require('joi');

/**
 * 댓글 생성 유효성 검증
 */
const commentSchema = Joi.object({
  postTitle: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.empty': '게시글 제목은 필수입니다.',
      'string.max': '게시글 제목은 200자 이하여야 합니다.',
      'any.required': '게시글 제목은 필수입니다.'
    }),
  
  commenterName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': '댓글 작성자명은 필수입니다.',
      'string.max': '작성자명은 50자 이하여야 합니다.',
      'any.required': '댓글 작성자명은 필수입니다.'
    }),

  commenterEmail: Joi.string()
    .email()
    .max(100)
    .optional()
    .messages({
      'string.email': '올바른 이메일 형식이 아닙니다.',
      'string.max': '이메일은 100자 이하여야 합니다.'
    }),
  
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.empty': '댓글 내용은 필수입니다.',
      'string.max': '댓글 내용은 1000자 이하여야 합니다.',
      'any.required': '댓글 내용은 필수입니다.'
    })
});

/**
 * 알림 설정 유효성 검증
 */
const settingsSchema = Joi.object({
  notifications: Joi.object({
    enabled: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'enabled는 boolean 값이어야 합니다.'
      }),
    
    sound: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'sound는 boolean 값이어야 합니다.'
      }),
    
    desktop: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'desktop은 boolean 값이어야 합니다.'
      }),
    
    types: Joi.object({
      comment: Joi.boolean().optional(),
      like: Joi.boolean().optional(),
      follow: Joi.boolean().optional(),
      system: Joi.boolean().optional()
    }).optional()
  }).required()
});

/**
 * 테스트 알림 생성 유효성 검증
 */
const testNotificationSchema = Joi.object({
  type: Joi.string()
    .valid('comment', 'like', 'follow', 'system')
    .default('system')
    .messages({
      'any.only': 'type은 comment, like, follow, system 중 하나여야 합니다.'
    }),
  
  title: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.empty': '제목은 비어있을 수 없습니다.',
      'string.max': '제목은 100자 이하여야 합니다.'
    }),
  
  message: Joi.string()
    .min(1)
    .max(500)
    .optional()
    .messages({
      'string.empty': '메시지는 비어있을 수 없습니다.',
      'string.max': '메시지는 500자 이하여야 합니다.'
    })
});

/**
 * 댓글 유효성 검증 미들웨어
 */
const validateComment = (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      message: '입력 데이터가 유효하지 않습니다.',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  req.body = value;
  next();
};

/**
 * 설정 유효성 검증 미들웨어
 */
const validateSettings = (req, res, next) => {
  const { error, value } = settingsSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      message: '설정 데이터가 유효하지 않습니다.',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  req.body = value;
  next();
};

/**
 * 테스트 알림 유효성 검증 미들웨어
 */
const validateTestNotification = (req, res, next) => {
  const { error, value } = testNotificationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      error: 'Validation Error',
      message: '테스트 알림 데이터가 유효하지 않습니다.',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  req.body = value;
  next();
};

/**
 * ID 파라미터 유효성 검증 미들웨어
 */
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || id.trim().length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: '유효하지 않은 ID입니다.',
      timestamp: new Date().toISOString()
    });
  }
  
  // UUID 형식 검증 (선택사항)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const simpleIdPattern = /^[a-zA-Z0-9\-_]+$/;
  
  if (!uuidPattern.test(id) && !simpleIdPattern.test(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'ID 형식이 올바르지 않습니다.',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

/**
 * 쿼리 파라미터 유효성 검증 미들웨어
 */
const validateQueryParams = (req, res, next) => {
  const { limit, unreadOnly } = req.query;
  
  // limit 검증
  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'limit은 1-100 사이의 숫자여야 합니다.',
        timestamp: new Date().toISOString()
      });
    }
    req.query.limit = limitNum;
  }
  
  // unreadOnly 검증
  if (unreadOnly !== undefined) {
    if (unreadOnly !== 'true' && unreadOnly !== 'false') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'unreadOnly는 true 또는 false여야 합니다.',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  next();
};

/**
 * Content-Type 검증 미들웨어 (JSON 요청용)
 */
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Content-Type은 application/json이어야 합니다.',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  next();
};

/**
 * 요청 크기 제한 검증 미들웨어
 */
const validateRequestSize = (req, res, next) => {
  const contentLength = req.get('Content-Length');
  const maxSize = 1024 * 1024; // 1MB
  
  if (contentLength && parseInt(contentLength, 10) > maxSize) {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: '요청 크기가 너무 큽니다. (최대 1MB)',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

module.exports = {
  validateComment,
  validateSettings,
  validateTestNotification,
  validateId,
  validateQueryParams,
  validateContentType,
  validateRequestSize
};