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