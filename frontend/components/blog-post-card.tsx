"use client"

import type React from "react"

import Link from "next/link"
import type { BlogPost } from "@/types/blog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BlogPostCardProps {
  post: BlogPost
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
}

export default function BlogPostCard({ post, onLike, onBookmark }: BlogPostCardProps) {
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    onLike?.(post.id)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    onBookmark?.(post.id)
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.profilePicture || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{post.author.name}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Link href={`/post/${post.id}`} className="block group">
          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2 text-balance">
            {post.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty">{post.excerpt}</p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-8 px-2 ${post.isLiked ? "text-red-500" : "text-muted-foreground"}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{post.likesCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">{post.commentsCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`h-8 px-2 ${post.isBookmarked ? "text-blue-500" : "text-muted-foreground"}`}
            >
              <Bookmark className={`w-4 h-4 ${post.isBookmarked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
