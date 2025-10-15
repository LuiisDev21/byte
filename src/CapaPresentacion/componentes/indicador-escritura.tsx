/**
 * Componente de indicador de escritura con animación.
 * - Muestra texto "Pensando" + 3 puntos animados con delays escalonados.
 * - Animación: bounce con delays de -200ms, -100ms, 0ms para efecto wave.
 * - Accesibilidad: texto oculto para screen readers (sr-only).
 */
"use client"

export function IndicadorEscritura() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground py-2">
      <span className="text-sm">Pensando</span>
      <div className="inline-flex items-center gap-1">
        <span className="sr-only">El asistente está escribiendo…</span>
        <span className="size-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-200ms]" />
        <span className="size-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-100ms]" />
        <span className="size-1.5 rounded-full bg-primary/70 animate-bounce" />
      </div>
    </div>
  )
}

export { IndicadorEscritura as TypingIndicator }
