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
    <div className="w-full bg-background/95 backdrop-blur-sm border-t">
      <div className="mx-auto w-full max-w-4xl p-3 md:p-4">
        <form onSubmit={onSubmit} className="w-full">
          <div className="flex items-center gap-2 rounded-lg border bg-card shadow-sm p-2">
            <Input
              placeholder="Escribe tu mensaje..."
              className="flex-1 h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
            <Button 
              type="submit" 
              size="icon" 
              aria-label="Enviar" 
              disabled={disabled || !value.trim()}
              className="shrink-0"
            >
              <SendHorizonal className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
