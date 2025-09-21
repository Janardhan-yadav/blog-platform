"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PostActionsProps {
  postId: string
  likesCount: number
  isLiked: boolean
  isBookmarked: boolean
  onLike: () => void
  onBookmark: () => void
}

export default function PostActions({
  postId,
  likesCount,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
}: PostActionsProps) {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isSharing, setIsSharing] = useState(false)

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      return
    }
    onLike()
  }

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark posts",
        variant: "destructive",
      })
      return
    }
    onBookmark()
  }

  const handleShare = async () => {
    setIsSharing(true)
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: url,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied!",
          description: "Post URL has been copied to your clipboard",
        })
      } catch (error) {
        toast({
          title: "Failed to copy link",
          description: "Please copy the URL manually",
          variant: "destructive",
        })
      }
    }
    setIsSharing(false)
  }

  return (
    <div className="flex items-center gap-4 py-4 border-y border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`flex items-center gap-2 ${isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
        <span>{likesCount}</span>
        <span className="hidden sm:inline">{likesCount === 1 ? "Like" : "Likes"}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={`flex items-center gap-2 ${isBookmarked ? "text-blue-500 hover:text-blue-600" : "text-muted-foreground hover:text-foreground"}`}
      >
        <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
        <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        disabled={isSharing}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Share2 className="w-5 h-5" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    </div>
  )
}
