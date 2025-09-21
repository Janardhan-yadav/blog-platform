"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string, tags: string[]) => void
  popularTags?: string[]
}

export default function SearchBar({ onSearch, popularTags = [] }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleSearch = () => {
    onSearch(query, selectedTags)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setQuery("")
    setSelectedTags([])
    onSearch("", [])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search posts by title or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        {(query || selectedTags.length > 0) && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {popularTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Popular tags:</p>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="default" className="cursor-pointer">
                {tag}
                <X className="w-3 h-3 ml-1" onClick={() => toggleTag(tag)} />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
