/**
 * API Route de Next.js para chat con streaming de Google AI.
 * - Runtime: edge, dynamic; valida API_KEY y procesa mensajes del chat.
 * - POST(): recibe { messages, prompt, temperature, maxTokens, system },
 *   filtra mensajes del sistema, valida contenido no vacío y llama a streamText()
 *   con Google Gemini devolviendo respuesta en streaming (SSE/text/plain).
 */

import { NextRequest } from "next/server"
import { google } from "@ai-sdk/google"
import { streamText, CoreMessage } from "ai"
import { MODELO_PREDETERMINADO, PROMPT_SISTEMA } from "@/CapaDatos/configuracion/ia"
import { RolMensaje, ContenidoMensaje } from "@/CapaDatos/tipos/mensaje"

export const runtime = "edge"
export const dynamic = "force-dynamic"

interface MensajeEntrante {
  role: RolMensaje
  content: ContenidoMensaje
}

interface CuerpoSolicitud {
  messages?: MensajeEntrante[]
  prompt?: string
  temperature?: number
  maxTokens?: number
  system?: string
}

const ENCABEZADOS_JSON = { "content-type": "application/json" }

function crearRespuestaError(error: string, estado: number) {
  return new Response(
    JSON.stringify({ error }),
    { status: estado, headers: ENCABEZADOS_JSON }
  )
}

function validarClaveApi(): boolean {
  return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
}

function prepararMensajes(cuerpo: CuerpoSolicitud): MensajeEntrante[] {
  const mensajesUsuario = (cuerpo.messages ?? []).filter(
    (m) => m && m.role !== "system"
  )

  return mensajesUsuario.length > 0
    ? mensajesUsuario
    : [{ role: "user", content: String(cuerpo.prompt ?? "") }]
}

function transformarMensajes(mensajes: MensajeEntrante[]): CoreMessage[] {
  return mensajes.map((m): CoreMessage => {
    const role = m.role as "user" | "assistant"
    
    // Si el contenido es string, convertir a formato de texto
    if (typeof m.content === "string") {
      if (role === "user") {
        return {
          role: "user",
          content: m.content,
        }
      } else {
        return {
          role: "assistant",
          content: m.content,
        }
      }
    }
    
    // Si el contenido es array, mantener el formato multimodal
    if (Array.isArray(m.content)) {
      // Los mensajes del asistente solo pueden tener texto
      if (role === "assistant") {
        const textoSolo = m.content
          .filter(parte => parte.type === "text")
          .map(parte => parte.text)
          .join("\n")
        
        return {
          role: "assistant",
          content: textoSolo,
        }
      }
      
      // Los mensajes del usuario pueden tener texto e imágenes
      const contenidoTransformado = m.content.map(parte => {
        if (parte.type === "text") {
          return { type: "text" as const, text: parte.text }
        }
        if (parte.type === "image") {
          return { type: "image" as const, image: parte.image }
        }
        return parte
      })
      
      return {
        role: "user",
        content: contenidoTransformado,
      }
    }
    
    // Fallback para contenido vacío
    if (role === "user") {
      return {
        role: "user",
        content: "",
      }
    } else {
      return {
        role: "assistant",
        content: "",
      }
    }
  })
}

function tieneEntradaUsuarioValida(mensajes: CoreMessage[]): boolean {
  return mensajes.some((m) => {
    if (m.role !== "user") return false
    
    // Si el contenido es string
    if (typeof m.content === "string") {
      return m.content.trim().length > 0
    }
    
    // Si el contenido es array
    if (Array.isArray(m.content)) {
      // Verificar si hay texto no vacío
      const tieneTexto = m.content.some(parte => 
        parte.type === "text" && "text" in parte && parte.text.trim().length > 0
      )
      
      // Verificar si hay imagen
      const tieneImagen = m.content.some(parte => 
        parte.type === "image" && "image" in parte && parte.image
      )
      
      return tieneTexto || tieneImagen
    }
    
    return false
  })
}

// Eliminada la interfaz ResultadoStream y la función manejarRespuestaStream

export async function POST(req: NextRequest) {
  try {
    if (!validarClaveApi()) {
      return crearRespuestaError("API KEY NO ENCONTRADA.", 500)
    }

    const cuerpo: CuerpoSolicitud = await req.json()

    const sistema = (cuerpo.system ?? PROMPT_SISTEMA).trim()
    const mensajes = prepararMensajes(cuerpo)
    const mensajesPreparados = transformarMensajes(mensajes)

    if (!tieneEntradaUsuarioValida(mensajesPreparados)) {
      return crearRespuestaError("Mensaje vacío", 400)
    }

    const modelo = google(MODELO_PREDETERMINADO)
    const resultado = await streamText({
      model: modelo,
      system: sistema,
      messages: mensajesPreparados,
      temperature: cuerpo.temperature ?? 0.7,
    })

    return resultado.toTextStreamResponse()

  } catch (err) {
    console.error("/api/chat error", err)
    const mensaje = err instanceof Error ? err.message : "Error inesperado generando respuesta"
    return crearRespuestaError(mensaje, 500)
  }
}
