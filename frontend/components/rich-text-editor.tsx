"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your post content...",
  disabled = false,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const formatButtons = [
    { icon: Heading1, action: () => insertText("# "), label: "Heading 1" },
    { icon: Heading2, action: () => insertText("## "), label: "Heading 2" },
    { icon: Heading3, action: () => insertText("### "), label: "Heading 3" },
    { icon: Bold, action: () => insertText("**", "**"), label: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), label: "Italic" },
    { icon: Code, action: () => insertText("`", "`"), label: "Inline Code" },
    { icon: Quote, action: () => insertText("> "), label: "Quote" },
    { icon: List, action: () => insertText("- "), label: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("1. "), label: "Numbered List" },
    { icon: Link, action: () => insertText("[", "](url)"), label: "Link" },
  ]

  const renderPreview = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-6 mb-4">
            {line.slice(2)}
          </h1>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-semibold mt-5 mb-3">
            {line.slice(3)}
          </h2>
        )
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
            {line.slice(4)}
          </h3>
        )
      }
      if (line.startsWith("> ")) {
        return (
          <blockquote key={index} className="border-l-4 border-border pl-4 italic text-muted-foreground my-4">
            {line.slice(2)}
          </blockquote>
        )
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 list-disc">
            {line.slice(2)}
          </li>
        )
      }
      if (line.match(/^\d+\. /)) {
        return (
          <li key={index} className="ml-4 list-decimal">
            {line.replace(/^\d+\. /, "")}
          </li>
        )
      }
      if (line.startsWith("```")) {
        return (
          <div key={index} className="bg-muted p-4 rounded-lg font-mono text-sm my-4">
            <div className="text-muted-foreground text-xs mb-2">{line.slice(3) || "code"}</div>
          </div>
        )
      }
      if (line.trim() === "") {
        return <div key={index} className="h-4"></div>
      }

      // Handle inline formatting
      let formattedLine = line
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, "<em>$1</em>")
      formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      formattedLine = formattedLine.replace(
        /\[(.*?)\]$$(.*?)$$/g,
        '<a href="$2" class="text-primary hover:underline">$1</a>',
      )

      return <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />
    })
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Tabs defaultValue="edit" className="w-full">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-1">
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title={button.label}
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <TabsList className="grid w-32 grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit className="w-3 h-3" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="m-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[400px] border-0 resize-none focus-visible:ring-0 rounded-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="p-4 min-h-[400px] prose prose-gray dark:prose-invert max-w-none">
            {value.trim() ? (
              renderPreview(value)
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview yet. Start writing in the Edit tab.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
