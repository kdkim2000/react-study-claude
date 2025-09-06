const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');

// 라우터에서 NotificationService 인스턴스에 접근하기 위한 미들웨어
router.use((req, res, next) => {
  // app.locals에서 서비스 인스턴스를 가져오거나 새로 생성
  if (!req.notificationService) {
    const io = req.app.get('io');
    req.notificationService = new NotificationService(io);
    req.notificationService.initialize().catch(console.error);
  }
  next();
});

/**
 * GET /api/notifications
 * 알림 목록 조회
 */
router.get('/', async (req, res, next) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;
    
    console.log(`📋 Getting notifications - limit: ${limit}, unreadOnly: ${unreadOnly}`);
    
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    let notifications;
    if (unreadOnly === 'true') {
      notifications = await notificationService.getUnreadNotifications();
    } else {
      notifications = await notificationService.getAllNotifications(parseInt(limit));
    }
    
    const unreadCount = await notificationService.getUnreadCount();
    
    res.json({
      notifications,
      unreadCount,
      total: notifications.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error getting notifications:', error);
    next(error);
  }
});

/**
 * PUT /api/notifications/:id/read
 * 특정 알림을 읽음으로 표시
 */
router.put('/:id/read', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log(`📖 Marking notification as read: ${id}`);
    
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    const success = await notificationService.markAsRead(id);
    
    if (!success) {
      return res.status(404).json({
        error: 'Not Found',
        message: '해당 알림을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    const unreadCount = await notificationService.getUnreadCount();
    
    res.json({
      success: true,
      message: '알림이 읽음으로 표시되었습니다.',
      unreadCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    next(error);
  }
});

/**
 * PUT /api/notifications/read-all
 * 모든 알림을 읽음으로 표시
 */
router.put('/read-all', async (req, res, next) => {
  try {
    console.log('📖 Marking all notifications as read');
    
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    const changedCount = await notificationService.markAllAsRead();
    
    res.json({
      success: true,
      message: `${changedCount}개의 알림이 읽음으로 표시되었습니다.`,
      changedCount,
      unreadCount: 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    next(error);
  }
});

/**
 * DELETE /api/notifications/:id
 * 특정 알림 삭제
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑 Deleting notification: ${id}`);
    
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    const success = await notificationService.deleteNotification(id);
    
    if (!success) {
      return res.status(404).json({
        error: 'Not Found',
        message: '해당 알림을 찾을 수 없습니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      message: '알림이 삭제되었습니다.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error deleting notification:', error);
    next(error);
  }
});

/**
 * GET /api/notifications/stats
 * 알림 통계 조회
 */
router.get('/stats', async (req, res, next) => {
  try {
    console.log('📊 Getting notification stats');
    
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    const stats = await notificationService.getNotificationStats();
    
    res.json({
      ...stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error getting notification stats:', error);
    next(error);
  }
});

/**
 * POST /api/notifications/test
 * 테스트 알림 생성 (개발용)
 */
router.post('/test', async (req, res, next) => {
  try {
    const { type = 'system', title, message } = req.body;
    
    const testTitle = title || '테스트 알림';
    const testMessage = message || '이것은 테스트 알림입니다.';
    
    console.log(`🧪 Creating test notification: ${testTitle}`);
    
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    const notification = await notificationService.createNotification(
      type, 
      testTitle, 
      testMessage, 
      { isTest: true }
    );
    
    if (!notification) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '해당 타입의 알림이 비활성화되어 있습니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(201).json({
      success: true,
      message: '테스트 알림이 생성되었습니다.',
      notification,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error creating test notification:', error);
    next(error);
  }
});

/**
 * DELETE /api/notifications/cleanup
 * 오래된 알림 정리
 */
router.delete('/cleanup', async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    
    console.log(`🧹 Cleaning up notifications older than ${days} days`);
    
    const notificationService = new NotificationService(req.app.get('io'));
    await notificationService.initialize();
    
    const removedCount = await notificationService.cleanupOldNotifications(parseInt(days));
    
    res.json({
      success: true,
      message: `${removedCount}개의 오래된 알림이 정리되었습니다.`,
      removedCount,
      daysKept: parseInt(days),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error cleaning up notifications:', error);
    next(error);
  }
});

module.exports = router;