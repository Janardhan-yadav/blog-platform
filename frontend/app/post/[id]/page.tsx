"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import type { BlogPost, Comment } from "@/types/blog"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CommentSection from "@/components/comment-section"
import PostActions from "@/components/post-actions"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Mock data for development
  const mockPost: BlogPost = {
    id: "1",
    title: "Getting Started with Next.js 15: A Complete Guide",
    content: `
# Introduction

Next.js 15 represents a significant leap forward in React development, bringing with it a host of new features and improvements that make building modern web applications more efficient and enjoyable than ever before.

## What's New in Next.js 15

### Enhanced Performance
The latest version introduces several performance optimizations that reduce bundle sizes and improve loading times. The new compiler optimizations can reduce JavaScript bundle sizes by up to 20% in many applications.

### Improved Developer Experience
- **Better Error Messages**: More descriptive error messages help you identify and fix issues faster
- **Enhanced Hot Reload**: Faster refresh times during development
- **Improved TypeScript Support**: Better type inference and error detection

### New Features

#### Server Components by Default
Server Components are now the default in Next.js 15, providing better performance and SEO out of the box. This means:

- Reduced client-side JavaScript
- Better initial page load times
- Improved SEO capabilities
- Simplified data fetching

#### Enhanced Routing
The App Router has been further refined with new capabilities:

\`\`\`javascript
// Example of new routing features
export default function Page({ params, searchParams }) {
  return (
    <div>
      <h1>Dynamic Route: {params.slug}</h1>
      <p>Search: {searchParams.q}</p>
    </div>
  );
}
\`\`\`

## Getting Started

To create a new Next.js 15 project, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

### Project Structure
Your new Next.js 15 project will have a clean, organized structure:

\`\`\`
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
└── public/
\`\`\`

## Best Practices

### 1. Use Server Components When Possible
Server Components should be your default choice. Only use Client Components when you need interactivity or browser-only APIs.

### 2. Optimize Images
Always use the Next.js Image component for better performance:

\`\`\`jsx
import Image from 'next/image';

export default function MyComponent() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority
    />
  );
}
\`\`\`

### 3. Implement Proper Error Handling
Use error boundaries and proper error handling throughout your application.

## Conclusion

Next.js 15 continues to push the boundaries of what's possible with React development. The combination of improved performance, better developer experience, and new features makes it an excellent choice for your next project.

Whether you're building a simple blog or a complex web application, Next.js 15 provides the tools and optimizations you need to create fast, scalable, and maintainable applications.

Happy coding!
    `,
    excerpt:
      "Explore the latest features in Next.js 15 including improved performance, better developer experience, and new APIs that make building React applications even more enjoyable.",
    author: {
      id: "1",
      name: "Sarah Chen",
      profilePicture: "/developer-portrait.png",
    },
    tags: ["Next.js", "React", "Web Development", "JavaScript", "Tutorial"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    likesCount: 24,
    commentsCount: 8,
    isLiked: false,
    isBookmarked: false,
  }

  const mockComments: Comment[] = [
    {
      id: "1",
      content:
        "Great article! The performance improvements in Next.js 15 are really impressive. I especially love the enhanced Server Components.",
      author: {
        id: "2",
        name: "Marcus Johnson",
        profilePicture: "/programmer-portrait.png",
      },
      createdAt: "2024-01-15T12:30:00Z",
      postId: "1",
    },
    {
      id: "2",
      content:
        "Thanks for the comprehensive guide! The code examples are really helpful. Do you have any tips for migrating from Next.js 14?",
      author: {
        id: "3",
        name: "Elena Rodriguez",
        profilePicture: "/female-developer.png",
      },
      createdAt: "2024-01-15T14:15:00Z",
      postId: "1",
    },
    {
      id: "3",
      content: "The new routing features look amazing. Can't wait to try them out in my next project!",
      author: {
        id: "4",
        name: "David Kim",
        profilePicture: "/asian-developer.jpg",
      },
      createdAt: "2024-01-15T16:45:00Z",
      postId: "1",
    },
  ]

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [params.id])

  const fetchPost = async () => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/posts/${params.id}`);
      // setPost(response.data);

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      setPost(mockPost)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load post")
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/posts/${params.id}/comments`);
      // setComments(response.data);

      setComments(mockComments)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    }
  }

  const handleLike = async () => {
    if (!post) return

    try {
      // In a real app, this would be an API call
      // await api.post(`/posts/${post.id}/like`);

      setPost((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
            }
          : null,
      )
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  const handleBookmark = async () => {
    if (!post) return

    try {
      // In a real app, this would be an API call
      // await api.post(`/posts/${post.id}/bookmark`);

      setPost((prev) =>
        prev
          ? {
              ...prev,
              isBookmarked: !prev.isBookmarked,
            }
          : null,
      )
    } catch (error) {
      console.error("Failed to bookmark post:", error)
    }
  }

  const handleAddComment = async (content: string) => {
    if (!post || !user) return

    try {
      // In a real app, this would be an API call
      // const response = await api.post(`/posts/${post.id}/comments`, { content });

      const newComment: Comment = {
        id: Date.now().toString(),
        content,
        author: {
          id: user.id,
          name: user.name,
          profilePicture: user.profilePicture,
        },
        createdAt: new Date().toISOString(),
        postId: post.id,
      }

      setComments((prev) => [newComment, ...prev])
      setPost((prev) =>
        prev
          ? {
              ...prev,
              commentsCount: prev.commentsCount + 1,
            }
          : null,
      )
    } catch (error) {
      console.error("Failed to add comment:", error)
      throw error
    }
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

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-6">{error || "The post you're looking for doesn't exist."}</p>
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

        {/* Post Header */}
        <article className="space-y-6">
          <header className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground leading-tight text-balance">{post.title}</h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href={`/profile/${post.author.id}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.profilePicture || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{post.author.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />5 min read
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          {/* Post Actions */}
          <PostActions
            postId={post.id}
            likesCount={post.likesCount}
            isLiked={post.isLiked}
            isBookmarked={post.isBookmarked}
            onLike={handleLike}
            onBookmark={handleBookmark}
          />

          {/* Post Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="text-foreground leading-relaxed space-y-4">
              {post.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                      {paragraph.slice(2)}
                    </h1>
                  )
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">
                      {paragraph.slice(3)}
                    </h2>
                  )
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
                      {paragraph.slice(4)}
                    </h3>
                  )
                }
                if (paragraph.startsWith("#### ")) {
                  return (
                    <h4 key={index} className="text-lg font-semibold mt-3 mb-2">
                      {paragraph.slice(5)}
                    </h4>
                  )
                }
                if (paragraph.startsWith("```")) {
                  const isClosing = paragraph === "```"
                  if (isClosing) {
                    return <div key={index} className="hidden"></div>
                  }
                  const language = paragraph.slice(3)
                  return (
                    <div key={index} className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="text-muted-foreground text-xs mb-2">{language}</div>
                    </div>
                  )
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={index} className="ml-4">
                      {paragraph.slice(2)}
                    </li>
                  )
                }
                if (paragraph.trim() === "") {
                  return <div key={index} className="h-4"></div>
                }
                return (
                  <p key={index} className="text-pretty">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Comments Section */}
          <CommentSection postId={post.id} comments={comments} onAddComment={handleAddComment} />
        </article>
      </div>
    </div>
  )
}
