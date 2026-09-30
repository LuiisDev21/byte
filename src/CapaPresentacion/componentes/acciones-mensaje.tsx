"use client"

import * as React from "react"
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react"
import { Boton } from "@/CapaPresentacion/componentes/ui/boton"
import { cn } from "@/CapaNegocio/utilidades"

export interface AccionesMensajeProps {
  messageId?: string
  content: string
  onRegenerate?: () => void
  onFeedback?: (messageId: string, feedback: "like" | "dislike") => void
  className?: string
}

export function AccionesMensaje({
  messageId = "",
  content,
  onRegenerate,
  onFeedback,
  className,
}: AccionesMensajeProps) {
  const [copiado, setCopiado] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null)
  const temporizadorRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (temporizadorRef.current) {
        clearTimeout(temporizadorRef.current)
      }
    }
  }, [])

  const manejarCopiar = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopiado(true)

      if (temporizadorRef.current) {
        clearTimeout(temporizadorRef.current)
      }

      temporizadorRef.current = setTimeout(() => {
        setCopiado(false)
      }, 2000)
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err)
    }
  }

  const manejarFeedback = (tipo: "like" | "dislike") => {
    const nuevoFeedback = feedback === tipo ? null : tipo
    setFeedback(nuevoFeedback)
    if (nuevoFeedback && onFeedback) {
      onFeedback(messageId, nuevoFeedback)
    }
  }

  return (
    <div
      role="toolbar"
      aria-label="Acciones del mensaje"
      className={cn(
        "flex items-center gap-1 mt-2.5 -ml-1 text-muted-foreground select-none",
        className
      )}
    >
      {/* Botón Copiar con feedback visual */}
      <Boton
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={manejarCopiar}
        aria-label={copiado ? "Mensaje copiado" : "Copiar mensaje"}
        title={copiado ? "¡Copiado!" : "Copiar mensaje"}
        className={cn(
          "rounded-xl transition-all duration-150 active:scale-90",
          copiado
            ? "text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/15 dark:text-emerald-400"
            : "hover:bg-muted/70 hover:text-foreground"
        )}
      >
        {copiado ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Boton>

      {/* Botón Regenerar respuesta (si está disponible) */}
      {onRegenerate && (
        <Boton
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRegenerate}
          aria-label="Regenerar respuesta"
          title="Regenerar respuesta"
          className="rounded-xl hover:bg-muted/70 hover:text-foreground active:scale-90 transition-all duration-150"
        >
          <RotateCcw className="size-3.5" />
        </Boton>
      )}

      {/* Botones de Feedback interactivos */}
      <div className="flex items-center gap-0.5 ml-0.5 border-l border-border/40 pl-1">
        <Boton
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => manejarFeedback("like")}
          aria-label="Respuesta útil"
          title="Respuesta útil"
          className={cn(
            "rounded-xl transition-all duration-150 active:scale-90",
            feedback === "like"
              ? "text-primary bg-primary/10 hover:bg-primary/20 font-bold"
              : "hover:bg-muted/70 hover:text-foreground"
          )}
        >
          <ThumbsUp
            className={cn(
              "size-3.5",
              feedback === "like" && "fill-current scale-105"
            )}
          />
        </Boton>

        <Boton
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => manejarFeedback("dislike")}
          aria-label="Respuesta no útil"
          title="Respuesta no útil"
          className={cn(
            "rounded-xl transition-all duration-150 active:scale-90",
            feedback === "dislike"
              ? "text-destructive bg-destructive/10 hover:bg-destructive/20 font-bold"
              : "hover:bg-muted/70 hover:text-foreground"
          )}
        >
          <ThumbsDown
            className={cn(
              "size-3.5",
              feedback === "dislike" && "fill-current scale-105"
            )}
          />
        </Boton>
      </div>
    </div>
  )
}
