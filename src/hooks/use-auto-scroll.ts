/**
 * [LUIS] - 30/09/2025 Hook personalizado para auto-scroll del chat.
 * - Estado: ninguno; usa efectos para scroll automático en tiempo real.
 * - Busca contenedor scrolleable (.flex-1.overflow-y-auto) y hace scroll suave
 *   al bottom cuando cambian mensajes o contenido del último mensaje.
 * - Parámetros: hasMessages, messagesLength, isLoading, lastMessageContent
 *   para detectar cambios y activar scroll durante escritura del asistente.
 * - Usa requestAnimationFrame + scrollTo smooth para mejor rendimiento.
 */
import { useEffect } from "react";

export function useAutoScroll(hasMessages: boolean, messagesLength: number, isLoading: boolean, lastMessageContent?: string) {
  useEffect(() => {
    if (!hasMessages) return;
    
    const scrollContainer = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement;
    if (!scrollContainer) return;
    
    const scrollToBottom = () => {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    };
    
    const animationId = requestAnimationFrame(scrollToBottom);
    
    return () => cancelAnimationFrame(animationId);
  }, [hasMessages, messagesLength, isLoading, lastMessageContent]);
}