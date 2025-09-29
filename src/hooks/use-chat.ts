"use client"
import { useCallback, useMemo, useRef, useState } from "react"

export type ChatMessage = { role: "user" | "assistant"; content: string }


/**
 * [LUIS] - 29/09/2025 Hook de React para un chat con streaming.
 * - Estado: messages, input, isLoading; permite cancelar con AbortController.
 * - send(): envía POST a /api/chat y actualiza en tiempo real el mensaje del asistente
 *   leyendo texto plano o SSE (acumula fragmentos).
 * - API: { messages, input, setInput, isLoading, send, stop }.
 */     


export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim()
      if (!content) return
      setIsLoading(true)
      setMessages((prev) => [...prev, { role: "user", content }])
      setInput("")

      const controller = new AbortController()
      abortRef.current = controller
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...messages, { role: "user", content }] }),
          signal: controller.signal,
        })
        if (!res.ok || !res.body) throw new Error("Respuesta inválida del servidor")

        const reader = res.body.getReader()
        const decoder = new TextDecoder("utf-8")
        const contentType = res.headers.get("content-type") || ""
        const isSSE = contentType.includes("text/event-stream")

        let assistant = ""
        setMessages((prev) => [...prev, { role: "assistant", content: "" }])

        if (!isSSE) {
          // Texto plano en streaming
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            assistant += decoder.decode(value, { stream: true })
            setMessages((prev) => {
              const copy = [...prev]
              const idx = copy.findIndex((m, i) => i === copy.length - 1 && m.role === "assistant")
              if (idx !== -1) copy[idx] = { role: "assistant", content: assistant }
              return copy
            })
          }
          // Flush final
          assistant += decoder.decode()
          setMessages((prev) => {
            const copy = [...prev]
            const idx = copy.findIndex((m, i) => i === copy.length - 1 && m.role === "assistant")
            if (idx !== -1) copy[idx] = { role: "assistant", content: assistant }
            return copy
          })
        } else {
          // Server-Sent Events: parsea bloques separados por \n\n con líneas tipo "data: ..."
          let buffer = ""
          const flushAssistant = () =>
            setMessages((prev) => {
              const copy = [...prev]
              const idx = copy.findIndex((m, i) => i === copy.length - 1 && m.role === "assistant")
              if (idx !== -1) copy[idx] = { role: "assistant", content: assistant }
              return copy
            })

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            // Procesa eventos completos terminados en doble salto de línea
            let idx
            while ((idx = buffer.indexOf("\n\n")) !== -1) {
              const eventBlock = buffer.slice(0, idx)
              buffer = buffer.slice(idx + 2)
              const lines = eventBlock.split("\n").map((l) => l.trim())
              // Extrae todas las líneas data:
              const dataLines = lines
                .filter((l) => l.startsWith("data:"))
                .map((l) => l.replace(/^data:\s?/, ""))
              if (dataLines.length === 0) continue
              const dataStr = dataLines.join("\n")
              try {
                const json = JSON.parse(dataStr)
                // Maneja formatos comunes del AI SDK
                // text-delta acumulativo
                if (typeof json === "object" && json) {
                  if (typeof json.text === "string") {
                    assistant += json.text
                    flushAssistant()
                  } else if (typeof json.delta === "string") {
                    assistant += json.delta
                    flushAssistant()
                  } else if (
                    json.type === "text-delta" && typeof json.delta === "string"
                  ) {
                    assistant += json.delta
                    flushAssistant()
                  } else if (
                    json.type === "message" && typeof json.message?.content === "string"
                  ) {
                    assistant += json.message.content
                    flushAssistant()
                  }
                }
              } catch (_) {
                // Si no es JSON, asume texto directo
                assistant += dataStr
                flushAssistant()
              }
            }
          }
          // Procesa restos del buffer
          if (buffer.trim().length) {
            const rest = buffer.replace(/^data:\s?/gm, "")
            try {
              const json = JSON.parse(rest)
              if (typeof json?.text === "string") assistant += json.text
              else if (typeof json?.delta === "string") assistant += json.delta
              else assistant += rest
            } catch {
              assistant += rest
            }
            flushAssistant()
          }
        }
      } catch (e) {
        console.error(e)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Lo siento, ocurrió un error al generar la respuesta." },
        ])
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [input, messages]
  )

  const stop = useCallback(() => abortRef.current?.abort(), [])

  const api = useMemo(
    () => ({ messages, input, setInput, isLoading, send, stop }),
    [messages, input, isLoading, send, stop]
  )

  return api
}
