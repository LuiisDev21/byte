/**
 * [LUIS] - 30/09/2025 Componente para renderizar mensajes individuales del chat con soporte multimedia.
 * - Estado: ninguno; renderizado basado en props (message, isLastMessage, isLoading).
 * - Tipos: Message con content string o array de TextContent/ImageContent.
 * - ChatMessage(): contenedor principal con avatar y contenido según rol.
 * - AssistantAvatar(): círculo con pata de perro para identificar al asistente.
 * - MessageContent: delega renderizado a componente especializado según tipo de contenido.
 * - API: { message: Message, isLastMessage: boolean, isLoading: boolean }.
 */
import { MessageContent } from "@/components/message-content";
import { TypingIndicator } from "@/components/typing-indicator";
import { PawPrint } from "lucide-react";

interface TextContent {
  type: "text"
  text: string
}

interface ImageContent {
  type: "image"
  image: string
}

type MessageContentType = string | (TextContent | ImageContent)[]

interface Message {
  id: string
  role: "user" | "assistant"
  content: MessageContentType
  timestamp: Date
}

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
  isLoading: boolean;
}

export function ChatMessage({ message, isLastMessage, isLoading }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const isUser = message.role === "user";
  const shouldShowTyping = isAssistant && isLastMessage && isLoading;

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {isAssistant && <AssistantAvatar />}
      
      <div className={`max-w-[85%] rounded-lg p-3 ${getMessageStyles(isUser)}`}>
        {shouldShowTyping && !message.content ? (
          <TypingIndicator />
        ) : (
          <MessageContent 
            content={message.content}
            role={message.role}
            isTyping={shouldShowTyping}
          />
        )}
      </div>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
      <PawPrint className="size-4" />
    </div>
  );
}



function getMessageStyles(isUser: boolean): string {
  return isUser
    ? "bg-primary text-primary-foreground"
    : "border bg-card";
}