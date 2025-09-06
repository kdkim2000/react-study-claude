import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface CommentData {
  content: string;
  author: string;
}

export const CommentForm: React.FC = () => {
  const [comment, setComment] = useState<CommentData>({
    content: '',
    author: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.content.trim() || !comment.author.trim()) {
      setMessage({
        text: '작성자와 댓글 내용을 모두 입력해주세요',
        type: 'error',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage(null);

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다');
      }

      setComment({ content: '', author: '' });
      setMessage({
        text: '댓글이 작성되었습니다. 새로운 알림이 생성됩니다!',
        type: 'success',
      });
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      setMessage({
        text: error instanceof Error ? error.message : '댓글 작성에 실패했습니다',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CommentData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setComment(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        댓글 작성 (테스트용)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        댓글을 작성하면 새로운 알림이 생성됩니다
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="작성자"
          value={comment.author}
          onChange={handleChange('author')}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="댓글 내용"
          value={comment.content}
          onChange={handleChange('content')}
          multiline
          rows={3}
          margin="normal"
          required
        />

        {message && (
          <Alert 
            severity={message.type} 
            sx={{ mt: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={<SendIcon />}
          >
            {isSubmitting ? '작성 중...' : '댓글 작성'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};