import { useState, useCallback } from 'react'
import { Comment } from '../types'

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 게시글별 댓글 조회
  const getCommentsByPostId = useCallback((postId: string) => {
    return comments.filter(comment => comment.postId === postId)
  }, [comments])

  // 댓글 추가
  const addComment = useCallback((postId: string, content: string, author: string, parentId?: string) => {
    setLoading(true)
    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        postId,
        content,
        author,
        createdAt: new Date(),
        parentId
      }
      setComments(prev => [...prev, newComment])
      setError(null)
    } catch (err) {
      setError('댓글 추가에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 댓글 수정
  const updateComment = useCallback((commentId: string, content: string) => {
    setLoading(true)
    try {
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content }
            : comment
        )
      )
      setError(null)
    } catch (err) {
      setError('댓글 수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 댓글 삭제
  const deleteComment = useCallback((commentId: string) => {
    setLoading(true)
    try {
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      setError(null)
    } catch (err) {
      setError('댓글 삭제에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    getCommentsByPostId
  }
}