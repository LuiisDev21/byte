"use client"

import * as React from "react"
import { ChevronDown, PawPrint } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/CapaNegocio/utilidades"

interface ContextoRazonamiento {
  abierto: boolean
  alternar: () => void
  estaRazonando: boolean
}

const ContextoRazonamiento = React.createContext<ContextoRazonamiento | null>(null)

export function useReasoning() {
  const contexto = React.useContext(ContextoRazonamiento)
  if (!contexto) {
    throw new Error("useReasoning debe ser usado dentro de un <Reasoning />")
  }
  return contexto
}

/**
 * Contenedor del acordeón colapsable para la cadena de pensamiento clínico de la IA.
 */
export interface ReasoningProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isStreaming?: boolean
}

export const Reasoning = React.forwardRef<HTMLDivElement, ReasoningProps>(
  (
    {
      className,
      children,
      defaultOpen,
      open: controlledOpen,
      onOpenChange,
      isStreaming = false,
      ...props
    },
    ref
  ) => {
    // Si isStreaming está activo y no se especifica defaultOpen, iniciamos abierto para ver el proceso
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState<boolean>(
      defaultOpen ?? isStreaming
    )

    const estaControlado = controlledOpen !== undefined
    const abierto = estaControlado ? controlledOpen : uncontrolledOpen

    // Si comienza a razonar en streaming y no está controlado, auto-abrir
    React.useEffect(() => {
      if (isStreaming && !estaControlado) {
        setUncontrolledOpen(true)
      }
    }, [isStreaming, estaControlado])

    const alternar = React.useCallback(() => {
      const nuevoEstado = !abierto
      if (!estaControlado) {
        setUncontrolledOpen(nuevoEstado)
      }
      onOpenChange?.(nuevoEstado)
    }, [abierto, estaControlado, onOpenChange])

    return (
      <ContextoRazonamiento.Provider
        value={{ abierto, alternar, estaRazonando: isStreaming }}
      >
        <div
          ref={ref}
          className={cn(
            "relative w-full rounded-2xl border border-border/80 bg-card/70 shadow-xs my-2.5 overflow-hidden transition-[border-color,background-color] duration-200",
            isStreaming && "border-primary/40 bg-card/90",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ContextoRazonamiento.Provider>
    )
  }
)
Reasoning.displayName = "Reasoning"

/**
 * Disparador (trigger) para abrir o cerrar el razonamiento clínico.
 */
export interface ReasoningTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  title?: string
  streamingTitle?: string
}

export const ReasoningTrigger = React.forwardRef<
  HTMLButtonElement,
  ReasoningTriggerProps
>(
  (
    {
      className,
      icon,
      title = "Razonamiento clínico",
      streamingTitle = "Analizando caso canino...",
      children,
      ...props
    },
    ref
  ) => {
    const { abierto, alternar, estaRazonando } = useReasoning()

    return (
      <button
        ref={ref}
        type="button"
        onClick={alternar}
        aria-expanded={abierto}
        className={cn(
          "group flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-xs md:text-sm font-medium transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none cursor-pointer",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={cn(
              "relative flex size-6 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-all duration-300",
              estaRazonando && "animate-pulse border-primary/50 shadow-[0_0_8px_rgba(123,79,47,0.2)]"
            )}
          >
            {icon ?? <PawPrint className="size-3.5" />}
            {estaRazonando && (
              <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary animate-ping" />
            )}
          </span>

          <span className="truncate font-medium text-foreground tracking-tight">
            {children ?? (estaRazonando ? streamingTitle : title)}
          </span>

          {estaRazonando && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary uppercase tracking-wider">
              En proceso
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
            abierto && "rotate-180"
          )}
        />
      </button>
    )
  }
)
ReasoningTrigger.displayName = "ReasoningTrigger"

/**
 * Contenido expandible del razonamiento con animación suave.
 */
export type ReasoningContentProps = React.HTMLAttributes<HTMLDivElement>

export const ReasoningContent = React.forwardRef<
  HTMLDivElement,
  ReasoningContentProps
>(({ className, children, ...props }, ref) => {
  const { abierto } = useReasoning()

  return (
    <AnimatePresence initial={false}>
      {abierto && (
        <motion.div
          key="reasoning-animated-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div
            ref={ref}
            className={cn(
              "border-t border-border/60 bg-muted/25 px-3.5 py-3 text-xs md:text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap font-sans",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
ReasoningContent.displayName = "ReasoningContent"
