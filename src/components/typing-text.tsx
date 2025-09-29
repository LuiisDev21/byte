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
  const chars = useRef<string[]>([])
  const [visible, setVisible] = useState(0)
  const raf = useRef<number | null>(null)
  const lastTs = useRef<number>(0)

  useEffect(() => {
    chars.current = Array.from(text)
    if (!enabled) {
      setVisible(chars.current.length)
    }
  }, [text, enabled])

  useEffect(() => {
    if (!enabled) return

    const step = (ts: number) => {
      const delta = lastTs.current ? ts - lastTs.current : 0
      lastTs.current = ts
      const perMs = cps / 1000
      const add = Math.max(1, Math.floor(delta * perMs))
      setVisible((v) => Math.min(v + add, chars.current.length))
      if (visible + add < chars.current.length) {
        raf.current = requestAnimationFrame(step)
      } else {
        raf.current = requestAnimationFrame(step)
      }
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = null
      lastTs.current = 0
    }
  }, [enabled, cps, text])

  useEffect(() => {
    if (!enabled) return
    const total = chars.current.length
    if (visible >= total && raf.current == null) {
      raf.current = requestAnimationFrame(() => setVisible((v) => Math.min(v + 1, total)))
    }
  }, [text])

  const out = chars.current.slice(0, enabled ? visible : chars.current.length).join("")

  return (
    <span className={className}>
      {out}
      {showCaret && enabled && (
        <span className="ml-0.5 inline-block h-[1em] w-px align-[-0.1em] bg-foreground/80 animate-pulse" />
      )}
    </span>
  )
}

type MDProps = Omit<Props, "text"> & { text: string }
export function TypingMarkdown({ text, cps = 45, enabled = true, showCaret = false, className }: MDProps) {
  const chars = useRef<string[]>([])
  const [visible, setVisible] = useState(0)
  const raf = useRef<number | null>(null)
  const lastTs = useRef<number>(0)

  useEffect(() => {
    chars.current = Array.from(text)
    if (!enabled) setVisible(chars.current.length)
  }, [text, enabled])

  useEffect(() => {
    if (!enabled) return
    const step = (ts: number) => {
      const delta = lastTs.current ? ts - lastTs.current : 0
      lastTs.current = ts
      const perMs = cps / 1000
      const add = Math.max(1, Math.floor(delta * perMs))
      setVisible((v) => Math.min(v + add, chars.current.length))
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = null
      lastTs.current = 0
    }
  }, [enabled, cps, text])

  const out = chars.current.slice(0, enabled ? visible : chars.current.length).join("")
  return (
    <span className={className}>
      <Markdown className="prose prose-neutral max-w-none dark:prose-invert">{out}</Markdown>
      {showCaret && enabled && (
        <span className="ml-0.5 inline-block h-[1em] w-px align-[-0.1em] bg-foreground/80 animate-pulse" />
      )}
    </span>
  )
}
