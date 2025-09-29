"use client"
import { useEffect, useState } from "react"
import { SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useLayoutUI } from "@/components/layout-ui-context"

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled?: boolean
}

export function ChatComposer({ value, onChange, onSubmit, disabled }: Props) {
  const { isDesktop, sidebarOpen } = useLayoutUI()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <motion.form
      onSubmit={onSubmit}
      className="fixed bottom-4 right-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 left-0 md:left-[var(--sb-w)] px-3 md:px-0"
  initial={false}
  animate={{ left: isDesktop ? (sidebarOpen ? "var(--sb-w)" : 0) : 0 }}
  transition={mounted ? { type: "spring", stiffness: 260, damping: 28 } : { duration: 0 }}
    >
      <div className="mx-auto w-full max-w-4xl p-2 mb-3 flex items-center gap-2 rounded-lg border bg-card shadow-sm h-16">
        <Input
          placeholder="Escribe tu mensaje..."
          className="flex-1 h-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <Button type="submit" size="icon" aria-label="Enviar" disabled={disabled || !value.trim()}>
          <SendHorizonal className="size-4" />
        </Button>
      </div>
    </motion.form>
  )
}
