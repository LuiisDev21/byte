"use client"
import { SendHorizonal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ChatComposer() {
  return (
    <form className="mx-auto w-full max-w-4xl p-2">
      <div className="flex items-end gap-2 rounded-lg border bg-card p-2">
        <Input placeholder="Escribe tu mensaje..." className="flex-1" />
        <Button type="submit" size="icon" aria-label="Enviar">
          <SendHorizonal className="size-4" />
        </Button>
      </div>
    </form>
  )
}
