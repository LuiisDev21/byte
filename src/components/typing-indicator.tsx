"use client"

export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 text-muted-foreground">
      <span className="sr-only">El asistente está escribiendo…</span>
      <span className="size-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-200ms]" />
      <span className="size-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-100ms]" />
      <span className="size-2 rounded-full bg-primary/70 animate-bounce" />
    </div>
  )}
