/**
 * Componente para renderizar mensajes individuales del chat con soporte multimedia y acciones.
 * - Renderizado basado en props (message, isLastMessage, isLoading, onRegenerate, onFeedback).
 * - MensajeChat(): contenedor principal con avatar, contenido y barra AccionesMensaje.
 * - AvatarAsistente(): círculo con imagen oficial de Bytti (/bytti.png).
 * - ContenidoMensaje: delega renderizado con soporte de <think> (Reasoning) y Markdown.
 */
import Image from "next/image"
import { ContenidoMensaje } from "@/CapaPresentacion/componentes/contenido-mensaje"
import { IndicadorEscritura } from "@/CapaPresentacion/componentes/indicador-escritura"
import { AccionesMensaje } from "@/CapaPresentacion/componentes/acciones-mensaje"
import { Mensaje } from "@/CapaDatos/tipos/mensaje"

interface PropiedadesMensajeChat {
  message: Mensaje
  isLastMessage: boolean
  isLoading: boolean
  onRegenerate?: () => void
  onFeedback?: (messageId: string, feedback: "like" | "dislike") => void
}

function extraerTextoPlano(contenido: Mensaje["content"]): string {
  if (typeof contenido === "string") {
    // Si contiene etiquetas de pensamiento, copiamos preferentemente la respuesta final limpia
    const textoSinThink = contenido.replace(/<think>[\s\S]*?<\/think>/g, "").trim()
    return textoSinThink || contenido
  }
  if (Array.isArray(contenido)) {
    return contenido
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text.replace(/<think>[\s\S]*?<\/think>/g, "").trim())
      .join("\n")
  }
  return ""
}

export function MensajeChat({
  message,
  isLastMessage,
  isLoading,
  onRegenerate,
  onFeedback,
}: PropiedadesMensajeChat) {
  const esAsistente = message.role === "assistant"
  const esUsuario = message.role === "user"
  const deberaMostrarEscritura = esAsistente && isLastMessage && isLoading

  return (
    <div
      className={`flex items-end gap-2.5 ${
        esUsuario ? "justify-end" : "justify-start"
      }`}
    >
      {esAsistente && <AvatarAsistente />}

      <div className="flex flex-col max-w-[85%] md:max-w-[80%]">
        <div
          className={`rounded-3xl px-4 py-3.5 shadow-xs transition-colors ${obtenerEstilosMensaje(
            esUsuario
          )}`}
        >
          {deberaMostrarEscritura && !message.content ? (
            <IndicadorEscritura />
          ) : (
            <ContenidoMensaje
              content={message.content}
              role={message.role}
              isTyping={deberaMostrarEscritura}
            />
          )}
        </div>

        {/* Acciones para mensajes del asistente al pie */}
        {esAsistente && !deberaMostrarEscritura && (
          <AccionesMensaje
            messageId={message.id}
            content={extraerTextoPlano(message.content)}
            onRegenerate={isLastMessage ? onRegenerate : undefined}
            onFeedback={onFeedback}
          />
        )}
      </div>
    </div>
  )
}

export function AvatarAsistente() {
  return (
    <div className="relative size-8 shrink-0 rounded-full overflow-hidden border border-border/70 shadow-xs self-end mb-1">
      <Image
        src="/bytti.png"
        alt="Byte Chat Asistente"
        fill
        className="object-cover"
        sizes="32px"
      />
    </div>
  )
}

function obtenerEstilosMensaje(esUsuario: boolean): string {
  return esUsuario
    ? "bg-primary text-primary-foreground rounded-br-md"
    : "border border-border bg-card text-card-foreground rounded-bl-md"
}

export { MensajeChat as ChatMessage }
