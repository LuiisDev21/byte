"use client"
import { useEffect, useRef, useState } from "react"
import { Markdown } from "@/components/markdown"

type Props = {
  text: string
  speed?: number
  enabled?: boolean
  showCaret?: boolean
  className?: string
}

export function TypingText({ text, speed = 50, enabled = true, showCaret = false, className }: Props) {
  const [displayedText, setDisplayedText] = useState("")
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text)
      return
    }

    // Reset animation when text changes
    setDisplayedText("")
    lastUpdateRef.current = 0
    startTimeRef.current = null

    if (text.length === 0) return

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const targetLength = Math.min(Math.floor(elapsed / speed), text.length)

      if (targetLength > lastUpdateRef.current) {
        lastUpdateRef.current = targetLength
        setDisplayedText(text.slice(0, targetLength))
      }

      if (targetLength < text.length) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [text, speed, enabled])

  return (
    <span className={className}>
      {displayedText}
      {showCaret && enabled && displayedText.length < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-px align-[-0.1em] bg-foreground/80 animate-pulse" />
      )}
    </span>
  )
}

type MDProps = Omit<Props, "text"> & { text: string }
export function TypingMarkdown({ text, speed = 50, enabled = true, showCaret = false, className }: MDProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const lastLengthRef = useRef<number>(0)
  const previousTextRef = useRef<string>("")

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    // Si el texto es completamente diferente, reiniciar
    if (!text.startsWith(previousTextRef.current)) {
      setDisplayedText("")
      lastLengthRef.current = 0
      startTimeRef.current = null
      setIsComplete(false)
    }

    previousTextRef.current = text

    if (text.length === 0) {
      setDisplayedText("")
      setIsComplete(true)
      return
    }

    // Si el texto solo se extendió, continuar desde donde estábamos
    if (text.length <= lastLengthRef.current) {
      return
    }

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const targetLength = Math.min(
        lastLengthRef.current + Math.floor(elapsed / speed),
        text.length
      )

      if (targetLength > lastLengthRef.current) {
        lastLengthRef.current = targetLength
        setDisplayedText(text.slice(0, targetLength))
      }

      if (targetLength < text.length) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsComplete(true)
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [text, speed, enabled])

  return (
    <span className={className}>
      <Markdown className="prose prose-neutral max-w-none dark:prose-invert">
        {displayedText}
      </Markdown>
      {showCaret && enabled && !isComplete && (
        <span className="ml-0.5 inline-block h-[1em] w-px align-[-0.1em] bg-foreground/80 animate-pulse" />
      )}
    </span>
  )
}
