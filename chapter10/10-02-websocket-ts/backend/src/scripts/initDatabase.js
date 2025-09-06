#!/usr/bin/env node

/**
 * 실시간 알림 시스템 데이터베이스 초기화 스크립트
 */

const { initDatabase, readNotifications, readComments, readSettings } = require('../database/database');

async function main() {
  console.log('🔧 Starting notification database initialization...');
  console.log('');
  
  try {
    // 데이터베이스 초기화
    await initDatabase();
    console.log('✅ Database initialization completed successfully!');
    console.log('');

    // 현재 데이터 정보 출력
    console.log('📊 Database Information:');
    console.log('  - Type: JSON File Database');
    console.log('  - Location: ./data/');
    console.log('');

    // 알림 데이터 정보
    const notifications = await readNotifications();
    console.log('🔔 Notifications:');
    console.log(`  - Total: ${notifications.length} notifications`);
    console.log(`  - Unread: ${notifications.filter(n => !n.isRead).length} notifications`);
    if (notifications.length > 0) {
      console.log(`  - Latest: "${notifications[0].title}"`);
    }
    console.log('');

    // 댓글 데이터 정보
    const comments = await readComments();
    console.log('💬 Comments:');
    console.log(`  - Total: ${comments.length} comments`);
    if (comments.length > 0) {
      console.log(`  - Latest: ${comments[0].commenterName} on "${comments[0].postTitle}"`);
    }
    console.log('');

    // 설정 데이터 정보
    const settings = await readSettings();
    console.log('⚙️ Settings:');
    console.log(`  - Notifications enabled: ${settings.notifications.enabled}`);
    console.log(`  - Sound enabled: ${settings.notifications.sound}`);
    console.log(`  - Desktop enabled: ${settings.notifications.desktop}`);
    console.log('  - Notification types:');
    Object.entries(settings.notifications.types).forEach(([type, enabled]) => {
      console.log(`    - ${type}: ${enabled ? '✅' : '❌'}`);
    });
    console.log('');

    console.log('🚀 Ready to start the notification server!');
    console.log('');
    console.log('💡 Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Open: http://localhost:8080');
    console.log('  3. WebSocket: ws://localhost:8080');
    console.log('');
    console.log('📋 Test endpoints:');
    console.log('  - GET /api/notifications');
    console.log('  - POST /api/comments');
    console.log('  - GET /api/settings');
    console.log('  - POST /api/notifications/test');
    console.log('');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('  1. Check write permissions in the data directory');
    console.error('  2. Ensure no other process is using the files');
    console.error('  3. Try running with administrator privileges');
    console.error('');
    process.exit(1);
  }
}

// 추가 유틸리티 함수들
async function showStats() {
  try {
    const notifications = await readNotifications();
    const comments = await readComments();
    const settings = await readSettings();

    console.log('📊 Detailed Statistics:');
    console.log('');

    // 알림 통계
    const notificationTypes = {};
    const readCount = notifications.filter(n => n.isRead).length;
    const unreadCount = notifications.length - readCount;

    notifications.forEach(notification => {
      notificationTypes[notification.type] = (notificationTypes[notification.type] || 0) + 1;
    });

    console.log('🔔 Notification Statistics:');
    console.log(`  - Total: ${notifications.length}`);
    console.log(`  - Read: ${readCount} (${((readCount / notifications.length) * 100).toFixed(1)}%)`);
    console.log(`  - Unread: ${unreadCount} (${((unreadCount / notifications.length) * 100).toFixed(1)}%)`);
    console.log('  - By type:');
    Object.entries(notificationTypes).forEach(([type, count]) => {
      console.log(`    - ${type}: ${count}`);
    });
    console.log('');

    // 댓글 통계
    const commenters = new Set(comments.map(c => c.commenterName));
    const posts = new Set(comments.map(c => c.postTitle));

    console.log('💬 Comment Statistics:');
    console.log(`  - Total comments: ${comments.length}`);
    console.log(`  - Unique commenters: ${commenters.size}`);
    console.log(`  - Posts with comments: ${posts.size}`);
    console.log('');

    // 최근 활동
    const recentNotifications = notifications
      .filter(n => new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .length;
    const recentComments = comments
      .filter(c => new Date(c.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .length;

    console.log('📈 Recent Activity (24h):');
    console.log(`  - New notifications: ${recentNotifications}`);
    console.log(`  - New comments: ${recentComments}`);
    console.log('');

    // 설정 상태
    const enabledTypes = Object.entries(settings.notifications.types)
      .filter(([, enabled]) => enabled)
      .map(([type]) => type);

    console.log('⚙️ Configuration Status:');
    console.log(`  - Overall notifications: ${settings.notifications.enabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`  - Sound alerts: ${settings.notifications.sound ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`  - Desktop notifications: ${settings.notifications.desktop ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`  - Active notification types: ${enabledTypes.join(', ')}`);
    console.log(`  - Last updated: ${settings.lastUpdated}`);

  } catch (error) {
    console.error('❌ Error showing stats:', error.message);
  }
}

async function reset() {
  console.log('🔄 Resetting database...');
  
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    const PROJECT_ROOT = path.join(__dirname, '../../..');
    const DATA_DIR = path.join(PROJECT_ROOT, 'data');
    
    // 데이터 디렉토리 삭제
    try {
      await fs.rmdir(DATA_DIR, { recursive: true });
      console.log('🗑 Removed existing data directory');
    } catch (error) {
      console.log('📁 Data directory does not exist, skipping removal');
    }
    
    // 데이터베이스 재초기화
    await initDatabase();
    console.log('✅ Database reset completed!');
    
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
}

// 명령행 인자 처리
const command = process.argv[2];

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  switch (command) {
    case 'stats':
      showStats();
      break;
    case 'reset':
      reset();
      break;
    case 'help':
      console.log('📋 Available commands:');
      console.log('  node initDatabase.js        - Initialize database with sample data');
      console.log('  node initDatabase.js stats  - Show detailed statistics');
      console.log('  node initDatabase.js reset  - Reset database to initial state');
      console.log('  node initDatabase.js help   - Show this help message');
      break;
    default:
      main();
  }
}

module.exports = { main, showStats, reset };