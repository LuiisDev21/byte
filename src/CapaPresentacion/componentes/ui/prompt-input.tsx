"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { SendHorizonal, Square } from "lucide-react"
import { cn } from "@/CapaNegocio/utilidades"
import { debeEnviarConEnter } from "@/CapaNegocio/utilidades/chat-utilidades"
import { Boton, type PropiedadesBoton } from "@/CapaPresentacion/componentes/ui/boton"

/**
 * Contenedor principal para el campo de entrada de prompt modular (AI SDK Elements).
 */
export interface PromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(
          "group/prompt-input relative flex flex-col w-full rounded-3xl md:rounded-4xl border border-border/80 bg-card p-2 md:p-2.5 shadow-sm transition-[border-color,box-shadow,background-color] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
          className
        )}
        {...props}
      />
    )
  }
)
PromptInput.displayName = "PromptInput"

/**
 * Textarea elástico que auto-ajusta su altura entre 44px (1 línea) y 180px (~6 líneas).
 * Maneja Enter para enviar el formulario y Shift+Enter para salto de línea.
 */
export interface PromptInputTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number
  maxHeight?: number
}

export const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      minHeight = 44,
      maxHeight = 180,
      rows = 1,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null)

    // Sincronizar forwardedRef con internalRef
    React.useImperativeHandle(
      forwardedRef,
      () => internalRef.current as HTMLTextAreaElement
    )

    const ajustarAltura = React.useCallback(() => {
      const textarea = internalRef.current
      if (!textarea) return

      textarea.style.height = "auto"
      const alturaScroll = textarea.scrollHeight
      const alturaFinal = Math.min(Math.max(alturaScroll, minHeight), maxHeight)
      textarea.style.height = `${alturaFinal}px`
      textarea.style.overflowY = alturaScroll > maxHeight ? "auto" : "hidden"
    }, [minHeight, maxHeight])

    React.useEffect(() => {
      ajustarAltura()
    }, [value, ajustarAltura])

    const manejarCambio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      ajustarAltura()
      onChange?.(e)
    }

    const manejarKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (debeEnviarConEnter({
        key: e.key,
        shiftKey: e.shiftKey,
        isComposing: e.nativeEvent.isComposing
      })) {
        e.preventDefault()
        const formulario = e.currentTarget.form || e.currentTarget.closest("form")
        if (formulario) {
          formulario.requestSubmit()
        }
      }
      onKeyDown?.(e)
    }

    return (
      <textarea
        ref={internalRef}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={manejarCambio}
        onKeyDown={manejarKeyDown}
        style={{
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`,
          ...style,
        }}
        className={cn(
          "w-full resize-none border-0 bg-transparent px-3 py-2 text-sm md:text-base text-foreground placeholder:font-normal placeholder:text-muted-foreground outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-[height] duration-75",
          className
        )}
        {...props}
      />
    )
  }
)
PromptInputTextarea.displayName = "PromptInputTextarea"

/**
 * Contenedor de acciones (botones adjuntar, enviar, parar, herramientas).
 */
export type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>

export const PromptInputActions = React.forwardRef<
  HTMLDivElement,
  PromptInputActionsProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-2 pt-1 px-1 w-full",
        className
      )}
      {...props}
    />
  )
})
PromptInputActions.displayName = "PromptInputActions"

/**
 * Botón de acción individual dentro de PromptInputActions.
 */
export type PromptInputActionProps = PropiedadesBoton

export const PromptInputAction = React.forwardRef<
  HTMLButtonElement,
  PromptInputActionProps
>(({ className, variant = "ghost", size = "icon-sm", ...props }, ref) => {
  return (
    <Boton
      ref={ref}
      variant={variant}
      size={size}
      className={cn("rounded-full shrink-0", className)}
      {...props}
    />
  )
})
PromptInputAction.displayName = "PromptInputAction"

/**
 * Botón 3D de envío con icono SendHorizonal y relieve inset según DESIGN.md.
 */
export type PromptInputSubmitProps = PropiedadesBoton

export const PromptInputSubmit = React.forwardRef<
  HTMLButtonElement,
  PromptInputSubmitProps
>(
  (
    {
      className,
      variant = "default",
      size = "icon-sm",
      children,
      "aria-label": ariaLabel = "Enviar mensaje",
      ...props
    },
    ref
  ) => {
    return (
      <Boton
        ref={ref}
        type="submit"
        variant={variant}
        size={size}
        aria-label={ariaLabel}
        className={cn(
          "rounded-full shrink-0 shadow-[inset_0_1.5px_0px_0_color-mix(in_oklch,var(--primary)_65%,#fff),inset_0_-1.5px_0px_0_color-mix(in_oklch,var(--primary)_75%,#000)]",
          className
        )}
        {...props}
      >
        {children ?? <SendHorizonal className="size-4" />}
      </Boton>
    )
  }
)
PromptInputSubmit.displayName = "PromptInputSubmit"

/**
 * Botón 3D para parar la generación (Square / Stop) con relieve inset según DESIGN.md.
 */
export type PromptInputStopProps = PropiedadesBoton

export const PromptInputStop = React.forwardRef<
  HTMLButtonElement,
  PromptInputStopProps
>(
  (
    {
      className,
      variant = "destructive",
      size = "icon-sm",
      children,
      "aria-label": ariaLabel = "Detener generación",
      title = "Detener generación",
      ...props
    },
    ref
  ) => {
    return (
      <Boton
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        title={title}
        aria-label={ariaLabel}
        className={cn("rounded-full shrink-0", className)}
        {...props}
      >
        {children ?? <Square className="size-3.5 fill-current" />}
      </Boton>
    )
  }
)
PromptInputStop.displayName = "PromptInputStop"
