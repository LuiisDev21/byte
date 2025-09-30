import { useEffect } from "react";

export function useAutoScroll(hasMessages: boolean, messagesLength: number) {
  useEffect(() => {
    if (!hasMessages) return;
    
    const scrollElement = document.scrollingElement || document.documentElement;
    const animationId = requestAnimationFrame(() => {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    });
    
    return () => cancelAnimationFrame(animationId);
  }, [hasMessages, messagesLength]);
}