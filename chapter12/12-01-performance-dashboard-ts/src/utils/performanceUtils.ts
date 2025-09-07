import { MetricStatus, MetricConfig, Metrics } from '../types'

export const metricConfigs: MetricConfig[] = [
  {
    name: 'CLS',
    key: 'cls',
    unit: '',
    goodThreshold: 0.1,
    needsImprovementThreshold: 0.25,
    format: (value) => value.toFixed(3)
  },
  {
    name: 'INP', // FID 대신 INP 표시
    key: 'fid',
    unit: 'ms',
    goodThreshold: 200,
    needsImprovementThreshold: 500,
    format: (value) => Math.round(value).toString()
  },
  {
    name: 'LCP',
    key: 'lcp',
    unit: 'ms',
    goodThreshold: 2500,
    needsImprovementThreshold: 4000,
    format: (value) => Math.round(value).toString()
  },
  {
    name: 'FCP',
    key: 'fcp',
    unit: 'ms',
    goodThreshold: 1800,
    needsImprovementThreshold: 3000,
    format: (value) => Math.round(value).toString()
  },
  {
    name: 'TTFB',
    key: 'ttfb',
    unit: 'ms',
    goodThreshold: 800,
    needsImprovementThreshold: 1800,
    format: (value) => Math.round(value).toString()
  },
  {
    name: 'Renders',
    key: 'renderCount',
    unit: '',
    goodThreshold: 50,
    needsImprovementThreshold: 100,
    format: (value) => value.toString()
  },
  {
    name: 'Memory',
    key: 'memoryUsage',
    unit: 'MB',
    goodThreshold: 50,
    needsImprovementThreshold: 100,
    format: (value) => value.toString()
  },
  {
    name: 'FPS',
    key: 'fps',
    unit: 'fps',
    goodThreshold: 50,
    needsImprovementThreshold: 30,
    format: (value) => value.toString()
  }
]

export function getMetricStatus(value: number, config: MetricConfig): MetricStatus {
  if (config.key === 'fps') {
    // FPS는 높을수록 좋음
    if (value >= config.goodThreshold) return 'good'
    if (value >= config.needsImprovementThreshold) return 'needs-improvement'
    return 'poor'
  } else {
    // 다른 메트릭들은 낮을수록 좋음
    if (value <= config.goodThreshold) return 'good'
    if (value <= config.needsImprovementThreshold) return 'needs-improvement'
    return 'poor'
  }
}

export function getStatusColor(status: MetricStatus): string {
  switch (status) {
    case 'good':
      return '#4caf50' // 초록색
    case 'needs-improvement':
      return '#ff9800' // 노란색
    case 'poor':
      return '#f44336' // 빨간색
    default:
      return '#757575' // 회색
  }
}

export function formatMetricValue(value: number, config: MetricConfig): string {
  if (value === 0) return '0'
  const formatted = config.format ? config.format(value) : value.toString()
  return `${formatted}${config.unit ? ' ' + config.unit : ''}`
}

export function shouldShowInProduction(): boolean {
  return import.meta.env.DEV || localStorage.getItem('showPerfDashboard') === 'true'
}