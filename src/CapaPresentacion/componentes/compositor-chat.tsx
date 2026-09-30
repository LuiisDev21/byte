/**
 * Componente de entrada de mensajes del chat con soporte para imágenes inspirado en AI SDK Elements.
 * - Primitivas modulares: PromptInput, PromptInputTextarea, PromptInputAttachments, PromptInputActions, PromptInputSubmit, PromptInputStop.
 * - Maneja carga de archivos, pegado desde portapapeles y drag & drop.
 * - Validación: máximo 10MB, solo imágenes.
 * - Estado de carga: botón Stop interactivo (onStop) durante streaming o envío; botón Submit 3D con relieve inset.
 */
"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { ImageIcon } from "lucide-react"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
  PromptInputSubmit,
  PromptInputStop,
} from "@/CapaPresentacion/componentes/ui/prompt-input"
import {
  PromptInputAttachments,
  PromptInputAttachmentItem,
} from "@/CapaPresentacion/componentes/ui/attachments"
import { cn } from "@/CapaNegocio/utilidades"

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled?: boolean
  isLoading?: boolean
  onStop?: () => void
  selectedImage?: string | null
  onImageSelect?: (image: string) => void
  onImageRemove?: () => void
}

export function CompositorChat({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isLoading = false,
  onStop,
  selectedImage,
  onImageSelect,
  onImageRemove,
}: Props) {
  const refEntradaArchivo = useRef<HTMLInputElement>(null)
  const refTextarea = useRef<HTMLTextAreaElement>(null)
  const [estaCargandoArchivo, establecerEstaCargandoArchivo] = useState(false)
  const [estaArrastrando, establecerEstaArrastrando] = useState(false)
  const tieneContenido = Boolean(value.trim() || selectedImage)

  const procesarArchivoImagen = useCallback(
    async (archivo: File) => {
      if (!onImageSelect) return

      if (!archivo.type.startsWith("image/")) {
        alert("Por favor selecciona una imagen válida")
        return
      }

      if (archivo.size > 10 * 1024 * 1024) {
        alert("La imagen es muy grande. Máximo 10MB.")
        return
      }

      establecerEstaCargandoArchivo(true)

      try {
        const lector = new FileReader()
        lector.onload = (e) => {
          const resultado = e.target?.result as string
          onImageSelect(resultado)
          establecerEstaCargandoArchivo(false)
        }
        lector.onerror = () => {
          alert("Error al cargar la imagen")
          establecerEstaCargandoArchivo(false)
        }
        lector.readAsDataURL(archivo)
      } catch (error) {
        console.error("Error al procesar imagen:", error)
        alert("Error al procesar la imagen")
        establecerEstaCargandoArchivo(false)
      }
    },
    [onImageSelect]
  )

  const manejarSeleccionArchivo = async (
    evento: React.ChangeEvent<HTMLInputElement>
  ) => {
    const archivo = evento.target.files?.[0]
    if (!archivo) return
    await procesarArchivoImagen(archivo)
  }

  const manejarClicBotonImagen = () => {
    refEntradaArchivo.current?.click()
  }

  const manejarEliminarImagen = () => {
    onImageRemove?.()
    if (refEntradaArchivo.current) {
      refEntradaArchivo.current.value = ""
    }
  }

  const manejarPegar = async (evento: React.ClipboardEvent) => {
    if (!onImageSelect || disabled) return

    const elementos = evento.clipboardData?.items
    if (!elementos) return

    for (let i = 0; i < elementos.length; i++) {
      const elemento = elementos[i]

      if (elemento.type.startsWith("image/")) {
        evento.preventDefault()
        const archivo = elemento.getAsFile()
        if (archivo) {
          await procesarArchivoImagen(archivo)
        }
        break
      }
    }
  }

  const manejarArrastrarSobre = (evento: React.DragEvent) => {
    evento.preventDefault()
    establecerEstaArrastrando(true)
  }

  const manejarArrastrarFuera = (evento: React.DragEvent) => {
    evento.preventDefault()
    establecerEstaArrastrando(false)
  }

  const manejarSoltar = async (evento: React.DragEvent) => {
    evento.preventDefault()
    establecerEstaArrastrando(false)

    if (!onImageSelect || disabled) return

    const archivos = evento.dataTransfer?.files
    if (!archivos || archivos.length === 0) return

    const archivo = archivos[0]
    if (archivo.type.startsWith("image/")) {
      await procesarArchivoImagen(archivo)
    }
  }

  useEffect(() => {
    const manejarPegarGlobal = async (evento: ClipboardEvent) => {
      const elementoActivo = document.activeElement
      const estaEntradaEnfocada = elementoActivo === refTextarea.current
      const ningunElementoEnfocado =
        !elementoActivo || elementoActivo === document.body

      if (!estaEntradaEnfocada && !ningunElementoEnfocado) return
      if (!onImageSelect || disabled) return

      const elementos = evento.clipboardData?.items
      if (!elementos) return

      for (let i = 0; i < elementos.length; i++) {
        const elemento = elementos[i]

        if (elemento.type.startsWith("image/")) {
          evento.preventDefault()
          const archivo = elemento.getAsFile()
          if (archivo) {
            await procesarArchivoImagen(archivo)
          }
          break
        }
      }
    }

    document.addEventListener("paste", manejarPegarGlobal)
    return () => document.removeEventListener("paste", manejarPegarGlobal)
  }, [procesarArchivoImagen, disabled, onImageSelect])

  return (
    <div className="w-full pb-4 pt-2 px-3 md:px-6 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div className="mx-auto w-full max-w-3xl">
        <div
          className="w-full"
          onDragOver={manejarArrastrarSobre}
          onDragLeave={manejarArrastrarFuera}
          onDrop={manejarSoltar}
        >
          {estaArrastrando && (
            <div className="flex items-center justify-center p-6 mb-3 border-2 border-dashed border-primary/50 rounded-3xl bg-primary/5 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-primary/70 mb-2 animate-bounce" />
                <p className="text-sm text-primary font-medium">
                  Suelta la imagen aquí para adjuntarla
                </p>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="w-full">
            <PromptInput
              className={cn(
                "transition-all duration-200",
                estaArrastrando && "border-primary ring-2 ring-primary/20"
              )}
            >
              {/* Adjuntos renderizados con PromptInputAttachments */}
              {selectedImage && !estaArrastrando && (
                <PromptInputAttachments>
                  <PromptInputAttachmentItem
                    src={selectedImage}
                    alt="Imagen seleccionada"
                    onRemove={manejarEliminarImagen}
                    disabled={disabled || isLoading}
                  />
                </PromptInputAttachments>
              )}

              {/* Textarea elástico autoajustable */}
              <PromptInputTextarea
                ref={refTextarea}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPaste={manejarPegar}
                disabled={disabled}
                placeholder={
                  estaArrastrando
                    ? "Suelta la imagen aquí..."
                    : selectedImage
                    ? "Pregunta a Byte sobre esta imagen..."
                    : "Consulta a Byte sobre tu perro (síntomas, dieta, conducta)..."
                }
              />

              {/* Barra de acciones inferior */}
              <PromptInputActions>
                <div className="flex items-center gap-1.5">
                  {onImageSelect && (
                    <>
                      <input
                        ref={refEntradaArchivo}
                        type="file"
                        accept="image/*"
                        onChange={manejarSeleccionArchivo}
                        className="hidden"
                        disabled={disabled || estaCargandoArchivo}
                      />
                      <PromptInputAction
                        type="button"
                        variant="ghost"
                        onClick={manejarClicBotonImagen}
                        disabled={disabled || estaCargandoArchivo}
                        aria-label="Adjuntar imagen"
                        title="Adjuntar imagen (o pega desde el portapapeles)"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      >
                        <ImageIcon className="size-4" />
                      </PromptInputAction>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {isLoading ? (
                    <PromptInputStop
                      onClick={onStop}
                      title="Detener respuesta"
                      aria-label="Detener respuesta"
                    />
                  ) : (
                    <PromptInputSubmit
                      disabled={disabled || !tieneContenido}
                      aria-label="Enviar mensaje"
                    />
                  )}
                </div>
              </PromptInputActions>
            </PromptInput>
          </form>
        </div>
      </div>
    </div>
  )
}

export { CompositorChat as ChatComposer }
