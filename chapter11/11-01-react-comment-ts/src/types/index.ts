export interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
}

export interface Comment {
  id: string
  postId: string
  content: string
  author: string
  createdAt: Date
  parentId?: string
}