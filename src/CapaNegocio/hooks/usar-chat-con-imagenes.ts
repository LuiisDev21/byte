/**
 * Hook de React para chat con soporte de imágenes y streaming.
 */
"use client"
import { useState, useCallback } from "react"
import { Mensaje, ContenidoMensaje, ContenidoTexto, ContenidoImagen } from "@/CapaDatos/tipos/mensaje"

interface UsarChatConImagenesRetorno {
  mensajes: Mensaje[]
  entrada: string
  establecerEntrada: (entrada: string) => void
  imagenSeleccionada: string | null
  establecerImagenSeleccionada: (imagen: string | null) => void
  estaCargando: boolean
  enviar: () => Promise<void>
  detener: () => void
}

export function useUsarChatConImagenes(): UsarChatConImagenesRetorno {
  const [mensajes, establecerMensajes] = useState<Mensaje[]>([])
  const [entrada, establecerEntrada] = useState("")
  const [imagenSeleccionada, establecerImagenSeleccionada] = useState<string | null>(null)
  const [estaCargando, establecerEstaCargando] = useState(false)
  const [controladorAborto, establecerControladorAborto] = useState<AbortController | null>(null)

  const detener = useCallback(() => {
    if (controladorAborto) {
      controladorAborto.abort()
      establecerControladorAborto(null)
      establecerEstaCargando(false)
    }
  }, [controladorAborto])

  const enviar = useCallback(async () => {
    if ((!entrada.trim() && !imagenSeleccionada) || estaCargando) return

    const controller = new AbortController()
    establecerControladorAborto(controller)
    establecerEstaCargando(true)

    // Crear contenido del mensaje
    const contenidoMensaje: (ContenidoTexto | ContenidoImagen)[] = []
    
    if (entrada.trim()) {
      contenidoMensaje.push({ type: "text", text: entrada.trim() })
    }
    
    if (imagenSeleccionada) {
      contenidoMensaje.push({ type: "image", image: imagenSeleccionada })
    }

    // Crear mensaje del usuario
    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      role: "user",
      content: contenidoMensaje.length === 1 && contenidoMensaje[0].type === "text" 
        ? contenidoMensaje[0].text 
        : contenidoMensaje,
      timestamp: new Date()
    }

    // Agregar mensaje del usuario
    establecerMensajes(prev => [...prev, mensajeUsuario])

    // Limpiar entrada e imagen
    establecerEntrada("")
    establecerImagenSeleccionada(null)

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
          }))
        }),
        signal: controller.signal,
      })

      if (!respuesta.ok) {
        throw new Error(`Error HTTP! estado: ${respuesta.status}`)
      }

      // Crear mensaje del asistente
      const mensajeAsistente: Mensaje = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date()
      }

      establecerMensajes(prev => [...prev, mensajeAsistente])

      // Leer stream de respuesta
      const lector = respuesta.body?.getReader()
      const decodificador = new TextDecoder()

      if (lector) {
        let textoAcumulado = ""
        
        while (true) {
          const { done, value } = await lector.read()
          
          if (done) break
          
          const fragmento = decodificador.decode(value, { stream: true })
          textoAcumulado += fragmento
          
          // Actualizar mensaje del asistente
          establecerMensajes(prev => prev.map(msg => 
            msg.id === mensajeAsistente.id 
              ? { ...msg, content: textoAcumulado }
              : msg
          ))
        }
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Solicitud abortada')
      } else {
        console.error("Error al enviar mensaje:", error)
        
        // Agregar mensaje de error
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
    }
  }, [entrada, imagenSeleccionada, mensajes, estaCargando, controladorAborto])

  return {
    mensajes,
    entrada,
    establecerEntrada,
    imagenSeleccionada,
    establecerImagenSeleccionada,
    estaCargando,
    enviar,
    detener
  }
}
