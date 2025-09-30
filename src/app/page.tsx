"use client";
import { useRef } from "react";
import { EmptyState } from "@/components/empty-state";
import { ChatComposer } from "@/components/chat-composer";
import { ChatMessages } from "@/components/chat-messages";
import { useChat } from "@/hooks/use-chat";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

export default function Home() {
  const chat = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasMessages = chat.messages.length > 0;

  useAutoScroll(hasMessages, chat.messages.length);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    chat.send();
  };

  const containerPadding = hasMessages 
    ? "calc(var(--composer-h) + env(safe-area-inset-bottom))" 
    : "0";

  return (
    <div className="flex min-h-dvh flex-col">
      <div
        ref={chatContainerRef}
        className="mx-auto w-full max-w-4xl px-2 py-6"
        style={{ paddingBottom: containerPadding }}
      >
        {hasMessages ? (
          <ChatMessages messages={chat.messages} isLoading={chat.isLoading} />
        ) : (
          <EmptyState />
        )}
      </div>
      
      <ChatComposer
        value={chat.input}
        onChange={chat.setInput}
        onSubmit={handleSubmit}
        disabled={chat.isLoading}
      />
    </div>
  );
}
