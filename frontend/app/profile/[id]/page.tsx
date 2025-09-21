"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { User } from "@/lib/auth"
import type { BlogPost } from "@/types/blog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import BlogPostCard from "@/components/blog-post-card"
import { ArrowLeft, Calendar, BookOpen, Heart, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  })

  // Mock profile data
  const mockProfiles: Record<string, User> = {
    "2": {
      id: "2",
      email: "marcus@example.com",
      name: "Marcus Johnson",
      profilePicture: "/programmer-portrait.png",
      bio: "Full-stack developer passionate about clean code and software architecture. I love sharing knowledge about best practices and helping other developers grow.",
    },
    "3": {
      id: "3",
      email: "elena@example.com",
      name: "Elena Rodriguez",
      profilePicture: "/female-developer.png",
      bio: "Frontend engineer specializing in React and TypeScript. Always exploring new technologies and design patterns to create better user experiences.",
    },
    "4": {
      id: "4",
      email: "david@example.com",
      name: "David Kim",
      profilePicture: "/asian-developer.jpg",
      bio: "UX-focused developer who believes in building accessible and inclusive web applications. Advocate for web standards and performance optimization.",
    },
  }

  const mockUserPosts: Record<string, BlogPost[]> = {
    "2": [
      {
        id: "2",
        title: "The Art of Clean Code",
        content: "Writing maintainable code is crucial...",
        excerpt:
          "Learn the principles of writing clean, maintainable code that your future self and your team will thank you for.",
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
        isLiked: false,
        isBookmarked: false,
      },
    ],
    "3": [
      {
        id: "3",
        title: "Understanding TypeScript Generics",
        content: "TypeScript generics can be confusing...",
        excerpt: "Demystify TypeScript generics with practical examples and real-world use cases.",
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
    ],
    "4": [
      {
        id: "4",
        title: "Building Accessible Web Applications",
        content: "Accessibility should be a priority...",
        excerpt: "Create inclusive web experiences by implementing proper accessibility features.",
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
        isBookmarked: false,
      },
    ],
  }

  useEffect(() => {
    fetchProfile()
  }, [params.id])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // const [profileResponse, postsResponse] = await Promise.all([
      //   api.get(`/users/${params.id}`),
      //   api.get(`/users/${params.id}/posts`)
      // ]);

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const userId = params.id as string
      const profile = mockProfiles[userId]
      const posts = mockUserPosts[userId] || []

      if (!profile) {
        setError("User not found")
        return
      }

      setProfileUser(profile)
      setUserPosts(posts)

      // Calculate stats
      const totalLikes = posts.reduce((sum, post) => sum + post.likesCount, 0)
      const totalComments = posts.reduce((sum, post) => sum + post.commentsCount, 0)

      setStats({
        totalPosts: posts.length,
        totalLikes,
        totalComments,
      })
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load profile")
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <p className="text-muted-foreground mb-6">{error || "The profile you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileUser.profilePicture || "/placeholder.svg"} alt={profileUser.name} />
                  <AvatarFallback className="text-2xl">{profileUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{profileUser.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDistanceToNow(new Date("2023-06-01"), { addSuffix: true })}
                  </p>
                </div>

                {profileUser.bio && <p className="text-foreground leading-relaxed text-pretty">{profileUser.bio}</p>}

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
            <h2 className="text-2xl font-semibold text-foreground">Posts by {profileUser.name}</h2>
            <Badge variant="secondary">{stats.totalPosts} posts</Badge>
          </div>

          {userPosts.length > 0 ? (
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
                <p className="text-muted-foreground">{profileUser.name} hasn't published any posts yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
