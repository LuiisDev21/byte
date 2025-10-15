/**
 * Componente para renderizar el contenido de un mensaje (texto, imagen o multimodal)
 */
"use client"
import Image from "next/image"
import { MarkdownEscritura } from "@/CapaPresentacion/componentes/texto-escritura"
import type { ContenidoMensaje as TipoContenidoMensaje } from "@/CapaDatos/tipos/mensaje"

interface PropiedadesContenidoMensaje {
  content: TipoContenidoMensaje
  role: "user" | "assistant"
  isTyping?: boolean
}

export function ContenidoMensaje({ content, role, isTyping = false }: PropiedadesContenidoMensaje) {
  // Si el contenido es string, mostrarlo como texto simple
  if (typeof content === "string") {
    if (role === "assistant") {
      return (
        <MarkdownEscritura 
          text={content} 
          enabled={isTyping}
          className="prose prose-neutral max-w-none dark:prose-invert"
        />
      )
    }
    return <p className="whitespace-pre-wrap">{content}</p>
  }

  // Si el contenido es array, renderizar cada parte
  if (Array.isArray(content)) {
    return (
      <div className="space-y-3">
        {content.map((parte, indice) => {
          if (parte.type === "text") {
            if (role === "assistant") {
              return (
                <MarkdownEscritura 
                  key={indice}
                  text={parte.text} 
                  enabled={isTyping}
                  className="prose prose-neutral max-w-none dark:prose-invert"
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
                <div className="relative aspect-square w-full max-w-xs rounded-lg overflow-hidden border">
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
