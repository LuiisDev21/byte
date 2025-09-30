"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    onImageSelect: (imageData: string) => void
    onImageRemove: () => void
    selectedImage?: string
    disabled?: boolean
}

export function ImageUpload({ onImageSelect, onImageRemove, selectedImage, disabled }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida')
            return
        }

        // Validar tamaño (máximo 5MB)
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

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleRemoveImage = () => {
        onImageRemove()
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="flex items-center gap-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || isLoading}
            />

            {selectedImage ? (
                <div className="relative">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                        <Image
                            src={selectedImage}
                            alt="Imagen seleccionada"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                        onClick={handleRemoveImage}
                        disabled={disabled}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleButtonClick}
                    disabled={disabled || isLoading}
                    title="Adjuntar imagen"
                >
                    <ImageIcon className="w-4 h-4" />
                </Button>
            )}
        </div>
    )
}