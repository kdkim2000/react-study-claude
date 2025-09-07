import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 개발 환경에서 성능 지표 콘솔 출력
if (import.meta.env.DEV) {
  // Web Vitals를 동적으로 로드하여 콘솔에 출력
  const initWebVitalsLogging = async () => {
    try {
      const webVitals = await import('web-vitals')
      
      if (webVitals.onCLS) {
        webVitals.onCLS((metric: any) => {
          console.log('CLS:', metric)
        })
      }
      
      if (webVitals.onINP) {
        webVitals.onINP((metric: any) => {
          console.log('INP:', metric)
        })
      } else if ((webVitals as any).onFID) {
        ;(webVitals as any).onFID((metric: any) => {
          console.log('FID:', metric)
        })
      }
      
      if (webVitals.onFCP) {
        webVitals.onFCP((metric: any) => {
          console.log('FCP:', metric)
        })
      }
      
      if (webVitals.onLCP) {
        webVitals.onLCP((metric: any) => {
          console.log('LCP:', metric)
        })
      }
      
      if (webVitals.onTTFB) {
        webVitals.onTTFB((metric: any) => {
          console.log('TTFB:', metric)
        })
      }
    } catch (error) {
      console.warn('Web Vitals 로드 실패:', error)
    }
  }
  
  initWebVitalsLogging()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)