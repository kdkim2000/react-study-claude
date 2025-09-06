const { v4: uuidv4 } = require('uuid');
const {
  readNotifications,
  writeNotifications,
  readSettings,
  getNextNotificationId
} = require('../database/database');

/**
 * 실시간 알림 서비스
 */
class NotificationService {
  constructor(io) {
    this.io = io;
    this.notifications = [];
    this.settings = null;
  }

  /**
   * 서비스 초기화
   */
  async initialize() {
    try {
      this.notifications = await readNotifications();
      this.settings = await readSettings();
      console.log(`🔔 Loaded ${this.notifications.length} notifications`);
    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
      throw error;
    }
  }

  /**
   * 새 알림 생성 및 브로드캐스트
   */
  async createNotification(type, title, message, data = {}) {
    try {
      // 알림 설정 확인
      const settings = await readSettings();
      if (!settings.notifications.enabled || !settings.notifications.types[type]) {
        console.log(`🔇 Notification disabled for type: ${type}`);
        return null;
      }

      // 새 알림 생성
      const notification = {
        id: uuidv4(),
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date().toISOString()
      };

      // 메모리와 파일에 저장
      this.notifications.unshift(notification); // 최신 순으로 추가
      await writeNotifications(this.notifications);

      console.log(`🔔 Created notification: ${notification.id} - ${title}`);

      // WebSocket으로 실시간 전송
      this.io.to('notifications').emit('notification:new', notification);

      // 읽지 않은 알림 수 업데이트
      const unreadCount = await this.getUnreadCount();
      this.io.to('notifications').emit('notifications:count_updated', {
        unreadCount,
        timestamp: new Date().toISOString()
      });

      return notification;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  }

  /**
   * 댓글 알림 생성 (특별 메서드)
   */
  async createCommentNotification(comment) {
    const title = '새 댓글이 달렸습니다';
    const message = `${comment.commenterName}님이 '${comment.postTitle}'에 댓글을 남겼습니다: "${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}"`;
    
    const data = {
      commentId: comment.id,
      postTitle: comment.postTitle,
      commenterName: comment.commenterName,
      commentPreview: comment.content.substring(0, 100)
    };

    return await this.createNotification('comment', title, message, data);
  }

  /**
   * 모든 알림 조회
   */
  async getAllNotifications(limit = 50) {
    try {
      // 메모리에서 최신 데이터 사용하거나 파일에서 읽기
      if (this.notifications.length === 0) {
        this.notifications = await readNotifications();
      }

      // 최신 순으로 정렬하고 limit 적용
      const sortedNotifications = this.notifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);

      return sortedNotifications;
    } catch (error) {
      console.error('❌ Error getting notifications:', error);
      throw error;
    }
  }

  /**
   * 읽지 않은 알림 조회
   */
  async getUnreadNotifications() {
    try {
      const notifications = await this.getAllNotifications();
      return notifications.filter(notification => !notification.isRead);
    } catch (error) {
      console.error('❌ Error getting unread notifications:', error);
      throw error;
    }
  }

  /**
   * 읽지 않은 알림 수 조회
   */
  async getUnreadCount() {
    try {
      const unreadNotifications = await this.getUnreadNotifications();
      return unreadNotifications.length;
    } catch (error) {
      console.error('❌ Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * 알림을 읽음으로 표시
   */
  async markAsRead(notificationId) {
    try {
      // 메모리에서 찾기
      const notificationIndex = this.notifications.findIndex(n => n.id === notificationId);
      if (notificationIndex === -1) {
        console.warn(`⚠️ Notification not found: ${notificationId}`);
        return false;
      }

      // 이미 읽은 상태면 스킵
      if (this.notifications[notificationIndex].isRead) {
        console.log(`📖 Notification already read: ${notificationId}`);
        return true;
      }

      // 읽음 상태로 변경
      this.notifications[notificationIndex].isRead = true;
      this.notifications[notificationIndex].readAt = new Date().toISOString();

      // 파일에 저장
      await writeNotifications(this.notifications);

      console.log(`📖 Marked as read: ${notificationId}`);
      return true;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * 모든 알림을 읽음으로 표시
   */
  async markAllAsRead() {
    try {
      let changedCount = 0;
      const now = new Date().toISOString();

      this.notifications.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = now;
          changedCount++;
        }
      });

      if (changedCount > 0) {
        await writeNotifications(this.notifications);
        console.log(`📖 Marked ${changedCount} notifications as read`);

        // WebSocket으로 변경 알림
        this.io.to('notifications').emit('notifications:all_read', {
          changedCount,
          timestamp: now
        });

        // 읽지 않은 알림 수 업데이트 (0이 됨)
        this.io.to('notifications').emit('notifications:count_updated', {
          unreadCount: 0,
          timestamp: now
        });
      }

      return changedCount;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * 알림 삭제
   */
  async deleteNotification(notificationId) {
    try {
      const initialLength = this.notifications.length;
      this.notifications = this.notifications.filter(n => n.id !== notificationId);

      if (this.notifications.length < initialLength) {
        await writeNotifications(this.notifications);
        console.log(`🗑 Deleted notification: ${notificationId}`);

        // WebSocket으로 삭제 알림
        this.io.to('notifications').emit('notification:deleted', {
          notificationId,
          timestamp: new Date().toISOString()
        });

        // 읽지 않은 알림 수 업데이트
        const unreadCount = await this.getUnreadCount();
        this.io.to('notifications').emit('notifications:count_updated', {
          unreadCount,
          timestamp: new Date().toISOString()
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * 오래된 알림 정리 (30일 이상)
   */
  async cleanupOldNotifications(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const initialLength = this.notifications.length;
      this.notifications = this.notifications.filter(notification => {
        const createdAt = new Date(notification.createdAt);
        return createdAt > cutoffDate;
      });

      const removedCount = initialLength - this.notifications.length;

      if (removedCount > 0) {
        await writeNotifications(this.notifications);
        console.log(`🧹 Cleaned up ${removedCount} old notifications`);
      }

      return removedCount;
    } catch (error) {
      console.error('❌ Error cleaning up notifications:', error);
      throw error;
    }
  }

  /**
   * 알림 통계 조회
   */
  async getNotificationStats() {
    try {
      const notifications = await this.getAllNotifications();
      const total = notifications.length;
      const unread = notifications.filter(n => !n.isRead).length;
      const read = total - unread;

      // 타입별 통계
      const typeStats = {};
      notifications.forEach(notification => {
        typeStats[notification.type] = (typeStats[notification.type] || 0) + 1;
      });

      // 최근 24시간 통계
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentNotifications = notifications.filter(n => 
        new Date(n.createdAt) > oneDayAgo
      );

      return {
        total,
        read,
        unread,
        typeStats,
        recent24h: recentNotifications.length,
        lastNotificationAt: notifications[0]?.createdAt || null
      };
    } catch (error) {
      console.error('❌ Error getting notification stats:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;