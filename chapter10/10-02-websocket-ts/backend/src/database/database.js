const fs = require('fs').promises;
const path = require('path');

// 프로젝트 루트를 기준으로 data 디렉토리 경로 설정
const PROJECT_ROOT = path.join(__dirname, '../..');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

console.log('📁 Project root:', PROJECT_ROOT);
console.log('📁 Data directory:', DATA_DIR);

/**
 * 데이터베이스 초기화 (디렉토리 및 파일 생성)
 */
async function initDatabase() {
  try {
    // 데이터 디렉토리 생성
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('📁 Database directory ready:', DATA_DIR);

    // 각 데이터 파일 초기화
    await initNotificationsFile();
    await initCommentsFile();
    await initSettingsFile();

    console.log('✅ File database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  }
}

/**
 * 알림 데이터 파일 초기화
 */
async function initNotificationsFile() {
  try {
    await fs.access(NOTIFICATIONS_FILE);
    console.log('📊 Notifications file exists');
  } catch (error) {
    console.log('📊 Creating notifications file with sample data...');
    const sampleNotifications = [
      {
        id: "notification-1",
        type: "comment",
        title: "새 댓글이 달렸습니다",
        message: "김개발님이 'React Hook 완전 정복'에 댓글을 남겼습니다: \"정말 유용한 글이네요! Hook 사용법이 명확해졌습니다.\"",
        data: {
          commentId: "comment-1",
          postTitle: "React Hook 완전 정복",
          commenterName: "김개발",
          commentPreview: "정말 유용한 글이네요! Hook 사용법이 명확해졌습니다."
        },
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "notification-2",
        type: "comment",
        title: "새 댓글이 달렸습니다",
        message: "이타입님이 'TypeScript 실전 가이드'에 댓글을 남겼습니다: \"타입 정의가 정말 도움이 됐어요. 감사합니다!\"",
        data: {
          commentId: "comment-2",
          postTitle: "TypeScript 실전 가이드",
          commenterName: "이타입",
          commentPreview: "타입 정의가 정말 도움이 됐어요. 감사합니다!"
        },
        isRead: true,
        createdAt: new Date(Date.now() - 60000).toISOString() // 1분 전
      }
    ];
    await writeNotifications(sampleNotifications);
  }
}

/**
 * 댓글 데이터 파일 초기화
 */
async function initCommentsFile() {
  try {
    await fs.access(COMMENTS_FILE);
    console.log('📊 Comments file exists');
  } catch (error) {
    console.log('📊 Creating comments file with sample data...');
    const sampleComments = [
      {
        id: "comment-1",
        postTitle: "React Hook 완전 정복",
        commenterName: "김개발",
        commenterEmail: "kimdev@example.com",
        content: "정말 유용한 글이네요! Hook 사용법이 명확해졌습니다.",
        createdAt: new Date().toISOString()
      },
      {
        id: "comment-2",
        postTitle: "TypeScript 실전 가이드",
        commenterName: "이타입",
        commenterEmail: "letype@example.com",
        content: "타입 정의가 정말 도움이 됐어요. 감사합니다!",
        createdAt: new Date(Date.now() - 60000).toISOString()
      }
    ];
    await writeComments(sampleComments);
  }
}

/**
 * 설정 데이터 파일 초기화
 */
async function initSettingsFile() {
  try {
    await fs.access(SETTINGS_FILE);
    console.log('📊 Settings file exists');
  } catch (error) {
    console.log('📊 Creating settings file with default values...');
    const defaultSettings = {
      notifications: {
        enabled: true,
        sound: true,
        desktop: false,
        types: {
          comment: true,
          like: false,
          follow: false,
          system: true
        }
      },
      lastUpdated: new Date().toISOString()
    };
    await writeSettings(defaultSettings);
  }
}

/**
 * 알림 데이터 읽기
 */
async function readNotifications() {
  try {
    const data = await fs.readFile(NOTIFICATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * 알림 데이터 쓰기
 */
async function writeNotifications(notifications) {
  try {
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2), 'utf8');
  } catch (error) {
    console.error('❌ Error writing notifications:', error.message);
    throw error;
  }
}

/**
 * 댓글 데이터 읽기
 */
async function readComments() {
  try {
    const data = await fs.readFile(COMMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * 댓글 데이터 쓰기
 */
async function writeComments(comments) {
  try {
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf8');
  } catch (error) {
    console.error('❌ Error writing comments:', error.message);
    throw error;
  }
}

/**
 * 설정 데이터 읽기
 */
async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 기본 설정 반환
      return {
        notifications: {
          enabled: true,
          sound: true,
          desktop: false,
          types: {
            comment: true,
            like: false,
            follow: false,
            system: true
          }
        },
        lastUpdated: new Date().toISOString()
      };
    }
    throw error;
  }
}

/**
 * 설정 데이터 쓰기
 */
async function writeSettings(settings) {
  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (error) {
    console.error('❌ Error writing settings:', error.message);
    throw error;
  }
}

/**
 * 다음 사용 가능한 알림 ID 생성
 */
async function getNextNotificationId() {
  const notifications = await readNotifications();
  if (notifications.length === 0) {
    return 'notification-1';
  }
  
  // 기존 ID에서 숫자 추출하여 다음 번호 생성
  const ids = notifications
    .map(n => n.id)
    .filter(id => id.startsWith('notification-'))
    .map(id => parseInt(id.replace('notification-', ''), 10))
    .filter(num => !isNaN(num));
  
  const maxId = Math.max(...ids, 0);
  return `notification-${maxId + 1}`;
}

/**
 * 다음 사용 가능한 댓글 ID 생성
 */
async function getNextCommentId() {
  const comments = await readComments();
  if (comments.length === 0) {
    return 'comment-1';
  }
  
  const ids = comments
    .map(c => c.id)
    .filter(id => id.startsWith('comment-'))
    .map(id => parseInt(id.replace('comment-', ''), 10))
    .filter(num => !isNaN(num));
  
  const maxId = Math.max(...ids, 0);
  return `comment-${maxId + 1}`;
}

/**
 * ID로 알림 찾기
 */
async function findNotificationById(id) {
  const notifications = await readNotifications();
  return notifications.find(notification => notification.id === id);
}

/**
 * ID로 댓글 찾기
 */
async function findCommentById(id) {
  const comments = await readComments();
  return comments.find(comment => comment.id === id);
}

module.exports = {
  initDatabase,
  readNotifications,
  writeNotifications,
  readComments,
  writeComments,
  readSettings,
  writeSettings,
  getNextNotificationId,
  getNextCommentId,
  findNotificationById,
  findCommentById
};