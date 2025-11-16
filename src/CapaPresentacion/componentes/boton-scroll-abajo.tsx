/**
 * Componente de botón para desplazarse al final del chat.
 * - Aparece cuando el usuario no está viendo los mensajes más recientes.
 * - Posicionado de forma flotante y centrada, sin tapar contenido.
 * - Accesibilidad: aria-label para screen readers.
 */
"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/CapaPresentacion/componentes/ui/boton"

interface PropiedadesBotonScrollAbajo {
  onClick: () => void
}

export function BotonScrollAbajo({ onClick }: PropiedadesBotonScrollAbajo) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className="rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 backdrop-blur-sm bg-background/80"
      aria-label="Ir al final de la conversación"
    >
      <ChevronDown className="size-4" />
    </Button>
  )
}

export { BotonScrollAbajo as ScrollToBottomButton }

