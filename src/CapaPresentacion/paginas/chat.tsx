"use client"

import { useRef, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { EstadoVacio } from "@/CapaPresentacion/componentes/estado-vacio"
import { CompositorChat } from "@/CapaPresentacion/componentes/compositor-chat"
import { MensajesChat } from "@/CapaPresentacion/componentes/mensajes-chat"
import { BotonScrollAbajo } from "@/CapaPresentacion/componentes/boton-scroll-abajo"
import { useUsarChatConImagenes } from "@/CapaNegocio/hooks/usar-chat-con-imagenes"
import { useUsarDesplazamientoAutomatico } from "@/CapaNegocio/hooks/usar-desplazamiento-automatico"
import { useConversaciones } from "@/CapaNegocio/contextos/contexto-conversaciones"
import { useAutenticacion } from "@/CapaNegocio/contextos/contexto-autenticacion"
import { useChatPersistente } from "@/CapaNegocio/hooks/usar-chat-persistente"

export default function PaginaChat() {
  const params = useParams()
  const { usuario } = useAutenticacion()
  const { establecerConversacionActual, conversacionActual, crearNuevaConversacion, conversaciones, actualizarTitulo } = useConversaciones()
  const chatLocal = useUsarChatConImagenes()
  const chatPersistente = useChatPersistente()
  const refContenedorChat = useRef<HTMLDivElement>(null)
  const refContenedorScroll = useRef<HTMLDivElement>(null)
  const [mostrarBotonScroll, establecerMostrarBotonScroll] = useState(false)
  const [autoScrollHabilitado, establecerAutoScrollHabilitado] = useState(true)

  const chat = usuario ? chatPersistente : chatLocal
  const tieneMensajes = chat.mensajes.length > 0
  const ultimoMensaje = tieneMensajes ? chat.mensajes[chat.mensajes.length - 1] : null
  
  const contenidoUltimoMensaje = ultimoMensaje 
    ? (typeof ultimoMensaje.content === "string" 
        ? ultimoMensaje.content 
        : Array.isArray(ultimoMensaje.content)
        ? ultimoMensaje.content.map(item => item.type === "text" ? item.text : "").join("")
        : "")
    : ""

  useEffect(() => {
    if (params?.id && typeof params.id === "string" && usuario) {
      establecerConversacionActual(params.id)
    } else if (!params?.id && usuario) {
      establecerConversacionActual(null)
    }
  }, [params?.id, usuario, establecerConversacionActual])

  useEffect(() => {
    const contenedor = refContenedorScroll.current
    if (!contenedor) return

    const verificarPosicionScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contenedor
      const estaAlFinal = scrollHeight - scrollTop - clientHeight < 100
      establecerMostrarBotonScroll(!estaAlFinal)
      establecerAutoScrollHabilitado(estaAlFinal)
    }

    contenedor.addEventListener("scroll", verificarPosicionScroll)
    verificarPosicionScroll()

    return () => {
      contenedor.removeEventListener("scroll", verificarPosicionScroll)
    }
  }, [chat.mensajes.length, chatLocal.estaCargando])

  useUsarDesplazamientoAutomatico(
    refContenedorScroll,
    tieneMensajes,
    chat.mensajes.length,
    chatLocal.estaCargando,
    contenidoUltimoMensaje,
    autoScrollHabilitado
  )

  const scrollAlFinal = () => {
    if (refContenedorScroll.current) {
      const contenedor = refContenedorScroll.current
      const destino = contenedor.scrollHeight
      const inicio = contenedor.scrollTop
      const distancia = destino - inicio
      const duracion = Math.min(800, Math.max(300, distancia * 0.5))
      const inicioTiempo = performance.now()

      const animarScroll = (tiempoActual: number) => {
        const tiempoTranscurrido = tiempoActual - inicioTiempo
        const progreso = Math.min(tiempoTranscurrido / duracion, 1)
        
        const facilidad = 1 - Math.pow(1 - progreso, 3)
        
        contenedor.scrollTop = inicio + (distancia * facilidad)

        if (progreso < 1) {
          requestAnimationFrame(animarScroll)
        } else {
          establecerAutoScrollHabilitado(true)
        }
      }

      requestAnimationFrame(animarScroll)
    }
  }

  const manejarEnvio: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    if (usuario) {
      try {
        const entradaTexto = chatLocal.entrada
        const imagenActual = chatLocal.imagenSeleccionada
        
        chatLocal.establecerEntrada("")
        chatLocal.establecerImagenSeleccionada(null)
        chatLocal.establecerEstaCargando(true)

        let idConversacion = conversacionActual
        const contenidoMensaje: Array<{ type: "text"; text: string } | { type: "image"; image: string }> = []
        
        if (entradaTexto.trim()) {
          contenidoMensaje.push({ type: "text" as const, text: entradaTexto.trim() })
        }
        
        if (imagenActual) {
          contenidoMensaje.push({ type: "image" as const, image: imagenActual })
        }

        if (!idConversacion) {
          const textoMensaje = entradaTexto.trim().slice(0, 50)
          
          idConversacion = await crearNuevaConversacion()
          establecerConversacionActual(idConversacion)
          
          if (textoMensaje) {
            await actualizarTitulo(idConversacion, textoMensaje)
          }
          
          window.history.pushState({}, "", `/chat/${idConversacion}`)
        }
        
        const mensajeUsuario: import("@/CapaDatos/tipos/mensaje").Mensaje = {
          id: Date.now().toString(),
          role: "user" as const,
          content: contenidoMensaje.length === 1 && contenidoMensaje[0].type === "text"
            ? contenidoMensaje[0].text
            : contenidoMensaje.length > 0
            ? contenidoMensaje
            : entradaTexto,
          timestamp: new Date()
        }
        
        const { guardarMensaje } = await import("@/CapaDatos/repositorios/mensajes")
        await guardarMensaje(idConversacion, "user", mensajeUsuario.content)
        
        chatPersistente.establecerMensajes(prev => [...prev, mensajeUsuario])

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...chatPersistente.mensajes, mensajeUsuario],
          })
        })

        if (!response.ok) throw new Error("Error en la respuesta")

        if (!response.body) {
          throw new Error("La respuesta no contiene un cuerpo válido para streaming")
        }

        const idMensajeAsistente = (Date.now() + 1).toString()
        const mensajeAsistenteInicial: import("@/CapaDatos/tipos/mensaje").Mensaje = {
          id: idMensajeAsistente,
          role: "assistant",
          content: "",
          timestamp: new Date()
        }
        
        chatPersistente.establecerMensajes(prev => [...prev, mensajeAsistenteInicial])

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let respuestaAcumulada = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            if (value) {
              const chunk = decoder.decode(value, { stream: true })
              respuestaAcumulada += chunk
              
              chatPersistente.establecerMensajes(prev => prev.map(msg => 
                msg.id === idMensajeAsistente 
                  ? { ...msg, content: respuestaAcumulada }
                  : msg
              ))
            }
          }
          
          const chunkFinal = decoder.decode()
          if (chunkFinal) {
            respuestaAcumulada += chunkFinal
            chatPersistente.establecerMensajes(prev => prev.map(msg => 
              msg.id === idMensajeAsistente 
                ? { ...msg, content: respuestaAcumulada }
                : msg
            ))
          }
        } finally {
          reader.releaseLock()
        }
        
        await guardarMensaje(idConversacion, "assistant", respuestaAcumulada)

        const conversacion = conversaciones.find(c => c.id === idConversacion)
        if (conversacion && conversacion.titulo === "Nueva conversación") {
          const extraerTexto = (contenido: any): string => {
            if (typeof contenido === "string") {
              return contenido.trim()
            }
            if (Array.isArray(contenido)) {
              const textoPartes = contenido
                .filter(parte => parte.type === "text" && typeof parte.text === "string")
                .map(parte => parte.text.trim())
                .join(" ")
              return textoPartes
            }
            return ""
          }

          const textoUsuario = extraerTexto(mensajeUsuario.content)
          const textoAsistente = respuestaAcumulada.trim()
          
          let nuevoTitulo = "Nueva conversación"
          if (textoUsuario) {
            nuevoTitulo = textoUsuario.slice(0, 50)
          } else if (textoAsistente) {
            nuevoTitulo = textoAsistente.slice(0, 50)
          }

          if (nuevoTitulo && nuevoTitulo !== "Nueva conversación") {
            await actualizarTitulo(idConversacion, nuevoTitulo)
          }
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        chatLocal.establecerEstaCargando(false)
      }
    } else {
      chatLocal.enviar()
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div ref={refContenedorScroll} className="flex-1 overflow-y-auto">
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

      <div className="flex-shrink-0 relative">
        {mostrarBotonScroll && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 -top-12 z-10 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="pointer-events-auto">
              <BotonScrollAbajo onClick={scrollAlFinal} />
            </div>
          </div>
        )}
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
