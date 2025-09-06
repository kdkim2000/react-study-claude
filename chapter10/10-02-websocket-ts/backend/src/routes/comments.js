const express = require('express');
const router = express.Router();
const { validateComment } = require('../middleware/validation');
const NotificationService = require('../services/NotificationService');
const {
  readComments,
  writeComments,
  getNextCommentId
} = require('../database/database');

/**
 * GET /api/comments
 * 댓글 목록 조회
 */
router.get('/', async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    
    console.log(`📋 Getting comments - limit: ${limit}`);
    
    const comments = await readComments();
    
    // 최신 순으로 정렬하고 limit 적용
    const sortedComments = comments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));
    
    res.json({
      comments: sortedComments,
      total: comments.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error getting comments:', error);
    next(error);
  }
});

/**
 * POST /api/comments
 * 새 댓글 작성 (알림 생성)
 */
router.post('/', validateComment, async (req, res, next) => {
  try {
    const { postTitle, commenterName, commenterEmail, content } = req.body;
    
    console.log(`✍️ Creating new comment by ${commenterName} on "${postTitle}"`);
    
    // 새 댓글 생성
    const commentId = await getNextCommentId();
    const comment = {
      id: commentId,
      postTitle,
      commenterName,
      commenterEmail,
      content,
      createdAt: new Date().toISOString()
    };
    
    // 댓글 목록에 추가
    const comments = await readComments();
    comments.unshift(comment); // 최신 순으로 추가
    await writeComments(comments);
    
    // 실시간 알림 생성
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    const notification = await notificationService.createCommentNotification(comment);
    
    // WebSocket으로 새 댓글 알림도 전송 (선택사항)
    const io = req.app.get('io');
    io.to('notifications').emit('comment:new', {
      comment,
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      message: '댓글이 작성되었습니다.',
      comment,
      notification: notification ? {
        id: notification.id,
        title: notification.title,
        created: true
      } : {
        created: false,
        reason: '알림이 비활성화되어 있습니다.'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error creating comment:', error);
    next(error);
  }
});

/**
 * GET /api/comments/:id
 * 특정 댓글 조회
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log(`👁 Getting comment: ${id}`);
    
    const comments = await readComments();
    const comment = comments.find(c => c.id === id);
    
    if (!comment) {
      return res.status(404).json({
        error: 'Not Found',
        message: '해당 댓글을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      comment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error getting comment:', error);
    next(error);
  }
});

/**
 * DELETE /api/comments/:id
 * 댓글 삭제
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑 Deleting comment: ${id}`);
    
    const comments = await readComments();
    const commentIndex = comments.findIndex(c => c.id === id);
    
    if (commentIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: '해당 댓글을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    // 댓글 삭제
    const deletedComment = comments.splice(commentIndex, 1)[0];
    await writeComments(comments);
    
    // WebSocket으로 댓글 삭제 알림
    const io = req.app.get('io');
    io.to('notifications').emit('comment:deleted', {
      commentId: id,
      postTitle: deletedComment.postTitle,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: '댓글이 삭제되었습니다.',
      deletedComment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    next(error);
  }
});

/**
 * POST /api/comments/bulk-create
 * 여러 댓글 한번에 생성 (테스트/데모용)
 */
router.post('/bulk-create', async (req, res, next) => {
  try {
    console.log('🔄 Creating bulk test comments...');
    
    const testComments = [
      {
        postTitle: "React Hook 사용법",
        commenterName: "김리액트",
        commenterEmail: "kimreact@example.com",
        content: "useState와 useEffect를 이렇게 사용하는군요! 정말 도움이 됐습니다."
      },
      {
        postTitle: "TypeScript 타입 정의",
        commenterName: "이타입",
        commenterEmail: "letype@example.com",
        content: "interface와 type의 차이점을 명확하게 설명해주셔서 감사해요!"
      },
      {
        postTitle: "Node.js 비동기 처리",
        commenterName: "박노드",
        commenterEmail: "parknode@example.com",
        content: "async/await 패턴이 Promise.then보다 훨씬 읽기 쉽네요."
      }
    ];
    
    const comments = await readComments();
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    const createdComments = [];
    const createdNotifications = [];
    
    for (const commentData of testComments) {
      // 댓글 생성
      const commentId = await getNextCommentId();
      const comment = {
        id: commentId,
        ...commentData,
        createdAt: new Date().toISOString()
      };
      
      comments.unshift(comment);
      createdComments.push(comment);
      
      // 알림 생성 (딜레이를 두고)
      setTimeout(async () => {
        const notification = await notificationService.createCommentNotification(comment);
        if (notification) {
          createdNotifications.push(notification);
        }
      }, createdComments.length * 2000); // 2초씩 간격을 두고 생성
    }
    
    await writeComments(comments);
    
    res.status(201).json({
      success: true,
      message: `${testComments.length}개의 테스트 댓글이 생성되었습니다.`,
      createdComments,
      note: '알림은 2초 간격으로 생성됩니다.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error creating bulk comments:', error);
    next(error);
  }
});

module.exports = router;