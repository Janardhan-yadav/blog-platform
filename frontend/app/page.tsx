"use client"

import { useState, useEffect } from "react"
import type { BlogPost, PaginationMeta } from "@/types/blog"
import BlogPostCard from "@/components/blog-post-card"
import SearchBar from "@/components/search-bar"
import Pagination from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { User } from "lucide-react"

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  })
  const [popularTags, setPopularTags] = useState<string[]>([])
  const { isAuthenticated, user } = useAuth()

  // Mock data for development
  const mockPosts: BlogPost[] = [
    {
      id: "1",
      title: "Getting Started with Next.js 15",
      content: "Next.js 15 brings exciting new features...",
      excerpt:
        "Explore the latest features in Next.js 15 including improved performance, better developer experience, and new APIs that make building React applications even more enjoyable.",
      author: {
        id: "1",
        name: "Sarah Chen",
        profilePicture: "/developer-portrait.png",
      },
      tags: ["Next.js", "React", "Web Development", "JavaScript"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      likesCount: 24,
      commentsCount: 8,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "2",
      title: "The Art of Clean Code",
      content: "Writing maintainable code is crucial...",
      excerpt:
        "Learn the principles of writing clean, maintainable code that your future self and your team will thank you for. Discover best practices and common pitfalls to avoid.",
      author: {
        id: "2",
        name: "Marcus Johnson",
        profilePicture: "/programmer-portrait.png",
      },
      tags: ["Clean Code", "Best Practices", "Software Engineering"],
      createdAt: "2024-01-14T15:30:00Z",
      updatedAt: "2024-01-14T15:30:00Z",
      likesCount: 42,
      commentsCount: 15,
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: "3",
      title: "Understanding TypeScript Generics",
      content: "TypeScript generics can be confusing...",
      excerpt:
        "Demystify TypeScript generics with practical examples and real-world use cases. Learn how to write more flexible and reusable code with type safety.",
      author: {
        id: "3",
        name: "Elena Rodriguez",
        profilePicture: "/female-developer.png",
      },
      tags: ["TypeScript", "Programming", "Type Safety"],
      createdAt: "2024-01-13T09:15:00Z",
      updatedAt: "2024-01-13T09:15:00Z",
      likesCount: 18,
      commentsCount: 6,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: "4",
      title: "Building Accessible Web Applications",
      content: "Accessibility should be a priority...",
      excerpt:
        "Create inclusive web experiences by implementing proper accessibility features. Learn about ARIA labels, keyboard navigation, and screen reader compatibility.",
      author: {
        id: "4",
        name: "David Kim",
        profilePicture: "/asian-developer.jpg",
      },
      tags: ["Accessibility", "Web Development", "UX", "Inclusive Design"],
      createdAt: "2024-01-12T14:20:00Z",
      updatedAt: "2024-01-12T14:20:00Z",
      likesCount: 31,
      commentsCount: 12,
      isLiked: false,
      isBookmarked: true,
    },
  ]

  const mockPopularTags = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Web Development",
    "Clean Code",
    "Accessibility",
  ]

  useEffect(() => {
    fetchPosts()
    fetchPopularTags()
  }, [pagination.currentPage, searchQuery, selectedTags])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // mock delay

      let filteredPosts = mockPosts
      if (searchQuery) {
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      if (selectedTags.length > 0) {
        filteredPosts = filteredPosts.filter((post) =>
          selectedTags.some((tag) => post.tags.includes(tag))
        )
      }

      setPosts(filteredPosts)
      setPagination((prev) => ({
        ...prev,
        totalItems: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / prev.itemsPerPage),
      }))
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPopularTags = async () => {
    try {
      setPopularTags(mockPopularTags)
    } catch (error) {
      console.error("Failed to fetch popular tags:", error)
    }
  }

  const handleSearch = (query: string, tags: string[]) => {
    setSearchQuery(query)
    setSelectedTags(tags)
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) return
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
            }
          : post
      )
    )
  }

  const handleBookmark = async (postId: string) => {
    if (!isAuthenticated) return
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post))
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Discover Amazing Stories
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Explore insights, tutorials, and thoughts from our community of writers
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} popularTags={popularTags} />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading posts...
            </div>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            {posts.length > 0 ? (
              <div className="space-y-6 mb-8">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} onLike={handleLike} onBookmark={handleBookmark} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts found matching your criteria.</p>
                <Button variant="outline" onClick={() => handleSearch("", [])}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {posts.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
