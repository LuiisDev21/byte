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
  const lastMessage = hasMessages ? chat.messages[chat.messages.length - 1] : null;

  useAutoScroll(
    hasMessages,
    chat.messages.length,
    chat.isLoading,
    lastMessage?.content
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    chat.send();
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Chat content area with proper scroll */}
      <div className="flex-1 overflow-y-auto">
        <div
          ref={chatContainerRef}
          className="mx-auto w-full max-w-4xl px-3 md:px-4 py-4 md:py-6 pb-6"
        >
          {hasMessages ? (
            <ChatMessages messages={chat.messages} isLoading={chat.isLoading} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Fixed composer at bottom */}
      <div className="flex-shrink-0">
        <ChatComposer
          value={chat.input}
          onChange={chat.setInput}
          onSubmit={handleSubmit}
          disabled={chat.isLoading}
        />
      </div>
    </div>
  );
}
