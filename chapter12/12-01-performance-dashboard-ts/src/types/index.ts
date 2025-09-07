export interface PerformanceDashboardProps {
  showInProduction?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  collapsible?: boolean
}

export interface Metrics {
  cls: number  // Cumulative Layout Shift
  fid: number  // First Input Delay (실제로는 INP를 사용하지만 호환성을 위해 fid로 유지)
  lcp: number  // Largest Contentful Paint
  fcp: number  // First Contentful Paint
  ttfb: number // Time to First Byte
  renderCount: number
  memoryUsage: number
  fps: number  // Frames per second
}

export interface MetricsHistory {
  timestamp: number
  metrics: Metrics
}

export interface MetricConfig {
  name: string
  key: keyof Metrics
  unit: string
  goodThreshold: number
  needsImprovementThreshold: number
  format?: (value: number) => string
}

export type MetricStatus = 'good' | 'needs-improvement' | 'poor'