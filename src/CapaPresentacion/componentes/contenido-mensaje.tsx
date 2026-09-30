/**
 * Componente para renderizar el contenido de un mensaje (texto, imagen o multimodal).
 * - Detecta bloques de razonamiento clínico como <think>...</think> y los renderiza con Reasoning.
 * - Soporta contenido simple (string) y multimodal (array de partes).
 * - Renderiza texto con markdown para mensajes del asistente, texto plano para usuario.
 * - Soporta imágenes con optimización Next.js Image y diseño responsivo.
 * - Maneja animación de escritura cuando isTyping=true.
 */
"use client"

import Image from "next/image"
import { MarkdownEscritura } from "@/CapaPresentacion/componentes/texto-escritura"
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/CapaPresentacion/componentes/ui/reasoning"
import type { ContenidoMensaje as TipoContenidoMensaje } from "@/CapaDatos/tipos/mensaje"

interface PropiedadesContenidoMensaje {
  content: TipoContenidoMensaje
  role: "user" | "assistant"
  isTyping?: boolean
}

interface SegmentoMensaje {
  tipo: "razonamiento" | "texto"
  contenido: string
  enProgreso?: boolean
}

/**
 * Parsea el texto buscando etiquetas <think>...</think> tanto completas como en progreso (streaming).
 */
function parsearContenidoConRazonamiento(
  texto: string,
  isTyping: boolean = false
): SegmentoMensaje[] {
  if (!texto.includes("<think>")) {
    return [{ tipo: "texto", contenido: texto }]
  }

  const segmentos: SegmentoMensaje[] = []
  let restante = texto

  while (restante.length > 0) {
    const indiceInicio = restante.indexOf("<think>")
    if (indiceInicio === -1) {
      if (restante.length > 0) {
        segmentos.push({ tipo: "texto", contenido: restante })
      }
      break
    }

    // Texto previo antes de <think>
    if (indiceInicio > 0) {
      const textoPrevio = restante.slice(0, indiceInicio)
      if (textoPrevio.trim().length > 0) {
        segmentos.push({ tipo: "texto", contenido: textoPrevio })
      }
    }

    const contenidoDesdeThink = restante.slice(indiceInicio + "<think>".length)
    const indiceCierre = contenidoDesdeThink.indexOf("</think>")

    if (indiceCierre !== -1) {
      // Bloque de pensamiento completado
      const razonamiento = contenidoDesdeThink.slice(0, indiceCierre)
      segmentos.push({
        tipo: "razonamiento",
        contenido: razonamiento.trim(),
        enProgreso: false,
      })
      restante = contenidoDesdeThink.slice(indiceCierre + "</think>".length)
    } else {
      // Bloque de pensamiento sin cerrar (durante streaming)
      const razonamiento = contenidoDesdeThink
      segmentos.push({
        tipo: "razonamiento",
        contenido: razonamiento.trim(),
        enProgreso: isTyping,
      })
      break
    }
  }

  return segmentos
}

function RenderizadorTextoAsistente({
  texto,
  isTyping,
}: {
  texto: string
  isTyping: boolean
}) {
  const segmentos = parsearContenidoConRazonamiento(texto, isTyping)

  return (
    <div className="space-y-2">
      {segmentos.map((segmento, indice) => {
        if (segmento.tipo === "razonamiento") {
          if (!segmento.enProgreso && !segmento.contenido) return null

          return (
            <Reasoning
              key={`razonamiento-${indice}`}
              defaultOpen={segmento.enProgreso}
              isStreaming={segmento.enProgreso}
            >
              <ReasoningTrigger />
              <ReasoningContent>
                {segmento.contenido ||
                  "Analizando antecedentes clínicos, síntomas y diagnóstico diferencial..."}
              </ReasoningContent>
            </Reasoning>
          )
        }

        if (!segmento.contenido && !isTyping) return null

        return (
          <MarkdownEscritura
            key={`markdown-${indice}`}
            text={segmento.contenido}
            enabled={isTyping}
            className="prose prose-neutral max-w-none dark:prose-invert"
          />
        )
      })}
    </div>
  )
}

export function ContenidoMensaje({
  content,
  role,
  isTyping = false,
}: PropiedadesContenidoMensaje) {
  if (typeof content === "string") {
    if (role === "assistant") {
      return <RenderizadorTextoAsistente texto={content} isTyping={isTyping} />
    }
    return <p className="whitespace-pre-wrap">{content}</p>
  }

  if (Array.isArray(content)) {
    return (
      <div className="space-y-3">
        {content.map((parte, indice) => {
          if (parte.type === "text") {
            if (role === "assistant") {
              return (
                <RenderizadorTextoAsistente
                  key={indice}
                  texto={parte.text}
                  isTyping={isTyping}
                />
              )
            }
            return (
              <p key={indice} className="whitespace-pre-wrap">
                {parte.text}
              </p>
            )
          }

          if (parte.type === "image") {
            return (
              <div key={indice} className="relative max-w-sm">
                <div className="relative aspect-square w-full max-w-xs rounded-2xl overflow-hidden border border-border/70 shadow-xs">
                  <Image
                    src={parte.image}
                    alt="Imagen enviada"
                    fill
                    className="object-cover"
                    sizes="(max-width: 384px) 100vw, 384px"
                  />
                </div>
              </div>
            )
          }

          return null
        })}
      </div>
    )
  }

  return null
}

export { ContenidoMensaje as MessageContent }
