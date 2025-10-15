"use client"
import { useRef } from "react"
import { EstadoVacio } from "@/CapaPresentacion/componentes/estado-vacio"
import { CompositorChat } from "@/CapaPresentacion/componentes/compositor-chat"
import { MensajesChat } from "@/CapaPresentacion/componentes/mensajes-chat"
import { useUsarChatConImagenes } from "@/CapaNegocio/hooks/usar-chat-con-imagenes"
import { useUsarDesplazamientoAutomatico } from "@/CapaNegocio/hooks/usar-desplazamiento-automatico"

export default function PaginaInicio() {
  const chat = useUsarChatConImagenes()
  const refContenedorChat = useRef<HTMLDivElement>(null)
  const tieneMensajes = chat.mensajes.length > 0
  const ultimoMensaje = tieneMensajes ? chat.mensajes[chat.mensajes.length - 1] : null

  useUsarDesplazamientoAutomatico(
    tieneMensajes,
    chat.mensajes.length,
    chat.estaCargando,
    typeof ultimoMensaje?.content === "string" ? ultimoMensaje.content : ""
  )

  const manejarEnvio: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    chat.enviar()
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div
          ref={refContenedorChat}
          className="mx-auto w-full max-w-4xl px-3 md:px-4 py-4 md:py-6 pb-6"
        >
          {tieneMensajes ? (
            <MensajesChat messages={chat.mensajes} isLoading={chat.estaCargando} />
          ) : (
            <EstadoVacio />
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <CompositorChat
          value={chat.entrada}
          onChange={chat.establecerEntrada}
          onSubmit={manejarEnvio}
          disabled={chat.estaCargando}
          selectedImage={chat.imagenSeleccionada}
          onImageSelect={chat.establecerImagenSeleccionada}
          onImageRemove={() => chat.establecerImagenSeleccionada(null)}
        />
      </div>
    </div>
  )
}
