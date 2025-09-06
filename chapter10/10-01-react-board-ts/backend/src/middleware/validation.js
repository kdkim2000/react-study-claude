const Joi = require('joi');

/**
 * 게시글 생성/수정 유효성 검증
 */
const postSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.empty': '제목은 필수입니다.',
      'string.max': '제목은 200자 이하여야 합니다.',
      'any.required': '제목은 필수입니다.'
    }),
  
  content: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': '내용은 필수입니다.',
      'any.required': '내용은 필수입니다.'
    }),
  
  author: Joi.string()
    .min(1)
    .max(50)
    .when(Joi.ref('$isUpdate'), {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.required()
    })
    .messages({
      'string.empty': '작성자는 필수입니다.',
      'string.max': '작성자명은 50자 이하여야 합니다.',
      'any.required': '작성자는 필수입니다.'
    })
});

/**
 * 페이지네이션 파라미터 유효성 검증
 */
const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'page는 숫자여야 합니다.',
      'number.integer': 'page는 정수여야 합니다.',
      'number.min': 'page는 0 이상이어야 합니다.'
    }),
  
  size: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'size는 숫자여야 합니다.',
      'number.integer': 'size는 정수여야 합니다.',
      'number.min': 'size는 1 이상이어야 합니다.',
      'number.max': 'size는 100 이하여야 합니다.'
    })
});

/**
 * 게시글 유효성 검증 미들웨어
 */
const validatePost = (req, res, next) => {
  const isUpdate = req.method === 'PUT';
  
  const { error, value } = postSchema.validate(req.body, {
    context: { isUpdate },
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
  
  // 검증된 데이터로 req.body 대체
  req.body = value;
  next();
};

/**
 * 페이지네이션 파라미터 유효성 검증 미들웨어
 */
const validatePagination = (req, res, next) => {
  const { error, value } = paginationSchema.validate(req.query, {
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
      message: '페이지네이션 파라미터가 유효하지 않습니다.',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  // 검증된 데이터로 req.query 대체
  req.query = { ...req.query, ...value };
  next();
};

/**
 * ID 파라미터 유효성 검증 미들웨어
 */
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: '유효하지 않은 ID입니다.',
      timestamp: new Date().toISOString()
    });
  }
  
  req.params.id = id;
  next();
};

module.exports = {
  validatePost,
  validatePagination,
  validateId
};