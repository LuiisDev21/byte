import { useEffect } from "react";

export function useAutoScroll(hasMessages: boolean, messagesLength: number) {
  useEffect(() => {
    if (!hasMessages) return;
    
    // Find the scrollable container (the chat content area)
    const scrollContainer = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement;
    if (!scrollContainer) return;
    
    const animationId = requestAnimationFrame(() => {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    });
    
    return () => cancelAnimationFrame(animationId);
  }, [hasMessages, messagesLength]);
}