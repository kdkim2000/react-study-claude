import React from 'react'
import { Box, Typography } from '@mui/material'
import { Comment } from '../types'
import CommentItem from './CommentItem'

interface CommentListProps {
  comments: Comment[]
  onUpdate: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  loading: boolean
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  onUpdate, 
  onDelete, 
  loading 
}) => {
  if (comments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        <Typography variant="body2">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </Typography>
      </Box>
    )
  }

  // 최신 댓글부터 표시
  const sortedComments = [...comments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Box sx={{ mt: 2 }}>
      {sortedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onUpdate={onUpdate}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </Box>
  )
}

export default CommentList