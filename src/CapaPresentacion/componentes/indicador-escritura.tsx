/**
 * Componente de indicador de escritura con animación profesional y moderna.
 * - Muestra texto "Pensando" + 3 puntos animados con efecto pulse suave.
 * - Animación: pulse con delays escalonados para efecto wave fluido.
 * - Diseño moderno con gradientes sutiles y mejor espaciado.
 * - Accesibilidad: texto oculto para screen readers (sr-only).
 */
"use client"

export function IndicadorEscritura() {
  return (
    <div className="flex items-center gap-3 text-muted-foreground py-2">
      <span className="text-sm font-medium tracking-wide text-foreground/70">
        Pensando
      </span>
      <div className="inline-flex items-center gap-1.5">
        <span className="sr-only">El asistente está escribiendo…</span>
        <span className="size-2 rounded-full bg-primary/60 animate-pulse [animation-delay:0ms] [animation-duration:1.4s] shadow-sm shadow-primary/20" />
        <span className="size-2 rounded-full bg-primary/60 animate-pulse [animation-delay:200ms] [animation-duration:1.4s] shadow-sm shadow-primary/20" />
        <span className="size-2 rounded-full bg-primary/60 animate-pulse [animation-delay:400ms] [animation-duration:1.4s] shadow-sm shadow-primary/20" />
      </div>
    </div>
  )
}

export { IndicadorEscritura as TypingIndicator }
