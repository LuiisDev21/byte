/**
 * Repositorio para operaciones CRUD de usuarios
 */

import { supabase } from '../supabase/cliente'

export async function obtenerUsuario(usuarioId: string) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', usuarioId)
    .single() as any

  if (error) throw error
  return data
}

export async function crearUsuarioSiNoExiste(usuarioId: string, email: string) {
  // Primero intentar obtener el usuario
  const { data: usuarioExistente } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', usuarioId)
    .single() as any

  if (usuarioExistente) {
    return usuarioExistente
  }

  // Si no existe, crearlo
  const { data, error } = await supabase
    .from('usuarios')
    .insert({ id: usuarioId, email } as any)
    .select()
    .single()

  if (error) {
    console.error('Error al crear usuario:', error)
    throw new Error(`Error al crear usuario: ${error.message || JSON.stringify(error)}`)
  }

  return data
}

export async function actualizarUsuario(
  usuarioId: string,
  datos: { nombre?: string; avatar_url?: string }
) {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ ...datos, updated_at: new Date().toISOString() } as any)
    .eq('id', usuarioId)
    .select()
    .single()

  if (error) throw error
  return data
}
