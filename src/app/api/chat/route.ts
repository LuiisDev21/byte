/***
 * [LUIS] - 29/09/2025 API Route de Next.js para chat con streaming de Google AI.
 * - Runtime: edge, dynamic; valida API_KEY y procesa mensajes del chat.
 * - POST(): recibe { messages, prompt, temperature, maxTokens, system },
 *   filtra mensajes del sistema, valida contenido no vacío y llama a streamText()
 *   con Google Gemini devolviendo respuesta en streaming (SSE/text/plain).
 * - API: IncomingMessage[], manejo de errores 400/500, múltiples formatos de stream.
 */

import { NextRequest } from "next/server"
import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { DEFAULT_MODEL, SYSTEM_PROMPT } from "@/config/ai"

export const runtime = "edge"
export const dynamic = "force-dynamic"
type MessageRole = "system" | "user" | "assistant" | "tool"

interface IncomingMessage {
  role: MessageRole
  content: string
}

interface RequestBody {
  messages?: IncomingMessage[]
  prompt?: string
  temperature?: number
  maxTokens?: number
  system?: string
}

interface TextPart {
  type: "text"
  text: string
}

interface CoreMessage {
  role: "user" | "assistant"
  content: TextPart[]
}
const JSON_HEADERS = { "content-type": "application/json" }
const TEXT_HEADERS = { "content-type": "text/plain; charset=utf-8" }
function createErrorResponse(error: string, status: number) {
  return new Response(
    JSON.stringify({ error }),
    { status, headers: JSON_HEADERS }
  )
}

function validateApiKey(): boolean {
  return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
}

function prepareMessages(body: RequestBody): IncomingMessage[] {
  const userMessages = (body.messages ?? []).filter(
    (m) => m && m.role !== "system"
  )

  return userMessages.length > 0
    ? userMessages
    : [{ role: "user", content: String(body.prompt ?? "") }]
}

function transformMessages(messages: IncomingMessage[]): CoreMessage[] {
  return messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: [{ type: "text", text: m.content ?? "" }],
  }))
}

function hasValidUserInput(messages: CoreMessage[]): boolean {
  return messages.some((m) => {
    if (m.role !== "user") return false
    const text = m.content.find((p) => p.type === "text")?.text ?? ""
    return text.trim().length > 0
  })
}

function handleStreamResponse(result: any): Response {
  const streamMethods = [
    'toTextStreamResponse',
    'toAIStreamResponse',
    'toDataStreamResponse'
  ]

  for (const method of streamMethods) {
    if (typeof result[method] === "function") {
      return result[method]()
    }
  }

  if (typeof result.toReadableStream === "function") {
    return new Response(result.toReadableStream(), { headers: TEXT_HEADERS })
  }

  const text = typeof result.text === "function" ? result.text() : ""
  return new Response(text, { headers: TEXT_HEADERS })
}

export async function POST(req: NextRequest) {
  try {
    if (!validateApiKey()) {
      return createErrorResponse("API KEY NO ENCONTRADA.", 500)
    }

    const body: RequestBody = await req.json()

    const system = (body.system ?? SYSTEM_PROMPT).trim()
    const messages = prepareMessages(body)
    const preparedMessages = transformMessages(messages)

    if (!hasValidUserInput(preparedMessages)) {
      return createErrorResponse("Mensaje vacío", 400)
    }

    const model = google(DEFAULT_MODEL)
    const result = await streamText({
      model,
      system,
      messages: preparedMessages,
      temperature: body.temperature ?? 0.7,
      maxTokens: body.maxTokens,
    })

    return handleStreamResponse(result)

  } catch (err) {
    console.error("/api/chat error", err)
    const message = err instanceof Error ? err.message : "Error inesperado generando respuesta"
    return createErrorResponse(message, 500)
  }
}