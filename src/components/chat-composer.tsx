/**
 * [LUIS] - 30/09/2025 Componente de entrada de mensajes del chat con soporte para imágenes.
 * - Estado: isLoading, isDragOver; maneja carga de archivos y drag & drop.
 * - Funciones: processImageFile(), handleFileSelect(), handlePaste(), handleDrop()
 *   para procesar imágenes desde archivo, clipboard o arrastrar.
 * - Diseño moderno: campo redondeado con botones integrados (imagen + enviar).
 * - Validación: máximo 5MB, solo imágenes, botón disabled cuando no hay contenido.
 * - API: { value, onChange, onSubmit, disabled?, selectedImage?, onImageSelect?, onImageRemove? }.
 */
"use client"
import { SendHorizonal, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export function ChatComposer({ 
  value, 
  onChange, 
  onSubmit, 
  disabled,
  selectedImage,
  onImageSelect,
  onImageRemove
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const hasContent = value.trim() || selectedImage

  const processImageFile = async (file: File) => {
    if (!onImageSelect) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB.')
      return
    }

    setIsLoading(true)
    
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageSelect(result)
        setIsLoading(false)
      }
      reader.onerror = () => {
        alert('Error al cargar la imagen')
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error al procesar la imagen')
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await processImageFile(file)
  }

  const handleImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    onImageRemove?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePaste = async (event: React.ClipboardEvent) => {
    if (!onImageSelect || disabled) return

    const items = event.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.type.startsWith('image/')) {
        event.preventDefault()
        const file = item.getAsFile()
        if (file) {
          await processImageFile(file)
        }
        break
      }
    }
  }
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    if (!onImageSelect || disabled) return

    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (file.type.startsWith('image/')) {
      await processImageFile(file)
    }
  }

  useEffect(() => {
    const handleGlobalPaste = async (event: ClipboardEvent) => {
      const activeElement = document.activeElement
      const isInputFocused = activeElement === inputRef.current
      const isNoElementFocused = !activeElement || activeElement === document.body
      
      if (!isInputFocused && !isNoElementFocused) return
      if (!onImageSelect || disabled) return

      const items = event.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        
        if (item.type.startsWith('image/')) {
          event.preventDefault()
          const file = item.getAsFile()
          if (file) {
            await processImageFile(file)
          }
          break
        }
      }
    }

    document.addEventListener('paste', handleGlobalPaste)
    return () => document.removeEventListener('paste', handleGlobalPaste)
  }, [onImageSelect, disabled])

  return (
    <div className="w-full bg-background/95 backdrop-blur-sm border-t">
      <div className="mx-auto w-full max-w-4xl p-3 md:p-4">
        <div 
          className={`w-full space-y-3 transition-colors ${
            isDragOver ? 'bg-accent/50 rounded-lg p-2' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragOver && (
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-primary/50 rounded-lg bg-primary/5">
              <div className="text-center">
                <ImageIcon className="mx-auto h-8 w-8 text-primary/70 mb-2" />
                <p className="text-sm text-primary/70 font-medium">Suelta la imagen aquí</p>
              </div>
            </div>
          )}

          {selectedImage && !isDragOver && (
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
                  onClick={handleRemoveImage}
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
                ref={inputRef}
                placeholder={
                  isDragOver 
                    ? "Suelta la imagen aquí..." 
                    : selectedImage 
                      ? "Pregunta sobre la imagen..." 
                      : "Escribe tu mensaje o pega una imagen..."
                }
                className="w-full h-12 pl-12 pr-12 rounded-full border bg-card shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPaste={handlePaste}
                disabled={disabled}
              />
              
              {onImageSelect && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={disabled || isLoading}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute left-1 size-10 rounded-full shrink-0 hover:bg-accent"
                    onClick={handleImageButtonClick}
                    disabled={disabled || isLoading}
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
                disabled={disabled || !hasContent}
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
