import React from 'react'
import { Paper, Typography, Box, Divider } from '@mui/material'
import { Post } from '../types'
import CommentSection from './CommentSection'

interface PostDetailProps {
  post: Post
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {post.title}
      </Typography>
      
      <Box sx={{ mb: 2, color: 'text.secondary' }}>
        <Typography variant="body2">
          작성자: {post.author} | 작성일: {post.createdAt.toLocaleDateString()}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        {post.content}
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <CommentSection postId={post.id} />
    </Paper>
  )
}

export default PostDetail