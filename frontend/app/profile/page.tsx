"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { BlogPost } from "@/types/blog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import BlogPostCard from "@/components/blog-post-card"
import EditProfileDialog from "@/components/edit-profile-dialog"
import ProtectedRoute from "@/components/protected-route"
import { Edit, Calendar, BookOpen, Heart, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function ProfilePage() {
  const { user } = useAuth()
  const [userPosts, setUserPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  })

  // Mock user posts
  const mockUserPosts: BlogPost[] = [
    {
      id: "1",
      title: "Getting Started with Next.js 15",
      content: "Next.js 15 brings exciting new features...",
      excerpt:
        "Explore the latest features in Next.js 15 including improved performance, better developer experience, and new APIs.",
      author: {
        id: user?.id || "1",
        name: user?.name || "Sarah Chen",
        profilePicture: user?.profilePicture || "/developer-portrait.png",
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
      id: "5",
      title: "Building Scalable React Applications",
      content: "Learn how to structure large React applications...",
      excerpt:
        "Best practices for organizing components, managing state, and optimizing performance in large-scale React applications.",
      author: {
        id: user?.id || "1",
        name: user?.name || "Sarah Chen",
        profilePicture: user?.profilePicture || "/developer-portrait.png",
      },
      tags: ["React", "Architecture", "Best Practices", "Performance"],
      createdAt: "2024-01-10T14:30:00Z",
      updatedAt: "2024-01-10T14:30:00Z",
      likesCount: 18,
      commentsCount: 5,
      isLiked: false,
      isBookmarked: false,
    },
  ]

  useEffect(() => {
    fetchUserPosts()
  }, [user])

  const fetchUserPosts = async () => {
    if (!user) return

    setLoading(true)
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/users/${user.id}/posts`);
      // setUserPosts(response.data.posts);

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUserPosts(mockUserPosts)

      // Calculate stats
      const totalLikes = mockUserPosts.reduce((sum, post) => sum + post.likesCount, 0)
      const totalComments = mockUserPosts.reduce((sum, post) => sum + post.commentsCount, 0)

      setStats({
        totalPosts: mockUserPosts.length,
        totalLikes,
        totalComments,
      })
    } catch (error) {
      console.error("Failed to fetch user posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      setUserPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
              }
            : post,
        ),
      )
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  const handleBookmark = async (postId: string) => {
    try {
      setUserPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)),
      )
    } catch (error) {
      console.error("Failed to bookmark post:", error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <EditProfileDialog>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </EditProfileDialog>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDistanceToNow(new Date("2023-06-01"), { addSuffix: true })}
                    </p>
                  </div>

                  {user.bio && <p className="text-foreground leading-relaxed text-pretty">{user.bio}</p>}

                  {/* Stats */}
                  <div className="flex gap-6 pt-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">Posts</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalPosts}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">Likes</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalLikes}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Comments</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalComments}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Posts */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Your Posts</h2>
              <Badge variant="secondary">{stats.totalPosts} posts</Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your posts...</p>
                </div>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} onLike={handleLike} onBookmark={handleBookmark} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start sharing your thoughts and ideas with the community.
                  </p>
                  <Button asChild>
                    <a href="/create">Write Your First Post</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
