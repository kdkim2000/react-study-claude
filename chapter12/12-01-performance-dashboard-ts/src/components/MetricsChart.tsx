import React, { useState } from 'react'
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { MetricsHistory } from '../types'
import { getStatusColor } from '../utils/performanceUtils'

interface MetricsChartProps {
  history: MetricsHistory[]
}

type ChartView = 'webvitals' | 'performance' | 'all'

const MetricsChart: React.FC<MetricsChartProps> = ({ history }) => {
  const [view, setView] = useState<ChartView>('webvitals')
  const theme = useTheme()

  if (!history.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Collecting performance data...
        </Typography>
      </Box>
    )
  }

  // 데이터 포맷팅
  const chartData = history.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    timestamp: item.timestamp,
    ...item.metrics
  }))

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color
                }}
              />
              <Typography variant="caption">
                {entry.name}: {entry.value}
                {entry.name === 'Memory' && ' MB'}
                {(entry.name === 'FCP' || entry.name === 'LCP' || entry.name === 'TTFB' || entry.name === 'FID') && ' ms'}
                {entry.name === 'FPS' && ' fps'}
              </Typography>
            </Box>
          ))}
        </Box>
      )
    }
    return null
  }

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: ChartView | null
  ) => {
    if (newView !== null) {
      setView(newView)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Performance Timeline
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          <ToggleButton value="webvitals">Web Vitals</ToggleButton>
          <ToggleButton value="performance">Performance</ToggleButton>
          <ToggleButton value="all">All</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            stroke={theme.palette.text.secondary}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            stroke={theme.palette.text.secondary}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px' }} />

          {/* Web Vitals */}
          {(view === 'webvitals' || view === 'all') && (
            <>
              <Line
                type="monotone"
                dataKey="cls"
                stroke={getStatusColor('needs-improvement')}
                strokeWidth={2}
                dot={{ r: 2 }}
                name="CLS"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="fcp"
                stroke={getStatusColor('good')}
                strokeWidth={2}
                dot={{ r: 2 }}
                name="FCP"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="lcp"
                stroke={getStatusColor('poor')}
                strokeWidth={2}
                dot={{ r: 2 }}
                name="LCP"
                connectNulls={false}
              />
            </>
          )}

          {/* Performance Metrics */}
          {(view === 'performance' || view === 'all') && (
            <>
              <Line
                type="monotone"
                dataKey="fps"
                stroke="#2196f3"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="FPS"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="memoryUsage"
                stroke="#9c27b0"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Memory"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="renderCount"
                stroke="#ff5722"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Renders"
                connectNulls={false}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default MetricsChart