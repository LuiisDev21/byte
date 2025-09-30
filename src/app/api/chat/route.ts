import { NextRequest } from "next/server"
import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { DEFAULT_MODEL, SYSTEM_PROMPT } from "@/config/ai"

export const runtime = "edge"
export const dynamic = "force-dynamic"

type IncomingMessage = {
  role: "system" | "user" | "assistant" | "tool"
  content: string
}


/***
 * [LUIS] - 29/09/2025 API Route de Next.js para chat con streaming de Google Gemini.
 * - Runtime: edge, dynamic; valida API_KEY y procesa mensajes del chat.
 * - POST(): recibe { messages, prompt, temperature, maxTokens, system },
 *   filtra mensajes del sistema, valida contenido no vacío y llama a streamText()
 *   con Google Gemini devolviendo respuesta en streaming (SSE/text/plain).
 * - API: IncomingMessage[], manejo de errores 400/500, múltiples formatos de stream.
 */


export async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "API KEY NO ENCONTRADA.",
        }),
        { status: 500, headers: { "content-type": "application/json" } }
      )
    }

    const body = (await req.json()) as {
      messages?: IncomingMessage[]
      prompt?: string
      temperature?: number
      maxTokens?: number
      system?: string
    }

    const system = (body.system ?? SYSTEM_PROMPT).trim()
    const userMessages: IncomingMessage[] = (body.messages ?? []).filter(
      (m) => m && m.role !== "system"
    )
    const finalMessages = userMessages.length
      ? userMessages
      : ([{ role: "user", content: String(body.prompt ?? "") }] as IncomingMessage[])

    type TextPart = { type: "text"; text: string }
    type CoreMessageLite = { role: "user" | "assistant"; content: TextPart[] }
    const prepared: CoreMessageLite[] = finalMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: [{ type: "text", text: m.content ?? "" }],
    }))

    const hasUserText = prepared.some((m) => {
      if (m.role !== "user") return false
      const parts = Array.isArray(m.content) ? m.content : []
      const text = parts.find((p) => p.type === "text")?.text ?? ""
      return text.trim().length > 0
    })
    if (!hasUserText) {
      return new Response(JSON.stringify({ error: "Mensaje vacío" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    }

    const model = google(DEFAULT_MODEL)

    const result = await streamText({
      model,
      system,
      messages: prepared,
      temperature: body.temperature ?? 0.7,
      maxTokens: body.maxTokens,
    })
    type StreamLike = {
      toTextStreamResponse?: () => Response
      toAIStreamResponse?: () => Response
      toDataStreamResponse?: () => Response
      toReadableStream?: () => ReadableStream<Uint8Array>
      text?: () => Promise<string>
    }
    const r = result as StreamLike
    if (typeof r.toTextStreamResponse === "function") {
      return r.toTextStreamResponse()
    }
    if (typeof r.toAIStreamResponse === "function") {
      return r.toAIStreamResponse()
    }
    if (typeof r.toDataStreamResponse === "function") {
      return r.toDataStreamResponse()
    }
    if (typeof r.toReadableStream === "function") {
      return new Response(r.toReadableStream(), {
        headers: { "content-type": "text/plain; charset=utf-8" },
      })
    }
    const text = typeof r.text === "function" ? await r.text() : ""
    return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } })
  } catch (err) {
    console.error("/api/chat error", err)
    const message =
      err instanceof Error ? err.message : "Error inesperado generando respuesta"
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
