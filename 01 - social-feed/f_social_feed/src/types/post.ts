// types/post.ts
import type { User } from './user'

export interface Post {
  id: number
  content: string
  user?: User
  user_id: number
  likes_count?: number
  is_liked?: boolean
  policies?: { can_update: boolean; can_delete: boolean }
  created_at: string
  updated_at: string
}

export interface CreatePostData {
  content: string
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors: Record<string, string[]>
}
