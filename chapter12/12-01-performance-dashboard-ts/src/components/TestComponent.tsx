import React, { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox
} from '@mui/material'

// 성능 테스트를 위한 컴포넌트
const TestComponent: React.FC = () => {
  const [itemCount, setItemCount] = useState(100)
  const [forceRerender, setForceRerender] = useState(0)
  const [enableMemo, setEnableMemo] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // 의도적으로 무거운 계산을 하는 함수
  const expensiveCalculation = (items: number) => {
    console.log('Expensive calculation running...')
    let result = 0
    for (let i = 0; i < items * 1000; i++) {
      result += Math.random()
    }
    return result
  }

  // 메모이제이션 적용 여부에 따른 계산
  const calculatedValue = enableMemo
    ? useMemo(() => expensiveCalculation(itemCount), [itemCount])
    : expensiveCalculation(itemCount)

  // 많은 리스트 아이템 생성
  const listItems = useMemo(() => {
    return Array.from({ length: itemCount }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      value: Math.random() * 100
    }))
  }, [itemCount])

  // 필터링된 아이템
  const filteredItems = useMemo(() => {
    if (!searchTerm) return listItems
    return listItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [listItems, searchTerm])

  const handleForceRerender = () => {
    setForceRerender(prev => prev + 1)
  }

  const handleMemoryStress = () => {
    // 메모리를 의도적으로 많이 사용하는 함수
    const bigArray = new Array(1000000).fill(0).map(() => ({
      data: new Array(100).fill(Math.random()),
      timestamp: Date.now()
    }))
    console.log('Created big array with', bigArray.length, 'items')
    
    // 잠시 후 가비지 컬렉션을 위해 참조 해제
    setTimeout(() => {
      bigArray.length = 0
      if (window.gc) {
        window.gc()
      }
    }, 2000)
  }

  const handleLayoutShift = () => {
    // CLS를 의도적으로 발생시키는 함수
    const element = document.createElement('div')
    element.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100px;
      height: 100px;
      background: red;
      z-index: 1000;
    `
    document.body.appendChild(element)
    
    setTimeout(() => {
      element.style.top = '100px'
      element.style.left = '100px'
    }, 100)
    
    setTimeout(() => {
      document.body.removeChild(element)
    }, 2000)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Performance Test Component
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Render Performance Test
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>
                Item Count: {itemCount}
              </Typography>
              <Slider
                value={itemCount}
                onChange={(_, value) => setItemCount(value as number)}
                min={10}
                max={1000}
                step={10}
                valueLabelDisplay="auto"
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={enableMemo}
                  onChange={(e) => setEnableMemo(e.target.checked)}
                />
              }
              label="Enable Memoization"
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Search Items"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Calculated Value: {calculatedValue.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Visible Items: {filteredItems.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Force Rerender Count: {forceRerender}
            </Typography>

            <Button
              variant="contained"
              onClick={handleForceRerender}
              fullWidth
              sx={{ mt: 1 }}
            >
              Force Rerender
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Impact Tests
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleMemoryStress}
                color="warning"
              >
                Memory Stress Test
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleLayoutShift}
                color="error"
              >
                Trigger Layout Shift (CLS)
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => {
                  // CPU 집약적인 작업으로 FPS 저하 유발
                  const start = Date.now()
                  while (Date.now() - start < 1000) {
                    // 1초 동안 CPU 블로킹
                    Math.random()
                  }
                }}
                color="error"
              >
                Block CPU (1s)
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Item List ({filteredItems.length} items)
            </Typography>
            <Grid container spacing={1}>
              {filteredItems.slice(0, 200).map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Box
                    sx={{
                      p: 1,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <Typography variant="caption">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.value.toFixed(1)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TestComponent