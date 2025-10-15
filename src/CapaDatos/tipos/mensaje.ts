/**
 * Tipos de datos para mensajes del chat
 */

export interface ContenidoTexto {
  type: "text"
  text: string
}

export interface ContenidoImagen {
  type: "image"
  image: string
}

export type ContenidoMensaje = string | (ContenidoTexto | ContenidoImagen)[]

export interface Mensaje {
  id: string
  role: "user" | "assistant"
  content: ContenidoMensaje
  timestamp: Date
}

export type RolMensaje = "system" | "user" | "assistant" | "tool"
