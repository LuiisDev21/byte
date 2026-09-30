/**
 * Componente contenedor para renderizar la lista completa de mensajes del chat.
 * - Mapea array de mensajes a componentes MensajeChat individuales.
 * - Muestra IndicadorCarga cuando el asistente está respondiendo sin mensaje previo.
 * - Propaga onRegenerate y onFeedback a los componentes MensajeChat.
 */
import { MensajeChat } from "@/CapaPresentacion/componentes/mensaje-chat"
import { IndicadorCarga } from "@/CapaPresentacion/componentes/indicador-carga"
import { Mensaje } from "@/CapaDatos/tipos/mensaje"

interface PropiedadesMensajesChat {
  messages: Mensaje[]
  isLoading: boolean
  onRegenerate?: () => void
  onFeedback?: (messageId: string, feedback: "like" | "dislike") => void
}

export function MensajesChat({
  messages,
  isLoading,
  onRegenerate,
  onFeedback,
}: PropiedadesMensajesChat) {
  const ultimoMensaje = messages[messages.length - 1]
  const deberaMostrarIndicadorGlobal =
    isLoading && (!ultimoMensaje || ultimoMensaje.role !== "assistant")

  return (
    <div className="space-y-4">
      {messages.map((mensaje, indice) => (
        <MensajeChat
          key={mensaje.id || indice}
          message={mensaje}
          isLastMessage={indice === messages.length - 1}
          isLoading={isLoading}
          onRegenerate={onRegenerate}
          onFeedback={onFeedback}
        />
      ))}

      {deberaMostrarIndicadorGlobal && <IndicadorCarga />}
    </div>
  )
}

export { MensajesChat as ChatMessages }
