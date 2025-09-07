import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { Edit, Delete, Save, Cancel } from '@mui/icons-material'
import { Comment } from '../types'

interface CommentItemProps {
  comment: Comment
  onUpdate: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  loading: boolean
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  onUpdate, 
  onDelete, 
  loading 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(comment.content)
  }

  const handleSave = () => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }
    onUpdate(comment.id, editContent.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(comment.content)
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    onDelete(comment.id)
    setDeleteDialogOpen(false)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {comment.createdAt.toLocaleString()}
            </Typography>
          </Box>
          
          <Box>
            {!isEditing ? (
              <>
                <IconButton
                  size="small"
                  onClick={handleEdit}
                  disabled={loading}
                  color="primary"
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  disabled={loading}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  onClick={handleSave}
                  disabled={loading}
                  color="primary"
                >
                  <Save fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <Cancel fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {isEditing ? (
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            disabled={loading}
          />
        ) : (
          <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {comment.content}
          </Typography>
        )}
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>댓글 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            이 댓글을 정말 삭제하시겠습니까? 삭제된 댓글은 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CommentItem