/**
 * Hook de React para un chat con streaming.
 * - Estado: mensajes, entrada, cargando; permite cancelar con AbortController.
 * - enviar(): envía POST a /api/chat y actualiza en tiempo real el mensaje del asistente
 *   leyendo texto plano o SSE (acumula fragmentos).
 * - API: { mensajes, entrada, establecerEntrada, estaCargando, enviar, detener }.
 */
"use client"
import { useCallback, useMemo, useRef, useState } from "react"

export type MensajeChat = { role: "user" | "assistant"; content: string }

export function useUsarChat() {
  const [mensajes, establecerMensajes] = useState<MensajeChat[]>([])
  const [entrada, establecerEntrada] = useState("")
  const [estaCargando, establecerEstaCargando] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const enviar = useCallback(
    async (texto?: string) => {
      const contenido = (texto ?? entrada).trim()
      if (!contenido) return
      establecerEstaCargando(true)
      establecerMensajes((prev) => [...prev, { role: "user", content: contenido }])
      establecerEntrada("")

      const controller = new AbortController()
      abortRef.current = controller
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...mensajes, { role: "user", content: contenido }] }),
          signal: controller.signal,
        })
        if (!res.ok || !res.body) throw new Error("Respuesta inválida del servidor")

        const reader = res.body.getReader()
        const decoder = new TextDecoder("utf-8")
        const contentType = res.headers.get("content-type") || ""
        const isSSE = contentType.includes("text/event-stream")

        let asistente = ""
        establecerMensajes((prev) => [...prev, { role: "assistant", content: "" }])

        if (!isSSE) {
          // Texto plano en streaming
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value, { stream: true })
            asistente += chunk
            
            // Actualizar inmediatamente para el efecto de escritura
            establecerMensajes((prev) => {
              const copia = [...prev]
              const ultimoIdx = copia.length - 1
              if (ultimoIdx >= 0 && copia[ultimoIdx].role === "assistant") {
                copia[ultimoIdx] = { role: "assistant", content: asistente }
              }
              return copia
            })
          }
          
          // Flush final
          const chunkFinal = decoder.decode()
          if (chunkFinal) {
            asistente += chunkFinal
            establecerMensajes((prev) => {
              const copia = [...prev]
              const ultimoIdx = copia.length - 1
              if (ultimoIdx >= 0 && copia[ultimoIdx].role === "assistant") {
                copia[ultimoIdx] = { role: "assistant", content: asistente }
              }
              return copia
            })
          }
        } else {
          // Server-Sent Events: parsea bloques separados por \n\n con líneas tipo "data: ..."
          let buffer = ""
          const flushAsistente = () =>
            establecerMensajes((prev) => {
              const copia = [...prev]
              const idx = copia.findIndex((m, i) => i === copia.length - 1 && m.role === "assistant")
              if (idx !== -1) copia[idx] = { role: "assistant", content: asistente }
              return copia
            })

          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })

            // Procesa eventos completos terminados en doble salto de línea
            let idx
            while ((idx = buffer.indexOf("\n\n")) !== -1) {
              const bloqueEvento = buffer.slice(0, idx)
              buffer = buffer.slice(idx + 2)
              const lineas = bloqueEvento.split("\n").map((l) => l.trim())
              // Extrae todas las líneas data:
              const lineasData = lineas
                .filter((l) => l.startsWith("data:"))
                .map((l) => l.replace(/^data:\s?/, ""))
              if (lineasData.length === 0) continue
              const dataStr = lineasData.join("\n")
              try {
                const json = JSON.parse(dataStr)
                // Maneja formatos comunes del AI SDK
                // text-delta acumulativo
                if (typeof json === "object" && json) {
                  if (typeof json.text === "string") {
                    asistente += json.text
                    flushAsistente()
                  } else if (typeof json.delta === "string") {
                    asistente += json.delta
                    flushAsistente()
                  } else if (
                    json.type === "text-delta" && typeof json.delta === "string"
                  ) {
                    asistente += json.delta
                    flushAsistente()
                  } else if (
                    json.type === "message" && typeof json.message?.content === "string"
                  ) {
                    asistente += json.message.content
                    flushAsistente()
                  }
                }
              } catch {
                // Si no es JSON, asume texto directo
                asistente += dataStr
                flushAsistente()
              }
            }
          }
          // Procesa restos del buffer
          if (buffer.trim().length) {
            const resto = buffer.replace(/^data:\s?/gm, "")
            try {
              const json = JSON.parse(resto)
              if (typeof json?.text === "string") asistente += json.text
              else if (typeof json?.delta === "string") asistente += json.delta
              else asistente += resto
            } catch {
              asistente += resto
            }
            flushAsistente()
          }
        }
      } catch (e) {
        console.error(e)
        establecerMensajes((prev) => [
          ...prev,
          { role: "assistant", content: "Lo siento, ocurrió un error al generar la respuesta." },
        ])
      } finally {
        establecerEstaCargando(false)
        abortRef.current = null
      }
    },
    [entrada, mensajes]
  )

  const detener = useCallback(() => abortRef.current?.abort(), [])

  const api = useMemo(
    () => ({ mensajes, entrada, establecerEntrada, estaCargando, enviar, detener }),
    [mensajes, entrada, estaCargando, enviar, detener]
  )

  return api
}
