import React, { useState } from 'react'
import { 
  Box, 
  TextField, 
  Button, 
  Paper,
  CircularProgress
} from '@mui/material'

interface CommentFormProps {
  onSubmit: (content: string, author: string) => void
  loading: boolean
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, loading }) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || !author.trim()) {
      alert('댓글 내용과 작성자를 입력해주세요.')
      return
    }

    onSubmit(content.trim(), author.trim())
    setContent('')
    // 작성자는 유지 (실제 앱에서는 로그인 정보 사용)
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="댓글을 작성하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="작성자"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            sx={{ width: 150 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !content.trim() || !author.trim()}
            startIcon={loading && <CircularProgress size={16} />}
          >
            댓글 등록
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default CommentForm