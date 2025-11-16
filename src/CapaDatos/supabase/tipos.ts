/**
 * Tipos generados automáticamente desde el esquema de Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nombre?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversaciones: {
        Row: {
          id: string
          usuario_id: string
          titulo: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          titulo?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          titulo?: string
          created_at?: string
          updated_at?: string
        }
      }
      mensajes: {
        Row: {
          id: string
          conversacion_id: string
          rol: 'user' | 'assistant' | 'system'
          contenido: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversacion_id: string
          rol: 'user' | 'assistant' | 'system'
          contenido: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversacion_id?: string
          rol?: 'user' | 'assistant' | 'system'
          contenido?: Json
          created_at?: string
        }
      }
    }
  }
}
