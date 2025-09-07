import React from 'react'
import { Box, Typography, Alert } from '@mui/material'
import { useComments } from '../hooks/useComments'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

interface CommentSectionProps {
  postId: string
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { comments, loading, error, addComment, updateComment, deleteComment, getCommentsByPostId } = useComments()
  
  const postComments = getCommentsByPostId(postId)
  const commentCount = postComments.length

  const handleAddComment = (content: string, author: string) => {
    addComment(postId, content, author)
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        댓글 ({commentCount})
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <CommentForm 
        onSubmit={handleAddComment} 
        loading={loading}
      />
      
      <CommentList 
        comments={postComments}
        onUpdate={updateComment}
        onDelete={deleteComment}
        loading={loading}
      />
    </Box>
  )
}

export default CommentSection