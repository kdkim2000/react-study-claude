// Counter.tsx
import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Box,
  Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import RefreshIcon from '@mui/icons-material/Refresh'

function Counter() {
  const [count, setCount] = useState(0)
  const MIN_VALUE = 0
  const MAX_VALUE = 10
  const WARNING_THRESHOLD = 5
  
  const increment = () => {
    setCount(prev => Math.min(prev + 1, MAX_VALUE))
  }
  
  const decrement = () => {
    setCount(prev => Math.max(prev - 1, MIN_VALUE))
  }
  
  const reset = () => {
    setCount(0)
  }
  
  const isWarning = count >= WARNING_THRESHOLD
  const isMax = count === MAX_VALUE
  const isMin = count === MIN_VALUE
  
  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          카운터
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            my: 3
          }}
        >
          <Typography
            variant="h2"
            color={isWarning ? 'warning.main' : 'primary.main'}
          >
            {count}
          </Typography>
        </Box>
        
        {isWarning && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            경고: 값이 {WARNING_THRESHOLD} 이상입니다!
          </Alert>
        )}
        
        {isMax && (
          <Alert severity="error" sx={{ mb: 2 }}>
            최대값에 도달했습니다!
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <ButtonGroup variant="contained">
            <Button
              onClick={decrement}
              disabled={isMin}
              startIcon={<RemoveIcon />}
            >
              감소
            </Button>
            <Button
              onClick={increment}
              disabled={isMax}
              startIcon={<AddIcon />}
            >
              증가
            </Button>
          </ButtonGroup>
          
          <Button
            variant="outlined"
            onClick={reset}
            startIcon={<RefreshIcon />}
          >
            리셋
          </Button>
        </Box>
        
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 2 }}
          color="text.secondary"
        >
          범위: {MIN_VALUE} ~ {MAX_VALUE}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Counter