"use client"
import { SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled?: boolean
}

export function ChatComposer({ value, onChange, onSubmit, disabled }: Props) {
  return (
    <form
      onSubmit={onSubmit}
      style={{ left: "var(--sb-w)" }}
      className="fixed bottom-4 right-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
    </form>
  )
}
