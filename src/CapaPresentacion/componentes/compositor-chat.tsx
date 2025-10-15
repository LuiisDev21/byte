/**
 * Componente de entrada de mensajes del chat con soporte para imágenes.
 * - Maneja carga de archivos y drag & drop.
 * - Funciones: procesarArchivoImagen(), manejarSeleccionArchivo(), manejarPegar(), manejarSoltar()
 *   para procesar imágenes desde archivo, clipboard o arrastrar.
 * - Diseño moderno: campo redondeado con botones integrados (imagen + enviar).
 * - Validación: máximo 10MB, solo imágenes, botón disabled cuando no hay contenido.
 */
"use client"
import { SendHorizonal, ImageIcon, X } from "lucide-react"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"
import { Input } from "@/CapaPresentacion/componentes/ui/entrada"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled?: boolean
  selectedImage?: string | null
  onImageSelect?: (image: string) => void
  onImageRemove?: () => void
}

export function CompositorChat({ 
  value, 
  onChange, 
  onSubmit, 
  disabled,
  selectedImage,
  onImageSelect,
  onImageRemove
}: Props) {
  const refEntradaArchivo = useRef<HTMLInputElement>(null)
  const refEntrada = useRef<HTMLInputElement>(null)
  const [estaCargando, establecerEstaCargando] = useState(false)
  const [estaArrastrando, establecerEstaArrastrando] = useState(false)
  const tieneContenido = value.trim() || selectedImage

  const procesarArchivoImagen = async (archivo: File) => {
    if (!onImageSelect) return

    if (!archivo.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    if (archivo.size > 10 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 10MB.')
      return
    }

    establecerEstaCargando(true)
    
    try {
      const lector = new FileReader()
      lector.onload = (e) => {
        const resultado = e.target?.result as string
        onImageSelect(resultado)
        establecerEstaCargando(false)
      }
      lector.onerror = () => {
        alert('Error al cargar la imagen')
        establecerEstaCargando(false)
      }
      lector.readAsDataURL(archivo)
    } catch (error) {
      console.error('Error al procesar imagen:', error)
      alert('Error al procesar la imagen')
      establecerEstaCargando(false)
    }
  }

  const manejarSeleccionArchivo = async (evento: React.ChangeEvent<HTMLInputElement>) => {
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
      refEntradaArchivo.current.value = ''
    }
  }

  const manejarPegar = async (evento: React.ClipboardEvent) => {
    if (!onImageSelect || disabled) return

    const elementos = evento.clipboardData?.items
    if (!elementos) return

    for (let i = 0; i < elementos.length; i++) {
      const elemento = elementos[i]
      
      if (elemento.type.startsWith('image/')) {
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
    if (archivo.type.startsWith('image/')) {
      await procesarArchivoImagen(archivo)
    }
  }

  useEffect(() => {
    const manejarPegarGlobal = async (evento: ClipboardEvent) => {
      const elementoActivo = document.activeElement
      const estaEntradaEnfocada = elementoActivo === refEntrada.current
      const ningunElementoEnfocado = !elementoActivo || elementoActivo === document.body
      
      if (!estaEntradaEnfocada && !ningunElementoEnfocado) return
      if (!onImageSelect || disabled) return

      const elementos = evento.clipboardData?.items
      if (!elementos) return

      for (let i = 0; i < elementos.length; i++) {
        const elemento = elementos[i]
        
        if (elemento.type.startsWith('image/')) {
          evento.preventDefault()
          const archivo = elemento.getAsFile()
          if (archivo) {
            await procesarArchivoImagen(archivo)
          }
          break
        }
      }
    }

    document.addEventListener('paste', manejarPegarGlobal)
    return () => document.removeEventListener('paste', manejarPegarGlobal)
  }, [onImageSelect, disabled])

  return (
    <div className="w-full bg-background/95 backdrop-blur-sm border-t">
      <div className="mx-auto w-full max-w-4xl p-3 md:p-4">
        <div 
          className={`w-full space-y-3 transition-colors ${
            estaArrastrando ? 'bg-accent/50 rounded-lg p-2' : ''
          }`}
          onDragOver={manejarArrastrarSobre}
          onDragLeave={manejarArrastrarFuera}
          onDrop={manejarSoltar}
        >
          {estaArrastrando && (
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-primary/50 rounded-lg bg-primary/5">
              <div className="text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-primary/70 mb-2" />
                <p className="text-sm text-primary/70 font-medium">Suelta la imagen aquí</p>
              </div>
            </div>
          )}

          {selectedImage && !estaArrastrando && (
            <div className="flex justify-start">
              <div className="relative">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-card">
                  <Image
                    src={selectedImage}
                    alt="Imagen seleccionada"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                  onClick={manejarEliminarImagen}
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
          <form onSubmit={onSubmit} className="w-full">
            <div className="relative flex items-center">
              <Input
                ref={refEntrada}
                placeholder={
                  estaArrastrando 
                    ? "Suelta la imagen aquí..." 
                    : selectedImage 
                      ? "Pregunta sobre la imagen..." 
                      : "Escribe tu mensaje"
                }
                className="w-full h-12 pl-12 pr-12 rounded-full border bg-card shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPaste={manejarPegar}
                disabled={disabled}
              />
              
              {onImageSelect && (
                <>
                  <input
                    ref={refEntradaArchivo}
                    type="file"
                    accept="image/*"
                    onChange={manejarSeleccionArchivo}
                    className="hidden"
                    disabled={disabled || estaCargando}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute left-1 size-10 rounded-full shrink-0 hover:bg-accent"
                    onClick={manejarClicBotonImagen}
                    disabled={disabled || estaCargando}
                    title="Adjuntar imagen (o pega desde el portapapeles)"
                  >
                    <ImageIcon className="size-4 text-muted-foreground" />
                  </Button>
                </>
              )}
              
              <Button 
                type="submit" 
                size="icon" 
                aria-label="Enviar" 
                disabled={disabled || !tieneContenido}
                className="absolute right-1 size-10 rounded-full shrink-0"
              >
                <SendHorizonal className="size-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export { CompositorChat as ChatComposer }
