/**
 * API Route de Next.js para chat con streaming multi-proveedor (OpenAI, Google Gemini, etc.).
 * - POST(): recibe { messages, prompt, temperature, maxTokens, system, provider, model },
 *   valida credenciales, filtra mensajes y llama a streamText() con el modelo resuelto,
 *   devolviendo respuesta en streaming.
 */

import { NextRequest } from "next/server"
import { streamText, CoreMessage } from "ai"
import { 
  obtenerModeloIA, 
  validarCredencialesIA, 
  PROMPT_SISTEMA,
  ProveedorIA,
  soportaTemperatura,
  formatearErrorIA,
  MODELO_PREDETERMINADO_GEMINI,
  MODELO_PREDETERMINADO_OPENAI
} from "@/CapaDatos/configuracion/ia"
import { RolMensaje, ContenidoMensaje } from "@/CapaDatos/tipos/mensaje"

export const runtime = "nodejs"
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
  provider?: ProveedorIA
  model?: string
}

const ENCABEZADOS_JSON = { "content-type": "application/json" }

function crearRespuestaError(error: string, estado: number) {
  return new Response(
    JSON.stringify({ error }),
    { status: estado, headers: ENCABEZADOS_JSON }
  )
}

function prepararMensajes(cuerpo: CuerpoSolicitud): MensajeEntrante[] {
  const mensajesUsuario = (cuerpo.messages ?? []).filter(
    (m) => m && m.role !== "system"
  )

  return mensajesUsuario.length > 0
    ? mensajesUsuario
    : [{ role: "user", content: String(cuerpo.prompt ?? "") }]
}

export function transformarMensajes(mensajes: MensajeEntrante[]): CoreMessage[] {
  return mensajes.map((m): CoreMessage => {
    const role = m.role as "user" | "assistant"
    
    if (typeof m.content === "string") {
      return {
        role,
        content: m.content,
      }
    }
    
    if (Array.isArray(m.content)) {
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
    
    return {
      role,
      content: "",
    }
  })
}

function tieneEntradaUsuarioValida(mensajes: CoreMessage[]): boolean {
  return mensajes.some((m) => {
    if (m.role !== "user") return false
    
    if (typeof m.content === "string") {
      return m.content.trim().length > 0
    }
    
    if (Array.isArray(m.content)) {
      const tieneTexto = m.content.some(parte => 
        parte.type === "text" && "text" in parte && parte.text.trim().length > 0
      )
      
      const tieneImagen = m.content.some(parte => 
        parte.type === "image" && "image" in parte && parte.image
      )
      
      return tieneTexto || tieneImagen
    }
    
    return false
  })
}

export async function POST(req: NextRequest) {
  try {
    const cuerpo: CuerpoSolicitud = await req.json().catch(() => ({}))

    const validacion = validarCredencialesIA(cuerpo.provider)
    if (!validacion.valida) {
      return crearRespuestaError(
        validacion.mensajeError || "Credenciales de API de IA no configuradas.",
        500
      )
    }

    const sistema = (cuerpo.system ?? PROMPT_SISTEMA).trim()
    const mensajes = prepararMensajes(cuerpo)
    const mensajesPreparados = transformarMensajes(mensajes)

    if (!tieneEntradaUsuarioValida(mensajesPreparados)) {
      return crearRespuestaError("Mensaje vacío", 400)
    }

    const modelo = obtenerModeloIA({
      proveedor: cuerpo.provider,
      modelo: cuerpo.model,
    })

    const modeloIdNombre = cuerpo.model || (cuerpo.provider === "google" ? MODELO_PREDETERMINADO_GEMINI : MODELO_PREDETERMINADO_OPENAI)
    const permiteTemperatura = soportaTemperatura(modeloIdNombre)

    const resultado = streamText({
      model: modelo as unknown as Parameters<typeof streamText>[0]["model"],
      system: sistema,
      messages: mensajesPreparados,
      temperature: permiteTemperatura ? (cuerpo.temperature ?? 0.7) : undefined,
      maxOutputTokens: cuerpo.maxTokens,
    })

    const encoder = new TextEncoder()
    let thinkOpen = false
    let contenidoEmitido = false

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of resultado.fullStream) {
            if (chunk.type === "reasoning-start") {
              if (!thinkOpen) {
                controller.enqueue(encoder.encode("<think>\n"))
                thinkOpen = true
                contenidoEmitido = true
              }
            } else if (chunk.type === "reasoning-delta") {
              if (!thinkOpen) {
                controller.enqueue(encoder.encode("<think>\n"))
                thinkOpen = true
              }
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text))
                contenidoEmitido = true
              }
            } else if (chunk.type === "reasoning-end") {
              if (thinkOpen) {
                controller.enqueue(encoder.encode("\n</think>\n\n"))
                thinkOpen = false
              }
            } else if (chunk.type === "text-delta") {
              if (thinkOpen) {
                controller.enqueue(encoder.encode("\n</think>\n\n"))
                thinkOpen = false
              }
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text))
                contenidoEmitido = true
              }
            } else if (chunk.type === "error") {
              if (thinkOpen) {
                controller.enqueue(encoder.encode("\n</think>\n\n"))
                thinkOpen = false
              }
              console.error("[streamText error chunk]:", chunk.error)
              const mensajeError = formatearErrorIA(chunk.error)
              controller.enqueue(
                encoder.encode(contenidoEmitido ? `\n\n${mensajeError}` : mensajeError)
              )
              contenidoEmitido = true
            }
          }

          if (thinkOpen) {
            controller.enqueue(encoder.encode("\n</think>\n\n"))
          }

          if (!contenidoEmitido) {
            controller.enqueue(
              encoder.encode(
                "⚠️ El proveedor de IA finalizó sin generar contenido. Verifica que el modelo configurado esté disponible y activo."
              )
            )
          }

          controller.close()
        } catch (err) {
          if (thinkOpen) {
            controller.enqueue(encoder.encode("\n</think>\n\n"))
          }
          console.error("[streamText iteration error]:", err)
          const mensajeError = formatearErrorIA(err)
          controller.enqueue(
            encoder.encode(contenidoEmitido ? `\n\n${mensajeError}` : mensajeError)
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    })

  } catch (err) {
    console.error("/api/chat error", err)
    const mensaje = err instanceof Error ? err.message : "Error inesperado generando respuesta"
    return crearRespuestaError(mensaje, 500)
  }
}
