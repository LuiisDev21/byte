import { useState, useCallback, useEffect } from "react"
import { guardarMensaje, obtenerMensajes } from "@/CapaDatos/repositorios/mensajes"
import { useConversaciones } from "@/CapaNegocio/contextos/contexto-conversaciones"
import { useAutenticacion } from "@/CapaNegocio/contextos/contexto-autenticacion"
import type { ContenidoMensaje, Mensaje } from "@/CapaDatos/tipos/mensaje"

export function useChatPersistente() {
  const { usuario } = useAutenticacion()
  const { conversacionActual } = useConversaciones()
  const [mensajes, establecerMensajes] = useState<Mensaje[]>([])
  const [cargandoHistorial, establecerCargandoHistorial] = useState(false)

  // Cargar mensajes cuando cambia la conversación
  useEffect(() => {
    if (!conversacionActual || !usuario) {
      establecerMensajes([])
      return
    }

    const cargarMensajes = async () => {
      establecerCargandoHistorial(true)
      try {
        const datos = await obtenerMensajes(conversacionActual)
        const mensajesFormateados: Mensaje[] = datos.map((m: any) => ({
          id: m.id,
          role: m.rol as "user" | "assistant",
          content: m.contenido as ContenidoMensaje,
          timestamp: new Date(m.created_at)
        }))
        establecerMensajes(mensajesFormateados)
      } catch (error) {
        console.error("Error cargando mensajes:", error)
      } finally {
        establecerCargandoHistorial(false)
      }
    }

    cargarMensajes()
  }, [conversacionActual, usuario])

  const guardarMensajeEnBD = useCallback(async (
    rol: "user" | "assistant",
    contenido: ContenidoMensaje
  ) => {
    if (!conversacionActual || !usuario) return

    try {
      await guardarMensaje(conversacionActual, rol, contenido)
    } catch (error) {
      console.error("Error guardando mensaje:", error)
    }
  }, [conversacionActual, usuario])

  const agregarMensaje = useCallback((mensaje: Mensaje) => {
    establecerMensajes(prev => [...prev, mensaje])
    
    // Guardar en BD si hay usuario autenticado y conversación activa
    if (usuario && conversacionActual) {
      // Usar setTimeout para asegurar que la conversación esté establecida
      setTimeout(() => {
        guardarMensajeEnBD(mensaje.role, mensaje.content)
      }, 100)
    }
  }, [usuario, conversacionActual, guardarMensajeEnBD])

  const limpiarMensajes = useCallback(() => {
    establecerMensajes([])
  }, [])

  return {
    mensajes,
    agregarMensaje,
    limpiarMensajes,
    cargandoHistorial,
    establecerMensajes
  }
}
