import { useState, useCallback, useEffect, useRef } from "react"
import { guardarMensaje, obtenerMensajes, eliminarMensaje } from "@/CapaDatos/repositorios/mensajes"
import { useConversaciones } from "@/CapaNegocio/contextos/contexto-conversaciones"
import { useAutenticacion } from "@/CapaNegocio/contextos/contexto-autenticacion"
import type { ContenidoMensaje, Mensaje } from "@/CapaDatos/tipos/mensaje"

export function useChatPersistente() {
  const { usuario } = useAutenticacion()
  const { conversacionActual } = useConversaciones()
  const [mensajes, establecerMensajes] = useState<Mensaje[]>([])
  const [cargandoHistorial, establecerCargandoHistorial] = useState(false)
  const [controladorAborto, establecerControladorAborto] = useState<AbortController | null>(null)
  const controladorAbortoRef = useRef<AbortController | null>(null)

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

  const detener = useCallback(() => {
    if (controladorAbortoRef.current) {
      controladorAbortoRef.current.abort()
      controladorAbortoRef.current = null
    }
    if (controladorAborto) {
      controladorAborto.abort()
      establecerControladorAborto(null)
    }
  }, [controladorAborto])

  const crearControladorAborto = useCallback(() => {
    if (controladorAbortoRef.current) {
      controladorAbortoRef.current.abort()
    }
    const nuevoControlador = new AbortController()
    controladorAbortoRef.current = nuevoControlador
    establecerControladorAborto(nuevoControlador)
    return nuevoControlador
  }, [])

  const eliminarUltimoMensajeAsistente = useCallback(async () => {
    const ultimo = mensajes[mensajes.length - 1]
    if (!ultimo || ultimo.role !== "assistant") return

    establecerMensajes(prev => {
      if (prev.length > 0 && prev[prev.length - 1].role === "assistant") {
        return prev.slice(0, -1)
      }
      return prev
    })

    if (conversacionActual && usuario && ultimo.id) {
      try {
        await eliminarMensaje(ultimo.id)
      } catch (error) {
        console.warn("No se pudo eliminar mensaje de la base de datos:", error)
      }
    }
  }, [mensajes, conversacionActual, usuario])

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
    establecerMensajes,
    detener,
    crearControladorAborto,
    controladorAborto,
    eliminarUltimoMensajeAsistente
  }
}
