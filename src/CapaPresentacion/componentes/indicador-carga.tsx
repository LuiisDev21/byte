/**
 * Componente de indicador de carga para el chat.
 * - Renderiza avatar del asistente (círculo con pata de perro) + IndicadorEscritura.
 * - Usado cuando el asistente va a responder pero aún no hay contenido.
 * - Accesibilidad: aria-live="polite" y aria-atomic para screen readers.
 */
import { IndicadorEscritura } from "@/CapaPresentacion/componentes/indicador-escritura"
import { AvatarAsistente } from "@/CapaPresentacion/componentes/mensaje-chat"

export function IndicadorCarga() {
  return (
    <div className="flex items-center gap-2 justify-start" aria-live="polite" aria-atomic>
      <AvatarAsistente />
      <div className="max-w-[85%] rounded-lg p-3 border bg-card">
        <IndicadorEscritura />
      </div>
    </div>
  )
}

export { IndicadorCarga as LoadingIndicator }
