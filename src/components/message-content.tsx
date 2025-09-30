"use client"
import Image from "next/image"
import { TypingMarkdown } from "@/components/typing-text"

interface TextContent {
  type: "text"
  text: string
}

interface ImageContent {
  type: "image"
  image: string
}

type MessageContent = string | (TextContent | ImageContent)[]

interface MessageContentProps {
  content: MessageContent
  role: "user" | "assistant"
  isTyping?: boolean
}

export function MessageContent({ content, role, isTyping = false }: MessageContentProps) {
  // Si el contenido es string, mostrarlo como texto simple
  if (typeof content === "string") {
    if (role === "assistant") {
      return (
        <TypingMarkdown 
          text={content} 
          enabled={isTyping}
          className="prose prose-neutral max-w-none dark:prose-invert"
        />
      )
    }
    return <p className="whitespace-pre-wrap">{content}</p>
  }

  // Si el contenido es array, renderizar cada parte
  if (Array.isArray(content)) {
    return (
      <div className="space-y-3">
        {content.map((part, index) => {
          if (part.type === "text") {
            if (role === "assistant") {
              return (
                <TypingMarkdown 
                  key={index}
                  text={part.text} 
                  enabled={isTyping}
                  className="prose prose-neutral max-w-none dark:prose-invert"
                />
              )
            }
            return (
              <p key={index} className="whitespace-pre-wrap">
                {part.text}
              </p>
            )
          }
          
          if (part.type === "image") {
            return (
              <div key={index} className="relative max-w-sm">
                <div className="relative aspect-square w-full max-w-xs rounded-lg overflow-hidden border">
                  <Image
                    src={part.image}
                    alt="Imagen enviada"
                    fill
                    className="object-cover"
                    sizes="(max-width: 384px) 100vw, 384px"
                  />
                </div>
              </div>
            )
          }
          
          return null
        })}
      </div>
    )
  }

  return null
}