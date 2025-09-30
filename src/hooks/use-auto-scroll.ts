import { useEffect } from "react";

export function useAutoScroll(hasMessages: boolean, messagesLength: number, isLoading: boolean, lastMessageContent?: string) {
  useEffect(() => {
    if (!hasMessages) return;
    
    // Find the scrollable container (the chat content area)
    const scrollContainer = document.querySelector('.flex-1.overflow-y-auto') as HTMLElement;
    if (!scrollContainer) return;
    
    // Scroll to bottom smoothly
    const scrollToBottom = () => {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    };
    
    // Use requestAnimationFrame for better performance
    const animationId = requestAnimationFrame(scrollToBottom);
    
    return () => cancelAnimationFrame(animationId);
  }, [hasMessages, messagesLength, isLoading, lastMessageContent]);
}