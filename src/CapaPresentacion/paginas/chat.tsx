"use client"

import { useRef, useEffect, useState, useCallback } from "react"
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
import { useConfiguracionProveedorIA } from "@/CapaNegocio/contextos/contexto-proveedor-ia"
import type { ContenidoMensaje, Mensaje } from "@/CapaDatos/tipos/mensaje"

export default function PaginaChat() {
  const params = useParams()
  const { usuario } = useAutenticacion()
  const { establecerConversacionActual, conversacionActual, crearNuevaConversacion, conversaciones, actualizarTitulo } = useConversaciones()
  const chatLocal = useUsarChatConImagenes()
  const chatPersistente = useChatPersistente()
  const { obtenerPayloadSolicitud } = useConfiguracionProveedorIA()
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

  // Detección de scroll inteligente con umbral de 150px
  useEffect(() => {
    const contenedor = refContenedorScroll.current
    if (!contenedor) return

    const verificarPosicionScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contenedor
      const distanciaDelFondo = scrollHeight - scrollTop - clientHeight
      const cercaDelFondo = distanciaDelFondo <= 150
      
      establecerMostrarBotonScroll(prev => (prev !== !cercaDelFondo ? !cercaDelFondo : prev))
      establecerAutoScrollHabilitado(prev => (prev !== cercaDelFondo ? cercaDelFondo : prev))
    }

    contenedor.addEventListener("scroll", verificarPosicionScroll, { passive: true })
    verificarPosicionScroll()

    return () => {
      contenedor.removeEventListener("scroll", verificarPosicionScroll)
    }
  }, [])

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
      establecerAutoScrollHabilitado(true)
      establecerMostrarBotonScroll(false)
      refContenedorScroll.current.scrollTo({
        top: refContenedorScroll.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }

  const manejarPreguntaRapida = (pregunta: string) => {
    chatLocal.establecerEntrada(pregunta)
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) {
        form.requestSubmit()
      }
    }, 100)
  }

  // Parada inmediata de streaming según modo anónimo o autenticado
  const manejarParada = useCallback(() => {
    if (usuario) {
      chatPersistente.detener()
      chatLocal.establecerEstaCargando(false)
    } else {
      chatLocal.detener()
    }
  }, [usuario, chatPersistente, chatLocal])

  // Lógica de regeneración de respuesta
  const manejarRegeneracion = useCallback(async () => {
    if (chatLocal.estaCargando) return

    if (usuario) {
      if (chatPersistente.mensajes.length === 0) return

      const mensajesActuales = [...chatPersistente.mensajes]
      const ultimoMsg = mensajesActuales[mensajesActuales.length - 1]

      if (ultimoMsg && ultimoMsg.role === "assistant") {
        await chatPersistente.eliminarUltimoMensajeAsistente()
        mensajesActuales.pop()
      }

      if (mensajesActuales.length === 0) return

      const ultimoUsuario = [...mensajesActuales].reverse().find(m => m.role === "user")
      if (!ultimoUsuario) return

      chatLocal.establecerEstaCargando(true)
      const controlador = chatPersistente.crearControladorAborto()

      const idMensajeAsistente = (Date.now() + 1).toString()
      const mensajeAsistenteInicial: Mensaje = {
        id: idMensajeAsistente,
        role: "assistant",
        content: "",
        timestamp: new Date()
      }

      chatPersistente.establecerMensajes(prev => [...prev, mensajeAsistenteInicial])
      let respuestaAcumulada = ""

      const payloadIA = obtenerPayloadSolicitud()

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: mensajesActuales,
            customProvider: payloadIA.customProvider,
            model: payloadIA.model,
          }),
          signal: controlador.signal,
        })

        if (!response.ok) throw new Error("Error en la respuesta")
        if (!response.body) throw new Error("La respuesta no contiene un cuerpo de streaming")

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

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

        if (!respuestaAcumulada.trim()) {
          const avisoVacio = "Lo siento, el proveedor de IA no devolvió ninguna respuesta. Verifica la configuración de tu modelo o las credenciales de la API."
          chatPersistente.establecerMensajes(prev => prev.map(msg =>
            msg.id === idMensajeAsistente
              ? { ...msg, content: avisoVacio }
              : msg
          ))
        } else if (conversacionActual) {
          const { guardarMensaje } = await import("@/CapaDatos/repositorios/mensajes")
          const dataGuardada = await guardarMensaje(conversacionActual, "assistant", respuestaAcumulada)
          if (dataGuardada?.id) {
            chatPersistente.establecerMensajes(prev => prev.map(msg =>
              msg.id === idMensajeAsistente ? { ...msg, id: dataGuardada.id } : msg
            ))
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Regeneración abortada por el usuario")
        } else {
          console.error("Error al regenerar respuesta:", error)
          const errorMsg = error instanceof Error ? error.message : "Error desconocido"
          chatPersistente.establecerMensajes(prev => prev.map(msg =>
            msg.id === idMensajeAsistente
              ? { ...msg, content: `⚠️ Error de conexión: ${errorMsg}. Intenta de nuevo.` }
              : msg
          ))
        }
      } finally {
        chatLocal.establecerEstaCargando(false)
      }
    } else {
      await chatLocal.regenerar()
    }
  }, [chatLocal, usuario, chatPersistente, conversacionActual, obtenerPayloadSolicitud])

  const manejarEnvio: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (usuario) {
      let idMensajeAsistente: string | null = null
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

        const mensajeUsuario: Mensaje = {
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

        const controlador = chatPersistente.crearControladorAborto()

        const payloadIA = obtenerPayloadSolicitud()

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...chatPersistente.mensajes, mensajeUsuario],
            customProvider: payloadIA.customProvider,
            model: payloadIA.model,
          }),
          signal: controlador.signal,
        })

        if (!response.ok) throw new Error("Error en la respuesta")

        if (!response.body) {
          throw new Error("La respuesta no contiene un cuerpo válido para streaming")
        }

        idMensajeAsistente = (Date.now() + 1).toString()
        const mensajeAsistenteInicial: Mensaje = {
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

        if (!respuestaAcumulada.trim()) {
          const avisoVacio = "Lo siento, el proveedor de IA no devolvió ninguna respuesta. Verifica la configuración de tu modelo o las credenciales de la API."
          chatPersistente.establecerMensajes(prev => prev.map(msg =>
            msg.id === idMensajeAsistente
              ? { ...msg, content: avisoVacio }
              : msg
          ))
        } else {
          const dataAsistente = await guardarMensaje(idConversacion, "assistant", respuestaAcumulada)
          if (dataAsistente?.id) {
            chatPersistente.establecerMensajes(prev => prev.map(msg =>
              msg.id === idMensajeAsistente ? { ...msg, id: dataAsistente.id } : msg
            ))
          }
        }

        const conversacion = conversaciones.find(c => c.id === idConversacion)
        if (conversacion && conversacion.titulo === "Nueva conversación") {
          const extraerTexto = (contenido: ContenidoMensaje): string => {
            if (typeof contenido === "string") {
              return contenido.trim()
            }
            if (Array.isArray(contenido)) {
              const textoPartes = contenido
                .filter((parte): parte is { type: "text"; text: string } => parte.type === "text" && typeof parte.text === "string")
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
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Generación abortada por el usuario")
        } else {
          console.error("Error:", error)
          const errorMsg = error instanceof Error ? error.message : "Error desconocido"
          if (idMensajeAsistente) {
            chatPersistente.establecerMensajes(prev => prev.map(msg =>
              msg.id === idMensajeAsistente
                ? { ...msg, content: `⚠️ Error al procesar solicitud: ${errorMsg}. Por favor intenta de nuevo.` }
                : msg
            ))
          }
        }
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
            <MensajesChat
              messages={chat.mensajes}
              isLoading={chatLocal.estaCargando}
              onRegenerate={manejarRegeneracion}
            />
          ) : (
            <EstadoVacio onPreguntaClick={manejarPreguntaRapida} />
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
          disabled={false}
          isLoading={chatLocal.estaCargando}
          onStop={manejarParada}
          selectedImage={chatLocal.imagenSeleccionada}
          onImageSelect={chatLocal.establecerImagenSeleccionada}
          onImageRemove={() => chatLocal.establecerImagenSeleccionada(null)}
        />
      </div>
    </div>
  )
}
