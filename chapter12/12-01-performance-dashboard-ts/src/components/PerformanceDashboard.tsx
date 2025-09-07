import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Grid,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Speed as SpeedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material'
import { PerformanceDashboardProps } from '../types'
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics'
import { shouldShowInProduction } from '../utils/performanceUtils'
import MetricsGrid from './MetricsGrid'
import MetricsChart from './MetricsChart'

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  showInProduction = false,
  position = 'bottom-right',
  collapsible = true
}) => {
  const { metrics, history, resetRenderCount } = usePerformanceMetrics()
  const [expanded, setExpanded] = useState(false)
  const [showChart, setShowChart] = useState(false)

  // 프로덕션 환경에서 표시 여부 결정
  if (!showInProduction && !shouldShowInProduction()) {
    return null
  }

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 9999,
      maxWidth: expanded ? 600 : 300,
      transition: 'all 0.3s ease-in-out'
    }

    switch (position) {
      case 'top-left':
        return { ...baseStyles, top: 16, left: 16 }
      case 'top-right':
        return { ...baseStyles, top: 16, right: 16 }
      case 'bottom-left':
        return { ...baseStyles, bottom: 16, left: 16 }
      case 'bottom-right':
      default:
        return { ...baseStyles, bottom: 16, right: 16 }
    }
  }

  const handleToggleExpand = () => {
    if (collapsible) {
      setExpanded(!expanded)
    }
  }

  return (
    <Paper
      elevation={8}
      sx={{
        ...getPositionStyles(),
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: collapsible ? 'pointer' : 'default',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
        onClick={handleToggleExpand}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpeedIcon color="primary" fontSize="small" />
          <Typography variant="caption" fontWeight="bold" color="primary">
            Performance
          </Typography>
          <Typography variant="caption" color="text.secondary">
            FPS: {metrics.fps} | Memory: {metrics.memoryUsage}MB
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {expanded && (
            <>
              <Tooltip title="Reset Render Count">
                <IconButton size="small" onClick={(e) => {
                  e.stopPropagation()
                  resetRenderCount()
                }}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle Chart">
                <IconButton size="small" onClick={(e) => {
                  e.stopPropagation()
                  setShowChart(!showChart)
                }}>
                  <TimelineIcon 
                    fontSize="small" 
                    color={showChart ? 'primary' : 'inherit'}
                  />
                </IconButton>
              </Tooltip>
            </>
          )}
          {collapsible && (
            <IconButton size="small">
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* 확장된 내용 */}
      <Collapse in={expanded} timeout={300}>
        <Box sx={{ p: 2, pt: 0 }}>
          {/* 차트 토글 */}
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showChart}
                onChange={(e) => setShowChart(e.target.checked)}
              />
            }
            label={<Typography variant="caption">Show Chart</Typography>}
            sx={{ mb: 1 }}
          />

          {/* 메트릭 그리드 */}
          <MetricsGrid metrics={metrics} />

          {/* 차트 */}
          <Collapse in={showChart} timeout={300}>
            <Box sx={{ mt: 2 }}>
              <MetricsChart history={history} />
            </Box>
          </Collapse>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default PerformanceDashboard