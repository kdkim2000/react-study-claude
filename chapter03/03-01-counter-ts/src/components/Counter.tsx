import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  Box,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  
  const MIN_VALUE = 0;
  const MAX_VALUE = 10;
  const WARNING_THRESHOLD = 5;

  const increment = () => {
    if (count < MAX_VALUE) {
      setCount(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (count > MIN_VALUE) {
      setCount(prev => prev - 1);
    }
  };

  const reset = () => {
    setCount(0);
  };

  const isWarningState = count >= WARNING_THRESHOLD;
  const isMaxValue = count === MAX_VALUE;
  const isMinValue = count === MIN_VALUE;

  return (
    <Card 
      elevation={3}
      sx={{ 
        minWidth: 300,
        backgroundColor: isWarningState ? '#fff3e0' : 'white',
        border: isWarningState ? '2px solid #ff9800' : 'none',
      }}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          {/* 카운터 값 표시 */}
          <Typography 
            variant="h2" 
            component="div"
            color={isWarningState ? 'warning.main' : 'primary.main'}
            fontWeight="bold"
          >
            {count}
          </Typography>

          {/* 경고 메시지 */}
          {isWarningState && (
            <Alert severity="warning" sx={{ width: '100%' }}>
              카운터 값이 {WARNING_THRESHOLD} 이상입니다!
            </Alert>
          )}

          {/* 버튼 그룹 */}
          <ButtonGroup variant="contained" size="large">
            <Button
              onClick={decrement}
              disabled={isMinValue}
              startIcon={<RemoveIcon />}
              color="secondary"
            >
              감소
            </Button>
            <Button
              onClick={reset}
              startIcon={<RefreshIcon />}
              variant="outlined"
              color="inherit"
            >
              리셋
            </Button>
            <Button
              onClick={increment}
              disabled={isMaxValue}
              startIcon={<AddIcon />}
              color="primary"
            >
              증가
            </Button>
          </ButtonGroup>

          {/* 상태 정보 */}
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              범위: {MIN_VALUE} - {MAX_VALUE}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isMaxValue && "최대값에 도달했습니다"}
              {isMinValue && "최소값에 도달했습니다"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Counter;