"use client";
import { useEffect, useRef } from "react";
import { EmptyState } from "@/components/empty-state";
import { ChatComposer } from "@/components/chat-composer";
import { useChat } from "@/hooks/use-chat";
import { Markdown } from "@/components/markdown";
// Scroll control moved to main layout; no inner ScrollArea needed here

export default function Home() {
  const chat = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Desplaza el contenedor de scroll global (documento) al fondo
    const el = document.scrollingElement || document.documentElement;
    // Usar requestAnimationFrame para esperar layout
    const id = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    })
    return () => cancelAnimationFrame(id)
  }, [chat.messages])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    chat.send();
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <div
        ref={chatContainerRef}
        className="mx-auto w-full max-w-4xl px-2 py-6"
        style={{ paddingBottom: "calc(var(--composer-h) + env(safe-area-inset-bottom))" }}
      >
        {chat.messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {chat.messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <p className="text-sm font-bold">B</p>
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border bg-card"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <Markdown className="prose prose-neutral max-w-none dark:prose-invert">{m.content}</Markdown>
                  ) : (
                    <div className="whitespace-pre-wrap leading-7">{m.content}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ChatComposer
        value={chat.input}
        onChange={chat.setInput}
        onSubmit={onSubmit}
        disabled={chat.isLoading}
      />
    </div>
  );
}
