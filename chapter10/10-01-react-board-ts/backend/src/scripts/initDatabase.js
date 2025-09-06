#!/usr/bin/env node

/**
 * 파일 데이터베이스 초기화 스크립트
 * 독립적으로 실행 가능한 데이터베이스 설정 스크립트
 */

const { initDatabase, readPosts } = require('../database/database');

async function main() {
  console.log('🔧 Starting file database initialization...');
  
  try {
    await initDatabase();
    console.log('✅ File database initialization completed successfully!');
    
    // 현재 데이터 정보 출력
    const posts = await readPosts();
    
    console.log('\n📊 Database Information:');
    console.log('  - Type: JSON File Database');
    console.log('  - Location: ./data/posts.json');
    console.log(`  - Total posts: ${posts.length}`);
    
    if (posts.length > 0) {
      console.log('  - Latest post:', posts[posts.length - 1].title);
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main();
}

module.exports = main;