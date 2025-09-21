"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import RichTextEditor from "@/components/rich-text-editor"
import TagInput from "@/components/tag-input"
import ProtectedRoute from "@/components/protected-route"
import { Loader2, Save, Eye, ArrowLeft, Upload, X } from "lucide-react"

export default function CreatePostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [featuredImage, setFeaturedImage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const generateExcerpt = (content: string): string => {
    // Remove markdown formatting and get first 150 characters
    const plainText = content
      .replace(/#{1,6}\s/g, "") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links
      .replace(/>\s/g, "") // Remove quotes
      .replace(/[-*]\s/g, "") // Remove list markers
      .replace(/\d+\.\s/g, "") // Remove numbered list markers
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
      // const response = await api.post('/posts', {
      //   title: title.trim(),
      //   content: content.trim(),
      //   excerpt,
      //   tags,
      //   featuredImage: featuredImage || null,
      // });

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful creation
      const newPostId = Date.now().toString()

      router.push(`/post/${newPostId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!title.trim() && !content.trim()) {
      setError("Please add some content before saving as draft")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would save as draft
      // await api.post('/posts/draft', { title, content, tags, featuredImage });

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Show success message or redirect to drafts
      alert("Draft saved successfully!")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save draft")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a service like Cloudinary or AWS S3
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
              <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
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
                    <Label htmlFor="featured-image" className="cursor-pointer">
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Click to upload featured image
                      </span>
                    </Label>
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
                    Publishing...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Publish Post
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
