"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { BlogPost } from "@/types/blog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import RichTextEditor from "@/components/rich-text-editor"
import TagInput from "@/components/tag-input"
import ProtectedRoute from "@/components/protected-route"
import { Loader2, Save, ArrowLeft, Upload, X } from "lucide-react"

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock post data for editing
  const mockPost: BlogPost = {
    id: params.id as string,
    title: "Getting Started with Next.js 15",
    content: `# Introduction

Next.js 15 represents a significant leap forward in React development, bringing with it a host of new features and improvements that make building modern web applications more efficient and enjoyable than ever before.

## What's New in Next.js 15

### Enhanced Performance
The latest version introduces several performance optimizations that reduce bundle sizes and improve loading times.

### Improved Developer Experience
- **Better Error Messages**: More descriptive error messages help you identify and fix issues faster
- **Enhanced Hot Reload**: Faster refresh times during development
- **Improved TypeScript Support**: Better type inference and error detection`,
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
  }

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/posts/${params.id}`);
      // const postData = response.data;

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const postData = mockPost

      // Check if user owns this post
      if (postData.author.id !== user?.id) {
        setError("You can only edit your own posts")
        return
      }

      setPost(postData)
      setTitle(postData.title)
      setContent(postData.content)
      setTags(postData.tags)
      setFeaturedImage("") // Would come from post data in real app
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load post")
    } finally {
      setLoading(false)
    }
  }

  const generateExcerpt = (content: string): string => {
    const plainText = content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[(.*?)\]$$.*?$$/g, "$1")
      .replace(/>\s/g, "")
      .replace(/[-*]\s/g, "")
      .replace(/\d+\.\s/g, "")
      .trim()

    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const excerpt = generateExcerpt(content)

      // In a real app, this would be an API call
      // const response = await api.put(`/posts/${params.id}`, {
      //   title: title.trim(),
      //   content: content.trim(),
      //   excerpt,
      //   tags,
      //   featuredImage: featuredImage || null,
      // });

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push(`/post/${params.id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFeaturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFeaturedImage = () => {
    setFeaturedImage("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error && !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to edit post</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle>Post Title</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title..."
                  className="text-lg"
                  disabled={isLoading}
                  required
                />
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeFeaturedImage}
                      className="absolute top-2 right-2"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                    <label htmlFor="featured-image" className="cursor-pointer">
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Click to upload featured image
                      </span>
                    </label>
                    <Input
                      id="featured-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor value={content} onChange={setContent} disabled={isLoading} />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <TagInput tags={tags} onChange={setTags} disabled={isLoading} />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
