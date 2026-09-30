/**
 * Hook de React para chat con soporte de imágenes y streaming.
 */
"use client"
import { useState, useCallback, useRef } from "react"
import { Mensaje, ContenidoTexto, ContenidoImagen } from "@/CapaDatos/tipos/mensaje"
import { useConfiguracionProveedorIA } from "@/CapaNegocio/contextos/contexto-proveedor-ia"

interface UsarChatConImagenesRetorno {
  mensajes: Mensaje[]
  entrada: string
  establecerEntrada: (entrada: string) => void
  imagenSeleccionada: string | null
  establecerImagenSeleccionada: (imagen: string | null) => void
  estaCargando: boolean
  establecerEstaCargando: (cargando: boolean) => void
  enviar: () => Promise<void>
  detener: () => void
  regenerar: () => Promise<void>
}

export function useUsarChatConImagenes(): UsarChatConImagenesRetorno {
  const { obtenerPayloadSolicitud } = useConfiguracionProveedorIA()
  const [mensajes, establecerMensajes] = useState<Mensaje[]>([])
  const [entrada, establecerEntrada] = useState("")
  const [imagenSeleccionada, establecerImagenSeleccionada] = useState<string | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(false)
  const [controladorAborto, establecerControladorAborto] = useState<AbortController | null>(null)
  const controladorAbortoRef = useRef<AbortController | null>(null)

  const detener = useCallback(() => {
    if (controladorAbortoRef.current) {
      controladorAbortoRef.current.abort()
      controladorAbortoRef.current = null
    }
    if (controladorAborto) {
      controladorAborto.abort()
      establecerControladorAborto(null)
    }
    establecerEstaCargando(false)
  }, [controladorAborto])

  const enviar = useCallback(async () => {
    if ((!entrada.trim() && !imagenSeleccionada) || estaCargando) return

    const controller = new AbortController()
    controladorAbortoRef.current = controller
    establecerControladorAborto(controller)
    establecerEstaCargando(true)

    const contenidoMensaje: (ContenidoTexto | ContenidoImagen)[] = []
    
    if (entrada.trim()) {
      contenidoMensaje.push({ type: "text", text: entrada.trim() })
    }
    
    if (imagenSeleccionada) {
      contenidoMensaje.push({ type: "image", image: imagenSeleccionada })
    }

    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      role: "user",
      content: contenidoMensaje.length === 1 && contenidoMensaje[0].type === "text" 
        ? contenidoMensaje[0].text 
        : contenidoMensaje,
      timestamp: new Date()
    }

    establecerMensajes(prev => [...prev, mensajeUsuario])

    establecerEntrada("")
    establecerImagenSeleccionada(null)

    const payloadIA = obtenerPayloadSolicitud()

    try {
      const respuesta = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...mensajes, mensajeUsuario].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          customProvider: payloadIA.customProvider,
          model: payloadIA.model,
        }),
        signal: controller.signal,
      })

      if (!respuesta.ok) {
        throw new Error(`Error HTTP! estado: ${respuesta.status}`)
      }

      const mensajeAsistente: Mensaje = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date()
      }

      establecerMensajes(prev => [...prev, mensajeAsistente])

      const lector = respuesta.body?.getReader()
      const decodificador = new TextDecoder()

      if (lector) {
        let textoAcumulado = ""
        
        while (true) {
          const { done, value } = await lector.read()
          
          if (done) break
          
          const fragmento = decodificador.decode(value, { stream: true })
          textoAcumulado += fragmento
          
          establecerMensajes(prev => prev.map(msg => 
            msg.id === mensajeAsistente.id 
              ? { ...msg, content: textoAcumulado }
              : msg
          ))
        }

        const fragmentoFinal = decodificador.decode()
        if (fragmentoFinal) {
          textoAcumulado += fragmentoFinal
        }

        if (!textoAcumulado.trim()) {
          const avisoVacio = "Lo siento, el proveedor de IA no devolvió ninguna respuesta. Verifica la configuración de tu modelo o las credenciales de la API."
          establecerMensajes(prev => prev.map(msg =>
            msg.id === mensajeAsistente.id
              ? { ...msg, content: avisoVacio }
              : msg
          ))
        }
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Solicitud abortada')
      } else {
        console.error("Error al enviar mensaje:", error)
        
        const mensajeError: Mensaje = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
          timestamp: new Date()
        }
        
        establecerMensajes(prev => [...prev, mensajeError])
      }
    } finally {
      establecerEstaCargando(false)
      establecerControladorAborto(null)
      controladorAbortoRef.current = null
    }
  }, [entrada, imagenSeleccionada, mensajes, estaCargando, obtenerPayloadSolicitud])

  const regenerar = useCallback(async () => {
    // Si no hay mensajes o está cargando, retornar
    if (mensajes.length === 0 || estaCargando) return

    // Si el último mensaje es del asistente, removerlo de la lista
    let mensajesBase = [...mensajes]
    if (mensajesBase[mensajesBase.length - 1].role === "assistant") {
      mensajesBase = mensajesBase.slice(0, -1)
    }

    if (mensajesBase.length === 0) return

    // Tomar el último mensaje del usuario
    const ultimoUsuario = [...mensajesBase].reverse().find(m => m.role === "user")
    if (!ultimoUsuario) return

    const controller = new AbortController()
    controladorAbortoRef.current = controller
    establecerControladorAborto(controller)
    establecerEstaCargando(true)

    const mensajeAsistente: Mensaje = {
      id: Date.now().toString(),
      role: "assistant",
      content: "",
      timestamp: new Date()
    }

    establecerMensajes([...mensajesBase, mensajeAsistente])

    const payloadIA = obtenerPayloadSolicitud()

    try {
      const respuesta = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: mensajesBase.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          customProvider: payloadIA.customProvider,
          model: payloadIA.model,
        }),
        signal: controller.signal,
      })

      if (!respuesta.ok) {
        throw new Error(`Error HTTP! estado: ${respuesta.status}`)
      }

      const lector = respuesta.body?.getReader()
      const decodificador = new TextDecoder()

      if (lector) {
        let textoAcumulado = ""

        while (true) {
          const { done, value } = await lector.read()

          if (done) break

          const fragmento = decodificador.decode(value, { stream: true })
          textoAcumulado += fragmento

          establecerMensajes(prev => prev.map(msg =>
            msg.id === mensajeAsistente.id
              ? { ...msg, content: textoAcumulado }
              : msg
          ))
        }

        const fragmentoFinal = decodificador.decode()
        if (fragmentoFinal) {
          textoAcumulado += fragmentoFinal
        }

        if (!textoAcumulado.trim()) {
          const avisoVacio = "Lo siento, el proveedor de IA no devolvió ninguna respuesta. Verifica la configuración de tu modelo o las credenciales de la API."
          establecerMensajes(prev => prev.map(msg =>
            msg.id === mensajeAsistente.id
              ? { ...msg, content: avisoVacio }
              : msg
          ))
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Solicitud de regeneración abortada')
      } else {
        console.error("Error al regenerar mensaje:", error)

        const mensajeError: Mensaje = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
          timestamp: new Date()
        }

        establecerMensajes(prev => [...prev, mensajeError])
      }
    } finally {
      establecerEstaCargando(false)
      establecerControladorAborto(null)
      controladorAbortoRef.current = null
    }
  }, [mensajes, estaCargando, obtenerPayloadSolicitud])

  return {
    mensajes,
    entrada,
    establecerEntrada,
    imagenSeleccionada,
    establecerImagenSeleccionada,
    estaCargando,
    establecerEstaCargando,
    enviar,
    detener,
    regenerar
  }
}
