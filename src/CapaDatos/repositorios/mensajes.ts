/**
 * Repositorio para operaciones CRUD de mensajes
 */

import { supabase } from '../supabase/cliente'
import type { ContenidoMensaje } from '../tipos/mensaje'

export async function guardarMensaje(
    conversacionId: string,
    rol: 'user' | 'assistant' | 'system',
    contenido: ContenidoMensaje
) {
    const { data, error } = await supabase
        .from('mensajes')
        .insert({
            conversacion_id: conversacionId,
            rol,
            contenido: contenido as any
        } as any)
        .select()
        .single()

    if (error) throw error

    // Actualizar timestamp de la conversación
    await supabase
        .from('conversaciones')
        .update({ updated_at: new Date().toISOString() } as any)
        .eq('id', conversacionId)

    return data
}

export async function obtenerMensajes(conversacionId: string) {
    const { data, error } = await supabase
        .from('mensajes')
        .select('*')
        .eq('conversacion_id', conversacionId)
        .order('created_at', { ascending: true }) as any

    if (error) throw error
    return data || []
}

export async function eliminarMensaje(mensajeId: string) {
    const { error } = await supabase
        .from('mensajes')
        .delete()
        .eq('id', mensajeId) as any

    if (error) throw error
}
