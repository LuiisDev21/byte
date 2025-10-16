"use client"

import { useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { EstadoVacio } from "@/CapaPresentacion/componentes/estado-vacio"
import { CompositorChat } from "@/CapaPresentacion/componentes/compositor-chat"
import { MensajesChat } from "@/CapaPresentacion/componentes/mensajes-chat"
import { useUsarChatConImagenes } from "@/CapaNegocio/hooks/usar-chat-con-imagenes"
import { useUsarDesplazamientoAutomatico } from "@/CapaNegocio/hooks/usar-desplazamiento-automatico"
import { useConversaciones } from "@/CapaNegocio/contextos/contexto-conversaciones"
import { useAutenticacion } from "@/CapaNegocio/contextos/contexto-autenticacion"
import { useChatPersistente } from "@/CapaNegocio/hooks/usar-chat-persistente"

export default function PaginaChat() {
  const params = useParams()
  const { usuario } = useAutenticacion()
  const { establecerConversacionActual, conversacionActual, crearNuevaConversacion } = useConversaciones()
  const chatLocal = useUsarChatConImagenes()
  const chatPersistente = useChatPersistente()
  const refContenedorChat = useRef<HTMLDivElement>(null)

  // Usar chat persistente si hay usuario, sino usar local
  const chat = usuario ? chatPersistente : chatLocal
  const tieneMensajes = chat.mensajes.length > 0
  const ultimoMensaje = tieneMensajes ? chat.mensajes[chat.mensajes.length - 1] : null

  // Establecer conversación actual si hay ID en la URL
  useEffect(() => {
    if (params?.id && typeof params.id === "string" && usuario) {
      establecerConversacionActual(params.id)
    } else if (!params?.id && usuario) {
      // Si no hay ID en la URL, limpiar conversación actual
      establecerConversacionActual(null)
    }
  }, [params?.id, usuario, establecerConversacionActual])

  useUsarDesplazamientoAutomatico(
    tieneMensajes,
    chat.mensajes.length,
    chatLocal.estaCargando,
    typeof ultimoMensaje?.content === "string" ? ultimoMensaje.content : ""
  )

  const manejarEnvio: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    if (usuario) {
      try {
        // Guardar entrada antes de limpiarla
        const entradaTexto = chatLocal.entrada
        const imagenActual = chatLocal.imagenSeleccionada
        
        // Limpiar entrada inmediatamente
        chatLocal.establecerEntrada("")
        chatLocal.establecerImagenSeleccionada(null)
        chatLocal.establecerEstaCargando(true)

        // Si no hay conversación activa, crear una nueva
        let idConversacion = conversacionActual
        if (!idConversacion) {
          // Obtener el texto del mensaje para el título
          const textoMensaje = entradaTexto.trim().slice(0, 50) || "Nueva conversación"
          
          idConversacion = await crearNuevaConversacion()
          establecerConversacionActual(idConversacion)
          
          // Actualizar el título con el primer mensaje
          if (textoMensaje !== "Nueva conversación") {
            const { actualizarTituloConversacion } = await import("@/CapaDatos/repositorios/conversaciones")
            await actualizarTituloConversacion(idConversacion, textoMensaje)
          }
          
          // Navegar a la nueva conversación
          window.history.pushState({}, "", `/chat/${idConversacion}`)
        }

        // Crear mensaje del usuario
        const mensajeUsuario: import("@/CapaDatos/tipos/mensaje").Mensaje = {
          id: Date.now().toString(),
          role: "user" as const,
          content: imagenActual 
            ? [
                { type: "text" as const, text: entradaTexto },
                { type: "image" as const, image: imagenActual }
              ]
            : entradaTexto,
          timestamp: new Date()
        }
        
        // Guardar mensaje del usuario en BD
        const { guardarMensaje } = await import("@/CapaDatos/repositorios/mensajes")
        await guardarMensaje(idConversacion, "user", mensajeUsuario.content)
        
        // Agregar a la UI
        chatPersistente.establecerMensajes(prev => [...prev, mensajeUsuario])

        // Enviar a la API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...chatPersistente.mensajes, mensajeUsuario],
          })
        })

        if (!response.ok) throw new Error("Error en la respuesta")

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let respuestaCompleta = ""

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value)
            respuestaCompleta += chunk
          }
        }

        // Crear mensaje del asistente
        const mensajeAsistente: import("@/CapaDatos/tipos/mensaje").Mensaje = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: respuestaCompleta,
          timestamp: new Date()
        }
        
        // Guardar mensaje del asistente en BD
        await guardarMensaje(idConversacion, "assistant", mensajeAsistente.content)
        
        // Agregar a la UI
        chatPersistente.establecerMensajes(prev => [...prev, mensajeAsistente])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        chatLocal.establecerEstaCargando(false)
      }
    } else {
      // Modo sin autenticación - usar chat local
      chatLocal.enviar()
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div
          ref={refContenedorChat}
          className="mx-auto w-full max-w-4xl px-3 md:px-4 py-4 md:py-6 pb-6"
        >
          {tieneMensajes ? (
            <MensajesChat messages={chat.mensajes} isLoading={chatLocal.estaCargando} />
          ) : (
            <EstadoVacio />
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <CompositorChat
          value={chatLocal.entrada}
          onChange={chatLocal.establecerEntrada}
          onSubmit={manejarEnvio}
          disabled={chatLocal.estaCargando}
          selectedImage={chatLocal.imagenSeleccionada}
          onImageSelect={chatLocal.establecerImagenSeleccionada}
          onImageRemove={() => chatLocal.establecerImagenSeleccionada(null)}
        />
      </div>
    </div>
  )
}
