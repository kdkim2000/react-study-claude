import React from 'react'
import { Grid, Box, Typography, Tooltip } from '@mui/material'
import { Metrics } from '../types'
import { metricConfigs, getMetricStatus, getStatusColor, formatMetricValue } from '../utils/performanceUtils'

interface MetricsGridProps {
  metrics: Metrics
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <Grid container spacing={1}>
      {metricConfigs.map((config) => {
        const value = metrics[config.key]
        const status = getMetricStatus(value, config)
        const color = getStatusColor(status)
        
        return (
          <Grid item xs={6} sm={3} key={config.key}>
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {config.name}
                  </Typography>
                  <Typography variant="caption">
                    Status: {status.replace('-', ' ')}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    Good: ≤ {config.goodThreshold}{config.unit}
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    Needs improvement: ≤ {config.needsImprovementThreshold}{config.unit}
                  </Typography>
                </Box>
              }
              placement="top"
            >
              <Box
                sx={{
                  p: 1,
                  textAlign: 'center',
                  border: 2,
                  borderColor: color,
                  borderRadius: 1,
                  backgroundColor: `${color}10`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: `${color}20`,
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: color,
                    mb: 0.5
                  }}
                >
                  {config.name}
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    color: color,
                    fontSize: '0.9rem',
                    lineHeight: 1
                  }}
                >
                  {formatMetricValue(value, config)}
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default MetricsGrid