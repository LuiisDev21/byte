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

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "Falta GOOGLE_GENERATIVE_AI_API_KEY en variables de entorno.",
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

    // Construimos mensajes (solo user/assistant) en formato CoreMessage
    const prepared = finalMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: [{ type: "text" as const, text: m.content ?? "" }],
    }))

    // Validación básica: al menos un mensaje de usuario con contenido
    const hasUserText = prepared.some((m: any) => {
      if (m?.role !== "user") return false
      const parts = Array.isArray(m.content) ? m.content : []
      const text = parts.find((p: any) => p?.type === "text")?.text ?? ""
      return String(text).trim().length > 0
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

    const anyResult: any = result as any
    if (typeof anyResult.toTextStreamResponse === "function") {
      return anyResult.toTextStreamResponse()
    }
    if (typeof anyResult.toAIStreamResponse === "function") {
      return anyResult.toAIStreamResponse()
    }
    if (typeof anyResult.toDataStreamResponse === "function") {
      return anyResult.toDataStreamResponse()
    }
    if (typeof anyResult.toReadableStream === "function") {
      return new Response(anyResult.toReadableStream(), {
        headers: { "content-type": "text/plain; charset=utf-8" },
      })
    }
    // Último recurso: serializar a texto si no hay método de stream disponible
    const text = typeof anyResult.text === "function" ? await anyResult.text() : ""
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
