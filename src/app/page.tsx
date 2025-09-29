import { EmptyState } from "@/components/empty-state";
import { ChatComposer } from "@/components/chat-composer";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
      <EmptyState />
      <ChatComposer />
    </div>
  );
}
