"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/CapaDatos/supabase/cliente"
import type { User } from "@supabase/supabase-js"

interface ContextoAutenticacion {
  usuario: User | null
  cargando: boolean
  iniciarSesion: (email: string, password: string) => Promise<void>
  registrarse: (email: string, password: string) => Promise<void>
  cerrarSesion: () => Promise<void>
}

const ContextoAutenticacion = createContext<ContextoAutenticacion | undefined>(undefined)

export function ProveedorAutenticacion({ children }: { children: React.ReactNode }) {
  const [usuario, establecerUsuario] = useState<User | null>(null)
  const [cargando, establecerCargando] = useState(true)

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      establecerUsuario(session?.user ?? null)
      establecerCargando(false)
    })

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      establecerUsuario(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const iniciarSesion = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    
    // Asegurar que el usuario existe en la tabla usuarios
    if (data.user) {
      try {
        const { crearUsuarioSiNoExiste } = await import("@/CapaDatos/repositorios/usuarios")
        await crearUsuarioSiNoExiste(data.user.id, email)
      } catch (err) {
        console.error('Error verificando usuario en tabla:', err)
        // No lanzar error aquí, continuar con el login
      }
    }
  }

  const registrarse = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    // El trigger de Supabase creará automáticamente el usuario en la tabla usuarios
  }

  const cerrarSesion = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <ContextoAutenticacion.Provider value={{ usuario, cargando, iniciarSesion, registrarse, cerrarSesion }}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}

export function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion)
  if (contexto === undefined) {
    throw new Error("useAutenticacion debe usarse dentro de ProveedorAutenticacion")
  }
  return contexto
}
