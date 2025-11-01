/**
 * Componente de indicador de carga para el chat.
 * - Renderiza avatar del asistente (círculo con pata de perro) + IndicadorEscritura.
 * - Usado cuando el asistente va a responder pero aún no hay contenido.
 * - Accesibilidad: aria-live="polite" y aria-atomic para screen readers.
 */
import { IndicadorEscritura } from "@/CapaPresentacion/componentes/indicador-escritura"
import { ByteIcon } from "@/CapaPresentacion/componentes/byte-icon"

export function IndicadorCarga() {
  return (
    <div className="flex items-center gap-2 justify-start" aria-live="polite" aria-atomic>
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <ByteIcon className="size-4" />
      </div>
      <IndicadorEscritura />
    </div>
  )
}

export { IndicadorCarga as LoadingIndicator }
