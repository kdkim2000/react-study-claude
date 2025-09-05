
# Chapter 12: 배포와 최적화 - React 애플리케이션 프로덕션 준비

## 목차
1. [빌드 최적화 전략](#빌드-최적화)
2. [Code Splitting 구현](#code-splitting)
3. [성능 모니터링](#성능-모니터링)
4. [Docker 컨테이너화](#docker-컨테이너화)
5. [환경별 설정 관리](#환경-설정)
6. [흔한 실수와 해결방법](#흔한-실수)
7. [실습 과제](#실습-과제)

---

## 빌드 최적화 전략 {#빌드-최적화}

### Vite 빌드 최적화 설정

```typescript
// vite.config.ts - 프로덕션 빌드 최적화 설정
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    // gzip 압축 플러그인
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 10KB 이상 파일만 압축
    }),
    // 번들 크기 분석 도구
    visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  build: {
    // 빌드 최적화 옵션
    minify: 'terser', // 코드 압축
    terserOptions: {
      compress: {
        drop_console: true, // console.log 제거
        drop_debugger: true, // debugger 제거
      },
    },
    
    // 청크 분할 전략
    rollupOptions: {
      output: {
        manualChunks: {
          // vendor 라이브러리 분리
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          utils: ['lodash', 'axios', 'date-fns'],
        },
        // 청크 파일명 패턴
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          // 자산 파일 분류
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'images/[name]-[hash][extname]'
          }
          if (/\.css$/.test(name ?? '')) {
            return 'css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
    
    // 청크 크기 경고 임계값
    chunkSizeWarningLimit: 1000, // 1MB
    
    // 소스맵 생성 (프로덕션에서는 false 권장)
    sourcemap: false,
    
    // CSS 코드 분할
    cssCodeSplit: true,
  },
  
  // 의존성 사전 번들링 최적화
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material'],
    exclude: ['@mui/icons-material'], // 필요한 아이콘만 import
  },
})
```

### 이미지 최적화

```typescript
// components/OptimizedImage.tsx
import React, { useState, useEffect } from 'react'
import { Skeleton } from '@mui/material'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  lazy?: boolean
  placeholder?: string
  srcSet?: string
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * 최적화된 이미지 컴포넌트
 * - Lazy loading 지원
 * - 플레이스홀더 이미지
 * - 반응형 이미지 (srcSet, sizes)
 * - 로딩 상태 표시
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  lazy = true,
  placeholder,
  srcSet,
  sizes,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '')
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  
  useEffect(() => {
    if (!lazy) {
      // Lazy loading 비활성화시 즉시 로드
      setImageSrc(src)
      return
    }
    
    // Intersection Observer를 사용한 lazy loading
    if (!imageRef) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 뷰포트에 진입시 이미지 로드
            setImageSrc(src)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        // 이미지가 뷰포트에 들어오기 50px 전에 로드 시작
        rootMargin: '50px',
      }
    )
    
    observer.observe(imageRef)
    
    return () => {
      if (imageRef) {
        observer.unobserve(imageRef)
      }
    }
  }, [imageRef, src, lazy])
  
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }
  
  const handleError = () => {
    setHasError(true)
    setImageSrc(placeholder || '/images/fallback.png')
    onError?.()
  }
  
  return (
    <div style={{ position: 'relative', width, height }}>
      {/* 로딩 스켈레톤 */}
      {!isLoaded && !hasError && (
        <Skeleton
          variant="rectangular"
          width={width}
          height={height}
          animation="wave"
          style={{ position: 'absolute' }}
        />
      )}
      
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        style={{
          display: isLoaded || hasError ? 'block' : 'none',
          width: '100%',
          height: 'auto',
          maxWidth: width,
        }}
      />
    </div>
  )
}
```

---

## Code Splitting 구현 {#code-splitting}

### 1. Route 기반 Code Splitting

```typescript
// App.tsx - 라우트 레벨 코드 분할
import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'

// 로딩 컴포넌트
const PageLoader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
)

// lazy loading으로 각 페이지를 별도 청크로 분리
// webpackChunkName 주석으로 청크 이름 지정
const HomePage = lazy(() => 
  import(/* webpackChunkName: "home" */ './pages/HomePage')
)
const BoardPage = lazy(() => 
  import(/* webpackChunkName: "board" */ './pages/BoardPage')
)
const ProfilePage = lazy(() => 
  import(/* webpackChunkName: "profile" */ './pages/ProfilePage')
)
const AdminPage = lazy(() => 
  import(/* webpackChunkName: "admin" */ './pages/AdminPage')
)

function App() {
  return (
    <BrowserRouter>
      {/* Suspense로 lazy 컴포넌트 감싸기 - 로딩 중 fallback 표시 */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/board/*" element={<BoardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
```

### 2. 컴포넌트 레벨 Code Splitting

```typescript
// components/LazyModal.tsx - 모달 컴포넌트 lazy loading
import React, { lazy, Suspense, useState } from 'react'
import { Button, CircularProgress } from '@mui/material'

// 무거운 모달 컴포넌트를 lazy loading
const HeavyModal = lazy(() => 
  import(/* webpackChunkName: "heavy-modal" */ './HeavyModal')
)

export function LazyModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button 
        variant="contained" 
        onClick={() => setIsOpen(true)}
      >
        모달 열기
      </Button>
      
      {/* 모달이 열릴 때만 컴포넌트 로드 */}
      {isOpen && (
        <Suspense fallback={<CircularProgress />}>
          <HeavyModal 
            open={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      )}
    </>
  )
}
```

### 3. 조건부 Code Splitting

```typescript
// hooks/useFeatureFlag.ts - 기능 플래그에 따른 동적 import
import { useState, useEffect } from 'react'

interface FeatureModule {
  default: React.ComponentType<any>
}

/**
 * 기능 플래그에 따라 컴포넌트를 동적으로 로드하는 Hook
 */
export function useFeatureFlag(
  featureName: string,
  enabledComponent: () => Promise<FeatureModule>,
  disabledComponent?: () => Promise<FeatureModule>
) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // API에서 기능 플래그 확인
        const response = await fetch(`/api/features/${featureName}`)
        const { enabled } = await response.json()
        
        // 플래그에 따라 다른 컴포넌트 로드
        let module: FeatureModule
        if (enabled && enabledComponent) {
          module = await enabledComponent()
        } else if (!enabled && disabledComponent) {
          module = await disabledComponent()
        } else {
          // 비활성화 컴포넌트가 없으면 빈 컴포넌트
          module = { default: () => null }
        }
        
        setComponent(() => module.default)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Component load failed'))
      } finally {
        setLoading(false)
      }
    }
    
    loadComponent()
  }, [featureName, enabledComponent, disabledComponent])
  
  return { Component, loading, error }
}

// 사용 예시
function FeatureContainer() {
  const { Component, loading, error } = useFeatureFlag(
    'newDashboard',
    () => import('./NewDashboard'),
    () => import('./OldDashboard')
  )
  
  if (loading) return <CircularProgress />
  if (error) return <div>Error: {error.message}</div>
  if (!Component) return null
  
  return <Component />
}
```

### 4. 리소스 기반 Code Splitting

```typescript
// utils/resourceLoader.ts - 리소스 동적 로딩
class ResourceLoader {
  private loadedScripts = new Set<string>()
  private loadedStyles = new Set<string>()
  
  /**
   * 외부 스크립트 동적 로딩
   */
  async loadScript(src: string, attributes?: Record<string, string>): Promise<void> {
    // 이미 로드된 스크립트는 스킵
    if (this.loadedScripts.has(src)) {
      return Promise.resolve()
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      
      // 추가 속성 설정
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          script.setAttribute(key, value)
        })
      }
      
      script.onload = () => {
        this.loadedScripts.add(src)
        resolve()
      }
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${src}`))
      }
      
      document.head.appendChild(script)
    })
  }
  
  /**
   * CSS 동적 로딩
   */
  async loadStyle(href: string): Promise<void> {
    if (this.loadedStyles.has(href)) {
      return Promise.resolve()
    }
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      
      link.onload = () => {
        this.loadedStyles.add(href)
        resolve()
      }
      
      link.onerror = () => {
        reject(new Error(`Failed to load stylesheet: ${href}`))
      }
      
      document.head.appendChild(link)
    })
  }
  
  /**
   * 리소스 프리로드
   */
  preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    
    // 폰트의 경우 crossorigin 설정
    if (as === 'font') {
      link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
  }
}

export const resourceLoader = new ResourceLoader()

// 사용 예시 - 차트 라이브러리 동적 로딩
export function useChartLibrary() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const loadChart = async () => {
      try {
        await resourceLoader.loadScript(
          'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
        )
        setIsLoaded(true)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load chart library'))
      }
    }
    
    loadChart()
  }, [])
  
  return { isLoaded, error }
}
```

---

## 성능 모니터링 {#성능-모니터링}

### 1. React DevTools Profiler

```typescript
// components/PerformanceProfiler.tsx
import React, { Profiler, ProfilerOnRenderCallback } from 'react'

/**
 * 컴포넌트 렌더링 성능 측정
 */
const onRenderCallback: ProfilerOnRenderCallback = (
  id, // 프로파일러 고유 ID
  phase, // "mount" (초기 마운트) 또는 "update" (리렌더링)
  actualDuration, // 렌더링에 걸린 실제 시간
  baseDuration, // 메모이제이션 없이 걸리는 예상 시간
  startTime, // 렌더링 시작 시간
  commitTime, // 렌더링 커밋 시간
  interactions // 상호작용 집합
) => {
  // 성능 데이터를 분석 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // 프로덕션에서만 전송
    sendAnalytics({
      componentId: id,
      phase,
      duration: actualDuration,
      timestamp: commitTime,
    })
  } else {
    // 개발 환경에서는 콘솔에 출력
    console.log(`Component ${id} (${phase}):`, {
      actualDuration: `${actualDuration.toFixed(2)}ms`,
      baseDuration: `${baseDuration.toFixed(2)}ms`,
      startTime: new Date(startTime).toISOString(),
    })
  }
}

// 분석 데이터 전송 함수
async function sendAnalytics(data: any) {
  try {
    await fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('Failed to send analytics:', error)
  }
}

// 사용 예시
export function ProfiledComponent({ children }: { children: React.ReactNode }) {
  return (
    <Profiler id="MainComponent" onRender={onRenderCallback}>
      {children}
    </Profiler>
  )
}
```

### 2. Web Vitals 모니터링

```typescript
// utils/webVitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals'

/**
 * Web Vitals 메트릭 수집 및 전송
 * - CLS (Cumulative Layout Shift): 레이아웃 변경
 * - FID (First Input Delay): 첫 입력 지연
 * - FCP (First Contentful Paint): 첫 콘텐츠 페인트
 * - LCP (Largest Contentful Paint): 최대 콘텐츠 페인트
 * - TTFB (Time to First Byte): 첫 바이트 시간
 */
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry)  // 레이아웃 변경 측정
    onFID(onPerfEntry)  // 상호작용 반응성 측정
    onFCP(onPerfEntry)  // 초기 로딩 성능
    onLCP(onPerfEntry)  // 주요 콘텐츠 로딩
    onTTFB(onPerfEntry) // 서버 응답 시간
  }
}

// main.tsx에서 사용
import { reportWebVitals } from './utils/webVitals'

// 메트릭을 콘솔에 출력하거나 분석 서비스로 전송
reportWebVitals((metric) => {
  // 콘솔 출력
  console.log(metric)
  
  // Google Analytics로 전송 예시
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    })
  }
  
  // 커스텀 분석 엔드포인트로 전송
  fetch('/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }),
  }).catch((error) => {
    console.error('Failed to send metrics:', error)
  })
})
```

### 3. 커스텀 성능 모니터링 Hook

```typescript
// hooks/usePerformanceMonitor.ts
import { useEffect, useRef, useState } from 'react'

interface PerformanceData {
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
  slowRenders: number // 16ms 이상 걸린 렌더링
  memoryUsage?: number
}

/**
 * 컴포넌트 성능 모니터링 Hook
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0)
  const renderTimes = useRef<number[]>([])
  const lastRenderTime = useRef(performance.now())
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    slowRenders: 0,
  })
  
  useEffect(() => {
    const currentTime = performance.now()
    const renderTime = currentTime - lastRenderTime.current
    
    renderCount.current++
    renderTimes.current.push(renderTime)
    
    // 최근 100개 렌더링만 유지
    if (renderTimes.current.length > 100) {
      renderTimes.current.shift()
    }
    
    // 평균 계산
    const average = 
      renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
    
    // 느린 렌더링 카운트 (16ms = 60fps 기준)
    const slowCount = renderTimes.current.filter(time => time > 16).length
    
    // 메모리 사용량 (지원하는 브라우저만)
    let memoryUsage: number | undefined
    if ('memory' in performance) {
      memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576 // MB 단위
    }
    
    setPerformanceData({
      renderCount: renderCount.current,
      lastRenderTime: renderTime,
      averageRenderTime: average,
      slowRenders: slowCount,
      memoryUsage,
    })
    
    lastRenderTime.current = currentTime
    
    // 개발 환경에서 경고
    if (process.env.NODE_ENV === 'development') {
      if (renderTime > 16) {
        console.warn(
          `⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        )
      }
      
      if (renderCount.current > 50) {
        console.warn(
          `⚠️ High render count in ${componentName}: ${renderCount.current} renders`
        )
      }
    }
  })
  
  // 성능 리포트 생성
  const generateReport = () => {
    const report = {
      component: componentName,
      ...performanceData,
      timestamp: new Date().toISOString(),
    }
    
    console.table(report)
    return report
  }
  
  return {
    performanceData,
    generateReport,
  }
}

// 사용 예시
function ExpensiveComponent() {
  const { performanceData, generateReport } = usePerformanceMonitor('ExpensiveComponent')
  
  // 디버그 모드에서 성능 표시
  if (process.env.NODE_ENV === 'development') {
    return (
      <>
        <div style={{ position: 'fixed', top: 0, right: 0, background: 'rgba(0,0,0,0.8)', color: 'white', padding: 10 }}>
          <div>Renders: {performanceData.renderCount}</div>
          <div>Last: {performanceData.lastRenderTime.toFixed(2)}ms</div>
          <div>Avg: {performanceData.averageRenderTime.toFixed(2)}ms</div>
          <button onClick={generateReport}>Report</button>
        </div>
        {/* 실제 컴포넌트 내용 */}
      </>
    )
  }
  
  return <>{/* 실제 컴포넌트 내용 */}</>
}
```

---

## Docker 컨테이너화 {#docker-컨테이너화}

### 1. 멀티 스테이지 Dockerfile

```dockerfile
# Dockerfile
# Stage 1: 빌드 스테이지
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 (캐싱 활용)
COPY package*.json ./
COPY yarn.lock* ./

# 의존성 설치
RUN npm ci --only=production || yarn install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 빌드 인자로 환경 변수 전달
ARG VITE_API_URL
ARG VITE_APP_ENV
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# 프로덕션 빌드
RUN npm run build || yarn build

# Stage 2: 프로덕션 스테이지 (nginx)
FROM nginx:alpine

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 헬스체크 스크립트 추가
COPY healthcheck.sh /usr/local/bin/healthcheck.sh
RUN chmod +x /usr/local/bin/healthcheck.sh

# 포트 노출
EXPOSE 80

# 헬스체크 설정
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD /usr/local/bin/healthcheck.sh || exit 1

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Nginx 설정

```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 로깅 포맷
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # 성능 최적화
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml application/atom+xml image/svg+xml 
               text/x-js text/x-cross-domain-policy application/x-font-ttf 
               application/x-font-opentype application/vnd.ms-fontobject 
               image/x-icon;
    gzip_disable "MSIE [1-6]\.";
    
    include /etc/nginx/conf.d/*.conf;
}
```

```nginx
# default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # 캐싱 설정
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # HTML 파일은 캐싱하지 않음
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # SPA 라우팅 - 모든 경로를 index.html로
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 프록시 (필요한 경우)
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 헬스체크 엔드포인트
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 3. Docker Compose 설정

```yaml
# docker-compose.yml
version: '3.8'

services:
  # React 애플리케이션
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=${VITE_API_URL:-http://localhost:3000/api}
        - VITE_APP_ENV=${VITE_APP_ENV:-production}
    image: my-react-app:latest
    container_name: react-frontend
    ports:
      - "80:80"
    networks:
      - app-network
    volumes:
      - ./nginx-logs:/var/log/nginx
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  # 백엔드 API (예시)
  backend:
    image: node:18-alpine
    container_name: api-backend
    working_dir: /app
    volumes:
      - ./backend:/app
    command: npm start
    ports:
      - "3000:3000"
    networks:
      - app-network
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    restart: unless-stopped

  # 모니터링 - Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - app-network
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    restart: unless-stopped

  # 모니터링 - Grafana
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    networks:
      - app-network
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD:-admin}
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  prometheus-data:
  grafana-data:
```

### 4. 빌드 및 배포 스크립트

```bash
#!/bin/bash
# deploy.sh - 배포 자동화 스크립트

set -e  # 에러 발생시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 환경 변수 체크
check_env() {
    echo -e "${YELLOW}Checking environment variables...${NC}"
    
    required_vars=("VITE_API_URL" "VITE_APP_ENV" "DATABASE_URL")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo -e "${RED}Error: $var is not set${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}All environment variables are set${NC}"
}

# Docker 이미지 빌드
build_image() {
    echo -e "${YELLOW}Building Docker image...${NC}"
    
    # 빌드 시간 측정
    start_time=$(date +%s)
    
    docker build \
        --build-arg VITE_API_URL="$VITE_API_URL" \
        --build-arg VITE_APP_ENV="$VITE_APP_ENV" \
        -t my-react-app:latest \
        -t my-react-app:$(git rev-parse --short HEAD) \
        .
    
    end_time=$(date +%s)
    build_time=$((end_time - start_time))
    
    echo -e "${GREEN}Image built successfully in ${build_time}s${NC}"
}

# 기존 컨테이너 정리
cleanup() {
    echo -e "${YELLOW}Cleaning up old containers...${NC}"
    
    docker-compose down || true
    docker system prune -f
    
    echo -e "${GREEN}Cleanup completed${NC}"
}

# 컨테이너 실행
deploy() {
    echo -e "${YELLOW}Starting containers...${NC}"
    
    docker-compose up -d
    
    # 헬스체크 대기
    echo -e "${YELLOW}Waiting for health check...${NC}"
    sleep 10
    
    # 헬스체크 확인
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}Deployment successful!${NC}"
        echo -e "${GREEN}Application is running at http://localhost${NC}"
    else
        echo -e "${RED}Health check failed!${NC}"
        docker-compose logs frontend
        exit 1
    fi
}

# 롤백 함수
rollback() {
    echo -e "${RED}Deployment failed, rolling back...${NC}"
    
    docker-compose down
    docker run -d \
        --name react-frontend \
        -p 80:80 \
        my-react-app:previous
    
    echo -e "${YELLOW}Rollback completed${NC}"
}

# 메인 실행
main() {
    echo -e "${GREEN}=== React App Deployment ===${NC}"
    
    # 트랩 설정 (에러 발생시 롤백)
    trap rollback ERR
    
    check_env
    
    # 이전 이미지 백업
    docker tag my-react-app:latest my-react-app:previous || true
    
    build_image
    cleanup
    deploy
    
    echo -e "${GREEN}=== Deployment Complete ===${NC}"
}

# 스크립트 실행
main "$@"
```

---

## 환경별 설정 관리 {#환경-설정}

### 환경 변수 관리

```typescript
// config/env.ts - 환경 설정 중앙 관리
interface EnvConfig {
  apiUrl: string
  appEnv: 'development' | 'staging' | 'production'
  features: {
    analytics: boolean
    monitoring: boolean
    debugMode: boolean
  }
  performance: {
    enableProfiling: boolean
    logSlowRenders: boolean
  }
}

/**
 * 환경별 설정 관리
 * Vite의 import.meta.env 사용
 */
class EnvironmentConfig {
  private config: EnvConfig
  
  constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }
  
  private loadConfig(): EnvConfig {
    const env = import.meta.env.VITE_APP_ENV || 'development'
    
    return {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      appEnv: env as EnvConfig['appEnv'],
      features: {
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        monitoring: import.meta.env.VITE_ENABLE_MONITORING === 'true',
        debugMode: env === 'development',
      },
      performance: {
        enableProfiling: env !== 'production',
        logSlowRenders: env === 'development',
      },
    }
  }
  
  private validateConfig() {
    const required = ['apiUrl', 'appEnv']
    
    required.forEach(key => {
      if (!this.config[key as keyof EnvConfig]) {
        throw new Error(`Missing required config: ${key}`)
      }
    })
    
    // URL 유효성 검사
    try {
      new URL(this.config.apiUrl)
    } catch {
      throw new Error(`Invalid API URL: ${this.config.apiUrl}`)
    }
  }
  
  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key]
  }
  
  isProduction(): boolean {
    return this.config.appEnv === 'production'
  }
  
  isDevelopment(): boolean {
    return this.config.appEnv === 'development'
  }
  
  isFeatureEnabled(feature: keyof EnvConfig['features']): boolean {
    return this.config.features[feature]
  }
}

export const env = new EnvironmentConfig()

// 사용 예시
if (env.isFeatureEnabled('analytics')) {
  // 분석 도구 초기화
}
```

---

## 흔한 실수와 해결방법 {#흔한-실수}

### 1. 번들 크기 문제

```typescript
// ❌ 잘못된 예시 - 전체 라이브러리 import
import _ from 'lodash'
import * as MuiIcons from '@mui/icons-material'

// ✅ 올바른 예시 - 필요한 것만 import
import debounce from 'lodash/debounce'
import { Home, Settings } from '@mui/icons-material'

// ❌ 잘못된 예시 - 동적 import 없이 큰 컴포넌트 로드
import HeavyChart from './HeavyChart'

// ✅ 올바른 예시 - lazy loading 사용
const HeavyChart = lazy(() => import('./HeavyChart'))
```

### 2. 환경 변수 실수

```typescript
// ❌ 잘못된 예시 - 런타임에 process.env 접근
const apiUrl = process.env.REACT_APP_API_URL  // Vite에서는 작동 안함

// ✅ 올바른 예시 - import.meta.env 사용
const apiUrl = import.meta.env.VITE_API_URL

// ❌ 잘못된 예시 - 민감한 정보 노출
const apiKey = import.meta.env.VITE_SECRET_KEY  // 클라이언트에 노출됨

// ✅ 올바른 예시 - 백엔드에서 처리
const getApiKey = async () => {
  const response = await fetch('/api/config')
  const { apiKey } = await response.json()
  return apiKey
}
```

### 3. Docker 빌드 캐싱

```dockerfile
# ❌ 잘못된 예시 - 캐싱 활용 못함
COPY . .
RUN npm install

# ✅ 올바른 예시 - 레이어 캐싱 최적화
COPY package*.json ./
RUN npm ci
COPY . .
```

### 4. 메모리 누수

```typescript
// ❌ 잘못된 예시 - cleanup 없는 이벤트 리스너
useEffect(() => {
  window.addEventListener('resize', handleResize)
  // cleanup 없음
}, [])

// ✅ 올바른 예시 - cleanup 함수 반환
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

---

## 실습 과제 {#실습-과제}

### 과제 1: 성능 대시보드 구현 (난이도: 쉬움)

**요구사항:**
- Web Vitals 실시간 표시
- 컴포넌트 렌더링 횟수 추적
- 메모리 사용량 모니터링
- Material-UI로 대시보드 UI 구성

**구현해야 할 기능:**
```typescript
interface PerformanceDashboardProps {
  showInProduction?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  collapsible?: boolean
}

// 표시할 메트릭
interface Metrics {
  cls: number  // Cumulative Layout Shift
  fid: number  // First Input Delay
  lcp: number  // Largest Contentful Paint
  fcp: number  // First Contentful Paint
  ttfb: number // Time to First Byte
  renderCount: number
  memoryUsage: number
  fps: number  // Frames per second
}
```

**UI 요구사항:**
- 플로팅 위젯 형태
- 각 메트릭별 색상 코딩 (좋음: 초록, 보통: 노랑, 나쁨: 빨강)
- 클릭으로 확장/축소 가능
- 그래프로 시간별 추이 표시

### 과제 2: 자동 배포 파이프라인 구축 (난이도: 보통)

**요구사항:**
- GitHub Actions 워크플로우 작성
- 자동 테스트 실행
- Docker 이미지 빌드 및 푸시
- 배포 상태 알림

**구현해야 할 워크플로우:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    # 테스트 작업
    
  build:
    # 빌드 작업
    
  deploy:
    # 배포 작업
```

**파이프라인 단계:**
1. **테스트 단계**
   - 유닛 테스트 실행
   - 린트 검사
   - 타입 체크
   - 테스트 커버리지 리포트

2. **빌드 단계**
   - Docker 이미지 생성
   - 이미지 스캔 (보안 취약점)
   - Container Registry 푸시

3. **배포 단계**
   - 환경별 배포 (dev/staging/prod)
   - 헬스체크
   - 롤백 전략

**추가 요구사항:**
- Slack/Discord 웹훅으로 배포 알림
- 배포 승인 프로세스 (production)
- 자동 롤백 메커니즘

---

## 마무리

이번 장에서는 React 애플리케이션의 프로덕션 배포와 최적화를 다뤘습니다.

### 핵심 정리
1. **빌드 최적화**: 번들 크기 최소화, 코드 분할
2. **성능 모니터링**: Web Vitals, React Profiler 활용
3. **컨테이너화**: Docker를 통한 일관된 배포 환경
4. **자동화**: CI/CD 파이프라인 구축

### 체크리스트
- [ ] 번들 크기 분석 및 최적화
- [ ] Code Splitting 적용
- [ ] 성능 모니터링 도구 설정
- [ ] Docker 이미지 생성
- [ ] CI/CD 파이프라인 구축
- [ ] 환경별 설정 분리
- [ ] 헬스체크 및 모니터링
- [ ] 보안 헤더 설정

### 추가 학습 자료
- [Web.dev Performance](https://web.dev/performance/)
- [React Production Best Practices](https://reactjs.org/docs/optimizing-performance.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)