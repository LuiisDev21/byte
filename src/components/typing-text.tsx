"use client"
import { useEffect, useRef, useState } from "react"
import { Markdown } from "@/components/markdown"

type Props = {
  text: string
  cps?: number
  enabled?: boolean
  showCaret?: boolean
  className?: string
}

export function TypingText({ text, cps = 45, enabled = true, showCaret = false, className }: Props) {
  const [displayText, setDisplayText] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentIndexRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text)
      return
    }

    // Si el texto es más corto que lo que ya mostramos, reiniciar
    if (text.length < currentIndexRef.current) {
      currentIndexRef.current = 0
      setDisplayText("")
    }

    // Solo animar si hay nuevo contenido
    if (text.length > currentIndexRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        setDisplayText(prev => {
          const nextIndex = currentIndexRef.current + 1
          if (nextIndex <= text.length) {
            currentIndexRef.current = nextIndex
            return text.slice(0, nextIndex)
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            return prev
          }
        })
      }, 1000 / cps)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, enabled, cps])

  return (
    <span className={className}>
      {displayText}
      {showCaret && enabled && displayText.length < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-px align-[-0.1em] bg-foreground/80 animate-pulse" />
      )}
    </span>
  )
}

type MDProps = Omit<Props, "text"> & { text: string }
export function TypingMarkdown({ text, cps = 45, enabled = true, showCaret = false, className }: MDProps) {
  const [displayText, setDisplayText] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentIndexRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text)
      return
    }

    // Si el texto es más corto que lo que ya mostramos, reiniciar
    if (text.length < currentIndexRef.current) {
      currentIndexRef.current = 0
      setDisplayText("")
    }

    // Solo animar si hay nuevo contenido
    if (text.length > currentIndexRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        setDisplayText(prev => {
          const nextIndex = currentIndexRef.current + 1
          if (nextIndex <= text.length) {
            currentIndexRef.current = nextIndex
            return text.slice(0, nextIndex)
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            return prev
          }
        })
      }, 1000 / cps)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, enabled, cps])

  return (
    <span className={className}>
      <Markdown className="prose prose-neutral max-w-none dark:prose-invert">
        {displayText}
      </Markdown>
      {showCaret && enabled && displayText.length < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-px align-[-0.1em] bg-foreground/80 animate-pulse" />
      )}
    </span>
  )
}
