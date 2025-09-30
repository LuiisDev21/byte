"use client"
import { useEffect, useState } from "react"
import { Markdown } from "@/components/markdown"

type Props = {
  text: string
  enabled?: boolean
  className?: string
}

export function TypingText({ text, enabled = true, className }: Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true)
      return
    }

    // Reset visibility when text changes
    setIsVisible(false)
    
    // Small delay then fade in
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [text, enabled])

  return (
    <span 
      className={`${className} transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {text}
    </span>
  )
}

type MDProps = Omit<Props, "text"> & { text: string }
export function TypingMarkdown({ text, enabled = true, className }: MDProps) {
  const [displayText, setDisplayText] = useState("")
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text)
      return
    }

    // Si el texto cambió, actualizar con efecto sutil
    if (text !== displayText) {
      setDisplayText(text)
      setKey(prev => prev + 1) // Forzar re-render para animación
    }
  }, [text, enabled, displayText])

  return (
    <div 
      key={key}
      className={`${className} animate-in fade-in duration-200 ease-out`}
    >
      <Markdown className="prose prose-neutral max-w-none dark:prose-invert">
        {displayText}
      </Markdown>
    </div>
  )
}
