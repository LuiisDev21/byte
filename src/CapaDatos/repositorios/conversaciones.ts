/**
 * Repositorio para operaciones CRUD de conversaciones
 */

import { supabase } from '../supabase/cliente'

export async function crearConversacion(usuarioId: string, titulo?: string) {
  const { data, error } = await supabase
    .from('conversaciones')
    .insert({ 
      usuario_id: usuarioId, 
      titulo: titulo || 'Nueva conversación' 
    } as any)
    .select()
    .single()

  if (error) {
    console.error('Error al crear conversación:', error)
    throw new Error(`Error al crear conversación: ${error.message || JSON.stringify(error)}`)
  }
  
  if (!data) {
    throw new Error('No se recibieron datos al crear la conversación')
  }
  
  return data
}

export async function obtenerConversaciones(usuarioId: string) {
  const { data, error } = await supabase
    .from('conversaciones')
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('updated_at', { ascending: false }) as any

  if (error) throw error
  return data || []
}

export async function obtenerConversacion(conversacionId: string) {
  const { data, error } = await supabase
    .from('conversaciones')
    .select('*')
    .eq('id', conversacionId)
    .single() as any

  if (error) throw error
  return data
}

export async function actualizarTituloConversacion(conversacionId: string, titulo: string) {
  const { data, error } = await supabase
    .from('conversaciones')
    .update({ titulo, updated_at: new Date().toISOString() } as any)
    .eq('id', conversacionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarConversacion(conversacionId: string) {
  const { error } = await supabase
    .from('conversaciones')
    .delete()
    .eq('id', conversacionId) as any

  if (error) throw error
}
