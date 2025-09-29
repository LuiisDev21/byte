"use client";
import { EmptyState } from "@/components/empty-state";
import { ChatComposer } from "@/components/chat-composer";
import { useChat } from "@/hooks/use-chat";
import { Markdown } from "@/components/markdown";

export default function Home() {
  const chat = useChat();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    chat.send();
  };

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
      <div className="mx-auto w-full max-w-4xl flex-1 px-2 py-6">
        {chat.messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {chat.messages.map((m, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <p className="mb-1 text-xs text-muted-foreground">{m.role === "user" ? "Tú" : "Byte"}</p>
                {m.role === "assistant" ? (
                  <Markdown className="prose prose-neutral max-w-none dark:prose-invert">{m.content}</Markdown>
                ) : (
                  <div className="whitespace-pre-wrap leading-7">{m.content}</div>
                )}
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
