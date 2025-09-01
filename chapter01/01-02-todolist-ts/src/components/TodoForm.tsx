import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Category as CategoryIcon,
  Flag as PriorityIcon
} from '@mui/icons-material';
import { Todo } from '../types/todo';

interface TodoFormProps {
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (text.trim() === '') return;

    onAdd({
      text: text.trim(),
      completed: false,
      priority,
      category: category.trim() || undefined
    });

    setText('');
    setCategory('');
    setPriority('medium');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        새 할일 추가
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* 할일 내용 입력 */}
          <TextField
            fullWidth
            label="할일 내용"
            placeholder="무엇을 해야 하나요?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            required
            autoFocus
          />

          {/* 우선순위 및 카테고리 */}
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>우선순위</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                label="우선순위"
              >
                <MenuItem value="low">낮음</MenuItem>
                <MenuItem value="medium">보통</MenuItem>
                <MenuItem value="high">높음</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="카테고리"
              placeholder="업무, 개인, 학습 등"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 150 }}
            />
          </Box>

          {/* 추가 버튼 */}
          <Button
            type="submit"
            variant="contained"
            disabled={text.trim() === ''}
            sx={{ alignSelf: 'flex-start' }}
          >
            추가
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TodoForm;