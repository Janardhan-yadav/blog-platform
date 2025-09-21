export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    id: string
    name: string
    profilePicture?: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  likesCount: number
  commentsCount: number
  isLiked?: boolean
  isBookmarked?: boolean
}

export interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    profilePicture?: string
  }
  createdAt: string
  postId: string
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}
