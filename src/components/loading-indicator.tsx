import { TypingIndicator } from "@/components/typing-indicator";

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 justify-start" aria-live="polite" aria-atomic>
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <p className="text-sm font-bold">B</p>
      </div>
      <TypingIndicator />
    </div>
  );
}