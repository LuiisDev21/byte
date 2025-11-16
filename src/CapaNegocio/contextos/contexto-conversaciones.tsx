"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAutenticacion } from "./contexto-autenticacion"
import { 
  crearConversacion, 
  obtenerConversaciones, 
  eliminarConversacion,
  actualizarTituloConversacion 
} from "@/CapaDatos/repositorios/conversaciones"

interface Conversacion {
  id: string
  usuario_id: string
  titulo: string
  created_at: string
  updated_at: string
}

interface ContextoConversaciones {
  conversaciones: Conversacion[]
  conversacionActual: string | null
  cargando: boolean
  establecerConversacionActual: (id: string | null) => void
  crearNuevaConversacion: () => Promise<string>
  eliminarConversacionPorId: (id: string) => Promise<void>
  actualizarTitulo: (id: string, titulo: string) => Promise<void>
  recargarConversaciones: () => Promise<void>
}

const ContextoConversaciones = createContext<ContextoConversaciones | undefined>(undefined)

export function ProveedorConversaciones({ children }: { children: React.ReactNode }) {
  const { usuario } = useAutenticacion()
  const [conversaciones, establecerConversaciones] = useState<Conversacion[]>([])
  const [conversacionActual, establecerConversacionActual] = useState<string | null>(null)
  const [cargando, establecerCargando] = useState(false)

  const recargarConversaciones = async () => {
    if (!usuario) {
      establecerConversaciones([])
      return
    }

    establecerCargando(true)
    try {
      const datos = await obtenerConversaciones(usuario.id)
      establecerConversaciones(datos)
    } catch (error) {
      console.error("Error cargando conversaciones:", error)
    } finally {
      establecerCargando(false)
    }
  }

  useEffect(() => {
    recargarConversaciones()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])

  const crearNuevaConversacion = async () => {
    if (!usuario) {
      throw new Error("Usuario no autenticado")
    }
    
    try {
      // Asegurar que el usuario existe en la tabla usuarios
      const { crearUsuarioSiNoExiste } = await import("@/CapaDatos/repositorios/usuarios")
      await crearUsuarioSiNoExiste(usuario.id, usuario.email || '')
      
      const nueva = await crearConversacion(usuario.id)
      
      // Recargar conversaciones para asegurar que esté sincronizado
      await recargarConversaciones()
      establecerConversacionActual(nueva.id)
      
      return nueva.id
    } catch (error) {
      console.error('Error al crear conversación:', error)
      throw error
    }
  }

  const eliminarConversacionPorId = async (id: string) => {
    await eliminarConversacion(id)
    establecerConversaciones(prev => prev.filter(c => c.id !== id))
    if (conversacionActual === id) {
      establecerConversacionActual(null)
    }
  }

  const actualizarTitulo = async (id: string, titulo: string) => {
    await actualizarTituloConversacion(id, titulo)
    establecerConversaciones(prev => 
      prev.map(c => c.id === id ? { ...c, titulo, updated_at: new Date().toISOString() } : c)
    )
  }

  return (
    <ContextoConversaciones.Provider value={{
      conversaciones,
      conversacionActual,
      cargando,
      establecerConversacionActual,
      crearNuevaConversacion,
      eliminarConversacionPorId,
      actualizarTitulo,
      recargarConversaciones
    }}>
      {children}
    </ContextoConversaciones.Provider>
  )
}

export function useConversaciones() {
  const contexto = useContext(ContextoConversaciones)
  if (contexto === undefined) {
    throw new Error("useConversaciones debe usarse dentro de ProveedorConversaciones")
  }
  return contexto
}
