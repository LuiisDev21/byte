/**
 * Componente para renderizar mensajes individuales del chat con soporte multimedia.
 * - Renderizado basado en props (mensaje, esUltimoMensaje, estaCargando).
 * - MensajeChat(): contenedor principal con avatar y contenido según rol.
 * - AvatarAsistente(): círculo con pata de perro para identificar al asistente.
 * - ContenidoMensaje: delega renderizado a componente especializado según tipo de contenido.
 */
import { ContenidoMensaje } from "@/CapaPresentacion/componentes/contenido-mensaje"
import { IndicadorEscritura } from "@/CapaPresentacion/componentes/indicador-escritura"
import { Mensaje } from "@/CapaDatos/tipos/mensaje"
import Image from "next/image"

interface PropiedadesMensajeChat {
  message: Mensaje
  isLastMessage: boolean
  isLoading: boolean
}

export function MensajeChat({ message, isLastMessage, isLoading }: PropiedadesMensajeChat) {
  const esAsistente = message.role === "assistant"
  const esUsuario = message.role === "user"
  const deberaMostrarEscritura = esAsistente && isLastMessage && isLoading

  return (
    <div className={`flex items-end gap-2 ${esUsuario ? "justify-end" : "justify-start"}`}>
      {esAsistente && <AvatarAsistente />}
      
      <div className={`max-w-[85%] rounded-lg p-3 ${obtenerEstilosMensaje(esUsuario)}`}>
        {deberaMostrarEscritura && !message.content ? (
          <IndicadorEscritura />
        ) : (
          <ContenidoMensaje 
            content={message.content}
            role={message.role}
            isTyping={deberaMostrarEscritura}
          />
        )}
      </div>
    </div>
  )
}

export function AvatarAsistente() {
  return (
    <div className="relative size-8 shrink-0 rounded-full overflow-hidden">
      <Image
        src="/bytti.png"
        alt="Byte Chat Asistente"
        fill
        className="object-cover"
        sizes="32px"
      />
    </div>
  )
}

function obtenerEstilosMensaje(esUsuario: boolean): string {
  return esUsuario
    ? "bg-primary text-primary-foreground"
    : "border bg-card"
}

export { MensajeChat as ChatMessage }
