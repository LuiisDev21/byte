"use client"

import * as React from "react"
import Image from "next/image"
import { X, FileImage } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/CapaNegocio/utilidades"
import { Boton } from "@/CapaPresentacion/componentes/ui/boton"

/**
 * Contenedor para lista de archivos e imágenes adjuntas en el prompt.
 */
export type PromptInputAttachmentsProps = React.HTMLAttributes<HTMLDivElement>

export const PromptInputAttachments = React.forwardRef<
  HTMLDivElement,
  PromptInputAttachmentsProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center gap-2 px-2 pb-2 pt-1", className)}
      {...props}
    >
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  )
})
PromptInputAttachments.displayName = "PromptInputAttachments"

/**
 * Elemento de vista previa para un archivo o imagen adjunta con badge de formato y botón de eliminación.
 */
export interface PromptInputAttachmentItemProps {
  src: string
  alt?: string
  name?: string
  type?: string
  onRemove?: () => void
  disabled?: boolean
  className?: string
}

function deducirFormato(src: string, type?: string, name?: string): string {
  if (type) {
    const limpio = type.replace("image/", "").toUpperCase()
    if (limpio) return limpio
  }
  if (name) {
    const ext = name.split(".").pop()?.toUpperCase()
    if (ext && ext.length <= 4) return ext
  }
  if (src.startsWith("data:image/")) {
    const match = src.match(/data:image\/([a-zA-Z0-9+]+);/)
    if (match?.[1]) {
      return match[1].replace("+xml", "").toUpperCase()
    }
  }
  return "IMG"
}

export const PromptInputAttachmentItem = React.forwardRef<
  HTMLDivElement,
  PromptInputAttachmentItemProps
>(
  (
    {
      src,
      alt = "Archivo adjunto",
      name,
      type,
      onRemove,
      disabled = false,
      className,
    },
    ref
  ) => {
    const formato = deducirFormato(src, type, name)

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={cn(
          "group relative inline-flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/90 p-1.5 pr-3 shadow-xs hover:border-border transition-all",
          className
        )}
      >
        {/* Miniatura de la imagen */}
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted/40 shadow-inner">
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="48px"
              unoptimized={src.startsWith("data:")}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <FileImage className="size-5" />
            </div>
          )}
        </div>

        {/* Metadatos y badge de formato */}
        <div className="flex flex-col min-w-0 pr-1">
          {name && (
            <span className="truncate max-w-[140px] text-xs font-medium text-foreground">
              {name}
            </span>
          )}
          <span className="inline-flex w-fit items-center rounded-md border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase select-none">
            {formato}
          </span>
        </div>

        {/* Botón X para eliminar con microestilo 3D */}
        {onRemove && (
          <Boton
            type="button"
            variant="destructive"
            size="icon-xs"
            onClick={onRemove}
            disabled={disabled}
            aria-label="Eliminar adjunto"
            title="Eliminar adjunto"
            className="absolute -top-1.5 -right-1.5 size-5 rounded-full shadow-xs cursor-pointer active:scale-95 transition-transform"
          >
            <X className="size-3" />
          </Boton>
        )}
      </motion.div>
    )
  }
)
PromptInputAttachmentItem.displayName = "PromptInputAttachmentItem"
