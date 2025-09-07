import { useState, useEffect, useCallback, useRef } from 'react'
import { Metrics, MetricsHistory } from '../types'

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    cls: 0,
    fid: 0,
    lcp: 0,
    fcp: 0,
    ttfb: 0,
    renderCount: 0,
    memoryUsage: 0,
    fps: 0
  })
  
  const [history, setHistory] = useState<MetricsHistory[]>([])
  const renderCountRef = useRef(0)
  const fpsRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const frameCountRef = useRef(0)
  const webVitalsInitialized = useRef(false)

  // Web Vitals 수집
  useEffect(() => {
    if (webVitalsInitialized.current) return
    
    const updateMetric = (name: keyof Metrics, value: number) => {
      setMetrics(prev => ({ ...prev, [name]: value }))
    }

    // Web Vitals 동적 로드
    let isMounted = true
    
    const loadWebVitals = async () => {
      try {
        // web-vitals를 동적으로 import
        const webVitals = await import('web-vitals')
        
        if (!isMounted) return
        
        // 각 메트릭 함수 호출
        if (webVitals.onCLS) {
          webVitals.onCLS((metric: any) => {
            if (isMounted) updateMetric('cls', metric.value)
          })
        }
        
        if (webVitals.onINP) {
          webVitals.onINP((metric: any) => {
            if (isMounted) updateMetric('fid', metric.value)
          })
        } else if (webVitals.onFID) {
          // fallback for older versions
          ;(webVitals as any).onFID((metric: any) => {
            if (isMounted) updateMetric('fid', metric.value)
          })
        }
        
        if (webVitals.onFCP) {
          webVitals.onFCP((metric: any) => {
            if (isMounted) updateMetric('fcp', metric.value)
          })
        }
        
        if (webVitals.onLCP) {
          webVitals.onLCP((metric: any) => {
            if (isMounted) updateMetric('lcp', metric.value)
          })
        }
        
        if (webVitals.onTTFB) {
          webVitals.onTTFB((metric: any) => {
            if (isMounted) updateMetric('ttfb', metric.value)
          })
        }
        
        webVitalsInitialized.current = true
      } catch (error) {
        console.warn('Web Vitals 로드 실패:', error)
      }
    }

    loadWebVitals()
    
    return () => {
      isMounted = false
    }
  }, [])

  // FPS 측정
  const measureFPS = useCallback(() => {
    const now = performance.now()
    frameCountRef.current++
    
    if (now - lastTimeRef.current >= 1000) {
      fpsRef.current = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current))
      setMetrics(prev => ({ ...prev, fps: fpsRef.current }))
      frameCountRef.current = 0
      lastTimeRef.current = now
    }
    
    requestAnimationFrame(measureFPS)
  }, [])

  useEffect(() => {
    const rafId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(rafId)
  }, [measureFPS])

  // 메모리 사용량 측정
  useEffect(() => {
    const updateMemoryUsage = () => {
      try {
        if ('memory' in performance && (performance as any).memory) {
          const memInfo = (performance as any).memory
          if (memInfo.usedJSHeapSize) {
            const usedMB = Math.round(memInfo.usedJSHeapSize / 1024 / 1024)
            setMetrics(prev => ({ ...prev, memoryUsage: usedMB }))
          }
        }
      } catch (error) {
        // 메모리 API를 지원하지 않는 브라우저
        console.warn('Memory API not supported')
      }
    }

    updateMemoryUsage()
    const interval = setInterval(updateMemoryUsage, 1000)
    return () => clearInterval(interval)
  }, [])

  // 렌더링 횟수 추적
  useEffect(() => {
    renderCountRef.current++
    setMetrics(prev => ({ ...prev, renderCount: renderCountRef.current }))
  })

  // 히스토리 저장
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const newEntry = {
          timestamp: Date.now(),
          metrics: { ...metrics }
        }
        return [...prev, newEntry].slice(-20) // 최근 20개만 유지
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [metrics])

  const resetRenderCount = useCallback(() => {
    renderCountRef.current = 0
    setMetrics(prev => ({ ...prev, renderCount: 0 }))
  }, [])

  return {
    metrics,
    history,
    resetRenderCount
  }
}