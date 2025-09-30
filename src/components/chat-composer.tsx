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
          <div className="relative flex items-center">
            <Input
              placeholder="Escribe tu mensaje..."
              className="w-full h-12 pl-4 pr-12 rounded-full border bg-card shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-sm"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
            <Button 
              type="submit" 
              size="icon" 
              aria-label="Enviar" 
              disabled={disabled || !value.trim()}
              className="absolute right-1 size-10 rounded-full shrink-0"
            >
              <SendHorizonal className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
