const express = require('express');
const router = express.Router();
const { validateSettings } = require('../middleware/validation');
const {
  readSettings,
  writeSettings
} = require('../database/database');

/**
 * GET /api/settings
 * 알림 설정 조회
 */
router.get('/', async (req, res, next) => {
  try {
    console.log('⚙️ Getting notification settings');
    
    const settings = await readSettings();
    
    res.json({
      settings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error getting settings:', error);
    next(error);
  }
});

/**
 * PUT /api/settings
 * 알림 설정 업데이트
 */
router.put('/', validateSettings, async (req, res, next) => {
  try {
    const newSettings = req.body;
    
    console.log('⚙️ Updating notification settings:', JSON.stringify(newSettings, null, 2));
    
    // 기존 설정 읽기
    const currentSettings = await readSettings();
    
    // 설정 병합 (깊은 병합)
    const updatedSettings = {
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        ...newSettings.notifications,
        types: {
          ...currentSettings.notifications.types,
          ...newSettings.notifications.types
        }
      },
      lastUpdated: new Date().toISOString()
    };
    
    // 설정 저장
    await writeSettings(updatedSettings);
    
    // WebSocket으로 설정 변경 알림
    const io = req.app.get('io');
    io.to('notifications').emit('settings:updated', {
      settings: updatedSettings,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: '알림 설정이 업데이트되었습니다.',
      settings: updatedSettings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    next(error);
  }
});

/**
 * PATCH /api/settings/notifications/toggle
 * 알림 전체 켜기/끄기 토글
 */
router.patch('/notifications/toggle', async (req, res, next) => {
  try {
    console.log('🔔 Toggling notification enabled status');
    
    const settings = await readSettings();
    const newEnabledStatus = !settings.notifications.enabled;
    
    settings.notifications.enabled = newEnabledStatus;
    settings.lastUpdated = new Date().toISOString();
    
    await writeSettings(settings);
    
    // WebSocket으로 설정 변경 알림
    const io = req.app.get('io');
    io.to('notifications').emit('settings:toggle', {
      enabled: newEnabledStatus,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: `알림이 ${newEnabledStatus ? '활성화' : '비활성화'}되었습니다.`,
      enabled: newEnabledStatus,
      settings: settings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error toggling notifications:', error);
    next(error);
  }
});

/**
 * PATCH /api/settings/notifications/sound/toggle
 * 알림 소리 켜기/끄기 토글
 */
router.patch('/notifications/sound/toggle', async (req, res, next) => {
  try {
    console.log('🔊 Toggling notification sound');
    
    const settings = await readSettings();
    const newSoundStatus = !settings.notifications.sound;
    
    settings.notifications.sound = newSoundStatus;
    settings.lastUpdated = new Date().toISOString();
    
    await writeSettings(settings);
    
    // WebSocket으로 설정 변경 알림
    const io = req.app.get('io');
    io.to('notifications').emit('settings:sound_toggle', {
      soundEnabled: newSoundStatus,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: `알림 소리가 ${newSoundStatus ? '활성화' : '비활성화'}되었습니다.`,
      soundEnabled: newSoundStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error toggling notification sound:', error);
    next(error);
  }
});

/**
 * PATCH /api/settings/notifications/types/:type/toggle
 * 특정 타입의 알림 켜기/끄기 토글
 */
router.patch('/notifications/types/:type/toggle', async (req, res, next) => {
  try {
    const { type } = req.params;
    const validTypes = ['comment', 'like', 'follow', 'system'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `유효하지 않은 알림 타입입니다. 가능한 타입: ${validTypes.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🔔 Toggling notification type: ${type}`);
    
    const settings = await readSettings();
    const currentStatus = settings.notifications.types[type] || false;
    const newStatus = !currentStatus;
    
    settings.notifications.types[type] = newStatus;
    settings.lastUpdated = new Date().toISOString();
    
    await writeSettings(settings);
    
    // WebSocket으로 설정 변경 알림
    const io = req.app.get('io');
    io.to('notifications').emit('settings:type_toggle', {
      type,
      enabled: newStatus,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: `${type} 알림이 ${newStatus ? '활성화' : '비활성화'}되었습니다.`,
      type,
      enabled: newStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error toggling notification type:', error);
    next(error);
  }
});

/**
 * POST /api/settings/reset
 * 설정 초기화
 */
router.post('/reset', async (req, res, next) => {
  try {
    console.log('🔄 Resetting settings to default');
    
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
    
    // WebSocket으로 설정 리셋 알림
    const io = req.app.get('io');
    io.to('notifications').emit('settings:reset', {
      settings: defaultSettings,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: '설정이 기본값으로 초기화되었습니다.',
      settings: defaultSettings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error resetting settings:', error);
    next(error);
  }
});

/**
 * GET /api/settings/export
 * 설정 내보내기 (JSON 다운로드)
 */
router.get('/export', async (req, res, next) => {
  try {
    console.log('📤 Exporting settings');
    
    const settings = await readSettings();
    
    // 파일 다운로드 헤더 설정
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=notification-settings.json');
    
    res.json({
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      settings
    });
  } catch (error) {
    console.error('❌ Error exporting settings:', error);
    next(error);
  }
});

/**
 * POST /api/settings/import
 * 설정 가져오기 (JSON 업로드)
 */
router.post('/import', async (req, res, next) => {
  try {
    const { settings: importedSettings } = req.body;
    
    if (!importedSettings || !importedSettings.notifications) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '유효하지 않은 설정 파일입니다.',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('📥 Importing settings');
    
    // 현재 설정과 병합
    const currentSettings = await readSettings();
    const newSettings = {
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        ...importedSettings.notifications
      },
      lastUpdated: new Date().toISOString()
    };
    
    await writeSettings(newSettings);
    
    // WebSocket으로 설정 가져오기 알림
    const io = req.app.get('io');
    io.to('notifications').emit('settings:imported', {
      settings: newSettings,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: '설정이 성공적으로 가져와졌습니다.',
      settings: newSettings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error importing settings:', error);
    next(error);
  }
});

module.exports = router;