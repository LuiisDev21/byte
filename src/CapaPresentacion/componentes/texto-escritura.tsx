/**
 * Componente React para renderizar Markdown durante el streaming y en estado final.
 * - MarkdownEscritura: renderiza markdown de forma fluida y continua sin destruir el DOM en cada chunk,
 *   eliminando el parpadeo y mostrando un cursor pulsante suave mientras está escribiendo.
 * - TextoEscritura: renderiza texto plano de forma fluida sin recargas destructivas de opacidad.
 */
"use client"
import React from "react"
import { Markdown } from "@/CapaPresentacion/componentes/markdown"

type Props = {
  text: string
  enabled?: boolean
  className?: string
}

export function TextoEscritura({ text, enabled = false, className }: Props) {
  return (
    <span className={className}>
      {text}
      {enabled && (
        <span
          className="inline-block w-1.5 h-3.5 ml-1 rounded-full bg-primary/70 align-middle animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  )
}

type PropsMD = Omit<Props, "text"> & { text: string }

export function MarkdownEscritura({ text, enabled = false, className }: PropsMD) {
  return (
    <div className={className}>
      <Markdown className="prose prose-neutral max-w-none dark:prose-invert">
        {text}
      </Markdown>
      {enabled && (
        <span
          className="inline-block w-2 h-4 ml-1 rounded-xs bg-primary/80 align-middle animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export { TextoEscritura as TypingText, MarkdownEscritura as TypingMarkdown }
