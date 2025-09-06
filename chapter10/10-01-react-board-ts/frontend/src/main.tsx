import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Roboto 폰트 import (Material-UI 권장)
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

// 개발 환경에서 API 연결 상태 확인
if (import.meta.env.DEV) {
  console.log('🚀 React Board Frontend Started');
  console.log('📡 Backend API: http://localhost:8080/api');
  console.log('🌐 Frontend: http://localhost:5173');
  
  // 백엔드 연결 상태 확인
  fetch('/api/health')
    .then(response => response.json())
    .then(data => {
      console.log('✅ Backend Connection:', data);
    })
    .catch(error => {
      console.warn('⚠️ Backend connection failed:', error.message);
      console.log('💡 Make sure backend server is running on http://localhost:8080');
    });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)