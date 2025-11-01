/**
 * Componente de modal para confirmar la eliminación de una conversación.
 */
"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"
import { Card } from "@/CapaPresentacion/componentes/ui/card"

interface PropiedadesModalEliminarConversacion {
  abierto: boolean
  tituloConversacion: string
  onConfirmar: () => void
  onCancelar: () => void
}

export function ModalEliminarConversacion({
  abierto,
  tituloConversacion,
  onConfirmar,
  onCancelar
}: PropiedadesModalEliminarConversacion) {
  useEffect(() => {
    const manejarEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && abierto) {
        onCancelar()
      }
    }

    if (abierto) {
      document.addEventListener("keydown", manejarEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", manejarEscape)
      document.body.style.overflow = ""
    }
  }, [abierto, onCancelar])

  if (!abierto || typeof window === "undefined") return null

  const contenidoModal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCancelar}
    >
      <Card
        className="w-full max-w-md mx-4 p-6 shadow-lg animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center size-10 rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2">Eliminar conversación</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ¿Estás seguro de que deseas eliminar la conversación{" "}
              <span className="font-medium text-foreground">
                {tituloConversacion}
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={onCancelar}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirmar}
              >
                Eliminar
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-6 shrink-0"
            onClick={onCancelar}
          >
            <X className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  )

  return createPortal(contenidoModal, document.body)
}

export { ModalEliminarConversacion as DeleteConversationModal }

